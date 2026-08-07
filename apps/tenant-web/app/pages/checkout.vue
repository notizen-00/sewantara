<script setup lang="ts">
import dayjs from 'dayjs'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { ApiResponse, BookingQuote as ApiBookingQuote, Tenant } from '#shared/types'
import type { BookingQuote as StoredBookingQuote } from '~/stores/booking'

definePageMeta({
  pageTransition: { name: 'page', mode: 'out-in' },
})

useSeoMeta({
  title: 'Konfirmasi pesanan',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const bookingStore = useBookingStore()
const quoteId = computed(() => String(route.query.quote || ''))
const isRestoring = ref(true)
const restoreError = ref('')
const submitError = ref('')
const isSubmitting = ref(false)

const { data: tenantResponse } = await useFetch<ApiResponse<Tenant>>('/api/public/tenant', {
  key: 'checkout-tenant',
})

const tenant = computed(() => tenantResponse.value?.data)
const paymentMethods = computed(() => tenant.value?.paymentMethods.filter(method => method.enabled) || [])
const quote = computed(() => bookingStore.quote)
const selection = computed(() => bookingStore.selection)

const schema = toTypedSchema(z.object({
  name: z.string().trim().min(3, 'Nama lengkap minimal 3 karakter.').max(100),
  phone: z.string().trim()
    .min(9, 'Masukkan nomor WhatsApp yang aktif.')
    .max(18, 'Nomor WhatsApp terlalu panjang.')
    .regex(/^(?:\+62|62|0)8[1-9][0-9]{6,12}$/, 'Gunakan format nomor Indonesia yang valid.'),
  email: z.string().trim().email('Masukkan alamat email yang valid.'),
  paymentMethodId: z.string().min(1, 'Pilih metode pembayaran.'),
  agreement: z.boolean().refine(value => value, 'Anda perlu menyetujui syarat pemesanan.'),
}))

const { errors, defineField, handleSubmit, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    phone: '',
    email: '',
    paymentMethodId: '',
    agreement: false,
  },
})

const [name, nameAttrs] = defineField('name')
const [phone, phoneAttrs] = defineField('phone')
const [email, emailAttrs] = defineField('email')
const [paymentMethodId] = defineField('paymentMethodId')
const [agreement, agreementAttrs] = defineField('agreement')

const quoteRemainingLabel = computed(() => {
  if (!quote.value?.expiresAt) return ''
  const minutes = Math.max(0, dayjs(quote.value.expiresAt).diff(dayjs(), 'minute'))
  return minutes > 0 ? `Harga berlaku sekitar ${minutes} menit lagi` : 'Quote perlu diperbarui'
})

function toStoredQuote(apiQuote: ApiBookingQuote): StoredBookingQuote {
  return {
    quoteId: apiQuote.quoteId,
    expiresAt: apiQuote.expiresAt,
    currency: apiQuote.total.currency,
    subtotal: apiQuote.subtotal.amount,
    discount: apiQuote.discount.amount,
    serviceFee: apiQuote.serviceFee.amount,
    tax: apiQuote.tax.amount,
    deposit: apiQuote.product.price.deposit?.amount || 0,
    total: apiQuote.total.amount,
    lines: apiQuote.lineItems.map(line => ({
      key: line.id,
      label: line.label,
      amount: line.total.amount,
      type: line.type === 'discount' ? 'discount' : 'charge',
    })),
  }
}

async function restoreQuote() {
  bookingStore.hydrate()

  if (bookingStore.quote?.quoteId === quoteId.value && bookingStore.selection) {
    isRestoring.value = false
    return
  }

  if (!quoteId.value) {
    isRestoring.value = false
    return
  }

  try {
    const response = await $fetch<ApiResponse<ApiBookingQuote>>(`/api/booking/quote/${encodeURIComponent(quoteId.value)}`)
    const apiQuote = response.data
    bookingStore.setDraft({
      productId: apiQuote.product.id,
      productSlug: apiQuote.product.slug,
      productName: apiQuote.product.name,
      productImage: apiQuote.product.images[0]?.url || '',
      pricingUnit: apiQuote.product.price.unitLabel,
      startDate: apiQuote.selection.startDate,
      endDate: apiQuote.selection.endDate || apiQuote.selection.startDate,
      startTime: apiQuote.selection.startTime || '',
      duration: apiQuote.selection.duration,
      quantity: apiQuote.selection.quantity,
      extraServiceIds: apiQuote.selection.extraServiceIds,
      couponCode: apiQuote.selection.couponCode || '',
      notes: apiQuote.selection.notes || '',
    }, toStoredQuote(apiQuote))
  }
  catch {
    restoreError.value = 'Ringkasan harga tidak dapat dipulihkan atau sudah kedaluwarsa. Silakan atur ulang jadwal.'
  }
  finally {
    isRestoring.value = false
  }
}

onMounted(restoreQuote)

function choosePayment(id: string) {
  setFieldValue('paymentMethodId', id, true)
}

const submitBooking = handleSubmit(async (values) => {
  if (!quote.value) return
  submitError.value = ''
  isSubmitting.value = true

  try {
    const payload = await $fetch<any>('/api/booking', {
      method: 'POST',
      // Key stabil per quote: retry setelah timeout tidak membuat booking kedua.
      headers: { 'Idempotency-Key': bookingStore.getIdempotencyKey() },
      body: {
        quoteId: quote.value.quoteId,
        customer: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim().toLowerCase(),
        },
        paymentMethodId: values.paymentMethodId,
        agreement: {
          accepted: values.agreement,
          version: tenant.value?.configVersion || '2026-08',
          acceptedAt: new Date().toISOString(),
        },
      },
    })

    const result = payload?.data || payload
    const booking = result?.booking || result
    if (!booking?.code) throw new Error('Kode booking tidak tersedia.')

    const instruction = booking.paymentInstruction
    bookingStore.setBooking({
      bookingCode: booking.code,
      bookingStatus: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentToken: booking.paymentToken,
      payment: instruction
        ? {
            method: booking.paymentMethod?.id || values.paymentMethodId,
            label: booking.paymentMethod?.name || instruction.title,
            amount: quote.value.total,
            expiresAt: instruction.expiresAt,
            virtualAccount: instruction.accountNumber,
            instructions: instruction.description ? [instruction.description] : [],
            redirectUrl: instruction.redirectUrl,
          }
        : undefined,
    }, values.email.trim().toLowerCase())

    await navigateTo({
      path: '/payment/waiting',
      query: {
        booking: booking.code,
        ...(booking.paymentToken ? { token: booking.paymentToken } : {}),
      },
    })
  }
  catch (caught: any) {
    const statusCode = Number(caught?.statusCode || caught?.status || caught?.response?.status || 0)
    // Respons 4xx bersifat definitif; koreksi form berikutnya harus memakai key baru.
    // Timeout/network/5xx mempertahankan key agar retry tetap idempoten.
    if (statusCode >= 400 && statusCode < 500 && statusCode !== 409) {
      bookingStore.rotateIdempotencyKey()
    }
    submitError.value = caught?.data?.error?.message
      || caught?.data?.statusMessage
      || 'Pesanan belum berhasil dibuat. Tidak ada pembayaran yang diproses; silakan coba lagi.'
  }
  finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <main class="checkout-page">
    <div class="container-shell">
      <BookingSteps :current="2" />

      <div v-if="isRestoring" class="checkout-loading" aria-live="polite">
        <div class="skeleton loading-title" ></div>
        <div class="skeleton loading-card" ></div>
      </div>

      <section v-else-if="!quote || !selection || restoreError" class="state-card surface-card">
        <UiIcon name="clock" :size="34" />
        <h1>Ringkasan perlu diperbarui</h1>
        <p>{{ restoreError || 'Pilih produk dan jadwal terlebih dahulu sebelum mengonfirmasi pesanan.' }}</p>
        <NuxtLink :to="selection ? `/booking?product=${selection.productSlug}` : '/catalog'" class="button-primary">
          {{ selection ? 'Atur ulang jadwal' : 'Lihat katalog' }}
        </NuxtLink>
      </section>

      <form v-else class="checkout-grid" novalidate @submit="submitBooking">
        <section class="checkout-form" aria-labelledby="checkout-title">
          <p class="section-kicker">Langkah 2 dari 3</p>
          <h1 id="checkout-title">Konfirmasi pesanan</h1>
          <p class="checkout-intro">Pastikan informasi di bawah benar. Konfirmasi dan instruksi pembayaran akan dikirim ke kontak Anda.</p>

          <div class="form-panel surface-card">
            <div class="panel-heading">
              <span><UiIcon name="user" :size="20" /></span>
              <div><h2>Informasi pelanggan</h2><p>Data digunakan hanya untuk pesanan ini.</p></div>
            </div>

            <div class="fields-grid">
              <div class="field-group field-full">
                <label class="form-label" for="customer-name">Nama lengkap</label>
                <input id="customer-name" v-model="name" v-bind="nameAttrs" class="form-control" type="text" autocomplete="name" placeholder="Nama sesuai identitas" :aria-invalid="!!errors.name" :aria-describedby="errors.name ? 'name-error' : undefined"/>
                <p v-if="errors.name" id="name-error" class="form-error">{{ errors.name }}</p>
              </div>
              <div class="field-group">
                <label class="form-label" for="customer-phone">Nomor WhatsApp</label>
                <input id="customer-phone" v-model="phone" v-bind="phoneAttrs" class="form-control" type="tel" inputmode="tel" autocomplete="tel" placeholder="08xxxxxxxxxx" :aria-invalid="!!errors.phone" :aria-describedby="errors.phone ? 'phone-error' : undefined"/>
                <p v-if="errors.phone" id="phone-error" class="form-error">{{ errors.phone }}</p>
              </div>
              <div class="field-group">
                <label class="form-label" for="customer-email">Email</label>
                <input id="customer-email" v-model="email" v-bind="emailAttrs" class="form-control" type="email" inputmode="email" autocomplete="email" placeholder="nama@email.com" :aria-invalid="!!errors.email" :aria-describedby="errors.email ? 'email-error' : undefined"/>
                <p v-if="errors.email" id="email-error" class="form-error">{{ errors.email }}</p>
              </div>
            </div>
          </div>

          <div class="form-panel surface-card">
            <div class="panel-heading">
              <span><UiIcon name="wallet" :size="20" /></span>
              <div><h2>Metode pembayaran</h2><p>Pilih salah satu metode yang tersedia.</p></div>
            </div>

            <div v-if="paymentMethods.length" class="payment-list" role="radiogroup" aria-label="Metode pembayaran">
              <button
                v-for="method in paymentMethods"
                :key="method.id"
                class="payment-option"
                :class="{ selected: paymentMethodId === method.id }"
                type="button"
                role="radio"
                :aria-checked="paymentMethodId === method.id"
                @click="choosePayment(method.id)"
              >
                <span class="payment-icon"><UiIcon :name="method.type === 'qris' ? 'qr-code' : method.type === 'ewallet' ? 'smartphone' : 'bank'" :size="21" /></span>
                <span class="payment-copy"><strong>{{ method.name }}</strong><small>{{ method.description }}</small></span>
                <span v-if="method.feeLabel" class="payment-fee">{{ method.feeLabel }}</span>
                <span class="radio-dot" aria-hidden="true" ></span>
              </button>
            </div>
            <p v-else class="payment-empty">Metode pembayaran sedang tidak tersedia. Hubungi tenant untuk bantuan.</p>
            <p v-if="errors.paymentMethodId" class="form-error">{{ errors.paymentMethodId }}</p>
          </div>

          <label class="agreement-card" :class="{ invalid: errors.agreement }">
            <input v-model="agreement" v-bind="agreementAttrs" type="checkbox" :aria-invalid="!!errors.agreement"/>
            <span>
              Saya telah memeriksa jadwal dan menyetujui
              <a :href="tenant?.termsUrl || '#'" target="_blank" rel="noopener">syarat pemesanan</a>,
              <a :href="tenant?.cancellationPolicyUrl || '#'" target="_blank" rel="noopener">kebijakan pembatalan</a>,
              serta pemrosesan data sesuai <a :href="tenant?.privacyUrl || '#'" target="_blank" rel="noopener">kebijakan privasi</a>.
              <small v-if="errors.agreement" class="form-error">{{ errors.agreement }}</small>
            </span>
          </label>
        </section>

        <aside class="order-summary surface-card" aria-label="Ringkasan pembayaran">
          <div class="summary-heading">
            <h2>Ringkasan</h2>
            <span>{{ quoteRemainingLabel }}</span>
          </div>

          <div class="summary-product">
            <NuxtImg v-if="selection.productImage" :src="selection.productImage" :alt="selection.productName" width="160" height="120" format="webp" />
            <div><strong>{{ selection.productName }}</strong><small>{{ selection.startDate }}<template v-if="selection.endDate !== selection.startDate"> – {{ selection.endDate }}</template> • {{ selection.quantity }} unit</small></div>
          </div>

          <dl class="price-lines">
            <div v-for="line in quote.lines" :key="line.key">
              <dt>{{ line.label }}</dt>
              <dd :class="{ discount: line.type === 'discount' }"><PriceDisplay :amount="line.type === 'discount' ? -Math.abs(line.amount) : line.amount" compact /></dd>
            </div>
            <div v-if="!quote.lines.length"><dt>Subtotal</dt><dd><PriceDisplay :amount="quote.subtotal" compact /></dd></div>
            <div v-if="quote.discount && !quote.lines.some(line => line.type === 'discount')"><dt>Diskon</dt><dd class="discount"><PriceDisplay :amount="-quote.discount" compact /></dd></div>
            <div v-if="quote.serviceFee"><dt>Biaya layanan</dt><dd><PriceDisplay :amount="quote.serviceFee" compact /></dd></div>
            <div v-if="quote.tax"><dt>Pajak</dt><dd><PriceDisplay :amount="quote.tax" compact /></dd></div>
            <div v-if="quote.deposit"><dt>Deposit</dt><dd><PriceDisplay :amount="quote.deposit" compact /></dd></div>
          </dl>

          <div class="total-row">
            <span>Total pembayaran</span>
            <PriceDisplay :amount="quote.total" />
          </div>

          <div v-if="submitError" class="alert-error" role="alert"><UiIcon name="alert-circle" :size="19" /><p>{{ submitError }}</p></div>

          <button class="button-primary button-block" type="submit" :disabled="isSubmitting || !paymentMethods.length">
            <span v-if="isSubmitting" class="button-spinner" aria-hidden="true" ></span>
            {{ isSubmitting ? 'Membuat pesanan…' : 'Konfirmasi & lanjut bayar' }}
            <UiIcon v-if="!isSubmitting" name="lock" :size="17" />
          </button>
          <p class="secure-note"><UiIcon name="shield-check" :size="15" /> Transaksi diproses melalui koneksi aman.</p>
        </aside>
      </form>
    </div>
  </main>
</template>

<style scoped>
.checkout-page { min-height: 80vh; padding: 38px 0 110px; background: #f7faf8; }
.checkout-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(340px, .75fr); gap: 42px; align-items: start; margin-top: 46px; }
.checkout-form > h1 { margin: 0; font-family: var(--font-heading); font-size: clamp(2.15rem, 4vw, 3.5rem); letter-spacing: -.05em; line-height: 1.06; }
.checkout-intro { max-width: 650px; margin: 15px 0 32px; color: var(--color-muted); }
.form-panel { margin-bottom: 18px; padding: 25px; }
.panel-heading { display: flex; gap: 13px; align-items: center; margin-bottom: 22px; }
.panel-heading > span { display: grid; width: 42px; height: 42px; flex: 0 0 auto; place-items: center; border-radius: 13px; color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 8%, white); }
.panel-heading h2 { margin: 0; font-size: 1.05rem; }
.panel-heading p { margin: 2px 0 0; color: var(--color-muted); font-size: .78rem; }
.fields-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.field-full { grid-column: 1 / -1; }
.payment-list { display: grid; gap: 10px; }
.payment-option { display: grid; grid-template-columns: 42px 1fr auto 18px; gap: 12px; align-items: center; min-height: 70px; border: 1px solid var(--color-line); border-radius: 14px; padding: 11px 14px; text-align: left; background: white; transition: border-color 160ms, background 160ms; }
.payment-option:hover { border-color: color-mix(in srgb, var(--color-primary) 35%, var(--color-line)); }
.payment-option.selected { border-color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 4%, white); }
.payment-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 12px; color: var(--color-primary); background: var(--color-soft); }
.payment-copy strong, .payment-copy small { display: block; }
.payment-copy strong { font-size: .88rem; }
.payment-copy small { margin-top: 2px; color: var(--color-muted); font-size: .72rem; }
.payment-fee { color: var(--color-muted); font-size: .68rem; }
.radio-dot { width: 17px; height: 17px; border: 1.5px solid #a9b5b1; border-radius: 50%; box-shadow: inset 0 0 0 4px white; }
.selected .radio-dot { border-color: var(--color-primary); background: var(--color-primary); }
.payment-empty { color: var(--color-muted); font-size: .85rem; }
.agreement-card { display: flex; gap: 12px; align-items: flex-start; border: 1px solid var(--color-line); border-radius: 15px; padding: 16px; font-size: .82rem; background: white; cursor: pointer; }
.agreement-card.invalid { border-color: #e46d63; }
.agreement-card input { width: 18px; height: 18px; flex: 0 0 auto; margin-top: 2px; accent-color: var(--color-primary); }
.agreement-card a { color: var(--color-primary); font-weight: 650; text-decoration: underline; text-underline-offset: 2px; }
.agreement-card small { display: block; }
.order-summary { position: sticky; top: 104px; padding: 21px; }
.summary-heading { display: flex; gap: 12px; align-items: start; justify-content: space-between; }
.summary-heading h2 { margin: 0; font-size: 1.08rem; }
.summary-heading span { color: var(--color-primary); font-size: .65rem; font-weight: 700; text-align: right; }
.summary-product { display: grid; grid-template-columns: 82px 1fr; gap: 12px; align-items: center; margin: 18px 0; border-radius: 14px; padding: 10px; background: var(--color-soft); }
.summary-product img { width: 82px; height: 68px; border-radius: 10px; object-fit: cover; }
.summary-product strong, .summary-product small { display: block; }
.summary-product strong { font-size: .84rem; }
.summary-product small { margin-top: 4px; color: var(--color-muted); font-size: .68rem; }
.price-lines { margin: 19px 0; padding: 16px 0; border-block: 1px dashed var(--color-line); }
.price-lines > div { display: flex; gap: 20px; justify-content: space-between; margin: 8px 0; }
.price-lines dt, .price-lines dd { font-size: .78rem; }
.price-lines dt { color: var(--color-muted); }
.price-lines dd { margin: 0; text-align: right; }
.price-lines .discount { color: #16825f; }
.total-row { display: flex; gap: 15px; align-items: center; justify-content: space-between; margin-bottom: 19px; }
.total-row > span { font-size: .83rem; font-weight: 750; }
.secure-note { display: flex; gap: 5px; align-items: center; justify-content: center; margin: 10px 0 0; color: var(--color-muted); font-size: .68rem; }
.alert-error { display: flex; gap: 9px; margin: 0 0 14px; border-radius: 12px; padding: 11px 12px; color: #8a1c14; background: #fff0ee; }
.alert-error svg { flex: 0 0 auto; margin-top: 2px; }
.alert-error p { margin: 0; font-size: .76rem; }
.button-primary:disabled { cursor: wait; opacity: .65; transform: none; }
.button-spinner { width: 17px; height: 17px; border: 2px solid rgb(255 255 255 / 35%); border-top-color: white; border-radius: 50%; animation: spin .7s linear infinite; }
.checkout-loading { padding-top: 80px; }
.loading-title { width: 45%; height: 54px; border-radius: 14px; }
.loading-card { width: 100%; height: 480px; margin-top: 35px; border-radius: 24px; }
.state-card { max-width: 620px; margin: 90px auto; padding: 48px; text-align: center; }
.state-card > svg { color: var(--color-primary); }
.state-card h1 { margin: 15px 0 9px; font-size: 1.7rem; }
.state-card p { margin: 0 auto 24px; color: var(--color-muted); }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 940px) {
  .checkout-grid { grid-template-columns: 1fr; gap: 22px; }
  .order-summary { position: static; }
}
@media (max-width: 600px) {
  .checkout-page { padding-top: 24px; }
  .checkout-grid { margin-top: 28px; }
  .form-panel { padding: 20px 16px; }
  .fields-grid { grid-template-columns: 1fr; }
  .field-full { grid-column: auto; }
  .payment-option { grid-template-columns: 38px 1fr 16px; }
  .payment-fee { display: none; }
  .state-card { padding: 32px 20px; }
}
</style>

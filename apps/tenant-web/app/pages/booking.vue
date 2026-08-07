<script setup lang="ts">
import dayjs from 'dayjs'
import { z } from 'zod'

definePageMeta({
  pageTransition: { name: 'page', mode: 'out-in' },
})

useSeoMeta({
  title: 'Atur pemesanan',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const bookingStore = useBookingStore()
const slug = computed(() => String(route.query.product || ''))

const { data: response, status, error, refresh } = await useAsyncData(
  () => `booking-product:${slug.value}`,
  async () => {
    if (!slug.value) return null
    return await $fetch<Record<string, any>>(`/api/public/catalog/${encodeURIComponent(slug.value)}`)
  },
  { watch: [slug] },
)

const rawProduct = computed<Record<string, any> | null>(() => {
  const payload = response.value as any
  return payload?.data?.product || payload?.data || payload?.product || payload || null
})

const product = computed(() => {
  const value = rawProduct.value
  if (!value) return null

  const firstImage = value.images?.[0]
  const pricing = value.pricing || value.price || {}

  return {
    id: String(value.id || value.slug || ''),
    slug: String(value.slug || slug.value),
    name: String(value.name || value.title || 'Produk'),
    image: typeof firstImage === 'string' ? firstImage : firstImage?.url || value.image || '',
    imageAlt: typeof firstImage === 'object' ? firstImage?.alt : value.name || 'Foto produk',
    location: value.locations?.[0]?.name || value.location?.name || value.location || '',
    bookingMode: value.bookingMode || value.booking?.mode || 'date_range',
    bookingRules: value.bookingRules || value.booking?.rules || {},
    pricingUnit: pricing.unitLabel || pricing.unit || value.pricingUnit || 'hari',
    displayPrice: Number(pricing.base?.amount ?? pricing.amount ?? value.priceAmount ?? 0),
    extraServices: value.extraServices || value.addOns || [],
  }
})

function queryText(name: string): string {
  const value = route.query[name]
  return typeof value === 'string' ? value : ''
}

function queryDate(name: string): string {
  const value = queryText(name)
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ''
}

function queryPositiveInt(name: string, fallback: number): number {
  const value = Number(queryText(name))
  return Number.isInteger(value) && value > 0 ? value : fallback
}

const form = reactive({
  startDate: queryDate('startDate'),
  endDate: queryDate('endDate'),
  startTime: /^\d{2}:\d{2}$/.test(queryText('startTime')) ? queryText('startTime') : '',
  duration: queryPositiveInt('duration', 1),
  quantity: queryPositiveInt('quantity', 1),
  extraServiceIds: [] as string[],
  couponCode: '',
  notes: '',
})

const validationErrors = ref<Record<string, string>>({})
const quoteError = ref('')
const isQuoting = ref(false)
const minDate = dayjs().format('YYYY-MM-DD')

const isTimeBased = computed(() => ['hourly', 'time_slot'].includes(product.value?.bookingMode || ''))
const needsEndDate = computed(() => ['date_range', 'daily'].includes(product.value?.bookingMode || ''))
const quantityMax = computed(() => Number(product.value?.bookingRules?.maxQuantity || 10))
const durationMin = computed(() => Number(product.value?.bookingRules?.minDuration || 1))
const durationMax = computed(() => Number(product.value?.bookingRules?.maxDuration || 24))

const scheduleSummary = computed(() => {
  if (!form.startDate) return 'Belum ada jadwal dipilih'

  const date = dayjs(form.startDate).format('D MMM YYYY')
  if (isTimeBased.value) {
    return `${date}${form.startTime ? ` • ${form.startTime}` : ''} • ${form.duration} ${product.value?.pricingUnit || 'jam'}`
  }

  if (needsEndDate.value && form.endDate) {
    return `${date} – ${dayjs(form.endDate).format('D MMM YYYY')}`
  }
  return date
})

watch(() => form.startDate, (startDate) => {
  if (needsEndDate.value && startDate && (!form.endDate || form.endDate < startDate)) {
    form.endDate = startDate
  }
})

onMounted(() => {
  bookingStore.hydrate()
  // Pilihan eksplisit pada URL menang atas draft lama agar deep-link detail produk stabil.
  if (!form.startDate && bookingStore.selection?.productSlug === slug.value) {
    Object.assign(form, {
      startDate: bookingStore.selection.startDate,
      endDate: bookingStore.selection.endDate,
      startTime: bookingStore.selection.startTime,
      duration: bookingStore.selection.duration,
      quantity: bookingStore.selection.quantity,
      extraServiceIds: [...bookingStore.selection.extraServiceIds],
      couponCode: bookingStore.selection.couponCode,
      notes: bookingStore.selection.notes,
    })
  }
})

function toggleExtra(id: string) {
  const index = form.extraServiceIds.indexOf(id)
  if (index >= 0) form.extraServiceIds.splice(index, 1)
  else form.extraServiceIds.push(id)
}

function normaliseQuote(payload: any): import('~/stores/booking').BookingQuote {
  const quote = payload?.data || payload
  const breakdown = quote?.breakdown || quote?.price || quote || {}
  const lines = quote?.lineItems || quote?.lines || breakdown?.lines || []
  const moneyAmount = (value: any) => Number(value?.amount ?? value ?? 0)
  const subtotal = moneyAmount(breakdown.subtotal ?? quote.subtotal)
  const discount = moneyAmount(breakdown.discount ?? quote.discount)
  const serviceFee = moneyAmount(breakdown.serviceFee ?? quote.serviceFee)
  const tax = moneyAmount(breakdown.tax ?? quote.tax)
  const deposit = moneyAmount(breakdown.deposit ?? quote.deposit)
  const computedTotal = subtotal - discount + serviceFee + tax + deposit

  return {
    quoteId: String(quote.quoteId || quote.id || ''),
    expiresAt: String(quote.expiresAt || dayjs().add(15, 'minute').toISOString()),
    currency: String(quote.currency || 'IDR'),
    subtotal,
    discount,
    serviceFee,
    tax,
    deposit,
    total: moneyAmount(breakdown.total ?? quote.total ?? computedTotal),
    lines: Array.isArray(lines)
      ? lines.map((line: any, index: number) => ({
          key: String(line.key || index),
          label: String(line.label || line.name || 'Biaya'),
          amount: moneyAmount(line.total ?? line.amount),
          type: line.type === 'discount' ? 'discount' : 'charge',
        }))
      : [],
  }
}

async function requestQuote() {
  quoteError.value = ''
  validationErrors.value = {}

  const schema = z.object({
    startDate: z.string().min(1, 'Pilih tanggal mulai.'),
    endDate: needsEndDate.value ? z.string().min(1, 'Pilih tanggal selesai.') : z.string().optional(),
    startTime: isTimeBased.value ? z.string().min(1, 'Pilih waktu mulai.') : z.string().optional(),
    duration: z.number().min(durationMin.value).max(durationMax.value),
    quantity: z.number().int().min(1).max(quantityMax.value),
    notes: z.string().max(500, 'Catatan maksimal 500 karakter.'),
  })

  const result = schema.safeParse(form)
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] || 'form')
      if (!validationErrors.value[key]) validationErrors.value[key] = issue.message
    }
    return
  }

  if (form.endDate && form.endDate < form.startDate) {
    validationErrors.value.endDate = 'Tanggal selesai tidak boleh sebelum tanggal mulai.'
    return
  }

  if (!product.value) return
  isQuoting.value = true

  try {
    const quotePayload = await $fetch('/api/booking/quote', {
      method: 'POST',
      body: {
        productSlug: product.value.slug,
        startDate: form.startDate,
        endDate: needsEndDate.value ? form.endDate : form.startDate,
        startTime: isTimeBased.value ? form.startTime : undefined,
        duration: form.duration,
        quantity: form.quantity,
        extraServiceIds: form.extraServiceIds,
        couponCode: form.couponCode.trim() || undefined,
        notes: form.notes.trim() || undefined,
      },
    })

    const quote = normaliseQuote(quotePayload)
    if (!quote.quoteId) throw new Error('Quote ID tidak tersedia.')

    bookingStore.setDraft({
      productId: product.value.id,
      productSlug: product.value.slug,
      productName: product.value.name,
      productImage: product.value.image,
      pricingUnit: product.value.pricingUnit,
      startDate: form.startDate,
      endDate: needsEndDate.value ? form.endDate : form.startDate,
      startTime: form.startTime,
      duration: form.duration,
      quantity: form.quantity,
      extraServiceIds: [...form.extraServiceIds],
      couponCode: form.couponCode.trim(),
      notes: form.notes.trim(),
    }, quote)

    await navigateTo({ path: '/checkout', query: { quote: quote.quoteId } })
  }
  catch (caught: any) {
    quoteError.value = caught?.data?.statusMessage
      || caught?.data?.message
      || 'Jadwal belum dapat dikonfirmasi. Periksa pilihan Anda lalu coba lagi.'
  }
  finally {
    isQuoting.value = false
  }
}
</script>

<template>
  <main class="booking-page">
    <div class="container-shell">
      <BookingSteps :current="1" />

      <div v-if="status === 'pending'" class="booking-loading" aria-live="polite">
        <div class="skeleton loading-title" ></div>
        <div class="skeleton loading-card" ></div>
      </div>

      <section v-else-if="error || !slug" class="state-card surface-card">
        <UiIcon name="calendar-x" :size="34" />
        <h1>Konteks pemesanan belum tersedia</h1>
        <p>Pilih produk terlebih dahulu agar kami dapat menyiapkan jadwal yang sesuai.</p>
        <div class="state-actions">
          <NuxtLink to="/catalog" class="button-primary">Pilih dari katalog</NuxtLink>
          <button v-if="slug" class="button-secondary" type="button" @click="refresh()">Coba lagi</button>
        </div>
      </section>

      <div v-else-if="product" class="booking-grid">
        <section class="booking-form" aria-labelledby="booking-title">
          <p class="section-kicker">Langkah 1 dari 3</p>
          <h1 id="booking-title">Atur jadwal pemesanan</h1>
          <p class="booking-intro">Pilih jadwal dan opsi yang dibutuhkan. Harga serta ketersediaan akan dikonfirmasi oleh sistem sebelum lanjut.</p>

          <div class="form-section">
            <div class="form-section__heading">
              <span>01</span>
              <div>
                <h2>Jadwal penggunaan</h2>
                <p>Semua waktu mengikuti zona waktu lokasi tenant.</p>
              </div>
            </div>

            <div class="fields-grid">
              <div class="field-group">
                <label class="form-label" for="start-date">{{ needsEndDate ? 'Tanggal mulai' : 'Tanggal' }}</label>
                <input id="start-date" v-model="form.startDate" class="form-control" type="date" :min="minDate" :aria-describedby="validationErrors.startDate ? 'start-error' : undefined"/>
                <p v-if="validationErrors.startDate" id="start-error" class="form-error">{{ validationErrors.startDate }}</p>
              </div>

              <div v-if="needsEndDate" class="field-group">
                <label class="form-label" for="end-date">Tanggal selesai</label>
                <input id="end-date" v-model="form.endDate" class="form-control" type="date" :min="form.startDate || minDate" :aria-describedby="validationErrors.endDate ? 'end-error' : undefined"/>
                <p v-if="validationErrors.endDate" id="end-error" class="form-error">{{ validationErrors.endDate }}</p>
              </div>

              <div v-if="isTimeBased" class="field-group">
                <label class="form-label" for="start-time">Waktu mulai</label>
                <input id="start-time" v-model="form.startTime" class="form-control" type="time" step="1800" :aria-describedby="validationErrors.startTime ? 'time-error' : undefined"/>
                <p v-if="validationErrors.startTime" id="time-error" class="form-error">{{ validationErrors.startTime }}</p>
              </div>

              <div v-if="isTimeBased" class="field-group">
                <label class="form-label" for="duration">Durasi ({{ product.pricingUnit }})</label>
                <select id="duration" v-model.number="form.duration" class="form-control">
                  <option v-for="value in durationMax - durationMin + 1" :key="value" :value="value + durationMin - 1">
                    {{ value + durationMin - 1 }} {{ product.pricingUnit }}
                  </option>
                </select>
              </div>

              <div class="field-group quantity-field">
                <span class="form-label">Jumlah</span>
                <div class="quantity-control" role="group" aria-label="Atur jumlah produk">
                  <button type="button" :disabled="form.quantity <= 1" aria-label="Kurangi jumlah" @click="form.quantity--">−</button>
                  <output aria-live="polite">{{ form.quantity }}</output>
                  <button type="button" :disabled="form.quantity >= quantityMax" aria-label="Tambah jumlah" @click="form.quantity++">+</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="product.extraServices.length" class="form-section">
            <div class="form-section__heading">
              <span>02</span>
              <div>
                <h2>Layanan tambahan</h2>
                <p>Pilih hanya yang benar-benar Anda butuhkan.</p>
              </div>
            </div>

            <div class="extras-grid">
              <button
                v-for="extra in product.extraServices"
                :key="extra.id"
                class="extra-card"
                :class="{ selected: form.extraServiceIds.includes(String(extra.id)) }"
                type="button"
                :aria-pressed="form.extraServiceIds.includes(String(extra.id))"
                @click="toggleExtra(String(extra.id))"
              >
                <span class="extra-check"><UiIcon name="check" :size="15" /></span>
                <span>
                  <strong>{{ extra.name }}</strong>
                  <small>{{ extra.description }}</small>
                </span>
                <PriceDisplay :amount="Number(extra.price?.amount ?? extra.amount ?? 0)" :unit="extra.price?.unit || extra.unit" compact />
              </button>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section__heading">
              <span>{{ product.extraServices.length ? '03' : '02' }}</span>
              <div>
                <h2>Detail tambahan</h2>
                <p>Kupon akan diverifikasi bersama harga terbaru.</p>
              </div>
            </div>

            <div class="fields-grid">
              <div class="field-group">
                <label class="form-label" for="coupon">Kode kupon <em>Opsional</em></label>
                <input id="coupon" v-model.trim="form.couponCode" class="form-control" type="text" maxlength="30" autocomplete="off" placeholder="Contoh: SEWAHEMAT"/>
              </div>
              <div class="field-group field-full">
                <label class="form-label" for="notes">Catatan untuk tenant <em>Opsional</em></label>
                <textarea id="notes" v-model="form.notes" class="form-control" maxlength="500" placeholder="Tulis kebutuhan khusus, detail pengambilan, atau pertanyaan Anda." ></textarea>
                <div class="character-count">{{ form.notes.length }}/500</div>
              </div>
            </div>
          </div>
        </section>

        <aside class="summary-card surface-card" aria-label="Ringkasan produk">
          <div class="summary-product">
            <NuxtImg v-if="product.image" :src="product.image" :alt="product.imageAlt" width="180" height="140" format="webp" loading="eager" />
            <div class="summary-product__copy">
              <span>Pilihan Anda</span>
              <h2>{{ product.name }}</h2>
              <p v-if="product.location"><UiIcon name="map-pin" :size="16" /> {{ product.location }}</p>
            </div>
          </div>

          <dl class="summary-details">
            <div>
              <dt>Jadwal</dt>
              <dd>{{ scheduleSummary }}</dd>
            </div>
            <div>
              <dt>Jumlah</dt>
              <dd>{{ form.quantity }} unit</dd>
            </div>
            <div v-if="form.extraServiceIds.length">
              <dt>Tambahan</dt>
              <dd>{{ form.extraServiceIds.length }} layanan</dd>
            </div>
          </dl>

          <div class="price-notice">
            <UiIcon name="shield-check" :size="20" />
            <p><strong>Harga transparan</strong><br/>Rincian final dihitung aman oleh server setelah jadwal dikonfirmasi.</p>
          </div>

          <div v-if="quoteError" class="alert-error" role="alert">
            <UiIcon name="alert-circle" :size="19" />
            <p>{{ quoteError }}</p>
          </div>

          <button class="button-primary button-block" type="button" :disabled="isQuoting" @click="requestQuote">
            <span v-if="isQuoting" class="button-spinner" aria-hidden="true" ></span>
            {{ isQuoting ? 'Memeriksa jadwal…' : 'Lihat ringkasan harga' }}
            <UiIcon v-if="!isQuoting" name="arrow-right" :size="18" />
          </button>
          <p class="summary-footnote">Anda belum dikenakan biaya pada tahap ini.</p>
        </aside>
      </div>
    </div>
  </main>
</template>

<style scoped>
.booking-page { min-height: 80vh; padding: 38px 0 110px; background: #f7faf8; }
.booking-grid { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(330px, .75fr); gap: 58px; align-items: start; margin-top: 46px; }
.booking-form > h1 { margin: 0; font-family: var(--font-heading); font-size: clamp(2.15rem, 4vw, 3.5rem); letter-spacing: -.05em; line-height: 1.06; }
.booking-intro { max-width: 680px; margin: 16px 0 42px; color: var(--color-muted); font-size: 1.05rem; }
.form-section { padding: 30px 0; border-top: 1px solid var(--color-line); }
.form-section__heading { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 23px; }
.form-section__heading > span { display: grid; width: 34px; height: 34px; flex: 0 0 auto; place-items: center; border-radius: 50%; color: white; background: var(--color-primary); font-size: .72rem; font-weight: 800; }
.form-section__heading h2 { margin: 0; font-size: 1.18rem; line-height: 1.3; }
.form-section__heading p { margin: 3px 0 0; color: var(--color-muted); font-size: .86rem; }
.fields-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 19px; }
.field-full { grid-column: 1 / -1; }
.form-label em { float: right; color: var(--color-muted); font-size: .72rem; font-style: normal; font-weight: 500; }
.character-count { margin-top: 5px; color: var(--color-muted); font-size: .72rem; text-align: right; }
.quantity-control { display: grid; width: 150px; min-height: 50px; grid-template-columns: 46px 1fr 46px; overflow: hidden; border: 1px solid var(--color-line); border-radius: var(--radius-sm); background: white; }
.quantity-control button { border: 0; background: transparent; font-size: 1.2rem; }
.quantity-control button:hover:not(:disabled) { background: var(--color-soft); }
.quantity-control button:disabled { cursor: not-allowed; opacity: .35; }
.quantity-control output { display: grid; place-items: center; border-inline: 1px solid var(--color-line); font-weight: 750; }
.extras-grid { display: grid; gap: 12px; }
.extra-card { display: grid; grid-template-columns: 24px 1fr auto; gap: 12px; align-items: center; min-height: 76px; border: 1px solid var(--color-line); border-radius: 15px; padding: 13px 15px; text-align: left; background: white; transition: border-color 160ms, background 160ms; }
.extra-card:hover { border-color: color-mix(in srgb, var(--color-primary) 38%, var(--color-line)); }
.extra-card.selected { border-color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 5%, white); }
.extra-check { display: grid; width: 22px; height: 22px; place-items: center; border: 1px solid var(--color-line); border-radius: 7px; color: transparent; }
.selected .extra-check { border-color: var(--color-primary); color: white; background: var(--color-primary); }
.extra-card strong, .extra-card small { display: block; }
.extra-card small { margin-top: 3px; color: var(--color-muted); }
.summary-card { position: sticky; top: 104px; overflow: hidden; padding: 18px; }
.summary-product { display: grid; grid-template-columns: 112px 1fr; gap: 15px; align-items: center; }
.summary-product img { width: 112px; height: 92px; border-radius: 14px; object-fit: cover; }
.summary-product__copy > span { color: var(--color-primary); font-size: .72rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.summary-product__copy h2 { margin: 5px 0 7px; font-size: 1rem; line-height: 1.35; }
.summary-product__copy p { display: flex; gap: 4px; align-items: center; margin: 0; color: var(--color-muted); font-size: .76rem; }
.summary-details { margin: 20px 0; padding: 18px 0; border-block: 1px dashed var(--color-line); }
.summary-details > div { display: flex; gap: 18px; justify-content: space-between; margin: 8px 0; }
.summary-details dt { color: var(--color-muted); font-size: .82rem; }
.summary-details dd { max-width: 62%; margin: 0; font-size: .82rem; font-weight: 650; text-align: right; }
.price-notice { display: flex; gap: 10px; margin-bottom: 17px; border-radius: 13px; padding: 12px; color: var(--color-primary-strong); background: color-mix(in srgb, var(--color-primary) 8%, white); }
.price-notice svg { flex: 0 0 auto; margin-top: 2px; }
.price-notice p { margin: 0; font-size: .76rem; line-height: 1.55; }
.alert-error { display: flex; gap: 9px; margin-bottom: 14px; border-radius: 12px; padding: 11px 12px; color: #8a1c14; background: #fff0ee; }
.alert-error svg { flex: 0 0 auto; margin-top: 2px; }
.alert-error p { margin: 0; font-size: .78rem; }
.summary-footnote { margin: 10px 0 0; color: var(--color-muted); font-size: .7rem; text-align: center; }
.button-primary:disabled { cursor: wait; opacity: .7; transform: none; }
.button-spinner { width: 17px; height: 17px; border: 2px solid rgb(255 255 255 / 35%); border-top-color: white; border-radius: 50%; animation: spin .7s linear infinite; }
.booking-loading { padding-top: 80px; }
.loading-title { width: 45%; height: 54px; border-radius: 14px; }
.loading-card { width: 100%; height: 420px; margin-top: 35px; border-radius: 24px; }
.state-card { max-width: 620px; margin: 90px auto; padding: 48px; text-align: center; }
.state-card > svg { color: var(--color-primary); }
.state-card h1 { margin: 15px 0 9px; font-size: 1.7rem; }
.state-card p { margin: 0 auto 24px; color: var(--color-muted); }
.state-actions { display: flex; gap: 10px; justify-content: center; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 920px) {
  .booking-grid { grid-template-columns: 1fr; gap: 25px; }
  .summary-card { position: static; }
}
@media (max-width: 600px) {
  .booking-page { padding-top: 24px; }
  .booking-grid { margin-top: 28px; }
  .fields-grid { grid-template-columns: 1fr; }
  .field-full { grid-column: auto; }
  .summary-product { grid-template-columns: 90px 1fr; }
  .summary-product img { width: 90px; height: 80px; }
  .state-card { padding: 32px 20px; }
  .state-actions { flex-direction: column; }
}
</style>

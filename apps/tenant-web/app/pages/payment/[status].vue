<script setup lang="ts">
import dayjs from 'dayjs'
import type { ApiResponse, TrackingResponse } from '#shared/types'

definePageMeta({
  pageTransition: { name: 'page', mode: 'out-in' },
})

useSeoMeta({
  title: 'Status pembayaran',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const bookingStore = useBookingStore()
const bookingCode = computed(() => String(route.query.booking || bookingStore.booking?.bookingCode || ''))
const paymentToken = computed(() => String(route.query.token || bookingStore.booking?.paymentToken || ''))
const isChecking = ref(false)
const checkError = ref('')
const tracked = ref<TrackingResponse | null>(null)
const copied = ref(false)
const now = ref(Date.now())
let countdownTimer: ReturnType<typeof setInterval> | undefined

const storedBooking = computed(() => bookingStore.booking?.bookingCode === bookingCode.value ? bookingStore.booking : null)
const payment = computed(() => storedBooking.value?.payment)

const effectiveStatus = computed<'waiting' | 'success' | 'failed' | 'expired'>(() => {
  const paymentStatus = tracked.value?.paymentStatus || storedBooking.value?.paymentStatus
  if (paymentStatus === 'paid') return 'success'
  if (paymentStatus === 'failed') return 'failed'
  if (paymentStatus === 'expired') return 'expired'
  return 'waiting'
})

const expiresIn = computed(() => {
  if (!payment.value?.expiresAt) return ''
  const remaining = Math.max(0, dayjs(payment.value.expiresAt).valueOf() - now.value)
  if (remaining === 0) return '00:00:00'
  const hours = Math.floor(remaining / 3_600_000)
  const minutes = Math.floor((remaining % 3_600_000) / 60_000)
  const seconds = Math.floor((remaining % 60_000) / 1000)
  return [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':')
})

const statusContent = computed(() => ({
  waiting: {
    icon: 'clock',
    eyebrow: 'Menunggu pembayaran',
    title: 'Selesaikan pembayaranmu',
    description: 'Pesanan sudah dibuat. Ikuti instruksi pembayaran sebelum batas waktu berakhir.',
  },
  success: {
    icon: 'check-circle',
    eyebrow: 'Pembayaran berhasil',
    title: 'Pesananmu sudah dikonfirmasi',
    description: 'Terima kasih. Tenant telah menerima pesanan dan detailnya dapat dilacak kapan saja.',
  },
  failed: {
    icon: 'alert-circle',
    eyebrow: 'Pembayaran belum berhasil',
    title: 'Ada kendala saat memproses pembayaran',
    description: 'Tidak ada biaya tambahan yang dikenakan. Anda dapat mengecek status atau mencoba metode lain.',
  },
  expired: {
    icon: 'clock',
    eyebrow: 'Waktu pembayaran berakhir',
    title: 'Instruksi pembayaran sudah kedaluwarsa',
    description: 'Ketersediaan belum tentu masih sama. Perbarui jadwal untuk membuat instruksi pembayaran baru.',
  },
})[effectiveStatus.value])

async function checkStatus() {
  if (!bookingCode.value) return
  isChecking.value = true
  checkError.value = ''

  try {
    const verifier = paymentToken.value
      ? { token: paymentToken.value }
      : bookingStore.verificationContact
        ? { contact: bookingStore.verificationContact }
        : undefined
    if (!verifier) {
      checkError.value = 'Untuk memeriksa status terbaru setelah halaman dimuat ulang, gunakan menu Lacak pesanan dengan kontak Anda.'
      return
    }
    const response = await $fetch<ApiResponse<TrackingResponse>>(`/api/public/tracking/${encodeURIComponent(bookingCode.value)}`, {
      query: verifier,
    })
    tracked.value = response.data
  }
  catch (caught: any) {
    checkError.value = caught?.data?.error?.message || 'Status terbaru belum dapat diambil. Coba lagi beberapa saat.'
  }
  finally {
    isChecking.value = false
  }
}

async function copyAccount() {
  if (!payment.value?.virtualAccount || !import.meta.client) return
  await navigator.clipboard.writeText(payment.value.virtualAccount)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1800)
}

onMounted(() => {
  bookingStore.hydrate()
  countdownTimer = setInterval(() => { now.value = Date.now() }, 1000)
  if (bookingCode.value && (paymentToken.value || bookingStore.verificationContact)) checkStatus()
})

onBeforeUnmount(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>

<template>
  <main class="payment-page">
    <div class="container-shell payment-shell">
      <BookingSteps :current="3" />

      <section v-if="!bookingCode" class="status-card surface-card status-empty">
        <UiIcon name="receipt" :size="38" />
        <h1>Kode pemesanan tidak ditemukan</h1>
        <p>Gunakan halaman pelacakan untuk membuka kembali status pesanan Anda dengan aman.</p>
        <NuxtLink to="/tracking" class="button-primary">Lacak pesanan</NuxtLink>
      </section>

      <section v-else class="status-card surface-card" :class="`is-${effectiveStatus}`" aria-live="polite">
        <div class="status-icon"><UiIcon :name="statusContent.icon" :size="34" /></div>
        <p class="status-eyebrow">{{ statusContent.eyebrow }}</p>
        <h1>{{ statusContent.title }}</h1>
        <p class="status-description">{{ statusContent.description }}</p>

        <div class="booking-code">
          <span>Kode pemesanan</span>
          <strong>{{ bookingCode }}</strong>
        </div>

        <template v-if="effectiveStatus === 'waiting'">
          <div v-if="expiresIn" class="countdown-box">
            <span>Selesaikan pembayaran dalam</span>
            <strong>{{ expiresIn }}</strong>
          </div>

          <div v-if="payment" class="payment-instruction">
            <div class="instruction-heading">
              <span class="instruction-icon"><UiIcon name="bank" :size="21" /></span>
              <div><small>Metode pembayaran</small><strong>{{ payment.label }}</strong></div>
            </div>

            <div v-if="payment.virtualAccount" class="account-number">
              <span>Nomor pembayaran</span>
              <div><strong>{{ payment.virtualAccount }}</strong><button type="button" @click="copyAccount"><UiIcon name="copy" :size="16" /> {{ copied ? 'Tersalin' : 'Salin' }}</button></div>
            </div>

            <div class="payment-amount">
              <span>Total pembayaran</span>
              <PriceDisplay :amount="payment.amount" />
            </div>

            <ol v-if="payment.instructions?.length" class="instructions-list">
              <li v-for="instruction in payment.instructions" :key="instruction">{{ instruction }}</li>
            </ol>

            <a v-if="payment.redirectUrl" :href="payment.redirectUrl" class="button-primary button-block" target="_blank" rel="noopener">Buka halaman pembayaran <UiIcon name="external-link" :size="16" /></a>
          </div>

          <button class="button-secondary button-block" type="button" :disabled="isChecking" @click="checkStatus">
            <UiIcon name="refresh" :size="17" /> {{ isChecking ? 'Memeriksa…' : 'Saya sudah membayar' }}
          </button>
        </template>

        <template v-else-if="effectiveStatus === 'success'">
          <div class="success-details">
            <div><UiIcon name="calendar" :size="19" /><span>Jadwal</span><strong>{{ tracked?.scheduleLabel || 'Lihat detail di halaman pelacakan' }}</strong></div>
            <div><UiIcon name="package" :size="19" /><span>Status pesanan</span><strong>{{ tracked?.timeline?.find(item => item.completed)?.label || 'Dipesan' }}</strong></div>
          </div>
          <div class="action-grid">
            <NuxtLink :to="`/tracking?code=${encodeURIComponent(bookingCode)}`" class="button-primary">Lihat detail pesanan</NuxtLink>
            <NuxtLink to="/catalog" class="button-secondary">Kembali ke katalog</NuxtLink>
          </div>
        </template>

        <template v-else>
          <div class="action-grid">
            <NuxtLink v-if="bookingStore.selection" :to="`/booking?product=${bookingStore.selection.productSlug}`" class="button-primary">{{ effectiveStatus === 'expired' ? 'Atur ulang jadwal' : 'Coba bayar lagi' }}</NuxtLink>
            <button class="button-secondary" type="button" :disabled="isChecking" @click="checkStatus">Periksa status</button>
          </div>
        </template>

        <p v-if="checkError" class="check-error" role="alert">{{ checkError }}</p>
        <p class="status-help">Butuh bantuan? <NuxtLink to="/contact">Hubungi tenant</NuxtLink></p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.payment-page { min-height: 78vh; padding: 38px 0 100px; background: #f7faf8; }
.payment-shell { max-width: 790px; }
.status-card { margin: 44px auto 0; padding: 42px; text-align: center; }
.status-icon { display: grid; width: 72px; height: 72px; place-items: center; margin: 0 auto 15px; border-radius: 50%; color: #a76706; background: #fff7df; }
.is-success .status-icon { color: #087a59; background: #e8f8f1; }
.is-failed .status-icon, .is-expired .status-icon { color: #a13228; background: #fff0ee; }
.status-eyebrow { margin: 0 0 7px; color: var(--color-primary); font-size: .72rem; font-weight: 850; letter-spacing: .12em; text-transform: uppercase; }
.status-card h1 { max-width: 580px; margin: 0 auto; font-family: var(--font-heading); font-size: clamp(1.8rem, 4vw, 2.65rem); letter-spacing: -.04em; line-height: 1.15; }
.status-description { max-width: 560px; margin: 12px auto 23px; color: var(--color-muted); }
.booking-code { display: inline-flex; gap: 12px; align-items: center; border: 1px dashed var(--color-line); border-radius: 999px; padding: 9px 16px; background: var(--color-soft); }
.booking-code span { color: var(--color-muted); font-size: .72rem; }
.booking-code strong { font-size: .88rem; letter-spacing: .07em; }
.countdown-box { margin: 24px auto 16px; border-radius: 15px; padding: 13px; color: #7d4d04; background: #fff9e9; }
.countdown-box span, .countdown-box strong { display: block; }
.countdown-box span { font-size: .7rem; }
.countdown-box strong { margin-top: 2px; font-size: 1.25rem; font-variant-numeric: tabular-nums; letter-spacing: .08em; }
.payment-instruction { max-width: 540px; margin: 16px auto; border: 1px solid var(--color-line); border-radius: 17px; padding: 20px; text-align: left; }
.instruction-heading { display: flex; gap: 11px; align-items: center; padding-bottom: 15px; border-bottom: 1px solid var(--color-line); }
.instruction-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 12px; color: var(--color-primary); background: var(--color-soft); }
.instruction-heading small, .instruction-heading strong { display: block; }
.instruction-heading small { color: var(--color-muted); font-size: .67rem; }
.instruction-heading strong { font-size: .88rem; }
.account-number, .payment-amount { padding: 14px 0; }
.account-number > span, .payment-amount > span { color: var(--color-muted); font-size: .7rem; }
.account-number > div, .payment-amount { display: flex; gap: 12px; align-items: center; justify-content: space-between; }
.account-number strong { font-size: 1.16rem; letter-spacing: .06em; }
.account-number button { display: inline-flex; gap: 4px; align-items: center; border: 0; color: var(--color-primary); background: transparent; font-size: .72rem; font-weight: 750; }
.payment-amount { border-top: 1px dashed var(--color-line); }
.instructions-list { margin: 0 0 17px; padding-left: 20px; color: var(--color-muted); font-size: .76rem; }
.instructions-list li { margin: 6px 0; padding-left: 4px; }
.status-card > .button-secondary { max-width: 540px; margin: 10px auto 0; }
.button-secondary:disabled { cursor: wait; opacity: .6; }
.success-details { display: grid; max-width: 540px; grid-template-columns: 1fr 1fr; gap: 10px; margin: 25px auto; }
.success-details > div { display: grid; grid-template-columns: 22px 1fr; gap: 2px 7px; align-items: center; border-radius: 14px; padding: 13px; text-align: left; background: var(--color-soft); }
.success-details svg { grid-row: 1 / 3; color: var(--color-primary); }
.success-details span { color: var(--color-muted); font-size: .65rem; }
.success-details strong { font-size: .76rem; }
.action-grid { display: flex; max-width: 540px; gap: 10px; justify-content: center; margin: 25px auto 0; }
.action-grid > * { flex: 1; }
.check-error { max-width: 540px; margin: 13px auto; color: #9b2c23; font-size: .75rem; }
.status-help { margin: 20px 0 0; color: var(--color-muted); font-size: .72rem; }
.status-help a { color: var(--color-primary); font-weight: 750; }
.status-empty svg { color: var(--color-primary); }
@media (max-width: 600px) {
  .payment-page { padding-top: 24px; }
  .status-card { margin-top: 28px; padding: 31px 17px; }
  .success-details { grid-template-columns: 1fr; }
  .action-grid { flex-direction: column; }
  .booking-code { display: inline-grid; gap: 2px; border-radius: 14px; }
}
</style>

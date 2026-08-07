<script setup lang="ts">
import dayjs from 'dayjs'
import { z } from 'zod'
import type { ApiResponse, TrackingResponse } from '#shared/types'

useSeoMeta({
  title: 'Lacak pesanan',
  description: 'Periksa status pemesanan dan pembayaran Anda dengan aman.',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const form = reactive({
  code: String(route.query.code || ''),
  contact: '',
})
const errors = ref<Record<string, string>>({})
const result = ref<TrackingResponse | null>(null)
const lookupError = ref('')
const isLoading = ref(false)

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    pending_payment: 'Menunggu pembayaran',
    reserved: 'Dipesan',
    upcoming: 'Akan datang',
    processing: 'Sedang diproses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    expired: 'Kedaluwarsa',
  }
  return labels[result.value?.status || ''] || result.value?.status || ''
})

const paymentLabel = computed(() => {
  const labels: Record<string, string> = {
    unpaid: 'Belum dibayar',
    pending: 'Sedang diverifikasi',
    paid: 'Sudah dibayar',
    failed: 'Gagal',
    expired: 'Kedaluwarsa',
    refunded: 'Dikembalikan',
  }
  return labels[result.value?.paymentStatus || ''] || result.value?.paymentStatus || ''
})

const lookup = async () => {
  errors.value = {}
  lookupError.value = ''
  result.value = null

  const validation = z.object({
    code: z.string().trim().min(5, 'Masukkan kode pemesanan.'),
    contact: z.string().trim().min(5, 'Masukkan nomor WhatsApp atau email yang digunakan.'),
  }).safeParse(form)

  if (!validation.success) {
    for (const issue of validation.error.issues) {
      errors.value[String(issue.path[0])] = issue.message
    }
    return
  }

  isLoading.value = true
  try {
    const response = await $fetch<ApiResponse<TrackingResponse>>(`/api/public/tracking/${encodeURIComponent(form.code.trim().toUpperCase())}`, {
      query: { contact: form.contact.trim() },
    })
    result.value = response.data
  }
  catch (caught: any) {
    lookupError.value = caught?.data?.error?.message
      || 'Pesanan belum ditemukan. Periksa kembali kode dan kontak yang Anda masukkan.'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="tracking-page">
    <section class="tracking-hero">
      <div class="container-shell tracking-hero__inner">
        <div>
          <p class="section-kicker">Status real-time</p>
          <h1>Lacak pesananmu dengan mudah</h1>
          <p>Gunakan kode pemesanan dan kontak yang sama saat checkout. Informasi pribadi Anda tetap terlindungi.</p>
        </div>
        <div class="tracking-art" aria-hidden="true">
          <span class="art-orbit"><UiIcon name="package" :size="38" /></span>
          <span class="art-dot dot-one" ></span>
          <span class="art-dot dot-two" ></span>
        </div>
      </div>
    </section>

    <section class="container-shell tracking-content">
      <form class="lookup-card surface-card" novalidate @submit.prevent="lookup">
        <div class="lookup-heading"><span><UiIcon name="search" :size="20" /></span><div><h2>Cari pesanan</h2><p>Contoh kode: SWN-KMJ-24081</p></div></div>
        <div class="lookup-fields">
          <div>
            <label class="form-label" for="booking-code">Kode pemesanan</label>
            <input id="booking-code" v-model.trim="form.code" class="form-control code-input" type="text" autocomplete="off" placeholder="SWN-XXXX" :aria-invalid="!!errors.code" :aria-describedby="errors.code ? 'code-error' : undefined"/>
            <p v-if="errors.code" id="code-error" class="form-error">{{ errors.code }}</p>
          </div>
          <div>
            <label class="form-label" for="tracking-contact">Nomor WhatsApp atau email</label>
            <input id="tracking-contact" v-model.trim="form.contact" class="form-control" type="text" autocomplete="email" placeholder="08xxxxxxxxxx / nama@email.com" :aria-invalid="!!errors.contact" :aria-describedby="errors.contact ? 'contact-error' : undefined"/>
            <p v-if="errors.contact" id="contact-error" class="form-error">{{ errors.contact }}</p>
          </div>
          <button class="button-primary" type="submit" :disabled="isLoading">
            <span v-if="isLoading" class="button-spinner" ></span>
            {{ isLoading ? 'Mencari…' : 'Lacak sekarang' }}
          </button>
        </div>
        <p v-if="lookupError" class="lookup-error" role="alert"><UiIcon name="alert-circle" :size="18" /> {{ lookupError }}</p>
        <p class="privacy-note"><UiIcon name="lock" :size="14" /> Kontak digunakan hanya untuk memverifikasi pemilik pesanan.</p>
      </form>

      <article v-if="result" class="tracking-result" aria-live="polite">
        <div class="result-header surface-card">
          <div>
            <span class="result-kicker">Pesanan ditemukan</span>
            <h2>{{ result.productName }}</h2>
            <p><UiIcon name="calendar" :size="17" /> {{ result.scheduleLabel }}</p>
          </div>
          <div class="result-code"><span>Kode pesanan</span><strong>{{ result.code }}</strong></div>
        </div>

        <div class="result-grid">
          <section class="timeline-card surface-card">
            <div class="card-heading"><div><p>Perjalanan pesanan</p><h2>{{ statusLabel }}</h2></div><span class="status-pill">{{ statusLabel }}</span></div>
            <ol class="timeline-list">
              <li v-for="(item, index) in result.timeline" :key="`${item.status}-${index}`" :class="{ completed: item.completed }">
                <span class="timeline-marker"><UiIcon v-if="item.completed" name="check" :size="14" /><span v-else ></span></span>
                <div><strong>{{ item.label }}</strong><p>{{ item.description }}</p><time v-if="item.occurredAt" :datetime="item.occurredAt">{{ dayjs(item.occurredAt).format('D MMM YYYY, HH.mm') }} WIB</time></div>
              </li>
            </ol>
          </section>

          <aside class="tracking-aside">
            <section class="payment-status surface-card">
              <div class="aside-icon"><UiIcon name="wallet" :size="21" /></div>
              <span>Status pembayaran</span>
              <strong>{{ paymentLabel }}</strong>
              <NuxtLink v-if="['unpaid', 'pending'].includes(result.paymentStatus)" :to="`/payment/waiting?booking=${encodeURIComponent(result.code)}`" class="button-secondary button-block">Lihat instruksi</NuxtLink>
            </section>
            <section class="help-card">
              <UiIcon name="message-circle" :size="23" />
              <h3>Perlu bantuan?</h3>
              <p>Tenant siap membantu jika ada perubahan jadwal atau pertanyaan.</p>
              <NuxtLink to="/contact">Hubungi tenant <UiIcon name="arrow-right" :size="15" /></NuxtLink>
            </section>
            <p class="updated-at">Terakhir diperbarui {{ dayjs(result.lastUpdatedAt).format('D MMM YYYY, HH.mm') }} WIB</p>
          </aside>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.tracking-page { min-height: 80vh; padding-bottom: 100px; background: #f7faf8; }
.tracking-hero { overflow: hidden; padding: 74px 0 105px; color: white; background: var(--color-primary-strong); }
.tracking-hero__inner { display: grid; grid-template-columns: 1.3fr .7fr; align-items: center; }
.tracking-hero .section-kicker { color: #bce8de; }
.tracking-hero h1 { max-width: 700px; margin: 0; font-family: var(--font-heading); font-size: clamp(2.4rem, 5vw, 4.35rem); letter-spacing: -.055em; line-height: 1.04; }
.tracking-hero p:last-child { max-width: 610px; margin: 18px 0 0; color: rgb(255 255 255 / 70%); font-size: 1.04rem; }
.tracking-art { position: relative; width: 240px; height: 180px; justify-self: end; }
.art-orbit { position: absolute; inset: 18px 45px; display: grid; place-items: center; border: 1px solid rgb(255 255 255 / 18%); border-radius: 50%; color: var(--color-primary-strong); background: #dff6ef; box-shadow: 0 25px 55px rgb(0 0 0 / 18%); }
.art-orbit::before, .art-orbit::after { position: absolute; border: 1px solid rgb(255 255 255 / 13%); border-radius: 50%; content: ''; }
.art-orbit::before { inset: -28px; }.art-orbit::after { inset: -58px; }
.art-dot { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: var(--color-secondary); }
.dot-one { top: 15px; right: 15px; }.dot-two { bottom: 18px; left: 5px; width: 7px; height: 7px; }
.tracking-content { position: relative; margin-top: -48px; }
.lookup-card { padding: 24px; }
.lookup-heading { display: flex; gap: 12px; align-items: center; margin-bottom: 18px; }
.lookup-heading > span { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 13px; color: var(--color-primary); background: var(--color-soft); }
.lookup-heading h2 { margin: 0; font-size: 1rem; }.lookup-heading p { margin: 1px 0 0; color: var(--color-muted); font-size: .7rem; }
.lookup-fields { display: grid; grid-template-columns: .8fr 1.15fr auto; gap: 13px; align-items: start; }
.lookup-fields .button-primary { min-width: 160px; margin-top: 28px; }
.code-input { font-weight: 750; letter-spacing: .05em; text-transform: uppercase; }
.privacy-note { display: flex; gap: 5px; align-items: center; margin: 13px 0 0; color: var(--color-muted); font-size: .68rem; }
.lookup-error { display: flex; gap: 6px; align-items: center; margin: 13px 0 0; color: #9b2c23; font-size: .78rem; }
.button-primary:disabled { cursor: wait; opacity: .7; }
.button-spinner { width: 16px; height: 16px; border: 2px solid rgb(255 255 255 / 35%); border-top-color: white; border-radius: 50%; animation: spin .7s linear infinite; }
.tracking-result { margin-top: 27px; }
.result-header { display: flex; gap: 25px; align-items: center; justify-content: space-between; margin-bottom: 18px; padding: 22px 25px; }
.result-kicker { color: var(--color-primary); font-size: .68rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.result-header h2 { margin: 4px 0 3px; font-size: 1.25rem; }
.result-header p { display: flex; gap: 6px; align-items: center; margin: 0; color: var(--color-muted); font-size: .78rem; }
.result-code { text-align: right; }.result-code span, .result-code strong { display: block; }.result-code span { color: var(--color-muted); font-size: .68rem; }.result-code strong { letter-spacing: .07em; }
.result-grid { display: grid; grid-template-columns: 1fr 310px; gap: 18px; align-items: start; }
.timeline-card { padding: 27px; }
.card-heading { display: flex; gap: 15px; align-items: center; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid var(--color-line); }
.card-heading p { margin: 0; color: var(--color-muted); font-size: .7rem; }.card-heading h2 { margin: 3px 0 0; font-size: 1.12rem; }
.status-pill { border-radius: 999px; padding: 6px 10px; color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 9%, white); font-size: .68rem; font-weight: 750; }
.timeline-list { margin: 25px 0 0; padding: 0; list-style: none; }
.timeline-list li { position: relative; display: grid; grid-template-columns: 30px 1fr; gap: 12px; min-height: 100px; color: #9aa5a1; }
.timeline-list li::before { position: absolute; top: 27px; bottom: 0; left: 13px; width: 1px; background: var(--color-line); content: ''; }
.timeline-list li:last-child { min-height: auto; }.timeline-list li:last-child::before { display: none; }
.timeline-marker { position: relative; z-index: 1; display: grid; width: 27px; height: 27px; place-items: center; border: 1px solid var(--color-line); border-radius: 50%; background: white; }
.timeline-marker > span { width: 7px; height: 7px; border-radius: 50%; background: #cbd3d0; }
.timeline-list li.completed { color: var(--color-ink); }
.completed .timeline-marker { border-color: var(--color-primary); color: white; background: var(--color-primary); }
.timeline-list strong { display: block; font-size: .88rem; }.timeline-list p { margin: 3px 0; color: var(--color-muted); font-size: .75rem; }.timeline-list time { color: var(--color-muted); font-size: .68rem; }
.tracking-aside { display: grid; gap: 14px; }
.payment-status { padding: 20px; text-align: center; }.aside-icon { display: grid; width: 46px; height: 46px; place-items: center; margin: 0 auto 10px; border-radius: 14px; color: var(--color-primary); background: var(--color-soft); }.payment-status > span, .payment-status > strong { display: block; }.payment-status > span { color: var(--color-muted); font-size: .68rem; }.payment-status > strong { margin: 2px 0 15px; }
.help-card { border-radius: var(--radius-md); padding: 20px; color: white; background: var(--color-primary); }.help-card h3 { margin: 8px 0 3px; }.help-card p { margin: 0 0 13px; color: rgb(255 255 255 / 75%); font-size: .75rem; }.help-card a { display: inline-flex; gap: 5px; align-items: center; font-size: .76rem; font-weight: 750; }
.updated-at { margin: 0; color: var(--color-muted); font-size: .65rem; text-align: center; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 850px) {
  .tracking-art { display: none; }.tracking-hero__inner { grid-template-columns: 1fr; }
  .lookup-fields { grid-template-columns: 1fr 1fr; }.lookup-fields .button-primary { grid-column: 1 / -1; margin-top: 0; }
  .result-grid { grid-template-columns: 1fr; }.tracking-aside { grid-template-columns: 1fr 1fr; }.updated-at { grid-column: 1 / -1; }
}
@media (max-width: 580px) {
  .tracking-hero { padding: 58px 0 88px; }.tracking-content { margin-top: -35px; }.lookup-card { padding: 18px 15px; }
  .lookup-fields { grid-template-columns: 1fr; }.lookup-fields .button-primary { grid-column: auto; }.result-header { align-items: flex-start; flex-direction: column; }.result-code { text-align: left; }
  .timeline-card { padding: 21px 17px; }.tracking-aside { grid-template-columns: 1fr; }.updated-at { grid-column: auto; }
}
</style>

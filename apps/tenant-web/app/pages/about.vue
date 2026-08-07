<script setup lang="ts">
import type { ApiResponse, HomePayload, Tenant } from '#shared/types'

const { data: homeResponse } = await useFetch<ApiResponse<HomePayload>>('/api/public/home', { key: 'about-home' })
const tenant = computed<Tenant | undefined>(() => homeResponse.value?.data.tenant)
const stats = computed(() => homeResponse.value?.data.stats)

useSeoMeta({
  title: () => tenant.value ? `Tentang ${tenant.value.businessName}` : 'Tentang kami',
  description: () => tenant.value?.description || 'Kenali tenant dan layanan yang tersedia.',
})
</script>

<template>
  <main v-if="tenant" class="about-page">
    <section class="about-hero section-shell">
      <div class="container-shell about-hero__grid">
        <div>
          <p class="section-kicker">Cerita kami</p>
          <h1>{{ tenant.tagline }}</h1>
          <p class="hero-copy">{{ tenant.description }}</p>
          <div class="hero-actions">
            <NuxtLink to="/catalog" class="button-primary">Jelajahi katalog <UiIcon name="arrow-right" :size="17" /></NuxtLink>
            <NuxtLink to="/contact" class="button-secondary">Hubungi kami</NuxtLink>
          </div>
        </div>
        <div class="about-visual">
          <div class="visual-main"><span>{{ tenant.businessName.charAt(0) }}</span><small>{{ tenant.businessName }}</small></div>
          <div class="visual-note"><UiIcon name="heart" :size="20" /><p><strong>Dipilih dengan teliti</strong>Setiap produk dirawat agar siap menemani kebutuhan Anda.</p></div>
        </div>
      </div>
    </section>

    <section class="container-shell trust-stats" aria-label="Pencapaian tenant">
      <div><strong>{{ stats?.products || 0 }}+</strong><span>Pilihan produk</span></div>
      <div><strong>{{ (stats?.bookings || 0).toLocaleString('id-ID') }}+</strong><span>Pemesanan dilayani</span></div>
      <div><strong>{{ stats?.averageRating || 0 }}/5</strong><span>Rata-rata penilaian</span></div>
      <div><strong>{{ tenant.locations.length }}</strong><span>Lokasi layanan</span></div>
    </section>

    <section class="values-section section-shell">
      <div class="container-shell">
        <div class="section-heading"><div><p class="section-kicker">Yang kami jaga</p><h2 class="section-title">Pengalaman sewa yang terasa sederhana</h2></div><p class="section-copy">Dari pemilihan hingga pengembalian, kami membuat setiap tahap mudah dipahami dan transparan.</p></div>
        <div class="values-grid">
          <article><span><UiIcon name="sparkles" :size="25" /></span><h3>Kualitas terjaga</h3><p>Produk dicek dan dirawat secara berkala sebelum diserahkan kepada pelanggan.</p></article>
          <article><span><UiIcon name="receipt" :size="25" /></span><h3>Harga transparan</h3><p>Seluruh rincian biaya tampil sebelum Anda melakukan konfirmasi pembayaran.</p></article>
          <article><span><UiIcon name="message-circle" :size="25" /></span><h3>Bantuan yang dekat</h3><p>Tim tenant dapat dihubungi ketika Anda membutuhkan arahan atau penyesuaian.</p></article>
        </div>
      </div>
    </section>

    <section class="location-section section-shell">
      <div class="container-shell location-grid">
        <div><p class="section-kicker">Temui kami</p><h2 class="section-title">Hadir lebih dekat untuk kebutuhanmu</h2><p class="section-copy">Kunjungi lokasi utama kami atau hubungi tim untuk mengatur pengambilan dan pengembalian.</p></div>
        <div class="location-card surface-card">
          <span class="location-icon"><UiIcon name="map-pin" :size="24" /></span>
          <div><small>Lokasi utama</small><h3>{{ tenant.locations.find(item => item.isPrimary)?.name || tenant.businessName }}</h3><p>{{ tenant.locations.find(item => item.isPrimary)?.address || tenant.contact.address }}</p></div>
          <a v-if="tenant.contact.mapUrl" :href="tenant.contact.mapUrl" class="button-secondary" target="_blank" rel="noopener">Buka peta <UiIcon name="external-link" :size="15" /></a>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.about-page { background: white; }
.about-hero { overflow: hidden; color: white; background: var(--color-primary-strong); }
.about-hero__grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 70px; align-items: center; }
.about-hero .section-kicker { color: #bce8de; }.about-hero h1 { max-width: 720px; margin: 0; font-family: var(--font-heading); font-size: clamp(2.7rem, 5.5vw, 5.3rem); letter-spacing: -.06em; line-height: .99; }.hero-copy { max-width: 620px; margin: 22px 0 0; color: rgb(255 255 255 / 72%); font-size: 1.08rem; }.hero-actions { display: flex; gap: 10px; margin-top: 28px; }.about-hero .button-primary { color: var(--color-primary-strong); background: #dff6ef; }.about-hero .button-secondary { border-color: rgb(255 255 255 / 28%); color: white; background: transparent; }
.about-visual { position: relative; min-height: 410px; }.visual-main { position: absolute; inset: 0 25px 35px 0; display: grid; place-items: center; overflow: hidden; border: 1px solid rgb(255 255 255 / 16%); border-radius: 160px 160px 28px 28px; background: radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--color-secondary) 55%, white), var(--color-primary)); }.visual-main > span { font-family: var(--font-heading); font-size: 11rem; font-weight: 900; opacity: .32; }.visual-main small { position: absolute; bottom: 28px; font-size: .72rem; font-weight: 800; letter-spacing: .15em; text-transform: uppercase; }.visual-note { position: absolute; right: 0; bottom: 0; display: flex; width: 250px; gap: 10px; border-radius: 17px; padding: 15px; color: var(--color-ink); background: white; box-shadow: var(--shadow-md); }.visual-note svg { flex: 0 0 auto; color: var(--color-secondary); }.visual-note p { margin: 0; font-size: .72rem; }.visual-note strong { display: block; font-size: .78rem; }
.trust-stats { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(4, 1fr); margin-top: -24px; overflow: hidden; border: 1px solid var(--color-line); border-radius: 20px; background: white; box-shadow: var(--shadow-sm); }.trust-stats > div { padding: 25px; text-align: center; }.trust-stats > div + div { border-left: 1px solid var(--color-line); }.trust-stats strong, .trust-stats span { display: block; }.trust-stats strong { color: var(--color-primary); font-size: 1.55rem; }.trust-stats span { color: var(--color-muted); font-size: .72rem; }
.values-section { background: #f7faf8; }.section-heading { display: flex; gap: 30px; align-items: end; justify-content: space-between; }.section-heading .section-copy { margin-bottom: 6px; }.values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 17px; margin-top: 46px; }.values-grid article { border: 1px solid var(--color-line); border-radius: 20px; padding: 28px; background: white; }.values-grid article > span, .location-icon { display: grid; width: 52px; height: 52px; place-items: center; border-radius: 15px; color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 8%, white); }.values-grid h3 { margin: 18px 0 6px; }.values-grid p { margin: 0; color: var(--color-muted); font-size: .84rem; }
.location-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }.location-card { display: grid; grid-template-columns: 52px 1fr; gap: 15px; align-items: center; padding: 24px; }.location-card small { color: var(--color-primary); font-size: .66rem; font-weight: 750; text-transform: uppercase; }.location-card h3 { margin: 3px 0; }.location-card p { margin: 0; color: var(--color-muted); font-size: .78rem; }.location-card .button-secondary { grid-column: 1 / -1; margin-top: 5px; }
@media (max-width: 850px) { .about-hero__grid { grid-template-columns: 1fr; }.about-visual { min-height: 330px; }.trust-stats { grid-template-columns: repeat(2, 1fr); }.trust-stats > div:nth-child(3) { border-left: 0; border-top: 1px solid var(--color-line); }.trust-stats > div:nth-child(4) { border-top: 1px solid var(--color-line); }.values-grid, .location-grid { grid-template-columns: 1fr; }.location-grid { gap: 35px; }.section-heading { display: block; } }
@media (max-width: 540px) { .hero-actions { flex-direction: column; }.about-visual { min-height: 270px; }.visual-note { width: 220px; }.trust-stats { width: calc(100% - 28px); }.values-grid { grid-template-columns: 1fr; } }
</style>

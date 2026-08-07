<script setup lang="ts">
import type { ApiResponse, Tenant } from '#shared/types'

const { data: response } = await useFetch<ApiResponse<Tenant>>('/api/public/tenant', { key: 'contact-tenant' })
const tenant = computed(() => response.value?.data)
const subject = ref('Tanya ketersediaan produk')
const message = ref('')

useSeoMeta({
  title: () => tenant.value ? `Hubungi ${tenant.value.businessName}` : 'Hubungi kami',
  description: () => tenant.value ? `Hubungi ${tenant.value.businessName} melalui WhatsApp, email, atau kunjungi lokasi kami.` : 'Hubungi tenant.',
})

const whatsappHref = computed(() => {
  const number = tenant.value?.contact.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62') || ''
  const text = [subject.value, message.value].filter(Boolean).join('\n\n')
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
})
</script>

<template>
  <main v-if="tenant" class="contact-page">
    <section class="contact-hero">
      <div class="container-shell"><p class="section-kicker">Kami siap membantu</p><h1>Ada yang ingin ditanyakan?</h1><p>Dapatkan informasi produk, jadwal, atau bantuan terkait pesanan langsung dari tim {{ tenant.businessName }}.</p></div>
    </section>

    <section class="container-shell contact-grid">
      <div class="contact-options">
        <a :href="whatsappHref" target="_blank" rel="noopener" class="contact-option surface-card"><span><UiIcon name="message-circle" :size="23" /></span><div><small>Respons tercepat</small><h2>WhatsApp</h2><p>{{ tenant.contact.whatsapp }}</p></div><UiIcon name="arrow-up-right" :size="18" /></a>
        <a :href="`mailto:${tenant.contact.email}`" class="contact-option surface-card"><span><UiIcon name="mail" :size="23" /></span><div><small>Untuk pertanyaan detail</small><h2>Email</h2><p>{{ tenant.contact.email }}</p></div><UiIcon name="arrow-up-right" :size="18" /></a>
        <div class="contact-option surface-card"><span><UiIcon name="map-pin" :size="23" /></span><div><small>Kunjungi lokasi</small><h2>Alamat</h2><p>{{ tenant.contact.address }}</p></div><a v-if="tenant.contact.mapUrl" :href="tenant.contact.mapUrl" aria-label="Buka alamat di peta" target="_blank" rel="noopener"><UiIcon name="arrow-up-right" :size="18" /></a></div>

        <div class="hours-card">
          <div class="hours-heading"><UiIcon name="clock" :size="20" /><div><h2>Jam operasional</h2><p>Waktu dapat berbeda saat hari libur.</p></div></div>
          <dl><div v-for="hours in tenant.businessHours" :key="hours.day"><dt>{{ hours.day }}</dt><dd>{{ hours.label }}</dd></div></dl>
        </div>
      </div>

      <form class="message-form surface-card" @submit.prevent>
        <p class="section-kicker">Pesan cepat</p><h2>Mulai percakapan</h2><p>Pilih topik dan tulis kebutuhan Anda. Pesan akan dibuka di WhatsApp untuk dikirim setelah Anda periksa.</p>
        <div class="field-group"><label class="form-label" for="contact-subject">Topik</label><select id="contact-subject" v-model="subject" class="form-control"><option>Tanya ketersediaan produk</option><option>Bantuan pemesanan</option><option>Pembayaran dan invoice</option><option>Kerja sama</option><option>Lainnya</option></select></div>
        <div class="field-group"><label class="form-label" for="contact-message">Pesan <em>Opsional</em></label><textarea id="contact-message" v-model="message" class="form-control" maxlength="500" placeholder="Ceritakan kebutuhan Anda…" ></textarea></div>
        <a :href="whatsappHref" class="button-primary button-block" target="_blank" rel="noopener">Lanjutkan di WhatsApp <UiIcon name="arrow-up-right" :size="17" /></a>
        <p class="form-note">Pesan tidak dikirim otomatis. Anda tetap memegang kendali sebelum mengirim di WhatsApp.</p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.contact-page { min-height: 80vh; padding-bottom: 100px; background: #f7faf8; }.contact-hero { padding: 76px 0 125px; color: white; background: var(--color-primary-strong); }.contact-hero .section-kicker { color: #bce8de; }.contact-hero h1 { max-width: 760px; margin: 0; font-family: var(--font-heading); font-size: clamp(2.7rem, 6vw, 5rem); letter-spacing: -.06em; line-height: 1; }.contact-hero p:last-child { max-width: 620px; margin: 18px 0 0; color: rgb(255 255 255 / 70%); }.contact-grid { display: grid; grid-template-columns: 1fr .9fr; gap: 28px; align-items: start; margin-top: -67px; }.contact-options { display: grid; gap: 12px; }.contact-option { display: grid; grid-template-columns: 48px 1fr 20px; gap: 13px; align-items: center; min-height: 95px; padding: 17px; }.contact-option > span { display: grid; width: 48px; height: 48px; place-items: center; border-radius: 14px; color: var(--color-primary); background: var(--color-soft); }.contact-option small { color: var(--color-primary); font-size: .64rem; font-weight: 750; text-transform: uppercase; }.contact-option h2 { margin: 1px 0; font-size: .95rem; }.contact-option p { margin: 0; color: var(--color-muted); font-size: .74rem; }.contact-option > svg, .contact-option > a { color: var(--color-muted); }.hours-card { margin-top: 7px; border-radius: var(--radius-md); padding: 23px; color: white; background: var(--color-primary); }.hours-heading { display: flex; gap: 11px; align-items: center; padding-bottom: 15px; border-bottom: 1px solid rgb(255 255 255 / 18%); }.hours-heading h2 { margin: 0; font-size: .95rem; }.hours-heading p { margin: 1px 0 0; color: rgb(255 255 255 / 65%); font-size: .66rem; }.hours-card dl { margin: 15px 0 0; }.hours-card dl div { display: flex; justify-content: space-between; margin: 7px 0; font-size: .74rem; }.hours-card dt { color: rgb(255 255 255 / 68%); }.hours-card dd { margin: 0; font-weight: 650; }.message-form { padding: 30px; }.message-form h2 { margin: 0; font-family: var(--font-heading); font-size: 1.8rem; letter-spacing: -.035em; }.message-form > p:not(.section-kicker,.form-note) { margin: 8px 0 23px; color: var(--color-muted); font-size: .84rem; }.message-form .field-group { margin-bottom: 17px; }.message-form em { float: right; color: var(--color-muted); font-size: .68rem; font-style: normal; font-weight: 500; }.form-note { margin: 10px 0 0; color: var(--color-muted); font-size: .66rem; text-align: center; }
@media (max-width: 800px) { .contact-grid { grid-template-columns: 1fr; }.message-form { order: -1; } }
@media (max-width: 520px) { .contact-hero { padding-bottom: 95px; }.contact-grid { margin-top: -45px; }.message-form { padding: 23px 16px; } }
</style>

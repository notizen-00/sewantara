<script setup lang="ts">
import type { ApiResponse, Tenant } from '#shared/types'

export interface LegalSection {
  title: string
  paragraphs: string[]
}

const props = defineProps<{
  title: string
  description: string
  sections: LegalSection[]
}>()

const { data } = await useFetch<ApiResponse<Tenant>>('/api/public/tenant', { key: 'legal-tenant' })
const tenant = computed(() => data.value?.data)

useSeoMeta({
  title: () => `${props.title}${tenant.value ? ` | ${tenant.value.businessName}` : ''}`,
  description: () => props.description,
})
</script>

<template>
  <main class="legal-page">
    <header class="legal-hero">
      <div class="container-shell">
        <nav aria-label="Breadcrumb"><NuxtLink to="/">Beranda</NuxtLink><UiIcon name="chevron-right" :size="14" /><span aria-current="page">{{ title }}</span></nav>
        <p class="section-kicker">Informasi pelanggan</p>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
    </header>

    <div class="container-shell legal-layout">
      <aside><div class="aside-mark"><UiIcon name="shield-check" :size="24" /></div><strong>{{ tenant?.businessName || 'Tenant' }}</strong><p>Dokumen ini merupakan konten contoh mode demo. Tenant wajib menggantinya dengan kebijakan yang sudah ditinjau sebelum produksi.</p><NuxtLink to="/contact">Ajukan pertanyaan <UiIcon name="arrow-right" :size="15" /></NuxtLink></aside>
      <article>
        <p class="updated">Terakhir diperbarui: 4 Agustus 2026</p>
        <section v-for="(section, index) in sections" :key="section.title">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <div><h2>{{ section.title }}</h2><p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p></div>
        </section>
      </article>
    </div>
  </main>
</template>

<style scoped>
.legal-page { min-height: 75vh; padding-bottom: 100px; background: #f7faf8; }.legal-hero { padding: 70px 0 90px; color: white; background: var(--color-primary-strong); }.legal-hero nav { display: flex; gap: 7px; align-items: center; margin-bottom: 30px; color: rgb(255 255 255 / 55%); font-size: .7rem; }.legal-hero .section-kicker { color: #bce8de; }.legal-hero h1 { margin: 0; font-family: var(--font-heading); font-size: clamp(2.5rem, 5vw, 4.6rem); letter-spacing: -.055em; line-height: 1; }.legal-hero > div > p:last-child { max-width: 650px; margin: 17px 0 0; color: rgb(255 255 255 / 70%); }.legal-layout { display: grid; grid-template-columns: 260px 1fr; gap: 60px; align-items: start; margin-top: 55px; }.legal-layout aside { position: sticky; top: 105px; border-radius: 18px; padding: 21px; background: white; box-shadow: var(--shadow-sm); }.aside-mark { display: grid; width: 48px; height: 48px; place-items: center; margin-bottom: 14px; border-radius: 14px; color: var(--color-primary); background: var(--color-soft); }.legal-layout aside strong { display: block; }.legal-layout aside p { margin: 6px 0 14px; color: var(--color-muted); font-size: .73rem; }.legal-layout aside a { display: inline-flex; gap: 5px; align-items: center; color: var(--color-primary); font-size: .74rem; font-weight: 750; }.legal-layout article { max-width: 760px; }.updated { margin: 0 0 25px; color: var(--color-muted); font-size: .7rem; }.legal-layout article section { display: grid; grid-template-columns: 42px 1fr; gap: 17px; padding: 28px 0; border-top: 1px solid var(--color-line); }.legal-layout article section > span { color: var(--color-primary); font-size: .7rem; font-weight: 800; }.legal-layout h2 { margin: -5px 0 12px; font-size: 1.25rem; }.legal-layout section p { margin: 0 0 13px; color: #52605c; font-size: .9rem; line-height: 1.8; }
@media (max-width: 740px) { .legal-layout { grid-template-columns: 1fr; gap: 25px; }.legal-layout aside { position: static; }.legal-hero { padding: 55px 0 70px; } }
</style>

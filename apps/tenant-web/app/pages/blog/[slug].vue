<script setup lang="ts">
import dayjs from 'dayjs'
import type { ApiResponse, BlogSnippet, Tenant } from '#shared/types'

interface ContentBlock { type: 'paragraph' | 'heading' | 'list' | 'quote'; text?: string; items?: string[] }
interface BlogPost extends BlogSnippet { author: { name: string; role: string }; content: ContentBlock[]; seo: { title: string; description: string; ogImage: string } }

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const { data: response, error } = await useAsyncData(`blog-post:${slug.value}`, () => $fetch<ApiResponse<BlogPost>>(`/api/public/blog/${encodeURIComponent(slug.value)}`), { watch: [slug] })
const { data: tenantResponse } = await useFetch<ApiResponse<Tenant>>('/api/public/tenant', { key: 'article-tenant' })
const post = computed(() => response.value?.data)
const tenant = computed(() => tenantResponse.value?.data)

if (error.value) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })

useSeoMeta({
  title: () => post.value?.seo.title || post.value?.title || 'Artikel',
  description: () => post.value?.seo.description || post.value?.excerpt,
  ogTitle: () => post.value?.seo.title || post.value?.title,
  ogDescription: () => post.value?.seo.description || post.value?.excerpt,
  ogImage: () => post.value?.seo.ogImage || post.value?.image.url,
  ogType: 'article',
  twitterCard: 'summary_large_image',
})

useHead(() => post.value ? {
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.value.title,
      description: post.value.excerpt,
      image: post.value.image.url,
      datePublished: post.value.publishedAt,
      author: { '@type': 'Organization', name: post.value.author.name },
      publisher: { '@type': 'Organization', name: tenant.value?.businessName || 'Sewantara' },
    }),
  }],
} : {})
</script>

<template>
  <main v-if="post" class="article-page">
    <article>
      <header class="article-header section-shell">
        <div class="container-shell article-header__inner">
          <nav aria-label="Breadcrumb" class="breadcrumb"><NuxtLink to="/">Beranda</NuxtLink><UiIcon name="chevron-right" :size="14" /><NuxtLink to="/blog">Blog</NuxtLink><UiIcon name="chevron-right" :size="14" /><span aria-current="page">{{ post.category }}</span></nav>
          <span class="article-category">{{ post.category }}</span>
          <h1>{{ post.title }}</h1>
          <p>{{ post.excerpt }}</p>
          <div class="article-meta"><div class="author-avatar">{{ post.author.name.charAt(0) }}</div><div><strong>{{ post.author.name }}</strong><small>{{ post.author.role }}</small></div><span class="meta-separator" ></span><div><strong>{{ dayjs(post.publishedAt).format('D MMMM YYYY') }}</strong><small>{{ post.readingTimeMinutes }} menit baca</small></div></div>
        </div>
      </header>

      <div class="container-shell article-image"><NuxtImg :src="post.image.url" :alt="post.image.alt" width="1400" height="820" format="webp" sizes="100vw" loading="eager" fetchpriority="high" /></div>

      <div class="container-shell article-layout">
        <aside class="share-column" aria-label="Bagikan artikel"><span>Bagikan</span><a :href="`https://wa.me/?text=${encodeURIComponent(`${post.title} ${tenant?.hostname ? `https://${tenant.hostname}${route.path}` : route.path}`)}`" target="_blank" rel="noopener" aria-label="Bagikan melalui WhatsApp"><UiIcon name="whatsapp" :size="18" /></a><a :href="`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(post.excerpt)}`" aria-label="Bagikan melalui email"><UiIcon name="mail" :size="18" /></a></aside>
        <div class="article-body">
          <template v-for="(block, index) in post.content" :key="`${block.type}-${index}`">
            <p v-if="block.type === 'paragraph'">{{ block.text }}</p>
            <h2 v-else-if="block.type === 'heading'">{{ block.text }}</h2>
            <ul v-else-if="block.type === 'list'"><li v-for="item in block.items" :key="item">{{ item }}</li></ul>
            <blockquote v-else-if="block.type === 'quote'"><UiIcon name="sparkles" :size="23" /><p>{{ block.text }}</p></blockquote>
          </template>

          <section class="article-help"><span><UiIcon name="message-circle" :size="22" /></span><div><small>Butuh rekomendasi personal?</small><h2>Tim {{ tenant?.businessName || 'tenant' }} siap membantu</h2><p>Ceritakan jadwal dan kebutuhan penggunaan Anda untuk mendapatkan pilihan yang lebih tepat.</p></div><NuxtLink to="/contact" class="button-primary">Konsultasi</NuxtLink></section>
        </div>
      </div>
    </article>
  </main>
</template>

<style scoped>
.article-page { padding-bottom: 100px; background: white; }.article-header { padding-bottom: 145px; color: white; text-align: center; background: var(--color-primary-strong); }.article-header__inner { max-width: 940px; }.breadcrumb { display: flex; gap: 7px; align-items: center; justify-content: center; margin-bottom: 34px; color: rgb(255 255 255 / 58%); font-size: .7rem; }.breadcrumb a:hover { color: white; }.article-category { display: inline-flex; border-radius: 999px; padding: 6px 11px; color: var(--color-primary-strong); background: #dff6ef; font-size: .67rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }.article-header h1 { max-width: 900px; margin: 16px auto; font-family: var(--font-heading); font-size: clamp(2.5rem, 6vw, 5rem); letter-spacing: -.06em; line-height: 1.02; }.article-header > div > p { max-width: 720px; margin: 0 auto; color: rgb(255 255 255 / 70%); font-size: 1.05rem; }.article-meta { display: flex; gap: 11px; align-items: center; justify-content: center; margin-top: 28px; text-align: left; }.author-avatar { display: grid; width: 39px; height: 39px; place-items: center; border-radius: 50%; color: var(--color-primary-strong); background: #dff6ef; font-weight: 850; }.article-meta strong, .article-meta small { display: block; }.article-meta strong { font-size: .72rem; }.article-meta small { color: rgb(255 255 255 / 55%); font-size: .64rem; }.meta-separator { width: 1px; height: 30px; margin: 0 6px; background: rgb(255 255 255 / 18%); }.article-image { margin-top: -93px; }.article-image img { width: 100%; max-height: 620px; border: 8px solid white; border-radius: 28px; object-fit: cover; box-shadow: var(--shadow-md); }.article-layout { display: grid; max-width: 900px; grid-template-columns: 70px 1fr; gap: 35px; margin-top: 60px; }.share-column { position: sticky; top: 105px; display: flex; height: max-content; flex-direction: column; gap: 9px; align-items: center; }.share-column > span { margin-bottom: 3px; color: var(--color-muted); font-size: .62rem; font-weight: 750; text-transform: uppercase; writing-mode: vertical-rl; }.share-column a { display: grid; width: 41px; height: 41px; place-items: center; border: 1px solid var(--color-line); border-radius: 50%; color: var(--color-muted); }.share-column a:hover { color: var(--color-primary); background: var(--color-soft); }.article-body { max-width: 720px; }.article-body > p { margin: 0 0 24px; color: #45524e; font-size: 1.03rem; line-height: 1.9; }.article-body > p:first-child::first-letter { float: left; margin: 8px 8px 0 0; color: var(--color-primary); font-family: var(--font-heading); font-size: 4rem; font-weight: 850; line-height: .7; }.article-body > h2 { margin: 48px 0 15px; font-family: var(--font-heading); font-size: 1.8rem; letter-spacing: -.035em; }.article-body > ul { margin: 4px 0 30px; padding: 0; list-style: none; }.article-body > ul li { position: relative; margin: 11px 0; padding-left: 30px; color: #45524e; }.article-body > ul li::before { position: absolute; top: 7px; left: 0; width: 18px; height: 18px; border-radius: 50%; color: white; background: var(--color-primary); content: '✓'; font-size: .7rem; font-weight: 800; text-align: center; }.article-body blockquote { display: flex; gap: 15px; margin: 38px 0; border-left: 4px solid var(--color-secondary); border-radius: 0 17px 17px 0; padding: 24px; color: var(--color-primary-strong); background: #f4f9f7; }.article-body blockquote svg { flex: 0 0 auto; color: var(--color-secondary); }.article-body blockquote p { margin: 0; font-size: 1.1rem; font-weight: 650; line-height: 1.7; }.article-help { display: grid; grid-template-columns: 50px 1fr auto; gap: 14px; align-items: center; margin-top: 60px; border-radius: 21px; padding: 23px; background: #f4f9f7; }.article-help > span { display: grid; width: 50px; height: 50px; place-items: center; border-radius: 15px; color: var(--color-primary); background: white; }.article-help small { color: var(--color-primary); font-size: .65rem; font-weight: 750; }.article-help h2 { margin: 1px 0; font-size: 1rem; }.article-help p { margin: 0; color: var(--color-muted); font-size: .7rem; }.article-help .button-primary { min-height: 42px; }
@media (max-width: 700px) { .article-header { padding-bottom: 105px; }.article-image { width: calc(100% - 20px); margin-top: -60px; }.article-image img { border-width: 5px; border-radius: 20px; }.article-layout { width: min(100% - 32px, 900px); grid-template-columns: 1fr; margin-top: 42px; }.share-column { position: static; flex-direction: row; }.share-column > span { margin: 0 4px 0 0; writing-mode: horizontal-tb; }.article-help { grid-template-columns: 45px 1fr; }.article-help .button-primary { grid-column: 1 / -1; }.breadcrumb { overflow: hidden; justify-content: flex-start; white-space: nowrap; } }
</style>

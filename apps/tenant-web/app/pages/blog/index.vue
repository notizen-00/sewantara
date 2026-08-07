<script setup lang="ts">
import dayjs from 'dayjs'
import type { ApiResponse, BlogSnippet, Tenant } from '#shared/types'

const { data: postsResponse, status, error, refresh } = await useFetch<ApiResponse<BlogSnippet[]>>('/api/public/blog', { key: 'public-blog' })
const { data: tenantResponse } = await useFetch<ApiResponse<Tenant>>('/api/public/tenant', { key: 'blog-tenant' })
const posts = computed(() => postsResponse.value?.data || [])
const tenant = computed(() => tenantResponse.value?.data)
const featured = computed(() => posts.value[0])
const remaining = computed(() => posts.value.slice(1))

useSeoMeta({
  title: () => `Tips & inspirasi${tenant.value ? ` | ${tenant.value.businessName}` : ''}`,
  description: 'Panduan praktis, inspirasi, dan kabar terbaru untuk membantu Anda memilih kebutuhan sewa dengan lebih percaya diri.',
})
</script>

<template>
  <main class="blog-page">
    <section class="blog-hero section-shell">
      <div class="container-shell"><p class="section-kicker">Ruang inspirasi</p><h1>Tips sederhana untuk hasil yang lebih maksimal</h1><p>Temukan panduan praktis dari tim tenant sebelum memilih, menggunakan, dan mengembalikan produk sewaan.</p></div>
    </section>

    <section class="container-shell articles-shell">
      <div v-if="status === 'pending'" class="posts-loading" aria-live="polite"><div class="skeleton featured-skeleton" ></div><div class="skeleton cards-skeleton" ></div></div>
      <div v-else-if="error" class="state-card surface-card"><UiIcon name="alert-circle" :size="32" /><h2>Artikel belum dapat dimuat</h2><p>Periksa koneksi Anda lalu coba kembali.</p><button class="button-secondary" type="button" @click="refresh()">Coba lagi</button></div>
      <div v-else-if="!posts.length" class="state-card surface-card"><UiIcon name="receipt" :size="32" /><h2>Belum ada artikel</h2><p>Tips dan kabar terbaru akan hadir di sini.</p><NuxtLink to="/catalog" class="button-primary">Jelajahi katalog</NuxtLink></div>

      <template v-else>
        <article v-if="featured" class="featured-post surface-card">
          <NuxtLink :to="`/blog/${featured.slug}`" class="featured-media"><NuxtImg :src="featured.image.url" :alt="featured.image.alt" width="900" height="620" format="webp" sizes="(max-width: 800px) 100vw, 56vw" loading="eager" /></NuxtLink>
          <div class="featured-copy"><span class="post-category">Pilihan editor • {{ featured.category }}</span><h2><NuxtLink :to="`/blog/${featured.slug}`">{{ featured.title }}</NuxtLink></h2><p>{{ featured.excerpt }}</p><div class="post-meta"><span>{{ dayjs(featured.publishedAt).format('D MMM YYYY') }}</span><span>{{ featured.readingTimeMinutes }} menit baca</span></div><NuxtLink :to="`/blog/${featured.slug}`" class="read-link">Baca artikel <UiIcon name="arrow-right" :size="17" /></NuxtLink></div>
        </article>

        <div class="articles-heading"><div><p class="section-kicker">Terbaru</p><h2>Artikel lainnya</h2></div><span>{{ posts.length }} artikel</span></div>
        <div class="posts-grid">
          <article v-for="post in remaining" :key="post.id" class="post-card surface-card">
            <NuxtLink :to="`/blog/${post.slug}`" class="post-media"><NuxtImg :src="post.image.url" :alt="post.image.alt" width="640" height="420" format="webp" loading="lazy" /></NuxtLink>
            <div class="post-copy"><span class="post-category">{{ post.category }}</span><h3><NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink></h3><p>{{ post.excerpt }}</p><div class="post-meta"><span>{{ dayjs(post.publishedAt).format('D MMM YYYY') }}</span><span>{{ post.readingTimeMinutes }} menit</span></div></div>
          </article>
        </div>

        <section class="blog-cta"><div><UiIcon name="sparkles" :size="25" /><p>Masih bingung menentukan pilihan?</p><h2>Ceritakan kebutuhanmu kepada tim {{ tenant?.businessName || 'tenant' }}</h2></div><NuxtLink to="/contact" class="button-primary">Konsultasi gratis <UiIcon name="arrow-right" :size="17" /></NuxtLink></section>
      </template>
    </section>
  </main>
</template>

<style scoped>
.blog-page { min-height: 80vh; padding-bottom: 100px; background: #f7faf8; }.blog-hero { padding-bottom: 120px; color: white; background: var(--color-primary-strong); }.blog-hero .section-kicker { color: #bce8de; }.blog-hero h1 { max-width: 850px; margin: 0; font-family: var(--font-heading); font-size: clamp(2.7rem, 6vw, 5.2rem); letter-spacing: -.06em; line-height: 1; }.blog-hero p:last-child { max-width: 650px; margin: 20px 0 0; color: rgb(255 255 255 / 70%); }.articles-shell { margin-top: -68px; }.featured-post { display: grid; grid-template-columns: 1.15fr .85fr; overflow: hidden; }.featured-media { min-height: 420px; overflow: hidden; }.featured-media img { width: 100%; height: 100%; object-fit: cover; transition: transform 350ms; }.featured-media:hover img { transform: scale(1.02); }.featured-copy { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: clamp(28px, 5vw, 58px); }.post-category { color: var(--color-primary); font-size: .68rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }.featured-copy h2 { margin: 10px 0 12px; font-family: var(--font-heading); font-size: clamp(1.8rem, 3.3vw, 3rem); letter-spacing: -.045em; line-height: 1.08; }.featured-copy > p { margin: 0 0 18px; color: var(--color-muted); font-size: .9rem; }.post-meta { display: flex; gap: 18px; color: var(--color-muted); font-size: .68rem; }.post-meta span + span::before { margin-right: 8px; content: '•'; }.read-link { display: inline-flex; gap: 7px; align-items: center; margin-top: 24px; color: var(--color-primary); font-size: .8rem; font-weight: 800; }.articles-heading { display: flex; align-items: end; justify-content: space-between; margin: 75px 0 24px; }.articles-heading h2 { margin: 0; font-size: 2rem; letter-spacing: -.035em; }.articles-heading > span { color: var(--color-muted); font-size: .75rem; }.posts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }.post-card { overflow: hidden; }.post-media { display: block; aspect-ratio: 1.5; overflow: hidden; }.post-media img { width: 100%; height: 100%; object-fit: cover; transition: transform 300ms; }.post-card:hover .post-media img { transform: scale(1.035); }.post-copy { padding: 20px; }.post-copy h3 { margin: 7px 0 8px; font-size: 1.08rem; line-height: 1.3; }.post-copy > p { display: -webkit-box; margin: 0 0 14px; overflow: hidden; color: var(--color-muted); font-size: .78rem; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }.blog-cta { display: flex; gap: 30px; align-items: center; justify-content: space-between; margin-top: 72px; border-radius: 28px; padding: 38px; color: white; background: var(--color-primary-strong); }.blog-cta svg { color: #bce8de; }.blog-cta p { margin: 7px 0 2px; color: #bce8de; font-size: .72rem; }.blog-cta h2 { max-width: 650px; margin: 0; font-size: clamp(1.45rem, 3vw, 2.3rem); letter-spacing: -.04em; }.blog-cta .button-primary { flex: 0 0 auto; color: var(--color-primary-strong); background: #dff6ef; }.state-card { max-width: 620px; margin: 0 auto; padding: 45px; text-align: center; }.state-card svg { color: var(--color-primary); }.state-card h2 { margin: 13px 0 6px; }.state-card p { margin: 0 0 20px; color: var(--color-muted); }.featured-skeleton { height: 470px; border-radius: 22px; }.cards-skeleton { height: 300px; margin-top: 70px; border-radius: 22px; }
@media (max-width: 860px) { .featured-post { grid-template-columns: 1fr; }.featured-media { min-height: 330px; }.posts-grid { grid-template-columns: repeat(2, 1fr); }.blog-cta { align-items: flex-start; flex-direction: column; } }
@media (max-width: 560px) { .blog-hero { padding-bottom: 90px; }.articles-shell { margin-top: -42px; }.featured-media { min-height: 230px; }.featured-copy { padding: 24px 18px; }.posts-grid { grid-template-columns: 1fr; }.blog-cta { margin-top: 50px; padding: 26px 20px; } }
</style>

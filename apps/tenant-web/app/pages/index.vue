<script setup lang="ts">
import type { ApiResponse, HomePayload } from '~~/shared/types'

type UnknownRecord = Record<string, unknown>

interface CategoryView {
  id: string
  name: string
  slug: string
  description: string
  image: string
  icon: string
  count?: number
}

interface PromotionView {
  id: string
  eyebrow: string
  title: string
  description: string
  image: string
  ctaLabel: string
  ctaUrl: string
}

interface TestimonialView {
  id: string
  name: string
  role: string
  quote: string
  avatar: string
  rating: number
}

interface FaqView {
  id: string
  question: string
  answer: string
}

const route = useRoute()
const requestUrl = useRequestURL()

const { data: response, status, error, refresh } = await useFetch<ApiResponse<HomePayload>>('/api/public/home', {
  key: 'public-home',
  server: true,
})

function text(...values: unknown[]): string {
  const value = values.find(item => typeof item === 'string' && item.trim())
  return typeof value === 'string' ? value : ''
}

const home = computed(() => response.value?.data)
const tenant = computed(() => home.value?.tenant)
const hero = computed(() => home.value?.hero)

const tenantName = computed(() => text(
  tenant.value?.businessName,
  'Sewantara',
))

const heroTitle = computed(() => text(
  hero.value?.title,
  `Sewa jadi lebih mudah bersama ${tenantName.value}`,
))

const heroDescription = computed(() => text(
  hero.value?.description,
  tenant.value?.description,
  'Temukan pilihan terbaik, cek ketersediaan, dan booking langsung secara online.',
))

const heroImage = computed(() => text(
  hero.value?.image.url,
))

const categories = computed<CategoryView[]>(() => (home.value?.categories ?? []).map(category => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  image: category.image.url,
  icon: category.icon || 'grid',
  count: category.productCount,
})))

const featuredProducts = computed(() => home.value?.featuredProducts ?? [])

const promotions = computed<PromotionView[]>(() => home.value?.promotion
  ? [{
      id: home.value.promotion.id,
      eyebrow: home.value.promotion.badge,
      title: home.value.promotion.title,
      description: home.value.promotion.description,
      image: home.value.promotion.image.url,
      ctaLabel: home.value.promotion.action.label,
      ctaUrl: home.value.promotion.action.href,
    }]
  : [])

const testimonials = computed<TestimonialView[]>(() => (home.value?.testimonials ?? []).map(testimonial => ({
  id: testimonial.id,
  name: testimonial.customerName,
  role: testimonial.productName,
  quote: testimonial.quote,
  avatar: testimonial.customerAvatar?.url ?? '',
  rating: testimonial.rating,
})))

const faqs = computed<FaqView[]>(() => home.value?.faqs ?? [])

const cta = computed(() => ({
  eyebrow: `Booking online di ${tenantName.value}`,
  title: `Sudah menemukan pilihan yang tepat?`,
  description: 'Cek ketersediaan dan selesaikan booking dalam beberapa langkah yang transparan.',
  primaryUrl: '/catalog',
  primaryLabel: 'Mulai jelajahi',
}))

const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')

function submitSearch() {
  const query = searchQuery.value.trim()
  return navigateTo({
    path: '/catalog',
    query: query ? { q: query } : undefined,
  })
}

const seoTitle = computed(() => text(
  tenant.value?.seo.title,
  `${tenantName.value} — Booking online dengan mudah`,
))
const seoDescription = computed(() => text(
  tenant.value?.seo.description,
  heroDescription.value,
))
const seoImage = computed(() => text(
  tenant.value?.seo.ogImage,
  heroImage.value,
  tenant.value?.theme.logo.url,
))
const canonicalUrl = computed(() => new URL('/', requestUrl.origin).toString())

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  ogImage: () => seoImage.value || undefined,
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => seoImage.value || undefined,
})

const structuredData = computed(() => {
  const contact = tenant.value?.contact
  const socialLinks = [contact?.instagram, contact?.facebook, contact?.tiktok].filter(Boolean)

  const schemas: UnknownRecord[] = [
    {
      '@type': 'LocalBusiness',
      '@id': `${canonicalUrl.value}#business`,
      name: tenantName.value,
      url: canonicalUrl.value,
      description: seoDescription.value,
      image: seoImage.value || undefined,
      telephone: contact?.phone || undefined,
      email: contact?.email || undefined,
      address: contact?.address || undefined,
      sameAs: socialLinks.length ? socialLinks : undefined,
    },
    {
      '@type': 'WebSite',
      '@id': `${canonicalUrl.value}#website`,
      name: tenantName.value,
      url: canonicalUrl.value,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${new URL('/catalog', requestUrl.origin).toString()}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  if (faqs.value.length) {
    schemas.push({
      '@type': 'FAQPage',
      mainEntity: faqs.value.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    })
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas,
  }).replace(/</g, '\\u003c')
})

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [{
    key: 'home-structured-data',
    type: 'application/ld+json',
    innerHTML: structuredData.value,
  }],
}))
</script>

<template>
  <main class="home-page">
    <section v-if="status === 'pending'" class="home-state container-shell" aria-live="polite">
      <span class="state-spinner" aria-hidden="true" ></span>
      <p>Menyiapkan halaman untuk Anda…</p>
    </section>

    <section v-else-if="error" class="home-state container-shell" role="alert">
      <span class="state-icon">
        <UiIcon name="package" />
      </span>
      <h1>Halaman belum dapat dimuat</h1>
      <p>Koneksi ke layanan sedang terganggu. Silakan coba beberapa saat lagi.</p>
      <button type="button" class="button-primary" @click="refresh()">
        <UiIcon name="arrow-right" />
        Coba lagi
      </button>
    </section>

    <template v-else>
      <section class="hero-section" :class="{ 'has-image': heroImage }">
        <div v-if="heroImage" class="hero-media" aria-hidden="true">
          <NuxtImg
            :src="heroImage"
            :alt="hero?.image.alt || ''"
            width="1600"
            height="980"
            sizes="100vw"
            preload
          />
        </div>
        <div class="hero-overlay" aria-hidden="true" ></div>
        <div class="hero-inner container-shell">
          <div class="hero-copy">
            <p class="hero-eyebrow">
              <UiIcon name="star" />
              {{ hero?.eyebrow || 'Booking praktis, pilihan terpercaya' }}
            </p>
            <h1>{{ heroTitle }}</h1>
            <p class="hero-description">{{ heroDescription }}</p>

            <form class="hero-search" role="search" @submit.prevent="submitSearch">
              <label class="sr-only" for="home-search">Cari produk atau layanan</label>
              <UiIcon class="search-icon" name="search" aria-hidden="true" />
              <input
                id="home-search"
                v-model="searchQuery"
                type="search"
                name="q"
                autocomplete="off"
                placeholder="Apa yang ingin Anda booking?"
              />
              <button type="submit">Cari sekarang</button>
            </form>

            <div class="hero-actions">
              <NuxtLink class="button-primary" :to="hero?.primaryAction.href || '/catalog'">
                {{ hero?.primaryAction.label || 'Jelajahi katalog' }}
                <UiIcon name="external-link" />
              </NuxtLink>
              <NuxtLink
                v-if="hero?.secondaryAction"
                class="button-hero-secondary"
                :to="hero.secondaryAction.href"
                :target="hero.secondaryAction.external ? '_blank' : undefined"
                :rel="hero.secondaryAction.external ? 'noopener noreferrer' : undefined"
              >
                {{ hero.secondaryAction.label }}
              </NuxtLink>
            </div>
          </div>

          <div v-if="hero?.trustPoints.length" class="hero-trust" aria-label="Keunggulan layanan">
            <div v-for="point in hero.trustPoints" :key="point">
              <UiIcon name="check" />
              <span>{{ point }}</span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="categories.length" class="section-shell categories-section">
        <div class="container-shell">
          <div class="section-heading-row">
            <div>
              <p class="section-kicker">Jelajahi pilihan</p>
              <h2 class="section-title">Temukan berdasarkan kategori</h2>
              <p class="section-copy">Mulai dari kategori yang paling sesuai dengan kebutuhan Anda.</p>
            </div>
            <NuxtLink class="text-link" to="/catalog">
              Lihat semua
              <UiIcon name="arrow-right" />
            </NuxtLink>
          </div>

          <div class="category-grid">
            <NuxtLink
              v-for="category in categories"
              :key="category.id"
              class="category-card"
              :to="{ path: '/catalog', query: { category: category.slug } }"
            >
              <NuxtImg
                v-if="category.image"
                :src="category.image"
                :alt="category.name"
                width="560"
                height="420"
                sizes="(max-width: 640px) 86vw, (max-width: 1024px) 42vw, 25vw"
                loading="lazy"
              />
              <div v-else class="category-placeholder" aria-hidden="true">
                <UiIcon :name="category.icon" />
              </div>
              <div class="category-shade" aria-hidden="true" ></div>
              <div class="category-content">
                <p v-if="category.count !== undefined">{{ category.count }} pilihan</p>
                <h3>{{ category.name }}</h3>
                <span>
                  Jelajahi
                  <UiIcon name="external-link" />
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="section-shell featured-section">
        <div class="container-shell">
          <div class="section-heading-row">
            <div>
              <p class="section-kicker">Pilihan unggulan</p>
              <h2 class="section-title">Sering dipilih pelanggan</h2>
              <p class="section-copy">Pilihan populer dengan informasi harga dan ketersediaan yang mudah dipahami.</p>
            </div>
            <NuxtLink class="text-link" to="/catalog">
              Buka katalog
              <UiIcon name="arrow-right" />
            </NuxtLink>
          </div>

          <div v-if="featuredProducts.length" class="product-grid">
            <ProductCard
              v-for="product in featuredProducts"
              :key="text(product.id, product.slug)"
              :product="product"
              :show-favorite="false"
            />
          </div>
          <div v-else class="inline-empty">
            <UiIcon name="package" />
            <p>Produk unggulan akan segera tersedia.</p>
            <NuxtLink class="button-secondary" to="/catalog">Lihat katalog</NuxtLink>
          </div>
        </div>
      </section>

      <section v-if="promotions.length" class="section-shell promotions-section">
        <div class="container-shell">
          <p class="section-kicker">Penawaran spesial</p>
          <h2 class="section-title">Lebih hemat untuk rencana Anda</h2>

          <div class="promotion-list">
            <article v-for="promotion in promotions" :key="promotion.id" class="promotion-card">
              <NuxtImg
                v-if="promotion.image"
                :src="promotion.image"
                :alt="promotion.title"
                width="1200"
                height="600"
                sizes="(max-width: 800px) 92vw, 58vw"
                loading="lazy"
              />
              <div class="promotion-gradient" aria-hidden="true" ></div>
              <div class="promotion-content">
                <p>{{ promotion.eyebrow }}</p>
                <h3>{{ promotion.title }}</h3>
                <span>{{ promotion.description }}</span>
                <NuxtLink class="promotion-link" :to="promotion.ctaUrl">
                  {{ promotion.ctaLabel }}
                  <UiIcon name="arrow-right" />
                </NuxtLink>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-if="testimonials.length" class="section-shell testimonial-section">
        <div class="container-shell testimonial-layout">
          <div class="testimonial-intro">
            <p class="section-kicker">Cerita pelanggan</p>
            <h2 class="section-title">Pengalaman yang membuat mereka kembali</h2>
            <p class="section-copy">Ulasan nyata membantu Anda memilih dengan lebih yakin.</p>
          </div>
          <div class="testimonial-grid">
            <figure v-for="testimonial in testimonials.slice(0, 4)" :key="testimonial.id" class="testimonial-card">
              <RatingStars :rating="testimonial.rating" />
              <blockquote>“{{ testimonial.quote }}”</blockquote>
              <figcaption>
                <NuxtImg
                  v-if="testimonial.avatar"
                  :src="testimonial.avatar"
                  :alt="testimonial.name"
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <span v-else class="avatar-fallback" aria-hidden="true">{{ testimonial.name.slice(0, 1) }}</span>
                <span>
                  <strong>{{ testimonial.name }}</strong>
                  <small v-if="testimonial.role">{{ testimonial.role }}</small>
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section v-if="faqs.length" class="section-shell faq-section">
        <div class="container-shell faq-layout">
          <div>
            <p class="section-kicker">Pertanyaan umum</p>
            <h2 class="section-title">Yang perlu Anda ketahui sebelum booking</h2>
            <p class="section-copy">Belum menemukan jawaban? Tim kami siap membantu.</p>
            <NuxtLink class="button-secondary faq-contact" to="/contact">
              Hubungi kami
              <UiIcon name="mail" />
            </NuxtLink>
          </div>
          <div class="faq-list">
            <details v-for="(faq, index) in faqs" :key="faq.id" :open="index === 0">
              <summary>
                <span>{{ faq.question }}</span>
                <UiIcon name="plus" />
              </summary>
              <p>{{ faq.answer }}</p>
            </details>
          </div>
        </div>
      </section>

      <section class="cta-section section-shell">
        <div class="cta-panel container-shell">
          <div class="cta-orb cta-orb-one" aria-hidden="true" ></div>
          <div class="cta-orb cta-orb-two" aria-hidden="true" ></div>
          <div class="cta-copy">
            <p>{{ cta.eyebrow }}</p>
            <h2>{{ cta.title }}</h2>
            <span>{{ cta.description }}</span>
          </div>
          <div class="cta-actions">
            <NuxtLink class="cta-primary" :to="cta.primaryUrl">
              {{ cta.primaryLabel }}
              <UiIcon name="external-link" />
            </NuxtLink>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.home-page {
  min-height: 70vh;
  background: var(--color-surface);
}

.home-state {
  display: grid;
  min-height: 62vh;
  place-items: center;
  align-content: center;
  gap: 14px;
  padding-block: 80px;
  text-align: center;
}

.home-state h1,
.home-state p {
  margin: 0;
}

.home-state p {
  max-width: 480px;
  color: var(--color-muted);
}

.state-spinner {
  width: 34px;
  height: 34px;
  border: 3px solid var(--color-line);
  border-top-color: var(--color-primary);
  border-radius: 999px;
  animation: spin 800ms linear infinite;
}

.state-icon {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 18px;
  color: var(--color-primary);
  background: var(--color-soft);
  font-size: 1.45rem;
}

.hero-section {
  position: relative;
  isolation: isolate;
  display: flex;
  min-height: min(790px, calc(100svh - 30px));
  align-items: center;
  overflow: hidden;
  color: white;
  background:
    radial-gradient(circle at 78% 15%, color-mix(in srgb, var(--color-secondary) 30%, transparent), transparent 34%),
    linear-gradient(135deg, var(--color-primary-strong), var(--color-primary));
}

.hero-media,
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: -2;
}

.hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  z-index: -1;
  background: linear-gradient(90deg, rgb(9 26 23 / 94%) 0%, rgb(9 26 23 / 78%) 48%, rgb(9 26 23 / 23%) 100%);
}

.hero-section:not(.has-image)::after {
  position: absolute;
  z-index: -1;
  width: 480px;
  height: 480px;
  border: 1px solid rgb(255 255 255 / 14%);
  border-radius: 50%;
  content: '';
  inset: auto -80px -80px auto;
  box-shadow: 0 0 0 70px rgb(255 255 255 / 4%), 0 0 0 140px rgb(255 255 255 / 3%);
}

.hero-inner {
  padding-block: clamp(105px, 15vw, 170px) 70px;
}

.hero-copy {
  max-width: 760px;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px;
  border: 1px solid rgb(255 255 255 / 24%);
  border-radius: 999px;
  padding: 8px 13px;
  background: rgb(255 255 255 / 10%);
  font-size: 0.8rem;
  font-weight: 750;
  backdrop-filter: blur(12px);
}

.hero-copy h1 {
  max-width: 720px;
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(3rem, 7vw, 6.1rem);
  font-weight: 850;
  letter-spacing: -0.065em;
  line-height: 0.96;
  text-wrap: balance;
}

.hero-description {
  max-width: 650px;
  margin: 26px 0 0;
  color: rgb(255 255 255 / 78%);
  font-size: clamp(1rem, 2vw, 1.24rem);
}

.hero-search {
  display: grid;
  max-width: 680px;
  min-height: 66px;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  margin-top: 35px;
  border: 1px solid rgb(255 255 255 / 35%);
  border-radius: 999px;
  padding: 7px 8px 7px 20px;
  color: var(--color-ink);
  background: white;
  box-shadow: 0 24px 70px rgb(0 0 0 / 20%);
}

.hero-search .search-icon {
  color: var(--color-primary);
  font-size: 1.22rem;
}

.hero-search input {
  min-width: 0;
  height: 48px;
  border: 0;
  outline: 0;
  background: transparent;
}

.hero-search button {
  min-height: 50px;
  border: 0;
  border-radius: 999px;
  padding-inline: 24px;
  color: white;
  background: var(--color-primary);
  font-weight: 800;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.hero-actions .button-primary {
  color: var(--color-primary-strong);
  background: white;
  box-shadow: none;
}

.hero-actions .button-primary:hover {
  color: white;
  background: var(--color-primary);
}

.button-hero-secondary {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 999px;
  padding-inline: 21px;
  background: rgb(255 255 255 / 8%);
  font-weight: 750;
}

.hero-trust {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
  margin-top: 52px;
  color: rgb(255 255 255 / 74%);
  font-size: 0.86rem;
}

.hero-trust div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-trust svg {
  color: color-mix(in srgb, var(--color-secondary) 65%, white);
  font-size: 1.1rem;
}

.section-heading-row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 38px;
}

.text-link {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
  padding-block: 10px;
  color: var(--color-primary);
  font-weight: 800;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.category-card {
  position: relative;
  min-height: 330px;
  overflow: hidden;
  border-radius: var(--radius-md);
  color: white;
  background: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.category-card img,
.category-placeholder,
.category-shade {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
}

.category-card img {
  object-fit: cover;
  transition: transform 420ms ease;
}

.category-card:hover img {
  transform: scale(1.045);
}

.category-placeholder {
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, var(--color-primary), var(--color-primary-strong));
  font-size: 4rem;
  opacity: 0.8;
}

.category-shade {
  background: linear-gradient(180deg, transparent 20%, rgb(4 18 16 / 88%));
}

.category-content {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 25px;
}

.category-content p {
  margin: 0 0 3px;
  color: rgb(255 255 255 / 68%);
  font-size: 0.78rem;
}

.category-content h3 {
  margin: 0;
  font-size: 1.42rem;
  letter-spacing: -0.025em;
}

.category-content span {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 13px;
  font-size: 0.82rem;
  font-weight: 750;
}

.featured-section,
.testimonial-section {
  background: var(--color-soft);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 23px;
}

.inline-empty {
  display: grid;
  min-height: 260px;
  place-items: center;
  align-content: center;
  gap: 13px;
  border: 1px dashed var(--color-line);
  border-radius: var(--radius-md);
  color: var(--color-muted);
  text-align: center;
}

.inline-empty > svg {
  color: var(--color-primary);
  font-size: 2rem;
}

.inline-empty p {
  margin: 0;
}

.promotions-section {
  overflow: hidden;
}

.promotion-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 460px), 1fr));
  gap: 24px;
  margin-top: 38px;
}

.promotion-card {
  position: relative;
  isolation: isolate;
  min-height: 430px;
  overflow: hidden;
  border-radius: var(--radius-lg);
  color: white;
  background: var(--color-primary-strong);
}

.promotion-card img,
.promotion-gradient {
  position: absolute;
  z-index: -2;
  width: 100%;
  height: 100%;
  inset: 0;
}

.promotion-card img {
  object-fit: cover;
}

.promotion-gradient {
  z-index: -1;
  background: linear-gradient(90deg, rgb(6 24 21 / 95%), rgb(6 24 21 / 55%) 72%, rgb(6 24 21 / 12%));
}

.promotion-content {
  display: flex;
  min-height: 430px;
  max-width: 550px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: clamp(28px, 5vw, 54px);
}

.promotion-content > p {
  margin: 0 0 10px;
  color: color-mix(in srgb, var(--color-secondary) 65%, white);
  font-size: 0.76rem;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.promotion-content h3 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.3rem);
  letter-spacing: -0.045em;
  line-height: 1.05;
}

.promotion-content > span {
  margin-top: 14px;
  color: rgb(255 255 255 / 74%);
}

.promotion-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 25px;
  border-radius: 999px;
  padding: 12px 18px;
  color: var(--color-primary-strong);
  background: white;
  font-weight: 800;
}

.testimonial-layout,
.faq-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(42px, 8vw, 100px);
}

.testimonial-intro {
  align-self: center;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
}

.testimonial-card {
  margin: 0;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 25px;
  background: white;
  box-shadow: var(--shadow-sm);
}

.testimonial-card blockquote {
  margin: 18px 0 25px;
  font-size: 1rem;
  line-height: 1.7;
}

.testimonial-card figcaption {
  display: flex;
  align-items: center;
  gap: 11px;
}

.testimonial-card figcaption img,
.avatar-fallback {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-fallback {
  display: grid;
  place-items: center;
  color: white;
  background: var(--color-primary);
  font-weight: 800;
}

.testimonial-card figcaption > span:last-child {
  display: grid;
}

.testimonial-card strong {
  font-size: 0.88rem;
}

.testimonial-card small {
  color: var(--color-muted);
}

.faq-layout {
  align-items: start;
}

.faq-contact {
  margin-top: 27px;
}

.faq-list {
  border-top: 1px solid var(--color-line);
}

.faq-list details {
  border-bottom: 1px solid var(--color-line);
}

.faq-list summary {
  display: flex;
  min-height: 78px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-block: 20px;
  font-size: 1.03rem;
  font-weight: 800;
  list-style: none;
}

.faq-list summary::-webkit-details-marker {
  display: none;
}

.faq-list summary svg {
  flex: 0 0 auto;
  color: var(--color-primary);
  transition: transform 180ms ease;
}

.faq-list details[open] summary svg {
  transform: rotate(45deg);
}

.faq-list details p {
  margin: -5px 44px 25px 0;
  color: var(--color-muted);
}

.cta-section {
  padding-top: 0;
}

.cta-panel {
  position: relative;
  isolation: isolate;
  display: flex;
  min-height: 350px;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  overflow: hidden;
  border-radius: var(--radius-lg);
  padding: clamp(34px, 7vw, 78px);
  color: white;
  background: linear-gradient(135deg, var(--color-primary-strong), var(--color-primary));
}

.cta-orb {
  position: absolute;
  z-index: -1;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 50%;
}

.cta-orb-one {
  width: 340px;
  height: 340px;
  top: -170px;
  right: 20%;
}

.cta-orb-two {
  width: 280px;
  height: 280px;
  right: -80px;
  bottom: -150px;
  box-shadow: 0 0 0 60px rgb(255 255 255 / 4%);
}

.cta-copy {
  max-width: 670px;
}

.cta-copy > p {
  margin: 0 0 12px;
  color: color-mix(in srgb, var(--color-secondary) 60%, white);
  font-size: 0.77rem;
  font-weight: 850;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.cta-copy h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.5rem);
  letter-spacing: -0.05em;
  line-height: 1.04;
}

.cta-copy > span {
  display: block;
  max-width: 590px;
  margin-top: 17px;
  color: rgb(255 255 255 / 70%);
}

.cta-actions {
  display: grid;
  flex: 0 0 auto;
  gap: 10px;
}

.cta-primary,
.cta-secondary {
  display: inline-flex;
  min-height: 52px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid white;
  border-radius: 999px;
  padding-inline: 22px;
  font-weight: 800;
}

.cta-primary {
  color: var(--color-primary-strong);
  background: white;
}

.cta-secondary {
  border-color: rgb(255 255 255 / 30%);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 980px) {
  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .testimonial-layout,
  .faq-layout {
    grid-template-columns: 1fr;
    gap: 46px;
  }

  .cta-panel {
    align-items: flex-start;
    flex-direction: column;
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .hero-section {
    min-height: 720px;
  }

  .hero-overlay {
    background: linear-gradient(180deg, rgb(9 26 23 / 87%), rgb(9 26 23 / 83%));
  }

  .hero-copy h1 {
    font-size: clamp(2.7rem, 14vw, 4.2rem);
  }

  .hero-search {
    grid-template-columns: auto 1fr;
    border-radius: 22px;
    padding: 8px 8px 8px 16px;
  }

  .hero-search button {
    grid-column: 1 / -1;
    width: 100%;
  }

  .hero-trust {
    display: grid;
    margin-top: 34px;
  }

  .section-heading-row {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 28px;
  }

  .category-grid,
  .product-grid,
  .testimonial-grid {
    grid-template-columns: 1fr;
  }

  .category-card {
    min-height: 280px;
  }

  .promotion-card,
  .promotion-content {
    min-height: 390px;
  }

  .cta-panel {
    border-radius: 24px;
  }

  .cta-actions,
  .cta-primary,
  .cta-secondary {
    width: 100%;
  }
}
</style>

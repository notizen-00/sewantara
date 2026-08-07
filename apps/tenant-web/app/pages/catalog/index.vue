<script setup lang="ts">
import type {
  ApiResponse,
  CatalogQuery,
  CatalogResponse,
  PaginationMeta,
  Product,
} from '~~/shared/types'
import { useTenant } from '~/composables/useTenant'

type SortValue = NonNullable<CatalogQuery['sort']>

const route = useRoute()
const router = useRouter()
const requestUrl = useRequestURL()
const { tenant } = useTenant()

function queryText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function isSortValue(value: string): value is SortValue {
  return ['recommended', 'price_asc', 'price_desc', 'rating', 'newest'].includes(value)
}

const activeSearch = computed(() => queryText(route.query.q))
const activeCategory = computed(() => queryText(route.query.category))
const activeSort = computed<SortValue>(() => {
  const value = queryText(route.query.sort)
  return isSortValue(value) ? value : 'recommended'
})
const activeStartDate = computed(() => queryText(route.query.startDate))
const activeEndDate = computed(() => queryText(route.query.endDate))
const activeLocation = computed(() => queryText(route.query.location))

const apiQuery = computed<CatalogQuery>(() => ({
  search: activeSearch.value || undefined,
  category: activeCategory.value || undefined,
  sort: activeSort.value,
  page: 1,
  perPage: 12,
  startDate: activeStartDate.value || undefined,
  endDate: activeEndDate.value || undefined,
  locationId: activeLocation.value || undefined,
}))

const { data: response, status, error, refresh } = await useAsyncData(
  'public-catalog-first-page',
  () => $fetch<ApiResponse<CatalogResponse>>('/api/public/catalog', { query: apiQuery.value }),
  {
    watch: [apiQuery],
  },
)

const products = ref<Product[]>([])
const pagination = ref<PaginationMeta | null>(null)
const loadingMore = ref(false)
const loadMoreError = ref('')

watch(() => response.value?.data, (catalog) => {
  products.value = catalog?.products ?? []
  pagination.value = catalog?.pagination ?? null
  loadMoreError.value = ''
}, { immediate: true })

const categories = computed(() => response.value?.data.categories ?? [])
const locations = computed(() => tenant.value.locations)
const hasMore = computed(() => Boolean(pagination.value?.hasNextPage))
const totalResults = computed(() => pagination.value?.total ?? products.value.length)

async function loadMore() {
  if (!pagination.value?.hasNextPage || loadingMore.value) return

  loadingMore.value = true
  loadMoreError.value = ''
  const requestSignature = JSON.stringify(apiQuery.value)

  try {
    const nextPage = pagination.value.page + 1
    const result = await $fetch<ApiResponse<CatalogResponse>>('/api/public/catalog', {
      query: {
        ...apiQuery.value,
        page: nextPage,
      },
    })
    if (requestSignature !== JSON.stringify(apiQuery.value)) return
    const knownIds = new Set(products.value.map(product => product.id))
    products.value.push(...result.data.products.filter(product => !knownIds.has(product.id)))
    pagination.value = result.data.pagination
  }
  catch {
    loadMoreError.value = 'Produk berikutnya belum dapat dimuat. Silakan coba lagi.'
  }
  finally {
    loadingMore.value = false
  }
}

const draftSearch = ref(activeSearch.value)
const draftCategory = ref(activeCategory.value)
const draftSort = ref<SortValue>(activeSort.value)
const draftStartDate = ref(activeStartDate.value)
const draftEndDate = ref(activeEndDate.value)
const draftLocation = ref(activeLocation.value)
const filtersOpen = ref(false)

watch(() => route.fullPath, () => {
  draftSearch.value = activeSearch.value
  draftCategory.value = activeCategory.value
  draftSort.value = activeSort.value
  draftStartDate.value = activeStartDate.value
  draftEndDate.value = activeEndDate.value
  draftLocation.value = activeLocation.value
  filtersOpen.value = false
})

function cleanQuery(query: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(query).filter(([, value]) => value))
}

async function applyFilters() {
  if (draftStartDate.value && draftEndDate.value && draftEndDate.value < draftStartDate.value) {
    draftEndDate.value = draftStartDate.value
  }
  await router.push({
    path: '/catalog',
    query: cleanQuery({
      q: draftSearch.value.trim(),
      category: draftCategory.value,
      sort: draftSort.value === 'recommended' ? '' : draftSort.value,
      startDate: draftStartDate.value,
      endDate: draftEndDate.value,
      location: draftLocation.value,
    }),
  })
}

async function clearFilters() {
  draftSearch.value = ''
  draftCategory.value = ''
  draftSort.value = 'recommended'
  draftStartDate.value = ''
  draftEndDate.value = ''
  draftLocation.value = ''
  await router.push('/catalog')
}

async function removeFilter(name: 'q' | 'category' | 'date' | 'location' | 'sort') {
  if (name === 'q') draftSearch.value = ''
  if (name === 'category') draftCategory.value = ''
  if (name === 'date') {
    draftStartDate.value = ''
    draftEndDate.value = ''
  }
  if (name === 'location') draftLocation.value = ''
  if (name === 'sort') draftSort.value = 'recommended'
  await applyFilters()
}

const activeCategoryName = computed(() => categories.value.find(category => category.slug === activeCategory.value)?.name ?? '')
const activeLocationName = computed(() => locations.value.find(location => location.id === activeLocation.value)?.name ?? '')
const hasActiveFilters = computed(() => Boolean(
  activeSearch.value
  || activeCategory.value
  || activeStartDate.value
  || activeEndDate.value
  || activeLocation.value
  || activeSort.value !== 'recommended',
))

const sortOptions: Array<{ value: SortValue; label: string }> = [
  { value: 'recommended', label: 'Paling direkomendasikan' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'rating', label: 'Rating tertinggi' },
  { value: 'price_asc', label: 'Harga terendah' },
  { value: 'price_desc', label: 'Harga tertinggi' },
]

const pageTitle = computed(() => activeCategoryName.value
  ? `${activeCategoryName.value} — Katalog ${tenant.value.businessName}`
  : `Katalog ${tenant.value.businessName}`)
const pageDescription = computed(() => activeCategoryName.value
  ? `Jelajahi pilihan ${activeCategoryName.value} di ${tenant.value.businessName}, cek harga dan ketersediaannya secara online.`
  : `Jelajahi katalog ${tenant.value.businessName}, bandingkan pilihan, cek harga dan ketersediaan secara online.`)
const filteredForRobots = computed(() => Boolean(
  activeSearch.value
  || activeStartDate.value
  || activeEndDate.value
  || activeLocation.value
  || activeSort.value !== 'recommended',
))
const canonicalUrl = computed(() => {
  const url = new URL('/catalog', requestUrl.origin)
  if (activeCategory.value) url.searchParams.set('category', activeCategory.value)
  return url.toString()
})

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  robots: () => filteredForRobots.value ? 'noindex,follow' : 'index,follow',
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  ogImage: () => tenant.value.seo.ogImage || undefined,
  twitterCard: 'summary_large_image',
})

const structuredData = computed(() => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: pageTitle.value,
  description: pageDescription.value,
  url: canonicalUrl.value,
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: products.value.length,
    itemListElement: products.value.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: new URL(`/catalog/${encodeURIComponent(product.slug)}`, requestUrl.origin).toString(),
      name: product.name,
    })),
  },
}).replace(/</g, '\\u003c'))

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [{
    key: 'catalog-structured-data',
    type: 'application/ld+json',
    innerHTML: structuredData.value,
  }],
}))
</script>

<template>
  <main class="catalog-page">
    <header class="catalog-hero">
      <div class="container-shell catalog-hero__inner">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <NuxtLink to="/">Beranda</NuxtLink>
          <UiIcon name="chevron-right" :size="14" />
          <span aria-current="page">Katalog</span>
        </nav>
        <div class="catalog-hero__copy">
          <p class="section-kicker">Katalog pilihan</p>
          <h1>{{ activeCategoryName || 'Temukan yang Anda butuhkan' }}</h1>
          <p>Cari, bandingkan, dan cek ketersediaan sebelum Anda booking.</p>
        </div>

        <form class="catalog-search" role="search" @submit.prevent="applyFilters">
          <UiIcon name="search" :size="21" />
          <label class="sr-only" for="catalog-search">Cari katalog</label>
          <input
            id="catalog-search"
            v-model="draftSearch"
            name="q"
            type="search"
            autocomplete="off"
            placeholder="Cari produk atau layanan…"
          />
          <button type="submit">Cari</button>
        </form>
      </div>
    </header>

    <div class="container-shell catalog-layout">
      <button
        type="button"
        class="mobile-filter-button"
        :aria-expanded="filtersOpen"
        aria-controls="catalog-filters"
        @click="filtersOpen = !filtersOpen"
      >
        <UiIcon name="grid" />
        Filter & urutkan
        <span v-if="hasActiveFilters" class="filter-dot" aria-label="Filter aktif" ></span>
      </button>

      <aside id="catalog-filters" class="filter-panel" :class="{ 'filter-panel--open': filtersOpen }">
        <div class="filter-panel__heading">
          <div>
            <span>Sesuaikan pilihan</span>
            <h2>Filter katalog</h2>
          </div>
          <button type="button" class="filter-close" aria-label="Tutup filter" @click="filtersOpen = false">
            <UiIcon name="x" />
          </button>
        </div>

        <form @submit.prevent="applyFilters">
          <div class="filter-group">
            <label class="form-label" for="filter-category">Kategori</label>
            <div class="select-wrap">
              <select id="filter-category" v-model="draftCategory" class="form-control">
                <option value="">Semua kategori</option>
                <option v-for="category in categories" :key="category.id" :value="category.slug">
                  {{ category.name }} ({{ category.productCount }})
                </option>
              </select>
              <UiIcon name="chevron-down" :size="16" />
            </div>
          </div>

          <fieldset class="filter-group">
            <legend>Ketersediaan</legend>
            <label class="date-label" for="filter-start-date">
              Mulai
              <input id="filter-start-date" v-model="draftStartDate" class="form-control" type="date"/>
            </label>
            <label class="date-label" for="filter-end-date">
              Selesai
              <input id="filter-end-date" v-model="draftEndDate" class="form-control" type="date" :min="draftStartDate || undefined"/>
            </label>
          </fieldset>

          <div v-if="locations.length > 1" class="filter-group">
            <label class="form-label" for="filter-location">Lokasi</label>
            <div class="select-wrap">
              <select id="filter-location" v-model="draftLocation" class="form-control">
                <option value="">Semua lokasi</option>
                <option v-for="location in locations" :key="location.id" :value="location.id">
                  {{ location.name }}<template v-if="location.city"> · {{ location.city }}</template>
                </option>
              </select>
              <UiIcon name="chevron-down" :size="16" />
            </div>
          </div>

          <div class="filter-group">
            <label class="form-label" for="filter-sort">Urutkan</label>
            <div class="select-wrap">
              <select id="filter-sort" v-model="draftSort" class="form-control">
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <UiIcon name="chevron-down" :size="16" />
            </div>
          </div>

          <div class="filter-actions">
            <button type="submit" class="button-primary button-block">Terapkan filter</button>
            <button v-if="hasActiveFilters" type="button" class="button-ghost button-block" @click="clearFilters">
              Hapus semua
            </button>
          </div>
        </form>
      </aside>

      <section class="catalog-results" aria-labelledby="catalog-results-heading">
        <div class="results-heading">
          <div>
            <p class="results-count" aria-live="polite">{{ totalResults }} pilihan ditemukan</p>
            <h2 id="catalog-results-heading">{{ activeSearch ? `Hasil untuk “${activeSearch}”` : activeCategoryName || 'Semua pilihan' }}</h2>
          </div>
          <div class="desktop-sort">
            <label class="sr-only" for="desktop-sort">Urutkan katalog</label>
            <select id="desktop-sort" v-model="draftSort" class="form-control" @change="applyFilters">
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="hasActiveFilters" class="active-filters" aria-label="Filter aktif">
          <button v-if="activeSearch" type="button" @click="removeFilter('q')">
            “{{ activeSearch }}” <UiIcon name="x" :size="13" />
          </button>
          <button v-if="activeCategory" type="button" @click="removeFilter('category')">
            {{ activeCategoryName || activeCategory }} <UiIcon name="x" :size="13" />
          </button>
          <button v-if="activeStartDate || activeEndDate" type="button" @click="removeFilter('date')">
            {{ activeStartDate || 'Tanggal' }}<template v-if="activeEndDate"> – {{ activeEndDate }}</template>
            <UiIcon name="x" :size="13" />
          </button>
          <button v-if="activeLocation" type="button" @click="removeFilter('location')">
            {{ activeLocationName || 'Lokasi' }} <UiIcon name="x" :size="13" />
          </button>
          <button v-if="activeSort !== 'recommended'" type="button" @click="removeFilter('sort')">
            {{ sortOptions.find(option => option.value === activeSort)?.label }} <UiIcon name="x" :size="13" />
          </button>
          <button type="button" class="clear-filter-link" @click="clearFilters">Hapus semua</button>
        </div>

        <div v-if="status === 'pending' && !products.length" class="catalog-grid" aria-label="Memuat katalog" aria-busy="true">
          <div v-for="index in 6" :key="index" class="product-skeleton surface-card">
            <span class="skeleton product-skeleton__image" ></span>
            <span class="skeleton product-skeleton__line product-skeleton__line--short" ></span>
            <span class="skeleton product-skeleton__line" ></span>
            <span class="skeleton product-skeleton__line product-skeleton__line--medium" ></span>
          </div>
        </div>

        <div v-else-if="error" class="results-state" role="alert">
          <span class="results-state__icon"><UiIcon name="package" :size="28" /></span>
          <h2>Katalog belum dapat dimuat</h2>
          <p>Koneksi ke layanan sedang terganggu. Filter Anda tetap tersimpan.</p>
          <button type="button" class="button-primary" @click="refresh()">
            Coba lagi <UiIcon name="arrow-right" />
          </button>
        </div>

        <div v-else-if="!products.length" class="results-state">
          <span class="results-state__icon"><UiIcon name="search" :size="28" /></span>
          <h2>Belum ada pilihan yang cocok</h2>
          <p>Coba ubah kata pencarian, tanggal, atau kategori untuk melihat pilihan lainnya.</p>
          <button type="button" class="button-secondary" @click="clearFilters">Atur ulang filter</button>
        </div>

        <template v-else>
          <div class="catalog-grid" :class="{ 'catalog-grid--refreshing': status === 'pending' }">
            <ProductCard
              v-for="(product, index) in products"
              :key="product.id"
              :product="product"
              :eager="index < 3"
              :show-favorite="false"
            />
          </div>

          <div class="load-more-area">
            <p>{{ products.length }} dari {{ totalResults }} pilihan ditampilkan</p>
            <div class="progress-track" aria-hidden="true">
              <span :style="{ width: `${Math.min(100, totalResults ? (products.length / totalResults) * 100 : 100)}%` }" ></span>
            </div>
            <button v-if="hasMore" type="button" class="button-secondary load-more-button" :disabled="loadingMore" @click="loadMore">
              <span v-if="loadingMore" class="button-spinner" aria-hidden="true" ></span>
              {{ loadingMore ? 'Memuat pilihan…' : 'Muat lebih banyak' }}
            </button>
            <p v-if="loadMoreError" class="load-more-error" role="alert">
              {{ loadMoreError }}
              <button type="button" @click="loadMore">Coba lagi</button>
            </p>
          </div>
        </template>
      </section>
    </div>

    <button v-if="filtersOpen" type="button" class="filter-backdrop" aria-label="Tutup filter" @click="filtersOpen = false" ></button>
  </main>
</template>

<style scoped>
.catalog-page {
  min-height: 80vh;
  padding-bottom: 100px;
  background: var(--color-surface);
}

.catalog-hero {
  position: relative;
  overflow: hidden;
  color: white;
  background:
    radial-gradient(circle at 80% 0%, color-mix(in srgb, var(--color-secondary) 25%, transparent), transparent 36%),
    linear-gradient(135deg, var(--color-primary-strong), var(--color-primary));
}

.catalog-hero::after {
  position: absolute;
  width: 280px;
  height: 280px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 50%;
  content: '';
  top: -130px;
  right: 4%;
  box-shadow: 0 0 0 55px rgb(255 255 255 / 3%);
}

.catalog-hero__inner {
  position: relative;
  z-index: 1;
  padding-block: 112px 54px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 30px;
  color: rgb(255 255 255 / 68%);
  font-size: 0.78rem;
}

.breadcrumbs a:hover {
  color: white;
}

.catalog-hero__copy h1 {
  max-width: 760px;
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2.6rem, 6vw, 5rem);
  letter-spacing: -0.055em;
  line-height: 1;
}

.catalog-hero__copy > p:last-child {
  margin: 17px 0 0;
  color: rgb(255 255 255 / 72%);
  font-size: 1.06rem;
}

.catalog-hero .section-kicker {
  color: color-mix(in srgb, var(--color-secondary) 55%, white);
}

.catalog-search {
  display: grid;
  width: min(720px, 100%);
  min-height: 62px;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  margin-top: 35px;
  border-radius: 999px;
  padding: 6px 7px 6px 19px;
  color: var(--color-ink);
  background: white;
  box-shadow: 0 18px 52px rgb(0 0 0 / 18%);
}

.catalog-search > svg {
  color: var(--color-primary);
}

.catalog-search input {
  min-width: 0;
  height: 48px;
  border: 0;
  outline: 0;
  background: transparent;
}

.catalog-search button {
  min-height: 50px;
  border: 0;
  border-radius: 999px;
  padding-inline: 25px;
  color: white;
  background: var(--color-primary);
  font-weight: 800;
}

.catalog-layout {
  display: grid;
  grid-template-columns: 245px minmax(0, 1fr);
  align-items: start;
  gap: 42px;
  padding-top: 52px;
}

.filter-panel {
  position: sticky;
  top: 90px;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 22px;
  background: white;
  box-shadow: var(--shadow-sm);
}

.filter-panel__heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 25px;
}

.filter-panel__heading span {
  color: var(--color-primary);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.filter-panel__heading h2 {
  margin: 2px 0 0;
  font-size: 1.16rem;
}

.filter-close,
.mobile-filter-button {
  display: none;
}

.filter-group {
  min-width: 0;
  margin: 0;
  border: 0;
  padding: 0 0 20px;
}

.filter-group + .filter-group {
  border-top: 1px solid var(--color-line);
  padding-top: 20px;
}

.filter-group legend {
  margin-bottom: 9px;
  padding: 0;
  font-size: 0.82rem;
  font-weight: 750;
}

.date-label {
  display: block;
  color: var(--color-muted);
  font-size: 0.72rem;
  font-weight: 700;
}

.date-label + .date-label {
  margin-top: 10px;
}

.date-label .form-control {
  min-height: 46px;
  margin-top: 5px;
  font-size: 0.82rem;
}

.select-wrap {
  position: relative;
}

.select-wrap select {
  padding-right: 34px;
  appearance: none;
}

.select-wrap svg {
  position: absolute;
  top: 50%;
  right: 12px;
  color: var(--color-muted);
  pointer-events: none;
  transform: translateY(-50%);
}

.filter-actions {
  display: grid;
  gap: 6px;
}

.catalog-results {
  min-width: 0;
}

.results-heading {
  display: flex;
  min-height: 58px;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.results-heading h2,
.results-count {
  margin: 0;
}

.results-heading h2 {
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  letter-spacing: -0.035em;
}

.results-count {
  margin-bottom: 3px;
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 700;
}

.desktop-sort {
  width: 220px;
}

.desktop-sort .form-control {
  min-height: 44px;
  font-size: 0.8rem;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: -6px 0 23px;
}

.active-filters button {
  display: inline-flex;
  min-height: 32px;
  align-items: center;
  gap: 5px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 18%, var(--color-line));
  border-radius: 999px;
  padding-inline: 11px;
  color: var(--color-primary-strong);
  background: color-mix(in srgb, var(--color-primary) 7%, white);
  font-size: 0.72rem;
  font-weight: 750;
}

.active-filters .clear-filter-link {
  border-color: transparent;
  background: transparent;
  text-decoration: underline;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 21px;
  transition: opacity 180ms ease;
}

.catalog-grid--refreshing {
  opacity: 0.5;
  pointer-events: none;
}

.product-skeleton {
  display: grid;
  gap: 12px;
  overflow: hidden;
  padding-bottom: 18px;
}

.product-skeleton__image {
  display: block;
  aspect-ratio: 4 / 3;
}

.product-skeleton__line {
  display: block;
  width: calc(100% - 32px);
  height: 14px;
  margin-inline: 16px;
  border-radius: 999px;
}

.product-skeleton__line--short { width: 35%; }
.product-skeleton__line--medium { width: 58%; }

.results-state {
  display: grid;
  min-height: 420px;
  place-items: center;
  align-content: center;
  gap: 12px;
  border: 1px dashed var(--color-line);
  border-radius: var(--radius-md);
  padding: 40px;
  text-align: center;
}

.results-state__icon {
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
  border-radius: 18px;
  color: var(--color-primary);
  background: var(--color-soft);
}

.results-state h2,
.results-state p {
  margin: 0;
}

.results-state p {
  max-width: 440px;
  color: var(--color-muted);
}

.load-more-area {
  display: grid;
  place-items: center;
  margin-top: 46px;
  text-align: center;
}

.load-more-area > p:first-child {
  margin: 0 0 9px;
  color: var(--color-muted);
  font-size: 0.78rem;
}

.progress-track {
  width: min(290px, 80%);
  height: 4px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-line);
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
}

.load-more-button {
  min-width: 205px;
  margin-top: 20px;
}

.load-more-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-line);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

.load-more-error {
  color: #b42318 !important;
}

.load-more-error button {
  border: 0;
  padding: 0;
  color: inherit;
  background: transparent;
  font-weight: 800;
  text-decoration: underline;
}

.filter-backdrop {
  display: none;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1120px) {
  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  .catalog-layout {
    display: block;
    padding-top: 28px;
  }

  .mobile-filter-button {
    display: flex;
    width: 100%;
    min-height: 50px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 28px;
    border: 1px solid var(--color-line);
    border-radius: 999px;
    background: white;
    font-weight: 800;
  }

  .filter-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-secondary);
  }

  .filter-panel {
    position: fixed;
    z-index: 70;
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    max-height: min(88svh, 760px);
    overflow-y: auto;
    border-radius: 25px 25px 0 0;
    padding: 25px 22px calc(25px + env(safe-area-inset-bottom));
    box-shadow: 0 -20px 70px rgb(0 0 0 / 18%);
    transform: translateY(105%);
    transition: transform 220ms ease;
  }

  .filter-panel--open {
    transform: translateY(0);
  }

  .filter-close {
    display: grid;
    width: 40px;
    height: 40px;
    place-items: center;
    border: 1px solid var(--color-line);
    border-radius: 50%;
    background: white;
  }

  .filter-backdrop {
    position: fixed;
    z-index: 60;
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    background: rgb(9 19 17 / 48%);
    inset: 0;
  }

  .desktop-sort {
    display: none;
  }
}

@media (max-width: 560px) {
  .catalog-hero__inner {
    padding-block: 94px 42px;
  }

  .catalog-search {
    grid-template-columns: auto 1fr;
    border-radius: 21px;
    padding: 7px 7px 7px 15px;
  }

  .catalog-search button {
    grid-column: 1 / -1;
    width: 100%;
  }

  .results-heading h2 {
    font-size: 1.5rem;
  }

  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .product-skeleton {
    border-radius: 15px;
  }

  .results-state {
    min-height: 360px;
    padding: 28px 18px;
  }
}
</style>

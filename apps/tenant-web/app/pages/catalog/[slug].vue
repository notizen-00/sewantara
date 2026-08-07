<script setup lang="ts">
import type {
  ApiResponse,
  AvailabilityDay,
  AvailabilityResponse,
  BookingField,
  CatalogResponse,
  Product,
} from '~~/shared/types'
import { useTenant } from '~/composables/useTenant'

interface ProductPageData {
  product: Product
  availability: AvailabilityResponse | null
  relatedProducts: Product[]
}

const route = useRoute()
const requestUrl = useRequestURL()
const { tenant } = useTenant()
const slug = computed(() => String(route.params.slug || ''))

const { data: pageData, status, error, refresh } = await useAsyncData<ProductPageData>(
  () => `public-product:${slug.value}`,
  async () => {
    const productResponse = await $fetch<ApiResponse<Product>>(`/api/public/catalog/${encodeURIComponent(slug.value)}`)
    const product = productResponse.data

    const [availabilityResult, relatedResult] = await Promise.all([
      $fetch<ApiResponse<AvailabilityResponse>>(`/api/public/availability/${encodeURIComponent(slug.value)}`)
        .then(response => response.data)
        .catch(() => null),
      $fetch<ApiResponse<CatalogResponse>>('/api/public/catalog', {
        query: {
          category: product.category.slug,
          sort: 'recommended',
          page: 1,
          perPage: 4,
        },
      })
        .then(response => response.data.products.filter(item => item.id !== product.id).slice(0, 3))
        .catch(() => [] as Product[]),
    ])

    return {
      product,
      availability: availabilityResult,
      relatedProducts: relatedResult,
    }
  },
  { watch: [slug] },
)

if (error.value) {
  const statusCode = Number((error.value as { statusCode?: number }).statusCode || 500)
  setResponseStatus(statusCode)
}

const product = computed(() => pageData.value?.product)
const relatedProducts = computed(() => pageData.value?.relatedProducts ?? [])
const selectedImageIndex = ref(0)
const availabilityDays = ref<AvailabilityDay[]>([])
const availabilityTimezone = ref('')
const loadingAvailability = ref(false)
const availabilityError = ref('')

watch(slug, () => {
  selectedImageIndex.value = 0
})

watch(() => pageData.value?.availability, (availability) => {
  availabilityDays.value = availability?.days ?? []
  availabilityTimezone.value = availability?.timezone || tenant.value.timezone
  availabilityError.value = availability ? '' : 'Ketersediaan belum dapat dimuat.'
}, { immediate: true })

const selectedImage = computed(() => product.value?.images[selectedImageIndex.value] ?? product.value?.images[0])

function addDays(date: string, amount: number): string {
  const value = new Date(`${date}T00:00:00.000Z`)
  value.setUTCDate(value.getUTCDate() + amount)
  return value.toISOString().slice(0, 10)
}

function formatDate(date: string, options: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat(tenant.value.locale || 'id-ID', {
      timeZone: 'UTC',
      ...options,
    }).format(new Date(`${date}T00:00:00.000Z`))
  }
  catch {
    return date
  }
}

function shortDate(date: string): { weekday: string; day: string; month: string } {
  return {
    weekday: formatDate(date, { weekday: 'short' }),
    day: formatDate(date, { day: '2-digit' }),
    month: formatDate(date, { month: 'short' }),
  }
}

const selectedDate = ref('')
const selectedEndDate = ref('')
const selectedTime = ref('')
const selectedDuration = ref(1)
const selectedQuantity = ref(1)

watch(product, (current) => {
  if (!current) return
  selectedDate.value = ''
  selectedEndDate.value = ''
  selectedTime.value = ''
  selectedDuration.value = current.bookingRules.minDuration
  selectedQuantity.value = current.bookingRules.minQuantity
}, { immediate: true })

function requires(field: BookingField): boolean {
  return product.value?.bookingRules.requiredFields.includes(field) ?? false
}

const needsEndDate = computed(() => requires('endDate'))
const needsStartTime = computed(() => requires('startTime'))
const needsDuration = computed(() => requires('duration'))
const needsQuantity = computed(() => requires('quantity'))
const selectedDay = computed(() => availabilityDays.value.find(day => day.date === selectedDate.value))
const availableSlots = computed(() => selectedDay.value?.slots ?? [])

const durationOptions = computed(() => {
  const rules = product.value?.bookingRules
  if (!rules) return []
  const result: number[] = []
  const step = Math.max(1, rules.durationStep)
  for (let value = rules.minDuration; value <= rules.maxDuration && result.length < 100; value += step) {
    result.push(value)
  }
  return result
})

function selectDay(day: AvailabilityDay) {
  if (!day.available) return
  selectedDate.value = day.date
  selectedTime.value = ''
  if (needsEndDate.value && (!selectedEndDate.value || selectedEndDate.value < day.date)) {
    selectedEndDate.value = day.date
  }
}

const canLoadMoreAvailability = computed(() => {
  const lastDate = availabilityDays.value.at(-1)?.date
  const firstDate = availabilityDays.value[0]?.date
  if (!lastDate || !firstDate || !product.value) return false
  return lastDate < addDays(firstDate, product.value.bookingRules.maxAdvanceDays)
})

async function loadMoreAvailability() {
  const lastDate = availabilityDays.value.at(-1)?.date
  if (!lastDate || loadingAvailability.value) return

  const from = addDays(lastDate, 1)
  const requestedTo = addDays(from, 13)
  const maximumDate = addDays(availabilityDays.value[0]!.date, product.value?.bookingRules.maxAdvanceDays ?? 13)
  const to = requestedTo < maximumDate ? requestedTo : maximumDate
  loadingAvailability.value = true
  availabilityError.value = ''

  try {
    const result = await $fetch<ApiResponse<AvailabilityResponse>>(`/api/public/availability/${encodeURIComponent(slug.value)}`, {
      query: { from, to },
    })
    const knownDates = new Set(availabilityDays.value.map(day => day.date))
    availabilityDays.value.push(...result.data.days.filter(day => !knownDates.has(day.date)))
    availabilityTimezone.value = result.data.timezone
  }
  catch {
    availabilityError.value = 'Tanggal berikutnya belum dapat dimuat. Silakan coba lagi.'
  }
  finally {
    loadingAvailability.value = false
  }
}

const bookingQuery = computed<Record<string, string>>(() => {
  const query: Record<string, string> = { product: slug.value }
  if (selectedDate.value) query.startDate = selectedDate.value
  if (needsEndDate.value && selectedEndDate.value) query.endDate = selectedEndDate.value
  if (needsStartTime.value && selectedTime.value) query.startTime = selectedTime.value
  if (needsDuration.value) query.duration = String(selectedDuration.value)
  if (needsQuantity.value) query.quantity = String(selectedQuantity.value)
  return query
})

const bookingTarget = computed(() => ({ path: '/booking', query: bookingQuery.value }))
const bookingDisabled = computed(() => product.value?.availability.status === 'unavailable')

const priceUnitText = computed(() => product.value?.price.unitLabel || '')
const primaryLocation = computed(() => product.value?.locations.find(location => location.isPrimary) ?? product.value?.locations[0])
const canonicalUrl = computed(() => new URL(`/catalog/${encodeURIComponent(slug.value)}`, requestUrl.origin).toString())
const seoTitle = computed(() => product.value?.seo.title || `${product.value?.name || 'Detail produk'} — ${tenant.value.businessName}`)
const seoDescription = computed(() => product.value?.seo.description || product.value?.shortDescription || tenant.value.seo.description)
const seoImage = computed(() => product.value?.seo.ogImage || product.value?.images[0]?.url || tenant.value.seo.ogImage)

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  robots: () => error.value ? 'noindex,nofollow' : 'index,follow',
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
  ogImage: () => seoImage.value || undefined,
  twitterCard: 'summary_large_image',
})

const structuredData = computed(() => {
  const current = product.value
  if (!current) return '{}'

  const graph: Array<Record<string, unknown>> = [
    {
      '@type': 'Product',
      '@id': `${canonicalUrl.value}#product`,
      name: current.name,
      description: current.description,
      image: current.images.map(image => image.url),
      category: current.category.name,
      brand: {
        '@type': 'Brand',
        name: tenant.value.businessName,
      },
      offers: {
        '@type': 'Offer',
        url: canonicalUrl.value,
        priceCurrency: current.price.base.currency,
        price: current.price.base.amount,
        availability: current.availability.status === 'unavailable'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      },
      aggregateRating: current.rating.count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: current.rating.average,
            reviewCount: current.rating.count,
          }
        : undefined,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: new URL('/', requestUrl.origin).toString() },
        { '@type': 'ListItem', position: 2, name: 'Katalog', item: new URL('/catalog', requestUrl.origin).toString() },
        { '@type': 'ListItem', position: 3, name: current.name, item: canonicalUrl.value },
      ],
    },
  ]

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
})

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: product.value
    ? [{ key: 'product-structured-data', type: 'application/ld+json', innerHTML: structuredData.value }]
    : [],
}))
</script>

<template>
  <main class="product-page">
    <div v-if="status === 'pending'" class="container-shell product-loading" aria-label="Memuat detail produk" aria-busy="true">
      <div class="skeleton loading-breadcrumb" ></div>
      <div class="loading-grid">
        <div class="skeleton loading-gallery" ></div>
        <div>
          <div class="skeleton loading-line loading-line--short" ></div>
          <div class="skeleton loading-title" ></div>
          <div class="skeleton loading-line" ></div>
          <div class="skeleton loading-card" ></div>
        </div>
      </div>
    </div>

    <section v-else-if="error || !product" class="container-shell product-error" role="alert">
      <span><UiIcon name="package" :size="32" /></span>
      <p class="section-kicker">Produk tidak tersedia</p>
      <h1>{{ Number((error as { statusCode?: number })?.statusCode) === 404 ? 'Pilihan ini tidak ditemukan' : 'Detail belum dapat dimuat' }}</h1>
      <p>Produk mungkin sudah tidak aktif atau koneksi ke layanan sedang terganggu.</p>
      <div>
        <NuxtLink class="button-primary" to="/catalog">Kembali ke katalog</NuxtLink>
        <button type="button" class="button-secondary" @click="refresh()">Coba lagi</button>
      </div>
    </section>

    <template v-else>
      <div class="container-shell product-shell">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <NuxtLink to="/">Beranda</NuxtLink>
          <UiIcon name="chevron-right" :size="13" />
          <NuxtLink :to="{ path: '/catalog', query: { category: product.category.slug } }">{{ product.category.name }}</NuxtLink>
          <UiIcon name="chevron-right" :size="13" />
          <span aria-current="page">{{ product.name }}</span>
        </nav>

        <div class="product-top-grid">
          <section class="gallery" aria-label="Galeri produk">
            <div class="gallery-main">
              <NuxtImg
                v-if="selectedImage"
                :src="selectedImage.url"
                :alt="selectedImage.alt || product.name"
                :width="selectedImage.width || 1200"
                :height="selectedImage.height || 900"
                sizes="(max-width: 860px) 94vw, 58vw"
                preload
                fit="cover"
              />
              <span v-else class="gallery-placeholder"><UiIcon name="package" :size="48" /></span>
              <span v-if="product.images.length > 1" class="gallery-count">
                <UiIcon name="grid" :size="14" />
                {{ selectedImageIndex + 1 }}/{{ product.images.length }}
              </span>
            </div>
            <div v-if="product.images.length > 1" class="gallery-thumbnails" role="list" aria-label="Pilih foto">
              <button
                v-for="(image, index) in product.images"
                :key="image.id || image.url"
                type="button"
                role="listitem"
                :class="{ active: selectedImageIndex === index }"
                :aria-label="`Lihat foto ${index + 1}: ${image.alt || product.name}`"
                :aria-pressed="selectedImageIndex === index"
                @click="selectedImageIndex = index"
              >
                <NuxtImg :src="image.url" :alt="image.alt || ''" width="180" height="135" loading="lazy" fit="cover" />
              </button>
            </div>
          </section>

          <div class="product-summary">
            <div v-if="product.badges.length" class="product-badges">
              <span v-for="badge in product.badges" :key="badge">{{ badge }}</span>
            </div>
            <p class="product-category">{{ product.category.name }}</p>
            <h1>{{ product.name }}</h1>
            <p class="short-description">{{ product.shortDescription }}</p>

            <div class="rating-location-row">
              <RatingStars
                v-if="product.rating.count"
                :rating="product.rating.average"
                :count="product.rating.count"
                :size="17"
              />
              <span v-if="primaryLocation" class="location-label">
                <UiIcon name="map-pin" :size="16" />
                {{ primaryLocation.city || primaryLocation.name }}
              </span>
            </div>

            <div class="price-panel">
              <PriceDisplay
                :amount="product.price.base.amount"
                :original-amount="product.price.original?.amount"
                :currency="product.price.base.currency"
                :locale="tenant.locale"
                :unit="priceUnitText"
                prefix="Mulai"
                size="lg"
              />
              <p v-if="product.price.deposit">
                <UiIcon name="shield" :size="16" />
                Deposit {{ product.price.deposit.formatted }}
              </p>
            </div>

            <div class="product-assurances">
              <span><UiIcon name="check" /> Harga dikonfirmasi sebelum bayar</span>
              <span><UiIcon name="calendar" /> Ketersediaan diperbarui berkala</span>
            </div>
          </div>
        </div>

        <div class="product-content-grid">
          <div class="product-content">
            <section class="content-section" aria-labelledby="description-heading">
              <p class="section-kicker">Tentang pilihan ini</p>
              <h2 id="description-heading">Detail produk</h2>
              <p class="long-description">{{ product.description }}</p>
            </section>

            <section v-if="product.specifications.length" class="content-section" aria-labelledby="specification-heading">
              <p class="section-kicker">Informasi utama</p>
              <h2 id="specification-heading">Spesifikasi</h2>
              <dl class="specification-list">
                <div v-for="specification in product.specifications" :key="specification.label">
                  <dt>{{ specification.label }}</dt>
                  <dd>{{ specification.value }}</dd>
                </div>
              </dl>
            </section>

            <section v-if="product.extraServices.some(extra => extra.enabled)" class="content-section" aria-labelledby="extras-heading">
              <p class="section-kicker">Lengkapi kebutuhan</p>
              <h2 id="extras-heading">Layanan tambahan</h2>
              <p class="content-intro">Layanan ini dapat dipilih pada tahap booking dan akan dihitung oleh sistem.</p>
              <div class="extras-list">
                <article v-for="extra in product.extraServices.filter(item => item.enabled)" :key="extra.id">
                  <span class="extra-icon"><UiIcon name="plus" /></span>
                  <div>
                    <h3>{{ extra.name }}</h3>
                    <p>{{ extra.description }}</p>
                  </div>
                  <PriceDisplay
                    :amount="extra.price.amount"
                    :currency="extra.price.currency"
                    :locale="tenant.locale"
                    size="sm"
                  />
                </article>
              </div>
            </section>

            <section class="content-section review-summary" aria-labelledby="reviews-heading">
              <div>
                <p class="section-kicker">Kepercayaan pelanggan</p>
                <h2 id="reviews-heading">Ulasan produk</h2>
                <p v-if="product.rating.count">Ringkasan dari pelanggan yang telah menggunakan pilihan ini.</p>
                <p v-else>Belum ada ulasan untuk pilihan ini.</p>
              </div>
              <div v-if="product.rating.count" class="review-score">
                <strong>{{ product.rating.average.toLocaleString(tenant.locale, { maximumFractionDigits: 1 }) }}</strong>
                <RatingStars :rating="product.rating.average" :count="product.rating.count" :size="18" :show-value="false" />
                <span>{{ product.rating.count }} ulasan terverifikasi</span>
              </div>
            </section>
          </div>

          <aside id="booking-options" class="booking-card surface-card" aria-labelledby="booking-card-heading">
            <div class="booking-card__top">
              <div>
                <span>Mulai dari</span>
                <PriceDisplay
                  :amount="product.price.base.amount"
                  :currency="product.price.base.currency"
                  :locale="tenant.locale"
                  :unit="priceUnitText"
                  size="lg"
                />
              </div>
              <span class="availability-pill" :class="`availability-pill--${product.availability.status}`">
                {{ product.availability.label }}
              </span>
            </div>

            <div class="booking-divider" ></div>

            <div v-if="availabilityDays.length" class="availability-calendar">
              <div class="booking-heading">
                <div>
                  <h2 id="booking-card-heading">Pilih tanggal</h2>
                  <p>Waktu mengikuti {{ availabilityTimezone || tenant.timezone }}</p>
                </div>
                <UiIcon name="calendar" />
              </div>

              <div class="date-scroller" role="list" aria-label="Tanggal tersedia">
                <button
                  v-for="day in availabilityDays"
                  :key="day.date"
                  type="button"
                  role="listitem"
                  :disabled="!day.available"
                  :class="{ selected: selectedDate === day.date, unavailable: !day.available }"
                  :aria-pressed="selectedDate === day.date"
                  :aria-label="`${formatDate(day.date, { dateStyle: 'full' })}, ${day.available ? `${day.remaining} tersedia` : 'tidak tersedia'}`"
                  @click="selectDay(day)"
                >
                  <small>{{ shortDate(day.date).weekday }}</small>
                  <strong>{{ shortDate(day.date).day }}</strong>
                  <span>{{ shortDate(day.date).month }}</span>
                  <i aria-hidden="true" ></i>
                </button>
              </div>

              <button
                v-if="canLoadMoreAvailability"
                type="button"
                class="load-dates"
                :disabled="loadingAvailability"
                @click="loadMoreAvailability"
              >
                {{ loadingAvailability ? 'Memuat tanggal…' : 'Lihat tanggal berikutnya' }}
                <UiIcon name="arrow-right" :size="15" />
              </button>
            </div>

            <div v-else class="availability-empty">
              <UiIcon name="calendar" />
              <div>
                <strong>Ketersediaan belum tampil</strong>
                <span>{{ availabilityError || 'Pilih lanjut booking untuk memeriksa jadwal lengkap.' }}</span>
              </div>
              <button type="button" aria-label="Muat ulang halaman" @click="refresh()">Coba lagi</button>
            </div>

            <p v-if="availabilityError && availabilityDays.length" class="availability-error" role="alert">{{ availabilityError }}</p>

            <div v-if="needsEndDate && selectedDate" class="booking-field">
              <label class="form-label" for="detail-end-date">Tanggal selesai</label>
              <input
                id="detail-end-date"
                v-model="selectedEndDate"
                type="date"
                class="form-control"
                :min="selectedDate"
              />
            </div>

            <fieldset v-if="needsStartTime && selectedDate" class="booking-field slot-field">
              <legend>Waktu mulai</legend>
              <div v-if="availableSlots.length" class="slot-grid">
                <button
                  v-for="slot in availableSlots"
                  :key="slot.id"
                  type="button"
                  :disabled="!slot.available"
                  :class="{ selected: selectedTime === slot.startTime }"
                  :aria-pressed="selectedTime === slot.startTime"
                  @click="selectedTime = slot.startTime"
                >
                  {{ slot.startTime }}
                </button>
              </div>
              <p v-else>Tidak ada slot waktu pada tanggal ini.</p>
            </fieldset>

            <div v-if="needsDuration || needsQuantity" class="booking-field booking-options-row">
              <label v-if="needsDuration">
                <span class="form-label">Durasi</span>
                <select v-model.number="selectedDuration" class="form-control">
                  <option v-for="duration in durationOptions" :key="duration" :value="duration">
                    {{ duration }} {{ product.bookingRules.durationUnit === 'hour' ? 'jam' : 'hari' }}
                  </option>
                </select>
              </label>
              <div v-if="needsQuantity">
                <span class="form-label">Jumlah</span>
                <div class="quantity-control" role="group" aria-label="Atur jumlah">
                  <button
                    type="button"
                    :disabled="selectedQuantity <= product.bookingRules.minQuantity"
                    aria-label="Kurangi jumlah"
                    @click="selectedQuantity--"
                  >−</button>
                  <output aria-live="polite">{{ selectedQuantity }}</output>
                  <button
                    type="button"
                    :disabled="selectedQuantity >= product.bookingRules.maxQuantity"
                    aria-label="Tambah jumlah"
                    @click="selectedQuantity++"
                  >+</button>
                </div>
              </div>
            </div>

            <NuxtLink
              v-if="!bookingDisabled"
              class="button-primary button-block booking-button"
              :to="bookingTarget"
            >
              Lanjut atur booking
              <UiIcon name="arrow-right" />
            </NuxtLink>
            <button v-else type="button" class="button-primary button-block booking-button" disabled>
              Belum tersedia untuk booking
            </button>
            <p class="booking-note"><UiIcon name="shield" :size="14" /> Harga dan stok dikonfirmasi kembali sebelum pembayaran.</p>
          </aside>
        </div>
      </div>

      <section v-if="relatedProducts.length" class="related-section section-shell">
        <div class="container-shell">
          <div class="related-heading">
            <div>
              <p class="section-kicker">Masih ingin membandingkan?</p>
              <h2 class="section-title">Pilihan lain di kategori ini</h2>
            </div>
            <NuxtLink :to="{ path: '/catalog', query: { category: product.category.slug } }" class="related-link">
              Lihat semua <UiIcon name="arrow-right" />
            </NuxtLink>
          </div>
          <div class="related-grid">
            <ProductCard v-for="item in relatedProducts" :key="item.id" :product="item" :show-favorite="false" />
          </div>
        </div>
      </section>

      <div class="mobile-booking-bar">
        <div>
          <small>Mulai</small>
          <PriceDisplay
            :amount="product.price.base.amount"
            :currency="product.price.base.currency"
            :locale="tenant.locale"
            :unit="priceUnitText"
            size="sm"
          />
        </div>
        <NuxtLink v-if="!bookingDisabled" class="button-primary" :to="bookingTarget">
          Booking <UiIcon name="arrow-right" />
        </NuxtLink>
        <button v-else type="button" class="button-primary" disabled>Belum tersedia</button>
      </div>
    </template>
  </main>
</template>

<style scoped>
.product-page {
  min-height: 80vh;
  background: var(--color-surface);
}

.product-shell {
  padding-top: 112px;
}

.breadcrumbs {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
  margin-bottom: 28px;
  color: var(--color-muted);
  font-size: 0.76rem;
}

.breadcrumbs a:hover {
  color: var(--color-primary);
}

.breadcrumbs span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-top-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  align-items: center;
  gap: clamp(38px, 6vw, 82px);
}

.gallery {
  min-width: 0;
}

.gallery-main {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-soft);
}

.gallery-main > img,
.gallery-placeholder {
  width: 100%;
  height: 100%;
}

.gallery-main > img {
  object-fit: cover;
}

.gallery-placeholder {
  display: grid;
  place-items: center;
  color: var(--color-muted);
}

.gallery-count {
  position: absolute;
  right: 17px;
  bottom: 17px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgb(255 255 255 / 45%);
  border-radius: 999px;
  padding: 7px 11px;
  color: white;
  background: rgb(13 27 24 / 72%);
  font-size: 0.72rem;
  font-weight: 750;
  backdrop-filter: blur(9px);
}

.gallery-thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  overflow-x: auto;
  padding: 2px 2px 8px;
  scrollbar-width: thin;
}

.gallery-thumbnails button {
  width: 88px;
  height: 68px;
  flex: 0 0 auto;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 13px;
  padding: 0;
  background: var(--color-soft);
}

.gallery-thumbnails button.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.gallery-thumbnails img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-summary {
  min-width: 0;
}

.product-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 18px;
}

.product-badges span {
  border-radius: 999px;
  padding: 6px 10px;
  color: var(--color-primary-strong);
  background: color-mix(in srgb, var(--color-primary) 9%, white);
  font-size: 0.68rem;
  font-weight: 800;
}

.product-category {
  margin: 0 0 9px;
  color: var(--color-primary);
  font-size: 0.76rem;
  font-weight: 850;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.product-summary h1 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2.6rem, 5vw, 4.7rem);
  font-weight: 850;
  letter-spacing: -0.06em;
  line-height: 0.98;
  text-wrap: balance;
}

.short-description {
  max-width: 590px;
  margin: 20px 0 0;
  color: var(--color-muted);
  font-size: 1.05rem;
}

.rating-location-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-top: 22px;
}

.location-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--color-muted);
  font-size: 0.8rem;
}

.price-panel {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-top: 28px;
  border-block: 1px solid var(--color-line);
  padding-block: 22px;
}

.price-panel p {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
  color: var(--color-muted);
  font-size: 0.75rem;
}

.product-assurances {
  display: grid;
  gap: 9px;
  margin-top: 21px;
  color: var(--color-muted);
  font-size: 0.78rem;
}

.product-assurances span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-assurances svg {
  color: var(--color-primary);
}

.product-content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 390px;
  align-items: start;
  gap: clamp(48px, 8vw, 100px);
  margin-top: clamp(72px, 9vw, 120px);
  padding-bottom: 100px;
}

.content-section + .content-section {
  margin-top: 68px;
  border-top: 1px solid var(--color-line);
  padding-top: 64px;
}

.content-section h2 {
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.55rem);
  letter-spacing: -0.04em;
}

.long-description,
.content-intro,
.review-summary > div:first-child > p:last-child {
  margin: 18px 0 0;
  color: var(--color-muted);
  font-size: 1rem;
  white-space: pre-line;
}

.specification-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 34px;
  margin: 25px 0 0;
  border-top: 1px solid var(--color-line);
}

.specification-list > div {
  display: grid;
  grid-template-columns: minmax(100px, 0.7fr) 1fr;
  gap: 20px;
  border-bottom: 1px solid var(--color-line);
  padding-block: 16px;
}

.specification-list dt {
  color: var(--color-muted);
  font-size: 0.78rem;
}

.specification-list dd {
  margin: 0;
  font-size: 0.84rem;
  font-weight: 750;
}

.extras-list {
  display: grid;
  gap: 10px;
  margin-top: 25px;
}

.extras-list article {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 13px;
  border: 1px solid var(--color-line);
  border-radius: 16px;
  padding: 15px;
}

.extra-icon {
  display: grid;
  width: 35px;
  height: 35px;
  place-items: center;
  border-radius: 11px;
  color: var(--color-primary);
  background: var(--color-soft);
}

.extras-list h3,
.extras-list p {
  margin: 0;
}

.extras-list h3 {
  font-size: 0.91rem;
}

.extras-list p {
  margin-top: 3px;
  color: var(--color-muted);
  font-size: 0.74rem;
}

.review-summary {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 35px;
}

.review-score {
  display: grid;
  flex: 0 0 auto;
  justify-items: end;
}

.review-score > strong {
  font-size: 3.5rem;
  letter-spacing: -0.06em;
  line-height: 1;
}

.review-score > span {
  margin-top: 8px;
  color: var(--color-muted);
  font-size: 0.72rem;
}

.booking-card {
  position: sticky;
  top: 94px;
  padding: 23px;
}

.booking-card__top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
}

.booking-card__top > div > span {
  display: block;
  margin-bottom: 3px;
  color: var(--color-muted);
  font-size: 0.7rem;
}

.availability-pill {
  border-radius: 999px;
  padding: 6px 9px;
  color: var(--color-muted);
  background: var(--color-soft);
  font-size: 0.65rem;
  font-weight: 800;
}

.availability-pill--available {
  color: #166534;
  background: #ecfdf3;
}

.availability-pill--limited {
  color: #92400e;
  background: #fff7ed;
}

.availability-pill--unavailable {
  color: #991b1b;
  background: #fef2f2;
}

.booking-divider {
  height: 1px;
  margin-block: 19px;
  background: var(--color-line);
}

.booking-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 13px;
}

.booking-heading h2 {
  margin: 0;
  font-size: 1rem;
}

.booking-heading p {
  margin: 3px 0 0;
  color: var(--color-muted);
  font-size: 0.67rem;
}

.booking-heading > svg {
  color: var(--color-primary);
}

.date-scroller {
  display: flex;
  gap: 7px;
  margin-inline: -3px;
  overflow-x: auto;
  padding: 3px 3px 10px;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
}

.date-scroller button {
  position: relative;
  display: grid;
  width: 58px;
  min-height: 77px;
  flex: 0 0 auto;
  place-items: center;
  align-content: center;
  gap: 0;
  border: 1px solid var(--color-line);
  border-radius: 13px;
  padding: 7px 4px;
  background: white;
  scroll-snap-align: start;
}

.date-scroller button:hover:not(:disabled),
.date-scroller button.selected {
  border-color: var(--color-primary);
}

.date-scroller button.selected {
  color: white;
  background: var(--color-primary);
}

.date-scroller button:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.date-scroller small,
.date-scroller span {
  font-size: 0.62rem;
}

.date-scroller strong {
  font-size: 1.05rem;
}

.date-scroller i {
  width: 4px;
  height: 4px;
  margin-top: 4px;
  border-radius: 50%;
  background: #22a06b;
}

.date-scroller .selected i {
  background: white;
}

.date-scroller .unavailable i {
  background: #c2413b;
}

.load-dates {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  padding: 4px 0;
  color: var(--color-primary);
  background: transparent;
  font-size: 0.7rem;
  font-weight: 800;
}

.load-dates:disabled {
  opacity: 0.5;
}

.availability-empty {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  border-radius: 13px;
  padding: 13px;
  color: var(--color-muted);
  background: var(--color-soft);
}

.availability-empty strong,
.availability-empty span {
  display: block;
}

.availability-empty strong {
  color: var(--color-ink);
  font-size: 0.77rem;
}

.availability-empty span {
  margin-top: 2px;
  font-size: 0.68rem;
}

.availability-empty button {
  grid-column: 2;
  width: max-content;
  border: 0;
  padding: 0;
  color: var(--color-primary);
  background: transparent;
  font-size: 0.7rem;
  font-weight: 800;
}

.availability-error {
  margin: 9px 0 0;
  color: #b42318;
  font-size: 0.68rem;
}

.booking-field {
  min-width: 0;
  margin-top: 16px;
}

.booking-field legend {
  margin-bottom: 7px;
  padding: 0;
  font-size: 0.82rem;
  font-weight: 750;
}

.slot-field {
  border: 0;
  padding: 0;
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
}

.slot-grid button {
  min-height: 38px;
  border: 1px solid var(--color-line);
  border-radius: 9px;
  background: white;
  font-size: 0.72rem;
  font-weight: 750;
}

.slot-grid button.selected {
  border-color: var(--color-primary);
  color: white;
  background: var(--color-primary);
}

.slot-grid button:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.slot-field > p {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.72rem;
}

.booking-options-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.quantity-control {
  display: grid;
  min-height: 50px;
  grid-template-columns: 42px 1fr 42px;
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-sm);
}

.quantity-control button {
  border: 0;
  background: white;
  font-size: 1.05rem;
}

.quantity-control button:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.quantity-control output {
  display: grid;
  place-items: center;
  border-inline: 1px solid var(--color-line);
  font-weight: 800;
}

.booking-button {
  margin-top: 20px;
}

.booking-button[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

.booking-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin: 10px 0 0;
  color: var(--color-muted);
  font-size: 0.65rem;
  text-align: center;
}

.related-section {
  border-top: 1px solid var(--color-line);
  background: var(--color-soft);
}

.related-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 37px;
}

.related-link {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  color: var(--color-primary);
  font-size: 0.83rem;
  font-weight: 800;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.mobile-booking-bar {
  display: none;
}

.product-loading {
  padding-block: 120px;
}

.loading-breadcrumb {
  width: 260px;
  height: 15px;
  border-radius: 999px;
}

.loading-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 70px;
  margin-top: 35px;
}

.loading-gallery {
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-lg);
}

.loading-line,
.loading-title,
.loading-card {
  display: block;
  width: 100%;
  height: 17px;
  margin-top: 18px;
  border-radius: 999px;
}

.loading-line--short { width: 30%; }
.loading-title { height: 70px; border-radius: 16px; }
.loading-card { height: 190px; margin-top: 34px; border-radius: 20px; }

.product-error {
  display: grid;
  min-height: 72vh;
  place-items: center;
  align-content: center;
  gap: 12px;
  padding-block: 100px;
  text-align: center;
}

.product-error > span {
  display: grid;
  width: 67px;
  height: 67px;
  place-items: center;
  border-radius: 20px;
  color: var(--color-primary);
  background: var(--color-soft);
}

.product-error h1,
.product-error > p {
  margin: 0;
}

.product-error h1 {
  font-size: clamp(2rem, 5vw, 3.4rem);
  letter-spacing: -0.045em;
}

.product-error > p:not(.section-kicker) {
  max-width: 510px;
  color: var(--color-muted);
}

.product-error > div {
  display: flex;
  gap: 10px;
  margin-top: 13px;
}

@media (max-width: 980px) {
  .product-top-grid {
    grid-template-columns: 1fr;
  }

  .product-summary {
    max-width: 680px;
  }

  .product-content-grid {
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 38px;
  }

  .specification-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 780px) {
  .product-shell {
    padding-top: 88px;
  }

  .product-content-grid {
    grid-template-columns: 1fr;
    margin-top: 70px;
    padding-bottom: 80px;
  }

  .booking-card {
    position: static;
    scroll-margin-top: 90px;
  }

  .related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mobile-booking-bar {
    position: fixed;
    z-index: 45;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border-top: 1px solid var(--color-line);
    padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
    background: rgb(255 255 255 / 94%);
    box-shadow: 0 -12px 38px rgb(23 33 31 / 12%);
    backdrop-filter: blur(15px);
  }

  .mobile-booking-bar small {
    display: block;
    color: var(--color-muted);
    font-size: 0.65rem;
  }

  .mobile-booking-bar .button-primary {
    min-height: 46px;
  }
}

@media (max-width: 560px) {
  .breadcrumbs {
    margin-bottom: 19px;
  }

  .gallery-main {
    margin-inline: -14px;
    border-radius: 0;
  }

  .product-top-grid {
    gap: 31px;
  }

  .product-summary h1 {
    font-size: clamp(2.45rem, 13vw, 3.6rem);
  }

  .price-panel {
    align-items: start;
    flex-direction: column;
  }

  .content-section + .content-section {
    margin-top: 53px;
    padding-top: 50px;
  }

  .specification-list > div {
    grid-template-columns: 100px 1fr;
  }

  .extras-list article {
    grid-template-columns: auto 1fr;
  }

  .extras-list article > :last-child {
    grid-column: 2;
  }

  .review-summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .review-score {
    justify-items: start;
  }

  .booking-card {
    margin-inline: -2px;
    padding: 18px;
  }

  .slot-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .related-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .loading-grid {
    grid-template-columns: 1fr;
  }

  .product-error > div {
    width: 100%;
    flex-direction: column;
  }
}
</style>

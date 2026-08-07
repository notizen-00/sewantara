<script setup lang="ts">
import { computed } from 'vue'
import type { BookingQuote } from '~~/shared/types'

const props = withDefaults(defineProps<{
  quote?: BookingQuote | null
  title?: string
  loading?: boolean
  sticky?: boolean
}>(), {
  quote: null,
  title: 'Ringkasan pesanan',
  loading: false,
  sticky: false,
})

const productImage = computed(() => props.quote?.product.images[0])
const locale = 'id-ID'

function formatDate(value?: string): string {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

const scheduleLabel = computed(() => {
  if (!props.quote) return ''
  const { startDate, endDate, startTime } = props.quote.selection
  const range = endDate && endDate !== startDate
    ? `${formatDate(startDate)} – ${formatDate(endDate)}`
    : formatDate(startDate)
  return [range, startTime ? `pukul ${startTime}` : null].filter(Boolean).join(' • ')
})
</script>

<template>
  <aside class="booking-summary surface-card" :class="{ 'booking-summary--sticky': sticky }" :aria-busy="loading">
    <h2 class="booking-summary__title">{{ title }}</h2>

    <template v-if="loading">
      <div class="booking-summary__product">
        <span class="booking-summary__thumb skeleton" ></span>
        <span class="booking-summary__skeleton-copy">
          <span class="skeleton" ></span>
          <span class="skeleton" ></span>
        </span>
      </div>
      <div class="booking-summary__rows" aria-label="Sedang memuat ringkasan">
        <span v-for="index in 4" :key="index" class="booking-summary__row-skeleton skeleton" ></span>
      </div>
    </template>

    <template v-else-if="quote">
      <div class="booking-summary__product">
        <NuxtImg
          v-if="productImage"
          :src="productImage.url"
          :alt="productImage.alt || quote.product.name"
          width="144"
          height="108"
          sizes="72px"
          format="webp"
          fit="cover"
          loading="lazy"
          class="booking-summary__thumb"
        />
        <span v-else class="booking-summary__thumb booking-summary__thumb--empty" aria-hidden="true">
          <UiIcon name="package" />
        </span>
        <div>
          <strong>{{ quote.product.name }}</strong>
          <p>{{ scheduleLabel }}</p>
          <p>{{ quote.selection.quantity }} item • {{ quote.selection.duration }} durasi</p>
        </div>
      </div>

      <dl class="booking-summary__rows">
        <div v-for="item in quote.lineItems" :key="item.id" class="booking-summary__row">
          <dt>
            {{ item.label }}
            <small v-if="item.description">{{ item.description }}</small>
          </dt>
          <dd :class="{ 'booking-summary__discount': item.type === 'discount' }">
            {{ item.total.formatted }}
          </dd>
        </div>
      </dl>

      <dl class="booking-summary__totals">
        <div class="booking-summary__row">
          <dt>Subtotal</dt>
          <dd>{{ quote.subtotal.formatted }}</dd>
        </div>
        <div v-if="quote.discount.amount" class="booking-summary__row booking-summary__discount">
          <dt>Diskon</dt>
          <dd>−{{ quote.discount.formatted.replace('-', '') }}</dd>
        </div>
        <div v-if="quote.serviceFee.amount" class="booking-summary__row">
          <dt>Biaya layanan</dt>
          <dd>{{ quote.serviceFee.formatted }}</dd>
        </div>
        <div v-if="quote.tax.amount" class="booking-summary__row">
          <dt>Pajak</dt>
          <dd>{{ quote.tax.formatted }}</dd>
        </div>
      </dl>

      <div class="booking-summary__total">
        <span>Total pembayaran</span>
        <strong>{{ quote.total.formatted }}</strong>
      </div>

      <p class="booking-summary__note">
        <UiIcon name="shield" :size="17" />
        Harga dan ketersediaan diverifikasi saat pesanan dikonfirmasi.
      </p>
    </template>

    <div v-else class="booking-summary__empty">
      <UiIcon name="receipt" :size="28" />
      <p>Pilih jadwal dan opsi untuk melihat rincian biaya.</p>
    </div>

    <slot ></slot>
  </aside>
</template>

<style scoped>
.booking-summary {
  padding: clamp(20px, 3vw, 28px);
}

.booking-summary--sticky {
  position: sticky;
  top: 100px;
}

.booking-summary__title {
  margin: 0 0 20px;
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 850;
  letter-spacing: -0.03em;
}

.booking-summary__product {
  display: grid;
  grid-template-columns: 72px 1fr;
  align-items: center;
  gap: 13px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--color-line);
}

.booking-summary__thumb {
  display: grid;
  width: 72px;
  height: 58px;
  place-items: center;
  border-radius: 11px;
  object-fit: cover;
}

.booking-summary__thumb--empty {
  color: var(--color-muted);
  background: var(--color-soft);
}

.booking-summary__product strong {
  display: block;
  font-size: 0.88rem;
  line-height: 1.3;
}

.booking-summary__product p {
  margin: 3px 0 0;
  color: var(--color-muted);
  font-size: 0.72rem;
  line-height: 1.35;
}

.booking-summary__rows,
.booking-summary__totals {
  display: grid;
  gap: 12px;
  margin: 18px 0;
}

.booking-summary__totals {
  padding-top: 17px;
  border-top: 1px solid var(--color-line);
}

.booking-summary__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  color: var(--color-muted);
  font-size: 0.8rem;
}

.booking-summary__row dt {
  display: grid;
  gap: 2px;
}

.booking-summary__row small {
  color: var(--color-muted);
  font-size: 0.68rem;
}

.booking-summary__row dd {
  flex: 0 0 auto;
  margin: 0;
  color: var(--color-ink);
  font-weight: 720;
}

.booking-summary__discount,
.booking-summary__discount dd {
  color: #16794b;
}

.booking-summary__total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-top: 18px;
  border-top: 1px solid var(--color-line);
  font-size: 0.84rem;
  font-weight: 750;
}

.booking-summary__total strong {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 880;
  letter-spacing: -0.04em;
}

.booking-summary__note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 18px 0 0;
  padding: 11px 12px;
  border-radius: 10px;
  color: var(--color-muted);
  background: var(--color-soft);
  font-size: 0.7rem;
  line-height: 1.4;
}

.booking-summary__empty {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 24px 8px;
  color: var(--color-muted);
  text-align: center;
}

.booking-summary__empty p {
  max-width: 240px;
  margin: 0;
  font-size: 0.82rem;
}

.booking-summary__skeleton-copy {
  display: grid;
  gap: 8px;
}

.booking-summary__skeleton-copy span {
  width: 80%;
  height: 11px;
  border-radius: 99px;
}

.booking-summary__skeleton-copy span:last-child {
  width: 55%;
}

.booking-summary__row-skeleton {
  height: 13px;
  border-radius: 99px;
}

@media (max-width: 900px) {
  .booking-summary--sticky {
    position: static;
  }
}
</style>

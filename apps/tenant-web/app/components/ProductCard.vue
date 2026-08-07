<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '~~/shared/types'

const props = withDefaults(defineProps<{
  product: Product
  eager?: boolean
  favorite?: boolean
  showFavorite?: boolean
}>(), {
  eager: false,
  favorite: false,
  showFavorite: true,
})

const emit = defineEmits<{
  'toggle-favorite': [product: Product]
}>()

const image = computed(() => props.product.images[0])
const href = computed(() => `/catalog/${encodeURIComponent(props.product.slug)}`)
const locationLabel = computed(() => {
  const primary = props.product.locations.find(location => location.isPrimary) ?? props.product.locations[0]
  return primary?.city || primary?.name || ''
})
const availabilityTone = computed(() => `product-card__availability--${props.product.availability.status}`)
</script>

<template>
  <article class="product-card">
    <div class="product-card__media">
      <NuxtLink :to="href" :aria-label="`Lihat ${product.name}`" class="product-card__image-link">
        <NuxtImg
          v-if="image?.url"
          :src="image.url"
          :alt="image.alt || product.name"
          :width="image.width || 640"
          :height="image.height || 480"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          format="webp"
          fit="cover"
          :loading="eager ? 'eager' : 'lazy'"
          :fetchpriority="eager ? 'high' : 'auto'"
          :placeholder="image.blurDataUrl || undefined"
          class="product-card__image"
        />
        <span v-else class="product-card__image-placeholder" aria-hidden="true">
          <UiIcon name="package" :size="34" />
        </span>
      </NuxtLink>

      <div v-if="product.badges.length" class="product-card__badges" aria-label="Penanda produk">
        <span v-for="badge in product.badges.slice(0, 2)" :key="badge" class="product-card__badge">{{ badge }}</span>
      </div>

      <button
        v-if="showFavorite"
        type="button"
        class="product-card__favorite"
        :class="{ 'product-card__favorite--active': favorite }"
        :aria-label="favorite ? `Hapus ${product.name} dari favorit` : `Simpan ${product.name} ke favorit`"
        :aria-pressed="favorite"
        @click="emit('toggle-favorite', product)"
      >
        <UiIcon name="heart" :fill="favorite ? 'currentColor' : 'none'" />
      </button>
    </div>

    <div class="product-card__body">
      <div class="product-card__meta">
        <span>{{ product.category.name }}</span>
        <span v-if="locationLabel" class="product-card__location">
          <UiIcon name="map-pin" :size="13" />
          {{ locationLabel }}
        </span>
      </div>

      <h3 class="product-card__title">
        <NuxtLink :to="href">{{ product.name }}</NuxtLink>
      </h3>

      <RatingStars
        v-if="product.rating.count > 0"
        :rating="product.rating.average"
        :count="product.rating.count"
        :size="14"
      />
      <p v-else class="product-card__no-review">Belum ada ulasan</p>

      <div class="product-card__bottom">
        <PriceDisplay
          :amount="product.price.base.amount"
          :original-amount="product.price.original?.amount"
          :currency="product.price.base.currency"
          :unit="product.price.unitLabel"
          prefix="Mulai"
          size="sm"
        />
        <span class="product-card__availability" :class="availabilityTone">
          {{ product.availability.label }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: 0 8px 28px rgb(23 33 31 / 6%);
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.product-card:hover {
  border-color: color-mix(in srgb, var(--color-primary) 25%, var(--color-line));
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.product-card__media {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-soft);
}

.product-card__image-link,
.product-card__image,
.product-card__image-placeholder {
  display: block;
  width: 100%;
  height: 100%;
}

.product-card__image {
  object-fit: cover;
  transition: transform 350ms ease;
}

.product-card:hover .product-card__image {
  transform: scale(1.035);
}

.product-card__image-placeholder {
  display: grid;
  place-items: center;
  color: var(--color-muted);
  background: linear-gradient(145deg, var(--color-soft), color-mix(in srgb, var(--color-primary) 8%, white));
}

.product-card__badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  max-width: calc(100% - 64px);
  flex-wrap: wrap;
  gap: 6px;
  pointer-events: none;
}

.product-card__badge,
.product-card__availability {
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 0.68rem;
  font-weight: 800;
  line-height: 1.1;
}

.product-card__badge {
  color: var(--color-primary-foreground, white);
  background: var(--color-primary);
  box-shadow: 0 5px 18px rgb(0 0 0 / 12%);
}

.product-card__favorite {
  position: absolute;
  top: 10px;
  right: 10px;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 75%);
  border-radius: 50%;
  color: var(--color-ink);
  background: rgb(255 255 255 / 90%);
  box-shadow: 0 6px 20px rgb(0 0 0 / 10%);
  backdrop-filter: blur(8px);
}

.product-card__favorite:hover,
.product-card__favorite--active {
  color: #b42318;
  transform: scale(1.04);
}

.product-card__body {
  display: grid;
  gap: 9px;
  padding: 16px;
}

.product-card__meta {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--color-muted);
  font-size: 0.71rem;
  font-weight: 720;
}

.product-card__location {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-card__title {
  display: -webkit-box;
  min-height: 2.65em;
  margin: 0;
  overflow: hidden;
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.32;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-card__title a::after {
  position: absolute;
  content: '';
}

.product-card__no-review {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.75rem;
}

.product-card__bottom {
  display: grid;
  min-width: 0;
  align-items: end;
  gap: 10px;
  margin-top: 3px;
}

.product-card__availability {
  width: max-content;
  max-width: 100%;
  color: var(--color-muted);
  background: var(--color-soft);
}

.product-card__availability--available {
  color: #166534;
  background: #ecfdf3;
}

.product-card__availability--limited {
  color: #92400e;
  background: #fff7ed;
}

.product-card__availability--unavailable {
  color: #991b1b;
  background: #fef2f2;
}

@media (max-width: 520px) {
  .product-card {
    border-radius: 15px;
  }

  .product-card__body {
    gap: 8px;
    padding: 12px;
  }

  .product-card__meta {
    display: block;
  }

  .product-card__location {
    display: none;
  }

  .product-card__title {
    font-size: 0.9rem;
  }

  .product-card__favorite {
    width: 38px;
    height: 38px;
  }

  .product-card__badges {
    top: 9px;
    left: 9px;
  }
}
</style>

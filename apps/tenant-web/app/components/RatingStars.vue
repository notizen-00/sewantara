<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  rating?: number | null
  count?: number | null
  size?: number
  showValue?: boolean
}>(), {
  rating: 0,
  count: null,
  size: 15,
  showValue: true,
})

const safeRating = computed(() => Math.min(5, Math.max(0, Number(props.rating) || 0)))
const label = computed(() => {
  const base = `Rating ${safeRating.value.toLocaleString('id-ID', { maximumFractionDigits: 1 })} dari 5`
  return props.count === null ? base : `${base}, dari ${props.count} ulasan`
})

function fillFor(index: number): number {
  return Math.min(1, Math.max(0, safeRating.value - index)) * 100
}
</script>

<template>
  <span class="rating" role="img" :aria-label="label">
    <span class="rating__stars" aria-hidden="true">
      <span v-for="index in 5" :key="index" class="rating__star" :style="{ width: `${size}px`, height: `${size}px` }">
        <UiIcon name="star" :size="size" class="rating__empty" />
        <span class="rating__fill" :style="{ width: `${fillFor(index - 1)}%` }">
          <UiIcon name="star" :size="size" fill="currentColor" />
        </span>
      </span>
    </span>
    <strong v-if="showValue" class="rating__value">{{ safeRating.toLocaleString('id-ID', { maximumFractionDigits: 1 }) }}</strong>
    <span v-if="count !== null" class="rating__count">({{ count }})</span>
  </span>
</template>

<style scoped>
.rating,
.rating__stars {
  display: inline-flex;
  align-items: center;
}

.rating {
  gap: 5px;
  color: var(--color-muted);
  font-size: 0.78rem;
  line-height: 1;
}

.rating__stars {
  gap: 2px;
}

.rating__star {
  position: relative;
  display: inline-block;
  color: #f3a712;
}

.rating__empty {
  color: #cfd8d4;
}

.rating__fill {
  position: absolute;
  inset: 0 auto 0 0;
  overflow: hidden;
  color: #f3a712;
}

.rating__value {
  color: var(--color-ink);
  font-weight: 780;
}
</style>

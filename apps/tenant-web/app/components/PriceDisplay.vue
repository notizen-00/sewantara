<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  amount?: number | null
  originalAmount?: number | null
  currency?: string
  locale?: string
  unit?: string | null
  prefix?: string | null
  size?: 'sm' | 'md' | 'lg'
  compact?: boolean
  unavailableLabel?: string
}>(), {
  amount: null,
  originalAmount: null,
  currency: 'IDR',
  locale: 'id-ID',
  unit: null,
  prefix: null,
  size: 'md',
  compact: false,
  unavailableLabel: 'Hubungi kami',
})

function formatCurrency(value: number): string {
  try {
    return new Intl.NumberFormat(props.locale, {
      style: 'currency',
      currency: props.currency,
      minimumFractionDigits: props.currency === 'IDR' ? 0 : 0,
      maximumFractionDigits: props.currency === 'IDR' ? 0 : 2,
    }).format(value)
  }
  catch {
    return `${props.currency} ${new Intl.NumberFormat('id-ID').format(value)}`
  }
}

const hasPrice = computed(() => typeof props.amount === 'number' && Number.isFinite(props.amount))
const formattedAmount = computed(() => hasPrice.value ? formatCurrency(props.amount!) : props.unavailableLabel)
const formattedOriginalAmount = computed(() => (
  typeof props.originalAmount === 'number' && Number.isFinite(props.originalAmount)
    ? formatCurrency(props.originalAmount)
    : null
))
const accessibleLabel = computed(() => [
  props.prefix,
  formattedAmount.value,
  props.unit ? `per ${props.unit}` : null,
].filter(Boolean).join(' '))
</script>

<template>
  <span class="price" :class="`price--${compact ? 'sm' : size}`" :aria-label="accessibleLabel">
    <span v-if="prefix" class="price__prefix">{{ prefix }}</span>
    <span class="price__line">
      <strong class="price__amount">{{ formattedAmount }}</strong>
      <span v-if="unit && hasPrice" class="price__unit">/ {{ unit }}</span>
    </span>
    <del v-if="formattedOriginalAmount && originalAmount! > amount!" class="price__original">
      {{ formattedOriginalAmount }}
    </del>
  </span>
</template>

<style scoped>
.price {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 6px;
  color: var(--color-ink);
  line-height: 1.2;
}

.price__prefix {
  flex-basis: 100%;
  color: var(--color-muted);
  font-size: 0.72em;
  font-weight: 650;
}

.price__amount {
  font-family: var(--font-heading);
  font-weight: 850;
  letter-spacing: -0.03em;
}

.price__unit {
  color: var(--color-muted);
  font-size: 0.76em;
  font-weight: 650;
}

.price__original {
  color: var(--color-muted);
  font-size: 0.72em;
}

.price--sm { font-size: 0.94rem; }
.price--md { font-size: 1.08rem; }
.price--lg { font-size: clamp(1.32rem, 3vw, 1.75rem); }
</style>

<script setup lang="ts">
export interface BookingStep {
  id: string
  label: string
  description?: string
}

const props = withDefaults(defineProps<{
  steps?: BookingStep[]
  current?: number
}>(), {
  steps: () => [
    { id: 'booking', label: 'Atur pesanan' },
    { id: 'checkout', label: 'Data & pembayaran' },
    { id: 'done', label: 'Selesai' },
  ],
  current: 1,
})

function stateFor(index: number): 'complete' | 'current' | 'upcoming' {
  if (index + 1 < props.current) return 'complete'
  if (index + 1 === props.current) return 'current'
  return 'upcoming'
}
</script>

<template>
  <nav class="booking-steps" aria-label="Tahapan pemesanan">
    <p class="booking-steps__mobile">Langkah {{ Math.min(current, steps.length) }} dari {{ steps.length }}</p>
    <ol class="booking-steps__list">
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        class="booking-steps__item"
        :class="`booking-steps__item--${stateFor(index)}`"
        :aria-current="stateFor(index) === 'current' ? 'step' : undefined"
      >
        <span class="booking-steps__marker" aria-hidden="true">
          <UiIcon v-if="stateFor(index) === 'complete'" name="check" :size="15" :stroke-width="2.4" />
          <span v-else>{{ index + 1 }}</span>
        </span>
        <span class="booking-steps__text">
          <strong>{{ step.label }}</strong>
          <small v-if="step.description">{{ step.description }}</small>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.booking-steps {
  width: 100%;
}

.booking-steps__mobile {
  display: none;
  margin: 0 0 9px;
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 800;
}

.booking-steps__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0;
  padding: 0;
  list-style: none;
}

.booking-steps__item {
  position: relative;
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.booking-steps__item:not(:last-child)::after {
  height: 1px;
  flex: 1;
  margin-inline: 12px;
  background: var(--color-line);
  content: '';
}

.booking-steps__marker {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--color-line);
  border-radius: 50%;
  color: var(--color-muted);
  background: var(--color-surface);
  font-size: 0.76rem;
  font-weight: 850;
}

.booking-steps__item--complete .booking-steps__marker,
.booking-steps__item--current .booking-steps__marker {
  border-color: var(--color-primary);
  color: var(--color-primary-foreground, white);
  background: var(--color-primary);
}

.booking-steps__item--complete:not(:last-child)::after {
  background: var(--color-primary);
}

.booking-steps__text {
  display: grid;
  min-width: max-content;
  gap: 2px;
  color: var(--color-muted);
  font-size: 0.78rem;
}

.booking-steps__text strong {
  color: inherit;
}

.booking-steps__text small {
  max-width: 160px;
  overflow: hidden;
  font-size: 0.68rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.booking-steps__item--current .booking-steps__text,
.booking-steps__item--complete .booking-steps__text {
  color: var(--color-ink);
}

@media (max-width: 700px) {
  .booking-steps__mobile {
    display: block;
  }

  .booking-steps__text,
  .booking-steps__item:not(:last-child)::after {
    display: none;
  }

  .booking-steps__list {
    gap: 7px;
  }

  .booking-steps__item {
    display: block;
    height: 5px;
    overflow: hidden;
    border-radius: 99px;
    background: var(--color-line);
  }

  .booking-steps__item--complete,
  .booking-steps__item--current {
    background: var(--color-primary);
  }

  .booking-steps__marker {
    display: none;
  }
}
</style>


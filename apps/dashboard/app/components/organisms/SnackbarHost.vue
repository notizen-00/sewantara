<script setup lang="ts">
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  X,
} from '@lucide/vue'
import type { Component } from 'vue'
import type { SnackbarTone } from '~/stores/snackbar'

const snackbar = useSnackbarStore()

const toneStyles: Record<SnackbarTone, {
  icon: Component
  iconClass: string
  progressClass: string
}> = {
  success: {
    icon: CheckCircle2,
    iconClass: 'bg-primary-50 text-primary-700 ring-primary-100',
    progressClass: 'bg-primary-600',
  },
  error: {
    icon: ShieldAlert,
    iconClass: 'bg-red-50 text-red-700 ring-red-100',
    progressClass: 'bg-danger-500',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'bg-amber-50 text-amber-700 ring-amber-100',
    progressClass: 'bg-warning-500',
  },
  info: {
    icon: Info,
    iconClass: 'bg-blue-50 text-blue-700 ring-blue-100',
    progressClass: 'bg-info-500',
  },
}
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-3 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[390px]"
    aria-live="polite"
    aria-atomic="false"
  >
    <TransitionGroup name="snackbar">
      <article
        v-for="item in snackbar.items"
        :key="item.id"
        class="pointer-events-auto relative w-full overflow-hidden rounded-lg border border-neutral-200/90 bg-white/95 shadow-[0_18px_55px_rgba(16,24,20,0.18)] ring-1 ring-black/[0.03] backdrop-blur-xl"
        role="status"
      >
        <div class="grid grid-cols-[42px_minmax(0,1fr)_32px] items-start gap-3 p-4">
          <span
            :class="[
              'grid h-10 w-10 place-items-center rounded-md ring-1',
              toneStyles[item.tone].iconClass,
            ]"
          >
            <component :is="toneStyles[item.tone].icon" :size="19" :stroke-width="2" />
          </span>

          <div class="min-w-0 pt-0.5">
            <h2 class="text-sm font-semibold tracking-[-0.01em] text-neutral-900">{{ item.title }}</h2>
            <p class="mt-1 text-xs leading-5 text-neutral-500">{{ item.message }}</p>
          </div>

          <button
            type="button"
            title="Tutup notifikasi"
            class="grid h-8 w-8 place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            @click="snackbar.dismiss(item.id)"
          >
            <X :size="16" />
          </button>
        </div>

        <span
          v-if="item.duration > 0"
          :class="['snackbar-progress absolute inset-x-0 bottom-0 h-0.5', toneStyles[item.tone].progressClass]"
          :style="{ animationDuration: `${item.duration}ms` }"
        ></span>
      </article>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.snackbar-enter-active,
.snackbar-leave-active,
.snackbar-move {
  transition:
    opacity 220ms ease,
    transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.snackbar-enter-from,
.snackbar-leave-to {
  opacity: 0;
  transform: translate3d(24px, 10px, 0) scale(0.96);
}

.snackbar-leave-active {
  position: absolute;
}

.snackbar-progress {
  animation-name: snackbar-countdown;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  transform-origin: left;
}

@keyframes snackbar-countdown {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .snackbar-enter-active,
  .snackbar-leave-active,
  .snackbar-move,
  .snackbar-progress {
    animation: none;
    transition: none;
  }
}
</style>

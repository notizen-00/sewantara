<script setup lang="ts">
import { Check } from '@lucide/vue'

const props = defineProps<{
  completion: number
  currentStep: string
  steps: Array<{ key: string; label: string; done: boolean; available: boolean }>
}>()

defineEmits<{
  selectStep: [step: string]
}>()

const chipRefs = ref<Record<string, HTMLElement | null>>({})

function setChipRef(key: string, el: unknown) {
  chipRefs.value[key] = (el as HTMLElement) || null
}

watch(
  () => props.currentStep,
  (key) => {
    nextTick(() => chipRefs.value[key]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }))
  },
  { immediate: true },
)
</script>

<template>
  <aside class="border-neutral-200 bg-neutral-0 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:w-full lg:border-r">
    <!-- Desktop: vertical step list -->
    <div class="hidden px-5 py-6 lg:block">
      <div class="mb-5">
        <p class="text-xs font-semibold uppercase text-neutral-500">Progress onboarding</p>
        <div class="mt-3 h-2 rounded-full bg-neutral-100">
          <div class="h-2 rounded-full bg-primary-600 transition-all" :style="{ width: `${completion}%` }"></div>
        </div>
        <p class="mt-2 text-sm font-semibold text-neutral-700">{{ completion }}% selesai</p>
      </div>

      <nav class="grid gap-1" aria-label="Progress onboarding">
        <button
          v-for="(step, index) in steps"
          :key="step.key"
          type="button"
          :disabled="!step.available"
          :class="[
            'grid w-full grid-cols-[28px_minmax(0,1fr)] items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-60',
            currentStep === step.key
              ? 'bg-primary-50 font-semibold text-primary-700'
              : step.done
                ? 'text-neutral-900 hover:bg-neutral-50'
                : 'text-neutral-500 hover:bg-neutral-50',
          ]"
          @click="$emit('selectStep', step.key)"
        >
          <span
            :class="[
              'grid h-6 w-6 place-items-center rounded-full border text-[11px] font-semibold',
              step.done
                ? 'border-primary-600 bg-primary-600 text-white'
                : currentStep === step.key
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 bg-neutral-0 text-neutral-500',
            ]"
          >
            <Check v-if="step.done" :size="12" :stroke-width="3" />
            <template v-else>{{ index + 1 }}</template>
          </span>
          <span class="truncate">{{ step.label }}</span>
        </button>
      </nav>
    </div>

    <!-- Mobile: compact scrollable step chips -->
    <div class="border-b border-neutral-200 px-4 py-3 lg:hidden">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-xs font-semibold uppercase text-neutral-500">Progress onboarding</p>
        <p class="text-xs font-bold text-primary-700">{{ completion }}%</p>
      </div>
      <div class="h-1.5 rounded-full bg-neutral-100">
        <div class="h-1.5 rounded-full bg-primary-600 transition-all" :style="{ width: `${completion}%` }"></div>
      </div>

      <nav
        class="mt-3 flex gap-2 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Progress onboarding"
      >
        <button
          v-for="(step, index) in steps"
          :key="step.key"
          :ref="(el) => setChipRef(step.key, el)"
          type="button"
          :disabled="!step.available"
          :class="[
            'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
            currentStep === step.key
              ? 'border-primary-600 bg-primary-600 text-white'
              : step.done
                ? 'border-primary-100 bg-primary-50 text-primary-700'
                : 'border-neutral-200 bg-neutral-0 text-neutral-500',
          ]"
          @click="$emit('selectStep', step.key)"
        >
          <span
            :class="[
              'grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px]',
              currentStep === step.key ? 'bg-white/20' : '',
            ]"
          >
            <Check v-if="step.done" :size="10" :stroke-width="3" />
            <template v-else>{{ index + 1 }}</template>
          </span>
          {{ step.label }}
        </button>
      </nav>
    </div>
  </aside>
</template>

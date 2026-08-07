<script setup lang="ts">
import darkLogoUrl from '~/assets/images/favicon-dark.png'

const props = withDefaults(
  defineProps<{
    tone?: 'light' | 'dark'
  }>(),
  {
    tone: 'light',
  },
)

const logoUrl = computed(() =>
  props.tone === 'dark'
    ? '/favicon_io/android-chrome-192x192.png'
    : darkLogoUrl,
)
</script>

<template>
  <div class="flex items-center gap-3">
    <span
      :class="[
        'grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl',
        tone === 'dark' ? 'bg-white/[0.06] ring-1 ring-white/10' : 'bg-neutral-100 ring-1 ring-neutral-200/70',
      ]"
    >
      <img
        :src="logoUrl"
        alt=""
        aria-hidden="true"
        :class="[
          'h-full w-full object-contain',
          tone === 'dark' ? 'p-1' : 'translate-y-1 scale-[3.15]',
        ]"
      />
    </span>
    <div>
      <p :class="['text-[11px] font-bold uppercase leading-none tracking-[0.12em]', tone === 'dark' ? 'text-primary-100' : 'text-primary-600']">
        Sewantara
      </p>
      <p :class="['mt-1 text-sm font-bold leading-none tracking-[-0.01em]', tone === 'dark' ? 'text-white' : 'text-neutral-900']">Mitra</p>
    </div>
  </div>
</template>

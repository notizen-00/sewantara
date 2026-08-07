<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description?: string
}>()
</script>

<template>
  <section class="rounded-lg border border-neutral-200 bg-neutral-0 p-6 shadow-card max-sm:p-4">
    <div class="mb-4">
      <p class="mb-1 text-xs font-semibold uppercase text-neutral-500">{{ eyebrow }}</p>
      <h3 class="text-lg font-semibold text-neutral-900">{{ title }}</h3>
      <p v-if="description" class="mt-1 text-sm leading-6 text-neutral-500">{{ description }}</p>
    </div>
    <slot />
  </section>
</template>

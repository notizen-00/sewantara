<script setup lang="ts">
defineProps<{
  label: string
  value: string
  caption?: string
}>()
</script>

<template>
  <article class="grid min-h-36 content-between rounded-sm border border-neutral-200 bg-neutral-0 p-5 shadow-card">
    <div class="flex items-start justify-between gap-3">
      <span class="text-sm font-medium text-neutral-500">{{ label }}</span>
      <span class="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-neutral-50 text-neutral-700">
        <slot name="icon" />
      </span>
    </div>
    <div class="mt-5">
      <strong class="block break-words text-2xl font-bold text-neutral-900">{{ value }}</strong>
      <p v-if="caption" class="mt-1 text-xs text-neutral-500">{{ caption }}</p>
    </div>
  </article>
</template>

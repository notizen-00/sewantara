<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <article class="grid gap-2 rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
    <span class="text-xs font-semibold text-neutral-500">{{ label }}</span>
    <strong class="break-words text-sm font-semibold text-neutral-900">{{ value }}</strong>
  </article>
</template>

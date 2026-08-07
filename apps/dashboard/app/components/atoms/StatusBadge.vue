<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <span class="inline-flex min-h-8 items-center rounded-sm border border-primary-100 bg-primary-50 px-3 text-xs font-semibold text-primary-700">
    {{ label }}
  </span>
</template>

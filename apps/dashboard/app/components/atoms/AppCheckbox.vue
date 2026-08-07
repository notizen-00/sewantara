<script setup lang="ts">
defineProps<{
  label: string
  required?: boolean
}>()

const model = defineModel<boolean>()
</script>

<template>
  <label class="flex min-h-11 items-center gap-2 text-sm font-medium text-neutral-700">
    <input
      v-model="model"
      type="checkbox"
      :required="required"
      class="h-4 w-4 rounded border-neutral-200 text-primary-600 focus:ring-primary-100"
    />
    <span>{{ label }}</span>
  </label>
</template>

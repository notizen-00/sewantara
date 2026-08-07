<script setup lang="ts" generic="T extends string | number | null">
defineProps<{
  label: string
  options: Array<{ label: string; value: T }>
  required?: boolean
  hideLabel?: boolean
}>()

const model = defineModel<T>()
</script>

<template>
  <label class="grid gap-2 text-sm font-medium text-neutral-700">
    <span :class="{ 'sr-only': hideLabel }">{{ label }}</span>
    <select
      v-model="model"
      :required="required"
      class="min-h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2 text-neutral-900 outline-none transition focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
    >
      <option v-for="option in options" :key="String(option.value)" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

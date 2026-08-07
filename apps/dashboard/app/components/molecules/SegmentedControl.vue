<script setup lang="ts">
defineProps<{
  options: Array<{ label: string; value: string }>
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1.5">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="[
        'min-h-10 rounded-lg text-sm font-semibold transition',
        model === option.value ? 'bg-neutral-0 text-primary-700 shadow-[0_3px_10px_rgba(23,23,23,0.07)]' : 'text-neutral-500 hover:text-neutral-700',
      ]"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

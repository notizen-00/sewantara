<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    description?: string
    disabled?: boolean
  }>(),
  {
    description: undefined,
    disabled: false,
  },
)

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label
    :class="[
      'flex items-start justify-between gap-4 rounded-md border border-neutral-200 bg-neutral-0 p-4',
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    ]"
  >
    <span class="min-w-0">
      <strong class="block text-sm font-semibold text-neutral-900">{{ label }}</strong>
      <span v-if="description" class="mt-1 block text-xs leading-5 text-neutral-500">{{ description }}</span>
    </span>
    <input v-model="model" type="checkbox" class="sr-only" :disabled="disabled" />
    <span
      role="switch"
      :aria-checked="model"
      :class="[
        'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition',
        model ? 'bg-primary-600' : 'bg-neutral-200',
      ]"
    >
      <span
        :class="[
          'absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
          model ? 'translate-x-6' : 'translate-x-1',
        ]"
      ></span>
    </span>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    type?: string
    required?: boolean
    autocomplete?: string
    inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
    maxlength?: number
    minlength?: number
    pattern?: string
    placeholder?: string
    min?: number
    max?: number
    step?: number | string
    disabled?: boolean
  }>(),
  {
    type: 'text',
    required: false,
    autocomplete: undefined,
    inputmode: undefined,
    maxlength: undefined,
    minlength: undefined,
    pattern: undefined,
    placeholder: undefined,
    min: undefined,
    max: undefined,
    step: undefined,
    disabled: false,
  },
)

const model = defineModel<string | number | null>()
</script>

<template>
  <label class="grid gap-2 text-sm font-medium text-neutral-700">
    {{ label }}
    <input
      v-model="model"
      :type="type"
      :required="required"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :maxlength="maxlength"
      :minlength="minlength"
      :pattern="pattern"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      class="min-h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2 text-neutral-900 outline-none transition placeholder:text-neutral-500 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500"
    />
  </label>
</template>

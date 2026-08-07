<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
  },
)

const variants = {
  primary: 'border-primary-600 bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'border-neutral-200 bg-neutral-0 text-neutral-900 hover:bg-neutral-50',
  ghost: 'border-transparent bg-transparent text-neutral-700 hover:bg-neutral-100',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex min-h-11 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60',
      variants[variant],
    ]"
  >
    <slot />
  </button>
</template>

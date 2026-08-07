<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
    tone?: 'success' | 'danger'
  }>(),
  {
    message: '',
    tone: 'success',
  },
)
</script>

<template>
  <div
    v-if="message"
    :class="[
      'rounded-md border px-4 py-3 text-sm font-medium',
      tone === 'success' ? 'border-primary-100 bg-primary-50 text-primary-700' : 'border-red-100 bg-red-50 text-red-700',
    ]"
  >
    {{ message }}
  </div>
</template>

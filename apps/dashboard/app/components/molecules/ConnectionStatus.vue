<script setup lang="ts">
defineProps<{
  online: boolean | null
  tenantId?: string
}>()
</script>

<template>
  <div class="flex items-start gap-3 rounded-md border border-neutral-200 bg-neutral-0 p-3 shadow-card">
    <span :class="['mt-1.5 h-2.5 w-2.5 rounded-full', online ? 'bg-primary-500' : 'bg-warning-500']"></span>
    <div class="min-w-0">
      <strong class="text-xs font-semibold text-neutral-900">{{ online ? 'Sistem terhubung' : 'Memeriksa koneksi' }}</strong>
      <p class="mt-1 text-xs text-neutral-500">{{ online ? 'Layanan siap digunakan' : 'Mohon tunggu' }}</p>
    </div>
  </div>
</template>

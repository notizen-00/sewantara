<script setup lang="ts">
defineProps<{
  tenantName: string
  tenantStatus: string
  currentStep?: string
}>()
</script>

<template>
  <header id="overview" class="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 max-sm:grid-cols-1">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase text-neutral-500">Workspace setup</p>
      <h2 class="break-words text-3xl font-bold tracking-tight text-neutral-900 max-sm:text-2xl">
        {{ tenantName }}
      </h2>
      <p class="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
        {{
          tenantStatus === 'onboarding'
            ? `Lanjutkan tahap ${currentStep || 'penyiapan awal'} agar workspace siap digunakan.`
            : 'Pantau aktivitas operasional tenant dari satu workspace.'
        }}
      </p>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <AtomsStatusBadge :label="tenantStatus" />
    </div>
  </header>
</template>

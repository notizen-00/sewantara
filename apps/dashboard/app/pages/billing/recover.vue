<script setup lang="ts">
import { useMitraDashboard } from '~/application/mitra/useMitraDashboard'

useHead({ title: 'Aktifkan Paket — Sewantara Mitra' })

const dashboard = useMitraDashboard()
</script>

<template>
  <main class="min-h-screen bg-neutral-50 px-4 py-8 text-neutral-900 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="mb-6 flex items-center justify-between gap-4">
        <MoleculesBrandLockup />
        <AtomsAppButton variant="ghost" @click="dashboard.logout">Keluar</AtomsAppButton>
      </div>
      <AtomsNoticeBanner
        tone="danger"
        message="Paket tidak aktif. Selesaikan pembayaran untuk melanjutkan."
      />
      <div class="mt-6">
        <OrganismsBillingWorkspace :show-back="false" />
      </div>
    </div>
  </main>
</template>

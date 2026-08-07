<script setup lang="ts">
import { useMitraDashboard } from '~/application/mitra/useMitraDashboard'

useHead({ title: 'Masuk — Sewantara Mitra' })

const dashboard = useMitraDashboard()
</script>

<template>
  <TemplatesAuthLayout>
    <OrganismsAuthGateway :dashboard="dashboard" />
  </TemplatesAuthLayout>
</template>

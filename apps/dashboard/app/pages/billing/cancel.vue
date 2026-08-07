<script setup lang="ts">
// Halaman ini harus tetap tampil apa pun status auth/tenant/billing —
// dikecualikan dari redirect otomatis layout default.
definePageMeta({ layout: false })
</script>

<template>
  <OrganismsBillingReturn result="cancel" />
</template>

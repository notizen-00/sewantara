<script setup lang="ts">
defineProps<{
  cards: Array<{ label: string; value: string }>
}>()
</script>

<template>
  <section class="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
    <MoleculesSummaryCard v-for="card in cards" :key="card.label" :label="card.label" :value="card.value" />
  </section>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Status pembayaran', robots: 'noindex, nofollow' })
</script>

<template>
  <main class="payment-index">
    <section class="surface-card">
      <UiIcon name="receipt" :size="38" />
      <h1>Cek status pembayaran</h1>
      <p>Masukkan kode pemesanan dan kontak yang digunakan saat checkout untuk melihat status terbaru.</p>
      <NuxtLink to="/tracking" class="button-primary">Lacak pesanan</NuxtLink>
    </section>
  </main>
</template>

<style scoped>
.payment-index { min-height: 70vh; display: grid; place-items: center; padding: 70px 20px; background: #f7faf8; }
.payment-index section { max-width: 540px; padding: 48px; text-align: center; }
.payment-index svg { color: var(--color-primary); }
.payment-index h1 { margin: 16px 0 8px; font-size: 1.8rem; letter-spacing: -.03em; }
.payment-index p { margin: 0 0 24px; color: var(--color-muted); }
</style>

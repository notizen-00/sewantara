<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const isNotFound = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: () => isNotFound.value ? 'Halaman tidak ditemukan' : 'Terjadi kendala',
  robots: 'noindex, nofollow',
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <main class="error-page">
    <section>
      <div class="error-mark"><span>{{ isNotFound ? '404' : error.statusCode || '500' }}</span></div>
      <p class="section-kicker">{{ isNotFound ? 'Tersesat sebentar' : 'Ada kendala' }}</p>
      <h1>{{ isNotFound ? 'Halaman yang dicari tidak ditemukan' : 'Halaman belum dapat dimuat' }}</h1>
      <p>{{ isNotFound ? 'Tautan mungkin sudah berubah atau halaman tidak lagi tersedia.' : 'Kami sedang memperbaikinya. Silakan coba kembali atau mulai dari beranda.' }}</p>
      <div><button class="button-primary" type="button" @click="goHome">Kembali ke beranda</button><button v-if="!isNotFound" class="button-secondary" type="button" @click="clearError()">Coba lagi</button></div>
    </section>
  </main>
</template>

<style scoped>
.error-page { min-height: 100vh; display: grid; place-items: center; padding: 40px 20px; text-align: center; background: #f7faf8; }.error-page section { max-width: 650px; }.error-mark { display: grid; width: 130px; height: 130px; place-items: center; margin: 0 auto 28px; border-radius: 36px; color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 9%, white); transform: rotate(-5deg); }.error-mark span { font-size: 2.2rem; font-weight: 900; letter-spacing: -.05em; transform: rotate(5deg); }.error-page .section-kicker { justify-content: center; }.error-page h1 { margin: 0; font-family: var(--font-heading); font-size: clamp(2.1rem, 6vw, 4rem); letter-spacing: -.055em; line-height: 1.05; }.error-page > section > p:not(.section-kicker) { max-width: 520px; margin: 17px auto 25px; color: var(--color-muted); }.error-page section > div:last-child { display: flex; gap: 10px; justify-content: center; }
@media (max-width: 500px) { .error-page section > div:last-child { flex-direction: column; } }
</style>

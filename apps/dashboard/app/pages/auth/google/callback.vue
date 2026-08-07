<script setup lang="ts">
import { AlertCircle, ArrowLeft, LoaderCircle } from '@lucide/vue'
import { useMitraDashboard } from '~/application/mitra/useMitraDashboard'

// Halaman transisi OAuth murni — tidak boleh terkena redirect otomatis
// layout default sebelum proses login selesai.
definePageMeta({ layout: false })

const route = useRoute()
const auth = useAuthStore()
const dashboard = useMitraDashboard()
const snackbar = useSnackbarStore()
const errorMessage = ref('')

useHead({
  title: 'Memproses Login Google — Sewantara',
})

function queryValue(value: unknown) {
  if (Array.isArray(value)) return String(value[0] || '')
  return typeof value === 'string' ? value : ''
}

onMounted(async () => {
  const providerError = queryValue(route.query.error_description || route.query.error)
  const code = queryValue(route.query.code)

  // Hilangkan authorization code dari address bar dan browser history.
  window.history.replaceState(window.history.state, '', route.path)

  if (providerError) {
    errorMessage.value = providerError
    return
  }

  if (!code) {
    errorMessage.value = 'Kode otorisasi Google tidak ditemukan. Silakan ulangi proses login.'
    return
  }

  try {
    await auth.loginWithGoogleCode(code)
  } catch {
    errorMessage.value = auth.error || 'Login dengan Google gagal. Silakan coba kembali.'
    return
  }

  try {
    // dashboard bisa saja sudah pernah initialize() sebelum login ini (mis.
    // dari /login), yang tidak akan berjalan ulang — jadi tenant/branch data
    // perlu di-refresh eksplisit di sini.
    await dashboard.refreshTenantData(false)
  } catch {
    // Status "butuh billing recovery" sudah ditangani lewat event subscription-error.
  }

  snackbar.success('Login dengan Google berhasil.', 'Selamat datang')
  await navigateTo('/', { replace: true })
})
</script>

<template>
  <TemplatesAuthLayout>
    <section class="mx-auto w-full max-w-md rounded-[28px] border border-white/80 bg-white px-6 py-10 text-center shadow-[0_30px_90px_rgba(76,5,25,0.14)] ring-1 ring-neutral-900/[0.04] sm:px-10">
      <div class="mb-8 flex justify-center">
        <MoleculesBrandLockup />
      </div>

      <template v-if="!errorMessage">
        <span class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary-50 text-primary-700">
          <LoaderCircle :size="30" class="animate-spin" />
        </span>
        <h1 class="mt-6 text-2xl font-bold tracking-[-0.03em] text-neutral-900">
          Memproses login Google
        </h1>
        <p class="mt-3 text-sm leading-6 text-neutral-500">
          Tunggu sebentar, kami sedang memverifikasi akun dan menyiapkan workspace Anda.
        </p>

        <div class="mt-7 h-1.5 overflow-hidden rounded-full bg-neutral-100">
          <span class="google-progress block h-full w-2/5 rounded-full bg-primary-600"></span>
        </div>
      </template>

      <template v-else>
        <span class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle :size="30" />
        </span>
        <h1 class="mt-6 text-2xl font-bold tracking-[-0.03em] text-neutral-900">
          Login Google belum berhasil
        </h1>
        <p class="mt-3 text-sm leading-6 text-neutral-500">
          {{ errorMessage }}
        </p>
        <NuxtLink
          to="/login"
          class="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(190,18,60,0.2)] transition hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
        >
          <ArrowLeft :size="17" />
          Kembali ke halaman login
        </NuxtLink>
      </template>
    </section>
  </TemplatesAuthLayout>
</template>

<style scoped>
.google-progress {
  animation: google-progress 1.4s ease-in-out infinite;
}

@keyframes google-progress {
  from {
    transform: translateX(-110%);
  }

  to {
    transform: translateX(360%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .google-progress {
    animation: none;
    margin-inline: auto;
  }
}
</style>

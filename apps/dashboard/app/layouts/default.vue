<script setup lang="ts">
import { useMitraDashboard } from '~/application/mitra/useMitraDashboard'

useHead({
  title: 'Sewantara Mitra Dashboard',
  meta: [
    {
      name: 'description',
      content: 'Dashboard mitra SaaS Sewantara untuk registrasi, onboarding, dan operasional tenant.',
    },
  ],
})

const dashboard = useMitraDashboard()
const snackbar = useSnackbarStore()
const route = useRoute()
const router = useRouter()

onMounted(() => dashboard.initialize())

watch(
  () => dashboard.successMessage,
  (message) => {
    if (message) snackbar.success(message)
  },
)

watch(
  () => dashboard.errorMessage,
  (message) => {
    if (message) snackbar.error(message)
  },
)

const AUTH_PATHS = new Set(['/login', '/register'])

function isWithin(base: string) {
  return route.path === base || route.path.startsWith(`${base}/`)
}

/**
 * Single source of truth for "which route matches the current auth/tenant
 * state" — mirrors the state machine that used to live as v-if branches on
 * one page. Returns null when the current route is already correct, so that
 * nested routes (/dashboard/products, /onboarding/rental) are left alone.
 */
function resolveExpectedPath(): string | null {
  if (!dashboard.isInitialized) return null

  if (!dashboard.auth.isAuthenticated) {
    return AUTH_PATHS.has(route.path) ? null : '/login'
  }

  if (dashboard.requiresBillingRecovery) {
    return isWithin('/billing/recover') ? null : '/billing/recover'
  }

  if (dashboard.auth.tenantStatus === 'onboarding') {
    return isWithin('/onboarding') ? null : '/onboarding'
  }

  return isWithin('/dashboard') ? null : '/dashboard'
}

const expectedPath = computed(resolveExpectedPath)
const isRedirecting = computed(() => Boolean(expectedPath.value && expectedPath.value !== route.path))

watch(
  expectedPath,
  (target) => {
    if (target && target !== route.path) router.replace(target)
  },
  { immediate: true },
)
</script>

<template>
  <TemplatesAuthLayout v-if="!dashboard.isInitialized || isRedirecting">
    <div class="grid justify-items-center gap-4 text-center">
      <MoleculesBrandLockup />
      <p v-if="dashboard.initFailed" class="text-sm font-medium text-neutral-500">
        Gagal memuat sesi. Periksa koneksi ke server.
      </p>
      <p v-else class="text-sm font-medium text-neutral-500">Memulihkan sesi...</p>
      <button
        v-if="dashboard.initFailed"
        type="button"
        class="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        @click="dashboard.initialize()"
      >
        Coba lagi
      </button>
    </div>
  </TemplatesAuthLayout>
  <slot v-else />
</template>

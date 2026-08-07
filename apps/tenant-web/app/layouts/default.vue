<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from '#app/composables/router'
import { setResponseStatus } from '#app/composables/ssr'
import { useTenant } from '~/composables/useTenant'
import { useTenantSeo } from '~/composables/useTenantSeo'
import { useTenantTheme } from '~/composables/useTenantTheme'

const route = useRoute()
const { tenant, status, error } = useTenant()
const { themeStyle } = useTenantTheme(tenant)

useTenantSeo(tenant)

const isTransactionalRoute = computed(() => [
  /^\/booking(?:\/|$)/,
  /^\/checkout(?:\/|$)/,
  /^\/payment(?:\/|$)/,
  /^\/tracking(?:\/|$)/,
  /^\/(?:login|register)(?:\/|$)/,
].some(pattern => pattern.test(route.path)))

const isProductDetail = computed(() => /^\/catalog\/[^/]+\/?$/.test(route.path))
const tenantUnavailable = computed(() => tenant.value.status !== 'active')
const showMobileNavigation = computed(() => (
  !tenantUnavailable.value && !isTransactionalRoute.value && !isProductDetail.value
))
const minimalHeader = computed(() => (
  tenantUnavailable.value || (isTransactionalRoute.value && !route.path.startsWith('/tracking'))
))
const tenantLoading = computed(() => status.value === 'pending')
const tenantStatusCopy = computed(() => tenant.value.status === 'maintenance'
  ? {
      eyebrow: 'Pemeliharaan terjadwal',
      title: 'Kami sedang melakukan perawatan',
      description: 'Layanan akan kembali tersedia secepatnya. Terima kasih sudah menunggu.',
    }
  : {
      eyebrow: 'Pemberitahuan',
      title: 'Situs sementara tidak tersedia',
      description: 'Silakan kembali beberapa saat lagi atau hubungi tim kami bila Anda membutuhkan bantuan.',
    })
const tenantWhatsappUrl = computed(() => {
  const digits = tenant.value.contact.whatsapp.replace(/\D/g, '').replace(/^0/, '62')
  return digits ? `https://wa.me/${digits}` : null
})

watchEffect(() => {
  if (import.meta.server && tenantUnavailable.value) setResponseStatus(503)
})

function reloadPage() {
  if (import.meta.client) window.location.reload()
}
</script>

<template>
  <div
    class="tenant-site"
    :class="{
      'tenant-site--with-mobile-nav': showMobileNavigation,
      'tenant-site--dark': tenant.theme.darkMode,
    }"
    :style="themeStyle"
  >
    <a class="skip-link" href="#main-content">Lewati ke konten utama</a>

    <AppHeader :tenant="tenant" :minimal="minimalHeader" :loading="tenantLoading" />

    <div id="main-content" class="tenant-site__main" tabindex="-1">
      <section v-if="tenantUnavailable" class="tenant-status" role="status">
        <span class="tenant-status__icon" aria-hidden="true">
          <UiIcon name="clock" :size="30" />
        </span>
        <p class="section-kicker">{{ tenantStatusCopy.eyebrow }}</p>
        <h1>{{ tenantStatusCopy.title }}</h1>
        <p>{{ tenantStatusCopy.description }}</p>
        <div class="tenant-status__actions">
          <button type="button" class="button-primary" @click="reloadPage">
            <UiIcon name="refresh" :size="17" />
            Coba lagi
          </button>
          <a
            v-if="tenantWhatsappUrl"
            :href="tenantWhatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="button-secondary"
          >
            <UiIcon name="whatsapp" :size="17" />
            Hubungi kami
          </a>
        </div>
      </section>
      <slot v-else ></slot>
    </div>

    <p v-if="error" class="sr-only" role="status">
      Identitas tenant belum dapat dimuat. Tampilan sementara digunakan.
    </p>

    <AppFooter :tenant="tenant" :compact="isTransactionalRoute || tenantUnavailable" />
    <MobileBottomNav v-if="showMobileNavigation" :tenant="tenant" />
  </div>
</template>

<style scoped>
.tenant-site {
  min-height: 100vh;
  color: var(--color-ink);
  background: var(--color-surface);
  font-family: var(--font-body);
}

.tenant-site__main {
  min-height: 55vh;
  outline: none;
}

.tenant-status {
  display: grid;
  min-height: min(650px, 70vh);
  place-items: center;
  align-content: center;
  padding: 72px 20px;
  text-align: center;
}

.tenant-status__icon {
  display: grid;
  width: 68px;
  height: 68px;
  margin-bottom: 20px;
  place-items: center;
  border-radius: 22px;
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface));
}

.tenant-status .section-kicker {
  margin-inline: auto;
}

.tenant-status h1 {
  max-width: 660px;
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 870;
  letter-spacing: -0.055em;
  line-height: 1.04;
}

.tenant-status > p:not(.section-kicker) {
  max-width: 560px;
  margin: 18px 0 0;
  color: var(--color-muted);
}

.tenant-status__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
}

.tenant-site :deep(.button-primary) {
  color: var(--color-primary-foreground, white);
}

.skip-link {
  position: fixed;
  z-index: 100;
  top: 10px;
  left: 12px;
  min-height: 44px;
  padding: 10px 16px;
  border-radius: 10px;
  color: var(--color-primary-foreground, white);
  background: var(--color-primary);
  font-size: 0.82rem;
  font-weight: 800;
  transform: translateY(-160%);
  transition: transform 140ms ease;
}

.skip-link:focus {
  transform: translateY(0);
}

@media (max-width: 720px) {
  .tenant-site--with-mobile-nav .tenant-site__main {
    padding-bottom: 74px;
  }
}
</style>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from '#app/composables/router'
import type { Tenant } from '~~/shared/types'

const props = withDefaults(defineProps<{
  tenant: Tenant
  minimal?: boolean
  loading?: boolean
}>(), {
  minimal: false,
  loading: false,
})

const route = useRoute()
const menuOpen = ref(false)
const menuTrigger = ref<HTMLButtonElement | null>(null)
const menuPanel = ref<HTMLElement | null>(null)
let previousBodyOverflow = ''

const navigation = computed(() => [
  { label: 'Beranda', to: '/' },
  { label: 'Katalog', to: '/catalog' },
  ...(props.tenant.features.blog ? [{ label: 'Blog', to: '/blog' }] : []),
  { label: 'Tentang', to: '/about' },
  { label: 'Kontak', to: '/contact' },
])

const whatsappUrl = computed(() => {
  const digits = props.tenant.contact.whatsapp.replace(/\D/g, '').replace(/^0/, '62')
  return digits ? `https://wa.me/${digits}` : null
})

function isActive(to: string): boolean {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

function closeMenu(restoreFocus = true) {
  if (!menuOpen.value) return
  menuOpen.value = false
  if (restoreFocus) nextTick(() => menuTrigger.value?.focus())
}

function handleMenuKeydown(event: KeyboardEvent) {
  if (!menuOpen.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu()
    return
  }

  if (event.key !== 'Tab' || !menuPanel.value) return
  const focusable = [...menuPanel.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )]
  if (!focusable.length) return

  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(menuOpen, async (open) => {
  if (!import.meta.client) return
  if (open) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    await nextTick()
    menuPanel.value?.querySelector<HTMLElement>('button, a[href]')?.focus()
  }
  else {
    document.body.style.overflow = previousBodyOverflow
  }
})

watch(() => route.fullPath, () => closeMenu(false))

onMounted(() => window.addEventListener('keydown', handleMenuKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleMenuKeydown)
  document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <header class="site-header" :class="{ 'site-header--minimal': minimal }">
    <div class="container-shell site-header__inner">
      <NuxtLink to="/" class="site-header__brand" :aria-label="`${tenant.businessName}, ke beranda`">
        <TenantLogo :tenant="tenant" eager />
      </NuxtLink>

      <nav v-if="!minimal" class="site-header__desktop-nav" aria-label="Navigasi utama">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :class="{ 'site-header__nav-link--active': isActive(item.to) }"
          class="site-header__nav-link"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="site-header__actions">
        <NuxtLink v-if="!minimal" to="/catalog" class="site-header__icon-button" aria-label="Cari produk">
          <UiIcon name="search" />
        </NuxtLink>
        <NuxtLink v-if="!minimal" to="/tracking" class="site-header__track-link">
          Lacak pesanan
        </NuxtLink>
        <NuxtLink
          v-if="!minimal && tenant.features.customerLogin"
          to="/login"
          class="site-header__icon-button site-header__account"
          aria-label="Masuk ke akun"
        >
          <UiIcon name="user" />
        </NuxtLink>
        <a
          v-if="minimal && whatsappUrl"
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="site-header__help"
        >
          <UiIcon name="whatsapp" :size="18" />
          <span>Butuh bantuan?</span>
        </a>
        <NuxtLink v-else-if="minimal" to="/contact" class="site-header__help">
          <UiIcon name="phone" :size="18" />
          <span>Butuh bantuan?</span>
        </NuxtLink>
        <button
          v-if="!minimal"
          ref="menuTrigger"
          type="button"
          class="site-header__menu-trigger"
          aria-label="Buka menu"
          aria-controls="mobile-site-menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = true"
        >
          <UiIcon name="menu" :size="22" />
        </button>
      </div>
    </div>

    <div v-if="loading" class="site-header__progress" role="progressbar" aria-label="Memuat informasi tenant" ></div>

    <div v-if="menuOpen && !minimal" class="site-header__mobile-layer" aria-hidden="false">
      <button type="button" class="site-header__backdrop" aria-label="Tutup menu" @click="closeMenu()" ></button>
      <section
        id="mobile-site-menu"
        ref="menuPanel"
        class="site-header__mobile-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
      >
        <div class="site-header__mobile-head">
          <TenantLogo :tenant="tenant" />
          <button type="button" class="site-header__close" aria-label="Tutup menu" @click="closeMenu()">
            <UiIcon name="x" :size="22" />
          </button>
        </div>

        <nav class="site-header__mobile-nav" aria-label="Navigasi seluler">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            :aria-current="isActive(item.to) ? 'page' : undefined"
          >
            {{ item.label }}
            <UiIcon name="chevron-right" :size="18" />
          </NuxtLink>
          <NuxtLink to="/tracking">
            Lacak pesanan
            <UiIcon name="chevron-right" :size="18" />
          </NuxtLink>
          <NuxtLink v-if="tenant.features.wishlist" to="/profile/wishlist">
            Favorit
            <UiIcon name="chevron-right" :size="18" />
          </NuxtLink>
        </nav>

        <div class="site-header__mobile-actions">
          <NuxtLink to="/catalog" class="button-primary button-block">
            Lihat katalog
            <UiIcon name="arrow-right" :size="18" />
          </NuxtLink>
          <a
            v-if="whatsappUrl"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="button-secondary button-block"
          >
            <UiIcon name="whatsapp" :size="18" />
            Chat via WhatsApp
          </a>
        </div>
      </section>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  z-index: 50;
  top: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--color-line) 75%, transparent);
  background: color-mix(in srgb, var(--color-surface) 92%, transparent);
  box-shadow: 0 6px 24px rgb(23 33 31 / 4%);
  backdrop-filter: blur(16px);
}

.site-header__inner {
  display: flex;
  min-height: 76px;
  align-items: center;
  gap: 30px;
}

.site-header--minimal .site-header__inner {
  min-height: 68px;
  justify-content: space-between;
}

.site-header__brand {
  min-width: 0;
  flex: 0 1 auto;
}

.site-header__desktop-nav {
  display: flex;
  align-items: center;
  gap: clamp(16px, 2vw, 28px);
  margin-left: auto;
}

.site-header__nav-link,
.site-header__track-link {
  position: relative;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  color: var(--color-muted);
  font-size: 0.82rem;
  font-weight: 720;
  white-space: nowrap;
}

.site-header__nav-link::after {
  position: absolute;
  right: 0;
  bottom: 4px;
  left: 0;
  height: 2px;
  border-radius: 99px;
  background: var(--color-primary);
  content: '';
  opacity: 0;
  transform: scaleX(0.5);
  transition: opacity 160ms ease, transform 160ms ease;
}

.site-header__nav-link:hover,
.site-header__nav-link--active,
.site-header__track-link:hover {
  color: var(--color-ink);
}

.site-header__nav-link--active::after {
  opacity: 1;
  transform: scaleX(1);
}

.site-header__actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.site-header__icon-button,
.site-header__menu-trigger,
.site-header__close {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 50%;
  color: var(--color-ink);
  background: transparent;
}

.site-header__icon-button:hover,
.site-header__menu-trigger:hover,
.site-header__close:hover {
  border-color: var(--color-line);
  background: var(--color-soft);
}

.site-header__track-link {
  margin-inline: 3px;
}

.site-header__menu-trigger {
  display: none;
}

.site-header__help {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 7px;
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 780;
}

.site-header__progress {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.site-header__progress::after {
  display: block;
  width: 38%;
  height: 100%;
  background: var(--color-primary);
  animation: header-progress 1.1s ease-in-out infinite;
  content: '';
}

.site-header__mobile-layer {
  position: fixed;
  z-index: 70;
  inset: 0;
}

.site-header__backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  border: 0;
  background: rgb(10 18 16 / 46%);
  backdrop-filter: blur(3px);
}

.site-header__mobile-panel {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  width: min(88vw, 390px);
  height: 100%;
  flex-direction: column;
  overflow-y: auto;
  padding: 18px 20px max(24px, env(safe-area-inset-bottom));
  color: var(--color-ink);
  background: var(--color-surface);
  box-shadow: -20px 0 60px rgb(0 0 0 / 18%);
  animation: menu-enter 220ms ease both;
}

.site-header__mobile-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--color-line);
}

.site-header__mobile-nav {
  display: grid;
  margin-block: 12px 24px;
}

.site-header__mobile-nav a {
  display: flex;
  min-height: 54px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--color-line);
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 760;
}

.site-header__mobile-nav a[aria-current='page'] {
  color: var(--color-primary);
}

.site-header__mobile-actions {
  display: grid;
  gap: 10px;
  margin-top: auto;
}

@keyframes menu-enter {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes header-progress {
  from { transform: translateX(-110%); }
  to { transform: translateX(365%); }
}

@media (max-width: 1000px) {
  .site-header__desktop-nav,
  .site-header__track-link,
  .site-header__account {
    display: none;
  }

  .site-header__actions {
    margin-left: auto;
  }

  .site-header__menu-trigger {
    display: grid;
  }
}

@media (max-width: 600px) {
  .site-header__inner {
    min-height: 64px;
    gap: 8px;
  }

  .site-header--minimal .site-header__inner {
    min-height: 62px;
  }

  .site-header__help span {
    display: none;
  }
}
</style>

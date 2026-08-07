<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#app/composables/router'
import type { Tenant } from '~~/shared/types'

const props = defineProps<{
  tenant: Tenant
}>()

const route = useRoute()
const items = computed(() => [
  { label: 'Beranda', to: '/', icon: 'home' },
  { label: 'Katalog', to: '/catalog', icon: 'grid' },
  { label: 'Pesanan', to: '/tracking', icon: 'receipt' },
  ...(props.tenant.features.wishlist
    ? [{ label: 'Favorit', to: '/profile/wishlist', icon: 'heart' }]
    : []),
  { label: 'Akun', to: props.tenant.features.customerLogin ? '/profile' : '/contact', icon: 'user' },
])

function isActive(to: string): boolean {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <nav class="mobile-bottom-nav" aria-label="Navigasi cepat">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="mobile-bottom-nav__item"
      :class="{ 'mobile-bottom-nav__item--active': isActive(item.to) }"
      :aria-current="isActive(item.to) ? 'page' : undefined"
    >
      <UiIcon :name="item.icon" :size="20" :fill="item.icon === 'heart' && isActive(item.to) ? 'currentColor' : 'none'" />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.mobile-bottom-nav {
  position: fixed;
  z-index: 45;
  right: 0;
  bottom: 0;
  left: 0;
  display: none;
  min-height: calc(66px + env(safe-area-inset-bottom));
  align-items: flex-start;
  justify-content: space-around;
  padding: 7px 8px env(safe-area-inset-bottom);
  border-top: 1px solid var(--color-line);
  background: color-mix(in srgb, var(--color-surface) 94%, transparent);
  box-shadow: 0 -8px 30px rgb(23 33 31 / 8%);
  backdrop-filter: blur(18px);
}

.mobile-bottom-nav__item {
  display: flex;
  min-width: 54px;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3px;
  border-radius: 12px;
  color: var(--color-muted);
  font-size: 0.62rem;
  font-weight: 700;
}

.mobile-bottom-nav__item--active {
  color: var(--color-primary);
}

@media (max-width: 720px) {
  .mobile-bottom-nav {
    display: flex;
  }
}
</style>

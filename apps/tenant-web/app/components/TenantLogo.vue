<script setup lang="ts">
import { computed } from 'vue'
import type { Tenant } from '~~/shared/types'

const props = withDefaults(defineProps<{
  tenant?: Tenant
  name?: string
  logoUrl?: string | null
  compact?: boolean
  eager?: boolean
}>(), {
  tenant: undefined,
  name: undefined,
  logoUrl: undefined,
  compact: false,
  eager: false,
})

const displayName = computed(() => props.name || props.tenant?.businessName || 'Sewantara')
const logo = computed(() => props.logoUrl || props.tenant?.theme.logo.url)
const initials = computed(() => displayName.value
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part.charAt(0).toUpperCase())
  .join(''))
</script>

<template>
  <span class="tenant-logo" :class="{ 'tenant-logo--compact': compact }">
    <span class="tenant-logo__media">
      <NuxtImg
        v-if="logo"
        :src="logo"
        :alt="`Logo ${displayName}`"
        width="96"
        height="96"
        sizes="48px"
        fit="contain"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : 'auto'"
        class="tenant-logo__image"
      />
      <span v-else aria-hidden="true" class="tenant-logo__fallback">{{ initials }}</span>
    </span>
    <span v-if="!compact" class="tenant-logo__name">{{ displayName }}</span>
  </span>
</template>

<style scoped>
.tenant-logo {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
}

.tenant-logo__media {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-primary) 18%, var(--color-line));
  border-radius: 13px;
  background: color-mix(in srgb, var(--tenant-brand-color, var(--color-primary)) 9%, white);
}

.tenant-logo__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.tenant-logo__fallback {
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 850;
  letter-spacing: -0.03em;
}

.tenant-logo__name {
  overflow: hidden;
  color: var(--color-ink);
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 820;
  letter-spacing: -0.025em;
  line-height: 1.15;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tenant-logo--compact .tenant-logo__media {
  width: 36px;
  height: 36px;
  border-radius: 11px;
}

@media (max-width: 420px) {
  .tenant-logo__name {
    max-width: 148px;
  }
}
</style>

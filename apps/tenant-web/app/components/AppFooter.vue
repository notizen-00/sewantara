<script setup lang="ts">
import { computed } from 'vue'
import type { Tenant } from '~~/shared/types'

const props = withDefaults(defineProps<{
  tenant: Tenant
  compact?: boolean
}>(), {
  compact: false,
})

const year = new Date().getFullYear()
const whatsappUrl = computed(() => {
  const digits = props.tenant.contact.whatsapp.replace(/\D/g, '').replace(/^0/, '62')
  return digits ? `https://wa.me/${digits}` : null
})
const phoneUrl = computed(() => props.tenant.contact.phone
  ? `tel:${props.tenant.contact.phone.replace(/[^\d+]/g, '')}`
  : null)
const socialLinks = computed(() => [
  { label: 'Instagram', url: props.tenant.contact.instagram },
  { label: 'Facebook', url: props.tenant.contact.facebook },
  { label: 'TikTok', url: props.tenant.contact.tiktok },
].filter((item): item is { label: string, url: string } => Boolean(item.url)))
</script>

<template>
  <footer class="site-footer" :class="{ 'site-footer--compact': compact }">
    <div v-if="!compact" class="container-shell site-footer__main">
      <div class="site-footer__brand">
        <TenantLogo :tenant="tenant" />
        <p>{{ tenant.description }}</p>
        <div v-if="socialLinks.length" class="site-footer__socials" aria-label="Media sosial">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${social.label} ${tenant.businessName}, terbuka di tab baru`"
          >
            {{ social.label }}
            <UiIcon name="external-link" :size="13" />
          </a>
        </div>
      </div>

      <nav class="site-footer__column" aria-label="Jelajahi">
        <h2>Jelajahi</h2>
        <NuxtLink to="/">Beranda</NuxtLink>
        <NuxtLink to="/catalog">Katalog</NuxtLink>
        <NuxtLink v-if="tenant.features.blog" to="/blog">Blog</NuxtLink>
        <NuxtLink to="/about">Tentang kami</NuxtLink>
      </nav>

      <nav class="site-footer__column" aria-label="Bantuan">
        <h2>Bantuan</h2>
        <NuxtLink to="/tracking">Lacak pesanan</NuxtLink>
        <NuxtLink to="/contact">Hubungi kami</NuxtLink>
        <a :href="tenant.cancellationPolicyUrl">Kebijakan pembatalan</a>
      </nav>

      <div class="site-footer__column site-footer__contact">
        <h2>Kontak</h2>
        <a v-if="whatsappUrl" :href="whatsappUrl" target="_blank" rel="noopener noreferrer">
          <UiIcon name="whatsapp" :size="17" />
          {{ tenant.contact.whatsapp }}
        </a>
        <a v-else-if="phoneUrl" :href="phoneUrl">
          <UiIcon name="phone" :size="17" />
          {{ tenant.contact.phone }}
        </a>
        <a v-if="tenant.contact.email" :href="`mailto:${tenant.contact.email}`">
          <UiIcon name="mail" :size="17" />
          {{ tenant.contact.email }}
        </a>
        <a
          v-if="tenant.contact.mapUrl"
          :href="tenant.contact.mapUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <UiIcon name="map-pin" :size="17" />
          <span>{{ tenant.contact.address }}</span>
        </a>
        <p v-else-if="tenant.contact.address">
          <UiIcon name="map-pin" :size="17" />
          <span>{{ tenant.contact.address }}</span>
        </p>
      </div>
    </div>

    <div class="container-shell site-footer__bottom">
      <p>© {{ year }} {{ tenant.businessName }}. Hak cipta dilindungi.</p>
      <nav aria-label="Informasi hukum">
        <a :href="tenant.termsUrl">Syarat & ketentuan</a>
        <a :href="tenant.privacyUrl">Privasi</a>
      </nav>
      <p class="site-footer__powered">Didukung oleh Sewantara</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  color: #e5eeeb;
  background: #10201c;
}

.site-footer__main {
  display: grid;
  grid-template-columns: minmax(250px, 1.7fr) repeat(3, minmax(130px, 1fr));
  gap: clamp(30px, 5vw, 72px);
  padding-block: clamp(52px, 7vw, 82px);
}

.site-footer :deep(.tenant-logo__name) {
  color: white;
}

.site-footer :deep(.tenant-logo__media) {
  background: white;
}

.site-footer__brand > p {
  max-width: 340px;
  margin: 18px 0 0;
  color: rgb(255 255 255 / 64%);
  font-size: 0.84rem;
  line-height: 1.7;
}

.site-footer__socials {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-top: 20px;
}

.site-footer__socials a {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  gap: 5px;
  color: rgb(255 255 255 / 74%);
  font-size: 0.72rem;
  font-weight: 700;
}

.site-footer__column {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 11px;
}

.site-footer__column h2 {
  margin: 5px 0 8px;
  color: white;
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 820;
  letter-spacing: 0.02em;
}

.site-footer__column > a,
.site-footer__column > p {
  display: flex;
  min-height: 30px;
  align-items: flex-start;
  gap: 8px;
  margin: 0;
  color: rgb(255 255 255 / 63%);
  font-size: 0.75rem;
  line-height: 1.5;
}

.site-footer__column > a:hover,
.site-footer__socials a:hover {
  color: white;
}

.site-footer__contact span {
  max-width: 220px;
}

.site-footer__bottom {
  display: flex;
  min-height: 74px;
  align-items: center;
  gap: 22px;
  border-top: 1px solid rgb(255 255 255 / 10%);
  color: rgb(255 255 255 / 48%);
  font-size: 0.68rem;
}

.site-footer__bottom p {
  margin: 0;
}

.site-footer__bottom nav {
  display: flex;
  gap: 18px;
}

.site-footer__bottom a:hover {
  color: white;
}

.site-footer__powered {
  margin-left: auto !important;
}

.site-footer--compact {
  background: var(--color-soft);
}

.site-footer--compact .site-footer__bottom {
  min-height: 66px;
  border-color: var(--color-line);
  color: var(--color-muted);
}

@media (max-width: 900px) {
  .site-footer__main {
    grid-template-columns: 1.4fr 1fr 1fr;
  }

  .site-footer__contact {
    grid-column: 2 / -1;
  }
}

@media (max-width: 640px) {
  .site-footer__main {
    grid-template-columns: 1fr 1fr;
    gap: 34px 24px;
  }

  .site-footer__brand,
  .site-footer__contact {
    grid-column: 1 / -1;
  }

  .site-footer__bottom {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
    padding-block: 19px calc(88px + env(safe-area-inset-bottom));
  }

  .site-footer--compact .site-footer__bottom {
    padding-bottom: 20px;
  }

  .site-footer__bottom nav {
    flex-wrap: wrap;
    gap: 8px 18px;
  }

  .site-footer__powered {
    margin-left: 0 !important;
  }
}
</style>

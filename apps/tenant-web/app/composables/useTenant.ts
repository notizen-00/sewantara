import { computed } from 'vue'
import { useFetch } from '#app/composables/fetch'
import type { ApiResponse, Tenant } from '~~/shared/types'

export type TenantPublic = Tenant

export interface TenantNavigationItem {
  label: string
  to: string
  external?: boolean
}

const FALLBACK_TENANT: Tenant = {
  id: 'fallback',
  slug: 'sewantara',
  hostname: 'sewantara.id',
  status: 'active',
  businessName: 'Sewantara',
  tagline: 'Pesan kebutuhanmu dengan mudah',
  description: 'Temukan pilihan, cek ketersediaan, dan selesaikan pemesanan secara online.',
  timezone: 'Asia/Jakarta',
  locale: 'id-ID',
  currency: 'IDR',
  theme: {
    primary: '#176b5b',
    primaryForeground: '#ffffff',
    secondary: '#ff7a4d',
    secondaryForeground: '#17211f',
    accent: '#e8f3ef',
    background: '#ffffff',
    foreground: '#17211f',
    muted: '#f3f7f5',
    fontFamily: 'Inter',
    logo: { url: '', alt: 'Sewantara' },
    favicon: '/favicon.ico',
    darkMode: false,
  },
  contact: {
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
  },
  businessHours: [],
  locations: [],
  paymentMethods: [],
  features: {
      customerLogin: false,
      guestBooking: true,
      wishlist: false,
    reviews: true,
    blog: true,
    darkMode: false,
  },
  seo: {
    title: 'Sewantara',
    titleTemplate: '%s · Sewantara',
    description: 'Temukan pilihan, cek ketersediaan, dan selesaikan pemesanan secara online.',
    canonicalUrl: 'https://sewantara.id',
    ogImage: '',
    keywords: [],
  },
  termsUrl: '/terms',
  privacyUrl: '/privacy',
  cancellationPolicyUrl: '/cancellation-policy',
  configVersion: 'fallback',
}

function isTenant(value: unknown): value is Tenant {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<Tenant>
  return typeof candidate.businessName === 'string'
    && typeof candidate.slug === 'string'
    && Boolean(candidate.theme)
    && Boolean(candidate.contact)
}

export function normalizeTenant(payload: unknown): Tenant {
  if (isTenant(payload)) return payload
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const data = (payload as { data?: unknown }).data
    if (isTenant(data)) return data
  }
  return FALLBACK_TENANT
}

export function useTenant() {
  const asyncTenant = useFetch<ApiResponse<Tenant>>('/api/public/tenant', {
    key: 'public-tenant',
    dedupe: 'defer',
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
    },
  })

  const tenant = computed(() => normalizeTenant(asyncTenant.data.value))
  const isFallback = computed(() => !asyncTenant.data.value || Boolean(asyncTenant.error.value))

  return {
    ...asyncTenant,
    tenant,
    isFallback,
  }
}

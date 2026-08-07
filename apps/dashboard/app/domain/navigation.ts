export const DASHBOARD_SECTIONS = [
  'overview',
  'bookings',
  'calendar',
  'customers',
  'users',
  'products',
  'inventory',
  'pricing',
  'maintenance',
  'reports',
  'billing',
  'services',
  'settings',
  'help',
] as const

export type DashboardSection = (typeof DASHBOARD_SECTIONS)[number]

export const DASHBOARD_SECTION_LABELS: Record<DashboardSection, string> = {
  overview: 'Dashboard',
  bookings: 'Booking',
  calendar: 'Kalender',
  customers: 'Pelanggan',
  users: 'Pengguna',
  products: 'Produk',
  inventory: 'Inventory',
  pricing: 'Harga',
  maintenance: 'Maintenance',
  reports: 'Laporan',
  billing: 'Paket & Tagihan',
  services: 'Layanan Bisnis',
  settings: 'Pengaturan',
  help: 'Bantuan',
}

export const DEFAULT_DASHBOARD_SECTION: DashboardSection = 'overview'

export function isDashboardSection(value: unknown): value is DashboardSection {
  return DASHBOARD_SECTIONS.includes(value as DashboardSection)
}

export const ONBOARDING_STEPS = [
  'business',
  'rental',
  'inventory',
  'pricing',
  'booking',
  'payment',
  'review',
] as const

export type OnboardingStepKey = (typeof ONBOARDING_STEPS)[number]

export const ONBOARDING_STEP_LABELS: Record<OnboardingStepKey, string> = {
  business: 'Informasi Usaha',
  rental: 'Model Penyewaan',
  inventory: 'Resource & Unit',
  pricing: 'Harga',
  booking: 'Booking',
  payment: 'Pembayaran',
  review: 'Review & Aktivasi',
}

export const DEFAULT_ONBOARDING_STEP: OnboardingStepKey = 'business'

export function isOnboardingStep(value: unknown): value is OnboardingStepKey {
  return ONBOARDING_STEPS.includes(value as OnboardingStepKey)
}

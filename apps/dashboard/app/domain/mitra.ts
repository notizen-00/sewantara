export type TenantStatus = 'onboarding' | 'active' | 'suspended'
export type BillingInterval = 'month' | 'year'
export type InventoryType = 'serialized' | 'quantity'
export type PricingType = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'event' | 'custom'

export type EngineCode = 'rental' | 'booking' | 'membership' | 'sales'

export interface TenantEngine {
  code: EngineCode
  name: string
  description: string
  is_core: boolean
  monthly_price: string
  is_enabled: boolean
  price_snapshot: string | null
  enabled_at: string | null
}

export const ENGINE_LABELS: Record<EngineCode, string> = {
  rental: 'Sewa / Rental',
  booking: 'Booking / Pemesanan',
  membership: 'Keanggotaan',
  sales: 'Penjualan',
}

export type ProductType =
  | 'vehicle'
  | 'equipment'
  | 'accommodation'
  | 'space'
  | 'service'
  | 'membership'
  | 'package'
  | 'goods'

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  vehicle: 'Kendaraan',
  equipment: 'Peralatan',
  accommodation: 'Akomodasi',
  space: 'Ruang / Tempat',
  service: 'Jasa',
  membership: 'Keanggotaan',
  package: 'Paket',
  goods: 'Barang',
}

export const PRODUCT_TYPES_BY_ENGINE: Record<EngineCode, ProductType[]> = {
  rental: ['vehicle', 'equipment', 'accommodation'],
  booking: ['space', 'service'],
  membership: ['membership', 'package'],
  sales: ['goods'],
}

export interface BusinessTemplate {
  code: string
  name: string
  description: string
  icon: string
  configuration: Record<string, unknown>
  version: number
}

export interface PlanFeature {
  slug: string
  value: string
}

export interface Plan {
  id: number
  name: string
  slug: string
  description: string
  price: string
  signup_fee: string
  currency: string
  invoice_period: number
  invoice_interval: BillingInterval
  trial_period: number
  trial_interval: string
  features: PlanFeature[]
}

export interface Tenant {
  id: string
  name: string
  slug?: string
  /** Host lengkap landing page tenant, mis. "toko.sewantara.id". */
  domain?: string | null
  /** Label subdomain tanpa base domain, mis. "toko". */
  subdomain?: string | null
  business_type?: string
  status: TenantStatus
  timezone?: string
  currency?: string
}

export interface Branch {
  id: number
  name: string
  code: string
  is_active: boolean
  is_main?: boolean
  city?: string | null
  address?: string | null
  phone?: string | null
}

export interface TenantUser {
  id: number
  tenant_id?: string
  name: string
  email: string
  is_active?: boolean
  roles?: TenantRole[]
}

export interface Permission {
  id: number
  name: string
  code: string
  module: string
}

export interface RoleAssignment {
  user_id: number
  role_id: number
  branch_id: number | null
}

export interface TenantRole {
  id: number
  tenant_id: string
  name: string
  code: string
  is_system: boolean
  permissions: Permission[]
  pivot: RoleAssignment
}

export interface TenantSession {
  tenant: Tenant
  branch: Branch
  user: TenantUser
  roles?: TenantRole[]
  subscription: TenantSubscription | null
}

export interface TenantSubscriptionFeature {
  slug: string
  name: string
  value: string
}

export interface TenantSubscriptionPlan {
  id: number
  name: string
  slug: string
  description?: string | null
  price: string
  signup_fee: string
  currency: string
  invoice_period: number
  invoice_interval: BillingInterval
  features: TenantSubscriptionFeature[]
}

export interface TenantSubscription {
  id: number
  name: string
  slug: string
  status: string
  is_active: boolean
  is_on_trial: boolean
  is_canceled: boolean
  trial_ends_at?: string | null
  starts_at?: string | null
  ends_at?: string | null
  canceled_at?: string | null
  plan: TenantSubscriptionPlan | null
  engines?: TenantEngine[]
}

export type SubscriptionPaymentStatus = 'pending' | 'paid' | 'failed' | 'expired'

export interface SubscriptionPayment {
  id: string
  payment_number: string
  gateway: 'xendit' | string
  gateway_reference: string | null
  status: SubscriptionPaymentStatus
  amount: string
  currency: string
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface SubscriptionCheckoutResult {
  payment: SubscriptionPayment
  checkout: {
    gateway: 'xendit' | string
    token: string
    redirect_url: string
  }
}

export interface SubscriptionPaymentResult {
  payment: SubscriptionPayment
}

export interface RegisterPayload {
  business_name: string
  business_type: string
  subdomain: string
  owner: {
    name: string
    email: string
    phone: string
    password: string
    password_confirmation: string
  }
  plan_id: number | null
  billing_interval: BillingInterval
  terms_accepted: boolean
}

export interface RegisterResult {
  tenant: Tenant
  domain: {
    domain: string
    url: string
  }
  owner: TenantUser
  subscription: {
    name: string
    plan: string
    status: string
    trial_ends_at: string
  }
}

export interface LoginResult {
  token_type: 'Bearer'
  access_token: string
  user: TenantUser & { tenant_id: string }
}

export interface OnboardingChecklist {
  business: boolean
  template: boolean
  rental_configuration: boolean
  inventory: boolean
  pricing: boolean
  booking: boolean
  payment: boolean
  branch: boolean
  subscription: boolean
}

export interface PaymentMethod {
  method: string
  is_enabled: boolean
  is_configured: boolean
  configuration?: Record<string, unknown> | null
}

export interface OnboardingProgress {
  status: string
  current_step: string
  completed_steps: string[]
  profile: Record<string, unknown>
  rental_configuration: Record<string, unknown>
  booking_configuration?: Record<string, unknown>
  payment_methods: PaymentMethod[]
  checklist: OnboardingChecklist
}

export interface BusinessOnboardingPayload {
  business_name: string
  timezone: string
  currency: string
  branch_name: string
  operating_hours: Record<string, { open?: string; close?: string; closed?: boolean }>
}

export interface RentalOnboardingPayload {
  engine_code: EngineCode
  rental_model: 'per_hour' | 'per_day' | 'session'
  booking_strategy: 'queue' | 'date_range' | 'session'
  allocation_strategy: 'auto_assign' | 'manual'
  slot_duration_minutes: number | null
  enable_waiting_list: boolean
  allow_extend_booking: boolean
  realtime_availability: boolean
}

export interface BookingOnboardingPayload {
  engine_code: EngineCode
  allow_online_booking: boolean
  allow_walk_in: boolean
  enable_waiting_list: boolean
  allocation_strategy: 'auto_assign' | 'manual'
  auto_reminder: boolean
  auto_cancel_unpaid: boolean
  auto_cancel_minutes: number
}

export interface PaymentsOnboardingPayload {
  methods: Array<{
    method: 'cash' | 'transfer' | 'midtrans' | 'deposit' | 'pay_later'
    is_enabled: boolean
    configuration: Record<string, unknown> | null
  }>
}

export interface DashboardReport {
  revenue?: number
  bookings?: number
  active_rentals?: number
  available_units?: number
  [key: string]: unknown
}

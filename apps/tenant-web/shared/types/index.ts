/**
 * Contracts shared by the Nuxt application and Nitro BFF.
 *
 * Monetary `amount` values are integer minor units. For IDR this is the
 * displayed rupiah amount because the currency has no fractional unit.
 */

export type TenantStatus =
  | 'active'
  | 'maintenance'
  | 'suspended'
  | 'subscription_expired'

export type BookingMode =
  | 'date_range'
  | 'daily'
  | 'time_slot'
  | 'hourly'
  | 'package'

export type PricingUnit = 'hour' | 'day' | 'item' | 'package'

export type BookingStatus =
  | 'pending_payment'
  | 'reserved'
  | 'upcoming'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'expired'

export type PaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'expired'
  | 'refunded'

export type BookingField =
  | 'startDate'
  | 'endDate'
  | 'startTime'
  | 'duration'
  | 'quantity'
  | 'extraServiceIds'
  | 'notes'

export interface Money {
  amount: number
  currency: string
  formatted: string
}

export interface ImageAsset {
  id?: string
  url: string
  alt: string
  width?: number
  height?: number
  blurDataUrl?: string
}

export interface LinkAction {
  label: string
  href: string
  external?: boolean
}

export interface TenantTheme {
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  background: string
  foreground: string
  muted: string
  fontFamily: 'Inter' | 'Geist' | 'system'
  logo: ImageAsset
  favicon: string
  darkMode: boolean
}

export interface ContactDetails {
  phone: string
  whatsapp: string
  email: string
  address: string
  mapUrl?: string
  instagram?: string
  facebook?: string
  tiktok?: string
}

export interface BusinessHours {
  day: string
  open: string | null
  close: string | null
  label: string
}

export interface TenantLocation {
  id: string
  name: string
  address: string
  city: string
  latitude?: number
  longitude?: number
  isPrimary: boolean
}

export interface PaymentMethod {
  id: string
  type: 'bank_transfer' | 'virtual_account' | 'qris' | 'ewallet' | 'cash'
  name: string
  description: string
  icon?: string
  enabled: boolean
  feeLabel?: string
}

export interface TenantSeo {
  title: string
  titleTemplate: string
  description: string
  canonicalUrl: string
  ogImage: string
  keywords: string[]
}

export interface TenantFeatures {
  customerLogin: boolean
  guestBooking: boolean
  wishlist: boolean
  reviews: boolean
  blog: boolean
  darkMode: boolean
}

export interface Tenant {
  id: string
  slug: string
  hostname: string
  status: TenantStatus
  businessName: string
  legalName?: string
  tagline: string
  description: string
  timezone: string
  locale: string
  currency: string
  theme: TenantTheme
  contact: ContactDetails
  businessHours: BusinessHours[]
  locations: TenantLocation[]
  paymentMethods: PaymentMethod[]
  features: TenantFeatures
  seo: TenantSeo
  termsUrl: string
  privacyUrl: string
  cancellationPolicyUrl: string
  configVersion: string
}

export interface HeroContent {
  eyebrow: string
  title: string
  description: string
  primaryAction: LinkAction
  secondaryAction?: LinkAction
  image: ImageAsset
  trustPoints: string[]
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  image: ImageAsset
  productCount: number
}

export interface BookingRules {
  mode: BookingMode
  requiredFields: BookingField[]
  minAdvanceMinutes: number
  maxAdvanceDays: number
  minDuration: number
  maxDuration: number
  durationStep: number
  durationUnit: 'hour' | 'day'
  minQuantity: number
  maxQuantity: number
  slotIntervalMinutes?: number
  allowedStartTimes?: string[]
  blockedDates?: string[]
  pickupBufferMinutes?: number
  returnBufferMinutes?: number
}

export interface ExtraService {
  id: string
  name: string
  description: string
  price: Money
  pricingUnit: 'booking' | 'quantity' | 'duration'
  enabled: boolean
}

export interface ProductPrice {
  base: Money
  original?: Money
  unit: PricingUnit
  unitLabel: string
  deposit?: Money
}

export interface ProductAvailabilitySummary {
  status: 'available' | 'limited' | 'unavailable'
  label: string
  nextAvailableDate?: string
}

export interface RatingSummary {
  average: number
  count: number
}

export interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  category: Pick<Category, 'id' | 'slug' | 'name'>
  images: ImageAsset[]
  price: ProductPrice
  bookingMode: BookingMode
  bookingRules: BookingRules
  extraServices: ExtraService[]
  locations: TenantLocation[]
  availability: ProductAvailabilitySummary
  rating: RatingSummary
  badges: string[]
  specifications: Array<{ label: string; value: string }>
  featured: boolean
  seo: {
    title: string
    description: string
    ogImage: string
  }
}

export interface Promotion {
  id: string
  title: string
  description: string
  badge: string
  couponCode?: string
  discountPercent?: number
  image: ImageAsset
  action: LinkAction
  startsAt: string
  endsAt: string
}

export interface Testimonial {
  id: string
  customerName: string
  customerAvatar?: ImageAsset
  rating: number
  quote: string
  productName: string
  createdAt: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface BlogSnippet {
  id: string
  slug: string
  title: string
  excerpt: string
  image: ImageAsset
  category: string
  publishedAt: string
  readingTimeMinutes: number
}

export interface HomeStats {
  products: number
  bookings: number
  customers: number
  averageRating: number
}

export interface HomePayload {
  tenant: Tenant
  hero: HeroContent
  categories: Category[]
  featuredProducts: Product[]
  promotion: Promotion | null
  testimonials: Testimonial[]
  faqs: FaqItem[]
  paymentMethods: PaymentMethod[]
  blog: BlogSnippet[]
  stats: HomeStats
}

export interface CatalogQuery {
  search?: string
  category?: string
  sort?: 'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'newest'
  page?: number
  perPage?: number
  startDate?: string
  endDate?: string
  locationId?: string
}

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface CatalogResponse {
  products: Product[]
  categories: Category[]
  pagination: PaginationMeta
  appliedFilters: CatalogQuery
}

export interface AvailabilitySlot {
  id: string
  startTime: string
  endTime: string
  remaining: number
  available: boolean
}

export interface AvailabilityDay {
  date: string
  available: boolean
  remaining: number
  slots: AvailabilitySlot[]
}

export interface AvailabilityResponse {
  productId: string
  productSlug: string
  timezone: string
  from: string
  to: string
  days: AvailabilityDay[]
  generatedAt: string
}

export interface BookingSelection {
  productSlug: string
  startDate: string
  endDate?: string
  startTime?: string
  duration: number
  quantity: number
  extraServiceIds: string[]
  couponCode?: string
  notes?: string
}

export type BookingQuoteRequest = BookingSelection

export interface QuoteLineItem {
  id: string
  label: string
  description?: string
  quantity: number
  unitPrice: Money
  total: Money
  type: 'rental' | 'extra' | 'discount' | 'tax' | 'service_fee'
}

export interface CouponResult {
  code: string
  applied: boolean
  message: string
  discount: Money
}

export interface BookingQuote {
  quoteId: string
  tenantSlug: string
  product: Pick<Product, 'id' | 'slug' | 'name' | 'images' | 'price' | 'bookingMode'>
  selection: BookingSelection
  lineItems: QuoteLineItem[]
  subtotal: Money
  discount: Money
  serviceFee: Money
  tax: Money
  total: Money
  coupon: CouponResult | null
  expiresAt: string
  createdAt: string
}

export interface CustomerDetails {
  name: string
  email: string
  phone: string
}

export interface BookingAgreement {
  accepted: boolean
  version: string
  acceptedAt?: string
}

export interface CreateBookingRequest {
  quoteId: string
  customer: CustomerDetails
  paymentMethodId: string
  agreement: BookingAgreement
}

export interface PaymentInstruction {
  type: 'redirect' | 'qris' | 'virtual_account' | 'ewallet' | 'cash'
  title: string
  description: string
  redirectUrl?: string
  qrString?: string
  accountNumber?: string
  expiresAt?: string
}

export interface BookingTimelineItem {
  status: BookingStatus
  label: string
  description: string
  occurredAt: string | null
  completed: boolean
}

export interface Booking {
  id: string
  code: string
  tenantSlug: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  customer: CustomerDetails
  quote: BookingQuote
  paymentMethod: PaymentMethod
  paymentInstruction: PaymentInstruction | null
  timeline: BookingTimelineItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateBookingResponse {
  booking: Booking
  idempotency: {
    key: string
    replayed: boolean
  }
}

export interface TrackingResponse {
  code: string
  productName: string
  scheduleLabel: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  timeline: BookingTimelineItem[]
  lastUpdatedAt: string
}

export interface TrackingVerifier {
  contact?: string
  token?: string
}

export interface ApiMeta {
  requestId: string
  tenant: string
  generatedAt: string
  demo: boolean
}

export interface ApiResponse<T> {
  data: T
  meta: ApiMeta
}

export interface ApiErrorBody {
  error: {
    code: string
    message: string
    fieldErrors?: Record<string, string[]>
    requestId?: string
  }
}

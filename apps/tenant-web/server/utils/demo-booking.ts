import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { createError } from 'h3'
import type {
  Booking,
  BookingQuote,
  BookingQuoteRequest,
  BookingSelection,
  BookingTimelineItem,
  CreateBookingRequest,
  CreateBookingResponse,
  ExtraService,
  PaymentInstruction,
  TrackingResponse,
  TrackingVerifier,
} from '#shared/types'
import {
  DEMO_PAYMENT_METHODS,
  demoMoney,
  getDemoProduct,
} from './demo-data'
import type { ResolvedTenantContext } from './tenant'

interface StoredQuote {
  tenantSlug: string
  quote: BookingQuote
  expiresAt: number
}

interface StoredBooking {
  tenantSlug: string
  payloadHash: string
  response: CreateBookingResponse
  createdAt: number
}

const quotes = new Map<string, StoredQuote>()
const bookingsByIdempotency = new Map<string, StoredBooking>()
const bookingsByCode = new Map<string, Booking>()
const MAX_DEMO_RECORDS = 250

function bookingError(statusCode: number, code: string, message: string): never {
  throw createError({
    statusCode,
    statusMessage: statusCode === 409 ? 'Booking conflict' : 'Booking request invalid',
    message,
    data: { error: { code, message } },
  })
}

function dateAtUtc(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`)
}

function addDays(date: string, numberOfDays: number): string {
  const result = dateAtUtc(date)
  result.setUTCDate(result.getUTCDate() + numberOfDays)
  return result.toISOString().slice(0, 10)
}

function inclusiveDays(from: string, to: string): number {
  return Math.floor((dateAtUtc(to).getTime() - dateAtUtc(from).getTime()) / 86_400_000) + 1
}

function todayInJakarta(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${value.year}-${value.month}-${value.day}`
}

function pruneDemoStore(): void {
  const now = Date.now()
  for (const [key, value] of quotes) {
    if (value.expiresAt <= now) quotes.delete(key)
  }
  if (quotes.size > MAX_DEMO_RECORDS) {
    const oldestKeys = [...quotes.keys()].slice(0, quotes.size - MAX_DEMO_RECORDS)
    for (const key of oldestKeys) quotes.delete(key)
  }
  if (bookingsByIdempotency.size > MAX_DEMO_RECORDS) {
    const sorted = [...bookingsByIdempotency.entries()].sort((a, b) => a[1].createdAt - b[1].createdAt)
    for (const [key] of sorted.slice(0, bookingsByIdempotency.size - MAX_DEMO_RECORDS)) {
      bookingsByIdempotency.delete(key)
    }
  }
}

function validateSelection(input: BookingQuoteRequest): BookingSelection {
  const product = getDemoProduct(input.productSlug)
  const rules = product.bookingRules
  const today = todayInJakarta()
  if (input.startDate < today) {
    bookingError(422, 'DATE_IN_PAST', 'Tanggal booking tidak boleh berada di masa lalu.')
  }
  if (input.startDate > addDays(today, rules.maxAdvanceDays)) {
    bookingError(422, 'DATE_TOO_FAR', `Booking hanya dapat dibuat hingga ${rules.maxAdvanceDays} hari ke depan.`)
  }

  let duration = input.duration
  let endDate = input.endDate
  if (product.bookingMode === 'daily' || product.bookingMode === 'date_range') {
    if (endDate) duration = inclusiveDays(input.startDate, endDate)
    else endDate = addDays(input.startDate, duration - 1)
  }

  if (duration < rules.minDuration || duration > rules.maxDuration || (duration - rules.minDuration) % rules.durationStep !== 0) {
    bookingError(422, 'INVALID_DURATION', `Durasi harus ${rules.minDuration}-${rules.maxDuration} ${rules.durationUnit === 'day' ? 'hari' : 'jam'}.`)
  }
  if (input.quantity < rules.minQuantity || input.quantity > rules.maxQuantity) {
    bookingError(422, 'INVALID_QUANTITY', `Jumlah unit harus ${rules.minQuantity}-${rules.maxQuantity}.`)
  }
  if ((product.bookingMode === 'hourly' || product.bookingMode === 'time_slot')) {
    if (!input.startTime || !rules.allowedStartTimes?.includes(input.startTime)) {
      bookingError(422, 'INVALID_TIME_SLOT', 'Pilih slot waktu yang tersedia.')
    }
  }

  const uniqueExtraIds = [...new Set(input.extraServiceIds)]
  const allowedExtraIds = new Set(product.extraServices.filter(extra => extra.enabled).map(extra => extra.id))
  if (uniqueExtraIds.some(id => !allowedExtraIds.has(id))) {
    bookingError(422, 'INVALID_EXTRA_SERVICE', 'Terdapat layanan tambahan yang tidak tersedia.')
  }

  return {
    ...input,
    endDate,
    duration,
    quantity: input.quantity,
    extraServiceIds: uniqueExtraIds,
  }
}

function extraTotal(extra: ExtraService, selection: BookingSelection): number {
  switch (extra.pricingUnit) {
    case 'quantity': return extra.price.amount * selection.quantity
    case 'duration': return extra.price.amount * selection.duration
    default: return extra.price.amount
  }
}

export function createDemoQuote(
  tenant: ResolvedTenantContext,
  input: BookingQuoteRequest,
): BookingQuote {
  pruneDemoStore()
  const product = getDemoProduct(input.productSlug)
  const selection = validateSelection(input)
  const rentalAmount = product.price.base.amount * selection.duration * selection.quantity
  const selectedExtras = product.extraServices.filter(extra => selection.extraServiceIds.includes(extra.id))
  const extraItems = selectedExtras.map(extra => ({
    id: extra.id,
    label: extra.name,
    description: extra.description,
    quantity: extra.pricingUnit === 'quantity'
      ? selection.quantity
      : extra.pricingUnit === 'duration'
        ? selection.duration
        : 1,
    unitPrice: extra.price,
    total: demoMoney(extraTotal(extra, selection)),
    type: 'extra' as const,
  }))
  const extrasAmount = extraItems.reduce((total, item) => total + item.total.amount, 0)
  const subtotalAmount = rentalAmount + extrasAmount

  const couponCode = selection.couponCode?.toUpperCase()
  const couponApplied = couponCode === 'JEMBER10'
  const discountAmount = couponApplied ? Math.min(Math.round(subtotalAmount * 0.1), 150000) : 0
  const serviceFeeAmount = Math.max(Math.round(((subtotalAmount - discountAmount) * 0.02) / 100) * 100, 5000)
  const totalAmount = subtotalAmount - discountAmount + serviceFeeAmount
  const createdAt = new Date()
  const expiresAt = new Date(createdAt.getTime() + 15 * 60_000)
  const quoteId = `quote_demo_${randomBytes(12).toString('base64url')}`

  const quote: BookingQuote = {
    quoteId,
    tenantSlug: tenant.slug,
    product: {
      id: product.id,
      slug: product.slug,
      name: product.name,
      images: product.images,
      price: product.price,
      bookingMode: product.bookingMode,
    },
    selection,
    lineItems: [
      {
        id: 'rental',
        label: `Sewa ${product.name}`,
        description: `${selection.duration} ${product.bookingRules.durationUnit === 'day' ? 'hari' : 'jam'} x ${selection.quantity} unit`,
        quantity: selection.duration * selection.quantity,
        unitPrice: product.price.base,
        total: demoMoney(rentalAmount),
        type: 'rental',
      },
      ...extraItems,
      ...(discountAmount > 0
        ? [{
            id: 'discount',
            label: 'Diskon JEMBER10',
            quantity: 1,
            unitPrice: demoMoney(-discountAmount),
            total: demoMoney(-discountAmount),
            type: 'discount' as const,
          }]
        : []),
      {
        id: 'service-fee',
        label: 'Biaya layanan',
        quantity: 1,
        unitPrice: demoMoney(serviceFeeAmount),
        total: demoMoney(serviceFeeAmount),
        type: 'service_fee',
      },
    ],
    subtotal: demoMoney(subtotalAmount),
    discount: demoMoney(discountAmount),
    serviceFee: demoMoney(serviceFeeAmount),
    tax: demoMoney(0),
    total: demoMoney(totalAmount),
    coupon: couponCode
      ? {
          code: couponCode,
          applied: couponApplied,
          message: couponApplied ? 'Diskon 10% berhasil diterapkan.' : 'Kode promo tidak ditemukan atau tidak berlaku.',
          discount: demoMoney(discountAmount),
        }
      : null,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }

  quotes.set(quoteId, { tenantSlug: tenant.slug, quote, expiresAt: expiresAt.getTime() })
  return quote
}

export function getDemoQuote(tenant: ResolvedTenantContext, quoteId: string): BookingQuote {
  const stored = quotes.get(quoteId)
  if (!stored || stored.tenantSlug !== tenant.slug) {
    bookingError(404, 'QUOTE_NOT_FOUND', 'Quote tidak ditemukan.')
  }
  if (stored.expiresAt <= Date.now()) {
    quotes.delete(quoteId)
    bookingError(409, 'QUOTE_EXPIRED', 'Quote telah kedaluwarsa. Silakan hitung ulang pesanan.')
  }
  pruneDemoStore()
  return stored.quote
}

function payloadHash(payload: CreateBookingRequest): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex')
}

function bookingCode(): string {
  return `SWJ-${randomBytes(6).toString('hex').toUpperCase()}`
}

function paymentInstruction(methodId: string, code: string): PaymentInstruction | null {
  const expiresAt = new Date(Date.now() + 60 * 60_000).toISOString()
  if (methodId === 'qris') {
    return {
      type: 'qris',
      title: 'Pindai QRIS untuk membayar',
      description: 'Kode demo tidak memproses pembayaran nyata.',
      qrString: `SEWANTARA-DEMO:${code}`,
      expiresAt,
    }
  }
  if (methodId === 'bca-va') {
    return {
      type: 'virtual_account',
      title: 'Transfer ke BCA Virtual Account',
      description: 'Gunakan nomor berikut sebelum batas pembayaran.',
      accountNumber: `8808${Date.now().toString().slice(-10)}`,
      expiresAt,
    }
  }
  return {
    type: 'cash',
    title: 'Bayar saat pengambilan',
    description: 'Tim Kamera Jember akan menghubungi Anda untuk verifikasi.',
  }
}

function initialTimeline(now: string): BookingTimelineItem[] {
  return [
    {
      status: 'pending_payment',
      label: 'Booking dibuat',
      description: 'Kami menunggu pembayaran atau verifikasi metode pembayaran.',
      occurredAt: now,
      completed: true,
    },
    {
      status: 'reserved',
      label: 'Pesanan dikonfirmasi',
      description: 'Jadwal dan unit akan diamankan setelah pembayaran terverifikasi.',
      occurredAt: null,
      completed: false,
    },
    {
      status: 'processing',
      label: 'Peralatan digunakan',
      description: 'Peralatan sedang dalam periode sewa.',
      occurredAt: null,
      completed: false,
    },
    {
      status: 'completed',
      label: 'Selesai',
      description: 'Peralatan telah dikembalikan dan booking selesai.',
      occurredAt: null,
      completed: false,
    },
  ]
}

export function createDemoBooking(
  tenant: ResolvedTenantContext,
  input: CreateBookingRequest,
  idempotencyKey: string,
): CreateBookingResponse {
  const key = `${tenant.slug}:${idempotencyKey}`
  const hash = payloadHash(input)
  const existing = bookingsByIdempotency.get(key)
  if (existing) {
    if (existing.payloadHash !== hash) {
      bookingError(409, 'IDEMPOTENCY_CONFLICT', 'Idempotency-Key telah digunakan untuk payload booking yang berbeda.')
    }
    return {
      booking: existing.response.booking,
      idempotency: { key: idempotencyKey, replayed: true },
    }
  }

  const quote = getDemoQuote(tenant, input.quoteId)
  const method = DEMO_PAYMENT_METHODS.find(item => item.id === input.paymentMethodId && item.enabled)
  if (!method) bookingError(422, 'PAYMENT_METHOD_UNAVAILABLE', 'Metode pembayaran tidak tersedia.')
  if (!input.agreement.accepted) bookingError(422, 'AGREEMENT_REQUIRED', 'Persetujuan syarat dan ketentuan wajib diberikan.')

  const now = new Date().toISOString()
  const code = bookingCode()
  const booking: Booking = {
    id: randomUUID(),
    code,
    tenantSlug: tenant.slug,
    status: 'pending_payment',
    paymentStatus: method.type === 'cash' ? 'unpaid' : 'pending',
    customer: input.customer,
    quote,
    paymentMethod: method,
    paymentInstruction: paymentInstruction(method.id, code),
    timeline: initialTimeline(now),
    createdAt: now,
    updatedAt: now,
  }
  const response: CreateBookingResponse = {
    booking,
    idempotency: { key: idempotencyKey, replayed: false },
  }
  bookingsByIdempotency.set(key, {
    tenantSlug: tenant.slug,
    payloadHash: hash,
    response,
    createdAt: Date.now(),
  })
  bookingsByCode.set(`${tenant.slug}:${code}`, booking)
  return response
}

function demoTrackingSeed(): TrackingResponse {
  return {
    code: 'SWJ-DEMO24',
    productName: 'Sony A7 IV',
    scheduleLabel: '10-12 Agustus 2026',
    status: 'reserved',
    paymentStatus: 'paid',
    timeline: [
      {
        status: 'pending_payment',
        label: 'Booking dibuat',
        description: 'Pesanan diterima dan menunggu pembayaran.',
        occurredAt: '2026-08-04T03:20:00.000Z',
        completed: true,
      },
      {
        status: 'reserved',
        label: 'Pembayaran terverifikasi',
        description: 'Unit telah diamankan untuk jadwal Anda.',
        occurredAt: '2026-08-04T03:28:00.000Z',
        completed: true,
      },
      {
        status: 'processing',
        label: 'Peralatan digunakan',
        description: 'Status berubah setelah proses pengambilan.',
        occurredAt: null,
        completed: false,
      },
      {
        status: 'completed',
        label: 'Selesai',
        description: 'Booking selesai setelah unit dikembalikan.',
        occurredAt: null,
        completed: false,
      },
    ],
    lastUpdatedAt: '2026-08-04T03:28:00.000Z',
  }
}

function normalizedContact(value: string): string {
  if (value.includes('@')) return value.trim().toLowerCase()
  const digits = value.replace(/\D/g, '')
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits
}

export function getDemoTracking(
  tenant: ResolvedTenantContext,
  code: string,
  verifier: TrackingVerifier = {},
): TrackingResponse {
  if (code === 'SWJ-DEMO24') return demoTrackingSeed()
  const booking = bookingsByCode.get(`${tenant.slug}:${code}`)
  if (!booking) bookingError(404, 'BOOKING_NOT_FOUND', 'Booking tidak ditemukan.')
  const matchingContact = verifier.contact
    && [booking.customer.email, booking.customer.phone]
      .map(normalizedContact)
      .includes(normalizedContact(verifier.contact))
  if (!matchingContact || verifier.token) {
    bookingError(404, 'BOOKING_NOT_FOUND', 'Booking tidak ditemukan.')
  }
  const schedule = booking.quote.selection.endDate
    ? `${booking.quote.selection.startDate} - ${booking.quote.selection.endDate}`
    : booking.quote.selection.startDate
  return {
    code: booking.code,
    productName: booking.quote.product.name,
    scheduleLabel: schedule,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    timeline: booking.timeline,
    lastUpdatedAt: booking.updatedAt,
  }
}

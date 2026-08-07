import {
  createError,
  getQuery,
  readBody,
  type H3Event,
} from 'h3'
import { z, type ZodType } from 'zod'
import type {
  BookingQuoteRequest,
  CatalogQuery,
  CreateBookingRequest,
  TrackingVerifier,
} from '#shared/types'
import { ensureRequestId } from './tenant'

const isoDate = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Gunakan format tanggal YYYY-MM-DD.')
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`)
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value)
  }, 'Tanggal tidak valid.')

const time = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Gunakan format waktu HH:mm.')

const catalogSchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().regex(/^[a-z0-9-]{1,80}$/).optional(),
  sort: z.enum(['recommended', 'price_asc', 'price_desc', 'rating', 'newest']).default('recommended'),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  perPage: z.coerce.number().int().min(1).max(24).default(6),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
  locationId: z.string().trim().regex(/^[a-zA-Z0-9-]{1,80}$/).optional(),
})

const quoteSchema = z.object({
  productSlug: z.string().trim().regex(/^[a-z0-9-]{1,120}$/),
  startDate: isoDate,
  endDate: isoDate.optional(),
  startTime: time.optional(),
  duration: z.coerce.number().int().positive().max(365).default(1),
  quantity: z.coerce.number().int().positive().max(100).default(1),
  extraServiceIds: z.array(z.string().trim().regex(/^[a-zA-Z0-9-]{1,100}$/)).max(20).default([]),
  couponCode: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{3,32}$/).optional(),
  notes: z.string().trim().max(1000).optional(),
}).superRefine((value, context) => {
  if (value.endDate && value.endDate < value.startDate) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endDate'],
      message: 'Tanggal selesai tidak boleh sebelum tanggal mulai.',
    })
  }
})

const createBookingSchema = z.object({
  quoteId: z.string().trim().min(12).max(200),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: z.string().trim().regex(/^\+?[\d\s()-]{8,24}$/, 'Nomor telepon tidak valid.'),
  }),
  paymentMethodId: z.string().trim().regex(/^[a-zA-Z0-9-]{1,80}$/),
  agreement: z.object({
    accepted: z.literal(true, {
      errorMap: () => ({ message: 'Persetujuan syarat dan ketentuan wajib diberikan.' }),
    }),
    version: z.string().trim().min(1).max(80),
    acceptedAt: z.string().datetime().optional(),
  }),
})

const availabilitySchema = z.object({
  from: isoDate.optional(),
  to: isoDate.optional(),
}).superRefine((value, context) => {
  if (value.from && value.to && value.to < value.from) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['to'],
      message: 'Tanggal akhir tidak boleh sebelum tanggal awal.',
    })
  }
})

const trackingVerifierSchema = z.object({
  contact: z.string().trim().min(5).max(254).refine(
    value => z.string().email().safeParse(value).success || /^\+?[\d\s()-]{8,24}$/.test(value),
    'Contact harus berupa email atau nomor telepon yang valid.',
  ).optional(),
  token: z.string().trim().regex(/^[a-zA-Z0-9._~-]{16,256}$/, 'Token tracking tidak valid.').optional(),
}).superRefine((value, context) => {
  if (value.contact && value.token) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['token'],
      message: 'Kirim contact atau token, bukan keduanya.',
    })
  }
})

function firstQueryValue(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value
}

function normalizedQuery(event: H3Event): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(getQuery(event)).map(([key, value]) => [key, firstQueryValue(value)]),
  )
}

function fieldErrors(error: z.ZodError): Record<string, string[]> {
  const flattened = error.flatten()
  const result: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_form'
    result[key] ??= []
    result[key]!.push(issue.message)
  }
  if (flattened.formErrors.length) result._form = flattened.formErrors
  return result
}

function parseOrThrow<T>(event: H3Event, schema: ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value)
  if (parsed.success) return parsed.data

  const message = 'Periksa kembali data yang dikirim.'
  throw createError({
    statusCode: 422,
    statusMessage: 'Validation failed',
    message,
    data: {
      error: {
        code: 'VALIDATION_ERROR',
        message,
        fieldErrors: fieldErrors(parsed.error),
        requestId: ensureRequestId(event),
      },
    },
  })
}

export function parseCatalogQuery(event: H3Event): CatalogQuery {
  return parseOrThrow(event, catalogSchema, normalizedQuery(event)) as CatalogQuery
}

export function parseAvailabilityQuery(event: H3Event): { from?: string; to?: string } {
  return parseOrThrow(event, availabilitySchema, normalizedQuery(event))
}

export function parseTrackingVerifier(event: H3Event, allowEmpty = false): TrackingVerifier {
  const verifier = parseOrThrow(event, trackingVerifierSchema, normalizedQuery(event))
  if (!allowEmpty && !verifier.contact && !verifier.token) {
    const message = 'Contact atau token tracking wajib diisi.'
    throw createError({
      statusCode: 422,
      statusMessage: 'Tracking verifier required',
      message,
      data: {
        error: {
          code: 'TRACKING_VERIFIER_REQUIRED',
          message,
          fieldErrors: { contact: [message] },
          requestId: ensureRequestId(event),
        },
      },
    })
  }
  return verifier
}

export async function parseQuoteBody(event: H3Event): Promise<BookingQuoteRequest> {
  const body = await readBody<unknown>(event)
  return parseOrThrow(event, quoteSchema, body) as BookingQuoteRequest
}

export async function parseCreateBookingBody(event: H3Event): Promise<CreateBookingRequest> {
  const body = await readBody<unknown>(event)
  return parseOrThrow(event, createBookingSchema, body) as CreateBookingRequest
}

export function validateRouteToken(
  event: H3Event,
  value: string | undefined,
  kind: 'slug' | 'code' | 'quote',
): string {
  const patterns = {
    slug: /^[a-z0-9-]{1,120}$/,
    code: /^[A-Z0-9-]{6,40}$/i,
    quote: /^[a-zA-Z0-9_-]{12,200}$/,
  }
  if (!value || !patterns[kind].test(value)) {
    const message = `${kind === 'code' ? 'Kode tracking' : kind === 'quote' ? 'ID quote' : 'Slug'} tidak valid.`
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid route parameter',
      message,
      data: { error: { code: 'INVALID_PARAMETER', message, requestId: ensureRequestId(event) } },
    })
  }
  return kind === 'code' ? value.toUpperCase() : value
}

export function validateIdempotencyKey(event: H3Event, value?: string): string {
  if (!value || !/^[a-zA-Z0-9._:-]{8,128}$/.test(value)) {
    const message = 'Header Idempotency-Key wajib diisi (8-128 karakter aman).'
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing or invalid idempotency key',
      message,
      data: { error: { code: 'INVALID_IDEMPOTENCY_KEY', message, requestId: ensureRequestId(event) } },
    })
  }
  return value
}

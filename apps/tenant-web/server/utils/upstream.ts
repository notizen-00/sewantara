import { createError, type H3Event } from 'h3'
import { ensureRequestId, getTenantContext } from './tenant'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface UpstreamRequestOptions {
  method?: HttpMethod
  query?: Record<string, string | number | boolean | undefined>
  body?: unknown
  timeoutMs?: number
  idempotencyKey?: string
}

interface UpstreamErrorShape {
  response?: {
    status?: number
    _data?: unknown
  }
  name?: string
  code?: string
  message?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function safeApiBase(rawValue: unknown): URL {
  const raw = typeof rawValue === 'string' ? rawValue.trim() : ''
  let url: URL
  try {
    url = new URL(raw)
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid server configuration',
      message: 'Konfigurasi upstream API tidak valid.',
    })
  }

  const localHttp = url.protocol === 'http:' && ['localhost', '127.0.0.1', '::1'].includes(url.hostname)
  if ((url.protocol !== 'https:' && !localHttp) || url.username || url.password || url.search || url.hash) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid server configuration',
      message: 'Konfigurasi upstream API tidak aman.',
    })
  }
  return url
}

function safeUpstreamUrl(base: URL, endpoint: string): URL {
  const path = endpoint.trim()
  if (!path.startsWith('/') || path.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(path)) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid server configuration',
      message: 'Konfigurasi endpoint upstream tidak valid.',
    })
  }

  const url = new URL(path, base)
  if (url.origin !== base.origin) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid server configuration',
      message: 'Endpoint upstream harus menggunakan API origin yang tetap.',
    })
  }
  return url
}

function upstreamErrorDetails(data: unknown): {
  code?: string
  message?: string
  fieldErrors?: Record<string, string[]>
} {
  if (!isRecord(data)) return {}
  const nested = isRecord(data.error) ? data.error : data
  return {
    code: typeof nested.code === 'string' ? nested.code : undefined,
    message: typeof nested.message === 'string' ? nested.message : undefined,
    fieldErrors: isRecord(nested.fieldErrors)
      ? nested.fieldErrors as Record<string, string[]>
      : undefined,
  }
}

function throwMappedUpstreamError(event: H3Event, caught: unknown): never {
  const error = caught as UpstreamErrorShape
  const upstreamStatus = Number(error.response?.status || 0)
  const timeout = error.name === 'AbortError'
    || error.name === 'TimeoutError'
    || error.code === 'ABORT_ERR'
    || /timeout/i.test(error.message ?? '')
  const requestId = ensureRequestId(event)

  if (timeout) {
    throw createError({
      statusCode: 504,
      statusMessage: 'Upstream timeout',
      message: 'Layanan membutuhkan waktu terlalu lama untuk merespons.',
      data: { error: { code: 'UPSTREAM_TIMEOUT', message: 'Silakan coba kembali.', requestId } },
      cause: caught,
    })
  }

  const supportedClientStatuses = new Set([400, 401, 403, 404, 409, 422, 429])
  const statusCode = supportedClientStatuses.has(upstreamStatus)
    ? upstreamStatus
    : upstreamStatus === 503
      ? 503
      : 502
  const details = upstreamErrorDetails(error.response?._data)
  const exposeMessage = statusCode < 500 && details.message
  const message = exposeMessage
    ? details.message!
    : statusCode === 503
      ? 'Layanan sedang tidak tersedia.'
      : 'Terjadi gangguan saat menghubungi layanan utama.'

  throw createError({
    statusCode,
    statusMessage: statusCode === 502 ? 'Bad gateway' : 'Upstream request failed',
    message,
    data: {
      error: {
        code: details.code || (statusCode === 502 ? 'UPSTREAM_ERROR' : 'REQUEST_FAILED'),
        message,
        fieldErrors: statusCode < 500 ? details.fieldErrors : undefined,
        requestId,
      },
    },
    cause: caught,
  })
}

function unwrapData<T>(payload: unknown): T {
  if (isRecord(payload) && 'data' in payload) {
    return payload.data as T
  }
  return payload as T
}

export async function requestUpstream<T>(
  event: H3Event,
  endpoint: string,
  options: UpstreamRequestOptions = {},
): Promise<T> {
  const config = useRuntimeConfig(event)
  const tenant = getTenantContext(event)
  const base = safeApiBase(config.apiBase)
  const url = safeUpstreamUrl(base, endpoint)
  const method = options.method ?? 'GET'
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Request-Id': ensureRequestId(event),
    'X-Tenant': tenant.slug,
    'X-Tenant-Host': tenant.hostname,
  }

  if (config.apiToken) {
    headers.Authorization = `Bearer ${config.apiToken}`
  }
  if (options.idempotencyKey) {
    headers['Idempotency-Key'] = options.idempotencyKey
  }

  try {
    const payload = await $fetch<unknown>(url.toString(), {
      method,
      query: options.query,
      body: options.body as Record<string, unknown> | undefined,
      headers,
      timeout: options.timeoutMs ?? 8_000,
      retry: method === 'GET' ? 1 : 0,
    })
    return unwrapData<T>(payload)
  }
  catch (error) {
    throwMappedUpstreamError(event, error)
  }
}

export function isDemoMode(event: H3Event): boolean {
  const value = useRuntimeConfig(event).public.demoMode
  return value === true || String(value).toLowerCase() === 'true' || String(value) === '1'
}

export async function fromDemoOrUpstream<T>(
  event: H3Event,
  demoFactory: () => T | Promise<T>,
  upstreamFactory: () => Promise<T>,
): Promise<T> {
  return isDemoMode(event) ? demoFactory() : upstreamFactory()
}

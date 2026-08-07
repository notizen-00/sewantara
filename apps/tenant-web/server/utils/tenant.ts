import { randomUUID } from 'node:crypto'
import { createError, getHeader, type H3Event } from 'h3'

const RESERVED_SUBDOMAINS = new Set([
  'admin',
  'api',
  'app',
  'assets',
  'auth',
  'cdn',
  'dashboard',
  'dev',
  'docs',
  'help',
  'mail',
  'ns1',
  'ns2',
  'staging',
  'static',
  'status',
  'support',
  'www',
])

const HOST_LABEL_PATTERN = /^(?!-)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/

export interface ResolvedTenantContext {
  slug: string
  hostname: string
  source: 'subdomain' | 'custom_domain' | 'development' | 'root'
  demo: boolean
}

function tenantResolutionError(
  statusCode: number,
  code: string,
  message: string,
): never {
  throw createError({
    statusCode,
    statusMessage: statusCode === 400 ? 'Invalid host' : 'Tenant not found',
    message,
    data: { error: { code, message } },
  })
}

function asBoolean(value: unknown): boolean {
  return value === true || value === 'true' || value === '1'
}

function firstHeaderValue(value: string): string {
  return value.split(',', 1)[0]?.trim() ?? ''
}

export function normalizeHostname(rawHost: string): string {
  const candidate = firstHeaderValue(rawHost)

  if (!candidate || candidate.length > 253 || candidate.includes('://')) {
    tenantResolutionError(400, 'INVALID_HOST', 'Hostname request tidak valid.')
  }

  try {
    const parsed = new URL(`http://${candidate}`)
    const hostname = parsed.hostname
      .toLowerCase()
      .replace(/^\[|\]$/g, '')
      .replace(/\.$/, '')

    if (!hostname || parsed.username || parsed.password) {
      tenantResolutionError(400, 'INVALID_HOST', 'Hostname request tidak valid.')
    }

    const isIpAddress = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':')
    if (!isIpAddress && !hostname.split('.').every(label => HOST_LABEL_PATTERN.test(label))) {
      tenantResolutionError(400, 'INVALID_HOST', 'Hostname request tidak valid.')
    }

    return hostname
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    tenantResolutionError(400, 'INVALID_HOST', 'Hostname request tidak valid.')
  }
}

function requestHostname(event: H3Event): string {
  // `Host` is the secure default. X-Forwarded-Host is considered only when the
  // deployment explicitly opts in and the Nitro server is not publicly exposed.
  const trustProxy = asBoolean(process.env.NUXT_TRUST_PROXY)
  const forwardedHost = trustProxy ? getHeader(event, 'x-forwarded-host') : undefined
  const host = forwardedHost || getHeader(event, 'host')

  if (!host) {
    tenantResolutionError(400, 'MISSING_HOST', 'Hostname request tidak tersedia.')
  }

  return normalizeHostname(host)
}

function configuredString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim().toLowerCase() : fallback
}

function assertTenantSlug(slug: string): string {
  const normalized = slug.trim().toLowerCase()
  if (!HOST_LABEL_PATTERN.test(normalized) || RESERVED_SUBDOMAINS.has(normalized)) {
    tenantResolutionError(404, 'TENANT_NOT_FOUND', 'Tenant tidak ditemukan.')
  }
  return normalized
}

export function resolveTenantContext(event: H3Event): ResolvedTenantContext {
  const config = useRuntimeConfig(event)
  const hostname = requestHostname(event)
  const baseDomain = configuredString(config.public.baseDomain, 'sewantara.id')
  const demoTenant = assertTenantSlug(configuredString(config.public.demoTenant, 'kamerajember'))
  const demo = asBoolean(config.public.demoMode)
  const development = process.env.NODE_ENV !== 'production'

  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    if (!development && !demo) {
      tenantResolutionError(404, 'TENANT_NOT_FOUND', 'Tenant tidak ditemukan.')
    }
    return { slug: demoTenant, hostname, source: 'development', demo }
  }

  if (hostname.endsWith('.localhost')) {
    const labels = hostname.slice(0, -'.localhost'.length).split('.')
    if (labels.length !== 1) {
      tenantResolutionError(404, 'TENANT_NOT_FOUND', 'Tenant development tidak ditemukan.')
    }
    return { slug: assertTenantSlug(labels[0]!), hostname, source: 'development', demo }
  }

  if (hostname === baseDomain || hostname === `www.${baseDomain}`) {
    const rootTenant = process.env.NUXT_ROOT_TENANT?.trim().toLowerCase()
    if (rootTenant) {
      return { slug: assertTenantSlug(rootTenant), hostname, source: 'root', demo }
    }
    if (development || demo) {
      return { slug: demoTenant, hostname, source: 'root', demo }
    }
    tenantResolutionError(404, 'TENANT_NOT_FOUND', 'Domain utama belum memiliki tenant default.')
  }

  const baseSuffix = `.${baseDomain}`
  if (hostname.endsWith(baseSuffix)) {
    const prefix = hostname.slice(0, -baseSuffix.length)
    if (!prefix || prefix.includes('.')) {
      tenantResolutionError(404, 'TENANT_NOT_FOUND', 'Tenant tidak ditemukan.')
    }
    return { slug: assertTenantSlug(prefix), hostname, source: 'subdomain', demo }
  }

  if (asBoolean(process.env.NUXT_ALLOW_CUSTOM_DOMAINS)) {
    return { slug: hostname, hostname, source: 'custom_domain', demo }
  }

  tenantResolutionError(404, 'TENANT_NOT_FOUND', 'Domain tidak terdaftar sebagai tenant.')
}

export function getTenantContext(event: H3Event): ResolvedTenantContext {
  return event.context.tenant ?? resolveTenantContext(event)
}

export function tenantOrigin(context: ResolvedTenantContext): string {
  const developmentHost = context.hostname === 'localhost'
    || context.hostname.endsWith('.localhost')
    || context.hostname === '127.0.0.1'
    || context.hostname === '::1'
  if (developmentHost) {
    const hostname = context.hostname.includes(':') ? `[${context.hostname}]` : context.hostname
    return `http://${hostname}:${process.env.NUXT_DEV_SERVER_PORT || '3000'}`
  }
  return `https://${context.hostname}`
}

export function ensureRequestId(event: H3Event): string {
  if (event.context.requestId) {
    return event.context.requestId
  }

  const incoming = getHeader(event, 'x-request-id')
  const requestId = incoming && /^[a-zA-Z0-9._:-]{8,128}$/.test(incoming)
    ? incoming
    : randomUUID()
  event.context.requestId = requestId
  return requestId
}

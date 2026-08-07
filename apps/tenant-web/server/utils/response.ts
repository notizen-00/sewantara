import {
  setResponseHeader,
  type H3Event,
} from 'h3'
import type { ApiResponse } from '#shared/types'
import { ensureRequestId, getTenantContext } from './tenant'

function setTenantVaryHeader(event: H3Event): void {
  setResponseHeader(event, 'Vary', 'Host, Accept-Encoding, Accept-Language')
  setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')
}

export function setPublicTenantCache(
  event: H3Event,
  options: number | { browserSeconds?: number; cdnSeconds: number; staleSeconds?: number },
): void {
  const resolved = typeof options === 'number'
    ? { browserSeconds: 0, cdnSeconds: options, staleSeconds: options * 2 }
    : options
  const browserSeconds = resolved.browserSeconds ?? 0
  const stale = resolved.staleSeconds ?? resolved.cdnSeconds
  setTenantVaryHeader(event)
  setResponseHeader(
    event,
    'Cache-Control',
    `public, max-age=${browserSeconds}, s-maxage=${resolved.cdnSeconds}, stale-while-revalidate=${stale}`,
  )
}

export function setPrivateNoStore(event: H3Event): void {
  setTenantVaryHeader(event)
  setResponseHeader(event, 'Cache-Control', 'private, no-store, max-age=0')
  setResponseHeader(event, 'Pragma', 'no-cache')
}

export function apiResponse<T>(event: H3Event, data: T, demo?: boolean): ApiResponse<T> {
  const tenant = getTenantContext(event)
  return {
    data,
    meta: {
      requestId: ensureRequestId(event),
      tenant: tenant.slug,
      generatedAt: new Date().toISOString(),
      demo: demo ?? tenant.demo,
    },
  }
}

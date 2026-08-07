import { getRequestURL, setResponseHeader } from 'h3'
import { ensureRequestId, resolveTenantContext } from '../utils/tenant'

const STATIC_PATH_PATTERN = /(?:^\/_nuxt\/|^\/__nuxt_error|^\/favicon\.ico$|^\/healthz$|\.(?:avif|css|gif|ico|jpe?g|js|map|png|svg|webp|woff2?)$)/i

export default defineEventHandler((event) => {
  const requestId = ensureRequestId(event)
  setResponseHeader(event, 'X-Request-Id', requestId)

  const pathname = getRequestURL(event).pathname
  if (STATIC_PATH_PATTERN.test(pathname)) {
    return
  }

  event.context.tenant = resolveTenantContext(event)
})

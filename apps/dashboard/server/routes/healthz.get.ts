import { setResponseHeader } from 'h3'

/**
 * Liveness probe for the container healthcheck and the reverse proxy.
 *
 * The dashboard is a client-only SPA (`ssr: false`), so this only reports that
 * Nitro is up and able to serve the bundle. Whether the Laravel API is reachable
 * is the browser's problem, and checking it here would make an API outage look
 * like a dashboard outage and get the container killed for no reason.
 */
export default defineEventHandler((event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  return {
    status: 'ok',
    app: 'dashboard',
    timestamp: new Date().toISOString(),
  }
})

import { setResponseHeader } from 'h3'

/**
 * Liveness probe for the container healthcheck and the reverse proxy.
 *
 * Deliberately dependency free: it answers "this Nitro process can serve
 * requests", nothing more. The landing site has no upstream to check, so a
 * richer readiness check would only invent failure modes.
 */
export default defineEventHandler((event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  return {
    status: 'ok',
    app: 'landing',
    timestamp: new Date().toISOString(),
  }
})

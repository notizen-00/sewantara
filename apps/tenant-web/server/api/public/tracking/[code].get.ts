import { getRouterParam } from 'h3'
import type { TrackingResponse } from '#shared/types'
import { getDemoTracking } from '~~/server/utils/demo-booking'
import { apiResponse, setPrivateNoStore } from '~~/server/utils/response'
import { getTenantContext } from '~~/server/utils/tenant'
import { fromDemoOrUpstream, isDemoMode, requestUpstream } from '~~/server/utils/upstream'
import { parseTrackingVerifier, validateRouteToken } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  setPrivateNoStore(event)
  const tenant = getTenantContext(event)
  const config = useRuntimeConfig(event)
  const code = validateRouteToken(event, getRouterParam(event, 'code'), 'code')
  const demo = isDemoMode(event)
  const verifier = parseTrackingVerifier(event, demo)
  const endpoint = `${String(config.apiEndpoints.tracking).replace(/\/$/, '')}/${encodeURIComponent(code)}/tracking`
  const tracking = await fromDemoOrUpstream(
    event,
    () => getDemoTracking(tenant, code, verifier),
    () => requestUpstream<TrackingResponse>(event, endpoint, {
      query: { contact: verifier.contact, token: verifier.token },
    }),
  )

  return apiResponse(event, tracking, demo)
})

import { getRouterParam } from 'h3'
import type { AvailabilityResponse } from '#shared/types'
import { getDemoAvailability } from '~~/server/utils/demo-data'
import { apiResponse, setPrivateNoStore } from '~~/server/utils/response'
import { fromDemoOrUpstream, isDemoMode, requestUpstream } from '~~/server/utils/upstream'
import { parseAvailabilityQuery, validateRouteToken } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const slug = validateRouteToken(event, getRouterParam(event, 'slug'), 'slug')
  const query = parseAvailabilityQuery(event)
  const endpoint = `${String(config.apiEndpoints.catalog).replace(/\/$/, '')}/${encodeURIComponent(slug)}/availability`
  const availability = await fromDemoOrUpstream(
    event,
    () => getDemoAvailability(slug, query.from, query.to),
    () => requestUpstream<AvailabilityResponse>(event, endpoint, { query }),
  )

  setPrivateNoStore(event)
  return apiResponse(event, availability, isDemoMode(event))
})

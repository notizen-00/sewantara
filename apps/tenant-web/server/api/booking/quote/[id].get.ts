import { getRouterParam } from 'h3'
import type { BookingQuote } from '#shared/types'
import { getDemoQuote } from '~~/server/utils/demo-booking'
import { apiResponse, setPrivateNoStore } from '~~/server/utils/response'
import { getTenantContext } from '~~/server/utils/tenant'
import { fromDemoOrUpstream, isDemoMode, requestUpstream } from '~~/server/utils/upstream'
import { validateRouteToken } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  setPrivateNoStore(event)
  const tenant = getTenantContext(event)
  const config = useRuntimeConfig(event)
  const quoteId = validateRouteToken(event, getRouterParam(event, 'id'), 'quote')
  const endpoint = `${String(config.apiEndpoints.quote).replace(/\/$/, '')}/${encodeURIComponent(quoteId)}`
  const quote = await fromDemoOrUpstream(
    event,
    () => getDemoQuote(tenant, quoteId),
    () => requestUpstream<BookingQuote>(event, endpoint),
  )

  return apiResponse(event, quote, isDemoMode(event))
})

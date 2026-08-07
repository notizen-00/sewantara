import type { BookingQuote } from '#shared/types'
import { createDemoQuote } from '~~/server/utils/demo-booking'
import { apiResponse, setPrivateNoStore } from '~~/server/utils/response'
import { getTenantContext } from '~~/server/utils/tenant'
import { fromDemoOrUpstream, isDemoMode, requestUpstream } from '~~/server/utils/upstream'
import { parseQuoteBody } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  setPrivateNoStore(event)
  const tenant = getTenantContext(event)
  const config = useRuntimeConfig(event)
  const body = await parseQuoteBody(event)
  const quote = await fromDemoOrUpstream(
    event,
    () => createDemoQuote(tenant, body),
    () => requestUpstream<BookingQuote>(event, String(config.apiEndpoints.quote), {
      method: 'POST',
      body,
      timeoutMs: 10_000,
    }),
  )

  return apiResponse(event, quote, isDemoMode(event))
})

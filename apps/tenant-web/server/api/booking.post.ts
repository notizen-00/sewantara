import { getHeader, setResponseHeader, setResponseStatus } from 'h3'
import type { Booking, CreateBookingResponse } from '#shared/types'
import { createDemoBooking } from '~~/server/utils/demo-booking'
import { apiResponse, setPrivateNoStore } from '~~/server/utils/response'
import { getTenantContext } from '~~/server/utils/tenant'
import { fromDemoOrUpstream, isDemoMode, requestUpstream } from '~~/server/utils/upstream'
import { parseCreateBookingBody, validateIdempotencyKey } from '~~/server/utils/validation'

function normalizeBookingResponse(
  value: CreateBookingResponse | Booking,
  idempotencyKey: string,
): CreateBookingResponse {
  if ('booking' in value && 'idempotency' in value) return value
  return {
    booking: value as Booking,
    idempotency: { key: idempotencyKey, replayed: false },
  }
}

export default defineEventHandler(async (event) => {
  setPrivateNoStore(event)
  const tenant = getTenantContext(event)
  const config = useRuntimeConfig(event)
  const idempotencyKey = validateIdempotencyKey(event, getHeader(event, 'idempotency-key'))
  const body = await parseCreateBookingBody(event)
  const upstreamOrDemo = await fromDemoOrUpstream(
    event,
    () => createDemoBooking(tenant, body, idempotencyKey),
    () => requestUpstream<CreateBookingResponse | Booking>(event, String(config.apiEndpoints.bookings), {
      method: 'POST',
      body,
      idempotencyKey,
      timeoutMs: 15_000,
    }),
  )
  const response = normalizeBookingResponse(upstreamOrDemo, idempotencyKey)

  setResponseHeader(event, 'Idempotency-Key', idempotencyKey)
  setResponseHeader(event, 'Idempotency-Replayed', String(response.idempotency.replayed))
  setResponseStatus(event, response.idempotency.replayed ? 200 : 201)
  return apiResponse(event, response, isDemoMode(event))
})

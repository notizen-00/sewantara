import type {
  AvailabilityQuery,
  AvailabilityResult,
  Booking,
  BookingCollectionPayload,
  BookingCreatePayload,
  BookingCustomer,
  BookingListQuery,
  BookingProductPrice,
  BookingPayment,
  BookingPaymentCreatePayload,
} from '~/domain/booking'
import { useApiClient } from '~/composables/useApiClient'

export function useBookingRepository() {
  const api = useApiClient()

  return {
    list: (query: BookingListQuery = {}) =>
      api.tenant<BookingCollectionPayload<Booking>>('/bookings', {
        query: {
          status: query.status,
          from: query.from,
          to: query.to,
          product_id: query.product_id,
          per_page: query.per_page,
        },
      }),
    get: (id: number) => api.tenant<Booking>(`/bookings/${id}`),
    create: (payload: BookingCreatePayload) =>
      api.tenant<Booking>('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    checkOut: (id: number) =>
      api.tenant<Booking>(`/bookings/${id}/check-out`, { method: 'POST' }),
    cancel: (id: number) =>
      api.tenant<Booking>(`/bookings/${id}/cancel`, { method: 'POST' }),
    returnBooking: (id: number) =>
      api.tenant<Booking>(`/bookings/${id}/return`, { method: 'POST' }),
    recordPayment: (id: number, payload: BookingPaymentCreatePayload) =>
      api.tenant<BookingPayment>(`/bookings/${id}/payments`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    customers: () => api.tenant<BookingCollectionPayload<BookingCustomer>>('/customers'),
    prices: () =>
      api.tenant<BookingCollectionPayload<BookingProductPrice>>('/product-prices', {
        query: { per_page: 100 },
      }),
    checkAvailability: (query: AvailabilityQuery) =>
      api.tenant<AvailabilityResult>('/availability/check', {
        method: 'POST',
        body: JSON.stringify({
          product_id: query.product_id,
          start_at: query.start_at,
          end_at: query.end_at,
          quantity: query.quantity,
        }),
      }),
  }
}

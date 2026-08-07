import { defineStore } from 'pinia'
import type {
  AvailabilityQuery,
  AvailabilityResult,
  Booking,
  BookingCollectionPayload,
  BookingCreatePayload,
  BookingCustomer,
  BookingProductPrice,
  BookingPayment,
  BookingPaymentCreatePayload,
} from '~/domain/booking'
import { useBookingRepository } from '~/infrastructure/repositories/bookingRepository'

function normalizeCollection<T>(payload: BookingCollectionPayload<T>) {
  if (Array.isArray(payload)) return { items: payload, total: payload.length }
  return {
    items: Array.isArray(payload.data) ? payload.data : [],
    total: payload.total ?? payload.data.length,
  }
}

export const useBookingStore = defineStore('bookings', () => {
  const items = ref<Booking[]>([])
  const detail = ref<Booking | null>(null)
  const customers = ref<BookingCustomer[]>([])
  const prices = ref<BookingProductPrice[]>([])
  const total = ref(0)
  const loading = ref(false)
  const loadingDetail = ref(false)
  const loadingCustomers = ref(false)
  const loadingPrices = ref(false)
  const checkingAvailability = ref(false)
  const creating = ref(false)
  const updatingStatus = ref<'cancel' | 'return' | null>(null)
  const recordingPayment = ref(false)
  const availability = ref<AvailabilityResult | null>(null)
  const availabilityResults = ref<Record<number, AvailabilityResult>>({})
  const error = ref('')

  async function fetchAll() {
    loading.value = true
    error.value = ''
    try {
      const response = await useBookingRepository().list()
      const normalized = normalizeCollection(response.data)
      items.value = normalized.items
      total.value = normalized.total
      return items.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar booking gagal dimuat.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDetail(id: number) {
    loadingDetail.value = true
    error.value = ''
    try {
      const response = await useBookingRepository().get(id)
      detail.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Detail booking gagal dimuat.'
      throw err
    } finally {
      loadingDetail.value = false
    }
  }

  async function fetchCustomers() {
    loadingCustomers.value = true
    error.value = ''
    try {
      const response = await useBookingRepository().customers()
      customers.value = normalizeCollection(response.data).items
      return customers.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar pelanggan gagal dimuat.'
      throw err
    } finally {
      loadingCustomers.value = false
    }
  }

  async function fetchPrices() {
    loadingPrices.value = true
    error.value = ''
    try {
      const response = await useBookingRepository().prices()
      prices.value = normalizeCollection(response.data).items
      return prices.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Harga produk gagal dimuat.'
      throw err
    } finally {
      loadingPrices.value = false
    }
  }

  async function checkAvailability(query: AvailabilityQuery) {
    checkingAvailability.value = true
    availability.value = null
    error.value = ''
    try {
      const response = await useBookingRepository().checkAvailability(query)
      availability.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ketersediaan produk gagal diperiksa.'
      throw err
    } finally {
      checkingAvailability.value = false
    }
  }

  async function checkAvailabilities(queries: AvailabilityQuery[]) {
    checkingAvailability.value = true
    availability.value = null
    availabilityResults.value = {}
    error.value = ''
    try {
      const responses = await Promise.all(
        queries.map((query) => useBookingRepository().checkAvailability(query)),
      )
      availabilityResults.value = Object.fromEntries(
        responses.map((response, index) => [queries[index].product_id, response.data]),
      )
      return availabilityResults.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ketersediaan produk gagal diperiksa.'
      throw err
    } finally {
      checkingAvailability.value = false
    }
  }

  async function create(payload: BookingCreatePayload) {
    creating.value = true
    error.value = ''
    try {
      const response = await useBookingRepository().create(payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Booking gagal dibuat.'
      throw err
    } finally {
      creating.value = false
    }
  }

  async function changeStatus(action: 'cancel' | 'return', id: number) {
    updatingStatus.value = action
    error.value = ''
    try {
      const response = action === 'cancel'
        ? await useBookingRepository().cancel(id)
        : await useBookingRepository().returnBooking(id)
      if (response.data) detail.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Status booking gagal diperbarui.'
      throw err
    } finally {
      updatingStatus.value = null
    }
  }

  async function recordPayment(id: number, payload: BookingPaymentCreatePayload) {
    recordingPayment.value = true
    error.value = ''
    try {
      const response = await useBookingRepository().recordPayment(id, payload)
      if (detail.value?.id === id) {
        detail.value.payments = [...(detail.value.payments || []), response.data as BookingPayment]
      }
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pembayaran booking gagal dicatat.'
      throw err
    } finally {
      recordingPayment.value = false
    }
  }

  function resetAvailability() {
    availability.value = null
    availabilityResults.value = {}
  }

  function reset() {
    items.value = []
    detail.value = null
    customers.value = []
    prices.value = []
    total.value = 0
    availability.value = null
    availabilityResults.value = {}
    error.value = ''
    updatingStatus.value = null
    recordingPayment.value = false
  }

  return {
    items,
    detail,
    customers,
    prices,
    total,
    loading,
    loadingDetail,
    loadingCustomers,
    loadingPrices,
    checkingAvailability,
    creating,
    updatingStatus,
    recordingPayment,
    availability,
    availabilityResults,
    error,
    fetchAll,
    fetchDetail,
    fetchCustomers,
    fetchPrices,
    checkAvailability,
    checkAvailabilities,
    create,
    changeStatus,
    recordPayment,
    resetAvailability,
    reset,
  }
})

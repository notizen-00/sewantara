import { defineStore } from 'pinia'

export interface BookingSelection {
  productId: string
  productSlug: string
  productName: string
  productImage: string
  pricingUnit: string
  startDate: string
  endDate: string
  startTime: string
  duration: number
  quantity: number
  extraServiceIds: string[]
  couponCode: string
  notes: string
}

export interface PriceLine {
  key: string
  label: string
  amount: number
  type?: 'charge' | 'discount'
}

export interface BookingQuote {
  quoteId: string
  expiresAt: string
  currency: string
  subtotal: number
  discount: number
  serviceFee: number
  tax: number
  deposit: number
  total: number
  lines: PriceLine[]
}

export interface BookingResult {
  bookingCode: string
  bookingStatus: string
  paymentStatus: string
  paymentToken?: string
  payment?: {
    method: string
    label: string
    amount: number
    expiresAt?: string
    virtualAccount?: string
    instructions?: string[]
    redirectUrl?: string
  }
}

interface PersistedDraft {
  selection: BookingSelection | null
  quote: BookingQuote | null
  booking: BookingResult | null
  idempotencyKey: string | null
}

const STORAGE_KEY = 'sewantara.booking-draft.v1'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    selection: null as BookingSelection | null,
    quote: null as BookingQuote | null,
    booking: null as BookingResult | null,
    verificationContact: null as string | null,
    idempotencyKey: null as string | null,
    hydrated: false,
  }),

  getters: {
    hasActiveQuote: (state) => {
      if (!state.quote) return false
      return new Date(state.quote.expiresAt).getTime() > Date.now()
    },
  },

  actions: {
    hydrate() {
      if (this.hydrated || !import.meta.client) return

      try {
        const saved = sessionStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as PersistedDraft
          this.selection = parsed.selection || null
          this.quote = parsed.quote || null
          this.booking = parsed.booking || null
          this.idempotencyKey = parsed.idempotencyKey || null
        }
      }
      catch {
        sessionStorage.removeItem(STORAGE_KEY)
      }
      finally {
        this.hydrated = true
      }
    },

    setDraft(selection: BookingSelection, quote: BookingQuote) {
      const isNewQuote = this.quote?.quoteId !== quote.quoteId
      this.selection = selection
      this.quote = quote
      this.booking = null
      if (isNewQuote) this.idempotencyKey = this.createIdempotencyKey()
      this.persist()
    },

    setBooking(booking: BookingResult, verificationContact?: string) {
      this.booking = booking
      // Verifier hanya hidup di memori dan sengaja tidak ikut dipersist.
      this.verificationContact = verificationContact || null
      this.persist()
    },

    clear() {
      this.selection = null
      this.quote = null
      this.booking = null
      this.verificationContact = null
      this.idempotencyKey = null
      if (import.meta.client) sessionStorage.removeItem(STORAGE_KEY)
    },

    createIdempotencyKey() {
      if (import.meta.client && typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID()
      }
      return `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`
    },

    getIdempotencyKey() {
      if (!this.idempotencyKey) {
        this.idempotencyKey = this.createIdempotencyKey()
        this.persist()
      }
      return this.idempotencyKey
    },

    rotateIdempotencyKey() {
      this.idempotencyKey = this.createIdempotencyKey()
      this.persist()
    },

    persist() {
      if (!import.meta.client) return

      // Hanya pilihan non-sensitif dan token publik pembayaran yang disimpan.
      // Data pelanggan tidak pernah dimasukkan ke store ini.
      const payload: PersistedDraft = {
        selection: this.selection,
        quote: this.quote,
        booking: this.booking,
        idempotencyKey: this.idempotencyKey,
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    },
  },
})

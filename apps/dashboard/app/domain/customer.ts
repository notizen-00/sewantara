export interface Customer {
  id: number
  name: string
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  address?: string | null
  bookings_count?: number
  total_bookings?: number
  total_spent?: number | string | null
  last_booking_at?: string | null
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface CustomerCreatePayload {
  name: string
  email: string | null
  phone: string | null
  whatsapp: string | null
  address: string | null
}

export interface CustomerCollection {
  data: Customer[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export type CustomerCollectionPayload = Customer[] | CustomerCollection

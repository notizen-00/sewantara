export type CustomerDocumentType = 'ktp' | 'sim' | 'passport' | 'other'

export interface CustomerDocument {
  id: number
  customer_id: number
  document_type: CustomerDocumentType
  document_number?: string | null
  front_path?: string | null
  back_path?: string | null
  front_url?: string | null
  back_url?: string | null
  expired_at?: string | null
  is_verified: boolean
  verified_by?: number | null
  verified_at?: string | null
  created_at?: string
  [key: string]: unknown
}

export interface CustomerDocumentUploadPayload {
  document_type: CustomerDocumentType
  document_number?: string | null
  expired_at?: string | null
  front: File
  back?: File | null
}

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
  documents?: CustomerDocument[]
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

export interface CustomerUpdatePayload {
  name?: string
  email?: string | null
  phone?: string
  status?: string
  notes?: string | null
}

export interface CustomerCollection {
  data: Customer[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export type CustomerCollectionPayload = Customer[] | CustomerCollection

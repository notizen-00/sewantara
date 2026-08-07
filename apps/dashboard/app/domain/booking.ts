export interface BookingCustomer {
  id: number
  name: string
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  address?: string | null
  [key: string]: unknown
}

export interface BookingProduct {
  id: number
  name: string
  sku?: string | null
  [key: string]: unknown
}

export interface BookingProductPrice {
  id: number
  product_id: number
  pricing_type: string
  duration: number
  price: number | string
  start_at?: string | null
  end_at?: string | null
  is_active: boolean
  [key: string]: unknown
}

export interface BookingUnit {
  id: number
  unit_code?: string
  serial_number?: string | null
  status?: string
  condition?: string
  [key: string]: unknown
}

export interface BookingItem {
  id?: number
  product_id: number
  quantity?: number
  product?: BookingProduct | null
  product_unit_id?: number | null
  product_unit?: BookingUnit | null
  units?: BookingUnit[]
  unit_price?: number | string | null
  price?: number | string | null
  duration?: number | string | null
  pricing_type?: string | null
  subtotal?: number | string | null
  [key: string]: unknown
}

export interface BookingHistory {
  id?: number | string
  status?: string
  from_status?: string | null
  to_status?: string | null
  event?: string
  action?: string
  title?: string
  description?: string | null
  notes?: string | null
  created_at?: string
  occurred_at?: string
  user?: { id?: number; name?: string; email?: string } | null
  actor?: { id?: number; name?: string; email?: string } | null
  [key: string]: unknown
}

export interface BookingPayment {
  id: number
  payment_code?: string
  reference?: string
  amount?: number | string | null
  payment_method?: string
  method?: string
  status?: string
  paid_at?: string | null
  created_at?: string
  notes?: string | null
  [key: string]: unknown
}

export interface BookingPaymentCreatePayload {
  amount: number
  payment_method: 'cash' | 'transfer'
}

export interface Booking {
  id: number
  booking_number?: string
  code?: string
  reference?: string
  status: string
  customer_id?: number
  customer?: BookingCustomer | null
  branch?: { id: number; name: string; [key: string]: unknown } | null
  start_at?: string
  end_at?: string
  start_date?: string
  end_date?: string
  pickup_at?: string
  return_at?: string
  total_amount?: number | string | null
  grand_total?: number | string | null
  subtotal?: number | string | null
  discount_amount?: number | string | null
  tax_amount?: number | string | null
  deposit_amount?: number | string | null
  paid_amount?: number | string | null
  outstanding_amount?: number | string | null
  payment_status?: string | null
  notes?: string | null
  items?: BookingItem[]
  payments?: BookingPayment[]
  history?: BookingHistory[]
  histories?: BookingHistory[]
  status_history?: BookingHistory[]
  status_histories?: BookingHistory[]
  statusHistories?: BookingHistory[]
  activities?: BookingHistory[]
  events?: BookingHistory[]
  created_at?: string
  updated_at?: string
  cancelled_at?: string | null
  returned_at?: string | null
  completed_at?: string | null
  [key: string]: unknown
}

export interface BookingCreatePayload {
  customer_id: number
  start_at: string
  end_at: string
  items: Array<{
    product_id: number
    quantity: number
  }>
  notes: string | null
}

export interface AvailabilityQuery {
  product_id: number
  start_at: string
  end_at: string
  quantity: number
}

export interface AvailabilityResult {
  available?: boolean
  is_available?: boolean
  available_quantity?: number
  quantity_available?: number
  message?: string
  [key: string]: unknown
}

export interface BookingCollection<T> {
  data: T[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export type BookingCollectionPayload<T> = T[] | BookingCollection<T>

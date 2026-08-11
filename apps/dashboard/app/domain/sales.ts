export interface SalesOrderItem {
  id?: number
  product_id: number
  product_name?: string
  quantity: number
  unit_price: number | string
  subtotal?: number | string
  [key: string]: unknown
}

export interface SalesOrder {
  id: number
  order_number?: string
  status: string
  customer_id?: number | null
  customer?: { id: number; name: string; [key: string]: unknown } | null
  branch_id?: number | null
  total_amount?: number | string | null
  notes?: string | null
  items?: SalesOrderItem[]
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface SalesOrderCreatePayload {
  customer_id?: number | null
  notes?: string | null
  status?: 'draft' | 'completed'
  items: Array<{
    product_id: number
    quantity: number
    unit_price: number
  }>
}

export interface SalesOrderCollection<T> {
  data: T[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export type SalesOrderCollectionPayload<T> = T[] | SalesOrderCollection<T>

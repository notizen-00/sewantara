import type { InventoryType } from '~/domain/mitra'
import type { Product } from '~/domain/product'

export const INVENTORY_TYPE_LABELS: Record<InventoryType, string> = {
  serialized: 'Serialized',
  quantity: 'Quantity',
}

export const INVENTORY_TYPE_DESCRIPTIONS: Record<InventoryType, string> = {
  serialized: 'Serialized — setiap unit unik',
  quantity: 'Quantity — berdasarkan jumlah stok',
}

export const INVENTORY_TYPE_OPTIONS = (Object.keys(INVENTORY_TYPE_LABELS) as InventoryType[])
  .map((value) => ({ label: INVENTORY_TYPE_DESCRIPTIONS[value], value }))

export interface ProductUnit {
  id: number
  product_id: number
  branch_id?: number
  unit_code: string
  barcode?: string | null
  qr_code?: string | null
  serial_number?: string | null
  status: string
  condition: string
  purchase_date?: string | null
  purchase_price?: number | string | null
  current_meter?: number | string | null
  meter_unit?: string | null
  notes?: string | null
  product?: Pick<Product, 'id' | 'name' | 'sku' | 'inventory_type'> | null
  created_at?: string
}

export interface ProductUnitCreatePayload {
  product_id: number
  unit_code: string
  barcode: string | null
  qr_code: string | null
  serial_number: string | null
  status: string
  condition: string
  purchase_date: string | null
  purchase_price: number
  current_meter: number
  meter_unit: string | null
  notes: string | null
}

export interface ProductUnitQuery {
  product_id?: number | null
  status?: string
  per_page?: number
}

export interface InventoryStock {
  id?: number
  product_id: number
  branch_id?: number
  quantity?: number | string
  total_quantity?: number | string
  quantity_total?: number | string
  available_quantity?: number | string
  quantity_available?: number | string
  reserved_quantity?: number | string
  quantity_reserved?: number | string
  rented_quantity?: number | string
  quantity_rented?: number | string
  maintenance_quantity?: number | string
  quantity_maintenance?: number | string
  damaged_quantity?: number | string
  quantity_damaged?: number | string
  lost_quantity?: number | string
  quantity_lost?: number | string
  product?: Pick<Product, 'id' | 'name' | 'sku' | 'inventory_type'> | null
  updated_at?: string
  [key: string]: unknown
}

export interface StockAdjustmentPayload {
  product_id: number
  quantity: number
  notes: string
}

export interface InventoryCollection<T> {
  data: T[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export type InventoryCollectionPayload<T> = T[] | InventoryCollection<T>

export interface InventoryMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

import type { PricingType } from '~/domain/mitra'
import type { Product } from '~/domain/product'

export const PRICING_TYPE_LABELS: Record<PricingType, string> = {
  hourly: 'Per jam',
  daily: 'Per hari',
  weekly: 'Per minggu',
  monthly: 'Per bulan',
  event: 'Per sesi',
  custom: 'Kustom',
}

export const PRICING_TYPE_OPTIONS = (Object.keys(PRICING_TYPE_LABELS) as PricingType[])
  .map((value) => ({ label: PRICING_TYPE_LABELS[value], value }))

export function pricingTypeLabel(value: string) {
  return PRICING_TYPE_LABELS[value as PricingType] || value
}

export interface ProductPrice {
  id: number
  product_id: number
  branch_id?: number
  pricing_type: PricingType
  duration: number
  price: number | string
  start_at?: string | null
  end_at?: string | null
  is_active: boolean
  product?: Pick<Product, 'id' | 'name' | 'sku' | 'default_pricing_type'> | null
  created_at?: string
  updated_at?: string
}

export interface ProductPricePayload {
  product_id: number
  pricing_type: PricingType
  duration: number
  price: number
  start_at: string | null
  end_at: string | null
  is_active: boolean
}

export interface PricingCollection<T> {
  data: T[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export type PricingCollectionPayload<T> = T[] | PricingCollection<T>

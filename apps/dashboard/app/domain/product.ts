import type { EngineCode, InventoryType, PricingType, ProductType } from '~/domain/mitra'

export interface ProductCategory {
  id: number
  parent_id: number | null
  name: string
  slug: string
  description?: string | null
  image_path?: string | null
  image_url?: string | null
  sort_order: number
  is_active: boolean
  parent?: Pick<ProductCategory, 'id' | 'name'> | null
  products_count?: number
}

export interface ProductImage {
  id: number
  product_id?: number
  image_path: string
  image_url: string
  alt_text?: string | null
  is_primary: boolean
  sort_order: number
}

export interface Product {
  id: number
  category_id: number
  name: string
  slug: string
  sku: string
  brand?: string | null
  model?: string | null
  description?: string | null
  engine_code: EngineCode
  product_type: ProductType
  inventory_type: InventoryType
  default_pricing_type: PricingType
  minimum_rental_duration: number
  deposit_amount: number | string
  late_fee_amount: number | string
  is_featured: boolean
  is_active: boolean
  category?: Pick<ProductCategory, 'id' | 'name' | 'slug'> | null
  images?: ProductImage[]
}

export interface ProductPayload {
  category_id: number
  name: string
  slug: string
  sku: string
  brand: string | null
  model: string | null
  description: string | null
  engine_code: EngineCode
  product_type: ProductType
  inventory_type: InventoryType
  default_pricing_type: PricingType
  minimum_rental_duration: number
  deposit_amount: number
  late_fee_amount: number
  is_featured: boolean
  is_active: boolean
}

export interface CategoryPayload {
  parent_id: number | null
  name: string
  slug: string
  description: string | null
  sort_order: number
  is_active: boolean
}

export interface ProductImagePayload {
  alt_text?: string | null
  is_primary?: boolean
  sort_order?: number
}

export interface ProductListQuery {
  search?: string
  category_id?: number | null
  inventory_type?: InventoryType | ''
  is_active?: boolean | ''
  per_page?: number
}

export interface CategoryListQuery {
  search?: string
  parent_id?: number | null
  roots_only?: boolean
  is_active?: boolean | ''
  per_page?: number
}

export interface LaravelCollection<T> {
  data: T[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export type CollectionPayload<T> = T[] | LaravelCollection<T>

export interface CollectionMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

import type {
  CategoryListQuery,
  CategoryPayload,
  CollectionPayload,
  Product,
  ProductCategory,
  ProductImage,
  ProductImagePayload,
  ProductListQuery,
  ProductPayload,
} from '~/domain/product'
import { useApiClient } from '~/composables/useApiClient'

export function useProductRepository() {
  const api = useApiClient()

  return {
    listProducts: (query: ProductListQuery = {}) =>
      api.tenant<CollectionPayload<Product>>('/products', {
        query: {
          search: query.search,
          category_id: query.category_id,
          inventory_type: query.inventory_type,
          is_active: query.is_active,
          per_page: query.per_page,
        },
      }),
    getProduct: (id: number) => api.tenant<Product>(`/products/${id}`),
    createProduct: (payload: ProductPayload) =>
      api.tenant<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    updateProduct: (id: number, payload: ProductPayload) =>
      api.tenant<Product>(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    deleteProduct: (id: number) =>
      api.tenant<null>(`/products/${id}`, { method: 'DELETE' }),
    uploadProductImage: (productId: number, file: File, payload: ProductImagePayload = {}) => {
      const body = new FormData()
      body.append('image', file)
      if (payload.alt_text) body.append('alt_text', payload.alt_text)
      if (payload.is_primary !== undefined) body.append('is_primary', payload.is_primary ? '1' : '0')
      if (payload.sort_order !== undefined) body.append('sort_order', String(payload.sort_order))
      return api.tenant<ProductImage>(`/products/${productId}/images`, {
        method: 'POST',
        body,
      })
    },
    updateProductImage: (productId: number, imageId: number, payload: ProductImagePayload) =>
      api.tenant<ProductImage>(`/products/${productId}/images/${imageId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    deleteProductImage: (productId: number, imageId: number) =>
      api.tenant<null>(`/products/${productId}/images/${imageId}`, { method: 'DELETE' }),

    listCategories: (query: CategoryListQuery = {}) =>
      api.tenant<CollectionPayload<ProductCategory>>('/categories', {
        query: {
          search: query.search,
          parent_id: query.parent_id,
          roots_only: query.roots_only,
          is_active: query.is_active,
          per_page: query.per_page,
        },
      }),
    getCategory: (id: number) => api.tenant<ProductCategory>(`/categories/${id}`),
    createCategory: (payload: CategoryPayload) =>
      api.tenant<ProductCategory>('/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    updateCategory: (id: number, payload: CategoryPayload) =>
      api.tenant<ProductCategory>(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    deleteCategory: (id: number) =>
      api.tenant<null>(`/categories/${id}`, { method: 'DELETE' }),
    uploadCategoryImage: (id: number, file: File) => {
      const body = new FormData()
      body.append('image', file)
      return api.tenant<ProductCategory>(`/categories/${id}/image`, {
        method: 'POST',
        body,
      })
    },
    deleteCategoryImage: (id: number) =>
      api.tenant<null>(`/categories/${id}/image`, { method: 'DELETE' }),
  }
}

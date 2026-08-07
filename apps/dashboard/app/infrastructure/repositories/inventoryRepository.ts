import type {
  InventoryCollectionPayload,
  InventoryStock,
  ProductUnit,
  ProductUnitCreatePayload,
  ProductUnitQuery,
  StockAdjustmentPayload,
} from '~/domain/inventory'
import { useApiClient } from '~/composables/useApiClient'

export function useInventoryRepository() {
  const api = useApiClient()

  return {
    listUnits: (query: ProductUnitQuery = {}) =>
      api.tenant<InventoryCollectionPayload<ProductUnit>>('/product-units', {
        query: {
          product_id: query.product_id,
          status: query.status,
          per_page: query.per_page,
        },
      }),
    createUnit: (payload: ProductUnitCreatePayload) =>
      api.tenant<ProductUnit>('/product-units', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    listStocks: () =>
      api.tenant<InventoryCollectionPayload<InventoryStock>>('/inventory/stocks'),
    adjustStock: (payload: StockAdjustmentPayload) =>
      api.tenant<InventoryStock>('/inventory/stocks/adjust', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  }
}

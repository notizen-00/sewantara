import type { ProductPrice, ProductPricePayload, PricingCollectionPayload } from '~/domain/pricing'
import { useApiClient } from '~/composables/useApiClient'

export function usePricingRepository() {
  const api = useApiClient()

  return {
    list: () =>
      api.tenant<PricingCollectionPayload<ProductPrice>>('/product-prices', {
        query: { per_page: 100 },
      }),
    create: (payload: ProductPricePayload) =>
      api.tenant<ProductPrice>('/product-prices', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: number, payload: ProductPricePayload) =>
      api.tenant<ProductPrice>(`/product-prices/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
  }
}

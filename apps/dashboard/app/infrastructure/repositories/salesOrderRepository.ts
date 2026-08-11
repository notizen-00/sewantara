import { useApiClient } from '~/composables/useApiClient'
import type {
  SalesOrder,
  SalesOrderCollectionPayload,
  SalesOrderCreatePayload,
} from '~/domain/sales'

export function useSalesOrderRepository() {
  const api = useApiClient()

  return {
    list: (status?: string) =>
      api.tenant<SalesOrderCollectionPayload<SalesOrder>>('/sales-orders', {
        query: { status },
      }),
    create: (payload: SalesOrderCreatePayload) =>
      api.tenant<SalesOrder>('/sales-orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    get: (id: number) => api.tenant<SalesOrder>(`/sales-orders/${id}`),
  }
}

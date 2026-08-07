import { useApiClient } from '~/composables/useApiClient'
import type {
  Customer,
  CustomerCollectionPayload,
  CustomerCreatePayload,
} from '~/domain/customer'

export function useCustomerRepository() {
  const api = useApiClient()

  return {
    list: () => api.tenant<CustomerCollectionPayload>('/customers'),
    create: (payload: CustomerCreatePayload) =>
      api.tenant<Customer>('/customers', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  }
}

import { useApiClient } from '~/composables/useApiClient'
import type {
  Customer,
  CustomerCollectionPayload,
  CustomerCreatePayload,
  CustomerDocument,
  CustomerDocumentUploadPayload,
  CustomerUpdatePayload,
} from '~/domain/customer'

export function useCustomerRepository() {
  const api = useApiClient()

  return {
    list: () => api.tenant<CustomerCollectionPayload>('/customers'),
    get: (id: number) => api.tenant<Customer>(`/customers/${id}`),
    create: (payload: CustomerCreatePayload) =>
      api.tenant<Customer>('/customers', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: number, payload: CustomerUpdatePayload) =>
      api.tenant<Customer>(`/customers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    uploadDocument: (customerId: number, payload: CustomerDocumentUploadPayload) => {
      const body = new FormData()
      body.append('document_type', payload.document_type)
      if (payload.document_number) body.append('document_number', payload.document_number)
      if (payload.expired_at) body.append('expired_at', payload.expired_at)
      body.append('front', payload.front)
      if (payload.back) body.append('back', payload.back)
      return api.tenant<CustomerDocument>(`/customers/${customerId}/documents`, {
        method: 'POST',
        body,
      })
    },
    verifyDocument: (customerId: number, documentId: number) =>
      api.tenant<CustomerDocument>(`/customers/${customerId}/documents/${documentId}/verify`, {
        method: 'POST',
      }),
    deleteDocument: (customerId: number, documentId: number) =>
      api.tenant<null>(`/customers/${customerId}/documents/${documentId}`, { method: 'DELETE' }),
  }
}

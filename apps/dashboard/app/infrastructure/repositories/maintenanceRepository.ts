import { useApiClient } from '~/composables/useApiClient'
import type {
  MaintenanceCollectionPayload,
  MaintenanceCompletePayload,
  MaintenanceCreatePayload,
  MaintenanceRecord,
} from '~/domain/maintenance'

export function useMaintenanceRepository() {
  const api = useApiClient()

  return {
    list: (status?: string, productUnitId?: number) =>
      api.tenant<MaintenanceCollectionPayload<MaintenanceRecord>>('/maintenance', {
        query: { status, product_unit_id: productUnitId, per_page: 100 },
      }),
    create: (payload: MaintenanceCreatePayload) =>
      api.tenant<MaintenanceRecord>('/maintenance', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    start: (id: number) =>
      api.tenant<MaintenanceRecord>(`/maintenance/${id}/start`, { method: 'POST' }),
    complete: (id: number, payload: MaintenanceCompletePayload) =>
      api.tenant<MaintenanceRecord>(`/maintenance/${id}/complete`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    cancel: (id: number, notes: string | null) =>
      api.tenant<MaintenanceRecord>(`/maintenance/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
      }),
  }
}

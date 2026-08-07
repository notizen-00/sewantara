import type { DashboardReport } from '~/domain/mitra'
import { useApiClient } from '~/composables/useApiClient'

export function useOperationsRepository() {
  const api = useApiClient()

  return {
    dashboard: () => api.tenant<DashboardReport>('/reports/dashboard'),
    customers: () => api.tenant<unknown[]>('/customers'),
    bookings: () => api.tenant<unknown[]>('/bookings'),
    maintenance: () => api.tenant<unknown[]>('/maintenance'),
  }
}

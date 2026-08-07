import type { BusinessTemplate, Plan } from '~/domain/mitra'
import { useApiClient } from '~/composables/useApiClient'

export function useCatalogRepository() {
  const api = useApiClient()

  return {
    health: () => api.central<{ status?: string }>('/shared/health'),
    templates: () => api.central<BusinessTemplate[]>('/central/business-templates'),
    plans: (billing_interval = 'month', currency = 'IDR') =>
      api.central<Plan[]>('/central/plans', { query: { billing_interval, currency } }),
  }
}

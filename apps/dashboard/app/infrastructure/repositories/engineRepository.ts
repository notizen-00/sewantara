import type { EngineCode, TenantEngine } from '~/domain/mitra'
import { useApiClient } from '~/composables/useApiClient'

export function useEngineRepository() {
  const api = useApiClient()

  return {
    list: () => api.tenant<TenantEngine[]>('/engines'),
    enable: (engineCode: EngineCode) =>
      api.tenant<TenantEngine[]>('/engines/enable', {
        method: 'POST',
        body: JSON.stringify({ engine_code: engineCode }),
      }),
    disable: (engineCode: EngineCode) =>
      api.tenant<TenantEngine[]>('/engines/disable', {
        method: 'POST',
        body: JSON.stringify({ engine_code: engineCode }),
      }),
  }
}

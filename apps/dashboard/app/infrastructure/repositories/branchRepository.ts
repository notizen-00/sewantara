import type { Branch } from '~/domain/mitra'
import { useApiClient } from '~/composables/useApiClient'

export type BranchCollection = Branch[] | { data: Branch[] }

export function useBranchRepository() {
  const api = useApiClient()

  return {
    list: () => api.tenant<BranchCollection>('/branches'),
  }
}

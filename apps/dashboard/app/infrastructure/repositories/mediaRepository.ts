import { useApiClient } from '~/composables/useApiClient'

export function useMediaRepository() {
  const api = useApiClient()

  return {
    fetchTenantMedia: (imageUrl: string) => api.tenantMedia(imageUrl),
  }
}

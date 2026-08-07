import type { CatalogResponse } from '#shared/types'
import { getDemoCatalog } from '~~/server/utils/demo-data'
import { apiResponse, setPublicTenantCache } from '~~/server/utils/response'
import { fromDemoOrUpstream, isDemoMode, requestUpstream } from '~~/server/utils/upstream'
import { parseCatalogQuery } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = parseCatalogQuery(event)
  const catalog = await fromDemoOrUpstream(
    event,
    () => getDemoCatalog(query),
    () => requestUpstream<CatalogResponse>(event, String(config.apiEndpoints.catalog), {
      query: { ...query },
    }),
  )

  setPublicTenantCache(event, { browserSeconds: 15, cdnSeconds: 90, staleSeconds: 180 })
  return apiResponse(event, catalog, isDemoMode(event))
})

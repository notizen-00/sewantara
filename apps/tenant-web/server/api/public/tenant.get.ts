import type { Tenant } from '#shared/types'
import { getDemoTenant } from '~~/server/utils/demo-data'
import { apiResponse, setPublicTenantCache } from '~~/server/utils/response'
import { getTenantContext } from '~~/server/utils/tenant'
import { fromDemoOrUpstream, isDemoMode, requestUpstream } from '~~/server/utils/upstream'

export default defineEventHandler(async (event) => {
  const tenantContext = getTenantContext(event)
  const config = useRuntimeConfig(event)
  const tenant = await fromDemoOrUpstream(
    event,
    () => getDemoTenant(tenantContext),
    () => requestUpstream<Tenant>(event, String(config.apiEndpoints.tenant), {
      query: { hostname: tenantContext.hostname },
    }),
  )

  setPublicTenantCache(event, { browserSeconds: 60, cdnSeconds: 300, staleSeconds: 600 })
  return apiResponse(event, tenant, isDemoMode(event))
})

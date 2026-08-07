import type { HomePayload } from '#shared/types'
import { getDemoHome } from '~~/server/utils/demo-data'
import { apiResponse, setPublicTenantCache } from '~~/server/utils/response'
import { getTenantContext } from '~~/server/utils/tenant'
import { fromDemoOrUpstream, isDemoMode, requestUpstream } from '~~/server/utils/upstream'

export default defineEventHandler(async (event) => {
  const tenant = getTenantContext(event)
  const config = useRuntimeConfig(event)
  const home = await fromDemoOrUpstream(
    event,
    () => getDemoHome(tenant),
    () => requestUpstream<HomePayload>(event, String(config.apiEndpoints.home)),
  )

  setPublicTenantCache(event, { browserSeconds: 30, cdnSeconds: 180, staleSeconds: 300 })
  return apiResponse(event, home, isDemoMode(event))
})

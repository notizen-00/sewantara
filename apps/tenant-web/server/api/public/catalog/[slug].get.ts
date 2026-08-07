import { getRouterParam } from 'h3'
import type { Product } from '#shared/types'
import { getDemoProduct } from '~~/server/utils/demo-data'
import { apiResponse, setPublicTenantCache } from '~~/server/utils/response'
import { fromDemoOrUpstream, isDemoMode, requestUpstream } from '~~/server/utils/upstream'
import { validateRouteToken } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const slug = validateRouteToken(event, getRouterParam(event, 'slug'), 'slug')
  const endpoint = `${String(config.apiEndpoints.catalog).replace(/\/$/, '')}/${encodeURIComponent(slug)}`
  const product = await fromDemoOrUpstream(
    event,
    () => getDemoProduct(slug),
    () => requestUpstream<Product>(event, endpoint),
  )

  setPublicTenantCache(event, { browserSeconds: 30, cdnSeconds: 180, staleSeconds: 300 })
  return apiResponse(event, product, isDemoMode(event))
})

import { getRouterParam } from 'h3'
import type { PublicBlogPost } from '~~/server/utils/demo-blog'
import { getDemoBlogPost } from '~~/server/utils/demo-blog'
import { apiResponse, setPublicTenantCache } from '~~/server/utils/response'
import { getTenantContext } from '~~/server/utils/tenant'
import { fromDemoOrUpstream, isDemoMode, requestUpstream } from '~~/server/utils/upstream'
import { validateRouteToken } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  setPublicTenantCache(event, 180)
  const tenant = getTenantContext(event)
  const config = useRuntimeConfig(event)
  const blogEndpoint = (config.apiEndpoints as Record<string, string>).blog || '/v1/public/blog'
  const slug = validateRouteToken(event, getRouterParam(event, 'slug'), 'slug')
  const endpoint = `${blogEndpoint.replace(/\/$/, '')}/${encodeURIComponent(slug)}`
  const post = await fromDemoOrUpstream(
    event,
    () => getDemoBlogPost(tenant, slug),
    () => requestUpstream<PublicBlogPost>(event, endpoint),
  )
  return apiResponse(event, post, isDemoMode(event))
})

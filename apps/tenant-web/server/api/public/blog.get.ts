import type { BlogSnippet } from '#shared/types'
import { getDemoBlogList } from '~~/server/utils/demo-blog'
import { apiResponse, setPublicTenantCache } from '~~/server/utils/response'
import { getTenantContext } from '~~/server/utils/tenant'
import { fromDemoOrUpstream, isDemoMode, requestUpstream } from '~~/server/utils/upstream'

export default defineEventHandler(async (event) => {
  setPublicTenantCache(event, 120)
  const tenant = getTenantContext(event)
  const config = useRuntimeConfig(event)
  const blogEndpoint = (config.apiEndpoints as Record<string, string>).blog || '/v1/public/blog'
  const posts = await fromDemoOrUpstream(
    event,
    () => getDemoBlogList(tenant),
    () => requestUpstream<BlogSnippet[]>(event, blogEndpoint),
  )
  return apiResponse(event, posts, isDemoMode(event))
})

import { setResponseHeader } from 'h3'
import type { Tenant } from '#shared/types'
import { getDemoTenant } from '~~/server/utils/demo-data'
import { setPublicTenantCache } from '~~/server/utils/response'
import { getTenantContext, tenantOrigin } from '~~/server/utils/tenant'
import { fromDemoOrUpstream, requestUpstream } from '~~/server/utils/upstream'

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

  const lines = tenant.status === 'active'
    ? [
        'User-agent: *',
        'Allow: /',
        'Disallow: /checkout',
        'Disallow: /payment',
        'Disallow: /profile',
        'Disallow: /tracking',
        `Sitemap: ${tenantOrigin(tenantContext)}/sitemap.xml`,
      ]
    : ['User-agent: *', 'Disallow: /']

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setPublicTenantCache(event, { browserSeconds: 300, cdnSeconds: 600, staleSeconds: 600 })
  return `${lines.join('\n')}\n`
})

import { setResponseHeader } from 'h3'
import type { CatalogResponse, HomePayload, Tenant } from '#shared/types'
import {
  getDemoSitemapEntries,
  getDemoTenant,
} from '~~/server/utils/demo-data'
import { setPublicTenantCache } from '~~/server/utils/response'
import { getTenantContext, tenantOrigin } from '~~/server/utils/tenant'
import { isDemoMode, requestUpstream } from '~~/server/utils/upstream'

interface SitemapEntry {
  path: string
  lastmod?: string
  priority: number
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const tenantContext = getTenantContext(event)
  const config = useRuntimeConfig(event)
  let tenant: Tenant
  let entries: SitemapEntry[]

  if (isDemoMode(event)) {
    tenant = getDemoTenant(tenantContext)
    entries = getDemoSitemapEntries()
  }
  else {
    const [tenantPayload, home, catalog] = await Promise.all([
      requestUpstream<Tenant>(event, String(config.apiEndpoints.tenant), {
        query: { hostname: tenantContext.hostname },
      }),
      requestUpstream<HomePayload>(event, String(config.apiEndpoints.home)),
      requestUpstream<CatalogResponse>(event, String(config.apiEndpoints.catalog), {
        query: { page: 1, perPage: 24, sort: 'recommended' },
      }),
    ])
    tenant = tenantPayload
    entries = [
      { path: '/', priority: 1 },
      { path: '/catalog', priority: 0.9 },
      ...catalog.products.map(product => ({ path: `/catalog/${product.slug}`, priority: 0.8 })),
      { path: '/about', priority: 0.5 },
      { path: '/contact', priority: 0.5 },
      ...(home.tenant.features.blog ? [{ path: '/blog', priority: 0.6 }] : []),
      ...home.blog.map(post => ({ path: `/blog/${post.slug}`, lastmod: post.publishedAt, priority: 0.6 })),
    ]
  }

  const baseUrl = tenantOrigin(tenantContext)
  const urls = tenant.status === 'active'
    ? entries.map(entry => [
        '  <url>',
        `    <loc>${escapeXml(`${baseUrl}${entry.path}`)}</loc>`,
        ...(entry.lastmod ? [`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`] : []),
        `    <priority>${entry.priority.toFixed(1)}</priority>`,
        '  </url>',
      ].join('\n')).join('\n')
    : ''
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n')

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setPublicTenantCache(event, { browserSeconds: 300, cdnSeconds: 600, staleSeconds: 600 })
  return xml
})

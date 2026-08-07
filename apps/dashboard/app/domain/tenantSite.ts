import type { Tenant } from '~/domain/mitra'

export interface TenantSite {
  host: string
  url: string
}

/**
 * Landing page tenant dilayani pada `{subdomain}.{baseDomain}`.
 *
 * Backend mengirim host lengkap lewat `tenant.domain` (mis. "toko.sewantara.id");
 * bila hanya potongan subdomain yang tersedia, host disusun dari `baseDomain`.
 * `slug` dipakai sebagai cadangan terakhir karena tidak dijamin sama dengan
 * subdomain yang dipilih saat registrasi.
 */
export function resolveTenantSite(
  tenant: Pick<Tenant, 'domain' | 'subdomain' | 'slug'> | null | undefined,
  baseDomain: string,
): TenantSite | null {
  if (!tenant) return null

  const host = resolveHost(tenant, baseDomain)
  if (!host) return null

  return { host, url: `https://${host}` }
}

function resolveHost(
  tenant: Pick<Tenant, 'domain' | 'subdomain' | 'slug'>,
  baseDomain: string,
) {
  const domain = normalize(tenant.domain)
  if (domain) return stripScheme(domain)

  const label = normalize(tenant.subdomain) || normalize(tenant.slug)
  const base = stripScheme(normalize(baseDomain))
  if (!label || !base) return ''

  // Nilai seperti "toko.sewantara.id" yang tersimpan di kolom subdomain
  // tidak boleh digandakan menjadi "toko.sewantara.id.sewantara.id".
  return label.endsWith(base) ? label : `${label}.${base}`
}

function normalize(value: string | null | undefined) {
  return (value || '').trim().toLowerCase()
}

function stripScheme(value: string) {
  return value.replace(/^https?:\/\//, '').replace(/\/+$/, '')
}

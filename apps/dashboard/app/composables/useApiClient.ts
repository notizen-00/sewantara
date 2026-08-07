import { ApiRequestError, type ApiResponse } from '~/domain/api'

type RequestOptions = RequestInit & {
  query?: Record<string, string | number | boolean | null | undefined>
}

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export function resolveApiBaseUrl(value: unknown) {
  const configuredUrl = String(value || '').replace(/\/+$/, '')
  return configuredUrl.endsWith('/api') ? configuredUrl : `${configuredUrl}/api`
}

function buildHeaders(
  body: BodyInit | null | undefined,
  headers?: HeadersInit,
  authenticated?: { token: string; branchId: string },
) {
  const result = new Headers(jsonHeaders)

  if (authenticated) {
    result.set('Authorization', `Bearer ${authenticated.token}`)
    result.set('X-Branch-Id', authenticated.branchId)
  }

  new Headers(headers).forEach((value, key) => result.set(key, value))

  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    result.delete('Content-Type')
  }

  return result
}

function withQuery(url: string, query?: RequestOptions['query']) {
  if (!query) return url

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined && value !== '') {
      params.set(key, String(value))
    }
  }

  const queryString = params.toString()
  return queryString ? `${url}?${queryString}` : url
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload?.success) {
    const code = payload?.error?.code
    if (process.client && ['SUBSCRIPTION_REQUIRED', 'SUBSCRIPTION_EXPIRED'].includes(code)) {
      window.dispatchEvent(new CustomEvent('sewantara:subscription-error', {
        detail: { code, status: response.status },
      }))
    }

    throw new ApiRequestError(
      payload?.error?.message || payload?.message || 'Request gagal diproses.',
      response.status,
      code,
      payload?.error?.details || payload?.errors,
    )
  }

  return payload
}

export function useApiClient() {
  const config = useRuntimeConfig()
  const baseUrl = resolveApiBaseUrl(config.public.apiBase)

  async function central<T>(path: string, options: RequestOptions = {}) {
    const { query, ...requestOptions } = options
    const response = await fetch(withQuery(`${baseUrl}${path}`, query), {
      ...requestOptions,
      headers: buildHeaders(options.body, options.headers),
    })

    return parseResponse<T>(response)
  }

  async function tenant<T>(path: string, options: RequestOptions = {}) {
    const token = process.client ? localStorage.getItem('sewantara.access_token') : ''
    const tenantId = process.client ? localStorage.getItem('sewantara.tenant_id') : ''
    const branchId = process.client ? localStorage.getItem('sewantara.branch_id') || '1' : '1'

    if (!tenantId || !token) {
      throw new ApiRequestError('Session tenant belum tersedia.', 401, 'SESSION_REQUIRED')
    }

    const { query, ...requestOptions } = options
    const response = await fetch(withQuery(`${baseUrl}/tenant/${tenantId}${path}`, query), {
      ...requestOptions,
      headers: buildHeaders(options.body, options.headers, { token, branchId }),
    })

    const activeBranch = response.headers.get('X-Branch-Id')
    if (process.client && activeBranch) {
      useAuthStore().syncBranchId(activeBranch)
    }

    return parseResponse<T>(response)
  }

  async function tenantMedia(imageUrl: string) {
    const token = process.client ? localStorage.getItem('sewantara.access_token') : ''
    const tenantId = process.client ? localStorage.getItem('sewantara.tenant_id') : ''
    const branchId = process.client ? localStorage.getItem('sewantara.branch_id') || '1' : '1'

    if (!token || !tenantId) {
      throw new ApiRequestError('Session tenant belum tersedia.', 401, 'SESSION_REQUIRED')
    }

    const resolvedMediaUrl = new URL(imageUrl, `${baseUrl}/`)
    const resolvedApiUrl = new URL(baseUrl)
    const apiPath = resolvedApiUrl.pathname.replace(/\/$/, '')
    const expectedMediaPath = `${apiPath}/tenant/${encodeURIComponent(tenantId)}/media/`
    if (
      resolvedMediaUrl.origin !== resolvedApiUrl.origin
      || !resolvedMediaUrl.pathname.startsWith(expectedMediaPath)
    ) {
      throw new ApiRequestError('URL private media tidak valid.', 400, 'INVALID_MEDIA_URL')
    }

    const response = await fetch(resolvedMediaUrl, {
      headers: buildHeaders(undefined, undefined, { token, branchId }),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      throw new ApiRequestError(
        payload?.error?.message || payload?.message || 'Gambar tidak dapat dimuat.',
        response.status,
        payload?.error?.code || 'MEDIA_LOAD_FAILED',
        payload?.error?.details || payload?.errors,
      )
    }

    return response.blob()
  }

  return { central, tenant, tenantMedia }
}

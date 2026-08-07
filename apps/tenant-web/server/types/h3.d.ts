import type { ResolvedTenantContext } from '../utils/tenant'

declare module 'h3' {
  interface H3EventContext {
    requestId?: string
    tenant?: ResolvedTenantContext
  }
}

export {}

import { describe, expect, it } from 'vitest'
import { normalizeTenant } from '../../app/composables/useTenant'
import type { Tenant } from '../../shared/types'

describe('tenant UI boundary', () => {
  it('uses a neutral fallback for malformed API payloads', () => {
    const tenant = normalizeTenant({ data: { unexpected: true } })

    expect(tenant.slug).toBe('sewantara')
    expect(tenant.theme.primary).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('unwraps a valid API envelope', () => {
    const fallback = normalizeTenant(null)
    const custom: Tenant = {
      ...fallback,
      id: 'tenant-test',
      slug: 'tenant-test',
      businessName: 'Tenant Test',
    }

    expect(normalizeTenant({ data: custom }).businessName).toBe('Tenant Test')
  })
})

import { describe, expect, it } from 'vitest'
import { getDemoCatalog, getDemoProduct } from '../../server/utils/demo-data'

describe('demo catalog adapter', () => {
  it('filters products and keeps pagination deterministic', () => {
    const catalog = getDemoCatalog({
      search: 'sony',
      page: 1,
      perPage: 2,
      sort: 'price_asc',
    })

    expect(catalog.products.length).toBeGreaterThan(0)
    expect(catalog.products.every(product => product.name.toLowerCase().includes('sony')
      || product.shortDescription.toLowerCase().includes('sony'))).toBe(true)
    expect(catalog.pagination.page).toBe(1)
    expect(catalog.pagination.perPage).toBe(2)
  })

  it('returns booking rules and monetary values from the product boundary', () => {
    const product = getDemoProduct('sony-a7-iv')

    expect(product.price.base.amount).toBeGreaterThan(0)
    expect(product.price.base.currency).toBe('IDR')
    expect(product.bookingRules.minDuration).toBeGreaterThan(0)
    expect(product.bookingRules.requiredFields).toContain('startDate')
  })
})

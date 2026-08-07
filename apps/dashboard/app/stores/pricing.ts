import { defineStore } from 'pinia'
import type { ProductPrice, ProductPricePayload, PricingCollectionPayload } from '~/domain/pricing'
import { usePricingRepository } from '~/infrastructure/repositories/pricingRepository'

function collectionItems<T>(payload: PricingCollectionPayload<T>) {
  return Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : []
}

export const usePricingStore = defineStore('pricing', () => {
  const prices = ref<ProductPrice[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')

  async function fetchPrices() {
    loading.value = true
    error.value = ''
    try {
      const response = await usePricingRepository().list()
      prices.value = collectionItems(response.data)
      return prices.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar harga gagal dimuat.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function savePrice(payload: ProductPricePayload, id?: number) {
    saving.value = true
    error.value = ''
    try {
      const response = id
        ? await usePricingRepository().update(id, payload)
        : await usePricingRepository().create(payload)
      const index = prices.value.findIndex((price) => price.id === response.data.id)
      if (index >= 0) prices.value[index] = response.data
      else prices.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Harga produk gagal disimpan.'
      throw err
    } finally {
      saving.value = false
    }
  }

  function reset() {
    prices.value = []
    error.value = ''
  }

  return { prices, loading, saving, error, fetchPrices, savePrice, reset }
})

import { defineStore } from 'pinia'
import type { SalesOrder, SalesOrderCollectionPayload, SalesOrderCreatePayload } from '~/domain/sales'
import { useSalesOrderRepository } from '~/infrastructure/repositories/salesOrderRepository'

function normalizeCollection<T>(payload: SalesOrderCollectionPayload<T>) {
  if (Array.isArray(payload)) return { items: payload, total: payload.length }
  return {
    items: Array.isArray(payload.data) ? payload.data : [],
    total: payload.total ?? payload.data.length,
  }
}

export const useSalesOrderStore = defineStore('salesOrders', () => {
  const items = ref<SalesOrder[]>([])
  const total = ref(0)
  const loading = ref(false)
  const creating = ref(false)
  const error = ref('')

  async function fetchAll(status?: string) {
    loading.value = true
    error.value = ''
    try {
      const response = await useSalesOrderRepository().list(status)
      const normalized = normalizeCollection(response.data)
      items.value = normalized.items
      total.value = normalized.total
      return items.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar penjualan gagal dimuat.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function create(payload: SalesOrderCreatePayload) {
    creating.value = true
    error.value = ''
    try {
      const response = await useSalesOrderRepository().create(payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Transaksi penjualan gagal disimpan.'
      throw err
    } finally {
      creating.value = false
    }
  }

  function reset() {
    items.value = []
    total.value = 0
    error.value = ''
  }

  return {
    items,
    total,
    loading,
    creating,
    error,
    fetchAll,
    create,
    reset,
  }
})

import { defineStore } from 'pinia'
import type {
  Customer,
  CustomerCollectionPayload,
  CustomerCreatePayload,
} from '~/domain/customer'
import { useCustomerRepository } from '~/infrastructure/repositories/customerRepository'

function normalizeCollection(payload: CustomerCollectionPayload) {
  if (Array.isArray(payload)) return { items: payload, total: payload.length }
  return {
    items: Array.isArray(payload.data) ? payload.data : [],
    total: payload.total ?? payload.data.length,
  }
}

export const useCustomerStore = defineStore('customers', () => {
  const items = ref<Customer[]>([])
  const total = ref(0)
  const loading = ref(false)
  const creating = ref(false)
  const error = ref('')

  async function fetchAll() {
    loading.value = true
    error.value = ''
    try {
      const response = await useCustomerRepository().list()
      const normalized = normalizeCollection(response.data)
      items.value = normalized.items
      total.value = normalized.total
      return items.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar pelanggan gagal dimuat.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function create(payload: CustomerCreatePayload) {
    creating.value = true
    error.value = ''
    try {
      const response = await useCustomerRepository().create(payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pelanggan gagal ditambahkan.'
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

import { defineStore } from 'pinia'
import type {
  MaintenanceCollectionPayload,
  MaintenanceCompletePayload,
  MaintenanceCreatePayload,
  MaintenanceRecord,
} from '~/domain/maintenance'
import { useMaintenanceRepository } from '~/infrastructure/repositories/maintenanceRepository'

function normalizeCollection(payload: MaintenanceCollectionPayload<MaintenanceRecord>) {
  if (Array.isArray(payload)) return { items: payload, total: payload.length }
  return {
    items: Array.isArray(payload.data) ? payload.data : [],
    total: payload.total ?? payload.data.length,
  }
}

export const useMaintenanceStore = defineStore('maintenance', () => {
  const items = ref<MaintenanceRecord[]>([])
  const total = ref(0)
  const loading = ref(false)
  const creating = ref(false)
  const updatingId = ref<number | null>(null)
  const error = ref('')

  function replace(record: MaintenanceRecord) {
    const index = items.value.findIndex((item) => item.id === record.id)
    if (index >= 0) items.value[index] = record
    else items.value.unshift(record)
  }

  async function fetchAll() {
    loading.value = true
    error.value = ''
    try {
      const response = await useMaintenanceRepository().list()
      const normalized = normalizeCollection(response.data)
      items.value = normalized.items
      total.value = normalized.total
      return items.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar pemeliharaan gagal dimuat.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function create(payload: MaintenanceCreatePayload) {
    creating.value = true
    error.value = ''
    try {
      const response = await useMaintenanceRepository().create(payload)
      replace(response.data)
      total.value += 1
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pemeliharaan gagal dijadwalkan.'
      throw err
    } finally {
      creating.value = false
    }
  }

  async function start(id: number) {
    updatingId.value = id
    error.value = ''
    try {
      const response = await useMaintenanceRepository().start(id)
      replace(response.data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pemeliharaan gagal dimulai.'
      throw err
    } finally {
      updatingId.value = null
    }
  }

  async function complete(id: number, payload: MaintenanceCompletePayload) {
    updatingId.value = id
    error.value = ''
    try {
      const response = await useMaintenanceRepository().complete(id, payload)
      replace(response.data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pemeliharaan gagal diselesaikan.'
      throw err
    } finally {
      updatingId.value = null
    }
  }

  async function cancel(id: number, notes: string | null) {
    updatingId.value = id
    error.value = ''
    try {
      const response = await useMaintenanceRepository().cancel(id, notes)
      replace(response.data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pemeliharaan gagal dibatalkan.'
      throw err
    } finally {
      updatingId.value = null
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
    updatingId,
    error,
    fetchAll,
    create,
    start,
    complete,
    cancel,
    reset,
  }
})

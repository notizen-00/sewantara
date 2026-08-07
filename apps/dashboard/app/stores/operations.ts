import { defineStore } from 'pinia'
import type { DashboardReport } from '~/domain/mitra'
import { useOperationsRepository } from '~/infrastructure/repositories/operationsRepository'

export const useOperationsStore = defineStore('operations', () => {
  const dashboard = ref<DashboardReport | null>(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchDashboard() {
    loading.value = true
    error.value = ''

    try {
      const response = await useOperationsRepository().dashboard()
      dashboard.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Dashboard operasional gagal diambil.'
    } finally {
      loading.value = false
    }
  }

  function reset() {
    dashboard.value = null
    error.value = ''
  }

  return { dashboard, loading, error, fetchDashboard, reset }
})

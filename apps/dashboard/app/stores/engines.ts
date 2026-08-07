import { defineStore } from 'pinia'
import type { EngineCode, TenantEngine } from '~/domain/mitra'
import { useEngineRepository } from '~/infrastructure/repositories/engineRepository'

export const useEngineStore = defineStore('engines', () => {
  const catalog = ref<TenantEngine[]>([])
  const loading = ref(false)
  const toggling = ref<EngineCode | null>(null)
  const error = ref('')

  async function fetchCatalog() {
    loading.value = true
    error.value = ''
    try {
      const response = await useEngineRepository().list()
      catalog.value = response.data
      return catalog.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar layanan gagal dimuat.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function enable(engineCode: EngineCode) {
    toggling.value = engineCode
    error.value = ''
    try {
      await useEngineRepository().enable(engineCode)
      await Promise.all([fetchCatalog(), useAuthStore().fetchSession()])
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Layanan gagal diaktifkan.'
      throw err
    } finally {
      toggling.value = null
    }
  }

  async function disable(engineCode: EngineCode) {
    toggling.value = engineCode
    error.value = ''
    try {
      await useEngineRepository().disable(engineCode)
      await Promise.all([fetchCatalog(), useAuthStore().fetchSession()])
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Layanan gagal dinonaktifkan.'
      throw err
    } finally {
      toggling.value = null
    }
  }

  return {
    catalog,
    loading,
    toggling,
    error,
    fetchCatalog,
    enable,
    disable,
  }
})

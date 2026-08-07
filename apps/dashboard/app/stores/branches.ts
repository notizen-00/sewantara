import { defineStore } from 'pinia'
import type { Branch } from '~/domain/mitra'
import { useBranchRepository, type BranchCollection } from '~/infrastructure/repositories/branchRepository'

function normalizeBranches(payload: BranchCollection): Branch[] {
  if (Array.isArray(payload)) return payload
  return Array.isArray(payload.data) ? payload.data : []
}

export const useBranchStore = defineStore('branches', () => {
  const items = ref<Branch[]>([])
  const loading = ref(false)
  const error = ref('')

  const activeItems = computed(() => items.value.filter((branch) => branch.is_active))

  function useCurrentBranch(branch: Branch | null | undefined) {
    items.value = branch ? [branch] : []
    error.value = ''
  }

  async function fetchAll() {
    loading.value = true
    error.value = ''

    try {
      const response = await useBranchRepository().list()
      items.value = normalizeBranches(response.data)
      return items.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar cabang gagal dimuat.'
      return items.value
    } finally {
      loading.value = false
    }
  }

  function clear() {
    items.value = []
    error.value = ''
  }

  return {
    items,
    activeItems,
    loading,
    error,
    useCurrentBranch,
    fetchAll,
    clear,
  }
})

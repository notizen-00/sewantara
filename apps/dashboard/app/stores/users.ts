import { defineStore } from 'pinia'
import type {
  AppUser,
  AppUserRole,
  AssignUserRolePayload,
  RoleCollectionPayload,
  UserCollectionPayload,
  UserCreatePayload,
  UserUpdatePayload,
} from '~/domain/user'
import { useUserRepository } from '~/infrastructure/repositories/userRepository'

function normalizeUsers(payload: UserCollectionPayload) {
  if (Array.isArray(payload)) return { items: payload, total: payload.length }
  return {
    items: Array.isArray(payload.data) ? payload.data : [],
    total: payload.total ?? payload.data.length,
  }
}

function normalizeRoles(payload: RoleCollectionPayload): AppUserRole[] {
  return Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : []
}

export const useUserStore = defineStore('users', () => {
  const items = ref<AppUser[]>([])
  const roles = ref<AppUserRole[]>([])
  const total = ref(0)
  const loading = ref(false)
  const loadingRoles = ref(false)
  const saving = ref(false)
  const deleting = ref(false)
  const error = ref('')

  async function fetchAll() {
    loading.value = true
    error.value = ''
    try {
      const response = await useUserRepository().list()
      const normalized = normalizeUsers(response.data)
      items.value = normalized.items
      total.value = normalized.total
      return items.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar pengguna gagal dimuat.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRoles() {
    loadingRoles.value = true
    error.value = ''
    try {
      const response = await useUserRepository().roles()
      roles.value = normalizeRoles(response.data)
      return roles.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar role gagal dimuat.'
      throw err
    } finally {
      loadingRoles.value = false
    }
  }

  async function fetchDetail(id: number) {
    const response = await useUserRepository().get(id)
    return response.data
  }

  async function create(payload: UserCreatePayload) {
    saving.value = true
    error.value = ''
    try {
      const response = await useUserRepository().create(payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pengguna gagal ditambahkan.'
      throw err
    } finally {
      saving.value = false
    }
  }

  async function update(id: number, payload: UserUpdatePayload) {
    saving.value = true
    error.value = ''
    try {
      const response = await useUserRepository().update(id, payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pengguna gagal diperbarui.'
      throw err
    } finally {
      saving.value = false
    }
  }

  async function assignRole(id: number, payload: AssignUserRolePayload) {
    saving.value = true
    error.value = ''
    try {
      const response = await useUserRepository().assignRole(id, payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Role pengguna gagal ditetapkan.'
      throw err
    } finally {
      saving.value = false
    }
  }

  async function deleteUser(id: number) {
    deleting.value = true
    error.value = ''
    try {
      await useUserRepository().delete(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pengguna gagal dihapus.'
      throw err
    } finally {
      deleting.value = false
    }
  }

  function reset() {
    items.value = []
    roles.value = []
    total.value = 0
    error.value = ''
  }

  return {
    items,
    roles,
    total,
    loading,
    loadingRoles,
    saving,
    deleting,
    error,
    fetchAll,
    fetchRoles,
    fetchDetail,
    create,
    update,
    assignRole,
    deleteUser,
    reset,
  }
})

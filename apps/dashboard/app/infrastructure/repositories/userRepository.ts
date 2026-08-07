import { useApiClient } from '~/composables/useApiClient'
import type {
  AppUser,
  AssignUserRolePayload,
  RoleCollectionPayload,
  UserCollectionPayload,
  UserCreatePayload,
  UserUpdatePayload,
} from '~/domain/user'

export function useUserRepository() {
  const api = useApiClient()

  return {
    list: () =>
      api.tenant<UserCollectionPayload>('/users', {
        query: { per_page: 100 },
      }),
    get: (id: number) => api.tenant<AppUser>(`/users/${id}`),
    create: (payload: UserCreatePayload) =>
      api.tenant<AppUser>('/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id: number, payload: UserUpdatePayload) =>
      api.tenant<AppUser>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    delete: (id: number) =>
      api.tenant<null>(`/users/${id}`, { method: 'DELETE' }),
    roles: () => api.tenant<RoleCollectionPayload>('/roles'),
    assignRole: (id: number, payload: AssignUserRolePayload) =>
      api.tenant<AppUser>(`/users/${id}/roles`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  }
}

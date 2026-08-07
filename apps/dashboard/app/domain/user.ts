export interface AppUserBranch {
  id: number
  name: string
  code: string
  is_active: boolean
  pivot?: {
    is_primary?: boolean
  }
}

export interface AppUserPermission {
  id: number
  name: string
  code: string
  module: string
}

export interface AppUserRole {
  id: number
  name: string
  code: string
  is_system: boolean
  permissions?: AppUserPermission[]
  pivot?: {
    branch_id?: number | null
  }
}

export interface AppUser {
  id: number
  tenant_id?: string
  name: string
  email: string
  phone?: string | null
  avatar_path?: string | null
  is_active: boolean
  email_verified_at?: string | null
  last_login_at?: string | null
  created_at?: string
  updated_at?: string
  roles?: AppUserRole[]
  branches?: AppUserBranch[]
}

export interface UserCreatePayload {
  name: string
  email: string
  phone: string | null
  password: string
  password_confirmation: string
  is_active: boolean
  branch_ids: number[]
}

export interface UserUpdatePayload {
  name: string
  email: string
  phone: string | null
  is_active: boolean
  branch_ids: number[]
  password?: string
  password_confirmation?: string
}

export interface AssignUserRolePayload {
  role_id: number
  branch_id: number | null
}

export interface UserCollection {
  data: AppUser[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export type UserCollectionPayload = AppUser[] | UserCollection
export type RoleCollectionPayload = AppUserRole[] | { data: AppUserRole[] }

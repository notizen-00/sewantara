import type {
  AppUser,
  UserCreatePayload,
  UserUpdatePayload,
} from '~/domain/user'

interface UserFormState {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  is_active: boolean
  branch_ids: number[]
  role_id: number | null
  role_branch_id: number | null
}

function createUserForm(): UserFormState {
  return {
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    is_active: true,
    branch_ids: [],
    role_id: null,
    role_branch_id: null,
  }
}

export function useUserPresenter() {
  const auth = useAuthStore()
  const store = useUserStore()
  const branches = useBranchStore()
  const snackbar = useSnackbarStore()
  const search = ref('')
  const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
  const editorOpen = ref(false)
  const editingId = ref<number | null>(null)
  const deleteTarget = ref<AppUser | null>(null)
  const initializedContext = ref('')
  const form = reactive<UserFormState>(createUserForm())

  const contextKey = computed(() => `${auth.tenantId}:${auth.branchId}`)
  const permissionCodes = computed(() =>
    new Set(
      auth.roles.flatMap((role) =>
        (role.permissions || []).map((permission) => permission.code),
      ),
    ),
  )
  const isOwner = computed(() => auth.roles.some((role) => role.code === 'owner'))
  const canView = computed(() => isOwner.value || permissionCodes.value.has('user.view'))
  const canCreate = computed(() => isOwner.value || permissionCodes.value.has('user.create'))
  const canUpdate = computed(() => isOwner.value || permissionCodes.value.has('user.update'))
  const canDelete = computed(() => isOwner.value || permissionCodes.value.has('user.delete'))
  const canAssignRole = computed(() =>
    isOwner.value || permissionCodes.value.has('user.assign_role'),
  )
  const activeUsers = computed(() => store.items.filter((user) => user.is_active).length)
  const inactiveUsers = computed(() => store.items.filter((user) => !user.is_active).length)
  const userLimit = computed(() => {
    const feature = auth.subscription?.plan?.features.find((item) => item.slug === 'users.limit')
    const limit = Number(feature?.value)
    return Number.isFinite(limit) && limit > 0 ? limit : null
  })
  const limitReached = computed(() =>
    userLimit.value !== null && store.total >= userLimit.value,
  )
  const filteredUsers = computed(() => {
    const keyword = search.value.trim().toLowerCase()
    return store.items.filter((user) => {
      const matchesKeyword = !keyword || [
        user.name,
        user.email,
        user.phone || '',
        ...(user.roles || []).flatMap((role) => [role.name, role.code]),
        ...(user.branches || []).flatMap((branch) => [branch.name, branch.code]),
      ].some((value) => value.toLowerCase().includes(keyword))
      const matchesStatus =
        statusFilter.value === 'all'
        || (statusFilter.value === 'active' ? user.is_active : !user.is_active)
      return matchesKeyword && matchesStatus
    })
  })
  const roleOptions = computed(() =>
    store.roles.map((role) => ({ label: role.name, value: role.id })),
  )
  const roleBranchOptions = computed(() => [
    { label: 'Semua cabang (global)', value: null as number | null },
    ...branches.items
      .filter((branch) => branch.is_active)
      .map((branch) => ({ label: branch.name, value: branch.id as number | null })),
  ])

  async function initialize(force = false) {
    if (!force && initializedContext.value === contextKey.value) return
    if (!canView.value) {
      initializedContext.value = contextKey.value
      return
    }

    const requests: Promise<unknown>[] = [
      store.fetchAll(),
      store.fetchRoles(),
    ]
    if (auth.hasGlobalBranchAccess) requests.push(branches.fetchAll())
    else branches.useCurrentBranch(auth.session?.branch)

    const results = await Promise.allSettled(requests)
    initializedContext.value = contextKey.value
    const failure = results.find((result) => result.status === 'rejected')
    if (failure?.status === 'rejected') {
      snackbar.error(
        failure.reason instanceof Error
          ? failure.reason.message
          : 'Data manajemen pengguna gagal dimuat.',
      )
    }
  }

  function openCreate() {
    if (!canCreate.value) {
      snackbar.warning('Anda tidak memiliki permission untuk menambah pengguna.')
      return
    }
    if (limitReached.value) {
      snackbar.warning(`Batas ${userLimit.value} pengguna pada paket saat ini sudah tercapai.`)
      return
    }

    editingId.value = null
    Object.assign(form, createUserForm())
    form.branch_ids = auth.activeBranch ? [auth.activeBranch.id] : []
    form.role_branch_id = auth.activeBranch?.id || null
    form.role_id = roleOptions.value[0]?.value || null
    editorOpen.value = true
  }

  async function openEdit(user: AppUser) {
    if (!canUpdate.value) {
      snackbar.warning('Anda tidak memiliki permission untuk memperbarui pengguna.')
      return
    }

    editingId.value = user.id
    Object.assign(form, createUserForm(), {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      is_active: user.is_active,
      branch_ids: (user.branches || []).map((branch) => branch.id),
      role_branch_id: auth.activeBranch?.id || null,
    })
    editorOpen.value = true

    try {
      const detail = await store.fetchDetail(user.id)
      Object.assign(form, {
        name: detail.name,
        email: detail.email,
        phone: detail.phone || '',
        is_active: detail.is_active,
        branch_ids: (detail.branches || []).map((branch) => branch.id),
      })
    } catch {
      // Data list tetap dapat diedit ketika endpoint detail tidak mengembalikan relasi tambahan.
    }
  }

  function closeEditor() {
    if (!store.saving) {
      editorOpen.value = false
      editingId.value = null
    }
  }

  function validateForm() {
    if (!form.name.trim() || !form.email.trim()) {
      snackbar.warning('Nama dan email pengguna wajib diisi.')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      snackbar.warning('Format email pengguna belum valid.')
      return false
    }
    if (!editingId.value && form.password.length < 8) {
      snackbar.warning('Password pengguna minimal 8 karakter.')
      return false
    }
    if (form.password && form.password.length < 8) {
      snackbar.warning('Password baru minimal 8 karakter.')
      return false
    }
    if (form.password !== form.password_confirmation) {
      snackbar.warning('Konfirmasi password tidak sama.')
      return false
    }
    if (!form.branch_ids.length) {
      snackbar.warning('Pilih minimal satu cabang untuk pengguna.')
      return false
    }
    return true
  }

  async function submit() {
    if (!validateForm()) return

    let savedUser: AppUser | null = null
    let userSaved = false
    const wasEditing = Boolean(editingId.value)

    try {
      if (editingId.value) {
        const payload: UserUpdatePayload = {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || null,
          is_active: form.is_active,
          branch_ids: [...form.branch_ids],
          ...(form.password
            ? {
                password: form.password,
                password_confirmation: form.password_confirmation,
              }
            : {}),
        }
        savedUser = await store.update(editingId.value, payload)
      } else {
        const payload: UserCreatePayload = {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || null,
          password: form.password,
          password_confirmation: form.password_confirmation,
          is_active: form.is_active,
          branch_ids: [...form.branch_ids],
        }
        savedUser = await store.create(payload)
      }
      userSaved = true

      if (form.role_id && canAssignRole.value) {
        await store.assignRole(savedUser.id, {
          role_id: form.role_id,
          branch_id: form.role_branch_id,
        })
      }

      closeEditor()
      await store.fetchAll()
      snackbar.success(`Pengguna berhasil ${wasEditing ? 'diperbarui' : 'ditambahkan'}.`)
    } catch (err) {
      const message = err instanceof Error ? err.message : store.error
      snackbar.error(
        userSaved
          ? `Data pengguna sudah tersimpan, tetapi role gagal ditetapkan. ${message}`
          : message,
      )
      if (userSaved) await store.fetchAll().catch(() => undefined)
    }
  }

  function toggleBranch(branchId: number, selected: boolean) {
    if (selected && !form.branch_ids.includes(branchId)) form.branch_ids.push(branchId)
    if (!selected) {
      const index = form.branch_ids.indexOf(branchId)
      if (index >= 0) form.branch_ids.splice(index, 1)
    }
  }

  function requestDelete(user: AppUser) {
    if (!canDelete.value) {
      snackbar.warning('Anda tidak memiliki permission untuk menghapus pengguna.')
      return
    }
    if (user.id === auth.session?.user.id) {
      snackbar.warning('Akun yang sedang digunakan tidak dapat dihapus.')
      return
    }
    deleteTarget.value = user
  }

  function cancelDelete() {
    if (!store.deleting) deleteTarget.value = null
  }

  async function confirmDelete() {
    const target = deleteTarget.value
    if (!target) return
    try {
      await store.deleteUser(target.id)
      deleteTarget.value = null
      await store.fetchAll()
      snackbar.success(`Pengguna “${target.name}” berhasil dihapus.`)
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function initials(name: string) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || '?'
  }

  function roleLabel(user: AppUser) {
    return user.roles?.length
      ? user.roles.map((role) => role.name).join(', ')
      : 'Belum memiliki role'
  }

  function branchLabel(user: AppUser) {
    if (user.branches?.length) return user.branches.map((branch) => branch.name).join(', ')
    const roleBranchIds = (user.roles || [])
      .map((role) => role.pivot?.branch_id)
      .filter((id): id is number => typeof id === 'number')
    if (!roleBranchIds.length && user.roles?.some((role) => role.pivot?.branch_id === null)) {
      return 'Semua cabang'
    }
    return branches.items
      .filter((branch) => roleBranchIds.includes(branch.id))
      .map((branch) => branch.name)
      .join(', ') || 'Belum ditetapkan'
  }

  function formatDate(value?: string | null) {
    if (!value) return 'Belum pernah'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  function resetFilters() {
    search.value = ''
    statusFilter.value = 'all'
  }

  watch(contextKey, (nextContext, previousContext) => {
    if (nextContext !== previousContext && initializedContext.value) {
      store.reset()
      initialize(true).catch(() => undefined)
    }
  })

  return reactive({
    auth,
    store,
    branches,
    search,
    statusFilter,
    editorOpen,
    editingId,
    deleteTarget,
    form,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    canAssignRole,
    activeUsers,
    inactiveUsers,
    userLimit,
    limitReached,
    filteredUsers,
    roleOptions,
    roleBranchOptions,
    initialize,
    openCreate,
    openEdit,
    closeEditor,
    submit,
    toggleBranch,
    requestDelete,
    cancelDelete,
    confirmDelete,
    initials,
    roleLabel,
    branchLabel,
    formatDate,
    resetFilters,
  })
}

export type UserPresenter = ReturnType<typeof useUserPresenter>

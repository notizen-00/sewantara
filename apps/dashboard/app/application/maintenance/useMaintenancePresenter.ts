import type {
  MaintenanceCompletePayload,
  MaintenanceRecord,
  MaintenanceType,
  MaintenanceUnitStatus,
} from '~/domain/maintenance'
import {
  MAINTENANCE_TYPE_OPTIONS,
  MAINTENANCE_UNIT_STATUS_OPTIONS,
  MAINTENANCE_TYPE_LABELS,
} from '~/domain/maintenance'

interface ScheduleFormState {
  product_unit_id: number | null
  type: MaintenanceType
  title: string
  description: string
  vendor: string
  cost: string
  scheduled_at: string
}

interface CompleteFormState {
  unit_status: MaintenanceUnitStatus
  condition: string
  current_meter: string
  cost: string
  description: string
}

function createScheduleForm(): ScheduleFormState {
  return {
    product_unit_id: null,
    type: 'service',
    title: '',
    description: '',
    vendor: '',
    cost: '',
    scheduled_at: '',
  }
}

function createCompleteForm(): CompleteFormState {
  return {
    unit_status: 'available',
    condition: '',
    current_meter: '',
    cost: '',
    description: '',
  }
}

function normalizeStatus(status: string) {
  return (status || '').trim().toLowerCase().replace(/[\s-]+/g, '_')
}

export function useMaintenancePresenter() {
  const auth = useAuthStore()
  const store = useMaintenanceStore()
  const inventory = useInventoryStore()
  const snackbar = useSnackbarStore()
  const createOpen = ref(false)
  const completeTarget = ref<MaintenanceRecord | null>(null)
  const cancelTarget = ref<MaintenanceRecord | null>(null)
  const search = ref('')
  const statusFilter = ref('')
  const typeFilter = ref('')
  const initializedContext = ref('')
  const form = reactive<ScheduleFormState>(createScheduleForm())
  const completeForm = reactive<CompleteFormState>(createCompleteForm())

  const contextKey = computed(() => `${auth.tenantId}:${auth.branchId}`)
  const typeOptions = MAINTENANCE_TYPE_OPTIONS
  const unitStatusOptions = MAINTENANCE_UNIT_STATUS_OPTIONS
  const unitOptions = computed(() => [
    { label: 'Pilih unit', value: null as number | null },
    ...inventory.units
      .filter((unit) => !['maintenance', 'inactive', 'lost'].includes(unit.status))
      .map((unit) => ({
        label: `${unit.product?.name || `Produk #${unit.product_id}`} · ${unit.unit_code}`,
        value: unit.id as number | null,
      })),
  ])
  const statusOptions = computed(() => {
    const statuses = Array.from(new Set(store.items.map((record) => normalizeStatus(record.status))))
    return [
      { label: 'Semua status', value: '' },
      ...statuses.map((status) => ({ label: statusLabel(status), value: status })),
    ]
  })
  const typeFilterOptions = computed(() => [{ label: 'Semua jenis', value: '' }, ...typeOptions])

  const filteredRecords = computed(() => {
    const keyword = search.value.trim().toLowerCase()
    return store.items.filter((record) => {
      const unitCode = record.product_unit?.unit_code || ''
      const productName = record.product_unit?.product?.name || ''
      const searchable = `${record.title} ${unitCode} ${productName} ${record.vendor || ''}`.toLowerCase()
      const matchesSearch = !keyword || searchable.includes(keyword)
      const matchesStatus = !statusFilter.value || normalizeStatus(record.status) === statusFilter.value
      const matchesType = !typeFilter.value || record.type === typeFilter.value
      return matchesSearch && matchesStatus && matchesType
    })
  })
  const scheduledCount = computed(() =>
    store.items.filter((record) => normalizeStatus(record.status) === 'scheduled').length,
  )
  const inProgressCount = computed(() =>
    store.items.filter((record) => normalizeStatus(record.status) === 'in_progress').length,
  )
  const completedCount = computed(() =>
    store.items.filter((record) => normalizeStatus(record.status) === 'completed').length,
  )

  async function initialize(force = false) {
    if (!force && initializedContext.value === contextKey.value) return

    const results = await Promise.allSettled([
      store.fetchAll(),
      inventory.fetchUnits({ per_page: 100 }),
    ])
    initializedContext.value = contextKey.value

    const failure = results.find((result) => result.status === 'rejected')
    if (failure?.status === 'rejected') {
      snackbar.error(failure.reason instanceof Error ? failure.reason.message : 'Data pemeliharaan gagal dimuat.')
    }
  }

  async function fetchAll(showError = true) {
    try {
      await store.fetchAll()
    } catch (err) {
      if (showError) snackbar.error(err instanceof Error ? err.message : store.error)
      else throw err
    }
  }

  function openCreate() {
    Object.assign(form, createScheduleForm())
    createOpen.value = true

    if (!unitOptions.value.length || unitOptions.value.length === 1) {
      snackbar.warning('Belum ada unit produk yang tersedia untuk dijadwalkan.')
    }
  }

  function closeCreate() {
    if (!store.creating) createOpen.value = false
  }

  async function submit() {
    if (!form.product_unit_id) {
      snackbar.warning('Pilih unit produk terlebih dahulu.')
      return
    }
    if (!form.title.trim()) {
      snackbar.warning('Judul pemeliharaan wajib diisi.')
      return
    }
    if (form.cost && (!Number.isFinite(Number(form.cost)) || Number(form.cost) < 0)) {
      snackbar.warning('Estimasi biaya tidak valid.')
      return
    }

    try {
      const record = await store.create({
        product_unit_id: form.product_unit_id,
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim() || null,
        vendor: form.vendor.trim() || null,
        cost: form.cost ? Number(form.cost) : null,
        scheduled_at: form.scheduled_at || null,
      })
      createOpen.value = false
      snackbar.success(`${record.title} berhasil dijadwalkan.`)
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  async function startMaintenance(record: MaintenanceRecord) {
    try {
      await store.start(record.id)
      snackbar.success(`${record.title} dimulai. Unit tidak dapat dipesan sementara.`)
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function openComplete(record: MaintenanceRecord) {
    Object.assign(completeForm, createCompleteForm())
    completeForm.cost = record.cost ? String(record.cost) : ''
    completeForm.description = record.description || ''
    completeTarget.value = record
  }

  function closeComplete() {
    if (store.updatingId !== completeTarget.value?.id) completeTarget.value = null
  }

  async function submitComplete() {
    if (!completeTarget.value) return
    if (completeForm.cost && (!Number.isFinite(Number(completeForm.cost)) || Number(completeForm.cost) < 0)) {
      snackbar.warning('Biaya tidak valid.')
      return
    }
    if (completeForm.current_meter && (!Number.isFinite(Number(completeForm.current_meter)) || Number(completeForm.current_meter) < 0)) {
      snackbar.warning('Meter saat ini tidak valid.')
      return
    }

    const payload: MaintenanceCompletePayload = {
      unit_status: completeForm.unit_status,
      condition: completeForm.condition.trim() || undefined,
      current_meter: completeForm.current_meter ? Number(completeForm.current_meter) : undefined,
      cost: completeForm.cost ? Number(completeForm.cost) : undefined,
      description: completeForm.description.trim() || undefined,
    }

    try {
      const record = await store.complete(completeTarget.value.id, payload)
      completeTarget.value = null
      snackbar.success(`${record.title} berhasil diselesaikan.`)
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function requestCancel(record: MaintenanceRecord) {
    cancelTarget.value = record
  }

  function closeCancel() {
    if (store.updatingId !== cancelTarget.value?.id) cancelTarget.value = null
  }

  async function confirmCancel() {
    if (!cancelTarget.value) return
    try {
      const record = await store.cancel(cancelTarget.value.id, null)
      cancelTarget.value = null
      snackbar.success(`${record.title} dibatalkan.`)
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function resetFilters() {
    search.value = ''
    statusFilter.value = ''
    typeFilter.value = ''
  }

  function unitLabel(record: MaintenanceRecord) {
    const unit = record.product_unit
    if (!unit) return `Unit #${record.product_unit_id}`
    return `${unit.product?.name || 'Produk'} · ${unit.unit_code}`
  }

  function typeLabel(type: string) {
    return MAINTENANCE_TYPE_LABELS[type as MaintenanceType] || type
  }

  function statusLabel(status: string) {
    const normalized = normalizeStatus(status)
    const labels: Record<string, string> = {
      scheduled: 'Terjadwal',
      in_progress: 'Berlangsung',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    }
    return labels[normalized] || normalized.replace(/_/g, ' ')
  }

  function statusTone(status: string): 'success' | 'danger' | 'info' | 'warning' {
    const normalized = normalizeStatus(status)
    if (normalized === 'completed') return 'success'
    if (normalized === 'cancelled') return 'danger'
    if (normalized === 'in_progress') return 'info'
    return 'warning'
  }

  function formatDate(value?: string | null) {
    if (!value) return null
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

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
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
    inventory,
    createOpen,
    completeTarget,
    cancelTarget,
    search,
    statusFilter,
    typeFilter,
    form,
    completeForm,
    typeOptions,
    unitStatusOptions,
    unitOptions,
    statusOptions,
    typeFilterOptions,
    filteredRecords,
    scheduledCount,
    inProgressCount,
    completedCount,
    initialize,
    fetchAll,
    openCreate,
    closeCreate,
    submit,
    startMaintenance,
    openComplete,
    closeComplete,
    submitComplete,
    requestCancel,
    closeCancel,
    confirmCancel,
    resetFilters,
    unitLabel,
    typeLabel,
    statusLabel,
    statusTone,
    formatDate,
    formatCurrency,
  })
}

export type MaintenancePresenter = ReturnType<typeof useMaintenancePresenter>

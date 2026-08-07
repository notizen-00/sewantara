import type {
  InventoryStock,
  ProductUnit,
  ProductUnitCreatePayload,
  StockAdjustmentPayload,
} from '~/domain/inventory'

type InventoryTab = 'units' | 'stocks'
type InventoryEditor = 'unit' | 'adjustment'

interface UnitFormState {
  product_id: number | null
  unit_code: string
  barcode: string
  qr_code: string
  serial_number: string
  condition: string
  purchase_date: string
  purchase_price: number
  current_meter: number
  meter_unit: string
  notes: string
}

interface AdjustmentFormState {
  product_id: number | null
  quantity: number
  notes: string
}

function createUnitForm(): UnitFormState {
  return {
    product_id: null,
    unit_code: '',
    barcode: '',
    qr_code: '',
    serial_number: '',
    condition: 'good',
    purchase_date: '',
    purchase_price: 0,
    current_meter: 0,
    meter_unit: '',
    notes: '',
  }
}

function createAdjustmentForm(): AdjustmentFormState {
  return {
    product_id: null,
    quantity: 1,
    notes: '',
  }
}

function normalizedStatus(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]+/g, '_')
}

export function useInventoryPresenter() {
  const auth = useAuthStore()
  const store = useInventoryStore()
  const products = useProductStore()
  const snackbar = useSnackbarStore()
  const activeTab = ref<InventoryTab>('units')
  const editor = ref<InventoryEditor | null>(null)
  const initializedContext = ref('')
  const unitSearch = ref('')
  const stockSearch = ref('')
  const unitProductFilter = ref<number | null>(null)
  const unitStatusFilter = ref('')
  const stockProductFilter = ref<number | null>(null)
  const unitForm = reactive<UnitFormState>(createUnitForm())
  const adjustmentForm = reactive<AdjustmentFormState>(createAdjustmentForm())
  let filterTimer: ReturnType<typeof setTimeout> | null = null

  const contextKey = computed(() => `${auth.tenantId}:${auth.branchId}`)
  const editorOpen = computed(() => Boolean(editor.value))
  const serializedProducts = computed(() =>
    products.products.filter((product) => product.is_active && product.inventory_type === 'serialized'),
  )
  const quantityProducts = computed(() =>
    products.products.filter((product) => product.is_active && product.inventory_type === 'quantity'),
  )
  const serializedProductOptions = computed(() =>
    serializedProducts.value.map((product) => ({
      label: `${product.name} · ${product.sku}`,
      value: product.id,
    })),
  )
  const quantityProductOptions = computed(() =>
    quantityProducts.value.map((product) => ({
      label: `${product.name} · ${product.sku}`,
      value: product.id,
    })),
  )
  const unitProductFilterOptions = computed(() => [
    { label: 'Semua produk serialized', value: null as number | null },
    ...serializedProductOptions.value.map((option) => ({
      label: option.label,
      value: option.value as number | null,
    })),
  ])
  const stockProductFilterOptions = computed(() => [
    { label: 'Semua produk quantity', value: null as number | null },
    ...quantityProductOptions.value.map((option) => ({
      label: option.label,
      value: option.value as number | null,
    })),
  ])
  const unitStatusOptions = computed(() => {
    const statuses = Array.from(new Set(store.units.map((unit) => normalizedStatus(unit.status)))).sort()
    return [
      { label: 'Semua status', value: '' },
      ...statuses.map((status) => ({ label: statusLabel(status), value: status })),
    ]
  })
  const filteredUnits = computed(() => {
    const keyword = unitSearch.value.trim().toLowerCase()
    if (!keyword) return store.units
    return store.units.filter((unit) =>
      [
        unit.unit_code,
        unit.barcode || '',
        unit.qr_code || '',
        unit.serial_number || '',
        unit.product?.name || productName(unit.product_id),
      ].some((value) => value.toLowerCase().includes(keyword)),
    )
  })
  const filteredStocks = computed(() => {
    const keyword = stockSearch.value.trim().toLowerCase()
    return store.stocks.filter((stock) => {
      const matchesProduct = !stockProductFilter.value || stock.product_id === stockProductFilter.value
      const searchable = `${stock.product?.name || productName(stock.product_id)} ${stock.product?.sku || productSku(stock.product_id)}`.toLowerCase()
      return matchesProduct && (!keyword || searchable.includes(keyword))
    })
  })
  const availableUnitCount = computed(() =>
    store.units.filter((unit) => normalizedStatus(unit.status) === 'available').length,
  )
  const stockTotal = computed(() =>
    store.stocks.reduce((total, stock) => total + totalQuantity(stock), 0),
  )
  const stockAvailable = computed(() =>
    store.stocks.reduce((total, stock) => total + availableQuantity(stock), 0),
  )

  async function fetchUnits(showError = true) {
    try {
      await store.fetchUnits({
        product_id: unitProductFilter.value,
        status: unitStatusFilter.value || undefined,
        per_page: 100,
      })
    } catch (err) {
      if (showError) snackbar.error(err instanceof Error ? err.message : store.error)
      else throw err
    }
  }

  async function fetchStocks(showError = true) {
    try {
      await store.fetchStocks()
    } catch (err) {
      if (showError) snackbar.error(err instanceof Error ? err.message : store.error)
      else throw err
    }
  }

  async function initialize(force = false) {
    if (!force && initializedContext.value === contextKey.value) return

    const results = await Promise.allSettled([
      products.fetchProducts({ is_active: true, per_page: 100 }),
      fetchUnits(false),
      fetchStocks(false),
    ])
    initializedContext.value = contextKey.value
    const failures = results.filter((result) => result.status === 'rejected')
    if (failures.length) {
      const reason = failures[0]?.status === 'rejected' ? failures[0].reason : null
      snackbar.error(reason instanceof Error ? reason.message : 'Data inventory belum dapat dimuat lengkap.')
    }
  }

  function setActiveTab(tab: InventoryTab) {
    activeTab.value = tab
  }

  function openUnitCreate() {
    if (!serializedProductOptions.value.length) {
      snackbar.warning('Buat produk aktif bertipe serialized terlebih dahulu.')
      return
    }
    Object.assign(unitForm, createUnitForm())
    unitForm.product_id = serializedProductOptions.value[0]?.value || null
    editor.value = 'unit'
  }

  function openAdjustment(productId?: number) {
    if (!quantityProductOptions.value.length) {
      snackbar.warning('Buat produk aktif bertipe quantity terlebih dahulu.')
      return
    }
    Object.assign(adjustmentForm, createAdjustmentForm())
    adjustmentForm.product_id = productId || quantityProductOptions.value[0]?.value || null
    editor.value = 'adjustment'
  }

  function closeEditor() {
    if (!store.creatingUnit && !store.adjustingStock) editor.value = null
  }

  async function submitUnit() {
    if (!unitForm.product_id || !unitForm.unit_code.trim() || !unitForm.condition.trim()) {
      snackbar.warning('Produk, kode unit, dan kondisi wajib diisi.')
      return
    }
    if (unitForm.purchase_price < 0 || unitForm.current_meter < 0) {
      snackbar.warning('Harga pembelian dan meter awal tidak boleh negatif.')
      return
    }

    const payload: ProductUnitCreatePayload = {
      product_id: unitForm.product_id,
      unit_code: unitForm.unit_code.trim(),
      barcode: unitForm.barcode.trim() || null,
      qr_code: unitForm.qr_code.trim() || null,
      serial_number: unitForm.serial_number.trim() || null,
      status: 'available',
      condition: unitForm.condition.trim(),
      purchase_date: unitForm.purchase_date || null,
      purchase_price: Number(unitForm.purchase_price || 0),
      current_meter: Number(unitForm.current_meter || 0),
      meter_unit: unitForm.meter_unit.trim() || null,
      notes: unitForm.notes.trim() || null,
    }

    try {
      await store.createUnit(payload)
      editor.value = null
      snackbar.success(`Unit ${payload.unit_code} berhasil ditambahkan.`)
      try {
        await fetchUnits(false)
      } catch {
        snackbar.warning('Unit sudah tersimpan, tetapi daftar terbaru belum dapat dimuat.')
      }
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  async function submitAdjustment() {
    const quantity = Number(adjustmentForm.quantity)
    if (!adjustmentForm.product_id || !Number.isInteger(quantity) || quantity === 0) {
      snackbar.warning('Pilih produk dan masukkan perubahan stok berupa bilangan selain nol.')
      return
    }
    if (!adjustmentForm.notes.trim()) {
      snackbar.warning('Catatan adjustment wajib diisi agar riwayat stok mudah diaudit.')
      return
    }

    const payload: StockAdjustmentPayload = {
      product_id: adjustmentForm.product_id,
      quantity,
      notes: adjustmentForm.notes.trim(),
    }

    try {
      await store.adjustStock(payload)
      editor.value = null
      snackbar.success(
        `${Math.abs(quantity)} stok berhasil ${quantity > 0 ? 'ditambahkan' : 'dikurangi'}.`,
        'Stok diperbarui',
      )
      try {
        await fetchStocks(false)
      } catch {
        snackbar.warning('Adjustment sudah tersimpan, tetapi saldo terbaru belum dapat dimuat.')
      }
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function resetUnitFilters() {
    unitSearch.value = ''
    unitProductFilter.value = null
    unitStatusFilter.value = ''
  }

  function resetStockFilters() {
    stockSearch.value = ''
    stockProductFilter.value = null
  }

  function productName(productId: number) {
    return products.products.find((product) => product.id === productId)?.name || `Produk #${productId}`
  }

  function productSku(productId: number) {
    return products.products.find((product) => product.id === productId)?.sku || '-'
  }

  function numberFrom(stock: InventoryStock, keys: string[]) {
    for (const key of keys) {
      const value = stock[key]
      if (value !== null && value !== undefined && value !== '') return Number(value) || 0
    }
    return 0
  }

  function totalQuantity(stock: InventoryStock) {
    return numberFrom(stock, ['quantity_total', 'total_quantity', 'quantity'])
  }

  function availableQuantity(stock: InventoryStock) {
    const explicit = numberFrom(stock, ['quantity_available', 'available_quantity'])
    if ('quantity_available' in stock || 'available_quantity' in stock) return explicit
    return Math.max(0, totalQuantity(stock) - committedQuantity(stock))
  }

  function committedQuantity(stock: InventoryStock) {
    return (
      numberFrom(stock, ['quantity_reserved', 'reserved_quantity'])
      + numberFrom(stock, ['quantity_rented', 'rented_quantity'])
      + numberFrom(stock, ['quantity_maintenance', 'maintenance_quantity'])
      + numberFrom(stock, ['quantity_damaged', 'damaged_quantity'])
      + numberFrom(stock, ['quantity_lost', 'lost_quantity'])
    )
  }

  function statusLabel(status: string) {
    const labels: Record<string, string> = {
      available: 'Tersedia',
      reserved: 'Dipesan',
      rented: 'Disewa',
      maintenance: 'Maintenance',
      damaged: 'Rusak',
      lost: 'Hilang',
    }
    const normalized = normalizedStatus(status)
    return labels[normalized] || normalized.replace(/_/g, ' ')
  }

  function statusTone(status: string): 'success' | 'danger' | 'info' | 'warning' {
    const normalized = normalizedStatus(status)
    if (normalized === 'available') return 'success'
    if (['damaged', 'lost'].includes(normalized)) return 'danger'
    if (['rented', 'reserved'].includes(normalized)) return 'info'
    return 'warning'
  }

  function formatCurrency(value?: number | string | null) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value || 0))
  }

  function formatDate(value?: string | null) {
    if (!value) return 'Tidak dicatat'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  watch(
    () => [unitProductFilter.value, unitStatusFilter.value],
    () => {
      if (!initializedContext.value) return
      if (filterTimer) clearTimeout(filterTimer)
      filterTimer = setTimeout(() => fetchUnits(), 250)
    },
  )

  watch(contextKey, (nextContext, previousContext) => {
    if (nextContext !== previousContext && initializedContext.value) {
      store.reset()
      initialize(true).catch(() => undefined)
    }
  })

  onScopeDispose(() => {
    if (filterTimer) clearTimeout(filterTimer)
  })

  return reactive({
    auth,
    store,
    products,
    activeTab,
    editor,
    editorOpen,
    unitSearch,
    stockSearch,
    unitProductFilter,
    unitStatusFilter,
    stockProductFilter,
    unitForm,
    adjustmentForm,
    serializedProductOptions,
    quantityProductOptions,
    unitProductFilterOptions,
    stockProductFilterOptions,
    unitStatusOptions,
    filteredUnits,
    filteredStocks,
    availableUnitCount,
    stockTotal,
    stockAvailable,
    initialize,
    fetchUnits,
    fetchStocks,
    setActiveTab,
    openUnitCreate,
    openAdjustment,
    closeEditor,
    submitUnit,
    submitAdjustment,
    resetUnitFilters,
    resetStockFilters,
    productName,
    productSku,
    totalQuantity,
    availableQuantity,
    committedQuantity,
    statusLabel,
    statusTone,
    formatCurrency,
    formatDate,
  })
}

export type InventoryPresenter = ReturnType<typeof useInventoryPresenter>

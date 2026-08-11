import type { PricingType } from '~/domain/mitra'
import type { ProductPrice, ProductPricePayload } from '~/domain/pricing'
import { PRICING_TYPE_OPTIONS, pricingTypeLabel } from '~/domain/pricing'

interface PriceFormState {
  product_id: number | null
  pricing_type: PricingType
  duration: number
  price: number | null
  start_at: string
  end_at: string
  is_active: boolean
}

function createPriceForm(): PriceFormState {
  return {
    product_id: null,
    pricing_type: 'daily',
    duration: 1,
    price: null,
    start_at: '',
    end_at: '',
    is_active: true,
  }
}

export function usePricingPresenter() {
  const auth = useAuthStore()
  const pricing = usePricingStore()
  const products = useProductStore()
  const snackbar = useSnackbarStore()
  const createOpen = ref(false)
  const editingId = ref<number | null>(null)
  const search = ref('')
  const productFilter = ref<number | null>(null)
  const initializedContext = ref('')
  const form = reactive<PriceFormState>(createPriceForm())

  const contextKey = computed(() => `${auth.tenantId}:${auth.branchId}`)
  const pricingTypeOptions = PRICING_TYPE_OPTIONS
  const productOptions = computed(() => [
    { label: 'Pilih produk', value: null as number | null },
    ...products.products
      .filter((product) => product.is_active)
      .map((product) => ({ label: `${product.name} · ${product.sku}`, value: product.id as number | null })),
  ])
  const productFilterOptions = computed(() => [
    { label: 'Semua produk', value: null as number | null },
    ...products.products.map((product) => ({ label: product.name, value: product.id as number | null })),
  ])

  const filteredPrices = computed(() => {
    const keyword = search.value.trim().toLowerCase()
    return pricing.prices.filter((price) => {
      const matchesProduct = !productFilter.value || price.product_id === productFilter.value
      const name = productName(price).toLowerCase()
      const matchesSearch = !keyword || name.includes(keyword)
      return matchesProduct && matchesSearch
    })
  })
  const activeCount = computed(() => pricing.prices.filter((price) => price.is_active).length)
  const productsWithoutPriceCount = computed(() => {
    const pricedProductIds = new Set(pricing.prices.map((price) => price.product_id))
    return products.products.filter((product) => product.is_active && !pricedProductIds.has(product.id)).length
  })

  async function initialize(force = false) {
    if (!force && initializedContext.value === contextKey.value) return

    const results = await Promise.allSettled([
      pricing.fetchPrices(),
      products.fetchProducts({ is_active: true, per_page: 100 }),
    ])
    initializedContext.value = contextKey.value

    const failure = results.find((result) => result.status === 'rejected')
    if (failure?.status === 'rejected') {
      snackbar.error(failure.reason instanceof Error ? failure.reason.message : 'Data harga gagal dimuat.')
    }
  }

  async function fetchAll(showError = true) {
    try {
      await pricing.fetchPrices()
    } catch (err) {
      if (showError) snackbar.error(err instanceof Error ? err.message : pricing.error)
      else throw err
    }
  }

  function openCreate() {
    Object.assign(form, createPriceForm())
    if (productFilter.value) form.product_id = productFilter.value
    editingId.value = null
    createOpen.value = true

    if (!products.products.filter((product) => product.is_active).length) {
      snackbar.warning('Belum ada produk aktif. Tambahkan produk terlebih dahulu.')
    }
  }

  function openEdit(price: ProductPrice) {
    Object.assign(form, {
      product_id: price.product_id,
      pricing_type: price.pricing_type,
      duration: price.duration,
      price: Number(price.price),
      start_at: price.start_at ? price.start_at.slice(0, 10) : '',
      end_at: price.end_at ? price.end_at.slice(0, 10) : '',
      is_active: price.is_active,
    })
    editingId.value = price.id
    createOpen.value = true
  }

  function closeCreate() {
    if (!pricing.saving) createOpen.value = false
  }

  function toPayload(): ProductPricePayload | null {
    if (!form.product_id) {
      snackbar.warning('Pilih produk terlebih dahulu.')
      return null
    }
    if (!Number.isInteger(Number(form.duration)) || Number(form.duration) < 1) {
      snackbar.warning('Durasi minimal 1.')
      return null
    }
    if (form.price === null || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      snackbar.warning('Harga harus diisi dan tidak boleh negatif.')
      return null
    }
    if (form.start_at && form.end_at && form.end_at <= form.start_at) {
      snackbar.warning('Tanggal berakhir harus setelah tanggal mulai.')
      return null
    }

    return {
      product_id: form.product_id,
      pricing_type: form.pricing_type,
      duration: Number(form.duration),
      price: Number(form.price),
      start_at: form.start_at || null,
      end_at: form.end_at || null,
      is_active: form.is_active,
    }
  }

  async function submit() {
    const payload = toPayload()
    if (!payload) return

    try {
      await pricing.savePrice(payload, editingId.value || undefined)
      createOpen.value = false
      snackbar.success(editingId.value ? 'Harga produk berhasil diperbarui.' : 'Harga produk berhasil ditambahkan.')
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : pricing.error)
    }
  }

  async function toggleActive(price: ProductPrice) {
    try {
      await pricing.savePrice({
        product_id: price.product_id,
        pricing_type: price.pricing_type,
        duration: price.duration,
        price: Number(price.price),
        start_at: price.start_at || null,
        end_at: price.end_at || null,
        is_active: !price.is_active,
      }, price.id)
      snackbar.success(price.is_active ? 'Harga dinonaktifkan.' : 'Harga diaktifkan.')
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : pricing.error)
    }
  }

  async function removePrice(price: ProductPrice) {
    try {
      await pricing.deletePrice(price.id)
      snackbar.success('Harga produk berhasil dihapus.')
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : pricing.error)
    }
  }

  function productName(price: ProductPrice) {
    return price.product?.name || products.products.find((product) => product.id === price.product_id)?.name || `Produk #${price.product_id}`
  }

  function productSku(price: ProductPrice) {
    return price.product?.sku || products.products.find((product) => product.id === price.product_id)?.sku || ''
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  function formatDate(value?: string | null) {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
  }

  function durationLabel(price: ProductPrice) {
    const unit = pricingTypeLabel(price.pricing_type).replace(/^Per /, '').toLowerCase()
    return price.duration > 1 ? `${price.duration} ${unit}` : pricingTypeLabel(price.pricing_type)
  }

  function resetFilters() {
    search.value = ''
    productFilter.value = null
  }

  watch(contextKey, (nextContext, previousContext) => {
    if (nextContext !== previousContext && initializedContext.value) {
      pricing.reset()
      initialize(true).catch(() => undefined)
    }
  })

  return reactive({
    auth,
    pricing,
    products,
    createOpen,
    editingId,
    search,
    productFilter,
    form,
    pricingTypeOptions,
    productOptions,
    productFilterOptions,
    filteredPrices,
    activeCount,
    productsWithoutPriceCount,
    initialize,
    fetchAll,
    openCreate,
    openEdit,
    closeCreate,
    submit,
    toggleActive,
    removePrice,
    productName,
    productSku,
    formatCurrency,
    formatDate,
    durationLabel,
    pricingTypeLabel,
    resetFilters,
  })
}

export type PricingPresenter = ReturnType<typeof usePricingPresenter>

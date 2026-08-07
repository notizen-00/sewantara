import type { EngineCode, InventoryType, PricingType, ProductType } from '~/domain/mitra'
import { ENGINE_LABELS, PRODUCT_TYPE_LABELS, PRODUCT_TYPES_BY_ENGINE } from '~/domain/mitra'
import type {
  CategoryPayload,
  Product,
  ProductCategory,
  ProductImage,
  ProductPayload,
} from '~/domain/product'

type ProductTab = 'products' | 'categories'
type EditorType = 'product' | 'category'

interface ProductFormState {
  category_id: number | null
  name: string
  slug: string
  sku: string
  brand: string
  model: string
  description: string
  engine_code: EngineCode
  product_type: ProductType
  inventory_type: InventoryType
  default_pricing_type: PricingType
  minimum_rental_duration: number
  deposit_amount: number
  late_fee_amount: number
  is_featured: boolean
  is_active: boolean
}

interface CategoryFormState {
  parent_id: number | null
  name: string
  slug: string
  description: string
  sort_order: number
  is_active: boolean
}

interface DeleteTarget {
  type: EditorType
  id: number
  name: string
}

function createProductForm(): ProductFormState {
  return {
    category_id: null,
    name: '',
    slug: '',
    sku: '',
    brand: '',
    model: '',
    description: '',
    engine_code: 'rental',
    product_type: 'equipment',
    inventory_type: 'serialized',
    default_pricing_type: 'daily',
    minimum_rental_duration: 1,
    deposit_amount: 0,
    late_fee_amount: 0,
    is_featured: false,
    is_active: true,
  }
}

function createCategoryForm(): CategoryFormState {
  return {
    parent_id: null,
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true,
  }
}

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function useProductPresenter() {
  const auth = useAuthStore()
  const store = useProductStore()
  const engines = useEngineStore()
  const snackbar = useSnackbarStore()
  const activeTab = ref<ProductTab>('products')
  const editor = ref<EditorType | null>(null)
  const editingId = ref<number | null>(null)
  const deleteTarget = ref<DeleteTarget | null>(null)
  const initializedContext = ref('')
  const productForm = reactive<ProductFormState>(createProductForm())
  const categoryForm = reactive<CategoryFormState>(createCategoryForm())
  const productImages = ref<ProductImage[]>([])
  const categoryImageUrl = ref<string | null>(null)
  const pendingProductImage = ref<File | null>(null)
  const pendingCategoryImage = ref<File | null>(null)
  const productImageForm = reactive({
    alt_text: '',
    is_primary: false,
    sort_order: 0,
  })
  const filters = reactive({
    search: '',
    categoryId: null as number | null,
    inventoryType: '' as InventoryType | '',
    isActive: '' as boolean | '',
  })
  const categorySearch = ref('')
  let filterTimer: ReturnType<typeof setTimeout> | null = null

  const contextKey = computed(() => `${auth.tenantId}:${auth.branchId}`)
  const editorOpen = computed(() => Boolean(editor.value))
  const editorTitle = computed(() => {
    if (editor.value === 'product') return editingId.value ? 'Edit produk' : 'Tambah produk'
    return editingId.value ? 'Edit kategori' : 'Tambah kategori'
  })
  const activeProducts = computed(() => store.products.filter((product) => product.is_active).length)
  const featuredProducts = computed(() => store.products.filter((product) => product.is_featured).length)
  const serializedProducts = computed(
    () => store.products.filter((product) => product.inventory_type === 'serialized').length,
  )
  const filteredCategories = computed(() => {
    const keyword = categorySearch.value.trim().toLowerCase()
    if (!keyword) return store.categories
    return store.categories.filter((category) =>
      [category.name, category.slug, category.description || ''].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    )
  })
  const categoryOptions = computed(() =>
    store.categories
      .filter((category) => category.is_active)
      .map((category) => ({ label: category.name, value: category.id })),
  )
  const parentCategoryOptions = computed(() => [
    { label: 'Tanpa induk', value: null as number | null },
    ...store.categories
      .filter((category) => category.id !== editingId.value)
      .map((category) => ({ label: category.name, value: category.id as number | null })),
  ])
  const enabledEngineOptions = computed(() => {
    const enabled = engines.catalog.filter((item) => item.is_enabled)
    const codes = enabled.length ? enabled.map((item) => item.code) : (['rental', 'booking'] as EngineCode[])
    return codes.map((code) => ({ label: ENGINE_LABELS[code], value: code }))
  })
  const productTypeOptions = computed(() =>
    PRODUCT_TYPES_BY_ENGINE[productForm.engine_code].map((type) => ({
      label: PRODUCT_TYPE_LABELS[type],
      value: type,
    })),
  )

  watch(
    () => productForm.engine_code,
    () => {
      if (!PRODUCT_TYPES_BY_ENGINE[productForm.engine_code].includes(productForm.product_type)) {
        productForm.product_type = PRODUCT_TYPES_BY_ENGINE[productForm.engine_code][0]
      }
    },
  )

  function productQuery() {
    return {
      search: filters.search.trim() || undefined,
      category_id: filters.categoryId,
      inventory_type: filters.inventoryType,
      is_active: filters.isActive,
      per_page: 50,
    }
  }

  async function fetchProducts(showError = true) {
    try {
      await store.fetchProducts(productQuery())
    } catch (err) {
      if (showError) snackbar.error(err instanceof Error ? err.message : store.error)
      else throw err
    }
  }

  async function fetchCategories(showError = true) {
    try {
      await store.fetchCategories({ per_page: 100 })
    } catch (err) {
      if (showError) snackbar.error(err instanceof Error ? err.message : store.error)
      else throw err
    }
  }

  async function initialize(force = false) {
    if (!force && initializedContext.value === contextKey.value && (store.products.length || store.categories.length)) {
      return
    }

    const results = await Promise.allSettled([fetchCategories(false), fetchProducts(false)])
    if (!engines.catalog.length) engines.fetchCatalog().catch(() => undefined)
    initializedContext.value = contextKey.value

    const failure = results.find((result) => result.status === 'rejected')
    if (failure?.status === 'rejected') {
      snackbar.error(failure.reason instanceof Error ? failure.reason.message : 'Data produk gagal dimuat.')
    }
  }

  function setActiveTab(tab: ProductTab) {
    activeTab.value = tab
  }

  async function openProductEditor(product?: Product) {
    if (!product && !store.categories.some((category) => category.is_active)) {
      snackbar.warning('Tambahkan minimal satu kategori aktif sebelum membuat produk.')
      openCategoryEditor()
      return
    }

    editor.value = 'product'
    editingId.value = product?.id || null
    Object.assign(productForm, createProductForm())
    productImages.value = [...(product?.images || [])]
    pendingProductImage.value = null
    Object.assign(productImageForm, { alt_text: '', is_primary: !productImages.value.length, sort_order: productImages.value.length })

    if (product) {
      Object.assign(productForm, {
        category_id: product.category_id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        brand: product.brand || '',
        model: product.model || '',
        description: product.description || '',
        engine_code: product.engine_code,
        product_type: product.product_type,
        inventory_type: product.inventory_type,
        default_pricing_type: product.default_pricing_type,
        minimum_rental_duration: Number(product.minimum_rental_duration || 1),
        deposit_amount: Number(product.deposit_amount || 0),
        late_fee_amount: Number(product.late_fee_amount || 0),
        is_featured: product.is_featured,
        is_active: product.is_active,
      })
      try {
        const detail = await store.fetchProduct(product.id)
        productImages.value = [...(detail.images || [])]
        productImageForm.is_primary = !productImages.value.length
        productImageForm.sort_order = productImages.value.length
      } catch (err) {
        snackbar.error(err instanceof Error ? err.message : store.error)
      }
    } else {
      productForm.category_id = categoryOptions.value[0]?.value || null
    }
  }

  function openCategoryEditor(category?: ProductCategory) {
    editor.value = 'category'
    editingId.value = category?.id || null
    Object.assign(categoryForm, createCategoryForm())
    categoryImageUrl.value = category?.image_url || null
    pendingCategoryImage.value = null

    if (category) {
      Object.assign(categoryForm, {
        parent_id: category.parent_id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        sort_order: Number(category.sort_order || 0),
        is_active: category.is_active,
      })
    }
  }

  function closeEditor() {
    if (store.saving || store.savingImage) return
    editor.value = null
    editingId.value = null
  }

  function syncProductSlug() {
    if (!editingId.value) productForm.slug = slugify(productForm.name)
  }

  function syncCategorySlug() {
    if (!editingId.value) categoryForm.slug = slugify(categoryForm.name)
  }

  function toProductPayload(): ProductPayload | null {
    if (!productForm.category_id || !productForm.name.trim() || !productForm.slug.trim() || !productForm.sku.trim()) {
      snackbar.warning('Kategori, nama, slug, dan SKU produk wajib diisi.')
      return null
    }

    if (productForm.minimum_rental_duration < 1) {
      snackbar.warning('Durasi rental minimum harus bernilai minimal 1.')
      return null
    }

    if (!PRODUCT_TYPES_BY_ENGINE[productForm.engine_code].includes(productForm.product_type)) {
      snackbar.warning('Jenis produk tidak sesuai dengan jenis layanan yang dipilih.')
      return null
    }

    return {
      category_id: productForm.category_id,
      name: productForm.name.trim(),
      slug: productForm.slug.trim(),
      sku: productForm.sku.trim().toUpperCase(),
      brand: productForm.brand.trim() || null,
      model: productForm.model.trim() || null,
      description: productForm.description.trim() || null,
      engine_code: productForm.engine_code,
      product_type: productForm.product_type,
      inventory_type: productForm.inventory_type,
      default_pricing_type: productForm.default_pricing_type,
      minimum_rental_duration: Number(productForm.minimum_rental_duration),
      deposit_amount: Math.max(0, Number(productForm.deposit_amount || 0)),
      late_fee_amount: Math.max(0, Number(productForm.late_fee_amount || 0)),
      is_featured: productForm.is_featured,
      is_active: productForm.is_active,
    }
  }

  function toCategoryPayload(): CategoryPayload | null {
    if (!categoryForm.name.trim() || !categoryForm.slug.trim()) {
      snackbar.warning('Nama dan slug kategori wajib diisi.')
      return null
    }

    return {
      parent_id: categoryForm.parent_id,
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim(),
      description: categoryForm.description.trim() || null,
      sort_order: Number(categoryForm.sort_order || 0),
      is_active: categoryForm.is_active,
    }
  }

  async function submitEditor() {
    try {
      if (editor.value === 'product') {
        const payload = toProductPayload()
        if (!payload) return
        const wasEditing = Boolean(editingId.value)
        const savedProduct = await store.saveProduct(payload, editingId.value || undefined)
        editingId.value = savedProduct.id
        if (pendingProductImage.value) {
          await store.uploadProductImage(savedProduct.id, pendingProductImage.value, {
            alt_text: productImageForm.alt_text.trim() || null,
            is_primary: productImages.value.length ? productImageForm.is_primary : true,
            sort_order: Math.max(0, Number(productImageForm.sort_order || 0)),
          })
        }
        closeEditor()
        await fetchProducts(false)
        snackbar.success(`Produk berhasil ${wasEditing ? 'diperbarui' : 'ditambahkan'}.`)
      } else if (editor.value === 'category') {
        const payload = toCategoryPayload()
        if (!payload) return
        const wasEditing = Boolean(editingId.value)
        const savedCategory = await store.saveCategory(payload, editingId.value || undefined)
        editingId.value = savedCategory.id
        if (pendingCategoryImage.value) {
          await store.uploadCategoryImage(savedCategory.id, pendingCategoryImage.value)
        }
        closeEditor()
        await Promise.all([fetchCategories(false), fetchProducts(false)])
        snackbar.success(`Kategori berhasil ${wasEditing ? 'diperbarui' : 'ditambahkan'}.`)
      }
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function validateCatalogImage(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      && !['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')
    ) {
      snackbar.warning('Gambar harus berupa JPG, PNG, atau WEBP.')
      return false
    }
    if (file.size > 5 * 1024 * 1024) {
      snackbar.warning('Ukuran gambar maksimal 5 MB.')
      return false
    }
    return true
  }

  function selectProductImage(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    pendingProductImage.value = file && validateCatalogImage(file) ? file : null
    input.value = ''
  }

  function selectCategoryImage(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    pendingCategoryImage.value = file && validateCatalogImage(file) ? file : null
    input.value = ''
  }

  async function refreshEditingProductImages() {
    if (!editingId.value) return
    const detail = await store.fetchProduct(editingId.value)
    productImages.value = [...(detail.images || [])]
  }

  async function makePrimaryImage(image: ProductImage) {
    if (!editingId.value || image.is_primary) return
    try {
      await store.updateProductImage(editingId.value, image.id, { is_primary: true })
      await Promise.all([refreshEditingProductImages(), fetchProducts(false)])
      snackbar.success('Gambar utama produk berhasil diperbarui.')
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  async function deleteProductImage(image: ProductImage) {
    if (!editingId.value) return
    try {
      await store.deleteProductImage(editingId.value, image.id)
      await Promise.all([refreshEditingProductImages(), fetchProducts(false)])
      snackbar.success('Gambar produk berhasil dihapus.')
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  async function deleteCategoryImage() {
    pendingCategoryImage.value = null
    if (!categoryImageUrl.value) return
    if (!editingId.value) {
      categoryImageUrl.value = null
      return
    }
    try {
      await store.deleteCategoryImage(editingId.value)
      categoryImageUrl.value = null
      await fetchCategories(false)
      snackbar.success('Gambar kategori berhasil dihapus.')
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function primaryProductImage(product: Product) {
    const images = [...(product.images || [])]
    images.sort((left, right) =>
      Number(right.is_primary) - Number(left.is_primary)
      || left.sort_order - right.sort_order
      || left.id - right.id,
    )
    return images[0]?.image_url || null
  }

  function requestDelete(type: EditorType, item: Product | ProductCategory) {
    deleteTarget.value = { type, id: item.id, name: item.name }
  }

  function cancelDelete() {
    if (!store.deleting) deleteTarget.value = null
  }

  async function confirmDelete() {
    const target = deleteTarget.value
    if (!target) return

    try {
      if (target.type === 'product') {
        await store.deleteProduct(target.id)
        await fetchProducts(false)
        snackbar.success(`Produk “${target.name}” berhasil dihapus.`)
      } else {
        await store.deleteCategory(target.id)
        await Promise.all([fetchCategories(false), fetchProducts(false)])
        snackbar.success(`Kategori “${target.name}” berhasil dihapus.`)
      }
      deleteTarget.value = null
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function resetFilters() {
    filters.search = ''
    filters.categoryId = null
    filters.inventoryType = ''
    filters.isActive = ''
  }

  function formatCurrency(value: number | string) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value || 0))
  }

  watch(
    () => [filters.search, filters.categoryId, filters.inventoryType, filters.isActive],
    () => {
      if (filterTimer) clearTimeout(filterTimer)
      filterTimer = setTimeout(() => fetchProducts(), 350)
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
    activeTab,
    editor,
    editingId,
    editorOpen,
    editorTitle,
    deleteTarget,
    productForm,
    categoryForm,
    productImages,
    categoryImageUrl,
    pendingProductImage,
    pendingCategoryImage,
    productImageForm,
    filters,
    categorySearch,
    filteredCategories,
    categoryOptions,
    parentCategoryOptions,
    enabledEngineOptions,
    productTypeOptions,
    activeProducts,
    featuredProducts,
    serializedProducts,
    initialize,
    setActiveTab,
    openProductEditor,
    openCategoryEditor,
    closeEditor,
    syncProductSlug,
    syncCategorySlug,
    submitEditor,
    selectProductImage,
    selectCategoryImage,
    makePrimaryImage,
    deleteProductImage,
    deleteCategoryImage,
    primaryProductImage,
    requestDelete,
    cancelDelete,
    confirmDelete,
    resetFilters,
    fetchProducts,
    formatCurrency,
  })
}

export type ProductPresenter = ReturnType<typeof useProductPresenter>

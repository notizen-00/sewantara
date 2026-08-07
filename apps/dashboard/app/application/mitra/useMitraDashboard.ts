import type {
  BookingOnboardingPayload,
  BusinessOnboardingPayload,
  EngineCode,
  PaymentsOnboardingPayload,
  PricingType,
  ProductType,
  RegisterPayload,
  RentalOnboardingPayload,
} from '~/domain/mitra'
import { PRODUCT_TYPES_BY_ENGINE, PRODUCT_TYPE_LABELS } from '~/domain/mitra'
import type { CategoryPayload, ProductPayload } from '~/domain/product'
import type { ProductUnitCreatePayload, StockAdjustmentPayload } from '~/domain/inventory'
import type { ProductPricePayload } from '~/domain/pricing'
import { pricingTypeLabel } from '~/domain/pricing'
import { ApiRequestError } from '~/domain/api'

import { ONBOARDING_STEPS, ONBOARDING_STEP_LABELS, type OnboardingStepKey } from '~/domain/navigation'
import { resolveTenantSite } from '~/domain/tenantSite'

let singleton: MitraDashboardPresenter | null = null

/**
 * The dashboard aggregates state from many Pinia stores plus page-local UI
 * state (forms, wizard step, OTP countdown). It's shared across every route
 * (login/register/onboarding/dashboard) so state survives navigation between
 * them — hence the singleton instead of a fresh instance per call.
 */
export function useMitraDashboard(): MitraDashboardPresenter {
  if (!singleton) singleton = createMitraDashboard()
  return singleton
}

function createMitraDashboard() {
  const catalog = useCatalogStore()
  const auth = useAuthStore()
  const billing = useBillingStore()
  const branches = useBranchStore()
  const onboarding = useOnboardingStore()
  const operations = useOperationsStore()
  const settings = useSettingsStore()
  const products = useProductStore()
  const bookings = useBookingStore()
  const inventory = useInventoryStore()
  const pricing = usePricingStore()
  const users = useUserStore()

  const activeAuthTab = ref<'login' | 'register'>('login')
  const registrationBillingChoice = ref<'trial' | 'pay_now'>('trial')
  const successMessage = ref('')
  /** Pesan validasi milik presenter — terpisah dari error milik store. */
  const validationError = ref('')
  const isInitialized = ref(false)
  const initFailed = ref(false)
  const requiresBillingRecovery = ref(false)
  const selectedOnboardingStep = ref<OnboardingStepKey>('business')

  const loginForm = reactive({
    email: '',
    password: '',
  })

  const otpCode = ref('')
  const otpResendRemaining = ref(0)
  const OTP_RESEND_COOLDOWN_SECONDS = 60
  let otpCooldownTimer: ReturnType<typeof setInterval> | null = null

  const registerForm = reactive<RegisterPayload>({
    business_name: '',
    business_type: '',
    subdomain: '',
    owner: {
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
    },
    plan_id: null,
    billing_interval: 'month',
    terms_accepted: false,
  })

  const businessForm = reactive<BusinessOnboardingPayload>({
    business_name: '',
    timezone: 'Asia/Jakarta',
    currency: 'IDR',
    branch_name: 'Cabang Utama',
    operating_hours: {
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { closed: true },
    },
  })

  const rentalForm = reactive<RentalOnboardingPayload>({
    engine_code: 'rental',
    rental_model: 'per_day',
    booking_strategy: 'date_range',
    allocation_strategy: 'auto_assign',
    slot_duration_minutes: null,
    enable_waiting_list: false,
    allow_extend_booking: true,
    realtime_availability: true,
  })

  const bookingForm = reactive<BookingOnboardingPayload>({
    engine_code: 'booking',
    allow_online_booking: true,
    allow_walk_in: true,
    enable_waiting_list: false,
    allocation_strategy: 'auto_assign',
    auto_reminder: true,
    auto_cancel_unpaid: true,
    auto_cancel_minutes: 30,
  })

  const transferPaymentConfig = reactive({
    bank_name: 'BCA',
    account_number: '',
    account_name: '',
  })

  const paymentsForm = reactive<PaymentsOnboardingPayload>({
    methods: [
      { method: 'cash', is_enabled: true, configuration: null },
      {
        method: 'transfer',
        is_enabled: true,
        configuration: transferPaymentConfig,
      },
    ],
  })

  const tenantName = computed(() => {
    if (auth.activeWorkspace.tenantName) return auth.activeWorkspace.tenantName
    if (auth.isAuthenticated) return auth.tenantSwitching ? 'Mengganti workspace...' : 'Sewantara Mitra'
    return auth.registeredTenant?.tenant.name || 'Sewantara Mitra'
  })
  const tenantStatusLabel = computed(() => auth.session?.tenant.status || (auth.isAuthenticated ? 'onboarding' : 'guest'))
  const selectedRegistrationPlan = computed(() =>
    catalog.plans.find((plan) => plan.id === Number(registerForm.plan_id)) || null,
  )
  const otpSent = computed(() =>
    Boolean(auth.otpEmail) && auth.otpEmail === registerForm.owner.email.trim().toLowerCase(),
  )
  const emailOtpVerified = computed(() => auth.isEmailOtpVerified(registerForm.owner.email))
  const canRequestEmailOtp = computed(() =>
    Boolean(registerForm.owner.email.trim()) && otpResendRemaining.value === 0 && !emailOtpVerified.value,
  )
  const tenantSite = computed(() =>
    resolveTenantSite(auth.session?.tenant, String(useRuntimeConfig().public.tenantBaseDomain || '')),
  )
  const subscriptionSummary = computed(() => {
    const subscription = auth.subscription
    const plan = subscription?.plan
    const normalizedStatus = subscription?.status?.toLowerCase() || 'inactive'
    const type = subscription?.is_on_trial || normalizedStatus === 'trial'
      ? 'Trial'
      : plan?.invoice_interval === 'year'
        ? 'Tahunan'
        : plan?.invoice_interval === 'month'
          ? 'Bulanan'
          : 'Belum tersedia'
    const statusLabels: Record<string, string> = {
      active: 'Aktif',
      trial: 'Masa percobaan',
      expired: 'Kedaluwarsa',
      inactive: 'Paket tidak aktif',
      canceled: 'Dibatalkan',
    }
    const endDate = subscription?.is_on_trial
      ? subscription.trial_ends_at
      : subscription?.ends_at
    const intervalLabel = plan?.invoice_interval === 'year' ? 'tahun' : 'bulan'
    const priceLabel = plan
      ? `${formatMoney(Number(plan.price), plan.currency)} / ${plan.invoice_period > 1 ? `${plan.invoice_period} ` : ''}${intervalLabel}`
      : 'Harga paket belum tersedia'

    return {
      planName: plan?.name || 'Belum ada paket',
      planSlug: plan?.slug || '',
      type,
      status: normalizedStatus,
      statusLabel: statusLabels[normalizedStatus] || normalizedStatus.replace(/_/g, ' '),
      tone: subscription?.is_active
        ? 'success' as const
        : ['expired', 'inactive', 'canceled'].includes(normalizedStatus)
          ? 'danger' as const
          : 'warning' as const,
      validUntil: endDate ? formatDate(endDate) : 'Tidak ada tanggal berakhir',
      priceLabel,
      features: plan?.features || [],
      checked: Boolean(auth.session),
    }
  })

  const ONBOARDING_PRODUCT_ENGINE: EngineCode = 'rental'

  const inventoryProductForm = reactive({
    category_id: null as number | null,
    name: '',
    slug: '',
    sku: '',
    brand: '',
    model: '',
    description: '',
    engine_code: ONBOARDING_PRODUCT_ENGINE,
    product_type: 'equipment' as ProductType,
    inventory_type: 'serialized' as 'serialized' | 'quantity',
    default_pricing_type: 'daily' as 'hourly' | 'daily' | 'weekly' | 'monthly' | 'event' | 'custom',
    minimum_rental_duration: 1,
    deposit_amount: 0,
    late_fee_amount: 0,
    unit_code: '',
    serial_number: '',
    initial_quantity: 1,
    purchase_price: 0,
  })

  const inventoryCategoryModalOpen = ref(false)
  const inventoryCategoryForm = reactive({
    name: '',
    description: '',
  })

  const onboardingPriceForm = reactive({
    product_id: null as number | null,
    duration: 1,
    price: 0,
  })

  const compatiblePricingType = computed<PricingType>(() => {
    if (rentalForm.rental_model === 'per_hour') return 'hourly'
    if (rentalForm.rental_model === 'session') return 'event'
    return 'daily'
  })
  const onboardingPriceProductOptions = computed(() =>
    products.products
      .filter((product) => product.is_active)
      .map((product) => ({ label: `${product.name} · ${product.sku}`, value: product.id as number | null })),
  )
  const compatiblePricingLabel = computed(() => pricingTypeLabel(compatiblePricingType.value))
  const pricingSetupLoading = computed(() => pricing.loading || pricing.saving || products.loadingProducts || products.saving)

  const inventoryCategoryOptions = computed(() => [
    ...(!products.categories.length
      ? [{ label: 'Belum ada kategori', value: null as number | null }]
      : []),
    ...products.categories
      .filter((category) => category.is_active)
      .map((category) => ({ label: category.name, value: category.id as number | null })),
  ])
  const inventoryProductTypeOptions = computed(() =>
    PRODUCT_TYPES_BY_ENGINE[ONBOARDING_PRODUCT_ENGINE].map((type) => ({
      label: PRODUCT_TYPE_LABELS[type],
      value: type,
    })),
  )
  const suggestedInventoryProductType = computed<ProductType>(() => {
    const templateCode = (auth.businessType || registerForm.business_type || '').toLowerCase()
    const suggestions: Array<[RegExp, ProductType]> = [
      [/(car|mobil|motor|vehicle)/, 'vehicle'],
      [/(kos|villa|apartemen|apartment|homestay)/, 'accommodation'],
    ]
    return suggestions.find(([pattern]) => pattern.test(templateCode))?.[1] || 'equipment'
  })
  const suggestedInventoryCategoryName = computed(() => {
    const templateCode = (auth.businessType || registerForm.business_type || '').toLowerCase()
    const matchedTemplate = catalog.templates.find((template) => template.code === templateCode)
    const suggestions: Array<[RegExp, string]> = [
      [/(car|mobil|vehicle)/, 'Mobil'],
      [/(motor|motorcycle)/, 'Motor'],
      [/(camera|kamera|photo)/, 'Kamera'],
      [/(bike|bicycle|sepeda)/, 'Sepeda'],
      [/(game|console|konsol)/, 'Konsol Game'],
      [/(equipment|alat|tool)/, 'Peralatan'],
      [/(event|party|pesta)/, 'Perlengkapan Acara'],
    ]
    const mapped = suggestions.find(([pattern]) => pattern.test(templateCode))?.[1]
    if (mapped) return mapped

    const templateName = matchedTemplate?.name
      ?.replace(/\b(template|rental|penyewaan|bisnis)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
    return templateName || 'Produk Rental'
  })
  const inventorySetupLoading = computed(() =>
    products.loadingCategories
    || products.loadingProducts
    || products.saving
    || inventory.creatingUnit
    || inventory.adjustingStock,
  )

  const errorMessage = computed(() =>
    validationError.value
    || (auth.isAuthenticated
      ? billing.error || auth.error || branches.error || onboarding.error || products.error || inventory.error || pricing.error || operations.error
      : auth.error || catalog.error),
  )

  const availableBranches = computed(() => {
    const currentBranch = auth.session?.branch
    const branchItems = auth.hasGlobalBranchAccess ? branches.items : currentBranch ? [currentBranch] : []

    if (!currentBranch || branchItems.some((branch) => branch.id === currentBranch.id)) {
      return branchItems
    }

    return [currentBranch, ...branchItems]
  })

  const onboardingSteps = computed(() => {
    const checklist = onboarding.progress?.checklist
    const doneByStep: Record<OnboardingStepKey, boolean> = {
      business: Boolean(checklist?.business),
      rental: Boolean(checklist?.rental_configuration),
      inventory: Boolean(checklist?.inventory),
      pricing: Boolean(checklist?.pricing),
      booking: Boolean(checklist?.booking),
      payment: Boolean(checklist?.payment),
      review: onboarding.completion >= 100,
    }
    const steps = ONBOARDING_STEPS.map((key) => ({
      key,
      label: ONBOARDING_STEP_LABELS[key],
      done: doneByStep[key],
    }))

    let prerequisitesComplete = true
    return steps.map((step, index) => {
      const available = index === 0 || prerequisitesComplete || step.key === selectedOnboardingStep.value
      prerequisitesComplete = prerequisitesComplete && step.done
      return { ...step, available }
    })
  })

  const selectedStepLabel = computed(
    () => onboardingSteps.value.find((step) => step.key === selectedOnboardingStep.value)?.label || 'penyiapan awal',
  )
  const continueLabel = computed(() => {
    if (selectedOnboardingStep.value === 'review') return 'Aktifkan workspace'
    if (selectedOnboardingStep.value === 'inventory' || selectedOnboardingStep.value === 'pricing') {
      return 'Verifikasi & lanjutkan'
    }
    return 'Simpan & lanjutkan'
  })

  const metricCards = computed(() => [
    {
      key: 'revenue' as const,
      label: 'Pendapatan',
      value: formatCurrency(Number(operations.dashboard?.revenue || 0)),
      raw: Number(operations.dashboard?.revenue || 0),
      caption: 'Tercatat pada laporan tenant',
    },
    {
      key: 'bookings' as const,
      label: 'Booking',
      value: String(operations.dashboard?.bookings || 0),
      raw: Number(operations.dashboard?.bookings || 0),
      caption: 'Total booking tercatat',
    },
    {
      key: 'active_rentals' as const,
      label: 'Rental aktif',
      value: String(operations.dashboard?.active_rentals || 0),
      raw: Number(operations.dashboard?.active_rentals || 0),
      caption: 'Sedang berjalan',
    },
    {
      key: 'available_units' as const,
      label: 'Unit tersedia',
      value: String(operations.dashboard?.available_units || 0),
      raw: Number(operations.dashboard?.available_units || 0),
      caption: 'Siap disewa',
    },
  ])

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  function formatMoney(value: number, currency: string) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency || 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  function formatDate(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    }).format(date)
  }

  function applyDefaultsFromCatalog() {
    if (!registerForm.business_type && catalog.templates[0]) {
      registerForm.business_type = catalog.templates[0].code
    }

    if (!registerForm.plan_id && catalog.plans[0]) {
      registerForm.plan_id = catalog.plans[0].id
    }
  }

  function resolveBackendStep(): OnboardingStepKey {
    const step = onboarding.progress?.current_step
    const checklist = onboarding.progress?.checklist

    if (step === 'rental_configuration') return 'rental'
    if (step === 'inventory_setup' || step === 'inventory') return 'inventory'
    if (step === 'pricing') return 'pricing'
    if (step === 'booking_setup' || step === 'booking') return 'booking'
    if (step === 'payment_setup' || step === 'payment') return 'payment'
    if (step === 'review' || step === 'go_live' || step === 'completed') return 'review'
    if (step === 'business_setup' || step === 'business_template' || step === 'business') return 'business'

    if (!checklist?.business) return 'business'
    if (!checklist.rental_configuration) return 'rental'
    if (!checklist.inventory) return 'inventory'
    if (!checklist.pricing) return 'pricing'
    if (!checklist.booking) return 'booking'
    if (!checklist.payment) return 'payment'
    return 'review'
  }

  function syncSelectedStep() {
    selectedOnboardingStep.value = resolveBackendStep()
  }

  function hydrateOnboardingForms() {
    const progress = onboarding.progress
    if (!progress) return

    const profile = progress.profile as Partial<BusinessOnboardingPayload>
    if (typeof profile.business_name === 'string') {
      businessForm.business_name = profile.business_name
    } else if (auth.session?.tenant.name) {
      businessForm.business_name = auth.session.tenant.name
    }
    if (typeof profile.timezone === 'string') businessForm.timezone = profile.timezone
    if (typeof profile.currency === 'string') businessForm.currency = profile.currency
    if (typeof profile.branch_name === 'string') {
      businessForm.branch_name = profile.branch_name
    } else if (auth.session?.branch.name) {
      businessForm.branch_name = auth.session.branch.name
    }
    if (profile.operating_hours && typeof profile.operating_hours === 'object') {
      Object.assign(businessForm.operating_hours, profile.operating_hours)
    }

    const rentalConfiguration = progress.rental_configuration as Partial<RentalOnboardingPayload>
    Object.assign(rentalForm, rentalConfiguration)

    for (const method of progress.payment_methods || []) {
      const target = paymentsForm.methods.find((item) => item.method === method.method)
      if (!target) continue
      target.is_enabled = method.is_enabled

      if (method.method === 'transfer' && method.configuration) {
        Object.assign(transferPaymentConfig, method.configuration)
      }
    }
  }

  async function refreshTenantData(refreshSession = true) {
    if (!auth.isAuthenticated) return

    if (refreshSession) {
      await auth.fetchSession()
    }

    if (auth.tenantStatus === 'onboarding') {
      branches.useCurrentBranch(auth.session?.branch)
      await onboarding.fetchProgress()
      hydrateOnboardingForms()
      syncSelectedStep()
    } else if (auth.tenantStatus === 'active') {
      if (auth.hasGlobalBranchAccess) {
        await branches.fetchAll()
      } else {
        branches.useCurrentBranch(auth.session?.branch)
      }

      await operations.fetchDashboard()
    }
  }

  function slugifyProduct(value: string) {
    return value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  async function loadOnboardingInventoryData() {
    const results = await Promise.allSettled([
      products.fetchCategories({ is_active: true, per_page: 100 }),
      products.fetchProducts({ is_active: true, per_page: 100 }),
      inventory.fetchUnits({ per_page: 100 }),
      inventory.fetchStocks(),
    ])

    if (!inventoryProductForm.category_id && products.categories[0]) {
      inventoryProductForm.category_id = products.categories[0].id
    }

    if (!products.products.length) {
      inventoryProductForm.product_type = suggestedInventoryProductType.value
    }

    if (!products.categories.length && !inventoryCategoryModalOpen.value) {
      openInventoryCategoryModal()
    }

    const failure = results.find((result) => result.status === 'rejected')
    if (failure?.status === 'rejected') throw failure.reason
  }

  function resetInventoryProductForm(categoryId: number | null = inventoryProductForm.category_id) {
    Object.assign(inventoryProductForm, {
      category_id: categoryId,
      name: '',
      slug: '',
      sku: '',
      brand: '',
      model: '',
      description: '',
      engine_code: ONBOARDING_PRODUCT_ENGINE,
      product_type: suggestedInventoryProductType.value,
      inventory_type: 'serialized',
      default_pricing_type: 'daily',
      minimum_rental_duration: 1,
      deposit_amount: 0,
      late_fee_amount: 0,
      unit_code: '',
      serial_number: '',
      initial_quantity: 1,
      purchase_price: 0,
    })
  }

  function openInventoryCategoryModal() {
    validationError.value = ''
    inventoryCategoryForm.name = suggestedInventoryCategoryName.value
    inventoryCategoryForm.description = ''
    inventoryCategoryModalOpen.value = true
  }

  function closeInventoryCategoryModal() {
    if (products.saving) return
    inventoryCategoryModalOpen.value = false
  }

  async function createOnboardingCategory() {
    const name = inventoryCategoryForm.name.trim()
    if (!name) {
      validationError.value = 'Nama kategori wajib diisi.'
      return false
    }

    validationError.value = ''
    const payload: CategoryPayload = {
      parent_id: null,
      name,
      slug: slugifyProduct(name),
      description: inventoryCategoryForm.description.trim() || null,
      sort_order: products.categories.length,
      is_active: true,
    }

    try {
      const category = await products.saveCategory(payload)
      await products.fetchCategories({ is_active: true, per_page: 100 })
      inventoryProductForm.category_id = category.id
      inventoryCategoryModalOpen.value = false
      successMessage.value = `Kategori ${category.name} berhasil dibuat.`
      return true
    } catch {
      return false
    }
  }

  async function submitOnboardingProduct() {
    successMessage.value = ''
    const productName = inventoryProductForm.name.trim()
    const productSlug = inventoryProductForm.slug.trim()
    const sku = inventoryProductForm.sku.trim().toUpperCase()

    if (!productName || !productSlug || !sku) {
      validationError.value = 'Nama produk, slug, dan SKU wajib diisi.'
      return false
    }
    if (!inventoryProductForm.category_id) {
      validationError.value = 'Buat atau pilih kategori produk terlebih dahulu.'
      return false
    }
    if (inventoryProductForm.inventory_type === 'serialized' && !inventoryProductForm.unit_code.trim()) {
      validationError.value = 'Kode unit wajib diisi untuk produk serialized.'
      return false
    }
    const initialQuantity = Number(inventoryProductForm.initial_quantity)
    if (inventoryProductForm.inventory_type === 'quantity' && (!Number.isInteger(initialQuantity) || initialQuantity < 1)) {
      validationError.value = 'Stok awal harus berupa bilangan minimal 1.'
      return false
    }

    validationError.value = ''

    try {
      const categoryId = inventoryProductForm.category_id

      const productPayload: ProductPayload = {
        category_id: categoryId,
        name: productName,
        slug: productSlug,
        sku,
        brand: inventoryProductForm.brand.trim() || null,
        model: inventoryProductForm.model.trim() || null,
        description: inventoryProductForm.description.trim() || null,
        engine_code: inventoryProductForm.engine_code,
        product_type: inventoryProductForm.product_type,
        inventory_type: inventoryProductForm.inventory_type,
        default_pricing_type: inventoryProductForm.default_pricing_type,
        minimum_rental_duration: Math.max(1, Number(inventoryProductForm.minimum_rental_duration || 1)),
        deposit_amount: Math.max(0, Number(inventoryProductForm.deposit_amount || 0)),
        late_fee_amount: Math.max(0, Number(inventoryProductForm.late_fee_amount || 0)),
        is_featured: false,
        is_active: true,
      }
      const savedProduct = await products.saveProduct(productPayload)

      if (savedProduct.inventory_type === 'serialized') {
        const unitPayload: ProductUnitCreatePayload = {
          product_id: savedProduct.id,
          unit_code: inventoryProductForm.unit_code.trim().toUpperCase(),
          barcode: null,
          qr_code: null,
          serial_number: inventoryProductForm.serial_number.trim() || null,
          status: 'available',
          condition: 'good',
          purchase_date: null,
          purchase_price: Math.max(0, Number(inventoryProductForm.purchase_price || 0)),
          current_meter: 0,
          meter_unit: null,
          notes: 'Unit awal dari onboarding tenant.',
        }
        await inventory.createUnit(unitPayload)
      } else {
        const stockPayload: StockAdjustmentPayload = {
          product_id: savedProduct.id,
          quantity: initialQuantity,
          notes: 'Stok awal dari onboarding tenant.',
        }
        await inventory.adjustStock(stockPayload)
      }

      await loadOnboardingInventoryData()
      resetInventoryProductForm(categoryId)
      successMessage.value = `Produk ${savedProduct.name} dan resource awal berhasil ditambahkan.`
      return true
    } catch {
      return false
    }
  }

  function currentOnboardingPrice() {
    return pricing.prices.find((item) =>
      item.product_id === onboardingPriceForm.product_id
      && item.pricing_type === compatiblePricingType.value,
    ) || null
  }

  function hydrateOnboardingPriceForm() {
    const existing = currentOnboardingPrice()
    onboardingPriceForm.duration = Number(existing?.duration || 1)
    onboardingPriceForm.price = Number(existing?.price || 0)
  }

  async function loadOnboardingPricingData() {
    const results = await Promise.allSettled([
      products.fetchProducts({ is_active: true, per_page: 100 }),
      pricing.fetchPrices(),
    ])

    if (!onboardingPriceForm.product_id && products.products[0]) {
      onboardingPriceForm.product_id = products.products[0].id
    }
    hydrateOnboardingPriceForm()

    const failure = results.find((result) => result.status === 'rejected')
    if (failure?.status === 'rejected') throw failure.reason
  }

  async function submitOnboardingPrice() {
    successMessage.value = ''
    const product = products.products.find((item) => item.id === onboardingPriceForm.product_id)
    const duration = Number(onboardingPriceForm.duration)
    const amount = Number(onboardingPriceForm.price)

    if (!product) {
      validationError.value = 'Pilih produk yang akan diberi harga.'
      return false
    }
    if (!Number.isInteger(duration) || duration < 1) {
      validationError.value = 'Durasi harga harus berupa bilangan minimal 1.'
      return false
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      validationError.value = 'Nominal harga harus lebih besar dari 0.'
      return false
    }

    validationError.value = ''
    const payload: ProductPricePayload = {
      product_id: product.id,
      pricing_type: compatiblePricingType.value,
      duration,
      price: amount,
      start_at: null,
      end_at: null,
      is_active: true,
    }

    try {
      if (product.default_pricing_type !== compatiblePricingType.value) {
        const productPayload: ProductPayload = {
          category_id: product.category_id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          brand: product.brand || null,
          model: product.model || null,
          description: product.description || null,
          engine_code: product.engine_code,
          product_type: product.product_type,
          inventory_type: product.inventory_type,
          default_pricing_type: compatiblePricingType.value,
          minimum_rental_duration: Number(product.minimum_rental_duration || 1),
          deposit_amount: Number(product.deposit_amount || 0),
          late_fee_amount: Number(product.late_fee_amount || 0),
          is_featured: product.is_featured,
          is_active: product.is_active,
        }
        await products.saveProduct(productPayload, product.id)
      }

      const existing = currentOnboardingPrice()
      await pricing.savePrice(payload, existing?.id)
      await Promise.all([
        pricing.fetchPrices(),
        products.fetchProducts({ is_active: true, per_page: 100 }),
      ])
      successMessage.value = `Harga ${product.name} berhasil ${existing ? 'diperbarui' : 'ditambahkan'}.`
      return true
    } catch {
      return false
    }
  }

  function handleSubscriptionError(event: Event) {
    const code = (event as CustomEvent<{ code?: string }>).detail?.code
    if (code === 'SUBSCRIPTION_REQUIRED' || code === 'SUBSCRIPTION_EXPIRED') {
      requiresBillingRecovery.value = true
    }
  }

  function startOtpResendCooldown(seconds = OTP_RESEND_COOLDOWN_SECONDS) {
    otpResendRemaining.value = seconds
    if (otpCooldownTimer) clearInterval(otpCooldownTimer)
    otpCooldownTimer = setInterval(() => {
      otpResendRemaining.value = Math.max(0, otpResendRemaining.value - 1)
      if (otpResendRemaining.value === 0 && otpCooldownTimer) {
        clearInterval(otpCooldownTimer)
        otpCooldownTimer = null
      }
    }, 1000)
  }

  async function requestEmailOtp() {
    successMessage.value = ''
    const email = registerForm.owner.email.trim()
    if (!email) return

    try {
      await auth.requestOtp(email)
      otpCode.value = ''
      startOtpResendCooldown()
      successMessage.value = 'Kode verifikasi telah dikirim ke email Anda.'
    } catch {
      // Store menampilkan pesan error dari backend.
    }
  }

  async function verifyEmailOtp() {
    successMessage.value = ''
    const email = registerForm.owner.email.trim()
    const code = otpCode.value.trim()
    if (!email || code.length !== 6) return

    try {
      await auth.verifyOtp(email, code)
      successMessage.value = 'Email berhasil diverifikasi.'
    } catch {
      // Store menampilkan pesan error dari backend.
    }
  }

  async function submitRegister() {
    successMessage.value = ''
    if (!emailOtpVerified.value) {
      validationError.value = 'Email belum diverifikasi. Silakan minta dan masukkan kode OTP terlebih dahulu.'
      return
    }

    validationError.value = ''
    try {
      await auth.register(registerForm)
      await auth.login(registerForm.owner.email, registerForm.owner.password)
      businessForm.business_name = auth.session?.tenant.name || registerForm.business_name

      if (registrationBillingChoice.value === 'pay_now') {
        successMessage.value = 'Akun berhasil dibuat. Membuka pembayaran...'
        await billing.redirectToCheckout()
        return
      }

      await refreshTenantData(false)
      requiresBillingRecovery.value = false
      successMessage.value = 'Akun berhasil dibuat dan trial sudah aktif. Yuk lanjutkan penyiapan workspace.'
    } catch {
      // Store menampilkan pesan error dari backend.
    }
  }

  async function submitLogin() {
    successMessage.value = ''
    try {
      await auth.login(loginForm.email, loginForm.password)
      businessForm.business_name = auth.session?.tenant.name || businessForm.business_name
      await refreshTenantData(false)
      requiresBillingRecovery.value = false
    } catch {
      // Store menampilkan pesan error dari backend.
    }
  }

  async function runOnboardingAction(action: () => Promise<unknown>, message: string, advance = true) {
    successMessage.value = ''
    try {
      await action()
      successMessage.value = message
      if (advance) syncSelectedStep()
      return true
    } catch {
      return false
    }
  }

  function saveBusiness(advance = true) {
    return runOnboardingAction(() => onboarding.saveBusiness(businessForm), 'Informasi usaha tersimpan.', advance)
  }

  function saveRental(advance = true) {
    return runOnboardingAction(() => onboarding.saveRental(rentalForm), 'Konfigurasi rental tersimpan.', advance)
  }

  function completeInventory(advance = true) {
    return runOnboardingAction(() => onboarding.completeInventory(), 'Inventory berhasil diverifikasi.', advance)
  }

  function completePricing(advance = true) {
    return runOnboardingAction(() => onboarding.completePricing(), 'Harga berhasil diverifikasi.', advance)
  }

  function saveBooking(advance = true) {
    return runOnboardingAction(() => onboarding.saveBooking(bookingForm), 'Konfigurasi booking tersimpan.', advance)
  }

  function savePayments(advance = true) {
    paymentsForm.methods[1].configuration = transferPaymentConfig
    return runOnboardingAction(() => onboarding.savePayments(paymentsForm), 'Metode pembayaran tersimpan.', advance)
  }

  async function goLive() {
    successMessage.value = ''
    try {
      await onboarding.goLive()
      await refreshTenantData()
      successMessage.value = 'Workspace aktif dan siap digunakan.'
      return true
    } catch {
      return false
    }
  }

  function selectOnboardingStep(step: string) {
    const target = onboardingSteps.value.find((item) => item.key === step)
    if (!target?.available) return
    selectedOnboardingStep.value = target.key
    successMessage.value = ''
    validationError.value = ''
  }

  function goToPreviousStep() {
    const currentIndex = onboardingSteps.value.findIndex((step) => step.key === selectedOnboardingStep.value)
    if (currentIndex <= 0) return
    selectedOnboardingStep.value = onboardingSteps.value[currentIndex - 1].key
    successMessage.value = ''
    validationError.value = ''
  }

  async function saveCurrentStep(advance: boolean) {
    if (!advance && ['inventory', 'pricing', 'review'].includes(selectedOnboardingStep.value)) {
      successMessage.value = 'Progress onboarding sudah tersimpan di workspace.'
      return true
    }

    if (selectedOnboardingStep.value === 'business') return saveBusiness(advance)
    if (selectedOnboardingStep.value === 'rental') return saveRental(advance)
    if (selectedOnboardingStep.value === 'inventory') return completeInventory(advance)
    if (selectedOnboardingStep.value === 'pricing') return completePricing(advance)
    if (selectedOnboardingStep.value === 'booking') return saveBooking(advance)
    if (selectedOnboardingStep.value === 'payment') return savePayments(advance)
    if (advance) return goLive()

    successMessage.value = 'Review onboarding tersimpan.'
    return true
  }

  function saveDraft() {
    return saveCurrentStep(false)
  }

  async function continueSetup() {
    if (auth.tenantStatus === 'active') {
      await operations.fetchDashboard()
      return
    }

    await saveCurrentStep(true)
  }

  async function refreshDashboard() {
    if (!auth.isAuthenticated) return
    await Promise.allSettled([
      auth.fetchSession(),
      operations.fetchDashboard(),
    ])
  }

  async function saveAndExit() {
    if (auth.tenantStatus === 'onboarding') {
      const saved = await saveCurrentStep(false)
      if (!saved) return
    }

    await logout()
  }

  async function switchBranch(branchId: number) {
    successMessage.value = ''
    const targetBranch = availableBranches.value.find((branch) => branch.id === branchId)
    if (!targetBranch?.is_active) return

    try {
      await auth.switchBranch(branchId)
      await operations.fetchDashboard()
      successMessage.value = `Cabang ${auth.activeBranch?.name || 'aktif'} sedang digunakan.`
    } catch {
      // Store menampilkan pesan error dari backend.
    }
  }

  function resetWorkspaceStores() {
    branches.clear()
    onboarding.reset()
    operations.reset()
    settings.reset()
    products.reset()
    bookings.reset()
    inventory.reset()
    pricing.reset()
    users.reset()
  }

  async function switchTenant(tenantId: string, branchId = 1) {
    successMessage.value = ''

    try {
      await auth.switchTenant(tenantId, branchId)
      resetWorkspaceStores()
      await refreshTenantData(false)
      successMessage.value = `Workspace ${auth.session?.tenant.name || 'aktif'} sedang digunakan.`
    } catch {
      // Store menampilkan pesan error dari backend dan mengembalikan konteks sebelumnya.
    }
  }

  async function logout() {
    await auth.logout()
    resetWorkspaceStores()
    successMessage.value = ''
    validationError.value = ''
    requiresBillingRecovery.value = false

    if (!catalog.templates.length || !catalog.plans.length) {
      await catalog.fetchCatalog()
      applyDefaultsFromCatalog()
    }
  }

  async function initialize() {
    if (isInitialized.value) return

    initFailed.value = false

    try {
      auth.hydrateFromStorage()
      const catalogRequest = catalog.fetchCatalog()

      if (auth.isAuthenticated) {
        const [catalogResult, tenantResult] = await Promise.allSettled([catalogRequest, refreshTenantData()])
        if (tenantResult.status === 'rejected') {
          const err = tenantResult.reason
          if (err instanceof ApiRequestError && [401, 403].includes(err.status)) {
            auth.clearSession()
          } else if (err instanceof ApiRequestError && err.status === 423) {
            requiresBillingRecovery.value = true
          } else {
            throw err
          }
        }
        if (catalogResult.status === 'rejected') throw catalogResult.reason
      } else {
        await catalogRequest
      }

      applyDefaultsFromCatalog()
      isInitialized.value = true
    } catch {
      // Transient error (backend belum siap, network blip, dll). Biarkan
      // isInitialized tetap false supaya initialize() bisa dicoba lagi tanpa
      // reload penuh — lihat initFailed di layout default.
      initFailed.value = true
    }
  }

  watch(
    () => catalog.plans.length + catalog.templates.length,
    applyDefaultsFromCatalog,
  )

  let lastAutoProductSlug = ''
  let lastAutoProductSku = ''
  watch(
    () => inventoryProductForm.name,
    (name) => {
      const nextSlug = slugifyProduct(name)
      const nextSku = nextSlug.replace(/-/g, '').slice(0, 16).toUpperCase()
      if (!inventoryProductForm.slug || inventoryProductForm.slug === lastAutoProductSlug) {
        inventoryProductForm.slug = nextSlug
      }
      if (!inventoryProductForm.sku || inventoryProductForm.sku === lastAutoProductSku) {
        inventoryProductForm.sku = nextSku
      }
      lastAutoProductSlug = nextSlug
      lastAutoProductSku = nextSku
    },
  )

  watch(selectedOnboardingStep, (step) => {
    if (step === 'inventory') loadOnboardingInventoryData().catch(() => undefined)
    if (step === 'pricing') loadOnboardingPricingData().catch(() => undefined)
  })

  watch(
    () => [onboardingPriceForm.product_id, compatiblePricingType.value],
    hydrateOnboardingPriceForm,
  )

  if (process.client) {
    window.addEventListener('sewantara:subscription-error', handleSubscriptionError)
  }

  return reactive({
    activeAuthTab,
    auth,
    billing,
    availableBranches,
    branches,
    bookingForm,
    businessForm,
    catalog,
    continueLabel,
    errorMessage,
    formatCurrency,
    inventoryCategoryOptions,
    inventoryProductTypeOptions,
    inventoryCategoryForm,
    inventoryCategoryModalOpen,
    inventoryProductForm,
    inventorySetupLoading,
    suggestedInventoryCategoryName,
    inventory,
    onboardingPriceForm,
    onboardingPriceProductOptions,
    compatiblePricingLabel,
    compatiblePricingType,
    isInitialized,
    initFailed,
    loginForm,
    otpCode,
    otpSent,
    otpResendRemaining,
    emailOtpVerified,
    canRequestEmailOtp,
    metricCards,
    subscriptionSummary,
    onboarding,
    onboardingSteps,
    operations,
    paymentsForm,
    pricing,
    pricingSetupLoading,
    products,
    registerForm,
    registrationBillingChoice,
    requiresBillingRecovery,
    rentalForm,
    selectedOnboardingStep,
    selectedRegistrationPlan,
    selectedStepLabel,
    successMessage,
    validationError,
    tenantName,
    tenantSite,
    tenantStatusLabel,
    transferPaymentConfig,
    completeInventory,
    completePricing,
    goLive,
    refreshDashboard,
    initialize,
    logout,
    goToPreviousStep,
    saveAndExit,
    saveBooking,
    saveDraft,
    saveBusiness,
    continueSetup,
    savePayments,
    saveRental,
    closeInventoryCategoryModal,
    createOnboardingCategory,
    openInventoryCategoryModal,
    submitOnboardingProduct,
    submitOnboardingPrice,
    selectOnboardingStep,
    switchTenant,
    switchBranch,
    submitLogin,
    submitRegister,
    requestEmailOtp,
    verifyEmailOtp,
  })
}

export type MitraDashboardPresenter = ReturnType<typeof createMitraDashboard>

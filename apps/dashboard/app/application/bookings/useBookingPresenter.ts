import type {
  AvailabilityResult,
  Booking,
  BookingCreatePayload,
  BookingHistory,
  BookingItem,
} from '~/domain/booking'
import type { Product } from '~/domain/product'
import type { CustomerCreatePayload } from '~/domain/customer'
import type { PricingType } from '~/domain/mitra'
import type { SalesOrderCreatePayload } from '~/domain/sales'
import { PRICING_TYPE_LABELS } from '~/domain/pricing'

type AvailabilityState = 'idle' | 'available' | 'unavailable'
type BookingAction = 'checkOut' | 'cancel' | 'return'
type PosPaymentMode = 'unpaid' | 'full' | 'deposit'
type PosPaymentMethod = 'cash' | 'transfer'
type TransactionMode = 'booking' | 'sales'

interface BookingFormState {
  customer_id: number | null
  start_at: string
  end_at: string
  notes: string
  items: Array<{
    product_id: number
    quantity: number
  }>
}

interface PosPaymentFormState {
  mode: PosPaymentMode
  method: PosPaymentMethod
  deposit_amount: number | null
}

interface QuickCustomerFormState {
  name: string
  email: string
  phone: string
  whatsapp: string
  address: string
}

function toLocalDateTimeInput(date: Date) {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16)
}

function createBookingForm(): BookingFormState {
  const start = new Date()
  start.setMinutes(0, 0, 0)
  start.setHours(start.getHours() + 1)
  const end = new Date(start)
  end.setHours(end.getHours() + 2)

  return {
    customer_id: null,
    start_at: toLocalDateTimeInput(start),
    end_at: toLocalDateTimeInput(end),
    notes: '',
    items: [],
  }
}

function createPaymentForm(): PosPaymentFormState {
  return {
    mode: 'unpaid',
    method: 'cash',
    deposit_amount: null,
  }
}

function createQuickCustomerForm(): QuickCustomerFormState {
  return { name: '', email: '', phone: '', whatsapp: '', address: '' }
}

function normalizeStatus(status: string) {
  return status.trim().toLowerCase().replace(/[\s-]+/g, '_')
}

export function useBookingPresenter() {
  const auth = useAuthStore()
  const store = useBookingStore()
  const products = useProductStore()
  const customerStore = useCustomerStore()
  const engines = useEngineStore()
  const salesOrders = useSalesOrderStore()
  const snackbar = useSnackbarStore()
  const createOpen = ref(false)
  const checkoutOpen = ref(false)
  const customerCreateOpen = ref(false)
  const paymentDialogOpen = ref(false)
  const actionTarget = ref<BookingAction | null>(null)
  const initializedContext = ref('')
  const search = ref('')
  const statusFilter = ref('')
  const dateFilter = ref('')
  const catalogSearch = ref('')
  const catalogCategoryId = ref<number | null>(null)
  const mode = ref<TransactionMode>('booking')
  const form = reactive<BookingFormState>(createBookingForm())
  const paymentForm = reactive<PosPaymentFormState>(createPaymentForm())
  const customerForm = reactive<QuickCustomerFormState>(createQuickCustomerForm())
  const paymentDialogForm = reactive<{ amount: string; method: PosPaymentMethod }>({
    amount: '',
    method: 'cash',
  })

  const contextKey = computed(() => `${auth.tenantId}:${auth.branchId}`)
  const detailOpen = computed(() => Boolean(store.detail))
  const currentBooking = computed(() => store.detail)
  const salesEngineEnabled = computed(() =>
    engines.catalog.some((engine) => engine.code === 'sales' && engine.is_enabled),
  )
  const activeProducts = computed(() => products.products.filter((product) =>
    product.is_active && (mode.value === 'sales' ? product.engine_code === 'sales' : product.engine_code !== 'sales'),
  ))
  const categoryOptions = computed(() => [
    { label: 'Semua kategori', value: null as number | null },
    ...products.categories
      .filter((category) => category.is_active)
      .map((category) => ({ label: category.name, value: category.id as number | null })),
  ])
  const filteredCatalogProducts = computed(() => {
    const keyword = catalogSearch.value.trim().toLowerCase()
    return activeProducts.value.filter((product) => {
      const matchesCategory = !catalogCategoryId.value || product.category_id === catalogCategoryId.value
      const searchable =
        `${product.name} ${product.sku} ${product.brand || ''} ${product.category?.name || ''}`.toLowerCase()
      return matchesCategory && (!keyword || searchable.includes(keyword))
    })
  })
  const cartItems = computed(() =>
    form.items.map((line) => ({
      ...line,
      product: products.products.find((product) => product.id === line.product_id),
      availability: store.availabilityResults[line.product_id],
    })),
  )
  const cartQuantity = computed(() =>
    form.items.reduce((total, line) => total + Number(line.quantity || 0), 0),
  )
  const checkoutBusy = computed(() =>
    store.creating || store.recordingPayment,
  )
  const salesBusy = computed(() => salesOrders.creating)
  const estimatedPricing = computed(() => {
    let total = 0
    let missingPrices = 0

    for (const line of cartItems.value) {
      if (!line.product) {
        missingPrices += 1
        continue
      }
      const estimatedCost = estimatedProductCost(line.product, line.quantity)
      if (estimatedCost === null) {
        missingPrices += 1
        continue
      }
      total += estimatedCost
    }

    return { total, missingPrices }
  })
  const estimatedRentalDuration = computed(() => {
    const hours = rentalDurationHours()
    if (hours <= 0) return 'Jadwal belum valid'
    if (hours < 24) return `${Math.ceil(hours)} jam`
    const days = hours / 24
    return `${Number.isInteger(days) ? days : days.toFixed(1)} hari`
  })
  const customerOptions = computed(() =>
    store.customers.map((customer) => ({
      label: `${customer.name}${customer.phone || customer.whatsapp ? ` · ${customer.phone || customer.whatsapp}` : ''}`,
      value: customer.id,
    })),
  )
  const statusOptions = computed(() => {
    const statuses = Array.from(new Set(store.items.map((booking) => normalizeStatus(booking.status))))
    return [
      { label: 'Semua status', value: '' },
      ...statuses.map((status) => ({ label: statusLabel(status), value: status })),
    ]
  })
  const filteredBookings = computed(() => {
    const keyword = search.value.trim().toLowerCase()
    return store.items.filter((booking) => {
      const code = bookingCode(booking).toLowerCase()
      const customer = customerName(booking).toLowerCase()
      const productsText = (booking.items || [])
        .map((item) => item.product_name || item.product?.name || '')
        .join(' ')
        .toLowerCase()
      const matchesSearch = !keyword || [code, customer, productsText].some((value) => value.includes(keyword))
      const matchesStatus = !statusFilter.value || normalizeStatus(booking.status) === statusFilter.value
      const matchesDate = !dateFilter.value || bookingStart(booking).slice(0, 10) === dateFilter.value
      return matchesSearch && matchesStatus && matchesDate
    })
  })
  const pendingCount = computed(() =>
    store.items.filter((booking) =>
      ['pending', 'unpaid', 'waiting', 'draft'].includes(normalizeStatus(booking.status)),
    ).length,
  )
  const activeCount = computed(() =>
    store.items.filter((booking) =>
      ['confirmed', 'active', 'ongoing', 'paid', 'partially_paid'].includes(normalizeStatus(booking.status)),
    ).length,
  )
  const completedCount = computed(() =>
    store.items.filter((booking) =>
      ['completed', 'returned', 'finished'].includes(normalizeStatus(booking.status)),
    ).length,
  )
  const availabilityState = computed<AvailabilityState>(() => {
    if (!form.items.length) return 'idle'
    if (form.items.some((line) => !store.availabilityResults[line.product_id])) return 'idle'
    if (
      form.items.some((line) =>
        !isLineAvailable(store.availabilityResults[line.product_id], line.quantity),
      )
    ) {
      return 'unavailable'
    }
    return 'available'
  })
  const historyEntries = computed(() => {
    const booking = currentBooking.value
    if (!booking) return []
    const possibleHistory = [
      booking.status_histories,
      booking.statusHistories,
      booking.status_history,
      booking.histories,
      booking.history,
      booking.activities,
      booking.events,
    ].find((value) => Array.isArray(value)) || []

    const entries = [...possibleHistory]
    if (!entries.length && booking.created_at) {
      entries.push({
        id: `created-${booking.id}`,
        event: 'created',
        title: 'Booking dibuat',
        description: `Booking dibuat dengan status ${statusLabel(booking.status)}.`,
        to_status: booking.status,
        created_at: booking.created_at,
      })
      if (booking.updated_at && booking.updated_at !== booking.created_at) {
        entries.push({
          id: `updated-${booking.id}`,
          event: 'status_updated',
          title: `Status ${statusLabel(booking.status)}`,
          to_status: booking.status,
          created_at: booking.updated_at,
        })
      }
    }

    return entries
      .map((entry, index) => normalizeHistory(entry, index))
      .sort((left, right) => new Date(right.timestamp || 0).getTime() - new Date(left.timestamp || 0).getTime())
  })
  const canCheckOut = computed(() =>
    ['pending', 'confirmed', 'preparing', 'ready'].includes(
      normalizeStatus(currentBooking.value?.status || ''),
    ),
  )
  const canCancel = computed(() =>
    ['draft', 'pending', 'confirmed', 'preparing', 'ready'].includes(
      normalizeStatus(currentBooking.value?.status || ''),
    ),
  )
  const canReturn = computed(() =>
    normalizeStatus(currentBooking.value?.status || '') === 'ongoing',
  )
  const paidAmount = computed(() => {
    const booking = currentBooking.value
    if (!booking) return 0
    if (booking.paid_amount !== null && booking.paid_amount !== undefined) return Number(booking.paid_amount) || 0
    return (booking.payments || [])
      .filter((payment) => ['paid', 'success', 'completed', 'settled'].includes(normalizeStatus(payment.status || '')))
      .reduce((total, payment) => total + Number(payment.amount || 0), 0)
  })
  const outstandingAmount = computed(() => {
    const booking = currentBooking.value
    if (!booking) return 0
    if (booking.outstanding_amount !== null && booking.outstanding_amount !== undefined) {
      return Number(booking.outstanding_amount) || 0
    }
    return Math.max(0, bookingTotal(booking) - paidAmount.value)
  })
  const canRecordPayment = computed(() => {
    const status = normalizeStatus(currentBooking.value?.status || '')
    return Boolean(currentBooking.value) && outstandingAmount.value > 0 && !['cancelled', 'canceled'].includes(status)
  })

  async function fetchAll(showError = true) {
    try {
      await store.fetchAll()
    } catch (err) {
      if (showError) snackbar.error(err instanceof Error ? err.message : store.error)
      else throw err
    }
  }

  async function initialize(force = false) {
    if (!force && initializedContext.value === contextKey.value) return

    const results = await Promise.allSettled([
      fetchAll(false),
      store.fetchCustomers(),
      store.fetchPrices(),
      products.fetchProducts({ is_active: true, per_page: 100, branch_id: Number(auth.branchId) }),
      products.fetchCategories({ is_active: true, per_page: 100 }),
      engines.fetchCatalog(),
    ])
    initializedContext.value = contextKey.value

    const failure = results.find((result) => result.status === 'rejected')
    if (failure?.status === 'rejected') {
      snackbar.error(failure.reason instanceof Error ? failure.reason.message : 'Data booking gagal dimuat.')
    }
  }

  function openCreate() {
    Object.assign(form, createBookingForm())
    Object.assign(paymentForm, createPaymentForm())
    form.customer_id = customerOptions.value[0]?.value || null
    catalogSearch.value = ''
    catalogCategoryId.value = null
    mode.value = 'booking'
    store.resetAvailability()
    checkoutOpen.value = false
    createOpen.value = true

    if (!customerOptions.value.length) {
      snackbar.warning('Belum ada pelanggan. Tambahkan pelanggan sebelum menyimpan booking.')
    } else if (!activeProducts.value.length) {
      snackbar.warning('Belum ada produk aktif untuk dibooking.')
    }
  }

  function setMode(next: TransactionMode) {
    if (mode.value === next) return
    mode.value = next
    form.items = []
    store.resetAvailability()
  }

  async function openDetail(booking: Booking) {
    store.detail = booking
    actionTarget.value = null
    try {
      await store.fetchDetail(booking.id)
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function closeDetail() {
    if (store.loadingDetail || store.updatingStatus) return
    store.detail = null
    actionTarget.value = null
    paymentDialogOpen.value = false
  }

  async function refreshDetail() {
    if (!currentBooking.value) return
    try {
      await store.fetchDetail(currentBooking.value.id)
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function requestStatusAction(action: BookingAction) {
    if (action === 'checkOut' && !canCheckOut.value) {
      snackbar.warning('Booking dengan status ini tidak dapat diproses.')
      return
    }
    if (action === 'cancel' && !canCancel.value) {
      snackbar.warning('Booking dengan status ini tidak dapat dibatalkan.')
      return
    }
    if (action === 'return' && !canReturn.value) {
      snackbar.warning('Hanya booking yang sedang berjalan yang dapat dikembalikan.')
      return
    }
    actionTarget.value = action
  }

  function cancelStatusAction() {
    if (!store.updatingStatus) actionTarget.value = null
  }

  async function confirmStatusAction() {
    const booking = currentBooking.value
    const action = actionTarget.value
    if (!booking || !action) return

    try {
      await store.changeStatus(action, booking.id)
      actionTarget.value = null
      const messages: Record<BookingAction, string> = {
        checkOut: 'Barang berhasil diserahkan. Booking kini sedang berjalan.',
        cancel: 'Booking berhasil dibatalkan.',
        return: 'Pengembalian booking berhasil diproses.',
      }
      snackbar.success(messages[action], 'Status diperbarui')
      try {
        await Promise.all([store.fetchDetail(booking.id), fetchAll(false)])
      } catch {
        snackbar.warning('Status sudah berubah, tetapi data booking terbaru belum dapat dimuat lengkap.')
      }
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function closeCreate() {
    if (!checkoutBusy.value && !store.checkingAvailability) {
      checkoutOpen.value = false
      customerCreateOpen.value = false
      createOpen.value = false
    }
  }

  function openCheckout() {
    if (!form.customer_id) {
      snackbar.warning('Pelanggan wajib dipilih sebelum menyelesaikan booking.')
      return
    }
    if (!validateSchedule()) return
    checkoutOpen.value = true
  }

  function closeCheckout() {
    if (!checkoutBusy.value) checkoutOpen.value = false
  }

  function openPaymentDialog() {
    if (!canRecordPayment.value) return
    paymentDialogForm.amount = outstandingAmount.value > 0 ? String(outstandingAmount.value) : ''
    paymentDialogForm.method = 'cash'
    paymentDialogOpen.value = true
  }

  function closePaymentDialog() {
    if (!store.recordingPayment) paymentDialogOpen.value = false
  }

  async function submitPaymentDialog() {
    const booking = currentBooking.value
    if (!booking) return

    const amount = Number(paymentDialogForm.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      snackbar.warning('Masukkan nominal pembayaran lebih dari Rp0.')
      return
    }
    if (amount > outstandingAmount.value + 0.5) {
      snackbar.warning(`Nominal melebihi sisa tagihan ${formatCurrency(outstandingAmount.value)}.`)
      return
    }

    try {
      await store.recordPayment(booking.id, {
        type: amount >= outstandingAmount.value ? 'full_payment' : 'down_payment',
        method: paymentDialogForm.method,
        amount,
      })
      paymentDialogOpen.value = false
      snackbar.success('Pembayaran berhasil dicatat.')
      try {
        await Promise.all([store.fetchDetail(booking.id), fetchAll(false)])
      } catch {
        snackbar.warning('Pembayaran tersimpan, tetapi data booking terbaru belum dapat dimuat lengkap.')
      }
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function openCustomerCreate() {
    Object.assign(customerForm, createQuickCustomerForm())
    customerCreateOpen.value = true
  }

  function closeCustomerCreate() {
    if (!customerStore.creating) customerCreateOpen.value = false
  }

  async function submitCustomer() {
    const name = customerForm.name.trim()
    const email = customerForm.email.trim().toLowerCase()
    const phone = customerForm.phone.trim()
    const whatsapp = customerForm.whatsapp.trim()

    if (!name) {
      snackbar.warning('Nama pelanggan wajib diisi.')
      return
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      snackbar.warning('Format email pelanggan belum valid.')
      return
    }

    const payload: CustomerCreatePayload = {
      name,
      email: email || null,
      phone: phone || null,
      whatsapp: whatsapp || null,
      address: customerForm.address.trim() || null,
    }

    try {
      const customer = await customerStore.create(payload)
      await store.fetchCustomers()
      form.customer_id = customer.id
      customerCreateOpen.value = false
      snackbar.success(`Pelanggan ${customer.name} berhasil ditambahkan.`)
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : customerStore.error)
    }
  }

  function validateSchedule() {
    if (!form.items.length) {
      snackbar.warning('Pilih minimal satu produk untuk booking.')
      return false
    }
    if (!form.start_at || !form.end_at || new Date(form.end_at) <= new Date(form.start_at)) {
      snackbar.warning('Waktu selesai harus lebih besar dari waktu mulai.')
      return false
    }
    if (form.items.some((line) => !Number.isInteger(Number(line.quantity)) || Number(line.quantity) < 1)) {
      snackbar.warning('Jumlah setiap produk minimal 1.')
      return false
    }
    return true
  }

  function validateCart() {
    if (!form.items.length) {
      snackbar.warning('Pilih minimal satu produk untuk dijual.')
      return false
    }
    if (form.items.some((line) => !Number.isInteger(Number(line.quantity)) || Number(line.quantity) < 1)) {
      snackbar.warning('Jumlah setiap produk minimal 1.')
      return false
    }
    return true
  }

  async function submitSale() {
    if (!validateCart()) return

    const items: SalesOrderCreatePayload['items'] = []
    for (const line of form.items) {
      const product = products.products.find((item) => item.id === line.product_id)
      const rate = product ? productRate(product) : undefined
      if (!rate) {
        snackbar.warning(`Harga ${product?.name || `produk #${line.product_id}`} belum tersedia.`)
        return
      }
      items.push({
        product_id: line.product_id,
        quantity: Number(line.quantity),
        unit_price: Number(rate.price),
      })
    }

    const payload: SalesOrderCreatePayload = {
      customer_id: form.customer_id || null,
      notes: form.notes.trim() || null,
      status: 'completed',
      items,
    }

    try {
      const order = await salesOrders.create(payload)
      createOpen.value = false
      snackbar.success(
        `Penjualan ${order.order_number || `#${order.id}`} senilai ${formatCurrency(Number(order.total_amount || 0))} berhasil dicatat.`,
        'Transaksi kasir selesai',
      )
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : salesOrders.error)
    }
  }

  async function checkAvailability() {
    if (!validateSchedule()) return false

    try {
      await store.checkAvailabilities(
        form.items.map((line) => ({
          product_id: line.product_id,
          start_at: form.start_at,
          end_at: form.end_at,
          quantity: Number(line.quantity),
        })),
      )
      if (availabilityState.value === 'available') {
        snackbar.success('Semua produk tersedia pada jadwal yang dipilih.', 'Jadwal tersedia')
        return true
      }
      snackbar.warning('Satu atau beberapa produk tidak tersedia pada jadwal tersebut.')
      return false
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
      return false
    }
  }

  async function submit() {
    if (!form.customer_id) {
      snackbar.warning('Pelanggan wajib dipilih sebelum menyelesaikan booking.')
      return
    }
    if (!validateSchedule()) return
    if (
      paymentForm.mode === 'deposit'
      && (!Number.isFinite(Number(paymentForm.deposit_amount)) || Number(paymentForm.deposit_amount) <= 0)
    ) {
      snackbar.warning('Masukkan nominal DP lebih dari Rp0.')
      return
    }

    const payload: BookingCreatePayload = {
      customer_id: form.customer_id!,
      start_at: form.start_at,
      end_at: form.end_at,
      items: form.items.map((line) => ({
        product_id: line.product_id,
        quantity: Number(line.quantity),
      })),
      notes: form.notes.trim() || null,
    }

    let createdBooking: Booking
    try {
      createdBooking = await store.create(payload)
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
      return
    }

    let paymentError: unknown = null
    if (paymentForm.mode !== 'unpaid') {
      const amount = paymentForm.mode === 'full'
        ? bookingTotal(createdBooking)
        : Number(paymentForm.deposit_amount)

      if (!Number.isFinite(amount) || amount <= 0) {
        paymentError = new Error('Total booking dari backend belum tersedia sehingga pembayaran belum dapat dicatat.')
      } else {
        try {
          await store.recordPayment(createdBooking.id, {
            type: paymentForm.mode === 'full' ? 'full_payment' : 'down_payment',
            method: paymentForm.method,
            amount,
          })
        } catch (err) {
          paymentError = err
        }
      }
    }

    checkoutOpen.value = false
    createOpen.value = false

    if (paymentError) {
      const reason = paymentError instanceof Error
        ? paymentError.message
        : 'Pembayaran belum dapat dicatat.'
      snackbar.error(
        `${bookingCode(createdBooking)} sudah dibuat, tetapi pembayaran gagal dicatat. ${reason}`,
        'Booking tersimpan, pembayaran tertunda',
      )
    } else if (paymentForm.mode === 'full') {
      snackbar.success(
        `${bookingCode(createdBooking)} dan pembayaran lunas berhasil dicatat.`,
        'Transaksi walk-in berhasil',
      )
    } else if (paymentForm.mode === 'deposit') {
      snackbar.success(
        `${bookingCode(createdBooking)} dan DP ${formatCurrency(Number(paymentForm.deposit_amount))} berhasil dicatat.`,
        'DP walk-in berhasil',
      )
    } else {
      snackbar.success(
        `${bookingCode(createdBooking)} berhasil dibuat tanpa pembayaran awal.`,
        'Booking berhasil disimpan',
      )
    }

    try {
      await fetchAll(false)
    } catch {
      snackbar.warning('Transaksi sudah tersimpan, tetapi daftar booking terbaru belum dapat dimuat.')
    }
  }

  function addProduct(product: Product) {
    const existing = form.items.find((line) => line.product_id === product.id)
    if (existing) existing.quantity += 1
    else form.items.push({ product_id: product.id, quantity: 1 })
  }

  function updateProductQuantity(productId: number, quantity: number) {
    const line = form.items.find((item) => item.product_id === productId)
    if (!line) return
    if (quantity < 1) {
      removeProduct(productId)
      return
    }
    line.quantity = Math.floor(quantity)
  }

  function removeProduct(productId: number) {
    const index = form.items.findIndex((item) => item.product_id === productId)
    if (index >= 0) form.items.splice(index, 1)
  }

  function cartQuantityFor(productId: number) {
    return form.items.find((item) => item.product_id === productId)?.quantity || 0
  }

  function isLineAvailable(result: AvailabilityResult | undefined, requestedQuantity: number) {
    if (!result || result.available === false || result.is_available === false) return false
    const availableQuantity = result.available_quantity ?? result.quantity_available
    return typeof availableQuantity !== 'number' || availableQuantity >= requestedQuantity
  }

  function availabilityMessage(productId: number, quantity: number) {
    const result = store.availabilityResults[productId]
    if (!result) return ''
    if (!isLineAvailable(result, quantity)) return result.message || 'Tidak tersedia'
    return result.message || 'Tersedia'
  }

  function productImage(product: Product) {
    const images = [...(product.images || [])]
    images.sort((left, right) =>
      Number(right.is_primary) - Number(left.is_primary)
      || left.sort_order - right.sort_order
      || left.id - right.id,
    )
    return images[0]?.image_url || null
  }

  function pricingLabel(value: string) {
    return PRICING_TYPE_LABELS[value as PricingType] || value.replace(/_/g, ' ')
  }

  function productRate(product: Product) {
    const now = Date.now()
    return store.prices.find((price) => {
      const startsAt = price.start_at ? new Date(price.start_at).getTime() : null
      const endsAt = price.end_at ? new Date(price.end_at).getTime() : null
      return (
        price.product_id === product.id
        && price.is_active
        && price.pricing_type === product.default_pricing_type
        && (!startsAt || startsAt <= now)
        && (!endsAt || endsAt >= now)
      )
    })
  }

  function rentalDurationHours() {
    const start = new Date(form.start_at).getTime()
    const end = new Date(form.end_at).getTime()
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0
    return (end - start) / 3_600_000
  }

  function syncDailyRentalEnd() {
    if (!form.start_at || !form.items.length) return

    const isDailyRental = form.items.every((line) => {
      const product = products.products.find((item) => item.id === line.product_id)
      return product?.default_pricing_type === 'daily'
    })
    if (!isDailyRental) return

    const end = new Date(form.start_at)
    if (Number.isNaN(end.getTime())) return

    end.setDate(end.getDate() + 1)
    form.end_at = toLocalDateTimeInput(end)
  }

  function estimatedProductCost(product: Product, quantity: number) {
    const rate = productRate(product)
    if (!rate) return null

    const price = Number(rate.price)
    if (!Number.isFinite(price)) return null

    const durationHours = rentalDurationHours()
    if (durationHours <= 0) return 0

    const unitHours: Partial<Record<Product['default_pricing_type'], number>> = {
      hourly: 1,
      daily: 24,
      weekly: 24 * 7,
      monthly: 24 * 30,
    }
    const pricingUnitHours = unitHours[rate.pricing_type as Product['default_pricing_type']]
    const packageDuration = Math.max(1, Number(rate.duration || 1))
    const billedPackages = pricingUnitHours
      ? Math.ceil(
          Math.max(
            durationHours / pricingUnitHours,
            Number(product.minimum_rental_duration || 1),
          ) / packageDuration,
        )
      : 1

    return price * Math.max(1, billedPackages) * Math.max(1, Number(quantity || 1))
  }

  function productRateLabel(product: Product) {
    const rate = productRate(product)
    if (!rate) return pricingLabel(product.default_pricing_type)
    const duration = Number(rate.duration || 1)
    return `${formatCurrency(Number(rate.price || 0))} / ${duration > 1 ? `${duration} ` : ''}${pricingLabel(rate.pricing_type).replace(/^Per /, '').toLowerCase()}`
  }

  function resetFilters() {
    search.value = ''
    statusFilter.value = ''
    dateFilter.value = ''
  }

  function bookingCode(booking: Booking) {
    return booking.booking_number || booking.code || booking.reference || `BKG-${booking.id}`
  }

  function customerName(booking: Booking) {
    return booking.customer?.name || `Pelanggan #${booking.customer_id || '-'}`
  }

  function bookingStart(booking: Booking) {
    return booking.start_at || booking.start_date || booking.pickup_at || booking.created_at || ''
  }

  function bookingEnd(booking: Booking) {
    return booking.end_at || booking.end_date || booking.return_at || ''
  }

  function bookingTotal(booking: Booking) {
    return Number(booking.grand_total ?? booking.total_amount ?? 0)
  }

  function statusLabel(status: string) {
    const normalized = normalizeStatus(status)
    const labels: Record<string, string> = {
      draft: 'Draft',
      pending: 'Menunggu',
      waiting: 'Antrean',
      confirmed: 'Dikonfirmasi',
      unpaid: 'Belum dibayar',
      partial: 'Dibayar sebagian',
      partially_paid: 'Dibayar sebagian',
      paid: 'Lunas',
      active: 'Aktif',
      ongoing: 'Berjalan',
      completed: 'Selesai',
      finished: 'Selesai',
      returned: 'Dikembalikan',
      success: 'Berhasil',
      settled: 'Lunas',
      failed: 'Gagal',
      refunded: 'Dikembalikan dana',
      cancelled: 'Dibatalkan',
      canceled: 'Dibatalkan',
      expired: 'Kedaluwarsa',
    }
    return labels[normalized] || normalized.replace(/_/g, ' ')
  }

  function statusTone(status: string): 'success' | 'danger' | 'info' | 'warning' {
    const normalized = normalizeStatus(status)
    if (['confirmed', 'paid', 'success', 'settled', 'completed', 'finished', 'returned'].includes(normalized)) return 'success'
    if (['cancelled', 'canceled', 'expired', 'rejected', 'failed'].includes(normalized)) return 'danger'
    if (['active', 'ongoing', 'partial', 'partially_paid'].includes(normalized)) return 'info'
    return 'warning'
  }

  function normalizeHistory(entry: BookingHistory, index: number) {
    const targetStatus = entry.to_status || entry.status || ''
    const sourceStatus = entry.from_status || ''
    const event = entry.event || entry.action || ''
    const title =
      entry.title
      || (targetStatus
        ? sourceStatus
          ? `${statusLabel(sourceStatus)} → ${statusLabel(targetStatus)}`
          : `Status ${statusLabel(targetStatus)}`
        : event
          ? event.replace(/_/g, ' ')
          : 'Aktivitas booking')

    return {
      id: entry.id || `${event || 'history'}-${index}`,
      title,
      description: entry.description || entry.notes || '',
      status: targetStatus,
      actor: entry.user?.name || entry.actor?.name || 'Sistem',
      timestamp: entry.created_at || entry.occurred_at || '',
    }
  }

  function paymentCode(payment: NonNullable<Booking['payments']>[number]) {
    return payment.payment_code || payment.reference || `PAY-${payment.id}`
  }

  function paymentMethod(payment: NonNullable<Booking['payments']>[number]) {
    return (payment.payment_method || payment.method || 'Tidak dicatat').replace(/_/g, ' ')
  }

  function itemSubtotal(item: BookingItem) {
    if (item.subtotal !== null && item.subtotal !== undefined) return Number(item.subtotal) || 0
    return Number(item.unit_price ?? item.price ?? 0) * Number(item.quantity || 1)
  }

  function formatDate(value: string) {
    if (!value) return 'Belum dijadwalkan'
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

  watch(
    () => [form.start_at, form.end_at, JSON.stringify(form.items)],
    () => store.resetAvailability(),
  )

  watch(
    () => [
      form.start_at,
      form.items.map((line) => line.product_id).join(','),
    ],
    syncDailyRentalEnd,
  )

  watch(contextKey, (nextContext, previousContext) => {
    if (nextContext !== previousContext && initializedContext.value) {
      store.reset()
      initialize(true).catch(() => undefined)
    }
  })

  return reactive({
    auth,
    store,
    products,
    engines,
    salesOrders,
    mode,
    salesEngineEnabled,
    salesBusy,
    createOpen,
    checkoutOpen,
    customerCreateOpen,
    paymentDialogOpen,
    detailOpen,
    currentBooking,
    actionTarget,
    search,
    statusFilter,
    dateFilter,
    form,
    paymentForm,
    customerForm,
    paymentDialogForm,
    customerStore,
    activeProducts,
    categoryOptions,
    filteredCatalogProducts,
    cartItems,
    cartQuantity,
    checkoutBusy,
    estimatedPricing,
    estimatedRentalDuration,
    catalogSearch,
    catalogCategoryId,
    customerOptions,
    statusOptions,
    filteredBookings,
    pendingCount,
    activeCount,
    completedCount,
    availabilityState,
    historyEntries,
    canCheckOut,
    canCancel,
    canReturn,
    canRecordPayment,
    paidAmount,
    outstandingAmount,
    initialize,
    fetchAll,
    openCreate,
    setMode,
    validateCart,
    submitSale,
    openDetail,
    closeDetail,
    refreshDetail,
    requestStatusAction,
    cancelStatusAction,
    confirmStatusAction,
    closeCreate,
    openCheckout,
    closeCheckout,
    openPaymentDialog,
    closePaymentDialog,
    submitPaymentDialog,
    openCustomerCreate,
    closeCustomerCreate,
    submitCustomer,
    checkAvailability,
    submit,
    addProduct,
    updateProductQuantity,
    removeProduct,
    cartQuantityFor,
    isLineAvailable,
    availabilityMessage,
    productImage,
    pricingLabel,
    productRate,
    productRateLabel,
    resetFilters,
    bookingCode,
    customerName,
    bookingStart,
    bookingEnd,
    bookingTotal,
    statusLabel,
    statusTone,
    paymentCode,
    paymentMethod,
    itemSubtotal,
    formatDate,
    formatCurrency,
  })
}

export type BookingPresenter = ReturnType<typeof useBookingPresenter>

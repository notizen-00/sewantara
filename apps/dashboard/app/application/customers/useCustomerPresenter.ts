import type { CustomerCreatePayload } from '~/domain/customer'

interface CustomerFormState {
  name: string
  email: string
  phone: string
  whatsapp: string
  address: string
}

function createCustomerForm(): CustomerFormState {
  return {
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
  }
}

export function useCustomerPresenter() {
  const auth = useAuthStore()
  const store = useCustomerStore()
  const snackbar = useSnackbarStore()
  const createOpen = ref(false)
  const search = ref('')
  const initializedContext = ref('')
  const form = reactive<CustomerFormState>(createCustomerForm())

  const contextKey = computed(() => `${auth.tenantId}:${auth.branchId}`)
  const filteredCustomers = computed(() => {
    const keyword = search.value.trim().toLowerCase()
    if (!keyword) return store.items

    return store.items.filter((customer) =>
      [
        customer.name,
        customer.email || '',
        customer.phone || '',
        customer.whatsapp || '',
        customer.address || '',
      ].some((value) => value.toLowerCase().includes(keyword)),
    )
  })
  const customersWithPhone = computed(() =>
    store.items.filter((customer) => customer.phone || customer.whatsapp).length,
  )
  const customersWithEmail = computed(() =>
    store.items.filter((customer) => customer.email).length,
  )

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

    try {
      await fetchAll(false)
      initializedContext.value = contextKey.value
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : 'Data pelanggan gagal dimuat.')
    }
  }

  function openCreate() {
    Object.assign(form, createCustomerForm())
    createOpen.value = true
  }

  function closeCreate() {
    if (!store.creating) createOpen.value = false
  }

  function toPayload(): CustomerCreatePayload | null {
    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()
    const phone = form.phone.trim()
    const whatsapp = form.whatsapp.trim()

    if (!name) {
      snackbar.warning('Nama pelanggan wajib diisi.')
      return null
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      snackbar.warning('Format email pelanggan belum valid.')
      return null
    }
    if (phone && !/^[+\d][\d\s().-]{6,19}$/.test(phone)) {
      snackbar.warning('Format nomor telepon belum valid.')
      return null
    }
    if (whatsapp && !/^[+\d][\d\s().-]{6,19}$/.test(whatsapp)) {
      snackbar.warning('Format nomor WhatsApp belum valid.')
      return null
    }

    return {
      name,
      email: email || null,
      phone: phone || null,
      whatsapp: whatsapp || null,
      address: form.address.trim() || null,
    }
  }

  async function submit() {
    const payload = toPayload()
    if (!payload) return

    try {
      const customer = await store.create(payload)
      createOpen.value = false
      await fetchAll(false)
      snackbar.success(`Pelanggan “${customer.name}” berhasil ditambahkan.`)
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

  function formatDate(value?: string | null) {
    if (!value) return 'Belum tersedia'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  function resetSearch() {
    search.value = ''
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
    createOpen,
    search,
    filteredCustomers,
    customersWithPhone,
    customersWithEmail,
    form,
    initialize,
    fetchAll,
    openCreate,
    closeCreate,
    submit,
    initials,
    formatDate,
    resetSearch,
  })
}

export type CustomerPresenter = ReturnType<typeof useCustomerPresenter>

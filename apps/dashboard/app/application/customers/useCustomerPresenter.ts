import type { Customer, CustomerCreatePayload, CustomerDocumentType } from '~/domain/customer'

interface CustomerFormState {
  name: string
  email: string
  phone: string
  whatsapp: string
  address: string
}

interface DocumentFormState {
  document_type: CustomerDocumentType
  document_number: string
  expired_at: string
  front: File | null
  back: File | null
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

function createDocumentForm(): DocumentFormState {
  return {
    document_type: 'ktp',
    document_number: '',
    expired_at: '',
    front: null,
    back: null,
  }
}

const DOCUMENT_TYPE_LABELS: Record<CustomerDocumentType, string> = {
  ktp: 'KTP',
  sim: 'SIM',
  passport: 'Paspor',
  other: 'Lainnya',
}

export function useCustomerPresenter() {
  const auth = useAuthStore()
  const store = useCustomerStore()
  const snackbar = useSnackbarStore()
  const createOpen = ref(false)
  const mode = ref<'create' | 'edit'>('create')
  const editingId = ref<number | null>(null)
  const search = ref('')
  const initializedContext = ref('')
  const form = reactive<CustomerFormState>(createCustomerForm())
  const documentForm = reactive<DocumentFormState>(createDocumentForm())
  const documentTypeOptions = (Object.keys(DOCUMENT_TYPE_LABELS) as CustomerDocumentType[]).map((value) => ({
    label: DOCUMENT_TYPE_LABELS[value],
    value,
  }))

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
  const documents = computed(() => store.detail?.documents || [])

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
    Object.assign(documentForm, createDocumentForm())
    mode.value = 'create'
    editingId.value = null
    store.detail = null
    createOpen.value = true
  }

  async function openEdit(customer: Customer) {
    Object.assign(form, {
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      whatsapp: customer.whatsapp || '',
      address: customer.address || '',
    })
    Object.assign(documentForm, createDocumentForm())
    mode.value = 'edit'
    editingId.value = customer.id
    createOpen.value = true

    try {
      await store.fetchDetail(customer.id)
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function closeCreate() {
    if (!store.creating && !store.updating) createOpen.value = false
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
      if (mode.value === 'edit' && editingId.value) {
        const customer = await store.update(editingId.value, {
          name: payload.name,
          email: payload.email,
          phone: payload.phone || undefined,
        })
        await fetchAll(false)
        snackbar.success(`Pelanggan “${customer.name}” berhasil diperbarui.`)
      } else {
        const customer = await store.create(payload)
        createOpen.value = false
        await fetchAll(false)
        snackbar.success(`Pelanggan “${customer.name}” berhasil ditambahkan.`)
      }
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function setDocumentFront(file: File | null) {
    documentForm.front = file
  }

  function setDocumentBack(file: File | null) {
    documentForm.back = file
  }

  async function submitDocument() {
    if (!editingId.value) return
    if (!documentForm.front) {
      snackbar.warning('Pilih foto depan dokumen terlebih dahulu.')
      return
    }

    try {
      await store.uploadDocument(editingId.value, {
        document_type: documentForm.document_type,
        document_number: documentForm.document_number.trim() || null,
        expired_at: documentForm.expired_at || null,
        front: documentForm.front,
        back: documentForm.back,
      })
      Object.assign(documentForm, createDocumentForm())
      snackbar.success('Dokumen identitas berhasil ditambahkan.')
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  async function verifyDocument(documentId: number) {
    if (!editingId.value) return
    try {
      await store.verifyDocument(editingId.value, documentId)
      snackbar.success('Dokumen berhasil diverifikasi.')
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  async function removeDocument(documentId: number) {
    if (!editingId.value) return
    try {
      await store.deleteDocument(editingId.value, documentId)
      snackbar.success('Dokumen berhasil dihapus.')
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  function documentTypeLabel(type: CustomerDocumentType) {
    return DOCUMENT_TYPE_LABELS[type] || type
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
    mode,
    editingId,
    search,
    filteredCustomers,
    customersWithPhone,
    customersWithEmail,
    documents,
    form,
    documentForm,
    documentTypeOptions,
    initialize,
    fetchAll,
    openCreate,
    openEdit,
    closeCreate,
    submit,
    setDocumentFront,
    setDocumentBack,
    submitDocument,
    verifyDocument,
    removeDocument,
    documentTypeLabel,
    initials,
    formatDate,
    resetSearch,
  })
}

export type CustomerPresenter = ReturnType<typeof useCustomerPresenter>

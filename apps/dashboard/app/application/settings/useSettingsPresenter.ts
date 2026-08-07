import type {
  EditableSettingsSection,
  SettingsBookingForm,
  SettingsBrandingForm,
  SettingsBusinessForm,
  SettingsForms,
  SettingsImageType,
  SettingsPaymentForm,
  SettingsRentalForm,
  SettingsSectionKey,
  TenantSettingsUpdatePayload,
} from '~/domain/settings'
import { toPaymentsPayload } from '~/domain/settings'
import { resolveTenantSite } from '~/domain/tenantSite'

const editableSections: EditableSettingsSection[] = ['business', 'branding', 'rental', 'booking', 'payments']

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function createBusinessForm(): SettingsBusinessForm {
  return {
    business_name: '',
    timezone: 'Asia/Jakarta',
    currency: 'IDR',
    default_language: 'id',
    date_format: 'DD/MM/YYYY',
    time_format: 'HH:mm',
    branch_name: '',
    branch_phone: '',
    branch_address: '',
    branch_is_active: true,
  }
}

function createBrandingForm(): SettingsBrandingForm {
  return {
    primary_color: '#BE123C',
    secondary_color: '#F59E0B',
  }
}

function createRentalForm(): SettingsRentalForm {
  return {
    rental_model: 'per_day',
    booking_strategy: 'date_range',
    allocation_strategy: 'auto_assign',
    slot_duration_minutes: null,
    enable_waiting_list: false,
  }
}

function createBookingForm(): SettingsBookingForm {
  return {
    allow_online_booking: true,
    allow_walk_in: true,
    enable_waiting_list: false,
    allocation_strategy: 'auto_assign',
    auto_reminder: true,
    auto_cancel_unpaid: true,
    auto_cancel_minutes: 30,
  }
}

function createPaymentForm(): SettingsPaymentForm {
  return {
    cashEnabled: true,
    transferEnabled: false,
    bankName: '',
    accountNumber: '',
    accountName: '',
  }
}

function createForms(): SettingsForms {
  return {
    business: createBusinessForm(),
    branding: createBrandingForm(),
    rental: createRentalForm(),
    booking: createBookingForm(),
    payments: createPaymentForm(),
  }
}

export function useSettingsPresenter() {
  const auth = useAuthStore()
  const branches = useBranchStore()
  const store = useSettingsStore()
  const snackbar = useSnackbarStore()
  const selectedSection = ref<SettingsSectionKey>('business')
  const initializedContext = ref('')
  const forms = reactive<SettingsForms>(createForms())
  const savedForms = ref<SettingsForms>(createForms())

  const contextKey = computed(() => `${auth.tenantId}:${auth.branchId}`)
  const isEditable = computed(() =>
    editableSections.some((section) => section === selectedSection.value),
  )
  const dirtySections = computed<SettingsSectionKey[]>(() =>
    editableSections.filter((section) => JSON.stringify(forms[section]) !== JSON.stringify(savedForms.value[section])),
  )
  const isDirty = computed(() => dirtySections.value.some((section) => section === selectedSection.value))
  const isSaving = computed(() => store.savingSection === selectedSection.value)
  const canSave = computed(() => isEditable.value && isDirty.value && !store.loading && !store.savingSection)
  const websiteEnabled = computed(() => store.snapshot?.website_status?.is_enabled ?? false)
  const tenantSite = computed(() =>
    resolveTenantSite(auth.session?.tenant, String(useRuntimeConfig().public.tenantBaseDomain || '')),
  )

  function hydrateForms() {
    const snapshot = store.snapshot
    const operational = store.operationalSnapshot
    if (!snapshot) return

    Object.assign(forms.business, createBusinessForm(), {
      business_name: snapshot.regular.business_name || auth.session?.tenant.name || '',
      timezone: snapshot.regular.timezone || 'Asia/Jakarta',
      currency: snapshot.regular.currency || 'IDR',
      default_language: snapshot.regular.default_language || 'id',
      date_format: snapshot.regular.date_format || 'DD/MM/YYYY',
      time_format: snapshot.regular.time_format || 'HH:mm',
      branch_name: snapshot.branch.name || auth.session?.branch.name || '',
      branch_phone: snapshot.branch.phone || '',
      branch_address: snapshot.branch.address || '',
      branch_is_active: snapshot.branch.is_active ?? true,
    })

    Object.assign(forms.branding, createBrandingForm(), {
      primary_color: snapshot.branding.primary_color || '#BE123C',
      secondary_color: snapshot.branding.secondary_color || '#F59E0B',
    })
    Object.assign(forms.rental, createRentalForm(), snapshot.rental_engine || {})

    const booking = operational?.booking_configuration as Partial<SettingsBookingForm> | undefined
    Object.assign(forms.booking, createBookingForm(), booking || {})
    Object.assign(forms.payments, createPaymentForm())

    for (const method of operational?.payment_methods || []) {
      if (method.method === 'cash') forms.payments.cashEnabled = method.is_enabled
      if (method.method === 'transfer') {
        forms.payments.transferEnabled = method.is_enabled
        const configuration = method.configuration || {}
        forms.payments.bankName = typeof configuration.bank_name === 'string' ? configuration.bank_name : ''
        forms.payments.accountNumber =
          typeof configuration.account_number === 'string' ? configuration.account_number : ''
        forms.payments.accountName =
          typeof configuration.account_name === 'string' ? configuration.account_name : ''
      }
    }

    savedForms.value = clone(toRaw(forms))
  }

  async function initialize(force = false) {
    if (!force && initializedContext.value === contextKey.value && store.snapshot) return
    try {
      await store.fetchSettings()
      hydrateForms()
      initializedContext.value = contextKey.value
    } catch (err) {
      snackbar.error(
        err instanceof Error ? err.message : 'Pengaturan workspace gagal dimuat.',
        'Pengaturan tidak tersedia',
      )
      throw err
    }
  }

  function selectSection(section: SettingsSectionKey) {
    selectedSection.value = section
    store.clearFeedback()
  }

  function validateCurrent() {
    if (selectedSection.value === 'business') {
      if (!forms.business.business_name.trim() || !forms.business.branch_name.trim()) {
        snackbar.warning('Nama bisnis dan nama cabang wajib diisi.')
        return false
      }
    }
    if (
      selectedSection.value === 'branding'
      && (
        !/^#[0-9A-F]{6}$/i.test(forms.branding.primary_color)
        || !/^#[0-9A-F]{6}$/i.test(forms.branding.secondary_color)
      )
    ) {
      snackbar.warning('Warna branding harus menggunakan format hex, misalnya #BE123C.')
      return false
    }
    if (selectedSection.value === 'rental') {
      const needsSlot = ['queue', 'session'].includes(forms.rental.booking_strategy)
      if (needsSlot && (!forms.rental.slot_duration_minutes || forms.rental.slot_duration_minutes < 1)) {
        snackbar.warning('Durasi slot wajib diisi untuk strategi antrean atau sesi.')
        return false
      }
    }
    if (
      selectedSection.value === 'booking'
      && forms.booking.auto_cancel_unpaid
      && (!forms.booking.auto_cancel_minutes || forms.booking.auto_cancel_minutes < 5)
    ) {
      snackbar.warning('Batas pembatalan otomatis minimal 5 menit.')
      return false
    }
    if (selectedSection.value === 'payments') {
      if (!forms.payments.cashEnabled && !forms.payments.transferEnabled) {
        snackbar.warning('Aktifkan minimal satu metode pembayaran.')
        return false
      }
      if (
        forms.payments.transferEnabled
        && (!forms.payments.bankName.trim()
          || !forms.payments.accountNumber.trim()
          || !forms.payments.accountName.trim())
      ) {
        snackbar.warning('Lengkapi informasi rekening untuk pembayaran transfer.')
        return false
      }
    }
    return true
  }

  function markSaved(section: EditableSettingsSection) {
    if (section === 'business') savedForms.value.business = clone(toRaw(forms.business))
    if (section === 'branding') savedForms.value.branding = clone(toRaw(forms.branding))
    if (section === 'rental') savedForms.value.rental = clone(toRaw(forms.rental))
    if (section === 'booking') savedForms.value.booking = clone(toRaw(forms.booking))
    if (section === 'payments') savedForms.value.payments = clone(toRaw(forms.payments))
  }

  async function saveCurrent() {
    store.clearFeedback()
    if (!validateCurrent()) return false
    const section = selectedSection.value

    try {
      if (section === 'business') {
        const payload: TenantSettingsUpdatePayload = {
          regular: {
            business_name: forms.business.business_name.trim(),
            timezone: forms.business.timezone,
            currency: forms.business.currency,
            default_language: forms.business.default_language,
            date_format: forms.business.date_format,
            time_format: forms.business.time_format,
          },
          branch: {
            name: forms.business.branch_name.trim(),
            phone: forms.business.branch_phone.trim() || null,
            address: forms.business.branch_address.trim() || null,
            is_active: forms.business.branch_is_active,
          },
        }
        await store.updateBusiness(payload)
        await auth.fetchSession()
        if (auth.hasGlobalBranchAccess) await branches.fetchAll()
        else branches.useCurrentBranch(auth.session?.branch)
      } else if (section === 'branding') {
        await store.updateBranding({
          branding: {
            primary_color: forms.branding.primary_color,
            secondary_color: forms.branding.secondary_color,
          },
        })
      } else if (section === 'rental') {
        await store.updateRental({ rental_engine: clone(toRaw(forms.rental)) })
      } else if (section === 'booking') {
        await store.updateBooking(clone(toRaw(forms.booking)))
      } else if (section === 'payments') {
        await store.updatePayments(toPaymentsPayload(forms.payments))
      } else {
        return false
      }

      markSaved(section)
      snackbar.success(store.success || 'Perubahan pengaturan berhasil disimpan.')
      return true
    } catch (err) {
      snackbar.error(
        store.error || auth.error || (err instanceof Error ? err.message : 'Perubahan gagal disimpan.'),
      )
      return false
    }
  }

  function resetCurrent() {
    if (selectedSection.value === 'business') Object.assign(forms.business, clone(savedForms.value.business))
    if (selectedSection.value === 'branding') Object.assign(forms.branding, clone(savedForms.value.branding))
    if (selectedSection.value === 'rental') Object.assign(forms.rental, clone(savedForms.value.rental))
    if (selectedSection.value === 'booking') Object.assign(forms.booking, clone(savedForms.value.booking))
    if (selectedSection.value === 'payments') Object.assign(forms.payments, clone(savedForms.value.payments))
    store.clearFeedback()
    snackbar.info('Perubahan pada bagian ini telah dibatalkan.', 'Perubahan dibatalkan')
  }

  function validateImage(image: SettingsImageType, file: File) {
    const allowed = image === 'favicon'
      ? ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon']
      : ['image/jpeg', 'image/png', 'image/webp']
    const maximum = image === 'favicon' ? 1024 * 1024 : 5 * 1024 * 1024

    const extension = file.name.split('.').pop()?.toLowerCase()
    const extensionAllowed = image === 'favicon'
      ? ['png', 'ico'].includes(extension || '')
      : ['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')
    if (!allowed.includes(file.type) && !extensionAllowed) {
      snackbar.warning(image === 'favicon' ? 'Favicon harus berupa PNG atau ICO.' : 'Gambar harus berupa JPG, PNG, atau WEBP.')
      return false
    }
    if (file.size > maximum) {
      snackbar.warning(`Ukuran ${image === 'favicon' ? 'favicon maksimal 1 MB' : 'gambar maksimal 5 MB'}.`)
      return false
    }
    return true
  }

  async function uploadImage(image: SettingsImageType, file: File) {
    if (!validateImage(image, file)) return
    try {
      await store.uploadImage(image, file)
      snackbar.success('Gambar branding berhasil diperbarui.')
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  async function deleteImage(image: SettingsImageType) {
    try {
      await store.deleteImage(image)
      snackbar.success('Gambar branding berhasil dihapus.')
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  async function toggleWebsiteStatus() {
    const nextValue = !websiteEnabled.value
    try {
      await store.updateWebsiteStatus(nextValue)
      snackbar.success(nextValue ? 'Situs tenant sekarang aktif dan dapat diakses publik.' : 'Situs tenant dinonaktifkan.')
    } catch (err) {
      snackbar.error(err instanceof Error ? err.message : store.error)
    }
  }

  watch(contextKey, (nextContext, previousContext) => {
    if (nextContext !== previousContext && initializedContext.value) {
      initialize(true).catch(() => undefined)
    }
  })

  return reactive({
    auth,
    branches,
    store,
    forms,
    selectedSection,
    dirtySections,
    isDirty,
    isSaving,
    canSave,
    websiteEnabled,
    tenantSite,
    initialize,
    selectSection,
    saveCurrent,
    resetCurrent,
    uploadImage,
    deleteImage,
    toggleWebsiteStatus,
  })
}

export type SettingsPresenter = ReturnType<typeof useSettingsPresenter>

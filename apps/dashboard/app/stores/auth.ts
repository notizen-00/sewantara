import { defineStore } from 'pinia'
import type {
  LoginResult,
  RegisterPayload,
  RegisterResult,
  TenantSession,
} from '~/domain/mitra'
import { useAuthRepository } from '~/infrastructure/repositories/authRepository'
import * as storage from '~/infrastructure/storage/localStorage'

const storageKeys = {
  token: 'sewantara.access_token',
  tenant: 'sewantara.tenant_id',
  branch: 'sewantara.branch_id',
  businessType: 'sewantara.business_type',
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('')
  const tenantId = ref('')
  const branchId = ref('1')
  const businessType = ref('')
  const session = ref<TenantSession | null>(null)
  const registeredTenant = ref<RegisterResult | null>(null)
  const loading = ref(false)
  const tenantSwitching = ref(false)
  const branchSwitching = ref(false)
  const error = ref('')

  const otpEmail = ref('')
  const otpVerified = ref(false)
  const otpRequesting = ref(false)
  const otpVerifying = ref(false)

  const isAuthenticated = computed(() => Boolean(accessToken.value && tenantId.value))
  const tenantStatus = computed(() => session.value?.tenant.status || 'onboarding')
  const subscription = computed(() => session.value?.subscription || null)
  const roles = computed(() => session.value?.roles || session.value?.user.roles || [])
  const hasGlobalBranchAccess = computed(() =>
    roles.value.some((role) => role.code === 'owner' && role.pivot?.branch_id === null),
  )
  const activeBranch = computed(() => session.value?.branch || null)
  const activeWorkspace = computed(() => ({
    tenantId: tenantId.value,
    tenantName: session.value?.tenant.id === tenantId.value ? session.value.tenant.name : '',
    branchId: branchId.value,
    branchName: session.value?.branch.id === Number(branchId.value) ? session.value.branch.name : '',
  }))

  function persist() {
    if (accessToken.value) storage.writeString(storageKeys.token, accessToken.value)
    if (tenantId.value) storage.writeString(storageKeys.tenant, tenantId.value)
    if (branchId.value) storage.writeString(storageKeys.branch, branchId.value)
    if (businessType.value) storage.writeString(storageKeys.businessType, businessType.value)
  }

  function setTenantContext(nextTenantId: string, nextBranchId: string | number) {
    tenantId.value = nextTenantId
    branchId.value = String(nextBranchId)
    persist()
  }

  function syncBranchId(nextBranchId: string | number) {
    const normalizedBranchId = Number(nextBranchId)
    if (!Number.isInteger(normalizedBranchId) || normalizedBranchId < 1) return

    branchId.value = String(normalizedBranchId)
    persist()
  }

  function clearPersisted() {
    Object.values(storageKeys).forEach(storage.remove)
  }

  function hydrateFromStorage() {
    if (!process.client) return
    accessToken.value = storage.readString(storageKeys.token)
    tenantId.value = storage.readString(storageKeys.tenant)
    branchId.value = storage.readString(storageKeys.branch) || '1'
    businessType.value = storage.readString(storageKeys.businessType)
  }

  function clearSession() {
    accessToken.value = ''
    tenantId.value = ''
    branchId.value = '1'
    businessType.value = ''
    session.value = null
    clearPersisted()
  }

  async function register(payload: RegisterPayload) {
    loading.value = true
    error.value = ''

    try {
      const response = await useAuthRepository().register(payload)
      registeredTenant.value = response.data
      tenantId.value = response.data.tenant.id
      businessType.value = payload.business_type
      persist()
      resetOtp()
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registrasi tenant gagal.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = ''

    try {
      const response = await useAuthRepository().login(email, password)
      applyLoginResult(response.data)
      await fetchSession()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login gagal.'
      clearSession()
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loginWithGoogleCode(code: string) {
    loading.value = true
    error.value = ''

    try {
      const response = await useAuthRepository().exchangeGoogleCode(code)
      applyLoginResult(response.data)
      await fetchSession()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login dengan Google gagal.'
      clearSession()
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  function googleLoginUrl(deviceName = 'nuxt-web') {
    return useAuthRepository().googleRedirectUrl(deviceName)
  }

  function normalizeEmail(value: string) {
    return value.trim().toLowerCase()
  }

  async function requestOtp(email: string) {
    otpRequesting.value = true
    error.value = ''

    try {
      await useAuthRepository().requestOtp(email)
      otpEmail.value = normalizeEmail(email)
      otpVerified.value = false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Gagal mengirim kode verifikasi.'
      throw err
    } finally {
      otpRequesting.value = false
    }
  }

  async function verifyOtp(email: string, code: string) {
    otpVerifying.value = true
    error.value = ''

    try {
      await useAuthRepository().verifyOtp(email, code)
      otpEmail.value = normalizeEmail(email)
      otpVerified.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Kode verifikasi salah atau sudah kedaluwarsa.'
      throw err
    } finally {
      otpVerifying.value = false
    }
  }

  function isEmailOtpVerified(email: string) {
    return otpVerified.value && otpEmail.value === normalizeEmail(email || '')
  }

  function resetOtp() {
    otpEmail.value = ''
    otpVerified.value = false
  }

  function applyLoginResult(result: LoginResult) {
    accessToken.value = result.access_token
    tenantId.value = result.user.tenant_id
    persist()
  }

  async function fetchSession() {
    if (!isAuthenticated.value) return

    try {
      const response = await useAuthRepository().me()
      session.value = response.data
      businessType.value = response.data.tenant.business_type || businessType.value
      branchId.value = String(response.data.branch.id)
      persist()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Session tenant gagal dimuat.'
      throw err
    }
  }

  async function switchBranch(nextBranchId: number) {
    if (!Number.isInteger(nextBranchId) || nextBranchId < 1) return session.value

    const previousBranchId = branchId.value
    branchSwitching.value = true
    error.value = ''

    try {
      syncBranchId(nextBranchId)
      await fetchSession()
      return session.value
    } catch (err) {
      syncBranchId(previousBranchId)
      error.value = err instanceof Error ? err.message : 'Cabang aktif gagal diganti.'
      throw err
    } finally {
      branchSwitching.value = false
    }
  }

  async function switchTenant(nextTenantId: string, nextBranchId = 1) {
    const normalizedTenantId = nextTenantId.trim()
    if (!normalizedTenantId || !Number.isInteger(nextBranchId) || nextBranchId < 1) {
      return session.value
    }

    if (normalizedTenantId === tenantId.value && String(nextBranchId) === branchId.value) {
      return session.value
    }

    const previousTenantId = tenantId.value
    const previousBranchId = branchId.value
    const previousSession = session.value
    tenantSwitching.value = true
    error.value = ''

    try {
      setTenantContext(normalizedTenantId, nextBranchId)
      session.value = null
      await fetchSession()
      return session.value
    } catch (err) {
      setTenantContext(previousTenantId, previousBranchId)
      session.value = previousSession
      error.value = err instanceof Error ? err.message : 'Tenant aktif gagal diganti.'
      throw err
    } finally {
      tenantSwitching.value = false
    }
  }

  async function logout() {
    loading.value = true
    error.value = ''

    try {
      if (isAuthenticated.value) {
        await useAuthRepository().logout()
      }
    } catch {
      // Token lokal tetap dibersihkan supaya user tidak tersangkut di session rusak.
    } finally {
      clearSession()
      loading.value = false
    }
  }

  return {
    accessToken,
    tenantId,
    branchId,
    businessType,
    session,
    registeredTenant,
    subscription,
    loading,
    tenantSwitching,
    branchSwitching,
    error,
    otpEmail,
    otpVerified,
    otpRequesting,
    otpVerifying,
    isAuthenticated,
    tenantStatus,
    roles,
    hasGlobalBranchAccess,
    activeBranch,
    activeWorkspace,
    hydrateFromStorage,
    clearSession,
    register,
    login,
    loginWithGoogleCode,
    googleLoginUrl,
    requestOtp,
    verifyOtp,
    isEmailOtpVerified,
    resetOtp,
    fetchSession,
    syncBranchId,
    switchTenant,
    switchBranch,
    logout,
  }
})

import { defineStore } from 'pinia'
import type {
  BookingOnboardingPayload,
  OnboardingProgress,
  PaymentsOnboardingPayload,
} from '~/domain/mitra'
import type {
  EditableSettingsSection,
  SettingsImageType,
  TenantSettings,
  TenantSettingsUpdatePayload,
} from '~/domain/settings'
import { useSettingsRepository } from '~/infrastructure/repositories/settingsRepository'

export const useSettingsStore = defineStore('settings', () => {
  const snapshot = ref<TenantSettings | null>(null)
  const operationalSnapshot = ref<OnboardingProgress | null>(null)
  const loading = ref(false)
  const savingSection = ref<EditableSettingsSection | null>(null)
  const savingImage = ref<SettingsImageType | null>(null)
  const savingWebsiteStatus = ref(false)
  const error = ref('')
  const success = ref('')

  function clearFeedback() {
    error.value = ''
    success.value = ''
  }

  async function fetchSettings() {
    loading.value = true
    clearFeedback()

    try {
      const [settingsResult, operationalResult] = await Promise.allSettled([
        useSettingsRepository().get(),
        useSettingsRepository().getOperationalConfiguration(),
      ])
      if (settingsResult.status === 'rejected') throw settingsResult.reason

      snapshot.value = settingsResult.value.data
      operationalSnapshot.value =
        operationalResult.status === 'fulfilled' ? operationalResult.value.data : null
      return settingsResult.value.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pengaturan workspace gagal dimuat.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function saveSettings(
    section: 'business' | 'branding' | 'rental',
    message: string,
    payload: TenantSettingsUpdatePayload,
  ) {
    savingSection.value = section
    clearFeedback()
    try {
      const response = await useSettingsRepository().update(payload)
      snapshot.value = response.data
      success.value = message
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Perubahan pengaturan gagal disimpan.'
      throw err
    } finally {
      savingSection.value = null
    }
  }

  async function saveOperational(
    section: 'booking' | 'payments',
    message: string,
    action: () => Promise<{ data: OnboardingProgress }>,
  ) {
    savingSection.value = section
    clearFeedback()
    try {
      const response = await action()
      operationalSnapshot.value = response.data
      success.value = message
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Perubahan pengaturan gagal disimpan.'
      throw err
    } finally {
      savingSection.value = null
    }
  }

  function updateBusiness(payload: TenantSettingsUpdatePayload) {
    return saveSettings('business', 'Profil bisnis berhasil diperbarui.', payload)
  }

  function updateBranding(payload: TenantSettingsUpdatePayload) {
    return saveSettings('branding', 'Warna branding berhasil diperbarui.', payload)
  }

  function updateRental(payload: TenantSettingsUpdatePayload) {
    return saveSettings('rental', 'Model penyewaan berhasil diperbarui.', payload)
  }

  function updateBooking(payload: BookingOnboardingPayload) {
    return saveOperational(
      'booking',
      'Aturan booking berhasil diperbarui.',
      () => useSettingsRepository().updateBooking(payload),
    )
  }

  function updatePayments(payload: PaymentsOnboardingPayload) {
    return saveOperational(
      'payments',
      'Metode pembayaran berhasil diperbarui.',
      () => useSettingsRepository().updatePayments(payload),
    )
  }

  async function uploadImage(image: SettingsImageType, file: File) {
    savingImage.value = image
    clearFeedback()
    try {
      await useSettingsRepository().uploadImages({ [image]: file })
      const response = await useSettingsRepository().get()
      snapshot.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Gambar branding gagal diunggah.'
      throw err
    } finally {
      savingImage.value = null
    }
  }

  async function deleteImage(image: SettingsImageType) {
    savingImage.value = image
    clearFeedback()
    try {
      await useSettingsRepository().deleteImage(image)
      const response = await useSettingsRepository().get()
      snapshot.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Gambar branding gagal dihapus.'
      throw err
    } finally {
      savingImage.value = null
    }
  }

  async function updateWebsiteStatus(isEnabled: boolean) {
    savingWebsiteStatus.value = true
    clearFeedback()
    try {
      const response = await useSettingsRepository().updateWebsiteStatus(isEnabled)
      if (snapshot.value) snapshot.value.website_status = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Status situs gagal diperbarui.'
      throw err
    } finally {
      savingWebsiteStatus.value = false
    }
  }

  function reset() {
    snapshot.value = null
    operationalSnapshot.value = null
    savingSection.value = null
    savingImage.value = null
    savingWebsiteStatus.value = false
    clearFeedback()
  }

  return {
    snapshot,
    operationalSnapshot,
    loading,
    savingSection,
    savingImage,
    savingWebsiteStatus,
    error,
    success,
    clearFeedback,
    fetchSettings,
    updateBusiness,
    updateBranding,
    updateRental,
    updateBooking,
    updatePayments,
    uploadImage,
    deleteImage,
    updateWebsiteStatus,
    reset,
  }
})

import { defineStore } from 'pinia'
import type {
  BookingOnboardingPayload,
  BusinessOnboardingPayload,
  OnboardingProgress,
  PaymentsOnboardingPayload,
  RentalOnboardingPayload,
} from '~/domain/mitra'
import { useOnboardingRepository } from '~/infrastructure/repositories/onboardingRepository'

export const useOnboardingStore = defineStore('onboarding', () => {
  const progress = ref<OnboardingProgress | null>(null)
  const loading = ref(false)
  const error = ref('')

  const checklistItems = computed(() => {
    const checklist = progress.value?.checklist
    if (!checklist) return []

    return [
      ['business', 'Informasi usaha'],
      ['template', 'Template bisnis'],
      ['rental_configuration', 'Konfigurasi rental'],
      ['inventory', 'Inventory'],
      ['pricing', 'Pricing'],
      ['booking', 'Booking'],
      ['payment', 'Pembayaran'],
      ['branch', 'Cabang'],
      ['subscription', 'Paket'],
    ].map(([key, label]) => ({
      key,
      label,
      done: Boolean(checklist[key as keyof typeof checklist]),
    }))
  })

  const completion = computed(() => {
    if (!checklistItems.value.length) return 0
    const done = checklistItems.value.filter((item) => item.done).length
    return Math.round((done / checklistItems.value.length) * 100)
  })

  async function run(action: () => Promise<{ data: OnboardingProgress }>) {
    loading.value = true
    error.value = ''

    try {
      const response = await action()
      progress.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Onboarding gagal diproses.'
      throw err
    } finally {
      loading.value = false
    }
  }

  function fetchProgress() {
    return run(() => useOnboardingRepository().progress())
  }

  function saveBusiness(payload: BusinessOnboardingPayload) {
    return run(() => useOnboardingRepository().saveBusiness(payload))
  }

  function saveRental(payload: RentalOnboardingPayload) {
    return run(() => useOnboardingRepository().saveRental(payload))
  }

  function completeInventory() {
    return run(() => useOnboardingRepository().completeInventory())
  }

  function completePricing() {
    return run(() => useOnboardingRepository().completePricing())
  }

  function saveBooking(payload: BookingOnboardingPayload) {
    return run(() => useOnboardingRepository().saveBooking(payload))
  }

  function savePayments(payload: PaymentsOnboardingPayload) {
    return run(() => useOnboardingRepository().savePayments(payload))
  }

  function goLive() {
    return run(() => useOnboardingRepository().goLive())
  }

  function reset() {
    progress.value = null
    error.value = ''
  }

  return {
    progress,
    loading,
    error,
    checklistItems,
    completion,
    reset,
    fetchProgress,
    saveBusiness,
    saveRental,
    completeInventory,
    completePricing,
    saveBooking,
    savePayments,
    goLive,
  }
})

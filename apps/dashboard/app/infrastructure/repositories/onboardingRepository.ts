import type {
  BookingOnboardingPayload,
  BusinessOnboardingPayload,
  OnboardingProgress,
  PaymentsOnboardingPayload,
  RentalOnboardingPayload,
} from '~/domain/mitra'
import { useApiClient } from '~/composables/useApiClient'

export function useOnboardingRepository() {
  const api = useApiClient()

  return {
    progress: () => api.tenant<OnboardingProgress>('/onboarding'),
    saveBusiness: (payload: BusinessOnboardingPayload) =>
      api.tenant<OnboardingProgress>('/onboarding/business', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    saveRental: (payload: RentalOnboardingPayload) =>
      api.tenant<OnboardingProgress>('/onboarding/rental', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    completeInventory: () =>
      api.tenant<OnboardingProgress>('/onboarding/inventory/complete', { method: 'POST' }),
    completePricing: () =>
      api.tenant<OnboardingProgress>('/onboarding/pricing/complete', { method: 'POST' }),
    saveBooking: (payload: BookingOnboardingPayload) =>
      api.tenant<OnboardingProgress>('/onboarding/booking', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    savePayments: (payload: PaymentsOnboardingPayload) =>
      api.tenant<OnboardingProgress>('/onboarding/payments', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    goLive: () => api.tenant<OnboardingProgress>('/onboarding/go-live', { method: 'POST' }),
  }
}

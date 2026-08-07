import type {
  BookingOnboardingPayload,
  OnboardingProgress,
  PaymentsOnboardingPayload,
} from '~/domain/mitra'
import type {
  SettingsImageType,
  TenantSettings,
  TenantSettingsUpdatePayload,
  TenantWebsiteStatus,
} from '~/domain/settings'
import { useApiClient } from '~/composables/useApiClient'

export function useSettingsRepository() {
  const api = useApiClient()

  return {
    get: () => api.tenant<TenantSettings>('/settings'),
    getOperationalConfiguration: () => api.tenant<OnboardingProgress>('/onboarding'),
    update: (payload: TenantSettingsUpdatePayload) =>
      api.tenant<TenantSettings>('/settings', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    uploadImages: (files: Partial<Record<SettingsImageType, File>>) => {
      const body = new FormData()
      for (const [field, file] of Object.entries(files)) {
        if (file) body.append(field, file)
      }
      return api.tenant<TenantSettings>('/settings/images', { method: 'POST', body })
    },
    deleteImage: (image: SettingsImageType) =>
      api.tenant<null>(`/settings/images/${image}`, { method: 'DELETE' }),
    updateWebsiteStatus: (isEnabled: boolean) =>
      api.tenant<TenantWebsiteStatus>('/settings/website-status', {
        method: 'PATCH',
        body: JSON.stringify({ is_enabled: isEnabled }),
      }),
    updateBooking: (payload: BookingOnboardingPayload) =>
      api.tenant<OnboardingProgress>('/onboarding/booking', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    updatePayments: (payload: PaymentsOnboardingPayload) =>
      api.tenant<OnboardingProgress>('/onboarding/payments', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
  }
}

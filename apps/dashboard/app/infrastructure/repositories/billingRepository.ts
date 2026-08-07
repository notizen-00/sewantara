import type { SubscriptionCheckoutResult, SubscriptionPaymentResult } from '~/domain/mitra'
import { useApiClient } from '~/composables/useApiClient'

export function useBillingRepository() {
  const api = useApiClient()

  return {
    checkout: () =>
      api.tenant<SubscriptionCheckoutResult>('/subscription/payments/checkout', {
        method: 'POST',
      }),
    payment: (paymentId: string) =>
      api.tenant<SubscriptionPaymentResult>(`/subscription/payments/${encodeURIComponent(paymentId)}`),
  }
}

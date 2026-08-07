import { defineStore } from 'pinia'
import type { SubscriptionPayment } from '~/domain/mitra'
import { useBillingRepository } from '~/infrastructure/repositories/billingRepository'
import * as storage from '~/infrastructure/storage/localStorage'

const pendingPaymentKey = 'sewantara.subscription_payment_id'
const paymentHistoryKey = 'sewantara.subscription_payment_ids'

export const useBillingStore = defineStore('billing', () => {
  const payment = ref<SubscriptionPayment | null>(null)
  const history = ref<SubscriptionPayment[]>([])
  const loading = ref(false)
  const historyLoading = ref(false)
  const polling = ref(false)
  const error = ref('')
  let pollGeneration = 0

  const isPaid = computed(() => payment.value?.status === 'paid')
  const isPending = computed(() => payment.value?.status === 'pending')

  function rememberPayment(paymentId: string) {
    storage.writeString(pendingPaymentKey, paymentId)
    const ids = paymentHistoryIds().filter((id) => id !== paymentId)
    storage.writeStringList(paymentHistoryKey, [paymentId, ...ids].slice(0, 50))
  }

  function paymentHistoryIds() {
    return storage.readStringList(paymentHistoryKey)
  }

  function pendingPaymentId() {
    return storage.readString(pendingPaymentKey)
  }

  function clearPendingPayment() {
    storage.remove(pendingPaymentKey)
  }

  async function createCheckout() {
    if (loading.value) return null

    loading.value = true
    error.value = ''
    try {
      const response = await useBillingRepository().checkout()
      payment.value = response.data.payment
      rememberPayment(response.data.payment.id)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pembayaran gagal dimulai.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function redirectToCheckout() {
    const checkout = await createCheckout()
    if (checkout && process.client) window.location.assign(checkout.checkout.redirect_url)
    return checkout
  }

  async function fetchPayment(paymentId = pendingPaymentId()) {
    if (!paymentId) return null

    error.value = ''
    try {
      const response = await useBillingRepository().payment(paymentId)
      payment.value = response.data.payment
      const historyIndex = history.value.findIndex((item) => item.id === response.data.payment.id)
      if (historyIndex >= 0) history.value[historyIndex] = response.data.payment
      if (response.data.payment.status !== 'pending') clearPendingPayment()
      return response.data.payment
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Status pembayaran gagal dimuat.'
      throw err
    }
  }

  async function fetchHistory() {
    const pendingId = pendingPaymentId()
    const ids = [...new Set([pendingId, ...paymentHistoryIds()].filter(Boolean))]
    if (!ids.length) {
      history.value = []
      return history.value
    }

    historyLoading.value = true
    try {
      const repository = useBillingRepository()
      const results = await Promise.allSettled(ids.map((id) => repository.payment(id)))
      history.value = results
        .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof repository.payment>>> => result.status === 'fulfilled')
        .map((result) => result.value.data.payment)
        .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
      return history.value
    } finally {
      historyLoading.value = false
    }
  }

  function stopPolling() {
    pollGeneration += 1
    polling.value = false
  }

  async function pollPayment(options: { timeoutMs?: number; intervalMs?: number } = {}) {
    const paymentId = pendingPaymentId()
    if (!paymentId) return null

    const timeoutMs = options.timeoutMs ?? 120_000
    const intervalMs = options.intervalMs ?? 2_500
    const startedAt = Date.now()
    const generation = ++pollGeneration
    polling.value = true

    try {
      while (generation === pollGeneration && Date.now() - startedAt < timeoutMs) {
        const current = await fetchPayment(paymentId)
        if (!current || current.status !== 'pending') return current
        await new Promise((resolve) => setTimeout(resolve, intervalMs))
      }
      return payment.value
    } finally {
      if (generation === pollGeneration) polling.value = false
    }
  }

  return {
    payment,
    history,
    loading,
    historyLoading,
    polling,
    error,
    isPaid,
    isPending,
    pendingPaymentId,
    clearPendingPayment,
    createCheckout,
    redirectToCheckout,
    fetchPayment,
    fetchHistory,
    pollPayment,
    stopPolling,
  }
})

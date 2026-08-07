import { defineStore } from 'pinia'
import type { BusinessTemplate, Plan } from '~/domain/mitra'
import { useCatalogRepository } from '~/infrastructure/repositories/catalogRepository'

export const useCatalogStore = defineStore('catalog', () => {
  const templates = ref<BusinessTemplate[]>([])
  const plans = ref<Plan[]>([])
  const loading = ref(false)
  const error = ref('')
  const backendOnline = ref<boolean | null>(null)

  const monthlyPlans = computed(() => plans.value.filter((plan) => plan.invoice_interval === 'month'))

  async function fetchCatalog() {
    loading.value = true
    error.value = ''

    try {
      const repository = useCatalogRepository()
      const [healthResult, templateResult, planResult] = await Promise.allSettled([
        repository.health(),
        repository.templates(),
        repository.plans('month', 'IDR'),
      ])

      backendOnline.value = healthResult.status === 'fulfilled'

      if (templateResult.status === 'fulfilled') {
        templates.value = templateResult.value.data
      }

      if (planResult.status === 'fulfilled') {
        plans.value = planResult.value.data
      }

      if (templateResult.status === 'rejected' && planResult.status === 'rejected') {
        throw templateResult.reason
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Katalog gagal diambil.'
    } finally {
      loading.value = false
    }
  }

  return { templates, plans, monthlyPlans, loading, error, backendOnline, fetchCatalog }
})

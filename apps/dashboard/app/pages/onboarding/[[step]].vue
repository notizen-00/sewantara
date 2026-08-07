<script setup lang="ts">
import { useMitraDashboard } from '~/application/mitra/useMitraDashboard'
import { ONBOARDING_STEP_LABELS, isOnboardingStep } from '~/domain/navigation'

const dashboard = useMitraDashboard()
const route = useRoute()
const router = useRouter()

function stepPath(step: string) {
  return `/onboarding/${step}`
}

// URL adalah sumber kebenaran untuk step aktif; presenter disinkronkan
// agar tombol lanjut/kembali dan auto-advance tetap bekerja seperti semula.
watch(
  () => route.params.step,
  (step) => {
    if (isOnboardingStep(step)) {
      dashboard.selectOnboardingStep(step)

      // Step ditolak karena prasyaratnya belum selesai — kembalikan URL ke
      // step yang benar-benar aktif supaya tidak menggantung.
      if (dashboard.selectedOnboardingStep !== step) {
        router.replace(stepPath(dashboard.selectedOnboardingStep))
      }
      return
    }

    // Tanpa step di URL (atau step tak dikenal), ikuti step yang sedang
    // aktif di presenter — nilainya berasal dari progress backend.
    router.replace(stepPath(dashboard.selectedOnboardingStep))
  },
  { immediate: true },
)

// Presenter dapat memindahkan step sendiri (mis. setelah "Simpan & lanjutkan"
// atau saat progress backend dimuat) — URL harus ikut berubah.
watch(
  () => dashboard.selectedOnboardingStep,
  (step) => {
    if (route.params.step !== step) router.replace(stepPath(step))
  },
)

useHead({
  title: () => `${ONBOARDING_STEP_LABELS[dashboard.selectedOnboardingStep]} — Onboarding Sewantara`,
})
</script>

<template>
  <TemplatesDashboardLayout
    :backend-online="dashboard.catalog.backendOnline"
    :tenant-id="dashboard.auth.tenantId"
    :onboarding-mode="true"
    :completion="dashboard.onboarding.completion"
    :current-step="dashboard.selectedOnboardingStep"
    :steps="dashboard.onboardingSteps"
    :continue-label="dashboard.continueLabel"
    :busy="dashboard.auth.loading || dashboard.onboarding.loading"
    @save-exit="dashboard.saveAndExit"
    @save-draft="dashboard.saveDraft"
    @continue="dashboard.continueSetup"
    @back="dashboard.goToPreviousStep"
    @select-step="dashboard.selectOnboardingStep"
  >
    <OrganismsDashboardTopbar
      :tenant-name="dashboard.tenantName"
      :tenant-status="dashboard.tenantStatusLabel"
      :current-step="dashboard.selectedStepLabel"
    />

    <OrganismsOnboardingWorkspace :dashboard="dashboard" />
  </TemplatesDashboardLayout>
</template>

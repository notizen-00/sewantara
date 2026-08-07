<script setup lang="ts">
import { useMitraDashboard } from '~/application/mitra/useMitraDashboard'
import { DASHBOARD_SECTION_LABELS, DEFAULT_DASHBOARD_SECTION, isDashboardSection } from '~/domain/navigation'

const dashboard = useMitraDashboard()
const route = useRoute()
const router = useRouter()

const activeSection = computed(() => {
  const section = route.params.section
  return isDashboardSection(section) ? section : DEFAULT_DASHBOARD_SECTION
})

// Section tak dikenal (typo di URL) dinormalkan ke /dashboard, bukan
// menampilkan halaman kosong.
watch(
  () => route.params.section,
  (section) => {
    if (section !== undefined && !isDashboardSection(section)) {
      router.replace('/dashboard')
    }
  },
  { immediate: true },
)

function navigate(section: string) {
  router.push(section === DEFAULT_DASHBOARD_SECTION ? '/dashboard' : `/dashboard/${section}`)
}

useHead({
  title: () => `${DASHBOARD_SECTION_LABELS[activeSection.value]} — Sewantara Mitra`,
})
</script>

<template>
  <TemplatesOperationsLayout
    :tenant-name="dashboard.tenantName"
    :tenant-id="dashboard.auth.tenantId"
    :active-workspace-name="dashboard.auth.activeWorkspace.branchName"
    :active-section="activeSection"
    :branches="dashboard.availableBranches"
    :active-branch-id="dashboard.auth.branchId"
    :branch-switching="dashboard.auth.branchSwitching || dashboard.branches.loading"
    :user-name="dashboard.auth.session?.user.name || 'Owner'"
    :user-email="dashboard.auth.session?.user.email || ''"
    @logout="dashboard.logout"
    @select-branch="dashboard.switchBranch"
    @select-section="navigate"
  >
    <template #default="{ bookingCreateRequest }">
      <div>
        <OrganismsOperationsDashboard
          :section="activeSection"
          :metrics="dashboard.metricCards"
          :subscription="dashboard.subscriptionSummary"
          :tenant-site="dashboard.tenantSite"
          :loading="dashboard.operations.loading"
          :booking-create-request="bookingCreateRequest"
          @refresh="dashboard.refreshDashboard"
          @navigate="navigate"
        />
      </div>
    </template>
  </TemplatesOperationsLayout>
</template>

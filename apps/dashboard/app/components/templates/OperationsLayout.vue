<script setup lang="ts">
import type { Branch } from '~/domain/mitra'

const props = defineProps<{
  tenantName: string
  tenantId: string
  activeWorkspaceName?: string
  activeSection: string
  branches: Branch[]
  activeBranchId: string
  branchSwitching?: boolean
  userName: string
  userEmail: string
}>()

const emit = defineEmits<{
  logout: []
  selectBranch: [branchId: number]
  selectSection: [section: string]
}>()

const preferences = usePreferencesStore()
const sidebarOpen = ref(false)
const bookingCreateRequest = ref(0)
const sidebarVisuallyCollapsed = computed(() => preferences.sidebarCollapsed || props.activeSection === 'bookings')
const useFullWidthContent = computed(() => props.activeSection === 'bookings')

function selectSection(section: string) {
  emit('selectSection', section)
  sidebarOpen.value = false
}

function requestBookingCreate() {
  selectSection('bookings')
  bookingCreateRequest.value += 1
}

onMounted(preferences.hydrateFromStorage)

watch(
  () => props.activeSection,
  (section) => {
    if (section !== 'bookings') bookingCreateRequest.value = 0
  },
)
</script>

<template>
  <main class="min-h-screen bg-neutral-50 text-neutral-900">
    <OrganismsOperationsSidebar
      :open="sidebarOpen"
      :collapsed="sidebarVisuallyCollapsed"
      :tenant-name="tenantName"
      :tenant-id="tenantId"
      :active-workspace-name="activeWorkspaceName"
      :active-section="activeSection"
      @close="sidebarOpen = false"
      @toggle-collapse="preferences.toggleSidebarCollapsed"
      @select="selectSection"
    />
    <OrganismsOperationsHeader
      :branches="branches"
      :active-branch-id="activeBranchId"
      :branch-switching="branchSwitching"
      :user-name="userName"
      :user-email="userEmail"
      :notification-count="0"
      :sidebar-collapsed="sidebarVisuallyCollapsed"
      @menu="sidebarOpen = true"
      @logout="$emit('logout')"
      @select-branch="$emit('selectBranch', $event)"
      @create-booking="requestBookingCreate"
      @navigate="selectSection"
    />

    <div
      :class="[
        'min-h-screen pt-16 transition-[padding] duration-200',
        sidebarVisuallyCollapsed ? 'lg:pl-16' : 'lg:pl-64',
      ]"
    >
      <div
        :class="[
          'mx-auto w-full transition-[max-width,padding] duration-200',
          useFullWidthContent
            ? 'max-w-none px-3 py-4 sm:px-4 lg:px-5 lg:py-5'
            : sidebarVisuallyCollapsed
              ? 'max-w-[1760px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8'
              : 'max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8',
        ]"
      >
        <slot
          :active-section="activeSection"
          :navigate="selectSection"
          :booking-create-request="bookingCreateRequest"
        />
      </div>
    </div>
  </main>
</template>

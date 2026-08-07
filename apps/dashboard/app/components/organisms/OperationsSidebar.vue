<script setup lang="ts">
import {
  BarChart3,
  Blocks,
  BookOpenCheck,
  Boxes,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  PackageOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Tags,
  Users,
  UserCog,
  Wrench,
  X,
} from '@lucide/vue'
import type { Component } from 'vue'
import { DASHBOARD_SECTION_LABELS, type DashboardSection } from '~/domain/navigation'

defineProps<{
  open: boolean
  collapsed: boolean
  tenantName: string
  tenantId: string
  activeWorkspaceName?: string
  activeSection: string
}>()

const emit = defineEmits<{
  close: []
  select: [section: string]
  toggleCollapse: []
}>()

const auth = useAuthStore()
const tenantMenuOpen = ref(false)
const canViewUsers = computed(() =>
  auth.roles.some((role) =>
    role.code === 'owner'
    || (role.permissions || []).some((permission) => permission.code === 'user.view'),
  ),
)

const navigationGroups = [
  {
    label: 'Workspace',
    items: [
      { key: 'overview', icon: LayoutDashboard },
      { key: 'bookings', icon: BookOpenCheck },
      { key: 'calendar', icon: CalendarDays },
      { key: 'customers', icon: Users },
      { key: 'users', icon: UserCog },
    ],
  },
  {
    label: 'Operasional',
    items: [
      { key: 'products', icon: PackageOpen },
      { key: 'inventory', icon: Boxes },
      { key: 'pricing', icon: Tags },
      { key: 'maintenance', icon: Wrench },
      { key: 'reports', icon: BarChart3 },
      { key: 'billing', icon: CreditCard },
      { key: 'services', icon: Blocks },
    ],
  },
] satisfies Array<{ label: string; items: Array<{ key: DashboardSection; icon: Component }> }>

function selectSection(section: string) {
  emit('select', section)
  emit('close')
}

function toggleCollapse() {
  tenantMenuOpen.value = false
  emit('toggleCollapse')
}
</script>

<template>
  <button
    v-if="open"
    type="button"
    aria-label="Tutup navigasi"
    class="fixed inset-0 z-30 bg-neutral-900/30 lg:hidden"
    @click="$emit('close')"
  ></button>

  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-neutral-200 bg-neutral-0 transition-[width,transform] duration-200',
      collapsed ? 'lg:w-16' : 'lg:w-64',
      open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div
      :class="[
        'relative flex h-16 items-center justify-between border-b border-neutral-200 px-5',
        collapsed ? 'lg:justify-center lg:px-2' : '',
      ]"
    >
      <MoleculesBrandLockup :class="{ 'lg:hidden': collapsed }" />
      <span
        v-if="collapsed"
        class="hidden h-9 w-9 place-items-center rounded-md bg-primary-600 text-sm font-black text-white lg:grid"
      >
        S
      </span>
      <button
        type="button"
        :title="collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'"
        :aria-label="collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'"
        class="absolute -right-3 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-neutral-200 bg-neutral-0 text-neutral-500 shadow-card hover:border-primary-600 hover:text-primary-700 lg:grid"
        @click="toggleCollapse"
      >
        <PanelLeftOpen v-if="collapsed" :size="14" />
        <PanelLeftClose v-else :size="14" />
      </button>
      <button
        type="button"
        title="Tutup navigasi"
        class="grid h-9 w-9 place-items-center rounded-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 lg:hidden"
        @click="$emit('close')"
      >
        <X :size="18" />
      </button>
    </div>

    <div class="relative border-b border-neutral-200 p-3">
      <button
        type="button"
        :title="collapsed ? (activeWorkspaceName || tenantName) : undefined"
        :class="[
          'grid w-full grid-cols-[36px_minmax(0,1fr)_20px] items-center gap-3 rounded-sm border border-neutral-200 bg-neutral-0 p-2 text-left transition hover:border-neutral-500',
          collapsed ? 'lg:grid-cols-1 lg:place-items-center lg:border-transparent lg:p-0' : '',
        ]"
        aria-haspopup="menu"
        :aria-expanded="tenantMenuOpen"
        @click="tenantMenuOpen = !tenantMenuOpen"
      >
        <span class="grid h-9 w-9 place-items-center rounded-sm bg-primary-50 text-primary-700">
          <Building2 :size="18" />
        </span>
        <span :class="['min-w-0', collapsed ? 'lg:hidden' : '']">
          <strong class="block truncate text-sm font-semibold text-neutral-900">{{ tenantName }}</strong>
          <span class="block truncate text-xs text-neutral-500">
            {{ activeWorkspaceName || 'Workspace aktif' }}
          </span>
        </span>
        <ChevronDown :size="16" :class="['text-neutral-500', collapsed ? 'lg:hidden' : '']" />
      </button>

      <div
        v-if="tenantMenuOpen"
        :class="[
          'absolute left-3 right-3 top-[68px] z-50 rounded-sm border border-neutral-200 bg-neutral-0 p-2 shadow-lg',
          collapsed ? 'lg:left-full lg:right-auto lg:ml-2 lg:top-3 lg:w-64' : '',
        ]"
        role="menu"
      >
        <button
          type="button"
          class="grid w-full grid-cols-[32px_minmax(0,1fr)_20px] items-center gap-2 rounded-sm bg-neutral-50 px-2 py-2 text-left"
          @click="tenantMenuOpen = false"
        >
          <span class="grid h-8 w-8 place-items-center rounded-sm bg-primary-600 text-xs font-bold text-white">
            {{ tenantName.slice(0, 1).toUpperCase() }}
          </span>
          <span class="min-w-0">
            <strong class="block truncate text-sm font-semibold text-neutral-900">{{ tenantName }}</strong>
            <span class="block truncate text-xs text-neutral-500">
              {{ activeWorkspaceName || tenantId.slice(0, 12) }}
            </span>
          </span>
          <Check :size="16" class="text-primary-700" />
        </button>
        <button
          type="button"
          class="mt-1 flex min-h-9 w-full items-center gap-2 rounded-sm px-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          @click="selectSection('settings'); tenantMenuOpen = false"
        >
          <Settings :size="16" />
          Kelola workspace
        </button>
      </div>
    </div>

    <nav :class="['min-h-0 flex-1 overflow-y-auto px-3 py-4', collapsed ? 'lg:px-2' : '']" aria-label="Navigasi utama">
      <div
        v-for="(group, groupIndex) in navigationGroups"
        :key="group.label"
        :class="groupIndex ? (collapsed ? 'mt-6 lg:mt-3 lg:border-t lg:border-neutral-200 lg:pt-3' : 'mt-6') : ''"
      >
        <p :class="['mb-2 px-2 text-xs font-semibold text-neutral-500', collapsed ? 'lg:hidden' : '']">{{ group.label }}</p>
        <div class="grid gap-1">
          <button
            v-for="item in group.items.filter((entry) => entry.key !== 'users' || canViewUsers)"
            :key="item.key"
            type="button"
            :title="collapsed ? DASHBOARD_SECTION_LABELS[item.key] : undefined"
            :aria-label="DASHBOARD_SECTION_LABELS[item.key]"
            :class="[
              'flex min-h-10 w-full items-center gap-3 rounded-sm px-3 text-left text-sm font-medium transition',
              collapsed ? 'lg:justify-center lg:px-0' : '',
              activeSection === item.key
                ? 'bg-primary-50 text-primary-700'
                : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900',
            ]"
            @click="selectSection(item.key)"
          >
            <component :is="item.icon" :size="18" :stroke-width="1.8" class="shrink-0" />
            <span :class="{ 'lg:hidden': collapsed }">{{ DASHBOARD_SECTION_LABELS[item.key] }}</span>
          </button>
        </div>
      </div>
    </nav>

    <div :class="['border-t border-neutral-200 p-3', collapsed ? 'lg:px-2' : '']">
      <button
        type="button"
        :title="collapsed ? DASHBOARD_SECTION_LABELS.settings : undefined"
        :aria-label="DASHBOARD_SECTION_LABELS.settings"
        :class="[
          'flex min-h-10 w-full items-center gap-3 rounded-sm px-3 text-left text-sm font-medium transition',
          collapsed ? 'lg:justify-center lg:px-0' : '',
          activeSection === 'settings' ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-50',
        ]"
        @click="selectSection('settings')"
      >
        <Settings :size="18" class="shrink-0" />
        <span :class="{ 'lg:hidden': collapsed }">{{ DASHBOARD_SECTION_LABELS.settings }}</span>
      </button>
      <button
        type="button"
        :title="collapsed ? DASHBOARD_SECTION_LABELS.help : undefined"
        :aria-label="DASHBOARD_SECTION_LABELS.help"
        :class="[
          'mt-1 flex min-h-10 w-full items-center gap-3 rounded-sm px-3 text-left text-sm font-medium transition',
          collapsed ? 'lg:justify-center lg:px-0' : '',
          activeSection === 'help' ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-50',
        ]"
        @click="selectSection('help')"
      >
        <CircleHelp :size="18" class="shrink-0" />
        <span :class="{ 'lg:hidden': collapsed }">{{ DASHBOARD_SECTION_LABELS.help }}</span>
      </button>
    </div>
  </aside>
</template>

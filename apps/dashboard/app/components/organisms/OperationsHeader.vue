<script setup lang="ts">
import {
  Bell,
  BookOpenCheck,
  Check,
  ChevronDown,
  CircleHelp,
  LogOut,
  LoaderCircle,
  MapPin,
  Menu,
  Settings,
  UserRound,
} from '@lucide/vue'
import type { Branch } from '~/domain/mitra'

const props = defineProps<{
  branches: Branch[]
  activeBranchId: string
  branchSwitching?: boolean
  userName: string
  userEmail: string
  notificationCount?: number
  sidebarCollapsed?: boolean
}>()

const emit = defineEmits<{
  menu: []
  logout: []
  createBooking: []
  navigate: [section: string]
  selectBranch: [branchId: number]
}>()

const branchMenuOpen = ref(false)
const notificationMenuOpen = ref(false)
const profileMenuOpen = ref(false)

const userInitials = computed(() => {
  const parts = props.userName.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U'
})

const menuIsOpen = computed(() => branchMenuOpen.value || notificationMenuOpen.value || profileMenuOpen.value)
const activeBranch = computed(
  () => props.branches.find((branch) => String(branch.id) === props.activeBranchId) || props.branches[0] || null,
)

function closeMenus() {
  branchMenuOpen.value = false
  notificationMenuOpen.value = false
  profileMenuOpen.value = false
}

function toggleMenu(menu: 'branch' | 'notification' | 'profile') {
  const nextState = {
    branch: menu === 'branch' ? !branchMenuOpen.value : false,
    notification: menu === 'notification' ? !notificationMenuOpen.value : false,
    profile: menu === 'profile' ? !profileMenuOpen.value : false,
  }

  branchMenuOpen.value = nextState.branch
  notificationMenuOpen.value = nextState.notification
  profileMenuOpen.value = nextState.profile
}

function selectBranch(branch: Branch) {
  if (!branch.is_active || props.branchSwitching) return
  closeMenus()
  emit('selectBranch', branch.id)
}
</script>

<template>
  <button
    v-if="menuIsOpen"
    type="button"
    aria-label="Tutup menu"
    class="fixed inset-0 z-20 cursor-default"
    @click="closeMenus"
  ></button>

  <header
    :class="[
      'fixed left-0 right-0 top-0 z-30 flex h-16 items-center border-b border-neutral-200 bg-neutral-0 transition-[left] duration-200',
      sidebarCollapsed ? 'lg:left-16' : 'lg:left-64',
    ]"
  >
    <div class="flex w-full items-center justify-between gap-4 px-4 lg:px-6">
      <div class="flex min-w-0 items-center gap-2">
        <button
          type="button"
          title="Buka navigasi"
          class="grid h-10 w-10 shrink-0 place-items-center rounded-sm text-neutral-700 hover:bg-neutral-100 lg:hidden"
          @click="$emit('menu')"
        >
          <Menu :size="20" />
        </button>

        <div class="relative">
          <button
            type="button"
            class="flex min-h-10 max-w-64 items-center gap-2 rounded-sm px-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            aria-haspopup="menu"
            :aria-expanded="branchMenuOpen"
            @click="toggleMenu('branch')"
          >
            <LoaderCircle v-if="branchSwitching" :size="17" class="shrink-0 animate-spin text-primary-700" />
            <MapPin v-else :size="17" class="shrink-0 text-neutral-500" />
            <span class="min-w-0 truncate">
              {{ activeBranch?.name || 'Cabang belum tersedia' }}
              <span v-if="activeBranch?.code" class="ml-1 text-xs text-neutral-500">({{ activeBranch.code }})</span>
            </span>
            <ChevronDown :size="15" class="shrink-0 text-neutral-500" />
          </button>

          <div
            v-if="branchMenuOpen"
            class="absolute left-0 top-12 z-40 w-64 rounded-sm border border-neutral-200 bg-neutral-0 p-2 shadow-lg"
            role="menu"
          >
            <p class="px-2 pb-2 pt-1 text-xs font-semibold text-neutral-500">Pilih cabang</p>
            <button
              v-for="branch in branches"
              :key="branch.id"
              type="button"
              :disabled="!branch.is_active || branchSwitching"
              :class="[
                'grid w-full grid-cols-[32px_minmax(0,1fr)_20px] items-center gap-3 rounded-sm px-3 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-50',
                String(branch.id) === activeBranchId ? 'bg-primary-50' : 'hover:bg-neutral-50',
              ]"
              @click="selectBranch(branch)"
            >
              <span class="grid h-8 w-8 place-items-center rounded-sm bg-primary-50 text-primary-700">
                <MapPin :size="16" />
              </span>
              <span class="min-w-0">
                <strong class="block truncate text-sm font-semibold text-neutral-900">{{ branch.name }}</strong>
                <span class="block truncate text-xs text-neutral-500">
                  {{ branch.code }} - {{ branch.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </span>
              <Check v-if="String(branch.id) === activeBranchId" :size="16" class="text-primary-700" />
            </button>
            <p v-if="!branches.length" class="px-3 py-4 text-sm text-neutral-500">Cabang belum tersedia pada sesi ini.</p>
          </div>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <button
          type="button"
          title="Buat booking"
          class="inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-sm bg-primary-600 px-3 text-sm font-semibold text-white hover:bg-primary-700"
          @click="$emit('createBooking')"
        >
          <BookOpenCheck :size="17" />
          <span class="hidden sm:inline">Booking baru</span>
        </button>

        <div class="relative">
          <button
            type="button"
            title="Notifikasi"
            class="relative grid h-10 w-10 place-items-center rounded-sm text-neutral-700 hover:bg-neutral-100"
            aria-haspopup="menu"
            :aria-expanded="notificationMenuOpen"
            @click="toggleMenu('notification')"
          >
            <Bell :size="19" />
            <span
              v-if="notificationCount"
              class="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-neutral-0 bg-danger-500"
            ></span>
          </button>

          <div
            v-if="notificationMenuOpen"
            class="absolute right-0 top-12 z-40 w-[min(360px,calc(100vw-32px))] rounded-sm border border-neutral-200 bg-neutral-0 shadow-lg"
            role="menu"
          >
            <div class="border-b border-neutral-200 px-4 py-3">
              <h2 class="text-sm font-semibold text-neutral-900">Notifikasi</h2>
            </div>
            <div class="grid justify-items-center px-5 py-8 text-center">
              <span class="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-neutral-500">
                <Bell :size="18" />
              </span>
              <p class="mt-3 text-sm font-semibold text-neutral-900">Belum ada notifikasi</p>
              <p class="mt-1 text-xs leading-5 text-neutral-500">Pembaruan booking dan operasional akan muncul di sini.</p>
            </div>
          </div>
        </div>

        <div class="relative">
          <button
            type="button"
            title="Menu akun"
            class="flex h-10 items-center gap-2 rounded-sm pl-1 pr-2 hover:bg-neutral-50"
            aria-haspopup="menu"
            :aria-expanded="profileMenuOpen"
            @click="toggleMenu('profile')"
          >
            <span class="grid h-8 w-8 place-items-center rounded-full bg-neutral-900 text-xs font-bold text-white">
              {{ userInitials }}
            </span>
            <ChevronDown :size="15" class="hidden text-neutral-500 sm:block" />
          </button>

          <div
            v-if="profileMenuOpen"
            class="absolute right-0 top-12 z-40 w-64 rounded-sm border border-neutral-200 bg-neutral-0 p-2 shadow-lg"
            role="menu"
          >
            <div class="border-b border-neutral-200 px-2 pb-3 pt-1">
              <p class="truncate text-sm font-semibold text-neutral-900">{{ userName }}</p>
              <p class="mt-0.5 truncate text-xs text-neutral-500">{{ userEmail }}</p>
            </div>
            <button
              type="button"
              class="mt-2 flex min-h-9 w-full items-center gap-3 rounded-sm px-2 text-sm text-neutral-700 hover:bg-neutral-50"
              @click="$emit('navigate', 'settings'); closeMenus()"
            >
              <UserRound :size="16" />
              Profil akun
            </button>
            <button
              type="button"
              class="flex min-h-9 w-full items-center gap-3 rounded-sm px-2 text-sm text-neutral-700 hover:bg-neutral-50"
              @click="$emit('navigate', 'settings'); closeMenus()"
            >
              <Settings :size="16" />
              Pengaturan
            </button>
            <button
              type="button"
              class="flex min-h-9 w-full items-center gap-3 rounded-sm px-2 text-sm text-neutral-700 hover:bg-neutral-50"
              @click="$emit('navigate', 'help'); closeMenus()"
            >
              <CircleHelp :size="16" />
              Pusat bantuan
            </button>
            <div class="mt-2 border-t border-neutral-200 pt-2">
              <button
                type="button"
                class="flex min-h-9 w-full items-center gap-3 rounded-sm px-2 text-sm font-medium text-danger-500 hover:bg-red-50"
                @click="closeMenus(); $emit('logout')"
              >
                <LogOut :size="16" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

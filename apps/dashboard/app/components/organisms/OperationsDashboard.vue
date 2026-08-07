<script setup lang="ts">
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  Boxes,
  CalendarDays,
  CircleDollarSign,
  CircleHelp,
  Crown,
  PackageCheck,
  PackageOpen,
  RefreshCw,
  Settings,
  Tags,
  Users,
  UserCog,
  WalletCards,
  Wrench,
} from '@lucide/vue'
import type { Component } from 'vue'
import type { TenantSite } from '~/domain/tenantSite'
import { DASHBOARD_SECTION_LABELS, type DashboardSection, isDashboardSection } from '~/domain/navigation'

interface DashboardMetric {
  key: 'revenue' | 'bookings' | 'active_rentals' | 'available_units'
  label: string
  value: string
  raw: number
  caption: string
}

interface SubscriptionSummary {
  planName: string
  planSlug: string
  type: string
  status: string
  statusLabel: string
  tone: 'success' | 'danger' | 'warning'
  validUntil: string
  priceLabel: string
  features: Array<{ slug: string; name: string; value: string }>
  checked: boolean
}

const props = defineProps<{
  section: string
  metrics: DashboardMetric[]
  subscription: SubscriptionSummary
  tenantSite: TenantSite | null
  loading?: boolean
  bookingCreateRequest?: number
}>()

defineEmits<{
  refresh: []
  navigate: [section: string]
}>()

const metricIcons: Record<DashboardMetric['key'], Component> = {
  revenue: WalletCards,
  bookings: BookOpenCheck,
  active_rentals: PackageCheck,
  available_units: Boxes,
}

const moduleContent: Partial<Record<DashboardSection, { description: string; icon: Component }>> = {
  bookings: {
    description: 'Daftar dan status transaksi penyewaan tenant.',
    icon: BookOpenCheck,
  },
  calendar: {
    description: 'Jadwal pengambilan, pengembalian, dan ketersediaan unit.',
    icon: CalendarDays,
  },
  customers: {
    description: 'Data pelanggan dan riwayat transaksi rental.',
    icon: Users,
  },
  users: {
    description: 'Akun tim, role, permission, dan akses cabang.',
    icon: UserCog,
  },
  inventory: {
    description: 'Produk, unit serialized, dan stok pada cabang aktif.',
    icon: Boxes,
  },
  products: {
    description: 'Katalog produk dan kategori rental pada workspace.',
    icon: PackageOpen,
  },
  pricing: {
    description: 'Konfigurasi tarif rental untuk setiap produk.',
    icon: Tags,
  },
  maintenance: {
    description: 'Jadwal perawatan dan kondisi unit rental.',
    icon: Wrench,
  },
  reports: {
    description: 'Ringkasan performa operasional dan pendapatan.',
    icon: BarChart3,
  },
  settings: {
    description: 'Profil workspace, cabang, tim, dan preferensi operasional.',
    icon: Settings,
  },
  help: {
    description: 'Panduan penggunaan dan dukungan untuk workspace tenant.',
    icon: CircleHelp,
  },
}

const currentModule = computed(() => {
  const section = isDashboardSection(props.section) ? props.section : 'bookings'
  const content = moduleContent[section] || moduleContent.bookings!
  return { ...content, title: DASHBOARD_SECTION_LABELS[section] }
})
const metricByKey = computed(() => Object.fromEntries(props.metrics.map((metric) => [metric.key, metric.raw])))
const activeRentals = computed(() => Number(metricByKey.value.active_rentals || 0))
const availableUnits = computed(() => Number(metricByKey.value.available_units || 0))
const recordedBookings = computed(() => Number(metricByKey.value.bookings || 0))

const currentDate = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
}).format(new Date())
</script>

<template>
  <section v-if="section === 'overview'" id="operations" class="grid gap-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-medium text-neutral-500">{{ currentDate }}</p>
        <h1 class="mt-1 text-2xl font-bold text-neutral-900 sm:text-3xl">Dashboard bisnis</h1>
        <p class="mt-2 text-sm text-neutral-500">Pantau kondisi rental dari laporan tenant terbaru.</p>
      </div>
      <button
        type="button"
        class="inline-flex min-h-10 items-center gap-2 rounded-sm border border-neutral-200 bg-neutral-0 px-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        :disabled="loading"
        @click="$emit('refresh')"
      >
        <RefreshCw :size="16" :class="{ 'animate-spin': loading }" />
        {{ loading ? 'Memuat...' : 'Perbarui data' }}
      </button>
    </header>

    <article class="flex flex-wrap items-center justify-between gap-4 rounded-md border border-neutral-200 bg-neutral-0 p-5 shadow-card">
      <div class="flex min-w-0 items-center gap-4">
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700">
          <Crown :size="22" />
        </span>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="truncate text-base font-semibold text-neutral-900">{{ subscription.planName }}</h2>
            <span
              :class="[
                'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
                subscription.tone === 'success'
                  ? 'bg-primary-50 text-primary-700'
                  : subscription.tone === 'danger'
                    ? 'bg-red-50 text-danger-500'
                    : 'bg-amber-50 text-amber-700',
              ]"
            >
              {{ subscription.statusLabel }}
            </span>
          </div>
          <p class="mt-1 text-sm text-neutral-500">
            Jenis paket: <strong class="font-semibold text-neutral-700">{{ subscription.type }}</strong>
          </p>
          <p class="mt-1 text-xs font-medium text-neutral-500">{{ subscription.priceLabel }}</p>
        </div>
      </div>
      <div class="text-left sm:text-right">
        <p class="text-xs font-medium text-neutral-500">
          {{ subscription.status === 'trial' ? 'Trial berakhir' : 'Masa berlaku' }}
        </p>
        <p class="mt-1 text-sm font-semibold text-neutral-900">{{ subscription.validUntil }}</p>
        <p class="mt-1 text-[10px] font-medium text-neutral-400">
          {{ subscription.checked ? 'Status terbaru' : 'Memuat status' }}
        </p>
        <button
          type="button"
          class="mt-3 text-sm font-semibold text-primary-700 hover:text-primary-600"
          @click="$emit('navigate', 'billing')"
        >
          {{ subscription.status === 'trial' ? 'Aktifkan sekarang' : 'Kelola paket' }}
        </button>
      </div>
      <div v-if="subscription.features.length" class="w-full border-t border-neutral-200 pt-4">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Feature paket</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="feature in subscription.features.slice(0, 6)"
            :key="feature.slug"
            class="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600"
          >
            {{ feature.name }}:
            <strong class="font-semibold text-neutral-900">{{ feature.value }}</strong>
          </span>
          <span
            v-if="subscription.features.length > 6"
            class="rounded-md bg-neutral-100 px-3 py-2 text-xs font-medium text-neutral-600"
          >
            +{{ subscription.features.length - 6 }} feature lainnya
          </span>
        </div>
      </div>
    </article>

    <div class="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
      <MoleculesMetricCard
        v-for="metric in metrics"
        :key="metric.key"
        :label="metric.label"
        :value="metric.value"
        :caption="metric.caption"
      >
        <template #icon>
          <component :is="metricIcons[metric.key]" :size="18" :stroke-width="1.8" />
        </template>
      </MoleculesMetricCard>
    </div>

    <div class="grid grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)] gap-5 max-lg:grid-cols-1">
      <section class="rounded-sm border border-neutral-200 bg-neutral-0 p-5 shadow-card">
        <div>
          <h2 class="text-base font-semibold text-neutral-900">Kondisi operasional</h2>
          <p class="mt-1 text-sm text-neutral-500">Angka terbaru dari laporan dashboard tenant.</p>
        </div>

        <div class="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
          <div class="flex min-h-16 items-center justify-between gap-4">
            <span class="flex items-center gap-3 text-sm font-medium text-neutral-700">
              <PackageCheck :size="18" class="text-neutral-500" />
              Rental aktif
            </span>
            <strong class="text-lg font-bold text-neutral-900">{{ activeRentals }}</strong>
          </div>
          <div class="flex min-h-16 items-center justify-between gap-4">
            <span class="flex items-center gap-3 text-sm font-medium text-neutral-700">
              <Boxes :size="18" class="text-neutral-500" />
              Unit tersedia
            </span>
            <strong class="text-lg font-bold text-neutral-900">{{ availableUnits }}</strong>
          </div>
          <div class="flex min-h-16 items-center justify-between gap-4">
            <span class="flex items-center gap-3 text-sm font-medium text-neutral-700">
              <BookOpenCheck :size="18" class="text-neutral-500" />
              Booking tercatat
            </span>
            <strong class="text-lg font-bold text-neutral-900">{{ recordedBookings }}</strong>
          </div>
        </div>
      </section>

      <div class="grid content-start gap-5">
        <MoleculesTenantSiteCard :site="tenantSite" />

        <section class="rounded-sm border border-neutral-200 bg-neutral-0 shadow-card">
          <div class="border-b border-neutral-200 px-5 py-4">
            <h2 class="text-base font-semibold text-neutral-900">Akses cepat</h2>
          </div>
          <div class="divide-y divide-neutral-200 px-2">
            <button
              type="button"
              class="flex min-h-14 w-full items-center justify-between gap-3 rounded-sm px-3 text-left hover:bg-neutral-50"
              @click="$emit('navigate', 'bookings')"
            >
              <span class="flex items-center gap-3 text-sm font-medium text-neutral-700">
                <BookOpenCheck :size="18" />
                Kelola booking
              </span>
              <ArrowUpRight :size="16" class="text-neutral-500" />
            </button>
            <button
              type="button"
              class="flex min-h-14 w-full items-center justify-between gap-3 rounded-sm px-3 text-left hover:bg-neutral-50"
              @click="$emit('navigate', 'products')"
            >
              <span class="flex items-center gap-3 text-sm font-medium text-neutral-700">
                <Boxes :size="18" />
                Kelola produk
              </span>
              <ArrowUpRight :size="16" class="text-neutral-500" />
            </button>
            <button
              type="button"
              class="flex min-h-14 w-full items-center justify-between gap-3 rounded-sm px-3 text-left hover:bg-neutral-50"
              @click="$emit('navigate', 'reports')"
            >
              <span class="flex items-center gap-3 text-sm font-medium text-neutral-700">
                <CircleDollarSign :size="18" />
                Buka laporan
              </span>
              <ArrowUpRight :size="16" class="text-neutral-500" />
            </button>
          </div>
        </section>
      </div>
    </div>

    <section class="rounded-sm border border-neutral-200 bg-neutral-0 shadow-card">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4">
        <div>
          <h2 class="text-base font-semibold text-neutral-900">Agenda operasional</h2>
          <p class="mt-1 text-sm text-neutral-500">Pengambilan dan pengembalian unit terdekat.</p>
        </div>
        <button
          type="button"
          class="text-sm font-semibold text-primary-700 hover:text-primary-600"
          @click="$emit('navigate', 'calendar')"
        >
          Buka kalender
        </button>
      </div>
      <div class="grid min-h-44 place-items-center px-5 py-8 text-center">
        <div>
          <span class="mx-auto grid h-11 w-11 place-items-center rounded-full bg-neutral-100 text-neutral-500">
            <CalendarDays :size="20" />
          </span>
          <p class="mt-3 text-sm font-semibold text-neutral-900">Belum ada agenda yang dimuat</p>
          <p class="mt-1 text-xs text-neutral-500">Jadwal pengambilan dan pengembalian akan muncul di sini.</p>
        </div>
      </div>
    </section>
  </section>

  <OrganismsSettingsWorkspace
    v-else-if="section === 'settings'"
    @back="$emit('navigate', 'overview')"
  />

  <OrganismsBookingWorkspace
    v-else-if="section === 'bookings'"
    :create-request="bookingCreateRequest"
    @back="$emit('navigate', 'overview')"
  />

  <OrganismsProductWorkspace
    v-else-if="section === 'products'"
    @back="$emit('navigate', 'overview')"
  />

  <OrganismsInventoryWorkspace
    v-else-if="section === 'inventory'"
    @back="$emit('navigate', 'overview')"
  />

  <OrganismsBillingWorkspace
    v-else-if="section === 'billing'"
    @back="$emit('navigate', 'overview')"
  />

  <OrganismsServicesWorkspace
    v-else-if="section === 'services'"
    @back="$emit('navigate', 'overview')"
  />

  <OrganismsCustomerWorkspace
    v-else-if="section === 'customers'"
    @back="$emit('navigate', 'overview')"
  />

  <OrganismsUserWorkspace
    v-else-if="section === 'users'"
    @back="$emit('navigate', 'overview')"
  />

  <section v-else class="grid gap-6">
    <header>
      <button
        type="button"
        class="mb-4 inline-flex min-h-9 items-center gap-2 rounded-sm text-sm font-medium text-neutral-500 hover:text-neutral-900"
        @click="$emit('navigate', 'overview')"
      >
        <ArrowLeft :size="16" />
        Kembali ke dashboard
      </button>
      <h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl">{{ currentModule.title }}</h1>
      <p class="mt-2 text-sm text-neutral-500">{{ currentModule.description }}</p>
    </header>

    <div class="grid min-h-[420px] place-items-center rounded-sm border border-neutral-200 bg-neutral-0 px-6 py-12 text-center shadow-card">
      <div class="max-w-sm">
        <span class="mx-auto grid h-12 w-12 place-items-center rounded-sm bg-neutral-100 text-neutral-700">
          <component :is="currentModule.icon" :size="22" />
        </span>
        <h2 class="mt-4 text-base font-semibold text-neutral-900">Belum ada data untuk ditampilkan</h2>
        <p class="mt-2 text-sm leading-6 text-neutral-500">
          Data {{ currentModule.title.toLowerCase() }} untuk cabang aktif akan muncul di sini.
        </p>
      </div>
    </div>
  </section>
</template>

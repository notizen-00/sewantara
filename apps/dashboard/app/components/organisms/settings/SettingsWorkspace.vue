<script setup lang="ts">
import {
  ArrowLeft,
  BellRing,
  Building2,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  ExternalLink,
  FileImage,
  Globe,
  Info,
  LoaderCircle,
  MapPin,
  Palette,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  Store,
  Trash2,
  Upload,
  UserRound,
  WalletCards,
} from '@lucide/vue'
import type { Component } from 'vue'
import type { SettingsSectionKey } from '~/domain/settings'
import { useSettingsPresenter } from '~/application/settings/useSettingsPresenter'

defineEmits<{
  back: []
}>()

const settings = useSettingsPresenter()

const sections: Array<{
  key: SettingsSectionKey
  label: string
  description: string
  icon: Component
}> = [
  { key: 'business', label: 'Profil bisnis', description: 'Tenant, cabang, dan lokalisasi', icon: Building2 },
  { key: 'branding', label: 'Branding & logo', description: 'Warna dan private media', icon: Palette },
  { key: 'rental', label: 'Model penyewaan', description: 'Durasi dan alokasi resource', icon: Clock3 },
  { key: 'booking', label: 'Aturan booking', description: 'Channel dan otomatisasi', icon: CalendarClock },
  { key: 'payments', label: 'Pembayaran', description: 'Tunai dan rekening bank', icon: WalletCards },
  { key: 'workspace', label: 'Workspace & akses', description: 'Cabang, akun, dan status', icon: ShieldCheck },
]

const rentalModels = [
  {
    value: 'per_hour' as const,
    label: 'Per jam',
    description: 'PS, studio, lapangan, atau ruangan.',
  },
  {
    value: 'per_day' as const,
    label: 'Per hari',
    description: 'Kendaraan, kamera, dan perlengkapan.',
  },
  {
    value: 'session' as const,
    label: 'Per sesi',
    description: 'Paket event atau layanan berdurasi tetap.',
  },
]

const timezoneOptions = [
  { label: 'WIB — Asia/Jakarta', value: 'Asia/Jakarta' },
  { label: 'WITA — Asia/Makassar', value: 'Asia/Makassar' },
  { label: 'WIT — Asia/Jayapura', value: 'Asia/Jayapura' },
]

const currencyOptions = [{ label: 'Rupiah Indonesia (IDR)', value: 'IDR' }]
const languageOptions = [{ label: 'Bahasa Indonesia', value: 'id' }]
const dateFormatOptions = [
  { label: '31/12/2026', value: 'DD/MM/YYYY' },
  { label: '2026-12-31', value: 'YYYY-MM-DD' },
]
const timeFormatOptions = [
  { label: '24 jam (21:30)', value: 'HH:mm' },
  { label: '12 jam (09:30 PM)', value: 'hh:mm A' },
]

const bookingStrategyOptions = computed(() => {
  if (settings.forms.rental.rental_model === 'per_hour') {
    return [
      { label: 'Rentang waktu', value: 'date_range' as const },
      { label: 'Antrean', value: 'queue' as const },
    ]
  }
  if (settings.forms.rental.rental_model === 'session') {
    return [{ label: 'Sesi tetap', value: 'session' as const }]
  }
  return [{ label: 'Rentang tanggal', value: 'date_range' as const }]
})

const allocationOptions = [
  { label: 'Pilih otomatis', value: 'auto_assign' as const },
  { label: 'Dipilih manual', value: 'manual' as const },
]

const needsSlotDuration = computed(() =>
  ['queue', 'session'].includes(settings.forms.rental.booking_strategy),
)

const activePaymentCount = computed(
  () => Number(settings.forms.payments.cashEnabled) + Number(settings.forms.payments.transferEnabled),
)

const brandingImages = computed(() => [
  {
    type: 'logo' as const,
    label: 'Logo utama',
    description: 'JPG, PNG, atau WEBP. Maksimal 5 MB.',
    accept: '.jpg,.jpeg,.png,.webp',
    url: settings.store.snapshot?.branding.logo_url,
  },
  {
    type: 'favicon' as const,
    label: 'Favicon',
    description: 'PNG atau ICO. Maksimal 1 MB.',
    accept: '.png,.ico',
    url: settings.store.snapshot?.branding.favicon_url,
  },
  {
    type: 'invoice_logo' as const,
    label: 'Logo invoice',
    description: 'JPG, PNG, atau WEBP. Maksimal 5 MB.',
    accept: '.jpg,.jpeg,.png,.webp',
    url: settings.store.snapshot?.branding.invoice_logo_url,
  },
  {
    type: 'branch_logo' as const,
    label: 'Logo cabang',
    description: 'Logo khusus untuk cabang aktif. Maksimal 5 MB.',
    accept: '.jpg,.jpeg,.png,.webp',
    url: settings.store.snapshot?.branch.settings?.logo_url,
  },
])

function selectRentalModel(model: 'per_hour' | 'per_day' | 'session') {
  settings.forms.rental.rental_model = model
  if (model === 'per_day') settings.forms.rental.booking_strategy = 'date_range'
  if (model === 'session') settings.forms.rental.booking_strategy = 'session'
  if (model === 'per_hour' && settings.forms.rental.booking_strategy === 'session') {
    settings.forms.rental.booking_strategy = 'date_range'
  }
}

function selectImage(image: 'logo' | 'favicon' | 'invoice_logo' | 'branch_logo', event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) settings.uploadImage(image, file)
  input.value = ''
}

onMounted(() => {
  settings.initialize().catch(() => undefined)
})
</script>

<template>
  <section class="grid gap-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <button
          type="button"
          class="mb-4 inline-flex min-h-9 items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900"
          @click="$emit('back')"
        >
          <ArrowLeft :size="16" />
          Kembali ke dashboard
        </button>
        <div class="flex items-center gap-3">
          <span class="grid h-11 w-11 place-items-center rounded-md bg-primary-50 text-primary-700">
            <Settings2 :size="21" />
          </span>
          <div>
            <h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl">Pengaturan</h1>
            <p class="mt-1 text-sm text-neutral-500">Kelola konfigurasi utama workspace tanpa mengganggu operasional.</p>
          </div>
        </div>
      </div>
      <div class="rounded-md border border-neutral-200 bg-neutral-0 px-4 py-3 text-right shadow-card">
        <p class="text-xs font-medium text-neutral-500">Workspace aktif</p>
        <p class="mt-1 text-sm font-semibold text-neutral-900">
          {{ settings.auth.activeWorkspace.branchName || settings.auth.session?.branch.name || 'Cabang aktif' }}
        </p>
      </div>
    </header>

    <div
      v-if="settings.store.loading && !settings.store.snapshot"
      class="grid min-h-[480px] place-items-center rounded-md border border-neutral-200 bg-neutral-0 shadow-card"
    >
      <div class="text-center">
        <LoaderCircle :size="28" class="mx-auto animate-spin text-primary-600" />
        <p class="mt-3 text-sm font-semibold text-neutral-900">Menyiapkan pengaturan</p>
        <p class="mt-1 text-xs text-neutral-500">Mengambil konfigurasi terbaru dari workspace.</p>
      </div>
    </div>

    <div
      v-else-if="!settings.store.snapshot"
      class="grid min-h-[420px] place-items-center rounded-md border border-neutral-200 bg-neutral-0 px-6 text-center shadow-card"
    >
      <div class="max-w-sm">
        <span class="mx-auto grid h-12 w-12 place-items-center rounded-md bg-red-50 text-danger-500">
          <Info :size="21" />
        </span>
        <h2 class="mt-4 text-base font-semibold text-neutral-900">Pengaturan belum dapat dimuat</h2>
        <p class="mt-2 text-sm leading-6 text-neutral-500">
          {{ settings.store.error || 'Backend belum mengembalikan konfigurasi workspace.' }}
        </p>
        <AtomsAppButton class="mt-5" variant="secondary" :disabled="settings.store.loading" @click="settings.initialize(true)">
          <LoaderCircle v-if="settings.store.loading" :size="16" class="mr-2 animate-spin" />
          Muat ulang
        </AtomsAppButton>
      </div>
    </div>

    <template v-else>
      <div class="grid grid-cols-[250px_minmax(0,1fr)] items-start gap-5 max-lg:grid-cols-1">
        <nav
          class="sticky top-20 overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 p-2 shadow-card max-lg:static max-lg:flex max-lg:overflow-x-auto"
          aria-label="Bagian pengaturan"
        >
          <button
            v-for="section in sections"
            :key="section.key"
            type="button"
            :class="[
              'grid w-full grid-cols-[36px_minmax(0,1fr)_16px] items-center gap-3 rounded-md px-3 py-3 text-left transition max-lg:min-w-56',
              settings.selectedSection === section.key
                ? 'bg-primary-50 text-primary-700'
                : 'text-neutral-700 hover:bg-neutral-50',
            ]"
            @click="settings.selectSection(section.key)"
          >
            <span
              :class="[
                'grid h-9 w-9 place-items-center rounded-md',
                settings.selectedSection === section.key ? 'bg-primary-100' : 'bg-neutral-100',
              ]"
            >
              <component :is="section.icon" :size="17" />
            </span>
            <span class="min-w-0">
              <strong class="flex items-center gap-2 text-sm font-semibold">
                {{ section.label }}
                <span
                  v-if="settings.dirtySections.includes(section.key)"
                  class="h-1.5 w-1.5 rounded-full bg-warning-500"
                  title="Perubahan belum disimpan"
                ></span>
              </strong>
              <span class="mt-0.5 block truncate text-xs text-neutral-500">{{ section.description }}</span>
            </span>
            <ChevronRight :size="15" class="opacity-60" />
          </button>
        </nav>

        <form class="min-w-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-card" @submit.prevent="settings.saveCurrent">
          <template v-if="settings.selectedSection === 'business'">
            <div class="border-b border-neutral-200 px-5 py-5 sm:px-6">
              <div class="flex items-start gap-3">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
                  <Store :size="18" />
                </span>
                <div>
                  <h2 class="text-lg font-semibold text-neutral-900">Profil bisnis</h2>
                  <p class="mt-1 text-sm leading-6 text-neutral-500">
                    Informasi ini menjadi identitas utama tenant dan cabang aktif.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid gap-6 p-5 sm:p-6">
              <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <AtomsAppInput
                  v-model="settings.forms.business.business_name"
                  label="Nama bisnis"
                  :maxlength="150"
                  required
                />
                <AtomsAppInput
                  v-model="settings.forms.business.branch_name"
                  label="Nama cabang aktif"
                  :maxlength="150"
                  required
                />
                <AtomsAppSelect
                  v-model="settings.forms.business.timezone"
                  label="Zona waktu"
                  :options="timezoneOptions"
                />
                <AtomsAppSelect
                  v-model="settings.forms.business.currency"
                  label="Mata uang"
                  :options="currencyOptions"
                />
                <AtomsAppSelect
                  v-model="settings.forms.business.default_language"
                  label="Bahasa default"
                  :options="languageOptions"
                />
                <AtomsAppSelect
                  v-model="settings.forms.business.date_format"
                  label="Format tanggal"
                  :options="dateFormatOptions"
                />
                <AtomsAppSelect
                  v-model="settings.forms.business.time_format"
                  label="Format waktu"
                  :options="timeFormatOptions"
                />
              </div>

              <section class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                <div class="mb-4">
                  <h3 class="text-sm font-semibold text-neutral-900">Detail cabang aktif</h3>
                  <p class="mt-1 text-xs leading-5 text-neutral-500">
                    Perubahan ini hanya diterapkan pada cabang yang sedang aktif.
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <AtomsAppInput
                    v-model="settings.forms.business.branch_phone"
                    label="Nomor telepon"
                    type="tel"
                    autocomplete="tel"
                  />
                  <AtomsAppInput
                    v-model="settings.forms.business.branch_address"
                    label="Alamat"
                    autocomplete="street-address"
                  />
                  <div class="sm:col-span-2">
                    <AtomsAppToggle
                      v-model="settings.forms.business.branch_is_active"
                      label="Cabang aktif"
                      description="Cabang aktif dapat digunakan untuk operasional dan menerima transaksi."
                    />
                  </div>
                </div>
              </section>
            </div>
          </template>

          <template v-else-if="settings.selectedSection === 'branding'">
            <div class="border-b border-neutral-200 px-5 py-5 sm:px-6">
              <div class="flex items-start gap-3">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
                  <Palette :size="18" />
                </span>
                <div>
                  <h2 class="text-lg font-semibold text-neutral-900">Branding & logo</h2>
                  <p class="mt-1 text-sm leading-6 text-neutral-500">
                    Atur identitas visual tenant dan media privat untuk cabang aktif.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid gap-7 p-5 sm:p-6">
              <section class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-start gap-3">
                    <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-neutral-0 text-primary-700 shadow-card">
                      <Globe :size="17" />
                    </span>
                    <div class="min-w-0">
                      <h3 class="text-sm font-semibold text-neutral-900">Status situs publik</h3>
                      <p class="mt-1 text-xs leading-5 text-neutral-500">
                        <template v-if="settings.tenantSite">
                          Saat aktif, pelanggan dapat mengakses
                          <strong class="font-semibold text-neutral-700">{{ settings.tenantSite.host }}</strong>.
                        </template>
                        <template v-else>
                          Alamat situs tenant belum tersedia.
                        </template>
                      </p>
                    </div>
                  </div>
                  <span
                    :class="[
                      'shrink-0 rounded-full px-2.5 py-1 text-xs font-bold',
                      settings.websiteEnabled ? 'bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-500',
                    ]"
                  >
                    {{ settings.websiteEnabled ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </div>

                <div class="mt-4">
                  <AtomsAppToggle
                    :model-value="settings.websiteEnabled"
                    label="Aktifkan situs"
                    description="Nonaktifkan sementara untuk menyembunyikan situs dari publik tanpa menghapus konfigurasi branding."
                    :disabled="settings.store.savingWebsiteStatus"
                    @update:model-value="settings.toggleWebsiteStatus"
                  />
                </div>

                <a
                  v-if="settings.websiteEnabled && settings.tenantSite"
                  :href="settings.tenantSite.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-600"
                >
                  <ExternalLink :size="14" />
                  Buka situs
                </a>
              </section>

              <section>
                <h3 class="text-sm font-semibold text-neutral-900">Palet warna</h3>
                <p class="mt-1 text-xs leading-5 text-neutral-500">
                  Warna disimpan sebagai konfigurasi branding dan tidak mengubah file gambar.
                </p>
                <div class="mt-4 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <label class="grid gap-2 text-sm font-medium text-neutral-700">
                    Warna utama
                    <span class="flex items-center gap-3 rounded-md border border-neutral-200 bg-neutral-0 p-2">
                      <input
                        v-model="settings.forms.branding.primary_color"
                        type="color"
                        class="h-10 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
                      />
                      <input
                        v-model="settings.forms.branding.primary_color"
                        type="text"
                        maxlength="7"
                        class="min-h-10 min-w-0 flex-1 bg-transparent px-2 text-sm uppercase outline-none"
                      />
                    </span>
                  </label>
                  <label class="grid gap-2 text-sm font-medium text-neutral-700">
                    Warna sekunder
                    <span class="flex items-center gap-3 rounded-md border border-neutral-200 bg-neutral-0 p-2">
                      <input
                        v-model="settings.forms.branding.secondary_color"
                        type="color"
                        class="h-10 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
                      />
                      <input
                        v-model="settings.forms.branding.secondary_color"
                        type="text"
                        maxlength="7"
                        class="min-h-10 min-w-0 flex-1 bg-transparent px-2 text-sm uppercase outline-none"
                      />
                    </span>
                  </label>
                </div>
              </section>

              <section>
                <div class="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-sm font-semibold text-neutral-900">Media branding</h3>
                    <p class="mt-1 text-xs leading-5 text-neutral-500">
                      Preview dimuat sebagai blob dengan token dan X-Branch-Id, sesuai akses private media backend.
                    </p>
                  </div>
                  <FileImage :size="19" class="shrink-0 text-neutral-400" />
                </div>

                <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                  <article
                    v-for="item in brandingImages"
                    :key="item.type"
                    class="overflow-hidden rounded-md border border-neutral-200 bg-neutral-0"
                  >
                    <div class="grid h-40 place-items-center bg-neutral-50 p-4">
                      <AtomsPrivateImage
                        v-if="item.url"
                        :url="item.url"
                        :alt="item.label"
                        class="h-full w-full"
                        image-class="h-full w-full object-contain"
                      />
                      <div v-else class="text-center text-neutral-400">
                        <FileImage :size="30" class="mx-auto" />
                        <p class="mt-2 text-xs font-medium">Belum ada gambar</p>
                      </div>
                    </div>
                    <div class="border-t border-neutral-200 p-4">
                      <h4 class="text-sm font-semibold text-neutral-900">{{ item.label }}</h4>
                      <p class="mt-1 text-xs leading-5 text-neutral-500">{{ item.description }}</p>
                      <div class="mt-4 flex items-center gap-2">
                        <label
                          :class="[
                            'inline-flex min-h-10 cursor-pointer items-center justify-center rounded-md border border-neutral-200 px-3 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50',
                            settings.store.savingImage ? 'pointer-events-none opacity-50' : '',
                          ]"
                        >
                          <LoaderCircle
                            v-if="settings.store.savingImage === item.type"
                            :size="15"
                            class="mr-2 animate-spin"
                          />
                          <Upload v-else :size="15" class="mr-2" />
                          {{ item.url ? 'Ganti' : 'Unggah' }}
                          <input
                            type="file"
                            class="sr-only"
                            :accept="item.accept"
                            :disabled="Boolean(settings.store.savingImage)"
                            @change="selectImage(item.type, $event)"
                          />
                        </label>
                        <AtomsAppButton
                          v-if="item.url"
                          type="button"
                          variant="ghost"
                          :disabled="Boolean(settings.store.savingImage)"
                          @click="settings.deleteImage(item.type)"
                        >
                          <Trash2 :size="15" class="mr-2" />
                          Hapus
                        </AtomsAppButton>
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            </div>
          </template>

          <template v-else-if="settings.selectedSection === 'rental'">
            <div class="border-b border-neutral-200 px-5 py-5 sm:px-6">
              <div class="flex items-start gap-3">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
                  <Clock3 :size="18" />
                </span>
                <div>
                  <h2 class="text-lg font-semibold text-neutral-900">Model penyewaan</h2>
                  <p class="mt-1 text-sm leading-6 text-neutral-500">
                    Tentukan cara durasi dihitung dan bagaimana resource dialokasikan.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid gap-6 p-5 sm:p-6">
              <div class="grid grid-cols-3 gap-3 max-md:grid-cols-1">
                <button
                  v-for="model in rentalModels"
                  :key="model.value"
                  type="button"
                  :class="[
                    'relative rounded-md border p-4 text-left transition',
                    settings.forms.rental.rental_model === model.value
                      ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-100'
                      : 'border-neutral-200 hover:border-neutral-500',
                  ]"
                  @click="selectRentalModel(model.value)"
                >
                  <Check
                    v-if="settings.forms.rental.rental_model === model.value"
                    :size="17"
                    class="absolute right-3 top-3 text-primary-700"
                  />
                  <strong class="block pr-6 text-sm font-semibold text-neutral-900">{{ model.label }}</strong>
                  <span class="mt-2 block text-xs leading-5 text-neutral-500">{{ model.description }}</span>
                </button>
              </div>

              <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <AtomsAppSelect
                  v-model="settings.forms.rental.booking_strategy"
                  label="Strategi booking"
                  :options="bookingStrategyOptions"
                />
                <AtomsAppSelect
                  v-model="settings.forms.rental.allocation_strategy"
                  label="Alokasi resource"
                  :options="allocationOptions"
                />
                <AtomsAppInput
                  v-if="needsSlotDuration"
                  v-model="settings.forms.rental.slot_duration_minutes"
                  label="Durasi slot (menit)"
                  type="number"
                  :min="1"
                  required
                />
              </div>

              <div>
                <AtomsAppToggle
                  v-model="settings.forms.rental.enable_waiting_list"
                  label="Aktifkan waiting list"
                  description="Pelanggan dapat mengantre ketika slot penuh."
                />
              </div>
            </div>
          </template>

          <template v-else-if="settings.selectedSection === 'booking'">
            <div class="border-b border-neutral-200 px-5 py-5 sm:px-6">
              <div class="flex items-start gap-3">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
                  <BellRing :size="18" />
                </span>
                <div>
                  <h2 class="text-lg font-semibold text-neutral-900">Aturan booking</h2>
                  <p class="mt-1 text-sm leading-6 text-neutral-500">
                    Kontrol channel booking, antrean, pengingat, dan pembatalan otomatis.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid gap-6 p-5 sm:p-6">
              <section>
                <h3 class="text-sm font-semibold text-neutral-900">Channel booking</h3>
                <p class="mt-1 text-xs leading-5 text-neutral-500">Pilih cara pelanggan dapat membuat transaksi.</p>
                <div class="mt-3 grid grid-cols-2 gap-3 max-md:grid-cols-1">
                  <AtomsAppToggle
                    v-model="settings.forms.booking.allow_online_booking"
                    label="Booking online"
                    description="Terima booking dari halaman publik."
                  />
                  <AtomsAppToggle
                    v-model="settings.forms.booking.allow_walk_in"
                    label="Booking walk-in"
                    description="Admin dapat mencatat pelanggan yang datang langsung."
                  />
                  <AtomsAppToggle
                    v-model="settings.forms.booking.enable_waiting_list"
                    label="Waiting list"
                    description="Tawarkan antrean ketika seluruh slot penuh."
                  />
                  <AtomsAppToggle
                    v-model="settings.forms.booking.auto_reminder"
                    label="Pengingat otomatis"
                    description="Kirim pengingat sebelum jadwal booking."
                  />
                </div>
              </section>

              <section class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                <AtomsAppToggle
                  v-model="settings.forms.booking.auto_cancel_unpaid"
                  label="Batalkan transaksi yang belum dibayar"
                  description="Booking unpaid dibatalkan otomatis setelah batas waktu berakhir."
                />
                <div v-if="settings.forms.booking.auto_cancel_unpaid" class="mt-4 max-w-xs">
                  <AtomsAppInput
                    v-model="settings.forms.booking.auto_cancel_minutes"
                    label="Batas pembayaran (menit)"
                    type="number"
                    :min="5"
                    required
                  />
                  <p class="mt-2 text-xs text-neutral-500">Minimal 5 menit sesuai validasi backend.</p>
                </div>
              </section>

              <AtomsAppSelect
                v-model="settings.forms.booking.allocation_strategy"
                label="Alokasi resource untuk booking"
                :options="allocationOptions"
              />
            </div>
          </template>

          <template v-else-if="settings.selectedSection === 'payments'">
            <div class="border-b border-neutral-200 px-5 py-5 sm:px-6">
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-3">
                  <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
                    <CircleDollarSign :size="18" />
                  </span>
                  <div>
                    <h2 class="text-lg font-semibold text-neutral-900">Metode pembayaran</h2>
                    <p class="mt-1 text-sm leading-6 text-neutral-500">
                      Aktifkan minimal satu metode untuk menerima transaksi.
                    </p>
                  </div>
                </div>
                <span class="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                  {{ activePaymentCount }} aktif
                </span>
              </div>
            </div>

            <div class="grid gap-4 p-5 sm:p-6">
              <AtomsAppToggle
                v-model="settings.forms.payments.cashEnabled"
                label="Pembayaran tunai"
                description="Terima pembayaran langsung di kasir atau cabang."
              />

              <div class="overflow-hidden rounded-md border border-neutral-200">
                <div class="p-4">
                  <AtomsAppToggle
                    v-model="settings.forms.payments.transferEnabled"
                    label="Transfer bank manual"
                    description="Tampilkan rekening tujuan untuk pembayaran pelanggan."
                  />
                </div>
                <div
                  v-if="settings.forms.payments.transferEnabled"
                  class="grid grid-cols-2 gap-4 border-t border-neutral-200 bg-neutral-50 p-4 max-sm:grid-cols-1"
                >
                  <AtomsAppInput
                    v-model="settings.forms.payments.bankName"
                    label="Nama bank"
                    autocomplete="organization"
                    required
                  />
                  <AtomsAppInput
                    v-model="settings.forms.payments.accountNumber"
                    label="Nomor rekening"
                    inputmode="numeric"
                    required
                  />
                  <div class="sm:col-span-2">
                    <AtomsAppInput
                      v-model="settings.forms.payments.accountName"
                      label="Nama pemilik rekening"
                      autocomplete="name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3 rounded-md border border-blue-100 bg-blue-50 p-4 text-blue-900">
                <Info :size="18" class="mt-0.5 shrink-0" />
                <p class="text-xs leading-5">
                  Gateway pembayaran lain dapat ditambahkan setelah backend menyediakan endpoint konfigurasi terkait.
                  Halaman ini hanya mengirim metode yang didukung dokumentasi saat ini.
                </p>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="border-b border-neutral-200 px-5 py-5 sm:px-6">
              <div class="flex items-start gap-3">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
                  <ShieldCheck :size="18" />
                </span>
                <div>
                  <h2 class="text-lg font-semibold text-neutral-900">Workspace & akses</h2>
                  <p class="mt-1 text-sm leading-6 text-neutral-500">
                    Ringkasan tenant, cabang yang dapat diakses, dan akun yang sedang masuk.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid gap-6 p-5 sm:p-6">
              <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <section class="rounded-md border border-neutral-200 p-4">
                  <div class="flex items-start gap-3">
                    <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-neutral-100 text-neutral-700">
                      <Building2 :size="17" />
                    </span>
                    <div class="min-w-0">
                      <p class="text-xs font-medium text-neutral-500">Tenant aktif</p>
                      <h3 class="mt-1 truncate text-sm font-semibold text-neutral-900">
                        {{ settings.auth.session?.tenant.name }}
                      </h3>
                      <p class="mt-1 break-all text-xs text-neutral-500">{{ settings.auth.tenantId }}</p>
                    </div>
                  </div>
                  <div class="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
                    <span class="text-xs text-neutral-500">Status workspace</span>
                    <span class="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold capitalize text-primary-700">
                      {{ settings.auth.tenantStatus }}
                    </span>
                  </div>
                </section>

                <section class="rounded-md border border-neutral-200 p-4">
                  <div class="flex items-start gap-3">
                    <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-neutral-100 text-neutral-700">
                      <UserRound :size="17" />
                    </span>
                    <div class="min-w-0">
                      <p class="text-xs font-medium text-neutral-500">Akun aktif</p>
                      <h3 class="mt-1 truncate text-sm font-semibold text-neutral-900">
                        {{ settings.auth.session?.user.name }}
                      </h3>
                      <p class="mt-1 truncate text-xs text-neutral-500">{{ settings.auth.session?.user.email }}</p>
                    </div>
                  </div>
                  <div class="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
                    <span class="text-xs text-neutral-500">Hak akses global</span>
                    <span class="text-xs font-semibold text-neutral-700">
                      {{ settings.auth.hasGlobalBranchAccess ? 'Semua cabang' : 'Cabang terpilih' }}
                    </span>
                  </div>
                </section>
              </div>

              <section>
                <div class="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <h3 class="text-sm font-semibold text-neutral-900">Cabang yang dapat diakses</h3>
                    <p class="mt-1 text-xs text-neutral-500">Header X-Branch-Id mengikuti cabang yang dipilih.</p>
                  </div>
                  <span class="text-xs font-semibold text-neutral-500">{{ settings.branches.items.length }} cabang</span>
                </div>

                <div class="grid gap-3">
                  <article
                    v-for="branch in settings.branches.items"
                    :key="branch.id"
                    :class="[
                      'flex items-center justify-between gap-4 rounded-md border p-4',
                      String(branch.id) === settings.auth.branchId
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-neutral-200',
                    ]"
                  >
                    <div class="flex min-w-0 items-center gap-3">
                      <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-neutral-0 text-primary-700 shadow-card">
                        <MapPin :size="17" />
                      </span>
                      <div class="min-w-0">
                        <h4 class="truncate text-sm font-semibold text-neutral-900">{{ branch.name }}</h4>
                        <p class="mt-0.5 truncate text-xs text-neutral-500">
                          {{ branch.code }}<template v-if="branch.city"> · {{ branch.city }}</template>
                        </p>
                      </div>
                    </div>
                    <span
                      v-if="String(branch.id) === settings.auth.branchId"
                      class="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700"
                    >
                      <Check :size="13" />
                      Aktif
                    </span>
                    <span v-else class="shrink-0 text-xs font-medium text-neutral-500">
                      {{ branch.is_active ? 'Tersedia' : 'Nonaktif' }}
                    </span>
                  </article>
                </div>
              </section>

              <div class="flex items-start gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-4">
                <Info :size="18" class="mt-0.5 shrink-0 text-neutral-500" />
                <p class="text-xs leading-5 text-neutral-500">
                  Pengubahan profil akun, role, dan struktur cabang belum ditampilkan karena endpoint mutasinya belum
                  tersedia pada dokumentasi backend.
                </p>
              </div>
            </div>
          </template>

          <footer
            v-if="settings.selectedSection !== 'workspace'"
            class="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 bg-neutral-0/95 px-5 py-4 backdrop-blur sm:px-6"
          >
            <p class="text-xs text-neutral-500">
              <span v-if="settings.isDirty" class="inline-flex items-center gap-2 font-medium text-warning-500">
                <span class="h-1.5 w-1.5 rounded-full bg-warning-500"></span>
                Ada perubahan yang belum disimpan
              </span>
              <span v-else>Semua perubahan pada bagian ini sudah tersimpan.</span>
            </p>
            <div class="flex items-center gap-2">
              <AtomsAppButton
                variant="ghost"
                :disabled="!settings.isDirty || settings.isSaving"
                @click="settings.resetCurrent"
              >
                <RotateCcw :size="16" class="mr-2" />
                Batalkan
              </AtomsAppButton>
              <AtomsAppButton type="submit" :disabled="!settings.canSave">
                <LoaderCircle v-if="settings.isSaving" :size="16" class="mr-2 animate-spin" />
                <Save v-else :size="16" class="mr-2" />
                {{ settings.isSaving ? 'Menyimpan...' : 'Simpan perubahan' }}
              </AtomsAppButton>
            </div>
          </footer>
        </form>
      </div>
    </template>
  </section>
</template>

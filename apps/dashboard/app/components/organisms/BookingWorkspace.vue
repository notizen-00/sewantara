<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BookOpenCheck,
  CalendarCheck2,
  CalendarClock,
  Check,
  CircleX,
  ClipboardList,
  Clock3,
  CreditCard,
  Eye,
  History,
  LayoutGrid,
  List,
  LoaderCircle,
  Minus,
  PackageOpen,
  PackageCheck,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShoppingCart,
  Trash2,
  UserRound,
  UserRoundPlus,
  X,
} from '@lucide/vue'
import type { Booking } from '~/domain/booking'
import { useBookingPresenter } from '~/application/bookings/useBookingPresenter'

const props = withDefaults(
  defineProps<{
    createRequest?: number
  }>(),
  {
    createRequest: 0,
  },
)

defineEmits<{
  back: []
}>()

const bookings = useBookingPresenter()
const catalogView = ref<'grid' | 'list'>('grid')

const statusClass = {
  success: 'bg-primary-50 text-primary-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  warning: 'bg-amber-50 text-amber-700',
}

const checkoutPaymentOptions = [
  { mode: 'unpaid' as const, label: 'Belum bayar', caption: 'Bayar nanti', icon: Clock3 },
  { mode: 'full' as const, label: 'Lunas', caption: 'Bayar penuh', icon: Check },
  { mode: 'deposit' as const, label: 'DP', caption: 'Bayar sebagian', icon: CreditCard },
]

const checkoutPaymentMethods = [
  { value: 'cash' as const, label: 'Tunai', icon: Banknote },
  { value: 'transfer' as const, label: 'Transfer', icon: CreditCard },
]

function productSummary(booking: Booking) {
  const names = (booking.items || []).map((item) => item.product?.name).filter(Boolean)
  if (names.length) return names.join(', ')
  const count = booking.items?.length || 0
  return count ? `${count} item booking` : 'Detail produk belum tersedia'
}

async function initialize() {
  await bookings.initialize()
  if (props.createRequest > 0) bookings.openCreate()
}

onMounted(() => {
  initialize().catch(() => undefined)
})

watch(
  () => props.createRequest,
  (nextRequest, previousRequest) => {
    if (nextRequest > previousRequest) bookings.openCreate()
  },
)
</script>

<template>
  <section v-if="bookings.createOpen" class="grid gap-3">
    <button
      type="button"
      :disabled="bookings.checkoutBusy || bookings.store.checkingAvailability"
      class="inline-flex min-h-9 w-fit items-center gap-2 rounded-md px-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
      @click="bookings.closeCreate"
    >
      <ArrowLeft :size="16" />
      Daftar booking
    </button>

    <div class="grid grid-cols-[minmax(0,1fr)_430px] items-start gap-4 max-xl:grid-cols-[minmax(0,1fr)_400px] max-lg:grid-cols-1">
      <section class="overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-card">
        <div class="border-b border-neutral-200 p-4 sm:p-5">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-start gap-3">
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
                <LayoutGrid :size="17" />
              </span>
              <div>
                <h2 class="text-base font-semibold text-neutral-900">Pilih produk</h2>
                <p class="mt-1 text-xs text-neutral-500">{{ bookings.filteredCatalogProducts.length }} produk tersedia pada katalog.</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                {{ bookings.cartQuantity }} item dipilih
              </span>
              <div class="flex rounded-md border border-neutral-200 bg-neutral-50 p-1" aria-label="Tampilan katalog">
                <button
                  type="button"
                  title="Tampilan grid"
                  :class="[
                    'grid h-8 w-8 place-items-center rounded text-neutral-500 transition',
                    catalogView === 'grid' ? 'bg-neutral-0 text-primary-700 shadow-sm' : 'hover:text-neutral-900',
                  ]"
                  @click="catalogView = 'grid'"
                >
                  <LayoutGrid :size="16" />
                </button>
                <button
                  type="button"
                  title="Tampilan list"
                  :class="[
                    'grid h-8 w-8 place-items-center rounded text-neutral-500 transition',
                    catalogView === 'list' ? 'bg-neutral-0 text-primary-700 shadow-sm' : 'hover:text-neutral-900',
                  ]"
                  @click="catalogView = 'list'"
                >
                  <List :size="17" />
                </button>
              </div>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-[minmax(220px,1fr)_230px] gap-3 max-sm:grid-cols-1">
            <label class="relative block">
              <Search :size="17" class="pointer-events-none absolute left-3 top-3.5 text-neutral-500" />
              <input
                v-model="bookings.catalogSearch"
                type="search"
                placeholder="Cari nama, SKU, atau brand..."
                class="min-h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-10 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
              />
            </label>
            <AtomsAppSelect
              v-model="bookings.catalogCategoryId"
              label="Kategori"
              :options="bookings.categoryOptions"
              hide-label
            />
          </div>
        </div>

        <div
          v-if="bookings.products.loadingProducts"
          class="grid min-h-[520px] place-items-center"
        >
          <div class="text-center">
            <LoaderCircle :size="27" class="mx-auto animate-spin text-primary-600" />
            <p class="mt-3 text-sm font-semibold text-neutral-900">Menyiapkan katalog</p>
          </div>
        </div>
        <div
          v-else-if="!bookings.filteredCatalogProducts.length"
          class="grid min-h-[480px] place-items-center px-6 text-center"
        >
          <div>
            <PackageOpen :size="28" class="mx-auto text-neutral-400" />
            <h2 class="mt-4 text-base font-semibold text-neutral-900">Produk tidak ditemukan</h2>
            <p class="mt-2 text-sm text-neutral-500">Ubah kata pencarian atau kategori katalog.</p>
          </div>
        </div>
        <div
          v-else
          :class="[
            'grid p-3 sm:p-4',
            catalogView === 'grid'
              ? 'grid-cols-4 gap-3 max-2xl:grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1'
              : 'grid-cols-1 gap-2',
          ]"
        >
          <article
            v-for="product in bookings.filteredCatalogProducts"
            :key="product.id"
            :class="[
              'group overflow-hidden rounded-md border bg-neutral-0 transition hover:shadow-card',
              catalogView === 'list' ? 'flex items-stretch' : 'hover:-translate-y-0.5',
              bookings.cartQuantityFor(product.id) ? 'border-primary-600 ring-2 ring-primary-100' : 'border-neutral-200',
            ]"
          >
            <div
              :class="[
                'relative shrink-0 overflow-hidden bg-neutral-50 p-1',
                catalogView === 'grid' ? 'aspect-[16/10] w-full' : 'w-24 sm:w-28',
              ]"
            >
              <AtomsPrivateImage
                v-if="bookings.productImage(product)"
                :url="bookings.productImage(product)"
                :alt="product.name"
                class="h-full w-full"
                image-class="h-full w-full object-contain object-center"
              />
              <div v-else class="grid h-full place-items-center text-neutral-400">
                <PackageOpen :size="28" />
              </div>
              <span
                v-if="bookings.cartQuantityFor(product.id)"
                class="absolute right-2 top-2 grid h-6 min-w-6 place-items-center rounded-full bg-primary-600 px-1.5 text-[10px] font-bold text-white shadow-card"
              >
                {{ bookings.cartQuantityFor(product.id) }}
              </span>
            </div>
            <div :class="['min-w-0 flex-1', catalogView === 'grid' ? 'p-3' : 'flex items-center gap-3 p-3']">
              <div class="min-w-0 flex-1">
              <p class="text-[10px] font-semibold uppercase tracking-wide text-primary-700">
                {{ product.category?.name || 'Tanpa kategori' }}
              </p>
              <h3 :class="['mt-1 text-sm font-semibold leading-5 text-neutral-900', catalogView === 'grid' ? 'line-clamp-2 min-h-10' : 'truncate']">{{ product.name }}</h3>
              <div class="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-neutral-500">
                <span class="truncate">{{ product.sku }}</span>
                <span class="font-semibold text-neutral-700">{{ bookings.productRateLabel(product) }}</span>
              </div>
              </div>

              <button
                v-if="!bookings.cartQuantityFor(product.id)"
                type="button"
                :class="[
                  'inline-flex min-h-9 items-center justify-center rounded-md bg-primary-600 px-3 text-xs font-semibold text-white hover:bg-primary-700',
                  catalogView === 'grid' ? 'mt-3 w-full' : 'w-auto shrink-0',
                ]"
                @click="bookings.addProduct(product)"
              >
                <Plus :size="16" class="mr-2" />
                Tambah
              </button>
              <div
                v-else
                :class="[
                  'grid grid-cols-[34px_36px_34px] items-center overflow-hidden rounded-md border border-neutral-200',
                  catalogView === 'grid' ? 'mt-3 w-full' : 'shrink-0',
                ]"
              >
                <button
                  type="button"
                  class="grid h-9 place-items-center text-neutral-600 hover:bg-neutral-50"
                  @click="bookings.updateProductQuantity(product.id, bookings.cartQuantityFor(product.id) - 1)"
                >
                  <Minus :size="15" />
                </button>
                <strong class="text-center text-sm text-neutral-900">{{ bookings.cartQuantityFor(product.id) }}</strong>
                <button
                  type="button"
                  class="grid h-9 place-items-center text-primary-700 hover:bg-primary-50"
                  @click="bookings.addProduct(product)"
                >
                  <Plus :size="15" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <aside class="sticky top-20 flex max-h-[calc(100vh-96px)] flex-col overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-card max-lg:static max-lg:max-h-none">
        <div class="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4">
          <div class="flex items-center gap-3">
            <span class="grid h-9 w-9 place-items-center rounded-md bg-primary-50 text-primary-700">
              <ShoppingCart :size="17" />
            </span>
            <div>
              <h2 class="text-base font-semibold text-neutral-900">Checkout</h2>
              <p class="mt-0.5 text-xs text-neutral-500">{{ bookings.form.items.length }} jenis · {{ bookings.cartQuantity }} item</p>
            </div>
          </div>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto max-lg:max-h-none">
          <section class="grid gap-4 border-b border-neutral-200 p-5">
            <div class="flex items-center justify-between gap-3">
              <label class="text-sm font-medium text-neutral-700">
                Pelanggan <span class="text-danger-500">*</span>
              </label>
              <button
                type="button"
                class="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-primary-700 hover:bg-primary-50"
                @click="bookings.openCustomerCreate"
              >
                <UserRoundPlus :size="15" />
                Tambah pelanggan
              </button>
            </div>
            <AtomsAppSelect
              v-model="bookings.form.customer_id"
              label="Pelanggan"
              :options="bookings.customerOptions"
              hide-label
              required
            />
            <p v-if="!bookings.customerOptions.length" class="rounded-md bg-amber-50 p-3 text-xs leading-5 text-amber-700">
              Belum ada pelanggan yang dapat dipilih.
            </p>
            <div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <AtomsAppInput
                v-model="bookings.form.start_at"
                label="Mulai rental"
                type="datetime-local"
                required
              />
              <AtomsAppInput
                v-model="bookings.form.end_at"
                label="Selesai rental"
                type="datetime-local"
                required
              />
            </div>
          </section>

          <section class="border-b border-neutral-200 p-5">
            <div class="mb-3 flex items-center justify-between gap-3">
              <h3 class="text-sm font-semibold text-neutral-900">Keranjang produk</h3>
              <span class="text-xs text-neutral-500">{{ bookings.cartQuantity }} item</span>
            </div>
            <div v-if="bookings.cartItems.length" class="grid gap-3">
              <article
                v-for="line in bookings.cartItems"
                :key="line.product_id"
                class="rounded-md border border-neutral-200 p-3"
              >
                <div class="flex items-start gap-3">
                  <AtomsPrivateImage
                    v-if="line.product && bookings.productImage(line.product)"
                    :url="bookings.productImage(line.product)"
                    :alt="line.product.name"
                    class="h-12 w-12 shrink-0 rounded-md"
                    image-class="h-full w-full object-contain p-1"
                  />
                  <span v-else class="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-neutral-100 text-neutral-400">
                    <PackageOpen :size="18" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <h4 class="truncate text-sm font-semibold text-neutral-900">{{ line.product?.name || `Produk #${line.product_id}` }}</h4>
                    <p class="mt-1 text-xs text-neutral-500">
                      {{ line.product?.sku || 'SKU tidak tersedia' }}
                      <template v-if="line.product"> · {{ bookings.productRateLabel(line.product) }}</template>
                    </p>
                    <p
                      v-if="bookings.availabilityMessage(line.product_id, line.quantity)"
                      :class="[
                        'mt-2 text-xs font-semibold',
                        bookings.isLineAvailable(line.availability, line.quantity) ? 'text-primary-700' : 'text-danger-500',
                      ]"
                    >
                      {{ bookings.availabilityMessage(line.product_id, line.quantity) }}
                    </p>
                  </div>
                  <button
                    type="button"
                    title="Hapus dari keranjang"
                    class="grid h-8 w-8 shrink-0 place-items-center rounded-md text-neutral-400 hover:bg-red-50 hover:text-danger-500"
                    @click="bookings.removeProduct(line.product_id)"
                  >
                    <Trash2 :size="15" />
                  </button>
                </div>
                <div class="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3">
                  <span class="text-xs text-neutral-500">Quantity</span>
                  <div class="grid grid-cols-[34px_42px_34px] items-center overflow-hidden rounded-md border border-neutral-200">
                    <button
                      type="button"
                      class="grid h-8 place-items-center text-neutral-600 hover:bg-neutral-50"
                      @click="bookings.updateProductQuantity(line.product_id, line.quantity - 1)"
                    >
                      <Minus :size="14" />
                    </button>
                    <strong class="text-center text-xs text-neutral-900">{{ line.quantity }}</strong>
                    <button
                      type="button"
                      class="grid h-8 place-items-center text-primary-700 hover:bg-primary-50"
                      @click="bookings.updateProductQuantity(line.product_id, line.quantity + 1)"
                    >
                      <Plus :size="14" />
                    </button>
                  </div>
                </div>
              </article>
            </div>
            <div v-else class="rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-7 text-center">
              <ShoppingCart :size="22" class="mx-auto text-neutral-400" />
              <p class="mt-3 text-sm font-semibold text-neutral-900">Keranjang masih kosong</p>
              <p class="mt-1 text-xs leading-5 text-neutral-500">Pilih satu atau beberapa produk dari katalog.</p>
            </div>
          </section>

          <section class="grid gap-4 p-5">
            <label class="grid gap-2 text-sm font-medium text-neutral-700">
              Catatan internal
              <textarea
                v-model="bookings.form.notes"
                rows="3"
                maxlength="1000"
                placeholder="Catatan pengambilan atau kebutuhan pelanggan..."
                class="w-full resize-y rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
              ></textarea>
            </label>

            <div class="flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3">
                <span
                  :class="[
                    'text-[11px] font-medium',
                    bookings.availabilityState === 'available'
                      ? 'text-primary-700'
                      : bookings.availabilityState === 'unavailable'
                        ? 'text-danger-500'
                        : 'text-neutral-400',
                  ]"
                >
                  {{
                    bookings.availabilityState === 'available'
                      ? 'Produk tersedia'
                      : bookings.availabilityState === 'unavailable'
                        ? 'Ada produk tidak tersedia'
                        : 'Cek stok bersifat opsional'
                  }}
                </span>
                <button
                  type="button"
                  :disabled="bookings.store.checkingAvailability || !bookings.form.items.length"
                  class="inline-flex min-h-8 items-center rounded-md border border-neutral-200 bg-neutral-0 px-2.5 text-[11px] font-semibold text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                  @click="bookings.checkAvailability"
                >
                  <LoaderCircle v-if="bookings.store.checkingAvailability" :size="13" class="mr-1.5 animate-spin" />
                  <CalendarCheck2 v-else :size="13" class="mr-1.5" />
                  {{ bookings.store.checkingAvailability ? 'Mengecek...' : 'Cek ketersediaan' }}
                </button>
              </div>

          </section>
        </div>

        <div class="shrink-0 border-t border-neutral-200 bg-neutral-0 p-4 shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
          <AtomsAppButton class="w-full" :disabled="bookings.checkoutBusy" @click="bookings.openCheckout">
            <BookOpenCheck :size="16" class="mr-2" />
            Selesaikan booking
          </AtomsAppButton>
        </div>
      </aside>
    </div>
  </section>

  <section v-else class="grid gap-6">
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
            <BookOpenCheck :size="21" />
          </span>
          <div>
            <h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl">Booking</h1>
            <p class="mt-1 text-sm text-neutral-500">
              Kelola jadwal rental pada {{ bookings.auth.activeWorkspace.branchName || 'cabang aktif' }}.
            </p>
          </div>
        </div>
      </div>

      <AtomsAppButton @click="bookings.openCreate">
        <Plus :size="17" class="mr-2" />
        Booking baru
      </AtomsAppButton>
    </header>

    <div class="grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-neutral-100 text-neutral-700">
            <BookOpenCheck :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Seluruh data</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ bookings.store.total }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Total booking</span>
      </article>

      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-amber-50 text-amber-700">
            <Clock3 :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Perlu tindakan</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ bookings.pendingCount }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Menunggu diproses</span>
      </article>

      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-blue-50 text-blue-700">
            <CalendarCheck2 :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Operasional</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ bookings.activeCount }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Dikonfirmasi / berjalan</span>
      </article>

      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-primary-50 text-primary-700">
            <Check :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Riwayat</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ bookings.completedCount }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Booking selesai</span>
      </article>
    </div>

    <section class="overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-card">
      <div class="grid grid-cols-[minmax(240px,1fr)_190px_170px_auto_auto] gap-3 border-b border-neutral-200 bg-neutral-50 p-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <label class="relative block">
          <Search :size="17" class="pointer-events-none absolute left-3 top-3.5 text-neutral-500" />
          <input
            v-model="bookings.search"
            type="search"
            placeholder="Cari kode, pelanggan, produk..."
            class="min-h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-10 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
          />
        </label>
        <AtomsAppSelect
          v-model="bookings.statusFilter"
          label="Status booking"
          :options="bookings.statusOptions"
          hide-label
        />
        <input
          v-model="bookings.dateFilter"
          type="date"
          title="Filter tanggal booking"
          class="min-h-11 rounded-md border border-neutral-200 bg-neutral-0 px-3 text-sm text-neutral-700 outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
        />
        <button
          type="button"
          title="Reset filter"
          class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          @click="bookings.resetFilters"
        >
          <RotateCcw :size="17" />
        </button>
        <button
          type="button"
          title="Perbarui booking"
          :disabled="bookings.store.loading"
          class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-wait"
          @click="bookings.fetchAll"
        >
          <RefreshCw :size="17" :class="{ 'animate-spin': bookings.store.loading }" />
        </button>
      </div>

      <div v-if="bookings.store.loading" class="grid min-h-80 place-items-center">
        <div class="text-center">
          <LoaderCircle :size="27" class="mx-auto animate-spin text-primary-600" />
          <p class="mt-3 text-sm font-semibold text-neutral-900">Memuat daftar booking</p>
        </div>
      </div>

      <div
        v-else-if="!bookings.filteredBookings.length"
        class="grid min-h-80 place-items-center px-6 py-12 text-center"
      >
        <div class="max-w-sm">
          <span class="mx-auto grid h-12 w-12 place-items-center rounded-md bg-neutral-100 text-neutral-500">
            <CalendarClock :size="22" />
          </span>
          <h2 class="mt-4 text-base font-semibold text-neutral-900">Belum ada booking ditemukan</h2>
          <p class="mt-2 text-sm leading-6 text-neutral-500">
            Buat transaksi rental pertama atau ubah filter untuk melihat hasil lain.
          </p>
          <AtomsAppButton class="mt-5" @click="bookings.openCreate">
            <Plus :size="16" class="mr-2" />
            Booking baru
          </AtomsAppButton>
        </div>
      </div>

      <template v-else>
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr class="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
                <th class="px-5 py-3">Booking</th>
                <th class="px-4 py-3">Pelanggan</th>
                <th class="px-4 py-3">Jadwal rental</th>
                <th class="px-4 py-3">Produk</th>
                <th class="px-4 py-3">Total</th>
                <th class="px-4 py-3">Status</th>
                <th class="w-20 px-4 py-3 text-right">Detail</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              <tr
                v-for="booking in bookings.filteredBookings"
                :key="booking.id"
                class="cursor-pointer hover:bg-neutral-50/70"
                @click="bookings.openDetail(booking)"
              >
                <td class="px-5 py-4">
                  <strong class="block text-sm font-semibold text-neutral-900">{{ bookings.bookingCode(booking) }}</strong>
                  <span class="mt-1 block text-xs text-neutral-500">ID #{{ booking.id }}</span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center gap-2">
                    <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-600">
                      <UserRound :size="15" />
                    </span>
                    <div class="min-w-0">
                      <p class="max-w-44 truncate text-sm font-medium text-neutral-900">{{ bookings.customerName(booking) }}</p>
                      <p class="mt-0.5 truncate text-xs text-neutral-500">
                        {{ booking.customer?.phone || booking.customer?.whatsapp || booking.customer?.email || 'Kontak tidak tersedia' }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <p class="text-xs font-medium text-neutral-900">{{ bookings.formatDate(bookings.bookingStart(booking)) }}</p>
                  <p class="mt-1 text-xs text-neutral-500">hingga {{ bookings.formatDate(bookings.bookingEnd(booking)) }}</p>
                </td>
                <td class="px-4 py-4">
                  <p class="max-w-52 truncate text-sm text-neutral-700">{{ productSummary(booking) }}</p>
                  <span class="mt-1 block text-xs text-neutral-500">{{ booking.items?.length || 0 }} baris item</span>
                </td>
                <td class="px-4 py-4 text-sm font-semibold text-neutral-900">
                  {{ bookings.formatCurrency(bookings.bookingTotal(booking)) }}
                </td>
                <td class="px-4 py-4">
                  <span
                    :class="[
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
                      statusClass[bookings.statusTone(booking.status)],
                    ]"
                  >
                    {{ bookings.statusLabel(booking.status) }}
                  </span>
                </td>
                <td class="px-4 py-4 text-right">
                  <button
                    type="button"
                    title="Lihat detail booking"
                    class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    @click.stop="bookings.openDetail(booking)"
                  >
                    <Eye :size="16" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="divide-y divide-neutral-200 md:hidden">
          <article
            v-for="booking in bookings.filteredBookings"
            :key="booking.id"
            class="cursor-pointer p-4"
            @click="bookings.openDetail(booking)"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-sm font-semibold text-neutral-900">{{ bookings.bookingCode(booking) }}</h3>
                <p class="mt-1 text-xs text-neutral-500">{{ bookings.customerName(booking) }}</p>
              </div>
              <span
                :class="[
                  'rounded-full px-2 py-1 text-[11px] font-semibold',
                  statusClass[bookings.statusTone(booking.status)],
                ]"
              >
                {{ bookings.statusLabel(booking.status) }}
              </span>
            </div>
            <div class="mt-4 grid grid-cols-[1fr_1fr_auto] items-center gap-3 rounded-md bg-neutral-50 p-3">
              <div>
                <span class="text-[11px] text-neutral-500">Mulai</span>
                <p class="mt-1 text-xs font-medium text-neutral-900">{{ bookings.formatDate(bookings.bookingStart(booking)) }}</p>
              </div>
              <div>
                <span class="text-[11px] text-neutral-500">Total</span>
                <p class="mt-1 text-xs font-semibold text-neutral-900">{{ bookings.formatCurrency(bookings.bookingTotal(booking)) }}</p>
              </div>
              <ArrowRight :size="17" class="text-neutral-400" />
            </div>
          </article>
        </div>
      </template>

      <footer class="flex items-center justify-between border-t border-neutral-200 px-5 py-3 text-xs text-neutral-500">
        <span>Menampilkan {{ bookings.filteredBookings.length }} booking</span>
        <span>Total {{ bookings.store.total }} data</span>
      </footer>
    </section>
  </section>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="bookings.customerCreateOpen" class="fixed inset-0 z-[90] grid place-items-center overflow-y-auto p-4 sm:p-6">
        <button
          type="button"
          class="absolute inset-0 bg-neutral-950/55 backdrop-blur-sm"
          aria-label="Tutup form pelanggan"
          @click="bookings.closeCustomerCreate"
        ></button>

        <form
          class="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl bg-neutral-0 shadow-2xl"
          @submit.prevent="bookings.submitCustomer"
        >
          <header class="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:px-6">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">Pelanggan</p>
              <h2 class="mt-1 text-xl font-bold text-neutral-900">Tambah pelanggan</h2>
              <p class="mt-1 text-sm text-neutral-500">Pelanggan baru langsung dipilih untuk booking ini.</p>
            </div>
            <button
              type="button"
              title="Tutup form pelanggan"
              :disabled="bookings.customerStore.creating"
              class="grid h-10 w-10 shrink-0 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
              @click="bookings.closeCustomerCreate"
            >
              <X :size="19" />
            </button>
          </header>

          <div class="grid max-h-[calc(100vh-210px)] gap-4 overflow-y-auto p-5 sm:grid-cols-2 sm:p-6">
            <div class="sm:col-span-2">
              <AtomsAppInput
                v-model="bookings.customerForm.name"
                label="Nama lengkap"
                placeholder="Nama pelanggan"
                autocomplete="name"
                :maxlength="150"
                required
              />
            </div>
            <AtomsAppInput
              v-model="bookings.customerForm.phone"
              label="Nomor telepon"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              placeholder="0812 3456 7890"
            />
            <AtomsAppInput
              v-model="bookings.customerForm.whatsapp"
              label="Nomor WhatsApp"
              type="tel"
              inputmode="tel"
              placeholder="0812 3456 7890"
            />
            <div class="sm:col-span-2">
              <AtomsAppInput
                v-model="bookings.customerForm.email"
                label="Email"
                type="email"
                inputmode="email"
                autocomplete="email"
                placeholder="nama@email.com"
              />
            </div>
            <label class="grid gap-2 text-sm font-medium text-neutral-700 sm:col-span-2">
              Alamat
              <textarea
                v-model="bookings.customerForm.address"
                rows="3"
                maxlength="1000"
                placeholder="Alamat pelanggan"
                class="w-full resize-y rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
              ></textarea>
            </label>
          </div>

          <footer class="flex flex-col-reverse gap-2 border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <AtomsAppButton variant="ghost" type="button" :disabled="bookings.customerStore.creating" @click="bookings.closeCustomerCreate">
              Batal
            </AtomsAppButton>
            <AtomsAppButton type="submit" :disabled="bookings.customerStore.creating">
              <LoaderCircle v-if="bookings.customerStore.creating" :size="16" class="mr-2 animate-spin" />
              <UserRoundPlus v-else :size="16" class="mr-2" />
              {{ bookings.customerStore.creating ? 'Menyimpan...' : 'Simpan pelanggan' }}
            </AtomsAppButton>
          </footer>
        </form>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="bookings.checkoutOpen" class="fixed inset-0 z-[85] grid place-items-center overflow-y-auto p-4 sm:p-6">
        <button
          type="button"
          class="absolute inset-0 bg-neutral-950/55 backdrop-blur-sm"
          aria-label="Tutup checkout"
          @click="bookings.closeCheckout"
        ></button>

        <section class="relative z-10 w-full max-w-xl overflow-hidden rounded-xl bg-neutral-0 shadow-2xl">
          <header class="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:px-6">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-primary-700">Checkout</p>
              <h2 class="mt-1 text-xl font-bold text-neutral-900">Selesaikan booking</h2>
              <p class="mt-1 text-sm text-neutral-500">Pilih status pembayaran untuk transaksi ini.</p>
            </div>
            <button
              type="button"
              title="Tutup checkout"
              :disabled="bookings.checkoutBusy"
              class="grid h-10 w-10 shrink-0 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
              @click="bookings.closeCheckout"
            >
              <X :size="19" />
            </button>
          </header>

          <div class="grid max-h-[calc(100vh-190px)] gap-5 overflow-y-auto p-5 sm:p-6">
            <div class="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <div class="flex items-end justify-between gap-4">
                <div>
                  <p class="text-xs font-medium text-neutral-500">Total perkiraan</p>
                  <strong class="mt-1 block text-2xl font-bold text-neutral-900">
                    {{ bookings.formatCurrency(bookings.estimatedPricing.total) }}
                  </strong>
                </div>
                <div class="text-right text-xs text-neutral-500">
                  <p>{{ bookings.cartQuantity }} item</p>
                  <p class="mt-1">{{ bookings.estimatedRentalDuration }}</p>
                </div>
              </div>
            </div>

            <div>
              <p class="mb-3 text-sm font-semibold text-neutral-900">Status pembayaran</p>
              <div class="grid grid-cols-3 gap-2 max-sm:grid-cols-1">
                <button
                  v-for="option in checkoutPaymentOptions"
                  :key="option.mode"
                  type="button"
                  :disabled="bookings.checkoutBusy"
                  :class="[
                    'rounded-lg border p-3 text-left transition disabled:opacity-60',
                    bookings.paymentForm.mode === option.mode
                      ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-100'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50',
                  ]"
                  @click="bookings.paymentForm.mode = option.mode"
                >
                  <component :is="option.icon" :size="18" :class="bookings.paymentForm.mode === option.mode ? 'text-primary-700' : 'text-neutral-400'" />
                  <strong class="mt-2 block text-sm text-neutral-900">{{ option.label }}</strong>
                  <span class="mt-0.5 block text-xs text-neutral-500">{{ option.caption }}</span>
                </button>
              </div>
            </div>

            <div v-if="bookings.paymentForm.mode !== 'unpaid'" class="grid gap-4">
              <div>
                <p class="mb-2 text-sm font-semibold text-neutral-900">Metode pembayaran</p>
                <div class="grid grid-cols-2 gap-2 rounded-lg bg-neutral-100 p-1">
                  <button
                    v-for="method in checkoutPaymentMethods"
                    :key="method.value"
                    type="button"
                    :disabled="bookings.checkoutBusy"
                    :class="[
                      'inline-flex min-h-11 items-center justify-center rounded-md px-3 text-sm font-semibold transition disabled:opacity-60',
                      bookings.paymentForm.method === method.value
                        ? 'bg-neutral-0 text-primary-700 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900',
                    ]"
                    @click="bookings.paymentForm.method = method.value"
                  >
                    <component :is="method.icon" :size="16" class="mr-2" />
                    {{ method.label }}
                  </button>
                </div>
              </div>

              <AtomsAppInput
                v-if="bookings.paymentForm.mode === 'deposit'"
                v-model="bookings.paymentForm.deposit_amount"
                label="Nominal DP"
                type="number"
                inputmode="numeric"
                :min="1"
                :step="1"
                placeholder="Masukkan nominal DP"
                required
              />
            </div>
          </div>

          <footer class="flex flex-col-reverse gap-2 border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <AtomsAppButton variant="ghost" :disabled="bookings.checkoutBusy" @click="bookings.closeCheckout">
              Kembali
            </AtomsAppButton>
            <AtomsAppButton :disabled="bookings.checkoutBusy" @click="bookings.submit">
              <LoaderCircle v-if="bookings.checkoutBusy" :size="16" class="mr-2 animate-spin" />
              <BookOpenCheck v-else :size="16" class="mr-2" />
              {{
                bookings.store.recordingPayment
                  ? 'Mencatat pembayaran...'
                  : bookings.store.creating
                    ? 'Membuat booking...'
                    : bookings.paymentForm.mode === 'full'
                      ? 'Buat booking & lunasi'
                      : bookings.paymentForm.mode === 'deposit'
                        ? 'Buat booking & catat DP'
                        : 'Buat booking'
              }}
            </AtomsAppButton>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="bookings.detailOpen && bookings.currentBooking" class="fixed inset-0 z-[70]">
        <button
          type="button"
          aria-label="Tutup detail booking"
          class="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
          @click="bookings.closeDetail"
        ></button>

        <article class="booking-detail-panel absolute inset-y-0 right-0 flex w-full max-w-3xl flex-col bg-neutral-0 shadow-2xl">
          <header class="shrink-0 border-b border-neutral-200 px-5 py-4 sm:px-6">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="truncate text-lg font-semibold text-neutral-900">
                    {{ bookings.bookingCode(bookings.currentBooking) }}
                  </h2>
                  <span
                    :class="[
                      'rounded-full px-2.5 py-1 text-xs font-semibold',
                      statusClass[bookings.statusTone(bookings.currentBooking.status)],
                    ]"
                  >
                    {{ bookings.statusLabel(bookings.currentBooking.status) }}
                  </span>
                </div>
                <p class="mt-1 text-xs text-neutral-500">
                  Booking #{{ bookings.currentBooking.id }}
                  <template v-if="bookings.currentBooking.branch?.name">
                    · {{ bookings.currentBooking.branch.name }}
                  </template>
                </p>
              </div>
              <div class="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  title="Perbarui detail"
                  :disabled="bookings.store.loadingDetail"
                  class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
                  @click="bookings.refreshDetail"
                >
                  <RefreshCw :size="16" :class="{ 'animate-spin': bookings.store.loadingDetail }" />
                </button>
                <button
                  type="button"
                  title="Tutup detail"
                  class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"
                  @click="bookings.closeDetail"
                >
                  <X :size="18" />
                </button>
              </div>
            </div>
          </header>

          <div v-if="bookings.store.loadingDetail" class="h-0.5 shrink-0 overflow-hidden bg-primary-100">
            <div class="h-full w-1/2 animate-pulse rounded-full bg-primary-600"></div>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto">
            <div class="grid gap-6 p-5 sm:p-6">
              <section class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <article class="rounded-md border border-neutral-200 p-4">
                  <div class="flex items-start gap-3">
                    <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
                      <UserRound :size="17" />
                    </span>
                    <div class="min-w-0">
                      <p class="text-xs font-medium text-neutral-500">Pelanggan</p>
                      <h3 class="mt-1 truncate text-sm font-semibold text-neutral-900">
                        {{ bookings.customerName(bookings.currentBooking) }}
                      </h3>
                      <p class="mt-1 truncate text-xs text-neutral-500">
                        {{
                          bookings.currentBooking.customer?.phone
                            || bookings.currentBooking.customer?.whatsapp
                            || bookings.currentBooking.customer?.email
                            || 'Kontak tidak tersedia'
                        }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="bookings.currentBooking.customer?.phone || bookings.currentBooking.customer?.whatsapp"
                    class="mt-4 border-t border-neutral-200 pt-3"
                  >
                    <a
                      :href="`tel:${bookings.currentBooking.customer?.phone || bookings.currentBooking.customer?.whatsapp || ''}`"
                      class="inline-flex items-center text-xs font-semibold text-primary-700"
                    >
                      <Phone :size="14" class="mr-2" />
                      Hubungi pelanggan
                    </a>
                  </div>
                </article>

                <article class="rounded-md border border-neutral-200 p-4">
                  <div class="flex items-start gap-3">
                    <span class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-700">
                      <CalendarClock :size="17" />
                    </span>
                    <div>
                      <p class="text-xs font-medium text-neutral-500">Periode rental</p>
                      <p class="mt-1 text-sm font-semibold text-neutral-900">
                        {{ bookings.formatDate(bookings.bookingStart(bookings.currentBooking)) }}
                      </p>
                      <p class="mt-1 text-xs text-neutral-500">
                        hingga {{ bookings.formatDate(bookings.bookingEnd(bookings.currentBooking)) }}
                      </p>
                    </div>
                  </div>
                </article>
              </section>

              <section>
                <div class="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 class="text-sm font-semibold text-neutral-900">Item booking</h3>
                    <p class="mt-1 text-xs text-neutral-500">Produk dan unit yang tercatat pada transaksi.</p>
                  </div>
                  <PackageOpen :size="18" class="text-neutral-400" />
                </div>
                <div
                  v-if="bookings.currentBooking.items?.length"
                  class="overflow-hidden rounded-md border border-neutral-200"
                >
                  <article
                    v-for="item in bookings.currentBooking.items"
                    :key="item.id || `${item.product_id}-${item.product_unit_id || 0}`"
                    class="grid grid-cols-[minmax(0,1fr)_90px_130px] items-center gap-4 border-b border-neutral-200 p-4 last:border-0 max-sm:grid-cols-[1fr_auto]"
                  >
                    <div class="min-w-0">
                      <h4 class="truncate text-sm font-semibold text-neutral-900">
                        {{ item.product?.name || `Produk #${item.product_id}` }}
                      </h4>
                      <p class="mt-1 text-xs text-neutral-500">
                        {{ item.product?.sku || 'SKU tidak tersedia' }}
                        <template v-if="item.pricing_type"> · {{ item.pricing_type.replace(/_/g, ' ') }}</template>
                      </p>
                      <p v-if="item.product_unit || item.units?.length" class="mt-2 text-xs font-medium text-primary-700">
                        Unit:
                        {{
                          item.product_unit?.unit_code
                            || item.units?.map((unit) => unit.unit_code || `#${unit.id}`).join(', ')
                        }}
                      </p>
                    </div>
                    <div class="text-right max-sm:text-left">
                      <span class="text-xs text-neutral-500">Jumlah</span>
                      <strong class="mt-1 block text-sm text-neutral-900">{{ item.quantity || 1 }}</strong>
                    </div>
                    <div class="text-right max-sm:col-span-2">
                      <span class="text-xs text-neutral-500">Subtotal</span>
                      <strong class="mt-1 block text-sm text-neutral-900">
                        {{ bookings.formatCurrency(bookings.itemSubtotal(item)) }}
                      </strong>
                    </div>
                  </article>
                </div>
                <div v-else class="rounded-md border border-neutral-200 bg-neutral-50 p-5 text-center text-sm text-neutral-500">
                  Belum ada detail item untuk booking ini.
                </div>
              </section>

              <section class="grid grid-cols-[minmax(0,1fr)_280px] gap-4 max-lg:grid-cols-1">
                <article class="rounded-md border border-neutral-200">
                  <div class="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
                    <CreditCard :size="17" class="text-neutral-500" />
                    <div>
                      <h3 class="text-sm font-semibold text-neutral-900">Pembayaran</h3>
                      <p class="mt-0.5 text-xs text-neutral-500">{{ bookings.currentBooking.payment_status || 'Status dari transaksi' }}</p>
                    </div>
                  </div>
                  <div v-if="bookings.currentBooking.payments?.length" class="divide-y divide-neutral-200">
                    <div
                      v-for="payment in bookings.currentBooking.payments"
                      :key="payment.id"
                      class="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <div class="min-w-0">
                        <p class="truncate text-xs font-semibold text-neutral-900">{{ bookings.paymentCode(payment) }}</p>
                        <p class="mt-1 text-xs capitalize text-neutral-500">
                          {{ bookings.paymentMethod(payment) }} · {{ bookings.formatDate(payment.paid_at || payment.created_at || '') }}
                        </p>
                      </div>
                      <div class="text-right">
                        <p class="text-sm font-semibold text-neutral-900">{{ bookings.formatCurrency(Number(payment.amount || 0)) }}</p>
                        <span
                          :class="[
                            'mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            statusClass[bookings.statusTone(payment.status || 'pending')],
                          ]"
                        >
                          {{ bookings.statusLabel(payment.status || 'pending') }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="p-4 text-xs leading-5 text-neutral-500">
                    Belum ada pembayaran yang tercatat untuk booking ini.
                  </div>
                </article>

                <article class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                  <div class="flex items-center gap-2">
                    <Banknote :size="17" class="text-neutral-500" />
                    <h3 class="text-sm font-semibold text-neutral-900">Ringkasan nilai</h3>
                  </div>
                  <dl class="mt-4 grid gap-3 text-xs">
                    <div class="flex justify-between gap-3">
                      <dt class="text-neutral-500">Subtotal</dt>
                      <dd class="font-medium text-neutral-900">
                        {{ bookings.formatCurrency(Number(bookings.currentBooking.subtotal ?? bookings.bookingTotal(bookings.currentBooking))) }}
                      </dd>
                    </div>
                    <div class="flex justify-between gap-3">
                      <dt class="text-neutral-500">Diskon</dt>
                      <dd class="font-medium text-neutral-900">
                        -{{ bookings.formatCurrency(Number(bookings.currentBooking.discount_amount || 0)) }}
                      </dd>
                    </div>
                    <div class="flex justify-between gap-3">
                      <dt class="text-neutral-500">Deposit</dt>
                      <dd class="font-medium text-neutral-900">
                        {{ bookings.formatCurrency(Number(bookings.currentBooking.deposit_amount || 0)) }}
                      </dd>
                    </div>
                    <div class="flex justify-between gap-3 border-t border-neutral-200 pt-3">
                      <dt class="font-semibold text-neutral-900">Total</dt>
                      <dd class="font-bold text-neutral-900">
                        {{ bookings.formatCurrency(bookings.bookingTotal(bookings.currentBooking)) }}
                      </dd>
                    </div>
                    <div class="flex justify-between gap-3">
                      <dt class="text-primary-700">Sudah dibayar</dt>
                      <dd class="font-semibold text-primary-700">{{ bookings.formatCurrency(bookings.paidAmount) }}</dd>
                    </div>
                    <div class="flex justify-between gap-3">
                      <dt class="text-danger-500">Sisa</dt>
                      <dd class="font-semibold text-danger-500">{{ bookings.formatCurrency(bookings.outstandingAmount) }}</dd>
                    </div>
                  </dl>
                </article>
              </section>

              <section v-if="bookings.currentBooking.notes">
                <div class="flex items-center gap-2">
                  <ClipboardList :size="17" class="text-neutral-500" />
                  <h3 class="text-sm font-semibold text-neutral-900">Catatan booking</h3>
                </div>
                <p class="mt-3 whitespace-pre-line rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                  {{ bookings.currentBooking.notes }}
                </p>
              </section>

              <section>
                <div class="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 class="text-sm font-semibold text-neutral-900">Riwayat aktivitas</h3>
                    <p class="mt-1 text-xs text-neutral-500">Perubahan status dan aktivitas yang dikembalikan detail booking.</p>
                  </div>
                  <History :size="18" class="text-neutral-400" />
                </div>
                <div v-if="bookings.historyEntries.length" class="relative ml-2 border-l border-neutral-200 pl-6">
                  <article
                    v-for="entry in bookings.historyEntries"
                    :key="entry.id"
                    class="relative pb-5 last:pb-0"
                  >
                    <span class="absolute -left-[29px] top-1 h-2.5 w-2.5 rounded-full border-2 border-neutral-0 bg-primary-600 ring-2 ring-primary-100"></span>
                    <div class="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h4 class="text-sm font-semibold capitalize text-neutral-900">{{ entry.title }}</h4>
                        <p v-if="entry.description" class="mt-1 text-xs leading-5 text-neutral-500">{{ entry.description }}</p>
                      </div>
                      <span v-if="entry.status" :class="['rounded-full px-2 py-0.5 text-[10px] font-semibold', statusClass[bookings.statusTone(entry.status)]]">
                        {{ bookings.statusLabel(entry.status) }}
                      </span>
                    </div>
                    <p class="mt-2 text-[11px] text-neutral-400">
                      {{ entry.actor }} · {{ bookings.formatDate(entry.timestamp) }}
                    </p>
                  </article>
                </div>
                <div v-else class="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500">
                  Backend belum mengembalikan history untuk booking ini.
                </div>
              </section>
            </div>
          </div>

          <footer class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-neutral-200 bg-neutral-0 px-5 py-4 sm:px-6">
            <p class="text-xs text-neutral-500">
              Dibuat {{ bookings.formatDate(bookings.currentBooking.created_at || '') }}
            </p>
            <div class="flex items-center gap-2">
              <button
                v-if="bookings.canCancel"
                type="button"
                :disabled="Boolean(bookings.store.updatingStatus)"
                class="inline-flex min-h-11 items-center rounded-md border border-red-200 px-4 text-sm font-semibold text-danger-500 hover:bg-red-50 disabled:opacity-50"
                @click="bookings.requestStatusAction('cancel')"
              >
                <CircleX :size="16" class="mr-2" />
                Batalkan booking
              </button>
              <AtomsAppButton
                v-if="bookings.canReturn"
                :disabled="Boolean(bookings.store.updatingStatus)"
                @click="bookings.requestStatusAction('return')"
              >
                <PackageCheck :size="16" class="mr-2" />
                Proses pengembalian
              </AtomsAppButton>
              <span v-if="!bookings.canCancel && !bookings.canReturn" class="text-xs font-medium text-neutral-500">
                Tidak ada aksi status untuk kondisi ini.
              </span>
            </div>
          </footer>
        </article>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="bookings.actionTarget && bookings.currentBooking" class="fixed inset-0 z-[80] grid place-items-center p-4">
        <button
          type="button"
          aria-label="Batal mengubah status"
          class="absolute inset-0 bg-neutral-900/50 backdrop-blur-[2px]"
          @click="bookings.cancelStatusAction"
        ></button>
        <section class="relative w-full max-w-md rounded-lg border border-neutral-200 bg-neutral-0 p-6 shadow-2xl">
          <span
            :class="[
              'grid h-11 w-11 place-items-center rounded-md',
              bookings.actionTarget === 'cancel' ? 'bg-red-50 text-danger-500' : 'bg-primary-50 text-primary-700',
            ]"
          >
            <CircleX v-if="bookings.actionTarget === 'cancel'" :size="20" />
            <PackageCheck v-else :size="20" />
          </span>
          <h2 class="mt-4 text-lg font-semibold text-neutral-900">
            {{ bookings.actionTarget === 'cancel' ? 'Batalkan booking?' : 'Proses pengembalian?' }}
          </h2>
          <p class="mt-2 text-sm leading-6 text-neutral-500">
            {{
              bookings.actionTarget === 'cancel'
                ? `${bookings.bookingCode(bookings.currentBooking)} akan dibatalkan melalui endpoint cancel resmi.`
                : `${bookings.bookingCode(bookings.currentBooking)} akan diproses sebagai dikembalikan.`
            }}
          </p>
          <div class="mt-6 flex justify-end gap-2">
            <AtomsAppButton
              variant="ghost"
              :disabled="Boolean(bookings.store.updatingStatus)"
              @click="bookings.cancelStatusAction"
            >
              Kembali
            </AtomsAppButton>
            <button
              type="button"
              :disabled="Boolean(bookings.store.updatingStatus)"
              :class="[
                'inline-flex min-h-11 items-center rounded-md px-4 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60',
                bookings.actionTarget === 'cancel' ? 'bg-danger-500 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700',
              ]"
              @click="bookings.confirmStatusAction"
            >
              <LoaderCircle v-if="bookings.store.updatingStatus" :size="16" class="mr-2 animate-spin" />
              {{ bookings.store.updatingStatus ? 'Memproses...' : 'Ya, lanjutkan' }}
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 200ms ease;
}

.drawer-enter-active form,
.drawer-leave-active form,
.drawer-enter-active .booking-detail-panel,
.drawer-leave-active .booking-detail-panel {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from form,
.drawer-leave-to form,
.drawer-enter-from .booking-detail-panel,
.drawer-leave-to .booking-detail-panel {
  transform: translateX(100%);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 180ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

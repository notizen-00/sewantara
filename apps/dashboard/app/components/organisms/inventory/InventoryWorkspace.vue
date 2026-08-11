<script setup lang="ts">
import {
  ArrowDownCircle,
  ArrowLeft,
  ArrowUpCircle,
  Barcode,
  Boxes,
  Check,
  ClipboardList,
  Gauge,
  LoaderCircle,
  PackagePlus,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from '@lucide/vue'
import { useInventoryPresenter } from '~/application/inventory/useInventoryPresenter'

defineEmits<{
  back: []
}>()

const inventory = useInventoryPresenter()

function statusClasses(status: string) {
  const tone = inventory.statusTone(status)
  if (tone === 'success') return 'bg-primary-50 text-primary-700'
  if (tone === 'danger') return 'bg-red-50 text-danger-500'
  if (tone === 'info') return 'bg-blue-50 text-blue-700'
  return 'bg-amber-50 text-amber-700'
}

function stockAvailabilityWidth(total: number, available: number) {
  if (total <= 0) return '0%'
  return `${Math.max(0, Math.min(100, (available / total) * 100))}%`
}

onMounted(() => {
  inventory.initialize().catch(() => undefined)
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
            <Boxes :size="21" />
          </span>
          <div>
            <h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl">Inventory</h1>
            <p class="mt-1 text-sm text-neutral-500">
              Unit serialized dan saldo stok untuk {{ inventory.auth.activeWorkspace.branchName || 'cabang aktif' }}.
            </p>
          </div>
        </div>
      </div>

      <AtomsAppButton v-if="inventory.activeTab === 'units'" @click="inventory.openUnitCreate">
        <PackagePlus :size="17" class="mr-2" />
        Tambah unit
      </AtomsAppButton>
      <AtomsAppButton v-else @click="inventory.openAdjustment()">
        <SlidersHorizontal :size="17" class="mr-2" />
        Adjust stok
      </AtomsAppButton>
    </header>

    <div class="grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-neutral-100 text-neutral-700">
            <Barcode :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Unit serialized</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ inventory.store.unitMeta.total }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Unit terdaftar</span>
      </article>
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-primary-50 text-primary-700">
            <Check :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Pada halaman ini</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ inventory.availableUnitCount }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Unit tersedia</span>
      </article>
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-blue-50 text-blue-700">
            <Boxes :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Stok quantity</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ inventory.stockTotal }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Total stok tercatat</span>
      </article>
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-amber-50 text-amber-700">
            <Gauge :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Siap digunakan</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ inventory.stockAvailable }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Stok quantity tersedia</span>
      </article>
    </div>

    <div class="overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-card">
      <div class="flex items-center gap-1 border-b border-neutral-200 px-4 pt-3">
        <button
          type="button"
          :class="[
            'relative min-h-11 px-4 text-sm font-semibold transition',
            inventory.activeTab === 'units' ? 'text-primary-700' : 'text-neutral-500 hover:text-neutral-900',
          ]"
          @click="inventory.setActiveTab('units')"
        >
          Unit serialized
          <span
            v-if="inventory.activeTab === 'units'"
            class="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary-600"
          ></span>
        </button>
        <button
          type="button"
          :class="[
            'relative min-h-11 px-4 text-sm font-semibold transition',
            inventory.activeTab === 'stocks' ? 'text-primary-700' : 'text-neutral-500 hover:text-neutral-900',
          ]"
          @click="inventory.setActiveTab('stocks')"
        >
          Stok quantity
          <span
            v-if="inventory.activeTab === 'stocks'"
            class="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary-600"
          ></span>
        </button>
      </div>

      <template v-if="inventory.activeTab === 'units'">
        <div class="grid grid-cols-[minmax(220px,1fr)_240px_180px_auto] gap-3 border-b border-neutral-200 bg-neutral-50 p-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <label class="relative block">
            <Search :size="17" class="pointer-events-none absolute left-3 top-3.5 text-neutral-500" />
            <input
              v-model="inventory.unitSearch"
              type="search"
              placeholder="Cari kode, barcode, serial..."
              class="min-h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-10 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
            />
          </label>
          <AtomsAppSelect
            v-model="inventory.unitProductFilter"
            label="Produk"
            :options="inventory.unitProductFilterOptions"
            hide-label
          />
          <AtomsAppSelect
            v-model="inventory.unitStatusFilter"
            label="Status"
            :options="inventory.unitStatusOptions"
            hide-label
          />
          <button
            type="button"
            title="Reset filter"
            class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            @click="inventory.resetUnitFilters"
          >
            <RotateCcw :size="17" />
          </button>
        </div>

        <div v-if="inventory.store.loadingUnits" class="grid min-h-72 place-items-center">
          <div class="text-center">
            <LoaderCircle :size="26" class="mx-auto animate-spin text-primary-600" />
            <p class="mt-3 text-sm font-semibold text-neutral-900">Memuat unit inventory</p>
          </div>
        </div>
        <div
          v-else-if="!inventory.filteredUnits.length"
          class="grid min-h-80 place-items-center px-6 py-12 text-center"
        >
          <div class="max-w-sm">
            <Barcode :size="27" class="mx-auto text-neutral-400" />
            <h2 class="mt-4 text-base font-semibold text-neutral-900">Belum ada unit ditemukan</h2>
            <p class="mt-2 text-sm leading-6 text-neutral-500">
              Unit individual hanya dibuat untuk produk dengan tipe inventory serialized.
            </p>
            <AtomsAppButton class="mt-5" @click="inventory.openUnitCreate">
              <Plus :size="16" class="mr-2" />
              Tambah unit
            </AtomsAppButton>
          </div>
        </div>

        <template v-else>
          <div class="hidden overflow-x-auto md:block">
            <table class="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr class="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
                  <th class="px-5 py-3">Unit</th>
                  <th class="px-4 py-3">Produk</th>
                  <th class="px-4 py-3">Identitas</th>
                  <th class="px-4 py-3">Kondisi</th>
                  <th class="px-4 py-3">Pembelian</th>
                  <th class="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200">
                <tr v-for="unit in inventory.filteredUnits" :key="unit.id" class="hover:bg-neutral-50/70">
                  <td class="px-5 py-4">
                    <strong class="block text-sm font-semibold text-neutral-900">{{ unit.unit_code }}</strong>
                    <span v-if="unit.current_meter !== null && unit.current_meter !== undefined" class="mt-1 block text-xs text-neutral-500">
                      {{ unit.current_meter }} {{ unit.meter_unit || 'meter' }}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <p class="max-w-56 truncate text-sm font-medium text-neutral-900">
                      {{ unit.product?.name || inventory.productName(unit.product_id) }}
                    </p>
                    <p class="mt-1 text-xs text-neutral-500">
                      {{ unit.product?.sku || inventory.productSku(unit.product_id) }}
                    </p>
                  </td>
                  <td class="px-4 py-4 text-xs text-neutral-500">
                    <p>Serial: <span class="font-medium text-neutral-700">{{ unit.serial_number || '—' }}</span></p>
                    <p class="mt-1">Barcode: <span class="font-medium text-neutral-700">{{ unit.barcode || '—' }}</span></p>
                  </td>
                  <td class="px-4 py-4 text-sm capitalize text-neutral-700">
                    {{ (unit.condition || 'unknown').replace(/_/g, ' ') }}
                  </td>
                  <td class="px-4 py-4">
                    <p class="text-sm font-medium text-neutral-900">{{ inventory.formatCurrency(unit.purchase_price) }}</p>
                    <p class="mt-1 text-xs text-neutral-500">{{ inventory.formatDate(unit.purchase_date) }}</p>
                  </td>
                  <td class="px-4 py-4">
                    <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', statusClasses(unit.status)]">
                      {{ inventory.statusLabel(unit.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="divide-y divide-neutral-200 md:hidden">
            <article v-for="unit in inventory.filteredUnits" :key="unit.id" class="p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <h3 class="truncate text-sm font-semibold text-neutral-900">{{ unit.unit_code }}</h3>
                  <p class="mt-1 truncate text-xs text-neutral-500">
                    {{ unit.product?.name || inventory.productName(unit.product_id) }}
                  </p>
                </div>
                <span :class="['shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold', statusClasses(unit.status)]">
                  {{ inventory.statusLabel(unit.status) }}
                </span>
              </div>
              <div class="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-200 pt-3 text-xs text-neutral-500">
                <span>Serial<br /><strong class="text-neutral-700">{{ unit.serial_number || '—' }}</strong></span>
                <span>Kondisi<br /><strong class="capitalize text-neutral-700">{{ unit.condition }}</strong></span>
              </div>
            </article>
          </div>
        </template>

        <footer class="flex items-center justify-between gap-3 border-t border-neutral-200 px-5 py-3 text-xs text-neutral-500">
          <span>Menampilkan {{ inventory.filteredUnits.length }} unit</span>
          <span>Total {{ inventory.store.unitMeta.total }} data</span>
        </footer>
      </template>

      <template v-else>
        <div class="grid grid-cols-[minmax(220px,1fr)_260px_auto] gap-3 border-b border-neutral-200 bg-neutral-50 p-4 max-md:grid-cols-1">
          <label class="relative block">
            <Search :size="17" class="pointer-events-none absolute left-3 top-3.5 text-neutral-500" />
            <input
              v-model="inventory.stockSearch"
              type="search"
              placeholder="Cari produk quantity..."
              class="min-h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-10 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
            />
          </label>
          <AtomsAppSelect
            v-model="inventory.stockProductFilter"
            label="Produk"
            :options="inventory.stockProductFilterOptions"
            hide-label
          />
          <button
            type="button"
            title="Reset filter"
            class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            @click="inventory.resetStockFilters"
          >
            <RotateCcw :size="17" />
          </button>
        </div>

        <div v-if="inventory.store.loadingStocks" class="grid min-h-72 place-items-center">
          <LoaderCircle :size="26" class="animate-spin text-primary-600" />
        </div>
        <div
          v-else-if="!inventory.filteredStocks.length"
          class="grid min-h-80 place-items-center px-6 py-12 text-center"
        >
          <div class="max-w-sm">
            <Boxes :size="27" class="mx-auto text-neutral-400" />
            <h2 class="mt-4 text-base font-semibold text-neutral-900">Saldo stok belum tersedia</h2>
            <p class="mt-2 text-sm leading-6 text-neutral-500">
              Tambahkan stok awal untuk produk quantity pada cabang aktif.
            </p>
            <AtomsAppButton class="mt-5" @click="inventory.openAdjustment()">
              <SlidersHorizontal :size="16" class="mr-2" />
              Buat adjustment
            </AtomsAppButton>
          </div>
        </div>

        <div v-else class="grid grid-cols-2 gap-4 p-4 max-lg:grid-cols-1">
          <article
            v-for="stock in inventory.filteredStocks"
            :key="stock.id || stock.product_id"
            class="rounded-md border border-neutral-200 p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <h3 class="truncate text-sm font-semibold text-neutral-900">
                  {{ stock.product?.name || inventory.productName(stock.product_id) }}
                </h3>
                <p class="mt-1 text-xs text-neutral-500">
                  {{ stock.product?.sku || inventory.productSku(stock.product_id) }}
                </p>
              </div>
              <button
                type="button"
                class="inline-flex min-h-9 shrink-0 items-center rounded-md border border-neutral-200 px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                @click="inventory.openAdjustment(stock.product_id)"
              >
                <SlidersHorizontal :size="14" class="mr-2" />
                Adjust
              </button>
            </div>

            <div class="mt-5 grid grid-cols-3 gap-3">
              <div>
                <span class="text-xs text-neutral-500">Total</span>
                <strong class="mt-1 block text-xl font-bold text-neutral-900">{{ inventory.totalQuantity(stock) }}</strong>
              </div>
              <div>
                <span class="text-xs text-neutral-500">Tersedia</span>
                <strong class="mt-1 block text-xl font-bold text-primary-700">{{ inventory.availableQuantity(stock) }}</strong>
              </div>
              <div>
                <span class="text-xs text-neutral-500">Terikat</span>
                <strong class="mt-1 block text-xl font-bold text-neutral-700">{{ inventory.committedQuantity(stock) }}</strong>
              </div>
            </div>

            <div class="mt-4">
              <div class="mb-2 flex items-center justify-between text-xs text-neutral-500">
                <span>Ketersediaan</span>
                <span>{{ inventory.availableQuantity(stock) }} / {{ inventory.totalQuantity(stock) }}</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                  class="h-full rounded-full bg-primary-600 transition-all"
                  :style="{ width: stockAvailabilityWidth(inventory.totalQuantity(stock), inventory.availableQuantity(stock)) }"
                ></div>
              </div>
            </div>
          </article>
        </div>

        <footer class="flex items-center justify-between gap-3 border-t border-neutral-200 px-5 py-3 text-xs text-neutral-500">
          <span>{{ inventory.filteredStocks.length }} produk quantity</span>
          <button
            type="button"
            class="inline-flex items-center font-semibold text-primary-700"
            :disabled="inventory.store.loadingStocks"
            @click="inventory.fetchStocks()"
          >
            <RefreshCw :size="14" class="mr-2" :class="{ 'animate-spin': inventory.store.loadingStocks }" />
            Perbarui
          </button>
        </footer>
      </template>
    </div>
  </section>

  <Teleport to="body">
    <Transition name="inventory-drawer">
      <div v-if="inventory.editorOpen" class="fixed inset-0 z-[70]">
        <button
          type="button"
          aria-label="Tutup editor inventory"
          class="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
          @click="inventory.closeEditor"
        ></button>

        <form
          class="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-neutral-0 shadow-2xl"
          @submit.prevent="inventory.editor === 'unit' ? inventory.submitUnit() : inventory.submitAdjustment()"
        >
          <header class="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-5 sm:px-6">
            <div>
              <h2 class="text-lg font-semibold text-neutral-900">
                {{ inventory.editor === 'unit' ? 'Tambah unit serialized' : 'Adjustment stok' }}
              </h2>
              <p class="mt-0.5 text-xs text-neutral-500">
                {{
                  inventory.editor === 'unit'
                    ? 'Daftarkan aset individual pada cabang aktif.'
                    : 'Tambah atau kurangi saldo stok produk quantity.'
                }}
              </p>
            </div>
            <button
              type="button"
              class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"
              @click="inventory.closeEditor"
            >
              <X :size="18" />
            </button>
          </header>

          <div class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            <div v-if="inventory.editor === 'unit'" class="grid gap-6">
              <section class="grid gap-4">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">Identitas unit</h3>
                  <p class="mt-1 text-xs leading-5 text-neutral-500">
                    Branch tidak dikirim dalam payload; backend menggunakan X-Branch-Id aktif.
                  </p>
                </div>
                <AtomsAppSelect
                  v-model="inventory.unitForm.product_id"
                  label="Produk serialized"
                  :options="inventory.serializedProductOptions"
                  required
                />
                <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <AtomsAppInput
                    v-model="inventory.unitForm.unit_code"
                    label="Kode unit"
                    placeholder="A7IV-001"
                    required
                  />
                  <AtomsAppInput
                    v-model="inventory.unitForm.serial_number"
                    label="Serial number"
                    placeholder="SN123456"
                  />
                  <AtomsAppInput
                    v-model="inventory.unitForm.barcode"
                    label="Barcode"
                    placeholder="BR-A7IV-001"
                  />
                  <AtomsAppInput
                    v-model="inventory.unitForm.qr_code"
                    label="QR code"
                    placeholder="QR-A7IV-001"
                  />
                </div>
                <div class="flex items-center gap-3 rounded-md border border-primary-100 bg-primary-50 p-4">
                  <Check :size="18" class="shrink-0 text-primary-700" />
                  <div>
                    <p class="text-sm font-semibold text-primary-700">Status awal: Tersedia</p>
                    <p class="mt-1 text-xs text-neutral-500">Payload mengirim status `available` sesuai backend docs.</p>
                  </div>
                </div>
              </section>

              <section class="grid gap-4 border-t border-neutral-200 pt-6">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">Kondisi & pembelian</h3>
                  <p class="mt-1 text-xs text-neutral-500">Data aset untuk pelacakan nilai dan pemakaian unit.</p>
                </div>
                <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <AtomsAppInput
                    v-model="inventory.unitForm.condition"
                    label="Kondisi"
                    placeholder="good"
                    required
                  />
                  <AtomsAppInput
                    v-model="inventory.unitForm.purchase_date"
                    label="Tanggal pembelian"
                    type="date"
                  />
                  <AtomsAppInput
                    v-model="inventory.unitForm.purchase_price"
                    label="Harga pembelian"
                    type="number"
                    inputmode="numeric"
                    :min="0"
                    :step="1000"
                  />
                  <AtomsAppInput
                    v-model="inventory.unitForm.current_meter"
                    label="Meter awal"
                    type="number"
                    :min="0"
                  />
                  <AtomsAppInput
                    v-model="inventory.unitForm.meter_unit"
                    label="Satuan meter"
                    placeholder="shot, km, atau jam"
                  />
                </div>
                <label class="grid gap-2 text-sm font-medium text-neutral-700">
                  Catatan
                  <textarea
                    v-model="inventory.unitForm.notes"
                    rows="4"
                    placeholder="Catatan kondisi atau penggunaan unit..."
                    class="w-full resize-y rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
                  ></textarea>
                </label>
              </section>
            </div>

            <div v-else class="grid gap-6">
              <section class="grid gap-4">
                <AtomsAppSelect
                  v-model="inventory.adjustmentForm.product_id"
                  label="Produk quantity"
                  :options="inventory.quantityProductOptions"
                  required
                />
                <div class="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    :class="[
                      'rounded-md border p-4 text-left transition',
                      inventory.adjustmentForm.quantity > 0
                        ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-100'
                        : 'border-neutral-200 hover:border-neutral-500',
                    ]"
                    @click="inventory.adjustmentForm.quantity = Math.max(1, Math.abs(inventory.adjustmentForm.quantity || 1))"
                  >
                    <ArrowUpCircle :size="19" class="text-primary-700" />
                    <strong class="mt-3 block text-sm text-neutral-900">Tambah stok</strong>
                    <span class="mt-1 block text-xs text-neutral-500">Barang masuk atau koreksi positif.</span>
                  </button>
                  <button
                    type="button"
                    :class="[
                      'rounded-md border p-4 text-left transition',
                      inventory.adjustmentForm.quantity < 0
                        ? 'border-red-500 bg-red-50 ring-2 ring-red-100'
                        : 'border-neutral-200 hover:border-neutral-500',
                    ]"
                    @click="inventory.adjustmentForm.quantity = -Math.max(1, Math.abs(inventory.adjustmentForm.quantity || 1))"
                  >
                    <ArrowDownCircle :size="19" class="text-danger-500" />
                    <strong class="mt-3 block text-sm text-neutral-900">Kurangi stok</strong>
                    <span class="mt-1 block text-xs text-neutral-500">Barang keluar atau koreksi negatif.</span>
                  </button>
                </div>
                <AtomsAppInput
                  v-model="inventory.adjustmentForm.quantity"
                  label="Perubahan quantity"
                  type="number"
                  :step="1"
                  required
                />
                <label class="grid gap-2 text-sm font-medium text-neutral-700">
                  Catatan adjustment
                  <textarea
                    v-model="inventory.adjustmentForm.notes"
                    rows="4"
                    required
                    placeholder="Contoh: Stok awal, pembelian baru, atau koreksi opname..."
                    class="w-full resize-y rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
                  ></textarea>
                </label>
              </section>

              <div class="flex items-start gap-3 rounded-md border border-amber-100 bg-amber-50 p-4">
                <ClipboardList :size="18" class="mt-0.5 shrink-0 text-amber-700" />
                <p class="text-xs leading-5 text-amber-900">
                  Backend akan menolak pengurangan yang melewati stok yang sedang reserved, rented, maintenance,
                  damaged, atau lost.
                </p>
              </div>
            </div>
          </div>

          <footer class="flex shrink-0 items-center justify-end gap-2 border-t border-neutral-200 px-5 py-4 sm:px-6">
            <AtomsAppButton
              type="button"
              variant="ghost"
              :disabled="inventory.store.creatingUnit || inventory.store.adjustingStock"
              @click="inventory.closeEditor"
            >
              Batal
            </AtomsAppButton>
            <AtomsAppButton
              type="submit"
              :disabled="inventory.store.creatingUnit || inventory.store.adjustingStock"
            >
              <LoaderCircle
                v-if="inventory.store.creatingUnit || inventory.store.adjustingStock"
                :size="16"
                class="mr-2 animate-spin"
              />
              <Check v-else :size="16" class="mr-2" />
              {{
                inventory.store.creatingUnit
                  ? 'Menambahkan...'
                  : inventory.store.adjustingStock
                    ? 'Menyimpan...'
                    : inventory.editor === 'unit'
                      ? 'Tambah unit'
                      : 'Simpan adjustment'
              }}
            </AtomsAppButton>
          </footer>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.inventory-drawer-enter-active,
.inventory-drawer-leave-active {
  transition: opacity 200ms ease;
}

.inventory-drawer-enter-active form,
.inventory-drawer-leave-active form {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.inventory-drawer-enter-from,
.inventory-drawer-leave-to {
  opacity: 0;
}

.inventory-drawer-enter-from form,
.inventory-drawer-leave-to form {
  transform: translateX(100%);
}
</style>

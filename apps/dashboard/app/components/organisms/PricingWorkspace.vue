<script setup lang="ts">
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  LoaderCircle,
  PackageOpen,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Tags,
  Trash2,
  X,
} from '@lucide/vue'
import type { ProductPrice } from '~/domain/pricing'
import { usePricingPresenter } from '~/application/pricing/usePricingPresenter'

defineEmits<{
  back: []
}>()

const pricing = usePricingPresenter()

const confirmDelete = ref<ProductPrice | null>(null)

function requestDelete(price: ProductPrice) {
  confirmDelete.value = price
}

async function confirmRemove() {
  if (!confirmDelete.value) return
  await pricing.removePrice(confirmDelete.value)
  confirmDelete.value = null
}

onMounted(() => {
  pricing.initialize().catch(() => undefined)
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
            <Tags :size="21" />
          </span>
          <div>
            <h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl">Harga sewa</h1>
            <p class="mt-1 text-sm text-neutral-500">
              Atur tarif rental produk untuk {{ pricing.auth.activeWorkspace.branchName || 'cabang aktif' }}.
            </p>
          </div>
        </div>
      </div>

      <AtomsAppButton @click="pricing.openCreate">
        <Plus :size="17" class="mr-2" />
        Tambah harga
      </AtomsAppButton>
    </header>

    <div class="grid grid-cols-3 gap-3 max-lg:grid-cols-1">
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-primary-50 text-primary-700">
            <Tags :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Seluruh data</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ pricing.pricing.prices.length }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Tarif tersimpan</span>
      </article>
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-blue-50 text-blue-700">
            <CheckCircle2 :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Aktif</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ pricing.activeCount }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Tarif berlaku sekarang</span>
      </article>
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-amber-50 text-amber-700">
            <PackageOpen :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Perlu perhatian</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ pricing.productsWithoutPriceCount }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Produk aktif belum punya harga</span>
      </article>
    </div>

    <section class="overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-card">
      <div class="grid grid-cols-[minmax(220px,1fr)_220px_auto_auto] gap-3 border-b border-neutral-200 bg-neutral-50 p-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <label class="relative block">
          <Search :size="17" class="pointer-events-none absolute left-3 top-3.5 text-neutral-500" />
          <input
            v-model="pricing.search"
            type="search"
            placeholder="Cari nama produk..."
            class="min-h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-10 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
          />
        </label>
        <AtomsAppSelect
          v-model="pricing.productFilter"
          label="Filter produk"
          :options="pricing.productFilterOptions"
          hide-label
        />
        <button
          type="button"
          title="Reset filter"
          class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          @click="pricing.resetFilters"
        >
          <RotateCcw :size="17" />
        </button>
        <button
          type="button"
          title="Perbarui data"
          :disabled="pricing.pricing.loading"
          class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-wait"
          @click="pricing.fetchAll"
        >
          <RefreshCw :size="17" :class="{ 'animate-spin': pricing.pricing.loading }" />
        </button>
      </div>

      <div v-if="pricing.pricing.loading" class="grid min-h-80 place-items-center">
        <div class="text-center">
          <LoaderCircle :size="27" class="mx-auto animate-spin text-primary-600" />
          <p class="mt-3 text-sm font-semibold text-neutral-900">Memuat daftar harga</p>
        </div>
      </div>

      <div
        v-else-if="!pricing.filteredPrices.length"
        class="grid min-h-80 place-items-center px-6 py-12 text-center"
      >
        <div class="max-w-sm">
          <span class="mx-auto grid h-12 w-12 place-items-center rounded-md bg-neutral-100 text-neutral-500">
            <Tags :size="22" />
          </span>
          <h2 class="mt-4 text-base font-semibold text-neutral-900">Belum ada harga ditemukan</h2>
          <p class="mt-2 text-sm leading-6 text-neutral-500">
            Tambahkan tarif rental pertama atau ubah filter untuk melihat hasil lain.
          </p>
          <AtomsAppButton class="mt-5" @click="pricing.openCreate">
            <Plus :size="16" class="mr-2" />
            Tambah harga
          </AtomsAppButton>
        </div>
      </div>

      <template v-else>
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr class="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
                <th class="px-5 py-3">Produk</th>
                <th class="px-4 py-3">Tarif</th>
                <th class="px-4 py-3">Harga</th>
                <th class="px-4 py-3">Masa berlaku</th>
                <th class="px-4 py-3">Status</th>
                <th class="w-24 px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              <tr
                v-for="price in pricing.filteredPrices"
                :key="price.id"
                class="cursor-pointer hover:bg-neutral-50/70"
                @click="pricing.openEdit(price)"
              >
                <td class="px-5 py-4">
                  <strong class="block text-sm font-semibold text-neutral-900">{{ pricing.productName(price) }}</strong>
                  <span class="mt-1 block text-xs text-neutral-500">{{ pricing.productSku(price) }}</span>
                </td>
                <td class="px-4 py-4 text-sm text-neutral-700">{{ pricing.durationLabel(price) }}</td>
                <td class="px-4 py-4 text-sm font-semibold text-neutral-900">{{ pricing.formatCurrency(Number(price.price)) }}</td>
                <td class="px-4 py-4 text-xs text-neutral-500">
                  <template v-if="price.start_at || price.end_at">
                    {{ pricing.formatDate(price.start_at) || 'Sejak awal' }} – {{ pricing.formatDate(price.end_at) || 'Tanpa batas' }}
                  </template>
                  <span v-else>Selalu berlaku</span>
                </td>
                <td class="px-4 py-4">
                  <button
                    type="button"
                    :class="[
                      'rounded-full px-2.5 py-1 text-[10px] font-semibold',
                      price.is_active ? 'bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-500',
                    ]"
                    @click.stop="pricing.toggleActive(price)"
                  >
                    {{ price.is_active ? 'Aktif' : 'Nonaktif' }}
                  </button>
                </td>
                <td class="px-4 py-4 text-right">
                  <button
                    type="button"
                    title="Hapus harga"
                    class="grid h-8 w-8 place-items-center rounded-md text-neutral-400 hover:bg-red-50 hover:text-danger-500"
                    @click.stop="requestDelete(price)"
                  >
                    <Trash2 :size="15" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="divide-y divide-neutral-200 md:hidden">
          <article
            v-for="price in pricing.filteredPrices"
            :key="price.id"
            class="p-4"
            @click="pricing.openEdit(price)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="truncate text-sm font-semibold text-neutral-900">{{ pricing.productName(price) }}</h3>
                <p class="mt-1 text-xs text-neutral-500">{{ pricing.durationLabel(price) }}</p>
              </div>
              <span
                :class="[
                  'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold',
                  price.is_active ? 'bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-500',
                ]"
              >
                {{ price.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
            <p class="mt-3 text-sm font-semibold text-neutral-900">{{ pricing.formatCurrency(Number(price.price)) }}</p>
          </article>
        </div>

        <footer class="flex flex-wrap justify-between gap-2 border-t border-neutral-200 bg-neutral-50 px-5 py-3 text-xs text-neutral-500">
          <span>Menampilkan {{ pricing.filteredPrices.length }} harga</span>
          <span>Total {{ pricing.pricing.prices.length }} data</span>
        </footer>
      </template>
    </section>
  </section>

  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="pricing.createOpen" class="fixed inset-0 z-[70]">
        <button
          type="button"
          aria-label="Tutup form harga"
          class="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
          @click="pricing.closeCreate"
        ></button>

        <form
          class="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-neutral-0 shadow-2xl"
          @submit.prevent="pricing.submit"
        >
          <header class="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-5 sm:px-6">
            <div>
              <h2 class="text-lg font-semibold text-neutral-900">
                {{ pricing.editingId ? 'Edit harga' : 'Tambah harga' }}
              </h2>
              <p class="mt-0.5 text-xs text-neutral-500">Tarif akan tampil pada estimasi booking dan kasir.</p>
            </div>
            <button
              type="button"
              class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"
              @click="pricing.closeCreate"
            >
              <X :size="18" />
            </button>
          </header>

          <div class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            <div class="grid gap-4">
              <AtomsAppSelect
                v-model="pricing.form.product_id"
                label="Produk"
                :options="pricing.productOptions"
                required
              />
              <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <AtomsAppSelect
                  v-model="pricing.form.pricing_type"
                  label="Tipe tarif"
                  :options="pricing.pricingTypeOptions"
                />
                <AtomsAppInput
                  v-model="pricing.form.duration"
                  label="Durasi"
                  type="number"
                  :min="1"
                  step="1"
                  required
                />
              </div>
              <AtomsAppInput
                v-model="pricing.form.price"
                label="Harga (Rp)"
                type="number"
                :min="0"
                step="1000"
                placeholder="Contoh: 150000"
                required
              />
              <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <AtomsAppInput
                  v-model="pricing.form.start_at"
                  label="Berlaku mulai (opsional)"
                  type="date"
                />
                <AtomsAppInput
                  v-model="pricing.form.end_at"
                  label="Berlaku sampai (opsional)"
                  type="date"
                />
              </div>
              <AtomsAppToggle
                v-model="pricing.form.is_active"
                label="Aktifkan harga ini"
                description="Harga nonaktif tidak akan dipakai saat booking atau kasir."
              />
            </div>
          </div>

          <footer class="flex shrink-0 justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:px-6">
            <AtomsAppButton variant="secondary" :disabled="pricing.pricing.saving" @click="pricing.closeCreate">
              Batal
            </AtomsAppButton>
            <AtomsAppButton type="submit" :disabled="pricing.pricing.saving">
              <LoaderCircle v-if="pricing.pricing.saving" :size="16" class="mr-2 animate-spin" />
              <Tags v-else :size="16" class="mr-2" />
              {{ pricing.pricing.saving ? 'Menyimpan...' : 'Simpan harga' }}
            </AtomsAppButton>
          </footer>
        </form>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <div v-if="confirmDelete" class="fixed inset-0 z-[80] grid place-items-center p-4">
      <button
        type="button"
        aria-label="Batalkan hapus"
        class="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
        @click="confirmDelete = null"
      ></button>
      <div class="relative w-full max-w-sm rounded-md bg-neutral-0 p-6 shadow-2xl">
        <span class="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-danger-500">
          <Ban :size="20" />
        </span>
        <h2 class="mt-4 text-base font-semibold text-neutral-900">Hapus harga ini?</h2>
        <p class="mt-2 text-sm leading-6 text-neutral-500">
          Harga {{ pricing.productName(confirmDelete) }} · {{ pricing.durationLabel(confirmDelete) }} akan dihapus permanen.
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <AtomsAppButton variant="secondary" :disabled="pricing.pricing.deleting === confirmDelete.id" @click="confirmDelete = null">
            Batal
          </AtomsAppButton>
          <AtomsAppButton variant="primary" :disabled="pricing.pricing.deleting === confirmDelete.id" @click="confirmRemove">
            <LoaderCircle v-if="pricing.pricing.deleting === confirmDelete.id" :size="16" class="mr-2 animate-spin" />
            <Trash2 v-else :size="16" class="mr-2" />
            Hapus
          </AtomsAppButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 180ms ease;
}

.drawer-enter-active form,
.drawer-leave-active form {
  transition: transform 220ms ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from form,
.drawer-leave-to form {
  transform: translateX(100%);
}
</style>

<script setup lang="ts">
import {
  ArrowLeft,
  Boxes,
  Check,
  FolderTree,
  ImagePlus,
  Layers3,
  LoaderCircle,
  PackageOpen,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Star,
  Tag,
  Trash2,
  Upload,
  X,
} from '@lucide/vue'
import type { InventoryType, PricingType } from '~/domain/mitra'
import { ENGINE_LABELS } from '~/domain/mitra'
import { INVENTORY_TYPE_DESCRIPTIONS, INVENTORY_TYPE_LABELS, INVENTORY_TYPE_OPTIONS } from '~/domain/inventory'
import { PRICING_TYPE_OPTIONS, pricingTypeLabel } from '~/domain/pricing'
import { useProductPresenter } from '~/application/products/useProductPresenter'

defineEmits<{
  back: []
}>()

const products = useProductPresenter()

const inventoryFilterOptions = [
  { label: 'Semua tipe inventory', value: '' as InventoryType | '' },
  ...INVENTORY_TYPE_OPTIONS.map((option) => ({
    label: INVENTORY_TYPE_DESCRIPTIONS[option.value],
    value: option.value as InventoryType | '',
  })),
]

const statusFilterOptions = [
  { label: 'Semua status', value: '' as boolean | '' },
  { label: 'Aktif', value: true as boolean | '' },
  { label: 'Nonaktif', value: false as boolean | '' },
]

const inventoryOptions = INVENTORY_TYPE_OPTIONS
const pricingOptions = PRICING_TYPE_OPTIONS

const productCategoryFilterOptions = computed(() => [
  { label: 'Semua kategori', value: null as number | null },
  ...products.categoryOptions.map((option) => ({
    label: option.label,
    value: option.value as number | null,
  })),
])

function categoryName(categoryId: number) {
  return products.store.categories.find((category) => category.id === categoryId)?.name || 'Tanpa kategori'
}

function inventoryLabel(type: InventoryType) {
  return INVENTORY_TYPE_LABELS[type] || type
}

function pricingLabel(type: PricingType) {
  return pricingTypeLabel(type)
}

onMounted(() => {
  products.initialize().catch(() => undefined)
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
            <PackageOpen :size="21" />
          </span>
          <div>
            <h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl">Produk</h1>
            <p class="mt-1 text-sm text-neutral-500">
              Kelola katalog rental untuk {{ products.auth.activeWorkspace.branchName || 'cabang aktif' }}.
            </p>
          </div>
        </div>
      </div>

      <AtomsAppButton
        v-if="products.activeTab === 'products'"
        @click="products.openProductEditor()"
      >
        <Plus :size="17" class="mr-2" />
        Tambah produk
      </AtomsAppButton>
      <AtomsAppButton v-else @click="products.openCategoryEditor()">
        <Plus :size="17" class="mr-2" />
        Tambah kategori
      </AtomsAppButton>
    </header>

    <div class="grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-neutral-100 text-neutral-700">
            <Boxes :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Total katalog</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ products.store.productMeta.total }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Produk terdaftar</span>
      </article>
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-primary-50 text-primary-700">
            <Check :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Pada halaman ini</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ products.activeProducts }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Produk aktif</span>
      </article>
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-amber-50 text-amber-700">
            <Star :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Highlight</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ products.featuredProducts }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Produk unggulan</span>
      </article>
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-blue-50 text-blue-700">
            <Layers3 :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Struktur katalog</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ products.store.categoryMeta.total }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Kategori produk</span>
      </article>
    </div>

    <div class="overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-card">
      <div class="flex items-center gap-1 border-b border-neutral-200 px-4 pt-3">
        <button
          type="button"
          :class="[
            'relative min-h-11 px-4 text-sm font-semibold transition',
            products.activeTab === 'products' ? 'text-primary-700' : 'text-neutral-500 hover:text-neutral-900',
          ]"
          @click="products.setActiveTab('products')"
        >
          Produk
          <span
            v-if="products.activeTab === 'products'"
            class="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary-600"
          ></span>
        </button>
        <button
          type="button"
          :class="[
            'relative min-h-11 px-4 text-sm font-semibold transition',
            products.activeTab === 'categories' ? 'text-primary-700' : 'text-neutral-500 hover:text-neutral-900',
          ]"
          @click="products.setActiveTab('categories')"
        >
          Kategori
          <span
            v-if="products.activeTab === 'categories'"
            class="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary-600"
          ></span>
        </button>
      </div>

      <template v-if="products.activeTab === 'products'">
        <div class="grid grid-cols-[minmax(220px,1fr)_200px_210px_150px_auto] gap-3 border-b border-neutral-200 bg-neutral-50 p-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
          <label class="relative block">
            <Search :size="17" class="pointer-events-none absolute left-3 top-3.5 text-neutral-500" />
            <input
              v-model="products.filters.search"
              type="search"
              placeholder="Cari nama, SKU, brand..."
              class="min-h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-10 pr-3 text-sm outline-none transition focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
            />
          </label>
          <AtomsAppSelect
            v-model="products.filters.categoryId"
            label="Kategori"
            :options="productCategoryFilterOptions"
            hide-label
          />
          <AtomsAppSelect
            v-model="products.filters.inventoryType"
            label="Tipe inventory"
            :options="inventoryFilterOptions"
            hide-label
          />
          <AtomsAppSelect
            v-model="products.filters.isActive"
            label="Status"
            :options="statusFilterOptions"
            hide-label
          />
          <button
            type="button"
            title="Reset filter"
            class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            @click="products.resetFilters"
          >
            <RotateCcw :size="17" />
          </button>
        </div>

        <div v-if="products.store.loadingProducts" class="grid min-h-72 place-items-center">
          <div class="text-center">
            <LoaderCircle :size="26" class="mx-auto animate-spin text-primary-600" />
            <p class="mt-3 text-sm font-semibold text-neutral-900">Memuat katalog produk</p>
          </div>
        </div>

        <div
          v-else-if="!products.store.products.length"
          class="grid min-h-80 place-items-center px-6 py-12 text-center"
        >
          <div class="max-w-sm">
            <span class="mx-auto grid h-12 w-12 place-items-center rounded-md bg-neutral-100 text-neutral-500">
              <PackageOpen :size="22" />
            </span>
            <h2 class="mt-4 text-base font-semibold text-neutral-900">Belum ada produk ditemukan</h2>
            <p class="mt-2 text-sm leading-6 text-neutral-500">
              Tambahkan produk pertama atau ubah filter pencarian untuk melihat hasil lain.
            </p>
            <AtomsAppButton class="mt-5" @click="products.openProductEditor()">
              <Plus :size="16" class="mr-2" />
              Tambah produk
            </AtomsAppButton>
          </div>
        </div>

        <template v-else>
          <div class="hidden overflow-x-auto md:block">
            <table class="w-full min-w-[920px] border-collapse text-left">
              <thead>
                <tr class="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
                  <th class="px-5 py-3">Produk</th>
                  <th class="px-4 py-3">Kategori</th>
                  <th class="px-4 py-3">Layanan</th>
                  <th class="px-4 py-3">Inventory</th>
                  <th class="px-4 py-3">Harga default</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="w-24 px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200">
                <tr v-for="product in products.store.products" :key="product.id" class="group hover:bg-neutral-50/70">
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <AtomsPrivateImage
                        v-if="products.primaryProductImage(product)"
                        :url="products.primaryProductImage(product)"
                        :alt="product.name"
                        class="h-10 w-10 shrink-0 rounded-md"
                        image-class="h-full w-full object-contain p-1"
                      />
                      <span v-else class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
                        <PackageOpen :size="18" />
                      </span>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <strong class="max-w-64 truncate text-sm font-semibold text-neutral-900">{{ product.name }}</strong>
                          <Star v-if="product.is_featured" :size="14" class="shrink-0 fill-amber-400 text-amber-500" />
                        </div>
                        <p class="mt-1 text-xs text-neutral-500">
                          {{ product.sku }}<template v-if="product.brand"> · {{ product.brand }}</template>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 text-sm text-neutral-700">
                    {{ product.category?.name || categoryName(product.category_id) }}
                  </td>
                  <td class="px-4 py-4">
                    <span class="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                      {{ ENGINE_LABELS[product.engine_code] }}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <span class="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                      {{ inventoryLabel(product.inventory_type) }}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <p class="text-sm font-medium text-neutral-900">{{ pricingLabel(product.default_pricing_type) }}</p>
                    <p class="mt-1 text-xs text-neutral-500">Min. {{ product.minimum_rental_duration }}</p>
                  </td>
                  <td class="px-4 py-4">
                    <span
                      :class="[
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                        product.is_active
                          ? 'bg-primary-50 text-primary-700'
                          : 'bg-neutral-100 text-neutral-500',
                      ]"
                    >
                      <span
                        :class="['h-1.5 w-1.5 rounded-full', product.is_active ? 'bg-primary-600' : 'bg-neutral-400']"
                      ></span>
                      {{ product.is_active ? 'Aktif' : 'Nonaktif' }}
                    </span>
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex justify-end gap-1">
                      <button
                        type="button"
                        title="Edit produk"
                        class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                        @click="products.openProductEditor(product)"
                      >
                        <Pencil :size="16" />
                      </button>
                      <button
                        type="button"
                        title="Hapus produk"
                        class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-red-50 hover:text-danger-500"
                        @click="products.requestDelete('product', product)"
                      >
                        <Trash2 :size="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="divide-y divide-neutral-200 md:hidden">
            <article v-for="product in products.store.products" :key="product.id" class="p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="truncate text-sm font-semibold text-neutral-900">{{ product.name }}</h3>
                    <Star v-if="product.is_featured" :size="14" class="fill-amber-400 text-amber-500" />
                  </div>
                  <p class="mt-1 text-xs text-neutral-500">{{ product.sku }} · {{ categoryName(product.category_id) }}</p>
                </div>
                <span
                  :class="[
                    'rounded-full px-2 py-1 text-[11px] font-semibold',
                    product.is_active ? 'bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-500',
                  ]"
                >
                  {{ product.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </div>
              <div class="mt-4 flex items-center justify-between border-t border-neutral-200 pt-3">
                <span class="text-xs text-neutral-500">
                  {{ ENGINE_LABELS[product.engine_code] }} · {{ inventoryLabel(product.inventory_type) }} · {{ pricingLabel(product.default_pricing_type) }}
                </span>
                <div class="flex gap-1">
                  <button class="grid h-9 w-9 place-items-center rounded-md text-neutral-500" @click="products.openProductEditor(product)">
                    <Pencil :size="16" />
                  </button>
                  <button class="grid h-9 w-9 place-items-center rounded-md text-danger-500" @click="products.requestDelete('product', product)">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>
            </article>
          </div>
        </template>

        <footer class="flex items-center justify-between gap-3 border-t border-neutral-200 px-5 py-3 text-xs text-neutral-500">
          <span>Menampilkan {{ products.store.products.length }} produk</span>
          <span>Total {{ products.store.productMeta.total }} data</span>
        </footer>
      </template>

      <template v-else>
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
          <label class="relative block w-full max-w-sm">
            <Search :size="17" class="pointer-events-none absolute left-3 top-3.5 text-neutral-500" />
            <input
              v-model="products.categorySearch"
              type="search"
              placeholder="Cari kategori..."
              class="min-h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-10 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
            />
          </label>
          <span class="text-xs font-medium text-neutral-500">{{ products.filteredCategories.length }} kategori</span>
        </div>

        <div v-if="products.store.loadingCategories" class="grid min-h-72 place-items-center">
          <LoaderCircle :size="26" class="animate-spin text-primary-600" />
        </div>
        <div v-else-if="!products.filteredCategories.length" class="grid min-h-72 place-items-center px-6 text-center">
          <div>
            <FolderTree :size="25" class="mx-auto text-neutral-500" />
            <h2 class="mt-4 text-base font-semibold text-neutral-900">Kategori belum tersedia</h2>
            <AtomsAppButton class="mt-5" @click="products.openCategoryEditor()">
              <Plus :size="16" class="mr-2" />
              Tambah kategori
            </AtomsAppButton>
          </div>
        </div>
        <div v-else class="grid grid-cols-2 gap-3 p-4 max-md:grid-cols-1">
          <article
            v-for="category in products.filteredCategories"
            :key="category.id"
            class="rounded-md border border-neutral-200 p-4 transition hover:border-neutral-300 hover:shadow-card"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex min-w-0 items-start gap-3">
                <AtomsPrivateImage
                  v-if="category.image_url"
                  :url="category.image_url"
                  :alt="category.name"
                  class="h-10 w-10 shrink-0 rounded-md"
                  image-class="h-full w-full object-contain p-1"
                />
                <span v-else class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
                  <Tag :size="18" />
                </span>
                <div class="min-w-0">
                  <h3 class="truncate text-sm font-semibold text-neutral-900">{{ category.name }}</h3>
                  <p class="mt-1 truncate text-xs text-neutral-500">/{{ category.slug }}</p>
                </div>
              </div>
              <span
                :class="[
                  'rounded-full px-2 py-1 text-[11px] font-semibold',
                  category.is_active ? 'bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-500',
                ]"
              >
                {{ category.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
            <p class="mt-4 line-clamp-2 min-h-10 text-xs leading-5 text-neutral-500">
              {{ category.description || 'Belum ada deskripsi kategori.' }}
            </p>
            <div class="mt-4 flex items-center justify-between border-t border-neutral-200 pt-3">
              <span class="text-xs text-neutral-500">
                Urutan {{ category.sort_order }}<template v-if="category.parent"> · {{ category.parent.name }}</template>
              </span>
              <div class="flex gap-1">
                <button
                  type="button"
                  class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"
                  @click="products.openCategoryEditor(category)"
                >
                  <Pencil :size="16" />
                </button>
                <button
                  type="button"
                  class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-red-50 hover:text-danger-500"
                  @click="products.requestDelete('category', category)"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </template>
    </div>
  </section>

  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="products.editorOpen" class="fixed inset-0 z-[70]">
        <button
          type="button"
          aria-label="Tutup editor"
          class="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
          @click="products.closeEditor"
        ></button>

        <form
          class="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-neutral-0 shadow-2xl"
          @submit.prevent="products.submitEditor"
        >
          <header class="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-5 sm:px-6">
            <div>
              <h2 class="text-lg font-semibold text-neutral-900">{{ products.editorTitle }}</h2>
              <p class="mt-0.5 text-xs text-neutral-500">
                {{ products.editor === 'product' ? 'Lengkapi informasi katalog rental.' : 'Susun struktur katalog produk.' }}
              </p>
            </div>
            <button
              type="button"
              class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"
              @click="products.closeEditor"
            >
              <X :size="18" />
            </button>
          </header>

          <div class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            <div v-if="products.editor === 'product'" class="grid gap-7">
              <section class="grid gap-4">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">Identitas produk</h3>
                  <p class="mt-1 text-xs text-neutral-500">Nama, kategori, dan kode unik untuk pencarian katalog.</p>
                </div>
                <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <div class="sm:col-span-2" @input="products.syncProductSlug">
                    <AtomsAppInput
                      v-model="products.productForm.name"
                      label="Nama produk"
                      placeholder="Contoh: Sony Alpha A7 IV"
                      :maxlength="150"
                      required
                    />
                  </div>
                  <AtomsAppSelect
                    v-model="products.productForm.category_id"
                    label="Kategori"
                    :options="products.categoryOptions"
                    required
                  />
                  <AtomsAppInput
                    v-model="products.productForm.sku"
                    label="SKU"
                    placeholder="CAM-SONY-A7IV"
                    required
                  />
                  <AtomsAppInput v-model="products.productForm.slug" label="Slug" required />
                  <AtomsAppInput v-model="products.productForm.brand" label="Brand" placeholder="Sony" />
                  <AtomsAppInput v-model="products.productForm.model" label="Model" placeholder="A7 IV" />
                  <AtomsAppSelect
                    v-model="products.productForm.engine_code"
                    label="Jenis layanan"
                    :options="products.enabledEngineOptions"
                    required
                  />
                  <AtomsAppSelect
                    v-model="products.productForm.product_type"
                    label="Jenis produk"
                    :options="products.productTypeOptions"
                    required
                  />
                </div>
                <label class="grid gap-2 text-sm font-medium text-neutral-700">
                  Deskripsi
                  <textarea
                    v-model="products.productForm.description"
                    rows="4"
                    maxlength="1000"
                    placeholder="Jelaskan spesifikasi atau kegunaan produk..."
                    class="w-full resize-y rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
                  ></textarea>
                </label>
              </section>

              <section class="grid gap-4 border-t border-neutral-200 pt-6">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">Inventory & harga</h3>
                  <p class="mt-1 text-xs text-neutral-500">Tentukan model stok dan pricing bawaan produk.</p>
                </div>
                <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <AtomsAppSelect
                    v-model="products.productForm.inventory_type"
                    label="Tipe inventory"
                    :options="inventoryOptions"
                  />
                  <AtomsAppSelect
                    v-model="products.productForm.default_pricing_type"
                    label="Pricing default"
                    :options="pricingOptions"
                  />
                  <AtomsAppInput
                    v-model="products.productForm.minimum_rental_duration"
                    label="Durasi minimum"
                    type="number"
                    :min="1"
                    required
                  />
                  <AtomsAppInput
                    v-model="products.productForm.deposit_amount"
                    label="Deposit"
                    type="number"
                    inputmode="numeric"
                    :min="0"
                    :step="1000"
                  />
                  <AtomsAppInput
                    v-model="products.productForm.late_fee_amount"
                    label="Denda keterlambatan"
                    type="number"
                    inputmode="numeric"
                    :min="0"
                    :step="1000"
                  />
                </div>
              </section>

              <section class="grid gap-4 border-t border-neutral-200 pt-6">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-900">Galeri produk</h3>
                  <p class="mt-1 text-xs leading-5 text-neutral-500">
                    Gambar disimpan sebagai private media dan dimuat menggunakan autentikasi workspace.
                  </p>
                </div>

                <div v-if="products.productImages.length" class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                  <article
                    v-for="image in products.productImages"
                    :key="image.id"
                    class="overflow-hidden rounded-md border border-neutral-200"
                  >
                    <AtomsPrivateImage
                      :url="image.image_url"
                      :alt="image.alt_text || products.productForm.name"
                      class="h-32 w-full"
                      image-class="h-full w-full object-contain p-2"
                    />
                    <div class="flex items-center justify-between gap-2 border-t border-neutral-200 p-3">
                      <button
                        type="button"
                        :disabled="image.is_primary || products.store.savingImage"
                        :class="[
                          'text-xs font-semibold',
                          image.is_primary ? 'text-primary-700' : 'text-neutral-500 hover:text-neutral-900',
                        ]"
                        @click="products.makePrimaryImage(image)"
                      >
                        {{ image.is_primary ? 'Gambar utama' : 'Jadikan utama' }}
                      </button>
                      <button
                        type="button"
                        title="Hapus gambar"
                        :disabled="products.store.savingImage"
                        class="grid h-8 w-8 place-items-center rounded-md text-neutral-500 hover:bg-red-50 hover:text-danger-500 disabled:opacity-50"
                        @click="products.deleteProductImage(image)"
                      >
                        <Trash2 :size="15" />
                      </button>
                    </div>
                  </article>
                </div>

                <div class="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
                  <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                    <label class="grid gap-2 text-sm font-medium text-neutral-700">
                      File gambar
                      <span class="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-neutral-200 bg-neutral-0 px-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
                        <Upload :size="16" class="mr-2" />
                        {{ products.pendingProductImage?.name || 'Pilih gambar' }}
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          class="sr-only"
                          @change="products.selectProductImage"
                        />
                      </span>
                    </label>
                    <AtomsAppInput
                      v-model="products.productImageForm.alt_text"
                      label="Teks alternatif"
                      placeholder="Tampilan produk dari depan"
                      :maxlength="255"
                    />
                    <AtomsAppInput
                      v-model="products.productImageForm.sort_order"
                      label="Urutan gambar"
                      type="number"
                      :min="0"
                    />
                    <AtomsAppToggle
                      v-model="products.productImageForm.is_primary"
                      label="Jadikan gambar utama"
                      description="Gambar ini ditampilkan pertama pada katalog."
                    />
                  </div>
                  <p class="mt-3 text-xs text-neutral-500">JPG, PNG, atau WEBP dengan ukuran maksimal 5 MB.</p>
                </div>
              </section>

              <section class="grid grid-cols-2 gap-3 border-t border-neutral-200 pt-6 max-sm:grid-cols-1">
                <AtomsAppToggle
                  v-model="products.productForm.is_featured"
                  label="Produk unggulan"
                  description="Tandai produk untuk ditonjolkan pada katalog."
                />
                <AtomsAppToggle
                  v-model="products.productForm.is_active"
                  label="Produk aktif"
                  description="Produk dapat dipakai dalam alur operasional."
                />
              </section>
            </div>

            <div v-else class="grid gap-5">
              <div @input="products.syncCategorySlug">
                <AtomsAppInput
                  v-model="products.categoryForm.name"
                  label="Nama kategori"
                  placeholder="Contoh: Kamera"
                  required
                />
              </div>
              <AtomsAppInput v-model="products.categoryForm.slug" label="Slug" required />
              <AtomsAppSelect
                v-model="products.categoryForm.parent_id"
                label="Kategori induk"
                :options="products.parentCategoryOptions"
              />
              <label class="grid gap-2 text-sm font-medium text-neutral-700">
                Deskripsi
                <textarea
                  v-model="products.categoryForm.description"
                  rows="4"
                  placeholder="Deskripsi singkat kategori..."
                  class="w-full resize-y rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
                ></textarea>
              </label>
              <section class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                <div class="flex items-start gap-4">
                  <AtomsPrivateImage
                    v-if="products.categoryImageUrl"
                    :url="products.categoryImageUrl"
                    :alt="products.categoryForm.name || 'Gambar kategori'"
                    class="h-24 w-24 shrink-0 rounded-md"
                    image-class="h-full w-full object-contain p-2"
                  />
                  <span
                    v-else
                    class="grid h-24 w-24 shrink-0 place-items-center rounded-md bg-neutral-100 text-neutral-400"
                  >
                    <ImagePlus :size="25" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <h3 class="text-sm font-semibold text-neutral-900">Gambar kategori</h3>
                    <p class="mt-1 text-xs leading-5 text-neutral-500">JPG, PNG, atau WEBP. Maksimal 5 MB.</p>
                    <div class="mt-3 flex flex-wrap gap-2">
                      <label class="inline-flex min-h-10 cursor-pointer items-center rounded-md border border-neutral-200 bg-neutral-0 px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
                        <Upload :size="15" class="mr-2" />
                        {{ products.pendingCategoryImage?.name || (products.categoryImageUrl ? 'Ganti gambar' : 'Pilih gambar') }}
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          class="sr-only"
                          @change="products.selectCategoryImage"
                        />
                      </label>
                      <button
                        v-if="products.categoryImageUrl || products.pendingCategoryImage"
                        type="button"
                        :disabled="products.store.savingImage"
                        class="inline-flex min-h-10 items-center rounded-md px-3 text-xs font-semibold text-danger-500 hover:bg-red-50 disabled:opacity-50"
                        @click="products.deleteCategoryImage"
                      >
                        <Trash2 :size="15" class="mr-2" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <AtomsAppInput
                v-model="products.categoryForm.sort_order"
                label="Urutan tampil"
                type="number"
                :min="0"
              />
              <AtomsAppToggle
                v-model="products.categoryForm.is_active"
                label="Kategori aktif"
                description="Kategori tersedia untuk produk baru dan filter katalog."
              />
            </div>
          </div>

          <footer class="flex shrink-0 items-center justify-end gap-2 border-t border-neutral-200 bg-neutral-0 px-5 py-4 sm:px-6">
            <AtomsAppButton
              type="button"
              variant="ghost"
              :disabled="products.store.saving || products.store.savingImage"
              @click="products.closeEditor"
            >
              Batal
            </AtomsAppButton>
            <AtomsAppButton type="submit" :disabled="products.store.saving || products.store.savingImage">
              <LoaderCircle v-if="products.store.saving || products.store.savingImage" :size="16" class="mr-2 animate-spin" />
              <Check v-else :size="16" class="mr-2" />
              {{ products.store.saving || products.store.savingImage ? 'Menyimpan...' : 'Simpan' }}
            </AtomsAppButton>
          </footer>
        </form>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="products.deleteTarget" class="fixed inset-0 z-[80] grid place-items-center p-4">
        <button
          type="button"
          aria-label="Batal menghapus"
          class="absolute inset-0 bg-neutral-900/45 backdrop-blur-[2px]"
          @click="products.cancelDelete"
        ></button>
        <section class="relative w-full max-w-md rounded-lg border border-neutral-200 bg-neutral-0 p-6 shadow-2xl">
          <span class="grid h-11 w-11 place-items-center rounded-md bg-red-50 text-danger-500">
            <Trash2 :size="20" />
          </span>
          <h2 class="mt-4 text-lg font-semibold text-neutral-900">
            Hapus {{ products.deleteTarget.type === 'product' ? 'produk' : 'kategori' }}?
          </h2>
          <p class="mt-2 text-sm leading-6 text-neutral-500">
            “{{ products.deleteTarget.name }}” akan dihapus permanen. Backend dapat menolak jika data masih digunakan.
          </p>
          <div class="mt-6 flex justify-end gap-2">
            <AtomsAppButton variant="ghost" :disabled="products.store.deleting" @click="products.cancelDelete">
              Batal
            </AtomsAppButton>
            <button
              type="button"
              :disabled="products.store.deleting"
              class="inline-flex min-h-11 items-center justify-center rounded-md bg-danger-500 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
              @click="products.confirmDelete"
            >
              <LoaderCircle v-if="products.store.deleting" :size="16" class="mr-2 animate-spin" />
              Hapus permanen
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active,
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease;
}

.drawer-enter-active form,
.drawer-leave-active form {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-enter-from,
.drawer-leave-to,
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.drawer-enter-from form,
.drawer-leave-to form {
  transform: translateX(100%);
}
</style>

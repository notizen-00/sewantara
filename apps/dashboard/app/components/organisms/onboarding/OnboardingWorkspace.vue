<script setup lang="ts">
import { Banknote, Boxes, CheckCircle2, Layers3, PackagePlus, Plus, Tags, X } from '@lucide/vue'
import type { MitraDashboardPresenter } from '~/application/mitra/useMitraDashboard'
import { INVENTORY_TYPE_OPTIONS } from '~/domain/inventory'
import { PRICING_TYPE_OPTIONS, pricingTypeLabel } from '~/domain/pricing'

defineProps<{
  dashboard: MitraDashboardPresenter
}>()

const operatingDays = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
  { key: 'sunday', label: 'Minggu' },
] as const
</script>

<template>
  <section id="onboarding" class="grid gap-5">
    <MoleculesFormSection
      v-if="dashboard.selectedOnboardingStep === 'business'"
      eyebrow="Tahap 1"
      title="Informasi usaha"
      description="Lengkapi identitas workspace, cabang utama, dan jam operasional bisnis."
    >
      <form class="grid gap-6" @submit.prevent="dashboard.continueSetup">
        <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <AtomsAppInput v-model="dashboard.businessForm.business_name" label="Nama usaha" required />
          <AtomsAppInput v-model="dashboard.businessForm.branch_name" label="Nama cabang utama" required />
          <AtomsAppInput v-model="dashboard.businessForm.timezone" label="Zona waktu" required />
          <AtomsAppInput v-model="dashboard.businessForm.currency" label="Mata uang" required />
        </div>

        <div class="border-t border-neutral-200 pt-5">
          <h4 class="text-sm font-semibold text-neutral-900">Jadwal operasional</h4>
          <div class="mt-4 grid gap-3">
            <div
              v-for="day in operatingDays"
              :key="day.key"
              class="grid grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)_96px] items-end gap-3 max-sm:grid-cols-2"
            >
              <p class="self-center text-sm font-medium text-neutral-700">{{ day.label }}</p>
              <AtomsAppInput
                v-model="dashboard.businessForm.operating_hours[day.key].open"
                label="Buka"
                type="time"
                :disabled="dashboard.businessForm.operating_hours[day.key].closed"
              />
              <AtomsAppInput
                v-model="dashboard.businessForm.operating_hours[day.key].close"
                label="Tutup"
                type="time"
                :disabled="dashboard.businessForm.operating_hours[day.key].closed"
              />
              <div class="pb-3">
                <AtomsAppCheckbox
                  v-model="dashboard.businessForm.operating_hours[day.key].closed"
                  label="Libur"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </MoleculesFormSection>

    <MoleculesFormSection
      v-else-if="dashboard.selectedOnboardingStep === 'rental'"
      eyebrow="Tahap 2"
      title="Model penyewaan"
      description="Tentukan cara pelanggan memesan dan bagaimana sistem mengalokasikan unit."
    >
      <form class="grid gap-5" @submit.prevent="dashboard.continueSetup">
        <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <AtomsAppSelect
            v-model="dashboard.rentalForm.rental_model"
            label="Model penyewaan"
            :options="[
              { label: 'Per hari', value: 'per_day' },
              { label: 'Per jam', value: 'per_hour' },
              { label: 'Per sesi', value: 'session' },
            ]"
          />
          <AtomsAppSelect
            v-model="dashboard.rentalForm.booking_strategy"
            label="Strategi booking"
            :options="[
              { label: 'Rentang tanggal', value: 'date_range' },
              { label: 'Antrean', value: 'queue' },
              { label: 'Sesi', value: 'session' },
            ]"
          />
          <AtomsAppSelect
            v-model="dashboard.rentalForm.allocation_strategy"
            label="Alokasi unit"
            :options="[
              { label: 'Otomatis', value: 'auto_assign' },
              { label: 'Manual', value: 'manual' },
            ]"
          />
          <AtomsAppInput
            v-if="dashboard.rentalForm.booking_strategy !== 'date_range'"
            v-model="dashboard.rentalForm.slot_duration_minutes"
            label="Durasi slot (menit)"
            type="number"
            :min="1"
            required
          />
        </div>

        <div class="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
          <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <AtomsAppCheckbox v-model="dashboard.rentalForm.enable_waiting_list" label="Waiting list" />
          </div>
          <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <AtomsAppCheckbox v-model="dashboard.rentalForm.allow_extend_booking" label="Perpanjang booking" />
          </div>
          <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <AtomsAppCheckbox v-model="dashboard.rentalForm.realtime_availability" label="Stok real-time" />
          </div>
        </div>
      </form>
    </MoleculesFormSection>

    <MoleculesFormSection
      v-else-if="dashboard.selectedOnboardingStep === 'inventory'"
      eyebrow="Tahap 3"
      title="Resource dan unit"
      description="Tambahkan produk beserta unit atau stok awal untuk cabang aktif."
    >
      <div class="mb-6 grid grid-cols-3 gap-3 max-md:grid-cols-1">
        <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Produk aktif</p>
          <p class="mt-2 text-2xl font-bold text-neutral-900">{{ dashboard.products.products.length }}</p>
        </div>
        <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Unit serialized</p>
          <p class="mt-2 text-2xl font-bold text-neutral-900">{{ dashboard.inventory.units.length }}</p>
        </div>
        <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Produk quantity</p>
          <p class="mt-2 text-2xl font-bold text-neutral-900">{{ dashboard.inventory.stocks.length }}</p>
        </div>
      </div>

      <form class="grid gap-6" @submit.prevent="dashboard.submitOnboardingProduct">
        <section class="rounded-lg border border-neutral-200 bg-neutral-0 p-5 max-sm:p-4">
          <div class="mb-5 flex items-start gap-3">
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
              <PackagePlus :size="19" />
            </span>
            <div>
              <h4 class="text-sm font-bold text-neutral-900">Informasi produk</h4>
              <p class="mt-1 text-xs leading-5 text-neutral-500">Nama, kategori, dan SKU akan menjadi identitas produk di seluruh transaksi rental.</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <div class="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2">
              <AtomsAppSelect
                v-model="dashboard.inventoryProductForm.category_id"
                label="Kategori"
                :options="dashboard.inventoryCategoryOptions"
              />
              <button
                type="button"
                class="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary-100 bg-primary-50 px-3 text-sm font-semibold text-primary-700 transition hover:border-primary-600"
                @click="dashboard.openInventoryCategoryModal"
              >
                <Plus :size="16" />
                <span class="max-sm:sr-only">Buat</span>
              </button>
            </div>
            <AtomsAppInput
              v-model="dashboard.inventoryProductForm.name"
              label="Nama produk"
              placeholder="Contoh: Sony A7 IV"
              required
            />
            <AtomsAppInput
              v-model="dashboard.inventoryProductForm.sku"
              label="SKU"
              placeholder="SONYA7IV"
              required
              :maxlength="50"
            />
            <AtomsAppInput
              v-model="dashboard.inventoryProductForm.slug"
              label="Slug produk"
              placeholder="sony-a7-iv"
              required
              pattern="[a-z0-9-]+"
            />
            <AtomsAppInput v-model="dashboard.inventoryProductForm.brand" label="Merek" placeholder="Sony" />
            <AtomsAppInput v-model="dashboard.inventoryProductForm.model" label="Model" placeholder="ILCE-7M4" />
            <AtomsAppSelect
              v-model="dashboard.inventoryProductForm.product_type"
              label="Jenis produk"
              :options="dashboard.inventoryProductTypeOptions"
              required
            />
          </div>

          <label class="mt-4 grid gap-2 text-sm font-medium text-neutral-700">
            Deskripsi produk
            <textarea
              v-model="dashboard.inventoryProductForm.description"
              rows="3"
              maxlength="1000"
              placeholder="Tuliskan spesifikasi atau informasi singkat produk..."
              class="w-full resize-y rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2 text-neutral-900 outline-none transition placeholder:text-neutral-500 focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
            ></textarea>
          </label>
        </section>

        <section class="rounded-lg border border-neutral-200 bg-neutral-0 p-5 max-sm:p-4">
          <div class="mb-5 flex items-start gap-3">
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
              <Boxes :size="19" />
            </span>
            <div>
              <h4 class="text-sm font-bold text-neutral-900">Model inventory dan biaya</h4>
              <p class="mt-1 text-xs leading-5 text-neutral-500">Pilih serialized untuk barang dengan identitas unit, atau quantity untuk stok jumlah.</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            <AtomsAppSelect
              v-model="dashboard.inventoryProductForm.inventory_type"
              label="Tipe inventory"
              :options="INVENTORY_TYPE_OPTIONS"
              required
            />
            <AtomsAppSelect
              v-model="dashboard.inventoryProductForm.default_pricing_type"
              label="Model harga bawaan"
              :options="PRICING_TYPE_OPTIONS"
              required
            />
            <AtomsAppInput
              v-model="dashboard.inventoryProductForm.minimum_rental_duration"
              label="Durasi rental minimum"
              type="number"
              :min="1"
              required
            />
            <AtomsAppInput
              v-model="dashboard.inventoryProductForm.deposit_amount"
              label="Deposit (Rp)"
              type="number"
              :min="0"
              step="1000"
            />
            <AtomsAppInput
              v-model="dashboard.inventoryProductForm.late_fee_amount"
              label="Denda keterlambatan (Rp)"
              type="number"
              :min="0"
              step="1000"
            />
            <AtomsAppInput
              v-model="dashboard.inventoryProductForm.purchase_price"
              label="Harga pembelian (Rp)"
              type="number"
              :min="0"
              step="1000"
            />
          </div>

          <div class="mt-5 border-t border-neutral-200 pt-5">
            <div v-if="dashboard.inventoryProductForm.inventory_type === 'serialized'" class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <AtomsAppInput
                v-model="dashboard.inventoryProductForm.unit_code"
                label="Kode unit pertama"
                placeholder="UNIT-A7IV-001"
                required
              />
              <AtomsAppInput
                v-model="dashboard.inventoryProductForm.serial_number"
                label="Serial number"
                placeholder="Opsional"
              />
            </div>
            <AtomsAppInput
              v-else
              v-model="dashboard.inventoryProductForm.initial_quantity"
              label="Jumlah stok awal"
              type="number"
              :min="1"
              required
            />
          </div>
        </section>

        <div class="flex flex-wrap items-center justify-between gap-4 rounded-md border border-primary-100 bg-primary-50 p-4">
          <p class="flex max-w-2xl items-start gap-2 text-xs leading-5 text-primary-800">
            <CheckCircle2 :size="16" class="mt-0.5 shrink-0" />
            Produk dan resource awal disimpan bersama. Setelah berhasil, kamu bisa menambahkan produk lain atau menekan “Verifikasi & lanjutkan”.
          </p>
          <AtomsAppButton type="submit" :disabled="dashboard.inventorySetupLoading">
            {{ dashboard.inventorySetupLoading ? 'Menyimpan...' : 'Simpan produk & resource' }}
          </AtomsAppButton>
        </div>
      </form>
    </MoleculesFormSection>

    <MoleculesFormSection
      v-else-if="dashboard.selectedOnboardingStep === 'pricing'"
      eyebrow="Tahap 4"
      title="Harga penyewaan"
      description="Tetapkan tarif aktif untuk produk pada cabang ini. Tipe harga otomatis mengikuti model rental yang dipilih."
    >
      <div class="grid grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] gap-5 max-lg:grid-cols-1">
        <form class="rounded-lg border border-neutral-200 bg-neutral-0 p-5 max-sm:p-4" @submit.prevent="dashboard.submitOnboardingPrice">
          <div class="mb-5 flex items-start gap-3">
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
              <Banknote :size="20" />
            </span>
            <div>
              <h4 class="text-sm font-bold text-neutral-900">Tarif produk</h4>
              <p class="mt-1 text-xs leading-5 text-neutral-500">Harga berlaku pada cabang aktif dan dapat diperbarui kembali dari modul Harga.</p>
            </div>
          </div>

          <div class="grid gap-4">
            <AtomsAppSelect
              v-model="dashboard.onboardingPriceForm.product_id"
              label="Produk"
              :options="dashboard.onboardingPriceProductOptions"
              required
            />

            <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              <label class="grid gap-2 text-sm font-medium text-neutral-700">
                Tipe harga
                <span class="inline-flex min-h-11 items-center rounded-md border border-primary-100 bg-primary-50 px-3 font-semibold text-primary-700">
                  {{ dashboard.compatiblePricingLabel }}
                </span>
              </label>
              <AtomsAppInput
                v-model="dashboard.onboardingPriceForm.duration"
                label="Durasi paket"
                type="number"
                :min="1"
                required
              />
            </div>

            <AtomsAppInput
              v-model="dashboard.onboardingPriceForm.price"
              label="Harga sewa (Rp)"
              type="number"
              :min="1"
              step="1"
              placeholder="250000"
              required
            />

            <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-xs leading-5 text-neutral-600">
              Contoh: durasi <strong>{{ dashboard.onboardingPriceForm.duration || 1 }}</strong> dengan tipe
              <strong>{{ dashboard.compatiblePricingLabel.toLowerCase() }}</strong> berarti pelanggan membayar
              <strong>{{ dashboard.formatCurrency(Number(dashboard.onboardingPriceForm.price || 0)) }}</strong>
              untuk setiap paket durasi tersebut.
            </div>

            <AtomsAppButton type="submit" :disabled="dashboard.pricingSetupLoading || !dashboard.onboardingPriceProductOptions.length">
              {{ dashboard.pricingSetupLoading ? 'Menyimpan harga...' : 'Simpan harga produk' }}
            </AtomsAppButton>
          </div>
        </form>

        <aside class="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0">
          <div class="flex items-center gap-3 border-b border-neutral-200 px-5 py-4">
            <span class="grid h-9 w-9 place-items-center rounded-md bg-primary-50 text-primary-700">
              <Tags :size="18" />
            </span>
            <div>
              <h4 class="text-sm font-bold text-neutral-900">Harga tersimpan</h4>
              <p class="mt-0.5 text-xs text-neutral-500">{{ dashboard.pricing.prices.length }} tarif pada cabang aktif</p>
            </div>
          </div>

          <div v-if="dashboard.pricing.loading && !dashboard.pricing.prices.length" class="grid min-h-48 place-items-center p-5 text-sm text-neutral-500">
            Memuat harga...
          </div>
          <div v-else-if="!dashboard.pricing.prices.length" class="grid min-h-48 place-items-center p-5 text-center">
            <div>
              <span class="mx-auto grid h-11 w-11 place-items-center rounded-full bg-neutral-100 text-neutral-500">
                <Banknote :size="20" />
              </span>
              <p class="mt-3 text-sm font-semibold text-neutral-900">Belum ada harga aktif</p>
              <p class="mt-1 text-xs leading-5 text-neutral-500">Pilih produk dan masukkan tarif pertamanya.</p>
            </div>
          </div>
          <div v-else class="max-h-[360px] divide-y divide-neutral-200 overflow-y-auto">
            <article v-for="price in dashboard.pricing.prices" :key="price.id" class="px-5 py-4">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-neutral-900">
                    {{ price.product?.name || dashboard.products.products.find((product) => product.id === price.product_id)?.name || `Produk #${price.product_id}` }}
                  </p>
                  <p class="mt-1 text-xs capitalize text-neutral-500">
                    {{ pricingTypeLabel(price.pricing_type) }}
                    · durasi {{ price.duration }}
                  </p>
                </div>
                <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold', price.is_active ? 'bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-500']">
                  {{ price.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </div>
              <p class="mt-3 text-lg font-bold text-neutral-900">{{ dashboard.formatCurrency(Number(price.price)) }}</p>
            </article>
          </div>
        </aside>
      </div>

      <div class="mt-5 flex items-start gap-2 rounded-md border border-primary-100 bg-primary-50 p-4 text-xs leading-5 text-primary-800">
        <CheckCircle2 :size="16" class="mt-0.5 shrink-0" />
        Setelah harga tersimpan, tekan “Verifikasi & lanjutkan” untuk menyelesaikan tahap harga.
      </div>
    </MoleculesFormSection>

    <MoleculesFormSection
      v-else-if="dashboard.selectedOnboardingStep === 'booking'"
      eyebrow="Tahap 5"
      title="Pengaturan booking"
      description="Atur kanal pemesanan, alokasi unit, pengingat, dan pembatalan transaksi yang belum dibayar."
    >
      <form class="grid gap-5" @submit.prevent="dashboard.continueSetup">
        <div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <AtomsAppCheckbox v-model="dashboard.bookingForm.allow_online_booking" label="Booking online" />
          </div>
          <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <AtomsAppCheckbox v-model="dashboard.bookingForm.allow_walk_in" label="Walk-in" />
          </div>
          <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <AtomsAppCheckbox v-model="dashboard.bookingForm.enable_waiting_list" label="Waiting list" />
          </div>
          <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <AtomsAppCheckbox v-model="dashboard.bookingForm.auto_reminder" label="Pengingat otomatis" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <AtomsAppSelect
            v-model="dashboard.bookingForm.allocation_strategy"
            label="Alokasi unit"
            :options="[
              { label: 'Otomatis', value: 'auto_assign' },
              { label: 'Manual', value: 'manual' },
            ]"
          />
          <AtomsAppInput
            v-model="dashboard.bookingForm.auto_cancel_minutes"
            label="Batalkan transaksi belum dibayar (menit)"
            type="number"
            :min="5"
            :disabled="!dashboard.bookingForm.auto_cancel_unpaid"
          />
        </div>
        <AtomsAppCheckbox v-model="dashboard.bookingForm.auto_cancel_unpaid" label="Aktifkan pembatalan otomatis" />
      </form>
    </MoleculesFormSection>

    <MoleculesFormSection
      v-else-if="dashboard.selectedOnboardingStep === 'payment'"
      eyebrow="Tahap 6"
      title="Metode pembayaran"
      description="Aktifkan minimal satu metode pembayaran untuk transaksi tenant."
    >
      <form class="grid gap-5" @submit.prevent="dashboard.continueSetup">
        <div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <AtomsAppCheckbox v-model="dashboard.paymentsForm.methods[0].is_enabled" label="Tunai" />
          </div>
          <div class="rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <AtomsAppCheckbox v-model="dashboard.paymentsForm.methods[1].is_enabled" label="Transfer bank manual" />
          </div>
        </div>

        <div v-if="dashboard.paymentsForm.methods[1].is_enabled" class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <AtomsAppInput v-model="dashboard.transferPaymentConfig.bank_name" label="Bank" required />
          <AtomsAppInput v-model="dashboard.transferPaymentConfig.account_number" label="Nomor rekening" required />
          <div class="col-span-2 max-sm:col-span-1">
            <AtomsAppInput v-model="dashboard.transferPaymentConfig.account_name" label="Nama pemilik rekening" required />
          </div>
        </div>
      </form>
    </MoleculesFormSection>

    <MoleculesFormSection
      v-else
      eyebrow="Tahap 7"
      title="Review dan aktivasi"
      description="Periksa seluruh kesiapan sebelum mengaktifkan workspace."
    >
      <div class="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
        <div
          v-for="item in dashboard.onboarding.checklistItems"
          :key="item.key"
          class="rounded-md border border-neutral-200 bg-neutral-50 p-4"
        >
          <p class="text-sm font-semibold text-neutral-900">{{ item.label }}</p>
          <p :class="['mt-1 text-xs font-medium', item.done ? 'text-primary-700' : 'text-neutral-500']">
            {{ item.done ? 'Selesai' : 'Perlu dilengkapi' }}
          </p>
        </div>
      </div>
    </MoleculesFormSection>

    <Teleport to="body">
      <div
        v-if="dashboard.inventoryCategoryModalOpen"
        class="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-neutral-900/50 p-4 backdrop-blur-[2px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-category-title"
        @click.self="dashboard.closeInventoryCategoryModal"
      >
        <form
          class="w-full max-w-lg overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0 shadow-xl"
          @submit.prevent="dashboard.createOnboardingCategory"
        >
          <div class="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5 max-sm:px-4">
            <div class="flex items-start gap-3">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
                <Layers3 :size="19" />
              </span>
              <div>
                <h2 id="onboarding-category-title" class="text-lg font-bold text-neutral-900">Buat kategori produk</h2>
                <p class="mt-1 text-xs leading-5 text-neutral-500">Kategori membantu produk tersusun sesuai jenis bisnis tenant.</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Tutup modal"
              class="grid h-9 w-9 shrink-0 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              :disabled="dashboard.products.saving"
              @click="dashboard.closeInventoryCategoryModal"
            >
              <X :size="18" />
            </button>
          </div>

          <div class="grid gap-5 px-6 py-5 max-sm:px-4">
            <div class="rounded-md border border-primary-100 bg-primary-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-primary-700">Rekomendasi template bisnis</p>
              <p class="mt-1 text-sm text-primary-800">
                Kategori awal yang disarankan: <strong>{{ dashboard.suggestedInventoryCategoryName }}</strong>
              </p>
            </div>

            <AtomsAppInput
              v-model="dashboard.inventoryCategoryForm.name"
              label="Nama kategori"
              :placeholder="dashboard.suggestedInventoryCategoryName"
              required
              :maxlength="100"
            />

            <label class="grid gap-2 text-sm font-medium text-neutral-700">
              Deskripsi kategori
              <textarea
                v-model="dashboard.inventoryCategoryForm.description"
                rows="3"
                maxlength="500"
                placeholder="Contoh: Seluruh armada mobil yang tersedia untuk disewa."
                class="w-full resize-y rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2 text-neutral-900 outline-none transition placeholder:text-neutral-500 focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
              ></textarea>
            </label>

            <p v-if="dashboard.products.error" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-danger-500">
              {{ dashboard.products.error }}
            </p>
          </div>

          <div class="flex flex-wrap justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 max-sm:px-4">
            <AtomsAppButton type="button" variant="secondary" :disabled="dashboard.products.saving" @click="dashboard.closeInventoryCategoryModal">
              Batal
            </AtomsAppButton>
            <AtomsAppButton type="submit" :disabled="dashboard.products.saving">
              {{ dashboard.products.saving ? 'Menyimpan...' : 'Buat kategori' }}
            </AtomsAppButton>
          </div>
        </form>
      </div>
    </Teleport>
  </section>
</template>

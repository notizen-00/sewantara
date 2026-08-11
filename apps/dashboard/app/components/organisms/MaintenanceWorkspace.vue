<script setup lang="ts">
import {
  ArrowLeft,
  Ban,
  CalendarClock,
  Check,
  CircleX,
  LoaderCircle,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Wrench,
  X,
} from '@lucide/vue'
import { useMaintenancePresenter } from '~/application/maintenance/useMaintenancePresenter'

defineEmits<{
  back: []
}>()

const maintenance = useMaintenancePresenter()

const statusClass = {
  success: 'bg-primary-50 text-primary-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  warning: 'bg-amber-50 text-amber-700',
}

onMounted(() => {
  maintenance.initialize().catch(() => undefined)
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
            <Wrench :size="21" />
          </span>
          <div>
            <h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl">Maintenance</h1>
            <p class="mt-1 text-sm text-neutral-500">
              Jadwal perawatan dan kondisi unit untuk {{ maintenance.auth.activeWorkspace.branchName || 'cabang aktif' }}.
            </p>
          </div>
        </div>
      </div>

      <AtomsAppButton @click="maintenance.openCreate">
        <Plus :size="17" class="mr-2" />
        Jadwalkan pemeliharaan
      </AtomsAppButton>
    </header>

    <div class="grid grid-cols-3 gap-3 max-lg:grid-cols-1">
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-amber-50 text-amber-700">
            <CalendarClock :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Menunggu</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ maintenance.scheduledCount }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Terjadwal</span>
      </article>
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-blue-50 text-blue-700">
            <Wrench :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Sedang berjalan</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ maintenance.inProgressCount }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Berlangsung</span>
      </article>
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div class="flex items-center justify-between">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-primary-50 text-primary-700">
            <Check :size="17" />
          </span>
          <span class="text-xs font-medium text-neutral-500">Riwayat</span>
        </div>
        <strong class="mt-4 block text-2xl font-bold text-neutral-900">{{ maintenance.completedCount }}</strong>
        <span class="mt-1 block text-xs text-neutral-500">Selesai</span>
      </article>
    </div>

    <section class="overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-card">
      <div class="grid grid-cols-[minmax(220px,1fr)_170px_170px_auto_auto] gap-3 border-b border-neutral-200 bg-neutral-50 p-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <label class="relative block">
          <Search :size="17" class="pointer-events-none absolute left-3 top-3.5 text-neutral-500" />
          <input
            v-model="maintenance.search"
            type="search"
            placeholder="Cari unit, produk, atau vendor..."
            class="min-h-11 w-full rounded-md border border-neutral-200 bg-neutral-0 pl-10 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
          />
        </label>
        <AtomsAppSelect
          v-model="maintenance.statusFilter"
          label="Filter status"
          :options="maintenance.statusOptions"
          hide-label
        />
        <AtomsAppSelect
          v-model="maintenance.typeFilter"
          label="Filter jenis"
          :options="maintenance.typeFilterOptions"
          hide-label
        />
        <button
          type="button"
          title="Reset filter"
          class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          @click="maintenance.resetFilters"
        >
          <RotateCcw :size="17" />
        </button>
        <button
          type="button"
          title="Perbarui data"
          :disabled="maintenance.store.loading"
          class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-wait"
          @click="maintenance.fetchAll"
        >
          <RefreshCw :size="17" :class="{ 'animate-spin': maintenance.store.loading }" />
        </button>
      </div>

      <div v-if="maintenance.store.loading" class="grid min-h-80 place-items-center">
        <div class="text-center">
          <LoaderCircle :size="27" class="mx-auto animate-spin text-primary-600" />
          <p class="mt-3 text-sm font-semibold text-neutral-900">Memuat data pemeliharaan</p>
        </div>
      </div>

      <div
        v-else-if="!maintenance.filteredRecords.length"
        class="grid min-h-80 place-items-center px-6 py-12 text-center"
      >
        <div class="max-w-sm">
          <span class="mx-auto grid h-12 w-12 place-items-center rounded-md bg-neutral-100 text-neutral-500">
            <Wrench :size="22" />
          </span>
          <h2 class="mt-4 text-base font-semibold text-neutral-900">Belum ada pemeliharaan</h2>
          <p class="mt-2 text-sm leading-6 text-neutral-500">
            Jadwalkan servis, perbaikan, atau inspeksi unit pertama.
          </p>
          <AtomsAppButton class="mt-5" @click="maintenance.openCreate">
            <Plus :size="16" class="mr-2" />
            Jadwalkan pemeliharaan
          </AtomsAppButton>
        </div>
      </div>

      <template v-else>
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr class="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
                <th class="px-5 py-3">Unit</th>
                <th class="px-4 py-3">Jenis</th>
                <th class="px-4 py-3">Judul</th>
                <th class="px-4 py-3">Jadwal</th>
                <th class="px-4 py-3">Biaya</th>
                <th class="px-4 py-3">Status</th>
                <th class="w-56 px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              <tr v-for="record in maintenance.filteredRecords" :key="record.id" class="hover:bg-neutral-50/70">
                <td class="px-5 py-4">
                  <strong class="block text-sm font-semibold text-neutral-900">{{ maintenance.unitLabel(record) }}</strong>
                </td>
                <td class="px-4 py-4 text-sm text-neutral-700">{{ maintenance.typeLabel(record.type) }}</td>
                <td class="px-4 py-4">
                  <p class="text-sm text-neutral-900">{{ record.title }}</p>
                  <p v-if="record.vendor" class="mt-0.5 text-xs text-neutral-500">{{ record.vendor }}</p>
                </td>
                <td class="px-4 py-4 text-xs text-neutral-500">
                  {{ maintenance.formatDate(record.scheduled_at) || 'Belum dijadwalkan' }}
                </td>
                <td class="px-4 py-4 text-sm text-neutral-700">
                  {{ record.cost ? maintenance.formatCurrency(Number(record.cost)) : '—' }}
                </td>
                <td class="px-4 py-4">
                  <span :class="['rounded-full px-2.5 py-1 text-[10px] font-semibold', statusClass[maintenance.statusTone(record.status)]]">
                    {{ maintenance.statusLabel(record.status) }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="record.status === 'scheduled'"
                      type="button"
                      :disabled="maintenance.store.updatingId === record.id"
                      class="inline-flex min-h-8 items-center rounded-md border border-neutral-200 px-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
                      @click="maintenance.startMaintenance(record)"
                    >
                      <LoaderCircle v-if="maintenance.store.updatingId === record.id" :size="13" class="mr-1.5 animate-spin" />
                      Mulai
                    </button>
                    <button
                      v-if="record.status === 'in_progress'"
                      type="button"
                      class="inline-flex min-h-8 items-center rounded-md bg-primary-600 px-2.5 text-xs font-semibold text-white hover:bg-primary-700"
                      @click="maintenance.openComplete(record)"
                    >
                      Selesaikan
                    </button>
                    <button
                      v-if="['scheduled', 'in_progress'].includes(record.status)"
                      type="button"
                      title="Batalkan"
                      class="grid h-8 w-8 place-items-center rounded-md text-neutral-400 hover:bg-red-50 hover:text-danger-500"
                      @click="maintenance.requestCancel(record)"
                    >
                      <CircleX :size="15" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="divide-y divide-neutral-200 md:hidden">
          <article v-for="record in maintenance.filteredRecords" :key="record.id" class="p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="truncate text-sm font-semibold text-neutral-900">{{ maintenance.unitLabel(record) }}</h3>
                <p class="mt-1 text-xs text-neutral-500">{{ maintenance.typeLabel(record.type) }} · {{ record.title }}</p>
              </div>
              <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold', statusClass[maintenance.statusTone(record.status)]]">
                {{ maintenance.statusLabel(record.status) }}
              </span>
            </div>
            <p class="mt-3 text-xs text-neutral-500">{{ maintenance.formatDate(record.scheduled_at) || 'Belum dijadwalkan' }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                v-if="record.status === 'scheduled'"
                type="button"
                :disabled="maintenance.store.updatingId === record.id"
                class="inline-flex min-h-8 items-center rounded-md border border-neutral-200 px-2.5 text-xs font-semibold text-neutral-700 disabled:opacity-50"
                @click="maintenance.startMaintenance(record)"
              >
                Mulai
              </button>
              <button
                v-if="record.status === 'in_progress'"
                type="button"
                class="inline-flex min-h-8 items-center rounded-md bg-primary-600 px-2.5 text-xs font-semibold text-white"
                @click="maintenance.openComplete(record)"
              >
                Selesaikan
              </button>
              <button
                v-if="['scheduled', 'in_progress'].includes(record.status)"
                type="button"
                class="inline-flex min-h-8 items-center rounded-md border border-neutral-200 px-2.5 text-xs font-semibold text-danger-500"
                @click="maintenance.requestCancel(record)"
              >
                Batalkan
              </button>
            </div>
          </article>
        </div>

        <footer class="flex flex-wrap justify-between gap-2 border-t border-neutral-200 bg-neutral-50 px-5 py-3 text-xs text-neutral-500">
          <span>Menampilkan {{ maintenance.filteredRecords.length }} pemeliharaan</span>
          <span>Total {{ maintenance.store.total }} data</span>
        </footer>
      </template>
    </section>
  </section>

  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="maintenance.createOpen" class="fixed inset-0 z-[70]">
        <button
          type="button"
          aria-label="Tutup form pemeliharaan"
          class="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
          @click="maintenance.closeCreate"
        ></button>

        <form
          class="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-neutral-0 shadow-2xl"
          @submit.prevent="maintenance.submit"
        >
          <header class="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-5 sm:px-6">
            <div>
              <h2 class="text-lg font-semibold text-neutral-900">Jadwalkan pemeliharaan</h2>
              <p class="mt-0.5 text-xs text-neutral-500">Unit tidak dapat dipesan selama pemeliharaan berlangsung.</p>
            </div>
            <button
              type="button"
              class="grid h-9 w-9 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"
              @click="maintenance.closeCreate"
            >
              <X :size="18" />
            </button>
          </header>

          <div class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            <div class="grid gap-4">
              <AtomsAppSelect
                v-model="maintenance.form.product_unit_id"
                label="Unit produk"
                :options="maintenance.unitOptions"
                required
              />
              <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <AtomsAppSelect
                  v-model="maintenance.form.type"
                  label="Jenis pemeliharaan"
                  :options="maintenance.typeOptions"
                />
                <AtomsAppInput
                  v-model="maintenance.form.scheduled_at"
                  label="Jadwal (opsional)"
                  type="datetime-local"
                />
              </div>
              <AtomsAppInput
                v-model="maintenance.form.title"
                label="Judul"
                placeholder="Contoh: Servis rutin AC"
                :maxlength="200"
                required
              />
              <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <AtomsAppInput
                  v-model="maintenance.form.vendor"
                  label="Vendor (opsional)"
                  placeholder="Nama bengkel / teknisi"
                />
                <AtomsAppInput
                  v-model="maintenance.form.cost"
                  label="Estimasi biaya (Rp)"
                  type="number"
                  :min="0"
                  step="1000"
                  placeholder="0"
                />
              </div>
              <label class="grid gap-2 text-sm font-medium text-neutral-700">
                Catatan (opsional)
                <textarea
                  v-model="maintenance.form.description"
                  rows="3"
                  maxlength="1000"
                  placeholder="Detail pekerjaan yang perlu dilakukan..."
                  class="w-full resize-y rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
                ></textarea>
              </label>
            </div>
          </div>

          <footer class="flex shrink-0 justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:px-6">
            <AtomsAppButton variant="secondary" :disabled="maintenance.store.creating" @click="maintenance.closeCreate">
              Batal
            </AtomsAppButton>
            <AtomsAppButton type="submit" :disabled="maintenance.store.creating">
              <LoaderCircle v-if="maintenance.store.creating" :size="16" class="mr-2 animate-spin" />
              <Wrench v-else :size="16" class="mr-2" />
              {{ maintenance.store.creating ? 'Menyimpan...' : 'Jadwalkan' }}
            </AtomsAppButton>
          </footer>
        </form>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <div v-if="maintenance.completeTarget" class="fixed inset-0 z-[80] grid place-items-center p-4">
      <button
        type="button"
        aria-label="Tutup form selesaikan"
        class="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
        @click="maintenance.closeComplete"
      ></button>
      <form
        class="relative w-full max-w-md rounded-md bg-neutral-0 p-6 shadow-2xl"
        @submit.prevent="maintenance.submitComplete"
      >
        <h2 class="text-base font-semibold text-neutral-900">Selesaikan pemeliharaan</h2>
        <p class="mt-1 text-sm text-neutral-500">{{ maintenance.completeTarget.title }}</p>

        <div class="mt-5 grid gap-4">
          <AtomsAppSelect
            v-model="maintenance.completeForm.unit_status"
            label="Status unit setelah pemeliharaan"
            :options="maintenance.unitStatusOptions"
          />
          <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <AtomsAppInput
              v-model="maintenance.completeForm.condition"
              label="Kondisi (opsional)"
              placeholder="Baik / perlu perhatian"
            />
            <AtomsAppInput
              v-model="maintenance.completeForm.current_meter"
              label="Meter saat ini (opsional)"
              type="number"
              :min="0"
            />
          </div>
          <AtomsAppInput
            v-model="maintenance.completeForm.cost"
            label="Biaya aktual (Rp)"
            type="number"
            :min="0"
            step="1000"
          />
          <label class="grid gap-2 text-sm font-medium text-neutral-700">
            Catatan (opsional)
            <textarea
              v-model="maintenance.completeForm.description"
              rows="3"
              maxlength="1000"
              class="w-full resize-y rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100"
            ></textarea>
          </label>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <AtomsAppButton
            type="button"
            variant="secondary"
            :disabled="maintenance.store.updatingId === maintenance.completeTarget.id"
            @click="maintenance.closeComplete"
          >
            Batal
          </AtomsAppButton>
          <AtomsAppButton type="submit" :disabled="maintenance.store.updatingId === maintenance.completeTarget.id">
            <LoaderCircle v-if="maintenance.store.updatingId === maintenance.completeTarget.id" :size="16" class="mr-2 animate-spin" />
            <Check v-else :size="16" class="mr-2" />
            Selesaikan
          </AtomsAppButton>
        </div>
      </form>
    </div>
  </Teleport>

  <Teleport to="body">
    <div v-if="maintenance.cancelTarget" class="fixed inset-0 z-[80] grid place-items-center p-4">
      <button
        type="button"
        aria-label="Batalkan"
        class="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
        @click="maintenance.closeCancel"
      ></button>
      <div class="relative w-full max-w-sm rounded-md bg-neutral-0 p-6 shadow-2xl">
        <span class="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-danger-500">
          <Ban :size="20" />
        </span>
        <h2 class="mt-4 text-base font-semibold text-neutral-900">Batalkan pemeliharaan ini?</h2>
        <p class="mt-2 text-sm leading-6 text-neutral-500">
          {{ maintenance.cancelTarget.title }} — {{ maintenance.unitLabel(maintenance.cancelTarget) }}.
          Unit akan tersedia kembali jika sedang berlangsung.
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <AtomsAppButton
            variant="secondary"
            :disabled="maintenance.store.updatingId === maintenance.cancelTarget.id"
            @click="maintenance.closeCancel"
          >
            Batal
          </AtomsAppButton>
          <AtomsAppButton variant="primary" :disabled="maintenance.store.updatingId === maintenance.cancelTarget.id" @click="maintenance.confirmCancel">
            <LoaderCircle v-if="maintenance.store.updatingId === maintenance.cancelTarget.id" :size="16" class="mr-2 animate-spin" />
            <CircleX v-else :size="16" class="mr-2" />
            Ya, batalkan
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

<script setup lang="ts">
import {
  ArrowLeft,
  CalendarDays,
  Check,
  IdCard,
  KeyRound,
  LoaderCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from '@lucide/vue'
import type { Component } from 'vue'
import type { EngineCode, TenantEngine } from '~/domain/mitra'
import { ENGINE_LABELS } from '~/domain/mitra'

defineEmits<{ back: [] }>()

const engines = useEngineStore()
const snackbar = useSnackbarStore()

const engineIcons: Record<EngineCode, Component> = {
  rental: KeyRound,
  booking: CalendarDays,
  membership: IdCard,
  sales: ShoppingBag,
}

const confirmTarget = ref<TenantEngine | null>(null)
const confirmAction = computed<'enable' | 'disable' | null>(() => {
  if (!confirmTarget.value) return null
  return confirmTarget.value.is_enabled ? 'disable' : 'enable'
})

function formatPrice(amount: string) {
  const value = Number(amount)
  if (!value) return 'Gratis'
  return `${new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)}/bulan`
}

function requestToggle(item: TenantEngine) {
  if (item.is_core || engines.toggling) return
  confirmTarget.value = item
}

function cancelToggle() {
  confirmTarget.value = null
}

async function confirmToggle() {
  const target = confirmTarget.value
  if (!target) return

  try {
    if (target.is_enabled) {
      await engines.disable(target.code)
      snackbar.success(`${ENGINE_LABELS[target.code]} berhasil dinonaktifkan.`)
    } else {
      await engines.enable(target.code)
      snackbar.success(`${ENGINE_LABELS[target.code]} berhasil diaktifkan.`)
    }
    confirmTarget.value = null
  } catch (err) {
    snackbar.error(err instanceof Error ? err.message : engines.error)
  }
}

onMounted(() => {
  engines.fetchCatalog().catch(() => undefined)
})
</script>

<template>
  <section class="grid gap-6">
    <header>
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
          <Sparkles :size="21" />
        </span>
        <div>
          <h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl">Layanan Bisnis</h1>
          <p class="mt-1 text-sm text-neutral-500">Aktifkan atau nonaktifkan layanan yang dipakai bisnis Anda.</p>
        </div>
      </div>
    </header>

    <div v-if="engines.error" class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-danger-500">
      {{ engines.error }}
    </div>

    <div v-if="engines.loading && !engines.catalog.length" class="grid min-h-44 place-items-center rounded-md border border-neutral-200 bg-neutral-0 p-6 text-sm text-neutral-500">
      Memuat daftar layanan...
    </div>

    <div v-else class="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
      <article
        v-for="item in engines.catalog"
        :key="item.code"
        class="grid gap-4 rounded-md border border-neutral-200 bg-neutral-0 p-5 shadow-card"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary-50 text-primary-700">
              <component :is="engineIcons[item.code]" :size="20" />
            </span>
            <div>
              <h2 class="text-base font-semibold text-neutral-900">{{ ENGINE_LABELS[item.code] }}</h2>
              <p class="mt-0.5 text-xs font-medium text-neutral-500">{{ formatPrice(item.monthly_price) }}</p>
            </div>
          </div>
          <span
            v-if="item.is_core"
            class="whitespace-nowrap rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-700"
          >
            Termasuk paket dasar
          </span>
        </div>

        <p class="text-sm leading-6 text-neutral-500">{{ item.description }}</p>

        <AtomsAppToggle
          :model-value="item.is_enabled"
          :label="item.is_enabled ? 'Aktif' : 'Nonaktif'"
          :description="item.is_core ? 'Layanan inti, selalu aktif dan tidak bisa dinonaktifkan.' : undefined"
          :disabled="item.is_core || Boolean(engines.toggling)"
          :title="item.is_core ? 'Layanan inti, selalu aktif' : undefined"
          @update:model-value="requestToggle(item)"
        />
      </article>
    </div>

    <Transition name="modal">
      <div v-if="confirmTarget" class="fixed inset-0 z-[80] grid place-items-center p-4">
        <button
          type="button"
          aria-label="Batal"
          class="absolute inset-0 bg-neutral-900/45 backdrop-blur-[2px]"
          @click="cancelToggle"
        ></button>
        <section class="relative w-full max-w-md rounded-lg border border-neutral-200 bg-neutral-0 p-6 shadow-2xl">
          <span class="grid h-11 w-11 place-items-center rounded-md bg-primary-50 text-primary-700">
            <ShieldCheck :size="20" />
          </span>
          <h2 class="mt-4 text-lg font-semibold text-neutral-900">
            {{ confirmAction === 'enable' ? 'Aktifkan' : 'Nonaktifkan' }} {{ ENGINE_LABELS[confirmTarget.code] }}?
          </h2>
          <p class="mt-2 text-sm leading-6 text-neutral-500">
            <template v-if="confirmAction === 'enable'">
              Mengaktifkan {{ ENGINE_LABELS[confirmTarget.code] }} akan menambah
              <strong class="font-semibold text-neutral-900">{{ formatPrice(confirmTarget.monthly_price) }}</strong>
              ke tagihan langganan Anda mulai periode berikutnya.
            </template>
            <template v-else>
              Menonaktifkan {{ ENGINE_LABELS[confirmTarget.code] }} tidak menghapus data yang sudah dibuat, hanya
              memblokir pembuatan data baru untuk layanan ini.
            </template>
          </p>
          <div class="mt-6 flex justify-end gap-2">
            <AtomsAppButton variant="ghost" :disabled="Boolean(engines.toggling)" @click="cancelToggle">
              Batal
            </AtomsAppButton>
            <AtomsAppButton :disabled="Boolean(engines.toggling)" @click="confirmToggle">
              <LoaderCircle v-if="engines.toggling" :size="16" class="mr-2 animate-spin" />
              <Check v-else :size="16" class="mr-2" />
              {{ confirmAction === 'enable' ? 'Aktifkan' : 'Nonaktifkan' }}
            </AtomsAppButton>
          </div>
        </section>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

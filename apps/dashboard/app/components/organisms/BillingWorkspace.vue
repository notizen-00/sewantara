<script setup lang="ts">
import { ArrowLeft, Check, Clock3, CreditCard, ExternalLink, History, RefreshCw, ShieldCheck } from '@lucide/vue'

withDefaults(defineProps<{ showBack?: boolean }>(), { showBack: true })
defineEmits<{ back: [] }>()

const auth = useAuthStore()
const billing = useBillingStore()

const subscription = computed(() => auth.subscription)
const plan = computed(() => subscription.value?.plan)
const isTrial = computed(() => subscription.value?.is_on_trial || subscription.value?.status === 'trial')

const priceLabel = computed(() => {
  if (!plan.value) return 'Harga belum tersedia'
  const amount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: plan.value.currency || 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(plan.value.price))
  const interval = plan.value.invoice_interval === 'year' ? 'tahun' : 'bulan'
  return `${amount} / ${plan.value.invoice_period > 1 ? `${plan.value.invoice_period} ` : ''}${interval}`
})

const trialEndLabel = computed(() => {
  const value = subscription.value?.trial_ends_at
  if (!value) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(value))
})

async function payNow() {
  try {
    await billing.redirectToCheckout()
  } catch {
    // Pesan error ditampilkan dari store billing.
  }
}

function formatAmount(amount: string, currency: string) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency || 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

function formatPaymentDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(value))
}

const paymentStatus = {
  paid: { label: 'Berhasil', class: 'bg-primary-50 text-primary-700' },
  pending: { label: 'Menunggu', class: 'bg-amber-50 text-amber-700' },
  failed: { label: 'Gagal', class: 'bg-red-50 text-danger-500' },
  expired: { label: 'Kedaluwarsa', class: 'bg-neutral-100 text-neutral-700' },
} as const

onMounted(billing.fetchHistory)
</script>

<template>
  <section class="grid gap-6">
    <header>
      <button
        v-if="showBack"
        type="button"
        class="mb-4 inline-flex min-h-9 items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900"
        @click="$emit('back')"
      >
        <ArrowLeft :size="16" />
        Kembali ke dashboard
      </button>
      <h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl">Paket & tagihan</h1>
      <p class="mt-2 text-sm text-neutral-500">Kelola paket, pembayaran, dan masa aktif.</p>
    </header>

    <div class="grid grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] gap-5 max-lg:grid-cols-1">
      <article class="rounded-md border border-neutral-200 bg-neutral-0 p-6 shadow-card">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-primary-700">Paket saat ini</p>
            <h2 class="mt-2 text-2xl font-bold text-neutral-900">{{ plan?.name || 'Belum ada paket' }}</h2>
            <p class="mt-2 max-w-xl text-sm leading-6 text-neutral-500">{{ plan?.description || 'Data paket belum tersedia.' }}</p>
          </div>
          <span
            :class="[
              'rounded-full px-3 py-1.5 text-xs font-bold',
              subscription?.is_active ? 'bg-primary-50 text-primary-700' : 'bg-amber-50 text-amber-700',
            ]"
          >
            {{ isTrial ? 'Trial aktif' : subscription?.status === 'active' ? 'Aktif' : subscription?.status || 'Tidak aktif' }}
          </span>
        </div>

        <div class="mt-6 border-y border-neutral-200 py-5">
          <p class="text-sm text-neutral-500">Biaya paket</p>
          <p class="mt-1 text-xl font-bold text-neutral-900">{{ priceLabel }}</p>
          <p v-if="isTrial && trialEndLabel" class="mt-2 flex items-center gap-2 text-sm font-medium text-amber-700">
            <Clock3 :size="16" /> Trial berlaku sampai {{ trialEndLabel }}
          </p>
        </div>

        <div v-if="plan?.features?.length" class="mt-5 grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <div v-for="feature in plan.features" :key="feature.slug" class="flex items-center gap-3 text-sm text-neutral-700">
            <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-700">
              <Check :size="14" />
            </span>
            <span>{{ feature.name }}: <strong>{{ feature.value }}</strong></span>
          </div>
        </div>
      </article>

      <aside class="rounded-md border border-neutral-200 bg-neutral-0 p-6 shadow-card">
        <span class="grid h-11 w-11 place-items-center rounded-md bg-primary-50 text-primary-700">
          <CreditCard :size="21" />
        </span>
        <h2 class="mt-4 text-lg font-bold text-neutral-900">
          {{ isTrial ? 'Aktifkan paket' : 'Perpanjang paket' }}
        </h2>
        <p class="mt-2 text-sm leading-6 text-neutral-500">
          Selesaikan pembayaran untuk mengaktifkan periode berikutnya.
        </p>

        <div v-if="billing.error" class="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-danger-500">
          {{ billing.error }}
        </div>

        <AtomsAppButton class="mt-5 w-full" :disabled="billing.loading || !plan" @click="payNow">
          <span class="flex items-center gap-2">
            {{ billing.loading ? 'Memproses...' : 'Bayar' }}
            <ExternalLink v-if="!billing.loading" :size="16" />
          </span>
        </AtomsAppButton>

        <p class="mt-4 flex items-start gap-2 text-xs leading-5 text-neutral-500">
          <ShieldCheck :size="16" class="mt-0.5 shrink-0 text-primary-700" />
          Pembayaran diproses melalui layanan pembayaran yang terlindungi.
        </p>
      </aside>
    </div>

    <section class="overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-card">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4">
        <div class="flex items-center gap-3">
          <span class="grid h-9 w-9 place-items-center rounded-md bg-primary-50 text-primary-700">
            <History :size="18" />
          </span>
          <div>
            <h2 class="text-base font-bold text-neutral-900">Riwayat pembayaran</h2>
            <p class="mt-0.5 text-xs text-neutral-500">Daftar transaksi pembayaran.</p>
          </div>
        </div>
        <button
          type="button"
          class="inline-flex min-h-9 items-center gap-2 rounded-md border border-neutral-200 px-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
          :disabled="billing.historyLoading"
          @click="billing.fetchHistory"
        >
          <RefreshCw :size="15" :class="{ 'animate-spin': billing.historyLoading }" />
          Perbarui
        </button>
      </div>

      <div v-if="billing.historyLoading && !billing.history.length" class="grid min-h-44 place-items-center p-6 text-sm text-neutral-500">
        Memuat riwayat pembayaran...
      </div>

      <div v-else-if="!billing.history.length" class="grid min-h-44 place-items-center p-6 text-center">
        <div>
          <span class="mx-auto grid h-11 w-11 place-items-center rounded-full bg-neutral-100 text-neutral-500">
            <CreditCard :size="20" />
          </span>
          <p class="mt-3 text-sm font-semibold text-neutral-900">Belum ada pembayaran</p>
          <p class="mt-1 text-xs text-neutral-500">Transaksi pembayaran akan ditampilkan di sini.</p>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[760px] text-left text-sm">
          <thead class="bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <tr>
              <th class="px-5 py-3">Nomor pembayaran</th>
              <th class="px-5 py-3">Tanggal</th>
              <th class="px-5 py-3 text-right">Nominal</th>
              <th class="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200">
            <tr v-for="item in billing.history" :key="item.id" class="hover:bg-neutral-50">
              <td class="px-5 py-4">
                <strong class="block font-semibold text-neutral-900">{{ item.payment_number }}</strong>
              </td>
              <td class="whitespace-nowrap px-5 py-4 text-neutral-700">{{ formatPaymentDate(item.created_at) }}</td>
              <td class="whitespace-nowrap px-5 py-4 text-right font-semibold text-neutral-900">{{ formatAmount(item.amount, item.currency) }}</td>
              <td class="px-5 py-4 text-right">
                <span :class="['inline-flex rounded-full px-2.5 py-1 text-xs font-bold', paymentStatus[item.status].class]">
                  {{ paymentStatus[item.status].label }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

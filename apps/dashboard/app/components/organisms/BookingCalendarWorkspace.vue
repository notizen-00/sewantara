<script setup lang="ts">
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  X,
} from '@lucide/vue'
import { useBookingCalendarPresenter } from '~/application/bookings/useBookingCalendarPresenter'

defineEmits<{
  back: []
}>()

const calendar = useBookingCalendarPresenter()

const statusClass = {
  success: 'bg-primary-50 text-primary-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  warning: 'bg-amber-50 text-amber-700',
}

const barToneClass = {
  success: 'bg-primary-600',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
}

const LANE_HEIGHT = 19
const BARS_TOP_OFFSET = 30

onMounted(() => {
  calendar.initialize().catch(() => undefined)
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
            <CalendarDays :size="21" />
          </span>
          <div>
            <h1 class="text-2xl font-bold text-neutral-900 sm:text-3xl">Kalender booking</h1>
            <p class="mt-1 text-sm text-neutral-500">
              Cek jadwal booking pada {{ calendar.auth.activeWorkspace.branchName || 'cabang aktif' }}.
            </p>
          </div>
        </div>
      </div>
    </header>

    <section class="overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-card">
      <div class="grid grid-cols-[minmax(200px,1fr)_190px_auto_auto] items-center gap-3 border-b border-neutral-200 bg-neutral-50 p-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <AtomsAppSelect
          v-model="calendar.productFilter"
          label="Filter produk"
          :options="calendar.productOptions"
          hide-label
        />
        <AtomsAppSelect
          v-model="calendar.statusFilter"
          label="Filter status"
          :options="calendar.statusOptions"
          hide-label
        />
        <button
          type="button"
          title="Reset filter"
          class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          @click="calendar.resetFilters"
        >
          <RotateCcw :size="17" />
        </button>
        <button
          type="button"
          title="Perbarui jadwal"
          :disabled="calendar.loading"
          class="grid h-11 w-11 place-items-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-wait"
          @click="calendar.fetchMonth()"
        >
          <RefreshCw :size="17" :class="{ 'animate-spin': calendar.loading }" />
        </button>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3">
        <div class="flex items-center gap-2">
          <button
            type="button"
            title="Bulan sebelumnya"
            class="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
            @click="calendar.prevMonth"
          >
            <ChevronLeft :size="16" />
          </button>
          <h2 class="min-w-40 text-center text-sm font-semibold capitalize text-neutral-900">
            {{ calendar.monthLabel }}
          </h2>
          <button
            type="button"
            title="Bulan berikutnya"
            class="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
            @click="calendar.nextMonth"
          >
            <ChevronRight :size="16" />
          </button>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-medium text-neutral-500">{{ calendar.monthBookingCount }} booking bulan ini</span>
          <button
            type="button"
            class="rounded-md border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
            @click="calendar.goToday"
          >
            Hari ini
          </button>
        </div>
      </div>

      <div v-if="calendar.loading" class="grid min-h-80 place-items-center">
        <div class="text-center">
          <LoaderCircle :size="27" class="mx-auto animate-spin text-primary-600" />
          <p class="mt-3 text-sm font-semibold text-neutral-900">Memuat jadwal booking</p>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <div class="grid min-w-[700px] grid-cols-7 border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
          <div v-for="label in calendar.weekdayLabels" :key="label" class="px-3 py-2 text-center">
            {{ label }}
          </div>
        </div>

        <div class="min-w-[700px]">
          <div
            v-for="(week, weekIndex) in calendar.calendarWeeks"
            :key="week[0].iso"
            class="relative grid grid-cols-7 divide-x divide-neutral-200 border-b border-neutral-200"
          >
            <button
              v-for="cell in week"
              :key="cell.iso"
              type="button"
              :style="{ minHeight: `${64 + calendar.weekBars[weekIndex].laneCount * LANE_HEIGHT}px` }"
              :class="[
                'p-2 text-left align-top transition hover:bg-neutral-50',
                cell.inCurrentMonth ? 'bg-neutral-0' : 'bg-neutral-50/60 text-neutral-400',
                calendar.selectedDate === cell.iso ? 'ring-2 ring-inset ring-primary-500' : '',
              ]"
              @click="calendar.selectDay(cell.iso)"
            >
              <span
                :class="[
                  'grid h-6 w-6 place-items-center rounded-full text-xs font-semibold',
                  cell.isToday ? 'bg-primary-600 text-white' : cell.inCurrentMonth ? 'text-neutral-700' : 'text-neutral-400',
                ]"
              >
                {{ cell.day }}
              </span>

              <span
                v-if="calendar.weekBars[weekIndex].overflowByIso[cell.iso]"
                class="mt-1 block text-[10px] font-medium text-neutral-500"
                :style="{ marginTop: `${calendar.weekBars[weekIndex].laneCount * LANE_HEIGHT + 2}px` }"
              >
                +{{ calendar.weekBars[weekIndex].overflowByIso[cell.iso] }} lainnya
              </span>
            </button>

            <div
              class="pointer-events-none absolute inset-x-0 grid grid-cols-7 gap-y-[3px] px-1"
              :style="{ top: `${BARS_TOP_OFFSET}px` }"
            >
              <span
                v-for="bar in calendar.weekBars[weekIndex].bars"
                :key="bar.key"
                :title="bar.code"
                :class="[
                  'truncate px-1.5 text-[10px] font-semibold leading-[16px] text-white',
                  barToneClass[bar.tone],
                  bar.isStart ? 'rounded-l-sm' : '',
                  bar.isEnd ? 'rounded-r-sm' : '',
                ]"
                :style="{
                  gridColumn: `${bar.colStart} / span ${bar.colSpan}`,
                  gridRow: bar.lane + 1,
                  height: '16px',
                }"
              >
                {{ bar.code }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="calendar.selectedDate" class="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Tutup detail jadwal"
        class="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
        @click="calendar.closeDetail"
      ></button>

      <article class="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-neutral-0 shadow-2xl">
        <header class="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
          <div class="min-w-0">
            <h2 class="text-base font-semibold capitalize text-neutral-900">{{ calendar.formatDay(calendar.selectedDate) }}</h2>
            <p class="mt-1 text-xs text-neutral-500">{{ calendar.selectedDayBookings.length }} booking pada tanggal ini</p>
          </div>
          <button
            type="button"
            title="Tutup"
            class="grid h-9 w-9 shrink-0 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100"
            @click="calendar.closeDetail"
          >
            <X :size="18" />
          </button>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto p-5">
          <div v-if="!calendar.selectedDayBookings.length" class="grid min-h-40 place-items-center text-center">
            <div>
              <span class="mx-auto grid h-11 w-11 place-items-center rounded-full bg-neutral-100 text-neutral-500">
                <CalendarDays :size="20" />
              </span>
              <p class="mt-3 text-sm font-semibold text-neutral-900">Tidak ada booking</p>
              <p class="mt-1 text-xs text-neutral-500">Tidak ada jadwal pada tanggal ini untuk filter yang dipilih.</p>
            </div>
          </div>

          <div v-else class="grid gap-3">
            <article
              v-for="booking in calendar.selectedDayBookings"
              :key="booking.id"
              class="rounded-md border border-neutral-200 p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <strong class="block truncate text-sm font-semibold text-neutral-900">
                    {{ calendar.bookingCode(booking) }}
                  </strong>
                  <span class="mt-1 block truncate text-xs text-neutral-500">
                    {{ calendar.customerName(booking) }}
                  </span>
                </div>
                <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold', statusClass[calendar.statusTone(booking.status)]]">
                  {{ calendar.statusLabel(booking.status) }}
                </span>
              </div>
              <div class="mt-3 grid grid-cols-2 gap-2 border-t border-neutral-200 pt-3 text-xs">
                <div>
                  <p class="text-neutral-500">Mulai</p>
                  <p class="mt-0.5 font-medium text-neutral-800">{{ calendar.formatTime(calendar.bookingStart(booking)) }}</p>
                </div>
                <div>
                  <p class="text-neutral-500">Selesai</p>
                  <p class="mt-0.5 font-medium text-neutral-800">{{ calendar.formatTime(calendar.bookingEnd(booking)) }}</p>
                </div>
              </div>
              <p class="mt-3 truncate text-xs text-neutral-600">{{ calendar.productSummary(booking) }}</p>
              <p class="mt-2 text-sm font-semibold text-neutral-900">
                {{ calendar.formatCurrency(Number(booking.total_amount || booking.grand_total || 0)) }}
              </p>
            </article>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

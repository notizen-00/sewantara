import type { Booking, BookingItem } from '~/domain/booking'
import { useBookingRepository } from '~/infrastructure/repositories/bookingRepository'

const WEEKDAY_LABELS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu']
const MAX_LANES = 3

interface CalendarCell {
  iso: string
  date: Date
  day: number
  inCurrentMonth: boolean
  isToday: boolean
  bookings: Booking[]
}

interface BookingBar {
  key: string
  bookingId: number
  code: string
  tone: 'success' | 'danger' | 'info' | 'warning'
  colStart: number
  colSpan: number
  lane: number
  isStart: boolean
  isEnd: boolean
}

interface WeekBars {
  bars: BookingBar[]
  overflowByIso: Record<string, number>
  laneCount: number
}

function normalizeStatus(status: string) {
  return (status || '').trim().toLowerCase().replace(/[\s-]+/g, '_')
}

function toIsoDate(date: Date) {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function startOfGrid(date: Date) {
  const first = startOfMonth(date)
  const grid = new Date(first)
  grid.setDate(grid.getDate() - grid.getDay())
  return grid
}

function endOfGrid(date: Date) {
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  const lastDay = new Date(nextMonth.getTime() - 1)
  const grid = new Date(lastDay)
  grid.setDate(grid.getDate() + (6 - grid.getDay()))
  return grid
}

export function useBookingCalendarPresenter() {
  const auth = useAuthStore()
  const products = useProductStore()
  const snackbar = useSnackbarStore()

  const viewDate = ref(startOfMonth(new Date()))
  const productFilter = ref<number | null>(null)
  const statusFilter = ref('')
  const selectedDate = ref<string | null>(null)
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref('')
  const initializedContext = ref('')

  const contextKey = computed(() => `${auth.tenantId}:${auth.branchId}`)
  const today = new Date()
  const todayIso = toIsoDate(today)

  const monthLabel = computed(() =>
    new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(viewDate.value),
  )

  const productOptions = computed(() => [
    { label: 'Semua produk', value: null as number | null },
    ...products.products
      .filter((product) => product.is_active)
      .map((product) => ({ label: product.name, value: product.id as number | null })),
  ])

  const statusOptions = computed(() => {
    const statuses = Array.from(new Set(bookings.value.map((booking) => normalizeStatus(booking.status))))
    return [
      { label: 'Semua status', value: '' },
      ...statuses.map((status) => ({ label: statusLabel(status), value: status })),
    ]
  })

  const calendarWeeks = computed(() => {
    const gridStart = startOfGrid(viewDate.value)
    const gridEnd = endOfGrid(viewDate.value)
    const cells: CalendarCell[] = []

    for (let cursor = new Date(gridStart); cursor <= gridEnd; cursor.setDate(cursor.getDate() + 1)) {
      const iso = toIsoDate(cursor)
      cells.push({
        iso,
        date: new Date(cursor),
        day: cursor.getDate(),
        inCurrentMonth: cursor.getMonth() === viewDate.value.getMonth(),
        isToday: iso === todayIso,
        bookings: bookings.value.filter((booking) => occursOnDay(booking, iso)),
      })
    }

    const weeks: CalendarCell[][] = []
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
    return weeks
  })

  const weekBars = computed<WeekBars[]>(() => calendarWeeks.value.map((week) => buildWeekBars(week)))

  function buildWeekBars(week: CalendarCell[]): WeekBars {
    const weekStartIso = week[0].iso
    const weekEndIso = week[week.length - 1].iso

    const uniqueBookings = new Map<number, Booking>()
    for (const cell of week) {
      for (const booking of cell.bookings) uniqueBookings.set(booking.id, booking)
    }

    const segments = Array.from(uniqueBookings.values()).map((booking) => {
      const startIso = bookingStart(booking).slice(0, 10)
      const endIso = (bookingEnd(booking) || bookingStart(booking)).slice(0, 10)
      const clippedStart = startIso < weekStartIso ? weekStartIso : startIso
      const clippedEnd = endIso > weekEndIso ? weekEndIso : endIso
      const colStart = week.findIndex((cell) => cell.iso === clippedStart) + 1
      const colEnd = week.findIndex((cell) => cell.iso === clippedEnd) + 1

      return {
        booking,
        colStart,
        colSpan: Math.max(1, colEnd - colStart + 1),
        isStart: startIso === clippedStart,
        isEnd: endIso === clippedEnd,
      }
    }).sort((left, right) => left.colStart - right.colStart || right.colSpan - left.colSpan)

    const laneEnds: number[] = []
    const bars: BookingBar[] = []
    const overflowIds = new Set<number>()

    for (const segment of segments) {
      let lane = laneEnds.findIndex((end) => end < segment.colStart)
      if (lane === -1) {
        if (laneEnds.length >= MAX_LANES) {
          overflowIds.add(segment.booking.id)
          continue
        }
        lane = laneEnds.length
        laneEnds.push(0)
      }
      laneEnds[lane] = segment.colStart + segment.colSpan - 1

      bars.push({
        key: `${segment.booking.id}-${weekStartIso}`,
        bookingId: segment.booking.id,
        code: bookingCode(segment.booking),
        tone: statusTone(segment.booking.status),
        colStart: segment.colStart,
        colSpan: segment.colSpan,
        lane,
        isStart: segment.isStart,
        isEnd: segment.isEnd,
      })
    }

    const overflowByIso: Record<string, number> = {}
    for (const cell of week) {
      const count = cell.bookings.filter((booking) => overflowIds.has(booking.id)).length
      if (count) overflowByIso[cell.iso] = count
    }

    return { bars, overflowByIso, laneCount: Math.min(Math.max(laneEnds.length, 1), MAX_LANES) }
  }

  const selectedDayBookings = computed(() => {
    if (!selectedDate.value) return []
    return bookings.value
      .filter((booking) => occursOnDay(booking, selectedDate.value!))
      .sort((left, right) => new Date(bookingStart(left)).getTime() - new Date(bookingStart(right)).getTime())
  })

  const monthBookingCount = computed(() => bookings.value.length)

  function occursOnDay(booking: Booking, iso: string) {
    const start = bookingStart(booking)
    const end = bookingEnd(booking) || start
    if (!start) return false
    const startIso = start.slice(0, 10)
    const endIso = (end || start).slice(0, 10)
    return iso >= startIso && iso <= endIso
  }

  async function fetchMonth(showError = true) {
    loading.value = true
    error.value = ''
    try {
      const gridStart = startOfGrid(viewDate.value)
      const gridEnd = endOfGrid(viewDate.value)
      gridEnd.setDate(gridEnd.getDate() + 1)

      const response = await useBookingRepository().list({
        status: statusFilter.value || undefined,
        product_id: productFilter.value || undefined,
        from: gridStart.toISOString(),
        to: gridEnd.toISOString(),
        per_page: 200,
      })
      const payload = response.data
      bookings.value = Array.isArray(payload) ? payload : payload.data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Jadwal booking gagal dimuat.'
      if (showError) snackbar.error(error.value)
      else throw err
    } finally {
      loading.value = false
    }
  }

  async function initialize(force = false) {
    if (!force && initializedContext.value === contextKey.value) return

    const results = await Promise.allSettled([
      fetchMonth(false),
      products.fetchProducts({ is_active: true, per_page: 100, branch_id: Number(auth.branchId) }),
    ])
    initializedContext.value = contextKey.value

    const failure = results.find((result) => result.status === 'rejected')
    if (failure?.status === 'rejected') {
      snackbar.error(failure.reason instanceof Error ? failure.reason.message : 'Data kalender gagal dimuat.')
    }
  }

  function goToday() {
    viewDate.value = startOfMonth(new Date())
    selectedDate.value = todayIso
  }

  function prevMonth() {
    viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
  }

  function nextMonth() {
    viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
  }

  function selectDay(iso: string) {
    selectedDate.value = selectedDate.value === iso ? null : iso
  }

  function closeDetail() {
    selectedDate.value = null
  }

  function resetFilters() {
    productFilter.value = null
    statusFilter.value = ''
  }

  function bookingCode(booking: Booking) {
    return booking.booking_number || booking.code || booking.reference || `BKG-${booking.id}`
  }

  function customerName(booking: Booking) {
    return booking.customer?.name || `Pelanggan #${booking.customer_id || '-'}`
  }

  function bookingStart(booking: Booking) {
    return booking.start_at || booking.start_date || booking.pickup_at || booking.created_at || ''
  }

  function bookingEnd(booking: Booking) {
    return booking.end_at || booking.end_date || booking.return_at || ''
  }

  function itemProductName(item: BookingItem) {
    return item.product_name || item.product?.name
      || products.products.find((product) => product.id === item.product_id)?.name
      || `Produk #${item.product_id}`
  }

  function productSummary(booking: Booking) {
    const items = booking.items || []
    if (!items.length) return 'Tanpa item'
    const names = items.map((item) => itemProductName(item))
    return names.length > 2 ? `${names.slice(0, 2).join(', ')}, +${names.length - 2} lainnya` : names.join(', ')
  }

  function formatDay(iso: string) {
    return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      .format(new Date(`${iso}T00:00:00`))
  }

  function formatTime(value: string) {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'
    return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(date)
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  function statusLabel(status: string) {
    const normalized = normalizeStatus(status)
    const labels: Record<string, string> = {
      draft: 'Draft',
      pending: 'Menunggu',
      waiting: 'Antrean',
      confirmed: 'Dikonfirmasi',
      unpaid: 'Belum dibayar',
      partially_paid: 'Dibayar sebagian',
      paid: 'Lunas',
      active: 'Aktif',
      ongoing: 'Berjalan',
      completed: 'Selesai',
      finished: 'Selesai',
      returned: 'Dikembalikan',
      cancelled: 'Dibatalkan',
      canceled: 'Dibatalkan',
      expired: 'Kedaluwarsa',
    }
    return labels[normalized] || normalized.replace(/_/g, ' ')
  }

  function statusTone(status: string): 'success' | 'danger' | 'info' | 'warning' {
    const normalized = normalizeStatus(status)
    if (['confirmed', 'paid', 'completed', 'finished', 'returned'].includes(normalized)) return 'success'
    if (['cancelled', 'canceled', 'expired', 'rejected', 'failed'].includes(normalized)) return 'danger'
    if (['active', 'ongoing', 'partially_paid'].includes(normalized)) return 'info'
    return 'warning'
  }

  watch([viewDate, productFilter, statusFilter], () => {
    fetchMonth().catch(() => undefined)
  })

  watch(contextKey, (nextContext, previousContext) => {
    if (nextContext !== previousContext && initializedContext.value) {
      bookings.value = []
      selectedDate.value = null
      initialize(true).catch(() => undefined)
    }
  })

  return reactive({
    auth,
    products,
    viewDate,
    productFilter,
    statusFilter,
    selectedDate,
    bookings,
    loading,
    error,
    monthLabel,
    productOptions,
    statusOptions,
    calendarWeeks,
    weekBars,
    selectedDayBookings,
    monthBookingCount,
    weekdayLabels: WEEKDAY_LABELS,
    initialize,
    fetchMonth,
    goToday,
    prevMonth,
    nextMonth,
    selectDay,
    closeDetail,
    resetFilters,
    bookingCode,
    customerName,
    bookingStart,
    bookingEnd,
    productSummary,
    formatDay,
    formatTime,
    formatCurrency,
    statusLabel,
    statusTone,
  })
}

export type BookingCalendarPresenter = ReturnType<typeof useBookingCalendarPresenter>

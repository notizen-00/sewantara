import { defineStore } from 'pinia'

export type SnackbarTone = 'success' | 'error' | 'warning' | 'info'

export interface SnackbarItem {
  id: number
  tone: SnackbarTone
  title: string
  message: string
  duration: number
}

interface SnackbarInput {
  tone?: SnackbarTone
  title?: string
  message: string
  duration?: number
}

const defaultTitles: Record<SnackbarTone, string> = {
  success: 'Berhasil diperbarui',
  error: 'Terjadi kendala',
  warning: 'Periksa kembali',
  info: 'Informasi',
}

export const useSnackbarStore = defineStore('snackbar', () => {
  const items = ref<SnackbarItem[]>([])
  const timers = new Map<number, ReturnType<typeof setTimeout>>()
  let sequence = 0

  function dismiss(id: number) {
    const timer = timers.get(id)
    if (timer) clearTimeout(timer)
    timers.delete(id)
    items.value = items.value.filter((item) => item.id !== id)
  }

  function show(input: SnackbarInput | string, tone: SnackbarTone = 'info') {
    const payload = typeof input === 'string' ? { message: input, tone } : input
    const message = payload.message.trim()
    if (!message) return null

    const resolvedTone = payload.tone || tone
    const existing = items.value.find((item) => item.message === message && item.tone === resolvedTone)
    if (existing) return existing.id

    const item: SnackbarItem = {
      id: ++sequence,
      tone: resolvedTone,
      title: payload.title || defaultTitles[resolvedTone],
      message,
      duration: payload.duration ?? 4500,
    }

    if (items.value.length >= 4) dismiss(items.value[0].id)
    items.value.push(item)

    if (process.client && item.duration > 0) {
      timers.set(item.id, setTimeout(() => dismiss(item.id), item.duration))
    }

    return item.id
  }

  function success(message: string, title?: string) {
    return show({ message, title, tone: 'success' })
  }

  function error(message: string, title?: string) {
    return show({ message, title, tone: 'error', duration: 6000 })
  }

  function warning(message: string, title?: string) {
    return show({ message, title, tone: 'warning', duration: 5500 })
  }

  function info(message: string, title?: string) {
    return show({ message, title, tone: 'info' })
  }

  function clear() {
    for (const item of items.value) dismiss(item.id)
  }

  return {
    items,
    show,
    success,
    error,
    warning,
    info,
    dismiss,
    clear,
  }
})

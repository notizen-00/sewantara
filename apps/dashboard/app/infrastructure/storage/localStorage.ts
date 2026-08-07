/**
 * Satu-satunya tempat kode aplikasi menyentuh `localStorage`, sehingga
 * pengecekan `process.client` dan penanganan JSON rusak tidak tersebar ke
 * store maupun komponen.
 */
export function readString(key: string) {
  if (!process.client) return ''
  return localStorage.getItem(key) || ''
}

export function writeString(key: string, value: string) {
  if (!process.client) return
  localStorage.setItem(key, value)
}

export function remove(key: string) {
  if (!process.client) return
  localStorage.removeItem(key)
}

export function readStringList(key: string) {
  if (!process.client) return [] as string[]

  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string' && item.length > 0)
      : []
  } catch {
    return []
  }
}

export function writeStringList(key: string, value: string[]) {
  writeString(key, JSON.stringify(value))
}

export function readBoolean(key: string) {
  return readString(key) === 'true'
}

export function writeBoolean(key: string, value: boolean) {
  writeString(key, String(value))
}

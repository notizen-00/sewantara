import type { Ref } from 'vue'
import { useMediaRepository } from '~/infrastructure/repositories/mediaRepository'

/**
 * Media tenant berada di balik autentikasi, jadi tidak bisa dipasang langsung
 * sebagai `src`. Composable ini mengunduhnya sebagai blob lalu menyiapkan
 * object URL, termasuk membatalkan hasil request yang sudah usang.
 */
export function usePrivateImage(source: Ref<string | null | undefined>) {
  const objectUrl = ref('')
  const loading = ref(false)
  const failed = ref(false)
  let loadVersion = 0

  function revokeCurrentUrl() {
    if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
    objectUrl.value = ''
  }

  async function load() {
    const version = ++loadVersion
    revokeCurrentUrl()
    failed.value = false
    if (!source.value || !process.client) return

    loading.value = true
    try {
      const blob = await useMediaRepository().fetchTenantMedia(source.value)
      if (version !== loadVersion) return
      objectUrl.value = URL.createObjectURL(blob)
    } catch {
      if (version === loadVersion) failed.value = true
    } finally {
      if (version === loadVersion) loading.value = false
    }
  }

  watch(source, load, { immediate: true })
  onBeforeUnmount(() => {
    loadVersion += 1
    revokeCurrentUrl()
  })

  return { objectUrl, loading, failed }
}

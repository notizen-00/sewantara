import { defineStore } from 'pinia'
import * as storage from '~/infrastructure/storage/localStorage'

const sidebarCollapsedKey = 'sewantara.sidebar_collapsed'

export const usePreferencesStore = defineStore('preferences', () => {
  const sidebarCollapsed = ref(false)

  function hydrateFromStorage() {
    sidebarCollapsed.value = storage.readBoolean(sidebarCollapsedKey)
  }

  function toggleSidebarCollapsed() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    storage.writeBoolean(sidebarCollapsedKey, sidebarCollapsed.value)
  }

  return {
    sidebarCollapsed,
    hydrateFromStorage,
    toggleSidebarCollapsed,
  }
})

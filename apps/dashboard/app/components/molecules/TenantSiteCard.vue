<script setup lang="ts">
import { Check, Copy, ExternalLink, Globe } from '@lucide/vue'
import type { TenantSite } from '~/domain/tenantSite'

const props = defineProps<{
  site: TenantSite | null
}>()

const copied = ref(false)
let copyResetTimer: ReturnType<typeof setTimeout> | null = null

async function copyUrl() {
  if (!props.site) return

  try {
    await navigator.clipboard.writeText(props.site.url)
    copied.value = true
    if (copyResetTimer) clearTimeout(copyResetTimer)
    copyResetTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Clipboard ditolak browser — URL tetap terlihat dan bisa disalin manual.
  }
}

onUnmounted(() => {
  if (copyResetTimer) clearTimeout(copyResetTimer)
})
</script>

<template>
  <section class="rounded-sm border border-neutral-200 bg-neutral-0 shadow-card">
    <div class="flex items-center gap-3 border-b border-neutral-200 px-5 py-4">
      <span class="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-primary-50 text-primary-700">
        <Globe :size="18" />
      </span>
      <div class="min-w-0">
        <h2 class="text-base font-semibold text-neutral-900">Situs tenant</h2>
        <p class="mt-0.5 text-xs text-neutral-500">Halaman publik tempat pelanggan memesan.</p>
      </div>
    </div>

    <div v-if="site" class="px-5 py-4">
      <p class="text-xs font-medium text-neutral-500">Alamat situs</p>
      <p class="mt-1 break-all font-mono text-sm font-semibold text-neutral-900">{{ site.host }}</p>

      <div class="mt-4 flex flex-wrap gap-2">
        <a
          :href="site.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-sm bg-primary-600 px-4 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          <ExternalLink :size="16" />
          Cek situs
        </a>
        <button
          type="button"
          class="inline-flex min-h-10 items-center justify-center gap-2 rounded-sm border border-neutral-200 bg-neutral-0 px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
          @click="copyUrl"
        >
          <component :is="copied ? Check : Copy" :size="16" />
          {{ copied ? 'Tersalin' : 'Salin' }}
        </button>
      </div>
    </div>

    <div v-else class="px-5 py-6 text-center">
      <p class="text-sm font-semibold text-neutral-900">Alamat situs belum tersedia</p>
      <p class="mt-1 text-xs leading-5 text-neutral-500">
        Subdomain workspace ini belum terdata. Hubungi dukungan bila situs seharusnya sudah aktif.
      </p>
    </div>
  </section>
</template>

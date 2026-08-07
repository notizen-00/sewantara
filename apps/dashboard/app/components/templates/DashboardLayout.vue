<script setup lang="ts">
defineProps<{
  backendOnline: boolean | null
  tenantId?: string
  onboardingMode: boolean
  completion: number
  currentStep: string
  steps: Array<{ key: string; label: string; done: boolean; available: boolean }>
  continueLabel?: string
  busy?: boolean
}>()

defineEmits<{
  saveExit: []
  saveDraft: []
  continue: []
  back: []
  selectStep: [step: string]
}>()
</script>

<template>
  <main class="min-h-screen bg-neutral-50 text-neutral-900">
    <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-neutral-0 px-4 shadow-card sm:px-6">
      <MoleculesBrandLockup />
      <div class="flex items-center gap-2 sm:gap-3">
        <MoleculesConnectionStatus class="hidden min-w-56 lg:flex" :online="backendOnline" :tenant-id="tenantId" />
        <AtomsAppButton variant="ghost" type="button" class="hidden sm:inline-flex">Bantuan</AtomsAppButton>
        <AtomsAppButton variant="secondary" type="button" :disabled="busy" @click="$emit('saveExit')">
          {{ onboardingMode ? 'Simpan & keluar' : 'Keluar' }}
        </AtomsAppButton>
      </div>
    </header>

    <div :class="onboardingMode ? 'grid grid-cols-[280px_minmax(0,1fr)] max-lg:grid-cols-1' : 'block'">
      <OrganismsAppSidebar
        v-if="onboardingMode"
        :completion="completion"
        :current-step="currentStep"
        :steps="steps"
        @select-step="$emit('selectStep', $event)"
      />
      <section class="grid content-start gap-6 px-8 py-6 pb-24 max-sm:px-4 max-sm:py-5">
        <div :class="['w-full', onboardingMode ? 'max-w-[880px]' : 'mx-auto max-w-7xl']">
          <slot />
        </div>
      </section>
    </div>

    <footer
      v-if="onboardingMode"
      class="sticky bottom-0 z-20 border-t border-neutral-200 bg-neutral-0/95 px-8 py-4 shadow-card backdrop-blur max-sm:px-3 max-sm:py-2.5"
    >
      <div class="flex items-center justify-between gap-4 max-sm:hidden">
        <div>
          <p class="text-sm font-semibold text-neutral-700">Pengaturan onboarding</p>
          <p class="text-xs text-neutral-500">Perubahan tersimpan pada setiap tahap.</p>
        </div>
        <div class="flex flex-wrap justify-end gap-3">
          <AtomsAppButton variant="ghost" type="button" :disabled="busy" @click="$emit('back')">Kembali</AtomsAppButton>
          <AtomsAppButton variant="secondary" type="button" :disabled="busy" @click="$emit('saveDraft')">Simpan draft</AtomsAppButton>
          <AtomsAppButton type="button" :disabled="busy" @click="$emit('continue')">
            {{ busy ? 'Menyimpan...' : continueLabel || 'Simpan & lanjutkan' }}
          </AtomsAppButton>
        </div>
      </div>

      <div class="hidden grid-cols-3 gap-2 max-sm:grid">
        <AtomsAppButton variant="ghost" type="button" class="min-h-11 px-1 text-xs" :disabled="busy" @click="$emit('back')">Kembali</AtomsAppButton>
        <AtomsAppButton variant="secondary" type="button" class="min-h-11 px-1 text-xs" :disabled="busy" @click="$emit('saveDraft')">Simpan draft</AtomsAppButton>
        <AtomsAppButton type="button" class="min-h-11 px-1 text-xs" :disabled="busy" @click="$emit('continue')">
          {{ busy ? 'Menyimpan...' : 'Lanjut' }}
        </AtomsAppButton>
      </div>
    </footer>
  </main>
</template>

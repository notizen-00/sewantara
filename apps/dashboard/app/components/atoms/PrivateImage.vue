<script setup lang="ts">
import { ImageOff, LoaderCircle } from '@lucide/vue'
import { usePrivateImage } from '~/application/media/usePrivateImage'

const props = withDefaults(
  defineProps<{
    url?: string | null
    alt: string
    imageClass?: string
  }>(),
  {
    url: null,
    imageClass: 'h-full w-full object-cover',
  },
)

const { objectUrl, loading, failed } = usePrivateImage(toRef(props, 'url'))
</script>

<template>
  <div class="relative overflow-hidden bg-neutral-100">
    <img v-if="objectUrl" :src="objectUrl" :alt="alt" :class="imageClass" />
    <span v-else class="absolute inset-0 grid place-items-center text-neutral-400">
      <LoaderCircle v-if="loading" :size="18" class="animate-spin" />
      <ImageOff v-else :size="18" />
    </span>
    <span v-if="failed" class="sr-only">Gambar gagal dimuat</span>
  </div>
</template>

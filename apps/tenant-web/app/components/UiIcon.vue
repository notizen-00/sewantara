<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  name: string
  size?: number | string
  strokeWidth?: number | string
  label?: string
  fill?: 'none' | 'currentColor'
}>(), {
  size: 20,
  strokeWidth: 1.8,
  label: undefined,
  fill: 'none',
})

const icons: Record<string, string[]> = {
  'arrow-right': ['M5 12h14', 'm13 6 6 6-6 6'],
  'arrow-up-right': ['M7 17 17 7', 'M7 7h10v10'],
  'alert-circle': ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 8v5', 'M12 17h.01'],
  bank: ['M3 10h18', 'M5 10v8', 'M9 10v8', 'M15 10v8', 'M19 10v8', 'M3 18h18', 'M2 22h20', 'm12 2 10 5H2l10-5Z'],
  camera: ['M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v10H2V9a2 2 0 0 1 2-2Z', 'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
  calendar: ['M6 3v3', 'M18 3v3', 'M4 8h16', 'M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z'],
  'calendar-x': ['M6 3v3', 'M18 3v3', 'M4 8h16', 'M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z', 'm9 12 6 6', 'm15 12-6 6'],
  check: ['m5 12 4 4L19 6'],
  'check-circle': ['M22 11.1V12a10 10 0 1 1-5.9-9.1', 'm22 4-10 10-3-3'],
  'chevron-down': ['m6 9 6 6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 7v5l3 2'],
  copy: ['M9 9h11v11H9z', 'M4 15H3V4h11v1'],
  'external-link': ['M14 4h6v6', 'm20 4-9 9', 'M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6'],
  grid: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'],
  heart: ['M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z'],
  home: ['m3 11 9-8 9 8', 'M5 10v10h14V10', 'M9 20v-6h6v6'],
  mail: ['M4 5h16v14H4z', 'm4 7 8 6 8-6'],
  'map-pin': ['M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  'message-circle': ['M21 11.5a8.4 8.4 0 0 1-9 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.9-5A8.7 8.7 0 1 1 21 11.5Z'],
  minus: ['M5 12h14'],
  package: ['m3 7 9-4 9 4-9 4-9-4Z', 'M3 7v10l9 4 9-4V7', 'M12 11v10'],
  phone: ['M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z'],
  plus: ['M12 5v14', 'M5 12h14'],
  'qr-code': ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 14h3v3h-3z', 'M18 14h3', 'M21 18v3h-4', 'M14 20h1'],
  receipt: ['M6 3h12v18l-3-2-3 2-3-2-3 2V3Z', 'M9 8h6', 'M9 12h6'],
  refresh: ['M20 6v5h-5', 'M4 18v-5h5', 'M6.1 9A7 7 0 0 1 18 6l2 5', 'M17.9 15A7 7 0 0 1 6 18l-2-5'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm21 21-4.35-4.35'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z', 'm9 12 2 2 4-5'],
  'shield-check': ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z', 'm9 12 2 2 4-5'],
  smartphone: ['M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z', 'M10 18h4'],
  sparkles: ['m12 3 1.2 3.1L16 7.5l-2.8 1.4L12 12l-1.2-3.1L8 7.5l2.8-1.4L12 3Z', 'm18.5 10 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z', 'm5.5 14 1 2.5L9 17.5l-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z'],
  star: ['m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z'],
  truck: ['M3 6h11v11H3z', 'M14 10h4l3 3v4h-7z', 'M7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', 'M18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
  user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M4 21a8 8 0 0 1 16 0'],
  wallet: ['M4 5h14a2 2 0 0 1 2 2v13H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z', 'M2 8h18', 'M15 12h7v5h-7a2.5 2.5 0 0 1 0-5Z', 'M18 14.5h.01'],
  lock: ['M6 10h12v11H6z', 'M8 10V7a4 4 0 0 1 8 0v3'],
  lightbulb: ['M9 18h6', 'M10 22h4', 'M8.2 14.2A6 6 0 1 1 15.8 14c-.9.7-1.4 1.6-1.5 2.5h-4.6c-.1-.8-.6-1.7-1.5-2.3Z'],
  microphone: ['M12 15a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4Z', 'M5 10v1a7 7 0 0 0 14 0v-1', 'M12 18v4', 'M9 22h6'],
  video: ['M3 6h12v12H3z', 'm15 10 4-3v10l-4-3Z'],
  whatsapp: ['M21 11.5a9 9 0 0 1-13.3 7.9L3 21l1.6-4.6A9 9 0 1 1 21 11.5Z', 'M8.5 7.5c.7 3.4 2.6 5.3 6 6'],
  x: ['M5 5l14 14', 'M19 5 5 19'],
}

const aliases: Record<string, string> = {
  'solar:camera-bold-duotone': 'camera',
  'solar:camera-rotate-bold-duotone': 'camera',
  'solar:card-bold-duotone': 'wallet',
  'solar:lightbulb-bolt-bold-duotone': 'lightbulb',
  'solar:microphone-3-bold-duotone': 'microphone',
  'solar:qr-code-bold-duotone': 'qr-code',
  'solar:videocamera-record-bold-duotone': 'video',
  'solar:wallet-money-bold-duotone': 'wallet',
}

const paths = computed(() => icons[aliases[props.name] ?? props.name] ?? icons.grid!)
</script>

<template>
  <svg
    class="ui-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="fill"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label"
    :role="label ? 'img' : undefined"
    focusable="false"
  >
    <title v-if="label">{{ label }}</title>
    <path v-for="path in paths" :key="path" :d="path" />
  </svg>
</template>

<style scoped>
.ui-icon {
  display: inline-block;
  flex: 0 0 auto;
  vertical-align: middle;
}
</style>

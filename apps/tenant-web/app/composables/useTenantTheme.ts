import { computed } from 'vue'
import type { CSSProperties, Ref } from 'vue'
import type { Tenant } from '~~/shared/types'

const DEFAULT_PRIMARY = '#176b5b'
const DEFAULT_SECONDARY = '#ff7a4d'

const FONT_STACKS: Record<string, string> = {
  geist: '"Geist", "Inter", "Segoe UI", sans-serif',
  inter: '"Inter", "Segoe UI", sans-serif',
  system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

function safeHex(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback
  const match = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!match) return fallback

  const hex = match[1]!
  return hex.length === 3
    ? `#${hex.split('').map(character => character + character).join('')}`.toLowerCase()
    : `#${hex.toLowerCase()}`
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ]
}

function toHex(value: number): string {
  return Math.round(Math.max(0, Math.min(255, value))).toString(16).padStart(2, '0')
}

function darken(hex: string, amount: number): string {
  const [red, green, blue] = hexToRgb(hex)
  const factor = 1 - amount
  return `#${toHex(red * factor)}${toHex(green * factor)}${toHex(blue * factor)}`
}

function relativeLuminance(hex: string): number {
  const channels = hexToRgb(hex).map((channel) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })

  return (0.2126 * channels[0]!) + (0.7152 * channels[1]!) + (0.0722 * channels[2]!)
}

function contrast(first: string, second: string): number {
  const firstLuminance = relativeLuminance(first)
  const secondLuminance = relativeLuminance(second)
  const lighter = Math.max(firstLuminance, secondLuminance)
  const darker = Math.min(firstLuminance, secondLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

function accessibleForeground(background: string, requested: string | null | undefined): string {
  const candidate = safeHex(requested, '#ffffff')
  if (contrast(background, candidate) >= 4.5) return candidate
  return contrast(background, '#ffffff') >= contrast(background, '#111111') ? '#ffffff' : '#111111'
}

function safeFontStack(font: string | null | undefined): string {
  const key = font?.trim().toLowerCase()
  return key && FONT_STACKS[key] ? FONT_STACKS[key] : FONT_STACKS.inter!
}

export function useTenantTheme(tenant: Ref<Tenant>) {
  const themeStyle = computed<CSSProperties>(() => {
    const primaryColor = safeHex(tenant.value.theme.primary, DEFAULT_PRIMARY)
    const secondaryColor = safeHex(tenant.value.theme.secondary, DEFAULT_SECONDARY)
    const background = safeHex(tenant.value.theme.background, '#ffffff')
    const foreground = safeHex(tenant.value.theme.foreground, '#17211f')
    const muted = safeHex(tenant.value.theme.muted, '#f3f7f5')
    const accent = safeHex(tenant.value.theme.accent, '#e8f3ef')
    const fontStack = safeFontStack(tenant.value.theme.fontFamily)

    return {
      '--tenant-brand-color': primaryColor,
      '--color-primary': primaryColor,
      '--color-primary-strong': darken(primaryColor, 0.14),
      '--color-primary-foreground': accessibleForeground(primaryColor, tenant.value.theme.primaryForeground),
      '--color-secondary': secondaryColor,
      '--color-secondary-foreground': accessibleForeground(secondaryColor, tenant.value.theme.secondaryForeground),
      '--color-accent': accent,
      '--color-surface': background,
      '--color-ink': foreground,
      '--color-soft': muted,
      '--color-line': `color-mix(in srgb, ${foreground} 14%, ${background})`,
      '--font-heading': fontStack,
      '--font-body': fontStack,
    } as CSSProperties
  })

  return { themeStyle }
}

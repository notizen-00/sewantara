---
name: Professional SaaS Identity
colors:
  surface: '#f4fcf0'
  surface-dim: '#d5dcd1'
  surface-bright: '#f4fcf0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff6ea'
  surface-container: '#e9f0e5'
  surface-container-high: '#e3eadf'
  surface-container-highest: '#dde5d9'
  on-surface: '#171d16'
  on-surface-variant: '#3e4a3d'
  inverse-surface: '#2b322b'
  inverse-on-surface: '#ecf3e7'
  outline: '#6e7b6c'
  outline-variant: '#bdcaba'
  surface-tint: '#006e2d'
  primary: '#006b2c'
  on-primary: '#ffffff'
  primary-container: '#00873a'
  on-primary-container: '#f7fff2'
  inverse-primary: '#62df7d'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed01b'
  on-secondary-container: '#6f5900'
  tertiary: '#a72d51'
  on-tertiary: '#ffffff'
  tertiary-container: '#c74668'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#7ffc97'
  primary-fixed-dim: '#62df7d'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#ffe083'
  secondary-fixed-dim: '#eec200'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffd9de'
  tertiary-fixed-dim: '#ffb2bf'
  on-tertiary-fixed: '#3f0016'
  on-tertiary-fixed-variant: '#8a143c'
  background: '#f4fcf0'
  on-background: '#171d16'
  surface-variant: '#dde5d9'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max: 1280px
---

## Brand & Style

This design system is engineered for high-performance SaaS environments, prioritizing clarity, efficiency, and data density. The aesthetic is rooted in **Corporate Modernism**, utilizing expansive whitespace and a structured layout to reduce cognitive load in complex workflows. 

The target audience consists of professional operators and decision-makers who require a reliable, focused toolset. The emotional response is one of "quiet confidence"—the UI feels precise, stable, and unobtrusive, allowing the user's data to remain the focal point. Elements are characterized by subtle depth, crisp borders, and a disciplined color application that avoids the visual clutter common in consumer marketplaces.

## Colors

The color palette is optimized for professional utility and long-session legibility. 

- **Primary (#16A34A):** Used for primary actions, success states, and brand presence. It signifies growth and stability.
- **Secondary/Accent (#FACC15):** Reserved exclusively for high-priority highlights, warnings, or specific data callouts. It should be used sparingly to maintain professional gravity.
- **Neutral/Background (#F8FAFC):** A cool-toned slate white that provides a clean canvas for information.
- **Text:** High-contrast Dark (#0F172A) is used for headings and primary content; Gray (#64748B) is used for secondary metadata and supporting descriptions.
- **Borders (#E2E8F0):** A subtle, structural gray used to define UI boundaries without creating visual noise.

## Typography

This design system relies exclusively on **Inter** to provide a systematic, utilitarian feel. 

- **Headlines:** Utilize a heavy weight (700-800) and slight negative letter-spacing for a modern, "ink-trap" aesthetic that feels solid and authoritative.
- **Body:** Set primarily in 400 weight for maximum readability. 500 weight is used sparingly for emphasis or interactive text elements.
- **Labels:** Small labels use a 500 weight and slightly increased tracking for clarity at small sizes.
- **Scale:** On mobile devices, large display text should scale down to `headline-lg-mobile` to maintain layout integrity.

## Layout & Spacing

The layout follows a **fluid grid** model with a strictly defined 4px baseline rhythm. 

- **Desktop:** 12-column grid with 24px gutters and 40px outer margins. Content is capped at a 1280px container to ensure comfortable scanning on ultra-wide monitors.
- **Tablet:** 8-column grid with 20px gutters and 24px margins.
- **Mobile:** 4-column grid with 16px gutters and 16px margins. 

Padding should be used generously within containers (24px - 32px) to reinforce the "SaaS efficiency" look, ensuring that data points do not feel crowded.

## Elevation & Depth

To maintain a professional and modern feel, depth is achieved through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Level 0 (Background):** #F8FAFC.
- **Level 1 (Cards/Surface):** White (#FFFFFF) with a 1px border (#E2E8F0).
- **Level 2 (Dropdowns/Modals):** White (#FFFFFF) with a soft, neutral ambient shadow (Offset: 0, 10px; Blur: 15px; Color: rgba(15, 23, 42, 0.05)) and a 1px border.

Shadows should never be pure black; they must be tinted with the text color (#0F172A) at very low opacity to maintain a clean, integrated appearance.

## Shapes

The shape language uses progressive rounding to distinguish between interactive elements and structural containers.

- **Interactive Elements:** Buttons, inputs, and selection controls use a **12px** radius, providing a modern but professional touchpoint.
- **Cards & Modules:** Standard content surfaces use a **20px** radius to soften the layout and define distinct sections.
- **Large Containers:** Hero sections or main content wrappers use a **28px** radius to frame the core experience.
- **Icons:** Use 2px stroke widths with slightly rounded terminals to match the font's geometry.

## Components

- **Buttons:** Primary buttons use a solid #16A34A background with white text. Secondary buttons use a white background with a #E2E8F0 border and #0F172A text. Height should be 40px (Medium) or 48px (Large).
- **Input Fields:** 12px border-radius, 1px #E2E8F0 border. Focus state: 1px #16A34A border with a 3px soft green outer glow.
- **Cards:** White background, 20px radius, 1px #E2E8F0 border. No shadow by default; use Level 2 shadow on hover for interactive cards.
- **Chips/Badges:** Small (24px height), 500 weight text. Use subtle background tints (e.g., 10% opacity of primary green) for a refined SaaS look.
- **Data Tables:** Use #F8FAFC for header backgrounds. Borders should be horizontal-only to emphasize row-scanning.
- **Lists:** Use 16px vertical padding between items with a subtle divider line.
- **Checkboxes/Radios:** 12px rounding for checkboxes (softened square) and full circle for radios. Primary green for checked states.
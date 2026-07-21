---
name: Panora Light
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Anybody
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Bricolage Grotesque
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Bricolage Grotesque
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Bricolage Grotesque
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Bricolage Grotesque
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1440px
---

## Brand & Style

This design system is engineered for professional research and deep work. It facilitates long-form reading, data analysis, and high-density information management without cognitive fatigue. The aesthetic is a refined fusion of **Minimalism** and **Modern Corporate** sensibilities—utilizing ample negative space, precise alignment, and a sophisticated, light-first palette.

The target audience consists of researchers, analysts, and academics who require a tool that feels both technologically advanced and intellectually calming. The UI evokes a sense of clarity and reliability, using subtle depth and exceptional typography to guide the user through complex datasets.

## Colors

The palette is anchored by a soft off-white background to reduce eye strain during prolonged use. 

- **Primary (Deep Slate/Navy):** Used for primary text, iconography, and high-emphasis structural elements to provide a grounded, authoritative feel.
- **Secondary (Research Blue):** The core brand accent. Used for interactive states, primary actions, and progress indicators. It provides a sharp, professional contrast against the neutral base.
- **Neutral/Surface:** A series of low-contrast greys (Slate 50 to 200) are used for container backgrounds and borders. This keeps the interface "flat" and focused, preventing visual clutter from competing with content.
- **Success/Warning/Error:** Utilitarian tones (Emerald, Amber, Rose) are used sparingly and with reduced saturation to maintain the calm atmosphere.

## Typography

This design system utilizes **Anybody** for headlines to provide a distinctive, modern character that feels "designed" yet professional. Its variable-width nature allows for impactful hierarchy in headers.

For body copy, data-heavy views, and UI labels, **Bricolage Grotesque** is employed. This typeface combines technical precision with a unique, contemporary personality, ensuring high legibility while giving the platform a friendly, intellectual edge.

Vertical rhythm is strictly maintained with a 1.5x - 1.6x line-height for body text to ensure optimal readability. UI labels use slightly tighter tracking and medium-to-bold weights of Bricolage Grotesque to differentiate functional elements from prose.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain a readable line length (max-width: 1440px), transitioning to a **Fluid Grid** for mobile devices. 

- **Desktop:** 12-column grid with 20px gutters. Content is often centered with generous 64px side margins to foster focus.
- **Mobile:** 4-column grid with 16px margins.
- **Rhythm:** An 8px linear scale governs all spacing. Vertical margins between sections should lean towards the larger end of the scale (40px+) to emphasize the "clean" and "airy" brand personality.

## Elevation & Depth

To maintain the "calm and focused" objective, the design system avoids heavy shadows. Depth is communicated primarily through **Tonal Layering**:

1.  **Level 0 (Base):** Pure White (#FFFFFF) for the primary canvas.
2.  **Level 1 (Subtle Inset):** Off-white/Slate-50 (#F8FAFC) for sidebars and secondary navigation.
3.  **Level 2 (Containers):** Soft Slate-100 (#F1F5F9) for cards and grouped content.

**Low-contrast outlines** (1px solid #E2E8F0) are used for card boundaries rather than shadows. When a floating element (like a dropdown or modal) is required, use a very soft, highly diffused ambient shadow: `0px 10px 25px -5px rgba(15, 23, 42, 0.05)`.

## Shapes

The shape language is consistently **Rounded**. This softens the professional tone, making the research environment feel more approachable and less rigid.

- **Standard Elements (Buttons, Inputs):** 0.5rem (8px).
- **Large Elements (Cards, Modals):** 1rem (16px).
- **Extra Large (Feature containers):** 1.5rem (24px).

Interactive elements like checkboxes retain the standard 0.5rem rounding, ensuring they feel integrated with the broader UI component language.

## Components

- **Buttons:** Primary buttons use the Secondary Blue (#2563EB) with white text. Secondary buttons use a Slate-100 background with Deep Slate text. No heavy gradients; use flat fills.
- **Input Fields:** Use a 1px border (#E2E8F0). On focus, the border shifts to Research Blue with a subtle 2px outer "glow" (spread) in a semi-transparent blue.
- **Cards:** White background with a 1px Slate-100 border. No shadow by default. The header of the card may use a soft Slate-50 background to create a clear "Title" area.
- **Chips:** Highly rounded (pill-shaped) with a Slate-100 background and Bricolage Grotesque typography (Label-sm).
- **Lists:** Clean rows separated by 1px Slate-50 dividers. Hover states should use a subtle tint (#F8FAFC).
- **Search Bar:** A critical component for research. It should be oversized, using Bricolage Grotesque for the placeholder text and a prominent search icon in the Research Blue.
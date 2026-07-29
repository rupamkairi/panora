# Tamagui
- Use Tamagui v5 shorthands: `items` not `alignItems`, `rounded` not `borderRadius`, `justify` not `justifyContent`, `self` not `alignSelf`, `shrink` not `flexShrink`, `width`/`height` not `w`/`h`/`minW`/`maxW`. Confidence: 0.85
- Do not add custom tokens to Tamagui config — use defaultConfig and define colors as a plain constants object in colors.ts. Confidence: 0.80
- Use `height` and `width` instead of `minHeight` and `minWidth` in styled() definitions — Tamagui v5 types reject minHeight/minWidth. Confidence: 0.80
- Use `styled()` factory with Tamagui base components (View, SizableText, YStack, XStack) for all reusable UI. Confidence: 0.75

# UI
See [ui/taste.md](ui/taste.md)
# Typography
- Use Bricolage Grotesque for all body and UI text; reserve Anybody font for the Panora wordmark and rare brand moments only. Confidence: 0.85

# Design
- App targets both web and mobile (iOS/Android) with platform-conditional routing. Web uses distinct landing/legal pages while mobile lands directly on chat. Confidence: 0.80
- Light-only app — never implement or expose dark mode. Warm light tones are sufficient for low-light settings. Confidence: 0.85
- Use Rosewood & Blush as the sole theme. No theme picker, no alternate palettes visible to the user. Confidence: 0.80

# UI
- Composer/chat input must be completely borderless — no border, outline, or focus ring in any interaction state. Confidence: 0.85
- Dropdown menus (plus menu, three-dot overflow) must close when the user taps/clicks anywhere outside them. Use a transparent full-screen backdrop to capture outside taps. Confidence: 0.80

# Web
- Use platform-conditional routing (VITE_PLATFORM or .web.tsx/.native.tsx files) to differentiate web and mobile experiences, not separate codebases. Confidence: 0.70

# Project
- Use Bun as package manager (`bun run`, `bun add`). Confidence: 0.70
- Use `@take-out/helpers` for `createEmitter` (toast, dialog patterns). Confidence: 0.65
- Run `bun run format && bun run check:all` before tests, builds, and commits as a pre-flight verification step. Confidence: 0.65
- Never use Expo Go for Android development; always use the custom dev client (Panora Dev) installed via `bun android`. Confidence: 0.85

# Impeccable
- When presenting visual direction options from the concept seed, always include QUALITY BAR image URLs (board and hero links) alongside textual descriptions so the user can preview each style visually before choosing. Confidence: 0.70

# Workflow
- Do not run the web dev server — provide the command for the user to run themselves. Confidence: 0.85

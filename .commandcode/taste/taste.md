# Tamagui
- Use Tamagui v5 shorthands: `items` not `alignItems`, `rounded` not `borderRadius`, `justify` not `justifyContent`, `self` not `alignSelf`, `shrink` not `flexShrink`, `width`/`height` not `w`/`h`/`minW`/`maxW`. Confidence: 0.85
- Do not add custom tokens to Tamagui config — use defaultConfig and define colors as a plain constants object in colors.ts. Confidence: 0.80
- Use `height` and `width` instead of `minHeight` and `minWidth` in styled() definitions — Tamagui v5 types reject minHeight/minWidth. Confidence: 0.80
- Use `styled()` factory with Tamagui base components (View, SizableText, YStack, XStack) for all reusable UI. Confidence: 0.75

# UI
- All interactive components must have minimum 44×44px touch targets. Confidence: 0.70
- Use hardcoded hex color values from a shared colors.ts constant, not Tamagui theme tokens. Confidence: 0.70

# Project
- Use Bun as package manager (`bun run`, `bun add`). Confidence: 0.70
- Use `@take-out/helpers` for `createEmitter` (toast, dialog patterns). Confidence: 0.65
- Run `bun run format && bun run check:all` before tests, builds, and commits as a pre-flight verification step. Confidence: 0.65

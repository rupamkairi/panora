# UI
- All interactive components must have minimum 44×44px touch targets. Confidence: 0.70
- Use hardcoded hex color values from a shared colors.ts constant, not Tamagui theme tokens. Confidence: 0.70
- Remove all dividers and border lines from design wrappers and containers — the UI should be clean and seamless without visible separators. Confidence: 0.70
- Use flexbox alignment (justifyContent, alignItems) to position elements instead of relying on margin/padding for layout. Confidence: 0.65
- Bottom sheet overlays must use translucent backgrounds so background content remains partially visible; never use solid opaque overlays. Confidence: 0.70
- Never show avatars in conversation — neither for the user nor the assistant. Messages use text-only attribution. Confidence: 0.75
- Render assistant messages as open Markdown prose without surrounding cards, accent borders, or decorative containers. Confidence: 0.70

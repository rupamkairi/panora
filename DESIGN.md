---
name: Panora
description: A warm, mobile-only AI chat for learning from reports.
defaultTheme: saffron
themes:
  saffron:
    canvas: "#F7EFD9"
    surface: "#FFF8E8"
    tonal-soft: "#F3E6C5"
    tonal-medium: "#EBD8AA"
    tonal-strong: "#DFC58A"
    ink: "#2C1D12"
    ink-muted: "#6C5845"
    outline: "#A58B68"
    outline-subtle: "#D7C5A2"
    accent: "#D99100"
    accent-pressed: "#B97800"
    accent-soft: "#F2C45F"
  apricot:
    canvas: "#FBE9DC"
    surface: "#FFF5ED"
    tonal-soft: "#F5D7C3"
    ink: "#321A2E"
    ink-muted: "#74586D"
    accent: "#8C3F7A"
  rosewood:
    canvas: "#F8E8E4"
    surface: "#FFF4F1"
    tonal-soft: "#F0D2CE"
    ink: "#321B1D"
    ink-muted: "#76575A"
    accent: "#9B3D46"
typography:
  primary: "Bricolage Grotesque"
  brand: "Anybody"
  bodySize: "16px"
  bodyLineHeight: 1.44
shape:
  control: "12px"
  message: "20px"
  composer: "24px"
  pill: "9999px"
---

# Panora Design System

## North Star

**The Warm Reading Conversation**

Panora should feel immediately understandable to someone familiar with Claude,
ChatGPT, Codex, or Manus on a phone. It is an AI chat first. Its distinctive
character comes from warm paper-like surfaces, unusually good reading density,
and the effortless way reports stay visible as conversation context.

The interface is not a report website, dashboard, document editor, or card grid.
Navigation is shallow: chat, conversation history, contextual sheets, and a
single Settings screen.

## Approved Composition

- Chat readability follows the calm, open-prose composition of direction A.
- Conversation grouping and searchable report selection use direction B’s density.
- Composer, attachment rail, voice interaction, and theme controls use direction
  C’s tactile character.
- User messages are compact right-aligned bubbles.
- Assistant responses are unboxed Markdown prose with no avatars.
- The composer is the principal object and remains identical between empty and
  active conversations.

## Color

Panora is light-only. Never read or follow the system dark appearance.

### Saffron & Espresso

Default theme. Warm parchment creates the page, a cream surface lifts controls,
espresso carries text, and saffron identifies active controls. Saffron must not
be used as decorative fill across large regions.

### Apricot & Aubergine

A softer apricot canvas paired with aubergine interaction color. It keeps the
same semantic roles and contrast hierarchy as the default.

### Rosewood & Blush

A grounded blush canvas with rosewood interaction color. It is warm without
becoming sentimental or ornamental.

All feature code uses semantic theme roles:
`background`, `surface`, `surface1–4`, `content`, `contentSecondary`, `accent`,
`accentHover`, `accentContainer`, `outline`, `outlineVariant`, `destructive`,
`success`, and `warning`. Raw colors belong only in theme definitions.

## Typography

Bricolage Grotesque is the primary face for body text, headings, controls,
metadata, Markdown, and settings. Anybody is restricted to the Panora wordmark.

- Screen title: 14–16px, 600, single line.
- Empty-state prompt: 20px, 600, centered.
- Body and Markdown: 16px, 400, 23px line height.
- Assistant subheading: 17–19px, 600.
- Metadata and actions: 12–14px, 500–600.
- Code: system monospace, 13–14px.

Avoid oversized marketing typography. The product should fit useful content into
one phone viewport without feeling compressed.

## Mobile Structure

### Header

52px plus safe area. Sidebar trigger left, conversation title centered, and
three-dot conversation menu right. The main chat never shows a Back button.
Nested screens use native Back behavior and a visible back control.

### Conversation

Use 16px horizontal gutters and 20px between message turns. User bubbles occupy
at most 86% width. Assistant prose occupies the reading column directly.
Citations, links, lists, code, and package-supported Markdown inherit the same
typographic rhythm. Do not build a bespoke data-table component.

### Sidebar

A narrow side sheet, not a full-screen takeover. It contains New chat, Pinned,
Today, Previous 7 Days, Older, and fixed Settings. Row menus provide Pin/Unpin,
Share, and Delete without adding permanent visual noise.

### Composer

The composer floats 12px from the phone edge with a cream surface, one subtle
outline, 24px radius, and a restrained ambient shadow. The text field expands
from one to five visible lines before scrolling.

Its context rail is one horizontally scrolling row. Each pill shows type,
truncated name, state, and a remove action. Long labels may marquee only when
clipped and only when reduced motion is not requested.

The bottom action row contains:

- Plus menu with Upload and Choose reports.
- Small context count.
- Hold-to-speak microphone.
- Send, changing to Stop during streaming.

### Sheets

Upload uses a compact bottom sheet with Files, Photos, and Camera. Choose reports
uses a taller bottom sheet with search, sample-data disclosure, checkbox rows,
selection count, and a single confirmation action. Every sheet has a programmatic
title and description, dismissal behavior, and focus restoration.

## Interaction States

- Hover is web-development support only and never reveals essential actions.
- Press uses opacity or a maximum 0.98 scale response.
- Focus-visible uses a 2px accent ring.
- Disabled controls retain their form at approximately 42% opacity.
- Streaming replaces Send with Stop and keeps partial prose readable.
- Recording uses a warm waveform and “Release to transcribe.”
- Transcribing returns to the compact composer and shows progress.
- Selected files remain `selected`; only real backend events may mark them ready.
- Failed and unavailable context stays visible with removal/recovery affordances.
- Reduced motion removes marquee and spatial transitions.

## Components

Reusable UI lives in `src/interface/components`. Feature screens compose those
components and must not create competing buttons, inputs, sheets, dialogs, or
typography primitives.

Use Tamagui `styled()` variants with `as const`, semantic tokens, consistent
imports, `Adapt`-based overlays, safe-area-aware scroll composition, and native
press/permission behavior. Lists with large histories must be virtualized before
production scale.

## Prohibited Patterns

- Dark mode or automatic system appearance.
- Desktop sidebars, multi-column workspaces, or desktop acceptance criteria.
- Report-library landing pages or `/reports/[id]` workspaces.
- Separate Questions, Quiz, Overview, or Chat tabs.
- Avatars in conversation.
- Assistant response cards or accent-border message blocks.
- Gradients, glassmorphism, decorative charts, giant headings, and card grids.
- Claims that locally selected material was uploaded, processed, or analyzed.

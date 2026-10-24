# Design: Teikio web

The web app follows the mobile app's design system. The source of truth is
`DESIGN.md` and `constants/theme.ts` in fast-serve-app (`development` branch):
paper and ink, one accent (ink `#1C1B19`), the ink-blue wash `#DCE7EE` for
"selected", 6px corners, 1px ink outlines on interactive elements, pastel
status labels with bold text, no resting shadows, Lucide icons and Plus
Jakarta Sans with tabular numbers.

Only the light theme exists on web for now. The tokens live in
`src/index.css` with the same names and values as the landing page
(teikio-landing-page `app/globals.css`), so Papel and Oscuro can be added
later as `:root[data-theme=...]` blocks.

## How the app roles map to shadcn

| shadcn | app role |
|---|---|
| `primary` | ink |
| `secondary` | ink-blue wash (selected), **not** a gray |
| `muted`, `accent` | surface `#F2F2F2` (hover, quiet fills) |
| `card` | surface container low `#F7F7F7` |
| `popover` | surface bright (white) |
| `border`, `input` | hairline `#DCDCDC` |
| `muted-foreground` | muted text `#6B6B6B` |

The app role names are also available: `bg-surface`, `bg-surface-high`,
`bg-surface-container-low`, `bg-surface-bright`, `text-on-surface-variant`,
`text-muted-text`, `text-icon`, `border-divider`, `bg-primary-container`.
Use roles, never hex values or `bg-white`.

## Components

- **Button**: `default` ink, `outline` 1px ink line, `secondary` wash,
  `surface` gray, `ghost` text only, `destructive` red-100 with red-800 text.
- **Badge** is the app's status `Label`: `success`, `warning`, `error`,
  `info`, `neutral`, `default` (ink container), `outline`. Pick the status by
  variant only, never with color classes.
- **Card**: flat `#F7F7F7`, 6px, no shadow. `variant="outline"` for a 1px ink
  line. A selected card gets `border-primary`.
- **Chip**: filter chips (ink line, wash + check when selected).
- **Tabs**: `line` (default) is the app's TabBar underline; `pill` for a
  segmented look.
- **Shadows**: only on floating things. Menus, popovers and selects
  `shadow-sm`; dialogs, sheets and toasts `shadow-lg`.
- **Corners**: `rounded-md` (6px) for content, `rounded-2xl` for dialogs,
  `rounded-full` only for status labels, avatars and dots.

## Where the web differs from the app

- Buttons and inputs keep desktop heights (32 to 40px) instead of the app's
  56px touch sizes.
- Field labels sit above inputs instead of the app's floating labels.
- Hover states exist (gray `muted` fill, or 80% opacity on filled buttons).
- Navigation is a sidebar (active item in the wash) instead of a tab bar,
  and dialogs are used where the app uses bottom sheets.

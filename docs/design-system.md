# ScrubHub MVP Design System

This design system extends the existing Tailwind v4 + shadcn setup with a 3-tier token model and token-driven component styles.

## 1) Color Palette

### Light theme (semantic)

- `primary`: `#0A4FD6`
- `secondary`: `#0F766E`
- `success`: `#15803D`
- `warning`: `#B45309`
- `error`: `#B42318`
- `info`: `#0C4A6E`
- `background`: `#F7F9FC`
- `surface`: `#FFFFFF`
- `surface-elevated`: `#FFFFFF`
- `text`: `#0F172A`
- `text-muted`: `#475569`
- `border`: `#D0D7E2`

### Dark theme (semantic)

- `primary`: `#7AA2FF`
- `secondary`: `#2FA89D`
- `success`: `#34D399`
- `warning`: `#F59E0B`
- `error`: `#F87171`
- `info`: `#38BDF8`
- `background`: `#09090B`
- `surface`: `#111113`
- `surface-elevated`: `#18181B`
- `text`: `#F4F4F5`
- `text-muted`: `#D4D4D8`
- `border`: `#27272A`

### Gradients

- `--gradient-hero`: `linear-gradient(135deg, #0A4FD6 0%, #2D7BFF 50%, #0F766E 100%)`
- `--gradient-cta`: `linear-gradient(135deg, #0A4FD6 0%, #5B84FF 100%)`
- Dark hero override: `linear-gradient(145deg, #09090B 0%, #111113 45%, #27272A 100%)`

## 2) Token Architecture (3-tier)

### Primitives

- Raw colors (`--blue-700`, `--slate-950`, etc.)
- Spacing scale (`--space-1` to `--space-20`)
- Radius scale (`--radius-xs` to `--radius-xl`)
- Elevation (`--shadow-1`, `--shadow-2`, `--shadow-3`)
- Type scale (`--font-size-xs` to `--font-size-3xl`)

### Semantic aliases

- Color intent tokens (`--color-primary`, `--color-bg`, `--color-text`, etc.)
- Foreground contrast pairs (`--on-primary`, `--on-surface`)
- Mode-specific tokens in `:root` and `.dark`

### Component tokens

- `--btn-height`, `--btn-radius`
- `--input-height`, `--input-radius`
- `--card-radius`, `--card-shadow`
- `--modal-radius`, `--modal-shadow`
- `--table-row-hover`

## 3) CSS Custom Properties (drop-in excerpt)

```css
:root {
  --color-primary: #0a4fd6;
  --color-bg: #f7f9fc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-border: #d0d7e2;
  --on-primary: #ffffff;
  --gradient-hero: linear-gradient(135deg, #0a4fd6 0%, #2d7bff 50%, #0f766e 100%);
}

.dark {
  --color-primary: #7aa2ff;
  --color-bg: #09090b;
  --color-surface: #111113;
  --color-text: #f4f4f5;
  --color-border: #27272a;
  --on-primary: #09090b;
}
```

## 4) Tailwind-ready Token Mapping

```json
{
  "theme": {
    "extend": {
      "colors": {
        "primary": "var(--color-primary)",
        "secondary": "var(--color-secondary)",
        "success": "var(--color-success)",
        "warning": "var(--color-warning)",
        "error": "var(--color-error)",
        "info": "var(--color-info)",
        "background": "var(--color-bg)",
        "surface": "var(--color-surface)",
        "foreground": "var(--color-text)",
        "border": "var(--color-border)"
      },
      "borderRadius": {
        "md": "var(--radius-md)",
        "lg": "var(--radius-lg)",
        "xl": "var(--radius-xl)"
      },
      "boxShadow": {
        "sm": "var(--shadow-1)",
        "md": "var(--shadow-2)",
        "lg": "var(--shadow-3)"
      }
    }
  }
}
```

## 5) Component Token References + States

### Button
- Background: `--color-primary`
- Text: `--on-primary`
- Border: transparent (default), `--color-border` (outline)
- States: hover `brightness-95`, active `brightness-90`, disabled `opacity-55`

### Input / Field
- Background: `--color-surface`
- Text: `--color-text`
- Border: `--color-border`, hover tint to `--color-primary`
- States: focus ring `--ring`, disabled lowered opacity

### Card
- Background: `--color-surface`
- Text: `--color-text`
- Border: `--color-border`
- Elevation: `--card-shadow`, hover lift

### Modal
- Background: `--color-surface-elevated`
- Border: `--color-border`
- Elevation: `--modal-shadow`
- States: open/close transitions, overlay for contrast

### Badge / Alert
- Semantic backgrounds from `success/warning/error/info` tokens
- Borders use translucent semantic color
- Text stays readable in light/dark

### Navbar / Sidebar
- Containers use `surface` + `border`
- Active nav uses primary tint and stronger type
- Hover uses `accent` token

### Table / List
- Container: card surface + border
- Header: muted layer
- Hover row: `--table-row-hover`

### Tooltip
- Inverted colors (`foreground` as bg, `background` as text)
- Short delay for improved UX

## 6) Usage Example Targets

- Landing hero: [app/www/page.tsx](../app/www/page.tsx)
- Listing card: [components/listings/ListingCard.tsx](../components/listings/ListingCard.tsx)
- Dashboard surfaces: [app/app/dashboard/landlord/page.tsx](../app/app/dashboard/landlord/page.tsx), [app/app/dashboard/tenant/page.tsx](../app/app/dashboard/tenant/page.tsx), [app/app/dashboard/enterprise/page.tsx](../app/app/dashboard/enterprise/page.tsx)
- Auth pages: [components/auth/AuthPanel.tsx](../components/auth/AuthPanel.tsx), [app/www/login/page.tsx](../app/www/login/page.tsx), [app/www/signup/page.tsx](../app/www/signup/page.tsx)

## 7) Naming + Architecture Standards

- Prefer `primitive` -> `semantic` -> `component` mapping.
- Keep semantic names intent-driven (`primary`, `error`, `surface`) and avoid hard-coded color names in component classes.
- Add variants through `cva` with explicit state classes (`hover`, `active`, `disabled`, `focus-visible`).
- Keep reusable primitives in `components/ui`, and compose feature-specific UI in domain folders.

## 8) Accessibility Notes

- Keep contrast at WCAG AA minimum:
  - Body text >= 4.5:1
  - Large text >= 3:1
  - Interactive/focus indicators visible in both themes
- Do not rely on color only; pair status with labels/icons.
- Use semantic roles (`role="alert"`, dialog semantics) and keyboard-focusable controls.

# Design System — Financial Dashboard

A standard, conventional design system using common industry-naming patterns (Tailwind/Material-style scales) so it's easy to map onto any component library.

---

## 1. Color Tokens

### 1.1 Base palette

| Token | Hex |
|---|---|
| `gray-50` | `#F9FAFB` |
| `gray-100` | `#F3F4F6` |
| `gray-200` | `#E5E7EB` |
| `gray-300` | `#D1D5DB` |
| `gray-400` | `#9CA3AF` |
| `gray-500` | `#6B7280` |
| `gray-600` | `#4B5563` |
| `gray-700` | `#374151` |
| `gray-800` | `#1F2937` |
| `gray-900` | `#111827` |
| `gray-950` | `#030712` |
| `blue-500` | `#3B82F6` (primary) |
| `blue-600` | `#2563EB` |
| `green-500` | `#22C55E` (success / positive) |
| `red-500` | `#EF4444` (danger / negative) |
| `amber-500` | `#F59E0B` (warning) |
| `sky-500` | `#0EA5E9` (info) |

### 1.2 Semantic tokens

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `gray-50` | `gray-950` |
| `--color-surface` | `#FFFFFF` | `gray-900` |
| `--color-surface-alt` | `gray-100` | `gray-800` |
| `--color-border` | `gray-200` | `gray-700` |
| `--color-text-primary` | `gray-900` | `gray-50` |
| `--color-text-secondary` | `gray-500` | `gray-400` |
| `--color-text-disabled` | `gray-300` | `gray-600` |
| `--color-primary` | `blue-500` | `blue-500` |
| `--color-primary-hover` | `blue-600` | `blue-600` |
| `--color-success` | `green-500` | `green-500` |
| `--color-danger` | `red-500` | `red-500` |
| `--color-warning` | `amber-500` | `amber-500` |
| `--color-info` | `sky-500` | `sky-500` |
| `--color-focus-ring` | `blue-500` @ 50% | `blue-500` @ 60% |

---

## 2. Typography

| Role | Font stack |
|---|---|
| Primary (UI/body) | `"Inter", system-ui, -apple-system, sans-serif` |
| Monospace (numeric/data) | `"Roboto Mono", ui-monospace, monospace` |

### 2.1 Type scale

| Token | Size | Line height | Weight | Usage |
|---|---|---|---|---|
| `--text-xs` | 12px | 16px | 400 | Captions, helper text |
| `--text-sm` | 14px | 20px | 400 | Body small, table cells |
| `--text-base` | 16px | 24px | 400 | Default body |
| `--text-lg` | 18px | 28px | 500 | Card titles |
| `--text-xl` | 20px | 28px | 600 | Section headers |
| `--text-2xl` | 24px | 32px | 600 | Page titles |
| `--text-3xl` | 30px | 36px | 700 | Dashboard headline metrics |

---

## 3. Spacing

4px base unit.

| Token | Value |
|---|---|
| `--space-0` | 0px |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |

---

## 4. Border Radius

| Token | Value |
|---|---|
| `--radius-none` | 0px |
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |
| `--radius-full` | 9999px |

---

## 5. Shadows

| Token | Light | Dark |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | `0 1px 2px rgba(0,0,0,0.4)` |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.08)` | `0 4px 6px rgba(0,0,0,0.5)` |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | `0 10px 15px rgba(0,0,0,0.6)` |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.12)` | `0 20px 25px rgba(0,0,0,0.7)` |

---

## 6. Animation

| Token | Value |
|---|---|
| `--ease-standard` | `ease-in-out` |
| `--duration-fast` | 150ms |
| `--duration-base` | 250ms |
| `--duration-slow` | 350ms |

Guideline: subtle transitions only (fade, slide-in, color change); respect `prefers-reduced-motion`.

---

## 7. Components

| Component | Variants | States |
|---|---|---|
| **Button** | primary, secondary, outline, ghost, danger · sm/md/lg | default, hover, active, focus, disabled, loading |
| **Card** | default, bordered, elevated | default, hover |
| **Input** | text, number, currency, search, textarea | default, focus, error, disabled |
| **Select** | single, multi | default, open, focus, disabled |
| **Modal** | default, confirmation | entering, open, exiting |
| **Table** | default, compact, striped | row hover, selected, sortable header, loading |
| **Navbar** | fixed top | default, scrolled |
| **Sidebar** | expanded, collapsed | item default, active, hover |
| **Toast** | success, error, warning, info | entering, visible, exiting |
| **Empty State** | no-data, no-results, first-use | — |
| **Loading State** | skeleton, spinner | — |
| **Error State** | inline, full-page | — |

---

## 8. Layout & Breakpoints

| Token | Value |
|---|---|
| `--bp-sm` | 640px |
| `--bp-md` | 768px |
| `--bp-lg` | 1024px |
| `--bp-xl` | 1280px |
| `--bp-2xl` | 1536px |

- **Desktop:** sidebar (240px) + navbar (64px) + 12-column content grid, `--space-6` gutters.
- **Mobile (<768px):** sidebar → bottom nav or drawer; single-column stacked layout; tables scroll horizontally.

---

## 9. Theming

Light/dark controlled via a `data-theme` attribute; all components consume semantic tokens only, never raw palette values.

---

## 10. Restrictions

- No inline styles — use tokens and shared classes only.
- No hardcoded business data in components — data via props; sample data in fixtures only.
- No duplicated UI components — one implementation per component, variants via props.

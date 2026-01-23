# Token Reference

## Semantic Color Tokens

All colors use OKLCH format: `L% C H` where:
- **L** (Lightness): 0-100%
- **C** (Chroma): 0-0.4 (saturation)
- **H** (Hue): 0-360 degrees

### Surface Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--clarity-background` | `100% 0 0` | `20% 0.02 250` | Page background |
| `--clarity-foreground` | `20% 0.02 250` | `95% 0.01 250` | Default text |
| `--clarity-card` | `100% 0 0` | `20% 0.02 250` | Card backgrounds |
| `--clarity-card-foreground` | `20% 0.02 250` | `95% 0.01 250` | Card text |
| `--clarity-popover` | `100% 0 0` | `20% 0.02 250` | Dropdown/popover bg |
| `--clarity-popover-foreground` | `20% 0.02 250` | `95% 0.01 250` | Popover text |

### Brand Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--clarity-primary` | `60% 0.2 265` | `70% 0.2 265` | Primary actions, links |
| `--clarity-primary-foreground` | `100% 0 0` | `100% 0 0` | Text on primary |
| `--clarity-secondary` | `96% 0.01 265` | `25% 0.03 265` | Secondary surfaces |
| `--clarity-secondary-foreground` | `20% 0.02 250` | `95% 0.01 250` | Text on secondary |
| `--clarity-accent` | `96% 0.02 265` | `25% 0.03 265` | Accent highlights |
| `--clarity-accent-foreground` | `20% 0.02 250` | `95% 0.01 250` | Text on accent |

### Muted Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--clarity-muted` | `96% 0.01 265` | `25% 0.03 265` | Muted backgrounds |
| `--clarity-muted-foreground` | `55% 0.02 265` | `65% 0.02 265` | Muted/secondary text |

### State Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--clarity-destructive` | `55% 0.22 25` | `45% 0.2 25` | Errors, delete actions |
| `--clarity-destructive-foreground` | `100% 0 0` | `95% 0.01 250` | Text on destructive |
| `--clarity-success` | `55% 0.18 145` | `55% 0.18 145` | Success states |
| `--clarity-success-foreground` | `100% 0 0` | `100% 0 0` | Text on success |
| `--clarity-warning` | `75% 0.18 70` | `75% 0.18 70` | Warning states |
| `--clarity-warning-foreground` | `25% 0.08 70` | `25% 0.08 70` | Text on warning |

### UI Chrome

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--clarity-border` | `90% 0.01 265` | `25% 0.03 265` | Borders |
| `--clarity-input` | `90% 0.01 265` | `25% 0.03 265` | Input borders |
| `--clarity-ring` | `60% 0.2 265` | `70% 0.2 265` | Focus rings |

---

## Layout Tokens

| Token | Default | Description |
|-------|---------|-------------|
| `--clarity-radius` | `0.5rem` | Base border radius |
| `--clarity-radius-sm` | `calc(var(--clarity-radius) - 4px)` | Small radius |
| `--clarity-radius-md` | `calc(var(--clarity-radius) - 2px)` | Medium radius |
| `--clarity-radius-lg` | `var(--clarity-radius)` | Large radius (= base) |
| `--clarity-radius-xl` | `calc(var(--clarity-radius) + 4px)` | Extra large |
| `--clarity-radius-full` | `9999px` | Fully rounded |

---

## Typography Tokens

| Token | Default | Description |
|-------|---------|-------------|
| `--clarity-font-sans` | `system-ui, -apple-system, sans-serif` | Sans-serif stack |
| `--clarity-font-mono` | `'SF Mono', Consolas, monospace` | Monospace stack |

---

## Glass Tokens

| Token | Light | Dark | Safe Range |
|-------|-------|------|------------|
| `--clarity-glass-opacity` | `0.7` | `0.7` | 0.5 - 0.95 |
| `--clarity-glass-blur` | `12px` | `16px` | 4px - 24px |
| `--clarity-glass-saturate` | `150%` | `150%` | 100% - 200% |
| `--clarity-glass-border-opacity` | `0.2` | `0.2` | 0.05 - 0.4 |

---

## Animation Tokens

| Token | Value | Description |
|-------|-------|-------------|
| `--clarity-duration-instant` | `100ms` | Micro-interactions |
| `--clarity-duration-fast` | `150ms` | Quick transitions |
| `--clarity-duration-normal` | `200ms` | Standard duration |
| `--clarity-duration-slow` | `300ms` | Deliberate transitions |
| `--clarity-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Accelerate |
| `--clarity-ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Decelerate |
| `--clarity-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth |

---

## Shadow Tokens

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--clarity-shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | `0 1px 2px rgba(0,0,0,0.3)` |
| `--clarity-shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | `0 4px 6px -1px rgba(0,0,0,0.4)` |
| `--clarity-shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | `0 10px 15px -3px rgba(0,0,0,0.5)` |

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--clarity-z-base` | `0` | Default |
| `--clarity-z-dropdown` | `1000` | Dropdowns |
| `--clarity-z-sticky` | `1100` | Sticky elements |
| `--clarity-z-modal-backdrop` | `1300` | Modal overlay |
| `--clarity-z-modal` | `1400` | Modal content |
| `--clarity-z-popover` | `1500` | Popovers |
| `--clarity-z-tooltip` | `1600` | Tooltips |
| `--clarity-z-toast` | `1700` | Toast notifications |

---

## Backward Compatibility Mapping

These legacy tokens map to the new clarity tokens:

```css
:root {
  --background: var(--clarity-background);
  --foreground: var(--clarity-foreground);
  --card: var(--clarity-card);
  --card-foreground: var(--clarity-card-foreground);
  --primary: var(--clarity-primary);
  --primary-foreground: var(--clarity-primary-foreground);
  --secondary: var(--clarity-secondary);
  --secondary-foreground: var(--clarity-secondary-foreground);
  --muted: var(--clarity-muted);
  --muted-foreground: var(--clarity-muted-foreground);
  --accent: var(--clarity-accent);
  --accent-foreground: var(--clarity-accent-foreground);
  --destructive: var(--clarity-destructive);
  --destructive-foreground: var(--clarity-destructive-foreground);
  --border: var(--clarity-border);
  --input: var(--clarity-input);
  --ring: var(--clarity-ring);
  --radius: var(--clarity-radius);
}
```

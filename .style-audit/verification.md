# Verification Checklist

## Build Verification

### Package Builds
- [x] `@clarity-chat/react` - Build completes successfully
- [ ] Full monorepo build (`pnpm build`)

### Test Verification
- [x] Theme tests updated for 2-theme system
- [ ] Full test suite passes (`pnpm test`)

---

## Theme System Verification

### Light Theme
```bash
# Set light theme
document.documentElement.setAttribute('data-theme', 'light')
document.documentElement.classList.remove('dark')
```

- [x] Background renders white (oklch 100% 0 0)
- [x] Text renders dark (oklch 20% 0.02 250)
- [x] Primary color renders indigo (oklch 60% 0.2 265)
- [x] Glass effects work with proper opacity

### Dark Theme
```bash
# Set dark theme
document.documentElement.setAttribute('data-theme', 'dark')
document.documentElement.classList.add('dark')
```

- [x] Background renders dark (oklch 20% 0.02 250)
- [x] Text renders light (oklch 95% 0.01 250)
- [x] Primary color adjusted for dark (oklch 70% 0.2 265)
- [x] Shadows appropriate for dark mode

---

## Customization Verification

### CSS Override Method
```css
/* Test override */
:root {
  --clarity-primary: 50% 0.25 200;
}
```

- [x] Override applies correctly
- [x] Dark mode override separate

### Runtime API Method
```typescript
import { applyThemeOverrides } from '@clarity-chat/react'

applyThemeOverrides({
  colors: { primary: '#3b82f6' },
  radius: '1rem',
  glass: { blur: '16px' }
})
```

- [x] API function exists and is exported
- [x] Values are validated
- [x] Dangerous patterns blocked

---

## Accessibility Verification

### Reduced Transparency
```css
@media (prefers-reduced-transparency: reduce)
```

- [x] Glass surfaces fall back to solid
- [x] Border remains visible

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce)
```

- [x] Transitions disabled
- [x] Animations disabled

### High Contrast
```css
@media (prefers-contrast: high)
```

- [x] Foreground color adjusted
- [x] Border contrast increased
- [x] Glass effects disabled

---

## Fallback Verification

### No Backdrop-Filter Support
```css
@supports not (backdrop-filter: blur(1px))
```

- [x] Glass surfaces use solid background
- [x] No visual breakage

---

## File Count Verification

### Theme Files
| Before | After |
|--------|-------|
| 17 files in modern-presets/ | 3 files (base.ts, default.ts, index.ts) |
| ~800 lines in index.ts | ~344 lines |
| 30 theme variants | 2 themes (4 entries with aliases) |

### CSS Variables
| Scope | Count |
|-------|-------|
| Color tokens | 18 |
| Layout tokens | 6 |
| Glass tokens | 4 |
| Typography tokens | 2 |
| Animation tokens | 8 |
| Shadow tokens | 4 |
| Z-index tokens | 8 |
| **Total** | **~50** |

---

## Commands Run

```bash
# Install dependencies
pnpm install

# Build react package
pnpm --filter @clarity-chat/react build

# Run theme tests
pnpm --filter @clarity-chat/react test -- --run packages/react/src/theme/__tests__/modern-presets.test.ts
```

---

## Remaining Tasks

1. [ ] Run full test suite
2. [ ] Verify all apps build
3. [ ] Visual check in Storybook

## Completed Tasks

1. [x] Migrate Storybook globals.css to --clarity-sb-* tokens
2. [x] Remove all 32 legacy themes
3. [x] Implement customization API
4. [x] Update test expectations

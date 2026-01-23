# Deprecated Themes

## Removed Theme Files

The following theme files have been deleted from `packages/react/src/theme/modern-presets/`:

| File | Themes Removed |
|------|----------------|
| `amber.ts` | amber, amber-dark |
| `aurora.ts` | aurora, aurora-dark |
| `emerald.ts` | emerald, emerald-dark |
| `forest.ts` | forest, forest-dark |
| `glassmorphism.ts` | glassmorphism, glassmorphism-dark |
| `high-contrast.ts` | high-contrast, high-contrast-dark |
| `midnight.ts` | midnight, midnight-dark |
| `neumorphism.ts` | neumorphism, neumorphism-dark |
| `neutral.ts` | neutral, neutral-dark |
| `ocean.ts` | ocean, ocean-dark |
| `rose.ts` | rose, rose-dark |
| `slate.ts` | slate, slate-dark |
| `sunset.ts` | sunset, sunset-dark |
| `vibrant.ts` | vibrant, vibrant-dark |

**Total Files Deleted:** 14
**Total Theme Variants Removed:** 28

## Removed from theme.css

| Selector | Description |
|----------|-------------|
| `[data-theme='zen']` | Zen theme (calm green-teal) |
| `[data-theme='zen'].dark` | Zen dark variant |
| `[data-theme='vivid']` | Vivid theme (bold pink-magenta) |
| `[data-theme='vivid'].dark` | Vivid dark variant |
| `[data-contrast='reduced']` | Reduced contrast accessibility mode (moved to @media query) |

**Total CSS Themes Removed:** 4

## Backward Compatibility Exports

For backward compatibility, the following exports still exist but are deprecated:

```typescript
// All resolve to defaultLightTheme
neutralLightTheme
vibrantLightTheme
highContrastLightTheme
oceanLightTheme
sunsetLightTheme
forestLightTheme
roseLightTheme
midnightLightTheme
slateLightTheme
emeraldLightTheme
amberLightTheme
glassmorphismLightTheme
auroraLightTheme
neumorphismLightTheme

// All resolve to defaultDarkTheme
neutralDarkTheme
vibrantDarkTheme
highContrastDarkTheme
oceanDarkTheme
sunsetDarkTheme
forestDarkTheme
roseDarkTheme
midnightDarkTheme
slateDarkTheme
emeraldDarkTheme
amberDarkTheme
glassmorphismDarkTheme
auroraDarkTheme
neumorphismDarkTheme
```

These will be removed in v4.0.

## Migration Guide

### If Using Preset Themes

**Before:**
```typescript
import { oceanDarkTheme } from '@clarity-chat/react'
<ThemeProvider defaultTheme={{ preset: 'ocean-dark' }}>
```

**After:**
```typescript
import { applyThemeOverrides } from '@clarity-chat/react'

// Use dark theme and customize colors
<ThemeProvider defaultTheme="dark">

// Apply ocean-like colors
applyThemeOverrides({
  colors: {
    primary: '#0ea5e9', // Sky blue
    accent: '#ecfeff',
  }
}, { persist: true });
```

### If Using CSS Theme Selectors

**Before:**
```css
[data-theme='zen'] {
  /* zen styles */
}
```

**After:**
```css
/* Use the customization API or CSS overrides */
:root {
  --clarity-primary: 160 84% 39%; /* Teal for zen-like feel */
}
```

## Summary

| Category | Count |
|----------|-------|
| Theme files deleted | 14 |
| Theme variants removed | 28 |
| CSS themes removed | 4 |
| **Total themes removed** | **32** |
| Themes remaining | 2 (light, dark) |

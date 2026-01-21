# Design Token Audit

**Generated:** 2026-01-19
**Scope:** apps/docs/components/ and apps/docs/styles/

## Executive Summary

The Clarity Chat docs site has a well-defined design token system in `globals.css` and `tailwind.config.js`. However, there are significant inconsistencies in token usage across components, with many hardcoded values that should reference design tokens.

**Token System Health Score: 65/100**

- **Strengths:** Comprehensive token definitions, CSS custom properties for theming, Tailwind utilities for common patterns
- **Weaknesses:** Inconsistent color usage, hardcoded gradients in canvas/animation code, mixed use of gray-* vs text-text-* semantic tokens

---

## Defined Tokens

### Color Tokens (globals.css :root)

| Token | Light Value | Dark Value | Category |
|-------|-------------|------------|----------|
| `--color-bg-primary` | #fafafa | #050506 | Background |
| `--color-bg-secondary` | #f5f5f5 | #0a0a0c | Background |
| `--color-bg-tertiary` | #eeeeee | #0f0f12 | Background |
| `--color-bg-elevated` | #ffffff | #141418 | Background |
| `--color-text-primary` | #0a0a0b | #f8f8fa | Typography |
| `--color-text-secondary` | #525252 | #9898a3 | Typography |
| `--color-text-tertiary` | #737373 | #636370 | Typography |
| `--color-text-muted` | #a3a3a3 | #424250 | Typography |
| `--color-border` | #e5e5e5 | #1e1e24 | Borders |
| `--color-border-subtle` | #f0f0f0 | #141418 | Borders |
| `--color-brand` | #6366f1 | #818cf8 | Brand |
| `--color-brand-hover` | #4f46e5 | #a5b4fc | Brand |
| `--color-brand-light` | #818cf8 | #a5b4fc | Brand |
| `--color-brand-subtle` | rgba(99,102,241,0.08) | rgba(129,140,248,0.12) | Brand |
| `--color-accent-primary` | #f472b6 | #f9a8d4 | Accent |
| `--color-accent-secondary` | #fb7185 | #fda4af | Accent |

### Gradient Tokens (globals.css)

| Token | Value | Usage Count |
|-------|-------|-------------|
| `--gradient-brand` | linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #f472b6 100%) | 0 (in components) |
| `--gradient-brand-subtle` | linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(244,114,182,0.06) 100%) | 0 |
| `--gradient-cta` | linear-gradient(135deg, #4f46e5 0%, #7c3aed 35%, #c026d3 70%, #f472b6 100%) | 0 |
| `--gradient-glow` | radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 60%) | 0 |

### Motion Tokens (globals.css)

| Token | Value | Usage Count |
|-------|-------|-------------|
| `--duration-instant` | 100ms | 0 |
| `--duration-fast` | 150ms | 0 |
| `--duration-normal` | 250ms | 0 |
| `--duration-slow` | 400ms | 0 |
| `--ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | 0 |
| `--ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | 0 |

### Spacing/Radius Tokens (globals.css)

| Token | Value | Usage Count |
|-------|-------|-------------|
| `--radius-sm` | 6px | 0 |
| `--radius-md` | 10px | 0 |
| `--radius-lg` | 16px | 0 |
| `--radius-xl` | 24px | 0 |

### Tailwind Token Usage Summary

| Token Pattern | Usage Count | Files |
|---------------|-------------|-------|
| `text-text-*` / `bg-bg-*` / `border-border` | 410 | 54 |
| `text-brand-*` / `bg-brand-*` | 82 | 37 |
| `text-gray-*` | 148 | 30 |
| `bg-gray-*` | 97 | 24 |
| `text-blue-*` / `bg-blue-*` | 200+ | 40+ |
| `text-green-*` / `bg-green-*` | 150+ | 35+ |
| `text-purple-*` / `bg-purple-*` | 70+ | 25+ |

---

## Hardcoded Values (Violations)

### Critical: Hardcoded Colors in Canvas/Animation Code

| File | Line(s) | Value | Should Be |
|------|---------|-------|-----------|
| `/apps/docs/components/hero/GeometricMesh.tsx` | 126-128 | `rgba(129, 140, 248, ${opacity})` | CSS variable reference |
| `/apps/docs/components/hero/GeometricMesh.tsx` | 144-146 | `rgba(129, 140, 248, 0.3)` | `--color-brand` with alpha |
| `/apps/docs/components/hero/GeometricMesh.tsx` | 155-157 | `rgba(255, 255, 255, 0.9)` | CSS variable |
| `/apps/docs/components/hero/FloatingAccents.tsx` | 78-80 | `rgba(129, 140, 248, 0.3)` | `--color-brand` with alpha |
| `/apps/docs/components/hero/FloatingAccents.tsx` | 112-113 | `#818cf8`, `#f472b6` | `--color-brand`, `--color-accent-primary` |
| `/apps/docs/components/hero/FloatingAccents.tsx` | 143 | `rgba(129, 140, 248, 0.5)` | `--color-brand` with alpha |
| `/apps/docs/components/hero/FloatingAccents.tsx` | 169 | `rgba(129, 140, 248, 0.15)` | `--color-brand-subtle` variant |

### High: Hardcoded Colors in TSX Inline Styles

| File | Line | Value | Should Be |
|------|------|-------|-----------|
| `/apps/docs/components/Layout/HeroSection.tsx` | 368-370 | `rgba(59, 130, 246, 0.08)` | `--color-brand-subtle` (blue-500 used instead of brand indigo) |
| `/apps/docs/components/Layout/HeroSection.tsx` | 390 | `#8080800a` | CSS variable for grid lines |
| `/apps/docs/components/HeroChat/components/HeroChatEmptyState.tsx` | 34-36 | `rgba(99, 102, 241, 0.3)` | `--color-brand` with alpha |
| `/apps/docs/components/Layout/LiveChatDemo.tsx` | 279 | `rgba(255,255,255,0.1)` | `--glass-bg` or similar |

### Medium: Hardcoded Font Sizes

| File | Line | Value | Should Be |
|------|------|-------|-----------|
| `/apps/docs/components/Playground/CodeEditor.tsx` | 31 | `fontSize: 14` | Tailwind `text-sm` or CSS variable |

### Low: Hardcoded Shadows in TSX

| File | Line | Value | Should Be |
|------|------|-------|-----------|
| `/apps/docs/components/hero/FloatingAccents.tsx` | 80 | `boxShadow: '0 0 20px rgba(129, 140, 248, 0.1)...'` | `--shadow-*` or Tailwind shadow utility |

---

## Inconsistencies Found

### Color System Inconsistencies

| Element | Location 1 | Location 2 | Difference |
|---------|------------|------------|------------|
| Text secondary color | `text-text-secondary` (54 files) | `text-gray-600` (30+ files) | Semantic vs palette token |
| Background secondary | `bg-bg-secondary` (54 files) | `bg-gray-100/bg-gray-800` (24+ files) | Semantic vs palette token |
| Brand accent | `text-brand-500` (37 files) | `text-indigo-500` (15+ files) | Different token names for same intent |
| Semantic color: info | `text-blue-*` (40+ files) | No token defined | Missing semantic token |
| Semantic color: success | `text-green-*` (35+ files) | No token defined | Missing semantic token |
| Semantic color: warning | `text-amber-*` (20+ files) | `text-yellow-*` (10+ files) | Inconsistent color choice |
| Semantic color: error | `text-red-*` (30+ files) | No token defined | Missing semantic token |

### Gradient Inconsistencies

| Element | Usage 1 | Usage 2 | Difference |
|---------|---------|---------|------------|
| Hero background gradient | `rgba(59, 130, 246, 0.08)` (blue-500) | `rgba(139, 92, 246, 0.08)` (violet-500) | Using blue instead of brand indigo |
| Brand gradient in canvas | `#818cf8 -> #f472b6` hardcoded | `--gradient-brand` defined | Token exists but not used |
| Glow effects | Multiple inline `rgba(99, 102, 241, *)` | `--color-brand-subtle` exists | Token exists but not used |

### Animation/Motion Inconsistencies

| Element | Usage 1 | Usage 2 | Difference |
|---------|---------|---------|------------|
| Transition duration | `duration-200` (Tailwind) | `0.2s` (inline) | Mixed approach |
| Easing function | `ease-out` (Tailwind) | `cubic-bezier(0.16, 1, 0.3, 1)` (inline) | CSS var `--ease-out` defined but not used |
| Animation timing | `@/lib/animations` durations | Hardcoded numbers | Using lib inconsistently |

---

## Recommendations

### Priority 1: Create Semantic Color Tokens

Add these to globals.css and tailwind.config.js:

```css
:root {
  /* Semantic Colors */
  --color-info: #3b82f6;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

### Priority 2: Migrate Canvas Code to Use CSS Variables

For canvas/animation components (GeometricMesh, FloatingAccents, HeroParticles):
- Pass colors as props that read from CSS variables via `getComputedStyle`
- Or define colors in a shared constants file that mirrors the CSS variables

### Priority 3: Replace Hardcoded Tailwind Colors

Replace palette colors with semantic tokens:
- `text-gray-600` -> `text-text-secondary`
- `bg-gray-100` -> `bg-bg-secondary`
- `text-indigo-500` -> `text-brand-500`
- `text-blue-600` -> `text-info` (after creating token)
- `text-green-600` -> `text-success` (after creating token)

### Priority 4: Use Gradient Tokens

Replace inline gradients with CSS variable references:
```tsx
// Instead of
background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 100%)'

// Use
background: 'var(--gradient-brand)'
```

### Priority 5: Use Motion Tokens

Update animation code to use defined motion tokens:
```tsx
// Instead of
transition={{ duration: 0.4 }}

// Use
transition={{ duration: 'var(--duration-slow)' }}
// Or import from lib/animations which should use these tokens
```

---

## Files Requiring Attention

### High Priority (Hardcoded brand colors)
1. `/apps/docs/components/hero/GeometricMesh.tsx`
2. `/apps/docs/components/hero/FloatingAccents.tsx`
3. `/apps/docs/components/Layout/HeroSection.tsx`
4. `/apps/docs/components/hero/HeroParticles.tsx`

### Medium Priority (Inconsistent gray/semantic usage)
1. `/apps/docs/components/Layout/ComponentShowcase.tsx` (53 semantic + 5 gray)
2. `/apps/docs/components/Playground/CodePlayground.tsx` (9 semantic + 12 gray)
3. `/apps/docs/components/Demo/AccessibilityPanel.tsx` (mixed usage)
4. `/apps/docs/components/AI/KeyboardShortcutsHelp.tsx` (2 semantic + 8 gray)

### Low Priority (Semantic color expansion needed)
1. Components using `text-blue-*` for informational states
2. Components using `text-green-*` for success states
3. Components using `text-red-*` for error states
4. Components using `text-amber-*`/`text-yellow-*` for warning states

---

## Token Coverage Analysis

| Category | Defined | Used | Coverage |
|----------|---------|------|----------|
| Background colors | 4 tokens | Used in 54 files | Good |
| Text colors | 4 tokens | Used in 54 files | Good |
| Border colors | 2 tokens | Used in 54 files | Good |
| Brand colors | 5 tokens | Used in 37 files | Good |
| Accent colors | 4 tokens | Rarely used | Poor |
| Gradient tokens | 5 tokens | Not used in components | Poor |
| Motion tokens | 6 tokens | Not used | Poor |
| Radius tokens | 4 tokens | Not used | Poor |
| Semantic colors (info/success/warning/error) | Not defined | N/A | Missing |

---

## Conclusion

The design token system has a solid foundation but suffers from incomplete adoption. The main issues are:

1. **Gradient tokens exist but aren't used** - Components hardcode gradient values
2. **Motion tokens exist but aren't used** - Animation timing is inconsistent
3. **Semantic color tokens are missing** - Components use raw palette colors for states
4. **Canvas code cannot easily use CSS variables** - Needs architectural solution
5. **Mixed usage of semantic vs palette tokens** - `text-gray-*` used alongside `text-text-*`

Addressing these issues will improve maintainability, theme consistency, and make future design changes significantly easier.

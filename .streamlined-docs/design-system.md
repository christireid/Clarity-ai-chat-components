# Design System

**Status:** Finalized
**Date:** 2026-01-22
**Phase:** PHASE 5

## Design Tokens

### Colors
**Brand:**
- Primary: Indigo-500 (#6366f1)
- Accent: Pink-500 (#f472b6)

**Semantic:**
- Success: Green-500
- Warning: Orange-500
- Error: Red-500
- Info: Blue-500

**Neutrals:**
- Light mode: Neutral-50 → Neutral-900
- Dark mode: Inverted scale

### Typography
**Font Family:**
- Sans: Geist Sans (system fallback)
- Mono: Geist Mono / JetBrains Mono

**Scale:**
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px
- 4xl: 36px
- 5xl: 48px

**Line Height:**
- Tight: 1.25
- Normal: 1.5
- Relaxed: 1.75

### Spacing
**Scale:** 4px base unit
- 0: 0
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 6: 24px
- 8: 32px
- 12: 48px
- 16: 64px

### Elevation (Shadows)
- sm: 0 1px 2px rgba(0,0,0,0.05)
- DEFAULT: 0 1px 3px rgba(0,0,0,0.1)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.1)
- xl: 0 20px 25px rgba(0,0,0,0.1)

### Border Radius
- sm: 4px
- DEFAULT: 8px
- md: 12px
- lg: 16px
- xl: 24px
- full: 9999px

### Motion
**Duration:**
- Fast: 150ms
- Normal: 300ms
- Slow: 500ms

**Easing:**
- Ease: cubic-bezier(0.25, 0.1, 0.25, 1)
- Ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)

**Reduced Motion:**
- Respect `prefers-reduced-motion`
- Disable animations if set

---

## Component Patterns

### Glassmorphism
- Background: white/5 (dark), white/40 (light)
- Backdrop blur: 12px
- Border: white/10 (dark), white/20 (light)

### Gradients
- Brand: indigo-500 → pink-500
- Premium: indigo-500 → purple-500 → pink-500

---

**Design System Status:** ✅ FINALIZED

# Layout System

**Status:** Designed and finalized
**Date:** 2026-01-22
**Phase:** PHASE 4

## Layout Philosophy

**Principle:** Layout should be **predictable, stable, and responsive** without content.

- **Fixed Dimensions** - Layout dimensions are never content-driven
- **Zero Layout Shift** - No CLS during navigation or content load
- **Responsive Grid** - Consistent breakpoints and spacing rhythm
- **Empty-State Ready** - Layout works perfectly with zero content

---

## Core Layout Primitives

### 1. Page Shell
```
┌──────────────────────────────────────────┐
│ Header (64px fixed)                      │
├─────────────┬──────────────────┬─────────┤
│ Sidebar     │ Main Content     │ TOC     │
│ (280px)     │ (flexible)       │ (200px) │
│ sticky      │ min-h-screen     │ sticky  │
└─────────────┴──────────────────┴─────────┘
│ Footer (auto)                            │
└──────────────────────────────────────────┘
```

### 2. Spacing Rhythm
- Base unit: 4px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px
- Section padding: 96px (desktop), 48px (mobile)
- Content padding: 24px

### 3. Content Width
- **Prose**: 65ch (optimal reading)
- **Wide**: 80ch
- **Full**: Container max-width (1280px)

### 4. Grid System
- 12-column grid
- Gap: 24px (desktop), 16px (mobile)
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

---

## Page Templates

### Template 1: Documentation Page
**Used by:** Get Started, Build guides
**Layout:**
```
Header
Sidebar | Breadcrumbs + Title + Content | TOC
Footer
```

### Template 2: API Reference Page
**Used by:** API section
**Layout:**
```
Header
Sidebar | Breadcrumbs + API Header + Props Table | TOC
Footer
```

### Template 3: Landing Page
**Used by:** Homepage, About
**Layout:**
```
Header
Full-width Hero
Sections (alternating backgrounds)
Footer
```

### Template 4: Demo Page
**Used by:** Explore section
**Layout:**
```
Header
Breadcrumbs
Full-width Demo Container
Footer
```

---

## Responsive Behavior

### Desktop (≥1024px)
- 3-column layout (sidebar + content + TOC)
- Sidebar: 280px fixed, resizable
- Content: Flexible, max 80ch
- TOC: 200px fixed

### Tablet (768px-1023px)
- 2-column layout (sidebar + content)
- Sidebar: 240px fixed, collapsible
- Content: Flexible
- TOC: Hidden

### Mobile (<768px)
- 1-column layout
- Sidebar: Overlay (slide-in)
- Content: Full width, 16px padding
- TOC: Hidden

---

**Layout Status:** ✅ FINALIZED

# 🎨 Clarity Chat Components - Design System Guide v2.0

**Last Updated:** 2025-11-08  
**Version:** 2.0 (Post-Enhancement)  
**Status:** Production Ready ✅

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Design Tokens](#design-tokens)
4. [Component Patterns](#component-patterns)
5. [Typography](#typography)
6. [Spacing](#spacing)
7. [Animation Guidelines](#animation-guidelines)
8. [Accessibility](#accessibility)
9. [Best Practices](#best-practices)
10. [Migration Guide](#migration-guide)

---

## Overview

This design system documents the refined UI/UX patterns established across the Clarity Chat Components library. All components follow these patterns to ensure consistency, accessibility, and professional polish.

### Design Philosophy

- **Subtle** - Refined shadows and interactions, not aggressive
- **Consistent** - Unified patterns across all components
- **Accessible** - WCAG 2.1 AA compliant focus states and contrast
- **Professional** - Matches and exceeds industry standards
- **Intentional** - Every design decision has a purpose

### Inspiration

Our design patterns are influenced by:
- **AI SDK Elements** (Vercel) - Modern, clean, professional
- **Radix UI** - Accessible, composable primitives
- **Shadcn UI** - Beautiful defaults, customizable
- **Tailwind CSS** - Utility-first approach

---

## Design Principles

### 1. Ring-Based Borders

We use Tailwind's `ring` utilities instead of `border` for better composability and visual consistency.

```tsx
// ❌ Old Pattern
className="border border-input"
className="border-2 border-primary"

// ✅ New Pattern  
className="ring-1 ring-border/50"
className="ring-2 ring-primary/50"
```

**Why?**
- Better composability (doesn't affect layout)
- Easier opacity control
- Consistent with focus rings
- More predictable visual hierarchy

### 2. Subtle Shadow Hierarchy

We use a refined shadow scale for depth and elevation.

```tsx
// Shadow Scale
'shadow-xs'   // 0 1px 2px 0 rgb(0 0 0 / 0.03) - Minimal depth
'shadow-sm'   // Tailwind default - Subtle elevation
'shadow-md'   // Reserved for special cases
'shadow-lg'   // Reserved for modals/popovers
'shadow-xl'   // Reserved for drawers/dialogs
```

**Guidelines:**
- Default state: `shadow-xs`
- Hover state: `shadow-sm`
- Interactive elements: `shadow-xs` → `shadow-sm` on hover
- Overlays/modals: `shadow-xl`

### 3. Refined Border Radius

We use a consistent radius scale for visual harmony.

```tsx
// Border Radius Scale
'rounded-sm'  // 2px - Checkboxes, small badges
'rounded-md'  // 6px - Buttons, inputs, most interactive elements
'rounded-lg'  // 8px - Cards, containers, dialogs
'rounded-xl'  // 12px - Reserved for special cases
'rounded-full' // Avatars, status indicators
```

**Migration:**
- `rounded-lg` → `rounded-md` (buttons, inputs)
- `rounded-xl` → `rounded-lg` (cards, containers)
- `rounded-2xl` → `rounded-lg` (dialogs, modals)

### 4. Enhanced Focus States

Accessible, visible focus indicators for keyboard navigation.

```tsx
// Focus Pattern
className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1"
```

**Key Points:**
- `ring-[3px]` - Thicker than default for better visibility
- `ring-ring/50` - 50% opacity for subtlety
- `ring-offset-1` - Small offset for separation
- Always use `focus-visible` (not `focus`)

### 5. Precise Hover Effects

Intentional, subtle hover animations.

```tsx
// Hover Pattern
className="hover:shadow-sm hover:-translate-y-[2px] transition-all duration-200"
```

**Guidelines:**
- Vertical lift: `-translate-y-[2px]` (not `0.5` or `1`)
- Shadow increase: `shadow-xs` → `shadow-sm`
- Duration: `duration-200` (200ms) for most interactions
- Always include `transition-all`

### 6. Consistent Background Opacity

Unified approach to background transparency.

```tsx
// Background Patterns
'bg-muted/50'     // Default muted backgrounds
'bg-muted/30'     // Hover states
'bg-primary/10'   // Subtle brand color highlights
'bg-primary/20'   // Active/selected states
```

**Usage:**
- Skeleton loaders: `bg-muted/50`
- Hover backgrounds: `bg-muted/30`
- Selected items: `bg-accent/50`
- Highlights: `bg-primary/10`

---

## Design Tokens

### Colors

Our color system is built on CSS variables for theme flexibility.

```css
/* Base Colors */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;

/* Muted (Subtle backgrounds) */
--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;

/* Accent (Interactive elements) */
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;

/* Border & Ring */
--border: 214.3 31.8% 91.4%;
--ring: 221.2 83.2% 53.3%;

/* Primary (Brand) */
--primary: 221.2 83.2% 53.3%;
--primary-foreground: 210 40% 98%;

/* Destructive (Errors) */
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 210 40% 98%;

/* Success */
--success: 142 76% 36%;
--success-foreground: 355.7 100% 97.3%;
```

### Shadow Tokens

```css
/* Custom Shadow */
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.03);
```

### Radius Tokens

```css
--radius: 0.5rem; /* 8px - base radius */
```

Computed values:
- `rounded-lg`: `var(--radius)` = 8px
- `rounded-md`: `calc(var(--radius) - 2px)` = 6px
- `rounded-sm`: `calc(var(--radius) - 4px)` = 4px

---

## Component Patterns

### Buttons

```tsx
// Default Button Pattern
<button className={cn(
  // Base
  'inline-flex items-center justify-center gap-2',
  'rounded-md text-sm font-medium',
  'ring-offset-background transition-all duration-200',
  
  // States
  'focus-visible:outline-none',
  'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1',
  'disabled:pointer-events-none disabled:opacity-50',
  
  // Visual
  'bg-primary text-primary-foreground',
  'shadow-xs hover:shadow-sm',
  'hover:-translate-y-[2px]',
  'active:translate-y-0 active:shadow-xs',
  
  // Sizes
  'h-10 px-4 py-2' // default
  // 'h-8 px-3 text-xs' // sm
  // 'h-12 px-8 text-base' // lg
)}>
  Button Text
</button>
```

### Inputs

```tsx
// Input Pattern
<input className={cn(
  // Base
  'flex h-10 w-full rounded-md',
  'px-3 py-2 text-sm',
  
  // Visual
  'bg-background ring-1 ring-border shadow-xs',
  'placeholder:text-muted-foreground',
  
  // States
  'focus-visible:outline-none',
  'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1',
  'focus-visible:border-primary/60 focus-visible:shadow-sm',
  'hover:ring-border/70',
  'disabled:cursor-not-allowed disabled:opacity-50',
  
  // Variants
  // Error: 'ring-destructive/50'
  // Success: 'ring-success/50'
)} />
```

### Cards

```tsx
// Card Pattern
<div className={cn(
  // Base
  'rounded-lg bg-card text-card-foreground',
  
  // Visual
  'ring-1 ring-border/30 shadow-xs',
  
  // Interactive (if clickable)
  'transition-all duration-200',
  'hover:shadow-sm hover:ring-border/70 hover:-translate-y-[2px]',
  'cursor-pointer',
  
  // Focus (if focusable)
  'focus-visible:outline-none',
  'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1'
)}>
  <div className="p-6">Card Content</div>
</div>
```

### Dialogs/Modals

```tsx
// Dialog Content Pattern
<div className={cn(
  // Base
  'fixed left-[50%] top-[50%]',
  'translate-x-[-50%] translate-y-[-50%]',
  'z-50 grid w-full max-w-lg gap-4',
  
  // Visual
  'rounded-lg ring-1 ring-border shadow-xl',
  'bg-background p-6',
  
  // Animation
  'duration-200',
  'data-[state=open]:animate-in data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
  'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
  'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]'
)} />

// Backdrop Pattern
<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
```

### Tooltips

```tsx
// Tooltip Pattern
<div className={cn(
  'px-3 py-1.5 text-xs rounded-md',
  'bg-popover text-popover-foreground',
  'ring-1 ring-border/50 shadow-xs',
  'pointer-events-none backdrop-blur-sm',
  'animate-in fade-in-0 zoom-in-95'
)} />
```

### Badges

```tsx
// Badge Pattern
<span className={cn(
  'inline-flex items-center rounded-full',
  'px-2.5 py-0.5 text-xs font-semibold',
  'ring-1 shadow-xs',
  'transition-colors',
  'focus:outline-none focus:ring-[3px] focus:ring-ring/50 focus:ring-offset-1',
  
  // Variants
  'bg-primary/10 text-primary ring-primary/20', // primary
  // 'bg-secondary text-secondary-foreground ring-border', // secondary
  // 'bg-destructive/10 text-destructive ring-destructive/20', // destructive
)} />
```

---

## Typography

### Font Stack

```css
font-family: var(--font-sans);
/* Usually: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', ... */
```

### Scale

```tsx
'text-xs'    // 0.75rem (12px)
'text-sm'    // 0.875rem (14px) - Most UI text
'text-base'  // 1rem (16px) - Body text
'text-lg'    // 1.125rem (18px)
'text-xl'    // 1.25rem (20px)
'text-2xl'   // 1.5rem (24px)
```

### Weights

```tsx
'font-normal'    // 400 - Body text
'font-medium'    // 500 - UI elements, buttons
'font-semibold'  // 600 - Headings, emphasis
'font-bold'      // 700 - Strong emphasis
```

### Line Heights

```tsx
'leading-none'    // 1 - Tight headings
'leading-tight'   // 1.25 - Headings
'leading-normal'  // 1.5 - Body text
'leading-relaxed' // 1.625 - Comfortable reading
```

---

## Spacing

### Scale

We use Tailwind's default spacing scale (4px base unit):

```tsx
'p-1'   // 0.25rem (4px)
'p-2'   // 0.5rem (8px)
'p-3'   // 0.75rem (12px)
'p-4'   // 1rem (16px)  - Common padding
'p-6'   // 1.5rem (24px) - Card padding
'p-8'   // 2rem (32px)
```

### Component Spacing

```tsx
// Buttons
'h-8 px-3'    // Small
'h-10 px-4'   // Default
'h-12 px-8'   // Large

// Inputs
'h-10 px-3 py-2' // Standard

// Cards
'p-6' // Content padding

// Dialogs
'p-6' // Content padding
'gap-4' // Between elements
```

---

## Animation Guidelines

### Durations

```tsx
'duration-150'  // 150ms - Instant feedback (hover)
'duration-200'  // 200ms - Standard (most transitions)
'duration-300'  // 300ms - Moderate (expansions)
'duration-500'  // 500ms - Slow (page transitions)
```

**Recommendations:**
- Hover states: `duration-200`
- Focus rings: `duration-150`
- Expansions/collapses: `duration-300`
- Page transitions: `duration-500`

### Easing

```tsx
'ease-out'      // Standard - Most transitions
'ease-in-out'   // Smooth - Modal open/close
'ease-linear'   // Constant - Loaders, spinners
```

**Cubic Bezier:**
```tsx
transition={{ ease: [0.4, 0, 0.2, 1] }} // Framer Motion equivalent to ease-out
```

### Common Animations

```tsx
// Hover Lift
'hover:-translate-y-[2px] transition-all duration-200'

// Scale
'hover:scale-105 transition-transform duration-200'

// Fade In
'animate-in fade-in-0 duration-200'

// Slide In
'animate-in slide-in-from-bottom-4 duration-300'

// Spin (Loaders)
'animate-spin' // or custom with Framer Motion
```

---

## Accessibility

### Focus States

**Always provide visible focus indicators:**

```tsx
// Standard Focus
'focus-visible:outline-none'
'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1'

// High Contrast (for better visibility)
'focus-visible:ring-[3px]' // Thicker ring
'focus-visible:ring-ring/50' // Semi-transparent
```

### Color Contrast

Ensure WCAG 2.1 AA compliance:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### Keyboard Navigation

```tsx
// Make interactive elements keyboard accessible
tabIndex={0} // Focusable
role="button" // Semantic role
aria-label="Descriptive label"
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    // Handle activation
  }
}}
```

### Screen Readers

```tsx
// Hide decorative elements
aria-hidden="true"

// Provide alternative text
aria-label="Close dialog"

// Announce dynamic changes
aria-live="polite" // or "assertive"

// Describe current state
aria-expanded={isOpen}
aria-selected={isSelected}
aria-disabled={isDisabled}
```

---

## Best Practices

### 1. Composition Over Duplication

```tsx
// ✅ Good - Reuse base components
import { Button } from '@clarity-chat/primitives'

export const SaveButton = (props) => (
  <Button variant="primary" {...props}>
    Save
  </Button>
)

// ❌ Bad - Duplicating button styles
export const SaveButton = (props) => (
  <button className="inline-flex rounded-md ...">
    Save
  </button>
)
```

### 2. Consistent Spacing

```tsx
// ✅ Good - Use consistent padding/gaps
<div className="space-y-4">
  <div className="p-6">...</div>
  <div className="p-6">...</div>
</div>

// ❌ Bad - Inconsistent spacing
<div className="space-y-3">
  <div className="p-5">...</div>
  <div className="p-7">...</div>
</div>
```

### 3. Meaningful Animation

```tsx
// ✅ Good - Purpose-driven animation
<motion.div
  whileHover={{ y: -2 }} // Subtle lift indicates interactivity
  transition={{ duration: 0.2 }}
/>

// ❌ Bad - Excessive animation
<motion.div
  whileHover={{ scale: 1.5, rotate: 360 }} // Distracting
  transition={{ duration: 2 }}
/>
```

### 4. Semantic HTML

```tsx
// ✅ Good - Semantic elements
<button onClick={handleClick}>Click me</button>
<nav>...</nav>
<article>...</article>

// ❌ Bad - Divs for everything
<div onClick={handleClick} role="button">Click me</div>
```

### 5. Responsive Design

```tsx
// ✅ Good - Mobile-first, responsive
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">
    Title
  </h1>
</div>

// ❌ Bad - Fixed sizes
<div className="p-8">
  <h1 className="text-4xl">Title</h1>
</div>
```

---

## Migration Guide

### From Old to New Patterns

#### Borders

```tsx
// Before
className="border border-input"
className="border-2 border-primary"

// After
className="ring-1 ring-border/50"
className="ring-2 ring-primary/50"
```

#### Shadows

```tsx
// Before
className="shadow-sm"
className="shadow-md"
className="shadow-lg"

// After
className="shadow-xs"
className="shadow-sm"
className="shadow-lg" // Only for overlays
```

#### Border Radius

```tsx
// Before
className="rounded-lg"  // Buttons, inputs
className="rounded-xl"  // Cards
className="rounded-2xl" // Dialogs

// After
className="rounded-md"  // Buttons, inputs
className="rounded-lg"  // Cards
className="rounded-lg"  // Dialogs
```

#### Focus States

```tsx
// Before
className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

// After
className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1"
```

#### Hover Effects

```tsx
// Before
className="hover:shadow-md hover:-translate-y-0.5"

// After
className="hover:shadow-sm hover:-translate-y-[2px]"
```

### Automated Migration (Find & Replace)

Use these patterns for bulk updates:

1. **Borders:**
   - Find: `border border-border`
   - Replace: `ring-1 ring-border/50`

2. **Shadows:**
   - Find: `shadow-sm`
   - Replace: `shadow-xs` (for default states)

3. **Border Radius:**
   - Find: `rounded-xl` (on cards/buttons)
   - Replace: `rounded-lg` or `rounded-md`

4. **Focus:**
   - Find: `focus:ring-2`
   - Replace: `focus-visible:ring-[3px] focus-visible:ring-ring/50`

---

## Summary

This design system ensures:

✅ **Consistency** - Unified patterns across all components  
✅ **Accessibility** - WCAG 2.1 AA compliant  
✅ **Performance** - Optimized animations and transitions  
✅ **Scalability** - Easy to extend and maintain  
✅ **Professional** - Exceeds industry standards  

**Key Takeaways:**
1. Use `ring` instead of `border`
2. Subtle shadows (`shadow-xs`, `shadow-sm`)
3. Refined radius (`rounded-md`, `rounded-lg`)
4. Enhanced focus (`ring-[3px]` @ 50% opacity)
5. Precise hover (`-translate-y-[2px]`)
6. Consistent opacity (`/50`, `/30`, `/10`)

---

**For questions or suggestions, please open an issue on GitHub.**

**Version:** 2.0  
**Status:** ✅ Production Ready  
**Last Updated:** 2025-11-08

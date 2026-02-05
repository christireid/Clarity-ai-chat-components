# Glassmorphism Design System Implementation

## Overview
Applying minimal, shadcn & Ant Design X inspired glassmorphism design across ALL library components and showcase pages.

## Design Tokens

### Glass Effects
```css
.glass              → bg-white/60 dark:bg-white/5 backdrop-blur-xl
.glass-subtle       → bg-white/40 dark:bg-white/[0.02] backdrop-blur-lg
.glass-strong       → bg-white/80 dark:bg-white/10 backdrop-blur-2xl
.glass-card         → glass + rounded-2xl + shadow-lg
.glass-panel        → glass-subtle + rounded-xl
```

### Gradients
```css
.gradient-accent    → from-primary via-primary/80 to-violet-500
.gradient-text      → text gradient for headings
.gradient-subtle    → from-primary/5 via-transparent to-primary/5
```

### Glows
```css
.glow-sm  → 0 0 15px primary/0.2
.glow     → 0 0 20px, 40px, 60px with decreasing opacity
.glow-lg  → 0 0 30px, 60px, 90px with decreasing opacity
```

### Cards
```css
.feature-card  → glass-card + card-hover + gradient hover effect
.stat-card     → glass-card + decorative gradient corner
.card-hover    → -translate-y-1 + shadow-xl on hover
```

### Icons
```css
.icon-container    → w-12 h-12 rounded-xl gradient background
.icon-container-sm → w-10 h-10 rounded-lg gradient background
```

### Badges
```css
.badge-glass → px-3 py-1 rounded-full glass effect
.badge-glow  → badge-glass + primary shadow
```

### Animations
```css
.animate-float     → 6s float up/down
.pulse-ring        → 2s pulsing ring
.shine             → 3s sweeping shine effect
.card-hover        → smooth lift and shadow
```

### Background Elements
```css
.orb-primary  → w-72 h-72 primary/30 blur-60 float
.orb-violet   → w-96 h-96 violet-500/20 blur-60 float
.orb-cyan     → w-64 h-64 cyan-500/20 blur-60 float
.dot-pattern  → subtle dot grid overlay
```

## Component Patterns

### Standard Component Structure
```tsx
<div className="glass-card">
  <div className="flex items-start justify-between mb-3">
    <div className="icon-container-sm text-[color]">
      <Icon className="h-5 w-5" />
    </div>
    <span className="badge-glass text-xs">Badge</span>
  </div>
  <h3 className="font-semibold mb-1">Title</h3>
  <p className="text-sm text-muted-foreground">Description</p>
</div>
```

### Interactive Component
```tsx
<div className="feature-card cursor-pointer group">
  {/* Gradient hover overlay */}
  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-[color]/20 to-[color]/20" />

  <div className="relative">
    {/* Content */}
  </div>
</div>
```

### CTA Buttons
```tsx
// Primary
<button className="px-6 py-3 rounded-xl gradient-accent text-white font-medium shadow-lg glow-sm hover:opacity-90 transition-opacity">
  Action
</button>

// Secondary
<button className="px-6 py-3 rounded-xl glass font-medium hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
  Action
</button>
```

## Implementation Phases

### Phase 1: Library Components (packages/react/src/components/)
Priority order:
1. **chat/** - Core chat components (highest visibility)
2. **input/** - Input components (high interaction)
3. **navigation/** - Command palette, navigation
4. **feedback/** - Toasts, status indicators
5. **data-display/** - Token counters, stats
6. **layout/** - Panels, containers
7. All other component categories

### Phase 2: Showcase Pages (apps/component-showcase/app/)
All category pages:
- /core-chat
- /messages
- /ai-reasoning
- /tools
- /input ✅ (already has some patterns)
- /search
- /token-management
- /dashboards
- /code-data
- /media-files
- /navigation
- /feedback-status
- /suggestions
- /theme
- /loading-states
- /citations
- /primitives
- /clones

### Phase 3: Shared Components
- Header/navigation
- Footer
- Sidebar (if applicable)
- Modal dialogs
- Dropdown menus

## Consistency Checklist

For each component:
- [ ] Uses glass effect variants appropriately
- [ ] Has proper icon container styling
- [ ] Uses gradient-accent for primary actions
- [ ] Has card-hover interaction where applicable
- [ ] Uses badge-glass for counts/labels
- [ ] Has proper spacing (consistent with design system)
- [ ] Uses muted-foreground for secondary text
- [ ] Has smooth transitions (duration-300 or similar)
- [ ] Includes proper hover states
- [ ] Has accessible focus states
- [ ] Uses gradient overlays for interactive cards
- [ ] Follows the component pattern structure

## Color Palette

### Primary Actions
- gradient-accent (primary → violet)
- glow-sm shadow

### Secondary Actions
- glass background
- hover:bg-white/80 dark:hover:bg-white/10

### Icons
- Category-specific colors (blue, green, purple, etc.)
- Placed in icon-container-sm with gradient

### Text Hierarchy
- Headings: text-foreground, font-semibold/bold
- Body: text-foreground
- Muted: text-muted-foreground
- Accent: gradient-text

### Backgrounds
- Cards: glass-card
- Panels: glass-panel
- Page: relative with orb effects

## Spacing System
- Component padding: p-6 (cards), p-4 (panels)
- Icon containers: gap-2 or gap-3
- Grid gaps: gap-4 or gap-6
- Sections: mb-12 or pb-16
- Tight spacing: gap-1 or gap-2

## Border Radius
- Cards: rounded-2xl
- Panels: rounded-xl
- Buttons: rounded-xl
- Badges: rounded-full
- Icons: rounded-xl (large), rounded-lg (small)

## Typography
- Headings: font-bold or font-semibold
- Body: font-normal or font-medium
- Small text: text-sm
- Extra small: text-xs

## Shadow System
- Cards: shadow-lg shadow-black/5 dark:shadow-black/20
- Glows: Custom primary-colored shadows
- Hover: shadow-xl shadow-primary/10

## Implementation Notes

1. **Preserve Functionality**: Only update visual styles, don't break existing functionality
2. **Accessibility**: Maintain all ARIA attributes, focus states, keyboard navigation
3. **Dark Mode**: All styles use CSS variables and support dark mode
4. **Responsiveness**: Keep all responsive breakpoints (md:, lg:, xl:)
5. **Animations**: Use reduced-motion: query for accessibility
6. **Performance**: Backdrop-blur can be performance-intensive, use appropriately

## Files to Update

### Core Globals
- `apps/component-showcase/app/globals.css` ✅ (already has system)
- Need to verify all library components import styles

### Library Components Pattern
Each component should:
1. Import `cn` from @clarity-chat/primitives
2. Use glass effects for containers
3. Use icon-container for icons
4. Use badge-glass for counts
5. Use gradient-accent for primary CTAs
6. Use card-hover for interactive items

### Example Migration

**Before:**
```tsx
<div className="p-4 border rounded bg-white">
  <div className="flex items-center gap-2">
    <Icon className="h-4 w-4" />
    <span>Title</span>
  </div>
</div>
```

**After:**
```tsx
<div className="glass-card">
  <div className="flex items-center gap-2">
    <div className="icon-container-sm text-primary">
      <Icon className="h-5 w-5" />
    </div>
    <span className="font-semibold">Title</span>
  </div>
</div>
```

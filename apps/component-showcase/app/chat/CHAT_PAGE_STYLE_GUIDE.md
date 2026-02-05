# Chat Page Glassmorphism Style Guide

## Overview
This document defines the consistent glassmorphism styling standards for ALL components in `/chat` page.

## Design Principles

### 1. Glass Card Hierarchy
- **`.glass-card`**: Main containers, hero sections, primary content areas
  - Use for: Chat windows, main demo containers
  - Properties: `bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg`

- **`.glass-subtle`**: Secondary panels, nested content
  - Use for: Message bubbles, nested panels, hover states
  - Properties: `bg-white/40 dark:bg-white/[0.02] backdrop-blur-lg border border-white/10`

- **`.glass-panel`**: Tertiary elements, lightweight sections
  - Use for: Headers, footers, toolbars, input areas
  - Properties: `bg-white/40 dark:bg-white/[0.02] backdrop-blur-lg`

- **`.glass-strong`**: Emphasized glass sections (use sparingly)
  - Use for: Modals, popovers requiring more prominence
  - Properties: `bg-white/80 dark:bg-white/10 backdrop-blur-2xl border border-white/30`

### 2. Interactive Elements

#### Buttons
- **Primary CTAs**: `gradient-accent glow-sm`
  - Example: Send button, Run code, Approve actions
  - Gradient: `bg-gradient-to-r from-primary via-primary/80 to-violet-500`

- **Secondary Actions**: `glass-panel hover:glow-sm`
  - Example: Copy, Export, Archive buttons
  - Adds subtle glow on hover

- **Icon Buttons**: `hover:glow-sm`
  - Example: Settings, attachment, mic buttons

#### Input Fields
- Use: `glass-subtle` class
- Consistent backdrop blur and borders
- Example: Chat input, search fields

### 3. Status Indicators & Badges

#### Badge Styles
- **`.badge-glass`**: Standard status badges
  - Properties: `px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/20`
  - Use for: Online status, Ready state, count badges

- **`.badge-glow`**: Emphasized badges
  - Properties: `badge-glass shadow-sm shadow-primary/20`
  - Use for: Active states, notifications

#### Status Colors
- Success: `badge-glass text-green-600` with green glow
- Warning: `badge-glass text-yellow-600`
- Error: `badge-glass text-red-600`
- Info: `badge-glass text-blue-600`

### 4. Glow Effects

- **`.glow-sm`**: Subtle interactive glow
  - Use for: Buttons, icons, interactive elements
  - Box-shadow: `0 0 15px hsl(var(--primary) / 0.2)`

- **`.glow`**: Standard glow (medium)
  - Use for: Featured elements, primary CTAs
  - Box-shadow: `0 0 20px hsl(var(--primary) / 0.15) + layers`

- **`.glow-lg`**: Strong glow
  - Use for: Hero elements, major features
  - Box-shadow: `0 0 30px hsl(var(--primary) / 0.2) + layers`

### 5. Icon Containers

- **`.icon-container`**: Standard icon wrapper (12x12, h-12 w-12)
  - Use for: Main feature icons
  - Properties: `w-12 h-12 rounded-xl gradient-to-br from-primary/20 to-primary/5`

- **`.icon-container-sm`**: Small icon wrapper (10x10, h-10 w-10)
  - Use for: Tool icons, small features
  - Properties: `w-10 h-10 rounded-lg gradient-to-br from-primary/20 to-primary/5`

### 6. Gradients

#### Background Gradients
- **`.gradient-mesh`**: Complex gradient background
  - Use for: Hero sections, page backgrounds
  - Multiple radial gradients with primary, violet, cyan colors

- **`.gradient-subtle`**: Minimal gradient
  - Use for: Subtle backgrounds
  - `bg-gradient-to-br from-primary/5 via-transparent to-primary/5`

#### Accent Gradients
- **`.gradient-accent`**: Primary accent gradient
  - Use for: CTAs, important buttons, active states
  - `bg-gradient-to-r from-primary via-primary/80 to-violet-500`

- **`.gradient-text`**: Gradient text effect
  - Use for: Headings, emphasized text
  - `bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500`

### 7. Background Patterns

- **`.dot-pattern`**: Subtle dot grid
  - Use for: Section backgrounds, empty states
  - Radial gradient dots, 20px spacing

- **`.grid-pattern`**: Grid lines
  - Use for: Technical sections, code areas
  - Linear gradient grid, 40px spacing

### 8. Floating Orbs

```tsx
{/* Background Effects */}
<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
  <div className="orb-primary -top-40 -right-40 opacity-30" />
  <div className="orb-violet top-1/2 -left-40 opacity-20" />
  <div className="orb-cyan bottom-20 right-20 opacity-15" />
</div>
```

- **`.orb-primary`**: Primary color orb (72x72, w-72 h-72)
- **`.orb-violet`**: Violet orb (96x96, w-96 h-96)
- **`.orb-cyan`**: Cyan orb (64x64, w-64 h-64)
- Always use with blur(60px) and low opacity (0.15-0.3)

### 9. Animation Classes

- **`.card-hover`**: Hover lift effect
  - Use for: Interactive cards
  - `-translate-y-1 shadow-xl shadow-primary/10` on hover

- **`.animate-float`**: Floating animation
  - Use for: Hero elements, decorative items
  - 6s ease-in-out infinite

- **`.shine`**: Shine sweep effect
  - Use for: Premium features, call-to-action cards

### 10. Dark Mode Considerations

All glass styles MUST have dark mode variants:

```css
/* Light mode */
bg-white/60 border-white/20

/* Dark mode */
dark:bg-white/5 dark:border-white/10
```

Key dark mode rules:
- Reduce opacity by ~50-80%
- Lower border opacity
- Maintain backdrop-blur consistency
- Test all glow effects in dark mode

## Component-Specific Guidelines

### Chat Messages
- User messages: `gradient-accent text-white glow-sm`
- Assistant messages: `glass-subtle`
- System messages: `glass-panel border-blue-500/20`

### Headers & Toolbars
- Use: `glass-subtle` or `glass-panel`
- Border: `border-b border-white/10`
- Icons in headers: Use `icon-container-sm` or `gradient-accent glow-sm` for standout

### Sidebars & Panels
- Container: `glass-card border-0`
- Section dividers: `border-white/10`
- Interactive items: `hover:glass-subtle card-hover`

### Modals & Dialogs
- Background overlay: `bg-black/50 backdrop-blur-sm`
- Content: `glass-card` or `glass-strong`
- Actions: Primary = `gradient-accent glow-sm`, Secondary = `glass-panel`

### Lists & Tables
- Row hover: `hover:glass-subtle`
- Selected row: `bg-primary/10 border border-primary/30`
- Cell borders: `border-white/10`

### Form Elements
- Inputs: `glass-subtle`
- Select: `glass-subtle`
- Checkboxes/Radio active: `gradient-accent glow-sm`
- Form sections: `glass-panel rounded-lg p-4`

### Code & Terminal
- Code blocks: Keep dark backgrounds but add `glass-panel` for container
- Terminal: `bg-[#1e1e1e] glass-panel`
- Syntax highlighting: Maintain current colors, works well with glass

## Implementation Checklist

For each component, ensure:

- [ ] Main container uses appropriate glass variant
- [ ] Interactive elements have glow effects
- [ ] Primary CTAs use `gradient-accent glow-sm`
- [ ] Secondary actions use `glass-panel hover:glow-sm`
- [ ] Status badges use `badge-glass`
- [ ] Icons use `icon-container` or `icon-container-sm`
- [ ] Borders use `border-white/10` or `border-white/20`
- [ ] Dark mode variants are present
- [ ] Backdrop blur is consistent
- [ ] Floating orbs added to hero sections
- [ ] Background patterns used where appropriate

## Class Priority

When combining classes, follow this order:

1. Layout (flex, grid, positioning)
2. Sizing (w-, h-, p-, m-)
3. Glass effect (glass-card, glass-subtle, glass-panel)
4. Border (border, rounded)
5. Color/gradient (gradient-accent, text-*)
6. Glow (glow-sm, glow, glow-lg)
7. Hover states (hover:glow-sm, hover:glass-subtle)
8. Animations (card-hover, animate-float)
9. Dark mode (dark:*)

## Examples

### Hero Section
```tsx
<div className="relative">
  {/* Background orbs */}
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="orb-primary -top-40 -right-40 opacity-30" />
    <div className="orb-violet top-1/2 -left-40 opacity-20" />
  </div>

  {/* Content */}
  <div className="glass-card p-8">
    <h1 className="gradient-text">Title</h1>
    <Button className="gradient-accent glow-sm">Get Started</Button>
  </div>
</div>
```

### Chat Message
```tsx
<div className={cn(
  'rounded-2xl px-4 py-3',
  role === 'user'
    ? 'gradient-accent text-white glow-sm'
    : 'glass-subtle'
)}>
  {content}
</div>
```

### Interactive Card
```tsx
<Card className="glass-card border-0 card-hover group">
  <CardHeader>
    <div className="icon-container glow-sm">
      <Icon />
    </div>
  </CardHeader>
  <CardContent>
    <Badge className="badge-glass">Status</Badge>
  </CardContent>
</Card>
```

### Tool List Item
```tsx
<div className="flex items-center gap-3 p-2 rounded-lg hover:glass-subtle card-hover">
  <div className="icon-container-sm">
    <ToolIcon />
  </div>
  <div className="flex-1">
    <p className="font-medium">{name}</p>
    <p className="text-xs text-muted-foreground">{desc}</p>
  </div>
  <Badge className="badge-glass">Ready</Badge>
</div>
```

## Testing Checklist

- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test hover states
- [ ] Test focus states
- [ ] Test on different screen sizes
- [ ] Test with high contrast
- [ ] Test reduced motion preference
- [ ] Verify backdrop blur support
- [ ] Check color contrast ratios
- [ ] Validate accessibility

## Notes

- Always prefer glassmorphism over solid backgrounds
- Use depth hierarchy: glass-card > glass-subtle > glass-panel
- Don't over-use glow effects - reserve for truly interactive elements
- Floating orbs should never obstruct content
- Test all changes in both light and dark mode
- Maintain consistent spacing and sizing
- Keep animations subtle and purposeful

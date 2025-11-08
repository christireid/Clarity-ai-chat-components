# Clarity Chat Components - Design System Guide

**Version**: 2.0 (Post-Elevation)  
**Date**: November 8, 2025  
**Status**: Official Design Standards

---

## 📐 Introduction

This guide documents the design standards for the Clarity Chat Components library following the comprehensive UI/UX elevation project. All new components and updates should follow these patterns to maintain consistency.

---

## 🎨 Core Design Principles

### 1. Subtle Over Bold
**Philosophy**: Professional, refined interactions over flashy animations

**Application**:
- Use minimal shadows (shadow-xs, shadow-sm)
- Small hover movements (1px standard)
- Subtle scale changes (1.02, not 1.05)
- Soft color transitions

### 2. Consistency First
**Philosophy**: Predictable patterns create better UX

**Application**:
- Use standardized utilities across all components
- Follow established interaction patterns
- Maintain consistent spacing and sizing
- Use design tokens for all values

### 3. Accessibility Always
**Philosophy**: Inclusive design is good design

**Application**:
- Maintain WCAG 2.1 AA minimum
- Visible focus indicators (3px rings)
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility

### 4. Performance Matters
**Philosophy**: Fast interactions feel professional

**Application**:
- 60fps animations minimum
- No layout shifts (CLS = 0)
- Optimized re-renders
- Proper memoization
- Smooth transitions (200ms standard)

---

## 🔧 Design Tokens

### Shadows
Use the standardized shadow system for all components:

```css
/* Extra subtle - Use for most components */
shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05)

/* Standard - Use for cards, dropdowns */
shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)

/* Medium - Use for modals, overlays */
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)

/* Never use shadow-lg or shadow-xl - too heavy */
```

**Usage Examples**:
```tsx
// Button, Badge, Card base
className="shadow-xs"

// Card hover, Dropdown
className="hover:shadow-sm"

// Modal, Overlay
className="shadow-md"
```

### Borders

**Standard Border**:
```tsx
// Single border - default for most components
className="border border-border"

// With ring emphasis - for interactive elements
className="border ring-1 ring-border"

// Focus state
className="focus-visible:ring-[3px] focus-visible:ring-ring/50"
```

**Never Use**:
- ❌ `border-2` (too heavy, use ring-1 instead)
- ❌ `border-4` (far too heavy)

### Focus Rings

**Standard Focus Pattern** (use everywhere):
```tsx
className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1"
```

**Breakdown**:
- `ring-[3px]` - 3px width (50% thicker than default)
- `ring-ring/50` - 50% opacity for sophistication
- `ring-offset-1` - 1px offset for definition
- `outline-none` - Remove browser default

**Component-Specific**:
```tsx
// Primary actions
className="focus-visible:ring-primary/50"

// Destructive actions
className="focus-visible:ring-destructive/50"

// Success actions
className="focus-visible:ring-success/50"
```

### Hover States

**Standard Hover Pattern**:
```tsx
// Buttons, Cards, Interactive elements
className="hover:shadow-sm hover:-translate-y-[1px] transition-all duration-200"
```

**Scale Hover** (use sparingly):
```tsx
// Only for chips, badges, small elements
className="hover:scale-[1.02] active:scale-[0.98]"
```

**Never Use**:
- ❌ `hover:-translate-y-0.5` (too much movement, 8px)
- ❌ `hover:scale-105` (too dramatic, 5%)
- ❌ `hover:shadow-lg` (too heavy)

### Typography

**Letter Spacing**:
```tsx
// Body text, buttons, labels
className="tracking-[0.13px]"

// Tight headings
className="tracking-tight"

// Default (use sparingly)
className="tracking-normal"
```

**Font Weights**:
```tsx
// Regular body text
className="font-normal"

// Interactive elements, labels
className="font-medium"

// Headings, emphasis
className="font-semibold"

// Strong emphasis only
className="font-bold"
```

### Transitions

**Standard Duration**:
```tsx
// Most interactions
className="transition-all duration-200"

// Quick interactions (buttons, chips)
className="transition-all duration-150"

// Smooth animations
className="transition-all duration-300"
```

**Easing**:
```tsx
// Entrances (recommended default)
className="ease-out"

// Two-way transitions
className="ease-in-out"
```

### Spacing

**Gap Spacing** (consistent usage):
```tsx
// Tight (icons, badges)
className="gap-1"

// Standard (most components)
className="gap-2"

// Comfortable (cards, sections)
className="gap-3"

// Spacious (major sections)
className="gap-4"
```

**Padding**:
```tsx
// Compact (badges, chips)
className="px-2 py-0.5"

// Standard (buttons, inputs)
className="px-3 py-2" or "px-4 py-2"

// Comfortable (cards, panels)
className="p-4"

// Spacious (major containers)
className="p-6"
```

---

## 🧩 Component Patterns

### Buttons

**Base Pattern**:
```tsx
<Button
  className={cn(
    // Base styles
    'inline-flex items-center justify-center gap-2',
    'rounded-lg px-4 py-2 text-sm font-medium',
    'tracking-[0.13px]',
    
    // Shadow system
    'shadow-xs hover:shadow-sm',
    
    // Hover state
    'hover:-translate-y-[1px] active:translate-y-0',
    
    // Focus ring
    'focus-visible:outline-none',
    'focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'focus-visible:ring-offset-1',
    
    // Transitions
    'transition-all duration-200',
    
    // Disabled state
    'disabled:opacity-50 disabled:pointer-events-none'
  )}
>
  {children}
</Button>
```

**Variants**:
```tsx
// Default (primary action)
'bg-primary text-primary-foreground hover:bg-primary/90'

// Outline (secondary action)
'border ring-1 ring-border bg-background hover:bg-accent'

// Ghost (tertiary action)
'hover:bg-accent hover:text-accent-foreground'

// Destructive (delete, remove)
'bg-destructive text-destructive-foreground hover:bg-destructive/90'
```

### Cards

**Base Pattern**:
```tsx
<Card
  className={cn(
    // Base styles
    'rounded-xl border border-border',
    'bg-card text-card-foreground',
    
    // Shadow system
    'shadow-xs',
    
    // Interactive (if clickable)
    interactive && 'cursor-pointer hover:shadow-sm hover:-translate-y-[1px]',
    
    // Transitions
    'transition-all duration-200'
  )}
>
  <CardContent className="p-4">
    {children}
  </CardContent>
</Card>
```

**Interactive Cards**:
```tsx
// Add focus ring for keyboard navigation
'focus-visible:outline-none',
'focus-visible:ring-[3px] focus-visible:ring-ring/50',
'focus-visible:ring-offset-1',

// Add selected state
selected && 'ring-2 ring-primary ring-offset-1 shadow-sm'
```

### Inputs

**Base Pattern**:
```tsx
<Input
  className={cn(
    // Base styles
    'flex w-full rounded-lg',
    'border border-input bg-background',
    'px-3 py-2 text-sm',
    
    // Placeholder
    'placeholder:text-muted-foreground',
    
    // Focus state
    'focus-visible:outline-none',
    'focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'focus-visible:ring-offset-1',
    'focus-visible:border-primary',
    'focus-visible:shadow-xs',
    
    // Hover state
    'hover:border-accent-foreground/20',
    
    // Disabled state
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'disabled:bg-muted',
    
    // Transitions
    'transition-all duration-200'
  )}
/>
```

**Error State**:
```tsx
error && cn(
  'border-destructive',
  'focus-visible:border-destructive',
  'focus-visible:ring-destructive/20'
)
```

### Badges

**Base Pattern**:
```tsx
<Badge
  className={cn(
    // Base styles
    'inline-flex items-center',
    'rounded-full border px-2.5 py-0.5',
    'text-xs font-medium',
    'tracking-[0.13px]',
    
    // Focus ring (if interactive)
    interactive && 'focus-visible:outline-none',
    interactive && 'focus-visible:ring-[3px] focus-visible:ring-ring/50',
    interactive && 'focus-visible:ring-offset-1',
    
    // Transitions
    'transition-all duration-200'
  )}
>
  {children}
</Badge>
```

### Modals/Overlays

**Backdrop**:
```tsx
<div
  className={cn(
    'fixed inset-0 z-50',
    'bg-background/80 backdrop-blur-sm',
    'transition-opacity duration-200'
  )}
  aria-hidden="true"
/>
```

**Modal Container**:
```tsx
<div
  className={cn(
    'fixed left-1/2 top-1/2 z-50',
    'w-full max-w-lg',
    '-translate-x-1/2 -translate-y-1/2',
    'rounded-xl border border-border',
    'bg-background p-6',
    'shadow-md',
    'transition-all duration-200'
  )}
  role="dialog"
  aria-modal="true"
>
  {children}
</div>
```

---

## 🎭 Animation Patterns

### Framer Motion Presets

**Fade In**:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

**Slide Up**:
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

**Scale**:
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

**Button Hover/Tap**:
```tsx
<motion.button
  whileHover={{ scale: 1.02, y: -1 }}
  whileTap={{ scale: 0.98, y: 0 }}
  transition={{ duration: 0.15, ease: 'easeOut' }}
>
  {children}
</motion.button>
```

**Card Hover**:
```tsx
<motion.div
  whileHover={{ 
    y: -1, 
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' 
  }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

---

## 📋 Component Checklist

When creating or updating components, ensure:

### Visual Design
- [ ] Uses shadow-xs or shadow-sm (never shadow-lg)
- [ ] Border is 1px (never border-2)
- [ ] Has ring-1 for emphasis if needed
- [ ] Letter-spacing applied (tracking-[0.13px])
- [ ] Hover movement is 1px (-translate-y-[1px])
- [ ] Scale changes are minimal (1.02, not 1.05)
- [ ] Transitions are 200ms standard

### Focus States
- [ ] Has focus-visible:outline-none
- [ ] Has ring-[3px] ring-ring/50
- [ ] Has ring-offset-1
- [ ] Focus ring is clearly visible
- [ ] Focus state tested with keyboard

### Accessibility
- [ ] Proper ARIA labels
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast >= 4.5:1
- [ ] Focus indicators visible
- [ ] Disabled states clear

### Performance
- [ ] Animations run at 60fps
- [ ] No layout shifts
- [ ] Proper memoization
- [ ] Optimized re-renders
- [ ] Smooth transitions

### Documentation
- [ ] Props documented with TSDoc
- [ ] Usage examples provided
- [ ] Accessibility notes included
- [ ] Storybook story created
- [ ] Edge cases handled

---

## 🚫 Anti-Patterns (What NOT to Do)

### Shadows
```tsx
// ❌ BAD - Too heavy
className="shadow-lg hover:shadow-xl"

// ✅ GOOD - Subtle
className="shadow-xs hover:shadow-sm"
```

### Hover Movement
```tsx
// ❌ BAD - Too much movement
className="hover:-translate-y-0.5"  // 8px

// ✅ GOOD - Subtle lift
className="hover:-translate-y-[1px]"  // 1px
```

### Scale
```tsx
// ❌ BAD - Too dramatic
className="hover:scale-105"  // 5%

// ✅ GOOD - Subtle
className="hover:scale-[1.02]"  // 2%
```

### Borders
```tsx
// ❌ BAD - Too thick
className="border-2 border-input"

// ✅ GOOD - Refined
className="border ring-1 ring-border"
```

### Focus Rings
```tsx
// ❌ BAD - Old pattern
className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

// ✅ GOOD - New pattern
className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1"
```

### Typography
```tsx
// ❌ BAD - No letter-spacing
<button className="text-sm font-medium">
  Click me
</button>

// ✅ GOOD - With letter-spacing
<button className="text-sm font-medium tracking-[0.13px]">
  Click me
</button>
```

---

## 💡 Best Practices

### 1. Component Composition
```tsx
// ✅ GOOD - Compose from primitives
import { Button, Card } from '@clarity-chat/primitives'

export const MyComponent = () => (
  <Card className="shadow-xs">
    <Button className="tracking-[0.13px]">
      Action
    </Button>
  </Card>
)
```

### 2. Consistent Spacing
```tsx
// ✅ GOOD - Use gap for consistency
<div className="flex items-center gap-2">
  <Icon />
  <span>Label</span>
</div>

// ❌ BAD - Inconsistent margins
<div className="flex items-center">
  <Icon className="mr-3" />
  <span>Label</span>
</div>
```

### 3. Semantic HTML
```tsx
// ✅ GOOD - Proper semantics
<button type="button" onClick={handleClick}>
  Click me
</button>

// ❌ BAD - Div button
<div onClick={handleClick}>
  Click me
</div>
```

### 4. Conditional Classes
```tsx
// ✅ GOOD - Use cn() utility
import { cn } from '@clarity-chat/primitives'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)}>
  {children}
</div>
```

### 5. Memoization
```tsx
// ✅ GOOD - Memo expensive components
export const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data
}: Props) {
  return <div>{/* Complex rendering */}</div>
})
```

---

## 🎓 Examples

### Complete Button Example
```tsx
import { Button } from '@clarity-chat/primitives'
import { motion } from 'framer-motion'

export const ActionButton = ({ 
  children, 
  onClick,
  variant = 'default',
  loading = false 
}: Props) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={loading}
      className={cn(
        // Standard button classes from primitives
        'tracking-[0.13px]',
        // Additional custom classes if needed
      )}
      asChild
    >
      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        {loading ? <LoadingSpinner /> : children}
      </motion.button>
    </Button>
  )
}
```

### Complete Card Example
```tsx
import { Card, CardContent } from '@clarity-chat/primitives'
import { motion } from 'framer-motion'

export const InteractiveCard = ({ 
  children, 
  onClick,
  selected = false 
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Card
        className={cn(
          'cursor-pointer hover:shadow-sm',
          selected && 'ring-2 ring-primary ring-offset-1 shadow-sm'
        )}
        onClick={onClick}
        tabIndex={0}
        role="button"
        aria-pressed={selected}
      >
        <CardContent className="p-4">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

---

## 📚 Resources

### Internal Documentation
- `UI_UX_DESIGN_ELEVATION_PLAN.md` - Original strategy
- `UI_UX_IMPROVEMENTS_SUMMARY.md` - Implementation details
- `COMPLETE_UI_UX_ELEVATION_PROJECT_SUMMARY.md` - Full project summary

### External References
- [AI SDK Elements](https://ai-sdk.dev/elements) - Design inspiration
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Utility reference
- [Framer Motion Docs](https://www.framer.com/motion/) - Animation reference
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility standards

### Design Tools
- Tailwind CSS IntelliSense (VS Code extension)
- Storybook - Component playground
- Chrome DevTools - Inspect and debug
- Lighthouse - Accessibility audits

---

## 🔄 Version History

### v2.0 (November 8, 2025)
- Complete UI/UX elevation project
- Standardized shadow system
- Modern focus ring patterns
- Typography enhancements
- Comprehensive documentation

### v1.0 (Initial)
- Original component designs
- Basic Tailwind integration
- Initial accessibility compliance

---

## ✅ Review Checklist

Before submitting new components or updates:

### Design Review
- [ ] Follows shadow system (xs, sm, md only)
- [ ] Uses 1px borders with rings
- [ ] Implements modern focus pattern
- [ ] Has letter-spacing applied
- [ ] Uses standard hover patterns
- [ ] Animations are subtle (1-2px, 1-2% scale)

### Code Review
- [ ] TypeScript types defined
- [ ] Props documented with TSDoc
- [ ] Proper memoization applied
- [ ] No prop drilling (use context if needed)
- [ ] Error boundaries implemented
- [ ] Loading states handled

### Accessibility Review
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Focus indicators visible
- [ ] Screen reader tested
- [ ] Color contrast verified

### Testing Review
- [ ] Storybook story created
- [ ] All variants tested
- [ ] Edge cases handled
- [ ] Responsive design verified
- [ ] Dark mode tested
- [ ] Performance validated (60fps)

---

## 🎯 Conclusion

This design system guide ensures consistency, quality, and maintainability across all Clarity Chat Components. By following these patterns, new components will automatically match the elevated design standards achieved through our comprehensive UI/UX project.

**Remember**: Subtle, consistent, and accessible always wins. 🎨✨

---

**Maintained by**: Clarity Chat Components Team  
**Last Updated**: November 8, 2025  
**Version**: 2.0

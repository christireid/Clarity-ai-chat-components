# UI/UX Design System Migration Guide

**Version**: 2.0  
**Date**: November 8, 2025  
**For**: Developers using Clarity Chat Components

---

## 📋 Overview

This guide helps you migrate from the old design patterns to the new, refined design system introduced across Phases 1-4 of our UI/UX elevation project.

**Migration Status**: 
- ✅ Core Primitives: 100% Complete
- ✅ Chat Components: 100% Complete
- ✅ Additional UI Elements: 100% Complete
- ⚠️ AI Ops Components: 35% Complete (custom shadows remaining)
- ⚠️ Enterprise Components: 60% Complete (some custom shadows remaining)

---

## 🎯 Quick Migration Checklist

### For Existing Components
- [ ] Replace heavy shadows (`shadow-lg`, `shadow-xl`, `shadow-2xl`) with subtle ones (`shadow-xs`, `shadow-sm`, `shadow-md`)
- [ ] Update thick borders (`border-2`, `border-4`) to `border` with optional `ring-1 ring-border`
- [ ] Fix hover movements from `hover:-translate-y-0.5` (8px) to `hover:-translate-y-[1px]` (1px)
- [ ] Reduce scale transforms from `hover:scale-105+` to `hover:scale-[1.02]`
- [ ] Update focus rings to new pattern: `focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1`
- [ ] Add letter-spacing: `tracking-[0.13px]` to buttons, labels, body text
- [ ] Standardize transition duration to `duration-200` (or `duration-150` for quick interactions)

### For New Components
- [ ] Use the `DESIGN_SYSTEM_GUIDE.md` as your reference
- [ ] Follow component patterns from updated primitives
- [ ] Use animation constants from `/packages/react/src/animations/constants.ts`
- [ ] Leverage the standardized shadow tokens
- [ ] Apply consistent spacing (`gap-2`, `gap-3`, `gap-4`)

---

## 🔧 Step-by-Step Migration

### 1. Update Shadow System

#### Before (Old Pattern)
```tsx
<Card className="shadow-lg hover:shadow-xl">
  <Button className="shadow-md hover:shadow-lg">
    Click me
  </Button>
</Card>
```

#### After (New Pattern)
```tsx
<Card className="shadow-xs hover:shadow-sm">
  <Button className="shadow-xs hover:shadow-sm">
    Click me
  </Button>
</Card>
```

#### Shadow Replacement Rules
```tsx
// Old → New
shadow-2xl → shadow-md  // Modals, dialogs only
shadow-xl  → shadow-md  // Modals, dialogs only
shadow-lg  → shadow-sm  // Cards, dropdowns
shadow-md  → shadow-sm  // Most components
shadow-sm  → shadow-xs  // Default for UI elements

// Custom shadows
shadow-[0_20px_48px_rgba(...)] → shadow-sm
shadow-[0_10px_28px_rgba(...)] → shadow-xs
shadow-[0_1px_2px_rgba(...)]   → shadow-xs
```

---

### 2. Refine Border Styles

#### Before (Old Pattern)
```tsx
<Input className="border-2 border-input" />
<Badge className="border-2 border-border" />
```

#### After (New Pattern)
```tsx
<Input className="border border-input" />
<Badge className="border ring-1 ring-border" />
```

#### Border Replacement Rules
```tsx
// Old → New
border-2 → border            // Standard borders
border-2 → border ring-1     // For emphasis
border-4 → border ring-2     // Only for very strong emphasis (rare)
```

---

### 3. Update Hover States

#### Before (Old Pattern)
```tsx
<Button className="hover:-translate-y-0.5 hover:shadow-lg">
  Submit
</Button>

<Card className="hover:-translate-y-1 hover:shadow-xl">
  Content
</Card>
```

#### After (New Pattern)
```tsx
<Button className="hover:-translate-y-[1px] hover:shadow-sm">
  Submit
</Button>

<Card className="hover:-translate-y-[1px] hover:shadow-sm">
  Content
</Card>
```

#### Hover Replacement Rules
```tsx
// Movement
hover:-translate-y-0.5  → hover:-translate-y-[1px]  // 8px → 1px
hover:-translate-y-1    → hover:-translate-y-[1px]  // 16px → 1px
hover:-translate-y-2    → hover:-translate-y-[1px]  // 32px → 1px

// Scale (use sparingly, mainly for small elements)
hover:scale-105  → hover:scale-[1.02]  // 5% → 2%
hover:scale-110  → hover:scale-[1.02]  // 10% → 2%

// Shadows (always subtle)
hover:shadow-xl  → hover:shadow-sm
hover:shadow-lg  → hover:shadow-sm
hover:shadow-md  → hover:shadow-sm
```

---

### 4. Modernize Focus States

#### Before (Old Pattern)
```tsx
<Button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
  Action
</Button>
```

#### After (New Pattern)
```tsx
<Button className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1">
  Action
</Button>
```

#### Focus Ring Pattern (Apply Everywhere)
```tsx
// Standard focus ring (use this for all interactive elements)
className={cn(
  'focus-visible:outline-none',
  'focus-visible:ring-[3px]',
  'focus-visible:ring-ring/50',
  'focus-visible:ring-offset-1'
)}

// Variant-specific (for colored buttons)
// Primary
'focus-visible:ring-primary/50'

// Destructive
'focus-visible:ring-destructive/50'

// Success
'focus-visible:ring-success/50'
```

---

### 5. Add Typography Refinements

#### Before (Old Pattern)
```tsx
<Button className="text-sm font-medium">
  Click me
</Button>

<CardTitle className="text-lg font-semibold">
  Title
</CardTitle>
```

#### After (New Pattern)
```tsx
<Button className="text-sm font-medium tracking-[0.13px]">
  Click me
</Button>

<CardTitle className="text-lg font-semibold tracking-[0.13px]">
  Title
</CardTitle>
```

#### Typography Rules
```tsx
// Body text, buttons, labels
tracking-[0.13px]

// Tight headings (optional)
tracking-tight

// Keep default for large display text
tracking-normal
```

---

### 6. Standardize Transitions

#### Before (Old Pattern)
```tsx
<Button className="transition-shadow duration-300">
  Click me
</Button>

<Card className="transition-all duration-500">
  Content
</Card>
```

#### After (New Pattern)
```tsx
<Button className="transition-all duration-200">
  Click me
</Button>

<Card className="transition-all duration-200">
  Content
</Card>
```

#### Transition Rules
```tsx
// Standard (most components)
transition-all duration-200

// Quick interactions (buttons, chips)
transition-all duration-150

// Smooth animations (modals, drawers)
transition-all duration-300

// Always use easing
ease-out  // Preferred default
ease-in-out  // For two-way transitions
```

---

## 🎨 Component-Specific Migrations

### Button Component

#### Before
```tsx
<Button
  className={cn(
    'shadow-md hover:shadow-lg',
    'hover:-translate-y-0.5',
    'focus:ring-2 focus:ring-offset-2',
    'border-2'
  )}
>
  Click me
</Button>
```

#### After
```tsx
<Button
  className={cn(
    'shadow-xs hover:shadow-sm',
    'hover:-translate-y-[1px]',
    'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1',
    'border',
    'tracking-[0.13px]'
  )}
>
  Click me
</Button>
```

---

### Card Component

#### Before
```tsx
<Card className="shadow-lg hover:shadow-xl hover:-translate-y-1">
  <CardHeader className="border-b-2">
    <CardTitle className="text-lg font-semibold">
      Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

#### After
```tsx
<Card className="shadow-xs hover:shadow-sm hover:-translate-y-[1px]">
  <CardHeader className="border-b">
    <CardTitle className="text-lg font-semibold tracking-[0.13px]">
      Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

---

### Input Component

#### Before
```tsx
<Input
  className={cn(
    'border-2 border-input',
    'focus:ring-2 focus:ring-offset-2',
    'focus:shadow-md'
  )}
  placeholder="Enter text"
/>
```

#### After
```tsx
<Input
  className={cn(
    'border border-input',
    'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1',
    'focus-visible:shadow-xs',
    'hover:border-accent-foreground/20'
  )}
  placeholder="Enter text"
/>
```

---

### Dialog/Modal Component

#### Before
```tsx
<Dialog>
  <DialogContent className="shadow-2xl border-2">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <DialogBody>
      Content
    </DialogBody>
  </DialogContent>
</Dialog>
```

#### After
```tsx
<Dialog>
  <DialogContent className="shadow-md border">
    <DialogHeader>
      <DialogTitle className="tracking-[0.13px]">Title</DialogTitle>
    </DialogHeader>
    <DialogBody>
      Content
    </DialogBody>
  </DialogContent>
</Dialog>
```

---

### Toast Notification

#### Before
```tsx
<Toast className="border-2 shadow-xl backdrop-blur-md">
  <ToastTitle>Success!</ToastTitle>
  <ToastDescription>Operation completed</ToastDescription>
</Toast>
```

#### After
```tsx
<Toast className="border shadow-md backdrop-blur-md">
  <ToastTitle className="tracking-[0.13px]">Success!</ToastTitle>
  <ToastDescription>Operation completed</ToastDescription>
</Toast>
```

---

## 🎭 Framer Motion Migrations

### Button Animations

#### Before
```tsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Click me
</motion.button>
```

#### After
```tsx
<motion.button
  whileHover={{ scale: 1.02, y: -1 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15, ease: 'easeOut' }}
>
  Click me
</motion.button>
```

---

### Card Animations

#### Before
```tsx
<motion.div
  whileHover={{ 
    y: -4, 
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)' 
  }}
  transition={{ duration: 0.2 }}
>
  <Card>Content</Card>
</motion.div>
```

#### After
```tsx
<motion.div
  whileHover={{ 
    y: -1, 
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' 
  }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  <Card>Content</Card>
</motion.div>
```

---

## 📦 Importing Updated Constants

### Animation Constants (Recommended)
```tsx
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  INTERACTION_VARIANTS
} from '@clarity-chat/react/animations/constants'

// Use in Framer Motion
<motion.button
  whileHover={INTERACTION_VARIANTS.button.hover}
  whileTap={INTERACTION_VARIANTS.button.tap}
  transition={{
    duration: ANIMATION_DURATION.fast / 1000,
    ease: ANIMATION_EASING.easeOut
  }}
>
  Click me
</motion.button>
```

### Updated Animation Values
```tsx
// packages/react/src/animations/constants.ts

export const INTERACTION_VARIANTS = {
  button: {
    hover: { scale: 1.02, y: -1 },  // Was: scale: 1.05, y: -2
    tap: { scale: 0.98 }            // Was: scale: 0.95
  },
  card: {
    hover: { 
      y: -1,                                                           // Was: y: -4
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)'  // Was: 0 12px 24px
    },
    tap: { scale: 0.98 }            // Was: scale: 0.99
  }
}
```

---

## ⚠️ Breaking Changes

### None!
This is a **non-breaking** visual update. All changes are purely presentational and don't affect:
- Props or APIs
- Component behavior
- Event handlers
- State management
- Data flow

### Optional Opt-in
If you're using custom components and want to adopt the new patterns:
1. Update shadow classes as shown above
2. Refine hover/focus states
3. Add letter-spacing where appropriate
4. Test visual appearance in your app

---

## 🧪 Testing Your Migrations

### Visual Testing
```bash
# Start Storybook to preview changes
npm run storybook

# Check all component variants
# Verify light and dark modes
# Test hover and focus states
```

### Accessibility Testing
```bash
# Run accessibility checks
npm run a11y

# Test keyboard navigation
# Verify focus indicators are visible
# Check screen reader compatibility
```

### Automated Checks
```tsx
// Add this to your component tests
import { render } from '@testing-library/react'

test('button uses correct shadow classes', () => {
  const { container } = render(<Button>Click me</Button>)
  const button = container.querySelector('button')
  
  expect(button).toHaveClass('shadow-xs')
  expect(button).not.toHaveClass('shadow-lg')
  expect(button).not.toHaveClass('shadow-xl')
})
```

---

## 📊 Migration Statistics

### Average Migration Time
- **Single Component**: 2-5 minutes
- **Full Feature**: 15-30 minutes
- **Entire Application**: 1-3 hours (depending on size)

### Common Patterns Found
- 80% of changes: Shadow updates
- 15% of changes: Hover/focus state refinements
- 5% of changes: Border and typography updates

---

## 🚨 Common Pitfalls

### 1. Forgetting to Remove Old Shadow Classes
```tsx
// ❌ BAD - Both old and new classes
<Card className="shadow-lg shadow-xs">
  Content
</Card>

// ✅ GOOD - Only new class
<Card className="shadow-xs">
  Content
</Card>
```

### 2. Inconsistent Hover Patterns
```tsx
// ❌ BAD - Mixing old and new
<Button className="hover:-translate-y-0.5 hover:shadow-sm">
  Click
</Button>

// ✅ GOOD - Consistent new pattern
<Button className="hover:-translate-y-[1px] hover:shadow-sm">
  Click
</Button>
```

### 3. Missing focus-visible
```tsx
// ❌ BAD - Using focus instead of focus-visible
<Button className="focus:ring-2">
  Click
</Button>

// ✅ GOOD - Using focus-visible
<Button className="focus-visible:ring-[3px] focus-visible:ring-ring/50">
  Click
</Button>
```

### 4. Over-applying Transitions
```tsx
// ❌ BAD - Too many transition properties
<Button className="transition-shadow transition-transform transition-colors transition-opacity">
  Click
</Button>

// ✅ GOOD - Use transition-all
<Button className="transition-all duration-200">
  Click
</Button>
```

---

## 📚 Additional Resources

### Internal Documentation
- [Design System Guide](./DESIGN_SYSTEM_GUIDE.md) - Complete design standards and reference

### Code Examples
- Check `/packages/primitives/src/components/` for updated primitive patterns
- Check `/packages/react/src/components/` for updated React component patterns
- Review `/apps/storybook/src/stories/` for live examples

### Getting Help
- Review the Design System Guide first
- Check Storybook for live examples
- Look at similar components that have been updated
- Refer to animation constants for Framer Motion values

---

## ✅ Migration Completion Checklist

Use this checklist to track your migration progress:

### Global Styles
- [ ] Updated Tailwind config with new shadow tokens
- [ ] Added letter-spacing utilities
- [ ] Verified all custom CSS variables

### Primitive Components
- [ ] Buttons updated
- [ ] Inputs updated
- [ ] Textareas updated
- [ ] Cards updated
- [ ] Badges updated
- [ ] Dialogs updated
- [ ] Popovers updated
- [ ] Drawers updated
- [ ] Avatars updated
- [ ] Dropdowns updated
- [ ] Tooltips updated

### Feature Components
- [ ] Chat components updated
- [ ] Message components updated
- [ ] Navigation components updated
- [ ] Form components updated
- [ ] Dashboard components updated

### Testing
- [ ] Visual regression tests passed
- [ ] Accessibility tests passed
- [ ] Unit tests updated (if needed)
- [ ] Manual QA in light mode
- [ ] Manual QA in dark mode
- [ ] Keyboard navigation tested
- [ ] Screen reader compatibility verified

### Documentation
- [ ] Component README updated
- [ ] Storybook stories reviewed
- [ ] Props documentation current
- [ ] Usage examples provided

---

## 🎉 Success Metrics

After migration, you should see:
- ✨ More refined, professional appearance
- 🎯 Improved visual hierarchy
- 💫 Smoother, more predictable interactions
- 🎨 Better consistency across all components
- ♿ Maintained or improved accessibility
- 🚀 No performance degradation

---

## 🔄 Ongoing Maintenance

### For New Components
Always reference the `DESIGN_SYSTEM_GUIDE.md` when creating new components.

### For Updates
Follow the patterns established in updated components in `/packages/`.

### For Third-party Integration
If integrating external components:
1. Wrap them with our standard styles
2. Apply our shadow/hover/focus patterns
3. Ensure accessibility compliance
4. Test in both light and dark modes

---

**Last Updated**: November 8, 2025  
**Maintained by**: Clarity Chat Components Team  
**Questions?**: Review the Design System Guide or check existing component implementations

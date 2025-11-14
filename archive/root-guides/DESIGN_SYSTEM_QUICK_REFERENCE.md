# Clarity Chat Components - Design System Quick Reference

**Version**: 2.0 | **Date**: November 8, 2025 | **One-Page Cheat Sheet**

---

## 🎨 Shadow System (Use These Only!)

```tsx
shadow-xs    // Most UI elements (buttons, cards, badges)
shadow-sm    // Hover states, dropdowns, elevated cards
shadow-md    // Modals, dialogs, drawers ONLY
```

**❌ NEVER USE**: `shadow-lg`, `shadow-xl`, `shadow-2xl`, `shadow-[0_...]`

---

## 🎯 Focus States (All Interactive Elements)

```tsx
className={cn(
  'focus-visible:outline-none',
  'focus-visible:ring-[3px]',
  'focus-visible:ring-ring/50',
  'focus-visible:ring-offset-1'
)}
```

**Variants**:
```tsx
'focus-visible:ring-primary/50'      // Primary actions
'focus-visible:ring-destructive/50'  // Destructive actions
'focus-visible:ring-success/50'      // Success actions
```

---

## 💫 Hover States

### Standard Pattern
```tsx
className="hover:-translate-y-[1px] hover:shadow-sm transition-all duration-200"
```

### Scale Pattern (Use Sparingly)
```tsx
className="hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
```

**❌ NEVER USE**: 
- `hover:-translate-y-0.5` (8px - too much!)
- `hover:scale-105` or `hover:scale-110` (too dramatic!)

---

## 🔤 Typography

```tsx
// Body text, buttons, labels
className="tracking-[0.13px]"

// Tight headings  
className="tracking-tight"

// Default (use sparingly)
className="tracking-normal"
```

---

## 🧱 Borders

```tsx
// Standard
className="border border-border"

// With emphasis
className="border ring-1 ring-border"
```

**❌ NEVER USE**: `border-2`, `border-4` (use ring-1 or ring-2 instead)

---

## ⏱️ Transitions

```tsx
// Standard (most components)
className="transition-all duration-200 ease-out"

// Quick (buttons, chips)
className="transition-all duration-150 ease-out"

// Smooth (modals, drawers)
className="transition-all duration-300 ease-out"
```

---

## 🎭 Framer Motion Presets

### Button
```tsx
<motion.button
  whileHover={{ scale: 1.02, y: -1 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15, ease: 'easeOut' }}
>
  {children}
</motion.button>
```

### Card
```tsx
<motion.div
  whileHover={{ y: -1 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  <Card>{children}</Card>
</motion.div>
```

### Fade In
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

---

## 📦 Common Patterns

### Button
```tsx
<Button
  className={cn(
    'shadow-xs hover:shadow-sm',
    'hover:-translate-y-[1px]',
    'tracking-[0.13px]',
    'focus-visible:ring-[3px] focus-visible:ring-ring/50'
  )}
>
  Click me
</Button>
```

### Card
```tsx
<Card className="shadow-xs hover:shadow-sm hover:-translate-y-[1px]">
  <CardHeader>
    <CardTitle className="tracking-[0.13px]">Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Input
```tsx
<Input
  className={cn(
    'border shadow-xs',
    'focus-visible:shadow-xs',
    'focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'hover:border-accent-foreground/20'
  )}
/>
```

### Badge
```tsx
<Badge className="shadow-xs tracking-[0.13px]">
  Label
</Badge>
```

---

## 📏 Spacing

```tsx
gap-1  // Tight (4px)
gap-2  // Standard (8px)
gap-3  // Comfortable (12px)
gap-4  // Spacious (16px)
```

**Padding**:
```tsx
px-2 py-0.5  // Compact (badges, chips)
px-3 py-2    // Standard (buttons, inputs)
px-4 py-2    // Comfortable (larger buttons)
p-4          // Card content
p-6          // Major containers
```

---

## ✅ Component Checklist

Before submitting:
- [ ] Uses `shadow-xs`, `shadow-sm`, or `shadow-md` only
- [ ] Borders are 1px (with optional ring-1)
- [ ] Focus ring is 3px with 50% opacity
- [ ] Hover movement is 1px
- [ ] Scale changes are 2% max
- [ ] Has `tracking-[0.13px]` on text
- [ ] Transitions are 150-300ms
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] WCAG 2.1 AA compliant

---

## 🚫 Anti-Patterns

```tsx
// ❌ BAD
className="shadow-lg hover:shadow-xl"
className="border-2"
className="hover:-translate-y-0.5"
className="hover:scale-105"
className="focus:ring-2"

// ✅ GOOD
className="shadow-xs hover:shadow-sm"
className="border ring-1 ring-border"
className="hover:-translate-y-[1px]"
className="hover:scale-[1.02]"
className="focus-visible:ring-[3px] focus-visible:ring-ring/50"
```

---

## 🔧 Quick Fixes

### Replace Heavy Shadows
```bash
# Find components with heavy shadows
grep -r "shadow-lg\|shadow-xl\|shadow-2xl" packages/

# Replace with standardized shadows
shadow-lg → shadow-sm
shadow-xl → shadow-md (modals only)
shadow-2xl → shadow-md (modals only)
```

### Update Thick Borders
```bash
# Find components with thick borders
grep -r "border-2\|border-4" packages/

# Replace with refined borders
border-2 → border ring-1 ring-border
border-4 → border ring-2 ring-border
```

### Fix Hover Movements
```bash
# Find dramatic hover movements
grep -r "translate-y-0\.5\|translate-y-1\|translate-y-2" packages/

# Replace with subtle movements
-translate-y-0.5 → -translate-y-[1px]
-translate-y-1 → -translate-y-[1px]
-translate-y-2 → -translate-y-[1px]
```

---

## 📚 Resources

### Full Documentation
- **Design System Guide**: Complete patterns and tokens
- **Migration Guide**: Step-by-step adoption instructions
- **Final Status**: Project summary and statistics

### Code Examples
- `/packages/primitives/src/components/` - Updated primitives
- `/packages/react/src/components/` - React components
- `/apps/storybook/` - Live component examples

### Getting Help
1. Check Design System Guide for patterns
2. Look at updated components for examples
3. Review Storybook for live demos
4. Reference animation constants in `/packages/react/src/animations/constants.ts`

---

## 💡 Pro Tips

1. **Always start with primitives** - They have the correct patterns
2. **Use `cn()` utility** - For conditional classes
3. **Batch shadow updates** - Do all shadows in a component at once
4. **Test focus states** - Always verify with keyboard navigation
5. **Check dark mode** - Verify appearance in both themes
6. **Use animation constants** - Import from `/animations/constants.ts`

---

## 🎯 Common Replacements

| Old Pattern | New Pattern | Context |
|------------|-------------|---------|
| `shadow-md` | `shadow-xs` | Buttons, badges, most UI |
| `shadow-lg` | `shadow-sm` | Cards, dropdowns |
| `shadow-xl` | `shadow-md` | Modals only |
| `border-2` | `border` | Standard borders |
| `border-2` | `border ring-1` | Emphasis borders |
| `hover:-translate-y-0.5` | `hover:-translate-y-[1px]` | All hover movements |
| `hover:scale-105` | `hover:scale-[1.02]` | Scale interactions |
| `focus:ring-2` | `focus-visible:ring-[3px]` | Focus states |
| `duration-300` | `duration-200` | Standard transitions |

---

**Print This Page** | **Pin to Wiki** | **Share with Team**

---

**Last Updated**: November 8, 2025  
**Maintained by**: Clarity Chat Components Team  
**Questions?**: Check full Design System Guide

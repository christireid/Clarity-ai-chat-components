# 🚀 Clarity Chat Components - Quick Reference Card

**Version 2.0 | Enhanced UI/UX | Production Ready**

---

## ⚡ Quick Start

```bash
# Install
npm install @clarity-chat/primitives @clarity-chat/react

# Import
import { Button, Card, Input } from '@clarity-chat/primitives'
import { ChatWindow, Message } from '@clarity-chat/react'
```

---

## 🎨 Design Patterns Cheat Sheet

### Borders
```tsx
// ✅ DO: Use ring-based borders
ring-1 ring-border/50        // Default
ring-2 ring-primary/50       // Selected
ring-[3px] ring-ring/50      // Focus

// ❌ DON'T: Use traditional borders
border border-input          // Old pattern
```

### Shadows
```tsx
shadow-xs    // Default state
shadow-sm    // Hover state
shadow-lg    // Popovers/Menus
shadow-xl    // Dialogs/Drawers
```

### Border Radius
```tsx
rounded-sm   // 2px - Small elements
rounded-md   // 6px - Buttons, inputs ⭐ Primary
rounded-lg   // 8px - Cards, containers
rounded-full // Avatars, badges
```

### Focus States
```tsx
// ✅ Enhanced focus (WCAG 2.1 AA)
focus-visible:outline-none
focus-visible:ring-[3px]
focus-visible:ring-ring/50
focus-visible:ring-offset-1
```

### Hover Effects
```tsx
// ✅ Precise hover lift
hover:shadow-sm
hover:-translate-y-[2px]
transition-all duration-200
```

### Opacity Scale
```tsx
bg-muted/10   // Subtle highlights
bg-muted/30   // Hover states
bg-muted/50   // Default backgrounds
```

---

## 📦 Common Components

### Button
```tsx
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
<Button variant="destructive">Delete</Button>
<Button loading>Processing...</Button>
```

### Input
```tsx
<Input placeholder="Enter text..." />
<Input type="email" />
<Input disabled />
```

### Card
```tsx
<Card className="p-6">
  <h3 className="font-semibold mb-2">Title</h3>
  <p className="text-sm text-muted-foreground">Content</p>
</Card>
```

### Dialog
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Tooltip
```tsx
<Tooltip content="Helpful tip">
  <Button>Hover me</Button>
</Tooltip>
```

---

## 🎯 Common Patterns

### Interactive Card
```tsx
<Card className="p-6 cursor-pointer transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px]">
  Content
</Card>
```

### Form Field
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">Label</label>
  <Input placeholder="Value..." />
  <p className="text-sm text-muted-foreground">Helper text</p>
</div>
```

### Loading State
```tsx
<Button disabled>
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity }}
    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
  />
  Loading...
</Button>
```

### Empty State
```tsx
<EmptyState
  icon={<Icon />}
  title="No items"
  description="Get started by creating a new item"
  action={<Button>Create Item</Button>}
/>
```

---

## 🎨 Utility Hooks

### useDesignTokens
```tsx
import { useDesignTokens } from '@clarity-chat/react'

const tokens = useDesignTokens()
// tokens.shadows.xs
// tokens.radius.md
// tokens.rings.focus
```

### useInteractiveClasses
```tsx
import { useInteractiveClasses } from '@clarity-chat/react'

const classes = useInteractiveClasses({ hover: true, focus: true })
// Returns: 'transition-all duration-200 hover:shadow-sm...'
```

### useCardClasses
```tsx
import { useCardClasses } from '@clarity-chat/react'

const classes = useCardClasses({ interactive: true, selected: false })
// Returns: Complete card styling classes
```

---

## ✨ Animation Patterns

### Entrance
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Hover
```tsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
>
  Button
</motion.button>
```

---

## ♿ Accessibility

### Focus Management
```tsx
<button
  tabIndex={0}
  aria-label="Descriptive label"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAction()
    }
  }}
>
  Content
</button>
```

### ARIA Attributes
```tsx
<div role="alert" aria-live="polite">
  Status update
</div>

<button aria-label="Close" aria-expanded={isOpen}>
  <Icon aria-hidden="true" />
</button>
```

---

## 📱 Responsive

### Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {/* Items */}
</div>
```

### Typography
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Heading
</h1>
```

---

## ✅ Best Practices

1. ✅ **Always** use `ring-` instead of `border`
2. ✅ **Prefer** `shadow-xs` for default states
3. ✅ **Use** `rounded-md` for most interactive elements
4. ✅ **Apply** `focus-visible` not `focus`
5. ✅ **Include** `transition-all duration-200`
6. ✅ **Maintain** `/10, /30, /50` opacity scale
7. ✅ **Add** `aria-labels` for accessibility
8. ✅ **Test** keyboard navigation
9. ✅ **Use** semantic HTML
10. ✅ **Check** color contrast (WCAG AA)

---

## 📚 Resources

- **Design System Guide:** `DESIGN_SYSTEM_GUIDE_V2.md` (752 lines)
- **Component Patterns:** `COMPONENT_PATTERNS_GUIDE.md` (530 lines)
- **Showcase App:** `examples/design-system-showcase`
- **Complete Summary:** `PROJECT_COMPLETE_FINAL_SUMMARY.md`

---

## 🎯 Quick Checklist

When building a new component:

```
□ Use ring-1 ring-border/50 for borders
□ Add shadow-xs for default state
□ Use rounded-md for interactive elements
□ Add focus-visible:ring-[3px] focus-visible:ring-ring/50
□ Include hover:shadow-sm hover:-translate-y-[2px]
□ Add transition-all duration-200
□ Include aria-label for accessibility
□ Test keyboard navigation
□ Check color contrast
□ Use semantic HTML
```

---

**Need Help?**
- See `DESIGN_SYSTEM_GUIDE_V2.md` for comprehensive patterns
- See `COMPONENT_PATTERNS_GUIDE.md` for code examples
- Run `examples/design-system-showcase` for interactive demos

**Version:** 2.0 | **Status:** Production Ready ✅

# Migration Guide: shadcn/ui Components

This guide helps developers migrate from custom components to official shadcn/ui components in the Clarity Chat library.

## Overview

We've integrated official shadcn/ui components alongside our custom components. The shadcn/ui versions are prefixed with `Shadcn` to distinguish them.

**Why migrate?**
- ✅ Better accessibility (WCAG 2.1 AA compliant)
- ✅ Battle-tested by thousands of projects
- ✅ Proper keyboard navigation and focus management
- ✅ Better browser compatibility
- ✅ Built on Radix UI primitives
- ✅ Less code to maintain

## Available Components

| Component | Custom (Legacy) | shadcn/ui (Recommended) | Status |
|-----------|----------------|------------------------|--------|
| Button | `Button` | `ShadcnButton` | ✅ Available |
| Dialog | `Dialog` | `ShadcnDialog` | ✅ Available |
| Dropdown Menu | `DropdownMenu` | `ShadcnDropdownMenu` | ✅ Available |
| Popover | `Popover` | `ShadcnPopover` | ✅ Available |
| Tooltip | `Tooltip` | `ShadcnTooltip` | ✅ Available |
| Checkbox | `Checkbox` | `ShadcnCheckbox` | ✅ Available |
| Drawer | `Drawer` | `ShadcnDrawer` | ✅ Available |

## Migration Examples

### Button

**Before (Custom):**
```tsx
import { Button } from '@clarity-chat/primitives'

<Button variant="default" size="lg" loading={isLoading}>
  Click me
</Button>
```

**After (shadcn/ui):**
```tsx
import { ShadcnButton } from '@clarity-chat/primitives'

<ShadcnButton variant="default" size="lg" disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Click me'}
</ShadcnButton>
```

**Note:** shadcn Button doesn't have built-in loading state. For loading states, use the custom `Button` component or add a loading indicator manually.

---

### Dialog

**Before (Custom):**
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@clarity-chat/primitives'

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogBody>
      Content here
    </DialogBody>
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**After (shadcn/ui):**
```tsx
import { ShadcnDialog, ShadcnDialogTrigger, ShadcnDialogContent, ShadcnDialogHeader, ShadcnDialogTitle, ShadcnDialogDescription, ShadcnDialogFooter } from '@clarity-chat/primitives'

<ShadcnDialog open={open} onOpenChange={setOpen}>
  <ShadcnDialogTrigger>Open</ShadcnDialogTrigger>
  <ShadcnDialogContent>
    <ShadcnDialogHeader>
      <ShadcnDialogTitle>Title</ShadcnDialogTitle>
      <ShadcnDialogDescription>Description</ShadcnDialogDescription>
    </ShadcnDialogHeader>
    <div className="p-6">
      Content here
    </div>
    <ShadcnDialogFooter>
      <Button>Action</Button>
    </ShadcnDialogFooter>
  </ShadcnDialogContent>
</ShadcnDialog>
```

**Changes:**
- Removed `DialogBody` - use a div with padding instead
- Better accessibility with proper ARIA attributes
- Built-in portal and overlay management
- ESC key handling out of the box

---

### Dropdown Menu

**Before (Custom):**
```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@clarity-chat/primitives'

<DropdownMenu>
  <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleClick}>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**After (shadcn/ui):**
```tsx
import { ShadcnDropdownMenu, ShadcnDropdownMenuTrigger, ShadcnDropdownMenuContent, ShadcnDropdownMenuItem } from '@clarity-chat/primitives'

<ShadcnDropdownMenu>
  <ShadcnDropdownMenuTrigger>Menu</ShadcnDropdownMenuTrigger>
  <ShadcnDropdownMenuContent>
    <ShadcnDropdownMenuItem onSelect={handleClick}>Item 1</ShadcnDropdownMenuItem>
    <ShadcnDropdownMenuItem>Item 2</ShadcnDropdownMenuItem>
  </ShadcnDropdownMenuContent>
</ShadcnDropdownMenu>
```

**Changes:**
- Use `onSelect` instead of `onClick` for better keyboard support
- Better positioning via Floating UI
- Supports submenus and checkbox/radio items

---

### Tooltip

**Before (Custom):**
```tsx
import { Tooltip } from '@clarity-chat/primitives'

<Tooltip content="Helpful text" side="top">
  <button>Hover me</button>
</Tooltip>
```

**After (shadcn/ui):**
```tsx
import { ShadcnTooltipProvider, ShadcnTooltip, ShadcnTooltipTrigger, ShadcnTooltipContent } from '@clarity-chat/primitives'

<ShadcnTooltipProvider>
  <ShadcnTooltip>
    <ShadcnTooltipTrigger>
      <button>Hover me</button>
    </ShadcnTooltipTrigger>
    <ShadcnTooltipContent side="top">
      Helpful text
    </ShadcnTooltipContent>
  </ShadcnTooltip>
</ShadcnTooltipProvider>
```

**Changes:**
- More verbose but more flexible
- Better accessibility with proper ARIA
- Wrap your app in `TooltipProvider` once at the root level for better performance

---

### Checkbox

**Before (Custom):**
```tsx
import { Checkbox } from '@clarity-chat/primitives'

<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  label="Accept terms"
/>
```

**After (shadcn/ui):**
```tsx
import { ShadcnCheckbox } from '@clarity-chat/primitives'

<div className="flex items-center space-x-2">
  <ShadcnCheckbox
    checked={checked}
    onCheckedChange={setChecked}
    id="terms"
  />
  <label htmlFor="terms">Accept terms</label>
</div>
```

**Changes:**
- No built-in label prop - use separate `<label>` element
- Better indeterminate state support
- Proper Radix UI primitive underneath

---

## Gradual Migration Strategy

You can migrate gradually without breaking existing code:

### Phase 1: New Features
Use shadcn/ui components for all **new features**

### Phase 2: High-Traffic Areas
Migrate **high-traffic** components (buttons, forms, dialogs)

### Phase 3: Bulk Migration
Convert remaining components in bulk

### Phase 4: Deprecate Custom
Once migration is complete, mark custom components as deprecated

## API Differences Summary

| Feature | Custom | shadcn/ui |
|---------|--------|-----------|
| Button loading state | ✅ Built-in | ❌ Manual |
| Button ripple effect | ✅ Built-in | ❌ Not available |
| Dialog body wrapper | ✅ DialogBody | ❌ Use div |
| Tooltip API | Simple (single component) | Composite (multiple components) |
| Checkbox label | ✅ Built-in prop | ❌ Separate element |
| Animations | Framer Motion | CSS animations |

## Keeping Custom Features

Some custom features aren't available in shadcn/ui. You can:

1. **Extend shadcn components** with custom features
2. **Keep using custom components** for specific features (e.g., Button ripple effect)
3. **Create wrapper components** that combine shadcn + custom features

Example wrapper:
```tsx
// LoadingButton.tsx
import { ShadcnButton } from '@clarity-chat/primitives'
import { Loader2 } from 'lucide-react'

export function LoadingButton({ loading, children, ...props }) {
  return (
    <ShadcnButton disabled={loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </ShadcnButton>
  )
}
```

## Testing After Migration

After migrating a component:

1. ✅ Run `pnpm test` to ensure all tests pass
2. ✅ Test keyboard navigation
3. ✅ Test screen reader compatibility
4. ✅ Verify visual appearance matches design
5. ✅ Check mobile/responsive behavior

## Getting Help

- **Documentation**: See [shadcn/ui docs](https://ui.shadcn.com)
- **Examples**: Check `apps/storybook` for live examples
- **Issues**: File issues in the repo if you encounter problems

## Deprecated Components (Future)

Once migration is complete, these components will be marked as deprecated:

- `Dialog` → Use `ShadcnDialog`
- `DropdownMenu` → Use `ShadcnDropdownMenu`
- `Popover` → Use `ShadcnPopover`
- `Tooltip` → Use `ShadcnTooltip`
- `Checkbox` → Use `ShadcnCheckbox`
- `Drawer` → Use `ShadcnDrawer`

The custom `Button` component will remain for its unique features (ripple, loading states).

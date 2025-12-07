# shadcn/ui Quick Reference

Quick reference for using shadcn/ui components in Clarity Chat.

## Installation in Projects

```tsx
import { 
  ShadcnButton,
  ShadcnDialog,
  ShadcnDropdownMenu,
  ShadcnTooltip,
  ShadcnCheckbox,
  ShadcnPopover,
  ShadcnDrawer
} from '@clarity-chat/primitives'
```

## Component APIs

### Button

```tsx
<ShadcnButton 
  variant="default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size="default" | "sm" | "lg" | "icon"
  disabled={boolean}
  asChild={boolean}
  onClick={() => {}}
>
  Button Text
</ShadcnButton>
```

### Dialog

```tsx
<ShadcnDialog open={open} onOpenChange={setOpen}>
  <ShadcnDialogTrigger>Open</ShadcnDialogTrigger>
  <ShadcnDialogContent>
    <ShadcnDialogHeader>
      <ShadcnDialogTitle>Title</ShadcnDialogTitle>
      <ShadcnDialogDescription>Description</ShadcnDialogDescription>
    </ShadcnDialogHeader>
    <div>Content</div>
    <ShadcnDialogFooter>
      <ShadcnButton>Action</ShadcnButton>
    </ShadcnDialogFooter>
  </ShadcnDialogContent>
</ShadcnDialog>
```

### Dropdown Menu

```tsx
<ShadcnDropdownMenu>
  <ShadcnDropdownMenuTrigger>Menu</ShadcnDropdownMenuTrigger>
  <ShadcnDropdownMenuContent>
    <ShadcnDropdownMenuItem onSelect={() => {}}>
      Item 1
    </ShadcnDropdownMenuItem>
    <ShadcnDropdownMenuSeparator />
    <ShadcnDropdownMenuItem>Item 2</ShadcnDropdownMenuItem>
  </ShadcnDropdownMenuContent>
</ShadcnDropdownMenu>
```

### Tooltip

**Important:** Wrap your app once with `TooltipProvider`

```tsx
// App level
<ShadcnTooltipProvider>
  <App />
</ShadcnTooltipProvider>

// Usage
<ShadcnTooltip>
  <ShadcnTooltipTrigger>Hover</ShadcnTooltipTrigger>
  <ShadcnTooltipContent>Info</ShadcnTooltipContent>
</ShadcnTooltip>
```

### Checkbox

```tsx
<div className="flex items-center space-x-2">
  <ShadcnCheckbox 
    id="terms"
    checked={checked}
    onCheckedChange={setChecked}
  />
  <label htmlFor="terms">Accept terms</label>
</div>
```

### Popover

```tsx
<ShadcnPopover>
  <ShadcnPopoverTrigger>Open</ShadcnPopoverTrigger>
  <ShadcnPopoverContent>
    <p>Content here</p>
  </ShadcnPopoverContent>
</ShadcnPopover>
```

### Drawer

```tsx
<ShadcnDrawer>
  <ShadcnDrawerTrigger>Open</ShadcnDrawerTrigger>
  <ShadcnDrawerContent>
    <ShadcnDrawerHeader>
      <ShadcnDrawerTitle>Title</ShadcnDrawerTitle>
      <ShadcnDrawerDescription>Description</ShadcnDrawerDescription>
    </ShadcnDrawerHeader>
    <div>Content</div>
    <ShadcnDrawerFooter>
      <ShadcnButton>Action</ShadcnButton>
    </ShadcnDrawerFooter>
  </ShadcnDrawerContent>
</ShadcnDrawer>
```

## Keyboard Shortcuts

### Dialog
- `Escape` - Close dialog
- `Tab` - Navigate focusable elements (trapped within dialog)

### Dropdown Menu
- `Space` / `Enter` - Open menu
- `↑` / `↓` - Navigate items
- `Home` / `End` - First/last item
- `Escape` - Close menu
- `Enter` / `Space` - Select item

### Tooltip
- `Hover` - Show tooltip
- `Focus` - Show tooltip (keyboard navigation)
- `Escape` - Close tooltip

## Common Patterns

### Loading Button

```tsx
function LoadingButton({ loading, children, ...props }) {
  return (
    <ShadcnButton disabled={loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </ShadcnButton>
  )
}
```

### Confirm Dialog

```tsx
function ConfirmDialog({ open, onConfirm, onCancel, title, description }) {
  return (
    <ShadcnDialog open={open} onOpenChange={onCancel}>
      <ShadcnDialogContent>
        <ShadcnDialogHeader>
          <ShadcnDialogTitle>{title}</ShadcnDialogTitle>
          <ShadcnDialogDescription>{description}</ShadcnDialogDescription>
        </ShadcnDialogHeader>
        <ShadcnDialogFooter>
          <ShadcnButton variant="outline" onClick={onCancel}>
            Cancel
          </ShadcnButton>
          <ShadcnButton onClick={onConfirm}>
            Confirm
          </ShadcnButton>
        </ShadcnDialogFooter>
      </ShadcnDialogContent>
    </ShadcnDialog>
  )
}
```

### Dropdown with Icons

```tsx
import { User, Settings, LogOut } from 'lucide-react'

<ShadcnDropdownMenu>
  <ShadcnDropdownMenuTrigger asChild>
    <ShadcnButton variant="ghost" size="icon">
      <User />
    </ShadcnButton>
  </ShadcnDropdownMenuTrigger>
  <ShadcnDropdownMenuContent align="end">
    <ShadcnDropdownMenuItem onSelect={() => {}}>
      <User className="mr-2 h-4 w-4" />
      Profile
    </ShadcnDropdownMenuItem>
    <ShadcnDropdownMenuItem onSelect={() => {}}>
      <Settings className="mr-2 h-4 w-4" />
      Settings
    </ShadcnDropdownMenuItem>
    <ShadcnDropdownMenuSeparator />
    <ShadcnDropdownMenuItem onSelect={() => {}}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </ShadcnDropdownMenuItem>
  </ShadcnDropdownMenuContent>
</ShadcnDropdownMenu>
```

## Styling

All components support Tailwind classes via `className`:

```tsx
<ShadcnButton className="bg-blue-500 hover:bg-blue-600">
  Custom Style
</ShadcnButton>
```

## Accessibility

All shadcn/ui components are:
- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigable
- ✅ Screen reader compatible
- ✅ Focus managed properly

## More Resources

- [Full Migration Guide](./MIGRATION_GUIDE_SHADCN.md)
- [Integration Report](./SHADCN_INTEGRATION_FINAL_REPORT.md)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Radix UI Docs](https://www.radix-ui.com)

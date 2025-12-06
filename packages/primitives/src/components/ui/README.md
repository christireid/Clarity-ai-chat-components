# shadcn/ui Components

This directory contains official shadcn/ui components built on Radix UI primitives.

## Components Available

| Component | Status | Radix UI Primitive | Description |
|-----------|--------|-------------------|-------------|
| `button.tsx` | ✅ | `@radix-ui/react-slot` | Button with variants and sizes |
| `checkbox.tsx` | ✅ | `@radix-ui/react-checkbox` | Checkbox with indeterminate support |
| `dialog.tsx` | ✅ | `@radix-ui/react-dialog` | Modal dialog with overlay |
| `drawer.tsx` | ✅ | `vaul` | Mobile-first drawer/sheet |
| `dropdown-menu.tsx` | ✅ | `@radix-ui/react-dropdown-menu` | Dropdown menu with keyboard nav |
| `popover.tsx` | ✅ | `@radix-ui/react-popover` | Popover with positioning |
| `tooltip.tsx` | ✅ | `@radix-ui/react-tooltip` | Tooltip with delay and hover intent |

## Usage

All components are exported from `@clarity-chat/primitives` with a `Shadcn` prefix:

```tsx
import { 
  ShadcnButton,
  ShadcnDialog,
  ShadcnDialogTrigger,
  ShadcnDialogContent,
  ShadcnDropdownMenu,
  ShadcnTooltip,
  ShadcnCheckbox,
  ShadcnPopover,
  ShadcnDrawer
} from '@clarity-chat/primitives'
```

### Example: Button

```tsx
import { ShadcnButton } from '@clarity-chat/primitives'

export function MyComponent() {
  return (
    <ShadcnButton variant="default" size="lg">
      Click Me
    </ShadcnButton>
  )
}
```

### Example: Dialog

```tsx
import {
  ShadcnDialog,
  ShadcnDialogTrigger,
  ShadcnDialogContent,
  ShadcnDialogHeader,
  ShadcnDialogTitle,
  ShadcnDialogDescription,
  ShadcnDialogFooter,
} from '@clarity-chat/primitives'

export function MyComponent() {
  return (
    <ShadcnDialog>
      <ShadcnDialogTrigger>Open</ShadcnDialogTrigger>
      <ShadcnDialogContent>
        <ShadcnDialogHeader>
          <ShadcnDialogTitle>Dialog Title</ShadcnDialogTitle>
          <ShadcnDialogDescription>
            Dialog description here
          </ShadcnDialogDescription>
        </ShadcnDialogHeader>
        <div className="p-6">Content here</div>
        <ShadcnDialogFooter>
          <ShadcnButton>Action</ShadcnButton>
        </ShadcnDialogFooter>
      </ShadcnDialogContent>
    </ShadcnDialog>
  )
}
```

### Example: Dropdown Menu

```tsx
import {
  ShadcnDropdownMenu,
  ShadcnDropdownMenuTrigger,
  ShadcnDropdownMenuContent,
  ShadcnDropdownMenuItem,
  ShadcnDropdownMenuSeparator,
} from '@clarity-chat/primitives'

export function MyComponent() {
  return (
    <ShadcnDropdownMenu>
      <ShadcnDropdownMenuTrigger>Menu</ShadcnDropdownMenuTrigger>
      <ShadcnDropdownMenuContent>
        <ShadcnDropdownMenuItem onSelect={() => console.log('Item 1')}>
          Item 1
        </ShadcnDropdownMenuItem>
        <ShadcnDropdownMenuSeparator />
        <ShadcnDropdownMenuItem>Item 2</ShadcnDropdownMenuItem>
      </ShadcnDropdownMenuContent>
    </ShadcnDropdownMenu>
  )
}
```

### Example: Tooltip

```tsx
import {
  ShadcnTooltipProvider,
  ShadcnTooltip,
  ShadcnTooltipTrigger,
  ShadcnTooltipContent,
} from '@clarity-chat/primitives'

// Wrap your app once
export function App() {
  return (
    <ShadcnTooltipProvider>
      <MyComponent />
    </ShadcnTooltipProvider>
  )
}

export function MyComponent() {
  return (
    <ShadcnTooltip>
      <ShadcnTooltipTrigger>Hover me</ShadcnTooltipTrigger>
      <ShadcnTooltipContent>
        Helpful information
      </ShadcnTooltipContent>
    </ShadcnTooltip>
  )
}
```

## Why shadcn/ui?

- ✅ **Accessible** - WCAG 2.1 AA compliant
- ✅ **Customizable** - Components are in your codebase, modify as needed
- ✅ **Composable** - Built on Radix UI primitives
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Keyboard nav** - Proper keyboard shortcuts and focus management
- ✅ **Battle-tested** - Used by thousands of projects

## Migration from Legacy Components

See [`/MIGRATION_GUIDE_SHADCN.md`](../../../MIGRATION_GUIDE_SHADCN.md) for detailed migration instructions.

## Adding New Components

To add a new shadcn/ui component:

```bash
cd packages/primitives
npx shadcn@latest add <component-name>
```

Example:
```bash
npx shadcn@latest add tabs
npx shadcn@latest add select
npx shadcn@latest add toast
```

Then update `src/index.ts` to export the new component with the `Shadcn` prefix.

## Configuration

shadcn/ui configuration is in `../../components.json`:

```json
{
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "../../tailwind.config.js",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "src/components",
    "utils": "src/lib/utils",
    "ui": "src/components/ui"
  }
}
```

## Documentation

- [shadcn/ui Official Docs](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Migration Guide](../../../MIGRATION_GUIDE_SHADCN.md)
- [Integration Report](../../../SHADCN_INTEGRATION_FINAL_REPORT.md)

## Support

For issues or questions:
1. Check the [Migration Guide](../../../MIGRATION_GUIDE_SHADCN.md)
2. See [shadcn/ui docs](https://ui.shadcn.com)
3. File an issue in the repository

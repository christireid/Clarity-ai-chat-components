# Primitives API Documentation

This document provides comprehensive API documentation for all primitive components in the Clarity Chat component library.

---

## Button

A versatile button component with enhanced UX through microanimations and state management.

### Import

```tsx
import { Button } from '@clarity-chat/primitives'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Button visual style |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |
| `children` | `React.ReactNode` | - | Button content |
| `className` | `string` | - | Additional CSS classes |
| `onClick` | `(event: React.MouseEvent<HTMLButtonElement>) => void` | - | Click handler |

### Variants

- **default**: Primary button with solid background
- **destructive**: Red button for destructive actions
- **outline**: Button with border and transparent background
- **secondary**: Secondary button with muted background
- **ghost**: Transparent button with hover background
- **link**: Text button styled as a link

### Examples

```tsx
// Default button
<Button>Click me</Button>

// Loading state
<Button loading>Processing...</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Icon button
<Button size="icon">
  <Icon />
</Button>
```

---

## Input

Text input component with support for various types and states.

### Import

```tsx
import { Input } from '@clarity-chat/primitives'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | Input type (text, email, password, etc.) |
| `variant` | `'default' \| 'error' \| 'success'` | `'default'` | Input visual state |
| `disabled` | `boolean` | `false` | Disable input |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Input value (controlled) |
| `defaultValue` | `string` | - | Default value (uncontrolled) |
| `onChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | - | Change handler |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Basic input
<Input placeholder="Enter text..." />

// Error state
<Input variant="error" placeholder="Invalid email" />

// Controlled input
<Input value={value} onChange={(e) => setValue(e.target.value)} />
```

---

## Textarea

Multi-line text input component with auto-resize support.

### Import

```tsx
import { Textarea } from '@clarity-chat/primitives'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'error' \| 'success'` | `'default'` | Textarea visual state |
| `disabled` | `boolean` | `false` | Disable textarea |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Textarea value (controlled) |
| `defaultValue` | `string` | - | Default value (uncontrolled) |
| `onChange` | `(event: React.ChangeEvent<HTMLTextAreaElement>) => void` | - | Change handler |
| `autoResize` | `boolean` | `true` | Automatically resize based on content |
| `minRows` | `number` | `3` | Minimum number of rows |
| `maxRows` | `number` | `10` | Maximum number of rows |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Basic textarea
<Textarea placeholder="Enter message..." />

// Auto-resize disabled
<Textarea autoResize={false} rows={5} />

// Controlled with error state
<Textarea variant="error" value={value} onChange={(e) => setValue(e.target.value)} />
```

---

## Card

Flexible container component for grouping related content.

### Import

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@clarity-chat/primitives'
```

### Components

- `Card`: Root container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Description text
- `CardContent`: Main content area
- `CardFooter`: Footer section

### Props

#### Card

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## Badge

Small status indicator component.

### Import

```tsx
import { Badge } from '@clarity-chat/primitives'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'success' \| 'warning' \| 'info'` | `'default'` | Badge visual style |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` | Badge size |
| `children` | `React.ReactNode` | - | Badge content |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
<Badge>New</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="success">Active</Badge>
```

---

## Dialog

Modal dialog component for displaying content in an overlay.

### Import

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@clarity-chat/primitives'
```

### Components

- `Dialog`: Root component
- `DialogTrigger`: Trigger button
- `DialogContent`: Dialog content container
- `DialogHeader`: Header section
- `DialogTitle`: Title text
- `DialogDescription`: Description text
- `DialogFooter`: Footer section
- `DialogClose`: Close button

### Props

#### Dialog

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open state change handler |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |

### Examples

```tsx
<Dialog>
  <DialogTrigger>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <p>Dialog content</p>
    <DialogFooter>
      <Button>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Tooltip

Tooltip component for displaying helpful information on hover.

### Import

```tsx
import { Tooltip } from '@clarity-chat/primitives'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `React.ReactNode` | - | Tooltip content |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Tooltip position |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Tooltip alignment |
| `delay` | `number` | `200` | Delay in milliseconds before showing |
| `showArrow` | `boolean` | `true` | Show arrow indicator |
| `disabled` | `boolean` | `false` | Disable tooltip |
| `children` | `React.ReactNode` | - | Trigger element |

### Examples

```tsx
<Tooltip content="This is a helpful tooltip">
  <Button>Hover me</Button>
</Tooltip>
```

---

## Popover

Popover component for displaying floating content.

### Import

```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@clarity-chat/primitives'
```

### Props

#### Popover

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open state change handler |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |

#### PopoverContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Popover position |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Popover alignment |
| `showArrow` | `boolean` | `true` | Show arrow indicator |
| `sideOffset` | `number` | `4` | Distance from trigger |
| `alignOffset` | `number` | `0` | Alignment offset |

### Examples

```tsx
<Popover>
  <PopoverTrigger>
    <Button>Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Popover content</p>
  </PopoverContent>
</Popover>
```

---

## DropdownMenu

Dropdown menu component for displaying a list of actions.

### Import

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@clarity-chat/primitives'
```

### Examples

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Item 3</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Avatar

Avatar component for displaying user profile pictures or initials.

### Import

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@clarity-chat/primitives'
```

### Props

#### Avatar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Avatar size |
| `className` | `string` | - | Additional CSS classes |

#### AvatarImage

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source URL |
| `alt` | `string` | - | Alt text |

#### AvatarFallback

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Fallback content (usually initials) |

### Examples

```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Drawer

Drawer component for displaying content in a slide-out panel.

### Import

```tsx
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@clarity-chat/primitives'
```

### Examples

```tsx
<Drawer>
  <DrawerTrigger>
    <Button>Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Drawer Title</DrawerTitle>
      <DrawerDescription>Drawer description</DrawerDescription>
    </DrawerHeader>
    <p>Drawer content</p>
    <DrawerFooter>
      <Button>Close</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

---

## ErrorMessage

Error message component for displaying form validation errors.

### Import

```tsx
import { ErrorMessage } from '@clarity-chat/primitives'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `string \| undefined` | - | Error message to display |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
<ErrorMessage error="This field is required" />
```

---

## Checkbox

Checkbox input component for binary selection.

### Import

```tsx
import { Checkbox } from '@clarity-chat/primitives'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Checked state (controlled) |
| `defaultChecked` | `boolean` | `false` | Default checked state (uncontrolled) |
| `disabled` | `boolean` | `false` | Disable checkbox |
| `onChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | - | Change handler |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />
```

---

## ScrollArea

Scrollable container component with custom scrollbar styling.

### Import

```tsx
import { ScrollArea } from '@clarity-chat/primitives'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Content to scroll |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
<ScrollArea className="h-[300px]">
  <div>Long content...</div>
</ScrollArea>
```

---

## Design Tokens

All primitive components use consistent design tokens:

- **Border Radius**: `rounded-lg` (8px)
- **Transitions**: `duration-150` (150ms)
- **Shadows**: Layered shadow system using `rgb(0_0_0_/_0.05)`
- **Borders**: 1px (`border`) with opacity (`border-border/50`)
- **Focus Rings**: `ring-ring/50` with offset

---

## Accessibility

All primitive components follow accessibility best practices:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

---

## TypeScript Support

All components are fully typed with TypeScript. Import types as needed:

```tsx
import type { ButtonProps, InputProps } from '@clarity-chat/primitives'
```

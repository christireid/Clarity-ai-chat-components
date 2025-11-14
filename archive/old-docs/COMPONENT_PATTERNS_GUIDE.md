# 📖 Component Patterns Guide

**Quick Reference for Building with Clarity Chat Components**

---

## 🚀 Quick Start Patterns

### Basic Button

```tsx
import { Button } from '@clarity-chat/primitives'

// Primary action
<Button variant="primary">Save Changes</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// With icon
<Button>
  <svg className="w-4 h-4" />
  Click Me
</Button>

// Loading state
<Button loading>Processing...</Button>
```

### Form Input

```tsx
import { Input } from '@clarity-chat/primitives'

// Basic input
<Input placeholder="Enter text..." />

// With label
<div className="space-y-2">
  <label className="text-sm font-medium">Email</label>
  <Input type="email" placeholder="you@example.com" />
</div>

// With error
<Input 
  className="ring-destructive/50" 
  placeholder="Invalid input"
/>
<p className="text-sm text-destructive mt-1">This field is required</p>

// Disabled
<Input disabled placeholder="Disabled" />
```

### Interactive Card

```tsx
import { Card } from '@clarity-chat/primitives'

// Basic card
<Card className="p-6">
  <h3 className="font-semibold mb-2">Card Title</h3>
  <p className="text-sm text-muted-foreground">Card content goes here</p>
</Card>

// Clickable card with hover effect
<Card 
  className="p-6 cursor-pointer transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px]"
  onClick={handleClick}
>
  <h3 className="font-semibold mb-2">Interactive Card</h3>
  <p className="text-sm text-muted-foreground">Click me!</p>
</Card>

// Selected card
<Card className="p-6 ring-2 ring-primary/50 shadow-sm">
  <h3 className="font-semibold mb-2">Selected Card</h3>
  <p className="text-sm text-muted-foreground">Currently active</p>
</Card>
```

---

## 🎨 Design Pattern Recipes

### Hover Effect Pattern

```tsx
// Standard hover lift
className="transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px]"

// Stronger hover
className="transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:scale-105"

// Background change hover
className="transition-all duration-200 hover:bg-muted/30"

// Combined effects
className="transition-all duration-200 hover:bg-muted/30 hover:shadow-sm hover:-translate-y-[2px]"
```

### Focus State Pattern

```tsx
// Standard focus ring (3px, 50% opacity)
className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1"

// High contrast focus (for accessibility)
className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary focus-visible:ring-offset-2"

// Focus with background
className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:bg-accent/50"
```

### Loading State Pattern

```tsx
// Spinner
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
/>

// Pulse
<div className="animate-pulse space-y-2">
  <div className="h-4 bg-muted/50 rounded-sm" />
  <div className="h-4 bg-muted/50 rounded-sm w-3/4" />
</div>

// Skeleton
import { Skeleton } from '@clarity-chat/react'
<Skeleton className="h-24 w-full" />
```

### Empty State Pattern

```tsx
import { EmptyState } from '@clarity-chat/react'

<EmptyState
  icon={<svg className="w-12 h-12" />}
  title="No messages yet"
  description="Start a conversation to see messages here"
  action={
    <Button onClick={startConversation}>
      Start Chatting
    </Button>
  }
/>
```

---

## 🧩 Composition Patterns

### Form Layout

```tsx
<div className="space-y-6">
  {/* Header */}
  <div>
    <h2 className="text-2xl font-bold">Form Title</h2>
    <p className="text-sm text-muted-foreground">Description text</p>
  </div>

  {/* Fields */}
  <div className="space-y-4">
    <div className="space-y-2">
      <label className="text-sm font-medium">Field Label</label>
      <Input placeholder="Enter value..." />
    </div>
    
    <div className="space-y-2">
      <label className="text-sm font-medium">Another Field</label>
      <Input placeholder="Enter value..." />
    </div>
  </div>

  {/* Actions */}
  <div className="flex items-center justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Submit</Button>
  </div>
</div>
```

### Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <Card 
      key={item.id}
      className="p-6 transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px] cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          {item.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      </div>
    </Card>
  ))}
</div>
```

### List with Actions

```tsx
<div className="space-y-2">
  {items.map((item) => (
    <div
      key={item.id}
      className="flex items-center justify-between p-4 rounded-lg ring-1 ring-border/30 bg-card transition-all duration-200 hover:bg-muted/30"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {item.icon}
        </div>
        <div>
          <div className="font-medium">{item.title}</div>
          <div className="text-sm text-muted-foreground">{item.subtitle}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">Edit</Button>
        <Button variant="ghost" size="sm">Delete</Button>
      </div>
    </div>
  ))}
</div>
```

---

## 🎯 Common Use Cases

### Modal Dialog

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@clarity-chat/primitives'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    
    <div className="space-y-4 py-4">
      <p className="text-sm text-muted-foreground">
        Dialog content goes here
      </p>
    </div>
    
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>
        Confirm
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

### Toast Notification

```tsx
import { useToast } from '@clarity-chat/react'

const { success, error, info } = useToast()

// Success notification
success('Changes saved successfully!')

// Error notification
error('Something went wrong', 'Error')

// Info notification
info('New update available', 'Info')
```

### Tooltip

```tsx
import { Tooltip } from '@clarity-chat/primitives'

<Tooltip content="Helpful tip text">
  <Button>Hover me</Button>
</Tooltip>

// With custom delay
<Tooltip content="Appears after 500ms" delay={500}>
  <Button>Hover me</Button>
</Tooltip>
```

### Dropdown Menu

```tsx
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem 
} from '@clarity-chat/primitives'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleEdit}>
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleDuplicate}>
      Duplicate
    </DropdownMenuItem>
    <DropdownMenuItem destructive onClick={handleDelete}>
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## ⚡ Performance Patterns

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react'
import { Skeleton } from '@clarity-chat/react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Skeleton className="h-64 w-full" />}>
  <HeavyComponent />
</Suspense>
```

### Memoized Components

```tsx
import { memo } from 'react'

const ExpensiveCard = memo(({ data }: { data: Data }) => {
  return (
    <Card className="p-6">
      {/* Component content */}
    </Card>
  )
})
```

### Virtualized Lists

```tsx
import { VirtualizedMessageList } from '@clarity-chat/react'

<VirtualizedMessageList
  messages={messages}
  renderMessage={(message) => (
    <Message key={message.id} {...message} />
  )}
/>
```

---

## 🎨 Theming Patterns

### Custom Theme Variables

```css
:root {
  --radius: 0.5rem;
  
  /* Custom shadow */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.03);
  
  /* Custom colors */
  --brand-primary: 221.2 83.2% 53.3%;
  --brand-secondary: 210 40% 96.1%;
}
```

### Dark Mode Toggle

```tsx
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()

<Button 
  variant="ghost" 
  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
>
  {theme === 'dark' ? '☀️' : '🌙'}
</Button>
```

---

## 📱 Responsive Patterns

### Mobile-First Layout

```tsx
<div className="container mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
    {/* Content */}
  </div>
</div>
```

### Responsive Typography

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>

<p className="text-sm md:text-base lg:text-lg text-muted-foreground">
  Responsive body text
</p>
```

---

## ♿ Accessibility Patterns

### Keyboard Navigation

```tsx
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleAction()
    }
  }}
  role="button"
  tabIndex={0}
  aria-label="Descriptive label"
>
  Click or press Enter/Space
</button>
```

### Screen Reader Support

```tsx
<div
  role="alert"
  aria-live="polite"
  aria-atomic="true"
>
  Status update for screen readers
</div>

<button aria-label="Close dialog">
  <svg aria-hidden="true" />
</button>
```

---

## 🎉 Animation Patterns

### Entrance Animations

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Hover Animations

```tsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Animated Button
</motion.button>
```

---

## 📚 Best Practices

1. **Always use ring instead of border** for better composability
2. **Prefer shadow-xs for default states**, shadow-sm for hover
3. **Use rounded-md for most interactive elements**, rounded-lg for containers
4. **Apply focus-visible, not focus** for better keyboard UX
5. **Use precise values** like `-translate-y-[2px]` instead of generic classes
6. **Maintain consistent opacity** with /10, /30, /50 scale
7. **Add transition-all duration-200** for smooth interactions
8. **Include aria-labels** for accessibility
9. **Test keyboard navigation** on all interactive elements
10. **Use semantic HTML** (button, nav, article) when possible

---

**For more examples, see the Design System Showcase:**
```bash
cd examples/design-system-showcase
npm install
npm run dev
```

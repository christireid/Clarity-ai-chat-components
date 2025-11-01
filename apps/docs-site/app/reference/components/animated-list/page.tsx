import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Animated List',
  description: 'Pre-configured AnimatePresence wrappers for list animations with stagger effects, fade, slide, and scale transitions.',
}

# Animated List

A collection of pre-configured AnimatePresence wrappers for common list animation patterns including stagger effects, fade, slide, and scale transitions.

## Overview

The Animated List family provides seven animation components designed for lists, grids, and conditional rendering:
- **AnimatedList** - Container for list items with stagger
- **AnimatedListItem** - Individual animated list item
- **FadePresence** - Fade in/out wrapper
- **SlidePresence** - Slide in/out wrapper
- **ScalePresence** - Scale in/out wrapper
- **ConditionalPresence** - Show/hide with animation
- **AnimatedGrid** - Grid with stagger animation

### Key Features

- **Stagger Effects** - Sequential animations (fast, normal, slow, slower)
- **3 Animation Types** - Fade, slide, scale
- **Layout Animations** - Smooth reordering with Framer Motion
- **Conditional Rendering** - AnimatePresence integration
- **Grid Support** - Animated grid layouts
- **Customizable Duration** - Fast, normal, slow timing
- **Direction Support** - Slide from any direction (up, down, left, right)
- **Zero Configuration** - Works out of the box with sensible defaults

## Installation

```bash
npm install @clarity-chat/react @clarity-chat/primitives framer-motion
```

## AnimatedList & AnimatedListItem

Container and item components for staggered list animations.

### Basic Usage

```tsx
import { AnimatedList, AnimatedListItem } from '@clarity-chat/react'

const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']

export default function MyList() {
  return (
    <AnimatedList>
      {items.map((item, index) => (
        <AnimatedListItem key={index}>
          <div className="p-4 border rounded">{item}</div>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  )
}
```

### AnimatedList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | List items to animate |
| `variant` | `'slide' \| 'fade' \| 'scale'` | `'slide'` | Animation type |
| `stagger` | `'fast' \| 'normal' \| 'slow' \| 'slower'` | `'normal'` | Stagger timing between items |
| `duration` | `'fast' \| 'normal' \| 'slow'` | `'fast'` | Animation duration per item |
| `delay` | `number` | `0` | Delay before starting (seconds) |
| `className` | `string` | `undefined` | Container CSS classes |

### AnimatedListItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Item content |
| `variant` | `'slide' \| 'fade' \| 'scale'` | `'slide'` | Animation type |
| `duration` | `'fast' \| 'normal' \| 'slow'` | `'fast'` | Animation duration |
| `layout` | `boolean` | `false` | Enable layout animations for reordering |
| `className` | `string` | `undefined` | Item CSS classes |

### Stagger Timings

```tsx
// Fast stagger (0.05s between items)
<AnimatedList stagger="fast">
  {items.map(item => <AnimatedListItem key={item.id}>{item}</AnimatedListItem>)}
</AnimatedList>

// Normal stagger (0.1s between items)
<AnimatedList stagger="normal">
  {items.map(item => <AnimatedListItem key={item.id}>{item}</AnimatedListItem>)}
</AnimatedList>

// Slow stagger (0.15s between items)
<AnimatedList stagger="slow">
  {items.map(item => <AnimatedListItem key={item.id}>{item}</AnimatedListItem>)}
</AnimatedList>

// Slower stagger (0.2s between items)
<AnimatedList stagger="slower">
  {items.map(item => <AnimatedListItem key={item.id}>{item}</AnimatedListItem>)}
</AnimatedList>
```

### Animation Variants

```tsx
// Slide (default)
<AnimatedListItem variant="slide">
  Slides up from below
</AnimatedListItem>

// Fade
<AnimatedListItem variant="fade">
  Fades in smoothly
</AnimatedListItem>

// Scale
<AnimatedListItem variant="scale">
  Scales up from 90%
</AnimatedListItem>
```

### Layout Animation

Enable smooth reordering:

```tsx
<AnimatedList>
  {sortedItems.map(item => (
    <AnimatedListItem key={item.id} layout>
      {item.name}
    </AnimatedListItem>
  ))}
</AnimatedList>
```

## FadePresence

Simple fade in/out wrapper for conditional content.

### Basic Usage

```tsx
import { FadePresence } from '@clarity-chat/react'

<FadePresence>
  <div>This content fades in and out</div>
</FadePresence>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Content to animate |
| `duration` | `'fast' \| 'normal' \| 'slow'` | `'normal'` | Animation duration |
| `className` | `string` | `undefined` | Container CSS classes |

### Example: Loading State

```tsx
'use client'

import { useState } from 'react'
import { FadePresence } from '@clarity-chat/react'

export default function LoadingExample() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading ? (
        <FadePresence>
          <div>Loading...</div>
        </FadePresence>
      ) : (
        <FadePresence>
          <div>Content loaded!</div>
        </FadePresence>
      )}
    </>
  )
}
```

## SlidePresence

Slide in/out wrapper with directional control.

### Basic Usage

```tsx
import { SlidePresence } from '@clarity-chat/react'

<SlidePresence direction="up">
  <div>Slides up from below</div>
</SlidePresence>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Content to animate |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Slide direction |
| `distance` | `number` | `20` | Slide distance in pixels |
| `duration` | `'fast' \| 'normal' \| 'slow'` | `'normal'` | Animation duration |
| `className` | `string` | `undefined` | Container CSS classes |

### Directional Slides

```tsx
// Slide from bottom
<SlidePresence direction="up" distance={30}>
  <div>Slides up</div>
</SlidePresence>

// Slide from top
<SlidePresence direction="down" distance={30}>
  <div>Slides down</div>
</SlidePresence>

// Slide from right
<SlidePresence direction="left" distance={40}>
  <div>Slides left</div>
</SlidePresence>

// Slide from left
<SlidePresence direction="right" distance={40}>
  <div>Slides right</div>
</SlidePresence>
```

## ScalePresence

Scale in/out wrapper with configurable initial scale.

### Basic Usage

```tsx
import { ScalePresence } from '@clarity-chat/react'

<ScalePresence>
  <div>Scales up from 90%</div>
</ScalePresence>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Content to animate |
| `initialScale` | `number` | `0.9` | Initial scale (0-1) |
| `duration` | `'fast' \| 'normal' \| 'slow'` | `'fast'` | Animation duration |
| `className` | `string` | `undefined` | Container CSS classes |

### Custom Scale

```tsx
// Subtle scale (from 95%)
<ScalePresence initialScale={0.95}>
  <div>Subtle scale</div>
</ScalePresence>

// Dramatic scale (from 50%)
<ScalePresence initialScale={0.5}>
  <div>Dramatic scale</div>
</ScalePresence>

// Grow from nothing (from 0%)
<ScalePresence initialScale={0}>
  <div>Pop in</div>
</ScalePresence>
```

## ConditionalPresence

Show/hide content with animation based on condition.

### Basic Usage

```tsx
import { ConditionalPresence } from '@clarity-chat/react'

<ConditionalPresence show={isVisible}>
  <div>Only visible when isVisible is true</div>
</ConditionalPresence>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Content to conditionally show |
| `show` | `boolean` | **Required** | Whether to show content |
| `variant` | `'fade' \| 'slide' \| 'scale'` | `'fade'` | Animation type |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Slide direction (if variant is 'slide') |
| `className` | `string` | `undefined` | Container CSS classes |

### Example: Conditional Alert

```tsx
'use client'

import { useState } from 'react'
import { ConditionalPresence } from '@clarity-chat/react'

export default function AlertExample() {
  const [showAlert, setShowAlert] = useState(false)

  return (
    <div>
      <button onClick={() => setShowAlert(!showAlert)}>
        Toggle Alert
      </button>

      <ConditionalPresence show={showAlert} variant="slide" direction="down">
        <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded">
          This is an alert message!
        </div>
      </ConditionalPresence>
    </div>
  )
}
```

## AnimatedGrid

Grid layout with stagger animation for items.

### Basic Usage

```tsx
import { AnimatedGrid, AnimatedListItem } from '@clarity-chat/react'

const items = Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`)

export default function GridExample() {
  return (
    <AnimatedGrid columns={3} gap={4}>
      {items.map((item, index) => (
        <AnimatedListItem key={index} variant="scale">
          <div className="p-6 border rounded">{item}</div>
        </AnimatedListItem>
      ))}
    </AnimatedGrid>
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Grid items |
| `columns` | `number` | `3` | Number of columns |
| `gap` | `number` | `4` | Gap between items (Tailwind scale) |
| `stagger` | `'fast' \| 'normal' \| 'slow' \| 'slower'` | `'fast'` | Stagger timing |
| `className` | `string` | `undefined` | Container CSS classes |

## Complete Example: Animated Todo List

```tsx
'use client'

import { useState } from 'react'
import { AnimatedList, AnimatedListItem } from '@clarity-chat/react'
import { TrashIcon } from '@clarity-chat/react/icons'

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Learn Framer Motion', completed: false },
    { id: '2', text: 'Build animated components', completed: false },
    { id: '3', text: 'Ship to production', completed: false },
  ])

  const removeTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  return (
    <div className="max-w-md">
      <AnimatedList stagger="normal">
        {todos.map((todo) => (
          <AnimatedListItem
            key={todo.id}
            variant="slide"
            layout
            className="mb-2"
          >
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-white">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5"
              />
              <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="ml-auto text-destructive hover:bg-destructive/10 p-2 rounded"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </div>
  )
}
```

## Complete Example: Image Gallery Grid

```tsx
'use client'

import { AnimatedGrid, AnimatedListItem } from '@clarity-chat/react'

const images = [
  'https://picsum.photos/seed/1/400/300',
  'https://picsum.photos/seed/2/400/300',
  'https://picsum.photos/seed/3/400/300',
  'https://picsum.photos/seed/4/400/300',
  'https://picsum.photos/seed/5/400/300',
  'https://picsum.photos/seed/6/400/300',
]

export default function ImageGallery() {
  return (
    <AnimatedGrid columns={3} gap={4} stagger="fast">
      {images.map((src, index) => (
        <AnimatedListItem key={index} variant="scale">
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={src}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        </AnimatedListItem>
      ))}
    </AnimatedGrid>
  )
}
```

## Complete Example: Notification Center

```tsx
'use client'

import { useState } from 'react'
import { AnimatedList, AnimatedListItem } from '@clarity-chat/react'
import { Bell, CheckIcon, XIcon } from '@clarity-chat/react/icons'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'New message', message: 'You have a new message from John', time: '2m ago', read: false },
    { id: '2', title: 'Task completed', message: 'Your export is ready to download', time: '1h ago', read: false },
    { id: '3', title: 'Update available', message: 'Version 2.0 is now available', time: '3h ago', read: true },
  ])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={20} />
        <h2 className="text-lg font-semibold">Notifications</h2>
        <span className="ml-auto text-sm text-muted-foreground">
          {notifications.filter(n => !n.read).length} unread
        </span>
      </div>

      <AnimatedList stagger="normal">
        {notifications.map((notification) => (
          <AnimatedListItem
            key={notification.id}
            variant="slide"
            layout
            className="mb-2"
          >
            <div
              className={`p-4 border rounded-lg ${
                notification.read ? 'bg-muted/50' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-medium">{notification.title}</h3>
                <div className="flex gap-1">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <CheckIcon size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => dismiss(notification.id)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {notification.message}
              </p>
              <span className="text-xs text-muted-foreground">
                {notification.time}
              </span>
            </div>
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </div>
  )
}
```

## Animation Details

### Stagger Container Variants

```typescript
// Fast stagger (0.05s)
delayChildren: 0
staggerChildren: 0.05

// Normal stagger (0.1s)
delayChildren: 0
staggerChildren: 0.1

// Slow stagger (0.15s)
delayChildren: 0
staggerChildren: 0.15

// Slower stagger (0.2s)
delayChildren: 0
staggerChildren: 0.2
```

### Child Animation Variants

```typescript
// Slide variant
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
exit: { opacity: 0, y: -20 }

// Fade variant
initial: { opacity: 0 }
animate: { opacity: 1 }
exit: { opacity: 0 }

// Scale variant
initial: { opacity: 0, scale: 0.9 }
animate: { opacity: 1, scale: 1 }
exit: { opacity: 0, scale: 0.9 }
```

## TypeScript Support

Full TypeScript support with comprehensive types:

```typescript
import type {
  AnimatedListProps,
  AnimatedListItemProps,
  AnimationDuration,
  StaggerTiming,
} from '@clarity-chat/react'

// Duration types
type AnimationDuration = 'fast' | 'normal' | 'slow'

// Stagger timing types
type StaggerTiming = 'fast' | 'normal' | 'slow' | 'slower'

// Animation variants
type AnimationVariant = 'slide' | 'fade' | 'scale'

// Direction types
type Direction = 'up' | 'down' | 'left' | 'right'
```

## Accessibility

Animated list components respect user preferences:

- **Reduced Motion** - Respects `prefers-reduced-motion`
- **Semantic HTML** - Uses appropriate HTML elements
- **No Motion Sickness** - Smooth, comfortable animations
- **Performance** - GPU-accelerated transforms
- **Keyboard Navigation** - No interference with keyboard controls

### Reduced Motion Example

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

<AnimatedList stagger={prefersReducedMotion ? 'fast' : 'normal'}>
  {items.map(item => <AnimatedListItem key={item.id}>{item}</AnimatedListItem>)}
</AnimatedList>
```

## Styling

All components accept className for custom styling:

```tsx
<AnimatedList className="space-y-4">
  <AnimatedListItem className="p-4 bg-blue-50 rounded-lg">
    Custom styled item
  </AnimatedListItem>
</AnimatedList>
```

## Related Components

- **[Empty State](../empty-state)** - Can use animated lists
- **[Message List](../message-list)** - Uses AnimatedList internally
- **[Interactive Card](../interactive-card)** - Works well with AnimatedListItem
- **[Loading Indicator](../loading-indicator)** - Loading states

## Best Practices

### 1. Match Variant Between Parent and Child

```tsx
// ✅ Good - matching variants
<AnimatedList variant="fade">
  <AnimatedListItem variant="fade">Item</AnimatedListItem>
</AnimatedList>

// ❌ Bad - mismatched variants
<AnimatedList variant="slide">
  <AnimatedListItem variant="fade">Item</AnimatedListItem>
</AnimatedList>
```

### 2. Use Layout Animation for Reordering

```tsx
// ✅ Good - smooth reordering
<AnimatedListItem layout>
  {item.name}
</AnimatedListItem>

// ❌ Bad - jumpy reordering
<AnimatedListItem>
  {item.name}
</AnimatedListItem>
```

### 3. Choose Appropriate Stagger Speed

```tsx
// ✅ Good - fast for short lists
<AnimatedList stagger="fast">
  {shortList.map(...)}
</AnimatedList>

// ✅ Good - normal for medium lists
<AnimatedList stagger="normal">
  {mediumList.map(...)}
</AnimatedList>

// ❌ Bad - slow for long lists (takes forever)
<AnimatedList stagger="slower">
  {longList.map(...)}  {/* 100 items */}
</AnimatedList>
```

### 4. Use Unique Keys

```tsx
// ✅ Good - stable unique keys
<AnimatedListItem key={item.id}>
  {item.name}
</AnimatedListItem>

// ❌ Bad - index as key (breaks animations)
<AnimatedListItem key={index}>
  {item.name}
</AnimatedListItem>
```

### 5. Limit Animation Duration

```tsx
// ✅ Good - fast animations for lists
<AnimatedListItem duration="fast">
  Quick animation
</AnimatedListItem>

// ❌ Bad - slow animations feel sluggish
<AnimatedListItem duration="slow">
  Feels too slow
</AnimatedListItem>
```

### 6. Consider Performance

```tsx
// ✅ Good - reasonable list size
{items.slice(0, 50).map(item => (
  <AnimatedListItem key={item.id}>{item}</AnimatedListItem>
))}

// ❌ Bad - too many animated items
{items.map(item => (  // 1000+ items
  <AnimatedListItem key={item.id}>{item}</AnimatedListItem>
))}
```

## Use Cases

### 1. Todo Lists

Animated task management:

```tsx
<AnimatedList stagger="normal">
  {todos.map(todo => (
    <AnimatedListItem key={todo.id} layout>
      <TodoItem {...todo} />
    </AnimatedListItem>
  ))}
</AnimatedList>
```

### 2. Notification Lists

Smooth notification display:

```tsx
<AnimatedList stagger="fast">
  {notifications.map(n => (
    <AnimatedListItem key={n.id} variant="slide">
      <Notification {...n} />
    </AnimatedListItem>
  ))}
</AnimatedList>
```

### 3. Search Results

Animated result display:

```tsx
<AnimatedList stagger="fast">
  {results.map(result => (
    <AnimatedListItem key={result.id} variant="fade">
      <SearchResult {...result} />
    </AnimatedListItem>
  ))}
</AnimatedList>
```

### 4. Image Galleries

Grid-based galleries:

```tsx
<AnimatedGrid columns={4} stagger="fast">
  {images.map((img, i) => (
    <AnimatedListItem key={i} variant="scale">
      <img src={img} alt="" />
    </AnimatedListItem>
  ))}
</AnimatedGrid>
```

### 5. Message History

Chat message animations:

```tsx
<AnimatedList stagger="fast">
  {messages.map(msg => (
    <AnimatedListItem key={msg.id} variant="slide">
      <Message {...msg} />
    </AnimatedListItem>
  ))}
</AnimatedList>
```

## Performance Tips

### 1. Virtualize Long Lists

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

// Only render visible items
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 60,
})
```

### 2. Memoize List Items

```tsx
const MemoizedItem = React.memo(({ item }) => (
  <AnimatedListItem key={item.id}>
    {item.name}
  </AnimatedListItem>
))
```

### 3. Reduce Motion for Accessibility

```tsx
const { reducedMotion } = useMotion()

<AnimatedList stagger={reducedMotion ? 'fast' : 'normal'}>
  {items.map(...)}
</AnimatedList>
```

---

**Related Documentation:**
- [Empty State](../empty-state)
- [Message List](../message-list)
- [Interactive Card](../interactive-card)
- [Loading Indicator](../loading-indicator)

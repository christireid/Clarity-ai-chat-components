import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Skeleton Loaders',
  description: 'Loading placeholder components with shimmer and pulse animations for displaying content structure while data loads.',
}

# Skeleton Loaders

Loading placeholder components with shimmer and pulse animations. Used to show content structure while data is loading, providing better perceived performance.

## Overview

The Skeleton family provides 10 loading placeholder components:
- **Skeleton** - Base skeleton with customizable dimensions
- **SkeletonText** - Multi-line text placeholder
- **SkeletonAvatar** - Circular avatar placeholder
- **SkeletonMessage** - Chat message placeholder
- **SkeletonCard** - Card with image, header, body, footer
- **SkeletonList** - List of items with avatars
- **SkeletonButton** - Button placeholder
- **SkeletonInput** - Input field with optional label
- **SkeletonChatWindow** - Complete chat interface skeleton

### Key Features

- **3 Animation Variants** - Shimmer, pulse, or none
- **Customizable Dimensions** - Width, height, rounded corners
- **Pre-built Components** - Common UI patterns ready to use
- **Consistent Styling** - Matches theme automatically
- **Responsive** - Adapts to container size
- **Accessible** - Semantic HTML with ARIA attributes
- **Performance** - GPU-accelerated animations
- **Composable** - Build custom skeletons easily

## Installation

```bash
npm install @clarity-chat/react @clarity-chat/primitives framer-motion
```

## Skeleton (Base Component)

The foundational skeleton component with customizable properties.

### Basic Usage

```tsx
import { Skeleton } from '@clarity-chat/react'

<Skeleton width={200} height={20} />
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'pulse' \| 'shimmer' \| 'none'` | `'shimmer'` | Animation type |
| `width` | `string \| number` | `undefined` | Width (CSS value or px) |
| `height` | `string \| number` | `undefined` | Height (CSS value or px) |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Border radius |
| `className` | `string` | `undefined` | Additional CSS classes |

### Animation Variants

```tsx
// Shimmer effect (default) - horizontal light sweep
<Skeleton variant="shimmer" width={200} height={20} />

// Pulse effect - opacity fade in/out
<Skeleton variant="pulse" width={200} height={20} />

// No animation - static placeholder
<Skeleton variant="none" width={200} height={20} />
```

### Rounded Corners

```tsx
<Skeleton rounded="none" width={200} height={20} />    // Square corners
<Skeleton rounded="sm" width={200} height={20} />      // Small radius
<Skeleton rounded="md" width={200} height={20} />      // Medium radius (default)
<Skeleton rounded="lg" width={200} height={20} />      // Large radius
<Skeleton rounded="full" width={40} height={40} />     // Circle/pill
```

## SkeletonText

Multi-line text placeholder with customizable line count and width.

### Basic Usage

```tsx
import { SkeletonText } from '@clarity-chat/react'

<SkeletonText lines={3} />
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lines` | `number` | `3` | Number of lines |
| `lineHeight` | `number` | `16` | Height of each line (px) |
| `gap` | `number` | `8` | Gap between lines (px) |
| `lastLineWidth` | `number` | `70` | Last line width (%) |
| `variant` | `'pulse' \| 'shimmer' \| 'none'` | `'shimmer'` | Animation type |
| `className` | `string` | `undefined` | Additional CSS classes |

### Examples

```tsx
// Short paragraph
<SkeletonText lines={2} lastLineWidth={80} />

// Long article
<SkeletonText lines={8} lastLineWidth={60} />

// Custom line height
<SkeletonText lines={4} lineHeight={20} gap={12} />
```

## SkeletonAvatar

Circular avatar/profile picture placeholder.

### Basic Usage

```tsx
import { SkeletonAvatar } from '@clarity-chat/react'

<SkeletonAvatar size={40} />
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `40` | Avatar size in pixels |
| `variant` | `'pulse' \| 'shimmer' \| 'none'` | `'shimmer'` | Animation type |
| `className` | `string` | `undefined` | Additional CSS classes |

### Examples

```tsx
<SkeletonAvatar size={24} />   // Small
<SkeletonAvatar size={40} />   // Medium (default)
<SkeletonAvatar size={64} />   // Large
<SkeletonAvatar size={96} />   // Extra large
```

## SkeletonMessage

Chat message bubble placeholder with avatar and text.

### Basic Usage

```tsx
import { SkeletonMessage } from '@clarity-chat/react'

<SkeletonMessage role="assistant" lines={3} />
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `role` | `'user' \| 'assistant'` | `'assistant'` | Message alignment |
| `showAvatar` | `boolean` | `true` | Show avatar |
| `lines` | `number` | `3` | Number of text lines |
| `variant` | `'pulse' \| 'shimmer' \| 'none'` | `'shimmer'` | Animation type |
| `className` | `string` | `undefined` | Additional CSS classes |

### Examples

```tsx
// Assistant message (left-aligned)
<SkeletonMessage role="assistant" lines={4} />

// User message (right-aligned)
<SkeletonMessage role="user" lines={2} />

// Without avatar
<SkeletonMessage role="assistant" showAvatar={false} />
```

## SkeletonCard

Card component skeleton with image, header, body, and footer.

### Basic Usage

```tsx
import { SkeletonCard } from '@clarity-chat/react'

<SkeletonCard />
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showImage` | `boolean` | `true` | Show image placeholder |
| `imageHeight` | `number` | `200` | Image height (px) |
| `showHeader` | `boolean` | `true` | Show header (title/subtitle) |
| `bodyLines` | `number` | `3` | Number of body text lines |
| `showFooter` | `boolean` | `true` | Show footer actions |
| `variant` | `'pulse' \| 'shimmer' \| 'none'` | `'shimmer'` | Animation type |
| `className` | `string` | `undefined` | Additional CSS classes |

### Examples

```tsx
// Full card
<SkeletonCard />

// Article card (no footer)
<SkeletonCard showFooter={false} bodyLines={5} />

// Profile card (no image)
<SkeletonCard showImage={false} />

// Compact card
<SkeletonCard imageHeight={120} bodyLines={2} />
```

## SkeletonList

List of items with avatars and text.

### Basic Usage

```tsx
import { SkeletonList } from '@clarity-chat/react'

<SkeletonList count={5} />
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `3` | Number of items |
| `showAvatar` | `boolean` | `true` | Show avatar in each item |
| `lines` | `number` | `2` | Text lines per item |
| `variant` | `'pulse' \| 'shimmer' \| 'none'` | `'shimmer'` | Animation type |
| `className` | `string` | `undefined` | Additional CSS classes |

### Examples

```tsx
// Contact list
<SkeletonList count={10} lines={2} />

// Message list
<SkeletonList count={5} lines={3} />

// Simple list (no avatars)
<SkeletonList count={8} showAvatar={false} lines={1} />
```

## SkeletonButton

Button placeholder.

### Basic Usage

```tsx
import { SkeletonButton } from '@clarity-chat/react'

<SkeletonButton />
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number \| string` | `100` | Button width |
| `height` | `number` | `40` | Button height (px) |
| `variant` | `'pulse' \| 'shimmer' \| 'none'` | `'shimmer'` | Animation type |
| `className` | `string` | `undefined` | Additional CSS classes |

### Examples

```tsx
<SkeletonButton width={120} />              // Standard button
<SkeletonButton width={200} height={48} />  // Large button
<SkeletonButton width="100%" />             // Full width
```

## SkeletonInput

Input field placeholder with optional label.

### Basic Usage

```tsx
import { SkeletonInput } from '@clarity-chat/react'

<SkeletonInput />
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number \| string` | `'100%'` | Input width |
| `height` | `number` | `40` | Input height (px) |
| `showLabel` | `boolean` | `true` | Show label above input |
| `variant` | `'pulse' \| 'shimmer' \| 'none'` | `'shimmer'` | Animation type |
| `className` | `string` | `undefined` | Additional CSS classes |

### Examples

```tsx
// With label
<SkeletonInput />

// Without label
<SkeletonInput showLabel={false} />

// Custom size
<SkeletonInput width={300} height={48} />
```

## SkeletonChatWindow

Complete chat interface skeleton.

### Basic Usage

```tsx
import { SkeletonChatWindow } from '@clarity-chat/react'

<SkeletonChatWindow />
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'pulse' \| 'shimmer' \| 'none'` | `'shimmer'` | Animation type |

## Complete Example: Loading States

```tsx
'use client'

import { useState, useEffect } from 'react'
import { SkeletonCard, SkeletonList } from '@clarity-chat/react'

export default function ProductList() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts([/* products */])
      setLoading(false)
    }, 2000)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
```

## Complete Example: Progressive Loading

```tsx
'use client'

import { useState, useEffect } from 'react'
import { SkeletonText, SkeletonAvatar } from '@clarity-chat/react'

export default function UserProfile() {
  const [avatar, setAvatar] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [bio, setBio] = useState<string | null>(null)

  useEffect(() => {
    // Load avatar first
    setTimeout(() => setAvatar('/avatar.jpg'), 500)
    // Then name
    setTimeout(() => setName('John Doe'), 1000)
    // Finally bio
    setTimeout(() => setBio('Software developer...'), 1500)
  }, [])

  return (
    <div className="flex items-start gap-4">
      {avatar ? (
        <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
      ) : (
        <SkeletonAvatar size={64} />
      )}

      <div className="flex-1">
        {name ? (
          <h2 className="text-xl font-bold">{name}</h2>
        ) : (
          <Skeleton width="40%" height={28} className="mb-2" />
        )}

        {bio ? (
          <p className="text-muted-foreground">{bio}</p>
        ) : (
          <SkeletonText lines={2} />
        )}
      </div>
    </div>
  )
}
```

## Complete Example: Chat Loading

```tsx
'use client'

import { useState, useEffect } from 'react'
import { SkeletonChatWindow, SkeletonMessage } from '@clarity-chat/react'

export default function ChatInterface() {
  const [initialLoading, setInitialLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [loadingResponse, setLoadingResponse] = useState(false)

  useEffect(() => {
    // Initial load
    setTimeout(() => {
      setMessages([/* messages */])
      setInitialLoading(false)
    }, 2000)
  }, [])

  if (initialLoading) {
    return <SkeletonChatWindow />
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => (
          <Message key={msg.id} {...msg} />
        ))}

        {/* Loading response */}
        {loadingResponse && (
          <SkeletonMessage role="assistant" lines={3} />
        )}
      </div>

      <div className="p-4 border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  )
}
```

## Complete Example: Form Loading

```tsx
'use client'

import { SkeletonInput, SkeletonButton } from '@clarity-chat/react'

export default function FormSkeleton() {
  return (
    <div className="max-w-md space-y-6">
      <SkeletonInput />
      <SkeletonInput />
      <SkeletonInput showLabel={false} height={120} />
      
      <div className="flex gap-2">
        <SkeletonButton width={100} />
        <SkeletonButton width={100} />
      </div>
    </div>
  )
}
```

## Animation Details

### Shimmer Animation

```typescript
// Gradient background
backgroundImage: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
backgroundSize: '200% 100%'

// Animation
animate: {
  backgroundPosition: ['200% 0', '-200% 0']
}
transition: {
  duration: 2,
  repeat: Infinity,
  ease: 'linear'
}
```

### Pulse Animation

```typescript
animate: {
  opacity: [0.5, 1, 0.5]
}
transition: {
  duration: 1.5,
  repeat: Infinity,
  ease: 'easeInOut'
}
```

## TypeScript Support

Full TypeScript support with comprehensive types:

```typescript
import type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonAvatarProps,
  SkeletonMessageProps,
  SkeletonCardProps,
  SkeletonListProps,
  SkeletonButtonProps,
  SkeletonInputProps,
} from '@clarity-chat/react'

// All components fully typed
```

## Accessibility

Skeleton components follow accessibility best practices:

- **ARIA Attributes** - `aria-busy="true"` on containers
- **Screen Reader** - Announces "Loading" state
- **No Focus Trap** - Non-interactive during loading
- **Visual Only** - No keyboard interactions needed
- **Theme Aware** - Uses theme colors for contrast

### Accessible Implementation

```tsx
<div aria-busy="true" aria-label="Loading content">
  <SkeletonCard />
</div>
```

## Styling

### Custom Colors

```tsx
<Skeleton
  width={200}
  height={20}
  className="bg-blue-200"  // Custom background
/>
```

### Dark Mode

Skeletons automatically adapt to dark mode:

```css
.dark .bg-muted {
  background: hsl(var(--muted));
}
```

## Related Components

- **[Loading Indicator](../loading-indicator)** - Spinner loading states
- **[Empty State](../empty-state)** - No data states
- **[Message List](../message-list)** - Chat message display
- **[Card](../card)** - Card components

## Best Practices

### 1. Match Content Structure

Skeleton should mirror actual content:

```tsx
// ✅ Good - matches card structure
<SkeletonCard showImage imageHeight={200} bodyLines={3} />

// ❌ Bad - doesn't match
<SkeletonText lines={10} />
```

### 2. Use Appropriate Variant

Choose animation based on context:

```tsx
// ✅ Good - shimmer for content
<SkeletonText variant="shimmer" />

// ✅ Good - pulse for avatars
<SkeletonAvatar variant="pulse" />

// ❌ Bad - no animation (looks broken)
<SkeletonCard variant="none" />
```

### 3. Progressive Loading

Load critical content first:

```tsx
// ✅ Good - progressive
{!avatar && <SkeletonAvatar />}
{!name && <Skeleton width="40%" height={24} />}
{!bio && <SkeletonText lines={2} />}

// ❌ Bad - all or nothing
{loading && <SkeletonCard />}
```

### 4. Reasonable Count

Don't overwhelm with skeletons:

```tsx
// ✅ Good - reasonable count
<SkeletonList count={5} />

// ❌ Bad - too many
<SkeletonList count={100} />
```

### 5. Consistent Animation

Use same variant throughout:

```tsx
// ✅ Good - consistent
<SkeletonCard variant="shimmer" />
<SkeletonList variant="shimmer" />

// ❌ Bad - mixed
<SkeletonCard variant="shimmer" />
<SkeletonList variant="pulse" />
```

### 6. Respect Reduced Motion

```tsx
const prefersReducedMotion = usePrefersReducedMotion()

<Skeleton variant={prefersReducedMotion ? 'none' : 'shimmer'} />
```

### 7. Don't Overuse

Use skeletons for slower loads (>500ms):

```tsx
// ✅ Good - slow API (2s+)
{loading && <SkeletonCard />}

// ❌ Bad - fast API (100ms)
{loading && <SkeletonCard />}  // Just show content
```

## Use Cases

### 1. Data Tables

```tsx
<SkeletonList count={10} showAvatar={false} lines={1} />
```

### 2. Product Grids

```tsx
<div className="grid grid-cols-4 gap-4">
  {Array.from({ length: 8 }).map((_, i) => (
    <SkeletonCard key={i} />
  ))}
</div>
```

### 3. Profile Pages

```tsx
<div className="flex gap-4">
  <SkeletonAvatar size={80} />
  <div className="flex-1">
    <Skeleton width="50%" height={32} className="mb-2" />
    <SkeletonText lines={3} />
  </div>
</div>
```

### 4. Chat Messages

```tsx
<div className="space-y-4">
  <SkeletonMessage role="user" lines={2} />
  <SkeletonMessage role="assistant" lines={4} />
  <SkeletonMessage role="user" lines={1} />
</div>
```

### 5. Forms

```tsx
<div className="space-y-4">
  <SkeletonInput />
  <SkeletonInput />
  <SkeletonInput showLabel={false} height={100} />
  <SkeletonButton width={120} />
</div>
```

## Performance Tips

### 1. Use CSS Animations

Skeleton uses GPU-accelerated CSS animations for performance.

### 2. Limit Count

Don't render excessive skeletons:

```tsx
// ✅ Good
<SkeletonList count={Math.min(items.length, 10)} />

// ❌ Bad
<SkeletonList count={1000} />
```

### 3. Lazy Load Skeletons

Defer off-screen skeletons:

```tsx
import { useInView } from 'react-intersection-observer'

const { ref, inView } = useInView()

<div ref={ref}>
  {inView && <SkeletonCard />}
</div>
```

---

**Related Documentation:**
- [Loading Indicator](../loading-indicator)
- [Empty State](../empty-state)
- [Message List](../message-list)
- [Card](../card)

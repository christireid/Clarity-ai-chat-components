import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interactive Card',
  description: 'Enhanced card components with hover states, focus rings, ripple effects, and interactive behaviors.',
}

# Interactive Card

A collection of interactive components including enhanced cards, buttons, and list items with rich hover states, focus management, and visual feedback.

## Overview

The Interactive Card family provides three highly interactive components designed for modern UIs:
- **InteractiveCard** - Enhanced card with hover, focus, ripple effects
- **InteractiveButton** - Button with animation variants and loading states
- **InteractiveListItem** - List item with selection and hover effects

### Key Features

- **4 Hover Intensities** - None, subtle, medium, strong lift effects
- **Ripple Effects** - Material Design-style click ripples
- **Focus Management** - Keyboard navigation with focus rings
- **Selection States** - Visual indicators for selected items
- **Disabled States** - Proper disabled styling and behavior
- **Spring Animations** - Natural motion with Framer Motion
- **Accessibility** - Full ARIA support and keyboard controls
- **TypeScript Support** - Complete type definitions

## Installation

```bash
npm install @clarity-chat/react @clarity-chat/primitives framer-motion
```

## InteractiveCard

Enhanced card component with hover effects and interactive states.

### Basic Usage

```tsx
import { InteractiveCard } from '@clarity-chat/react'

export default function MyComponent() {
  return (
    <InteractiveCard
      interactive
      hoverIntensity="medium"
      onCardClick={() => console.log('Card clicked!')}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="text-sm text-muted-foreground">Card content goes here</p>
      </div>
    </InteractiveCard>
  )
}
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `interactive` | `boolean` | `false` | Whether card is clickable |
| `selected` | `boolean` | `false` | Whether card is selected |
| `disabled` | `boolean` | `false` | Whether card is disabled |
| `hoverIntensity` | `'none' \| 'subtle' \| 'medium' \| 'strong'` | `'medium'` | Hover lift effect strength |
| `showFocusRing` | `boolean` | `true` | Show focus ring on keyboard focus |
| `showRipple` | `boolean` | `false` | Show ripple effect on click |
| `onCardClick` | `() => void` | `undefined` | Click handler |
| `children` | `React.ReactNode` | **Required** | Card content |
| `className` | `string` | `undefined` | Additional CSS classes |

### Hover Intensities

```tsx
// None - No hover effect
<InteractiveCard hoverIntensity="none" interactive>
  No lift on hover
</InteractiveCard>

// Subtle - 2px lift
<InteractiveCard hoverIntensity="subtle" interactive>
  Subtle 2px lift
</InteractiveCard>

// Medium - 4px lift (default)
<InteractiveCard hoverIntensity="medium" interactive>
  Medium 4px lift
</InteractiveCard>

// Strong - 8px lift
<InteractiveCard hoverIntensity="strong" interactive>
  Strong 8px lift
</InteractiveCard>
```

### Selected State

```tsx
<InteractiveCard
  interactive
  selected={isSelected}
  onCardClick={() => setIsSelected(!isSelected)}
>
  <div className="p-4">
    Click to toggle selection
  </div>
</InteractiveCard>
```

**Selected indicators:**
- Blue ring around card (`ring-2 ring-primary`)
- Top border highlight (1px blue line)

### Ripple Effect

```tsx
<InteractiveCard
  interactive
  showRipple
  onCardClick={() => console.log('Clicked!')}
>
  <div className="p-6">
    Click to see ripple effect
  </div>
</InteractiveCard>
```

### Disabled State

```tsx
<InteractiveCard
  interactive
  disabled
  onCardClick={() => console.log('Will not fire')}
>
  <div className="p-4">
    Disabled card
  </div>
</InteractiveCard>
```

## InteractiveButton

Button component with enhanced animations and states.

### Basic Usage

```tsx
import { InteractiveButton } from '@clarity-chat/react'

<InteractiveButton
  variant="primary"
  onClick={() => console.log('Clicked!')}
>
  Click me
</InteractiveButton>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'destructive' \| 'ghost'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner |
| `icon` | `React.ReactNode` | `undefined` | Icon before text |
| `iconRight` | `React.ReactNode` | `undefined` | Icon after text |
| `disabled` | `boolean` | `false` | Disable button |
| `children` | `React.ReactNode` | `undefined` | Button content |
| `className` | `string` | `undefined` | Additional CSS classes |

### Variants

```tsx
// Default - Secondary style
<InteractiveButton variant="default">
  Default
</InteractiveButton>

// Primary - Brand color
<InteractiveButton variant="primary">
  Primary
</InteractiveButton>

// Success - Green
<InteractiveButton variant="success">
  Success
</InteractiveButton>

// Destructive - Red
<InteractiveButton variant="destructive">
  Delete
</InteractiveButton>

// Ghost - Transparent
<InteractiveButton variant="ghost">
  Ghost
</InteractiveButton>
```

### Sizes

```tsx
<InteractiveButton size="sm">Small</InteractiveButton>
<InteractiveButton size="md">Medium</InteractiveButton>
<InteractiveButton size="lg">Large</InteractiveButton>
```

### With Icons

```tsx
import { CheckIcon, ArrowRightIcon } from '@clarity-chat/react/icons'

// Icon before
<InteractiveButton icon={<CheckIcon size={16} />}>
  Save
</InteractiveButton>

// Icon after
<InteractiveButton iconRight={<ArrowRightIcon size={16} />}>
  Next
</InteractiveButton>

// Both
<InteractiveButton
  icon={<CheckIcon size={16} />}
  iconRight={<ArrowRightIcon size={16} />}
>
  Continue
</InteractiveButton>
```

### Loading State

```tsx
<InteractiveButton loading variant="primary">
  Saving...
</InteractiveButton>
```

## InteractiveListItem

List item component with selection and hover effects.

### Basic Usage

```tsx
import { InteractiveListItem } from '@clarity-chat/react'
import { FileIcon } from '@clarity-chat/react/icons'

<InteractiveListItem
  icon={<FileIcon size={20} />}
  title="Document.pdf"
  description="Added 2 hours ago"
  onClick={() => console.log('Clicked!')}
/>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selected` | `boolean` | `false` | Whether item is selected |
| `disabled` | `boolean` | `false` | Whether item is disabled |
| `icon` | `React.ReactNode` | `undefined` | Left icon |
| `title` | `string` | **Required** | Item title |
| `description` | `string` | `undefined` | Optional description |
| `badge` | `React.ReactNode` | `undefined` | Badge or label |
| `onClick` | `() => void` | `undefined` | Click handler |
| `className` | `string` | `undefined` | Additional CSS classes |

### With Badge

```tsx
import { Badge } from '@clarity-chat/primitives'

<InteractiveListItem
  title="Premium Feature"
  description="Unlock with upgrade"
  badge={<Badge variant="success">New</Badge>}
  onClick={handleClick}
/>
```

### Selected State

```tsx
<InteractiveListItem
  title="Active Item"
  selected={isSelected}
  onClick={() => setIsSelected(!isSelected)}
/>
```

**Selected indicators:**
- Background color change
- Blue dot on right side

## Complete Example: Selectable Cards

```tsx
'use client'

import { useState } from 'react'
import { InteractiveCard } from '@clarity-chat/react'

const plans = [
  { id: 'free', name: 'Free', price: '$0', features: ['10 chats/month', 'Basic support'] },
  { id: 'pro', name: 'Pro', price: '$9.99', features: ['Unlimited chats', 'Priority support'] },
  { id: 'team', name: 'Team', price: '$29.99', features: ['Team workspace', 'Advanced analytics'] },
]

export default function PricingCards() {
  const [selectedPlan, setSelectedPlan] = useState('pro')

  return (
    <div className="grid grid-cols-3 gap-4">
      {plans.map((plan) => (
        <InteractiveCard
          key={plan.id}
          interactive
          selected={selectedPlan === plan.id}
          hoverIntensity="medium"
          onCardClick={() => setSelectedPlan(plan.id)}
        >
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="text-2xl font-bold text-primary">{plan.price}</p>
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  ✓ {feature}
                </li>
              ))}
            </ul>
          </div>
        </InteractiveCard>
      ))}
    </div>
  )
}
```

## Complete Example: Interactive File List

```tsx
'use client'

import { useState } from 'react'
import { InteractiveListItem } from '@clarity-chat/react'
import { FileIcon, ImageIcon, VideoIcon } from '@clarity-chat/react/icons'
import { Badge } from '@clarity-chat/primitives'

const files = [
  { id: '1', name: 'Project Proposal.pdf', type: 'pdf', size: '2.3 MB', icon: FileIcon },
  { id: '2', name: 'Screenshot.png', type: 'image', size: '1.1 MB', icon: ImageIcon, badge: 'New' },
  { id: '3', name: 'Demo Video.mp4', type: 'video', size: '45.2 MB', icon: VideoIcon },
]

export default function FileList() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      {files.map((file) => {
        const Icon = file.icon
        return (
          <InteractiveListItem
            key={file.id}
            icon={<Icon size={20} />}
            title={file.name}
            description={`${file.type.toUpperCase()} • ${file.size}`}
            badge={file.badge && <Badge variant="outline">{file.badge}</Badge>}
            selected={selectedFile === file.id}
            onClick={() => setSelectedFile(file.id)}
          />
        )
      })}
    </div>
  )
}
```

## Complete Example: Action Buttons

```tsx
import { InteractiveButton } from '@clarity-chat/react'
import { SaveIcon, TrashIcon, DownloadIcon } from '@clarity-chat/react/icons'

export function ActionButtons() {
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await saveData()
    setSaving(false)
  }

  return (
    <div className="flex gap-2">
      <InteractiveButton
        variant="primary"
        icon={<SaveIcon size={16} />}
        loading={saving}
        onClick={handleSave}
      >
        Save
      </InteractiveButton>

      <InteractiveButton
        variant="ghost"
        icon={<DownloadIcon size={16} />}
        onClick={() => downloadFile()}
      >
        Download
      </InteractiveButton>

      <InteractiveButton
        variant="destructive"
        icon={<TrashIcon size={16} />}
        onClick={() => confirmDelete()}
      >
        Delete
      </InteractiveButton>
    </div>
  )
}
```

## Animation Details

### Card Hover Animation

```typescript
// Subtle intensity
{ 
  y: -2, 
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  scale: 1.02,
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
}

// Medium intensity (default)
{ 
  y: -4, 
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  scale: 1.02,
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
}

// Strong intensity
{ 
  y: -8, 
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  scale: 1.02,
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
}
```

### Card Tap Animation

```typescript
whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
```

### Ripple Animation

```typescript
initial={{ scale: 0, opacity: 0.5 }}
animate={{ scale: 4, opacity: 0 }}
transition={{ duration: 0.6 }}
```

### Button Hover/Tap

```typescript
// From INTERACTION_VARIANTS.button
hover: { scale: 1.05 }
tap: { scale: 0.95 }
transition: { type: 'spring', stiffness: 400, damping: 17 }
```

### List Item Hover

```typescript
whileHover={{ x: 4, backgroundColor: 'hsl(var(--accent) / 0.5)' }}
whileTap={{ scale: 0.98 }}
```

## TypeScript Support

Full TypeScript support with comprehensive types:

```typescript
import type {
  InteractiveCardProps,
  InteractiveButtonProps,
  InteractiveListItemProps,
} from '@clarity-chat/react'

// Card Props
interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
  selected?: boolean
  disabled?: boolean
  hoverIntensity?: 'none' | 'subtle' | 'medium' | 'strong'
  showFocusRing?: boolean
  showRipple?: boolean
  onCardClick?: () => void
  children: React.ReactNode
}

// Button Props
interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'success' | 'destructive' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  children?: React.ReactNode
}

// List Item Props
interface InteractiveListItemProps {
  selected?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  title: string
  description?: string
  badge?: React.ReactNode
  onClick?: () => void
  className?: string
}
```

## Accessibility

All interactive components follow accessibility best practices:

### InteractiveCard
- **Role** - `role="button"` when interactive
- **Tabindex** - `tabIndex={0}` for keyboard navigation
- **ARIA** - `aria-disabled`, `aria-pressed` for states
- **Keyboard** - Enter/Space to activate
- **Focus Ring** - Visible focus indicator

### InteractiveButton
- **Semantic** - Uses `<button>` element
- **Focus Ring** - `focus-visible:ring-2`
- **Disabled State** - `disabled` attribute
- **Loading State** - Disabled when loading

### InteractiveListItem
- **Role** - `role="button"`
- **Tabindex** - `tabIndex={0}` when not disabled
- **ARIA** - `aria-selected`, `aria-disabled`
- **Keyboard** - Full keyboard support

## Styling

### Custom Card Styles

```tsx
<InteractiveCard
  interactive
  className="bg-gradient-to-br from-purple-500 to-pink-500 text-white"
>
  Custom styled card
</InteractiveCard>
```

### Custom Button Styles

```tsx
<InteractiveButton
  variant="primary"
  className="rounded-full px-8"
>
  Rounded button
</InteractiveButton>
```

### Custom List Item Styles

```tsx
<InteractiveListItem
  title="Custom item"
  className="rounded-full border-2 border-primary"
/>
```

## Related Components

- **[Empty State](../empty-state)** - Uses InteractiveButton internally
- **[Button](../button)** - Base button component
- **[Card](../card)** - Static card component
- **[Badge](../badge)** - Used in list items

## Best Practices

### 1. Choose Appropriate Hover Intensity

Match intensity to use case:

```tsx
// ✅ Good - subtle for dense lists
<InteractiveCard hoverIntensity="subtle">
  List item
</InteractiveCard>

// ✅ Good - strong for CTAs
<InteractiveCard hoverIntensity="strong">
  Get Started
</InteractiveCard>

// ❌ Bad - too strong for lists
<InteractiveCard hoverIntensity="strong">
  Regular list item
</InteractiveCard>
```

### 2. Use Ripple Sparingly

Ripple effect is bold - use for emphasis:

```tsx
// ✅ Good - important actions
<InteractiveCard showRipple interactive>
  Confirm Purchase
</InteractiveCard>

// ❌ Bad - overuse
<InteractiveCard showRipple interactive>
  Every list item
</InteractiveCard>
```

### 3. Provide Visual Feedback

Always indicate disabled state:

```tsx
// ✅ Good - clear disabled state
<InteractiveButton disabled variant="primary">
  Unavailable
</InteractiveButton>

// ❌ Bad - looks clickable but isn't
<InteractiveButton disabled variant="ghost">
  Confusing
</InteractiveButton>
```

### 4. Use Loading States

Show progress for async actions:

```tsx
const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
  setLoading(true)
  await submitForm()
  setLoading(false)
}

<InteractiveButton loading={loading} onClick={handleSubmit}>
  Submit
</InteractiveButton>
```

### 5. Maintain Selection State

Keep track of selected items:

```tsx
// ✅ Good - controlled selection
const [selected, setSelected] = useState<string[]>([])

<InteractiveCard
  selected={selected.includes(item.id)}
  onCardClick={() => {
    setSelected(prev => 
      prev.includes(item.id)
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id]
    )
  }}
/>
```

### 6. Keyboard Navigation

Ensure keyboard users can navigate:

```tsx
// ✅ Good - full keyboard support
<InteractiveCard interactive onCardClick={handleClick}>
  Keyboard accessible
</InteractiveCard>

// ❌ Bad - onClick without interactive
<div onClick={handleClick}>
  Not keyboard accessible
</div>
```

## Use Cases

### 1. Pricing Plans

Selectable pricing cards:

```tsx
<InteractiveCard
  interactive
  selected={selectedPlan === 'pro'}
  hoverIntensity="medium"
  onCardClick={() => selectPlan('pro')}
>
  <PricingPlanContent />
</InteractiveCard>
```

### 2. Feature Cards

Clickable feature showcases:

```tsx
<InteractiveCard
  interactive
  hoverIntensity="strong"
  onCardClick={() => router.push('/features/ai')}
>
  <FeatureShowcase />
</InteractiveCard>
```

### 3. Form Actions

Action buttons with states:

```tsx
<InteractiveButton
  variant="primary"
  loading={submitting}
  onClick={handleSubmit}
>
  Submit Form
</InteractiveButton>
```

### 4. Navigation Lists

Selectable navigation items:

```tsx
<InteractiveListItem
  icon={<HomeIcon />}
  title="Dashboard"
  selected={currentPage === 'dashboard'}
  onClick={() => navigate('/dashboard')}
/>
```

### 5. Media Galleries

Image/video selection:

```tsx
<InteractiveCard
  interactive
  selected={selectedMedia.includes(media.id)}
  showRipple
  onCardClick={() => toggleMedia(media.id)}
>
  <MediaThumbnail />
</InteractiveCard>
```

## Performance Tips

### 1. Memoize Click Handlers

```tsx
const handleClick = useCallback(() => {
  selectItem(item.id)
}, [item.id])

<InteractiveCard onCardClick={handleClick} />
```

### 2. Virtualize Long Lists

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 60,
})

{virtualizer.getVirtualItems().map((virtualItem) => (
  <InteractiveListItem key={virtualItem.key} {...items[virtualItem.index]} />
))}
```

### 3. Reduce Motion for Accessibility

```tsx
const prefersReducedMotion = usePrefersReducedMotion()

<InteractiveCard
  hoverIntensity={prefersReducedMotion ? 'none' : 'medium'}
  showRipple={!prefersReducedMotion}
/>
```

---

**Related Documentation:**
- [Empty State](../empty-state)
- [Button](../button)
- [Card](../card)
- [Badge](../badge)

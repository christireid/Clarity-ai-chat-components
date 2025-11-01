import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collapsible Section',
  description: 'Animated expand/collapse components including collapsible sections, accordions, and expandable list items.',
}

# Collapsible Section

A collection of animated expand/collapse components including collapsible sections, accordions, and expandable list items with smooth height transitions.

## Overview

The Collapsible Section family provides three components for expandable content:
- **CollapsibleSection** - Base collapsible with trigger and content
- **Accordion** - Multiple sections where only one can be open
- **ExpandableListItem** - Simple expandable list item with icon/badge

### Key Features

- **Smooth Height Animations** - Animated height transitions with Framer Motion
- **Controlled & Uncontrolled** - Support for both modes
- **Rotating Chevron** - Animated chevron indicator
- **Keyboard Accessible** - Full keyboard navigation
- **Customizable Duration** - Configurable animation speed
- **Accordion Mode** - Single or multiple open sections
- **Focus Management** - Proper focus rings and states
- **Disabled State** - Optional disabled functionality

## Installation

```bash
npm install @clarity-chat/react @clarity-chat/primitives framer-motion
```

## CollapsibleSection

Base collapsible component with trigger and content.

### Basic Usage

```tsx
import { CollapsibleSection } from '@clarity-chat/react'

export default function MyComponent() {
  return (
    <CollapsibleSection
      trigger="Click to expand"
      defaultOpen={false}
    >
      <p>This content can be collapsed and expanded.</p>
    </CollapsibleSection>
  )
}
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `React.ReactNode` | **Required** | Trigger element (button content) |
| `children` | `React.ReactNode` | **Required** | Content to show/hide |
| `open` | `boolean` | `undefined` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when open state changes |
| `defaultOpen` | `boolean` | `false` | Default open state (uncontrolled) |
| `disabled` | `boolean` | `false` | Disable toggle functionality |
| `duration` | `number` | `0.3` | Animation duration in seconds |
| `className` | `string` | `undefined` | Container CSS classes |
| `triggerClassName` | `string` | `undefined` | Trigger button CSS classes |
| `contentClassName` | `string` | `undefined` | Content area CSS classes |

### Controlled Mode

```tsx
'use client'

import { useState } from 'react'
import { CollapsibleSection } from '@clarity-chat/react'

export default function ControlledExample() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <button onClick={() => setOpen(!open)}>
        External Toggle
      </button>

      <CollapsibleSection
        open={open}
        onOpenChange={setOpen}
        trigger="Controlled Section"
      >
        <p>This section is controlled by external state.</p>
      </CollapsibleSection>
    </div>
  )
}
```

### Uncontrolled Mode

```tsx
<CollapsibleSection
  defaultOpen={true}
  trigger="Uncontrolled Section"
  onOpenChange={(open) => console.log('Open state:', open)}
>
  <p>This section manages its own state.</p>
</CollapsibleSection>
```

### Custom Trigger

```tsx
<CollapsibleSection
  trigger={
    <div className="flex items-center gap-2">
      <span className="text-lg">📁</span>
      <span>My Documents</span>
      <span className="ml-auto text-sm text-muted-foreground">24 items</span>
    </div>
  }
>
  <ul className="space-y-2">
    <li>Document 1.pdf</li>
    <li>Document 2.docx</li>
    <li>Document 3.txt</li>
  </ul>
</CollapsibleSection>
```

### Disabled State

```tsx
<CollapsibleSection
  trigger="Disabled Section"
  disabled
>
  <p>This section cannot be toggled.</p>
</CollapsibleSection>
```

### Custom Animation Duration

```tsx
// Slow animation (0.6 seconds)
<CollapsibleSection
  trigger="Slow Animation"
  duration={0.6}
>
  <p>Opens and closes slowly.</p>
</CollapsibleSection>

// Fast animation (0.15 seconds)
<CollapsibleSection
  trigger="Fast Animation"
  duration={0.15}
>
  <p>Opens and closes quickly.</p>
</CollapsibleSection>
```

## Accordion

Multiple collapsible sections where only one can be open at a time.

### Basic Usage

```tsx
import { Accordion } from '@clarity-chat/react'

const items = [
  {
    id: 'item-1',
    trigger: 'What is Clarity Chat?',
    content: 'Clarity Chat is an AI-powered conversation platform.',
  },
  {
    id: 'item-2',
    trigger: 'How do I get started?',
    content: 'Simply create an account and start your first conversation.',
  },
  {
    id: 'item-3',
    trigger: 'What features are available?',
    content: 'We offer RAG, context management, and knowledge base generation.',
  },
]

export default function FAQSection() {
  return <Accordion items={items} />
}
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `AccordionItem[]` | **Required** | Array of accordion items |
| `openId` | `string` | `undefined` | Controlled open item ID |
| `onOpenChange` | `(id: string \| null) => void` | `undefined` | Callback when open item changes |
| `defaultOpenId` | `string` | `undefined` | Default open item ID |
| `allowMultiple` | `boolean` | `false` | Allow multiple items open at once |
| `duration` | `number` | `0.3` | Animation duration in seconds |
| `className` | `string` | `undefined` | Container CSS classes |

### AccordionItem Type

```typescript
interface AccordionItem {
  id: string
  trigger: React.ReactNode
  content: React.ReactNode
}
```

### Allow Multiple Open

```tsx
<Accordion
  items={items}
  allowMultiple
/>
```

### Controlled Accordion

```tsx
'use client'

import { useState } from 'react'
import { Accordion } from '@clarity-chat/react'

export default function ControlledAccordion() {
  const [openId, setOpenId] = useState<string | null>('item-1')

  return (
    <Accordion
      items={items}
      openId={openId}
      onOpenChange={setOpenId}
    />
  )
}
```

### Default Open Item

```tsx
<Accordion
  items={items}
  defaultOpenId="item-2"
/>
```

## ExpandableListItem

Simple expandable list item with icon and badge support.

### Basic Usage

```tsx
import { ExpandableListItem } from '@clarity-chat/react'
import { FolderIcon } from '@clarity-chat/react/icons'
import { Badge } from '@clarity-chat/primitives'

<ExpandableListItem
  icon={<FolderIcon size={20} />}
  title="Project Files"
  badge={<Badge>24</Badge>}
>
  <ul className="space-y-1">
    <li>index.tsx</li>
    <li>styles.css</li>
    <li>utils.ts</li>
  </ul>
</ExpandableListItem>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **Required** | Item title |
| `children` | `React.ReactNode` | **Required** | Content to show when expanded |
| `icon` | `React.ReactNode` | `undefined` | Left icon |
| `badge` | `React.ReactNode` | `undefined` | Right badge/label |
| `defaultOpen` | `boolean` | `false` | Default open state |
| `className` | `string` | `undefined` | Container CSS classes |

### With Icon

```tsx
import { FileIcon, ImageIcon, VideoIcon } from '@clarity-chat/react/icons'

<ExpandableListItem
  icon={<FileIcon size={20} />}
  title="Documents"
>
  <p>Your document files</p>
</ExpandableListItem>
```

### With Badge

```tsx
import { Badge } from '@clarity-chat/primitives'

<ExpandableListItem
  title="Notifications"
  badge={<Badge variant="destructive">5 New</Badge>}
>
  <ul>
    <li>New message from John</li>
    <li>Project updated</li>
  </ul>
</ExpandableListItem>
```

## Complete Example: FAQ Section

```tsx
'use client'

import { Accordion } from '@clarity-chat/react'

const faqs = [
  {
    id: 'pricing',
    trigger: <span className="font-semibold">What are your pricing plans?</span>,
    content: (
      <div className="space-y-2">
        <p>We offer three pricing tiers:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Free:</strong> 10 chats per month</li>
          <li><strong>Pro:</strong> $9.99/month for unlimited chats</li>
          <li><strong>Team:</strong> $29.99/month with team features</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'security',
    trigger: <span className="font-semibold">Is my data secure?</span>,
    content: (
      <div className="space-y-2">
        <p>Yes! We take security seriously:</p>
        <ul className="list-disc list-inside">
          <li>End-to-end encryption</li>
          <li>SOC 2 Type II certified</li>
          <li>Regular security audits</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'api',
    trigger: <span className="font-semibold">Do you offer an API?</span>,
    content: (
      <p>
        Yes, we provide a REST API for Pro and Team plans. 
        Check our <a href="/docs/api" className="text-primary underline">API documentation</a> for details.
      </p>
    ),
  },
]

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <Accordion items={faqs} defaultOpenId="pricing" />
    </div>
  )
}
```

## Complete Example: File Browser

```tsx
'use client'

import { ExpandableListItem } from '@clarity-chat/react'
import { FolderIcon, FileIcon } from '@clarity-chat/react/icons'
import { Badge } from '@clarity-chat/primitives'

const folders = [
  {
    name: 'Documents',
    count: 24,
    files: ['Proposal.pdf', 'Contract.docx', 'Notes.txt'],
  },
  {
    name: 'Images',
    count: 156,
    files: ['Screenshot1.png', 'Photo2.jpg', 'Banner.svg'],
  },
  {
    name: 'Videos',
    count: 8,
    files: ['Tutorial.mp4', 'Demo.mov'],
  },
]

export default function FileBrowser() {
  return (
    <div className="space-y-2">
      {folders.map((folder) => (
        <ExpandableListItem
          key={folder.name}
          icon={<FolderIcon size={20} />}
          title={folder.name}
          badge={<Badge variant="outline">{folder.count}</Badge>}
        >
          <ul className="space-y-1">
            {folder.files.map((file) => (
              <li key={file} className="flex items-center gap-2 text-sm">
                <FileIcon size={16} className="text-muted-foreground" />
                {file}
              </li>
            ))}
          </ul>
        </ExpandableListItem>
      ))}
    </div>
  )
}
```

## Complete Example: Settings Sections

```tsx
'use client'

import { CollapsibleSection } from '@clarity-chat/react'
import { Switch } from '@clarity-chat/primitives'

export default function SettingsPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <CollapsibleSection
        trigger={
          <div>
            <h3 className="font-semibold">Account Settings</h3>
            <p className="text-sm text-muted-foreground">Manage your account preferences</p>
          </div>
        }
        defaultOpen
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add extra security</p>
            </div>
            <Switch />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        trigger={
          <div>
            <h3 className="font-semibold">Privacy Settings</h3>
            <p className="text-sm text-muted-foreground">Control your data and privacy</p>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-muted-foreground">Who can see your profile</p>
            </div>
            <select className="border rounded px-2 py-1">
              <option>Public</option>
              <option>Private</option>
            </select>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  )
}
```

## Animation Details

### Height Transition

```typescript
initial={{ height: 0, opacity: 0 }}
animate={{ height: 'auto', opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
```

### Chevron Rotation

```typescript
animate={{ rotate: isOpen ? 180 : 0 }}
transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
```

## TypeScript Support

Full TypeScript support with comprehensive types:

```typescript
import type {
  CollapsibleSectionProps,
  AccordionProps,
  ExpandableListItemProps,
} from '@clarity-chat/react'

// CollapsibleSection Props
interface CollapsibleSectionProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  triggerClassName?: string
  contentClassName?: string
  duration?: number
  disabled?: boolean
}

// Accordion Props
interface AccordionProps {
  items: Array<{
    id: string
    trigger: React.ReactNode
    content: React.ReactNode
  }>
  openId?: string
  onOpenChange?: (id: string | null) => void
  defaultOpenId?: string
  allowMultiple?: boolean
  className?: string
  duration?: number
}

// ExpandableListItem Props
interface ExpandableListItemProps {
  title: string
  badge?: React.ReactNode
  icon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}
```

## Accessibility

All collapsible components follow accessibility best practices:

- **ARIA Expanded** - `aria-expanded` attribute on triggers
- **Keyboard Navigation** - Full keyboard support (Enter/Space to toggle)
- **Focus Management** - Visible focus rings
- **Semantic HTML** - Proper `<button>` elements for triggers
- **Screen Reader** - Content changes announced
- **Disabled State** - Proper disabled styling and behavior

### Screen Reader Experience

```
"Click to expand, button, collapsed"
[User activates]
"Click to expand, button, expanded"
"Content text is displayed"
```

## Styling

### Custom Container Styles

```tsx
<CollapsibleSection
  trigger="Custom Styled"
  className="bg-blue-50 border-blue-200"
>
  <p>Custom container styling</p>
</CollapsibleSection>
```

### Custom Trigger Styles

```tsx
<CollapsibleSection
  trigger="Custom Trigger"
  triggerClassName="bg-primary text-white hover:bg-primary/90"
>
  <p>Custom trigger styling</p>
</CollapsibleSection>
```

### Custom Content Styles

```tsx
<CollapsibleSection
  trigger="Custom Content"
  contentClassName="bg-muted p-6"
>
  <p>Custom content styling</p>
</CollapsibleSection>
```

## Related Components

- **[Knowledge Base Viewer](../knowledge-base-viewer)** - Uses CollapsibleSection
- **[Dialog](../dialog)** - Modal dialogs
- **[Tabs](../tabs)** - Alternative content organization
- **[Badge](../badge)** - Used in expandable list items

## Best Practices

### 1. Use Descriptive Triggers

Make it clear what will expand:

```tsx
// ✅ Good - clear trigger
<CollapsibleSection trigger="View Payment History">
  {/* Payment history */}
</CollapsibleSection>

// ❌ Bad - vague trigger
<CollapsibleSection trigger="Click here">
  {/* Payment history */}
</CollapsibleSection>
```

### 2. Choose Appropriate Mode

Use Accordion for mutually exclusive content:

```tsx
// ✅ Good - FAQ (one at a time)
<Accordion items={faqItems} />

// ❌ Bad - Settings (should allow multiple)
<Accordion items={settingsSections} allowMultiple={false} />
```

### 3. Provide Default State

Open important sections by default:

```tsx
// ✅ Good - important info visible
<CollapsibleSection trigger="Important Notice" defaultOpen>
  {/* Critical information */}
</CollapsibleSection>
```

### 4. Limit Nesting Depth

Avoid deeply nested collapsibles:

```tsx
// ✅ Good - single level
<Accordion items={sections} />

// ❌ Bad - nested collapsibles
<CollapsibleSection>
  <CollapsibleSection>
    <CollapsibleSection>
      {/* Too deep */}
    </CollapsibleSection>
  </CollapsibleSection>
</CollapsibleSection>
```

### 5. Use Consistent Animation Duration

Maintain consistent feel across sections:

```tsx
// ✅ Good - consistent duration
const ANIMATION_DURATION = 0.3

<CollapsibleSection duration={ANIMATION_DURATION} />
<Accordion duration={ANIMATION_DURATION} />
```

### 6. Handle Long Content

Ensure scrolling works well:

```tsx
<CollapsibleSection trigger="Long Content">
  <div className="max-h-96 overflow-y-auto">
    {/* Very long content */}
  </div>
</CollapsibleSection>
```

### 7. Provide Visual Feedback

Indicate interactive state:

```tsx
<CollapsibleSection
  trigger={
    <div className="flex items-center gap-2">
      <span>Section Title</span>
      <span className="text-xs text-muted-foreground">
        (click to expand)
      </span>
    </div>
  }
>
  {/* Content */}
</CollapsibleSection>
```

## Use Cases

### 1. FAQ Sections

Frequently asked questions:

```tsx
<Accordion items={faqItems} />
```

### 2. Settings Panels

Expandable settings groups:

```tsx
<CollapsibleSection trigger="Advanced Settings">
  <SettingsForm />
</CollapsibleSection>
```

### 3. File Browsers

Expandable folder structures:

```tsx
<ExpandableListItem
  icon={<FolderIcon />}
  title="Documents"
  badge={<Badge>24</Badge>}
>
  <FileList />
</ExpandableListItem>
```

### 4. Product Features

Feature showcases:

```tsx
<Accordion items={featureItems} defaultOpenId="feature-1" />
```

### 5. Documentation

Expandable code examples:

```tsx
<CollapsibleSection trigger="View Code Example">
  <CodeBlock code={exampleCode} />
</CollapsibleSection>
```

## Performance Tips

### 1. Lazy Load Content

Only render content when expanded:

```tsx
<CollapsibleSection trigger="Heavy Content">
  {isOpen && <HeavyComponent />}
</CollapsibleSection>
```

### 2. Memoize Items

Prevent unnecessary re-renders:

```tsx
const accordionItems = useMemo(() => [
  { id: '1', trigger: 'Item 1', content: <Content1 /> },
  { id: '2', trigger: 'Item 2', content: <Content2 /> },
], [])

<Accordion items={accordionItems} />
```

### 3. Virtualize Long Lists

For many collapsible items:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

// Virtualize collapsible sections
```

---

**Related Documentation:**
- [Knowledge Base Viewer](../knowledge-base-viewer)
- [Dialog](../dialog)
- [Badge](../badge)
- [Icons](../icons)

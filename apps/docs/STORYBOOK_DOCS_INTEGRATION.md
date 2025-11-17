# 🔗 Storybook + Docs Integration Guide

**Purpose**: Seamless navigation between Storybook and documentation
**Status**: Ready to implement

---

## 📚 Overview

This guide explains how to create bidirectional links between the documentation site and Storybook, allowing users to easily navigate between learning about components and interacting with them.

### Benefits

- **Improved Discovery**: Users can find both docs and interactive demos
- **Better Learning**: Theory (docs) + Practice (Storybook)
- **Reduced Friction**: One click to switch between systems
- **Professional Experience**: Seamless integration

---

## 🎯 Integration Architecture

```
┌─────────────────┐         ┌──────────────────┐
│  Documentation  │◄───────►│    Storybook     │
│      Site       │  Links  │   Component      │
│                 │         │   Showcase       │
└─────────────────┘         └──────────────────┘
```

### Link Types

1. **Docs → Storybook**: "Try in Storybook" links
2. **Storybook → Docs**: "View Documentation" links
3. **Cross-references**: Related components and guides

---

## 📖 From Docs to Storybook

### 1. Using the StorybookLink Component

**File**: `components/Links/StorybookLink.tsx`

#### Quick Example

```tsx
import { ViewInStorybook } from '@/components/Links/StorybookLink'

export default function ChatWindowPage() {
  return (
    <div>
      <h1>ChatWindow</h1>
      <p>The main container component for chat interfaces.</p>

      {/* Add Storybook link */}
      <ViewInStorybook component="ChatWindow" />

      {/* Rest of documentation */}
    </div>
  )
}
```

#### Component API

**Variants**:

1. **Callout** (default) - Prominent call-to-action box
```tsx
<StorybookLink
  story="components-chatwindow--default"
  componentName="ChatWindow"
/>
```

2. **Button** - Inline button style
```tsx
<StorybookLink
  story="components-chatwindow--default"
  componentName="ChatWindow"
  variant="button"
/>
```

3. **Inline** - Subtle inline link
```tsx
<StorybookLink
  story="components-chatwindow--default"
  componentName="ChatWindow"
  variant="inline"
/>
```

#### Helper Functions

**Generate story path automatically**:
```tsx
import { getStorybookPath } from '@/components/Links/StorybookLink'

const storyPath = getStorybookPath('ChatWindow', 'default')
// Returns: "components-chatwindow--default"
```

### 2. Where to Add Storybook Links

#### Component Pages

Add at the **top** after the description:

```tsx
export default function ComponentPage() {
  return (
    <>
      <h1>ComponentName</h1>
      <p>Component description...</p>

      {/* Add here - gives immediate access to interactive demo */}
      <ViewInStorybook component="ComponentName" />

      <h2>Installation</h2>
      {/* Rest of content */}
    </>
  )
}
```

#### Hook Pages

Add in the **examples section**:

```tsx
export default function HookPage() {
  return (
    <>
      <h1>useChat</h1>
      <p>Hook for managing chat state...</p>

      <h2>Examples</h2>
      <p>See this hook in action:</p>

      {/* Link to stories using this hook */}
      <StorybookLink
        story="examples-chatexample--default"
        variant="button"
      />
    </>
  )
}
```

### 3. Batch Adding Links

**Script to add links to all component pages**:

```bash
# Find all component pages
find apps/docs/app/reference/components -name "page.tsx" | while read file; do
  # Extract component name from path
  component=$(basename $(dirname "$file") | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1' | sed 's/ //g')

  # Check if link already exists
  if ! grep -q "ViewInStorybook" "$file"; then
    echo "Adding Storybook link to $component"
    # Add import and component (manual step recommended)
  fi
done
```

---

## 🎨 From Storybook to Docs

### 1. Adding Links in Story Metadata

**File**: `apps/storybook/stories/ChatWindow.stories.tsx`

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ChatWindow } from '@clarity-chat/react'

const meta: Meta<typeof ChatWindow> = {
  title: 'Components/ChatWindow',
  component: ChatWindow,
  parameters: {
    docs: {
      description: {
        component: `
The main container component for chat interfaces with message display,
input handling, and real-time updates.

**[📖 View Full Documentation →](https://docs.clarity-chat.dev/reference/components/chat-window)**
        `.trim()
      }
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ChatWindow>

export const Default: Story = {
  args: {
    messages: [],
    onSendMessage: (content) => console.log('Sent:', content),
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic chat window with no messages. [View usage guide →](https://docs.clarity-chat.dev/reference/components/chat-window#usage)'
      }
    }
  }
}
```

### 2. Adding Docs Links in MDX

**File**: `apps/storybook/stories/Introduction.mdx`

```mdx
# Clarity Chat Components

Welcome to the component showcase!

<div className="sb-link-bar">
  <a href="https://docs.clarity-chat.dev" target="_blank" rel="noopener">
    📖 Full Documentation
  </a>
  <a href="https://docs.clarity-chat.dev/learn/quick-start" target="_blank" rel="noopener">
    🚀 Quick Start
  </a>
  <a href="https://docs.clarity-chat.dev/examples" target="_blank" rel="noopener">
    💡 Examples
  </a>
</div>
```

### 3. Storybook Addon (Optional)

Create a custom addon to show docs links:

```tsx
// .storybook/addons/DocsLinkAddon.tsx
import { addons, types } from '@storybook/manager-api'
import { ExternalLink } from 'lucide-react'

addons.register('docs-link', () => {
  addons.add('docs-link/toolbar', {
    type: types.TOOL,
    title: 'View Docs',
    render: () => {
      const currentStory = getCurrentStory() // Get from Storybook API
      const docsUrl = `https://docs.clarity-chat.dev${getDocsPath(currentStory)}`

      return (
        <a
          href={docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="docs-link-button"
        >
          <ExternalLink /> Docs
        </a>
      )
    },
  })
})
```

---

## 🗺️ URL Mapping

### Component URL Structure

**Documentation**:
```
https://docs.clarity-chat.dev/reference/components/{component-name}
```

**Storybook**:
```
https://storybook.clarity-chat.dev/?path=/story/components-{component-name}--{story-name}
```

### Mapping Table

| Component | Docs URL | Storybook Path |
|-----------|----------|----------------|
| ChatWindow | `/reference/components/chat-window` | `components-chatwindow--default` |
| Message | `/reference/components/message` | `components-message--default` |
| MessageList | `/reference/components/message-list` | `components-messagelist--default` |
| InputBar | `/reference/components/input-bar` | `components-inputbar--default` |

### Generate Mapping Automatically

```typescript
// utils/url-mapping.ts
export function docsToStorybook(docsPath: string): string {
  // Extract component name from docs path
  const component = docsPath.split('/').pop()
  const kebab = component!.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  return `components-${kebab.replace(/-/g, '')}--default`
}

export function storybookToDocs(storyPath: string): string {
  // Extract component from Storybook path
  const match = storyPath.match(/components-(\w+)--/)
  if (!match) return '/'

  const component = match[1]
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .substring(1)

  return `/reference/components/${component}`
}
```

---

## 📋 Implementation Checklist

### Phase 1: Documentation Site

- [x] Create `StorybookLink` component
- [x] Create `ViewInStorybook` helper
- [x] Add URL mapping utilities
- [ ] Add links to top 10 components
- [ ] Add links to all components
- [ ] Add links to hook examples
- [ ] Test all Storybook links

### Phase 2: Storybook

- [ ] Add docs links to story descriptions
- [ ] Create MDX docs pages with links
- [ ] Add "View Docs" button to toolbar (optional)
- [ ] Update all component stories
- [ ] Update all example stories
- [ ] Test all docs links

### Phase 3: Maintenance

- [ ] Add to component template
- [ ] Add to story template
- [ ] Document in CONTRIBUTING.md
- [ ] Add to PR checklist
- [ ] Create automated tests

---

## 🎨 Styling Guidelines

### Documentation Links (in Storybook)

**Colors**:
- Primary: Blue (#3b82f6)
- Hover: Darker blue (#2563eb)
- Icon: External link icon

**Format**:
```
📖 View Full Documentation →
```

### Storybook Links (in Docs)

**Colors**:
- Primary: Brand color
- Background: Light brand tint
- Icon: Play icon + External link

**Format**:
```
Try in Storybook →
```

### Consistency

All links should:
- ✅ Open in new tab (`target="_blank"`)
- ✅ Include `rel="noopener noreferrer"`
- ✅ Have hover states
- ✅ Include icons for clarity
- ✅ Use action-oriented text

---

## 🔧 Configuration

### Environment Variables

```bash
# apps/docs/.env.local
NEXT_PUBLIC_STORYBOOK_URL=https://storybook.clarity-chat.dev

# apps/storybook/.env
STORYBOOK_DOCS_URL=https://docs.clarity-chat.dev
```

### Config Files

**docs/config/storybook.ts**:
```typescript
export const storybookConfig = {
  baseUrl: process.env.NEXT_PUBLIC_STORYBOOK_URL || 'http://localhost:6006',
  getStoryUrl: (path: string) => `${storybookConfig.baseUrl}/?path=/story/${path}`,
}
```

**storybook/.storybook/main.ts**:
```typescript
export default {
  // ... other config
  env: (config) => ({
    ...config,
    DOCS_URL: process.env.STORYBOOK_DOCS_URL || 'http://localhost:3000',
  }),
}
```

---

## 📊 Usage Examples

### Example 1: Component Page

```tsx
// apps/docs/app/reference/components/chat-window/page.tsx
import { ViewInStorybook } from '@/components/Links/StorybookLink'

export default function ChatWindowPage() {
  return (
    <>
      <h1>ChatWindow</h1>
      <p>Main container for chat interfaces with built-in message handling.</p>

      <ViewInStorybook component="ChatWindow" />

      <h2>Installation</h2>
      {/* ... */}
    </>
  )
}
```

### Example 2: Storybook Story

```tsx
// apps/storybook/stories/ChatWindow.stories.tsx
const meta: Meta<typeof ChatWindow> = {
  title: 'Components/ChatWindow',
  component: ChatWindow,
  parameters: {
    docs: {
      description: {
        component: `
          Complete chat interface component.

          **[📖 Full Documentation](https://docs.clarity-chat.dev/reference/components/chat-window)**
        `,
      },
    },
  },
}
```

### Example 3: Cross-References

```tsx
// In docs, reference related components
<StorybookLink
  story="components-message--default"
  componentName="Message"
  variant="inline"
/> component for individual messages
```

---

## 🚀 Quick Start

### Add to One Component

1. **In Docs**:
```bash
# Edit component page
code apps/docs/app/reference/components/chat-window/page.tsx

# Add import and component
import { ViewInStorybook } from '@/components/Links/StorybookLink'

# Add after description
<ViewInStorybook component="ChatWindow" />
```

2. **In Storybook**:
```bash
# Edit story file
code apps/storybook/stories/ChatWindow.stories.tsx

# Add to component description
parameters: {
  docs: {
    description: {
      component: '**[📖 View Docs →](https://docs.clarity-chat.dev/reference/components/chat-window)**'
    }
  }
}
```

3. **Test**:
```bash
# Start both
npm run docs & npm run storybook

# Click links to verify
```

---

## 📚 Resources

- **StorybookLink Component**: `components/Links/StorybookLink.tsx`
- **Storybook Docs**: https://storybook.js.org/docs/react/writing-docs/docs-page
- **Next.js Links**: https://nextjs.org/docs/api-reference/next/link

---

## ✅ Success Criteria

### User Experience
- ✅ One-click navigation between systems
- ✅ Clear visual indication of links
- ✅ Consistent link placement
- ✅ Mobile-friendly

### Technical
- ✅ All links work (no 404s)
- ✅ URLs are correct
- ✅ Opens in new tabs
- ✅ Accessible (keyboard, screen readers)

### Maintenance
- ✅ Easy to add new links
- ✅ Documented process
- ✅ Automated where possible
- ✅ Part of templates

---

**Last Updated**: 2025-11-17
**Status**: ✅ Component Created, Ready to Implement
**Effort**: ~2-3 hours for full implementation

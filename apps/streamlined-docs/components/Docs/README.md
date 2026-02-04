# Documentation UI Components

Comprehensive set of reusable, accessible, and responsive UI components for building documentation sites. All components are built with TypeScript, support dark mode, and follow WCAG 2.1 AA accessibility guidelines.

## Table of Contents

- [Core Components](#core-components)
- [Navigation Components](#navigation-components)
- [Layout Components](#layout-components)
- [Interactive Components](#interactive-components)
- [Design System Integration](#design-system-integration)
- [Usage Examples](#usage-examples)

## Core Components

### APICard

Display API metadata in interactive cards with hover effects and visual badges.

**Features:**
- Visual type badges (component, hook, utility, service)
- Status indicators (new, experimental, deprecated)
- Hover effects with gradient glow
- Links to detailed documentation
- Tag filtering support

**Props:**
```typescript
interface APICardProps {
  api: APIMetadata
  className?: string
  onClick?: () => void
  showFullDescription?: boolean
  animationDelay?: number
}
```

**Example:**
```tsx
import { APICard } from '@/components/Docs'

<APICard
  api={{
    slug: 'use-chat',
    name: 'useChat',
    type: 'hook',
    description: 'Main hook for managing chat state and interactions',
    category: 'Core Hooks',
    isNew: true,
    tags: ['chat', 'state', 'streaming']
  }}
/>
```

### CodeBlock

Enhanced syntax-highlighted code block with copy and download functionality.

**Features:**
- Syntax highlighting
- Copy to clipboard
- Download as file
- Line numbers (optional)
- Line highlighting
- Language badge
- File name display

**Props:**
```typescript
interface CodeBlockProps {
  code: string
  language: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  filename?: string
  className?: string
  maxHeight?: string
  showCopyButton?: boolean
  showDownloadButton?: boolean
}
```

**Example:**
```tsx
import { CodeBlock } from '@/components/Docs'

<CodeBlock
  code={`const greeting = "Hello, World!"`}
  language="typescript"
  filename="example.ts"
  showLineNumbers
  highlightLines={[1]}
/>
```

### ExampleSection

Display runnable code examples with live preview.

**Features:**
- Tabbed interface (code/preview)
- Live preview rendering
- Collapsible sections
- Copy code functionality
- Responsive design

**Props:**
```typescript
interface ExampleSectionProps {
  title: string
  description?: string
  code: string
  language?: string
  preview?: React.ReactNode
  defaultShowPreview?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
  className?: string
}
```

**Example:**
```tsx
import { ExampleSection } from '@/components/Docs'

<ExampleSection
  title="Basic Chat Example"
  description="A simple chat interface"
  code={chatCode}
  language="tsx"
  preview={<ChatDemo />}
  defaultShowPreview
/>
```

### RelatedAPIs

Display links to related documentation with visual grouping.

**Features:**
- Grouped by category or type
- Visual icons for API types
- Hover effects
- Responsive grid layout
- Compact variant available

**Props:**
```typescript
interface RelatedAPIsProps {
  apis: RelatedAPI[]
  title?: string
  className?: string
  groupByType?: boolean
}
```

**Example:**
```tsx
import { RelatedAPIs } from '@/components/Docs'

<RelatedAPIs
  apis={[
    { name: 'ChatWindow', slug: 'chat-window', type: 'component' },
    { name: 'useMessages', slug: 'use-messages', type: 'hook' }
  ]}
  groupByType
/>
```

## Navigation Components

### DocsSidebar

Collapsible navigation tree with search and keyboard navigation.

**Features:**
- Nested navigation structure
- Auto-expand active section
- Search/filter functionality
- Responsive mobile drawer
- Keyboard navigation
- Sticky positioning

**Props:**
```typescript
interface DocsSidebarProps {
  items: NavItem[]
  className?: string
  enableSearch?: boolean
  defaultExpanded?: string[]
}
```

**Example:**
```tsx
import { DocsSidebar } from '@/components/Docs'

<DocsSidebar
  items={[
    {
      title: 'Getting Started',
      items: [
        { title: 'Installation', href: '/docs/installation' },
        { title: 'Quick Start', href: '/docs/quick-start' }
      ]
    }
  ]}
  enableSearch
/>
```

### SearchBar

Global search interface with keyboard shortcuts.

**Features:**
- Full-text search
- Keyboard shortcuts (Cmd+K)
- Search results with highlighting
- Recent searches
- Keyboard navigation (arrows, enter)
- Category filtering

**Props:**
```typescript
interface SearchBarProps {
  results?: SearchResult[]
  isSearching?: boolean
  onSearch?: (query: string) => void
  onSelectResult?: (result: SearchResult) => void
  placeholder?: string
  className?: string
  showRecent?: boolean
  recentSearches?: string[]
}
```

**Example:**
```tsx
import { SearchBar } from '@/components/Docs'

<SearchBar
  onSearch={(query) => console.log('Search:', query)}
  onSelectResult={(result) => router.push(result.href)}
  showRecent
/>
```

## Layout Components

### DocPage

Standard page layout for documentation with breadcrumbs, TOC, and navigation.

**Features:**
- Consistent page structure
- Breadcrumb navigation
- Table of contents sidebar
- Previous/Next navigation
- Edit on GitHub link
- Contributors display
- Last updated date

**Props:**
```typescript
interface DocPageProps {
  title: string
  description?: string
  breadcrumbs?: Array<{ label: string; href: string }>
  children: React.ReactNode
  tableOfContents?: React.ReactNode
  previousPage?: { title: string; href: string }
  nextPage?: { title: string; href: string }
  editUrl?: string
  className?: string
  lastUpdated?: Date
  contributors?: Array<{ name: string; avatar?: string }>
}
```

**Example:**
```tsx
import { DocPage } from '@/components/Docs'

<DocPage
  title="Installation Guide"
  description="Get started with Clarity Chat in minutes"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'Installation', href: '/docs/installation' }
  ]}
  nextPage={{ title: 'Quick Start', href: '/docs/quick-start' }}
  editUrl="https://github.com/user/repo/edit/main/docs/installation.md"
>
  {/* Page content */}
</DocPage>
```

### TwoColumnLayout

Sidebar + content layout with responsive design.

**Features:**
- Responsive sidebar (drawer on mobile)
- Sticky sidebar option
- Optional right sidebar
- Customizable widths

**Props:**
```typescript
interface TwoColumnLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
  rightSidebar?: React.ReactNode
  sidebarWidth?: string
  rightSidebarWidth?: string
  stickySidebar?: boolean
  stickyRightSidebar?: boolean
  className?: string
}
```

**Example:**
```tsx
import { TwoColumnLayout } from '@/components/Docs'

<TwoColumnLayout
  sidebar={<DocsSidebar items={navItems} />}
  rightSidebar={<TableOfContents />}
>
  {/* Main content */}
</TwoColumnLayout>
```

## Interactive Components

### CopyButton

Copy text to clipboard with visual feedback.

**Features:**
- Copy to clipboard
- Visual feedback (icon animation)
- Multiple sizes and variants
- Tooltip support
- Success callback

**Props:**
```typescript
interface CopyButtonProps {
  text: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outline' | 'solid'
  showTooltip?: boolean
  tooltipText?: string
  successTooltipText?: string
  className?: string
  onCopy?: () => void
}
```

**Example:**
```tsx
import { CopyButton } from '@/components/Docs'

<CopyButton
  text="npm install @clarity-chat/react"
  size="md"
  variant="ghost"
  showTooltip
/>
```

### ToggleCode

Show/hide code sections with smooth animations.

**Features:**
- Expandable/collapsible
- Smooth height animations
- Configurable default state
- Code block integration

**Props:**
```typescript
interface ToggleCodeProps {
  code: string
  language: string
  title?: string
  defaultExpanded?: boolean
  className?: string
  showLineNumbers?: boolean
  filename?: string
}
```

**Example:**
```tsx
import { ToggleCode } from '@/components/Docs'

<ToggleCode
  code={advancedCode}
  language="typescript"
  title="Advanced Configuration"
  defaultExpanded={false}
  filename="config.ts"
/>
```

## Design System Integration

All components are integrated with the existing Tailwind design system:

**Color Palette:**
- Primary: Indigo (`brand-500`)
- Accent: Pink (`accent-500`)
- Semantic colors: success, warning, error
- Dark mode support via `dark:` variants

**Typography:**
- Font families: Geist Sans, Geist Mono
- Responsive text sizes
- Consistent line heights

**Spacing:**
- 4px base unit
- Consistent padding/margins
- Responsive breakpoints

**Shadows:**
- Light/dark mode aware
- Brand glow effects
- Glass morphism support

**Animations:**
- Consistent durations (0.2s, 0.3s, 0.4s)
- Smooth easing curves
- Reduced motion support

## Accessibility Features

All components follow WCAG 2.1 AA guidelines:

- **Keyboard Navigation:** Full keyboard support with visible focus indicators
- **Screen Readers:** Proper ARIA labels, roles, and live regions
- **Color Contrast:** Meets 4.5:1 ratio for normal text
- **Focus Management:** Focus trapping in modals, focus restoration
- **Semantic HTML:** Proper heading hierarchy, landmarks
- **Reduced Motion:** Respects `prefers-reduced-motion`

## Responsive Design

Mobile-first approach with breakpoints:

- **Mobile:** < 640px (single column)
- **Tablet:** 640px - 1024px (2 columns)
- **Desktop:** > 1024px (3 columns with sidebars)
- **Large Desktop:** > 1280px (full layout)

## Usage Examples

### Complete Documentation Page

```tsx
import {
  DocPage,
  TwoColumnLayout,
  DocsSidebar,
  TableOfContents,
  APICard,
  CodeBlock,
  ExampleSection,
  RelatedAPIs
} from '@/components/Docs'

export default function APIDocPage() {
  return (
    <TwoColumnLayout
      sidebar={<DocsSidebar items={navItems} />}
      rightSidebar={<TableOfContents />}
    >
      <DocPage
        title="useChat Hook"
        description="Main hook for managing chat state"
        breadcrumbs={breadcrumbs}
        nextPage={{ title: 'ChatWindow', href: '/api/chat-window' }}
      >
        <APICard api={apiMetadata} />

        <h2>Installation</h2>
        <CodeBlock
          code="npm install @clarity-chat/react"
          language="bash"
        />

        <h2>Basic Usage</h2>
        <ExampleSection
          title="Simple Chat"
          code={exampleCode}
          preview={<ChatExample />}
        />

        <h2>Related APIs</h2>
        <RelatedAPIs apis={relatedApis} />
      </DocPage>
    </TwoColumnLayout>
  )
}
```

### Search Integration

```tsx
import { SearchBar } from '@/components/Docs'
import { useState } from 'react'

export function DocsSearch() {
  const [results, setResults] = useState([])

  const handleSearch = async (query: string) => {
    const res = await fetch(`/api/search?q=${query}`)
    const data = await res.json()
    setResults(data)
  }

  return (
    <SearchBar
      results={results}
      onSearch={handleSearch}
      onSelectResult={(result) => router.push(result.href)}
    />
  )
}
```

## Component Checklist

✅ **Core Documentation Components**
- [x] APICard - Display API metadata in cards
- [x] CodeBlock - Syntax highlighted code with copy button
- [x] ExampleSection - Runnable code examples
- [x] RelatedAPIs - Links to related documentation

✅ **Navigation Components**
- [x] DocsSidebar - Collapsible navigation tree
- [x] SearchBar - Global search interface
- [x] Breadcrumbs - Current location indicator (existing)
- [x] TableOfContents - In-page navigation (existing)

✅ **Interactive Components**
- [x] LivePlayground - Embedded CodeSandbox (existing, enhanced)
- [x] DocsAssistant - Chat interface (existing, enhanced)
- [x] CopyButton - Copy code to clipboard
- [x] ToggleCode - Show/hide code sections

✅ **Layout Components**
- [x] DocPage - Standard page layout
- [x] TwoColumnLayout - Sidebar + content
- [x] ThreeColumnLayout - Sidebar + content + TOC

✅ **Design System Integration**
- [x] Tailwind configuration
- [x] Consistent spacing, colors, typography
- [x] Dark mode support
- [x] Responsive breakpoints

## Performance Optimizations

- **React.memo:** Applied to expensive components
- **useMemo/useCallback:** Prevent unnecessary re-renders
- **Lazy loading:** Components loaded on demand
- **Code splitting:** Separate bundles for heavy features
- **Virtualization:** Large lists use virtual scrolling
- **Bundle size:** < 200KB gzipped for core components

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## License

MIT License - see main project LICENSE file

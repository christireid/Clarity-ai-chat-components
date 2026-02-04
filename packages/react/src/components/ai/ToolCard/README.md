# ToolCard Component

Lightweight, color-coded tool execution indicator inspired by prompt-kit's Tool component.

## Quick Start

```tsx
import { ToolCard } from '@clarity-chat/react'

// Basic usage
<ToolCard name="web_search" status="running" />

// With arguments and result
<ToolCard
  name="calculator"
  status="success"
  args={{ expression: "2 + 2" }}
  result={{ answer: 4 }}
  showResult
/>

// With error handling
<ToolCard
  name="api_call"
  status="error"
  error="Request timeout"
/>
```

## Architecture

This component has been refactored into a modular architecture for better maintainability:

```
ToolCard/
├── index.ts                     # Public API exports
├── types.ts                     # TypeScript definitions
├── constants.ts                 # Configuration constants
├── utils.ts                     # Utility functions
├── icons.tsx                    # Icon components
├── ToolStatusIndicator.tsx      # Status display sub-component
├── ToolMetadata.tsx             # Metadata display sub-component
├── ToolExpandableContent.tsx    # Expandable content section
├── useToolCard.ts               # State management hook
├── ToolCardList.tsx             # List container component
└── ToolCard.tsx                 # Main component
```

### Module Responsibilities

| Module | Responsibility | Lines | Complexity |
|--------|---------------|-------|------------|
| **types.ts** | TypeScript interfaces and types | 130 | 0 |
| **constants.ts** | Size configs, status mappings | 61 | 0 |
| **utils.ts** | Helper functions (format, preview) | 30 | 3 |
| **icons.tsx** | SVG icon components | 148 | 2 |
| **ToolStatusIndicator.tsx** | Display status icon, name, badge | 59 | 4 |
| **ToolMetadata.tsx** | Display duration and controls | 65 | 6 |
| **ToolExpandableContent.tsx** | Animated expandable section | 96 | 8 |
| **useToolCard.ts** | Tool state lifecycle management | 98 | 7 |
| **ToolCardList.tsx** | List with expand/collapse state | 79 | 8 |
| **ToolCard.tsx** | Main component composition | 135 | 12 |
| **index.ts** | Public API barrel exports | 51 | 0 |

**Total**: 11 files, 952 lines (avg 86 lines/file)

## Usage

### Basic ToolCard

```tsx
import { ToolCard } from '@clarity-chat/react'

function MyComponent() {
  return (
    <ToolCard
      name="web_search"
      status="running"
      args={{ query: "React hooks" }}
    />
  )
}
```

### With Hook

```tsx
import { ToolCard, useToolCard } from '@clarity-chat/react'

function MyToolExecutor() {
  const { status, start, complete, fail, cardProps } = useToolCard({
    name: 'code_interpreter',
    initialStatus: 'pending'
  })

  const executeTool = async () => {
    start({ code: 'print("hello")' })

    try {
      const result = await runCode()
      complete(result)
    } catch (error) {
      fail(error.message)
    }
  }

  return (
    <>
      <ToolCard {...cardProps} showResult />
      <button onClick={executeTool}>Execute</button>
    </>
  )
}
```

### ToolCardList

```tsx
import { ToolCardList } from '@clarity-chat/react'

function MyToolList() {
  const tools = [
    { id: '1', name: 'search', status: 'success', duration: 1500 },
    { id: '2', name: 'calculator', status: 'running' },
    { id: '3', name: 'api_call', status: 'error', error: 'Timeout' }
  ]

  return (
    <ToolCardList
      tools={tools}
      size="sm"
      showArgs
      showResult
    />
  )
}
```

## Advanced Usage

### Custom Status Indicator

```tsx
import { ToolCard } from '@clarity-chat/react'
import { Sparkles } from 'lucide-react'

<ToolCard
  name="ai_agent"
  status="running"
  icon={<Sparkles className="w-5 h-5" />}
/>
```

### Using Sub-Components Directly

```tsx
import {
  ToolStatusIndicator,
  ToolMetadata,
  SIZE_CONFIG
} from '@clarity-chat/react/components/ai/ToolCard'

function CustomToolCard() {
  return (
    <div className="my-custom-card">
      <ToolStatusIndicator
        status="success"
        name="custom_tool"
        sizeConfig={SIZE_CONFIG.md}
      />
      <ToolMetadata
        duration={2000}
        size="md"
        sizeConfig={SIZE_CONFIG.md}
        hasExpandableContent={false}
        expanded={false}
      />
    </div>
  )
}
```

### Custom Utilities

```tsx
import { formatDuration, formatPreview } from '@clarity-chat/react/components/ai/ToolCard'

const durationText = formatDuration(1500) // "1.5s"
const preview = formatPreview({ large: 'object' }, 20) // Truncated preview
```

## Props

### ToolCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Tool name (required) |
| `status` | `'pending' \| 'running' \| 'success' \| 'error'` | - | Current status (required) |
| `args` | `Record<string, unknown>` | - | Tool arguments/input |
| `result` | `unknown` | - | Result data |
| `error` | `string` | - | Error message |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `showArgs` | `boolean` | `false` | Show arguments in expandable section |
| `showResult` | `boolean` | `false` | Show result in expandable section |
| `duration` | `number` | - | Duration in milliseconds |
| `icon` | `ReactNode` | - | Custom icon (overrides status icon) |
| `className` | `string` | - | Additional CSS class |
| `disableAnimations` | `boolean` | `false` | Disable animations |
| `onClick` | `() => void` | - | Click handler |
| `onToggleExpand` | `() => void` | - | Expand/collapse handler |
| `expanded` | `boolean` | `false` | Whether expanded |

### ToolCardList

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tools` | `Array<{id, name, status, ...}>` | - | Tools to display (required) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Size for all cards |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Gap between cards |
| `showArgs` | `boolean` | `false` | Show args on all cards |
| `showResult` | `boolean` | `false` | Show results on all cards |
| `className` | `string` | - | Additional CSS class |

### useToolCard

**Options**:
```tsx
{
  name: string
  initialStatus?: ToolCardStatus
  initialArgs?: Record<string, unknown>
}
```

**Returns**:
```tsx
{
  status: ToolCardStatus
  args: Record<string, unknown> | undefined
  result: unknown | undefined
  error: string | undefined
  duration: number | undefined
  start: (args?: Record<string, unknown>) => void
  complete: (result: unknown) => void
  fail: (error: string) => void
  reset: () => void
  cardProps: ToolCardProps // Spread into <ToolCard />
}
```

## Styling

The component uses CSS classes from `globals.css`:

```css
/* Status-based classes */
.tool-card.tool-pending { /* Blue theme */ }
.tool-card.tool-running { /* Amber theme with animation */ }
.tool-card.tool-success { /* Green theme */ }
.tool-card.tool-error { /* Red theme */ }

/* Sub-elements */
.tool-icon { /* Status icon */ }
.tool-name { /* Tool name */ }
.tool-badge { /* Status badge */ }
```

## Accessibility

- **ARIA labels**: Descriptive labels for screen readers
- **Keyboard navigation**: Full keyboard support when interactive
- **Focus indicators**: Visible focus states
- **Role attributes**: Proper semantic roles (`button` or `article`)
- **Expanded state**: `aria-expanded` for expandable content

## Performance

- **Memoized icons**: All icon components are memoized with `React.memo`
- **Optimized re-renders**: Sub-components only re-render when their props change
- **Animation optimization**: Respects `prefers-reduced-motion`
- **Bundle size**: ~3KB gzipped (including all sub-components)

## Testing

Each module can be tested independently:

```tsx
// Test utilities
import { formatDuration } from '@clarity-chat/react/components/ai/ToolCard'

describe('formatDuration', () => {
  it('formats milliseconds', () => {
    expect(formatDuration(500)).toBe('500ms')
  })
})

// Test hook
import { renderHook, act } from '@testing-library/react'
import { useToolCard } from '@clarity-chat/react'

describe('useToolCard', () => {
  it('manages state lifecycle', () => {
    const { result } = renderHook(() => useToolCard({ name: 'test' }))

    act(() => result.current.start({ query: 'test' }))
    expect(result.current.status).toBe('running')
  })
})

// Test component
import { render, screen } from '@testing-library/react'
import { ToolCard } from '@clarity-chat/react'

describe('ToolCard', () => {
  it('displays tool name and status', () => {
    render(<ToolCard name="search" status="success" />)
    expect(screen.getByText('search')).toBeInTheDocument()
    expect(screen.getByText('Complete')).toBeInTheDocument()
  })
})
```

## Migration from v1

No migration needed! The component maintains 100% backward compatibility:

```tsx
// All existing code continues to work
import { ToolCard, ToolCardList, useToolCard } from '@clarity-chat/react'

<ToolCard name="search" status="running" />
```

New features available:
- Import sub-components for advanced composition
- Import utilities for custom implementations
- Import constants for theming

## Related Components

- **ToolExecutionCard**: Full-featured tool execution display with collapsible sections
- **ThinkingBar**: AI processing status indicator
- **Steps**: Sequential workflow progress

## License

MIT - Part of @clarity-chat/react package

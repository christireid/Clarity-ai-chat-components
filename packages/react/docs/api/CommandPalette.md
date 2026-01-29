# CommandPalette API Documentation

> **Component**: CommandPalette
> **Package**: @clarity-chat/react
> **Version**: 1.0+
> **Last Updated**: January 28, 2026

A fully accessible command palette component with keyboard navigation, search filtering, and AI context display. Implements WCAG 2.1 AA standards with combobox and listbox ARIA patterns.

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [TypeScript Interfaces](#typescript-interfaces)
4. [Props](#props)
5. [Usage Examples](#usage-examples)
6. [Event Handlers](#event-handlers)
7. [Keyboard Navigation](#keyboard-navigation)
8. [Accessibility](#accessibility)
9. [Styling](#styling)
10. [Performance](#performance)
11. [Best Practices](#best-practices)

---

## Overview

The `CommandPalette` component provides a command-k style interface for executing commands quickly. Features include:

- Full keyboard navigation (Arrow keys, Home, End, Enter, Escape)
- Search filtering across labels, descriptions, and categories
- Category grouping with staggered animations
- AI context display in footer
- Focus trap and restoration
- Body scroll lock when open
- Reduced motion support
- Portal rendering for proper z-index layering

---

## Installation

```bash
# Install dependencies
pnpm add @clarity-chat/react framer-motion

# Optional: Install primitives package
pnpm add @clarity-chat/primitives
```

Import the component:

```tsx
import { CommandPalette } from '@clarity-chat/react'
import type { CommandItem, AIContext } from '@clarity-chat/react'
```

---

## TypeScript Interfaces

### CommandItem

Represents a single command in the palette.

```typescript
interface CommandItem {
  /** Unique identifier for the command */
  id: string

  /** Display label for the command */
  label: string

  /** Optional description shown below the label */
  description?: string

  /** Optional icon element (React node) */
  icon?: React.ReactNode

  /** Optional keyboard shortcut keys (e.g., ['Cmd', 'K']) */
  shortcut?: string[]

  /** Optional category for grouping (defaults to "Commands") */
  category?: string

  /** Callback executed when command is selected */
  onSelect: () => void
}
```

**Example:**

```typescript
const commandItem: CommandItem = {
  id: 'new-chat',
  label: 'New Chat',
  description: 'Start a new conversation',
  icon: <PlusIcon className="w-5 h-5" />,
  shortcut: ['Cmd', 'N'],
  category: 'Chat',
  onSelect: () => createNewChat(),
}
```

---

### AIContext

AI-specific context information displayed in the command palette footer.

```typescript
interface AIContext {
  /** Current AI model name (e.g., "Claude 3.5 Sonnet") */
  modelName?: string

  /** Active conversation ID */
  conversationId?: string

  /** Token usage statistics */
  tokenUsage?: {
    input?: number
    output?: number
    total?: number
  }

  /** Additional metadata */
  metadata?: Record<string, string | number>
}
```

**Example:**

```typescript
const aiContext: AIContext = {
  modelName: 'Claude 3.5 Sonnet',
  conversationId: 'conv-abc123',
  tokenUsage: {
    input: 1250,
    output: 850,
    total: 2100,
  },
  metadata: {
    temperature: 0.7,
    maxTokens: 4096,
  },
}
```

---

### CommandPaletteProps

Main component props interface.

```typescript
interface CommandPaletteProps {
  /** Array of command items to display */
  items: CommandItem[]

  /** Whether the palette is open */
  open: boolean

  /** Callback when palette should close */
  onClose: () => void

  /** Placeholder text for search input */
  placeholder?: string

  /** Additional CSS classes */
  className?: string

  /** Show loading spinner during async operations */
  loading?: boolean

  /** Accessible label for the command palette */
  'aria-label'?: string

  /** AI context information to display in footer */
  aiContext?: AIContext

  /** Ref for the dialog element */
  ref?: React.Ref<HTMLDivElement>
}
```

---

## Props

### Required Props

#### `items`

- **Type**: `CommandItem[]`
- **Description**: Array of command items to display in the palette
- **Example**:

```tsx
const items: CommandItem[] = [
  {
    id: '1',
    label: 'New Chat',
    description: 'Start a new conversation',
    category: 'Chat',
    onSelect: () => console.log('New chat'),
  },
  {
    id: '2',
    label: 'Settings',
    description: 'Open settings',
    category: 'System',
    onSelect: () => console.log('Settings'),
  },
]
```

#### `open`

- **Type**: `boolean`
- **Description**: Controls whether the command palette is visible
- **Example**: `open={isOpen}`

#### `onClose`

- **Type**: `() => void`
- **Description**: Callback function invoked when the palette should close (Escape key, backdrop click, or command selection)
- **Example**: `onClose={() => setIsOpen(false)}`

---

### Optional Props

#### `placeholder`

- **Type**: `string`
- **Default**: `'Type a command...'`
- **Description**: Placeholder text shown in the search input
- **Example**: `placeholder="Search commands..."`

#### `className`

- **Type**: `string`
- **Description**: Additional CSS classes applied to the dialog container
- **Example**: `className="custom-palette"`

#### `loading`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: When true, displays a loading spinner instead of the search icon
- **Example**: `loading={isLoadingCommands}`

#### `aria-label`

- **Type**: `string`
- **Default**: `'Command palette'`
- **Description**: Accessible label for the dialog element
- **Example**: `aria-label="Quick actions menu"`

#### `aiContext`

- **Type**: `AIContext | undefined`
- **Description**: AI-specific context information displayed in the footer
- **Example**:

```tsx
aiContext={{
  modelName: 'Claude 3.5 Sonnet',
  conversationId: 'conv-123',
  tokenUsage: { total: 2100 }
}}
```

#### `ref`

- **Type**: `React.Ref<HTMLDivElement>`
- **Description**: Ref forwarded to the dialog element
- **Example**: `ref={dialogRef}`

---

## Usage Examples

### Basic Usage

```tsx
import { useState } from 'react'
import { CommandPalette, CommandItem } from '@clarity-chat/react'

export function App() {
  const [open, setOpen] = useState(false)

  const commands: CommandItem[] = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      onSelect: () => {
        console.log('New chat')
        setOpen(false)
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Open settings',
      onSelect: () => {
        console.log('Settings')
        setOpen(false)
      },
    },
  ]

  // Open with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Command Palette</button>
      <CommandPalette items={commands} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
```

---

### With Categories and Icons

```tsx
import { CommandPalette, CommandItem } from '@clarity-chat/react'
import { PlusIcon, TrashIcon, SettingsIcon } from './icons'

const commands: CommandItem[] = [
  {
    id: 'new-chat',
    label: 'New Chat',
    description: 'Start a new conversation',
    icon: <PlusIcon className="w-5 h-5" />,
    shortcut: ['⌘', 'N'],
    category: 'Chat',
    onSelect: () => createNewChat(),
  },
  {
    id: 'delete-chat',
    label: 'Delete Chat',
    description: 'Delete current conversation',
    icon: <TrashIcon className="w-5 h-5" />,
    shortcut: ['⌘', 'D'],
    category: 'Chat',
    onSelect: () => deleteChat(),
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Open settings',
    icon: <SettingsIcon className="w-5 h-5" />,
    shortcut: ['⌘', ','],
    category: 'System',
    onSelect: () => openSettings(),
  },
]

function App() {
  const [open, setOpen] = useState(false)

  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
      placeholder="Type a command or search..."
    />
  )
}
```

---

### With AI Context

```tsx
import { CommandPalette, AIContext } from '@clarity-chat/react'

function AICommandPalette() {
  const [open, setOpen] = useState(false)

  const aiContext: AIContext = {
    modelName: 'Claude 3.5 Sonnet',
    conversationId: 'conv-abc123',
    tokenUsage: {
      input: 1250,
      output: 850,
      total: 2100,
    },
  }

  const commands = [
    {
      id: 'switch-model',
      label: 'Switch Model',
      description: 'Change AI model',
      category: 'AI',
      onSelect: () => showModelSelector(),
    },
    {
      id: 'view-tokens',
      label: 'Token Usage',
      description: 'View detailed token usage',
      category: 'AI',
      onSelect: () => showTokenUsage(),
    },
  ]

  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
      aiContext={aiContext}
      aria-label="AI command palette"
    />
  )
}
```

---

### With Loading State

```tsx
import { CommandPalette } from '@clarity-chat/react'
import { useQuery } from '@tanstack/react-query'

function DynamicCommandPalette() {
  const [open, setOpen] = useState(false)

  const { data: commands = [], isLoading } = useQuery({
    queryKey: ['commands'],
    queryFn: fetchCommands,
    enabled: open, // Only fetch when open
  })

  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
      loading={isLoading}
      placeholder="Loading commands..."
    />
  )
}
```

---

### With Custom Styling

```tsx
import { CommandPalette } from '@clarity-chat/react'

function StyledCommandPalette() {
  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
      className="max-w-3xl custom-shadow"
      placeholder="What would you like to do?"
    />
  )
}
```

---

## Event Handlers

### CommandItem.onSelect

The `onSelect` callback is invoked when a command is selected via:

- Clicking the command
- Pressing Enter while the command is highlighted
- The palette automatically closes after selection

```typescript
const command: CommandItem = {
  id: 'export',
  label: 'Export Chat',
  onSelect: () => {
    // 1. Perform action
    exportChat()

    // 2. Palette closes automatically
    // No need to manually call onClose()
  },
}
```

### CommandPaletteProps.onClose

The `onClose` callback is invoked when:

- User presses Escape key
- User clicks the backdrop
- A command is selected (after `onSelect` completes)

```typescript
<CommandPalette
  items={commands}
  open={open}
  onClose={() => {
    // Clean up state
    setOpen(false)
    setSearchQuery('')
  }}
/>
```

---

## Keyboard Navigation

### Supported Keys

| Key                | Action                                 |
| ------------------ | -------------------------------------- |
| `Cmd/Ctrl + K`     | Open palette (implement externally)    |
| `Escape`           | Close palette                          |
| `ArrowDown`        | Select next command                    |
| `ArrowUp`          | Select previous command                |
| `Home`             | Select first command                   |
| `End`              | Select last command                    |
| `Enter`            | Execute selected command and close     |
| `Tab`              | Focus next focusable element           |
| `Shift + Tab`      | Focus previous focusable element       |
| Any text character | Type in search input (auto-focused)    |
| Click X button     | Clear search                           |
| Click backdrop     | Close palette                          |

### Focus Management

The component implements advanced focus management:

1. **Auto-focus**: Input is automatically focused when palette opens
2. **Focus trap**: Tab/Shift+Tab cycles through focusable elements
3. **Focus restoration**: Focus returns to previous element when closed
4. **Scroll into view**: Selected item scrolls into view automatically

```tsx
// Example: External keyboard shortcut handler
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setOpen(true)
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

---

## Accessibility

The CommandPalette implements comprehensive accessibility features following WCAG 2.1 AA standards.

### ARIA Patterns

#### Combobox Pattern (Search Input)

```html
<input
  role="combobox"
  aria-expanded="true"
  aria-controls="listbox-id"
  aria-activedescendant="option-id"
  aria-autocomplete="list"
  aria-busy="false"
/>
```

#### Listbox Pattern (Results)

```html
<div role="listbox" aria-label="Commands">
  <div role="group" aria-labelledby="category-id">
    <button
      role="option"
      aria-selected="true"
      id="option-id"
      tabindex="0"
    >
      Command Label
    </button>
  </div>
</div>
```

### ARIA Attributes

| Attribute             | Element | Purpose                                  |
| --------------------- | ------- | ---------------------------------------- |
| `role="dialog"`       | Dialog  | Identifies the command palette           |
| `aria-modal="true"`   | Dialog  | Indicates modal behavior                 |
| `aria-label`          | Dialog  | Provides accessible name                 |
| `role="combobox"`     | Input   | Identifies searchable input              |
| `aria-expanded`       | Input   | Indicates listbox is visible             |
| `aria-controls`       | Input   | Links input to listbox                   |
| `aria-activedescendant` | Input | Points to currently selected option    |
| `aria-autocomplete`   | Input   | Indicates autocomplete behavior          |
| `aria-busy`           | Input   | Shows loading state                      |
| `role="listbox"`      | Results | Identifies list of options               |
| `role="group"`        | Category| Groups related options                   |
| `role="option"`       | Item    | Identifies selectable option             |
| `aria-selected`       | Item    | Indicates selected state                 |
| `aria-live="polite"`  | Status  | Announces result count to screen readers |

### Screen Reader Support

The component includes screen reader announcements for:

- Number of available commands when filtered
- "No commands found" message when search returns empty
- Loading state during async operations

```tsx
// Live region for screen reader announcements
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {filteredItems.length} {filteredItems.length === 1 ? 'command' : 'commands'} available
</div>
```

### Keyboard Navigation

All interactive elements are keyboard accessible:

- Full keyboard navigation (documented above)
- Focus indicators on all focusable elements
- No keyboard traps (except intentional focus trap)
- Skip links not needed (modal context)

### Color Contrast

All text meets WCAG AA standards:

- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive elements: 3:1 contrast ratio

### Reduced Motion

Respects `prefers-reduced-motion` user preference:

```tsx
const prefersReducedMotion = useReducedMotion()

// Animations are disabled when user prefers reduced motion
<motion.div
  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
>
  {content}
</motion.div>
```

---

## Styling

### Default Styles

The component uses Tailwind CSS and CSS custom properties for theming.

### CSS Custom Properties

```css
/* Z-index layers */
--z-modal-backdrop: 50; /* Backdrop layer */
--z-modal: 51;         /* Dialog layer */

/* Scrollbar (hidden by default) */
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

### Tailwind Classes

The component uses semantic Tailwind classes that adapt to your theme:

```tsx
// Dialog positioning and sizing
'fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4'

// Card appearance
'bg-card border shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1)]'

// Item states
'bg-primary text-primary-foreground' // Selected
'hover:bg-accent' // Hover
```

### Custom Styling

Override default styles with the `className` prop:

```tsx
<CommandPalette
  className="max-w-3xl top-[10%] bg-gray-900 border-gray-700"
  items={commands}
  open={open}
  onClose={() => setOpen(false)}
/>
```

### Styling Command Items

Customize command item icons and layout:

```tsx
const commands: CommandItem[] = [
  {
    id: 'custom',
    label: 'Custom Command',
    icon: (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500">
        <span className="text-white text-sm font-bold">C</span>
      </div>
    ),
    onSelect: () => {},
  },
]
```

---

## Performance

### Optimizations

The component implements several performance optimizations:

#### 1. Debounced Search

Search input is debounced by 150ms to prevent excessive filtering:

```tsx
const debouncedSearch = useDebounce(search, 150)

const filteredItems = useMemo(() => {
  if (!debouncedSearch) return items
  // Filter logic
}, [items, debouncedSearch])
```

#### 2. Memoized Filtering

Filter logic is memoized to prevent unnecessary recalculations:

```tsx
const filteredItems = useMemo(() => {
  // Expensive filtering operation
}, [items, debouncedSearch])
```

#### 3. Memoized Grouping

Category grouping is memoized separately:

```tsx
const groupedItems = useMemo(() => {
  // Group by category
}, [filteredItems])
```

#### 4. Portal Rendering

Uses React portal to avoid z-index issues:

```tsx
return createPortal(content, document.body)
```

#### 5. Reduced Motion Detection

Detects and respects reduced motion preference:

```tsx
const prefersReducedMotion = useReducedMotion()
// Conditionally apply animations
```

### Performance Metrics

- **First Paint**: <100ms (portal rendering)
- **Search Response**: <200ms (150ms debounce + filtering)
- **Item Rendering**: ~16ms per frame (60fps animations)
- **Memory**: Minimal overhead (cleanup on unmount)

### Best Practices for Performance

1. **Limit command count**: <100 items for optimal performance
2. **Use virtual scrolling**: For >100 items, consider react-virtual
3. **Lazy load icons**: Import icons dynamically if bundle size is a concern
4. **Memoize callbacks**: Use `useCallback` for `onSelect` handlers
5. **Avoid inline functions**: Define handlers outside render

```tsx
// Good: Memoized handler
const handleNewChat = useCallback(() => {
  createNewChat()
}, [])

const commands = useMemo(() => [
  {
    id: 'new-chat',
    label: 'New Chat',
    onSelect: handleNewChat, // Stable reference
  },
], [handleNewChat])

// Bad: Inline function (creates new reference on every render)
const commands = [
  {
    id: 'new-chat',
    label: 'New Chat',
    onSelect: () => createNewChat(), // New function every render
  },
]
```

---

## Best Practices

### 1. Command Organization

Group related commands by category:

```tsx
const commands: CommandItem[] = [
  // Chat commands
  { id: 'new-chat', label: 'New Chat', category: 'Chat', onSelect: () => {} },
  { id: 'delete-chat', label: 'Delete Chat', category: 'Chat', onSelect: () => {} },

  // System commands
  { id: 'settings', label: 'Settings', category: 'System', onSelect: () => {} },
  { id: 'logout', label: 'Logout', category: 'System', onSelect: () => {} },

  // AI commands
  { id: 'switch-model', label: 'Switch Model', category: 'AI', onSelect: () => {} },
]
```

### 2. Descriptive Labels

Use clear, action-oriented labels and descriptions:

```tsx
// Good
{
  label: 'New Chat',
  description: 'Start a new conversation',
}

// Bad
{
  label: 'Chat',
  description: 'Chat stuff',
}
```

### 3. Keyboard Shortcuts

Include keyboard shortcuts for common actions:

```tsx
{
  label: 'New Chat',
  shortcut: ['⌘', 'N'],
  onSelect: () => {},
}

// Implement the shortcut handler separately
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey && e.key === 'n') {
      e.preventDefault()
      createNewChat()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

### 4. Error Handling

Handle errors in `onSelect` callbacks:

```tsx
{
  id: 'delete-chat',
  label: 'Delete Chat',
  onSelect: async () => {
    try {
      await deleteChat()
      toast.success('Chat deleted')
    } catch (error) {
      toast.error('Failed to delete chat')
      console.error(error)
    }
  },
}
```

### 5. State Management

Keep palette state in sync with application state:

```tsx
function App() {
  const [open, setOpen] = useState(false)
  const [conversations, setConversations] = useState([])

  // Regenerate commands when state changes
  const commands = useMemo(
    () =>
      conversations.map((conv) => ({
        id: conv.id,
        label: conv.title,
        description: `Switch to ${conv.title}`,
        category: 'Conversations',
        onSelect: () => switchToConversation(conv.id),
      })),
    [conversations]
  )

  return <CommandPalette items={commands} open={open} onClose={() => setOpen(false)} />
}
```

### 6. Testing

Test keyboard navigation, search, and command execution:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandPalette } from '@clarity-chat/react'

describe('CommandPalette', () => {
  it('filters commands by search', async () => {
    const commands = [
      { id: '1', label: 'New Chat', onSelect: vi.fn() },
      { id: '2', label: 'Settings', onSelect: vi.fn() },
    ]

    render(<CommandPalette items={commands} open={true} onClose={vi.fn()} />)

    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'new')

    expect(screen.getByText('New Chat')).toBeInTheDocument()
    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  })

  it('executes command on Enter', async () => {
    const onSelect = vi.fn()
    const commands = [{ id: '1', label: 'Test', onSelect }]

    render(<CommandPalette items={commands} open={true} onClose={vi.fn()} />)

    fireEvent.keyDown(document, { key: 'Enter' })

    expect(onSelect).toHaveBeenCalled()
  })
})
```

### 7. Accessibility Testing

Test with axe-core and keyboard-only navigation:

```tsx
import { axe } from 'jest-axe'

it('has no accessibility violations', async () => {
  const { container } = render(
    <CommandPalette items={commands} open={true} onClose={vi.fn()} />
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## Related Components

- **Kbd**: Keyboard shortcut display component (used internally)
- **Modal**: Alternative modal dialog component
- **SearchInput**: Standalone search input component

---

## Migration Guide

### From v0.x to v1.x

#### Breaking Changes

1. **items prop**: Now required (was optional)
2. **onSelect**: Must be provided for each item
3. **Portal rendering**: Now uses React portal by default

#### Migration Steps

```tsx
// Before (v0.x)
<CommandPalette
  commands={commands}
  isOpen={open}
  onDismiss={() => setOpen(false)}
/>

// After (v1.x)
<CommandPalette
  items={commands}
  open={open}
  onClose={() => setOpen(false)}
/>
```

---

## Troubleshooting

### Issue: Palette doesn't close on command selection

**Solution**: Ensure `onClose` is called in your command handler:

```tsx
{
  onSelect: () => {
    performAction()
    onClose() // Don't forget this!
  },
}
```

### Issue: Search is slow with many items

**Solution**: The component debounces search by 150ms. For >100 items, consider implementing virtual scrolling.

### Issue: Focus doesn't return after closing

**Solution**: The component uses `useFocusRestoration` which should handle this automatically. Ensure you're not preventing default focus behavior elsewhere.

### Issue: Z-index conflicts

**Solution**: The component uses portal rendering and CSS custom properties. Adjust `--z-modal-backdrop` and `--z-modal` in your CSS:

```css
:root {
  --z-modal-backdrop: 100;
  --z-modal: 101;
}
```

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android latest

---

## License

MIT License - Part of the Clarity AI Chat Components library.

---

## Resources

- [Source Code](https://github.com/your-org/clarity-ai-chat-components)
- [Component Demo](https://clarity-chat.dev/components/command-palette)
- [ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated**: January 28, 2026

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Keyboard Hint',
  description: 'A keyboard shortcuts panel with visual key representations and a hook for managing keyboard shortcuts.',
}

# Keyboard Hint

A keyboard shortcuts panel component that displays available shortcuts with visual key representations, along with a hook for managing keyboard shortcut handlers.

## Overview

The Keyboard Hint package provides two main features:
- **KeyboardHint** - Animated panel showing keyboard shortcuts
- **useKeyboardShortcuts** - React hook for handling keyboard shortcuts

### Key Features

- **Visual Key Display** - Styled `<kbd>` elements for keys
- **Category Grouping** - Organize shortcuts by category
- **5 Position Options** - Top/bottom, left/right, center
- **Animated Entries** - Staggered animations for each shortcut
- **Modal Mode** - Center position with backdrop
- **Auto-grouping** - Automatically groups by category
- **Hook Integration** - Easy shortcut handler management
- **Modifier Keys** - Support for Ctrl, Alt, Shift combinations
- **Cross-platform** - Handles Cmd (Mac) and Ctrl (Windows/Linux)

## Installation

```bash
npm install @clarity-chat/react @clarity-chat/primitives framer-motion
```

## KeyboardHint Component

Display a panel of keyboard shortcuts.

### Basic Usage

```tsx
'use client'

import { useState } from 'react'
import { KeyboardHint } from '@clarity-chat/react'

export default function MyComponent() {
  const [showHints, setShowHints] = useState(false)

  const shortcuts = [
    { keys: ['Ctrl', 'S'], description: 'Save' },
    { keys: ['Ctrl', 'P'], description: 'Print' },
    { keys: ['Ctrl', 'Z'], description: 'Undo' },
    { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
  ]

  return (
    <>
      <button onClick={() => setShowHints(true)}>
        Show Shortcuts
      </button>

      <KeyboardHint
        shortcuts={shortcuts}
        visible={showHints}
        onClose={() => setShowHints(false)}
      />
    </>
  )
}
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shortcuts` | `KeyboardShortcut[]` | **Required** | Array of keyboard shortcuts |
| `visible` | `boolean` | **Required** | Whether panel is visible |
| `onClose` | `() => void` | `undefined` | Callback when close button clicked |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' \| 'center'` | `'bottom-right'` | Panel position |
| `className` | `string` | `undefined` | Additional CSS classes |

### KeyboardShortcut Type

```typescript
interface KeyboardShortcut {
  keys: string[]           // Array of key names
  description: string      // Description of the action
  category?: string        // Optional category for grouping
}
```

### Position Options

```tsx
// Bottom right corner (default)
<KeyboardHint
  shortcuts={shortcuts}
  visible={visible}
  position="bottom-right"
/>

// Top right corner
<KeyboardHint
  shortcuts={shortcuts}
  visible={visible}
  position="top-right"
/>

// Top left corner
<KeyboardHint
  shortcuts={shortcuts}
  visible={visible}
  position="top-left"
/>

// Bottom left corner
<KeyboardHint
  shortcuts={shortcuts}
  visible={visible}
  position="bottom-left"
/>

// Center (with backdrop)
<KeyboardHint
  shortcuts={shortcuts}
  visible={visible}
  position="center"
  onClose={() => setVisible(false)}
/>
```

### Categorized Shortcuts

```tsx
const shortcuts = [
  // Navigation category
  { keys: ['↑'], description: 'Move up', category: 'Navigation' },
  { keys: ['↓'], description: 'Move down', category: 'Navigation' },
  { keys: ['Tab'], description: 'Next field', category: 'Navigation' },
  
  // Editing category
  { keys: ['Ctrl', 'C'], description: 'Copy', category: 'Editing' },
  { keys: ['Ctrl', 'V'], description: 'Paste', category: 'Editing' },
  { keys: ['Ctrl', 'X'], description: 'Cut', category: 'Editing' },
  
  // General category (default if no category specified)
  { keys: ['?'], description: 'Show help' },
]

<KeyboardHint shortcuts={shortcuts} visible={visible} />
```

## useKeyboardShortcuts Hook

React hook for managing keyboard shortcut handlers.

### Basic Usage

```tsx
'use client'

import { useKeyboardShortcuts } from '@clarity-chat/react'

export default function MyComponent() {
  const handleSave = () => console.log('Saved!')
  const handleUndo = () => console.log('Undo!')
  const handleRedo = () => console.log('Redo!')

  useKeyboardShortcuts({
    shortcuts: {
      'ctrl+s': handleSave,
      'ctrl+z': handleUndo,
      'ctrl+shift+z': handleRedo,
    },
  })

  return <div>Press Ctrl+S to save</div>
}
```

### Hook API

```typescript
useKeyboardShortcuts({
  shortcuts: Record<string, () => void>
  enabled?: boolean
})
```

### Shortcut Key Format

The hook uses a simple string format for key combinations:

```typescript
// Single key
'?': () => toggleHelp()

// Ctrl/Cmd + key
'ctrl+s': () => save()

// Alt + key
'alt+n': () => newItem()

// Shift + key
'shift+enter': () => submit()

// Multiple modifiers
'ctrl+shift+z': () => redo()
'ctrl+alt+delete': () => taskManager()
```

**Note:** `ctrl` maps to:
- `Ctrl` on Windows/Linux
- `Cmd` on Mac

### Enable/Disable Shortcuts

```tsx
const [enabled, setEnabled] = useState(true)

useKeyboardShortcuts({
  shortcuts: {
    'ctrl+s': save,
    'ctrl+p': print,
  },
  enabled, // Disable when editing text, for example
})
```

### Conditional Shortcuts

```tsx
const [mode, setMode] = useState<'view' | 'edit'>('view')

// Different shortcuts based on mode
useKeyboardShortcuts({
  shortcuts: mode === 'view' ? {
    'e': () => setMode('edit'),
    '?': () => showHelp(),
  } : {
    'escape': () => setMode('view'),
    'ctrl+s': () => save(),
  },
})
```

## Complete Example: Text Editor

```tsx
'use client'

import { useState, useCallback } from 'react'
import { KeyboardHint, useKeyboardShortcuts } from '@clarity-chat/react'

export default function TextEditor() {
  const [content, setContent] = useState('')
  const [showHints, setShowHints] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Editor actions
  const save = useCallback(() => {
    localStorage.setItem('content', content)
    console.log('Saved!')
  }, [content])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setContent(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setContent(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  const selectAll = useCallback(() => {
    document.execCommand('selectAll')
  }, [])

  // Register shortcuts
  useKeyboardShortcuts({
    shortcuts: {
      'ctrl+s': save,
      'ctrl+z': undo,
      'ctrl+shift+z': redo,
      'ctrl+a': selectAll,
      '?': () => setShowHints(!showHints),
    },
  })

  const shortcuts = [
    { keys: ['Ctrl', 'S'], description: 'Save document', category: 'File' },
    { keys: ['Ctrl', 'Z'], description: 'Undo', category: 'Editing' },
    { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo', category: 'Editing' },
    { keys: ['Ctrl', 'A'], description: 'Select all', category: 'Editing' },
    { keys: ['?'], description: 'Show shortcuts', category: 'Help' },
  ]

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-bold">Text Editor</h1>
        <button
          onClick={() => setShowHints(true)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Press <kbd className="px-2 py-1 bg-muted rounded">?</kbd> for shortcuts
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 p-4 resize-none focus:outline-none"
        placeholder="Start typing..."
      />

      <KeyboardHint
        shortcuts={shortcuts}
        visible={showHints}
        onClose={() => setShowHints(false)}
        position="bottom-right"
      />
    </div>
  )
}
```

## Complete Example: Modal with Shortcuts

```tsx
'use client'

import { useState, useEffect } from 'react'
import { KeyboardHint, useKeyboardShortcuts } from '@clarity-chat/react'
import { Dialog } from '@clarity-chat/primitives'

export default function ShortcutModal() {
  const [open, setOpen] = useState(false)
  const [showHints, setShowHints] = useState(false)

  // Register global shortcuts
  useKeyboardShortcuts({
    shortcuts: {
      'ctrl+k': () => setOpen(true),
      '?': () => setShowHints(!showHints),
    },
    enabled: !open, // Disable when modal is open
  })

  // Register modal-specific shortcuts
  useKeyboardShortcuts({
    shortcuts: {
      'escape': () => setOpen(false),
    },
    enabled: open, // Only when modal is open
  })

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Open command palette', category: 'General' },
    { keys: ['Esc'], description: 'Close modal', category: 'General' },
    { keys: ['?'], description: 'Toggle shortcuts', category: 'Help' },
  ]

  return (
    <>
      <div className="p-8">
        <h1>Press Ctrl+K to open command palette</h1>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Command Palette</h2>
          <input
            type="text"
            placeholder="Search commands..."
            className="w-full p-2 border rounded"
          />
        </div>
      </Dialog>

      <KeyboardHint
        shortcuts={shortcuts}
        visible={showHints}
        onClose={() => setShowHints(false)}
      />
    </>
  )
}
```

## Complete Example: Chat Application

```tsx
'use client'

import { useState } from 'react'
import { KeyboardHint, useKeyboardShortcuts } from '@clarity-chat/react'

export default function ChatApp() {
  const [showHints, setShowHints] = useState(false)
  const [message, setMessage] = useState('')

  useKeyboardShortcuts({
    shortcuts: {
      'ctrl+enter': () => sendMessage(),
      'ctrl+/': () => toggleFormatting(),
      'ctrl+b': () => insertBold(),
      'ctrl+i': () => insertItalic(),
      'ctrl+k': () => insertLink(),
      '?': () => setShowHints(!showHints),
    },
  })

  const sendMessage = () => {
    console.log('Sending:', message)
    setMessage('')
  }

  const toggleFormatting = () => {
    console.log('Toggle formatting')
  }

  const insertBold = () => {
    setMessage(prev => prev + '**bold**')
  }

  const insertItalic = () => {
    setMessage(prev => prev + '*italic*')
  }

  const insertLink = () => {
    setMessage(prev => prev + '[link](url)')
  }

  const shortcuts = [
    { keys: ['Ctrl', '↵'], description: 'Send message', category: 'Actions' },
    { keys: ['Ctrl', '/'], description: 'Toggle formatting', category: 'Formatting' },
    { keys: ['Ctrl', 'B'], description: 'Bold text', category: 'Formatting' },
    { keys: ['Ctrl', 'I'], description: 'Italic text', category: 'Formatting' },
    { keys: ['Ctrl', 'K'], description: 'Insert link', category: 'Formatting' },
    { keys: ['?'], description: 'Show shortcuts', category: 'Help' },
  ]

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4">
        {/* Chat messages */}
      </div>

      <div className="p-4 border-t">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message... (Ctrl+Enter to send)"
          className="w-full p-2 border rounded resize-none"
          rows={3}
        />
      </div>

      <KeyboardHint
        shortcuts={shortcuts}
        visible={showHints}
        onClose={() => setShowHints(false)}
        position="center"
      />
    </div>
  )
}
```

## Animation Details

### Panel Animation

```typescript
initial={{ opacity: 0, scale: 0.9, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.9, y: 20 }}
```

### Staggered Shortcuts

```typescript
// Groups stagger
transition={{ delay: groupIndex * 0.05 + 0.1 }}

// Items stagger within groups
transition={{ delay: groupIndex * 0.05 + index * 0.03 + 0.15 }}
```

### Key Hover

```typescript
whileHover={{ scale: 1.1 }}
```

### Close Button

```typescript
whileHover={{ scale: 1.1, rotate: 90 }}
whileTap={{ scale: 0.9 }}
```

## TypeScript Support

Full TypeScript support with comprehensive types:

```typescript
import type {
  KeyboardHintProps,
  KeyboardShortcut,
  UseKeyboardShortcutsOptions,
} from '@clarity-chat/react'

// Keyboard Hint Props
interface KeyboardHintProps {
  shortcuts: KeyboardShortcut[]
  visible: boolean
  onClose?: () => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
  className?: string
}

// Shortcut Definition
interface KeyboardShortcut {
  keys: string[]
  description: string
  category?: string
}

// Hook Options
interface UseKeyboardShortcutsOptions {
  shortcuts: Record<string, () => void>
  enabled?: boolean
}
```

## Accessibility

The Keyboard Hint component follows accessibility best practices:

- **Keyboard Navigation** - All interactive elements keyboard accessible
- **Screen Reader** - Proper ARIA labels and roles
- **Focus Management** - Trapped focus in center modal mode
- **ESC to Close** - Standard escape key handling
- **Visual Keys** - Clear visual representation of keys
- **Semantic HTML** - Uses `<kbd>` for keyboard keys

## Styling

### Custom Panel Styles

```tsx
<KeyboardHint
  shortcuts={shortcuts}
  visible={visible}
  className="max-w-lg bg-blue-50 border-blue-200"
/>
```

### Themed Keys

The `<kbd>` elements automatically use theme colors:

```css
kbd {
  background: var(--muted);
  border: 1px solid var(--border);
  /* Automatically themed */
}
```

## Related Components

- **[Dialog](../dialog)** - Modal dialogs
- **[Tooltip](../tooltip)** - Inline hints
- **[Button](../button)** - Action buttons
- **[Badge](../badge)** - Key badges

## Best Practices

### 1. Use Standard Shortcuts

Follow platform conventions:

```tsx
// ✅ Good - standard shortcuts
'ctrl+s': save,
'ctrl+z': undo,
'ctrl+c': copy,
'ctrl+v': paste,

// ❌ Bad - non-standard
'ctrl+q': save,
'ctrl+w': undo,
```

### 2. Provide Help Shortcut

Always include a help toggle:

```tsx
// ✅ Good - help available
'?': () => setShowHints(!showHints)

// ❌ Bad - no help
// Missing help shortcut
```

### 3. Disable When Appropriate

Disable shortcuts during text input:

```tsx
const [isEditing, setIsEditing] = useState(false)

useKeyboardShortcuts({
  shortcuts: {
    'ctrl+s': save,
  },
  enabled: !isEditing, // Disable while editing
})
```

### 4. Group by Category

Organize shortcuts logically:

```tsx
// ✅ Good - categorized
{ keys: ['Ctrl', 'S'], description: 'Save', category: 'File' }
{ keys: ['Ctrl', 'Z'], description: 'Undo', category: 'Edit' }

// ❌ Bad - no categories
{ keys: ['Ctrl', 'S'], description: 'Save' }
{ keys: ['Ctrl', 'Z'], description: 'Undo' }
```

### 5. Show Context-Sensitive Shortcuts

Display relevant shortcuts only:

```tsx
const shortcuts = mode === 'edit'
  ? editModeShortcuts
  : viewModeShortcuts

<KeyboardHint shortcuts={shortcuts} visible={visible} />
```

### 6. Use Clear Descriptions

Be specific about actions:

```tsx
// ✅ Good - clear descriptions
{ keys: ['Ctrl', 'S'], description: 'Save current document' }

// ❌ Bad - vague
{ keys: ['Ctrl', 'S'], description: 'Save' }
```

### 7. Handle Conflicts

Avoid shortcut conflicts:

```tsx
// ✅ Good - no conflicts
'ctrl+s': save,
'ctrl+shift+s': saveAs,

// ❌ Bad - overridden
'ctrl+s': save,
'ctrl+s': export, // Overwrites save!
```

## Use Cases

### 1. Text Editors

Editing shortcuts:

```tsx
const shortcuts = [
  { keys: ['Ctrl', 'B'], description: 'Bold', category: 'Format' },
  { keys: ['Ctrl', 'I'], description: 'Italic', category: 'Format' },
  { keys: ['Ctrl', 'S'], description: 'Save', category: 'File' },
]
```

### 2. Chat Applications

Message shortcuts:

```tsx
const shortcuts = [
  { keys: ['Ctrl', '↵'], description: 'Send message' },
  { keys: ['↑'], description: 'Edit last message' },
  { keys: ['Esc'], description: 'Cancel editing' },
]
```

### 3. Command Palettes

Quick actions:

```tsx
const shortcuts = [
  { keys: ['Ctrl', 'K'], description: 'Open command palette' },
  { keys: ['Ctrl', 'P'], description: 'Go to file' },
  { keys: ['Ctrl', 'Shift', 'P'], description: 'Run command' },
]
```

### 4. Data Tables

Navigation shortcuts:

```tsx
const shortcuts = [
  { keys: ['↑', '↓'], description: 'Navigate rows' },
  { keys: ['Tab'], description: 'Next column' },
  { keys: ['Enter'], description: 'Edit cell' },
]
```

### 5. Media Players

Playback controls:

```tsx
const shortcuts = [
  { keys: ['Space'], description: 'Play/Pause' },
  { keys: ['←', '→'], description: 'Seek ±10s' },
  { keys: ['F'], description: 'Fullscreen' },
]
```

## Performance Tips

### 1. Memoize Shortcut Definitions

```tsx
const shortcuts = useMemo(() => [
  { keys: ['Ctrl', 'S'], description: 'Save' },
  { keys: ['Ctrl', 'Z'], description: 'Undo' },
], [])
```

### 2. Cleanup Event Listeners

The hook automatically cleans up:

```tsx
useKeyboardShortcuts({
  shortcuts: {
    'ctrl+s': save,
  },
})
// Automatically removes listener on unmount
```

### 3. Debounce Expensive Actions

```tsx
const debouncedSave = useMemo(
  () => debounce(save, 1000),
  []
)

useKeyboardShortcuts({
  shortcuts: {
    'ctrl+s': debouncedSave,
  },
})
```

---

**Related Documentation:**
- [Dialog](../dialog)
- [Tooltip](../tooltip)
- [Button](../button)
- [Badge](../badge)

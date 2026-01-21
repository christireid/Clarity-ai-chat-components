# Keyboard & Navigation Hooks

Professional keyboard shortcuts, command palettes, and navigation patterns for accessible, keyboard-first interfaces.

## Overview

| Hook | Category | Purpose | Level |
|------|----------|---------|-------|
| [`useKeyboardShortcuts`](#usekeyboardshortcuts) | Shortcuts | Cross-platform keyboard shortcut registration | High |
| [`useCommandPalette`](#usecommandpalette) | UI | Command palette state management (⌘K style) | High |
| [`useKeyboardNavigation`](#usekeyboardnavigation) | Navigation | Arrow key navigation for lists/grids | Mid |
| [`useChatKeyboardNavigation`](#usechatkeyboardnavigation) | Chat | Chat-specific keyboard controls | Mid |
| [`useCommandPaletteCommands`](#usecommandpalettecommands) | Commands | Pre-built command sets for common actions | Mid |

---

## useKeyboardShortcuts

**Cross-platform keyboard shortcut registration with modifier key support.**

Handles Cmd on Mac vs Ctrl on Windows/Linux automatically. Includes input element handling, scoped shortcuts, and platform-aware display strings.

### Signature

```typescript
function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void

interface KeyboardShortcut {
  /** Key combination (e.g., 'mod+k', 'ctrl+shift+f', 'escape')
   * Use 'mod' for Cmd on Mac, Ctrl on Windows/Linux */
  key: string
  /** Callback when shortcut is triggered */
  callback: (event: KeyboardEvent) => void
  /** Description for documentation */
  description?: string
  /** Whether shortcut is enabled (default: true) */
  enabled?: boolean
  /** Prevent default browser behavior (default: true) */
  preventDefault?: boolean
  /** Enable in input elements (default: false) */
  enableInInput?: boolean
}

// Display platform-aware shortcuts
function useShortcutDisplay(): (pattern: string) => string

// Scoped shortcuts with priority
function useScopedKeyboardShortcuts(options: {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
  priority?: number
}): void

// Focus-scoped shortcuts
function useFocusedKeyboardShortcuts(
  containerRef: RefObject<HTMLElement>,
  shortcuts: KeyboardShortcut[]
): void
```

### Examples

#### Basic Keyboard Shortcuts

```tsx
import { useKeyboardShortcuts } from '@clarity-chat/react'

function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useKeyboardShortcuts([
    {
      key: 'mod+k',
      callback: () => setSearchOpen(true),
      description: 'Open search',
    },
    {
      key: 'escape',
      callback: () => setSearchOpen(false),
      description: 'Close search',
    },
    {
      key: 'mod+b',
      callback: () => setSidebarOpen(prev => !prev),
      description: 'Toggle sidebar',
    },
    {
      key: 'mod+/',
      callback: () => setHelpOpen(true),
      description: 'Show keyboard shortcuts',
    },
  ])

  return <AppContent />
}
```

#### Gmail-style Navigation

```tsx
function EmailClient() {
  const [selected, setSelected] = useState(0)
  const emails = useEmails()

  useKeyboardShortcuts([
    {
      key: 'j',
      callback: () => setSelected(prev => Math.min(prev + 1, emails.length - 1)),
      description: 'Next email',
    },
    {
      key: 'k',
      callback: () => setSelected(prev => Math.max(prev - 1, 0)),
      description: 'Previous email',
    },
    {
      key: 'e',
      callback: () => archiveEmail(emails[selected]),
      description: 'Archive email',
    },
    {
      key: 'r',
      callback: () => replyToEmail(emails[selected]),
      description: 'Reply',
    },
    {
      key: '#',
      callback: () => deleteEmail(emails[selected]),
      description: 'Delete',
    },
  ])

  return <EmailList emails={emails} selected={selected} />
}
```

#### Input-Enabled Shortcuts

```tsx
function ChatInput() {
  const { sendMessage } = useClarityChat({ api: '/api/chat' })

  useKeyboardShortcuts([
    {
      key: 'mod+enter',
      callback: (e) => {
        const input = e.target as HTMLTextAreaElement
        sendMessage(input.value)
        input.value = ''
      },
      description: 'Send message',
      enableInInput: true, // Works inside textarea
    },
    {
      key: 'escape',
      callback: (e) => {
        const input = e.target as HTMLTextAreaElement
        input.blur()
      },
      description: 'Unfocus input',
      enableInInput: true,
    },
  ])

  return <textarea placeholder="Type a message... (⌘↵ to send)" />
}
```

#### Platform-Aware Display

```tsx
function KeyboardShortcutsMenu() {
  const getShortcut = useShortcutDisplay()

  const shortcuts = [
    { key: 'mod+k', description: 'Search' },
    { key: 'mod+shift+p', description: 'Command Palette' },
    { key: 'alt+arrowleft', description: 'Go Back' },
  ]

  return (
    <div>
      {shortcuts.map(s => (
        <div key={s.key} className="flex justify-between">
          <span>{s.description}</span>
          <kbd className="px-2 py-1 bg-gray-100 rounded">
            {getShortcut(s.key)}
          </kbd>
        </div>
      ))}
    </div>
  )
}

// Displays on Mac: ⌘K, ⌘⇧P, ⌥←
// Displays on Windows: Ctrl+K, Ctrl+Shift+P, Alt+←
```

#### Scoped Shortcuts with Priority

```tsx
function Modal({ children, onClose }: ModalProps) {
  // High priority - handles Escape before global handler
  useScopedKeyboardShortcuts({
    shortcuts: [
      { key: 'escape', callback: onClose, description: 'Close modal' },
    ],
    priority: 100,
  })

  return <div className="modal">{children}</div>
}

function App() {
  // Low priority - only handles Escape if no modal is open
  useScopedKeyboardShortcuts({
    shortcuts: [
      { key: 'escape', callback: clearSelection, description: 'Clear selection' },
    ],
    priority: 0,
  })

  return <AppContent />
}
```

#### Focus-Scoped Shortcuts

```tsx
function SearchResults() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState(0)

  // Only active when container has focus
  useFocusedKeyboardShortcuts(containerRef, [
    { key: 'arrowdown', callback: () => setSelected(prev => prev + 1) },
    { key: 'arrowup', callback: () => setSelected(prev => prev - 1) },
    { key: 'enter', callback: () => selectResult(selected) },
  ])

  return (
    <div ref={containerRef} tabIndex={-1} className="focus:outline-none">
      <ResultsList selected={selected} />
    </div>
  )
}
```

### When to Use

✅ **Use `useKeyboardShortcuts` when you need:**
- Global keyboard shortcuts (⌘K search, ⌘/ help)
- Navigation shortcuts (j/k for prev/next)
- Action shortcuts (archive, delete, reply)
- Platform-aware shortcut display
- Priority-based shortcut handling

❌ **Don't use when:**
- Simple form submission → Use native `<form onSubmit>`
- Single key in one component → Use `onKeyDown` directly

---

## useCommandPalette

**Command palette state management with ⌘K-style shortcut.**

Manages open/close state with built-in keyboard shortcut support. Perfect for implementing Cmd+K command palettes like VSCode, Raycast, etc.

### Signature

```typescript
function useCommandPalette(
  options?: UseCommandPaletteOptions
): UseCommandPaletteReturn

interface UseCommandPaletteOptions {
  /** Initial open state (default: false) */
  defaultOpen?: boolean
  /** Keyboard shortcut (default: 'mod+k') */
  shortcut?: string
  /** Whether shortcut is enabled (default: true) */
  shortcutEnabled?: boolean
  /** Callback when opens */
  onOpen?: () => void
  /** Callback when closes */
  onClose?: () => void
  /** Callback when toggles */
  onToggle?: (isOpen: boolean) => void
  /** Enable in input elements (default: false) */
  enableInInput?: boolean
}

interface UseCommandPaletteReturn {
  /** Whether palette is open */
  isOpen: boolean
  /** Open the palette */
  open: () => void
  /** Close the palette */
  close: () => void
  /** Toggle open/closed */
  toggle: () => void
  /** Set state directly */
  setOpen: (open: boolean) => void
  /** Platform-aware shortcut display (e.g., "⌘K") */
  shortcutDisplay: string
}
```

### Examples

#### Basic Command Palette

```tsx
import { useCommandPalette } from '@clarity-chat/react'

function App() {
  const palette = useCommandPalette()

  return (
    <>
      <button onClick={palette.toggle}>
        Search <kbd>{palette.shortcutDisplay}</kbd>
      </button>

      {palette.isOpen && (
        <CommandPaletteUI
          onClose={palette.close}
          onSelect={(action) => {
            action.execute()
            palette.close()
          }}
        />
      )}
    </>
  )
}
```

#### Command Palette with Analytics

```tsx
function AnalyticsCommandPalette() {
  const palette = useCommandPalette({
    onOpen: () => {
      analytics.track('command_palette_opened', {
        timestamp: Date.now(),
      })
    },
    onClose: () => {
      analytics.track('command_palette_closed')
    },
  })

  return (
    <CommandPalette
      open={palette.isOpen}
      onClose={palette.close}
    />
  )
}
```

#### Custom Shortcut

```tsx
function CustomShortcut() {
  // Use Ctrl+P instead of Cmd+K
  const palette = useCommandPalette({
    shortcut: 'mod+p',
  })

  return <CommandPalette {...palette} />
}
```

### When to Use

✅ **Use `useCommandPalette` when you need:**
- ⌘K-style command palette
- Quick action launcher
- Search interface with keyboard shortcut
- Toggle-based UI with shortcut

❌ **Don't use when:**
- Building custom shortcut system → Use `useKeyboardShortcuts`
- Need command data → Use with `useCommandPaletteCommands`

---

## useKeyboardNavigation

**Arrow key navigation for lists, grids, and menus.**

Comprehensive keyboard navigation with horizontal/vertical movement, wrapping, disabled items, and accessibility support.

### Signature

```typescript
function useKeyboardNavigation(options: {
  /** Total number of items */
  count: number
  /** Initial selected index (default: 0) */
  initialIndex?: number
  /** Enable wrap-around (default: true) */
  loop?: boolean
  /** Disabled item indices */
  disabledIndices?: number[]
  /** Grid columns (enables 2D navigation) */
  columns?: number
  /** Callback when selection changes */
  onSelect?: (index: number) => void
  /** Callback when item is activated (Enter/Space) */
  onActivate?: (index: number) => void
}): {
  /** Currently selected index */
  selectedIndex: number
  /** Set selected index */
  setSelectedIndex: (index: number) => void
  /** Ref for container element */
  containerRef: RefObject<HTMLElement>
  /** Get props for item at index */
  getItemProps: (index: number) => ItemProps
}
```

### Examples

#### List Navigation

```tsx
import { useKeyboardNavigation } from '@clarity-chat/react'

function CommandList({ items }: { items: Command[] }) {
  const { selectedIndex, containerRef, getItemProps } = useKeyboardNavigation({
    count: items.length,
    onActivate: (index) => {
      items[index].execute()
    },
  })

  return (
    <div ref={containerRef} role="listbox" tabIndex={-1}>
      {items.map((item, index) => (
        <div
          key={item.id}
          {...getItemProps(index)}
          className={cn(
            'px-4 py-2 cursor-pointer',
            selectedIndex === index && 'bg-blue-500 text-white'
          )}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}
```

#### Grid Navigation

```tsx
function IconGrid({ icons }: { icons: Icon[] }) {
  const navigation = useKeyboardNavigation({
    count: icons.length,
    columns: 6, // 6-column grid
    loop: true,
  })

  return (
    <div
      ref={navigation.containerRef}
      className="grid grid-cols-6 gap-4"
      role="grid"
      tabIndex={-1}
    >
      {icons.map((icon, index) => (
        <div
          key={icon.id}
          {...navigation.getItemProps(index)}
          className={cn(
            'p-4 border rounded',
            navigation.selectedIndex === index && 'ring-2 ring-blue-500'
          )}
        >
          <icon.Component />
        </div>
      ))}
    </div>
  )
}
```

#### Disabled Items

```tsx
function MenuWithDisabled() {
  const items = [
    { label: 'New File', enabled: true },
    { label: 'Open File', enabled: true },
    { label: 'Save', enabled: false }, // Disabled
    { label: 'Export', enabled: true },
  ]

  const disabledIndices = items
    .map((item, i) => (!item.enabled ? i : null))
    .filter((i): i is number => i !== null)

  const nav = useKeyboardNavigation({
    count: items.length,
    disabledIndices,
  })

  return (
    <div ref={nav.containerRef}>
      {items.map((item, i) => (
        <div
          key={i}
          {...nav.getItemProps(i)}
          aria-disabled={!item.enabled}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}
```

### When to Use

✅ **Use `useKeyboardNavigation` when you need:**
- List/menu arrow key navigation
- Grid keyboard navigation
- Disabled item skipping
- Wrap-around navigation
- Accessible ARIA roles

❌ **Don't use when:**
- Chat-specific navigation → Use `useChatKeyboardNavigation`
- Custom keyboard logic → Use `useKeyboardShortcuts`

---

## useChatKeyboardNavigation

**Chat-specific keyboard shortcuts and navigation.**

Pre-configured shortcuts for common chat operations: send message, scroll history, focus input, etc.

### Signature

```typescript
function useChatKeyboardNavigation(options: {
  /** Send message callback */
  onSendMessage?: () => void
  /** Focus input callback */
  onFocusInput?: () => void
  /** Scroll to bottom callback */
  onScrollToBottom?: () => void
  /** Navigate message history */
  onNavigateHistory?: (direction: 'up' | 'down') => void
  /** Whether shortcuts are enabled */
  enabled?: boolean
}): void
```

### Examples

#### Basic Chat Navigation

```tsx
import { useChatKeyboardNavigation } from '@clarity-chat/react'

function ChatInterface() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { messages, sendMessage } = useClarityChat({ api: '/api/chat' })

  useChatKeyboardNavigation({
    onSendMessage: () => {
      if (inputRef.current?.value) {
        sendMessage(inputRef.current.value)
        inputRef.current.value = ''
      }
    },
    onFocusInput: () => inputRef.current?.focus(),
    onScrollToBottom: () => scrollToBottom(),
  })

  return (
    <div>
      <MessageList messages={messages} />
      <textarea ref={inputRef} placeholder="⌘↵ to send" />
    </div>
  )
}
```

### When to Use

✅ **Use `useChatKeyboardNavigation` when building:**
- Chat interfaces
- Messaging applications
- Conversational UIs

❌ **Don't use for:**
- General navigation → Use `useKeyboardNavigation`
- Custom shortcuts → Use `useKeyboardShortcuts`

---

## useCommandPaletteCommands

**Pre-built command sets for common actions.**

Provides ready-to-use command definitions for navigation, theme, search, etc.

### Examples

```tsx
import { useCommandPaletteCommands } from '@clarity-chat/react'

function App() {
  const palette = useCommandPalette()
  const commands = useCommandPaletteCommands({
    onNavigate: (path) => router.push(path),
    onThemeChange: (theme) => setTheme(theme),
    onSearch: (query) => search(query),
  })

  return (
    <CommandPalette
      open={palette.isOpen}
      onClose={palette.close}
      commands={commands}
    />
  )
}
```

---

## Common Patterns

### Complete Keyboard-First App

```tsx
import {
  useKeyboardShortcuts,
  useCommandPalette,
  useShortcutDisplay,
} from '@clarity-chat/react'

function KeyboardFirstApp() {
  const [showHelp, setShowHelp] = useState(false)
  const palette = useCommandPalette()
  const getShortcut = useShortcutDisplay()

  const shortcuts = [
    {
      key: 'mod+k',
      callback: palette.toggle,
      description: 'Command Palette',
    },
    {
      key: 'mod+/',
      callback: () => setShowHelp(true),
      description: 'Show Keyboard Shortcuts',
    },
    {
      key: 'g h',
      callback: () => navigate('/'),
      description: 'Go Home',
    },
    {
      key: 'g d',
      callback: () => navigate('/docs'),
      description: 'Go to Docs',
    },
  ]

  useKeyboardShortcuts(shortcuts)

  return (
    <div>
      <AppContent />

      {palette.isOpen && (
        <CommandPalette
          onClose={palette.close}
          commands={allCommands}
        />
      )}

      {showHelp && (
        <KeyboardShortcutsHelp
          shortcuts={shortcuts}
          onClose={() => setShowHelp(false)}
        />
      )}
    </div>
  )
}
```

---

## Troubleshooting

### Shortcuts Not Working in Inputs

**Problem:** Shortcuts don't work when focused on input

**Solution:**
```tsx
useKeyboardShortcuts([
  {
    key: 'mod+enter',
    callback: handleSubmit,
    enableInInput: true, // Add this!
  },
])
```

### Platform Detection Wrong

**Problem:** Shows Cmd on Windows or Ctrl on Mac

**Solution:** The hook auto-detects platform. If wrong:
```tsx
// Check in browser console
console.log(navigator.platform)
console.log(navigator.userAgent)

// Hook uses 'mod' which auto-converts to Cmd/Ctrl
```

### Multiple Shortcuts Conflict

**Problem:** Two components register same shortcut

**Solution:** Use scoped shortcuts with priority:
```tsx
// Modal (high priority)
useScopedKeyboardShortcuts({
  shortcuts: [{ key: 'escape', callback: closeModal }],
  priority: 100,
})

// App (low priority - only if no modal)
useScopedKeyboardShortcuts({
  shortcuts: [{ key: 'escape', callback: clearSelection }],
  priority: 0,
})
```

---

## Related Hooks

### UI Hooks
- [`useToggle`](./ui.md#usetoggle) - Toggle boolean state
- [`useFocusTrap`](./ui.md#usefocustrap) - Trap focus in modal

### Chat Hooks
- [`useClarityChat`](./chat.md#useclaritychat) - Chat management
- [`useChatHistory`](./chat.md#usechathistory) - Message history

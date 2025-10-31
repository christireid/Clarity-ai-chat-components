import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  CommandPalette,
  KeyboardHint,
  Draggable,
  DropZone,
  ContextMenu,
  ThemeSwitcher,
  useTheme,
  useUndoRedo,
  useUndoRedoShortcuts,
  useHaptic,
  useKeyboardShortcuts,
} from '@clarity-chat/react'

// ============================================================================
// Command Palette Stories
// ============================================================================

const CommandPaletteDemo = () => {
  const [open, setOpen] = React.useState(false)
  const [lastCommand, setLastCommand] = React.useState<string>('')

  const commands = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      category: 'Actions',
      shortcut: ['⌘', 'N'],
      icon: <span>💬</span>,
      onSelect: () => setLastCommand('New Chat'),
    },
    {
      id: 'search',
      label: 'Search Messages',
      description: 'Find in conversation history',
      category: 'Actions',
      shortcut: ['⌘', 'F'],
      icon: <span>🔍</span>,
      onSelect: () => setLastCommand('Search'),
    },
    {
      id: 'export',
      label: 'Export Chat',
      description: 'Download conversation as JSON',
      category: 'File',
      shortcut: ['⌘', 'E'],
      icon: <span>📥</span>,
      onSelect: () => setLastCommand('Export'),
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Configure application',
      category: 'System',
      shortcut: ['⌘', ','],
      icon: <span>⚙️</span>,
      onSelect: () => setLastCommand('Settings'),
    },
    {
      id: 'theme',
      label: 'Toggle Theme',
      description: 'Switch between light and dark',
      category: 'System',
      shortcut: ['⌘', 'T'],
      icon: <span>🎨</span>,
      onSelect: () => setLastCommand('Theme'),
    },
  ]

  // Setup keyboard shortcut
  useKeyboardShortcuts({
    shortcuts: {
      'ctrl+k': () => setOpen(true),
    },
  })

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Command Palette Demo</h2>
        <p className="text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-muted rounded">Ctrl+K</kbd> or click the button to
          open the command palette
        </p>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Open Command Palette
        </button>

        {lastCommand && (
          <div className="p-4 bg-muted rounded-lg">
            <strong>Last Command:</strong> {lastCommand}
          </div>
        )}
      </div>

      <CommandPalette items={commands} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

// ============================================================================
// Keyboard Hints Stories
// ============================================================================

const KeyboardHintsDemo = () => {
  const [visible, setVisible] = React.useState(false)

  const shortcuts = [
    { keys: ['⌘', 'K'], description: 'Open command palette', category: 'Navigation' },
    { keys: ['⌘', 'N'], description: 'New chat', category: 'Actions' },
    { keys: ['⌘', 'F'], description: 'Search messages', category: 'Actions' },
    { keys: ['⌘', 'Z'], description: 'Undo', category: 'Editing' },
    { keys: ['⌘', 'Shift', 'Z'], description: 'Redo', category: 'Editing' },
    { keys: ['Esc'], description: 'Close dialog', category: 'Navigation' },
    { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Help' },
  ]

  // Toggle with ? key
  useKeyboardShortcuts({
    shortcuts: {
      '?': () => setVisible(!visible),
    },
  })

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
        <p className="text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-muted rounded">?</kbd> to toggle the shortcuts panel
        </p>

        <button
          onClick={() => setVisible(!visible)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          {visible ? 'Hide' : 'Show'} Shortcuts
        </button>
      </div>

      <KeyboardHint
        shortcuts={shortcuts}
        visible={visible}
        onClose={() => setVisible(false)}
        position="center"
      />
    </div>
  )
}

// ============================================================================
// Drag & Drop Stories
// ============================================================================

const DragDropDemo = () => {
  const [items, setItems] = React.useState([
    { id: '1', text: 'Task 1: Review code' },
    { id: '2', text: 'Task 2: Write tests' },
    { id: '3', text: 'Task 3: Update docs' },
  ])

  const [dropZones] = React.useState([
    { id: 'todo', label: 'To Do', items: ['1'] },
    { id: 'doing', label: 'Doing', items: ['2'] },
    { id: 'done', label: 'Done', items: ['3'] },
  ])

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Drag & Drop Demo</h2>
        <p className="text-muted-foreground">Drag items between columns</p>

        <div className="grid grid-cols-3 gap-4">
          {dropZones.map(zone => (
            <DropZone
              key={zone.id}
              dropId={zone.id}
              className="p-4 min-h-[300px]"
              activeClassName="border-primary bg-primary/10"
            >
              <div className="font-semibold mb-4">{zone.label}</div>
              <div className="space-y-2">
                {items
                  .filter(item => zone.items.includes(item.id))
                  .map(item => (
                    <Draggable key={item.id} dragId={item.id}>
                      <div className="p-3 bg-card rounded border hover:border-primary transition-colors">
                        {item.text}
                      </div>
                    </Draggable>
                  ))}
              </div>
            </DropZone>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Context Menu Stories
// ============================================================================

const ContextMenuDemo = () => {
  const [lastAction, setLastAction] = React.useState<string>('')

  const menuItems = [
    {
      id: 'copy',
      label: 'Copy',
      icon: <span>📋</span>,
      shortcut: '⌘C',
      onSelect: () => setLastAction('Copy'),
    },
    {
      id: 'paste',
      label: 'Paste',
      icon: <span>📄</span>,
      shortcut: '⌘V',
      onSelect: () => setLastAction('Paste'),
    },
    { id: 'sep1', label: '', separator: true },
    {
      id: 'edit',
      label: 'Edit',
      icon: <span>✏️</span>,
      submenu: [
        {
          id: 'undo',
          label: 'Undo',
          shortcut: '⌘Z',
          onSelect: () => setLastAction('Undo'),
        },
        {
          id: 'redo',
          label: 'Redo',
          shortcut: '⌘⇧Z',
          onSelect: () => setLastAction('Redo'),
        },
      ],
    },
    { id: 'sep2', label: '', separator: true },
    {
      id: 'delete',
      label: 'Delete',
      icon: <span>🗑️</span>,
      danger: true,
      onSelect: () => setLastAction('Delete'),
    },
  ]

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Context Menu Demo</h2>
        <p className="text-muted-foreground">Right-click on the box below</p>

        <ContextMenu items={menuItems}>
          <div className="w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors">
            Right-click here to open context menu
          </div>
        </ContextMenu>

        {lastAction && (
          <div className="p-4 bg-muted rounded-lg">
            <strong>Last Action:</strong> {lastAction}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Theme Switcher Stories
// ============================================================================

const ThemeSwitcherDemo = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Theme Switcher</h2>
        <p className="text-muted-foreground">
          Current theme: <strong>{theme}</strong>
        </p>

        <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} showPreview />
      </div>
    </div>
  )
}

// ============================================================================
// Undo/Redo Demo
// ============================================================================

const UndoRedoDemo = () => {
  const [text, { set, undo, redo, canUndo, canRedo }] = useUndoRedo({
    initialState: 'Hello World',
  })

  const [showToast, setShowToast] = React.useState(false)
  const [toastMessage, setToastMessage] = React.useState('')

  useUndoRedoShortcuts(
    () => {
      undo()
      setToastMessage('Undo')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    },
    () => {
      redo()
      setToastMessage('Redo')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    }
  )

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Undo/Redo Demo</h2>
        <p className="text-muted-foreground">
          Use <kbd className="px-2 py-1 bg-muted rounded">⌘Z</kbd> to undo and{' '}
          <kbd className="px-2 py-1 bg-muted rounded">⌘⇧Z</kbd> to redo
        </p>

        <textarea
          value={text}
          onChange={e => set(e.target.value)}
          className="w-full h-32 p-4 border rounded-lg"
        />

        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Redo
          </button>
        </div>

        {showToast && (
          <div className="fixed bottom-4 right-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg animate-in slide-in-from-bottom-5">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Haptic Feedback Demo
// ============================================================================

const HapticDemo = () => {
  const { isSupported, light, medium, heavy, success, warning, error } = useHaptic()

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Haptic Feedback Demo</h2>
        {isSupported ? (
          <p className="text-muted-foreground">
            Haptic feedback is supported on this device. Click buttons to feel vibrations.
          </p>
        ) : (
          <p className="text-destructive">
            Haptic feedback is not supported on this device.
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={light}
            className="px-4 py-3 bg-card border rounded-lg hover:bg-muted transition-colors"
          >
            Light
          </button>
          <button
            onClick={medium}
            className="px-4 py-3 bg-card border rounded-lg hover:bg-muted transition-colors"
          >
            Medium
          </button>
          <button
            onClick={heavy}
            className="px-4 py-3 bg-card border rounded-lg hover:bg-muted transition-colors"
          >
            Heavy
          </button>
          <button
            onClick={success}
            className="px-4 py-3 bg-success/10 border border-success rounded-lg hover:bg-success/20 transition-colors"
          >
            Success ✅
          </button>
          <button
            onClick={warning}
            className="px-4 py-3 bg-warning/10 border border-warning rounded-lg hover:bg-warning/20 transition-colors"
          >
            Warning ⚠️
          </button>
          <button
            onClick={error}
            className="px-4 py-3 bg-destructive/10 border border-destructive rounded-lg hover:bg-destructive/20 transition-colors"
          >
            Error ❌
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Combined Interactive Demo
// ============================================================================

const InteractiveDemo = () => {
  const [paletteOpen, setPaletteOpen] = React.useState(false)
  const [hintsVisible, setHintsVisible] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const { success, error } = useHaptic()

  const commands = [
    {
      id: 'hints',
      label: 'Show Keyboard Shortcuts',
      icon: <span>⌨️</span>,
      category: 'Help',
      onSelect: () => setHintsVisible(true),
    },
    {
      id: 'theme-light',
      label: 'Light Theme',
      icon: <span>☀️</span>,
      category: 'Theme',
      onSelect: () => {
        setTheme('light')
        success()
      },
    },
    {
      id: 'theme-dark',
      label: 'Dark Theme',
      icon: <span>🌙</span>,
      category: 'Theme',
      onSelect: () => {
        setTheme('dark')
        success()
      },
    },
  ]

  const shortcuts = [
    { keys: ['⌘', 'K'], description: 'Open command palette', category: 'Navigation' },
    { keys: ['?'], description: 'Show shortcuts', category: 'Help' },
    { keys: ['Esc'], description: 'Close', category: 'Navigation' },
  ]

  useKeyboardShortcuts({
    shortcuts: {
      'ctrl+k': () => setPaletteOpen(true),
      '?': () => setHintsVisible(!hintsVisible),
    },
  })

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Advanced Interactions Showcase</h2>
          <p className="text-muted-foreground">
            A comprehensive demo of all Phase 8 features working together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setPaletteOpen(true)}
            className="p-6 bg-card border rounded-lg hover:border-primary transition-all group"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">⌘</div>
            <h3 className="font-semibold mb-1">Command Palette</h3>
            <p className="text-sm text-muted-foreground">Press Ctrl+K</p>
          </button>

          <button
            onClick={() => setHintsVisible(true)}
            className="p-6 bg-card border rounded-lg hover:border-primary transition-all group"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">⌨️</div>
            <h3 className="font-semibold mb-1">Keyboard Shortcuts</h3>
            <p className="text-sm text-muted-foreground">Press ?</p>
          </button>
        </div>

        <div className="p-6 bg-card border rounded-lg">
          <h3 className="font-semibold mb-4">Current Theme</h3>
          <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} compact />
        </div>
      </div>

      <CommandPalette items={commands} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <KeyboardHint
        shortcuts={shortcuts}
        visible={hintsVisible}
        onClose={() => setHintsVisible(false)}
        position="bottom-right"
      />
    </div>
  )
}

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta = {
  title: 'Phase 8/Advanced Interactions',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

// ============================================================================
// Stories
// ============================================================================

export const CommandPaletteStory: StoryObj = {
  name: '1. Command Palette',
  render: () => <CommandPaletteDemo />,
}

export const KeyboardHintsStory: StoryObj = {
  name: '2. Keyboard Shortcuts',
  render: () => <KeyboardHintsDemo />,
}

export const DragDropStory: StoryObj = {
  name: '3. Drag & Drop',
  render: () => <DragDropDemo />,
}

export const ContextMenuStory: StoryObj = {
  name: '4. Context Menu',
  render: () => <ContextMenuDemo />,
}

export const ThemeSwitcherStory: StoryObj = {
  name: '5. Theme Switcher',
  render: () => <ThemeSwitcherDemo />,
}

export const UndoRedoStory: StoryObj = {
  name: '6. Undo/Redo',
  render: () => <UndoRedoDemo />,
}

export const HapticStory: StoryObj = {
  name: '7. Haptic Feedback',
  render: () => <HapticDemo />,
}

export const InteractiveStory: StoryObj = {
  name: '8. Complete Interactive Demo',
  render: () => <InteractiveDemo />,
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import {
  CommandPalette,
  KeyboardHint,
  Draggable,
  DropZone,
  ContextMenu,
  ThemeSwitcher,
  useTheme,
  // useUndoRedo,
  // useUndoRedoShortcuts,
  // useHaptic,
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
          Press <kbd className="px-2 py-1 bg-muted rounded">Ctrl+K</kbd> or
          click the button to open the command palette
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

      <CommandPalette
        items={commands}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}

// ============================================================================
// Keyboard Hints Stories
// ============================================================================

const KeyboardHintsDemo = () => {
  const [visible, setVisible] = React.useState(false)

  const shortcuts = [
    {
      keys: ['⌘', 'K'],
      description: 'Open command palette',
      category: 'Navigation',
    },
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
          Press <kbd className="px-2 py-1 bg-muted rounded">?</kbd> to toggle
          the shortcuts panel
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
          {dropZones.map((zone) => (
            <DropZone
              key={zone.id}
              dropId={zone.id}
              className="p-4 min-h-[300px]"
              activeClassName="border-primary bg-primary/10"
            >
              <div className="font-semibold mb-4">{zone.label}</div>
              <div className="space-y-2">
                {items
                  .filter((item) => zone.items.includes(item.id))
                  .map((item) => (
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

        <ThemeSwitcher
          currentTheme={theme}
          onThemeChange={setTheme}
          showPreview
        />
      </div>
    </div>
  )
}

// ============================================================================
// Undo/Redo Demo
// ============================================================================

const UndoRedoDemo = () => {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Undo/Redo Demo</h2>
        <p className="text-muted-foreground">
          This demo is currently disabled due to missing dependencies.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// Haptic Feedback Demo
// ============================================================================

const HapticDemo = () => {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Haptic Feedback Demo</h2>
        <p className="text-muted-foreground">
          This demo is currently disabled due to missing dependencies.
        </p>
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
  const success = () => {}
  const error = () => {}

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
    {
      keys: ['⌘', 'K'],
      description: 'Open command palette',
      category: 'Navigation',
    },
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
          <h2 className="text-3xl font-bold mb-2">
            Advanced Interactions Showcase
          </h2>
          <p className="text-muted-foreground">
            A comprehensive demo of all Phase 8 features working together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setPaletteOpen(true)}
            className="p-6 bg-card border rounded-lg hover:border-primary transition-all group"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
              ⌘
            </div>
            <h3 className="font-semibold mb-1">Command Palette</h3>
            <p className="text-sm text-muted-foreground">Press Ctrl+K</p>
          </button>

          <button
            onClick={() => setHintsVisible(true)}
            className="p-6 bg-card border rounded-lg hover:border-primary transition-all group"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
              ⌨️
            </div>
            <h3 className="font-semibold mb-1">Keyboard Shortcuts</h3>
            <p className="text-sm text-muted-foreground">Press ?</p>
          </button>
        </div>

        <div className="p-6 bg-card border rounded-lg">
          <h3 className="font-semibold mb-4">Current Theme</h3>
          <ThemeSwitcher
            currentTheme={theme}
            onThemeChange={setTheme}
            compact
          />
        </div>
      </div>

      <CommandPalette
        items={commands}
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
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
  title: 'Examples/AdvancedInteractions',
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

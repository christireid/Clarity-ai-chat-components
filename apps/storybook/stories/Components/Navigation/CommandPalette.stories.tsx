import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CommandPalette,
  type CommandItem,
  useCommandPalette,
} from '@clarity-chat/react'
import { useState } from 'react'
import { expect, within } from 'storybook/test'

/**
 * Command Palette
 *
 * **A powerful command interface for:**
 * - Quick actions and navigation
 * - Keyboard-first workflows
 * - Search and discovery
 * - Command execution
 * - Productivity shortcuts
 *
 * **Key Features:**
 * - Fuzzy search across commands
 * - Keyboard navigation (↑↓ arrows, Enter, Esc)
 * - Category grouping
 * - Keyboard shortcuts display
 * - Custom icons
 * - Fast and responsive
 *
 * **Design Philosophy:**
 * - Speed: Access any action instantly
 * - Discoverability: Find commands by searching
 * - Keyboard-First: Designed for power users
 * - Beautiful: Smooth animations and modern design
 */
const meta = {
  title: 'Components/Navigation/CommandPalette',
  component: CommandPalette,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A keyboard-first command palette for quick actions, search, and navigation with fuzzy matching and category grouping.',
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the command palette is open',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for search input',
    },
    items: {
      control: false,
      description: 'Array of command items',
    },
  },
} satisfies Meta<typeof CommandPalette>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Sample Commands
// ============================================================================

const basicCommands: CommandItem[] = [
  {
    id: 'new-chat',
    label: 'New Chat',
    description: 'Start a new conversation',
    shortcut: ['⌘', 'N'],
    category: 'Actions',
    onSelect: () => console.log('New chat'),
  },
  {
    id: 'search',
    label: 'Search Messages',
    description: 'Search through your message history',
    shortcut: ['⌘', 'F'],
    category: 'Actions',
    onSelect: () => console.log('Search'),
  },
  {
    id: 'settings',
    label: 'Open Settings',
    description: 'Configure your preferences',
    shortcut: ['⌘', ','],
    category: 'Navigation',
    onSelect: () => console.log('Settings'),
  },
  {
    id: 'export',
    label: 'Export Conversation',
    description: 'Download conversation as file',
    category: 'Actions',
    onSelect: () => console.log('Export'),
  },
]

// ============================================================================
// Basic Example
// ============================================================================

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <div className="w-full">
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Command Palette (⌘K)
        </button>

        <CommandPalette
          items={basicCommands}
          open={open}
          onClose={() => setOpen(false)}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test command items render
    await expect(canvas.getByText('New Chat')).toBeInTheDocument()
    await expect(canvas.getByText('Search Messages')).toBeInTheDocument()
    await expect(canvas.getByText('Open Settings')).toBeInTheDocument()

    // Test descriptions render
    await expect(
      canvas.getByText(/Start a new conversation/)
    ).toBeInTheDocument()

    // Test keyboard shortcuts display
    await expect(canvas.getByText('⌘')).toBeInTheDocument()
    await expect(canvas.getByText('N')).toBeInTheDocument()
  },
}

// ============================================================================
// With Categories
// ============================================================================

export const WithCategories: Story = {
  render: () => {
    const [open, setOpen] = useState(true)

    const categorizedCommands: CommandItem[] = [
      // File Operations
      {
        id: 'new-file',
        label: 'New File',
        description: 'Create a new file',
        shortcut: ['⌘', 'N'],
        category: 'File',
        onSelect: () => alert('New file'),
      },
      {
        id: 'open-file',
        label: 'Open File',
        description: 'Open an existing file',
        shortcut: ['⌘', 'O'],
        category: 'File',
        onSelect: () => alert('Open file'),
      },
      {
        id: 'save',
        label: 'Save',
        description: 'Save current file',
        shortcut: ['⌘', 'S'],
        category: 'File',
        onSelect: () => alert('Save'),
      },
      // Edit Operations
      {
        id: 'copy',
        label: 'Copy',
        description: 'Copy selected text',
        shortcut: ['⌘', 'C'],
        category: 'Edit',
        onSelect: () => alert('Copy'),
      },
      {
        id: 'paste',
        label: 'Paste',
        description: 'Paste from clipboard',
        shortcut: ['⌘', 'V'],
        category: 'Edit',
        onSelect: () => alert('Paste'),
      },
      // View Operations
      {
        id: 'zoom-in',
        label: 'Zoom In',
        description: 'Increase zoom level',
        shortcut: ['⌘', '+'],
        category: 'View',
        onSelect: () => alert('Zoom in'),
      },
      {
        id: 'zoom-out',
        label: 'Zoom Out',
        description: 'Decrease zoom level',
        shortcut: ['⌘', '-'],
        category: 'View',
        onSelect: () => alert('Zoom out'),
      },
      // Help
      {
        id: 'docs',
        label: 'Documentation',
        description: 'Open documentation',
        category: 'Help',
        onSelect: () => alert('Open docs'),
      },
      {
        id: 'shortcuts',
        label: 'Keyboard Shortcuts',
        description: 'View all shortcuts',
        shortcut: ['⌘', '/'],
        category: 'Help',
        onSelect: () => alert('Show shortcuts'),
      },
    ]

    return (
      <div className="w-full">
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Command Palette
        </button>

        <CommandPalette
          items={categorizedCommands}
          open={open}
          onClose={() => setOpen(false)}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test category headers render
    await expect(canvas.getByText('File')).toBeInTheDocument()
    await expect(canvas.getByText('Edit')).toBeInTheDocument()
    await expect(canvas.getByText('View')).toBeInTheDocument()
    await expect(canvas.getByText('Help')).toBeInTheDocument()

    // Test commands from different categories
    await expect(canvas.getByText('New File')).toBeInTheDocument()
    await expect(canvas.getByText('Copy')).toBeInTheDocument()
    await expect(canvas.getByText('Zoom In')).toBeInTheDocument()
    await expect(canvas.getByText('Documentation')).toBeInTheDocument()
  },
  parameters: {
    docs: {
      description: {
        story: 'Commands organized by category for better organization.',
      },
    },
  },
}

// ============================================================================
// Search & Filter
// ============================================================================

export const SearchDemo: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    const searchableCommands: CommandItem[] = [
      {
        id: 'new-conversation',
        label: 'New Conversation',
        description: 'Start a fresh chat',
        category: 'Chat',
        onSelect: () => console.log('New conversation'),
      },
      {
        id: 'find-conversation',
        label: 'Find Conversation',
        description: 'Search your chat history',
        category: 'Chat',
        onSelect: () => console.log('Find'),
      },
      {
        id: 'delete-conversation',
        label: 'Delete Conversation',
        description: 'Remove a conversation',
        category: 'Chat',
        onSelect: () => console.log('Delete'),
      },
      {
        id: 'export-data',
        label: 'Export Data',
        description: 'Download your conversations',
        category: 'Data',
        onSelect: () => console.log('Export'),
      },
      {
        id: 'import-data',
        label: 'Import Data',
        description: 'Upload conversations',
        category: 'Data',
        onSelect: () => console.log('Import'),
      },
    ]

    return (
      <div className="w-full space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm">
            <strong>Try searching:</strong> Type "new", "find", "export", or any
            part of a command name or description. The palette uses fuzzy
            matching to find relevant commands.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Command Palette
        </button>

        <CommandPalette
          items={searchableCommands}
          open={open}
          onClose={() => setOpen(false)}
          placeholder="Search commands..."
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Fuzzy search filters commands by label, description, or category.',
      },
    },
  },
}

// ============================================================================
// Keyboard Shortcuts
// ============================================================================

export const KeyboardShortcuts: Story = {
  render: () => {
    // Use the useCommandPalette hook for proper toggle behavior
    const { isOpen, toggle, close, shortcutDisplay } = useCommandPalette({
      onOpen: () => console.log('Command palette opened'),
      onClose: () => console.log('Command palette closed'),
    })

    return (
      <div className="w-full space-y-4">
        <div className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl space-y-4">
          <h3 className="font-semibold text-lg">Keyboard Shortcuts</h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Toggle Command Palette</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border">
                {shortcutDisplay}
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Navigate Up/Down</span>
              <div className="flex gap-2">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border">
                  ↑
                </kbd>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border">
                  ↓
                </kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Select Command</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border">
                Enter
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Close Palette</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border">
                Esc
              </kbd>
            </div>
          </div>

          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm">
            <strong>Toggle behavior:</strong> Press {shortcutDisplay} to open,
            press again to close!
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Press{' '}
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border text-xs">
            {shortcutDisplay}
          </kbd>{' '}
          to toggle or click the button
        </p>

        <button
          onClick={toggle}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Toggle Palette ({shortcutDisplay})
        </button>

        <CommandPalette items={basicCommands} open={isOpen} onClose={close} />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Full keyboard navigation with toggle support. Press ⌘K/Ctrl+K to toggle open/closed, arrow keys to navigate, Enter to select, Esc to close.',
      },
    },
  },
}

// ============================================================================
// Real-World Use Cases
// ============================================================================

export const ChatApplication: Story = {
  render: () => {
    const [action, setAction] = useState<string>('')

    // Use the useCommandPalette hook for proper toggle behavior
    const { isOpen, toggle, close, shortcutDisplay } = useCommandPalette()

    const chatCommands: CommandItem[] = [
      {
        id: 'new-chat',
        label: 'New Chat',
        description: 'Start a new conversation',
        shortcut: ['⌘', 'N'],
        category: 'Actions',
        onSelect: () => setAction('Started new chat'),
      },
      {
        id: 'search',
        label: 'Search Messages',
        description: 'Search through all conversations',
        shortcut: ['⌘', 'F'],
        category: 'Actions',
        onSelect: () => setAction('Opened search'),
      },
      {
        id: 'clear-history',
        label: 'Clear History',
        description: 'Delete all conversations',
        category: 'Actions',
        onSelect: () => setAction('Cleared history'),
      },
      {
        id: 'export',
        label: 'Export Chat',
        description: 'Download conversation as JSON/PDF',
        category: 'File',
        onSelect: () => setAction('Exported chat'),
      },
      {
        id: 'dark-mode',
        label: 'Toggle Dark Mode',
        description: 'Switch between light and dark themes',
        shortcut: ['⌘', 'D'],
        category: 'Settings',
        onSelect: () => setAction('Toggled dark mode'),
      },
      {
        id: 'settings',
        label: 'Settings',
        description: 'Configure application preferences',
        shortcut: ['⌘', ','],
        category: 'Settings',
        onSelect: () => setAction('Opened settings'),
      },
    ]

    return (
      <div className="w-full space-y-4">
        <div className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Chat Application</h3>
            <button
              onClick={toggle}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {shortcutDisplay}
            </button>
          </div>

          {action && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm">
              ✓ {action}
            </div>
          )}
        </div>

        <CommandPalette
          items={chatCommands}
          open={isOpen}
          onClose={close}
          placeholder="Type a command or search..."
        />
      </div>
    )
  },
}

export const ThemeSwitch: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [theme, setTheme] = useState<string>('System')

    const themeCommands: CommandItem[] = [
      {
        id: 'theme-light',
        label: 'Light Theme',
        description: 'Use light color scheme',
        category: 'Theme',
        onSelect: () => {
          setTheme('Light')
          setOpen(false)
        },
      },
      {
        id: 'theme-dark',
        label: 'Dark Theme',
        description: 'Use dark color scheme',
        category: 'Theme',
        onSelect: () => {
          setTheme('Dark')
          setOpen(false)
        },
      },
      {
        id: 'theme-system',
        label: 'System Theme',
        description: 'Follow system preferences',
        category: 'Theme',
        onSelect: () => {
          setTheme('System')
          setOpen(false)
        },
      },
    ]

    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
          <div>
            <p className="text-sm font-medium">Current Theme</p>
            <p className="text-2xl font-bold">{theme}</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Change Theme
          </button>
        </div>

        <CommandPalette
          items={themeCommands}
          open={open}
          onClose={() => setOpen(false)}
          placeholder="Choose a theme..."
        />
      </div>
    )
  },
}

export const QuickActions: Story = {
  render: () => {
    const [log, setLog] = useState<string[]>([])

    // Use the useCommandPalette hook for proper toggle behavior
    const { isOpen, toggle, close, shortcutDisplay } = useCommandPalette()

    const addLog = (message: string) => {
      setLog((prev) => [
        ...prev,
        `${new Date().toLocaleTimeString()}: ${message}`,
      ])
    }

    const quickActions: CommandItem[] = [
      {
        id: 'copy-link',
        label: 'Copy Share Link',
        description: 'Copy shareable link to clipboard',
        shortcut: ['⌘', 'L'],
        category: 'Quick Actions',
        onSelect: () => addLog('Copied share link'),
      },
      {
        id: 'refresh',
        label: 'Refresh Data',
        description: 'Reload latest information',
        shortcut: ['⌘', 'R'],
        category: 'Quick Actions',
        onSelect: () => addLog('Refreshed data'),
      },
      {
        id: 'print',
        label: 'Print',
        description: 'Print current page',
        shortcut: ['⌘', 'P'],
        category: 'Quick Actions',
        onSelect: () => addLog('Opened print dialog'),
      },
      {
        id: 'help',
        label: 'Help & Support',
        description: 'Get help or contact support',
        shortcut: ['?'],
        category: 'Help',
        onSelect: () => addLog('Opened help'),
      },
    ]

    return (
      <div className="w-full space-y-4">
        <button
          onClick={toggle}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Quick Actions ({shortcutDisplay})
        </button>

        {log.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
            <h4 className="font-medium text-sm mb-2">Action Log</h4>
            <div className="space-y-1 text-xs font-mono">
              {log.slice(-5).map((entry, i) => (
                <div key={i} className="text-muted-foreground">
                  {entry}
                </div>
              ))}
            </div>
          </div>
        )}

        <CommandPalette items={quickActions} open={isOpen} onClose={close} />
      </div>
    )
  },
}

// ============================================================================
// Accessibility
// ============================================================================

export const Accessibility: Story = {
  render: () => {
    const { isOpen, toggle, close, shortcutDisplay } = useCommandPalette()

    return (
      <div className="w-full space-y-6">
        <button
          onClick={toggle}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Command Palette ({shortcutDisplay})
        </button>

        <CommandPalette items={basicCommands} open={isOpen} onClose={close} />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2">
          <strong>Accessibility Features:</strong>
          <ul className="list-disc list-inside space-y-1">
            <li>Full keyboard navigation (↑↓ arrows, Enter, Esc)</li>
            <li>ARIA labels and roles for screen readers</li>
            <li>Focus management and keyboard trapping</li>
            <li>Clear visual focus indicators</li>
            <li>High contrast mode support</li>
            <li>Keyboard shortcuts displayed visually</li>
            <li>Search input auto-focused on open</li>
            <li>Smooth animations respect prefers-reduced-motion</li>
          </ul>
        </div>
      </div>
    )
  },
}

// ============================================================================
// Hook Demo
// ============================================================================

export const UseCommandPaletteHook: Story = {
  render: () => {
    const [events, setEvents] = useState<string[]>([])

    const addEvent = (event: string) => {
      setEvents((prev) => [
        ...prev.slice(-4),
        `${new Date().toLocaleTimeString()}: ${event}`,
      ])
    }

    // Demonstrate all hook options
    const { isOpen, open, close, toggle, shortcutDisplay } = useCommandPalette({
      defaultOpen: false,
      shortcut: 'mod+k',
      shortcutEnabled: true,
      onOpen: () => addEvent('onOpen callback fired'),
      onClose: () => addEvent('onClose callback fired'),
      onToggle: (open) =>
        addEvent(`onToggle callback: ${open ? 'opened' : 'closed'}`),
    })

    return (
      <div className="w-full space-y-6">
        <div className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl space-y-4">
          <h3 className="font-semibold text-lg">useCommandPalette Hook Demo</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-muted-foreground">Current State</div>
              <div className="font-semibold text-lg">
                {isOpen ? 'Open' : 'Closed'}
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-muted-foreground">Shortcut</div>
              <kbd className="font-semibold text-lg">{shortcutDisplay}</kbd>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={open}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              open()
            </button>
            <button
              onClick={close}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              close()
            </button>
            <button
              onClick={toggle}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              toggle()
            </button>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
            <strong>Try it:</strong> Press{' '}
            <kbd className="px-2 py-0.5 bg-background border rounded">
              {shortcutDisplay}
            </kbd>{' '}
            to toggle. It will open if closed, and close if open!
          </div>
        </div>

        {events.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
            <h4 className="font-medium text-sm mb-2">Event Log</h4>
            <div className="space-y-1 text-xs font-mono">
              {events.map((event, i) => (
                <div key={i} className="text-muted-foreground">
                  {event}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
          <strong>Hook API:</strong>
          <pre className="mt-2 p-3 bg-background rounded border text-xs overflow-x-auto">{`const {
  isOpen,        // boolean - current state
  open,          // () => void - open the palette
  close,         // () => void - close the palette
  toggle,        // () => void - toggle open/closed
  setOpen,       // (open: boolean) => void
  shortcutDisplay // string - formatted shortcut (⌘K or Ctrl+K)
} = useCommandPalette({
  defaultOpen: false,      // initial state
  shortcut: 'mod+k',       // keyboard shortcut
  shortcutEnabled: true,   // enable/disable shortcut
  onOpen: () => {},        // callback when opened
  onClose: () => {},       // callback when closed
  onToggle: (open) => {},  // callback on toggle
  enableInInput: false,    // allow shortcut in input elements
})`}</pre>
        </div>

        <CommandPalette items={basicCommands} open={isOpen} onClose={close} />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the useCommandPalette hook with all available options and callbacks. The hook provides proper toggle behavior for Cmd+K/Ctrl+K.',
      },
    },
  },
}

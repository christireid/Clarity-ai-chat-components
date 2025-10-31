import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ApiTable } from '@/components/Demo/ApiTable'

export const metadata: Metadata = {
  title: 'CommandPalette',
  description: 'Keyboard-driven command interface (Cmd+K)',
}

const commandPaletteProps = [
  {
    name: 'items',
    type: 'CommandItem[]',
    required: true,
    description: 'Array of command items to display',
  },
  {
    name: 'open',
    type: 'boolean',
    required: true,
    description: 'Controls visibility of the command palette',
  },
  {
    name: 'onClose',
    type: '() => void',
    required: true,
    description: 'Callback when palette should close',
  },
  {
    name: 'onSelect',
    type: '(item: CommandItem) => void',
    description: 'Callback when an item is selected',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: '"Type a command or search..."',
    description: 'Search input placeholder text',
  },
  {
    name: 'emptyText',
    type: 'string',
    default: '"No results found"',
    description: 'Text shown when search has no results',
  },
  {
    name: 'groups',
    type: 'string[]',
    description: 'Custom group ordering',
  },
  {
    name: 'showIcons',
    type: 'boolean',
    default: 'true',
    description: 'Show command icons',
  },
  {
    name: 'showShortcuts',
    type: 'boolean',
    default: 'true',
    description: 'Show keyboard shortcuts',
  },
  {
    name: 'maxHeight',
    type: 'string',
    default: '"400px"',
    description: 'Maximum height of results list',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function CommandPalettePage() {
  return (
    <>
      <Breadcrumbs />
      
      <h1>CommandPalette</h1>
      
      <p className="lead">
        A keyboard-driven command palette interface, inspired by Spotlight and VS Code's command palette.
        Trigger with Cmd+K (or Ctrl+K) for quick access to actions and navigation.
      </p>

      <Callout type="tip">
        <p>
          The CommandPalette provides a fast, keyboard-first way for power users to navigate
          and execute commands without leaving the keyboard.
        </p>
      </Callout>

      <h2 id="import">Import</h2>

      <CodeBlock
        code={`import { CommandPalette } from '@clarity-chat/react'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <CodeBlock
        code={`import { useState, useEffect } from 'react'
import { CommandPalette, CommandItem } from '@clarity-chat/react'

function App() {
  const [open, setOpen] = useState(false)

  // Open with Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const commands: CommandItem[] = [
    {
      id: 'new-message',
      label: 'New Message',
      icon: '💬',
      group: 'Actions',
      onSelect: () => console.log('New message'),
    },
    {
      id: 'search',
      label: 'Search Messages',
      icon: '🔍',
      group: 'Actions',
      shortcut: '⌘F',
      onSelect: () => console.log('Search'),
    },
  ]

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Open Command Palette (⌘K)
      </button>
      
      <CommandPalette
        items={commands}
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(item) => {
          item.onSelect?.()
          setOpen(false)
        }}
      />
    </>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="grouped-commands">Grouped Commands</h2>

      <p>Organize commands into logical groups:</p>

      <CodeBlock
        code={`const commands: CommandItem[] = [
  // Navigation
  {
    id: 'goto-home',
    label: 'Go to Home',
    icon: '🏠',
    group: 'Navigation',
    onSelect: () => navigate('/'),
  },
  {
    id: 'goto-settings',
    label: 'Go to Settings',
    icon: '⚙️',
    group: 'Navigation',
    onSelect: () => navigate('/settings'),
  },
  
  // Actions
  {
    id: 'new-chat',
    label: 'New Chat',
    icon: '💬',
    group: 'Actions',
    shortcut: '⌘N',
    onSelect: () => createNewChat(),
  },
  {
    id: 'export',
    label: 'Export Chat',
    icon: '📥',
    group: 'Actions',
    onSelect: () => exportChat(),
  },
  
  // Settings
  {
    id: 'dark-mode',
    label: 'Toggle Dark Mode',
    icon: '🌙',
    group: 'Settings',
    shortcut: '⌘D',
    onSelect: () => toggleTheme(),
  },
]`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="with-icons">With Icons</h2>

      <p>Use emoji or React components as icons:</p>

      <CodeBlock
        code={`import { MessageSquare, Search, Settings } from 'lucide-react'

const commands: CommandItem[] = [
  {
    id: 'new-message',
    label: 'New Message',
    icon: <MessageSquare className="w-4 h-4" />,
    onSelect: () => newMessage(),
  },
  {
    id: 'search',
    label: 'Search',
    icon: <Search className="w-4 h-4" />,
    onSelect: () => search(),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
    onSelect: () => openSettings(),
  },
]`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="keyboard-shortcuts">Keyboard Shortcuts</h2>

      <p>Display keyboard shortcuts for commands:</p>

      <CodeBlock
        code={`const commands: CommandItem[] = [
  {
    id: 'save',
    label: 'Save',
    shortcut: '⌘S',
    onSelect: () => save(),
  },
  {
    id: 'copy',
    label: 'Copy',
    shortcut: '⌘C',
    onSelect: () => copy(),
  },
  {
    id: 'paste',
    label: 'Paste',
    shortcut: '⌘V',
    onSelect: () => paste(),
  },
]`}
        language="tsx"
        showLineNumbers
      />

      <Callout type="tip">
        <p>
          Use platform-specific shortcuts: ⌘ for Mac, Ctrl for Windows/Linux.
          The component displays them as-is, so format appropriately.
        </p>
      </Callout>

      <h2 id="search-filtering">Search & Filtering</h2>

      <p>The CommandPalette includes built-in fuzzy search:</p>

      <CodeBlock
        code={`// User types "nm" → matches "New Message"
// User types "stgs" → matches "Settings"
// User types "dk" → matches "Dark Mode"

<CommandPalette
  items={commands}
  open={open}
  onClose={() => setOpen(false)}
  placeholder="Search commands..."
/>`}
        language="tsx"
      />

      <h2 id="custom-actions">Custom Actions</h2>

      <p>Execute custom logic when commands are selected:</p>

      <CodeBlock
        code={`const commands: CommandItem[] = [
  {
    id: 'delete-chat',
    label: 'Delete Chat',
    icon: '🗑️',
    group: 'Actions',
    onSelect: async () => {
      const confirmed = await confirmDialog('Delete this chat?')
      if (confirmed) {
        await deleteChat(chatId)
        toast.success('Chat deleted')
      }
    },
  },
  {
    id: 'share',
    label: 'Share Chat',
    icon: '🔗',
    group: 'Actions',
    onSelect: async () => {
      const link = await generateShareLink(chatId)
      await navigator.clipboard.writeText(link)
      toast.success('Link copied to clipboard')
    },
  },
]`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="dynamic-commands">Dynamic Commands</h2>

      <p>Generate commands based on application state:</p>

      <CodeBlock
        code={`function useCommands() {
  const { user } = useAuth()
  const { chats } = useChats()

  return useMemo(() => {
    const commands: CommandItem[] = []

    // Recent chats
    chats.slice(0, 5).forEach((chat) => {
      commands.push({
        id: \`chat-\${chat.id}\`,
        label: \`Open: \${chat.title}\`,
        icon: '💬',
        group: 'Recent Chats',
        onSelect: () => openChat(chat.id),
      })
    })

    // User actions
    if (user.isAdmin) {
      commands.push({
        id: 'admin-panel',
        label: 'Admin Panel',
        icon: '👑',
        group: 'Admin',
        onSelect: () => navigate('/admin'),
      })
    }

    return commands
  }, [chats, user])
}

function App() {
  const commands = useCommands()
  
  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="props">Props</h2>

      <ApiTable data={commandPaletteProps} />

      <h2 id="types">Type Definitions</h2>

      <CodeBlock
        code={`interface CommandItem {
  id: string
  label: string
  icon?: React.ReactNode | string
  group?: string
  shortcut?: string
  description?: string
  onSelect?: () => void | Promise<void>
  disabled?: boolean
  hidden?: boolean
}`}
        language="tsx"
      />

      <h2 id="styling">Custom Styling</h2>

      <CodeBlock
        code={`<CommandPalette
  items={commands}
  open={open}
  onClose={() => setOpen(false)}
  className="custom-command-palette"
  maxHeight="500px"
/>`}
        language="tsx"
      />

      <h2 id="examples">Complete Examples</h2>

      <h3>Full-Featured Command Palette</h3>

      <CodeBlock
        code={`import { useState, useEffect, useMemo } from 'react'
import { CommandPalette, CommandItem } from '@clarity-chat/react'
import { 
  MessageSquare, 
  Search, 
  Settings, 
  Moon, 
  Sun, 
  LogOut 
} from 'lucide-react'

function App() {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const commands: CommandItem[] = useMemo(() => [
    // Navigation
    {
      id: 'new-chat',
      label: 'New Chat',
      icon: <MessageSquare className="w-4 h-4" />,
      group: 'Navigation',
      shortcut: '⌘N',
      onSelect: () => createNewChat(),
    },
    {
      id: 'search',
      label: 'Search Messages',
      icon: <Search className="w-4 h-4" />,
      group: 'Navigation',
      shortcut: '⌘F',
      onSelect: () => openSearch(),
    },
    
    // Settings
    {
      id: 'toggle-theme',
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      icon: theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      group: 'Settings',
      shortcut: '⌘D',
      onSelect: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    },
    {
      id: 'settings',
      label: 'Open Settings',
      icon: <Settings className="w-4 h-4" />,
      group: 'Settings',
      onSelect: () => navigate('/settings'),
    },
    
    // Account
    {
      id: 'logout',
      label: 'Log Out',
      icon: <LogOut className="w-4 h-4" />,
      group: 'Account',
      onSelect: () => logout(),
    },
  ], [theme])

  return (
    <div>
      <button 
        onClick={() => setOpen(true)}
        className="px-4 py-2 border rounded"
      >
        Press ⌘K to open
      </button>

      <CommandPalette
        items={commands}
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(item) => {
          item.onSelect?.()
          setOpen(false)
        }}
        placeholder="Type a command or search..."
        showIcons
        showShortcuts
      />
    </div>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="accessibility">Accessibility</h2>

      <ul>
        <li>✅ Full keyboard navigation (arrows, enter, escape)</li>
        <li>✅ ARIA labels and roles</li>
        <li>✅ Focus management</li>
        <li>✅ Screen reader announcements</li>
        <li>✅ Keyboard shortcuts display</li>
      </ul>

      <h2 id="performance">Performance Tips</h2>

      <Callout type="tip">
        <p>
          <strong>Optimize for large command lists:</strong>
        </p>
        <ul>
          <li>Use <code>useMemo</code> to memoize command arrays</li>
          <li>Implement virtual scrolling for 100+ commands</li>
          <li>Debounce search input</li>
          <li>Lazy load command icons</li>
        </ul>
      </Callout>

      <h2 id="best-practices">Best Practices</h2>

      <ul>
        <li>Keep command labels short and descriptive</li>
        <li>Group related commands together</li>
        <li>Show keyboard shortcuts for common actions</li>
        <li>Use consistent iconography</li>
        <li>Provide search-friendly command names</li>
        <li>Disable unavailable commands instead of hiding them</li>
      </ul>

      <Callout type="success">
        <p>
          <strong>Ready to try it?</strong> Check out the{' '}
          <a href="/examples/command-palette">Command Palette example</a> for a
          complete implementation with all features.
        </p>
      </Callout>

      <Pagination
        prev={{
          title: 'TypingIndicator',
          href: '/reference/components/typing-indicator',
        }}
        next={{
          title: 'ContextMenu',
          href: '/reference/components/context-menu',
        }}
      />
    </>
  )
}

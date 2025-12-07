'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ToastProvider } from '@clarity-chat/react';
import { Badge } from '@clarity-chat/primitives';
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Pagination } from '@/components/Navigation/Pagination';
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { PropsTable } from '@/components/Enhanced/PropsTable';
import { ViewInStorybook } from '@/components/Links/StorybookLink';
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
];
export const dynamic = 'force-dynamic';
export default function CommandPalettePage() {
    return (_jsx(ToastProvider, { children: _jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsxs("div", { className: "flex gap-2 mb-3", children: [_jsx(Badge, { variant: "subtle", size: "sm", children: "Component" }), _jsx(Badge, { variant: "info", size: "sm", children: "New" })] }), _jsx("h1", { children: "CommandPalette" }), _jsx("p", { className: "lead", children: "A keyboard-driven command palette interface, inspired by Spotlight and VS Code's command palette. Trigger with Cmd+K (or Ctrl+K) for quick access to actions and navigation." }), _jsx(ViewInStorybook, { component: "CommandPalette" }), _jsx(Callout, { type: "tip", children: _jsx("p", { children: "The CommandPalette provides a fast, keyboard-first way for power users to navigate and execute commands without leaving the keyboard." }) }), _jsx("h2", { id: "import", children: "Import" }), _jsx(EnhancedCodeBlock, { code: `import { CommandPalette } from '@clarity-chat/react'`, language: "tsx" }), _jsx("h2", { id: "basic-usage", children: "Basic Usage" }), _jsx(EnhancedCodeBlock, { code: `import { useState, useEffect } from 'react'
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
    return (
    <ToastProvider>) => window.removeEventListener('keydown', handleKeyDown)
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
    <ToastProvider>
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
    </ToastProvider>
  )
}`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "grouped-commands", children: "Grouped Commands" }), _jsx("p", { children: "Organize commands into logical groups:" }), _jsx(EnhancedCodeBlock, { code: `const commands: CommandItem[] = [
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
]`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "with-icons", children: "With Icons" }), _jsx("p", { children: "Use emoji or React components as icons:" }), _jsx(EnhancedCodeBlock, { code: `import { MessageSquare, Search, Settings } from 'lucide-react'

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
]`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "keyboard-shortcuts", children: "Keyboard Shortcuts" }), _jsx("p", { children: "Display keyboard shortcuts for commands:" }), _jsx(EnhancedCodeBlock, { code: `const commands: CommandItem[] = [
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
]`, language: "tsx", showLineNumbers: true }), _jsx(Callout, { type: "tip", children: _jsx("p", { children: "Use platform-specific shortcuts: \u2318 for Mac, Ctrl for Windows/Linux. The component displays them as-is, so format appropriately." }) }), _jsx("h2", { id: "search-filtering", children: "Search & Filtering" }), _jsx("p", { children: "The CommandPalette includes built-in fuzzy search:" }), _jsx(EnhancedCodeBlock, { code: `// User types "nm" → matches "New Message"
// User types "stgs" → matches "Settings"
// User types "dk" → matches "Dark Mode"

<CommandPalette
  items={commands}
  open={open}
  onClose={() => setOpen(false)}
  placeholder="Search commands..."
/>`, language: "tsx" }), _jsx("h2", { id: "custom-actions", children: "Custom Actions" }), _jsx("p", { children: "Execute custom logic when commands are selected:" }), _jsx(EnhancedCodeBlock, { code: `const commands: CommandItem[] = [
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
]`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "dynamic-commands", children: "Dynamic Commands" }), _jsx("p", { children: "Generate commands based on application state:" }), _jsx(EnhancedCodeBlock, { code: `function useCommands() {
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
    <ToastProvider>
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
    />
  )
}`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "props", children: "Props" }), _jsx(PropsTable, { props: commandPaletteProps }), _jsx("h2", { id: "types", children: "Type Definitions" }), _jsx(EnhancedCodeBlock, { code: `interface CommandItem {
  id: string
  label: string
  icon?: React.ReactNode | string
  group?: string
  shortcut?: string
  description?: string
  onSelect?: () => void | Promise<void>
  disabled?: boolean
  hidden?: boolean
}`, language: "tsx" }), _jsx("h2", { id: "styling", children: "Custom Styling" }), _jsx(EnhancedCodeBlock, { code: `<CommandPalette
  items={commands}
  open={open}
  onClose={() => setOpen(false)}
  className="custom-command-palette"
  maxHeight="500px"
/>`, language: "tsx" }), _jsx("h2", { id: "examples", children: "Complete Examples" }), _jsx("h3", { children: "Full-Featured Command Palette" }), _jsx(EnhancedCodeBlock, { code: `import { useState, useEffect, useMemo } from 'react'
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
    return (
    <ToastProvider>) => window.removeEventListener('keydown', handleKeyDown)
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
    <ToastProvider>
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
    </ToastProvider>
  )
}`, language: "tsx", showLineNumbers: true }), _jsx("h2", { id: "accessibility", children: "Accessibility" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Full keyboard navigation (arrows, enter, escape)" }), _jsx("li", { children: "\u2705 ARIA labels and roles" }), _jsx("li", { children: "\u2705 Focus management" }), _jsx("li", { children: "\u2705 Screen reader announcements" }), _jsx("li", { children: "\u2705 Keyboard shortcuts display" })] }), _jsx("h2", { id: "performance", children: "Performance Tips" }), _jsxs(Callout, { type: "tip", children: [_jsx("p", { children: _jsx("strong", { children: "Optimize for large command lists:" }) }), _jsxs("ul", { children: [_jsxs("li", { children: ["Use ", _jsx("code", { children: "useMemo" }), " to memoize command arrays"] }), _jsx("li", { children: "Implement virtual scrolling for 100+ commands" }), _jsx("li", { children: "Debounce search input" }), _jsx("li", { children: "Lazy load command icons" })] })] }), _jsx("h2", { id: "best-practices", children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Keep command labels short and descriptive" }), _jsx("li", { children: "Group related commands together" }), _jsx("li", { children: "Show keyboard shortcuts for common actions" }), _jsx("li", { children: "Use consistent iconography" }), _jsx("li", { children: "Provide search-friendly command names" }), _jsx("li", { children: "Disable unavailable commands instead of hiding them" })] }), _jsx(Callout, { type: "success", children: _jsxs("p", { children: [_jsx("strong", { children: "Ready to try it?" }), " Check out the", ' ', _jsx("a", { href: "/examples/command-palette", children: "Command Palette example" }), " for a complete implementation with all features."] }) }), _jsx(Pagination, { prev: {
                        title: 'TypingIndicator',
                        href: '/reference/components/typing-indicator',
                    }, next: {
                        title: 'ContextMenu',
                        href: '/reference/components/context-menu',
                    } })] }) }));
}
//# sourceMappingURL=page.js.map
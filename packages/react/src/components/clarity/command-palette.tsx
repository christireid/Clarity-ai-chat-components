'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  MessageSquare,
  Plus,
  Search,
  Settings,
  FileText,
  Code,
  ImageIcon,
  Trash2,
  Download,
  Share2,
  Moon,
  Sun,
  Keyboard,
  HelpCircle,
  LogOut,
  User,
  Folder,
  GitBranch,
  Clock,
  Star,
  Bot,
  Wrench,
  Globe,
  Zap,
  Terminal,
} from 'lucide-react'
import type { CommandItem as CommandItemType } from './types/ai-types'

interface CommandPaletteProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  commands?: CommandItemType[]
  recentCommands?: CommandItemType[]
  placeholder?: string
}

const defaultCommands: CommandItemType[] = [
  {
    id: 'new-chat',
    label: 'New Chat',
    description: 'Start a new conversation',
    icon: <Plus className="h-4 w-4" />,
    shortcut: ['Ctrl', 'N'],
    action: () => {},
    category: 'chat',
  },
  {
    id: 'search',
    label: 'Search Conversations',
    description: 'Search through your chat history',
    icon: <Search className="h-4 w-4" />,
    shortcut: ['Ctrl', 'F'],
    action: () => {},
    category: 'chat',
  },
  {
    id: 'export',
    label: 'Export Conversation',
    description: 'Download as markdown or JSON',
    icon: <Download className="h-4 w-4" />,
    shortcut: ['Ctrl', 'E'],
    action: () => {},
    category: 'chat',
  },
  {
    id: 'share',
    label: 'Share Conversation',
    description: 'Create a shareable link',
    icon: <Share2 className="h-4 w-4" />,
    shortcut: ['Ctrl', 'S'],
    action: () => {},
    category: 'chat',
  },
  {
    id: 'branch',
    label: 'Create Branch',
    description: 'Branch from current message',
    icon: <GitBranch className="h-4 w-4" />,
    shortcut: ['Ctrl', 'B'],
    action: () => {},
    category: 'chat',
  },
  {
    id: 'clear',
    label: 'Clear Conversation',
    description: 'Delete all messages',
    icon: <Trash2 className="h-4 w-4" />,
    shortcut: ['Ctrl', 'L'],
    action: () => {},
    category: 'chat',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Open settings panel',
    icon: <Settings className="h-4 w-4" />,
    shortcut: ['Ctrl', ','],
    action: () => {},
    category: 'general',
  },
  {
    id: 'toggle-theme',
    label: 'Toggle Theme',
    description: 'Switch between light and dark mode',
    icon: <Moon className="h-4 w-4" />,
    shortcut: ['Ctrl', 'T'],
    action: () => {},
    category: 'general',
  },
  {
    id: 'keyboard-shortcuts',
    label: 'Keyboard Shortcuts',
    description: 'View all keyboard shortcuts',
    icon: <Keyboard className="h-4 w-4" />,
    shortcut: ['Ctrl', '?'],
    action: () => {},
    category: 'help',
  },
  {
    id: 'help',
    label: 'Help & Documentation',
    description: 'Open help center',
    icon: <HelpCircle className="h-4 w-4" />,
    shortcut: ['Ctrl', 'H'],
    action: () => {},
    category: 'help',
  },
]

export function CommandPalette({
  open,
  onOpenChange,
  commands = defaultCommands,
  recentCommands = [],
  placeholder = 'Type a command or search...',
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = React.useState(open ?? false)

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
        onOpenChange?.(!isOpen)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isOpen, onOpenChange])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItemType[]> = {}
    commands.forEach((cmd) => {
      const category = cmd.category || 'general'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(cmd)
    })
    return groups
  }, [commands])

  const categoryLabels: Record<string, string> = {
    chat: 'Chat',
    general: 'General',
    help: 'Help',
    tools: 'Tools',
    agents: 'Agents',
    files: 'Files',
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {recentCommands.length > 0 && (
          <>
            <CommandGroup heading="Recent">
              {recentCommands.slice(0, 3).map((cmd) => (
                <CommandItem
                  key={cmd.id}
                  onSelect={() => {
                    cmd.action()
                    handleOpenChange(false)
                  }}
                >
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{cmd.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {Object.entries(groupedCommands).map(([category, cmds]) => (
          <CommandGroup
            key={category}
            heading={categoryLabels[category] || category}
          >
            {cmds.map((cmd) => (
              <CommandItem
                key={cmd.id}
                onSelect={() => {
                  cmd.action()
                  handleOpenChange(false)
                }}
                className="gap-3"
              >
                {cmd.icon}
                <div className="flex flex-col flex-1">
                  <span>{cmd.label}</span>
                  {cmd.description && (
                    <span className="text-xs text-muted-foreground">
                      {cmd.description}
                    </span>
                  )}
                </div>
                {cmd.shortcut && (
                  <CommandShortcut>
                    {Array.isArray(cmd.shortcut) ? (
                      cmd.shortcut.map((key, idx) => (
                        <React.Fragment key={key}>
                          <kbd className="px-1.5 py-0.5 text-xs bg-secondary rounded">
                            {key}
                          </kbd>
                          {idx < cmd.shortcut!.length - 1 && (
                            <span className="mx-0.5">+</span>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <kbd className="px-1.5 py-0.5 text-xs bg-secondary rounded">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}

// Keyboard shortcuts display
export function KeyboardShortcuts({ className }: { className?: string }) {
  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Open command palette' },
    { keys: ['Ctrl', 'N'], description: 'New conversation' },
    { keys: ['Ctrl', 'F'], description: 'Search conversations' },
    { keys: ['Ctrl', 'E'], description: 'Export conversation' },
    { keys: ['Ctrl', 'B'], description: 'Create branch' },
    { keys: ['Ctrl', ','], description: 'Open settings' },
    { keys: ['Ctrl', 'T'], description: 'Toggle theme' },
    { keys: ['Ctrl', '/'], description: 'Focus input' },
    { keys: ['Ctrl', 'Enter'], description: 'Send message' },
    { keys: ['Escape'], description: 'Cancel/Close' },
    { keys: ['ArrowUp'], description: 'Previous message (in input)' },
    { keys: ['ArrowDown'], description: 'Next message (in input)' },
  ]

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Keyboard className="h-5 w-5" />
        Keyboard Shortcuts
      </h3>
      <div className="grid gap-2">
        {shortcuts.map((shortcut, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50"
          >
            <span className="text-sm">{shortcut.description}</span>
            <div className="flex items-center gap-1">
              {shortcut.keys.map((key, keyIdx) => (
                <React.Fragment key={key}>
                  <kbd className="px-2 py-1 text-xs font-mono bg-secondary rounded border border-border">
                    {key}
                  </kbd>
                  {keyIdx < shortcut.keys.length - 1 && (
                    <span className="text-muted-foreground">+</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Kbd component for displaying keyboard keys
export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-mono font-medium bg-secondary rounded border border-border',
        className
      )}
    >
      {children}
    </kbd>
  )
}

// Hotkey hook
export function useHotkey(
  key: string,
  callback: () => void,
  deps: React.DependencyList = []
) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const keys = key.toLowerCase().split('+')
      const hasCtrl = keys.includes('ctrl') || keys.includes('cmd')
      const hasShift = keys.includes('shift')
      const hasAlt = keys.includes('alt')
      const mainKey = keys.find(
        (k) => !['ctrl', 'cmd', 'shift', 'alt'].includes(k)
      )

      if (
        e.key.toLowerCase() === mainKey &&
        (hasCtrl ? e.ctrlKey || e.metaKey : true) &&
        (hasShift ? e.shiftKey : true) &&
        (hasAlt ? e.altKey : true)
      ) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback, ...deps])
}

// Quick actions bar
export function QuickActionsBar({
  onNewChat,
  onSearch,
  onExport,
  onSettings,
  className,
}: {
  onNewChat?: () => void
  onSearch?: () => void
  onExport?: () => void
  onSettings?: () => void
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm">New</span>
        <Kbd>N</Kbd>
      </button>
      <button
        onClick={onSearch}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Search</span>
        <Kbd>F</Kbd>
      </button>
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
      >
        <Download className="h-4 w-4" />
        <span className="text-sm">Export</span>
      </button>
      <button
        onClick={onSettings}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
      >
        <Settings className="h-4 w-4" />
      </button>
    </div>
  )
}

/**
 * CommandPalette Component Examples
 *
 * Comprehensive collection of usage examples for the CommandPalette component.
 * Each example is self-contained and can be copied directly into your project.
 *
 * @packageDocumentation
 * @module @clarity-chat/react/examples
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { CommandPalette, CommandItem, AIContext } from '@clarity-chat/react'
import type { UseQueryResult } from '@tanstack/react-query'

// ============================================================================
// Example 1: Basic Usage
// ============================================================================

/**
 * Basic command palette with minimal setup.
 * Perfect for getting started quickly.
 */
export function BasicCommandPalette() {
  const [open, setOpen] = useState(false)

  const commands: CommandItem[] = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      onSelect: () => {
        console.log('Creating new chat...')
        // Your logic here
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Open application settings',
      onSelect: () => {
        console.log('Opening settings...')
        // Your logic here
      },
    },
  ]

  // Open palette with Cmd+K / Ctrl+K
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

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Open Command Palette
      </button>

      <CommandPalette
        items={commands}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

// ============================================================================
// Example 2: With Categories and Icons
// ============================================================================

// Icon components (replace with your own)
const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
const TrashIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
const SettingsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>

/**
 * Command palette with categories, icons, and keyboard shortcuts.
 * Demonstrates a more feature-rich setup.
 */
export function CategorizedCommandPalette() {
  const [open, setOpen] = useState(false)

  const commands: CommandItem[] = [
    // Chat category
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      icon: <PlusIcon />,
      shortcut: ['⌘', 'N'],
      category: 'Chat',
      onSelect: () => console.log('New chat'),
    },
    {
      id: 'delete-chat',
      label: 'Delete Chat',
      description: 'Delete current conversation',
      icon: <TrashIcon />,
      shortcut: ['⌘', 'D'],
      category: 'Chat',
      onSelect: () => console.log('Delete chat'),
    },
    {
      id: 'search-chat',
      label: 'Search Conversations',
      description: 'Search through all conversations',
      icon: <SearchIcon />,
      shortcut: ['⌘', 'F'],
      category: 'Chat',
      onSelect: () => console.log('Search chat'),
    },

    // System category
    {
      id: 'settings',
      label: 'Settings',
      description: 'Open application settings',
      icon: <SettingsIcon />,
      shortcut: ['⌘', ','],
      category: 'System',
      onSelect: () => console.log('Settings'),
    },
  ]

  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
      placeholder="Type a command or search..."
    />
  )
}

// ============================================================================
// Example 3: With AI Context
// ============================================================================

/**
 * Command palette with AI context displayed in the footer.
 * Shows model name, conversation ID, and token usage.
 */
export function AICommandPalette() {
  const [open, setOpen] = useState(false)

  // Mock AI context (replace with your actual state)
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

  const commands: CommandItem[] = [
    {
      id: 'switch-model',
      label: 'Switch Model',
      description: 'Change AI model',
      category: 'AI',
      onSelect: () => console.log('Switch model'),
    },
    {
      id: 'view-tokens',
      label: 'Token Usage',
      description: 'View detailed token usage',
      category: 'AI',
      onSelect: () => console.log('View tokens'),
    },
    {
      id: 'export-context',
      label: 'Export Context',
      description: 'Export conversation context',
      category: 'AI',
      onSelect: () => console.log('Export context'),
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

// ============================================================================
// Example 4: With Loading State
// ============================================================================

/**
 * Command palette with async command loading.
 * Shows loading spinner while fetching commands.
 */
export function AsyncCommandPalette() {
  const [open, setOpen] = useState(false)

  // Mock async data fetching (replace with your actual hook)
  const { data: commands = [], isLoading } = useMockQuery(open)

  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
      loading={isLoading}
      placeholder={isLoading ? 'Loading commands...' : 'Type a command...'}
    />
  )
}

// Mock hook for demonstration
function useMockQuery(enabled: boolean) {
  const [data, setData] = useState<CommandItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!enabled) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setData([
        { id: '1', label: 'Command 1', onSelect: () => {} },
        { id: '2', label: 'Command 2', onSelect: () => {} },
      ])
      setIsLoading(false)
    }, 1000)
  }, [enabled])

  return { data, isLoading }
}

// ============================================================================
// Example 5: Dynamic Commands Based on State
// ============================================================================

interface Conversation {
  id: string
  title: string
  lastMessage: string
}

/**
 * Command palette with dynamically generated commands.
 * Commands update based on application state.
 */
export function DynamicCommandPalette() {
  const [open, setOpen] = useState(false)

  // Mock state (replace with your actual state)
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'Chat about TypeScript', lastMessage: 'Can you explain...' },
    { id: '2', title: 'React hooks discussion', lastMessage: 'How do I use...' },
    { id: '3', title: 'API design questions', lastMessage: 'What is the best...' },
  ])

  // Generate commands from state
  const commands = useMemo(() => {
    const staticCommands: CommandItem[] = [
      {
        id: 'new-chat',
        label: 'New Chat',
        description: 'Start a new conversation',
        category: 'Actions',
        onSelect: () => console.log('New chat'),
      },
    ]

    const conversationCommands: CommandItem[] = conversations.map((conv) => ({
      id: `conv-${conv.id}`,
      label: conv.title,
      description: conv.lastMessage,
      category: 'Conversations',
      onSelect: () => {
        console.log(`Switching to conversation ${conv.id}`)
        // Navigate to conversation
      },
    }))

    return [...staticCommands, ...conversationCommands]
  }, [conversations])

  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
      placeholder="Search conversations..."
    />
  )
}

// ============================================================================
// Example 6: With Custom Styling
// ============================================================================

/**
 * Command palette with custom styling.
 * Demonstrates how to override default styles.
 */
export function StyledCommandPalette() {
  const [open, setOpen] = useState(false)

  const commands: CommandItem[] = [
    {
      id: 'command-1',
      label: 'Command 1',
      description: 'First command',
      onSelect: () => console.log('Command 1'),
    },
    {
      id: 'command-2',
      label: 'Command 2',
      description: 'Second command',
      onSelect: () => console.log('Command 2'),
    },
  ]

  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
      className="max-w-3xl top-[10%] bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700"
      placeholder="What would you like to do?"
    />
  )
}

// ============================================================================
// Example 7: With Error Handling
// ============================================================================

/**
 * Command palette with error handling in command handlers.
 * Shows how to handle async errors gracefully.
 */
export function ErrorHandlingCommandPalette() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteChat = async () => {
    try {
      setError(null)
      // Simulate async operation
      await new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Failed to delete')), 1000)
      })
      console.log('Chat deleted')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Delete failed:', err)
    }
  }

  const commands: CommandItem[] = [
    {
      id: 'delete-chat',
      label: 'Delete Chat',
      description: 'Delete current conversation',
      onSelect: handleDeleteChat,
    },
  ]

  return (
    <>
      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          Error: {error}
        </div>
      )}

      <CommandPalette
        items={commands}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

// ============================================================================
// Example 8: With Navigation Integration
// ============================================================================

/**
 * Command palette integrated with React Router.
 * Commands navigate to different routes.
 */
export function NavigationCommandPalette() {
  const [open, setOpen] = useState(false)
  // const navigate = useNavigate() // Uncomment if using React Router

  const commands: CommandItem[] = [
    {
      id: 'go-home',
      label: 'Go to Home',
      description: 'Navigate to home page',
      shortcut: ['⌘', 'H'],
      category: 'Navigation',
      onSelect: () => {
        // navigate('/')
        console.log('Navigate to /')
      },
    },
    {
      id: 'go-chats',
      label: 'Go to Chats',
      description: 'Navigate to chats page',
      shortcut: ['⌘', 'C'],
      category: 'Navigation',
      onSelect: () => {
        // navigate('/chats')
        console.log('Navigate to /chats')
      },
    },
    {
      id: 'go-settings',
      label: 'Go to Settings',
      description: 'Navigate to settings page',
      shortcut: ['⌘', 'S'],
      category: 'Navigation',
      onSelect: () => {
        // navigate('/settings')
        console.log('Navigate to /settings')
      },
    },
  ]

  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
      placeholder="Where do you want to go?"
    />
  )
}

// ============================================================================
// Example 9: With Toast Notifications
// ============================================================================

/**
 * Command palette with toast notifications on command execution.
 * Shows feedback to the user after actions.
 */
export function ToastCommandPalette() {
  const [open, setOpen] = useState(false)
  // const { toast } = useToast() // Uncomment if using a toast library

  const commands: CommandItem[] = [
    {
      id: 'copy-link',
      label: 'Copy Share Link',
      description: 'Copy conversation share link',
      category: 'Actions',
      onSelect: async () => {
        try {
          await navigator.clipboard.writeText('https://example.com/chat/123')
          // toast.success('Link copied to clipboard')
          console.log('Link copied')
        } catch (err) {
          // toast.error('Failed to copy link')
          console.error('Copy failed:', err)
        }
      },
    },
    {
      id: 'export-chat',
      label: 'Export Chat',
      description: 'Export conversation to file',
      category: 'Actions',
      onSelect: async () => {
        // Simulate export
        await new Promise(resolve => setTimeout(resolve, 1000))
        // toast.success('Chat exported successfully')
        console.log('Chat exported')
      },
    },
  ]

  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
    />
  )
}

// ============================================================================
// Example 10: Custom Hook for Command Palette State
// ============================================================================

/**
 * Custom hook for managing command palette state.
 * Provides a reusable interface for palette control.
 */
function useCommandPalette() {
  const [open, setOpen] = useState(false)

  const toggle = useCallback(() => {
    setOpen(prev => !prev)
  }, [])

  const openPalette = useCallback(() => {
    setOpen(true)
  }, [])

  const closePalette = useCallback(() => {
    setOpen(false)
  }, [])

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  return {
    open,
    openPalette,
    closePalette,
    toggle,
  }
}

/**
 * Command palette using custom hook.
 * Demonstrates cleaner state management.
 */
export function HookBasedCommandPalette() {
  const { open, closePalette, openPalette } = useCommandPalette()

  const commands: CommandItem[] = [
    {
      id: 'example',
      label: 'Example Command',
      description: 'An example command',
      onSelect: () => console.log('Executed'),
    },
  ]

  return (
    <>
      <button onClick={openPalette}>
        Open Command Palette (or press ⌘K)
      </button>

      <CommandPalette
        items={commands}
        open={open}
        onClose={closePalette}
      />
    </>
  )
}

// ============================================================================
// Example 11: With Analytics Tracking
// ============================================================================

/**
 * Command palette with analytics tracking.
 * Tracks command usage for insights.
 */
export function AnalyticsCommandPalette() {
  const [open, setOpen] = useState(false)

  const trackCommand = (commandId: string, commandLabel: string) => {
    // Replace with your analytics implementation
    console.log('Analytics:', {
      event: 'command_executed',
      commandId,
      commandLabel,
      timestamp: new Date().toISOString(),
    })
  }

  const createTrackedCommand = (
    id: string,
    label: string,
    onSelect: () => void
  ): CommandItem => ({
    id,
    label,
    onSelect: () => {
      trackCommand(id, label)
      onSelect()
    },
  })

  const commands: CommandItem[] = [
    createTrackedCommand('new-chat', 'New Chat', () => {
      console.log('Creating new chat')
    }),
    createTrackedCommand('settings', 'Settings', () => {
      console.log('Opening settings')
    }),
  ]

  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
    />
  )
}

// ============================================================================
// Example 12: Complete Production Example
// ============================================================================

/**
 * Production-ready command palette with all features.
 * Combines multiple patterns for a complete implementation.
 */
export function ProductionCommandPalette() {
  const [open, setOpen] = useState(false)
  const [conversations] = useState<Conversation[]>([
    { id: '1', title: 'TypeScript Discussion', lastMessage: 'Can you explain...' },
  ])

  const aiContext: AIContext = {
    modelName: 'Claude 3.5 Sonnet',
    conversationId: 'conv-123',
    tokenUsage: { total: 2100 },
  }

  const commands = useMemo<CommandItem[]>(() => [
    // Actions
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      icon: <PlusIcon />,
      shortcut: ['⌘', 'N'],
      category: 'Actions',
      onSelect: () => console.log('New chat'),
    },
    {
      id: 'search',
      label: 'Search Conversations',
      description: 'Search through all conversations',
      icon: <SearchIcon />,
      shortcut: ['⌘', 'F'],
      category: 'Actions',
      onSelect: () => console.log('Search'),
    },

    // Conversations
    ...conversations.map(conv => ({
      id: `conv-${conv.id}`,
      label: conv.title,
      description: conv.lastMessage,
      category: 'Conversations',
      onSelect: () => console.log(`Switch to ${conv.id}`),
    })),

    // Settings
    {
      id: 'settings',
      label: 'Settings',
      description: 'Open application settings',
      icon: <SettingsIcon />,
      shortcut: ['⌘', ','],
      category: 'Settings',
      onSelect: () => console.log('Settings'),
    },
  ], [conversations])

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

  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
      placeholder="Type a command or search..."
      aiContext={aiContext}
      aria-label="Command palette"
    />
  )
}

// ============================================================================
// Export All Examples
// ============================================================================

export const examples = {
  BasicCommandPalette,
  CategorizedCommandPalette,
  AICommandPalette,
  AsyncCommandPalette,
  DynamicCommandPalette,
  StyledCommandPalette,
  ErrorHandlingCommandPalette,
  NavigationCommandPalette,
  ToastCommandPalette,
  HookBasedCommandPalette,
  AnalyticsCommandPalette,
  ProductionCommandPalette,
}

export default examples

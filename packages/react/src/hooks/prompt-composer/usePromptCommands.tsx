/**
 * usePromptCommands Hook
 *
 * Manages slash commands for PromptComposer with:
 * - Command detection and autocomplete
 * - Fuzzy search filtering
 * - Keyboard navigation
 * - Recent commands tracking
 * - Custom command registration
 */

'use client'

import * as React from 'react'
import type {
  Command,
  CommandsConfig,
  CommandCategory,
} from './types'

// ============================================================================
// Types
// ============================================================================

export interface UsePromptCommandsConfig {
  commands?: Command[]
  categories?: CommandCategory[]
  fuzzySearch?: boolean
  maxRecent?: number
  onCommandExecute?: (command: Command, args?: string) => void
}

export interface UsePromptCommandsReturn {
  // State
  isActive: boolean
  query: string
  filteredCommands: Command[]
  selectedIndex: number
  activeCommand: Command | null
  recentCommands: Command[]

  // Actions
  search: (query: string) => void
  execute: (command: Command, args?: string) => Promise<void>
  cancel: () => void
  selectNext: () => void
  selectPrevious: () => void
  selectFirst: () => void
  selectLast: () => void
  confirm: () => void

  // Registration (for plugins)
  registerCommand: (command: Command) => void
  unregisterCommand: (id: string) => void
  getAvailableCommands: () => Command[]
}

// ============================================================================
// Built-in Commands
// ============================================================================

export const BUILTIN_COMMANDS: Command[] = [
  {
    id: 'clear',
    trigger: '/clear',
    label: 'Clear Conversation',
    description: 'Clear all messages and start fresh',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
    category: 'conversation',
    shortcut: 'Ctrl+Shift+C',
    execute: async () => {
      // Implemented by consumer
    },
  },
  {
    id: 'save',
    trigger: '/save',
    label: 'Save Conversation',
    description: 'Save current conversation to history',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
        />
      </svg>
    ),
    category: 'conversation',
    shortcut: 'Ctrl+S',
    execute: async () => {
      // Implemented by consumer
    },
  },
  {
    id: 'load',
    trigger: '/load',
    label: 'Load Conversation',
    description: 'Load a saved conversation',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
    ),
    category: 'conversation',
    execute: async () => {
      // Implemented by consumer
    },
  },
  {
    id: 'context',
    trigger: '/context',
    label: 'Manage Context',
    description: 'Add or remove context items',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    category: 'context',
    execute: async () => {
      // Implemented by consumer
    },
  },
  {
    id: 'model',
    trigger: '/model',
    label: 'Switch Model',
    description: 'Change the AI model',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    category: 'settings',
    execute: async () => {
      // Implemented by consumer
    },
  },
  {
    id: 'settings',
    trigger: '/settings',
    label: 'Open Settings',
    description: 'Configure chat preferences',
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    category: 'settings',
    shortcut: 'Ctrl+,',
    execute: async () => {
      // Implemented by consumer
    },
  },
]

// ============================================================================
// Fuzzy Search Utility
// ============================================================================

/**
 * Simple fuzzy search implementation
 * Returns a score (0-1) based on character matching
 */
function fuzzyMatch(str: string, pattern: string): number {
  const strLower = str.toLowerCase()
  const patternLower = pattern.toLowerCase()

  // Exact match gets highest score
  if (strLower === patternLower) return 1
  if (strLower.includes(patternLower)) return 0.9

  let score = 0
  let patternIndex = 0
  let lastMatchIndex = -1

  for (let i = 0; i < strLower.length && patternIndex < patternLower.length; i++) {
    if (strLower[i] === patternLower[patternIndex]) {
      score += 1
      // Bonus for consecutive matches
      if (i === lastMatchIndex + 1) {
        score += 0.5
      }
      lastMatchIndex = i
      patternIndex++
    }
  }

  // Did we match all pattern characters?
  if (patternIndex === patternLower.length) {
    return score / (strLower.length + patternLower.length)
  }

  return 0 // No match
}

/**
 * Filter commands using fuzzy search
 */
function filterCommands(
  commands: Command[],
  query: string,
  useFuzzy: boolean
): Command[] {
  if (!query) return commands

  const queryLower = query.toLowerCase()

  if (!useFuzzy) {
    // Simple includes search
    return commands.filter(
      (cmd) =>
        cmd.trigger.toLowerCase().includes(queryLower) ||
        cmd.label.toLowerCase().includes(queryLower) ||
        cmd.description.toLowerCase().includes(queryLower) ||
        cmd.category?.toLowerCase().includes(queryLower)
    )
  }

  // Fuzzy search with scoring
  const scored = commands
    .map((cmd) => {
      const triggerScore = fuzzyMatch(cmd.trigger, query)
      const labelScore = fuzzyMatch(cmd.label, query)
      const descScore = cmd.description ? fuzzyMatch(cmd.description, query) : 0
      const categoryScore = cmd.category ? fuzzyMatch(cmd.category, query) : 0

      const maxScore = Math.max(triggerScore, labelScore, descScore, categoryScore)

      return {
        command: cmd,
        score: maxScore,
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.map((item) => item.command)
}

// ============================================================================
// Main Hook
// ============================================================================

/**
 * Hook for managing slash commands in PromptComposer.
 *
 * **Features:**
 * - Detects /slash commands as user types
 * - Provides fuzzy search autocomplete
 * - Tracks recently used commands
 * - Supports keyboard navigation
 * - Allows custom command registration
 *
 * @example
 * ```tsx
 * const commands = usePromptCommands({
 *   commands: [
 *     {
 *       id: 'custom',
 *       trigger: '/custom',
 *       label: 'Custom Command',
 *       description: 'Does something custom',
 *       execute: async () => { ... }
 *     }
 *   ],
 *   fuzzySearch: true,
 *   onCommandExecute: (cmd) => console.log('Executed:', cmd.label)
 * })
 *
 * // Detect commands
 * if (input.startsWith('/')) {
 *   commands.search(input.slice(1))
 * }
 *
 * // Execute command
 * commands.execute(commands.filteredCommands[0])
 * ```
 */
export function usePromptCommands(
  config: UsePromptCommandsConfig = {}
): UsePromptCommandsReturn {
  const {
    commands: customCommands = [],
    categories = [],
    fuzzySearch = true,
    maxRecent = 5,
    onCommandExecute,
  } = config

  // ========================================================================
  // State
  // ========================================================================

  const [registeredCommands, setRegisteredCommands] = React.useState<Command[]>(
    () => [...BUILTIN_COMMANDS, ...customCommands]
  )
  const [isActive, setIsActive] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [activeCommand, setActiveCommand] = React.useState<Command | null>(null)
  const [recentCommands, setRecentCommands] = React.useState<Command[]>([])

  // ========================================================================
  // Command Filtering
  // ========================================================================

  const availableCommands = React.useMemo(() => {
    return registeredCommands.filter((cmd) => {
      if (typeof cmd.available === 'function') {
        return cmd.available()
      }
      return cmd.available !== false
    })
  }, [registeredCommands])

  const filteredCommands = React.useMemo(() => {
    const filtered = filterCommands(availableCommands, query, fuzzySearch)

    // Sort by recent usage if query is empty
    if (!query && recentCommands.length > 0) {
      const recentIds = new Set(recentCommands.map((cmd) => cmd.id))
      return [
        ...filtered.filter((cmd) => recentIds.has(cmd.id)),
        ...filtered.filter((cmd) => !recentIds.has(cmd.id)),
      ]
    }

    return filtered
  }, [availableCommands, query, fuzzySearch, recentCommands])

  // ========================================================================
  // Selection Management
  // ========================================================================

  // Reset selection when filtered commands change
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [filteredCommands])

  const selectNext = React.useCallback(() => {
    setSelectedIndex((prev) =>
      prev < filteredCommands.length - 1 ? prev + 1 : prev
    )
  }, [filteredCommands.length])

  const selectPrevious = React.useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }, [])

  const selectFirst = React.useCallback(() => {
    setSelectedIndex(0)
  }, [])

  const selectLast = React.useCallback(() => {
    setSelectedIndex(Math.max(0, filteredCommands.length - 1))
  }, [filteredCommands.length])

  // ========================================================================
  // Command Actions
  // ========================================================================

  const search = React.useCallback((searchQuery: string) => {
    setQuery(searchQuery)
    setIsActive(true)
  }, [])

  const execute = React.useCallback(
    async (command: Command, args?: string) => {
      setActiveCommand(command)
      setIsActive(false)

      try {
        await command.execute(args)

        // Add to recent commands
        setRecentCommands((prev) => {
          const filtered = prev.filter((cmd) => cmd.id !== command.id)
          return [command, ...filtered].slice(0, maxRecent)
        })

        onCommandExecute?.(command, args)
      } catch (error) {
        console.error('[usePromptCommands] Command execution failed:', error)
        throw error
      } finally {
        setActiveCommand(null)
        setQuery('')
      }
    },
    [maxRecent, onCommandExecute]
  )

  const confirm = React.useCallback(() => {
    const command = filteredCommands[selectedIndex]
    if (command) {
      execute(command)
    }
  }, [filteredCommands, selectedIndex, execute])

  const cancel = React.useCallback(() => {
    setIsActive(false)
    setQuery('')
    setSelectedIndex(0)
  }, [])

  // ========================================================================
  // Command Registration
  // ========================================================================

  const registerCommand = React.useCallback((command: Command) => {
    setRegisteredCommands((prev) => {
      // Don't add duplicates
      if (prev.some((cmd) => cmd.id === command.id)) {
        console.warn(`[usePromptCommands] Command "${command.id}" already registered`)
        return prev
      }
      return [...prev, command]
    })
  }, [])

  const unregisterCommand = React.useCallback((id: string) => {
    setRegisteredCommands((prev) => prev.filter((cmd) => cmd.id !== id))
  }, [])

  const getAvailableCommands = React.useCallback(() => {
    return availableCommands
  }, [availableCommands])

  // ========================================================================
  // Return Value
  // ========================================================================

  return {
    // State
    isActive,
    query,
    filteredCommands,
    selectedIndex,
    activeCommand,
    recentCommands,

    // Actions
    search,
    execute,
    cancel,
    selectNext,
    selectPrevious,
    selectFirst,
    selectLast,
    confirm,

    // Registration
    registerCommand,
    unregisterCommand,
    getAvailableCommands,
  }
}

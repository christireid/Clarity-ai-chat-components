/**
 * Slash Command Management Hook
 *
 * Manages slash command menu visibility, filtering, and selection.
 * Detects "/" trigger in input and provides interface for command discovery.
 */

import * as React from 'react'
import type { SlashCommand } from '../../components/chat/SlashCommandMenu'

export interface UseSlashCommandsOptions {
  /** Available slash commands */
  commands: SlashCommand[]
  /** Current input value */
  inputValue: string
  /** Callback to update input value */
  onInputChange: (value: string) => void
  /** Whether slash commands are enabled */
  enabled?: boolean
}

export interface UseSlashCommandsReturn {
  /** Whether the menu should be visible */
  isMenuOpen: boolean
  /** Current query (text after "/") */
  query: string
  /** Filtered commands based on query */
  filteredCommands: SlashCommand[]
  /** Handle command selection */
  selectCommand: (command: SlashCommand) => void
  /** Close the menu */
  closeMenu: () => void
  /** Check if input triggers slash command menu */
  shouldShowMenu: boolean
}

/**
 * Hook for managing slash command menu state
 *
 * @example
 * ```tsx
 * const commands = [
 *   { name: '/search', description: 'Search docs', icon: SearchIcon },
 *   { name: '/bundle', description: 'Bundle size', icon: PackageIcon },
 * ]
 *
 * function ChatInput() {
 *   const [input, setInput] = useState('')
 *
 *   const {
 *     isMenuOpen,
 *     query,
 *     filteredCommands,
 *     selectCommand,
 *     closeMenu,
 *   } = useSlashCommands({
 *     commands,
 *     inputValue: input,
 *     onInputChange: setInput,
 *   })
 *
 *   return (
 *     <>
 *       <input value={input} onChange={(e) => setInput(e.target.value)} />
 *       <SlashCommandMenu
 *         isOpen={isMenuOpen}
 *         commands={filteredCommands}
 *         query={query}
 *         onSelect={selectCommand}
 *         onClose={closeMenu}
 *       />
 *     </>
 *   )
 * }
 * ```
 */
export function useSlashCommands({
  commands,
  inputValue,
  onInputChange,
  enabled = true,
}: UseSlashCommandsOptions): UseSlashCommandsReturn {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  // Detect slash command trigger
  const slashCommandMatch = React.useMemo(() => {
    if (!enabled || !inputValue) return null

    // Check if input starts with "/" and extract query
    // Supports: "/", "/search", "/sea"
    const match = inputValue.match(/^\/(\w*)$/)
    return match
      ? {
          fullMatch: match[0],
          query: match[1] || '',
        }
      : null
  }, [inputValue, enabled])

  // Query is the text after "/"
  const query = slashCommandMatch?.query || ''

  // Show menu when "/" is detected
  const shouldShowMenu = !!slashCommandMatch && enabled

  // Filter commands based on query
  const filteredCommands = React.useMemo(() => {
    if (!query) return commands

    const lowerQuery = query.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(lowerQuery) ||
        cmd.description.toLowerCase().includes(lowerQuery)
    )
  }, [commands, query])

  // Update menu visibility based on detection
  React.useEffect(() => {
    setIsMenuOpen(shouldShowMenu)
  }, [shouldShowMenu])

  // Select a command and insert it into input
  const selectCommand = React.useCallback(
    (command: SlashCommand) => {
      // Replace "/" or "/query" with the full command name + space
      onInputChange(command.name + ' ')
      setIsMenuOpen(false)
    },
    [onInputChange]
  )

  // Close menu
  const closeMenu = React.useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  // Close menu when input no longer matches pattern
  React.useEffect(() => {
    if (!shouldShowMenu && isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [shouldShowMenu, isMenuOpen])

  return {
    isMenuOpen,
    query,
    filteredCommands,
    selectCommand,
    closeMenu,
    shouldShowMenu,
  }
}

/**
 * Default slash commands for Clarity Chat
 *
 * Maps to available tool definitions in the docs assistant.
 */
export const DEFAULT_SLASH_COMMANDS: SlashCommand[] = [
  {
    name: '/search',
    description: 'Search documentation and find answers',
    icon: ({ size = 16, className = '' }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={className}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    category: 'Documentation',
  },
  {
    name: '/bundle',
    description: 'Calculate bundle size and optimize imports',
    icon: ({ size = 16, className = '' }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={className}
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    category: 'Optimization',
  },
  {
    name: '/code',
    description: 'Generate code example for your use case',
    icon: ({ size = 16, className = '' }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={className}
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    category: 'Code Generation',
  },
  {
    name: '/diagram',
    description: 'Create visual diagram of architecture or flow',
    icon: ({ size = 16, className = '' }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={className}
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    category: 'Visualization',
  },
  {
    name: '/component',
    description: 'Look up component documentation and API',
    icon: ({ size = 16, className = '' }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={className}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
        <path d="M15 3v18" />
      </svg>
    ),
    category: 'Documentation',
  },
  {
    name: '/hook',
    description: 'Look up React hook usage and examples',
    icon: ({ size = 16, className = '' }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={className}
      >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
    category: 'Documentation',
  },
]

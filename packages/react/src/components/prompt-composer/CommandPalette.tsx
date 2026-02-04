/**
 * CommandPalette
 *
 * /slash command palette for quick actions in PromptComposer.
 * Integrates with PromptComposer for keyboard-driven command execution.
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type { Command, CommandCategory } from '../../hooks/prompt-composer/types'

export interface CommandPaletteProps {
  /** Available commands */
  commands: Command[]
  /** Categories for organizing commands */
  categories?: CommandCategory[]
  /** Currently active search query */
  query: string
  /** Selected command index */
  selectedIndex: number
  /** Callback when command is executed */
  onExecute: (command: Command, args?: string) => void
  /** Callback when selection changes */
  onSelectionChange: (index: number) => void
  /** Callback when palette should close */
  onClose: () => void
  /** Enable fuzzy search */
  fuzzySearch?: boolean
  className?: string
}

/**
 * Fuzzy search for commands
 */
function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase()
  const t = text.toLowerCase()

  // Simple substring match
  if (t.includes(q)) return true

  // Character-by-character fuzzy match
  let qIndex = 0
  for (let i = 0; i < t.length && qIndex < q.length; i++) {
    if (t[i] === q[qIndex]) {
      qIndex++
    }
  }

  return qIndex === q.length
}

/**
 * CommandPalette Component
 *
 * Dropdown command palette triggered by /slash commands.
 * Supports keyboard navigation, fuzzy search, and categorization.
 *
 * @example
 * ```tsx
 * const commands = [
 *   {
 *     id: 'search',
 *     trigger: '/search',
 *     label: 'Search codebase',
 *     description: 'Search for files and code',
 *     icon: <SearchIcon />,
 *     category: 'navigation',
 *     execute: async () => { ... },
 *   },
 * ]
 *
 * <CommandPalette
 *   commands={commands}
 *   query="sear"
 *   selectedIndex={0}
 *   onExecute={(cmd) => cmd.execute()}
 *   onSelectionChange={setSelected}
 *   onClose={() => setShowPalette(false)}
 * />
 * ```
 */
export function CommandPalette({
  commands,
  categories = [],
  query,
  selectedIndex,
  onExecute,
  onSelectionChange,
  onClose,
  fuzzySearch = true,
  className,
}: CommandPaletteProps) {
  const paletteRef = React.useRef<HTMLDivElement>(null)

  // Filter commands based on query and availability
  const filteredCommands = React.useMemo(() => {
    const matcher = fuzzySearch ? fuzzyMatch : (q: string, t: string) => t.toLowerCase().includes(q.toLowerCase())

    return commands.filter((cmd) => {
      // Check availability
      const isAvailable = typeof cmd.available === 'function' ? cmd.available() : cmd.available !== false

      if (!isAvailable) return false

      // Filter by query
      if (!query) return true

      return (
        matcher(query, cmd.label) ||
        matcher(query, cmd.trigger) ||
        (cmd.description && matcher(query, cmd.description))
      )
    })
  }, [commands, query, fuzzySearch])

  // Group commands by category
  const groupedCommands = React.useMemo(() => {
    if (categories.length === 0) {
      return [{ category: null, commands: filteredCommands }]
    }

    const groups: Array<{ category: CommandCategory | null; commands: Command[] }> = []

    // Add commands for each category
    categories.forEach((category) => {
      const cmds = filteredCommands.filter((cmd) => cmd.category === category.id)
      if (cmds.length > 0) {
        groups.push({ category, commands: cmds })
      }
    })

    // Add uncategorized commands
    const uncategorized = filteredCommands.filter((cmd) => !cmd.category)
    if (uncategorized.length > 0) {
      groups.push({ category: null, commands: uncategorized })
    }

    return groups
  }, [filteredCommands, categories])

  // Get flat list for keyboard navigation
  const flatCommands = React.useMemo(() => {
    return filteredCommands
  }, [filteredCommands])

  // Scroll selected command into view
  React.useEffect(() => {
    if (paletteRef.current && selectedIndex >= 0) {
      const buttons = paletteRef.current.querySelectorAll('button[data-command]')
      const selected = buttons[selectedIndex] as HTMLElement
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (filteredCommands.length === 0) {
    return (
      <div
        className={cn(
          'absolute bottom-full mb-2 left-0 right-0',
          'bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg',
          'p-4 text-center text-sm text-gray-500 dark:text-gray-400',
          'z-50',
          className
        )}
      >
        No commands found for "{query}"
      </div>
    )
  }

  return (
    <div
      ref={paletteRef}
      className={cn(
        'absolute bottom-full mb-2 left-0 right-0',
        'max-h-96 overflow-y-auto scrollbar-hide',
        'bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg',
        'z-50',
        className
      )}
    >
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-gray-100 dark:border-gray-800 px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Commands
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-600">
            {filteredCommands.length} available
          </span>
        </div>
      </div>

      {/* Command groups */}
      {groupedCommands.map((group, groupIndex) => (
        <div key={group.category?.id || 'uncategorized'} className="py-1">
          {/* Category header */}
          {group.category && (
            <div className="px-4 py-2 flex items-center gap-2">
              {group.category.icon && (
                <span className="w-4 h-4 text-gray-400">{group.category.icon}</span>
              )}
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {group.category.label}
              </span>
            </div>
          )}

          {/* Commands in this category */}
          {group.commands.map((command) => {
            const globalIndex = flatCommands.indexOf(command)
            const isSelected = globalIndex === selectedIndex

            return (
              <button
                key={command.id}
                data-command={command.id}
                onClick={() => {
                  onExecute(command)
                  onClose()
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5',
                  'hover:bg-accent transition-colors text-left',
                  isSelected && 'bg-accent'
                )}
              >
                {/* Icon */}
                {command.icon && (
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    {command.icon}
                  </div>
                )}

                {/* Command info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {command.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                      {command.trigger}
                    </span>
                  </div>
                  {command.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {command.description}
                    </div>
                  )}
                </div>

                {/* Keyboard hint */}
                {isSelected && (
                  <div className="shrink-0 flex items-center gap-1">
                    {command.shortcut && (
                      <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">
                        {command.shortcut}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                      ↵
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      ))}

      {/* Footer hint */}
      <div className="sticky bottom-0 bg-background border-t border-gray-100 dark:border-gray-800 px-4 py-2">
        <div className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-4">
          <span>↑↓ Navigate</span>
          <span>↵ Execute</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  )
}

CommandPalette.displayName = 'CommandPalette'

/**
 * Hook to manage command palette state
 */
export function useCommandPalette() {
  const [showCommands, setShowCommands] = React.useState(false)
  const [commandQuery, setCommandQuery] = React.useState('')
  const [selectedCommandIndex, setSelectedCommandIndex] = React.useState(0)

  const openCommands = React.useCallback((query: string = '') => {
    setCommandQuery(query)
    setSelectedCommandIndex(0)
    setShowCommands(true)
  }, [])

  const closeCommands = React.useCallback(() => {
    setShowCommands(false)
    setCommandQuery('')
    setSelectedCommandIndex(0)
  }, [])

  const updateQuery = React.useCallback((query: string) => {
    setCommandQuery(query)
    setSelectedCommandIndex(0) // Reset selection when query changes
  }, [])

  const selectNext = React.useCallback((count: number) => {
    setSelectedCommandIndex((prev) => Math.min(prev + 1, count - 1))
  }, [])

  const selectPrevious = React.useCallback(() => {
    setSelectedCommandIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  return {
    showCommands,
    commandQuery,
    selectedCommandIndex,
    openCommands,
    closeCommands,
    updateQuery,
    selectNext,
    selectPrevious,
  }
}

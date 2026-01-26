'use client'

/**
 * Enhanced Command Palette
 *
 * A powerful command palette with fuzzy search, recent commands,
 * and best-in-class keyboard navigation.
 *
 * Features:
 * - Fuzzy search with highlighting
 * - Recent commands section
 * - Vim-style navigation (j/k)
 * - Nested command groups
 * - Action previews
 * - Keyboard shortcuts display
 */

import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { cn, Kbd, useBodyScrollLock } from '@clarity-chat/primitives'
import {
  useFocusTrap,
  useFocusRestoration,
} from '../../accessibility/focus-management'
import { useReducedMotion } from '@clarity-chat/primitives'
import { formatShortcutDisplay } from '../../hooks/keyboard/use-keyboard-navigation'
import { EASING_FRAMER, ANIMATION_PRESETS } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export interface CommandAction {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string | string[]
  category?: string
  keywords?: string[]
  onSelect: () => void
  disabled?: boolean
  /** For nested commands */
  children?: CommandAction[]
  /** Preview content */
  preview?: React.ReactNode
}

export interface CommandPaletteEnhancedProps {
  /** Available commands */
  commands: CommandAction[]
  /** Whether palette is open */
  open: boolean
  /** Close callback */
  onClose: () => void
  /** Placeholder text */
  placeholder?: string
  /** Enable recent commands tracking */
  enableRecents?: boolean
  /** Maximum recent commands to show */
  maxRecents?: number
  /** Storage key for recents */
  storageKey?: string
  /** Custom class name */
  className?: string
  /** Empty state content */
  emptyState?: React.ReactNode
  /** Footer content */
  footer?: React.ReactNode
}

// ============================================================================
// Fuzzy Search
// ============================================================================

interface FuzzyMatch {
  item: CommandAction
  score: number
  matches: Array<[number, number]>
}

function fuzzySearch(query: string, items: CommandAction[]): FuzzyMatch[] {
  if (!query.trim()) {
    return items.map((item) => ({ item, score: 0, matches: [] }))
  }

  const queryLower = query.toLowerCase()
  const results: FuzzyMatch[] = []

  items.forEach((item) => {
    const labelLower = item.label.toLowerCase()
    const descLower = (item.description || '').toLowerCase()
    const keywordsLower = (item.keywords || []).join(' ').toLowerCase()
    const categoryLower = (item.category || '').toLowerCase()

    // Check label match
    const labelMatch = fuzzyMatch(queryLower, labelLower)
    const descMatch = fuzzyMatch(queryLower, descLower)
    const keywordsMatch = fuzzyMatch(queryLower, keywordsLower)
    const categoryMatch = fuzzyMatch(queryLower, categoryLower)

    const bestMatch = [
      labelMatch,
      descMatch,
      keywordsMatch,
      categoryMatch,
    ].reduce(
      (best, current) =>
        current && (!best || current.score > best.score) ? current : best,
      null as { score: number; matches: Array<[number, number]> } | null
    )

    if (bestMatch && bestMatch.score > 0) {
      results.push({
        item,
        score: bestMatch.score,
        // Only return label matches for highlighting
        matches: labelMatch?.matches || [],
      })
    }
  })

  return results.sort((a, b) => b.score - a.score)
}

function fuzzyMatch(
  query: string,
  text: string
): { score: number; matches: Array<[number, number]> } | null {
  if (!query) return { score: 0, matches: [] }
  if (!text) return null

  const matches: Array<[number, number]> = []
  let score = 0
  let queryIndex = 0
  let consecutiveMatches = 0
  let lastMatchIndex = -1

  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      // Consecutive match bonus
      if (lastMatchIndex === i - 1) {
        consecutiveMatches++
        score += consecutiveMatches * 2
      } else {
        consecutiveMatches = 1
      }

      // Start of word bonus
      if (
        i === 0 ||
        text[i - 1] === ' ' ||
        text[i - 1] === '-' ||
        text[i - 1] === '_'
      ) {
        score += 10
      }

      // Exact case match bonus
      if (text[i] === query[queryIndex]) {
        score += 1
      }

      // Record match position
      if (matches.length > 0 && matches[matches.length - 1][1] === i) {
        matches[matches.length - 1][1] = i + 1
      } else {
        matches.push([i, i + 1])
      }

      lastMatchIndex = i
      queryIndex++
      score += 1
    }
  }

  // All query chars matched
  if (queryIndex === query.length) {
    // Bonus for shorter strings (more relevant matches)
    score += Math.max(0, 50 - text.length)
    return { score, matches }
  }

  return null
}

// ============================================================================
// Recent Commands Hook (SSR-safe)
// ============================================================================

/**
 * Check if localStorage is available (browser environment)
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

function useRecentCommands(
  storageKey: string,
  maxRecents: number
): [string[], (id: string) => void] {
  const [recents, setRecents] = React.useState<string[]>([])
  const [isClient, setIsClient] = React.useState(false)

  // Check if we're on the client after hydration
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Load from localStorage (only on client)
  React.useEffect(() => {
    if (!isClient || !isLocalStorageAvailable()) return

    try {
      const stored = window.localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setRecents(parsed)
        }
      }
    } catch {
      // Ignore storage errors (quota exceeded, invalid JSON, etc.)
    }
  }, [storageKey, isClient])

  // Add to recents
  const addRecent = React.useCallback(
    (id: string) => {
      setRecents((prev) => {
        const newRecents = [id, ...prev.filter((r) => r !== id)].slice(
          0,
          maxRecents
        )

        // Persist to localStorage (if available)
        if (isLocalStorageAvailable()) {
          try {
            window.localStorage.setItem(storageKey, JSON.stringify(newRecents))
          } catch {
            // Ignore storage errors (quota exceeded, etc.)
          }
        }

        return newRecents
      })
    },
    [storageKey, maxRecents]
  )

  return [recents, addRecent]
}

// ============================================================================
// Highlight Component
// ============================================================================

function HighlightedText({
  text,
  matches,
}: {
  text: string
  matches: Array<[number, number]>
}) {
  if (matches.length === 0) {
    return <>{text}</>
  }

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  matches.forEach(([start, end], i) => {
    // Add non-matching part
    if (start > lastIndex) {
      parts.push(<span key={`text-${i}`}>{text.slice(lastIndex, start)}</span>)
    }
    // Add matching part
    parts.push(
      <mark
        key={`match-${i}`}
        className="bg-primary/20 text-primary rounded px-0.5"
      >
        {text.slice(start, end)}
      </mark>
    )
    lastIndex = end
  })

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.slice(lastIndex)}</span>)
  }

  return <>{parts}</>
}

// ============================================================================
// Component
// ============================================================================

export function CommandPaletteEnhanced({
  commands,
  open,
  onClose,
  placeholder = 'Type a command or search...',
  enableRecents = true,
  maxRecents = 5,
  storageKey = 'clarity-command-palette-recents',
  className,
  emptyState,
  footer,
}: CommandPaletteEnhancedProps) {
  const [search, setSearch] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null)
  const [commandStack, setCommandStack] = React.useState<CommandAction[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  const prefersReducedMotion = useReducedMotion()
  const focusTrapRef = useFocusTrap<HTMLDivElement>(open)
  const { saveFocus, restoreFocus } = useFocusRestoration()
  const { lock } = useBodyScrollLock()

  // Recent commands
  const [recents, addRecent] = useRecentCommands(storageKey, maxRecents)

  // Current commands (support nested navigation) - memoized to prevent dependency issues
  const currentCommands = React.useMemo(
    () =>
      commandStack.length > 0
        ? commandStack[commandStack.length - 1].children || []
        : commands,
    [commandStack, commands]
  )

  // Fuzzy search results
  const searchResults = React.useMemo(
    () => fuzzySearch(search, currentCommands),
    [search, currentCommands]
  )

  // Build display list with recents section
  const displayItems = React.useMemo(() => {
    if (search.trim()) {
      return searchResults
    }

    // Show recents first if available
    if (enableRecents && recents.length > 0 && commandStack.length === 0) {
      const recentCommands = recents
        .map((id) => currentCommands.find((c) => c.id === id))
        .filter(Boolean) as CommandAction[]

      if (recentCommands.length > 0) {
        return [
          ...recentCommands.map((item) => ({
            item: { ...item, category: 'Recent' },
            score: 1000,
            matches: [],
          })),
          ...currentCommands
            .filter((c) => !recents.includes(c.id))
            .map((item) => ({ item, score: 0, matches: [] })),
        ]
      }
    }

    return currentCommands.map((item) => ({ item, score: 0, matches: [] }))
  }, [
    search,
    searchResults,
    currentCommands,
    recents,
    enableRecents,
    commandStack.length,
  ])

  // Group by category
  const groupedItems = React.useMemo(() => {
    const groups: Map<string, FuzzyMatch[]> = new Map()

    displayItems.forEach((result) => {
      const category = result.item.category || 'Commands'
      const existing = groups.get(category) || []
      groups.set(category, [...existing, result])
    })

    return groups
  }, [displayItems])

  // Flat list for keyboard navigation
  const flatItems = React.useMemo(
    () => displayItems.map((r) => r.item),
    [displayItems]
  )

  // Setup portal
  React.useEffect(() => {
    setPortalContainer(document.body)
  }, [])

  // Scroll lock
  React.useEffect(() => {
    if (open) {
      const unlock = lock()
      return unlock
    }
    return undefined
  }, [open, lock])

  // Focus management
  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (open) {
      saveFocus()
      // Focus input with small delay for animation
      timeoutId = setTimeout(() => inputRef.current?.focus(), 50)
      setSearch('')
      setSelectedIndex(0)
      setCommandStack([])
    } else {
      restoreFocus()
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [open, saveFocus, restoreFocus])

  // Reset selection when results change
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [displayItems])

  // Scroll selected item into view
  React.useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]')
      selected?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])

  // Handle command selection
  const handleSelect = React.useCallback(
    (command: CommandAction) => {
      if (command.disabled) return

      // If command has children, navigate into it
      if (command.children && command.children.length > 0) {
        setCommandStack((prev) => [...prev, command])
        setSearch('')
        setSelectedIndex(0)
        return
      }

      // Execute command
      addRecent(command.id)
      command.onSelect()
      onClose()
    },
    [addRecent, onClose]
  )

  // Handle back navigation
  const handleBack = React.useCallback(() => {
    if (commandStack.length > 0) {
      setCommandStack((prev) => prev.slice(0, -1))
      setSearch('')
      setSelectedIndex(0)
    }
  }, [commandStack.length])

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          if (search) {
            setSearch('')
          } else if (commandStack.length > 0) {
            handleBack()
          } else {
            onClose()
          }
          break

        case 'ArrowDown':
        case 'j':
          if (e.key === 'j' && !e.ctrlKey) break
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < flatItems.length - 1 ? prev + 1 : 0
          )
          break

        case 'ArrowUp':
        case 'k':
          if (e.key === 'k' && !e.ctrlKey) break
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : flatItems.length - 1
          )
          break

        case 'Home':
          e.preventDefault()
          setSelectedIndex(0)
          break

        case 'End':
          e.preventDefault()
          setSelectedIndex(flatItems.length - 1)
          break

        case 'Enter':
          e.preventDefault()
          if (flatItems[selectedIndex]) {
            handleSelect(flatItems[selectedIndex])
          }
          break

        case 'Backspace':
          if (search === '' && commandStack.length > 0) {
            e.preventDefault()
            handleBack()
          }
          break

        case 'Tab':
          // Prevent default tab behavior inside command palette
          e.preventDefault()
          if (e.shiftKey) {
            setSelectedIndex((prev) =>
              prev > 0 ? prev - 1 : flatItems.length - 1
            )
          } else {
            setSelectedIndex((prev) =>
              prev < flatItems.length - 1 ? prev + 1 : 0
            )
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    open,
    search,
    flatItems,
    selectedIndex,
    commandStack.length,
    handleSelect,
    handleBack,
    onClose,
  ])

  // Render shortcut display
  const renderShortcut = (shortcut: string | string[] | undefined) => {
    if (!shortcut) return null

    const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut]

    return (
      <div className="flex items-center gap-1 flex-shrink-0">
        {shortcuts.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <span className="text-muted-foreground/70 text-xs">or</span>
            )}
            <Kbd shortcut={formatShortcutDisplay(s)} size="sm" />
          </React.Fragment>
        ))}
      </div>
    )
  }

  if (!portalContainer) return null

  const content = (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              {...(prefersReducedMotion
                ? ANIMATION_PRESETS.fadeIn
                : ANIMATION_PRESETS.fadeIn)}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Palette */}
            <motion.div
              ref={focusTrapRef}
              {...(prefersReducedMotion
                ? ANIMATION_PRESETS.fadeIn
                : ANIMATION_PRESETS.scale)}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.2,
                ease: EASING_FRAMER.sharp,
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className={cn(
                'fixed top-[15%] left-1/2 -translate-x-1/2 z-50',
                'w-full max-w-2xl mx-4',
                'bg-card border border-border/60 rounded-xl',
                'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]',
                'flex flex-col max-h-[70vh] overflow-hidden',
                className
              )}
            >
              {/* Breadcrumb for nested commands */}
              {commandStack.length > 0 && (
                <motion.div
                  {...(prefersReducedMotion
                    ? ANIMATION_PRESETS.fadeIn
                    : ANIMATION_PRESETS.collapse)}
                  className="px-4 py-2 border-b border-border/40 bg-muted/30"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => setCommandStack([])}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Commands
                    </button>
                    {commandStack.map((cmd, i) => (
                      <React.Fragment key={cmd.id}>
                        <span className="text-muted-foreground/70">/</span>
                        <button
                          onClick={() =>
                            setCommandStack((prev) => prev.slice(0, i + 1))
                          }
                          className={cn(
                            i === commandStack.length - 1
                              ? 'text-foreground font-medium'
                              : 'text-muted-foreground hover:text-foreground transition-colors'
                          )}
                        >
                          {cmd.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Search input */}
              <div className="relative p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  {commandStack.length > 0 && (
                    <button
                      onClick={handleBack}
                      className="p-1 hover:bg-accent rounded transition-colors"
                      aria-label="Go back"
                    >
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}
                  <svg
                    className="h-5 w-5 text-muted-foreground shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                      'flex-1 px-0 py-2 text-base bg-transparent',
                      'border-none outline-none placeholder:text-muted-foreground/60',
                      'focus:ring-0'
                    )}
                    aria-label="Search commands"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls="command-list"
                    aria-activedescendant={
                      flatItems[selectedIndex]
                        ? `command-option-${flatItems[selectedIndex].id}`
                        : undefined
                    }
                  />
                  {search && (
                    <motion.button
                      {...(prefersReducedMotion
                        ? ANIMATION_PRESETS.fadeIn
                        : ANIMATION_PRESETS.pop)}
                      onClick={() => setSearch('')}
                      className="p-1.5 hover:bg-accent rounded-full transition-colors"
                      aria-label="Clear search"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                id="command-list"
                role="listbox"
                className="flex-1 overflow-y-auto p-2"
              >
                {flatItems.length === 0 ? (
                  <motion.div
                    {...(prefersReducedMotion
                      ? ANIMATION_PRESETS.fadeIn
                      : ANIMATION_PRESETS.slideUp)}
                    className="py-12 text-center"
                  >
                    {emptyState || (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <p className="text-sm text-muted-foreground">
                          No commands found
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          Try a different search term
                        </p>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {Array.from(groupedItems.entries()).map(
                      ([category, items], groupIndex) => (
                        <motion.div
                          key={category}
                          {...(prefersReducedMotion
                            ? ANIMATION_PRESETS.fadeIn
                            : ANIMATION_PRESETS.slideUp)}
                          transition={{
                            delay: prefersReducedMotion ? 0 : groupIndex * 0.05,
                          }}
                        >
                          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {category}
                          </div>
                          <div className="space-y-0.5">
                            {items.map((result) => {
                              const globalIndex = displayItems.indexOf(result)
                              const isSelected = globalIndex === selectedIndex

                              return (
                                <motion.button
                                  key={result.item.id}
                                  id={`command-option-${result.item.id}`}
                                  data-selected={isSelected}
                                  onClick={() => handleSelect(result.item)}
                                  onMouseEnter={() =>
                                    setSelectedIndex(globalIndex)
                                  }
                                  role="option"
                                  aria-selected={isSelected}
                                  disabled={result.item.disabled}
                                  className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                                    'transition-all duration-100 text-left group',
                                    isSelected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'hover:bg-accent',
                                    result.item.disabled &&
                                      'opacity-50 cursor-not-allowed'
                                  )}
                                  whileHover={
                                    prefersReducedMotion ? {} : { x: 2 }
                                  }
                                  whileTap={
                                    prefersReducedMotion ? {} : { scale: 0.98 }
                                  }
                                >
                                  {/* Icon */}
                                  {result.item.icon && (
                                    <span
                                      className={cn(
                                        'flex-shrink-0',
                                        isSelected
                                          ? 'text-primary-foreground'
                                          : 'text-muted-foreground'
                                      )}
                                    >
                                      {result.item.icon}
                                    </span>
                                  )}

                                  {/* Label & Description */}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                      <HighlightedText
                                        text={result.item.label}
                                        matches={result.matches}
                                      />
                                    </div>
                                    {result.item.description && (
                                      <div
                                        className={cn(
                                          'text-sm truncate',
                                          isSelected
                                            ? 'text-primary-foreground/70'
                                            : 'text-muted-foreground'
                                        )}
                                      >
                                        {result.item.description}
                                      </div>
                                    )}
                                  </div>

                                  {/* Has children indicator */}
                                  {result.item.children &&
                                    result.item.children.length > 0 && (
                                      <svg
                                        className={cn(
                                          'w-4 h-4 flex-shrink-0',
                                          isSelected
                                            ? 'text-primary-foreground/70'
                                            : 'text-muted-foreground'
                                        )}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 5l7 7-7 7"
                                        />
                                      </svg>
                                    )}

                                  {/* Shortcut */}
                                  {result.item.shortcut && (
                                    <div
                                      className={cn(
                                        isSelected &&
                                          '[&_kbd]:bg-primary-foreground/20 [&_kbd]:border-primary-foreground/30 [&_kbd]:text-primary-foreground'
                                      )}
                                    >
                                      {renderShortcut(result.item.shortcut)}
                                    </div>
                                  )}
                                </motion.button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <motion.div
                {...ANIMATION_PRESETS.fadeIn}
                transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
                className="px-4 py-3 border-t border-border/40 bg-muted/30 text-xs text-muted-foreground"
              >
                {footer || (
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5">
                        <Kbd shortcut="↑" size="sm" />
                        <Kbd shortcut="↓" size="sm" />
                        <span className="hidden sm:inline">navigate</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Kbd shortcut="↵" size="sm" />
                        <span className="hidden sm:inline">select</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Kbd shortcut="Esc" size="sm" />
                        <span className="hidden sm:inline">close</span>
                      </span>
                      {commandStack.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Kbd shortcut="⌫" size="sm" />
                          <span className="hidden sm:inline">back</span>
                        </span>
                      )}
                    </div>
                    <div className="font-medium">
                      {flatItems.length} command
                      {flatItems.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  )

  return createPortal(content, portalContainer)
}

CommandPaletteEnhanced.displayName = 'CommandPaletteEnhanced'

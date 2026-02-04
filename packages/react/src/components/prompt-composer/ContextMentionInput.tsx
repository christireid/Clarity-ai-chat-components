/**
 * ContextMentionInput
 *
 * Adapter component that integrates MentionSystem with PromptComposer
 * for @file, @doc, @user context mentions with progressive token budgeting.
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type {
  ContextItem,
  ContextProvider,
  ContextType,
} from '../../hooks/prompt-composer/types'

/**
 * Convert ContextItem to a mentionable format
 */
interface MentionableContext {
  id: string
  label: string
  type: ContextType
  description?: string
  icon?: React.ReactNode
  tokens: {
    summary: number
    preview: number
    full: number
  }
}

export interface ContextMentionInputProps {
  /** Current input value */
  value: string
  /** Callback when value changes */
  onChange: (value: string, contextItems: ContextItem[]) => void
  /** Context providers for @mentions */
  providers: ContextProvider[]
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Max token budget */
  tokenBudget?: number
  /** Current token usage */
  currentTokens?: number
  /** On submit */
  onSubmit?: () => void
  /** On focus */
  onFocus?: () => void
  /** On blur */
  onBlur?: () => void
  className?: string
}

/**
 * Fuzzy search (adapted from MentionSystem)
 */
function fuzzySearch(query: string, text: string): boolean {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  let queryIndex = 0
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++
    }
  }

  return queryIndex === queryLower.length
}

/**
 * ContextMentionInput Component
 *
 * Integrates MentionSystem's autocomplete with PromptComposer's context providers.
 * Supports @file, @doc, @user mentions with fuzzy search and keyboard navigation.
 *
 * @example
 * ```tsx
 * <ContextMentionInput
 *   value={message}
 *   onChange={(value, items) => {
 *     setMessage(value)
 *     setContextItems(items)
 *   }}
 *   providers={[fileProvider, docProvider, userProvider]}
 *   tokenBudget={8000}
 *   currentTokens={totalTokens}
 * />
 * ```
 */
export function ContextMentionInput({
  value,
  onChange,
  providers,
  placeholder = 'Type @ to mention context...',
  disabled = false,
  tokenBudget = 8000,
  currentTokens = 0,
  onSubmit,
  onFocus,
  onBlur,
  className,
}: ContextMentionInputProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<MentionableContext[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [mentionStartPos, setMentionStartPos] = React.useState(-1)
  const [cursorPosition, setCursorPosition] = React.useState(0)
  const [activeProvider, setActiveProvider] = React.useState<ContextProvider | null>(null)
  const [isSearching, setIsSearching] = React.useState(false)

  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const suggestionsRef = React.useRef<HTMLDivElement>(null)

  /**
   * Extract @mentions from text and convert to ContextItems
   */
  const extractContextItems = React.useCallback(
    async (text: string): Promise<ContextItem[]> => {
      const items: ContextItem[] = []
      const mentionRegex = /@(\w+):(\S+)/g // Matches @file:Button.tsx, @doc:api-ref, etc.
      let match

      while ((match = mentionRegex.exec(text)) !== null) {
        const [fullMatch, providerType, itemLabel] = match
        const provider = providers.find((p) => p.type === providerType)

        if (provider) {
          // Search provider for this item
          try {
            const results = await provider.search(itemLabel)
            const found = results.find(
              (r) => r.label.toLowerCase() === itemLabel.toLowerCase()
            )
            if (found) {
              items.push(found)
            }
          } catch (err) {
            console.error(`Failed to search provider ${providerType}:`, err)
          }
        }
      }

      return items
    },
    [providers]
  )

  /**
   * Handle input change with @mention detection
   */
  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPos = e.target.selectionStart || 0

    setCursorPosition(cursorPos)

    // Check for @mention trigger
    const textBeforeCursor = newValue.slice(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)

      // Check if we have a provider type (e.g., @file:)
      const colonIndex = textAfterAt.indexOf(':')

      if (colonIndex === -1) {
        // Show provider selection (file, doc, user)
        if (!/\s/.test(textAfterAt)) {
          const query = textAfterAt.toLowerCase()
          const filtered = providers.filter(
            (p) =>
              p.enabled !== false &&
              (fuzzySearch(query, p.type) || query === '')
          )

          // Convert providers to mentionable format
          const providerSuggestions: MentionableContext[] = filtered.map(
            (p) => ({
              id: p.type,
              label: p.type,
              type: p.type,
              description: `Search ${p.type} context`,
              icon: p.icon,
              tokens: { summary: 0, preview: 0, full: 0 },
            })
          )

          setSuggestions(providerSuggestions)
          setShowSuggestions(providerSuggestions.length > 0)
          setMentionStartPos(lastAtIndex)
          setActiveProvider(null)
        } else {
          setShowSuggestions(false)
        }
      } else {
        // We have provider type, now search for items
        const providerType = textAfterAt.slice(0, colonIndex)
        const searchQuery = textAfterAt.slice(colonIndex + 1)

        if (!/\s/.test(searchQuery)) {
          const provider = providers.find((p) => p.type === providerType)

          if (provider && provider.enabled !== false) {
            setActiveProvider(provider)
            setMentionStartPos(lastAtIndex)

            // Search provider
            setIsSearching(true)
            try {
              const results = await provider.search(searchQuery)
              const maxResults = provider.maxResults || 10

              // Convert to mentionable format
              const contextSuggestions: MentionableContext[] = results
                .slice(0, maxResults)
                .map((item) => ({
                  id: item.id,
                  label: item.label,
                  type: item.type,
                  description: item.description,
                  icon: item.icon,
                  tokens: item.tokens,
                }))

              setSuggestions(contextSuggestions)
              setShowSuggestions(contextSuggestions.length > 0)
              setSelectedIndex(0)
            } catch (err) {
              console.error('Provider search failed:', err)
              setShowSuggestions(false)
            } finally {
              setIsSearching(false)
            }
          } else {
            setShowSuggestions(false)
          }
        } else {
          setShowSuggestions(false)
        }
      }
    } else {
      setShowSuggestions(false)
    }

    // Extract context items from value
    const contextItems = await extractContextItems(newValue)
    onChange(newValue, contextItems)
  }

  /**
   * Insert mention at cursor
   */
  const insertMention = React.useCallback(
    (item: MentionableContext, isProvider: boolean) => {
      if (mentionStartPos === -1) return

      const before = value.slice(0, mentionStartPos)
      const after = value.slice(cursorPosition)

      let mention: string
      if (isProvider) {
        // Insert provider type with colon
        mention = `@${item.label}:`
      } else if (activeProvider) {
        // Insert full mention with provider type
        mention = `@${activeProvider.type}:${item.label} `
      } else {
        mention = `@${item.label} `
      }

      const newValue = before + mention + after

      // Update value
      extractContextItems(newValue).then((contextItems) => {
        onChange(newValue, contextItems)
      })

      setShowSuggestions(false)
      setMentionStartPos(-1)

      // Focus and set cursor
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = mentionStartPos + mention.length
          inputRef.current.focus()
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    },
    [value, mentionStartPos, cursorPosition, activeProvider, onChange, extractContextItems]
  )

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSubmit?.()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
      case 'Tab':
        e.preventDefault()
        if (suggestions[selectedIndex]) {
          const isProvider = !activeProvider
          insertMention(suggestions[selectedIndex], isProvider)
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowSuggestions(false)
        break
    }
  }

  // Scroll selected suggestion into view
  React.useEffect(() => {
    if (suggestionsRef.current && selectedIndex >= 0) {
      const selected = suggestionsRef.current.children[
        selectedIndex
      ] as HTMLElement
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  // Check if adding suggestion would exceed budget
  const wouldExceedBudget = React.useCallback(
    (item: MentionableContext) => {
      if (!tokenBudget) return false
      return currentTokens + item.tokens.summary > tokenBudget
    },
    [currentTokens, tokenBudget]
  )

  return (
    <div className={cn('relative', className)}>
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full p-3 bg-transparent resize-none',
          'text-gray-900 dark:text-gray-100',
          'placeholder:text-gray-400 dark:placeholder:text-gray-600',
          'focus:outline-none',
          'min-h-[52px]'
        )}
        rows={1}
      />

      {/* Mention suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute bottom-full mb-2 left-0 right-0 max-h-64 overflow-y-auto scrollbar-hide bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
        >
          {isSearching ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          ) : suggestions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No matches found
            </div>
          ) : (
            suggestions.map((item, index) => {
              const exceedsBudget = wouldExceedBudget(item)
              const isProvider = !activeProvider

              return (
                <button
                  key={item.id}
                  onClick={() => insertMention(item, isProvider)}
                  disabled={exceedsBudget}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-left',
                    index === selectedIndex && 'bg-accent',
                    exceedsBudget && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {/* Icon */}
                  {item.icon && (
                    <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                      {item.icon}
                    </div>
                  )}

                  {/* Context info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </div>
                    )}
                  </div>

                  {/* Token cost */}
                  {!isProvider && item.tokens.summary > 0 && (
                    <div className="shrink-0 text-xs text-gray-500 dark:text-gray-500 font-mono">
                      {item.tokens.summary}t
                    </div>
                  )}

                  {/* Keyboard hint */}
                  {index === selectedIndex && (
                    <div className="shrink-0 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                      ↵
                    </div>
                  )}

                  {/* Budget warning */}
                  {exceedsBudget && (
                    <div className="shrink-0 text-xs text-red-500">
                      Budget exceeded
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

ContextMentionInput.displayName = 'ContextMentionInput'

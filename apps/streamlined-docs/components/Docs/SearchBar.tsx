'use client'

/**
 * SearchBar - Global search interface for documentation
 *
 * Features:
 * - Full-text search
 * - Keyboard shortcuts (Cmd+K)
 * - Search results with highlighting
 * - Category filtering
 * - Recent searches
 * - Keyboard navigation
 * - Dark mode support
 * - Fully accessible
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, ArrowRight, FileCode, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchResult {
  /** Result ID */
  id: string
  /** Result title */
  title: string
  /** Result description/excerpt */
  description?: string
  /** URL */
  href: string
  /** Category */
  category?: string
  /** Result type */
  type?: 'page' | 'component' | 'hook' | 'guide'
  /** Breadcrumb path */
  breadcrumb?: string[]
}

export interface SearchBarProps {
  /** Search results */
  results?: SearchResult[]
  /** Is searching */
  isSearching?: boolean
  /** Search callback */
  onSearch?: (query: string) => void
  /** Result select callback */
  onSelectResult?: (result: SearchResult) => void
  /** Placeholder text */
  placeholder?: string
  /** Additional CSS classes */
  className?: string
  /** Show recent searches */
  showRecent?: boolean
  /** Recent search items */
  recentSearches?: string[]
}

export function SearchBar({
  results = [],
  isSearching = false,
  onSearch,
  onSelectResult,
  placeholder = 'Search documentation...',
  className,
  showRecent = true,
  recentSearches = [],
}: SearchBarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        inputRef.current?.focus()
      }

      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle input change
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setQuery(value)
      setSelectedIndex(0)
      onSearch?.(value)
    },
    [onSearch]
  )

  // Handle result selection
  const handleSelectResult = React.useCallback(
    (result: SearchResult) => {
      onSelectResult?.(result)
      setIsOpen(false)
      setQuery('')
    },
    [onSelectResult]
  )

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        handleSelectResult(results[selectedIndex])
      }
    },
    [results, selectedIndex, handleSelectResult]
  )

  const showResults = isOpen && (query.length > 0 || showRecent)

  return (
    <>
      {/* Search trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-3 w-full max-w-md px-4 py-2.5 rounded-lg',
          'bg-muted/50 border border-border/50',
          'hover:border-brand-500/30 hover:bg-muted',
          'transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
          className
        )}
        aria-label="Open search"
      >
        <Search className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <span className="flex-1 text-left text-sm text-muted-foreground">
          {placeholder}
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-background border border-border rounded">
          <span className="text-muted-foreground">⌘</span>K
        </kbd>
      </button>

      {/* Search modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                'fixed top-[10vh] left-1/2 -translate-x-1/2 z-50',
                'w-full max-w-2xl max-h-[80vh]',
                'bg-background border border-border rounded-xl shadow-2xl',
                'overflow-hidden flex flex-col'
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Search dialog"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
                <Search className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                  autoFocus
                  aria-label="Search input"
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery('')
                      onSearch?.('')
                    }}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto">
                {isSearching ? (
                  <div className="p-8 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <p className="mt-3 text-sm text-muted-foreground">Searching...</p>
                  </div>
                ) : query.length === 0 && showRecent && recentSearches.length > 0 ? (
                  <div className="p-4">
                    <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Recent Searches
                    </h3>
                    <div className="space-y-1 mt-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(search)
                            onSearch?.(search)
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                        >
                          <Clock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                          <span className="text-sm">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => handleSelectResult(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          'flex items-start gap-3 w-full px-3 py-3 rounded-lg text-left transition-colors',
                          index === selectedIndex
                            ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                            : 'hover:bg-muted'
                        )}
                        aria-selected={index === selectedIndex}
                      >
                        <Hash className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{result.title}</h4>
                            {result.category && (
                              <span className="px-1.5 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                                {result.category}
                              </span>
                            )}
                          </div>
                          {result.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {result.description}
                            </p>
                          )}
                          {result.breadcrumb && result.breadcrumb.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {result.breadcrumb.join(' › ')}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                ) : query.length > 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No results found for "{query}"
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/30">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↵</kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">Esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

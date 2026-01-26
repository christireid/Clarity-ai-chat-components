'use client'

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useDeferredValue,
} from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Code2, FileText, BookOpen, X, Loader2 } from 'lucide-react'
import {
  hookMetadata,
  categoryConfig,
  type HookCategory,
} from '@/lib/hook-metadata'
import { fuzzySearch, highlightMatches } from '@/lib/fuzzy-search'
import { trackSearchQuery, trackSearchClick } from '@/lib/search-analytics'
import { cn } from '@/lib/utils'

interface SearchResult {
  type: 'hook' | 'guide' | 'page'
  title: string
  description: string
  href: string
  category?: HookCategory
}

// Build search index from hook metadata
function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = []

  // Add hooks
  hookMetadata.forEach((hook) => {
    results.push({
      type: 'hook',
      title: hook.name,
      description: hook.description,
      href: hook.href,
      category: hook.category,
    })
  })

  // Add static pages
  const staticPages: SearchResult[] = [
    {
      type: 'page',
      title: 'Hook Selector',
      description: 'Find the right hook for your use case',
      href: '/reference/hooks/selector',
    },
    {
      type: 'page',
      title: 'Compare Hooks',
      description: 'Compare hooks side by side',
      href: '/reference/hooks/compare',
    },
    {
      type: 'page',
      title: 'Hook Relationship Graph',
      description: 'Visualize how hooks relate to each other',
      href: '/reference/hooks/graph',
    },
    {
      type: 'guide',
      title: 'Getting Started',
      description: 'Quick start guide for Clarity Chat',
      href: '/guides/getting-started',
    },
    {
      type: 'guide',
      title: 'Architecture Overview',
      description: 'Understanding the Clarity Chat architecture',
      href: '/guides/architecture',
    },
    {
      type: 'page',
      title: 'API Reference',
      description: 'Complete API documentation',
      href: '/reference',
    },
  ]

  return [...results, ...staticPages]
}

// Get icon by type
function getTypeIcon(type: string, isSelected: boolean = false) {
  const iconClass = cn('w-4 h-4', isSelected ? 'text-white' : '')

  switch (type) {
    case 'hook':
      return (
        <Code2 className={cn(iconClass, !isSelected && 'text-purple-500')} />
      )
    case 'guide':
      return (
        <BookOpen className={cn(iconClass, !isSelected && 'text-green-500')} />
      )
    case 'page':
    default:
      return (
        <FileText className={cn(iconClass, !isSelected && 'text-blue-500')} />
      )
  }
}

function SearchResultItem({
  result,
  isSelected,
  query,
  onClick,
  onMouseEnter,
}: {
  result: SearchResult & { _score: number }
  isSelected: boolean
  query: string
  onClick: () => void
  onMouseEnter: () => void
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-all rounded-lg',
        isSelected
          ? 'bg-brand-500 text-white shadow-md'
          : 'hover:bg-bg-secondary'
      )}
    >
      <span className="flex-shrink-0">
        {getTypeIcon(result.type, isSelected)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-medium truncate',
              result.type === 'hook' && 'font-mono text-sm'
            )}
            dangerouslySetInnerHTML={{
              __html: query
                ? highlightMatches(query, result.title)
                : result.title,
            }}
          />
          {result.category && (
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded flex-shrink-0',
                isSelected
                  ? 'bg-white/20 text-white/90'
                  : categoryConfig[result.category].colorClass
              )}
            >
              {categoryConfig[result.category].label}
            </span>
          )}
        </div>
        <p
          className={cn(
            'text-sm truncate',
            isSelected ? 'text-white/70' : 'text-text-secondary'
          )}
          dangerouslySetInnerHTML={{
            __html: query
              ? highlightMatches(query, result.description)
              : result.description,
          }}
        />
      </div>
      {result._score > 0 && query && (
        <span
          className={cn(
            'text-xs font-mono px-1.5 py-0.5 rounded flex-shrink-0',
            isSelected
              ? 'bg-white/20 text-white/80'
              : 'bg-bg-tertiary text-text-tertiary'
          )}
        >
          {Math.round(result._score)}
        </span>
      )}
    </button>
  )
}

export function SearchPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Debounce search query for performance
  const deferredQuery = useDeferredValue(query)
  const isSearching = query !== deferredQuery

  const searchIndex = useMemo(() => buildSearchIndex(), [])

  // Use fuzzySearch from lib/fuzzy-search
  const results = useMemo(() => {
    if (!deferredQuery.trim()) {
      // Show popular items when no query
      return searchIndex.slice(0, 8).map((item) => ({ ...item, _score: 0 }))
    }

    return fuzzySearch(deferredQuery, searchIndex, (item: SearchResult) => [
      { field: 'title', value: item.title, weight: 3 },
      { field: 'description', value: item.description, weight: 1 },
      { field: 'type', value: item.type, weight: 0.5 },
    ]).slice(0, 10)
  }, [deferredQuery, searchIndex])

  // Track search queries (debounced)
  useEffect(() => {
    if (deferredQuery.trim().length >= 2) {
      trackSearchQuery(deferredQuery, results.length)
    }
  }, [deferredQuery, results.length])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.querySelector(
      '[data-selected="true"]'
    )
    selectedElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedIndex])

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }

      // Also open with / when not in an input
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleSelect = useCallback(
    (result: SearchResult & { _score: number }) => {
      trackSearchClick(query, result.href, result.title)
      router.push(result.href)
      setIsOpen(false)
    },
    [router, query]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((i) => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          handleClose()
          break
      }
    },
    [results, selectedIndex, handleSelect, handleClose]
  )

  // Screen reader announcements
  const resultsAnnouncement = useMemo(() => {
    if (isSearching) return 'Searching...'
    if (!deferredQuery.trim()) return 'Showing popular items'
    if (results.length === 0) return 'No results found'
    return `${results.length} result${results.length !== 1 ? 's' : ''} found`
  }, [results.length, deferredQuery, isSearching])

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary',
          'border border-border rounded-lg',
          'hover:border-brand-500 hover:text-text-primary transition-colors'
        )}
        aria-label="Search documentation"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-bg-secondary rounded border border-border">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.15 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Search documentation"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-[10vh] left-1/2 -translate-x-1/2 w-full max-w-xl mx-4 z-50"
              onKeyDown={handleKeyDown}
            >
              <div className="bg-bg-primary border border-border rounded-xl shadow-2xl overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 border-b border-border">
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 text-brand-500 flex-shrink-0 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 text-text-secondary flex-shrink-0" />
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search hooks, guides, and more..."
                    className="flex-1 py-4 bg-transparent outline-none text-text-primary placeholder:text-text-tertiary"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    aria-label="Search"
                    aria-autocomplete="list"
                    aria-controls="search-results"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="p-1 rounded hover:bg-bg-secondary transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4 text-text-secondary" />
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="Close search"
                  >
                    <kbd className="px-1.5 py-0.5 text-xs bg-bg-secondary rounded border border-border">
                      Esc
                    </kbd>
                  </button>
                </div>

                {/* Screen reader announcements */}
                <div
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className="sr-only"
                >
                  {resultsAnnouncement}
                </div>

                {/* Results */}
                <div
                  ref={listRef}
                  id="search-results"
                  role="listbox"
                  aria-label="Search results"
                  className="max-h-[60vh] overflow-y-auto p-2"
                >
                  {results.length > 0 ? (
                    <div className="space-y-0.5">
                      {!deferredQuery && (
                        <p className="px-3 py-1.5 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                          Quick Access
                        </p>
                      )}
                      {results.map((result, index) => (
                        <SearchResultItem
                          key={`${result.type}-${result.href}`}
                          result={result}
                          isSelected={index === selectedIndex}
                          query={deferredQuery}
                          onClick={() => handleSelect(result)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Search className="w-12 h-12 mx-auto text-text-tertiary mb-3 opacity-40" />
                      <p className="text-text-secondary text-sm font-medium mb-1">
                        No results found
                      </p>
                      <p className="text-text-tertiary text-xs">
                        Try different keywords
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-border bg-bg-secondary/50 flex items-center justify-between text-xs text-text-tertiary">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-bg-primary border border-border rounded text-xs">
                        ↑↓
                      </kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-bg-primary border border-border rounded text-xs">
                        ↵
                      </kbd>
                      Select
                    </span>
                  </div>
                  <span className="font-medium">
                    {isSearching ? (
                      'Searching...'
                    ) : (
                      <>
                        {results.length} result
                        {results.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export function SearchPaletteProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <SearchPalette />
    </>
  )
}

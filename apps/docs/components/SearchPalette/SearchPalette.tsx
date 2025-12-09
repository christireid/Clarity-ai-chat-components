'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { hookMetadata, categoryConfig, type HookCategory } from '@/lib/hook-metadata'

interface SearchResult {
  type: 'hook' | 'guide' | 'page'
  name: string
  description: string
  href: string
  category?: HookCategory
  keywords?: string[]
}

// Build search index from hook metadata
function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = []

  // Add hooks
  hookMetadata.forEach((hook) => {
    results.push({
      type: 'hook',
      name: hook.name,
      description: hook.description,
      href: hook.href,
      category: hook.category,
      keywords: [
        hook.name.toLowerCase(),
        hook.category,
        ...hook.description.toLowerCase().split(' '),
        ...(hook.useCases || []).map((uc) => uc.toLowerCase()),
      ],
    })
  })

  // Add static pages
  const staticPages: Omit<SearchResult, 'keywords'>[] = [
    {
      type: 'page',
      name: 'Hook Selector',
      description: 'Find the right hook for your use case',
      href: '/reference/hooks/selector',
    },
    {
      type: 'page',
      name: 'Compare Hooks',
      description: 'Compare hooks side by side',
      href: '/reference/hooks/compare',
    },
    {
      type: 'page',
      name: 'Hook Relationship Graph',
      description: 'Visualize how hooks relate to each other',
      href: '/reference/hooks/graph',
    },
    {
      type: 'guide',
      name: 'Getting Started',
      description: 'Quick start guide for Clarity Chat',
      href: '/guides/getting-started',
    },
    {
      type: 'guide',
      name: 'Architecture Overview',
      description: 'Understanding the Clarity Chat architecture',
      href: '/guides/architecture',
    },
    {
      type: 'page',
      name: 'API Reference',
      description: 'Complete API documentation',
      href: '/reference',
    },
  ]

  staticPages.forEach((page) => {
    results.push({
      ...page,
      keywords: [
        page.name.toLowerCase(),
        ...page.description.toLowerCase().split(' '),
      ],
    })
  })

  return results
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) return text

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-brand-200 dark:bg-brand-800 text-inherit rounded px-0.5">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  )
}

function SearchResultItem({
  result,
  isSelected,
  query,
  onClick,
  onMouseEnter,
}: {
  result: SearchResult
  isSelected: boolean
  query: string
  onClick: () => void
  onMouseEnter: () => void
}) {
  const iconByType = {
    hook: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    guide: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    page: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`
        w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
        ${isSelected ? 'bg-brand-100 dark:bg-brand-900/50' : 'hover:bg-muted/50'}
      `}
    >
      <span className={`flex-shrink-0 ${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-muted-foreground'}`}>
        {iconByType[result.type]}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium truncate ${result.type === 'hook' ? 'font-mono text-sm' : ''}`}>
            {highlightMatch(result.name, query)}
          </span>
          {result.category && (
            <span
              className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
              style={{
                backgroundColor: `${categoryConfig[result.category].colorClass.includes('text-') ? '' : categoryConfig[result.category].colorClass}`,
              }}
            >
              {categoryConfig[result.category].label}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {highlightMatch(result.description, query)}
        </p>
      </div>
      {isSelected && (
        <span className="flex-shrink-0 text-xs text-muted-foreground">
          Enter
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
  const router = useRouter()

  const searchIndex = useMemo(() => buildSearchIndex(), [])

  const results = useMemo(() => {
    if (!query.trim()) {
      // Show recent/popular items when no query
      return searchIndex.slice(0, 8)
    }

    const lowerQuery = query.toLowerCase()
    return searchIndex
      .filter((item) => {
        // Match against name
        if (item.name.toLowerCase().includes(lowerQuery)) return true
        // Match against description
        if (item.description.toLowerCase().includes(lowerQuery)) return true
        // Match against keywords
        if (item.keywords?.some((kw) => kw.includes(lowerQuery))) return true
        return false
      })
      .sort((a, b) => {
        // Prioritize name matches
        const aNameMatch = a.name.toLowerCase().includes(lowerQuery)
        const bNameMatch = b.name.toLowerCase().includes(lowerQuery)
        if (aNameMatch && !bNameMatch) return -1
        if (!aNameMatch && bNameMatch) return 1

        // Then sort alphabetically
        return a.name.localeCompare(b.name)
      })
      .slice(0, 10)
  }, [query, searchIndex])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }

      // Also open with / when not in an input
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
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
      inputRef.current?.focus()
    } else {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleSelect = useCallback(
    (result: SearchResult) => {
      router.push(result.href)
      setIsOpen(false)
    },
    [router]
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

  // Don't render on server
  if (typeof window === 'undefined') return null

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border rounded-lg hover:border-brand-500 hover:text-foreground transition-colors"
        aria-label="Search documentation"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-muted rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Modal */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Dialog */}
            <div className="fixed inset-x-4 top-[10vh] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl">
              <div className="bg-background border rounded-xl shadow-2xl overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 border-b">
                  <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search hooks, guides, and more..."
                    className="flex-1 py-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <button
                    onClick={handleClose}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close search"
                  >
                    <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Esc</kbd>
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="py-2">
                      {!query && (
                        <p className="px-4 py-2 text-xs font-semibold uppercase text-muted-foreground">
                          Quick Access
                        </p>
                      )}
                      {results.map((result, index) => (
                        <SearchResultItem
                          key={`${result.type}-${result.href}`}
                          result={result}
                          isSelected={index === selectedIndex}
                          query={query}
                          onClick={() => handleSelect(result)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                      <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-medium mb-1">No results found</p>
                      <p className="text-sm">Try searching for a hook name or keyword</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t bg-muted/50 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-background rounded border">↑</kbd>
                      <kbd className="px-1 py-0.5 bg-background rounded border">↓</kbd>
                      <span>Navigate</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-background rounded border">↵</kbd>
                      <span>Select</span>
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-background rounded border">Esc</kbd>
                    <span>Close</span>
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export function SearchPaletteProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SearchPalette />
    </>
  )
}

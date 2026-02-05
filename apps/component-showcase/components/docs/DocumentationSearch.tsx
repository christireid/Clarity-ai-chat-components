'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, X, FileText, Tag } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import { componentDocsDatabase } from '@/lib/component-docs-data'
import { buildSearchIndex, searchDocs } from '@/lib/docs-parser'

interface DocumentationSearchProps {
  onSelectComponent?: (componentName: string) => void
  className?: string
}

export function DocumentationSearch({
  onSelectComponent,
  className,
}: DocumentationSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Build search index
  const searchIndex = useMemo(
    () => buildSearchIndex(componentDocsDatabase),
    []
  )

  // Perform search
  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchDocs(searchIndex, query).slice(0, 10)
  }, [query, searchIndex])

  // Handle selection
  const handleSelect = (componentName: string) => {
    setQuery('')
    setIsOpen(false)
    onSelectComponent?.(componentName)
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search components... (⌘K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="glass-input w-full pl-10 pr-20"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="p-1 hover:bg-background/50 rounded"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card max-h-96 overflow-y-auto z-50 shadow-xl">
          <div className="p-2">
            <div className="text-xs text-muted-foreground px-3 py-2">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
            <div className="space-y-1">
              {results.map((result) => {
                const doc = componentDocsDatabase.find(
                  (d) => d.name === result.componentName
                )
                if (!doc) return null

                return (
                  <button
                    key={result.componentName}
                    onClick={() => handleSelect(result.componentName)}
                    className="w-full text-left p-3 rounded-lg hover:bg-background/50 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium group-hover:text-primary transition-colors">
                            {result.componentName}
                          </span>
                        </div>
                        {doc.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                      </div>
                      {result.category && (
                        <div className="badge-glass text-xs shrink-0">
                          {result.category}
                        </div>
                      )}
                    </div>
                    {result.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        {result.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card p-6 text-center z-50 shadow-xl">
          <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">
            No components found for "{query}"
          </p>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useRef, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, Hash, FileText, Book, Wrench, Code2, Sparkles } from 'lucide-react'
import Fuse from 'fuse.js'
import clsx from 'clsx'
import { searchData, type SearchItem } from '@/lib/search-data'

interface SearchDialogProps {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(searchData)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const fuse = useRef(
    new Fuse(searchData, {
      keys: ['title', 'description', 'type'],
      threshold: 0.3,
      includeScore: true,
    })
  )

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  useEffect(() => {
    if (query.trim()) {
      const searchResults = fuse.current.search(query)
      setResults(searchResults.map((result) => result.item))
    } else {
      setResults(searchData)
    }
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].href)
          onClose()
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'component':
        return <Hash className="w-4 h-4 text-brand-500" />
      case 'hook':
        return <Wrench className="w-4 h-4 text-purple-500" />
      case 'guide':
        return <FileText className="w-4 h-4 text-green-500" />
      case 'example':
        return <Code2 className="w-4 h-4 text-orange-500" />
      case 'cookbook':
        return <Book className="w-4 h-4 text-amber-500" />
      case 'concept':
        return <Sparkles className="w-4 h-4 text-blue-500" />
      case 'deployment':
        return <FileText className="w-4 h-4 text-indigo-500" />
      case 'integration':
        return <FileText className="w-4 h-4 text-teal-500" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      component: 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300',
      hook: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      guide: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      example: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      cookbook: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
      concept: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      deployment: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
      integration: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Dialog */}
      <div
        className="relative w-full max-w-2xl bg-bg-primary border border-border rounded-xl shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <Search className="w-5 h-5 text-text-tertiary flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documentation..."
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-tertiary"
            aria-label="Search input"
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-bg-secondary px-1.5 font-mono text-xs text-text-tertiary">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          id="search-results"
          className="max-h-96 overflow-y-auto py-2"
          role="listbox"
        >
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-text-secondary">
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            results.map((result, index) => (
              <button
                key={result.href}
                onClick={() => {
                  router.push(result.href)
                  onClose()
                }}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                  index === selectedIndex
                    ? 'bg-bg-secondary'
                    : 'hover:bg-bg-secondary'
                )}
                role="option"
                aria-selected={index === selectedIndex}
              >
                {getTypeIcon(result.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-text-primary truncate">
                      {result.title}
                    </span>
                    <span
                      className={clsx(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        getTypeBadge(result.type)
                      )}
                    >
                      {result.type}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary truncate">
                    {result.description}
                  </p>
                </div>
                {index === selectedIndex && (
                  <ArrowRight className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-text-tertiary">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-bg-secondary font-mono">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-bg-secondary font-mono">
                ↵
              </kbd>
              Select
            </span>
          </div>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, Hash, FileText } from 'lucide-react'
import Fuse from 'fuse.js'
import clsx from 'clsx'

// This will be populated from your content structure
// For now, using a sample dataset
const searchData = [
  // Components
  { title: 'ChatWindow', type: 'component', href: '/reference/components/chat-window', description: 'Main chat interface container' },
  { title: 'Message', type: 'component', href: '/reference/components/message', description: 'Display individual messages' },
  { title: 'CommandPalette', type: 'component', href: '/reference/components/command-palette', description: 'Keyboard-driven command interface' },
  { title: 'Draggable', type: 'component', href: '/reference/components/draggable', description: 'Drag and drop system' },
  
  // Hooks
  { title: 'useChat', type: 'hook', href: '/reference/hooks/use-chat', description: 'Manage chat state and messages' },
  { title: 'useKeyboardShortcuts', type: 'hook', href: '/reference/hooks/use-keyboard-shortcuts', description: 'Register keyboard shortcuts' },
  { title: 'useUndoRedo', type: 'hook', href: '/reference/hooks/use-undo-redo', description: 'History management with undo/redo' },
  
  // Learn
  { title: 'Quick Start', type: 'guide', href: '/learn/quick-start', description: 'Get started in 5 minutes' },
  { title: 'Installation', type: 'guide', href: '/learn/installation', description: 'Install Clarity Chat' },
  { title: 'Tutorial', type: 'guide', href: '/learn/tutorial', description: 'Build your first chat app' },
  
  // Examples
  { title: 'Basic Chat', type: 'example', href: '/examples/basic-chat', description: 'Simple chat interface' },
  { title: 'Themed Chat', type: 'example', href: '/examples/themed-chat', description: 'Chat with custom theme' },
]

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
        return <Hash className="w-4 h-4 text-purple-500" />
      case 'guide':
        return <FileText className="w-4 h-4 text-green-500" />
      case 'example':
        return <FileText className="w-4 h-4 text-orange-500" />
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
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700'
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

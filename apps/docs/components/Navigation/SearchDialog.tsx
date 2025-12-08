'use client'

import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Hash,
  FileText,
  BookOpen,
  Wrench,
  Code2,
  Sparkles,
  Rocket,
  Link2,
  Search,
  X,
} from 'lucide-react'
import { searchData, type SearchItem } from '@/lib/search-data'
import { fuzzySearch } from '@/lib/fuzzy-search'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SearchDialogProps {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  // Fuzzy search with scoring
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      // Show popular items when no query
      const popular = [
        'ChatWindow',
        'useChat',
        'MessageList',
        'ChatInput',
        'useStreaming',
        'StreamingMessage',
      ]
      const popularItems = searchData
        .filter((item) => popular.some((p) => item.title.includes(p)))
        .slice(0, 6)
      const recent = searchData.slice(0, 8 - popularItems.length)
      return [...popularItems, ...recent].map((item) => ({
        ...item,
        _score: 0,
      }))
    }

    return fuzzySearch(query, searchData, (item: SearchItem) => [
      { field: 'title', value: item.title, weight: 3 },
      { field: 'description', value: item.description || '', weight: 1 },
      { field: 'category', value: item.category || '', weight: 0.5 },
      { field: 'type', value: item.type, weight: 0.5 },
    ]).slice(0, 12)
  }, [query])

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, (SearchItem & { _score: number })[]> = {}

    searchResults.forEach((item) => {
      const category = getCategoryName(item.type)
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
    })

    return groups
  }, [searchResults])

  // Flat list for keyboard navigation
  const flatResults = useMemo(() => {
    return Object.values(groupedResults).flat()
  }, [groupedResults])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.querySelector(
      '[data-selected="true"]'
    )
    selectedElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedIndex])

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, flatResults.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (flatResults[selectedIndex]) {
            router.push(flatResults[selectedIndex].href)
            onClose()
            setQuery('')
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          setQuery('')
          break
      }
    },
    [flatResults, selectedIndex, router, onClose]
  )

  // Handle item selection
  const handleSelect = useCallback(
    (href: string) => {
      router.push(href)
      onClose()
      setQuery('')
    },
    [router, onClose]
  )

  let currentIndex = 0

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Search Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4 z-50"
            onKeyDown={handleKeyDown}
          >
            <div className="bg-bg-primary border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-5 h-5 text-text-secondary flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search documentation..."
                  className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-text-tertiary"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 rounded hover:bg-bg-secondary transition-colors"
                  >
                    <X className="w-4 h-4 text-text-secondary" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-mono text-text-tertiary bg-bg-secondary rounded border border-border">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
                {flatResults.length === 0 ? (
                  <div className="py-12 text-center">
                    <Search className="w-12 h-12 mx-auto text-text-tertiary mb-3 opacity-40" />
                    <p className="text-text-secondary text-sm">
                      No results found
                    </p>
                    <p className="text-text-tertiary text-xs mt-1">
                      Try different keywords
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedResults).map(([category, items]) => (
                      <div key={category}>
                        <div className="px-3 py-1.5 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                          {category}
                        </div>
                        <div className="space-y-0.5">
                          {items.map((item) => {
                            const index = currentIndex++
                            const isSelected = index === selectedIndex

                            return (
                              <button
                                key={item.href}
                                data-selected={isSelected}
                                onClick={() => handleSelect(item.href)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all',
                                  isSelected
                                    ? 'bg-brand-500 text-white shadow-md'
                                    : 'hover:bg-bg-secondary'
                                )}
                              >
                                <div
                                  className={cn(
                                    'flex-shrink-0',
                                    isSelected && 'text-white'
                                  )}
                                >
                                  {getTypeIcon(item.type, isSelected)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">
                                    {item.title}
                                  </div>
                                  {item.description && (
                                    <div
                                      className={cn(
                                        'text-sm truncate',
                                        isSelected
                                          ? 'text-white/70'
                                          : 'text-text-secondary'
                                      )}
                                    >
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                                {item._score > 0 && query && (
                                  <div
                                    className={cn(
                                      'text-xs font-mono px-1.5 py-0.5 rounded',
                                      isSelected
                                        ? 'bg-white/20 text-white/80'
                                        : 'bg-bg-tertiary text-text-tertiary'
                                    )}
                                  >
                                    {Math.round(item._score)}
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
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
                  {flatResults.length} result
                  {flatResults.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Icon mapping by content type
function getTypeIcon(type: string, isSelected: boolean = false) {
  const iconClass = cn('w-4 h-4', isSelected ? 'text-white' : '')

  switch (type) {
    case 'component':
      return <Hash className={cn(iconClass, !isSelected && 'text-brand-500')} />
    case 'hook':
      return (
        <Wrench className={cn(iconClass, !isSelected && 'text-purple-500')} />
      )
    case 'guide':
      return (
        <FileText className={cn(iconClass, !isSelected && 'text-green-500')} />
      )
    case 'example':
      return (
        <Code2 className={cn(iconClass, !isSelected && 'text-orange-500')} />
      )
    case 'cookbook':
      return (
        <BookOpen className={cn(iconClass, !isSelected && 'text-amber-500')} />
      )
    case 'concept':
      return (
        <Sparkles className={cn(iconClass, !isSelected && 'text-blue-500')} />
      )
    case 'deployment':
      return (
        <Rocket className={cn(iconClass, !isSelected && 'text-indigo-500')} />
      )
    case 'integration':
      return <Link2 className={cn(iconClass, !isSelected && 'text-teal-500')} />
    default:
      return (
        <FileText className={cn(iconClass, !isSelected && 'text-gray-500')} />
      )
  }
}

// Category name mapping
function getCategoryName(type: string): string {
  const categoryMap: Record<string, string> = {
    component: 'Components',
    hook: 'Hooks',
    guide: 'Guides',
    example: 'Examples',
    cookbook: 'Cookbook',
    concept: 'Concepts',
    deployment: 'Deployment',
    integration: 'Integrations',
  }

  return categoryMap[type] || 'Documentation'
}

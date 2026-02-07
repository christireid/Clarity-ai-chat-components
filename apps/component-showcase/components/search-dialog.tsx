'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from '@clarity-chat/primitives'
import { Search, Component, Puzzle, Layers, Loader2 } from 'lucide-react'
import { useSearchIndex } from '@/lib/use-search-index'
import type { SearchEntry } from '@/data/search-index'

const typeIcons = {
  component: Component,
  hook: Puzzle,
  primitive: Layers,
} as const

// Module-level listeners for cross-component communication
type SearchListener = () => void
const listeners = new Set<SearchListener>()

/** Call from any component to open the search dialog reliably. */
export function openSearch() {
  listeners.forEach((fn) => fn())
}

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { index, loading } = useSearchIndex()
  const router = useRouter()

  // Subscribe to openSearch() calls
  useEffect(() => {
    const listener = () => setOpen(true)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  // Reset query when dialog closes
  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) setQuery('')
  }, [])

  // Cmd+K / Ctrl+K to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = useCallback(
    (entry: SearchEntry) => {
      setOpen(false)
      setQuery('')
      router.push(entry.href)
    },
    [router]
  )

  // Simple fuzzy matching: all query terms must appear in the searchable text
  const results = useMemo(() => {
    if (!query.trim()) return []
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    return index
      .filter((entry) => {
        const searchable =
          `${entry.name} ${entry.section} ${entry.category} ${entry.description}`.toLowerCase()
        return terms.every((term) => searchable.includes(term))
      })
      .slice(0, 30)
  }, [query, index])

  // Group results by category
  const grouped = useMemo(() => {
    const groups = new Map<string, SearchEntry[]>()
    for (const entry of results) {
      const existing = groups.get(entry.category)
      if (existing) {
        existing.push(entry)
      } else {
        groups.set(entry.category, [entry])
      }
    }
    return groups
  }, [results])

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandInput
        placeholder="Search components, hooks, and primitives..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {query.trim() && results.length === 0 && (
          <CommandEmpty>
            No components found for &ldquo;{query}&rdquo;
          </CommandEmpty>
        )}

        {!query.trim() && (
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
              {loading ? (
                <>
                  <Loader2 className="h-8 w-8 opacity-40 animate-spin" />
                  <p className="text-sm">Loading search index...</p>
                </>
              ) : (
                <>
                  <Search className="h-8 w-8 opacity-40" />
                  <p className="text-sm">
                    Type to search {index.length} documented components
                  </p>
                </>
              )}
            </div>
          </CommandEmpty>
        )}

        {[...grouped.entries()].map(([category, entries]) => (
          <CommandGroup key={category} heading={category}>
            {entries.map((entry) => {
              const Icon = typeIcons[entry.type]
              return (
                <CommandItem
                  key={`${entry.href}-${entry.name}`}
                  value={`${entry.name} ${entry.section} ${entry.category}`}
                  onSelect={() => handleSelect(entry)}
                  className="flex items-center gap-3"
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-sm">{entry.name}</span>
                    {entry.name !== entry.section && (
                      <span className="text-xs text-muted-foreground ml-2">
                        in {entry.section}
                      </span>
                    )}
                  </div>
                  <CommandShortcut className="text-xs opacity-50">
                    {entry.category}
                  </CommandShortcut>
                </CommandItem>
              )
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}

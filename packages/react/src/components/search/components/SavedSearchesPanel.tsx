'use client'

import * as React from 'react'
import { Input, Button } from '@clarity-chat/primitives'
import { BookmarkPlus, Trash2, Clock } from 'lucide-react'
import type { SavedSearch, SearchFilters } from '../types'

// Type assertions for icons
const BookmarkPlusIcon = BookmarkPlus as React.ComponentType<{
  className?: string
}>
const TrashIcon = Trash2 as React.ComponentType<{ className?: string }>
const ClockIcon = Clock as React.ComponentType<{ className?: string }>

export interface SavedSearchesPanelProps {
  savedSearches: SavedSearch[]
  recentSearches: string[]
  currentFilters: SearchFilters
  activeFilterCount: number
  onLoadSearch: (search: SavedSearch) => void
  onDeleteSearch: (id: string) => void
  onSaveSearch: (name: string) => void
  onApplyRecentSearch: (query: string) => void
}

/**
 * Panel for managing saved and recent searches
 */
export const SavedSearchesPanel = React.memo(function SavedSearchesPanel({
  savedSearches,
  recentSearches,
  currentFilters,
  activeFilterCount,
  onLoadSearch,
  onDeleteSearch,
  onSaveSearch,
  onApplyRecentSearch,
}: SavedSearchesPanelProps) {
  const [savingSearch, setSavingSearch] = React.useState(false)
  const [searchName, setSearchName] = React.useState('')

  const handleSaveSearch = React.useCallback(() => {
    if (!searchName.trim()) return
    onSaveSearch(searchName)
    setSearchName('')
    setSavingSearch(false)
  }, [searchName, onSaveSearch])

  const hasActiveSearch = currentFilters.query || activeFilterCount > 0

  return (
    <div className="space-y-3 backdrop-blur-md backdrop-saturate-150 bg-white/60 dark:bg-background/60 border border-glass-light dark:border-glass-dark-light rounded-lg p-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      {/* Save current search */}
      {hasActiveSearch && (
        <div className="pb-3 border-b">
          {savingSearch ? (
            <div className="flex gap-2">
              <Input
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search name..."
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveSearch()
                  if (e.key === 'Escape') setSavingSearch(false)
                }}
              />
              <Button
                size="sm"
                onClick={handleSaveSearch}
                disabled={!searchName.trim()}
                className="h-8"
              >
                Save
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSavingSearch(true)}
              className="w-full justify-start"
            >
              <BookmarkPlusIcon className="h-4 w-4 mr-2" />
              Save Current Search
            </Button>
          )}
        </div>
      )}

      {/* Saved searches list */}
      {savedSearches.length > 0 ? (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {savedSearches.map((search) => (
            <div
              key={search.id}
              className="flex items-center gap-2 p-2 rounded hover:bg-accent group"
            >
              <button
                onClick={() => onLoadSearch(search)}
                className="flex-1 text-left"
              >
                <div className="text-sm font-medium truncate">
                  {search.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {search.filters.query && `"${search.filters.query}"`}
                  {Object.keys(search.filters).filter(
                    (k) =>
                      k !== 'query' && search.filters[k as keyof SearchFilters]
                  ).length > 0 && ' + filters'}
                </div>
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteSearch(search.id)}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:text-destructive"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-center text-muted-foreground py-4">
          No saved searches yet
        </div>
      )}

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="pt-3 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <ClockIcon className="h-3 w-3" />
            Recent
          </div>
          <div className="flex flex-wrap gap-1">
            {recentSearches.slice(0, 5).map((query, i) => (
              <button
                key={i}
                onClick={() => onApplyRecentSearch(query)}
                className="px-2 py-1 text-xs bg-muted rounded-full hover:bg-accent truncate max-w-[100px]"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

SavedSearchesPanel.displayName = 'SavedSearchesPanel'

'use client'

import { memo } from 'react'
import type { SortOption } from '../ConversationList.types'

export interface ConversationFiltersProps {
  sortBy: SortOption
  showPinnedOnly: boolean
  showFavoritesOnly: boolean
  showSort: boolean
  showFilters: boolean
  onSortChange: (sortBy: SortOption) => void
  onTogglePinnedOnly: () => void
  onToggleFavoritesOnly: () => void
}

/**
 * Filters and sort controls for conversation list
 */
export const ConversationFilters = memo(function ConversationFilters({
  sortBy,
  showPinnedOnly,
  showFavoritesOnly,
  showSort,
  showFilters,
  onSortChange,
  onTogglePinnedOnly,
  onToggleFavoritesOnly,
}: ConversationFiltersProps) {
  if (!showFilters && !showSort) return null

  return (
    <div className="p-3 border-b border-border space-y-2">
      {showSort && (
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow duration-150 ease-out"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title A-Z</option>
          <option value="messages">Message Count</option>
        </select>
      )}

      {showFilters && (
        <div className="flex gap-2">
          <button
            onClick={onTogglePinnedOnly}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-150 ease-out ${
              showPinnedOnly
                ? 'bg-primary/10 text-primary scale-105'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            📌 Pinned
          </button>

          <button
            onClick={onToggleFavoritesOnly}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-150 ease-out ${
              showFavoritesOnly
                ? 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] scale-105'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            ⭐ Favorites
          </button>
        </div>
      )}
    </div>
  )
})

ConversationFilters.displayName = 'ConversationFilters'

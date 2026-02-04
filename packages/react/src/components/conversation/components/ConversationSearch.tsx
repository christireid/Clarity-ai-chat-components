'use client'

import { memo } from 'react'

export interface ConversationSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

/**
 * Search input for filtering conversations
 */
export const ConversationSearch = memo(function ConversationSearch({
  searchQuery,
  onSearchChange,
}: ConversationSearchProps) {
  return (
    <div className="p-3 border-b border-border">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-transparent transition-shadow duration-150 ease-out"
        />
      </div>
    </div>
  )
})

ConversationSearch.displayName = 'ConversationSearch'

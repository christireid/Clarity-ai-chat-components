import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Conversation item
 */
export interface Conversation {
  id: string
  title: string
  preview: string
  timestamp: number
  messageCount: number
  unreadCount?: number
  tags?: string[]
  isPinned?: boolean
  isFavorite?: boolean
}

/**
 * Sort option
 */
export type SortOption = 'recent' | 'oldest' | 'title' | 'messages'

/**
 * Filter option
 */
export interface FilterOptions {
  search?: string
  tags?: string[]
  showPinned?: boolean
  showFavorites?: boolean
}

/**
 * Conversation list props
 */
export interface ConversationListProps {
  /** List of conversations */
  conversations: Conversation[]
  
  /** Currently active conversation ID */
  activeId?: string
  
  /** Callback when conversation is selected */
  onSelect: (conversationId: string) => void
  
  /** Callback when conversation is deleted */
  onDelete?: (conversationId: string) => void
  
  /** Callback when conversation is pinned/unpinned */
  onTogglePin?: (conversationId: string) => void
  
  /** Callback when conversation is favorited/unfavorited */
  onToggleFavorite?: (conversationId: string) => void
  
  /** Callback when new conversation is created */
  onCreate?: () => void
  
  /** Show search bar */
  showSearch?: boolean
  
  /** Show filters */
  showFilters?: boolean
  
  /** Show sort options */
  showSort?: boolean
  
  /** Enable multi-select */
  multiSelect?: boolean
  
  /** Selected conversation IDs (for multi-select) */
  selectedIds?: string[]
  
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void
  
  /** Custom CSS class */
  className?: string
}

/**
 * Format timestamp to relative time
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
  return new Date(timestamp).toLocaleDateString()
}

/**
 * Production-ready Conversation List component.
 * 
 * **Features:**
 * - Search conversations by title/content
 * - Filter by tags, pinned, favorites
 * - Sort by date, title, message count
 * - Pin/favorite conversations
 * - Multi-select for bulk operations
 * - Unread count badges
 * - Drag-and-drop reordering (future)
 * 
 * **Use Cases:**
 * - Organize multiple AI conversations
 * - Quick navigation between chats
 * - Bulk operations (delete, export)
 * - Find old conversations
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ConversationList
 *   conversations={conversations}
 *   activeId={currentConversation.id}
 *   onSelect={(id) => setCurrentConversation(id)}
 *   onCreate={() => createNewConversation()}
 * />
 * 
 * // With search and filters
 * <ConversationList
 *   conversations={conversations}
 *   activeId={currentConversation.id}
 *   onSelect={handleSelect}
 *   showSearch={true}
 *   showFilters={true}
 *   showSort={true}
 * />
 * 
 * // With multi-select
 * <ConversationList
 *   conversations={conversations}
 *   multiSelect={true}
 *   selectedIds={selectedIds}
 *   onSelectionChange={setSelectedIds}
 *   onDelete={handleBulkDelete}
 * />
 * 
 * // With pin and favorite
 * <ConversationList
 *   conversations={conversations}
 *   activeId={currentConversation.id}
 *   onSelect={handleSelect}
 *   onTogglePin={handlePin}
 *   onToggleFavorite={handleFavorite}
 * />
 * ```
 */
export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onCreate,
  showSearch = true,
  showFilters = false,
  showSort = false,
  multiSelect = false,
  selectedIds = [],
  onSelectionChange,
  className = '',
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sortBy, setSortBy] = React.useState<SortOption>('recent')
  const [filterTags] = React.useState<string[]>([])
  const [showPinnedOnly, setShowPinnedOnly] = React.useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false)

  /**
   * Filter and sort conversations
   */
  const filteredConversations = React.useMemo(() => {
    let filtered = [...conversations]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.preview.toLowerCase().includes(query)
      )
    }

    // Tag filter
    if (filterTags.length > 0) {
      filtered = filtered.filter((c) =>
        filterTags.some((tag) => c.tags?.includes(tag))
      )
    }

    // Pinned filter
    if (showPinnedOnly) {
      filtered = filtered.filter((c) => c.isPinned)
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter((c) => c.isFavorite)
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.timestamp - a.timestamp)
        break
      case 'oldest':
        filtered.sort((a, b) => a.timestamp - b.timestamp)
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'messages':
        filtered.sort((a, b) => b.messageCount - a.messageCount)
        break
    }

    // Always show pinned first
    const pinned = filtered.filter((c) => c.isPinned)
    const unpinned = filtered.filter((c) => !c.isPinned)

    return [...pinned, ...unpinned]
  }, [conversations, searchQuery, sortBy, filterTags, showPinnedOnly, showFavoritesOnly])

  /**
   * Handle conversation selection
   */
  const handleSelect = (id: string) => {
    if (multiSelect && onSelectionChange) {
      const newSelection = selectedIds.includes(id)
        ? selectedIds.filter((sid) => sid !== id)
        : [...selectedIds, id]
      onSelectionChange(newSelection)
    } else {
      onSelect(id)
    }
  }

  /**
   * Get all unique tags (currently unused but available for tag filtering UI)
   */
  // const allTags = React.useMemo(() => {
  //   const tags = new Set<string>()
  //   conversations.forEach((c) => {
  //     c.tags?.forEach((tag) => tags.add(tag))
  //   })
  //   return Array.from(tags)
  // }, [conversations])

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Header with create button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Conversations
        </h2>
        
        {onCreate && (
          <button
            onClick={onCreate}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            aria-label="New conversation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Filters and sort */}
      {(showFilters || showSort) && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 space-y-2">
          {showSort && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
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
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  showPinnedOnly
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'
                }`}
              >
                📌 Pinned
              </button>
              
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  showFavoritesOnly
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'
                }`}
              >
                ⭐ Favorites
              </button>
            </div>
          )}
        </div>
      )}

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence initial={false}>
          {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <svg
              className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            {onCreate && !searchQuery && (
              <button
                onClick={onCreate}
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                Start a conversation
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredConversations.map((conversation, index) => {
              const isActive = activeId === conversation.id
              const isSelected = selectedIds.includes(conversation.id)

              return (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05, // Stagger: 50ms between items
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  whileHover={{
                    y: -2,
                    transition: { duration: 0.15 },
                  }}
                  layout
                  onClick={() => handleSelect(conversation.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
                      : isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/10'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select conversation: ${conversation.title}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {/* Checkbox for multi-select */}
                        {multiSelect && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 text-blue-600 rounded"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}

                        {/* Title */}
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {conversation.title}
                        </h3>

                        {/* Pin indicator */}
                        {conversation.isPinned && (
                          <span className="text-xs">📌</span>
                        )}

                        {/* Favorite indicator */}
                        {conversation.isFavorite && (
                          <span className="text-xs">⭐</span>
                        )}

                        {/* Unread badge */}
                        {conversation.unreadCount && conversation.unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Preview */}
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-1">
                        {conversation.preview}
                      </p>

                      {/* Meta info */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <span>{formatRelativeTime(conversation.timestamp)}</span>
                        <span>•</span>
                        <span>{conversation.messageCount} messages</span>
                      </div>

                      {/* Tags */}
                      {conversation.tags && conversation.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {conversation.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                      {onTogglePin && (
                        <motion.button
                          onClick={() => onTogglePin(conversation.id)}
                          whileHover={{ scale: 1.2, rotate: conversation.isPinned ? 0 : 15 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                          aria-label={conversation.isPinned ? 'Unpin' : 'Pin'}
                        >
                          <motion.span
                            className="text-sm"
                            animate={conversation.isPinned ? { rotate: [0, -10, 10, -10, 0] } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            {conversation.isPinned ? '📌' : '📍'}
                          </motion.span>
                        </motion.button>
                      )}

                      {onToggleFavorite && (
                        <motion.button
                          onClick={() => onToggleFavorite(conversation.id)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                          aria-label={conversation.isFavorite ? 'Unfavorite' : 'Favorite'}
                        >
                          <motion.span
                            className="text-sm"
                            animate={conversation.isFavorite ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            {conversation.isFavorite ? '⭐' : '☆'}
                          </motion.span>
                        </motion.button>
                      )}

                      {onDelete && (
                        <motion.button
                          onClick={() => onDelete(conversation.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                          aria-label="Delete conversation"
                        >
                          <svg
                            className="w-4 h-4 text-red-600 dark:text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        </AnimatePresence>
      </div>

      {/* Footer with stats */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          <span>
            {filteredConversations.length} of {conversations.length} conversations
          </span>
          
          {multiSelect && selectedIds.length > 0 && (
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {selectedIds.length} selected
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

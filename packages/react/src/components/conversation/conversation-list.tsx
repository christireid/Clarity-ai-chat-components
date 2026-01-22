'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@clarity-chat/primitives'
import { formatRelativeTime } from '../../internal/helpers'
import {
  EASING_FRAMER,
  DURATION_SECONDS as durations,
} from '../../animations/constants'

/**
 * Folder for organizing conversations
 */
export interface Folder {
  id: string
  name: string
  color?: string
  icon?: string
  createdAt: number
  conversationCount?: number
}

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
  /** Folder ID this conversation belongs to */
  folderId?: string
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

  /** List of folders for organization */
  folders?: Folder[]

  /** Currently active conversation ID */
  activeId?: string

  /** Currently active folder ID (for filtering) */
  activeFolderId?: string

  /** Callback when conversation is selected */
  onSelect: (conversationId: string) => void

  /** Callback when folder is selected */
  onFolderSelect?: (folderId: string | null) => void

  /** Callback when conversation is deleted */
  onDelete?: (conversationId: string) => void

  /** Callback when folder is deleted */
  onDeleteFolder?: (folderId: string) => void

  /** Callback when conversation is moved to folder */
  onMoveToFolder?: (conversationId: string, folderId: string | null) => void

  /** Callback when conversation is pinned/unpinned */
  onTogglePin?: (conversationId: string) => void

  /** Callback when conversation is favorited/unfavorited */
  onToggleFavorite?: (conversationId: string) => void

  /** Callback when new conversation is created */
  onCreate?: () => void

  /** Callback when new folder is created */
  onCreateFolder?: (name: string, color?: string) => void

  /** Callback when folder is renamed */
  onRenameFolder?: (folderId: string, newName: string) => void

  /** Show search bar */
  showSearch?: boolean

  /** Show filters */
  showFilters?: boolean

  /** Show sort options */
  showSort?: boolean

  /** Show folder organization */
  showFolders?: boolean

  /** Enable multi-select */
  multiSelect?: boolean

  /** Selected conversation IDs (for multi-select) */
  selectedIds?: string[]

  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void

  /** Custom CSS class */
  className?: string
}

// formatRelativeTime imported from @clarity-chat/primitives

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
export const ConversationList = memo(function ConversationList({
  conversations,
  folders = [],
  activeId,
  activeFolderId,
  onSelect,
  onFolderSelect,
  onDelete,
  onDeleteFolder,
  onMoveToFolder,
  onTogglePin,
  onToggleFavorite,
  onCreate,
  onCreateFolder,
  onRenameFolder,
  showSearch = true,
  showFilters = false,
  showSort = false,
  showFolders = false,
  multiSelect = false,
  selectedIds = [],
  onSelectionChange,
  className = '',
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filterTags] = useState<string[]>([])
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const prefersReducedMotion = useReducedMotion()

  /**
   * Group conversations by folder
   */
  const conversationsByFolder = useMemo(() => {
    const grouped: Record<string, Conversation[]> = {}
    const uncategorized: Conversation[] = []

    conversations.forEach((conv) => {
      if (conv.folderId && folders.some((f) => f.id === conv.folderId)) {
        if (!grouped[conv.folderId]) {
          grouped[conv.folderId] = []
        }
        const folderConversations = grouped[conv.folderId]
        if (folderConversations) {
          folderConversations.push(conv)
        }
      } else {
        uncategorized.push(conv)
      }
    })

    return { grouped, uncategorized }
  }, [conversations, folders])

  /**
   * Filter and sort conversations
   */
  const filteredConversations = useMemo(() => {
    let filtered = [...conversations]

    // Folder filter
    if (activeFolderId !== undefined && activeFolderId !== null) {
      filtered = filtered.filter((c) => c.folderId === activeFolderId)
    } else if (showFolders && activeFolderId === null) {
      // Show only uncategorized when "Uncategorized" folder is selected
      filtered = filtered.filter((c) => !c.folderId)
    }

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
  }, [
    conversations,
    activeFolderId,
    searchQuery,
    sortBy,
    filterTags,
    showPinnedOnly,
    showFavoritesOnly,
    showFolders,
  ])

  /**
   * Toggle folder expansion
   */
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }, [])

  /**
   * Handle create folder
   */
  const handleCreateFolder = useCallback(() => {
    if (newFolderName.trim() && onCreateFolder) {
      onCreateFolder(newFolderName.trim())
      setNewFolderName('')
      setShowCreateFolder(false)
    }
  }, [newFolderName, onCreateFolder])

  /**
   * Handle conversation selection
   */
  const handleSelect = useCallback(
    (id: string) => {
      if (multiSelect && onSelectionChange) {
        const newSelection = selectedIds.includes(id)
          ? selectedIds.filter((sid) => sid !== id)
          : [...selectedIds, id]
        onSelectionChange(newSelection)
      } else {
        onSelect(id)
      }
    },
    [multiSelect, onSelectionChange, selectedIds, onSelect]
  )

  /**
   * Handle keyboard activation for conversation items
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleSelect(id)
      }
    },
    [handleSelect]
  )

  return (
    <div
      className={`flex flex-col h-full bg-card border-r border-border ${className}`}
    >
      {/* Header with create button */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Conversations</h2>

        <div className="flex items-center gap-2">
          {showFolders && onCreateFolder && (
            <button
              onClick={() => setShowCreateFolder(!showCreateFolder)}
              className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-all duration-150 ease-out hover:scale-105"
              aria-label="New folder"
              title="New folder"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </button>
          )}
          {onCreate && (
            <button
              onClick={onCreate}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all duration-150 ease-out hover:scale-105"
              aria-label="New conversation"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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
      </div>

      {/* Create folder input */}
      {showCreateFolder && onCreateFolder && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3 border-b border-border"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolder()
                } else if (e.key === 'Escape') {
                  setShowCreateFolder(false)
                  setNewFolderName('')
                }
              }}
              className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              autoFocus
            />
            <button
              onClick={handleCreateFolder}
              className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowCreateFolder(false)
                setNewFolderName('')
              }}
              className="px-3 py-2 bg-muted text-muted-foreground text-sm rounded-lg hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Folder list */}
      {showFolders && folders.length > 0 && (
        <div className="border-b border-border">
          {/* All conversations / Uncategorized */}
          <button
            onClick={() => onFolderSelect?.(null)}
            className={`w-full px-4 py-2 text-left text-sm transition-colors ${
              activeFolderId === null || activeFolderId === undefined
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted/50 text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span>All Conversations</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {conversations.length}
              </span>
            </div>
          </button>

          {/* Folders */}
          {folders.map((folder) => {
            const folderConversations =
              conversationsByFolder.grouped[folder.id] || []
            const isExpanded = expandedFolders.has(folder.id)
            const isActive = activeFolderId === folder.id

            return (
              <div
                key={folder.id}
                className="border-b border-border/50 last:border-b-0"
              >
                <button
                  onClick={() => {
                    if (showFolders) {
                      toggleFolder(folder.id)
                    }
                    onFolderSelect?.(folder.id)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted/50 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <motion.svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{
                        // Framer Motion 12: Spring folder icon rotation
                        type: 'spring',
                        damping: 20,
                        stiffness: 300,
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    <span className="flex-1 truncate">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {folderConversations.length}
                    </span>
                    {onDeleteFolder && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm(`Delete folder "${folder.name}"?`)) {
                            onDeleteFolder(folder.id)
                          }
                        }}
                        className="p-1 hover:bg-destructive/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Delete folder ${folder.name}`}
                      >
                        <svg
                          className="w-3 h-3 text-destructive"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Search bar */}
      {showSearch && (
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-transparent transition-shadow duration-150 ease-out"
            />
          </div>
        </div>
      )}

      {/* Filters and sort */}
      {(showFilters || showSort) && (
        <div className="p-3 border-b border-border space-y-2">
          {showSort && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-shadow duration-150 ease-out"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A-Z</option>
              <option value="messages">Message Count</option>
            </select>
          )}

          {showFilters && (
            <div
              className="flex gap-2"
              role="group"
              aria-label="Filter options"
            >
              <button
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                aria-pressed={showPinnedOnly}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-150 ease-out ${
                  showPinnedOnly
                    ? `bg-primary/10 text-primary ${prefersReducedMotion ? '' : 'scale-105'}`
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <span aria-hidden="true">📌</span> Pinned
              </button>

              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                aria-pressed={showFavoritesOnly}
                className={`px-3 py-1 text-xs rounded-full transition-all duration-150 ease-out ${
                  showFavoritesOnly
                    ? `bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] ${prefersReducedMotion ? '' : 'scale-105'}`
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <span aria-hidden="true">⭐</span> Favorites
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
                className="w-12 h-12 text-muted-foreground/70 mb-3"
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
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? 'No conversations found'
                  : 'No conversations yet'}
              </p>
              {onCreate && !searchQuery && (
                <button
                  onClick={onCreate}
                  className="mt-3 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground text-sm rounded-lg transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-px"
                >
                  Start a conversation
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredConversations.map((conversation, index) => {
                const isActive = activeId === conversation.id
                const isSelected = selectedIds.includes(conversation.id)

                return (
                  <motion.div
                    key={conversation.id}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 20 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, x: -100, height: 0 }
                    }
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            duration: durations.normal,
                            delay: index * 0.05,
                            ease: EASING_FRAMER.default,
                          }
                    }
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : {
                            y: -2,
                            transition: { duration: durations.fast },
                          }
                    }
                    layout={!prefersReducedMotion}
                    onClick={() => handleSelect(conversation.id)}
                    onKeyDown={(e) => handleKeyDown(e, conversation.id)}
                    className={`p-4 cursor-pointer transition-all duration-150 ease-out ${
                      isActive
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : isSelected
                          ? 'bg-primary/5'
                          : 'hover:bg-muted/50'
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select conversation: ${conversation.title}`}
                    aria-pressed={isSelected}
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
                              className="w-4 h-4 text-primary rounded"
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}

                          {/* Title */}
                          <h3 className="text-sm font-medium text-foreground truncate">
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
                          {conversation.unreadCount &&
                            conversation.unreadCount > 0 && (
                              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
                                {conversation.unreadCount}
                              </span>
                            )}
                        </div>

                        {/* Preview */}
                        <p className="text-xs text-muted-foreground truncate mb-1">
                          {conversation.preview}
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                          <span>
                            {formatRelativeTime(conversation.timestamp)}
                          </span>
                          <span>•</span>
                          <span>{conversation.messageCount} messages</span>
                        </div>

                        {/* Tags */}
                        {conversation.tags && conversation.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {conversation.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div
                        className="flex flex-col gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {showFolders && onMoveToFolder && (
                          <motion.button
                            onClick={() => {
                              // Simple implementation: move to first folder or remove from folder
                              const currentFolderId = conversation.folderId
                              const newFolderId = currentFolderId
                                ? null
                                : folders[0]?.id || null
                              onMoveToFolder(conversation.id, newFolderId)
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 hover:bg-muted rounded transition-colors duration-150 ease-out"
                            aria-label={
                              conversation.folderId
                                ? 'Remove from folder'
                                : 'Move to folder'
                            }
                            title={
                              conversation.folderId
                                ? 'Remove from folder'
                                : 'Move to folder'
                            }
                          >
                            <svg
                              className="w-4 h-4 text-muted-foreground"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              {conversation.folderId ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                />
                              ) : (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                              )}
                            </svg>
                          </motion.button>
                        )}
                        {onTogglePin && (
                          <motion.button
                            onClick={() => onTogglePin(conversation.id)}
                            whileHover={{
                              scale: 1.2,
                              rotate: conversation.isPinned ? 0 : 15,
                            }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 hover:bg-muted rounded transition-colors duration-150 ease-out"
                            aria-label={conversation.isPinned ? 'Unpin' : 'Pin'}
                          >
                            <motion.span
                              className="text-sm"
                              animate={
                                conversation.isPinned
                                  ? { rotate: [0, -10, 10, -10, 0] }
                                  : {}
                              }
                              transition={{ duration: durations.slow }}
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
                            className="p-1 hover:bg-muted rounded transition-colors duration-150 ease-out"
                            aria-label={
                              conversation.isFavorite
                                ? 'Unfavorite'
                                : 'Favorite'
                            }
                          >
                            <motion.span
                              className="text-sm"
                              animate={
                                conversation.isFavorite
                                  ? { scale: [1, 1.3, 1] }
                                  : {}
                              }
                              transition={{ duration: durations.moderate }}
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
                            className="p-1 hover:bg-destructive/10 rounded transition-all duration-150 ease-out"
                            aria-label="Delete conversation"
                          >
                            <svg
                              className="w-4 h-4 text-destructive"
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
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {filteredConversations.length} of {conversations.length}{' '}
            conversations
          </span>

          {multiSelect && selectedIds.length > 0 && (
            <span className="font-medium text-primary">
              {selectedIds.length} selected
            </span>
          )}
        </div>
      </div>
    </div>
  )
})

ConversationList.displayName = 'ConversationList'

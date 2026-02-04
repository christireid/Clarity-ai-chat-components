'use client'

import { useCallback, memo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'

// Import extracted types
import type { ConversationListProps } from './ConversationList.types'

// Import extracted components
import {
  ConversationListItem,
  ConversationFilters,
  ConversationSearch,
  FolderList,
  CreateFolderForm,
} from './components'

// Import extracted hook
import { useConversationList } from './hooks/useConversationList'

// Re-export types for external consumers
export type {
  Folder,
  Conversation,
  SortOption,
  FilterOptions,
  ConversationListProps,
} from './ConversationList.types'

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
  const prefersReducedMotion = useReducedMotion()

  // Use conversation list hook
  const {
    searchQuery,
    sortBy,
    showPinnedOnly,
    showFavoritesOnly,
    expandedFolders,
    showCreateFolder,
    newFolderName,
    conversationsByFolder,
    filteredConversations,
    setSearchQuery,
    setSortBy,
    setShowPinnedOnly,
    setShowFavoritesOnly,
    toggleFolder,
    setShowCreateFolder,
    setNewFolderName,
    handleSelect,
  } = useConversationList({
    conversations,
    folders,
    activeFolderId,
    showFolders,
    multiSelect,
    selectedIds,
    onSelect,
    onSelectionChange,
  })

  /**
   * Handle create folder
   */
  const handleCreateFolder = useCallback(() => {
    if (newFolderName.trim() && onCreateFolder) {
      onCreateFolder(newFolderName.trim())
      setNewFolderName('')
      setShowCreateFolder(false)
    }
  }, [newFolderName, onCreateFolder, setNewFolderName, setShowCreateFolder])

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
        <CreateFolderForm
          newFolderName={newFolderName}
          prefersReducedMotion={prefersReducedMotion}
          onNameChange={setNewFolderName}
          onCreate={handleCreateFolder}
          onCancel={() => {
            setShowCreateFolder(false)
            setNewFolderName('')
          }}
        />
      )}

      {/* Folder list */}
      {showFolders && folders.length > 0 && (
        <FolderList
          folders={folders}
          conversations={conversations}
          activeFolderId={activeFolderId}
          expandedFolders={expandedFolders}
          prefersReducedMotion={prefersReducedMotion}
          onFolderSelect={onFolderSelect}
          onDeleteFolder={onDeleteFolder}
          onToggleFolder={toggleFolder}
          conversationsByFolder={conversationsByFolder.grouped}
        />
      )}

      {/* Search bar */}
      {showSearch && (
        <ConversationSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      {/* Filters and sort */}
      <ConversationFilters
        sortBy={sortBy}
        showPinnedOnly={showPinnedOnly}
        showFavoritesOnly={showFavoritesOnly}
        showSort={showSort}
        showFilters={showFilters}
        onSortChange={setSortBy}
        onTogglePinnedOnly={() => setShowPinnedOnly(!showPinnedOnly)}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
      />

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {prefersReducedMotion ? (
          filteredConversations.length === 0 ? (
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
              {filteredConversations.map((conversation, index) => (
                <ConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeId === conversation.id}
                  isSelected={selectedIds.includes(conversation.id)}
                  index={index}
                  multiSelect={multiSelect}
                  showFolders={showFolders}
                  folders={folders}
                  prefersReducedMotion={prefersReducedMotion}
                  onSelect={handleSelect}
                  onTogglePin={onTogglePin}
                  onToggleFavorite={onToggleFavorite}
                  onMoveToFolder={onMoveToFolder}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )
        ) : (
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
                {filteredConversations.map((conversation, index) => (
                  <ConversationListItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={activeId === conversation.id}
                    isSelected={selectedIds.includes(conversation.id)}
                    index={index}
                    multiSelect={multiSelect}
                    showFolders={showFolders}
                    folders={folders}
                    prefersReducedMotion={prefersReducedMotion}
                    onSelect={handleSelect}
                    onTogglePin={onTogglePin}
                    onToggleFavorite={onToggleFavorite}
                    onMoveToFolder={onMoveToFolder}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
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

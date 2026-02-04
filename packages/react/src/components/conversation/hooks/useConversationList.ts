/**
 * Hook for managing conversation list state
 */

import { useState, useMemo, useCallback } from 'react'
import type {
  Conversation,
  Folder,
  SortOption,
  GroupedConversations,
} from '../ConversationList.types'
import {
  groupConversationsByFolder,
  filterAndSortConversations,
} from '../ConversationList.utils'

export interface UseConversationListProps {
  conversations: Conversation[]
  folders: Folder[]
  activeFolderId?: string | null
  showFolders: boolean
  multiSelect: boolean
  selectedIds: string[]
  onSelect: (conversationId: string) => void
  onSelectionChange?: (selectedIds: string[]) => void
}

export interface UseConversationListReturn {
  // State
  searchQuery: string
  sortBy: SortOption
  filterTags: string[]
  showPinnedOnly: boolean
  showFavoritesOnly: boolean
  expandedFolders: Set<string>
  showCreateFolder: boolean
  newFolderName: string

  // Computed
  conversationsByFolder: GroupedConversations
  filteredConversations: Conversation[]

  // Handlers
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: SortOption) => void
  setShowPinnedOnly: (show: boolean) => void
  setShowFavoritesOnly: (show: boolean) => void
  toggleFolder: (folderId: string) => void
  setShowCreateFolder: (show: boolean) => void
  setNewFolderName: (name: string) => void
  handleSelect: (id: string) => void
}

/**
 * Custom hook for managing conversation list state and logic
 */
export function useConversationList({
  conversations,
  folders,
  activeFolderId,
  showFolders,
  multiSelect,
  selectedIds,
  onSelect,
  onSelectionChange,
}: UseConversationListProps): UseConversationListReturn {
  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filterTags] = useState<string[]>([])
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  /**
   * Group conversations by folder
   */
  const conversationsByFolder = useMemo(() => {
    return groupConversationsByFolder(conversations, folders)
  }, [conversations, folders])

  /**
   * Filter and sort conversations
   */
  const filteredConversations = useMemo(() => {
    return filterAndSortConversations(conversations, {
      activeFolderId,
      searchQuery,
      sortBy,
      filterTags,
      showPinnedOnly,
      showFavoritesOnly,
      showFolders,
    })
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

  return {
    // State
    searchQuery,
    sortBy,
    filterTags,
    showPinnedOnly,
    showFavoritesOnly,
    expandedFolders,
    showCreateFolder,
    newFolderName,

    // Computed
    conversationsByFolder,
    filteredConversations,

    // Handlers
    setSearchQuery,
    setSortBy,
    setShowPinnedOnly,
    setShowFavoritesOnly,
    toggleFolder,
    setShowCreateFolder,
    setNewFolderName,
    handleSelect,
  }
}

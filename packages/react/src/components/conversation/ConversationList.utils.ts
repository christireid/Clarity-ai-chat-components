/**
 * Utility functions for ConversationList component
 */

import type {
  Conversation,
  Folder,
  SortOption,
  GroupedConversations,
} from './ConversationList.types'

/**
 * Group conversations by folder
 */
export function groupConversationsByFolder(
  conversations: Conversation[],
  folders: Folder[]
): GroupedConversations {
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
}

/**
 * Filter conversations based on search query
 */
export function filterBySearch(
  conversations: Conversation[],
  searchQuery: string
): Conversation[] {
  if (!searchQuery) return conversations

  const query = searchQuery.toLowerCase()
  return conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(query) ||
      c.preview.toLowerCase().includes(query)
  )
}

/**
 * Filter conversations by tags
 */
export function filterByTags(
  conversations: Conversation[],
  tags: string[]
): Conversation[] {
  if (tags.length === 0) return conversations

  return conversations.filter((c) => tags.some((tag) => c.tags?.includes(tag)))
}

/**
 * Filter conversations by folder
 */
export function filterByFolder(
  conversations: Conversation[],
  activeFolderId: string | null | undefined,
  showFolders: boolean
): Conversation[] {
  if (activeFolderId !== undefined && activeFolderId !== null) {
    return conversations.filter((c) => c.folderId === activeFolderId)
  } else if (showFolders && activeFolderId === null) {
    // Show only uncategorized when "Uncategorized" folder is selected
    return conversations.filter((c) => !c.folderId)
  }
  return conversations
}

/**
 * Filter pinned conversations
 */
export function filterPinned(conversations: Conversation[]): Conversation[] {
  return conversations.filter((c) => c.isPinned)
}

/**
 * Filter favorite conversations
 */
export function filterFavorites(conversations: Conversation[]): Conversation[] {
  return conversations.filter((c) => c.isFavorite)
}

/**
 * Sort conversations by option
 */
export function sortConversations(
  conversations: Conversation[],
  sortBy: SortOption
): Conversation[] {
  const sorted = [...conversations]

  switch (sortBy) {
    case 'recent':
      sorted.sort((a, b) => b.timestamp - a.timestamp)
      break
    case 'oldest':
      sorted.sort((a, b) => a.timestamp - b.timestamp)
      break
    case 'title':
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'messages':
      sorted.sort((a, b) => b.messageCount - a.messageCount)
      break
  }

  return sorted
}

/**
 * Separate pinned and unpinned conversations
 */
export function separatePinnedConversations(conversations: Conversation[]): {
  pinned: Conversation[]
  unpinned: Conversation[]
} {
  const pinned = conversations.filter((c) => c.isPinned)
  const unpinned = conversations.filter((c) => !c.isPinned)

  return { pinned, unpinned }
}

/**
 * Apply all filters and sorting to conversations
 */
export function filterAndSortConversations(
  conversations: Conversation[],
  options: {
    activeFolderId?: string | null
    searchQuery: string
    sortBy: SortOption
    filterTags: string[]
    showPinnedOnly: boolean
    showFavoritesOnly: boolean
    showFolders: boolean
  }
): Conversation[] {
  let filtered = [...conversations]

  // Folder filter
  filtered = filterByFolder(
    filtered,
    options.activeFolderId,
    options.showFolders
  )

  // Search filter
  filtered = filterBySearch(filtered, options.searchQuery)

  // Tag filter
  filtered = filterByTags(filtered, options.filterTags)

  // Pinned filter
  if (options.showPinnedOnly) {
    filtered = filterPinned(filtered)
  }

  // Favorites filter
  if (options.showFavoritesOnly) {
    filtered = filterFavorites(filtered)
  }

  // Sort
  filtered = sortConversations(filtered, options.sortBy)

  // Always show pinned first
  const { pinned, unpinned } = separatePinnedConversations(filtered)

  return [...pinned, ...unpinned]
}

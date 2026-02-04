/**
 * Type definitions for ConversationList component
 */

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
 * Filter options
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

/**
 * Grouped conversations by folder
 */
export interface GroupedConversations {
  grouped: Record<string, Conversation[]>
  uncategorized: Conversation[]
}

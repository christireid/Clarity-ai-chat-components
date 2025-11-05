/**
 * Conversation item
 */
export interface Conversation {
    id: string;
    title: string;
    preview: string;
    timestamp: number;
    messageCount: number;
    unreadCount?: number;
    tags?: string[];
    isPinned?: boolean;
    isFavorite?: boolean;
}
/**
 * Sort option
 */
export type SortOption = 'recent' | 'oldest' | 'title' | 'messages';
/**
 * Filter option
 */
export interface FilterOptions {
    search?: string;
    tags?: string[];
    showPinned?: boolean;
    showFavorites?: boolean;
}
/**
 * Conversation list props
 */
export interface ConversationListProps {
    /** List of conversations */
    conversations: Conversation[];
    /** Currently active conversation ID */
    activeId?: string;
    /** Callback when conversation is selected */
    onSelect: (conversationId: string) => void;
    /** Callback when conversation is deleted */
    onDelete?: (conversationId: string) => void;
    /** Callback when conversation is pinned/unpinned */
    onTogglePin?: (conversationId: string) => void;
    /** Callback when conversation is favorited/unfavorited */
    onToggleFavorite?: (conversationId: string) => void;
    /** Callback when new conversation is created */
    onCreate?: () => void;
    /** Show search bar */
    showSearch?: boolean;
    /** Show filters */
    showFilters?: boolean;
    /** Show sort options */
    showSort?: boolean;
    /** Enable multi-select */
    multiSelect?: boolean;
    /** Selected conversation IDs (for multi-select) */
    selectedIds?: string[];
    /** Callback when selection changes */
    onSelectionChange?: (selectedIds: string[]) => void;
    /** Custom CSS class */
    className?: string;
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
export declare function ConversationList({ conversations, activeId, onSelect, onDelete, onTogglePin, onToggleFavorite, onCreate, showSearch, showFilters, showSort, multiSelect, selectedIds, onSelectionChange, className, }: ConversationListProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=conversation-list.d.ts.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
/**
 * Format timestamp to relative time
 */
function formatRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    if (diff < 60000)
        return 'Just now';
    if (diff < 3600000)
        return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000)
        return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000)
        return `${Math.floor(diff / 86400000)}d ago`;
    return new Date(timestamp).toLocaleDateString();
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
export function ConversationList({ conversations, activeId, onSelect, onDelete, onTogglePin, onToggleFavorite, onCreate, showSearch = true, showFilters = false, showSort = false, multiSelect = false, selectedIds = [], onSelectionChange, className = '', }) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [sortBy, setSortBy] = React.useState('recent');
    const [filterTags] = React.useState([]);
    const [showPinnedOnly, setShowPinnedOnly] = React.useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);
    /**
     * Filter and sort conversations
     */
    const filteredConversations = React.useMemo(() => {
        let filtered = [...conversations];
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((c) => c.title.toLowerCase().includes(query) ||
                c.preview.toLowerCase().includes(query));
        }
        // Tag filter
        if (filterTags.length > 0) {
            filtered = filtered.filter((c) => filterTags.some((tag) => c.tags?.includes(tag)));
        }
        // Pinned filter
        if (showPinnedOnly) {
            filtered = filtered.filter((c) => c.isPinned);
        }
        // Favorites filter
        if (showFavoritesOnly) {
            filtered = filtered.filter((c) => c.isFavorite);
        }
        // Sort
        switch (sortBy) {
            case 'recent':
                filtered.sort((a, b) => b.timestamp - a.timestamp);
                break;
            case 'oldest':
                filtered.sort((a, b) => a.timestamp - b.timestamp);
                break;
            case 'title':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'messages':
                filtered.sort((a, b) => b.messageCount - a.messageCount);
                break;
        }
        // Always show pinned first
        const pinned = filtered.filter((c) => c.isPinned);
        const unpinned = filtered.filter((c) => !c.isPinned);
        return [...pinned, ...unpinned];
    }, [
        conversations,
        searchQuery,
        sortBy,
        filterTags,
        showPinnedOnly,
        showFavoritesOnly,
    ]);
    /**
     * Handle conversation selection
     */
    const handleSelect = (id) => {
        if (multiSelect && onSelectionChange) {
            const newSelection = selectedIds.includes(id)
                ? selectedIds.filter((sid) => sid !== id)
                : [...selectedIds, id];
            onSelectionChange(newSelection);
        }
        else {
            onSelect(id);
        }
    };
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
    return (_jsxs("div", { className: `flex flex-col h-full bg-card border-r border-border ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border", children: [_jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Conversations" }), onCreate && (_jsx("button", { onClick: onCreate, className: "p-2 text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 hover:scale-110", "aria-label": "New conversation", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) }))] }), showSearch && (_jsx("div", { className: "p-3 border-b border-border", children: _jsxs("div", { className: "relative", children: [_jsx("svg", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { type: "text", placeholder: "Search conversations...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow duration-200" })] }) })), (showFilters || showSort) && (_jsxs("div", { className: "p-3 border-b border-border space-y-2", children: [showSort && (_jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow duration-200", children: [_jsx("option", { value: "recent", children: "Most Recent" }), _jsx("option", { value: "oldest", children: "Oldest" }), _jsx("option", { value: "title", children: "Title A-Z" }), _jsx("option", { value: "messages", children: "Message Count" })] })), showFilters && (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setShowPinnedOnly(!showPinnedOnly), className: `px-3 py-1 text-xs rounded-full transition-all duration-200 ${showPinnedOnly
                                    ? 'bg-primary/10 text-primary scale-105'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'}`, children: "\uD83D\uDCCC Pinned" }), _jsx("button", { onClick: () => setShowFavoritesOnly(!showFavoritesOnly), className: `px-3 py-1 text-xs rounded-full transition-all duration-200 ${showFavoritesOnly
                                    ? 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] scale-105'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'}`, children: "\u2B50 Favorites" })] }))] })), _jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx(AnimatePresence, { initial: false, children: filteredConversations.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full p-6 text-center", children: [_jsx("svg", { className: "w-12 h-12 text-muted-foreground/50 mb-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }), _jsx("p", { className: "text-sm text-muted-foreground", children: searchQuery
                                    ? 'No conversations found'
                                    : 'No conversations yet' }), onCreate && !searchQuery && (_jsx("button", { onClick: onCreate, className: "mt-3 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground text-sm rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5", children: "Start a conversation" }))] })) : (_jsx("div", { className: "divide-y divide-border", children: filteredConversations.map((conversation, index) => {
                            const isActive = activeId === conversation.id;
                            const isSelected = selectedIds.includes(conversation.id);
                            return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, x: -100, height: 0 }, transition: {
                                    duration: 0.2,
                                    delay: index * 0.05, // Stagger: 50ms between items
                                    ease: [0.4, 0, 0.2, 1],
                                }, whileHover: {
                                    y: -2,
                                    transition: { duration: 0.15 },
                                }, layout: true, onClick: () => handleSelect(conversation.id), className: `p-4 cursor-pointer transition-all duration-200 ${isActive
                                    ? 'bg-primary/10 border-l-4 border-primary'
                                    : isSelected
                                        ? 'bg-primary/5'
                                        : 'hover:bg-muted/50'}`, role: "button", tabIndex: 0, "aria-label": `Select conversation: ${conversation.title}`, children: _jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [multiSelect && (_jsx("input", { type: "checkbox", checked: isSelected, onChange: () => { }, className: "w-4 h-4 text-primary rounded", onClick: (e) => e.stopPropagation() })), _jsx("h3", { className: "text-sm font-medium text-foreground truncate", children: conversation.title }), conversation.isPinned && (_jsx("span", { className: "text-xs", children: "\uD83D\uDCCC" })), conversation.isFavorite && (_jsx("span", { className: "text-xs", children: "\u2B50" })), conversation.unreadCount &&
                                                            conversation.unreadCount > 0 && (_jsx("span", { className: "px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full shadow-sm", children: conversation.unreadCount }))] }), _jsx("p", { className: "text-xs text-muted-foreground truncate mb-1", children: conversation.preview }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground/80", children: [_jsx("span", { children: formatRelativeTime(conversation.timestamp) }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: [conversation.messageCount, " messages"] })] }), conversation.tags && conversation.tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: conversation.tags.map((tag) => (_jsx("span", { className: "px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded", children: tag }, tag))) }))] }), _jsxs("div", { className: "flex flex-col gap-1", onClick: (e) => e.stopPropagation(), children: [onTogglePin && (_jsx(motion.button, { onClick: () => onTogglePin(conversation.id), whileHover: {
                                                        scale: 1.2,
                                                        rotate: conversation.isPinned ? 0 : 15,
                                                    }, whileTap: { scale: 0.9 }, className: "p-1 hover:bg-muted rounded transition-colors duration-200", "aria-label": conversation.isPinned ? 'Unpin' : 'Pin', children: _jsx(motion.span, { className: "text-sm", animate: conversation.isPinned
                                                            ? { rotate: [0, -10, 10, -10, 0] }
                                                            : {}, transition: { duration: 0.5 }, children: conversation.isPinned ? '📌' : '📍' }) })), onToggleFavorite && (_jsx(motion.button, { onClick: () => onToggleFavorite(conversation.id), whileHover: { scale: 1.2 }, whileTap: { scale: 0.9 }, className: "p-1 hover:bg-muted rounded transition-colors duration-200", "aria-label": conversation.isFavorite
                                                        ? 'Unfavorite'
                                                        : 'Favorite', children: _jsx(motion.span, { className: "text-sm", animate: conversation.isFavorite
                                                            ? { scale: [1, 1.3, 1] }
                                                            : {}, transition: { duration: 0.3 }, children: conversation.isFavorite ? '⭐' : '☆' }) })), onDelete && (_jsx(motion.button, { onClick: () => onDelete(conversation.id), whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "p-1 hover:bg-destructive/10 rounded transition-all duration-200", "aria-label": "Delete conversation", children: _jsx("svg", { className: "w-4 h-4 text-destructive", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) }))] })] }) }, conversation.id));
                        }) })) }) }), _jsx("div", { className: "p-3 border-t border-border", children: _jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsxs("span", { children: [filteredConversations.length, " of ", conversations.length, ' ', "conversations"] }), multiSelect && selectedIds.length > 0 && (_jsxs("span", { className: "font-medium text-primary", children: [selectedIds.length, " selected"] }))] }) })] }));
}
//# sourceMappingURL=conversation-list.js.map
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Badge, cn, } from '@clarity-chat/primitives';
/**
 * Fuzzy search for users
 */
function fuzzySearch(query, text) {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    let queryIndex = 0;
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
        if (textLower[i] === queryLower[queryIndex]) {
            queryIndex++;
        }
    }
    return queryIndex === queryLower.length;
}
/**
 * MentionInput Component
 *
 * Input field with @mention autocomplete support.
 *
 * Features:
 * - @mention user autocomplete
 * - Fuzzy search for users
 * - Keyboard navigation (↑↓ Enter Escape)
 * - Visual mention highlighting
 * - Mention extraction
 *
 * @example
 * ```tsx
 * <MentionInput
 *   users={users}
 *   value={message}
 *   onChange={(value, mentions) => {
 *     setMessage(value)
 *     setMentions(mentions)
 *   }}
 *   onSubmit={() => sendMessage()}
 *   placeholder="Type @ to mention someone"
 * />
 * ```
 */
export function MentionInput({ users, value, onChange, onSubmit, placeholder = 'Type @ to mention...', disabled = false, mentionTrigger = '@', enableFuzzySearch = true, className, }) {
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState([]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [mentionStartPos, setMentionStartPos] = React.useState(-1);
    const [cursorPosition, setCursorPosition] = React.useState(0);
    const inputRef = React.useRef(null);
    const suggestionsRef = React.useRef(null);
    /**
     * Extract mentions from text
     */
    const extractMentions = React.useCallback((text) => {
        const mentions = [];
        const regex = new RegExp(`${mentionTrigger}(\\w+)`, 'g');
        let match;
        while ((match = regex.exec(text)) !== null) {
            const username = match[1];
            const user = users.find(u => u.username === username);
            if (user) {
                mentions.push({
                    id: `${user.id}-${match.index}`,
                    userId: user.id,
                    messageId: '', // Will be set when message is sent
                    position: match.index,
                    length: match[0].length,
                    isRead: false,
                    timestamp: Date.now(),
                });
            }
        }
        return mentions;
    }, [users, mentionTrigger]);
    /**
     * Handle input change
     */
    const handleChange = (e) => {
        const newValue = e.target.value;
        const cursorPos = e.target.selectionStart || 0;
        setCursorPosition(cursorPos);
        // Check if we should show mention suggestions
        const textBeforeCursor = newValue.slice(0, cursorPos);
        const lastMentionIndex = textBeforeCursor.lastIndexOf(mentionTrigger);
        if (lastMentionIndex !== -1) {
            const textAfterMention = textBeforeCursor.slice(lastMentionIndex + 1);
            // Only show if no whitespace after @
            if (!/\s/.test(textAfterMention)) {
                setMentionStartPos(lastMentionIndex);
                // Filter users
                const query = textAfterMention.toLowerCase();
                const filtered = users.filter(user => {
                    if (enableFuzzySearch) {
                        return (fuzzySearch(query, user.name) ||
                            fuzzySearch(query, user.username));
                    }
                    return (user.name.toLowerCase().includes(query) ||
                        user.username.toLowerCase().includes(query));
                });
                setSuggestions(filtered.slice(0, 10));
                setShowSuggestions(filtered.length > 0);
                setSelectedIndex(0);
            }
            else {
                setShowSuggestions(false);
            }
        }
        else {
            setShowSuggestions(false);
        }
        const mentions = extractMentions(newValue);
        onChange(newValue, mentions);
    };
    /**
     * Insert mention at cursor
     */
    const insertMention = React.useCallback((user) => {
        if (mentionStartPos === -1)
            return;
        const before = value.slice(0, mentionStartPos);
        const after = value.slice(cursorPosition);
        const mention = `${mentionTrigger}${user.username} `;
        const newValue = before + mention + after;
        const mentions = extractMentions(newValue);
        onChange(newValue, mentions);
        setShowSuggestions(false);
        setMentionStartPos(-1);
        // Focus input and set cursor position
        setTimeout(() => {
            if (inputRef.current) {
                const newCursorPos = mentionStartPos + mention.length;
                inputRef.current.focus();
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    }, [value, mentionStartPos, cursorPosition, mentionTrigger, extractMentions, onChange]);
    /**
     * Handle keyboard navigation
     */
    const handleKeyDown = (e) => {
        if (!showSuggestions) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit?.();
            }
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
            case 'Tab':
                e.preventDefault();
                if (suggestions[selectedIndex]) {
                    insertMention(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowSuggestions(false);
                break;
        }
    };
    // Scroll selected suggestion into view
    React.useEffect(() => {
        if (suggestionsRef.current) {
            const selected = suggestionsRef.current.children[selectedIndex];
            if (selected) {
                selected.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);
    return (_jsxs("div", { className: cn('relative', className), children: [_jsx("textarea", { ref: inputRef, value: value, onChange: handleChange, onKeyDown: handleKeyDown, placeholder: placeholder, disabled: disabled, className: "w-full min-h-[80px] px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent", rows: 3 }), _jsx(AnimatePresence, { children: showSuggestions && (_jsx(motion.div, { ref: suggestionsRef, initial: { opacity: 0, y: -10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -10, scale: 0.95 }, transition: { duration: 0.15 }, className: "absolute bottom-full mb-2 left-0 right-0 max-h-64 overflow-y-auto bg-background border rounded-lg shadow-lg z-50", children: suggestions.map((user, index) => (_jsxs("button", { onClick: () => insertMention(user), className: cn('w-full flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-left', index === selectedIndex && 'bg-accent'), children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium shrink-0", children: user.name[0].toUpperCase() }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-sm", children: user.name }), user.isOnline && (_jsx("span", { className: "w-2 h-2 rounded-full bg-green-500", title: "Online" }))] }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [mentionTrigger, user.username, user.role && ` • ${user.role}`] })] }), index === selectedIndex && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: "Enter" }))] }, user.id))) })) })] }));
}
MentionInput.displayName = 'MentionInput';
/**
 * MentionList Component
 *
 * Displays list of mentions for a user with filtering and navigation.
 *
 * @example
 * ```tsx
 * <MentionList
 *   mentions={mentions}
 *   messages={messagesMap}
 *   users={usersMap}
 *   currentUserId="user-123"
 *   onMentionClick={(mention) => {
 *     jumpToMessage(mention.messageId)
 *   }}
 *   onMarkAsRead={(mentionId) => {
 *     markMentionAsRead(mentionId)
 *   }}
 *   showOnlyUnread
 * />
 * ```
 */
export function MentionList({ mentions, messages, users, currentUserId, onMentionClick, onMarkAsRead, showOnlyUnread = false, className, }) {
    const [filter, setFilter] = React.useState('unread');
    // Filter mentions for current user
    const userMentions = React.useMemo(() => {
        let filtered = mentions.filter(m => {
            // Check if mention is for current user
            return m.userId === currentUserId;
        });
        if (filter === 'unread' || showOnlyUnread) {
            filtered = filtered.filter(m => !m.isRead);
        }
        // Sort by timestamp (newest first)
        return filtered.sort((a, b) => b.timestamp - a.timestamp);
    }, [mentions, currentUserId, filter, showOnlyUnread]);
    const unreadCount = mentions.filter(m => m.userId === currentUserId && !m.isRead).length;
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsx(Card, { className: "shadow-sm", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-sm", children: "Mentions" }), unreadCount > 0 && (_jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [unreadCount, " unread ", unreadCount === 1 ? 'mention' : 'mentions'] }))] }), !showOnlyUnread && (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setFilter('unread'), className: cn('px-3 py-1 text-xs rounded-lg transition-colors', filter === 'unread'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80'), children: "Unread" }), _jsx("button", { onClick: () => setFilter('all'), className: cn('px-3 py-1 text-xs rounded-lg transition-colors', filter === 'all'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80'), children: "All" })] }))] }) }) }), _jsxs("div", { className: "space-y-2", children: [_jsx(AnimatePresence, { mode: "popLayout", children: userMentions.map((mention, index) => {
                            const message = messages.get(mention.messageId);
                            const mentioner = users.get(mention.userId);
                            if (!message || !mentioner)
                                return null;
                            return (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { delay: index * 0.03 }, children: _jsx(Card, { className: cn('cursor-pointer transition-all hover:shadow-md', !mention.isRead && 'border-l-4 border-l-primary bg-accent/20'), onClick: () => onMentionClick?.(mention), children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium shrink-0", children: mentioner.name[0].toUpperCase() }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-medium text-sm", children: mentioner.name }), _jsx("span", { className: "text-xs text-muted-foreground", children: "mentioned you" }), !mention.isRead && (_jsx(Badge, { variant: "destructive", className: "text-xs", children: "New" }))] }), _jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: message.content }), _jsxs("div", { className: "flex items-center justify-between mt-2", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: new Date(message.timestamp).toLocaleString() }), !mention.isRead && (_jsx("button", { onClick: (e) => {
                                                                        e.stopPropagation();
                                                                        onMarkAsRead?.(mention.id);
                                                                    }, className: "text-xs text-primary hover:underline", children: "Mark as read" }))] })] })] }) }) }) }, mention.id));
                        }) }), userMentions.length === 0 && (_jsx(Card, { className: "shadow-sm", children: _jsx(CardContent, { className: "p-8 text-center text-muted-foreground", children: filter === 'unread' || showOnlyUnread
                                ? 'No unread mentions'
                                : 'No mentions yet' }) }))] })] }));
}
MentionList.displayName = 'MentionList';
/**
 * Hook to manage mentions
 */
export function useMentions() {
    const [mentions, setMentions] = React.useState([]);
    const addMention = React.useCallback((mention) => {
        setMentions(prev => [...prev, mention]);
    }, []);
    const markAsRead = React.useCallback((mentionId) => {
        setMentions(prev => prev.map(m => (m.id === mentionId ? { ...m, isRead: true } : m)));
    }, []);
    const getUnreadCount = React.useCallback((userId) => {
        return mentions.filter(m => m.userId === userId && !m.isRead).length;
    }, [mentions]);
    const getMentionsForUser = React.useCallback((userId) => {
        return mentions.filter(m => m.userId === userId);
    }, [mentions]);
    return {
        mentions,
        addMention,
        markAsRead,
        getUnreadCount,
        getMentionsForUser,
    };
}
//# sourceMappingURL=mention-system.js.map
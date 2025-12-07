'use client';
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, cn, } from '@clarity-chat/primitives';
const defaultConfig = {
    maxDepth: 2,
    showPreview: true,
    previewLength: 100,
    collapseThreshold: 5,
    notificationsEnabled: true,
};
/**
 * Format timestamp relative to now
 */
function formatRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60)
        return 'just now';
    if (minutes < 60)
        return `${minutes}m ago`;
    if (hours < 24)
        return `${hours}h ago`;
    if (days < 7)
        return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
}
/**
 * MessageThreadView Component
 *
 * Slack-style message threading for organized conversations.
 *
 * Features:
 * - Nested thread support (configurable depth)
 * - Thread preview in main view
 * - Thread participant list
 * - Unread count badges
 * - Thread notifications
 * - Thread search
 * - Thread archiving
 * - Inline or sidebar layout
 *
 * @example
 * ```tsx
 * <MessageThreadView
 *   parentMessage={message}
 *   thread={threads.get(message.id)}
 *   config={{
 *     maxDepth: 2,
 *     showPreview: true,
 *     collapseThreshold: 5,
 *   }}
 *   onSendMessage={(threadId, content) => {
 *     sendThreadMessage(threadId, content)
 *   }}
 *   onCreateThread={(parentId) => {
 *     createNewThread(parentId)
 *   }}
 *   layout="sidebar"
 * />
 * ```
 */
export function MessageThreadView({ parentMessage, thread, config: userConfig, onSendMessage, onCreateThread, onOpenThread, onCloseThread, onArchiveThread, currentUser, layout = 'inline', className, }) {
    const config = { ...defaultConfig, ...userConfig };
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [replyText, setReplyText] = React.useState('');
    const [isCollapsed, setIsCollapsed] = React.useState(thread && thread.messages.length > config.collapseThreshold);
    const hasThread = thread && thread.messages.length > 0;
    const messageCount = thread?.messages.length || 0;
    const participantCount = thread?.participants.length || 0;
    /**
     * Handle thread expansion
     */
    const handleExpand = React.useCallback(() => {
        setIsExpanded(true);
        if (thread) {
            onOpenThread?.(thread.id);
        }
    }, [thread, onOpenThread]);
    /**
     * Handle thread creation
     */
    const handleCreateThread = React.useCallback(() => {
        onCreateThread?.(parentMessage.id);
        setIsExpanded(true);
    }, [parentMessage.id, onCreateThread]);
    /**
     * Handle sending reply
     */
    const handleSendReply = React.useCallback(() => {
        if (replyText.trim() && thread) {
            onSendMessage?.(thread.id, replyText);
            setReplyText('');
        }
    }, [replyText, thread, onSendMessage]);
    /**
     * Handle thread archive
     */
    const handleArchive = React.useCallback(() => {
        if (thread) {
            onArchiveThread?.(thread.id);
            setIsExpanded(false);
        }
    }, [thread, onArchiveThread]);
    // Thread preview component
    const ThreadPreview = () => {
        if (!hasThread || !config.showPreview)
            return null;
        const lastMessage = thread.messages[thread.messages.length - 1];
        const preview = lastMessage.content.slice(0, config.previewLength);
        return (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "mt-2 p-3 border-l-2 border-primary/30 bg-accent/20 rounded-r-lg cursor-pointer hover:bg-accent/30 transition-colors", onClick: handleExpand, children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsxs(Badge, { variant: "secondary", className: "text-xs", children: [messageCount, " ", messageCount === 1 ? 'reply' : 'replies'] }), thread.unreadCount > 0 && (_jsxs(Badge, { variant: "destructive", className: "text-xs", children: [thread.unreadCount, " new"] })), _jsx("span", { className: "text-xs text-muted-foreground", children: formatRelativeTime(thread.lastActivity) })] }), _jsxs("div", { className: "text-sm text-muted-foreground line-clamp-2", children: [preview, lastMessage.content.length > config.previewLength && '...'] }), participantCount > 1 && (_jsxs("div", { className: "flex items-center gap-1 mt-2", children: [_jsxs("span", { className: "text-xs text-muted-foreground", children: [participantCount, " ", participantCount === 1 ? 'participant' : 'participants'] }), thread.participants.slice(0, 3).map((participant) => (_jsx("div", { className: "w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs", title: participant.name, children: participant.name[0].toUpperCase() }, participant.id)))] }))] }));
    };
    // Expanded thread view
    const ExpandedThread = () => {
        if (!isExpanded || !thread)
            return null;
        return (_jsxs(motion.div, { initial: { opacity: 0, x: layout === 'sidebar' ? 300 : 0, y: layout === 'inline' ? 20 : 0 }, animate: { opacity: 1, x: 0, y: 0 }, exit: { opacity: 0, x: layout === 'sidebar' ? 300 : 0, y: layout === 'inline' ? 20 : 0 }, className: cn(layout === 'sidebar' && 'fixed right-0 top-0 bottom-0 w-96 bg-background border-l shadow-lg z-50 flex flex-col', layout === 'inline' && 'mt-4 border rounded-lg bg-accent/10'), children: [_jsxs("div", { className: "border-b p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-sm", children: "Thread" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [messageCount, " ", messageCount === 1 ? 'reply' : 'replies'] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: handleArchive, className: "h-8 w-8", title: "Archive thread", children: _jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" }) }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
                                                setIsExpanded(false);
                                                onCloseThread?.(thread.id);
                                            }, className: "h-8 w-8", children: "\u2715" })] })] }), _jsxs("div", { className: "p-2 bg-muted rounded-lg text-sm", children: [_jsx("div", { className: "font-medium text-xs text-muted-foreground mb-1", children: "Original message:" }), _jsx("div", { className: "line-clamp-2", children: parentMessage.content })] }), participantCount > 0 && (_jsxs("div", { className: "flex items-center gap-2 mt-3", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Participants:" }), _jsx("div", { className: "flex -space-x-2", children: thread.participants.map((participant) => (_jsx("div", { className: "w-7 h-7 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium", title: participant.name, children: participant.name[0].toUpperCase() }, participant.id))) })] }))] }), _jsxs("div", { className: cn('flex-1 overflow-y-auto p-4 space-y-3', layout === 'inline' && 'max-h-96'), children: [_jsx(AnimatePresence, { children: isCollapsed ? (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => setIsCollapsed(false), className: "w-full", children: ["Show ", messageCount - 2, " more ", messageCount - 2 === 1 ? 'message' : 'messages'] })) : (thread.messages.map((message, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { delay: index * 0.05 }, className: cn('p-3 rounded-lg', message.role === 'user' ? 'bg-primary/10 ml-4' : 'bg-muted mr-4'), children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "text-xs font-medium", children: thread.participants.find(p => p.role === message.role)?.name || message.role }), _jsx("span", { className: "text-xs text-muted-foreground", children: formatRelativeTime(Date.now() - (thread.messages.length - index) * 60000) })] }), _jsx("div", { className: "text-sm", children: message.content })] }, message.id)))) }), isCollapsed && thread.messages.length > config.collapseThreshold && (_jsx("div", { className: "text-center", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsCollapsed(false), className: "text-xs", children: "Show all messages" }) }))] }), _jsx("div", { className: "border-t p-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: replyText, onChange: (e) => setReplyText(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSendReply(), placeholder: "Reply to thread...", className: "flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent" }), _jsx(Button, { onClick: handleSendReply, disabled: !replyText.trim(), size: "sm", children: "Send" })] }) })] }));
    };
    return (_jsxs("div", { className: cn('relative', className), children: [!isExpanded && (_jsx(_Fragment, { children: hasThread ? (_jsx(ThreadPreview, {})) : (_jsxs(Button, { variant: "ghost", size: "sm", onClick: handleCreateThread, className: "mt-2 text-xs", children: [_jsx("svg", { className: "h-4 w-4 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }), "Reply in thread"] })) })), _jsx(AnimatePresence, { children: _jsx(ExpandedThread, {}) })] }));
}
MessageThreadView.displayName = 'MessageThreadView';
/**
 * ThreadList Component
 *
 * Displays a list of all threads for navigation.
 *
 * @example
 * ```tsx
 * <ThreadList
 *   threads={Array.from(threads.values())}
 *   parentMessages={parentMessages}
 *   onSelectThread={(threadId) => {
 *     setSelectedThread(threadId)
 *   }}
 *   selectedThreadId={selectedThread}
 * />
 * ```
 */
export function ThreadList({ threads, parentMessages, config: userConfig, onSelectThread, selectedThreadId, showArchived = false, className, }) {
    const config = { ...defaultConfig, ...userConfig };
    const [searchQuery, setSearchQuery] = React.useState('');
    const [sortBy, setSortBy] = React.useState('activity');
    // Filter and sort threads
    const processedThreads = React.useMemo(() => {
        let filtered = threads;
        // Filter by archived status
        if (!showArchived) {
            filtered = filtered.filter(t => !t.isArchived);
        }
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(thread => {
                const parentMessage = parentMessages.get(thread.parentMessageId);
                return (parentMessage?.content.toLowerCase().includes(query) ||
                    thread.messages.some(m => m.content.toLowerCase().includes(query)));
            });
        }
        // Sort
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'activity':
                    return b.lastActivity - a.lastActivity;
                case 'unread':
                    return b.unreadCount - a.unreadCount;
                case 'participants':
                    return b.participants.length - a.participants.length;
                default:
                    return 0;
            }
        });
        return sorted;
    }, [threads, showArchived, searchQuery, sortBy, parentMessages]);
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsxs(Card, { className: "shadow-sm", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-base", children: "Threads" }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [processedThreads.length, " active ", processedThreads.length === 1 ? 'thread' : 'threads'] })] }), _jsx("div", { className: "flex gap-2", children: _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "text-xs border rounded px-2 py-1", children: [_jsx("option", { value: "activity", children: "Recent" }), _jsx("option", { value: "unread", children: "Unread" }), _jsx("option", { value: "participants", children: "Most Active" })] }) })] }) }), _jsx(CardContent, { children: _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search threads...", className: "w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent" }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(AnimatePresence, { mode: "popLayout", children: processedThreads.map((thread, index) => {
                            const parentMessage = parentMessages.get(thread.parentMessageId);
                            if (!parentMessage)
                                return null;
                            const isSelected = thread.id === selectedThreadId;
                            return (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { delay: index * 0.03 }, children: _jsx(Card, { className: cn('cursor-pointer transition-all hover:shadow-md', isSelected && 'ring-2 ring-primary'), onClick: () => onSelectThread?.(thread.id), children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm font-medium line-clamp-1 mb-1", children: parentMessage.content }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [thread.messages[thread.messages.length - 1]?.content.slice(0, 60), thread.messages[thread.messages.length - 1]?.content.length > 60 && '...'] })] }), thread.unreadCount > 0 && (_jsx(Badge, { variant: "destructive", className: "ml-2", children: thread.unreadCount }))] }), _jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: "secondary", className: "text-xs", children: [thread.messages.length, " replies"] }), _jsxs("span", { children: [thread.participants.length, " participants"] })] }), _jsx("span", { children: formatRelativeTime(thread.lastActivity) })] })] }) }) }, thread.id));
                        }) }), processedThreads.length === 0 && (_jsx(Card, { className: "shadow-sm", children: _jsx(CardContent, { className: "p-8 text-center text-muted-foreground", children: searchQuery ? 'No threads found' : 'No active threads' }) }))] })] }));
}
ThreadList.displayName = 'ThreadList';
//# sourceMappingURL=message-thread-view.js.map
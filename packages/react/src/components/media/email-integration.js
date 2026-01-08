'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Badge, Button, cn } from '@clarity-chat/primitives';
import { RefreshIcon, CloseIcon } from '../ui/icons';
import { useIsMounted } from '../../hooks/ui/use-is-mounted';
/**
 * Provider configuration
 */
const PROVIDER_CONFIG = {
    gmail: { name: 'Gmail', icon: '📧', color: '#EA4335' },
    outlook: { name: 'Outlook', icon: '📬', color: '#0078D4' },
    yahoo: { name: 'Yahoo', icon: '📩', color: '#6001D2' },
    imap: { name: 'IMAP', icon: '📮', color: '#6B7280' },
    exchange: { name: 'Exchange', icon: '📨', color: '#0078D4' },
};
/**
 * Format timestamp
 */
function formatTimestamp(date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const dayInMs = 24 * 60 * 60 * 1000;
    if (diff < dayInMs) {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    }
    if (diff < 7 * dayInMs) {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
        }).format(date);
    }
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
    }).format(date);
}
/**
 * Get participant display name
 */
function getParticipantName(participant) {
    return participant.name || participant.email.split('@')[0];
}
/**
 * Get thread participants display
 */
function getParticipantsDisplay(participants) {
    const others = participants.filter((p) => !p.isMe);
    if (others.length === 0)
        return 'Me';
    if (others.length === 1)
        return getParticipantName(others[0]);
    if (others.length === 2)
        return `${getParticipantName(others[0])}, ${getParticipantName(others[1])}`;
    return `${getParticipantName(others[0])} +${others.length - 1}`;
}
/**
 * EmailIntegration Component
 *
 * Email integration for:
 * - Viewing email threads
 * - Sending and replying to emails
 * - Managing notifications
 * - Email digests
 */
export function EmailIntegration({ accounts = [], initialThreads = [], showAccountSelector = true, showNotifications = true, maxThreads = 20, onThreadSelect, onSendEmail: _onSendEmail, onReply, fetchThreads, fetchMessages, markAsRead, className, ref, ...props }) {
    const isMounted = useIsMounted();
    const [state, setState] = React.useState({
        accounts,
        threads: initialThreads,
        notifications: [],
        loading: false,
        error: null,
        syncing: false,
    });
    const [selectedAccount, setSelectedAccount] = React.useState(accounts.length > 0 ? accounts[0].id : null);
    const [selectedThread, setSelectedThread] = React.useState(null);
    const [replyText, setReplyText] = React.useState('');
    // Clear error helper
    const clearError = React.useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);
    // Clear reply text when thread changes
    React.useEffect(() => {
        setReplyText('');
    }, [selectedThread?.id]);
    // Load threads
    const loadThreads = React.useCallback(async () => {
        if (!fetchThreads)
            return;
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const threads = await fetchThreads(selectedAccount || undefined);
            if (isMounted.current) {
                setState((prev) => ({
                    ...prev,
                    threads: threads.slice(0, maxThreads),
                    loading: false,
                }));
            }
        }
        catch (error) {
            if (isMounted.current) {
                setState((prev) => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Failed to load emails',
                    loading: false,
                }));
            }
        }
    }, [fetchThreads, selectedAccount, maxThreads, isMounted]);
    // Select thread and load messages
    const selectThread = React.useCallback(async (thread) => {
        setSelectedThread(thread);
        onThreadSelect?.(thread);
        // Mark as read
        if (thread.unread && markAsRead) {
            try {
                await markAsRead(thread.id);
                if (isMounted.current) {
                    setState((prev) => ({
                        ...prev,
                        threads: prev.threads.map((t) => t.id === thread.id ? { ...t, unread: false } : t),
                    }));
                }
            }
            catch {
                // Silently fail for mark as read
            }
        }
        // Load full messages if needed
        if (fetchMessages && !thread.messages) {
            try {
                const messages = await fetchMessages(thread.id);
                if (isMounted.current) {
                    setSelectedThread((prev) => (prev ? { ...prev, messages } : null));
                }
            }
            catch {
                // Failed to load messages, keep thread selected without full messages
            }
        }
    }, [onThreadSelect, markAsRead, fetchMessages, isMounted]);
    // Send reply
    const sendReply = React.useCallback(async () => {
        if (!selectedThread || !onReply || !replyText.trim())
            return;
        setState((prev) => ({ ...prev, syncing: true }));
        try {
            const message = await onReply(selectedThread.id, replyText);
            if (isMounted.current) {
                setSelectedThread((prev) => prev
                    ? {
                        ...prev,
                        messages: [...(prev.messages || []), message],
                        messageCount: prev.messageCount + 1,
                        lastMessageAt: message.timestamp,
                    }
                    : null);
                setReplyText('');
            }
        }
        catch (error) {
            if (isMounted.current) {
                setState((prev) => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Failed to send reply',
                }));
            }
        }
        finally {
            if (isMounted.current) {
                setState((prev) => ({ ...prev, syncing: false }));
            }
        }
    }, [selectedThread, onReply, replyText, isMounted]);
    // Load threads on mount and account change
    React.useEffect(() => {
        if (fetchThreads) {
            loadThreads();
        }
    }, [loadThreads, fetchThreads]);
    // Calculate unread count
    const unreadCount = React.useMemo(() => {
        return state.threads.filter((t) => t.unread).length;
    }, [state.threads]);
    return (_jsxs("div", { ref: ref, className: cn('space-y-4', className), role: "region", "aria-label": "Email integration", ...props, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-semibold", children: "Email" }), unreadCount > 0 && (_jsx(Badge, { variant: "default", "aria-label": `${unreadCount} unread emails`, children: unreadCount }))] }), _jsx("div", { className: "flex items-center gap-2", children: fetchThreads && (_jsx(Button, { variant: "ghost", size: "sm", onClick: loadThreads, disabled: state.loading, "aria-label": "Refresh emails", children: _jsx(RefreshIcon, { className: cn('w-4 h-4', state.loading && 'animate-spin') }) })) })] }), showAccountSelector && state.accounts.length > 1 && (_jsx("div", { className: "flex flex-wrap gap-2", role: "tablist", "aria-label": "Email accounts", children: state.accounts.map((account) => {
                    const config = PROVIDER_CONFIG[account.provider];
                    return (_jsxs(Button, { variant: selectedAccount === account.id ? 'default' : 'outline', size: "sm", onClick: () => setSelectedAccount(account.id), className: "gap-2", role: "tab", "aria-selected": selectedAccount === account.id, "aria-label": `Select ${account.email}`, children: [_jsx("span", { "aria-hidden": "true", children: config.icon }), _jsx("span", { children: account.email }), account.unreadCount && account.unreadCount > 0 && (_jsx(Badge, { variant: "secondary", className: "ml-1", children: account.unreadCount }))] }, account.id));
                }) })), state.error && (_jsxs("div", { className: "p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center justify-between", role: "alert", children: [_jsx("span", { children: state.error }), _jsx(Button, { variant: "ghost", size: "sm", onClick: clearError, "aria-label": "Dismiss error", className: "ml-2 h-6 w-6 p-0", children: _jsx(CloseIcon, { className: "w-4 h-4" }) })] })), selectedThread ? (
            /* Thread view */
            _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: selectedThread.subject }), _jsxs("div", { className: "text-sm text-muted-foreground", children: [getParticipantsDisplay(selectedThread.participants), ' - ', selectedThread.messageCount, " message", selectedThread.messageCount !== 1 ? 's' : ''] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedThread(null), "aria-label": "Close thread", children: _jsx(CloseIcon, { className: "w-4 h-4" }) })] }), _jsx("div", { className: "space-y-4 max-h-[400px] overflow-y-auto", children: _jsx(AnimatePresence, { children: selectedThread.messages?.map((message, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "border-l-2 border-muted pl-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-sm font-medium", children: message.from.isMe
                                                        ? 'Me'
                                                        : getParticipantName(message.from) }), _jsx("span", { className: "text-xs text-muted-foreground", children: formatTimestamp(message.timestamp) })] }), _jsx("div", { className: "text-sm whitespace-pre-wrap", children: message.body }), message.attachments && message.attachments.length > 0 && (_jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: message.attachments.map((attachment) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: attachment.filename }, attachment.id))) }))] }, message.id))) }) }), onReply && (_jsxs("div", { className: "mt-4 pt-4 border-t border-muted", children: [_jsx("textarea", { value: replyText, onChange: (e) => setReplyText(e.target.value), placeholder: "Write a reply...", "aria-label": "Reply message", className: "w-full min-h-[80px] p-2 border border-input bg-background text-foreground rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground" }), _jsx("div", { className: "flex justify-end mt-2", children: _jsx(Button, { onClick: sendReply, disabled: !replyText.trim() || state.syncing, "aria-label": state.syncing ? 'Sending reply' : 'Send reply', children: state.syncing ? 'Sending...' : 'Send Reply' }) })] }))] }) })) : (
            /* Thread list */
            _jsxs(_Fragment, { children: [state.loading && (_jsx("div", { className: "flex items-center justify-center p-8", children: _jsx(RefreshIcon, { className: "w-6 h-6 animate-spin text-muted-foreground" }) })), !state.loading && state.threads.length > 0 && (_jsx(Card, { children: _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "divide-y", children: _jsx(AnimatePresence, { children: state.threads.map((thread, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { delay: index * 0.02 }, className: cn('flex items-start gap-3 p-3 hover:bg-accent/50 cursor-pointer transition-colors', thread.unread && 'bg-primary/5'), onClick: () => selectThread(thread), children: [_jsx("div", { className: cn('w-2 h-2 rounded-full mt-2 shrink-0', thread.unread ? 'bg-primary' : 'bg-transparent') }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("span", { className: cn('truncate', thread.unread && 'font-semibold'), children: getParticipantsDisplay(thread.participants) }), _jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: formatTimestamp(thread.lastMessageAt) })] }), _jsx("div", { className: cn('text-sm truncate', thread.unread
                                                            ? 'text-foreground'
                                                            : 'text-muted-foreground'), children: thread.subject }), _jsx("div", { className: "text-xs text-muted-foreground truncate", children: thread.snippet }), thread.labels.length > 0 && (_jsx("div", { className: "flex gap-1 mt-1", children: thread.labels.slice(0, 3).map((label) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: label }, label))) }))] }), thread.messageCount > 1 && (_jsx(Badge, { variant: "secondary", className: "shrink-0", children: thread.messageCount }))] }, thread.id))) }) }) }) })), !state.loading && state.threads.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center p-8 text-center", children: [_jsx("span", { className: "text-4xl mb-3", children: "\uD83D\uDCED" }), _jsx("div", { className: "text-muted-foreground", children: "No emails found" })] }))] })), showNotifications && state.notifications.length > 0 && (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsx("div", { className: "text-sm font-medium mb-3", children: "Notifications" }), _jsx("div", { className: "space-y-2", children: state.notifications.slice(0, 5).map((notification, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, className: cn('p-2 rounded-lg text-sm', notification.read ? 'bg-muted/50' : 'bg-primary/10'), children: [_jsx("div", { className: "font-medium", children: notification.title }), _jsx("div", { className: "text-xs text-muted-foreground", children: notification.body })] }, notification.id))) })] }) }))] }));
}
// Display name for debugging
EmailIntegration.displayName = 'EmailIntegration';
/**
 * Hook for email integration
 */
export function useEmailIntegration(options) {
    const [threads, setThreads] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    // Fetch threads
    const fetchThreads = React.useCallback(async (accountId) => {
        if (!options.apiEndpoint)
            return [];
        const targetAccount = accountId || options.accountId;
        setLoading(true);
        setError(null);
        try {
            const params = targetAccount ? `?accountId=${targetAccount}` : '';
            const response = await fetch(`${options.apiEndpoint}/threads${params}`, {
                headers: options.apiKey
                    ? { Authorization: `Bearer ${options.apiKey}` }
                    : {},
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            const fetchedThreads = (data.threads || []).map((t) => ({
                ...t,
                lastMessageAt: new Date(t.lastMessageAt),
            }));
            setThreads(fetchedThreads);
            return fetchedThreads;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch threads';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [options.apiEndpoint, options.apiKey, options.accountId]);
    // Fetch messages for a thread
    const fetchMessages = React.useCallback(async (threadId) => {
        if (!options.apiEndpoint)
            return [];
        const response = await fetch(`${options.apiEndpoint}/threads/${threadId}/messages`, {
            headers: options.apiKey
                ? { Authorization: `Bearer ${options.apiKey}` }
                : {},
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return (data.messages || []).map((m) => ({
            ...m,
            timestamp: new Date(m.timestamp),
        }));
    }, [options.apiEndpoint, options.apiKey]);
    // Send email
    const sendEmail = React.useCallback(async (message) => {
        if (!options.apiEndpoint) {
            throw new Error('No API endpoint configured');
        }
        const response = await fetch(`${options.apiEndpoint}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(options.apiKey
                    ? { Authorization: `Bearer ${options.apiKey}` }
                    : {}),
            },
            body: JSON.stringify(message),
        });
        if (!response.ok) {
            throw new Error(`Failed to send email: HTTP ${response.status}`);
        }
        return await response.json();
    }, [options.apiEndpoint, options.apiKey]);
    // Reply to thread
    const replyToThread = React.useCallback(async (threadId, body) => {
        if (!options.apiEndpoint) {
            throw new Error('No API endpoint configured');
        }
        const response = await fetch(`${options.apiEndpoint}/threads/${threadId}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(options.apiKey
                    ? { Authorization: `Bearer ${options.apiKey}` }
                    : {}),
            },
            body: JSON.stringify({ body }),
        });
        if (!response.ok) {
            throw new Error(`Failed to send reply: HTTP ${response.status}`);
        }
        return await response.json();
    }, [options.apiEndpoint, options.apiKey]);
    // Mark thread as read
    const markAsRead = React.useCallback(async (threadId) => {
        if (!options.apiEndpoint)
            return;
        await fetch(`${options.apiEndpoint}/threads/${threadId}/read`, {
            method: 'POST',
            headers: options.apiKey
                ? { Authorization: `Bearer ${options.apiKey}` }
                : {},
        });
        setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, unread: false } : t)));
    }, [options.apiEndpoint, options.apiKey]);
    // Search emails
    const searchEmails = React.useCallback(async (query) => {
        if (!options.apiEndpoint)
            return [];
        const response = await fetch(`${options.apiEndpoint}/search?q=${encodeURIComponent(query)}`, {
            headers: options.apiKey
                ? { Authorization: `Bearer ${options.apiKey}` }
                : {},
        });
        if (!response.ok) {
            throw new Error(`Search failed: HTTP ${response.status}`);
        }
        const data = await response.json();
        return data.threads || [];
    }, [options.apiEndpoint, options.apiKey]);
    return {
        threads,
        loading,
        error,
        fetchThreads,
        fetchMessages,
        sendEmail,
        replyToThread,
        markAsRead,
        searchEmails,
    };
}
//# sourceMappingURL=email-integration.js.map
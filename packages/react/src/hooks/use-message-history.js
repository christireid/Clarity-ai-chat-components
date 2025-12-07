'use client';
import * as React from 'react';
import { useConversationStorage } from './use-indexed-db';
/**
 * Message History Hook
 *
 * Provides comprehensive message history management with:
 * - Persistence (IndexedDB/localStorage)
 * - Pagination for large conversations
 * - Search and filtering
 * - Date range queries
 * - Session restoration
 *
 * Features from blueprint:
 * - Message History & Persistence
 * - Session restoration after browser restart
 * - Cross-device synchronization capabilities
 * - Automatic cleanup of old conversations
 *
 * @example
 * ```tsx
 * const {
 *   messages,
 *   paginatedMessages,
 *   search,
 *   save,
 *   load
 * } = useMessageHistory({
 *   conversationId: 'conv-123',
 *   enablePagination: true,
 *   pageSize: 50,
 *   autoSave: true,
 * })
 * ```
 */
export function useMessageHistory(options) {
    const { conversationId, initialMessages = [], autoSave = true, saveInterval = 5000, maxHistorySize = 10000, enablePagination = false, pageSize = 50, } = options;
    const [messages, setMessages] = React.useState(initialMessages);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    // Track mounted state to prevent state updates after unmount
    const mountedRef = React.useRef(true);
    React.useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);
    const { saveConversation, loadConversation, isAvailable } = useConversationStorage({
        maxMessages: maxHistorySize,
        autoCleanup: true,
    });
    // Calculate pagination (ensure pageSize >= 1 to prevent division by zero)
    const safePageSize = Math.max(1, pageSize);
    const totalPages = enablePagination ? Math.ceil(messages.length / safePageSize) : 1;
    const paginatedMessages = React.useMemo(() => {
        if (!enablePagination)
            return messages;
        const start = (currentPage - 1) * safePageSize;
        const end = start + safePageSize;
        return messages.slice(start, end);
    }, [messages, currentPage, safePageSize, enablePagination]);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    // Use ref to avoid excessive saves when messages array reference changes
    const messagesRef = React.useRef(messages);
    React.useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);
    // Auto-save functionality
    React.useEffect(() => {
        if (!autoSave || !isAvailable)
            return;
        const interval = setInterval(() => {
            // Use ref to get latest messages without re-creating interval
            saveConversation(conversationId, messagesRef.current).catch((err) => {
                console.error('Auto-save failed:', err);
            });
        }, saveInterval);
        return () => clearInterval(interval);
    }, [autoSave, saveInterval, conversationId, saveConversation, isAvailable]);
    // Load function will be defined later, use ref for early effect
    const loadRef = React.useRef(null);
    const goToPage = React.useCallback((page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);
    const nextPage = React.useCallback(() => {
        if (hasNextPage) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [hasNextPage]);
    const prevPage = React.useCallback(() => {
        if (hasPrevPage) {
            setCurrentPage((prev) => prev - 1);
        }
    }, [hasPrevPage]);
    const loadOlder = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // In a real implementation, this would fetch older messages from the server
            // For now, we'll just simulate loading
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (!mountedRef.current)
                return;
            setIsLoading(false);
        }
        catch (err) {
            if (!mountedRef.current)
                return;
            setError(err);
            setIsLoading(false);
        }
    }, []);
    const loadNewer = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // In a real implementation, this would fetch newer messages from the server
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (!mountedRef.current)
                return;
            setIsLoading(false);
        }
        catch (err) {
            if (!mountedRef.current)
                return;
            setError(err);
            setIsLoading(false);
        }
    }, []);
    const search = React.useCallback((query) => {
        if (!query.trim())
            return messages;
        const lowerQuery = query.toLowerCase();
        return messages.filter((msg) => {
            return (msg.content.toLowerCase().includes(lowerQuery) ||
                msg.id.toLowerCase().includes(lowerQuery) ||
                (msg.role && msg.role.toLowerCase().includes(lowerQuery)));
        });
    }, [messages]);
    const filter = React.useCallback((predicate) => {
        return messages.filter(predicate);
    }, [messages]);
    const getByDateRange = React.useCallback((start, end) => {
        return messages.filter((msg) => {
            const msgDate = new Date(msg.createdAt);
            return msgDate >= start && msgDate <= end;
        });
    }, [messages]);
    const save = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await saveConversation(conversationId, messages);
            if (!mountedRef.current)
                return;
            setIsLoading(false);
        }
        catch (err) {
            if (!mountedRef.current)
                return;
            setError(err);
            setIsLoading(false);
            throw err;
        }
    }, [conversationId, messages, saveConversation]);
    const load = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const loaded = await loadConversation(conversationId);
            // Only update state if still mounted (prevents state update after unmount)
            if (!mountedRef.current)
                return;
            if (loaded) {
                setMessages(loaded);
            }
            setIsLoading(false);
        }
        catch (err) {
            if (!mountedRef.current)
                return;
            setError(err);
            setIsLoading(false);
        }
    }, [conversationId, loadConversation]);
    // Use useLayoutEffect to ensure ref is always up-to-date before useEffect runs
    // This prevents stale closures when the load effect runs
    React.useLayoutEffect(() => {
        loadRef.current = load;
    }, [load]);
    // Load from storage on mount
    React.useEffect(() => {
        if (isAvailable && conversationId && loadRef.current) {
            loadRef.current();
        }
    }, [conversationId, isAvailable]); // load accessed via ref
    const clear = React.useCallback(async () => {
        if (!mountedRef.current)
            return;
        setIsLoading(true);
        setError(null);
        try {
            setMessages([]);
            setCurrentPage(1);
            // Optionally clear from storage
            setIsLoading(false);
        }
        catch (err) {
            if (!mountedRef.current)
                return;
            setError(err);
            setIsLoading(false);
        }
    }, []);
    return {
        messages,
        currentPage,
        totalPages,
        paginatedMessages,
        goToPage,
        nextPage,
        prevPage,
        hasNextPage,
        hasPrevPage,
        loadOlder,
        loadNewer,
        search,
        filter,
        getByDateRange,
        save,
        load,
        clear,
        isLoading,
        error,
    };
}
//# sourceMappingURL=use-message-history.js.map
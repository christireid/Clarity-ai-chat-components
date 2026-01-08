import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Memory Provider & Hooks
 *
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Memory & Context
 *
 * React integration for AI Memory & Context system.
 * This is a React wrapper around the framework-agnostic @clarity-chat/memory package.
 *
 * For non-React usage, import directly from @clarity-chat/memory.
 *
 * @example
 * ```tsx
 * // Wrap your app with MemoryProvider
 * <MemoryProvider config={{ maxTokens: 10000 }}>
 *   <YourChat />
 * </MemoryProvider>
 *
 * // Use memory in components
 * const memory = useMemoryContext()
 * await memory?.addMemory('User prefers dark mode', 'preference', 'user')
 * ```
 */
import * as React from 'react';
import { MemoryService } from '@clarity-chat/memory';
export const MemoryContext = React.createContext(null);
/**
 * MemoryProvider - Top-Level Memory Context Provider
 *
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Memory & Context
 *
 * Provides memory context to all child components. Wrap your app or chat
 * component with this provider to enable memory functionality.
 *
 * @example
 * ```tsx
 * <MemoryProvider config={{ maxTokens: 10000 }}>
 *   <ClarityChat api="/api/chat" memory={{ enabled: true }} />
 * </MemoryProvider>
 * ```
 *
 * @example
 * ```tsx
 * // With vector store
 * <MemoryProvider
 *   config={{ maxTokens: 10000 }}
 *   vectorStore={myVectorStore}
 * >
 *   <YourApp />
 * </MemoryProvider>
 * ```
 */
export const MemoryProvider = ({ children, config, vectorStore, embeddings, autoStart = true, }) => {
    const [service, setService] = React.useState(null);
    const [isInitialized, setIsInitialized] = React.useState(false);
    // Initialize service
    React.useEffect(() => {
        if (!autoStart)
            return;
        const memoryService = new MemoryService(config, vectorStore, embeddings);
        setService(memoryService);
        setIsInitialized(true);
        return () => {
            memoryService.stop();
        };
    }, [config, vectorStore, embeddings, autoStart]);
    const addMemory = React.useCallback(async (content, type, scope, metadata, options) => {
        if (!service) {
            throw new Error('Memory service not initialized');
        }
        return service.addMemory(content, type, scope, metadata, options);
    }, [service]);
    const query = React.useCallback(async (query) => {
        if (!service) {
            throw new Error('Memory service not initialized');
        }
        return service.query(query);
    }, [service]);
    const updateMemory = React.useCallback(async (id, updates) => {
        if (!service) {
            throw new Error('Memory service not initialized');
        }
        return service.updateMemory(id, updates);
    }, [service]);
    const deleteMemory = React.useCallback(async (id) => {
        if (!service) {
            throw new Error('Memory service not initialized');
        }
        return service.deleteMemory(id);
    }, [service]);
    const promoteMemory = React.useCallback(async (id, targetScope) => {
        if (!service) {
            throw new Error('Memory service not initialized');
        }
        return service.promoteMemory(id, targetScope);
    }, [service]);
    const compressMemory = React.useCallback(async (id, ratio) => {
        if (!service) {
            throw new Error('Memory service not initialized');
        }
        return service.compressMemory(id, ratio);
    }, [service]);
    const getStats = React.useCallback(() => {
        if (!service) {
            return {
                total: 0,
                byType: {},
                byScope: {},
                byPriority: {},
                totalTokens: 0,
                averageConfidence: 0,
            };
        }
        return service.getStats();
    }, [service]);
    const getContext = React.useCallback(() => {
        if (!service) {
            throw new Error('Memory service not initialized');
        }
        return service.getMemoryContext();
    }, [service]);
    const subscribe = React.useCallback((eventType, listener) => {
        if (!service) {
            return () => { };
        }
        service.on(eventType, listener);
        return () => {
            service.off(eventType, listener);
        };
    }, [service]);
    const value = {
        service,
        isInitialized,
        addMemory,
        query,
        updateMemory,
        deleteMemory,
        promoteMemory,
        compressMemory,
        getStats,
        getContext,
        subscribe,
    };
    return (_jsx(MemoryContext.Provider, { value: value, children: children }));
};
/**
 * useMemory - Mid-Level Memory Hook
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Memory & Context
 *
 * Hook to access memory context. Must be used within a MemoryProvider.
 *
 * For top-level usage, use MemoryProvider directly.
 * For query-specific hooks, use `useMemoryQuery` instead.
 *
 * @returns Memory context value with all memory operations
 *
 * @example
 * ```tsx
 * const memory = useMemory()
 *
 * // Add memory
 * await memory.addMemory('User prefers dark mode', 'preference', 'user')
 *
 * // Query memory
 * const results = await memory.query({ text: 'user preferences' })
 *
 * // Get stats
 * const stats = memory.getStats()
 * ```
 *
 * @throws {Error} If used outside MemoryProvider
 */
export function useMemory() {
    const context = React.useContext(MemoryContext);
    if (!context) {
        throw new Error('useMemory must be used within a MemoryProvider.\n\n' +
            'Wrap your component tree with MemoryProvider:\n' +
            '  <MemoryProvider config={{ maxTokens: 10000 }}>\n' +
            '    <YourComponent />\n' +
            '  </MemoryProvider>\n\n' +
            'For more help, see: https://clarity-chat.dev/docs/memory');
    }
    return context;
}
/**
 * useMemoryQuery - Mid-Level Memory Query Hook
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Memory & Context
 *
 * Hook for querying memory with automatic refetching and loading states.
 * Must be used within a MemoryProvider.
 *
 * @param query - Memory query object
 * @param options - Query options
 * @param options.enabled - Whether query is enabled (default: true)
 * @param options.refetchInterval - Auto-refetch interval in ms (optional)
 * @returns Query state with data, loading, error, and refetch function
 *
 * @example
 * ```tsx
 * const { data, isLoading, refetch } = useMemoryQuery(
 *   { text: 'user preferences' },
 *   { refetchInterval: 5000 }
 * )
 *
 * if (isLoading) return <div>Loading...</div>
 * return <div>{data.length} memories found</div>
 * ```
 *
 * @throws {Error} If used outside MemoryProvider
 */
export function useMemoryQuery(query, options = {}) {
    const { query: queryMemory } = useMemory();
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const refetch = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const results = await queryMemory(query);
            setData(results);
        }
        catch (err) {
            setError(err);
        }
        finally {
            setIsLoading(false);
        }
    }, [query, queryMemory]);
    React.useEffect(() => {
        if (options.enabled !== false) {
            refetch();
        }
    }, [query, refetch, options.enabled]);
    React.useEffect(() => {
        if (options.refetchInterval) {
            const interval = setInterval(refetch, options.refetchInterval);
            return () => clearInterval(interval);
        }
        return undefined;
    }, [options.refetchInterval, refetch]);
    return { data, isLoading, error, refetch };
}
/**
 * useMemoryContext - Mid-Level Memory Context Hook (Alias)
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Memory & Context
 *
 * Alias for `useMemory()` that returns null if MemoryProvider is not available.
 * Use this when you want to safely access memory without throwing errors.
 *
 * @returns Memory context value or null if not available
 *
 * @example
 * ```tsx
 * const memory = useMemoryContext()
 *
 * if (memory) {
 *   await memory.addMemory('User preference', 'preference', 'user')
 * }
 * ```
 */
export function useMemoryContext() {
    return React.useContext(MemoryContext);
}
/**
 * Use Memory Stats Hook
 */
export function useMemoryStats(refreshInterval) {
    const { getStats } = useMemory();
    const [stats, setStats] = React.useState(getStats());
    const refresh = React.useCallback(() => {
        setStats(getStats());
    }, [getStats]);
    React.useEffect(() => {
        if (refreshInterval) {
            const interval = setInterval(refresh, refreshInterval);
            return () => clearInterval(interval);
        }
        return undefined;
    }, [refreshInterval, refresh]);
    return { stats, refresh };
}
/**
 * Use Memory Events Hook
 */
export function useMemoryEvents(eventType, handler) {
    const { subscribe } = useMemory();
    React.useEffect(() => {
        const unsubscribe = subscribe(eventType, handler);
        return unsubscribe;
    }, [eventType, handler, subscribe]);
}
/**
 * Use Conversation Memory Hook
 * High-level hook for managing conversation memory
 */
export function useConversationMemory(options = {}) {
    const { addMemory, query, getContext } = useMemory();
    const [context, setContext] = React.useState(null);
    // Update context periodically
    React.useEffect(() => {
        const updateContext = () => {
            try {
                setContext(getContext());
            }
            catch (err) {
                // Service not initialized yet
            }
        };
        updateContext();
        const interval = setInterval(updateContext, 10000); // Every 10s
        return () => clearInterval(interval);
    }, [getContext]);
    /**
     * Capture message as memory
     */
    const captureMessage = React.useCallback(async (content, role, metadata = {}) => {
        const memoryMetadata = {
            ...metadata,
            role,
            userId: options.userId,
            threadId: options.threadId,
            sessionId: options.sessionId,
        };
        return addMemory(content, 'episodic', 'session', memoryMetadata, {
            priority: 'medium',
            confidence: 0.8,
        });
    }, [addMemory, options.userId, options.threadId, options.sessionId]);
    /**
     * Capture user preference
     */
    const capturePreference = React.useCallback(async (key, value, metadata = {}) => {
        return addMemory(`User preference: ${key} = ${value}`, 'semantic', 'global', {
            ...metadata,
            preferenceKey: key,
            preferenceValue: value,
            userId: options.userId,
        }, {
            priority: 'high',
            confidence: 0.9,
        });
    }, [addMemory, options.userId]);
    /**
     * Get relevant memories for current context
     */
    const getRelevantMemories = React.useCallback(async (queryText, limit = 5) => {
        return query({
            query: queryText,
            limit,
            userId: options.userId,
            threadId: options.threadId,
            sessionId: options.sessionId,
            minConfidence: 0.5,
        });
    }, [query, options.userId, options.threadId, options.sessionId]);
    /**
     * Get recent conversation history
     */
    const getRecentHistory = React.useCallback(async (limit = 10) => {
        return query({
            types: ['episodic'],
            scopes: ['session'],
            limit,
            userId: options.userId,
            threadId: options.threadId,
            sessionId: options.sessionId,
        });
    }, [query, options.userId, options.threadId, options.sessionId]);
    /**
     * Get user preferences
     */
    const getPreferences = React.useCallback(async () => {
        return query({
            types: ['semantic'],
            scopes: ['global', 'user'],
            userId: options.userId,
        });
    }, [query, options.userId]);
    return {
        context,
        captureMessage,
        capturePreference,
        getRelevantMemories,
        getRecentHistory,
        getPreferences,
    };
}
/**
 * Memory-aware optimization helper
 */
export function useMemoryOptimization(options) {
    const { service, query, getContext } = useMemory();
    const [optimizedContext, setOptimizedContext] = React.useState(null);
    const [isOptimizing, setIsOptimizing] = React.useState(false);
    const optimize = React.useCallback(async () => {
        if (!service)
            return;
        setIsOptimizing(true);
        try {
            const optimizer = service.getOptimizer();
            const memoryContext = getContext();
            // Get semantic and episodic memories
            const semanticMemories = options.includeSemanticMemory
                ? (await query({ types: ['semantic'], limit: 20 })).map((r) => r.memory)
                : [];
            const episodicMemories = options.includeEpisodicMemory
                ? (await query({ types: ['episodic'], limit: 20 })).map((r) => r.memory)
                : [];
            const result = optimizer.optimizeContext({
                systemPrompt: options.systemPrompt,
                userPreferences: options.userPreferences || {},
                recentMessages: options.recentMessages || [],
                semanticMemories,
                episodicMemories,
                context: memoryContext,
            });
            setOptimizedContext(result);
        }
        catch (err) {
            console.error('Optimization failed:', err);
        }
        finally {
            setIsOptimizing(false);
        }
    }, [service, query, getContext, options]);
    React.useEffect(() => {
        optimize();
    }, [
        options.systemPrompt,
        options.userPreferences,
        options.recentMessages,
        options.includeSemanticMemory,
        options.includeEpisodicMemory,
    ]);
    return {
        optimizedContext,
        isOptimizing,
        reoptimize: optimize,
    };
}
//# sourceMappingURL=memory-provider.js.map
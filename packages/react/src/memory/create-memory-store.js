/**
 * createMemoryStore - Top-level factory for memory store
 *
 * Creates a memory store instance with sensible defaults. Use this when you
 * need a memory store outside of React components or want to configure it
 * imperatively.
 *
 * @example
 * ```tsx
 * // Create a memory store
 * const memoryStore = createMemoryStore({
 *   strategy: 'vector-store',
 *   maxTokens: 8000,
 * })
 *
 * // Use in non-React context
 * await memoryStore.addMemory('User prefers dark mode', 'episodic')
 * const results = await memoryStore.query('What are user preferences?')
 * ```
 *
 * @example
 * ```tsx
 * // Use with React Provider
 * const memoryStore = createMemoryStore({ enabled: true })
 *
 * <MemoryProvider service={memoryStore}>
 *   <App />
 * </MemoryProvider>
 * ```
 */
import { MemoryService } from './memory-service';
/**
 * createMemoryStore - Create a memory store instance
 *
 * Factory function that creates a memory store with the specified configuration.
 * Can be used in both React and non-React contexts.
 */
export function createMemoryStore(options = {}) {
    const { enabled = true, strategy = 'sliding-window', maxTokens, scope = 'session', service: customService, } = options;
    // Create or use provided service
    const serviceConfig = {
        tokenOptimization: {
            maxContextWindow: maxTokens || 8000,
            allocation: {
                systemPrompt: 10,
                userPreferences: 15,
                recentContext: 30,
                semanticMemory: 20,
                episodicMemory: 15,
                responseReserve: 10,
            },
            dynamicAllocation: true,
            enableCompression: false,
            enableChunking: false,
        },
        persistence: {
            useVectorStore: strategy === 'vector-store',
            useCache: true,
            useDatabase: false,
        },
        enableAutoSummarization: false,
        enableAutoCleanup: true,
        cleanupInterval: 60000,
        retentionPolicy: {
            shortTerm: 3600,
            session: 86400,
            thread: 604800,
            global: 0,
        },
        maxTokens: maxTokens || 8000,
        strategy,
    };
    const service = customService || new MemoryService(serviceConfig);
    return {
        enabled,
        service,
        config: {
            enabled,
            strategy,
            maxTokens,
            scope,
        },
        addMemory: async (content, type = 'episodic', metadata) => {
            if (!enabled)
                return;
            await service.addMemory(content, type, scope, metadata || {});
        },
        query: async (queryText, limit = 10) => {
            if (!enabled)
                return [];
            const results = await service.query({ query: queryText, limit });
            return results.map((r) => r.memory);
        },
        clear: async () => {
            if (!enabled)
                return;
            // Clear memories for current scope by deleting them
            await service.deleteMemories({ scopes: [scope] });
        },
    };
}
//# sourceMappingURL=create-memory-store.js.map
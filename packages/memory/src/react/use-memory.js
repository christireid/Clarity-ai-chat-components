/**
 * React Hook for Clarity Memory
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { ClarityMemory } from '../memory-service';
/**
 * React hook for using Clarity Memory
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { add, recall, context, initialized } = useMemory({
 *     userId: 'user123',
 *     embeddingProvider: {
 *       provider: 'openai',
 *       apiKey: process.env.OPENAI_API_KEY,
 *     },
 *   })
 *
 *   const handleMessage = async (text: string) => {
 *     await add(text, { type: 'episodic', scope: 'session' })
 *     const results = await recall(text)
 *     const ctx = await context({ maxTokens: 2000 })
 *   }
 *
 *   return <div>...</div>
 * }
 * ```
 */
export function useMemory(options) {
    const [memory, setMemory] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const memoryRef = useRef(null);
    // Initialize memory instance
    useEffect(() => {
        if (!memoryRef.current) {
            // @ts-expect-error - UseMemoryOptions extends MemoryConfig with smart defaults
            const mem = new ClarityMemory(options);
            memoryRef.current = mem;
            setMemory(mem);
        }
        return () => {
            // Cleanup on unmount
            memoryRef.current?.close().catch(console.error);
        };
    }, []); // Only create once
    // Auto-initialize if enabled
    useEffect(() => {
        if (options?.autoInitialize !== false && memory && !initialized) {
            initialize();
        }
    }, [memory, initialized, options?.autoInitialize]);
    const initialize = useCallback(async () => {
        if (!memory || initialized)
            return;
        setLoading(true);
        setError(null);
        try {
            await memory.initialize();
            setInitialized(true);
            // Load initial stats
            const initialStats = await memory.getStats();
            setStats(initialStats);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
        finally {
            setLoading(false);
        }
    }, [memory, initialized]);
    const add = useCallback(async (content, opts) => {
        if (!memory)
            throw new Error('Memory not initialized');
        const result = await memory.add(content, opts);
        // Refresh stats
        const newStats = await memory.getStats();
        setStats(newStats);
        return result;
    }, [memory]);
    const recall = useCallback(async (query, opts) => {
        if (!memory)
            throw new Error('Memory not initialized');
        return memory.recall(query, opts);
    }, [memory]);
    const context = useCallback(async (opts) => {
        if (!memory)
            throw new Error('Memory not initialized');
        return memory.context(opts);
    }, [memory]);
    const get = useCallback(async (id) => {
        if (!memory)
            throw new Error('Memory not initialized');
        return memory.get(id);
    }, [memory]);
    const update = useCallback(async (id, updates) => {
        if (!memory)
            throw new Error('Memory not initialized');
        const result = await memory.update(id, updates);
        // Refresh stats
        const newStats = await memory.getStats();
        setStats(newStats);
        return result;
    }, [memory]);
    const promote = useCallback(async (id) => {
        if (!memory)
            throw new Error('Memory not initialized');
        await memory.promote(id);
        // Refresh stats
        const newStats = await memory.getStats();
        setStats(newStats);
    }, [memory]);
    const compress = useCallback(async (id) => {
        if (!memory)
            throw new Error('Memory not initialized');
        await memory.compress(id);
        // Refresh stats
        const newStats = await memory.getStats();
        setStats(newStats);
    }, [memory]);
    const forget = useCallback(async (id) => {
        if (!memory)
            throw new Error('Memory not initialized');
        const result = await memory.forget(id);
        // Refresh stats
        const newStats = await memory.getStats();
        setStats(newStats);
        return result;
    }, [memory]);
    const flush = useCallback(async () => {
        if (!memory)
            throw new Error('Memory not initialized');
        await memory.flush();
        // Refresh stats
        const newStats = await memory.getStats();
        setStats(newStats);
    }, [memory]);
    const close = useCallback(async () => {
        if (!memory)
            return;
        await memory.close();
        setInitialized(false);
    }, [memory]);
    return {
        memory,
        initialized,
        loading,
        error,
        add,
        recall,
        context,
        get,
        update,
        promote,
        compress,
        forget,
        flush,
        stats,
        initialize,
        close,
    };
}
//# sourceMappingURL=use-memory.js.map
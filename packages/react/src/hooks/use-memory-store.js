/**
 * useMemoryStore - Top-level hook for memory management
 *
 * Drop-in ready hook for conversation memory with sensible defaults.
 * Wraps the memory system with a simple, ergonomic API.
 *
 * @example
 * ```tsx
 * const memory = useMemoryStore({ enabled: true })
 *
 * // Memory is automatically integrated with chat
 * <ClarityChat api="/api/chat" memory={memory.config} />
 * ```
 */
'use client';
import * as React from 'react';
import { useMemory } from '../memory/memory-provider';
/**
 * useMemoryStore - Top-level memory hook
 *
 * Provides a simple API for memory management that integrates
 * seamlessly with ClarityChat.
 */
export function useMemoryStore(options = {}) {
    const { enabled = false, strategy = 'sliding-window', maxTokens, scope = 'session' } = options;
    const memoryContext = useMemory();
    const addMemory = React.useCallback(async (content, type = 'episodic', metadata) => {
        if (!enabled || !memoryContext)
            return;
        await memoryContext.addMemory(content, type, scope, metadata);
    }, [enabled, memoryContext, scope]);
    const query = React.useCallback(async (query) => {
        if (!enabled || !memoryContext)
            return [];
        const results = await memoryContext.query({ query, limit: 10 });
        return results;
    }, [enabled, memoryContext]);
    const clear = React.useCallback(async () => {
        if (!enabled || !memoryContext)
            return;
        // Clear memories for current scope
        // Implementation depends on memory service API
    }, [enabled, memoryContext]);
    return {
        enabled,
        service: memoryContext,
        config: {
            enabled,
            strategy,
            maxTokens,
        },
        addMemory,
        query,
        clear,
    };
}
//# sourceMappingURL=use-memory-store.js.map
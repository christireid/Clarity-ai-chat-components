/**
 * useCompletion - Mid-Level Completion Hook
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat & Completions
 *
 * Hook for managing text completion state with streaming support.
 * Ideal for single-turn completions, autocomplete, and text generation.
 *
 * For chat interfaces, use top-level `useClarityChat` instead.
 * For structured output, use top-level `useClarityObject` instead.
 *
 * **2025 Improvements**:
 * - Uses shared streaming-helpers for consistent behavior
 * - Request deduplication cache (prevents redundant API calls)
 * - Removed deprecated mountedRef pattern
 * - Better error handling with type guards
 * - Progress tracking support
 * - Cache configuration options
 *
 * @param options - Completion configuration options
 * @param options.api - API endpoint URL (required)
 * @param options.stream - Enable streaming (default: true)
 * @param options.onFinish - Callback when completion finishes
 * @param options.onError - Callback on error
 * @returns Completion state and controls
 *
 * @example
 * ```tsx
 * const { completion, complete, isLoading } = useCompletion({
 *   api: '/api/completion',
 *   onFinish: (prompt, completion) => console.log('Done:', completion),
 * })
 *
 * await complete('Write a story about')
 * ```
 *
 * @throws {Error} If API endpoint is invalid or missing
 */
'use client';
import * as React from 'react';
import { generateId } from '@clarity-chat/primitives';
import { processStream } from '../utils/streaming-helpers';
/**
 * LRU Cache for request deduplication
 */
class CompletionCache {
    cache = new Map();
    maxSize;
    ttl;
    constructor(maxSize = 100, ttl = 300000) {
        this.maxSize = maxSize;
        this.ttl = ttl;
    }
    hashKey(prompt, body) {
        return `${prompt}:${JSON.stringify(body || {})}`;
    }
    get(prompt, body) {
        const key = this.hashKey(prompt, body);
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        // Check if expired
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        // Move to end (LRU)
        this.cache.delete(key);
        this.cache.set(key, entry);
        return entry.completion;
    }
    set(prompt, completion, body) {
        const key = this.hashKey(prompt, body);
        const now = Date.now();
        // Evict oldest if at capacity
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey)
                this.cache.delete(firstKey);
        }
        this.cache.set(key, {
            completion,
            timestamp: now,
            expiresAt: now + this.ttl,
        });
    }
    clear() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
}
/**
 * useCompletion hook for text completions
 *
 * @example
 * ```tsx
 * const { completion, complete, isLoading } = useCompletion({
 *   api: '/api/completion',
 *   onFinish: (prompt, completion) => {
 *     console.log('Completed:', completion)
 *   },
 * })
 *
 * // Complete a prompt
 * await complete('What is the capital of France?')
 * ```
 *
 * @example
 * ```tsx
 * // With caching and progress tracking
 * const { completion, complete, isLoading } = useCompletion({
 *   api: '/api/completion',
 *   enableCache: true,
 *   cacheTTL: 600000, // 10 minutes
 *   onProgress: (bytes) => setProgress(bytes),
 *   streamFormat: 'sse',
 * })
 *
 * // Repeated calls with same prompt use cache
 * await complete('What is the capital of France?') // API call
 * await complete('What is the capital of France?') // From cache (instant)
 * ```
 */
export function useCompletion(options = {}) {
    // Validate API endpoint
    const apiOption = options.api || '/api/completion';
    if (!apiOption || typeof apiOption !== 'string' || apiOption.trim().length === 0) {
        throw new Error('useCompletion: "api" option is required.\n' +
            'Please provide a valid API endpoint URL.\n\n' +
            'Example:\n' +
            '  const { completion, complete } = useCompletion({ api: "/api/completion" })\n\n' +
            'For more help, see: https://clarity-chat.dev/docs/completions');
    }
    const { api = apiOption, initialCompletion = '', body, headers = {}, credentials, fetch: customFetch = fetch, onResponse, onFinish, onError, onProgress, stream = true, streamFormat = 'sse', id: generateCompletionId = () => generateId(), enableCache = false, cacheTTL = 300000, // 5 minutes
    maxCacheSize = 100, experimental, } = options;
    const [completion, setCompletion] = React.useState(initialCompletion);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState();
    const abortControllerRef = React.useRef(null);
    const cacheRef = React.useRef(null);
    // Initialize cache if enabled
    if (enableCache && !cacheRef.current) {
        cacheRef.current = new CompletionCache(maxCacheSize, cacheTTL);
    }
    /**
     * Abort current request
     */
    const abort = React.useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);
    /**
     * Stop completion
     */
    const stop = React.useCallback(() => {
        abort();
        setIsLoading(false);
    }, [abort]);
    /**
     * Complete a prompt with optional caching
     */
    const complete = React.useCallback(async (prompt, options = {}) => {
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) {
            const emptyError = new Error('Prompt cannot be empty');
            onError?.(emptyError);
            return null;
        }
        if (enableCache && cacheRef.current) {
            const requestBody = { ...body, ...options.body };
            const cached = cacheRef.current.get(trimmedPrompt, requestBody);
            if (cached) {
                setCompletion(cached);
                await onFinish?.(trimmedPrompt, cached);
                return cached;
            }
        }
        setIsLoading(true);
        setError(undefined);
        setCompletion('');
        abortControllerRef.current = new AbortController();
        try {
            const requestBody = {
                ...body,
                ...options.body,
                prompt: trimmedPrompt,
            };
            const response = await customFetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                credentials,
                body: JSON.stringify(requestBody),
                signal: abortControllerRef.current.signal,
            });
            await onResponse?.(response);
            if (!response.ok) {
                const errorText = await response.text().catch(() => '');
                throw new Error(`HTTP ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
            }
            if (!stream || !response.body) {
                const result = await response.json();
                const completionText = result.completion || result.text || result.content || '';
                setCompletion(completionText);
                setIsLoading(false);
                await onFinish?.(trimmedPrompt, completionText);
                if (enableCache && cacheRef.current) {
                    cacheRef.current.set(trimmedPrompt, completionText, requestBody);
                }
                return completionText;
            }
            const result = await processStream(response.body, {
                format: streamFormat,
                signal: abortControllerRef.current.signal,
                onChunk: (chunk) => {
                    setCompletion((prev) => prev + chunk);
                },
                onProgress,
                onError,
            });
            setCompletion(result.content);
            setIsLoading(false);
            await onFinish?.(trimmedPrompt, result.content);
            if (enableCache && cacheRef.current) {
                cacheRef.current.set(trimmedPrompt, result.content, requestBody);
            }
            return result.content;
        }
        catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                setIsLoading(false);
                return null;
            }
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            onError?.(error);
            setIsLoading(false);
            throw error;
        }
        finally {
            abortControllerRef.current = null;
        }
    }, [
        api,
        body,
        credentials,
        customFetch,
        enableCache,
        headers,
        onError,
        onFinish,
        onProgress,
        onResponse,
        stream,
        streamFormat,
    ]);
    /**
     * Clear cache manually
     */
    const clearCache = React.useCallback(() => {
        if (cacheRef.current) {
            cacheRef.current.clear();
        }
    }, []);
    /**
     * Get cache statistics
     */
    const getCacheStats = React.useCallback(() => {
        if (!cacheRef.current) {
            return { enabled: false, size: 0, maxSize: 0 };
        }
        return {
            enabled: true,
            size: cacheRef.current.size(),
            maxSize: maxCacheSize,
        };
    }, [maxCacheSize]);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            abort();
            // Clean up cache
            if (cacheRef.current) {
                cacheRef.current.clear();
            }
        };
    }, [abort]);
    return {
        completion,
        setCompletion,
        complete,
        stop,
        isLoading,
        error,
        abort,
        clearCache,
        getCacheStats,
    };
}
//# sourceMappingURL=use-completion.js.map
/**
 * useClarityObject - Top-Level Structured Output Hook
 *
 * Hook for generating structured objects from AI models with type safety.
 * Supports both streaming and non-streaming object generation.
 *
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Tools & Agents
 *
 * This is the recommended way to generate type-safe structured data from AI.
 * For tool calling, use mid-level `useClarityChatWithTools` instead.
 *
 * @example
 * ```tsx
 * interface Product {
 *   name: string
 *   price: number
 *   description: string
 * }
 *
 * const { object, run, isLoading } = useClarityObject<Product>({
 *   api: '/api/generate-object',
 *   initialInput: { query: 'laptops' },
 * })
 *
 * await run({ query: 'gaming laptops' })
 * ```
 *
 * @example
 * ```tsx
 * // With streaming
 * const { object, run, isLoading, progress } = useClarityObject<Product>({
 *   api: '/api/generate-object',
 *   stream: true,
 *   onProgress: (chunk) => console.log('Progress:', chunk),
 * })
 * ```
 */
'use client';
import * as React from 'react';
import { processStream, } from '../../utils/streaming/streaming-helpers';
/**
 * Parse JSON from stream chunks
 */
function parseJSONChunks(chunks) {
    try {
        // Try to parse complete JSON first
        const fullText = chunks.join('');
        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        // Try incremental parsing
        for (let i = chunks.length; i > 0; i--) {
            const attempt = chunks.slice(0, i).join('');
            const match = attempt.match(/\{[\s\S]*\}/);
            if (match) {
                try {
                    return JSON.parse(match[0]);
                }
                catch {
                    continue;
                }
            }
        }
        return null;
    }
    catch {
        return null;
    }
}
/**
 * Structured object generation hook
 */
export function useClarityObject(options) {
    // Validate API endpoint
    if (!options.api ||
        typeof options.api !== 'string' ||
        options.api.trim().length === 0) {
        throw new Error('useClarityObject: "api" option is required.\n' +
            'Please provide your API endpoint URL.\n\n' +
            'Example:\n' +
            '  const { object, run } = useClarityObject<Product>({ api: "/api/generate-object" })\n\n' +
            'For more help, see: https://clarity-chat.dev/docs/getting-started');
    }
    const { api, initialInput, headers, body, stream = false, streamFormat = 'sse', credentials = 'same-origin', fetch: customFetch = fetch, onFinish, onError, onProgress, } = options;
    const [input, setInput] = React.useState(initialInput);
    const [object, setObject] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const abortControllerRef = React.useRef(null);
    const reset = React.useCallback(() => {
        setObject(null);
        setError(null);
        setIsLoading(false);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);
    const run = React.useCallback(async (overrideInput) => {
        const inputToUse = overrideInput ?? input;
        if (!inputToUse) {
            setError(new Error('Input is required'));
            return;
        }
        // Reset state
        setError(null);
        setIsLoading(true);
        // Cancel any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;
        try {
            const requestBody = {
                ...body,
                input: inputToUse,
            };
            const response = await customFetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                credentials,
                body: JSON.stringify(requestBody),
                signal: controller.signal,
            });
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            if (stream && response.body) {
                // Streaming mode: accumulate chunks and parse JSON
                const chunks = [];
                await processStream(response.body, {
                    format: streamFormat,
                    signal: controller.signal,
                    onChunk: (chunk) => {
                        chunks.push(chunk);
                        onProgress?.(chunk);
                        // Try to parse JSON incrementally
                        const parsed = parseJSONChunks(chunks);
                        if (parsed) {
                            setObject(parsed);
                        }
                    },
                    onComplete: () => {
                        // Final parse attempt
                        const parsed = parseJSONChunks(chunks);
                        if (parsed) {
                            setObject(parsed);
                            onFinish?.(parsed);
                        }
                        else {
                            setError(new Error('Failed to parse JSON from stream'));
                        }
                        setIsLoading(false);
                    },
                    onError: (err) => {
                        setError(err);
                        setIsLoading(false);
                        onError?.(err);
                    },
                });
            }
            else {
                // Non-streaming mode: parse JSON directly
                const data = await response.json();
                if (data.object) {
                    setObject(data.object);
                }
                else if (typeof data === 'object') {
                    setObject(data);
                }
                else {
                    throw new Error('Invalid response format: expected object');
                }
                setIsLoading(false);
                onFinish?.(data.object || data);
            }
        }
        catch (err) {
            if (err.name === 'AbortError') {
                // Request was cancelled, don't set error
                return;
            }
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            setIsLoading(false);
            onError?.(error);
        }
        finally {
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
        }
    }, [
        api,
        input,
        body,
        headers,
        credentials,
        stream,
        streamFormat,
        customFetch,
        onFinish,
        onError,
        onProgress,
    ]);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);
    return {
        input,
        setInput,
        object,
        isLoading,
        error,
        run,
        reset,
    };
}
//# sourceMappingURL=use-clarity-object.js.map
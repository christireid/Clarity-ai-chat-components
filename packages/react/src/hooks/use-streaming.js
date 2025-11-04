import * as React from 'react';
/**
 * Generic streaming hook for handling ReadableStream data with automatic
 * text decoding and state management.
 *
 * **Features:**
 * - Automatic text decoding from Uint8Array
 * - Chunk-by-chunk processing with callbacks
 * - AbortController support for cancellation
 * - Complete content accumulation
 * - Error handling
 *
 * **Use Cases:**
 * - Streaming API responses (OpenAI, Anthropic, etc.)
 * - Large file processing
 * - Real-time data feeds
 * - Progressive content rendering
 *
 * @param {UseStreamingOptions} [options] - Configuration options
 * @param {Function} [options.onChunk] - Called for each chunk received
 * @param {Function} [options.onComplete] - Called when streaming completes
 * @param {Function} [options.onError] - Called on error
 * @returns {UseStreamingReturn} Streaming state and controls
 * @example
 * ```tsx
 * const { content, isStreaming, startStreaming, stopStreaming } = useStreaming({
 *   onChunk: (chunk) => console.log('Received:', chunk),
 *   onComplete: (full) => console.log('Done!', full)
 * })
 *
 * // Start streaming with cancellation support
 * const controller = new AbortController()
 * await startStreaming(response.body, { signal: controller.signal })
 *
 * // Stop streaming early if needed
 * stopStreaming()
 * ```
 */
export function useStreaming(options = {}) {
    const { onChunk, onComplete, onError } = options;
    const [content, setContent] = React.useState('');
    const [isStreaming, setIsStreaming] = React.useState(false);
    const readerRef = React.useRef(null);
    const abortControllerRef = React.useRef(null);
    const stopStreaming = React.useCallback(() => {
        if (readerRef.current) {
            readerRef.current.cancel();
            readerRef.current = null;
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsStreaming(false);
    }, []);
    const startStreaming = React.useCallback(async (stream, options) => {
        // Stop any existing streaming
        stopStreaming();
        setIsStreaming(true);
        setContent('');
        // Create AbortController if not provided
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const signal = options?.signal || controller.signal;
        try {
            const reader = stream.getReader();
            readerRef.current = reader;
            const decoder = new TextDecoder();
            let fullText = '';
            while (true) {
                // Check if aborted
                if (signal?.aborted) {
                    throw new DOMException('Streaming aborted', 'AbortError');
                }
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                const chunk = decoder.decode(value, { stream: true });
                fullText += chunk;
                setContent(fullText);
                onChunk?.(chunk);
            }
            onComplete?.(fullText);
        }
        catch (err) {
            // Don't call onError for abort
            if (err instanceof Error && err.name !== 'AbortError') {
                onError?.(err);
            }
        }
        finally {
            setIsStreaming(false);
            readerRef.current = null;
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
        }
    }, [onChunk, onComplete, onError, stopStreaming]);
    const reset = React.useCallback(() => {
        stopStreaming();
        setContent('');
    }, [stopStreaming]);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            stopStreaming();
        };
    }, [stopStreaming]);
    return {
        content,
        isStreaming,
        startStreaming,
        stopStreaming,
        reset,
    };
}
//# sourceMappingURL=use-streaming.js.map
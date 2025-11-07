export interface UseStreamingOptions {
    onChunk?: (chunk: string) => void;
    onComplete?: (fullText: string) => void;
    onError?: (error: Error) => void;
}
export interface UseStreamingReturn {
    content: string;
    isStreaming: boolean;
    startStreaming: (stream: ReadableStream<Uint8Array>, options?: {
        signal?: AbortSignal;
    }) => Promise<void>;
    stopStreaming: () => void;
    reset: () => void;
}
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
export declare function useStreaming(options?: UseStreamingOptions): UseStreamingReturn;
//# sourceMappingURL=use-streaming.d.ts.map
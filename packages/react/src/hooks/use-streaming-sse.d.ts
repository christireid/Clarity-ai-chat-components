/**
 * SSE connection status
 */
export type SSEStatus = 'idle' | 'connecting' | 'connected' | 'streaming' | 'error' | 'closed';
/**
 * Event type for SSE messages
 */
export interface SSEEvent {
    /** Event type (e.g., "message", "error", "done") */
    type: string;
    /** Event data (pre-parsed if JSON) */
    data: any;
    /** Raw event data string */
    raw: string;
    /** Event ID for resumption */
    id?: string;
    /** Retry interval suggested by server */
    retry?: number;
}
/**
 * Configuration for SSE streaming
 */
export interface UseStreamingSSEOptions {
    /** Base URL for SSE endpoint */
    url: string;
    /** HTTP method (default: 'GET') */
    method?: 'GET' | 'POST';
    /** Request body for POST requests */
    body?: any;
    /** Request headers */
    headers?: Record<string, string>;
    /** Authentication token (will be added to headers) */
    authToken?: string;
    /** Fallback: Use cookie-based auth if header auth fails */
    useCookieFallback?: boolean;
    /** Enable automatic reconnection (default: true) */
    autoReconnect?: boolean;
    /** Maximum reconnection attempts (default: 5) */
    maxReconnectAttempts?: number;
    /** Initial reconnection delay in ms (default: 1000) */
    reconnectDelay?: number;
    /** Maximum reconnection delay in ms (default: 30000) */
    maxReconnectDelay?: number;
    /** Heartbeat interval in ms (default: 30000) */
    heartbeatInterval?: number;
    /** Resume from last event ID (default: true) */
    resumeFromLastEventId?: boolean;
    /** Parse JSON responses automatically (default: true) */
    autoParseJson?: boolean;
    /** Event handlers */
    onOpen?: () => void;
    onMessage?: (event: SSEEvent) => void;
    onError?: (error: Error) => void;
    onClose?: () => void;
    /** Called when reconnection attempt starts */
    onReconnecting?: (attempt: number, delay: number) => void;
    /** Called when max reconnection attempts reached */
    onMaxReconnectAttemptsReached?: () => void;
}
/**
 * Return type for useStreamingSSE hook
 */
export interface UseStreamingSSEReturn {
    /** Current connection status */
    status: SSEStatus;
    /** All received events */
    events: SSEEvent[];
    /** Latest event */
    lastEvent: SSEEvent | null;
    /** Accumulated data from streaming events */
    data: string;
    /** Current error if any */
    error: Error | null;
    /** Connect to SSE endpoint */
    connect: () => void;
    /** Disconnect from SSE endpoint */
    disconnect: () => void;
    /** Reconnect (disconnect and connect) */
    reconnect: () => void;
    /** Reset state and events */
    reset: () => void;
    /** Current reconnection attempt number */
    reconnectAttempt: number;
    /** Whether currently reconnecting */
    isReconnecting: boolean;
}
/**
 * Production-ready SSE streaming hook with automatic reconnection,
 * authentication handling, token assembly, and network status detection.
 *
 * **Features:**
 * - Automatic reconnection with exponential backoff
 * - Token authentication (header + cookie fallback)
 * - Resume from last event ID
 * - Partial message assembly
 * - Network status detection
 * - Heartbeat monitoring
 * - Memory-efficient event buffering
 *
 * **Use Cases:**
 * - OpenAI/Anthropic API streaming
 * - Real-time chat message streaming
 * - Live notifications
 * - Server-to-client updates
 *
 * @example
 * ```tsx
 * const Chat = () => {
 *   const {
 *     status,
 *     data,
 *     error,
 *     connect,
 *     disconnect,
 *   } = useStreamingSSE({
 *     url: '/api/chat/stream',
 *     method: 'POST',
 *     body: { message: 'Hello', conversationId: '123' },
 *     authToken: user.token,
 *     onMessage: (event) => {
 *       if (event.type === 'done') {
 *         disconnect()
 *       }
 *     },
 *     onError: (error) => console.error('SSE Error:', error),
 *   })
 *
 *   return (
 *     <div>
 *       <button onClick={connect} disabled={status !== 'idle'}>
 *         Send Message
 *       </button>
 *       <button onClick={disconnect} disabled={status === 'idle'}>
 *         Cancel
 *       </button>
 *
 *       {status === 'streaming' && <div>{data}</div>}
 *       {error && <div>Error: {error.message}</div>}
 *     </div>
 *   )
 * }
 * ```
 */
export declare function useStreamingSSE(options: UseStreamingSSEOptions): UseStreamingSSEReturn;
//# sourceMappingURL=use-streaming-sse.d.ts.map
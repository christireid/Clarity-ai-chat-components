/**
 * WebSocket connection status
 */
export type WebSocketStatus = 'idle' | 'connecting' | 'connected' | 'closing' | 'closed' | 'error' | 'reconnecting';
/**
 * WebSocket message type
 */
export interface WebSocketMessage {
    /** Message data (pre-parsed if JSON) */
    data: any;
    /** Raw message data */
    raw: string | ArrayBuffer | Blob;
    /** Message type (text, binary) */
    type: 'text' | 'binary' | 'blob';
    /** Timestamp when message was received */
    timestamp: number;
}
/**
 * Configuration for WebSocket streaming
 */
export interface UseStreamingWebSocketOptions {
    /** WebSocket URL (ws:// or wss://) */
    url: string;
    /** Protocols to use */
    protocols?: string | string[];
    /** Enable automatic reconnection (default: true) */
    autoReconnect?: boolean;
    /** Maximum reconnection attempts (default: 5) */
    maxReconnectAttempts?: number;
    /** Initial reconnection delay in ms (default: 1000) */
    reconnectDelay?: number;
    /** Maximum reconnection delay in ms (default: 30000) */
    maxReconnectDelay?: number;
    /** Enable heartbeat/ping-pong (default: true) */
    enableHeartbeat?: boolean;
    /** Heartbeat interval in ms (default: 30000) */
    heartbeatInterval?: number;
    /** Heartbeat timeout in ms (default: 5000) */
    heartbeatTimeout?: number;
    /** Heartbeat message (default: 'ping') */
    heartbeatMessage?: string;
    /** Parse JSON messages automatically (default: true) */
    autoParseJson?: boolean;
    /** Connect immediately on mount (default: false) */
    connectOnMount?: boolean;
    /** Event handlers */
    onOpen?: (event: Event) => void;
    onMessage?: (message: WebSocketMessage) => void;
    onError?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    /** Called when reconnection attempt starts */
    onReconnecting?: (attempt: number, delay: number) => void;
    /** Called when max reconnection attempts reached */
    onMaxReconnectAttemptsReached?: () => void;
    /** Called when heartbeat fails */
    onHeartbeatFailed?: () => void;
}
/**
 * Return type for useStreamingWebSocket hook
 */
export interface UseStreamingWebSocketReturn {
    /** Current connection status */
    status: WebSocketStatus;
    /** All received messages */
    messages: WebSocketMessage[];
    /** Latest message */
    lastMessage: WebSocketMessage | null;
    /** Current error if any */
    error: Event | null;
    /** WebSocket connection ready state */
    readyState: number;
    /** Connect to WebSocket */
    connect: () => void;
    /** Disconnect from WebSocket */
    disconnect: (code?: number, reason?: string) => void;
    /** Send message (string or object) */
    send: (data: string | object | ArrayBuffer | Blob) => boolean;
    /** Send JSON message */
    sendJson: (data: any) => boolean;
    /** Reconnect (disconnect and connect) */
    reconnect: () => void;
    /** Reset state and messages */
    reset: () => void;
    /** Current reconnection attempt number */
    reconnectAttempt: number;
    /** Whether currently reconnecting */
    isReconnecting: boolean;
}
/**
 * Production-ready WebSocket streaming hook with automatic reconnection,
 * heartbeat/ping-pong, and lifecycle management.
 *
 * **Features:**
 * - Automatic reconnection with exponential backoff
 * - Heartbeat/ping-pong for keepalive
 * - Support for text and binary messages
 * - Automatic JSON parsing
 * - Connection lifecycle management
 * - Memory-efficient message buffering
 *
 * **Use Cases:**
 * - Real-time chat with bidirectional communication
 * - Live collaboration features
 * - Gaming and interactive applications
 * - WebSocket-based API streaming
 *
 * @example
 * ```tsx
 * const Chat = () => {
 *   const {
 *     status,
 *     messages,
 *     send,
 *     connect,
 *     disconnect,
 *   } = useStreamingWebSocket({
 *     url: 'wss://api.example.com/chat',
 *     autoReconnect: true,
 *     enableHeartbeat: true,
 *     onMessage: (msg) => console.log('Received:', msg.data),
 *     onError: (error) => console.error('WS Error:', error),
 *   })
 *
 *   const handleSend = () => {
 *     send({ type: 'chat', message: 'Hello!' })
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={connect} disabled={status !== 'idle'}>
 *         Connect
 *       </button>
 *       <button onClick={disconnect} disabled={status === 'idle'}>
 *         Disconnect
 *       </button>
 *       <button onClick={handleSend} disabled={status !== 'connected'}>
 *         Send Message
 *       </button>
 *
 *       <div>
 *         {messages.map((msg, i) => (
 *           <div key={i}>{JSON.stringify(msg.data)}</div>
 *         ))}
 *       </div>
 *     </div>
 *   )
 * }
 * ```
 */
export declare function useStreamingWebSocket(options: UseStreamingWebSocketOptions): UseStreamingWebSocketReturn;
//# sourceMappingURL=use-streaming-websocket.d.ts.map
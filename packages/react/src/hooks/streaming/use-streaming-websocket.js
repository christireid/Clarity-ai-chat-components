'use client';
import { logger } from '@clarity-chat/utils/logger';
import * as React from 'react';
/**
 * useStreamingWebSocket - Mid-Level WebSocket Streaming Hook
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Streaming & Transport
 *
 * Production-ready WebSocket streaming hook with automatic reconnection,
 * heartbeat/ping-pong, and lifecycle management.
 *
 * For chat streaming, use top-level `useClarityChat` with transport: 'websocket'.
 * For low-level streaming, use `useStreaming` primitive.
 *
 * **Features:**
 * - Automatic reconnection with exponential backoff
 * - Heartbeat/ping-pong for keepalive
 * - Support for text and binary messages
 * - Automatic JSON parsing
 * - Connection lifecycle management
 * - Memory-efficient message buffering
 *
 * @param options - WebSocket configuration options
 * @param options.url - WebSocket URL (ws:// or wss://) (required)
 * @param options.autoReconnect - Enable automatic reconnection (default: true)
 * @param options.onMessage - Callback for each message
 * @param options.onError - Callback on error
 * @returns WebSocket connection state and controls
 *
 * @example
 * ```tsx
 * const { messages, status, connect, send } = useStreamingWebSocket({
 *   url: 'wss://api.example.com/ws',
 *   onMessage: (msg) => logger.debug('Message:', msg),
 * })
 *
 * React.useEffect(() => {
 *   connect()
 *   return () => disconnect()
 * }, [])
 * ```
 *
 * @throws {Error} If URL is invalid or missing
 */
export function useStreamingWebSocket(options) {
    // Validate URL
    if (!options.url ||
        typeof options.url !== 'string' ||
        options.url.trim().length === 0) {
        throw new Error('useStreamingWebSocket: "url" option is required.\n' +
            'Please provide a valid WebSocket URL (ws:// or wss://).\n\n' +
            'Example:\n' +
            '  const ws = useStreamingWebSocket({ url: "wss://api.example.com/ws" })\n\n' +
            'For more help, see: https://clarity-chat.dev/docs/streaming');
    }
    const { url, protocols, autoReconnect = true, maxReconnectAttempts = 5, reconnectDelay: initialReconnectDelay = 1000, maxReconnectDelay = 30000, enableHeartbeat = true, heartbeatInterval = 30000, heartbeatTimeout = 5000, heartbeatMessage = 'ping', autoParseJson = true, connectOnMount = false, maxMessageBufferSize: rawMaxMessageBufferSize = 1000, onOpen, onMessage, onError, onClose, onReconnecting, onMaxReconnectAttemptsReached, onHeartbeatFailed, } = options;
    // Validate and normalize maxMessageBufferSize (must be at least 1 to prevent slice(-0) bug)
    const maxMessageBufferSize = Math.max(1, Math.floor(rawMaxMessageBufferSize));
    // State
    const [status, setStatus] = React.useState('idle');
    const [messages, setMessages] = React.useState([]);
    const [lastMessage, setLastMessage] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [readyState, setReadyState] = React.useState(WebSocket.CLOSED);
    const [reconnectAttempt, setReconnectAttempt] = React.useState(0);
    const [isReconnecting, setIsReconnecting] = React.useState(false);
    // Refs
    const wsRef = React.useRef(null);
    const reconnectTimeoutRef = React.useRef(null);
    const heartbeatIntervalRef = React.useRef(null);
    const heartbeatTimeoutRef = React.useRef(null);
    const reconnectDelayRef = React.useRef(initialReconnectDelay);
    const shouldReconnectRef = React.useRef(false);
    const lastPongRef = React.useRef(Date.now());
    /**
     * Parse message data
     */
    const parseMessageData = React.useCallback((data) => {
        if (typeof data !== 'string' || !autoParseJson)
            return data;
        try {
            return JSON.parse(data);
        }
        catch {
            return data;
        }
    }, [autoParseJson]);
    /**
     * Start heartbeat mechanism
     */
    const startHeartbeat = React.useCallback(() => {
        if (!enableHeartbeat)
            return;
        // Clear existing intervals
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
        }
        // Send ping at interval
        heartbeatIntervalRef.current = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(heartbeatMessage);
                // Set timeout for pong response
                if (heartbeatTimeoutRef.current) {
                    clearTimeout(heartbeatTimeoutRef.current);
                }
                heartbeatTimeoutRef.current = setTimeout(() => {
                    const timeSinceLastPong = Date.now() - lastPongRef.current;
                    if (timeSinceLastPong > heartbeatTimeout) {
                        logger.warn('[useStreamingWebSocket] Heartbeat timeout - connection may be stale');
                        onHeartbeatFailed?.();
                        // Trigger reconnection
                        if (autoReconnect && shouldReconnectRef.current) {
                            reconnect();
                        }
                    }
                }, heartbeatTimeout);
            }
        }, heartbeatInterval);
    }, [
        enableHeartbeat,
        heartbeatMessage,
        heartbeatInterval,
        heartbeatTimeout,
        autoReconnect,
        onHeartbeatFailed,
    ]);
    /**
     * Stop heartbeat mechanism
     */
    const stopHeartbeat = React.useCallback(() => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
        }
        if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
            heartbeatTimeoutRef.current = null;
        }
    }, []);
    /**
     * Connect to WebSocket
     */
    const connect = React.useCallback(() => {
        // Prevent duplicate connections
        if (wsRef.current?.readyState === WebSocket.OPEN ||
            status === 'connecting') {
            return;
        }
        try {
            setStatus('connecting');
            setError(null);
            shouldReconnectRef.current = true;
            // Create WebSocket connection
            const ws = new WebSocket(url, protocols);
            wsRef.current = ws;
            // Update ready state
            setReadyState(ws.readyState);
            // Handle connection open
            ws.addEventListener('open', (event) => {
                logger.debug('[useStreamingWebSocket] Connected');
                setStatus('connected');
                setReadyState(ws.readyState);
                setReconnectAttempt(0);
                setIsReconnecting(false);
                reconnectDelayRef.current = initialReconnectDelay;
                lastPongRef.current = Date.now();
                // Start heartbeat
                startHeartbeat();
                onOpen?.(event);
            });
            // Handle incoming messages
            ws.addEventListener('message', (event) => {
                // Update last pong time (any message counts as keepalive)
                lastPongRef.current = Date.now();
                const messageType = event.data instanceof ArrayBuffer
                    ? 'binary'
                    : event.data instanceof Blob
                        ? 'blob'
                        : 'text';
                const message = {
                    data: parseMessageData(event.data),
                    raw: event.data,
                    type: messageType,
                    timestamp: Date.now(),
                };
                // Bounded message buffer to prevent memory leaks
                setMessages((prev) => {
                    const newMessages = [...prev, message];
                    // Keep only the last maxMessageBufferSize messages
                    if (newMessages.length > maxMessageBufferSize) {
                        return newMessages.slice(-maxMessageBufferSize);
                    }
                    return newMessages;
                });
                setLastMessage(message);
                onMessage?.(message);
            });
            // Handle errors
            ws.addEventListener('error', (event) => {
                logger.error('[useStreamingWebSocket] Error:', event);
                setError(event);
                setStatus('error');
                setReadyState(ws.readyState);
                onError?.(event);
            });
            // Handle connection close
            ws.addEventListener('close', (event) => {
                logger.debug('[useStreamingWebSocket] Closed:', event.code, event.reason);
                setStatus('closed');
                setReadyState(ws.readyState);
                // Stop heartbeat
                stopHeartbeat();
                onClose?.(event);
                // Attempt reconnection if not a clean close
                if (autoReconnect &&
                    shouldReconnectRef.current &&
                    reconnectAttempt < maxReconnectAttempts &&
                    !event.wasClean) {
                    const nextAttempt = reconnectAttempt + 1;
                    const delay = Math.min(reconnectDelayRef.current * Math.pow(2, reconnectAttempt), maxReconnectDelay);
                    setReconnectAttempt(nextAttempt);
                    setIsReconnecting(true);
                    setStatus('reconnecting');
                    onReconnecting?.(nextAttempt, delay);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, delay);
                }
                else if (reconnectAttempt >= maxReconnectAttempts) {
                    logger.error('[useStreamingWebSocket] Max reconnection attempts reached');
                    onMaxReconnectAttemptsReached?.();
                    shouldReconnectRef.current = false;
                }
            });
        }
        catch (err) {
            logger.error('[useStreamingWebSocket] Connection error:', err);
            setStatus('error');
            setError(err);
        }
    }, [
        url,
        protocols,
        status,
        autoReconnect,
        maxReconnectAttempts,
        reconnectAttempt,
        initialReconnectDelay,
        maxReconnectDelay,
        onOpen,
        onMessage,
        onError,
        onClose,
        onReconnecting,
        onMaxReconnectAttemptsReached,
        parseMessageData,
        startHeartbeat,
        stopHeartbeat,
    ]);
    /**
     * Disconnect from WebSocket
     */
    const disconnect = React.useCallback((code = 1000, reason = 'Client disconnect') => {
        shouldReconnectRef.current = false;
        // Stop heartbeat
        stopHeartbeat();
        // Clear reconnect timeout
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        // Close WebSocket
        if (wsRef.current) {
            setStatus('closing');
            if (wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close(code, reason);
            }
            wsRef.current = null;
        }
        setStatus('closed');
        setIsReconnecting(false);
        setReadyState(WebSocket.CLOSED);
    }, [stopHeartbeat]);
    /**
     * Send message through WebSocket
     */
    const send = React.useCallback((data) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            logger.warn('[useStreamingWebSocket] Cannot send - connection not open');
            return false;
        }
        try {
            // Convert object to JSON string
            const payload = typeof data === 'object' &&
                !(data instanceof ArrayBuffer) &&
                !(data instanceof Blob)
                ? JSON.stringify(data)
                : data;
            wsRef.current.send(payload);
            return true;
        }
        catch (err) {
            logger.error('[useStreamingWebSocket] Send error:', err);
            return false;
        }
    }, []);
    /**
     * Send JSON message (convenience method)
     */
    const sendJson = React.useCallback((data) => {
        return send(data);
    }, [send]);
    /**
     * Reconnect (disconnect and connect)
     */
    const reconnect = React.useCallback(() => {
        disconnect();
        setTimeout(() => connect(), 100);
    }, [disconnect, connect]);
    /**
     * Reset state and messages
     */
    const reset = React.useCallback(() => {
        setMessages([]);
        setLastMessage(null);
        setError(null);
        setReconnectAttempt(0);
        setIsReconnecting(false);
        reconnectDelayRef.current = initialReconnectDelay;
    }, [initialReconnectDelay]);
    // Connect on mount if specified
    React.useEffect(() => {
        if (connectOnMount) {
            connect();
        }
    }, [connectOnMount, connect]);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);
    return {
        status,
        messages,
        lastMessage,
        error,
        readyState,
        connect,
        disconnect,
        send,
        sendJson,
        reconnect,
        reset,
        reconnectAttempt,
        isReconnecting,
    };
}
//# sourceMappingURL=use-streaming-websocket.js.map
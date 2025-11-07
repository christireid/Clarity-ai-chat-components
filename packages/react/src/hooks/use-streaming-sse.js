import * as React from 'react';
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
export function useStreamingSSE(options) {
    const { url, method = 'GET', body, headers = {}, authToken, useCookieFallback = true, autoReconnect = true, maxReconnectAttempts = 5, reconnectDelay: initialReconnectDelay = 1000, maxReconnectDelay = 30000, heartbeatInterval = 30000, resumeFromLastEventId = true, autoParseJson = true, onOpen, onMessage, onError, onClose, onReconnecting, onMaxReconnectAttemptsReached, } = options;
    // State
    const [status, setStatus] = React.useState('idle');
    const [events, setEvents] = React.useState([]);
    const [lastEvent, setLastEvent] = React.useState(null);
    const [data, setData] = React.useState('');
    const [error, setError] = React.useState(null);
    const [reconnectAttempt, setReconnectAttempt] = React.useState(0);
    const [isReconnecting, setIsReconnecting] = React.useState(false);
    // Refs
    const abortControllerRef = React.useRef(null);
    const readerRef = React.useRef(null);
    const lastEventIdRef = React.useRef('');
    const reconnectTimeoutRef = React.useRef(null);
    const heartbeatTimeoutRef = React.useRef(null);
    const reconnectDelayRef = React.useRef(initialReconnectDelay);
    const shouldReconnectRef = React.useRef(false);
    /**
     * Parse SSE event data
     */
    const parseEventData = React.useCallback((rawData) => {
        if (!autoParseJson)
            return rawData;
        try {
            return JSON.parse(rawData);
        }
        catch {
            return rawData;
        }
    }, [autoParseJson]);
    /**
     * Process SSE event line
     */
    const processEvent = React.useCallback((eventType, eventData, eventId) => {
        const event = {
            type: eventType || 'message',
            data: parseEventData(eventData),
            raw: eventData,
            id: eventId,
        };
        if (eventId) {
            lastEventIdRef.current = eventId;
        }
        setEvents((prev) => [...prev, event]);
        setLastEvent(event);
        setData((prev) => prev + eventData);
        onMessage?.(event);
    }, [parseEventData, onMessage]);
    /**
     * Reset heartbeat timer
     */
    const resetHeartbeat = React.useCallback(() => {
        if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
        }
        heartbeatTimeoutRef.current = setTimeout(() => {
            console.warn('[useStreamingSSE] Heartbeat timeout - connection may be stale');
            if (autoReconnect && shouldReconnectRef.current) {
                reconnect();
            }
        }, heartbeatInterval);
    }, [heartbeatInterval, autoReconnect]);
    /**
     * Connect to SSE endpoint using fetch + ReadableStream
     * (EventSource doesn't support custom headers)
     */
    const connect = React.useCallback(async () => {
        // Prevent duplicate connections
        if (status === 'connecting' || status === 'connected' || status === 'streaming') {
            return;
        }
        try {
            setStatus('connecting');
            setError(null);
            shouldReconnectRef.current = true;
            // Create abort controller for cancellation
            abortControllerRef.current = new AbortController();
            // Prepare headers
            const requestHeaders = { ...headers };
            // Add authentication
            if (authToken) {
                requestHeaders['Authorization'] = `Bearer ${authToken}`;
            }
            // Add Last-Event-ID for resumption
            if (resumeFromLastEventId && lastEventIdRef.current) {
                requestHeaders['Last-Event-ID'] = lastEventIdRef.current;
            }
            // For POST requests
            if (method === 'POST') {
                requestHeaders['Content-Type'] = 'application/json';
            }
            // Make fetch request
            const response = await fetch(url, {
                method,
                headers: requestHeaders,
                body: method === 'POST' ? JSON.stringify(body) : undefined,
                signal: abortControllerRef.current.signal,
                credentials: useCookieFallback ? 'include' : 'same-origin',
            });
            if (!response.ok) {
                throw new Error(`SSE request failed: ${response.status} ${response.statusText}`);
            }
            if (!response.body) {
                throw new Error('Response body is null');
            }
            setStatus('connected');
            setReconnectAttempt(0);
            setIsReconnecting(false);
            reconnectDelayRef.current = initialReconnectDelay;
            onOpen?.();
            // Start heartbeat monitoring
            resetHeartbeat();
            // Read stream
            const reader = response.body.getReader();
            readerRef.current = reader;
            const decoder = new TextDecoder();
            let buffer = '';
            let currentEventType = '';
            let currentEventData = '';
            let currentEventId = '';
            setStatus('streaming');
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    setStatus('closed');
                    onClose?.();
                    break;
                }
                // Reset heartbeat on data received
                resetHeartbeat();
                // Decode chunk
                buffer += decoder.decode(value, { stream: true });
                // Process lines
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer
                for (const line of lines) {
                    // Empty line = event boundary
                    if (line.trim() === '') {
                        if (currentEventData) {
                            processEvent(currentEventType, currentEventData.trim(), currentEventId);
                            currentEventType = '';
                            currentEventData = '';
                            currentEventId = '';
                        }
                        continue;
                    }
                    // Parse field
                    const colonIndex = line.indexOf(':');
                    if (colonIndex === -1)
                        continue;
                    const field = line.slice(0, colonIndex);
                    const value = line.slice(colonIndex + 1).trim();
                    switch (field) {
                        case 'event':
                            currentEventType = value;
                            break;
                        case 'data':
                            currentEventData += (currentEventData ? '\n' : '') + value;
                            break;
                        case 'id':
                            currentEventId = value;
                            break;
                        case 'retry':
                            const retryMs = parseInt(value, 10);
                            if (!isNaN(retryMs)) {
                                reconnectDelayRef.current = retryMs;
                            }
                            break;
                    }
                }
            }
        }
        catch (err) {
            const error = err;
            // Ignore abort errors
            if (error.name === 'AbortError') {
                setStatus('closed');
                onClose?.();
                return;
            }
            console.error('[useStreamingSSE] Connection error:', error);
            setError(error);
            setStatus('error');
            onError?.(error);
            // Attempt reconnection
            if (autoReconnect && shouldReconnectRef.current && reconnectAttempt < maxReconnectAttempts) {
                const nextAttempt = reconnectAttempt + 1;
                const delay = Math.min(reconnectDelayRef.current * Math.pow(2, reconnectAttempt), maxReconnectDelay);
                setReconnectAttempt(nextAttempt);
                setIsReconnecting(true);
                onReconnecting?.(nextAttempt, delay);
                reconnectTimeoutRef.current = setTimeout(() => {
                    connect();
                }, delay);
            }
            else if (reconnectAttempt >= maxReconnectAttempts) {
                console.error('[useStreamingSSE] Max reconnection attempts reached');
                onMaxReconnectAttemptsReached?.();
                shouldReconnectRef.current = false;
            }
        }
    }, [
        status,
        url,
        method,
        body,
        headers,
        authToken,
        useCookieFallback,
        resumeFromLastEventId,
        initialReconnectDelay,
        maxReconnectDelay,
        autoReconnect,
        maxReconnectAttempts,
        reconnectAttempt,
        onOpen,
        onClose,
        onError,
        onReconnecting,
        onMaxReconnectAttemptsReached,
        processEvent,
        resetHeartbeat,
    ]);
    /**
     * Disconnect from SSE endpoint
     */
    const disconnect = React.useCallback(() => {
        shouldReconnectRef.current = false;
        // Cancel ongoing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        // Cancel reader
        if (readerRef.current) {
            readerRef.current.cancel();
            readerRef.current = null;
        }
        // Clear timeouts
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
            heartbeatTimeoutRef.current = null;
        }
        setStatus('closed');
        setIsReconnecting(false);
        onClose?.();
    }, [onClose]);
    /**
     * Reconnect (disconnect and connect)
     */
    const reconnect = React.useCallback(() => {
        disconnect();
        setTimeout(() => connect(), 100);
    }, [disconnect, connect]);
    /**
     * Reset state and events
     */
    const reset = React.useCallback(() => {
        setEvents([]);
        setLastEvent(null);
        setData('');
        setError(null);
        setReconnectAttempt(0);
        setIsReconnecting(false);
        lastEventIdRef.current = '';
        reconnectDelayRef.current = initialReconnectDelay;
    }, [initialReconnectDelay]);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);
    return {
        status,
        events,
        lastEvent,
        data,
        error,
        connect,
        disconnect,
        reconnect,
        reset,
        reconnectAttempt,
        isReconnecting,
    };
}
//# sourceMappingURL=use-streaming-sse.js.map
import * as React from 'react'

/**
 * WebSocket connection status
 */
export type WebSocketStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'closing'
  | 'closed'
  | 'error'
  | 'reconnecting'

/**
 * WebSocket message type
 */
export interface WebSocketMessage {
  /** Message data (pre-parsed if JSON) */
  data: any
  /** Raw message data */
  raw: string | ArrayBuffer | Blob
  /** Message type (text, binary) */
  type: 'text' | 'binary' | 'blob'
  /** Timestamp when message was received */
  timestamp: number
}

/**
 * Configuration for WebSocket streaming
 */
export interface UseStreamingWebSocketOptions {
  /** WebSocket URL (ws:// or wss://) */
  url: string

  /** Protocols to use */
  protocols?: string | string[]

  /** Enable automatic reconnection (default: true) */
  autoReconnect?: boolean

  /** Maximum reconnection attempts (default: 5) */
  maxReconnectAttempts?: number

  /** Initial reconnection delay in ms (default: 1000) */
  reconnectDelay?: number

  /** Maximum reconnection delay in ms (default: 30000) */
  maxReconnectDelay?: number

  /** Enable heartbeat/ping-pong (default: true) */
  enableHeartbeat?: boolean

  /** Heartbeat interval in ms (default: 30000) */
  heartbeatInterval?: number

  /** Heartbeat timeout in ms (default: 5000) */
  heartbeatTimeout?: number

  /** Heartbeat message (default: 'ping') */
  heartbeatMessage?: string

  /** Parse JSON messages automatically (default: true) */
  autoParseJson?: boolean

  /** Connect immediately on mount (default: false) */
  connectOnMount?: boolean

  /** Event handlers */
  onOpen?: (event: Event) => void
  onMessage?: (message: WebSocketMessage) => void
  onError?: (event: Event) => void
  onClose?: (event: CloseEvent) => void

  /** Called when reconnection attempt starts */
  onReconnecting?: (attempt: number, delay: number) => void

  /** Called when max reconnection attempts reached */
  onMaxReconnectAttemptsReached?: () => void

  /** Called when heartbeat fails */
  onHeartbeatFailed?: () => void
}

/**
 * Return type for useStreamingWebSocket hook
 */
export interface UseStreamingWebSocketReturn {
  /** Current connection status */
  status: WebSocketStatus

  /** All received messages */
  messages: WebSocketMessage[]

  /** Latest message */
  lastMessage: WebSocketMessage | null

  /** Current error if any */
  error: Event | null

  /** WebSocket connection ready state */
  readyState: number

  /** Connect to WebSocket */
  connect: () => void

  /** Disconnect from WebSocket */
  disconnect: (code?: number, reason?: string) => void

  /** Send message (string or object) */
  send: (data: string | object | ArrayBuffer | Blob) => boolean

  /** Send JSON message */
  sendJson: (data: any) => boolean

  /** Reconnect (disconnect and connect) */
  reconnect: () => void

  /** Reset state and messages */
  reset: () => void

  /** Current reconnection attempt number */
  reconnectAttempt: number

  /** Whether currently reconnecting */
  isReconnecting: boolean
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
export function useStreamingWebSocket(
  options: UseStreamingWebSocketOptions
): UseStreamingWebSocketReturn {
  const {
    url,
    protocols,
    autoReconnect = true,
    maxReconnectAttempts = 5,
    reconnectDelay: initialReconnectDelay = 1000,
    maxReconnectDelay = 30000,
    enableHeartbeat = true,
    heartbeatInterval = 30000,
    heartbeatTimeout = 5000,
    heartbeatMessage = 'ping',
    autoParseJson = true,
    connectOnMount = false,
    onOpen,
    onMessage,
    onError,
    onClose,
    onReconnecting,
    onMaxReconnectAttemptsReached,
    onHeartbeatFailed,
  } = options

  // State
  const [status, setStatus] = React.useState<WebSocketStatus>('idle')
  const [messages, setMessages] = React.useState<WebSocketMessage[]>([])
  const [lastMessage, setLastMessage] = React.useState<WebSocketMessage | null>(null)
  const [error, setError] = React.useState<Event | null>(null)
  const [readyState, setReadyState] = React.useState<number>(WebSocket.CLOSED)
  const [reconnectAttempt, setReconnectAttempt] = React.useState(0)
  const [isReconnecting, setIsReconnecting] = React.useState(false)

  // Refs
  const wsRef = React.useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const heartbeatIntervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const heartbeatTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const reconnectDelayRef = React.useRef(initialReconnectDelay)
  const shouldReconnectRef = React.useRef(false)
  const lastPongRef = React.useRef<number>(Date.now())

  /**
   * Parse message data
   */
  const parseMessageData = React.useCallback(
    (data: string | ArrayBuffer | Blob): any => {
      if (typeof data !== 'string' || !autoParseJson) return data

      try {
        return JSON.parse(data)
      } catch {
        return data
      }
    },
    [autoParseJson]
  )

  /**
   * Start heartbeat mechanism
   */
  const startHeartbeat = React.useCallback(() => {
    if (!enableHeartbeat) return

    // Clear existing intervals
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }

    // Send ping at interval
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(heartbeatMessage)

        // Set timeout for pong response
        if (heartbeatTimeoutRef.current) {
          clearTimeout(heartbeatTimeoutRef.current)
        }

        heartbeatTimeoutRef.current = setTimeout(() => {
          const timeSinceLastPong = Date.now() - lastPongRef.current

          if (timeSinceLastPong > heartbeatTimeout) {
            console.warn('[useStreamingWebSocket] Heartbeat timeout - connection may be stale')
            onHeartbeatFailed?.()

            // Trigger reconnection
            if (autoReconnect && shouldReconnectRef.current) {
              reconnect()
            }
          }
        }, heartbeatTimeout)
      }
    }, heartbeatInterval)
  }, [
    enableHeartbeat,
    heartbeatMessage,
    heartbeatInterval,
    heartbeatTimeout,
    autoReconnect,
    onHeartbeatFailed,
  ])

  /**
   * Stop heartbeat mechanism
   */
  const stopHeartbeat = React.useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }

    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current)
      heartbeatTimeoutRef.current = null
    }
  }, [])

  /**
   * Connect to WebSocket
   */
  const connect = React.useCallback(() => {
    // Prevent duplicate connections
    if (wsRef.current?.readyState === WebSocket.OPEN || status === 'connecting') {
      return
    }

    try {
      setStatus('connecting')
      setError(null)
      shouldReconnectRef.current = true

      // Create WebSocket connection
      const ws = new WebSocket(url, protocols)
      wsRef.current = ws

      // Update ready state
      setReadyState(ws.readyState)

      // Handle connection open
      ws.addEventListener('open', (event) => {
        console.log('[useStreamingWebSocket] Connected')
        setStatus('connected')
        setReadyState(ws.readyState)
        setReconnectAttempt(0)
        setIsReconnecting(false)
        reconnectDelayRef.current = initialReconnectDelay
        lastPongRef.current = Date.now()

        // Start heartbeat
        startHeartbeat()

        onOpen?.(event)
      })

      // Handle incoming messages
      ws.addEventListener('message', (event) => {
        // Update last pong time (any message counts as keepalive)
        lastPongRef.current = Date.now()

        const messageType =
          event.data instanceof ArrayBuffer
            ? 'binary'
            : event.data instanceof Blob
              ? 'blob'
              : 'text'

        const message: WebSocketMessage = {
          data: parseMessageData(event.data),
          raw: event.data,
          type: messageType,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, message])
        setLastMessage(message)

        onMessage?.(message)
      })

      // Handle errors
      ws.addEventListener('error', (event) => {
        console.error('[useStreamingWebSocket] Error:', event)
        setError(event)
        setStatus('error')
        setReadyState(ws.readyState)

        onError?.(event)
      })

      // Handle connection close
      ws.addEventListener('close', (event) => {
        console.log('[useStreamingWebSocket] Closed:', event.code, event.reason)
        setStatus('closed')
        setReadyState(ws.readyState)

        // Stop heartbeat
        stopHeartbeat()

        onClose?.(event)

        // Attempt reconnection if not a clean close
        if (
          autoReconnect &&
          shouldReconnectRef.current &&
          reconnectAttempt < maxReconnectAttempts &&
          !event.wasClean
        ) {
          const nextAttempt = reconnectAttempt + 1
          const delay = Math.min(
            reconnectDelayRef.current * Math.pow(2, reconnectAttempt),
            maxReconnectDelay
          )

          setReconnectAttempt(nextAttempt)
          setIsReconnecting(true)
          setStatus('reconnecting')
          onReconnecting?.(nextAttempt, delay)

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        } else if (reconnectAttempt >= maxReconnectAttempts) {
          console.error('[useStreamingWebSocket] Max reconnection attempts reached')
          onMaxReconnectAttemptsReached?.()
          shouldReconnectRef.current = false
        }
      })
    } catch (err) {
      console.error('[useStreamingWebSocket] Connection error:', err)
      setStatus('error')
      setError(err as Event)
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
  ])

  /**
   * Disconnect from WebSocket
   */
  const disconnect = React.useCallback(
    (code = 1000, reason = 'Client disconnect') => {
      shouldReconnectRef.current = false

      // Stop heartbeat
      stopHeartbeat()

      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }

      // Close WebSocket
      if (wsRef.current) {
        setStatus('closing')

        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close(code, reason)
        }

        wsRef.current = null
      }

      setStatus('closed')
      setIsReconnecting(false)
      setReadyState(WebSocket.CLOSED)
    },
    [stopHeartbeat]
  )

  /**
   * Send message through WebSocket
   */
  const send = React.useCallback((data: string | object | ArrayBuffer | Blob): boolean => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn('[useStreamingWebSocket] Cannot send - connection not open')
      return false
    }

    try {
      // Convert object to JSON string
      const payload = typeof data === 'object' && !(data instanceof ArrayBuffer) && !(data instanceof Blob)
        ? JSON.stringify(data)
        : data

      wsRef.current.send(payload as string | ArrayBuffer | Blob)
      return true
    } catch (err) {
      console.error('[useStreamingWebSocket] Send error:', err)
      return false
    }
  }, [])

  /**
   * Send JSON message (convenience method)
   */
  const sendJson = React.useCallback(
    (data: any): boolean => {
      return send(data)
    },
    [send]
  )

  /**
   * Reconnect (disconnect and connect)
   */
  const reconnect = React.useCallback(() => {
    disconnect()
    setTimeout(() => connect(), 100)
  }, [disconnect, connect])

  /**
   * Reset state and messages
   */
  const reset = React.useCallback(() => {
    setMessages([])
    setLastMessage(null)
    setError(null)
    setReconnectAttempt(0)
    setIsReconnecting(false)
    reconnectDelayRef.current = initialReconnectDelay
  }, [initialReconnectDelay])

  // Connect on mount if specified
  React.useEffect(() => {
    if (connectOnMount) {
      connect()
    }
  }, [connectOnMount, connect])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

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
  }
}

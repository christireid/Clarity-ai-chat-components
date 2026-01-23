'use client'

import { logger } from '@clarity-chat/utils/logger'

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

  /** Reconnect on clean server close (default: true). Enable for server restarts/deploys. */
  reconnectOnCleanClose?: boolean

  /** Maximum reconnection attempts (default: 5) */
  maxReconnectAttempts?: number

  /** Initial reconnection delay in ms (default: 1000) */
  reconnectDelay?: number

  /** Maximum reconnection delay in ms (default: 30000) */
  maxReconnectDelay?: number

  /** RECONNECT-2: Consecutive successes required to reset backoff (default: 3) */
  reconnectSuccessThreshold?: number

  /** Connection timeout in ms (default: 15000) */
  connectionTimeout?: number

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

  /** Maximum number of messages to keep in buffer (default: 1000, prevents memory leaks) */
  maxMessageBufferSize?: number

  /** DELIVERY-3: Called when message buffer overflows (oldest messages dropped) */
  onMessageBufferOverflow?: (droppedCount: number, bufferSize: number) => void

  /** DELIVERY-5: Enable automatic message acknowledgment (default: false) */
  enableAcknowledgment?: boolean

  /** DELIVERY-5: Message type for acknowledgment messages (default: 'ack') */
  ackMessageType?: string

  /** DELIVERY-5: Called when an acknowledgment is sent */
  onAcknowledgmentSent?: (messageId: string) => void

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
 * Return type for useStreamingWebSocket hook (mid-level API)
 *
 * Follows the standard hook return pattern:
 * - Data: `messages`, `lastMessage` (received messages)
 * - State: `status`, `readyState`, `error`
 * - Actions: `connect`, `disconnect`, `send`, `sendJson`, `reconnect`
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
export function useStreamingWebSocket(
  options: UseStreamingWebSocketOptions
): UseStreamingWebSocketReturn {
  // Validate URL
  if (
    !options.url ||
    typeof options.url !== 'string' ||
    options.url.trim().length === 0
  ) {
    throw new Error(
      'useStreamingWebSocket: "url" option is required.\n' +
        'Please provide a valid WebSocket URL (ws:// or wss://).\n\n' +
        'Example:\n' +
        '  const ws = useStreamingWebSocket({ url: "wss://api.example.com/ws" })\n\n' +
        'For more help, see: https://clarity-chat.dev/docs/streaming'
    )
  }

  // Validate WebSocket protocol
  const validatedUrl = options.url.trim()
  if (!validatedUrl.startsWith('ws://') && !validatedUrl.startsWith('wss://')) {
    throw new Error(
      `useStreamingWebSocket: Invalid WebSocket URL "${validatedUrl}".\n` +
        'WebSocket URLs must use ws:// (insecure) or wss:// (secure) protocol.\n\n' +
        'Example:\n' +
        '  ✓ wss://api.example.com/ws (secure, recommended)\n' +
        '  ✓ ws://localhost:8080/ws (local development)\n' +
        '  ✗ https://api.example.com/ws (HTTP protocol not supported)\n' +
        '  ✗ api.example.com/ws (missing protocol)\n\n' +
        'For more help, see: https://clarity-chat.dev/docs/streaming'
    )
  }

  const {
    url,
    protocols,
    autoReconnect = true,
    reconnectOnCleanClose = true,
    maxReconnectAttempts = 5,
    reconnectDelay: initialReconnectDelay = 1000,
    maxReconnectDelay = 30000,
    reconnectSuccessThreshold = 3, // RECONNECT-2: Consecutive successes to reset backoff
    connectionTimeout = 15000,
    enableHeartbeat = true,
    heartbeatInterval = 30000,
    heartbeatTimeout = 5000,
    heartbeatMessage = 'ping',
    autoParseJson = true,
    connectOnMount = false,
    maxMessageBufferSize: rawMaxMessageBufferSize = 1000,
    onMessageBufferOverflow, // DELIVERY-3: Buffer overflow callback
    enableAcknowledgment = false, // DELIVERY-5: Acknowledgment support
    ackMessageType = 'ack', // DELIVERY-5: Ack message type
    onAcknowledgmentSent, // DELIVERY-5: Ack sent callback
    onOpen,
    onMessage,
    onError,
    onClose,
    onReconnecting,
    onMaxReconnectAttemptsReached,
    onHeartbeatFailed,
  } = options

  // Validate and normalize maxMessageBufferSize (must be at least 1 to prevent slice(-0) bug)
  const maxMessageBufferSize = Math.max(1, Math.floor(rawMaxMessageBufferSize))

  // State
  const [status, setStatus] = React.useState<WebSocketStatus>('idle')
  const [messages, setMessages] = React.useState<WebSocketMessage[]>([])
  const [lastMessage, setLastMessage] = React.useState<WebSocketMessage | null>(
    null
  )
  const [error, setError] = React.useState<Event | null>(null)
  const [readyState, setReadyState] = React.useState<number>(WebSocket.CLOSED)
  const [reconnectAttempt, setReconnectAttempt] = React.useState(0)
  const [isReconnecting, setIsReconnecting] = React.useState(false)
  const [reconnectSuccessCount, setReconnectSuccessCount] = React.useState(0) // RECONNECT-2: Track consecutive successes

  // Refs
  const wsRef = React.useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const heartbeatIntervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const heartbeatTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const reconnectDelayRef = React.useRef(initialReconnectDelay)
  const shouldReconnectRef = React.useRef(false)
  const lastPongRef = React.useRef<number>(Date.now())
  const reconnectFnRef = React.useRef<(() => void) | null>(null)
  const connectionIdRef = React.useRef(0) // RECONNECT-1: Track connection ID to prevent mount/unmount races
  
  // STREAM-3: RAF Batching refs
  const rafRef = React.useRef<number | null>(null)
  const pendingMessagesRef = React.useRef<WebSocketMessage[]>([])

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

    // Clear existing timers
    if (heartbeatIntervalRef.current) {
      clearTimeout(heartbeatIntervalRef.current)
    }

    // RECONNECT-3: Recursive setTimeout with jitter for each heartbeat
    const scheduleNextHeartbeat = () => {
      // Add ±10% jitter to prevent synchronized heartbeats across clients
      const jitterRange = heartbeatInterval * 0.1
      const jitter = (Math.random() - 0.5) * 2 * jitterRange
      const intervalWithJitter = Math.floor(heartbeatInterval + jitter)

      heartbeatIntervalRef.current = setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(heartbeatMessage)

          // Set timeout for pong response
          if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current)
          }

          heartbeatTimeoutRef.current = setTimeout(() => {
            const timeSinceLastPong = Date.now() - lastPongRef.current

            if (timeSinceLastPong > heartbeatTimeout) {
              logger.warn(
                '[useStreamingWebSocket] Heartbeat timeout - connection may be stale'
              )
              onHeartbeatFailed?.()

              // Trigger reconnection
              if (autoReconnect && shouldReconnectRef.current) {
                reconnectFnRef.current?.()
              }
            }
          }, heartbeatTimeout)

          // Schedule next heartbeat
          scheduleNextHeartbeat()
        }
      }, intervalWithJitter)
    }

    // Start first heartbeat
    scheduleNextHeartbeat()
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
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      status === 'connecting'
    ) {
      return
    }

    try {
      setStatus('connecting')
      setError(null)
      shouldReconnectRef.current = true

      // RECONNECT-1: Increment connection ID to prevent mount/unmount races
      connectionIdRef.current += 1
      const currentConnectionId = connectionIdRef.current

      // Create WebSocket connection
      const ws = new WebSocket(url, protocols)
      wsRef.current = ws

      // Update ready state
      setReadyState(ws.readyState)

      // Set connection timeout
      const timeoutId = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          logger.error(
            `[useStreamingWebSocket] Connection timeout after ${connectionTimeout}ms`
          )
          ws.close()
          const timeoutError = new Event('timeout')
          setError(timeoutError)
          setStatus('error')
          onError?.(timeoutError)
        }
      }, connectionTimeout)

      // Handle connection open
      ws.addEventListener('open', (event) => {
        // RECONNECT-1: Check connection ID to prevent stale connection updates
        if (currentConnectionId !== connectionIdRef.current) {
          logger.debug('[useStreamingWebSocket] Stale connection detected, aborting')
          return
        }

        // Clear connection timeout
        clearTimeout(timeoutId)
        logger.debug('[useStreamingWebSocket] Connected')
        setStatus('connected')
        setReadyState(ws.readyState)
        setReconnectAttempt(0)
        setIsReconnecting(false)
        lastPongRef.current = Date.now()

        // RECONNECT-2: Only reset backoff after sustained success
        setReconnectSuccessCount((prev) => {
          const newCount = prev + 1
          // Reset delay only after reaching threshold
          if (newCount >= reconnectSuccessThreshold) {
            reconnectDelayRef.current = initialReconnectDelay
            return 0 // Reset success count after backoff reset
          }
          return newCount
        })

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

        // STREAM-3: Batch updates using RAF
        pendingMessagesRef.current.push(message)
        
        // Immediate side effects
        if (enableAcknowledgment && message.data && typeof message.data === 'object' && 'id' in message.data) {
          const messageId = message.data.id as string
          try {
            const ackMessage = JSON.stringify({
              type: ackMessageType,
              id: messageId,
            })
            ws.send(ackMessage)
            onAcknowledgmentSent?.(messageId)
          } catch (err) {
            logger.warn('[useStreamingWebSocket] Failed to send acknowledgment:', err)
          }
        }
        
        onMessage?.(message)

        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null
            
            const newMessagesBatch = pendingMessagesRef.current
            
            if (newMessagesBatch.length === 0) return

            const lastMessageInBatch = newMessagesBatch[newMessagesBatch.length - 1]

            // Bounded message buffer to prevent memory leaks
            setMessages((prev) => {
              const newMessages = [...prev, ...newMessagesBatch]
              // Keep only the last maxMessageBufferSize messages
              if (newMessages.length > maxMessageBufferSize) {
                // DELIVERY-3: Notify about buffer overflow
                const droppedCount = newMessages.length - maxMessageBufferSize
                onMessageBufferOverflow?.(droppedCount, maxMessageBufferSize)
                return newMessages.slice(-maxMessageBufferSize)
              }
              return newMessages
            })
            setLastMessage(lastMessageInBatch)
            
            // Clear buffer
            pendingMessagesRef.current = []
          })
        }
      })

      // Handle errors
      ws.addEventListener('error', (event) => {
        // RECONNECT-1: Check connection ID to prevent stale connection updates
        if (currentConnectionId !== connectionIdRef.current) {
          logger.debug('[useStreamingWebSocket] Stale connection error, ignoring')
          return
        }

        logger.error('[useStreamingWebSocket] Error:', event)
        setError(event)
        setStatus('error')
        setReadyState(ws.readyState)
        setReconnectSuccessCount(0) // RECONNECT-2: Reset success count on error

        onError?.(event)
      })

      // Handle connection close
      ws.addEventListener('close', (event) => {
        logger.debug(
          '[useStreamingWebSocket] Closed:',
          event.code,
          event.reason
        )
        setStatus('closed')
        setReadyState(ws.readyState)
        setReconnectSuccessCount(0) // RECONNECT-2: Reset success count on close

        // Stop heartbeat
        stopHeartbeat()

        onClose?.(event)

        // Attempt reconnection (on unclean close or clean close if configured)
        const shouldReconnectOnClose = !event.wasClean || reconnectOnCleanClose
        if (
          autoReconnect &&
          shouldReconnectRef.current &&
          reconnectAttempt < maxReconnectAttempts &&
          shouldReconnectOnClose
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
          logger.error(
            '[useStreamingWebSocket] Max reconnection attempts reached'
          )
          onMaxReconnectAttemptsReached?.()
          shouldReconnectRef.current = false
        }
      })
    } catch (err) {
      logger.error('[useStreamingWebSocket] Connection error:', err)
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

      // STREAM-3: Clear RAF and pending buffer
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      pendingMessagesRef.current = []

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
      setReconnectSuccessCount(0) // RECONNECT-2: Reset success count on disconnect
      setReadyState(WebSocket.CLOSED)
    },
    [stopHeartbeat]
  )

  /**
   * Send message through WebSocket
   */
  const send = React.useCallback(
    (data: string | object | ArrayBuffer | Blob): boolean => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        logger.warn('[useStreamingWebSocket] Cannot send - connection not open')
        return false
      }

      try {
        // Convert object to JSON string
        const payload =
          typeof data === 'object' &&
          !(data instanceof ArrayBuffer) &&
          !(data instanceof Blob)
            ? JSON.stringify(data)
            : data

        wsRef.current.send(payload as string | ArrayBuffer | Blob)

        // Update last pong time on send (any activity counts as keepalive)
        lastPongRef.current = Date.now()

        return true
      } catch (err) {
        logger.error('[useStreamingWebSocket] Send error:', err)
        return false
      }
    },
    []
  )

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

  // Update reconnect ref to avoid circular dependency in heartbeat
  React.useEffect(() => {
    reconnectFnRef.current = reconnect
  }, [reconnect])

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

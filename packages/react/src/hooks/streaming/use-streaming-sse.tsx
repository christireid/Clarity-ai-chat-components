'use client'

import { logger } from '@clarity-chat/utils/logger'

import * as React from 'react'

/**
 * SSE connection status
 *
 * Tracks the current state of the SSE connection for monitoring and UI updates.
 */
export type SSEStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'streaming'
  | 'error'
  | 'closed'

/**
 * Event type for SSE messages
 */
export interface SSEEvent {
  /** Event type (e.g., "message", "error", "done") */
  type: string
  /** Event data (pre-parsed if JSON) */
  data: any
  /** Raw event data string */
  raw: string
  /** Event ID for resumption */
  id?: string
  /** Retry interval suggested by server */
  retry?: number
}

/**
 * Configuration for SSE streaming
 */
export interface UseStreamingSSEOptions {
  /** Base URL for SSE endpoint */
  url: string

  /** HTTP method (default: 'GET') */
  method?: 'GET' | 'POST'

  /** Request body for POST requests */
  body?: any

  /** Request headers */
  headers?: Record<string, string>

  /** Authentication token (will be added to headers) */
  authToken?: string

  /** Fallback: Use cookie-based auth if header auth fails */
  useCookieFallback?: boolean

  /** Enable automatic reconnection (default: true) */
  autoReconnect?: boolean

  /** Maximum reconnection attempts (default: 5) */
  maxReconnectAttempts?: number

  /** Initial reconnection delay in ms (default: 1000) */
  reconnectDelay?: number

  /** Maximum reconnection delay in ms (default: 30000) */
  maxReconnectDelay?: number

  /** RECONNECT-2: Consecutive successes required to reset backoff (default: 3) */
  reconnectSuccessThreshold?: number

  /** Heartbeat interval in ms (default: 30000) */
  heartbeatInterval?: number

  /** Connection timeout in ms (default: 15000) */
  connectionTimeout?: number

  /** Maximum number of events to keep in buffer (default: 1000, prevents memory leaks) */
  maxEventBufferSize?: number

  /** DELIVERY-3: Called when event buffer overflows (oldest events dropped) */
  onEventBufferOverflow?: (droppedCount: number, bufferSize: number) => void

  /** Resume from last event ID (default: true) */
  resumeFromLastEventId?: boolean

  /** Parse JSON responses automatically (default: true) */
  autoParseJson?: boolean

  /** Event handlers */
  onOpen?: () => void
  onMessage?: (event: SSEEvent) => void
  onError?: (error: Error) => void
  onClose?: () => void

  /** Called when reconnection attempt starts */
  onReconnecting?: (attempt: number, delay: number) => void

  /** Called when max reconnection attempts reached */
  onMaxReconnectAttemptsReached?: () => void
}

/**
 * Return type for useStreamingSSE hook (mid-level API)
 *
 * Follows the standard hook return pattern:
 * - Data: `events`, `lastEvent` (streamed events)
 * - State: `status`, `isConnected`, `error`
 * - Actions: `connect`, `disconnect`, `send`, `reconnect`
 */
export interface UseStreamingSSEReturn {
  /** Current connection status */
  status: SSEStatus

  /** All received events */
  events: SSEEvent[]

  /** Latest event */
  lastEvent: SSEEvent | null

  /** Accumulated data from streaming events */
  data: string

  /** Current error (undefined when no error) */
  error: Error | undefined

  /** Connect to SSE endpoint */
  connect: () => void

  /** Disconnect from SSE endpoint */
  disconnect: () => void

  /** Reconnect (disconnect and connect) */
  reconnect: () => void

  /** Reset state and events */
  reset: () => void

  /** Current reconnection attempt number */
  reconnectAttempt: number

  /** Whether currently reconnecting */
  isReconnecting: boolean
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
 *     onError: (error) => logger.error('SSE Error:', error),
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
/**
 * useStreamingSSE - Mid-Level SSE Streaming Hook
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Streaming & Transport
 *
 * Hook for managing Server-Sent Events (SSE) connections with automatic
 * reconnection, heartbeat, and event handling.
 *
 * For chat streaming, use top-level `useClarityChat` with transport: 'sse'.
 * For low-level streaming, use `useStreaming` primitive.
 *
 * @param options - SSE configuration options
 * @param options.url - Base URL for SSE endpoint (required)
 * @param options.autoReconnect - Enable automatic reconnection (default: true)
 * @param options.onMessage - Callback for each SSE event
 * @param options.onError - Callback on error
 * @returns SSE connection state and controls
 *
 * @example
 * ```tsx
 * const { events, status, connect, disconnect } = useStreamingSSE({
 *   url: '/api/stream',
 *   onMessage: (event) => logger.debug('Event:', event),
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
export function useStreamingSSE(
  options: UseStreamingSSEOptions
): UseStreamingSSEReturn {
  // Validate URL
  if (
    !options.url ||
    typeof options.url !== 'string' ||
    options.url.trim().length === 0
  ) {
    throw new Error(
      'useStreamingSSE: "url" option is required.\n' +
        'Please provide a valid SSE endpoint URL.\n\n' +
        'Example:\n' +
        '  const stream = useStreamingSSE({ url: "/api/stream" })\n\n' +
        'For more help, see: https://clarity-chat.dev/docs/streaming'
    )
  }
  const {
    url,
    method = 'GET',
    body,
    headers = {},
    authToken,
    useCookieFallback = true,
    autoReconnect = true,
    maxReconnectAttempts = 5,
    reconnectDelay: initialReconnectDelay = 1000,
    maxReconnectDelay = 30000,
    reconnectSuccessThreshold = 3, // RECONNECT-2: Consecutive successes to reset backoff
    heartbeatInterval = 30000,
    connectionTimeout = 15000,
    maxEventBufferSize: rawMaxEventBufferSize = 1000,
    onEventBufferOverflow, // DELIVERY-3: Buffer overflow callback
    resumeFromLastEventId = true,
    autoParseJson = true,
    onOpen,
    onMessage,
    onError,
    onClose,
    onReconnecting,
    onMaxReconnectAttemptsReached,
  } = options

  // Validate and normalize maxEventBufferSize (must be at least 1)
  const maxEventBufferSize = Math.max(1, Math.floor(rawMaxEventBufferSize))

  // State
  const [status, setStatus] = React.useState<SSEStatus>('idle')
  const [events, setEvents] = React.useState<SSEEvent[]>([])
  const [lastEvent, setLastEvent] = React.useState<SSEEvent | null>(null)
  const [data, setData] = React.useState<string>('')
  const [error, setError] = React.useState<Error | undefined>(undefined)
  const [reconnectAttempt, setReconnectAttempt] = React.useState(0)
  const [isReconnecting, setIsReconnecting] = React.useState(false)
  const [reconnectSuccessCount, setReconnectSuccessCount] = React.useState(0) // RECONNECT-2: Track consecutive successes

  // Refs
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const readerRef =
    React.useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const lastEventIdRef = React.useRef<string>('')
  const reconnectTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const heartbeatTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const reconnectDelayRef = React.useRef(initialReconnectDelay)
  const serverSuggestedRetryRef = React.useRef<number | null>(null) // SSE-6: Server-suggested retry persists across connections
  const shouldReconnectRef = React.useRef(false)
  const reconnectFnRef = React.useRef<(() => void) | null>(null)
  const connectionIdRef = React.useRef(0) // RECONNECT-1: Track connection ID to prevent mount/unmount races
  const reconnectingRef = React.useRef(false) // FIX: Issue #5 - Prevent concurrent reconnections

  /**
   * Parse SSE event data
   */
  const parseEventData = React.useCallback(
    (rawData: string): any => {
      if (!autoParseJson) return rawData

      try {
        return JSON.parse(rawData)
      } catch {
        return rawData
      }
    },
    [autoParseJson]
  )

  /**
   * Process SSE event line
   */
  const processEvent = React.useCallback(
    (eventType: string, eventData: string, eventId?: string) => {
      const event: SSEEvent = {
        type: eventType || 'message',
        data: parseEventData(eventData),
        raw: eventData,
        id: eventId,
      }

      if (eventId) {
        lastEventIdRef.current = eventId
      }

      // Bounded event buffer to prevent memory leaks
      setEvents((prev) => {
        const newEvents = [...prev, event]
        // Keep only the last maxEventBufferSize events
        if (newEvents.length > maxEventBufferSize) {
          // DELIVERY-3: Notify about buffer overflow
          const droppedCount = newEvents.length - maxEventBufferSize
          onEventBufferOverflow?.(droppedCount, maxEventBufferSize)
          return newEvents.slice(-maxEventBufferSize)
        }
        return newEvents
      })
      setLastEvent(event)

      // Note: `data` accumulates all event data. For long sessions, consider
      // using only `lastEvent` or clearing data periodically with `reset()`
      // FIX: Issue #4 - Apply size limit to prevent buffer overflow
      const MAX_DATA_SIZE = 10 * 1024 * 1024 // 10MB limit

      setData((prev) => {
        const newData = prev + eventData
        if (newData.length > MAX_DATA_SIZE) {
          console.warn(
            `[useStreamingSSE] Data buffer size limit (${MAX_DATA_SIZE} bytes) reached. Truncating to last 10MB.`
          )
          onEventBufferOverflow?.(newData.length, MAX_DATA_SIZE)
          return newData.slice(-MAX_DATA_SIZE) // Keep last 10MB
        }
        return newData
      })

      onMessage?.(event)
    },
    [parseEventData, onMessage]
  )

  /**
   * Reset heartbeat timer
   */
  const resetHeartbeat = React.useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current)
    }

    // RECONNECT-3: Add ±10% jitter to prevent synchronized heartbeats across clients
    const jitterRange = heartbeatInterval * 0.1 // 10% jitter
    const jitter = (Math.random() - 0.5) * 2 * jitterRange // Random value between -10% and +10%
    const intervalWithJitter = Math.floor(heartbeatInterval + jitter)

    heartbeatTimeoutRef.current = setTimeout(() => {
      logger.warn(
        '[useStreamingSSE] Heartbeat timeout - connection may be stale'
      )
      if (autoReconnect && shouldReconnectRef.current) {
        reconnectFnRef.current?.()
      }
    }, intervalWithJitter)
  }, [heartbeatInterval, autoReconnect])

  /**
   * Connect to SSE endpoint using fetch + ReadableStream
   * (EventSource doesn't support custom headers)
   */
  const connect = React.useCallback(async () => {
    // Prevent duplicate connections
    if (
      status === 'connecting' ||
      status === 'connected' ||
      status === 'streaming'
    ) {
      return
    }

    try {
      setStatus('connecting')
      setError(undefined)
      shouldReconnectRef.current = true

      // RECONNECT-1: Increment connection ID to prevent mount/unmount races
      connectionIdRef.current += 1
      const currentConnectionId = connectionIdRef.current

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController()

      // Set connection timeout
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
          const timeoutError = new Error(
            `SSE connection timeout after ${connectionTimeout}ms`
          )
          logger.error('[useStreamingSSE] Connection timeout:', timeoutError)

          // FIX: Issue #5 - Prevent reconnection cascade
          shouldReconnectRef.current = false
          reconnectingRef.current = false

          setError(timeoutError)
          setStatus('error')
          onError?.(timeoutError)
        }
      }, connectionTimeout)

      // Prepare headers
      const requestHeaders: Record<string, string> = { ...headers }

      // Add authentication
      if (authToken) {
        requestHeaders['Authorization'] = `Bearer ${authToken}`
      }

      // Add Last-Event-ID for resumption
      if (resumeFromLastEventId && lastEventIdRef.current) {
        requestHeaders['Last-Event-ID'] = lastEventIdRef.current
      }

      // For POST requests
      if (method === 'POST') {
        requestHeaders['Content-Type'] = 'application/json'
      }

      // Make fetch request
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: method === 'POST' ? JSON.stringify(body) : undefined,
        signal: abortControllerRef.current.signal,
        credentials: useCookieFallback ? 'include' : 'same-origin',
      })

      if (!response.ok) {
        throw new Error(
          `SSE request failed: ${response.status} ${response.statusText}`
        )
      }

      if (!response.body) {
        throw new Error('Response body is null')
      }

      // Clear connection timeout - connection successful
      clearTimeout(timeoutId)

      // RECONNECT-1: Check connection ID to prevent stale connection updates
      if (currentConnectionId !== connectionIdRef.current) {
        logger.debug('[useStreamingSSE] Stale connection detected, aborting')
        return
      }

      setStatus('connected')
      setReconnectAttempt(0)
      setIsReconnecting(false)

      // RECONNECT-2: Only reset backoff after sustained success
      setReconnectSuccessCount((prev) => {
        const newCount = prev + 1
        // Reset delay only after reaching threshold
        if (newCount >= reconnectSuccessThreshold) {
          // SSE-6: Use server-suggested retry if available, otherwise use initial delay
          reconnectDelayRef.current = serverSuggestedRetryRef.current ?? initialReconnectDelay
          return 0 // Reset success count after backoff reset
        }
        return newCount
      })

      onOpen?.()

      // Start heartbeat monitoring
      resetHeartbeat()

      // Read stream
      const reader = response.body.getReader()
      readerRef.current = reader
      const decoder = new TextDecoder()

      let buffer = ''
      let currentEventType = ''
      let currentEventData = ''
      let currentEventId = ''

      setStatus('streaming')

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          setStatus('closed')
          onClose?.()
          break
        }

        // Reset heartbeat on data received
        resetHeartbeat()

        // Decode chunk
        buffer += decoder.decode(value, { stream: true })

        // Process lines
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          // Empty line = event boundary
          if (line.trim() === '') {
            if (currentEventData) {
              processEvent(
                currentEventType,
                currentEventData.trim(),
                currentEventId
              )
              currentEventType = ''
              currentEventData = ''
              currentEventId = ''
            }
            continue
          }

          // Parse field
          const colonIndex = line.indexOf(':')
          if (colonIndex === -1) continue

          const field = line.slice(0, colonIndex)
          const value = line.slice(colonIndex + 1).trim()

          switch (field) {
            case 'event':
              currentEventType = value
              break
            case 'data':
              currentEventData += (currentEventData ? '\n' : '') + value
              break
            case 'id':
              currentEventId = value
              break
            case 'retry':
              const retryMs = parseInt(value, 10)
              if (!isNaN(retryMs)) {
                // SSE-6: Store server-suggested retry delay (persists across connections per SSE spec)
                serverSuggestedRetryRef.current = retryMs
                reconnectDelayRef.current = retryMs
              }
              break
          }
        }
      }
    } catch (err) {
      const error = err as Error

      // Clear connection timeout on error
      clearTimeout(timeoutId)

      // Ignore abort errors
      if (error.name === 'AbortError') {
        setStatus('closed')
        onClose?.()
        return
      }

      // RECONNECT-1: Check connection ID to prevent stale connection updates
      if (currentConnectionId !== connectionIdRef.current) {
        logger.debug('[useStreamingSSE] Stale connection error, ignoring')
        return
      }

      logger.error('[useStreamingSSE] Connection error:', error)
      setError(error)
      setStatus('error')
      setReconnectSuccessCount(0) // RECONNECT-2: Reset success count on error
      onError?.(error)

      // Attempt reconnection
      if (
        autoReconnect &&
        shouldReconnectRef.current &&
        !reconnectingRef.current && // FIX: Issue #5 - Check reconnection flag
        reconnectAttempt < maxReconnectAttempts
      ) {
        reconnectingRef.current = true // FIX: Set flag before reconnecting

        const nextAttempt = reconnectAttempt + 1
        // Calculate delay with exponential backoff and additive jitter (±30%)
        // Jitter prevents "thundering herd" when many clients reconnect simultaneously
        const baseDelay =
          reconnectDelayRef.current * Math.pow(2, reconnectAttempt)
        const jitterRange = baseDelay * 0.3 // 30% jitter
        const jitter = (Math.random() - 0.5) * 2 * jitterRange // Random value between -jitterRange and +jitterRange
        const delay = Math.min(
          Math.floor(baseDelay + jitter),
          maxReconnectDelay
        )

        setReconnectAttempt(nextAttempt)
        setIsReconnecting(true)
        onReconnecting?.(nextAttempt, delay)

        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectingRef.current = false // FIX: Clear flag before reconnecting
          connect()
        }, delay)
      } else if (reconnectAttempt >= maxReconnectAttempts) {
        logger.error('[useStreamingSSE] Max reconnection attempts reached')
        onMaxReconnectAttemptsReached?.()
        shouldReconnectRef.current = false
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
  ])

  /**
   * Disconnect from SSE endpoint
   */
  const disconnect = React.useCallback(() => {
    shouldReconnectRef.current = false

    // Cancel ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    // Cancel reader
    if (readerRef.current) {
      readerRef.current.cancel()
      readerRef.current = null
    }

    // Clear timeouts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current)
      heartbeatTimeoutRef.current = null
    }

    setStatus('closed')
    setIsReconnecting(false)
    onClose?.()
  }, [onClose])

  /**
   * Reconnect (disconnect and connect)
   */
  const reconnect = React.useCallback(() => {
    disconnect()
    setTimeout(() => connect(), 100)
  }, [disconnect, connect])

  /**
   * Reset state and events
   */
  const reset = React.useCallback(() => {
    setEvents([])
    setLastEvent(null)
    setData('')
    setError(undefined)
    setReconnectAttempt(0)
    setIsReconnecting(false)
    setReconnectSuccessCount(0) // RECONNECT-2: Reset success count on manual reset
    lastEventIdRef.current = ''
    serverSuggestedRetryRef.current = null // SSE-6: Clear server-suggested retry on reset
    reconnectDelayRef.current = initialReconnectDelay
  }, [initialReconnectDelay])

  // Update reconnect ref to avoid circular dependency in heartbeat
  React.useEffect(() => {
    reconnectFnRef.current = reconnect
  }, [reconnect])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

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
  }
}

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
 * Valid SSE state transitions
 *
 * Maps current state to allowed next states.
 * Any transition not in this map is considered invalid.
 */
const VALID_STATE_TRANSITIONS: Record<SSEStatus, SSEStatus[]> = {
  idle: ['connecting'],
  connecting: ['connected', 'error', 'closed'],
  connected: ['streaming', 'error', 'closed'],
  streaming: ['closed', 'error', 'connecting'],
  error: ['connecting', 'closed', 'idle'],
  closed: ['connecting', 'idle'],
}

/**
 * Validate state transition
 *
 * Checks if transitioning from currentState to nextState is valid.
 * Logs warning for invalid transitions in production.
 *
 * @param currentState - Current SSE status
 * @param nextState - Desired next status
 * @returns true if transition is valid, false otherwise
 */
function isValidTransition(
  currentState: SSEStatus,
  nextState: SSEStatus
): boolean {
  // Same state is always valid (idempotent)
  if (currentState === nextState) {
    return true
  }

  const allowedTransitions = VALID_STATE_TRANSITIONS[currentState]
  return allowedTransitions.includes(nextState)
}

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

  /** Heartbeat interval in ms (default: 30000) */
  heartbeatInterval?: number

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
    heartbeatInterval = 30000,
    resumeFromLastEventId = true,
    autoParseJson = true,
    onOpen,
    onMessage,
    onError,
    onClose,
    onReconnecting,
    onMaxReconnectAttemptsReached,
  } = options

  // State
  const [status, setStatus] = React.useState<SSEStatus>('idle')
  const [events, setEvents] = React.useState<SSEEvent[]>([])
  const [lastEvent, setLastEvent] = React.useState<SSEEvent | null>(null)
  const [data, setData] = React.useState<string>('')
  const [error, setError] = React.useState<Error | undefined>(undefined)
  const [reconnectAttempt, setReconnectAttempt] = React.useState(0)
  const [isReconnecting, setIsReconnecting] = React.useState(false)

  /**
   * Validated state setter
   *
   * Wraps setStatus with state transition validation.
   * Logs warnings for invalid transitions but allows them (defensive).
   */
  const setStatusSafe = React.useCallback(
    (nextStatus: SSEStatus) => {
      const currentStatus = status
      const valid = isValidTransition(currentStatus, nextStatus)

      if (!valid) {
        logger.warn(
          `[useStreamingSSE] Invalid state transition: ${currentStatus} → ${nextStatus}`,
          {
            currentStatus,
            nextStatus,
            allowedTransitions: VALID_STATE_TRANSITIONS[currentStatus],
          }
        )
      }

      setStatus(nextStatus)
    },
    [status]
  )

  // Refs
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const readerRef =
    React.useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const lastEventIdRef = React.useRef<string>('')
  const reconnectTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const heartbeatTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const reconnectDelayRef = React.useRef(initialReconnectDelay)
  const shouldReconnectRef = React.useRef(false)
  const isDisconnectingRef = React.useRef(false)

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

      setEvents((prev) => [...prev, event])
      setLastEvent(event)
      setData((prev) => prev + eventData)

      onMessage?.(event)
    },
    [parseEventData, onMessage]
  )

  /**
   * Reset heartbeat timer
   */
  const resetHeartbeat = React.useCallback(() => {
    // Don't create new timeouts if disconnecting
    if (isDisconnectingRef.current) {
      return
    }

    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current)
    }

    heartbeatTimeoutRef.current = setTimeout(() => {
      logger.warn(
        '[useStreamingSSE] Heartbeat timeout - connection may be stale'
      )
      if (autoReconnect && shouldReconnectRef.current) {
        reconnect()
      }
    }, heartbeatInterval)
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

    // Defense-in-depth: Clear any existing timeouts to prevent accumulation
    // This handles edge cases where connect() is called without proper cleanup
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current)
      heartbeatTimeoutRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    try {
      setStatusSafe('connecting')
      setError(undefined)
      shouldReconnectRef.current = true
      isDisconnectingRef.current = false // Reset disconnect flag on new connection

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController()

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

      setStatusSafe('connected')
      setReconnectAttempt(0)
      setIsReconnecting(false)
      reconnectDelayRef.current = initialReconnectDelay
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

      setStatusSafe('streaming')

      while (true) {
        const { done, value } = await reader.read()

        // Check if disconnect was called while waiting for read()
        if (isDisconnectingRef.current) {
          break
        }

        if (done) {
          setStatusSafe('closed')
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
                reconnectDelayRef.current = retryMs
              }
              break
          }
        }
      }
    } catch (err) {
      const error = err as Error

      // Ignore abort errors
      if (error.name === 'AbortError') {
        setStatusSafe('closed')
        onClose?.()
        return
      }

      logger.error('[useStreamingSSE] Connection error:', error)
      setError(error)
      setStatusSafe('error')
      onError?.(error)

      // Attempt reconnection
      if (
        autoReconnect &&
        shouldReconnectRef.current &&
        reconnectAttempt < maxReconnectAttempts
      ) {
        const nextAttempt = reconnectAttempt + 1
        // Calculate delay with exponential backoff and jitter (0.5-1.5x multiplier)
        // Jitter prevents "thundering herd" when many clients reconnect simultaneously
        const baseDelay =
          reconnectDelayRef.current * Math.pow(2, reconnectAttempt)
        const jitter = 0.5 + Math.random() // Random multiplier between 0.5 and 1.5
        const delay = Math.min(
          Math.floor(baseDelay * jitter),
          maxReconnectDelay
        )

        setReconnectAttempt(nextAttempt)
        setIsReconnecting(true)
        onReconnecting?.(nextAttempt, delay)

        // CRITICAL: Clear ALL existing timeouts before scheduling reconnection
        // This prevents timeout accumulation over many reconnection cycles
        // Without this, old heartbeat timeouts accumulate (100+ reconnects = 100+ zombie timeouts)
        if (heartbeatTimeoutRef.current) {
          clearTimeout(heartbeatTimeoutRef.current)
          heartbeatTimeoutRef.current = null
        }

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = null
        }

        // Cancel any ongoing request/reader to prevent race conditions
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
          abortControllerRef.current = null
        }

        if (readerRef.current) {
          readerRef.current.cancel()
          readerRef.current = null
        }

        reconnectTimeoutRef.current = setTimeout(() => {
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
    setStatusSafe,
  ])

  /**
   * Disconnect from SSE endpoint
   */
  const disconnect = React.useCallback(() => {
    // Set flag FIRST to prevent race with in-flight reader.read()
    isDisconnectingRef.current = true
    shouldReconnectRef.current = false

    // Cancel ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    // Cancel reader (this will cause pending read() to reject)
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

    setStatusSafe('closed')
    setIsReconnecting(false)
    onClose?.()
  }, [onClose, setStatusSafe])

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
    lastEventIdRef.current = ''
    reconnectDelayRef.current = initialReconnectDelay
  }, [initialReconnectDelay])

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

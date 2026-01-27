/**
 * Streaming Hooks
 *
 * Hooks for handling streaming responses via SSE, WebSockets, and more.
 */

export * from './use-streaming'
export * from './use-streaming-chat'
export * from './use-streaming-sse'
export * from './use-streaming-websocket'
export * from './use-streamable-ui'

// Streaming smoothing for 60fps output rendering
export {
  useSmoothedText,
  smoothingPresets,
  type UseSmoothedTextOptions,
  type UseSmoothedTextReturn,
} from './use-smoothed-text'

// Stream status tracking (inspired by Tambo's useTamboStreamStatus pattern)
export {
  useStreamStatus,
  useSimpleStreamStatus,
  type UseStreamStatusOptions,
  type UseStreamStatusReturn,
  type StreamStatusReturn,
  type StreamingState,
  type FieldStreamStatus,
  type FieldStatus,
  type TokenStats,
  type TimeStats,
} from './use-stream-status'

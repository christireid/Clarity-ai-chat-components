/**
 * Streaming & Real-time Domain
 * 
 * APIs for SSE, WebSocket, and streaming messages
 */

// Top-level: Drop-in ready APIs
export {
  useStreamingChat,
  type UseStreamingChatOptions,
  type UseStreamingChatReturn,
} from '../../hooks/use-streaming-chat'

// Mid-level: Building blocks
export {
  useStreamingSSE,
  type UseStreamingSSEOptions,
} from '../../hooks/use-streaming-sse'
export {
  useStreamingWebSocket,
  type UseStreamingWebSocketOptions,
} from '../../hooks/use-streaming-websocket'
export { StreamingMessage } from '../../components/streaming-message'

// Low-level: Primitives
export { parseStreamChunk } from '../../utils/streaming/parse-stream-chunk'
export { createStreamParser } from '../../utils/streaming/create-stream-parser'
export { handleReconnect } from '../../utils/streaming/handle-reconnect'

/**
 * Parse Anthropic SSE stream events and extract text content.
 *
 * Yields objects with event type and data for each SSE event.
 */
export interface SSETextDelta {
  type: 'text'
  text: string
}

export interface SSEThinkingDelta {
  type: 'thinking'
  thinking: string
}

export interface SSEDone {
  type: 'done'
  inputTokens?: number
  outputTokens?: number
}

export interface SSEError {
  type: 'error'
  error: string
}

export type SSEEvent = SSETextDelta | SSEThinkingDelta | SSEDone | SSEError

/**
 * Async generator that reads an SSE ReadableStream and yields parsed events.
 */
export async function* parseSSEStream(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<SSEEvent> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue

        const jsonStr = trimmed.slice(6)
        if (jsonStr === '[DONE]') continue

        try {
          const event = JSON.parse(jsonStr)

          if (
            event.type === 'content_block_delta' &&
            event.delta?.type === 'text_delta' &&
            event.delta?.text
          ) {
            yield { type: 'text', text: event.delta.text }
          }

          if (
            event.type === 'content_block_delta' &&
            event.delta?.type === 'thinking_delta' &&
            event.delta?.thinking
          ) {
            yield { type: 'thinking', thinking: event.delta.thinking }
          }

          if (event.type === 'message_delta' && event.usage) {
            // Usage info comes with message_delta
          }

          if (event.type === 'message_stop') {
            yield { type: 'done' }
          }

          if (event.type === 'error') {
            yield {
              type: 'error',
              error: event.error?.message || 'Unknown stream error',
            }
          }
        } catch {
          // Skip unparseable lines
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * Create a TransformStream that extracts text content from Anthropic SSE events.
 * Useful for piping into useStreaming() hook which expects raw text chunks.
 */
export function createSSETextTransform(): TransformStream<
  Uint8Array,
  Uint8Array
> {
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ''

  return new TransformStream({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue

        try {
          const event = JSON.parse(trimmed.slice(6))
          if (
            event.type === 'content_block_delta' &&
            event.delta?.type === 'text_delta' &&
            event.delta?.text
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        } catch {
          // Skip
        }
      }
    },
    flush() {
      // Process remaining buffer
      if (buffer.trim()) {
        try {
          const event = JSON.parse(buffer.trim().replace(/^data: /, ''))
          if (
            event.type === 'content_block_delta' &&
            event.delta?.type === 'text_delta' &&
            event.delta?.text
          ) {
            // Final chunk
          }
        } catch {
          // Ignore
        }
      }
    },
  })
}

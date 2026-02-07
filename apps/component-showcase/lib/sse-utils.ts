/**
 * Parse Anthropic SSE stream events and extract text content.
 *
 * Yields objects with event type and data for each SSE event.
 *
 * NOTE: This is an Anthropic-specific SSE parser used only by the showcase
 * demo app. It handles Anthropic event types (content_block_delta,
 * thinking_delta, message_stop) which are not covered by the generic parser.
 *
 * The canonical generic SSE parser lives in:
 *   packages/react/src/utils/streaming/streaming-helpers.ts
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

// ---------------------------------------------------------------------------
// Shared buffer parser — used by both the async generator and TransformStream
// ---------------------------------------------------------------------------

function parseLinesFromBuffer(
  buffer: string,
  chunk: string
): { lines: string[]; remaining: string } {
  const combined = buffer + chunk
  const parts = combined.split('\n')
  const remaining = parts.pop() || ''
  return { lines: parts, remaining }
}

function parseSSELine(line: string): SSEEvent | null {
  const trimmed = line.trim()
  if (!trimmed || !trimmed.startsWith('data: ')) return null

  const jsonStr = trimmed.slice(6)
  if (jsonStr === '[DONE]') return null

  try {
    const event = JSON.parse(jsonStr)

    if (
      event.type === 'content_block_delta' &&
      event.delta?.type === 'text_delta' &&
      event.delta?.text
    ) {
      return { type: 'text', text: event.delta.text }
    }

    if (
      event.type === 'content_block_delta' &&
      event.delta?.type === 'thinking_delta' &&
      event.delta?.thinking
    ) {
      return { type: 'thinking', thinking: event.delta.thinking }
    }

    if (event.type === 'message_stop') {
      return { type: 'done' }
    }

    if (event.type === 'error') {
      return {
        type: 'error',
        error: event.error?.message || 'Unknown stream error',
      }
    }
  } catch {
    // Skip unparseable lines
  }

  return null
}

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

      const { lines, remaining } = parseLinesFromBuffer(
        buffer,
        decoder.decode(value, { stream: true })
      )
      buffer = remaining

      for (const line of lines) {
        const event = parseSSELine(line)
        if (event) yield event
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
      const { lines, remaining } = parseLinesFromBuffer(
        buffer,
        decoder.decode(chunk, { stream: true })
      )
      buffer = remaining

      for (const line of lines) {
        const event = parseSSELine(line)
        if (event && event.type === 'text') {
          controller.enqueue(encoder.encode(event.text))
        }
      }
    },
    flush(controller) {
      if (buffer.trim()) {
        const event = parseSSELine(buffer)
        if (event && event.type === 'text') {
          controller.enqueue(encoder.encode(event.text))
        }
      }
    },
  })
}

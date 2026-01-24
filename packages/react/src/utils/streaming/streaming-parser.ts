/**
 * Advanced Streaming Parser Utilities
 *
 * Provides specialized parsing for AI provider streaming formats with tool support.
 * Uses core SSE parsing from streaming-helpers.ts while adding tool invocation parsing.
 *
 * @module streaming-parser
 */

import {
  parseSSELine,
  safeParseJSON,
  extractStreamContent,
  createStreamReader,
} from './streaming-helpers'

export interface StreamingChunk {
  content?: string
  delta?: string
  text?: string
  choices?: Array<{
    delta?: { content?: string }
    text?: string
  }>
  message?: { content?: string }
  toolInvocation?: {
    toolCallId: string
    toolName: string
    args: Record<string, any>
    state: 'partial-call' | 'call' | 'result'
    result?: any
  }
  [key: string]: any
}

/**
 * Parse streaming chunk from various formats
 */
export function parseStreamingChunk(data: string): StreamingChunk | null {
  const parsed = safeParseJSON<StreamingChunk>(data)
  if (parsed) {
    return parsed
  }

  // Not JSON, return as plain text
  return { content: data, text: data, delta: data }
}

/**
 * Extract content from streaming chunk
 * (Re-export from streaming-helpers with type compatibility)
 */
export function extractContentFromChunk(chunk: StreamingChunk): string {
  return extractStreamContent(chunk)
}

/**
 * Check if chunk contains tool invocation
 */
export function hasToolInvocation(chunk: StreamingChunk): boolean {
  return !!chunk.toolInvocation
}

/**
 * Extract tool invocation from chunk
 */
export function extractToolInvocation(
  chunk: StreamingChunk
): StreamingChunk['toolInvocation'] | null {
  return chunk.toolInvocation || null
}

/**
 * Parse SSE data line
 * (Re-export from streaming-helpers with compatible signature)
 */
export function parseSSEDataLine(
  line: string
): { data: string; event?: string; id?: string } | null {
  if (!line.startsWith('data: ')) {
    return null
  }

  const data = line.slice(6).trim()

  if (data === '[DONE]') {
    return { data: '[DONE]' }
  }

  return { data }
}

/**
 * Create streaming reader helper
 * (Wrapper around core createStreamReader with buffering)
 */
export async function* createStreamingReader(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<string, void, unknown> {
  for await (const chunk of createStreamReader(stream)) {
    // Split by newlines and yield non-empty lines
    const lines = chunk.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed) {
        yield trimmed
      }
    }
  }
}

/**
 * Parse streaming response
 */
export async function* parseStreamingResponse(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<StreamingChunk, void, unknown> {
  for await (const line of createStreamingReader(stream)) {
    const parsed = parseSSEDataLine(line)
    if (parsed && parsed.data !== '[DONE]') {
      const chunk = parseStreamingChunk(parsed.data)
      if (chunk) {
        yield chunk
      }
    } else if (parsed?.data === '[DONE]') {
      break
    }
  }
}

/**
 * Accumulate streaming chunks with tool invocation support
 */
export class StreamingAccumulator {
  private content = ''
  private toolInvocations: Array<StreamingChunk['toolInvocation']> = []

  addChunk(chunk: StreamingChunk): void {
    const content = extractContentFromChunk(chunk)
    if (content) {
      this.content += content
    }

    if (hasToolInvocation(chunk)) {
      const toolInvocation = extractToolInvocation(chunk)
      if (toolInvocation) {
        this.toolInvocations.push(toolInvocation)
      }
    }
  }

  getContent(): string {
    return this.content
  }

  getToolInvocations(): Array<StreamingChunk['toolInvocation']> {
    return this.toolInvocations.filter(
      (ti): ti is NonNullable<typeof ti> => ti !== null
    )
  }

  reset(): void {
    this.content = ''
    this.toolInvocations = []
  }
}

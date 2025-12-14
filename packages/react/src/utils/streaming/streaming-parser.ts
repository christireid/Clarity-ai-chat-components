/**
 * Advanced streaming parser utilities
 * 
 * Handles various streaming formats from different AI providers
 */

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
  try {
    const parsed = JSON.parse(data)
    return parsed as StreamingChunk
  } catch {
    // Not JSON, return as plain text
    return { content: data, text: data, delta: data }
  }
}

/**
 * Extract content from streaming chunk
 */
export function extractContentFromChunk(chunk: StreamingChunk): string {
  // OpenAI chat completions format
  if (chunk.choices?.[0]?.delta?.content) {
    return chunk.choices[0].delta.content
  }

  // OpenAI completions format
  if (chunk.choices?.[0]?.text) {
    return chunk.choices[0].text
  }

  // Direct content field
  if (chunk.content) {
    return typeof chunk.content === 'string' ? chunk.content : ''
  }

  // Text field
  if (chunk.text) {
    return chunk.text
  }

  // Delta field
  if (chunk.delta) {
    return typeof chunk.delta === 'string' ? chunk.delta : ''
  }

  // Message wrapper format
  if (chunk.message?.content) {
    return chunk.message.content
  }

  return ''
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
export function extractToolInvocation(chunk: StreamingChunk): StreamingChunk['toolInvocation'] | null {
  return chunk.toolInvocation || null
}

/**
 * Parse SSE data line
 */
export function parseSSEDataLine(line: string): { data: string; event?: string; id?: string } | null {
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
 */
export async function* createStreamingReader(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<string, void, unknown> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim()) {
          yield line
        }
      }
    }

    // Yield remaining buffer
    if (buffer.trim()) {
      yield buffer
    }
  } finally {
    reader.releaseLock()
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
 * Accumulate streaming chunks
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
    return this.toolInvocations.filter((ti): ti is NonNullable<typeof ti> => ti !== null)
  }

  reset(): void {
    this.content = ''
    this.toolInvocations = []
  }
}

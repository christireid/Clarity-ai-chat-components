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
    delta?: { 
      content?: string;
      tool_calls?: Array<{
        index: number;
        id?: string;
        type?: 'function';
        function?: {
          name?: string;
          arguments?: string;
        }
      }>
    }
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
  private toolInvocations: Array<NonNullable<StreamingChunk['toolInvocation']>> = []
  private toolCallBuffer: Record<number, { id?: string; name?: string; args: string }> = {}

  addChunk(chunk: StreamingChunk): void {
    const content = extractContentFromChunk(chunk)
    if (content) {
      this.content += content
    }

    if (hasToolInvocation(chunk)) {
      const toolInvocation = extractToolInvocation(chunk)
      if (toolInvocation) {
        // If we get a complete tool invocation object (Vercel AI SDK style), push it directly
        // Check if we already have it to avoid duplicates if stream sends it multiple times?
        // Usually Vercel SDK sends 'tool_call' then 'tool_result'.
        // This simple push might be enough for now.
        this.toolInvocations.push(toolInvocation)
      }
    }

    // Handle OpenAI tool_calls delta
    if (chunk.choices?.[0]?.delta?.tool_calls) {
      const toolCalls = chunk.choices[0].delta.tool_calls
      for (const toolCall of toolCalls) {
        const index = toolCall.index
        if (!this.toolCallBuffer[index]) {
          this.toolCallBuffer[index] = { args: '' }
        }
        if (toolCall.id) this.toolCallBuffer[index].id = toolCall.id
        if (toolCall.function?.name) this.toolCallBuffer[index].name = toolCall.function.name
        if (toolCall.function?.arguments) this.toolCallBuffer[index].args += toolCall.function.arguments
      }
    }
  }

  getContent(): string {
    return this.content
  }

  getToolInvocations(): Array<NonNullable<StreamingChunk['toolInvocation']>> {
    const bufferedTools = Object.values(this.toolCallBuffer).map(buffered => {
      // We need at least an ID and Name to be a valid tool call
      if (!buffered.id || !buffered.name) return null

      let args: Record<string, any> = {}
      let state: 'call' | 'partial-call' = 'call'

      try {
        if (buffered.args) {
          args = JSON.parse(buffered.args)
        }
      } catch {
        // If args are incomplete JSON, it is a partial call
        state = 'partial-call'
        // We can expose the partial string as a special property or just empty args
      }

      return {
        toolCallId: buffered.id,
        toolName: buffered.name,
        args,
        state,
      } as NonNullable<StreamingChunk['toolInvocation']>
    }).filter((t): t is NonNullable<StreamingChunk['toolInvocation']> => t !== null)

    return [...this.toolInvocations, ...bufferedTools]
  }

  reset(): void {
    this.content = ''
    this.toolInvocations = []
    this.toolCallBuffer = {}
  }
}

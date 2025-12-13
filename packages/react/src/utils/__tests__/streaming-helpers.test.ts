import { describe, expect, it, vi } from 'vitest'
import { processStream } from '../streaming-helpers'

function streamFromChunks(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk))
      controller.close()
    },
  })
}

describe('streaming-helpers (SSE)', () => {
  it('parses SSE events using blank-line framing and supports multi-line data', async () => {
    const onData = vi.fn()
    const onChunk = vi.fn()

    // JSON payload split across multiple SSE data lines. Per spec, they join with '\n'.
    const chunks = [
      'event: message\n',
      'data: {"choices":[{"delta":{"content":"hel',
      'lo"}}]}\n',
      '\n',
      'data: {"choices":[{"delta":{"content":" world"}}]}\n',
      '\n',
      'data: [DONE]\n',
      '\n',
      // Anything after [DONE] should be ignored.
      'data: {"choices":[{"delta":{"content":" SHOULD_NOT_APPEAR"}}]}\n\n',
    ]

    const stream = streamFromChunks(chunks)
    const result = await processStream(stream, { format: 'sse', onData, onChunk })

    expect(result.content).toBe('hello world')
    expect(onChunk.mock.calls.map((c) => c[0]).join('')).toBe('hello world')
    expect(onData).toHaveBeenCalled()
    // Should not emit parsed JSON after [DONE]
    expect(result.content.includes('SHOULD_NOT_APPEAR')).toBe(false)
  })

  it('handles chunk boundaries that split lines', async () => {
    const onData = vi.fn()
    const onChunk = vi.fn()

    const chunks = [
      'data: {"choices":[{"delta":{"content":"A"}}]}\n',
      '\n',
      'data: {"choices":[{"delta":{"content":"B"}}]}\n\n',
      'data: [DO',
      'NE]\n\n',
    ]

    const stream = streamFromChunks(chunks)
    const result = await processStream(stream, { format: 'sse', onData, onChunk })

    expect(result.content).toBe('AB')
    expect(onChunk).toHaveBeenCalled()
    expect(onData).toHaveBeenCalled()
  })
})


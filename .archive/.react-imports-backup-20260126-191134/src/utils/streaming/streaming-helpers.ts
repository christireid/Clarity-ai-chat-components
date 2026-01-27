/**
 * Shared Streaming Utilities for Chat Hooks
 *
 * This module provides reusable streaming logic that eliminates code duplication
 * across useChat, useCompletion, and useAssistant hooks.
 *
 * **Key Features:**
 * - Type-safe streaming handlers
 * - Multiple format support (SSE, JSON, plain text)
 * - AbortSignal integration
 * - Error recovery
 * - Progress tracking
 *
 * @module streaming-helpers
 */

/**
 * Streaming format types
 */
export type StreamFormat = 'sse' | 'json-stream' | 'plain-text' | 'ndjson'

/**
 * Streaming chunk with metadata
 */
export interface StreamChunk<T = string> {
  data: T
  done: boolean
  error?: Error
  metadata?: Record<string, unknown>
}

/**
 * Streaming options
 */
export interface StreamOptions {
  /** Signal for cancellation */
  signal?: AbortSignal
  /** Expected format */
  format?: StreamFormat
  /** Callback for each chunk */
  onChunk?: (chunk: string) => void
  /** Callback for parsed data */
  onData?: (data: unknown) => void
  /** Callback for progress */
  onProgress?: (bytes: number) => void
  /** Callback on completion */
  onComplete?: (fullText: string) => void
  /** Callback on error */
  onError?: (error: Error) => void
  /** Maximum chunk size (bytes) */
  maxChunkSize?: number
}

/**
 * Stream result
 */
export interface StreamResult {
  content: string
  chunks: number
  bytes: number
  duration: number
  cancelled: boolean
}

/**
 * Parse SSE (Server-Sent Events) data line
 */
export function parseSSELine(
  line: string
): { event?: string; data?: string; id?: string } | null {
  const trimmed = line.trim()

  if (!trimmed || trimmed.startsWith(':')) {
    return null // Comment or empty line
  }

  if (trimmed.startsWith('data:')) {
    const data = trimmed.slice(5).trim()
    return { data }
  }

  if (trimmed.startsWith('event:')) {
    return { event: trimmed.slice(6).trim() }
  }

  if (trimmed.startsWith('id:')) {
    return { id: trimmed.slice(3).trim() }
  }

  // Plain data line (no prefix)
  return { data: trimmed }
}

interface SSEEvent {
  event?: string
  id?: string
  data?: string
}

/**
 * Minimal SSE event parser (event framing + multi-line data).
 *
 * Notes:
 * - Buffers `data:` lines until a blank line terminates the event.
 * - Joins multi-line data with `\n` per SSE spec.
 * - Ignores comment lines starting with `:`.
 */
class SSEEventParser {
  private currentEvent: SSEEvent = {}
  private dataLines: string[] = []

  reset(): void {
    this.currentEvent = {}
    this.dataLines = []
  }

  /**
   * Feed a single line (without trailing newline).
   * Returns a completed event when a blank line terminates the event.
   */
  feed(line: string): SSEEvent | null {
    // Blank line terminates an event.
    if (!line.trim()) {
      if (
        this.currentEvent.event === undefined &&
        this.currentEvent.id === undefined &&
        this.dataLines.length === 0
      ) {
        this.reset()
        return null
      }

      const data =
        this.dataLines.length > 0 ? this.dataLines.join('\n') : undefined
      const event: SSEEvent = {
        event: this.currentEvent.event,
        id: this.currentEvent.id,
        data,
      }

      this.reset()
      return event
    }

    const parsed = parseSSELine(line)
    if (!parsed) return null

    if (parsed.event) this.currentEvent.event = parsed.event
    if (parsed.id) this.currentEvent.id = parsed.id

    // For SSE, `data:` can appear multiple times; accumulate.
    if (parsed.data !== undefined) {
      this.dataLines.push(parsed.data)
    }

    return null
  }

  /**
   * Flush any in-progress event (useful at EOF).
   */
  flush(): SSEEvent | null {
    if (
      this.currentEvent.event === undefined &&
      this.currentEvent.id === undefined &&
      this.dataLines.length === 0
    ) {
      return null
    }
    const data =
      this.dataLines.length > 0 ? this.dataLines.join('\n') : undefined
    const event: SSEEvent = { ...this.currentEvent, data }
    this.reset()
    return event
  }
}

/**
 * Parse JSON safely with fallback
 */
export function safeParseJSON<T = unknown>(text: string): T | null {
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

/**
 * Extract content from various streaming formats
 */
export function extractStreamContent(chunk: unknown): string {
  if (typeof chunk === 'string') {
    return chunk
  }

  if (typeof chunk === 'object' && chunk !== null) {
    const obj = chunk as Record<string, unknown>

    // OpenAI chat format
    if (obj['choices'] && Array.isArray(obj['choices'])) {
      const choice = (obj['choices'] as unknown[])[0] as Record<string, unknown>
      if (choice?.['delta'] && typeof choice['delta'] === 'object') {
        const delta = choice['delta'] as Record<string, unknown>
        if (typeof delta['content'] === 'string') {
          return delta['content']
        }
      }
      if (typeof choice?.['text'] === 'string') {
        return choice['text']
      }
    }

    // Common content fields
    if (typeof obj['content'] === 'string') return obj['content']
    if (typeof obj['text'] === 'string') return obj['text']
    if (typeof obj['delta'] === 'string') return obj['delta']
    if (typeof obj['data'] === 'string') return obj['data']
  }

  return ''
}

/**
 * Process a streaming response with configurable format handling
 *
 * @example
 * ```ts
 * const result = await processStream(response.body, {
 *   format: 'sse',
 *   signal: controller.signal,
 *   onChunk: (chunk) => setContent(prev => prev + chunk),
 *   onComplete: (full) => console.log('Done:', full),
 * })
 * ```
 */
export async function processStream(
  stream: ReadableStream<Uint8Array>,
  options: StreamOptions = {}
): Promise<StreamResult> {
  if (
    !stream ||
    typeof (stream as ReadableStream<Uint8Array>).getReader !== 'function'
  ) {
    throw new Error(
      '[processStream] Invalid stream: expected a ReadableStream<Uint8Array>.'
    )
  }

  const {
    signal,
    format = 'sse',
    onChunk,
    onData,
    onProgress,
    onComplete,
    onError,
    maxChunkSize = 65536, // 64KB
  } = options

  const startTime = performance.now()
  const reader = stream.getReader()
  const decoder = new TextDecoder()

  let content = ''
  let buffer = ''
  let chunks = 0
  let bytes = 0
  let cancelled = false
  let sseDone = false

  const sseParser = format === 'sse' ? new SSEEventParser() : null

  const handleLine = (line: string): void => {
    // SSE needs special handling because JSON payloads live in the `data:` field.
    if (format === 'sse') {
      const parser = sseParser
      if (!parser) return
      const event = parser.feed(line)
      if (!event) return

      // [DONE] is a convention used by some providers.
      if (event.data?.trim() === '[DONE]') {
        sseDone = true
        return
      }

      if (!event.data) return

      const parsedJson = onData ? safeParseJSON(event.data) : null
      if (parsedJson) onData?.(parsedJson)

      const processed = parsedJson
        ? extractStreamContent(parsedJson)
        : event.data
      if (processed) {
        content += processed
        onChunk?.(processed)
      }
      return
    }

    if (!line.trim()) return

    const processed = processChunkByFormat(line, format)
    if (processed) {
      content += processed
      onChunk?.(processed)
    }

    if (onData) {
      const parsed = safeParseJSON(line)
      if (parsed) onData(parsed)
    }
  }

  try {
    while (true) {
      // Check for cancellation
      if (signal?.aborted) {
        cancelled = true
        throw new DOMException('Stream aborted', 'AbortError')
      }

      const { done, value } = await reader.read()

      if (done) {
        // Process any remaining buffer
        if (buffer.trim()) {
          const remainingLines = buffer.split('\n')
          for (const line of remainingLines) handleLine(line)
          buffer = ''
        }

        // FIX: Issue #17 - Flush any in-progress SSE event at EOF to ensure completion
        if (format === 'sse' && sseParser && !sseDone) {
          const flushed = sseParser.flush()
          if (flushed?.data?.trim() === '[DONE]') {
            sseDone = true
          } else if (flushed?.data) {
            const parsedJson = onData ? safeParseJSON(flushed.data) : null
            if (parsedJson) onData?.(parsedJson)
            const processed = parsedJson
              ? extractStreamContent(parsedJson)
              : flushed.data
            if (processed) {
              content += processed
              onChunk?.(processed)
            }
          }
          // FIX: Issue #17 - Explicitly mark as done after flush to trigger completion
          // This ensures the stream doesn't appear to hang waiting for more data
          sseDone = true
        }
        break
      }

      // Track progress
      bytes += value.byteLength
      onProgress?.(bytes)

      // Decode chunk
      const chunkText = decoder.decode(value, { stream: true })
      buffer += chunkText
      chunks++

      // Process buffer by format (handle both \n and \r\n line endings)
      const lines = buffer.split(/\r?\n/)
      buffer = lines.pop() || '' // Keep incomplete line in buffer

      for (const line of lines) {
        handleLine(line)
        if (sseDone) break
      }

      // Stop once we see [DONE] in SSE mode.
      if (sseDone) break

      // Prevent buffer overflow
      if (buffer.length > maxChunkSize) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[processStream] Buffer size exceeded, flushing...')
        }
        handleLine(buffer)
        buffer = ''
      }
    }

    // Success callback
    onComplete?.(content)

    return {
      content,
      chunks,
      bytes,
      duration: performance.now() - startTime,
      cancelled,
    }
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error))

    // Don't call onError for AbortError
    if (err.name !== 'AbortError') {
      onError?.(err)
    }

    return {
      content,
      chunks,
      bytes,
      duration: performance.now() - startTime,
      cancelled: err.name === 'AbortError',
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * Process chunk based on format
 */
function processChunkByFormat(chunk: string, format: StreamFormat): string {
  // FIX: Issue #9 - Add error handling and logging for chunk processing
  try {
    switch (format) {
      case 'sse': {
        const parsed = parseSSELine(chunk)
        if (parsed?.data) {
          if (parsed.data.trim() === '[DONE]') return ''
          const jsonData = safeParseJSON(parsed.data)
          // FIX: Log when JSON parsing fails for debugging
          if (jsonData === null && parsed.data.trim().startsWith('{')) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                '[processChunkByFormat] Failed to parse SSE data as JSON:',
                parsed.data.substring(0, 100)
              )
            }
          }
          return jsonData ? extractStreamContent(jsonData) : parsed.data
        }
        return ''
      }

      case 'json-stream':
      case 'ndjson': {
        const parsed = safeParseJSON(chunk)
        // FIX: Log when JSON parsing fails for debugging
        if (parsed === null && chunk.trim()) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              '[processChunkByFormat] Failed to parse chunk as JSON:',
              chunk.substring(0, 100)
            )
          }
          // Return empty string instead of potentially malformed data
          return ''
        }
        return parsed ? extractStreamContent(parsed) : ''
      }

      case 'plain-text':
      default:
        return chunk
    }
  } catch (error) {
    // FIX: Catch any unexpected errors during chunk processing
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '[processChunkByFormat] Unexpected error processing chunk:',
        error,
        'Chunk:',
        chunk.substring(0, 100)
      )
    }
    // Return empty string to prevent stream corruption
    return ''
  }
}

/**
 * Create a streaming reader for easy iteration
 *
 * @example
 * ```ts
 * for await (const chunk of createStreamReader(response.body)) {
 *   console.log('Chunk:', chunk)
 * }
 * ```
 */
export async function* createStreamReader(
  stream: ReadableStream<Uint8Array>,
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      if (signal?.aborted) {
        throw new DOMException('Stream aborted', 'AbortError')
      }

      const { done, value } = await reader.read()

      if (done) break

      yield decoder.decode(value, { stream: true })
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * Accumulator for streaming chunks with deduplication
 */
export class StreamAccumulator {
  private content = ''
  private seen = new Set<string>()
  private deduplicate: boolean

  constructor(options: { deduplicate?: boolean } = {}) {
    this.deduplicate = options.deduplicate ?? false
  }

  /**
   * Add a chunk to the accumulator
   */
  add(chunk: string): boolean {
    if (!chunk) return false

    // Optional deduplication
    if (this.deduplicate) {
      const hash = this.hashChunk(chunk)
      if (this.seen.has(hash)) {
        return false
      }
      this.seen.add(hash)
    }

    this.content += chunk
    return true
  }

  /**
   * Get accumulated content
   */
  get(): string {
    return this.content
  }

  /**
   * Get content length
   */
  length(): number {
    return this.content.length
  }

  /**
   * Reset accumulator
   */
  reset(): void {
    this.content = ''
    this.seen.clear()
  }

  /**
   * Simple hash for deduplication
   */
  private hashChunk(chunk: string): string {
    let hash = 0
    for (let i = 0; i < chunk.length; i++) {
      const char = chunk.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(36)
  }
}

/**
 * Retry streaming with exponential backoff
 */
export async function retryStream<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    baseDelay?: number
    maxDelay?: number
    shouldRetry?: (error: Error, attempt: number) => boolean
    onRetry?: (error: Error, attempt: number) => void
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    shouldRetry = () => true,
    onRetry,
  } = options

  let lastError: Error = new Error('Unknown error')

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry on abort
      if (lastError.name === 'AbortError') {
        throw lastError
      }

      // Check if should retry
      if (attempt >= maxRetries || !shouldRetry(lastError, attempt)) {
        throw lastError
      }

      // Call retry callback
      onRetry?.(lastError, attempt)

      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt - 1) * (0.5 + Math.random()),
        maxDelay
      )

      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Merge multiple streams into one
 */
export async function mergeStreams(
  streams: ReadableStream<Uint8Array>[],
  signal?: AbortSignal
): Promise<string> {
  const results = await Promise.all(
    streams.map((stream) => processStream(stream, { signal }))
  )

  return results.map((r) => r.content).join('')
}

/**
 * Split stream by delimiter
 */
export async function* splitStream(
  stream: ReadableStream<Uint8Array>,
  delimiter: string = '\n',
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  let buffer = ''

  for await (const chunk of createStreamReader(stream, signal)) {
    buffer += chunk
    const parts = buffer.split(delimiter)
    buffer = parts.pop() || ''

    for (const part of parts) {
      if (part) yield part
    }
  }

  // Yield remaining buffer
  if (buffer) yield buffer
}

/**
 * Transform stream with custom function
 */
export async function transformStream<T>(
  stream: ReadableStream<Uint8Array>,
  transform: (chunk: string) => T,
  signal?: AbortSignal
): Promise<T[]> {
  const results: T[] = []

  for await (const chunk of createStreamReader(stream, signal)) {
    results.push(transform(chunk))
  }

  return results
}

/**
 * Filter stream chunks
 */
export async function* filterStream(
  stream: ReadableStream<Uint8Array>,
  predicate: (chunk: string) => boolean,
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  for await (const chunk of createStreamReader(stream, signal)) {
    if (predicate(chunk)) {
      yield chunk
    }
  }
}

/**
 * Buffer stream with time window
 */
export async function* bufferStream(
  stream: ReadableStream<Uint8Array>,
  windowMs: number,
  signal?: AbortSignal
): AsyncGenerator<string[], void, unknown> {
  let buffer: string[] = []
  let lastFlush = Date.now()

  for await (const chunk of createStreamReader(stream, signal)) {
    buffer.push(chunk)

    if (Date.now() - lastFlush >= windowMs) {
      yield buffer
      buffer = []
      lastFlush = Date.now()
    }
  }

  // Yield remaining buffer
  if (buffer.length > 0) {
    yield buffer
  }
}

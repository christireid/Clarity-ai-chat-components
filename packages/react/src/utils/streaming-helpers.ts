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
export function parseSSELine(line: string): { event?: string; data?: string; id?: string } | null {
  const trimmed = line.trim()
  
  if (!trimmed || trimmed.startsWith(':')) {
    return null // Comment or empty line
  }

  if (trimmed.startsWith('data:')) {
    const data = trimmed.slice(5).trim()
    return { data: data === '[DONE]' ? undefined : data }
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
    if (obj.choices && Array.isArray(obj.choices)) {
      const choice = obj.choices[0] as Record<string, unknown>
      if (choice?.delta && typeof choice.delta === 'object') {
        const delta = choice.delta as Record<string, unknown>
        if (typeof delta.content === 'string') {
          return delta.content
        }
      }
      if (typeof choice?.text === 'string') {
        return choice.text
      }
    }

    // Common content fields
    if (typeof obj.content === 'string') return obj.content
    if (typeof obj.text === 'string') return obj.text
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
          const processed = processChunkByFormat(buffer, format)
          if (processed) {
            content += processed
            onChunk?.(processed)
          }
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

      // Process buffer by format
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // Keep incomplete line in buffer

      for (const line of lines) {
        if (!line.trim()) continue

        const processed = processChunkByFormat(line, format)
        if (processed) {
          content += processed
          onChunk?.(processed)
        }

        // Parse data if callback provided
        if (onData) {
          const parsed = safeParseJSON(line)
          if (parsed) {
            onData(parsed)
          }
        }
      }

      // Prevent buffer overflow
      if (buffer.length > maxChunkSize) {
        console.warn('[processStream] Buffer size exceeded, flushing...')
        const processed = processChunkByFormat(buffer, format)
        if (processed) {
          content += processed
          onChunk?.(processed)
        }
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
  switch (format) {
    case 'sse': {
      const parsed = parseSSELine(chunk)
      if (parsed?.data) {
        const jsonData = safeParseJSON(parsed.data)
        return jsonData ? extractStreamContent(jsonData) : parsed.data
      }
      return ''
    }

    case 'json-stream':
    case 'ndjson': {
      const parsed = safeParseJSON(chunk)
      return parsed ? extractStreamContent(parsed) : ''
    }

    case 'plain-text':
    default:
      return chunk
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
      hash = ((hash << 5) - hash) + char
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

      await new Promise(resolve => setTimeout(resolve, delay))
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
    streams.map(stream => processStream(stream, { signal }))
  )

  return results.map(r => r.content).join('')
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

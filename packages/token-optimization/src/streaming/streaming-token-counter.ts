/**
 * Streaming Token Counter
 *
 * Incremental token counting for streaming LLM responses.
 * Tracks tokens in real-time as chunks arrive without buffering entire response.
 */

import { encode } from 'gpt-tokenizer'

/**
 * Streaming chunk event
 */
export interface StreamingChunk {
  /** Chunk content */
  content: string
  /** Chunk sequence number */
  sequence: number
  /** Cumulative content so far */
  cumulative: string
  /** Is this the final chunk? */
  isFinal: boolean
  /** Provider-specific metadata */
  metadata?: Record<string, any>
}

/**
 * Streaming token stats
 */
export interface StreamingTokenStats {
  /** Total tokens counted so far */
  totalTokens: number
  /** Tokens in current chunk */
  chunkTokens: number
  /** Number of chunks processed */
  chunkCount: number
  /** Average tokens per chunk */
  averageChunkTokens: number
  /** Estimated final tokens (if prediction enabled) */
  estimatedFinalTokens?: number
  /** Confidence in estimation (0-1) */
  estimationConfidence?: number
}

/**
 * Token prediction strategy
 */
export type PredictionStrategy =
  | 'linear' // Linear extrapolation
  | 'average' // Based on average chunk size
  | 'none' // No prediction

/**
 * Streaming token counter configuration
 */
export interface StreamingTokenCounterConfig {
  /** Enable final token prediction */
  enablePrediction?: boolean
  /** Prediction strategy */
  predictionStrategy?: PredictionStrategy
  /** Callback for token updates */
  onTokenUpdate?: (stats: StreamingTokenStats) => void
  /** Buffer size for more accurate counting (default: 0 = no buffering) */
  bufferSize?: number
}

/**
 * Streaming Token Counter
 *
 * Counts tokens incrementally as streaming chunks arrive.
 */
export class StreamingTokenCounter {
  private config: Required<StreamingTokenCounterConfig>
  private totalTokens: number = 0
  private chunkCount: number = 0
  private buffer: string = ''
  private tokenHistory: number[] = []

  constructor(config: StreamingTokenCounterConfig = {}) {
    this.config = {
      enablePrediction: config.enablePrediction ?? false,
      predictionStrategy: config.predictionStrategy ?? 'average',
      onTokenUpdate: config.onTokenUpdate ?? (() => {}),
      bufferSize: config.bufferSize ?? 0,
    }
  }

  /**
   * Process a streaming chunk
   */
  processChunk(chunk: StreamingChunk): StreamingTokenStats {
    this.chunkCount++

    // Add to buffer if buffering is enabled
    if (this.config.bufferSize > 0) {
      this.buffer += chunk.content

      // Only count when buffer is full or final chunk
      if (this.buffer.length >= this.config.bufferSize || chunk.isFinal) {
        const bufferTokens = this.countTokens(this.buffer)
        const chunkTokens = bufferTokens - this.totalTokens
        this.totalTokens = bufferTokens
        this.tokenHistory.push(chunkTokens)
        this.buffer = ''
      }
    } else {
      // Count cumulative tokens (more accurate but requires full text)
      const cumulativeTokens = this.countTokens(chunk.cumulative)
      const chunkTokens = cumulativeTokens - this.totalTokens
      this.totalTokens = cumulativeTokens
      this.tokenHistory.push(chunkTokens)
    }

    const stats = this.getStats(chunk.isFinal)
    this.config.onTokenUpdate(stats)

    return stats
  }

  /**
   * Get current statistics
   */
  getStats(isFinal: boolean = false): StreamingTokenStats {
    const averageChunkTokens = this.chunkCount > 0
      ? this.tokenHistory.reduce((sum, t) => sum + t, 0) / this.tokenHistory.length
      : 0

    const stats: StreamingTokenStats = {
      totalTokens: this.totalTokens,
      chunkTokens: this.tokenHistory[this.tokenHistory.length - 1] || 0,
      chunkCount: this.chunkCount,
      averageChunkTokens,
    }

    // Add prediction if enabled and not final
    if (this.config.enablePrediction && !isFinal && this.chunkCount >= 3) {
      const prediction = this.predictFinalTokens()
      stats.estimatedFinalTokens = prediction.tokens
      stats.estimationConfidence = prediction.confidence
    }

    return stats
  }

  /**
   * Predict final token count
   */
  private predictFinalTokens(): { tokens: number; confidence: number } {
    if (this.tokenHistory.length < 3) {
      return { tokens: this.totalTokens, confidence: 0 }
    }

    switch (this.config.predictionStrategy) {
      case 'linear': {
        // Linear extrapolation based on recent trend
        const recent = this.tokenHistory.slice(-5)
        const avgRecent = recent.reduce((sum, t) => sum + t, 0) / recent.length

        // Assume we're halfway through (simple heuristic)
        const estimated = this.totalTokens * 2
        const confidence = Math.min(this.chunkCount / 10, 0.8)

        return { tokens: estimated, confidence }
      }

      case 'average': {
        // Based on average chunk size
        const avgChunk = this.tokenHistory.reduce((sum, t) => sum + t, 0) / this.tokenHistory.length

        // Estimate total chunks (assume we're 1/3 through)
        const estimatedTotalChunks = this.chunkCount * 3
        const estimated = avgChunk * estimatedTotalChunks
        const confidence = Math.min(this.chunkCount / 10, 0.7)

        return { tokens: estimated, confidence }
      }

      default:
        return { tokens: this.totalTokens, confidence: 0 }
    }
  }

  /**
   * Count tokens in text
   */
  private countTokens(text: string): number {
    if (!text) return 0

    try {
      return encode(text).length
    } catch (error) {
      // Fallback: rough estimation (1 token ≈ 4 characters)
      return Math.ceil(text.length / 4)
    }
  }

  /**
   * Reset counter
   */
  reset(): void {
    this.totalTokens = 0
    this.chunkCount = 0
    this.buffer = ''
    this.tokenHistory = []
  }
}

/**
 * Stream adapter for different providers
 */
export class StreamAdapter {
  /**
   * Adapt OpenAI streaming format
   */
  static openai(
    stream: AsyncIterable<any>,
    onChunk: (chunk: StreamingChunk) => void
  ): AsyncIterable<StreamingChunk> {
    return (async function* () {
      let sequence = 0
      let cumulative = ''

      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content || ''
        if (content) {
          cumulative += content

          const streamingChunk: StreamingChunk = {
            content,
            sequence: sequence++,
            cumulative,
            isFinal: chunk.choices?.[0]?.finish_reason !== null,
            metadata: {
              finishReason: chunk.choices?.[0]?.finish_reason,
              model: chunk.model,
            },
          }

          onChunk(streamingChunk)
          yield streamingChunk
        }
      }
    })()
  }

  /**
   * Adapt Anthropic streaming format
   */
  static anthropic(
    stream: AsyncIterable<any>,
    onChunk: (chunk: StreamingChunk) => void
  ): AsyncIterable<StreamingChunk> {
    return (async function* () {
      let sequence = 0
      let cumulative = ''

      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          const content = event.delta?.text || ''
          if (content) {
            cumulative += content

            const streamingChunk: StreamingChunk = {
              content,
              sequence: sequence++,
              cumulative,
              isFinal: false,
              metadata: {
                type: event.type,
                index: event.index,
              },
            }

            onChunk(streamingChunk)
            yield streamingChunk
          }
        } else if (event.type === 'message_stop') {
          const streamingChunk: StreamingChunk = {
            content: '',
            sequence: sequence++,
            cumulative,
            isFinal: true,
            metadata: {
              type: event.type,
              stopReason: event.stop_reason,
            },
          }

          onChunk(streamingChunk)
          yield streamingChunk
        }
      }
    })()
  }

  /**
   * Adapt generic SSE (Server-Sent Events) format
   */
  static sse(
    stream: AsyncIterable<string>,
    onChunk: (chunk: StreamingChunk) => void
  ): AsyncIterable<StreamingChunk> {
    return (async function* () {
      let sequence = 0
      let cumulative = ''

      for await (const line of stream) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)

          if (data === '[DONE]') {
            const streamingChunk: StreamingChunk = {
              content: '',
              sequence: sequence++,
              cumulative,
              isFinal: true,
            }

            onChunk(streamingChunk)
            yield streamingChunk
            break
          }

          try {
            const parsed = JSON.parse(data)
            const content = parsed.content || parsed.text || ''

            if (content) {
              cumulative += content

              const streamingChunk: StreamingChunk = {
                content,
                sequence: sequence++,
                cumulative,
                isFinal: false,
              }

              onChunk(streamingChunk)
              yield streamingChunk
            }
          } catch (error) {
            // Skip invalid JSON
            continue
          }
        }
      }
    })()
  }
}

/**
 * Helper to create streaming token counter with provider adapter
 */
export function createStreamingCounter(
  provider: 'openai' | 'anthropic' | 'sse',
  config?: StreamingTokenCounterConfig
): {
  counter: StreamingTokenCounter
  adapt: (stream: AsyncIterable<any>) => AsyncIterable<StreamingChunk>
} {
  const counter = new StreamingTokenCounter(config)

  const adapt = (stream: AsyncIterable<any>) => {
    switch (provider) {
      case 'openai':
        return StreamAdapter.openai(stream, (chunk) => counter.processChunk(chunk))
      case 'anthropic':
        return StreamAdapter.anthropic(stream, (chunk) => counter.processChunk(chunk))
      case 'sse':
        return StreamAdapter.sse(stream as AsyncIterable<string>, (chunk) => counter.processChunk(chunk))
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }

  return { counter, adapt }
}

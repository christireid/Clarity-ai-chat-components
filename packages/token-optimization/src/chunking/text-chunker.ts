/**
 * Text Chunker
 *
 * High-performance text chunking using llm-splitter.
 *
 * llm-splitter is a lightweight alternative to LangChain's text splitters:
 * - 100x smaller footprint (~KB vs 21MB for @langchain/textsplitters)
 * - Single-pass greedy algorithm for speed
 * - Paragraph-aware chunking
 * - Rich metadata with character positions
 *
 * @see https://github.com/nearform/llm-splitter
 */

import { split, type Chunk } from 'llm-splitter'
import { encode } from 'gpt-tokenizer'

/**
 * Options for llm-splitter's split function
 */
interface SplitOptions {
  chunkSize?: number
  chunkOverlap?: number
  splitter?: (input: string) => string[]
  chunkStrategy?: 'character' | 'paragraph'
}

/**
 * Chunking strategy presets
 */
export enum ChunkingStrategy {
  /** Small chunks for precise retrieval (256 tokens, 10% overlap) */
  PRECISE = 'precise',
  /** Balanced chunks for general use (512 tokens, 15% overlap) */
  BALANCED = 'balanced',
  /** Large chunks for context preservation (1024 tokens, 20% overlap) */
  CONTEXT = 'context',
  /** Custom configuration */
  CUSTOM = 'custom',
}

/**
 * Chunking configuration
 */
export interface ChunkingConfig {
  /** Maximum tokens per chunk (default: 512) */
  maxTokens?: number
  /** Overlap between chunks as percentage of maxTokens (default: 0.15) */
  overlapPercentage?: number
  /** Chunking strategy preset (default: BALANCED) */
  strategy?: ChunkingStrategy
  /** Include token count in metadata (default: true) */
  includeTokenCount?: boolean
}

/**
 * A single text chunk with metadata
 */
export interface TextChunk {
  /** Chunk content */
  text: string
  /** Chunk index (0-based) */
  index: number
  /** Start character position in original text */
  startPosition: number
  /** End character position in original text */
  endPosition: number
  /** Token count for this chunk */
  tokenCount: number
  /** Metadata */
  metadata: {
    /** Whether this chunk starts a new paragraph */
    startsNewParagraph?: boolean
    /** Overlap tokens from previous chunk */
    overlapTokens?: number
  }
}

/**
 * Result of chunking operation
 */
export interface ChunkingResult {
  /** Array of chunks */
  chunks: TextChunk[]
  /** Total number of chunks */
  totalChunks: number
  /** Total tokens across all chunks (includes overlap) */
  totalTokens: number
  /** Original text token count */
  originalTokens: number
  /** Overhead from overlapping chunks */
  overheadPercentage: number
  /** Configuration used */
  config: Required<ChunkingConfig>
}

/**
 * Strategy presets with optimal settings for different use cases
 */
const STRATEGY_PRESETS: Record<ChunkingStrategy, Partial<ChunkingConfig>> = {
  [ChunkingStrategy.PRECISE]: {
    maxTokens: 256,
    overlapPercentage: 0.1,
  },
  [ChunkingStrategy.BALANCED]: {
    maxTokens: 512,
    overlapPercentage: 0.15,
  },
  [ChunkingStrategy.CONTEXT]: {
    maxTokens: 1024,
    overlapPercentage: 0.2,
  },
  [ChunkingStrategy.CUSTOM]: {},
}

/**
 * Simple word-based splitter for llm-splitter
 */
function wordSplitter(text: string): string[] {
  // Split on whitespace while preserving the whitespace as separate tokens
  return text.split(/(\s+)/).filter((s) => s.length > 0)
}

/**
 * TextChunker - High-performance text chunking for LLM applications
 *
 * @example
 * ```typescript
 * const chunker = new TextChunker({ strategy: ChunkingStrategy.BALANCED })
 * const result = chunker.chunk(longDocument)
 *
 * for (const chunk of result.chunks) {
 *   console.log(`Chunk ${chunk.index}: ${chunk.tokenCount} tokens`)
 *   // Process chunk...
 * }
 * ```
 */
export class TextChunker {
  private config: Required<ChunkingConfig>

  constructor(config: ChunkingConfig = {}) {
    const strategy = config.strategy || ChunkingStrategy.BALANCED
    const preset = STRATEGY_PRESETS[strategy]

    this.config = {
      maxTokens: config.maxTokens ?? preset.maxTokens ?? 512,
      overlapPercentage:
        config.overlapPercentage ?? preset.overlapPercentage ?? 0.15,
      strategy,
      includeTokenCount: config.includeTokenCount ?? true,
    }
  }

  /**
   * Chunk text into smaller pieces with overlap
   */
  chunk(text: string): ChunkingResult {
    if (!text || text.trim().length === 0) {
      return {
        chunks: [],
        totalChunks: 0,
        totalTokens: 0,
        originalTokens: 0,
        overheadPercentage: 0,
        config: this.config,
      }
    }

    // Calculate overlap
    const overlapTokens = Math.floor(
      this.config.maxTokens * this.config.overlapPercentage
    )

    // Configure llm-splitter
    // Use word-based splitting for better results
    const splitOptions: SplitOptions = {
      chunkSize: this.config.maxTokens,
      chunkOverlap: overlapTokens,
      splitter: wordSplitter,
      chunkStrategy: 'paragraph',
    }

    // Perform the split
    const rawChunks = split(text, splitOptions)

    // Calculate original token count
    const originalTokens = encode(text).length

    // Transform chunks with metadata, filtering out null/empty chunks
    const chunks: TextChunk[] = rawChunks
      .filter((chunk: Chunk) => chunk.text !== null && chunk.text !== '')
      .map((chunk: Chunk, index: number) => {
        // Handle text that could be string or string[]
        const chunkText = Array.isArray(chunk.text)
          ? chunk.text.join('')
          : (chunk.text as string)

        const tokenCount = this.config.includeTokenCount
          ? encode(chunkText).length
          : 0

        return {
          text: chunkText,
          index,
          startPosition: chunk.start,
          endPosition: chunk.end,
          tokenCount,
          metadata: {
            startsNewParagraph: index === 0 || chunkText.startsWith('\n'),
            overlapTokens: index > 0 ? overlapTokens : 0,
          },
        }
      })

    // Calculate totals
    const totalTokens = chunks.reduce((sum, c) => sum + c.tokenCount, 0)
    const overheadPercentage =
      originalTokens > 0
        ? ((totalTokens - originalTokens) / originalTokens) * 100
        : 0

    return {
      chunks,
      totalChunks: chunks.length,
      totalTokens,
      originalTokens,
      overheadPercentage: Math.round(overheadPercentage * 100) / 100,
      config: this.config,
    }
  }

  /**
   * Chunk text and return just the text strings
   */
  chunkToStrings(text: string): string[] {
    return this.chunk(text).chunks.map((chunk) => chunk.text)
  }

  /**
   * Estimate number of chunks without actually chunking
   */
  estimateChunkCount(text: string): number {
    if (!text) return 0

    const tokens = encode(text).length
    const effectiveChunkSize =
      this.config.maxTokens * (1 - this.config.overlapPercentage)

    return Math.ceil(tokens / effectiveChunkSize)
  }

  /**
   * Check if text needs chunking based on token limit
   */
  needsChunking(text: string, maxTokens?: number): boolean {
    if (!text) return false

    const limit = maxTokens ?? this.config.maxTokens
    const tokens = encode(text).length

    return tokens > limit
  }

  /**
   * Get the current configuration
   */
  getConfig(): Required<ChunkingConfig> {
    return { ...this.config }
  }

  /**
   * Create a new chunker with updated configuration
   */
  withConfig(config: Partial<ChunkingConfig>): TextChunker {
    return new TextChunker({
      ...this.config,
      ...config,
    })
  }

  /**
   * Static factory methods for common strategies
   */
  static precise(): TextChunker {
    return new TextChunker({ strategy: ChunkingStrategy.PRECISE })
  }

  static balanced(): TextChunker {
    return new TextChunker({ strategy: ChunkingStrategy.BALANCED })
  }

  static context(): TextChunker {
    return new TextChunker({ strategy: ChunkingStrategy.CONTEXT })
  }
}

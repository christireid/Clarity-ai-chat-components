/**
 * MarkdownCompressor - Token-optimized markdown compression
 *
 * Compresses markdown content using TOON-inspired notation to reduce
 * token usage while maintaining semantic meaning.
 *
 * @module markdown-compressor
 */

import { ToonOptimizer } from '../formats/toon-optimizer'

/**
 * Compression level presets
 */
export enum CompressionLevel {
  /** Minimal compression - preserves most formatting */
  Light = 'light',
  /** Balanced compression - good savings with readability */
  Moderate = 'moderate',
  /** Maximum compression - prioritizes token savings */
  Aggressive = 'aggressive',
}

/**
 * Configuration for markdown compression
 */
export interface MarkdownCompressorConfig {
  /** Compression level preset */
  level?: CompressionLevel
  /** Enable TOON format for embedded JSON/data blocks */
  enableTOON?: boolean
  /** Preserve code block language hints */
  preserveCodeLanguage?: boolean
  /** Maximum consecutive blank lines allowed */
  maxBlankLines?: number
}

/**
 * Result of markdown compression
 */
export interface CompressionResult {
  /** Compressed markdown content */
  compressed: string
  /** Original content size in characters */
  originalSize: number
  /** Compressed content size in characters */
  compressedSize: number
  /** Savings as percentage (0-100) */
  savingsPercent: number
  /** Estimated tokens saved (approximate) */
  estimatedTokensSaved: number
  /** Whether TOON compression was applied to data blocks */
  toonApplied: boolean
}

/**
 * Token-optimized markdown compressor
 *
 * Replaces verbose markdown syntax with compact symbols:
 * - Headers: # → §, ## → §§, etc.
 * - Lists: - or * → •
 * - Removes excessive whitespace
 * - Optionally converts JSON to TOON format
 *
 * @example
 * ```typescript
 * const compressor = new MarkdownCompressor({
 *   level: CompressionLevel.Moderate,
 *   enableTOON: true
 * })
 *
 * const result = compressor.compress(markdownContent)
 * console.log(`Saved ${result.savingsPercent}% tokens`)
 * ```
 */
export class MarkdownCompressor {
  private config: Required<MarkdownCompressorConfig>
  private toonOptimizer: ToonOptimizer

  constructor(config: MarkdownCompressorConfig = {}) {
    this.config = {
      level: config.level ?? CompressionLevel.Moderate,
      enableTOON: config.enableTOON ?? false,
      preserveCodeLanguage: config.preserveCodeLanguage ?? true,
      maxBlankLines: config.maxBlankLines ?? 1,
    }

    this.toonOptimizer = new ToonOptimizer({
      enableArrayTables: true,
      maxArraySizeForTable: 100,
      preserveKeys: false,
      compactNumbers: true,
      quoteStrings: false,
    })
  }

  /**
   * Compress markdown content for optimal token usage
   *
   * @param content - Markdown content to compress
   * @returns Compression result with statistics
   */
  compress(content: string): CompressionResult {
    const originalSize = content.length

    if (!content.trim()) {
      return {
        compressed: '',
        originalSize,
        compressedSize: 0,
        savingsPercent: 0,
        estimatedTokensSaved: 0,
        toonApplied: false,
      }
    }

    let compressed = content
    let toonApplied = false

    // Apply compression based on level
    compressed = this.normalizeHeaders(compressed)
    compressed = this.compactLists(compressed)
    compressed = this.optimizeWhitespace(compressed)
    compressed = this.optimizeCodeBlocks(compressed)
    compressed = this.optimizeFormatting(compressed)
    compressed = this.optimizeBlockquotes(compressed)
    compressed = this.trimLineWhitespace(compressed)

    // Apply TOON to JSON blocks if enabled
    if (this.config.enableTOON) {
      const toonResult = this.applyTOON(compressed)
      compressed = toonResult.content
      toonApplied = toonResult.applied
    }

    const compressedSize = compressed.length
    const savingsPercent =
      originalSize > 0
        ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
        : 0

    // Estimate tokens (rough approximation: ~4 chars per token)
    const estimatedTokensSaved = Math.floor((originalSize - compressedSize) / 4)

    return {
      compressed,
      originalSize,
      compressedSize,
      savingsPercent,
      estimatedTokensSaved,
      toonApplied,
    }
  }

  /**
   * Decompress TOON-compressed markdown back to standard format
   *
   * @param compressed - Compressed markdown content
   * @returns Decompressed markdown
   */
  decompress(compressed: string): string {
    let result = compressed

    // Restore headers from § symbols
    result = result.replace(/^§§§§§§ /gm, '###### ')
    result = result.replace(/^§§§§§ /gm, '##### ')
    result = result.replace(/^§§§§ /gm, '#### ')
    result = result.replace(/^§§§ /gm, '### ')
    result = result.replace(/^§§ /gm, '## ')
    result = result.replace(/^§ /gm, '# ')

    // Restore list markers from • symbols
    result = result.replace(/^• /gm, '- ')

    return result
  }

  /**
   * Replace # headers with § symbols for token savings
   */
  private normalizeHeaders(content: string): string {
    return content
      .replace(/^###### /gm, '§§§§§§ ')
      .replace(/^##### /gm, '§§§§§ ')
      .replace(/^#### /gm, '§§§§ ')
      .replace(/^### /gm, '§§§ ')
      .replace(/^## /gm, '§§ ')
      .replace(/^# /gm, '§ ')
  }

  /**
   * Compact list markers
   */
  private compactLists(content: string): string {
    // Replace - and * list markers with •
    return content.replace(/^(\s*)[*-] /gm, '$1• ')
  }

  /**
   * Optimize whitespace - remove excessive blank lines
   */
  private optimizeWhitespace(content: string): string {
    const maxBlanks = this.config.maxBlankLines

    // Replace multiple consecutive blank lines with maximum allowed
    const pattern = new RegExp(`(\\n\\s*){${maxBlanks + 2},}`, 'g')
    const replacement = '\n'.repeat(maxBlanks + 1)

    return content.replace(pattern, replacement)
  }

  /**
   * Trim trailing whitespace from lines
   */
  private trimLineWhitespace(content: string): string {
    return content
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trim()
  }

  /**
   * Optimize code blocks based on compression level
   */
  private optimizeCodeBlocks(content: string): string {
    if (this.config.level !== CompressionLevel.Aggressive) {
      return content
    }

    // At aggressive level, remove language specifiers from code fences
    return content.replace(/```\w+\n/g, '```\n')
  }

  /**
   * Optimize inline formatting based on compression level
   */
  private optimizeFormatting(content: string): string {
    let result = content

    if (
      this.config.level === CompressionLevel.Moderate ||
      this.config.level === CompressionLevel.Aggressive
    ) {
      // Remove redundant emphasis markers (keep text, remove markers)
      // **text** → text, _text_ → text
      result = result.replace(/\*\*([^*]+)\*\*/g, '$1')
      result = result.replace(/__([^_]+)__/g, '$1')
    }

    if (this.config.level === CompressionLevel.Aggressive) {
      // Also remove single emphasis at aggressive level
      result = result.replace(/\*([^*]+)\*/g, '$1')
      result = result.replace(/_([^_]+)_/g, '$1')
    }

    return result
  }

  /**
   * Optimize blockquotes
   */
  private optimizeBlockquotes(content: string): string {
    // Replace > with shorter marker at higher compression levels
    if (
      this.config.level === CompressionLevel.Moderate ||
      this.config.level === CompressionLevel.Aggressive
    ) {
      return content.replace(/^> /gm, '» ')
    }
    return content
  }

  /**
   * Apply TOON format to embedded JSON blocks
   */
  private applyTOON(content: string): { content: string; applied: boolean } {
    let applied = false

    // Find JSON code blocks and convert to TOON
    const result = content.replace(
      /```json\n([\s\S]*?)\n```/g,
      (match, jsonContent) => {
        try {
          const data = JSON.parse(jsonContent)
          const toon = this.toonOptimizer.encode(data)
          applied = true
          return `\`\`\`toon\n${toon}\n\`\`\``
        } catch {
          // If JSON parsing fails, keep original
          return match
        }
      }
    )

    return { content: result, applied }
  }
}

/**
 * String Compression using lz-string
 *
 * UTF-16 optimized string compression for browser environments.
 * Particularly effective for:
 * - localStorage/sessionStorage (UTF-16 native)
 * - URL-safe compression for query parameters
 * - Compressing conversation history for client-side caching
 *
 * @module string-compression
 */

import LZString from 'lz-string'

/**
 * Compression format options
 */
export type StringCompressionFormat =
  | 'utf16' // Default, smallest output for UTF-16 storage
  | 'base64' // URL-safe, can be used in URLs without encoding
  | 'uri' // Designed for URI components
  | 'uint8' // Raw byte array

/**
 * Options for string compression
 */
export interface StringCompressionOptions {
  /** Output format (default: 'utf16') */
  format?: StringCompressionFormat
  /** Minimum string length to compress (default: 100) */
  minLength?: number
  /** Skip compression if ratio would be worse than threshold (default: 0.9) */
  ratioThreshold?: number
}

/**
 * Result of string compression
 */
export interface StringCompressionResult {
  /** Compressed string (or original if compression not beneficial) */
  compressed: string
  /** Original size in characters */
  originalSize: number
  /** Compressed size in characters */
  compressedSize: number
  /** Compression ratio (compressedSize / originalSize) */
  compressionRatio: number
  /** Whether compression was applied */
  wasCompressed: boolean
  /** Format used for compression */
  format: StringCompressionFormat
}

/**
 * String Compressor using lz-string
 *
 * Provides efficient string compression optimized for browser storage
 * and network transfer in JavaScript environments.
 *
 * @example
 * ```typescript
 * const compressor = new StringCompressor();
 *
 * // Compress for localStorage
 * const result = compressor.compress(largeConversation);
 * localStorage.setItem('conversation', result.compressed);
 *
 * // Decompress
 * const stored = localStorage.getItem('conversation');
 * const original = compressor.decompress(stored);
 *
 * // Compress for URL
 * const urlSafe = compressor.compress(data, { format: 'uri' });
 * const url = `https://example.com?data=${urlSafe.compressed}`;
 * ```
 */
export class StringCompressor {
  private readonly defaultOptions: Required<StringCompressionOptions>

  constructor(options: StringCompressionOptions = {}) {
    this.defaultOptions = {
      format: options.format ?? 'utf16',
      minLength: options.minLength ?? 100,
      ratioThreshold: options.ratioThreshold ?? 0.9,
    }
  }

  /**
   * Compress a string
   *
   * @param input - String to compress
   * @param options - Override default options
   * @returns Compression result
   */
  compress(
    input: string,
    options?: StringCompressionOptions
  ): StringCompressionResult {
    const opts = { ...this.defaultOptions, ...options }

    // Skip compression for small strings
    if (input.length < opts.minLength) {
      return {
        compressed: input,
        originalSize: input.length,
        compressedSize: input.length,
        compressionRatio: 1,
        wasCompressed: false,
        format: opts.format,
      }
    }

    // Compress based on format
    let compressed: string
    switch (opts.format) {
      case 'base64':
        compressed = LZString.compressToBase64(input)
        break
      case 'uri':
        compressed = LZString.compressToEncodedURIComponent(input)
        break
      case 'uint8': {
        // For uint8, we still return a string representation
        const uint8 = LZString.compressToUint8Array(input)
        compressed = Buffer.from(uint8).toString('base64')
        break
      }
      case 'utf16':
      default:
        compressed = LZString.compressToUTF16(input)
        break
    }

    const compressionRatio = compressed.length / input.length

    // Check if compression is beneficial
    if (compressionRatio >= opts.ratioThreshold) {
      return {
        compressed: input,
        originalSize: input.length,
        compressedSize: input.length,
        compressionRatio: 1,
        wasCompressed: false,
        format: opts.format,
      }
    }

    return {
      compressed,
      originalSize: input.length,
      compressedSize: compressed.length,
      compressionRatio,
      wasCompressed: true,
      format: opts.format,
    }
  }

  /**
   * Decompress a string
   *
   * @param input - Compressed string
   * @param format - Format used for compression
   * @returns Original string or null if decompression fails
   */
  decompress(
    input: string,
    format: StringCompressionFormat = this.defaultOptions.format
  ): string | null {
    try {
      switch (format) {
        case 'base64':
          return LZString.decompressFromBase64(input)
        case 'uri':
          return LZString.decompressFromEncodedURIComponent(input)
        case 'uint8': {
          const buffer = Buffer.from(input, 'base64')
          return LZString.decompressFromUint8Array(new Uint8Array(buffer))
        }
        case 'utf16':
        default:
          return LZString.decompressFromUTF16(input)
      }
    } catch {
      return null
    }
  }

  /**
   * Compress for localStorage/sessionStorage (optimal format)
   *
   * @param input - String to compress
   * @returns Compressed string
   */
  compressForStorage(input: string): string {
    return this.compress(input, { format: 'utf16' }).compressed
  }

  /**
   * Decompress from localStorage/sessionStorage
   *
   * @param input - Compressed string
   * @returns Original string
   */
  decompressFromStorage(input: string): string | null {
    return this.decompress(input, 'utf16')
  }

  /**
   * Compress for URL query parameters
   *
   * @param input - String to compress
   * @returns URL-safe compressed string
   */
  compressForURL(input: string): string {
    return this.compress(input, { format: 'uri' }).compressed
  }

  /**
   * Decompress from URL query parameter
   *
   * @param input - URL-safe compressed string
   * @returns Original string
   */
  decompressFromURL(input: string): string | null {
    return this.decompress(input, 'uri')
  }

  /**
   * Estimate compression ratio without full compression
   *
   * @param input - String to analyze
   * @returns Estimated compression ratio
   */
  estimateCompressionRatio(input: string): number {
    // Quick entropy-based estimation
    const charFreq = new Map<string, number>()
    for (const char of input) {
      charFreq.set(char, (charFreq.get(char) || 0) + 1)
    }

    // Calculate Shannon entropy
    let entropy = 0
    for (const count of charFreq.values()) {
      const p = count / input.length
      entropy -= p * Math.log2(p)
    }

    // LZ compression can approach entropy limit
    // Typical ratio is entropy/16 for UTF-16 strings
    // Adding overhead for LZ dictionary
    const theoreticalRatio = Math.min(1, entropy / 16 + 0.1)

    return theoreticalRatio
  }
}

/**
 * Create a default string compressor instance
 */
export function createStringCompressor(
  options?: StringCompressionOptions
): StringCompressor {
  return new StringCompressor(options)
}

/**
 * Quick compress for localStorage using default settings
 *
 * @param input - String to compress
 * @returns Compressed string
 */
export function compressString(input: string): string {
  const compressor = new StringCompressor()
  return compressor.compressForStorage(input)
}

/**
 * Quick decompress from localStorage using default settings
 *
 * @param input - Compressed string
 * @returns Original string
 */
export function decompressString(input: string): string | null {
  const compressor = new StringCompressor()
  return compressor.decompressFromStorage(input)
}

/**
 * Compress for URL-safe transfer
 *
 * @param input - String to compress
 * @returns URL-safe compressed string
 */
export function compressForURL(input: string): string {
  const compressor = new StringCompressor()
  return compressor.compressForURL(input)
}

/**
 * Decompress from URL parameter
 *
 * @param input - URL-safe compressed string
 * @returns Original string
 */
export function decompressFromURL(input: string): string | null {
  const compressor = new StringCompressor()
  return compressor.decompressFromURL(input)
}

/**
 * Conversation cache helper for client-side storage
 *
 * Provides efficient caching of conversation history with automatic
 * compression and decompression.
 *
 * @example
 * ```typescript
 * const cache = new ConversationCache('my-app');
 *
 * // Save conversation
 * cache.save('conv-123', messages);
 *
 * // Load conversation
 * const messages = cache.load('conv-123');
 *
 * // Clear old conversations
 * cache.cleanup(7); // Keep only last 7 days
 * ```
 */
export class ConversationCache {
  private prefix: string
  private compressor: StringCompressor

  constructor(appPrefix: string = 'clarity') {
    this.prefix = `${appPrefix}:conv:`
    this.compressor = new StringCompressor()
  }

  /**
   * Save conversation to storage
   *
   * @param id - Conversation ID
   * @param messages - Messages to save
   */
  save(id: string, messages: unknown[]): void {
    const key = this.prefix + id
    const data = JSON.stringify({
      messages,
      timestamp: Date.now(),
    })
    const compressed = this.compressor.compressForStorage(data)

    try {
      localStorage.setItem(key, compressed)
    } catch (e) {
      // Storage quota exceeded, try to make room
      this.cleanup(1) // Keep only today
      localStorage.setItem(key, compressed)
    }
  }

  /**
   * Load conversation from storage
   *
   * @param id - Conversation ID
   * @returns Messages or null if not found
   */
  load(id: string): unknown[] | null {
    const key = this.prefix + id
    const compressed = localStorage.getItem(key)

    if (!compressed) return null

    const decompressed = this.compressor.decompressFromStorage(compressed)
    if (!decompressed) return null

    try {
      const data = JSON.parse(decompressed)
      return data.messages
    } catch {
      return null
    }
  }

  /**
   * Clean up old conversations
   *
   * @param daysToKeep - Number of days to keep
   */
  cleanup(daysToKeep: number): void {
    const cutoff = Date.now() - daysToKeep * 24 * 60 * 60 * 1000
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.prefix)) {
        const compressed = localStorage.getItem(key)
        if (compressed) {
          const decompressed = this.compressor.decompressFromStorage(compressed)
          if (decompressed) {
            try {
              const data = JSON.parse(decompressed)
              if (data.timestamp < cutoff) {
                keysToRemove.push(key)
              }
            } catch {
              keysToRemove.push(key)
            }
          }
        }
      }
    }

    for (const key of keysToRemove) {
      localStorage.removeItem(key)
    }
  }
}

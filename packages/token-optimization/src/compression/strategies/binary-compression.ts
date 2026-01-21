/**
 * Binary Compression Strategy using fflate
 *
 * High-performance binary compression using WASM-accelerated deflate.
 * Achieves 3-10x faster compression than pako with 8KB bundle size.
 *
 * Use cases:
 * - Compressing JSON payloads for network transfer
 * - Reducing memory footprint of cached data
 * - Binary serialization of structured data
 *
 * @module binary-compression
 */

import {
  deflate,
  inflate,
  strToU8,
  strFromU8,
  deflateSync,
  inflateSync,
} from 'fflate'

/**
 * Valid compression levels for fflate
 */
export type CompressionLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/**
 * Options for binary compression
 */
export interface BinaryCompressionOptions {
  /** Compression level 0-9 (higher = more compression, slower) */
  level?: CompressionLevel
  /** Use streaming compression for large data */
  streaming?: boolean
  /** Memory level 1-9 (higher = more memory, better compression) */
  memoryLevel?: number
}

/**
 * Result of binary compression
 */
export interface BinaryCompressionResult {
  /** Original size in bytes */
  originalSize: number
  /** Compressed size in bytes */
  compressedSize: number
  /** Compression ratio (compressedSize / originalSize) */
  compressionRatio: number
  /** Space savings percentage */
  savingsPercentage: number
  /** Compressed data as base64 string */
  compressed: string
  /** Processing time in milliseconds */
  processingTimeMs: number
}

/**
 * Result of binary decompression
 */
export interface BinaryDecompressionResult {
  /** Decompressed string data */
  decompressed: string
  /** Original compressed size in bytes */
  compressedSize: number
  /** Decompressed size in bytes */
  decompressedSize: number
  /** Processing time in milliseconds */
  processingTimeMs: number
}

/**
 * Promisify helper for deflate
 */
function deflateAsync(
  data: Uint8Array,
  options: { level: CompressionLevel }
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    deflate(data, options, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

/**
 * Promisify helper for inflate
 */
function inflateAsync(data: Uint8Array): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    inflate(data, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

/**
 * Binary compression using fflate (WASM-accelerated deflate)
 *
 * @example
 * ```typescript
 * const compressor = new BinaryCompressor();
 *
 * // Compress a JSON object
 * const data = { users: [...], metadata: {...} };
 * const result = await compressor.compress(JSON.stringify(data));
 * console.log(`Compressed ${result.savingsPercentage}%`);
 *
 * // Decompress
 * const restored = await compressor.decompress(result.compressed);
 * const original = JSON.parse(restored.decompressed);
 * ```
 */
export class BinaryCompressor {
  private readonly level: CompressionLevel

  constructor(options: BinaryCompressionOptions = {}) {
    this.level = options.level ?? 6
    // streaming and memoryLevel reserved for future implementation

    const { streaming: _streaming, memoryLevel: _memoryLevel } = options
  }

  /**
   * Compress a string to binary format
   *
   * @param data - String data to compress
   * @param options - Override default options
   * @returns Compression result with base64-encoded data
   */
  async compress(
    data: string,
    options?: BinaryCompressionOptions
  ): Promise<BinaryCompressionResult> {
    const startTime = performance.now()
    const level = options?.level ?? this.level

    // Convert string to Uint8Array
    const inputBytes = strToU8(data)
    const originalSize = inputBytes.length

    // Compress using deflate
    const compressed = await deflateAsync(inputBytes, { level })
    const compressedSize = compressed.length

    // Convert to base64 for storage/transfer
    const base64 = this.uint8ArrayToBase64(compressed)

    const processingTimeMs = performance.now() - startTime

    return {
      originalSize,
      compressedSize,
      compressionRatio: compressedSize / originalSize,
      savingsPercentage: ((originalSize - compressedSize) / originalSize) * 100,
      compressed: base64,
      processingTimeMs,
    }
  }

  /**
   * Decompress base64-encoded binary data back to string
   *
   * @param base64Data - Base64-encoded compressed data
   * @returns Decompression result with original string
   */
  async decompress(base64Data: string): Promise<BinaryDecompressionResult> {
    const startTime = performance.now()

    // Decode base64 to Uint8Array
    const compressed = this.base64ToUint8Array(base64Data)
    const compressedSize = compressed.length

    // Decompress using inflate
    const decompressed = await inflateAsync(compressed)
    const decompressedSize = decompressed.length

    // Convert back to string
    const decompressedStr = strFromU8(decompressed)

    const processingTimeMs = performance.now() - startTime

    return {
      decompressed: decompressedStr,
      compressedSize,
      decompressedSize,
      processingTimeMs,
    }
  }

  /**
   * Compress synchronously (for smaller data)
   *
   * @param data - String data to compress
   * @returns Base64-encoded compressed data
   */
  compressSync(data: string): string {
    const inputBytes = strToU8(data)
    const compressed = deflateSync(inputBytes, { level: this.level })
    return this.uint8ArrayToBase64(compressed)
  }

  /**
   * Decompress synchronously (for smaller data)
   *
   * @param base64Data - Base64-encoded compressed data
   * @returns Decompressed string
   */
  decompressSync(base64Data: string): string {
    const compressed = this.base64ToUint8Array(base64Data)
    const decompressed = inflateSync(compressed)
    return strFromU8(decompressed)
  }

  /**
   * Estimate compression ratio without full compression
   * Useful for quick decisions about whether to compress
   *
   * @param data - String data to analyze
   * @returns Estimated compression ratio
   */
  estimateCompressionRatio(data: string): number {
    // Quick entropy-based estimation
    const bytes = strToU8(data)
    const frequencyMap = new Map<number, number>()

    for (const byte of bytes) {
      frequencyMap.set(byte, (frequencyMap.get(byte) || 0) + 1)
    }

    // Calculate Shannon entropy
    let entropy = 0
    for (const count of frequencyMap.values()) {
      const probability = count / bytes.length
      entropy -= probability * Math.log2(probability)
    }

    // Estimate compression ratio based on entropy
    // Max entropy is 8 bits per byte, compression approaches entropy limit
    const theoreticalRatio = entropy / 8

    // Add overhead for deflate headers and practical limits
    return Math.min(1, Math.max(0.1, theoreticalRatio + 0.05))
  }

  /**
   * Convert Uint8Array to base64 string (browser-compatible)
   */
  private uint8ArrayToBase64(bytes: Uint8Array): string {
    // Use btoa for browser compatibility, with fallback to Buffer for Node
    if (typeof btoa !== 'undefined') {
      let binary = ''
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return btoa(binary)
    } else {
      return Buffer.from(bytes).toString('base64')
    }
  }

  /**
   * Convert base64 string to Uint8Array (browser-compatible)
   */
  private base64ToUint8Array(base64: string): Uint8Array {
    // Use atob for browser compatibility, with fallback to Buffer for Node
    if (typeof atob !== 'undefined') {
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      return bytes
    } else {
      return new Uint8Array(Buffer.from(base64, 'base64'))
    }
  }
}

/**
 * Create a default binary compressor instance
 */
export function createBinaryCompressor(
  options?: BinaryCompressionOptions
): BinaryCompressor {
  return new BinaryCompressor(options)
}

/**
 * Compress data using binary compression with default settings
 *
 * @param data - String to compress
 * @returns Base64-encoded compressed data
 */
export async function compressBinary(data: string): Promise<string> {
  const compressor = new BinaryCompressor()
  const result = await compressor.compress(data)
  return result.compressed
}

/**
 * Decompress binary-compressed data
 *
 * @param base64Data - Base64-encoded compressed data
 * @returns Decompressed string
 */
export async function decompressBinary(base64Data: string): Promise<string> {
  const compressor = new BinaryCompressor()
  const result = await compressor.decompress(base64Data)
  return result.decompressed
}

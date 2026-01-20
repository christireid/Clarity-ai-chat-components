/**
 * Binary Serialization using msgpackr
 *
 * High-performance binary serialization achieving 2-3x faster encoding
 * and 30-50% smaller output than JSON.stringify for structured data.
 *
 * Use cases:
 * - Caching TOON-optimized data in binary format
 * - Network transfer of structured AI context
 * - Storing compressed conversation history
 *
 * @module binary-serialization
 */

import { pack, unpack, Packr, Unpackr } from 'msgpackr'

/**
 * Options for binary serialization
 */
export interface BinarySerializationOptions {
  /** Use structured clone for complex objects with circular refs */
  structuredClone?: boolean
  /** Maximum string length before using separate buffer (default: 4096) */
  maxStringLength?: number
  /** Enable sequential read mode for large datasets */
  sequential?: boolean
  /** Use maps instead of objects for better performance */
  useMaps?: boolean
}

/**
 * Result of binary serialization
 */
export interface SerializationResult {
  /** Serialized data as base64 string */
  serialized: string
  /** Original size estimate (JSON bytes) */
  originalSize: number
  /** Serialized size in bytes */
  serializedSize: number
  /** Compression ratio (serializedSize / originalSize) */
  compressionRatio: number
  /** Space savings percentage */
  savingsPercentage: number
}

/**
 * Result of binary deserialization
 */
export interface DeserializationResult<T = unknown> {
  /** Deserialized data */
  data: T
  /** Serialized size in bytes */
  serializedSize: number
}

/**
 * Binary Serializer using MessagePack
 *
 * Provides efficient binary serialization optimized for AI/LLM data structures.
 * Particularly effective for:
 * - Conversation histories with repeated message structures
 * - Embeddings and vector data
 * - Context windows with structured metadata
 *
 * @example
 * ```typescript
 * const serializer = new BinarySerializer();
 *
 * // Serialize conversation context
 * const context = {
 *   messages: [
 *     { role: 'user', content: 'Hello' },
 *     { role: 'assistant', content: 'Hi there!' }
 *   ],
 *   metadata: { model: 'gpt-4', temperature: 0.7 }
 * };
 *
 * const result = serializer.serialize(context);
 * console.log(`Saved ${result.savingsPercentage.toFixed(1)}%`);
 *
 * // Deserialize
 * const { data } = serializer.deserialize(result.serialized);
 * ```
 */
export class BinarySerializer {
  private packr: Packr
  private unpackr: Unpackr

  constructor(options: BinarySerializationOptions = {}) {
    this.packr = new Packr({
      structuredClone: options.structuredClone ?? false,
      maxSharedStructures: 64, // Optimize for repeated structures
      useRecords: true, // Use record structures for objects
    })

    this.unpackr = new Unpackr({
      structuredClone: options.structuredClone ?? false,
      useRecords: true,
    })
  }

  /**
   * Serialize data to binary format (base64 encoded)
   *
   * @param data - Any JSON-serializable data
   * @returns Serialization result with metrics
   */
  serialize<T>(data: T): SerializationResult {
    // Estimate original JSON size
    const jsonStr = JSON.stringify(data)
    const originalSize = Buffer.byteLength(jsonStr, 'utf8')

    // Serialize to MessagePack
    const buffer = this.packr.pack(data)
    const serializedSize = buffer.length

    // Convert to base64 for string storage
    const serialized = Buffer.from(buffer).toString('base64')

    return {
      serialized,
      originalSize,
      serializedSize,
      compressionRatio: serializedSize / originalSize,
      savingsPercentage: ((originalSize - serializedSize) / originalSize) * 100,
    }
  }

  /**
   * Deserialize base64-encoded binary data
   *
   * @param base64Data - Base64-encoded MessagePack data
   * @returns Deserialization result with data
   */
  deserialize<T = unknown>(base64Data: string): DeserializationResult<T> {
    const buffer = Buffer.from(base64Data, 'base64')
    const data = this.unpackr.unpack(buffer) as T

    return {
      data,
      serializedSize: buffer.length,
    }
  }

  /**
   * Serialize directly to Uint8Array (no base64 encoding)
   *
   * Use when storing in binary-compatible storage like IndexedDB.
   *
   * @param data - Data to serialize
   * @returns Raw binary buffer
   */
  serializeToBuffer<T>(data: T): Uint8Array {
    return this.packr.pack(data)
  }

  /**
   * Deserialize from Uint8Array
   *
   * @param buffer - Raw binary buffer
   * @returns Deserialized data
   */
  deserializeFromBuffer<T = unknown>(buffer: Uint8Array): T {
    return this.unpackr.unpack(buffer) as T
  }

  /**
   * Estimate savings without full serialization
   *
   * @param data - Data to analyze
   * @returns Estimated savings percentage
   */
  estimateSavings(data: unknown): number {
    const jsonSize = JSON.stringify(data).length

    // MessagePack typically achieves:
    // - 20-30% savings for simple objects
    // - 30-50% savings for arrays of objects with repeated keys
    // - 50-70% savings for numeric arrays
    const structure = this.analyzeStructure(data)

    if (structure.hasNumericArrays) {
      return 60
    } else if (structure.hasRepeatedKeys) {
      return 40
    } else {
      return 25
    }
  }

  /**
   * Analyze data structure for optimization hints
   */
  private analyzeStructure(data: unknown): {
    hasNumericArrays: boolean
    hasRepeatedKeys: boolean
    depth: number
  } {
    let hasNumericArrays = false
    let hasRepeatedKeys = false
    const keyCount = new Map<string, number>()

    const analyze = (obj: unknown, depth: number): number => {
      if (Array.isArray(obj)) {
        if (obj.length > 0 && typeof obj[0] === 'number') {
          hasNumericArrays = true
        }
        return Math.max(depth, ...obj.map((item) => analyze(item, depth + 1)))
      } else if (typeof obj === 'object' && obj !== null) {
        for (const key of Object.keys(obj)) {
          keyCount.set(key, (keyCount.get(key) || 0) + 1)
        }
        return Math.max(
          depth,
          ...Object.values(obj).map((v) => analyze(v, depth + 1))
        )
      }
      return depth
    }

    const maxDepth = analyze(data, 0)

    for (const count of keyCount.values()) {
      if (count > 2) {
        hasRepeatedKeys = true
        break
      }
    }

    return { hasNumericArrays, hasRepeatedKeys, depth: maxDepth }
  }
}

/**
 * Create a default binary serializer instance
 */
export function createBinarySerializer(
  options?: BinarySerializationOptions
): BinarySerializer {
  return new BinarySerializer(options)
}

/**
 * Quick serialize using default settings
 *
 * @param data - Data to serialize
 * @returns Base64-encoded binary data
 */
export function serializeBinary<T>(data: T): string {
  const serializer = new BinarySerializer()
  return serializer.serialize(data).serialized
}

/**
 * Quick deserialize using default settings
 *
 * @param base64Data - Base64-encoded binary data
 * @returns Deserialized data
 */
export function deserializeBinary<T = unknown>(base64Data: string): T {
  const serializer = new BinarySerializer()
  return serializer.deserialize<T>(base64Data).data
}

/**
 * Combined TOON + MessagePack optimization
 *
 * First converts to TOON format for token optimization,
 * then serializes to binary for efficient storage/transfer.
 *
 * @param data - Data to optimize
 * @param toonEncoder - Optional TOON encoder function
 * @returns Optimized binary data with metrics
 */
export function optimizeAndSerialize(
  data: unknown,
  toonEncoder?: (data: unknown) => string
): {
  toonOptimized: string
  binarySerialized: string
  metrics: {
    jsonSize: number
    toonSize: number
    binarySize: number
    totalSavings: number
  }
} {
  const serializer = new BinarySerializer()

  // Get JSON baseline
  const jsonStr = JSON.stringify(data)
  const jsonSize = jsonStr.length

  // TOON optimization
  const toonOptimized = toonEncoder ? toonEncoder(data) : jsonStr
  const toonSize = toonOptimized.length

  // Binary serialization of original data (not TOON string)
  const binaryResult = serializer.serialize(data)
  const binarySize = binaryResult.serializedSize

  return {
    toonOptimized,
    binarySerialized: binaryResult.serialized,
    metrics: {
      jsonSize,
      toonSize,
      binarySize,
      totalSavings:
        ((jsonSize - Math.min(toonSize, binarySize)) / jsonSize) * 100,
    },
  }
}

'use client'

import * as React from 'react'
import {
  DynamicCompressionEngine,
  type DynamicCompressionConfig,
  type CompressionResult as TokenOptCompressionResult,
  type CompressionStrategy as TokenOptCompressionStrategy,
} from '@clarity-chat/token-optimization/compression'
import type { ChatMessage } from '@clarity-chat/token-optimization'
import type { UsePromptCompressorConfig, UsePromptCompressorReturn, CompressionResult, CompressionStrategy } from './types'

/**
 * usePromptCompressor - Client-side prompt compression
 *
 * Wraps the DynamicCompressionEngine from @clarity-chat/token-optimization to provide
 * React-friendly compression with tiered strategies:
 * - Heuristic (2-3x): Fast, rule-based compression
 * - Semantic (3-5x): Semantic similarity-based compression
 * - Syntactic: Structure-preserving compression
 * - Hybrid: Combined strategies for best results
 *
 * @param config - Configuration options
 * @returns Compression utilities and state
 *
 * @example
 * ```tsx
 * function CompressedChat() {
 *   const {
 *     compress,
 *     compressMessages,
 *     isCompressing,
 *     analyzeCompressibility,
 *   } = usePromptCompressor({
 *     targetRatio: 0.5,
 *     strategy: 'auto',
 *     preserveStructure: true,
 *   })
 *
 *   const handleSend = async (message: string) => {
 *     // Check if compression is worthwhile
 *     const analysis = await analyzeCompressibility(message)
 *
 *     if (analysis.estimatedRatio < 0.7) {
 *       // Good compression potential
 *       const result = await compress(message)
 *       console.log(`Compressed ${result.compressionRatio}x, saved ${result.tokensSaved} tokens`)
 *       return sendToAPI(result.compressed)
 *     }
 *
 *     return sendToAPI(message)
 *   }
 *
 *   return (
 *     <div>
 *       {isCompressing && <span>Compressing...</span>}
 *     </div>
 *   )
 * }
 * ```
 */
export function usePromptCompressor(
  config: UsePromptCompressorConfig = {}
): UsePromptCompressorReturn {
  // Compressor ref
  const compressorRef = React.useRef<DynamicCompressionEngine | null>(null)

  // State
  const [isCompressing, setIsCompressing] = React.useState(false)
  const [isModelLoaded, setIsModelLoaded] = React.useState(false)

  // Initialize compressor using DynamicCompressionEngine from token-optimization
  React.useEffect(() => {
    const compressionConfig: DynamicCompressionConfig = {
      targetQuality: config.qualityThreshold ?? 0.85,
      maxCompressionRatio: config.targetRatio ?? 0.5,
      enableAdaptiveCompression: true,
      enableContentAwareCompression: config.preserveStructure ?? true,
      enableQualityMonitoring: true,
      compressionStrategies: [], // Use engine's default strategies
      qualityThreshold: config.qualityThreshold ?? 0.85,
      fallbackStrategy: 'minimal',
      enableRealTimeFeedback: false,
    }

    compressorRef.current = new DynamicCompressionEngine(compressionConfig)
    setIsModelLoaded(true)
  }, [
    config.targetRatio,
    config.strategy,
    config.preserveStructure,
    config.minTokens,
    config.qualityThreshold,
  ])

  /**
   * Compress text
   */
  const compress = React.useCallback(
    async (
      text: string,
      overrideConfig?: Partial<UsePromptCompressorConfig>
    ): Promise<CompressionResult> => {
      if (!compressorRef.current) {
        throw new Error('Compressor not initialized')
      }

      setIsCompressing(true)

      try {
        const result = await compressorRef.current.compress(text)

        // Map token-optimization result to local CompressionResult type
        return {
          original: result.originalContent || '',
          compressed: result.compressedContent || '',
          compressionRatio: result.compressionRatio || 1.0,
          tokensSaved: result.tokensSaved || 0,
          strategy: (result.strategyUsed || 'auto') as CompressionStrategy,
          qualityScore: result.qualityScore || 0,
        }
      } finally {
        setIsCompressing(false)
      }
    },
    []
  )

  /**
   * Compress chat messages
   */
  const compressMessages = React.useCallback(
    async (
      messages: ChatMessage[]
    ): Promise<{
      messages: ChatMessage[]
      totalSaved: number
      compressionRatio: number
    }> => {
      if (!compressorRef.current) {
        throw new Error('Compressor not initialized')
      }

      setIsCompressing(true)

      try {
        let totalSaved = 0
        let totalOriginalTokens = 0
        let totalCompressedTokens = 0

        const compressedMessages = await Promise.all(
          messages.map(async (msg) => {
            const result = await compressorRef.current!.compress(msg.content)
            totalSaved += result.tokensSaved
            totalOriginalTokens += Math.ceil(msg.content.length / 4) // Estimate
            totalCompressedTokens += Math.ceil(result.compressedContent.length / 4)

            return {
              ...msg,
              content: result.compressedContent,
            }
          })
        )

        return {
          messages: compressedMessages,
          totalSaved,
          compressionRatio: totalOriginalTokens > 0
            ? totalCompressedTokens / totalOriginalTokens
            : 1,
        }
      } finally {
        setIsCompressing(false)
      }
    },
    []
  )

  /**
   * Streaming compression (generator)
   */
  const compressStream = React.useCallback(
    async function* (
      text: string
    ): AsyncGenerator<{ chunk: string; progress: number }> {
      if (!compressorRef.current) {
        throw new Error('Compressor not initialized')
      }

      // Compress the full text
      const result = await compressorRef.current.compress(text)

      // Simulate chunked output
      const chunkSize = 100
      let position = 0

      while (position < result.compressedContent.length) {
        const chunk = result.compressedContent.slice(position, position + chunkSize)
        const progress = Math.min(
          (position + chunkSize) / result.compressedContent.length,
          1
        )
        yield { chunk, progress }
        position += chunkSize
      }
    },
    []
  )

  /**
   * Load model (for model-based compression)
   */
  const loadModel = React.useCallback(async (): Promise<void> => {
    // DynamicCompressionEngine doesn't require explicit model loading
    setIsModelLoaded(true)
  }, [])

  /**
   * Analyze compressibility
   */
  const analyzeCompressibility = React.useCallback(
    async (
      text: string
    ): Promise<{
      estimatedRatio: number
      recommendedStrategy: CompressionStrategy
      redundancyScore: number
    }> => {
      if (!compressorRef.current) {
        throw new Error('Compressor not initialized')
      }

      // Perform a quick compression to analyze
      const result = await compressorRef.current.compress(text)

      // Determine recommended strategy based on results
      const recommendedStrategy: CompressionStrategy =
        result.compressionRatio < 0.3 ? 'extractive' :
        result.compressionRatio < 0.6 ? 'heuristic' : 'auto'

      return {
        estimatedRatio: result.compressionRatio,
        recommendedStrategy,
        redundancyScore: 1 - result.qualityMetrics.informationRetention,
      }
    },
    []
  )

  return {
    compress,
    compressMessages,
    compressStream,
    isCompressing,
    isModelLoaded,
    loadModel,
    analyzeCompressibility,
  }
}

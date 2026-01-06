'use client'

import * as React from 'react'
import { createPromptCompressor, PromptCompressor } from '@clarity-chat/clarity-tokens'
import type { CompressionResult, CompressionStrategy, ChatMessage } from '@clarity-chat/clarity-tokens'
import type { UsePromptCompressorConfig, UsePromptCompressorReturn } from './types'

/**
 * usePromptCompressor - Client-side prompt compression
 *
 * Implements tiered compression strategies for reducing token usage:
 * - Heuristic (2-3x): Fast, rule-based compression
 * - Extractive (3-5x): TF-IDF based sentence selection
 * - Auto: Selects best strategy based on input
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
 *
 * @example
 * ```tsx
 * // Compress entire message history
 * function CompressHistory() {
 *   const { compressMessages } = usePromptCompressor()
 *
 *   const optimizeContext = async (messages: ChatMessage[]) => {
 *     const { messages: compressed, totalSaved, compressionRatio } =
 *       await compressMessages(messages)
 *
 *     console.log(`Saved ${totalSaved} tokens (${compressionRatio}x compression)`)
 *     return compressed
 *   }
 * }
 * ```
 */
export function usePromptCompressor(
  config: UsePromptCompressorConfig = {}
): UsePromptCompressorReturn {
  // Compressor ref
  const compressorRef = React.useRef<PromptCompressor | null>(null)

  // State
  const [isCompressing, setIsCompressing] = React.useState(false)
  const [isModelLoaded, setIsModelLoaded] = React.useState(false)

  // Initialize compressor
  React.useEffect(() => {
    compressorRef.current = createPromptCompressor({
      targetRatio: config.targetRatio,
      strategy: config.strategy,
      preserveStructure: config.preserveStructure,
      minTokens: config.minTokens,
      qualityThreshold: config.qualityThreshold,
    })
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
        const result = compressorRef.current.compress(text, overrideConfig)
        return result
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
        const result = compressorRef.current.compressMessages(
          messages.map((m) => ({ role: m.role, content: m.content }))
        )

        // Map back to ChatMessage format
        const compressedMessages = messages.map((original, i) => ({
          ...original,
          content: result.messages[i]?.content ?? original.content,
        }))

        return {
          messages: compressedMessages,
          totalSaved: result.totalSaved,
          compressionRatio: result.compressionRatio,
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

      // For now, just yield the full compressed result
      // A real implementation would process chunks incrementally
      const result = compressorRef.current.compress(text)

      // Simulate chunked output
      const chunkSize = 100
      let position = 0

      while (position < result.compressed.length) {
        const chunk = result.compressed.slice(position, position + chunkSize)
        const progress = Math.min(
          (position + chunkSize) / result.compressed.length,
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
    // Model-based compression would require loading a model
    // For now, mark as loaded since we're using heuristic/extractive
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

      return compressorRef.current.analyzeCompressibility(text)
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

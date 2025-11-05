import * as React from 'react'
import { compressPrompt, CompressionOptions, CompressionResult } from '../utils/prompt-compression'

export interface UsePromptCompressionOptions extends CompressionOptions {
  /** Enable auto-compression on input */
  enabled?: boolean
  /** Minimum input length to trigger compression (default: 50) */
  minLength?: number
  /** Callback when compression is applied */
  onCompress?: (result: CompressionResult) => void
}

export interface UsePromptCompressionReturn {
  /** Compress a prompt */
  compress: (text: string) => CompressionResult
  /** Compressed version of text (if enabled) */
  compressedText: string | null
  /** Last compression result */
  lastResult: CompressionResult | null
  /** Total tokens saved */
  totalTokensSaved: number
  /** Total savings percentage */
  averageSavingsPercent: number
  /** Number of compressions performed */
  compressionCount: number
  /** Reset statistics */
  resetStats: () => void
}

/**
 * Hook for prompt compression with automatic tracking
 * 
 * @example
 * ```tsx
 * function ChatInput() {
 *   const [input, setInput] = useState('')
 *   const { compress, totalTokensSaved } = usePromptCompression({
 *     removeFillers: true,
 *     useAbbreviations: true,
 *   })
 * 
 *   const handleSend = () => {
 *     const result = compress(input)
 *     sendMessage(result.compressed)
 *     console.log(`Saved ${result.tokenSavings} tokens!`)
 *   }
 * 
 *   return (
 *     <div>
 *       <textarea value={input} onChange={(e) => setInput(e.target.value)} />
 *       <button onClick={handleSend}>Send</button>
 *       <div>Total tokens saved: {totalTokensSaved}</div>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePromptCompression(
  options: UsePromptCompressionOptions = {}
): UsePromptCompressionReturn {
  const {
    enabled = true,
    minLength = 50,
    onCompress,
    ...compressionOptions
  } = options

  const [compressedText, setCompressedText] = React.useState<string | null>(null)
  const [lastResult, setLastResult] = React.useState<CompressionResult | null>(null)
  const [stats, setStats] = React.useState({
    totalTokensSaved: 0,
    totalSavingsPercent: 0,
    count: 0,
  })

  const compress = React.useCallback(
    (text: string): CompressionResult => {
      if (!enabled || text.length < minLength) {
        return {
          compressed: text,
          original: text,
          originalLength: text.length,
          compressedLength: text.length,
          savingsPercent: 0,
          originalTokens: Math.ceil(text.length / 4),
          compressedTokens: Math.ceil(text.length / 4),
          tokenSavings: 0,
        }
      }

      const result = compressPrompt(text, compressionOptions)
      
      setCompressedText(result.compressed)
      setLastResult(result)
      
      setStats((prev) => ({
        totalTokensSaved: prev.totalTokensSaved + result.tokenSavings,
        totalSavingsPercent:
          (prev.totalSavingsPercent * prev.count + result.savingsPercent) /
          (prev.count + 1),
        count: prev.count + 1,
      }))

      onCompress?.(result)

      return result
    },
    [enabled, minLength, compressionOptions, onCompress]
  )

  const resetStats = React.useCallback(() => {
    setStats({
      totalTokensSaved: 0,
      totalSavingsPercent: 0,
      count: 0,
    })
  }, [])

  return {
    compress,
    compressedText,
    lastResult,
    totalTokensSaved: stats.totalTokensSaved,
    averageSavingsPercent: stats.totalSavingsPercent,
    compressionCount: stats.count,
    resetStats,
  }
}

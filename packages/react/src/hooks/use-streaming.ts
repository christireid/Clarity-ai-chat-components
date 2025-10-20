import * as React from 'react'

export interface UseStreamingOptions {
  onChunk?: (chunk: string) => void
  onComplete?: (fullText: string) => void
  onError?: (error: Error) => void
}

export interface UseStreamingReturn {
  content: string
  isStreaming: boolean
  startStreaming: (stream: ReadableStream<Uint8Array>) => Promise<void>
  reset: () => void
}

export function useStreaming(options: UseStreamingOptions = {}): UseStreamingReturn {
  const { onChunk, onComplete, onError } = options
  
  const [content, setContent] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(false)

  const startStreaming = React.useCallback(
    async (stream: ReadableStream<Uint8Array>) => {
      setIsStreaming(true)
      setContent('')

      try {
        const reader = stream.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          fullText += chunk

          setContent(fullText)
          onChunk?.(chunk)
        }

        onComplete?.(fullText)
      } catch (err) {
        onError?.(err as Error)
      } finally {
        setIsStreaming(false)
      }
    },
    [onChunk, onComplete, onError]
  )

  const reset = React.useCallback(() => {
    setContent('')
    setIsStreaming(false)
  }, [])

  return {
    content,
    isStreaming,
    startStreaming,
    reset,
  }
}

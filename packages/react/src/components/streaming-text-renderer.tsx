import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'

/**
 * Streaming Text Renderer Component
 * 
 * Features from blueprint:
 * - Progressive character-by-character or chunk-based display
 * - Smooth animation with configurable typing speed
 * - Handling of incomplete markdown during streaming
 * - Buffer management for optimal performance
 * - Cursor/caret animation during active streaming
 * 
 * @example
 * ```tsx
 * <StreamingTextRenderer
 *   text={streamingText}
 *   isStreaming={true}
 *   typingSpeed={30}
 *   displayMode="character"
 * />
 * ```
 */
export interface StreamingTextRendererProps {
  /** Text content to render */
  text: string
  /** Is content currently streaming? */
  isStreaming?: boolean
  /** Typing speed in milliseconds per character */
  typingSpeed?: number
  /** Display mode */
  displayMode?: 'character' | 'chunk' | 'instant'
  /** Chunk size for chunk-based display */
  chunkSize?: number
  /** Show cursor animation */
  showCursor?: boolean
  /** Cursor character */
  cursorChar?: string
  /** Custom className */
  className?: string
  /** Callback when streaming completes */
  onStreamingComplete?: () => void
  /** Callback when character is displayed */
  onCharacterDisplayed?: (char: string, index: number) => void
}

export function StreamingTextRenderer({
  text,
  isStreaming = false,
  typingSpeed = 30,
  displayMode = 'character',
  chunkSize = 5,
  showCursor = true,
  cursorChar = '▋',
  className,
  onStreamingComplete,
  onCharacterDisplayed,
}: StreamingTextRendererProps) {
  const [displayedText, setDisplayedText] = React.useState('')
  const [isAnimating, setIsAnimating] = React.useState(false)
  const animationRef = React.useRef<number>()
  const previousTextRef = React.useRef('')

  // Handle streaming updates
  React.useEffect(() => {
    if (!isStreaming) {
      // When streaming stops, display remaining text instantly
      if (text !== displayedText) {
        setDisplayedText(text)
        setIsAnimating(false)
        onStreamingComplete?.()
      }
      return
    }

    // Detect new content
    const newContent = text.slice(displayedText.length)
    if (!newContent) return

    setIsAnimating(true)

    if (displayMode === 'instant') {
      // Instant display
      setDisplayedText(text)
      setIsAnimating(false)
      return
    }

    if (displayMode === 'chunk') {
      // Chunk-based display
      const chunks: string[] = []
      for (let i = 0; i < newContent.length; i += chunkSize) {
        chunks.push(newContent.slice(i, i + chunkSize))
      }

      let chunkIndex = 0
      const displayChunk = () => {
        if (chunkIndex < chunks.length) {
          setDisplayedText((prev) => {
            const updated = prev + chunks[chunkIndex]
            chunks[chunkIndex].split('').forEach((char: string, idx: number) => {
              onCharacterDisplayed?.(char, prev.length + idx)
            })
            return updated
          })
          chunkIndex++
          animationRef.current = window.setTimeout(displayChunk, typingSpeed * chunkSize)
        } else {
          setIsAnimating(false)
        }
      }

      displayChunk()
    } else {
      // Character-by-character display
      let charIndex = 0
      const displayChar = () => {
        if (charIndex < newContent.length && text.length > displayedText.length + charIndex) {
          const char = newContent[charIndex]
          setDisplayedText((prev) => {
            const updated = prev + char
            onCharacterDisplayed?.(char, prev.length)
            return updated
          })
          charIndex++
          animationRef.current = window.setTimeout(displayChar, typingSpeed)
        } else {
          setIsAnimating(false)
        }
      }

      displayChar()
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [text, isStreaming, displayMode, typingSpeed, chunkSize, displayedText, onCharacterDisplayed, onStreamingComplete])

  // Reset when text changes completely (new message)
  React.useEffect(() => {
    if (text.length < previousTextRef.current.length) {
      // Text was reset
      setDisplayedText('')
    }
    previousTextRef.current = text
  }, [text])

  return (
    <span className={cn('inline-block', className)}>
      {displayedText}
      {isStreaming && showCursor && (
        <motion.span
          animate={{
            opacity: [1, 0.3, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="inline-block ml-0.5 text-current"
          aria-hidden="true"
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  )
}

StreamingTextRenderer.displayName = 'StreamingTextRenderer'

/**
 * Hook for streaming text configuration
 */
export interface UseStreamingTextConfigOptions {
  /** Default typing speed */
  defaultTypingSpeed?: number
  /** Default display mode */
  defaultDisplayMode?: 'character' | 'chunk' | 'instant'
  /** Default chunk size */
  defaultChunkSize?: number
  /** Show cursor by default */
  defaultShowCursor?: boolean
}

export function useStreamingTextConfig(options: UseStreamingTextConfigOptions = {}) {
  const {
    defaultTypingSpeed = 30,
    defaultDisplayMode = 'character',
    defaultChunkSize = 5,
    defaultShowCursor = true,
  } = options

  return {
    typingSpeed: defaultTypingSpeed,
    displayMode: defaultDisplayMode,
    chunkSize: defaultChunkSize,
    showCursor: defaultShowCursor,
  }
}

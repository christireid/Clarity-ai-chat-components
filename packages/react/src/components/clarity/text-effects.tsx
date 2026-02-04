'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// ============================================================================
// TEXT SHIMMER - Animated shimmer loading effect
// ============================================================================

export interface TextShimmerProps {
  text?: string
  duration?: number
  spread?: number
  className?: string
  as?: React.ElementType
}

export function TextShimmer({
  text = 'Loading...',
  duration = 2,
  spread = 2,
  className,
  as: Component = 'span',
}: TextShimmerProps) {
  return (
    <Component
      className={cn(
        'inline-block bg-clip-text text-transparent',
        'bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground',
        'bg-[length:200%_100%]',
        'animate-shimmer',
        className
      )}
      style={{
        animationDuration: `${duration}s`,
        backgroundSize: `${spread * 100}% 100%`,
      }}
    >
      {text}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-shimmer {
          animation: shimmer ${duration}s linear infinite;
        }
      `}</style>
    </Component>
  )
}

// ============================================================================
// TYPING ANIMATION - Character by character typing effect
// ============================================================================

export interface TypingAnimationProps {
  text: string
  speed?: number
  delay?: number
  cursor?: boolean
  cursorChar?: string
  cursorBlinkSpeed?: number
  onComplete?: () => void
  className?: string
  cursorClassName?: string
  as?: React.ElementType
}

export function TypingAnimation({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = '|',
  cursorBlinkSpeed = 500,
  onComplete,
  className,
  cursorClassName,
  as: Component = 'span',
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = React.useState('')
  const [showCursor, setShowCursor] = React.useState(true)
  const [isComplete, setIsComplete] = React.useState(false)

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let currentIndex = 0

    const startTyping = () => {
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1))
          currentIndex++
          timeoutId = setTimeout(typeNextChar, speed)
        } else {
          setIsComplete(true)
          onComplete?.()
        }
      }

      timeoutId = setTimeout(typeNextChar, delay)
    }

    startTyping()

    return () => clearTimeout(timeoutId)
  }, [text, speed, delay, onComplete])

  // Cursor blink
  React.useEffect(() => {
    if (!cursor) return

    const intervalId = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, cursorBlinkSpeed)

    return () => clearInterval(intervalId)
  }, [cursor, cursorBlinkSpeed])

  return (
    <Component className={className}>
      {displayText}
      {cursor && (
        <span
          className={cn(
            'inline-block',
            cursorClassName,
            !showCursor && 'opacity-0'
          )}
        >
          {cursorChar}
        </span>
      )}
    </Component>
  )
}

// ============================================================================
// FADE IN TEXT - Word by word fade in effect
// ============================================================================

export interface FadeInTextProps {
  text: string
  delay?: number
  wordDelay?: number
  duration?: number
  className?: string
  wordClassName?: string
  as?: React.ElementType
  onComplete?: () => void
}

export function FadeInText({
  text,
  delay = 0,
  wordDelay = 100,
  duration = 300,
  className,
  wordClassName,
  as: Component = 'span',
  onComplete,
}: FadeInTextProps) {
  const words = text.split(' ')
  const [visibleWords, setVisibleWords] = React.useState<number[]>([])

  React.useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    words.forEach((_, index) => {
      const timeout = setTimeout(
        () => {
          setVisibleWords((prev) => [...prev, index])
          if (index === words.length - 1) {
            onComplete?.()
          }
        },
        delay + index * wordDelay
      )
      timeouts.push(timeout)
    })

    return () => timeouts.forEach(clearTimeout)
  }, [text, delay, wordDelay, words.length, onComplete])

  return (
    <Component className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={cn(
            'inline-block transition-opacity',
            wordClassName,
            visibleWords.includes(index) ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            transitionDuration: `${duration}ms`,
          }}
        >
          {word}
          {index < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </Component>
  )
}

// ============================================================================
// GRADIENT TEXT - Animated gradient text
// ============================================================================

export interface GradientTextProps {
  text: string
  colors?: string[]
  animated?: boolean
  duration?: number
  className?: string
  as?: React.ElementType
}

export function GradientText({
  text,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#3b82f6'],
  animated = true,
  duration = 3,
  className,
  as: Component = 'span',
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
    backgroundSize: animated ? '200% auto' : '100% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: animated ? `gradient ${duration}s linear infinite` : undefined,
  }

  return (
    <Component className={className} style={gradientStyle}>
      {text}
      {animated && (
        <style jsx>{`
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
      )}
    </Component>
  )
}

// ============================================================================
// STREAMING TEXT - For streaming AI responses
// ============================================================================

export interface StreamingTextProps {
  text: string
  speed?: number
  chunkSize?: number
  cursor?: boolean
  cursorChar?: string
  onChunk?: (chunk: string, fullText: string) => void
  onComplete?: () => void
  className?: string
  as?: React.ElementType
}

export function StreamingText({
  text,
  speed = 20,
  chunkSize = 3,
  cursor = true,
  cursorChar = '▋',
  onChunk,
  onComplete,
  className,
  as: Component = 'span',
}: StreamingTextProps) {
  const [displayText, setDisplayText] = React.useState('')
  const [isComplete, setIsComplete] = React.useState(false)

  React.useEffect(() => {
    let currentIndex = 0
    let timeoutId: NodeJS.Timeout

    const streamNextChunk = () => {
      if (currentIndex < text.length) {
        const endIndex = Math.min(currentIndex + chunkSize, text.length)
        const chunk = text.slice(currentIndex, endIndex)
        const newText = text.slice(0, endIndex)

        setDisplayText(newText)
        onChunk?.(chunk, newText)
        currentIndex = endIndex

        // Random variation in speed for natural feel
        const variance = speed * 0.5
        const nextSpeed = speed + (Math.random() * variance - variance / 2)
        timeoutId = setTimeout(streamNextChunk, nextSpeed)
      } else {
        setIsComplete(true)
        onComplete?.()
      }
    }

    streamNextChunk()

    return () => clearTimeout(timeoutId)
  }, [text, speed, chunkSize, onChunk, onComplete])

  return (
    <Component className={className}>
      {displayText}
      {cursor && !isComplete && (
        <span className="animate-pulse">{cursorChar}</span>
      )}
    </Component>
  )
}

// ============================================================================
// BLINKING TEXT - Text with blinking animation
// ============================================================================

export interface BlinkingTextProps {
  text: string
  speed?: number
  className?: string
  as?: React.ElementType
}

export function BlinkingText({
  text,
  speed = 1000,
  className,
  as: Component = 'span',
}: BlinkingTextProps) {
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setVisible((prev) => !prev)
    }, speed)

    return () => clearInterval(intervalId)
  }, [speed])

  return (
    <Component
      className={cn(
        'transition-opacity duration-150',
        className,
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      {text}
    </Component>
  )
}

// ============================================================================
// SCRAMBLE TEXT - Text scramble reveal effect
// ============================================================================

export interface ScrambleTextProps {
  text: string
  duration?: number
  characters?: string
  className?: string
  as?: React.ElementType
  onComplete?: () => void
}

export function ScrambleText({
  text,
  duration = 1000,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()',
  className,
  as: Component = 'span',
  onComplete,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = React.useState(text)

  React.useEffect(() => {
    const iterations = 10
    const intervalTime = duration / iterations
    let iteration = 0

    const intervalId = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < (iteration / iterations) * text.length) {
              return text[index]
            }
            return characters[Math.floor(Math.random() * characters.length)]
          })
          .join('')
      )

      iteration++

      if (iteration >= iterations) {
        clearInterval(intervalId)
        setDisplayText(text)
        onComplete?.()
      }
    }, intervalTime)

    return () => clearInterval(intervalId)
  }, [text, duration, characters, onComplete])

  return <Component className={className}>{displayText}</Component>
}

// ============================================================================
// CHARACTER REVEAL - Reveal characters one by one with animation
// ============================================================================

export interface CharacterRevealProps {
  text: string
  delay?: number
  charDelay?: number
  duration?: number
  direction?: 'left' | 'right' | 'center' | 'random'
  className?: string
  charClassName?: string
  as?: React.ElementType
  onComplete?: () => void
}

export function CharacterReveal({
  text,
  delay = 0,
  charDelay = 30,
  duration = 200,
  direction = 'left',
  className,
  charClassName,
  as: Component = 'span',
  onComplete,
}: CharacterRevealProps) {
  const [visibleChars, setVisibleChars] = React.useState<Set<number>>(new Set())
  const chars = text.split('')

  React.useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []
    let indices: number[]

    switch (direction) {
      case 'right':
        indices = [...Array(chars.length).keys()].reverse()
        break
      case 'center':
        const mid = Math.floor(chars.length / 2)
        indices = []
        for (let i = 0; i <= mid; i++) {
          if (mid - i >= 0) indices.push(mid - i)
          if (mid + i < chars.length && i !== 0) indices.push(mid + i)
        }
        break
      case 'random':
        indices = [...Array(chars.length).keys()].sort(
          () => Math.random() - 0.5
        )
        break
      default:
        indices = [...Array(chars.length).keys()]
    }

    indices.forEach((charIndex, orderIndex) => {
      const timeout = setTimeout(
        () => {
          setVisibleChars((prev) => new Set([...prev, charIndex]))
          if (orderIndex === indices.length - 1) {
            onComplete?.()
          }
        },
        delay + orderIndex * charDelay
      )
      timeouts.push(timeout)
    })

    return () => timeouts.forEach(clearTimeout)
  }, [text, delay, charDelay, direction, chars.length, onComplete])

  return (
    <Component className={className}>
      {chars.map((char, index) => (
        <span
          key={index}
          className={cn(
            'inline-block transition-all',
            charClassName,
            visibleChars.has(index)
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          )}
          style={{
            transitionDuration: `${duration}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Component>
  )
}

// ============================================================================
// COUNTER ANIMATION - Animated number counter
// ============================================================================

export interface CounterAnimationProps {
  from?: number
  to: number
  duration?: number
  formatter?: (value: number) => string
  className?: string
  as?: React.ElementType
  onComplete?: () => void
}

export function CounterAnimation({
  from = 0,
  to,
  duration = 1000,
  formatter = (v) => Math.round(v).toString(),
  className,
  as: Component = 'span',
  onComplete,
}: CounterAnimationProps) {
  const [value, setValue] = React.useState(from)

  React.useEffect(() => {
    const startTime = performance.now()
    const diff = to - from

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentValue = from + diff * eased

      setValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setValue(to)
        onComplete?.()
      }
    }

    requestAnimationFrame(animate)
  }, [from, to, duration, onComplete])

  return <Component className={className}>{formatter(value)}</Component>
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  TextShimmer,
  TypingAnimation,
  FadeInText,
  GradientText,
  StreamingText,
  BlinkingText,
  ScrambleText,
  CharacterReveal,
  CounterAnimation,
}

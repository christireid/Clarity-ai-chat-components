'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

// =============================================================================
// TYPEWRITER - Typewriter effect with multiple lines
// =============================================================================

interface TypewriterProps {
  text: string | string[]
  speed?: number
  delay?: number
  cursor?: boolean
  onComplete?: () => void
  className?: string
}

export function Typewriter({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete,
  className,
}: TypewriterProps) {
  const [displayText, setDisplayText] = React.useState('')
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const fullText = Array.isArray(text) ? text.join('\n') : text

  React.useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(
        () => {
          setDisplayText((prev) => prev + fullText[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        },
        currentIndex === 0 ? delay : speed
      )
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, fullText, speed, delay, onComplete])

  return (
    <span className={cn('font-mono', className)}>
      {displayText.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          {i < displayText.split('\n').length - 1 && <br />}
        </span>
      ))}
      {cursor && currentIndex < fullText.length && (
        <span className="inline-block w-0.5 h-5 bg-foreground ml-0.5 animate-pulse" />
      )}
    </span>
  )
}

// =============================================================================
// TEXT REVEAL - Text reveal with scroll or trigger
// =============================================================================

interface TextRevealProps {
  children: string
  delay?: number
  className?: string
  variant?: 'fade' | 'slide' | 'blur' | 'scale'
}

export function TextReveal({
  children,
  delay = 0,
  className,
  variant = 'fade',
}: TextRevealProps) {
  const words = children.split(' ')

  const animations = {
    fade: 'animate-in fade-in',
    slide: 'animate-in slide-in-from-bottom-4',
    blur: 'animate-in blur-in',
    scale: 'animate-in zoom-in',
  }

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={cn('inline-block opacity-0', animations[variant])}
          style={{
            animationDelay: `${delay + index * 0.05}s`,
            animationFillMode: 'forwards',
            animationDuration: '0.6s',
          }}
        >
          {word}
          {index < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  )
}

// =============================================================================
// FLIP TEXT - Text that flips between multiple states
// =============================================================================

interface FlipTextProps {
  words: string[]
  duration?: number
  className?: string
}

export function FlipText({ words, duration = 2000, className }: FlipTextProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length)
    }, duration)
    return () => clearInterval(interval)
  }, [words.length, duration])

  return (
    <span className={cn('relative inline-block', className)}>
      {words.map((word, index) => (
        <span
          key={index}
          className={cn(
            'absolute inset-0 transition-all duration-500',
            index === currentIndex
              ? 'opacity-100 translate-y-0 rotate-0'
              : index === (currentIndex - 1 + words.length) % words.length
                ? 'opacity-0 -translate-y-full rotate-12'
                : 'opacity-0 translate-y-full -rotate-12'
          )}
        >
          {word}
        </span>
      ))}
      <span className="invisible">{words[0]}</span>
    </span>
  )
}

// =============================================================================
// SCRAMBLE TEXT - Text scrambling effect
// =============================================================================

interface ScrambleTextProps {
  text: string
  speed?: number
  scrambleSpeed?: number
  characters?: string
  className?: string
}

export function ScrambleText({
  text,
  speed = 50,
  scrambleSpeed = 20,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
  className,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = React.useState(
    text.split('').map(() => ' ')
  )
  const [revealed, setRevealed] = React.useState(0)

  React.useEffect(() => {
    if (revealed >= text.length) return

    const scrambleInterval = setInterval(() => {
      setDisplayText((prev) =>
        prev.map((char, index) => {
          if (index < revealed) return text[index]
          if (index === revealed) return text[index]
          return characters[Math.floor(Math.random() * characters.length)]
        })
      )
    }, scrambleSpeed)

    const revealTimeout = setTimeout(() => {
      setRevealed((prev) => prev + 1)
    }, speed)

    return () => {
      clearInterval(scrambleInterval)
      clearTimeout(revealTimeout)
    }
  }, [revealed, text, speed, scrambleSpeed, characters])

  return (
    <span className={cn('font-mono', className)}>{displayText.join('')}</span>
  )
}

// =============================================================================
// GRADIENT TEXT - Animated gradient text
// =============================================================================

interface AnimatedGradientTextProps {
  children: React.ReactNode
  colors?: string[]
  className?: string
}

export function AnimatedGradientText({
  children,
  colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'],
  className,
}: AnimatedGradientTextProps) {
  const gradientStops = colors.map((color, index) => {
    const percent = (index / (colors.length - 1)) * 100
    return `${color} ${percent}%`
  })

  return (
    <span
      className={cn(
        'bg-clip-text text-transparent font-bold',
        'bg-[length:200%_auto] animate-gradient',
        className
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradientStops.join(', ')})`,
      }}
    >
      {children}
    </span>
  )
}

// =============================================================================
// SPLIT TEXT - Character-by-character animation
// =============================================================================

interface SplitTextProps {
  children: string
  delay?: number
  stagger?: number
  className?: string
  variant?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'rotate'
}

export function SplitText({
  children,
  delay = 0,
  stagger = 0.03,
  className,
  variant = 'fade',
}: SplitTextProps) {
  const chars = children.split('')

  const getAnimation = (index: number) => {
    const baseDelay = delay + index * stagger
    const baseClass = 'inline-block opacity-0'

    const variants = {
      fade: `${baseClass} animate-in fade-in`,
      'slide-up': `${baseClass} animate-in slide-in-from-bottom-2`,
      'slide-down': `${baseClass} animate-in slide-in-from-top-2`,
      scale: `${baseClass} animate-in zoom-in-50`,
      rotate: `${baseClass} animate-in spin-in`,
    }

    return {
      className: variants[variant],
      style: {
        animationDelay: `${baseDelay}s`,
        animationFillMode: 'forwards' as const,
        animationDuration: '0.5s',
      },
    }
  }

  return (
    <span className={className}>
      {chars.map((char, index) => {
        const animation = getAnimation(index)
        return (
          <span key={index} {...animation}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      })}
    </span>
  )
}

// =============================================================================
// NUMBER TICKER - Animated counting numbers
// =============================================================================

interface NumberTickerProps {
  value: number
  duration?: number
  delay?: number
  className?: string
  prefix?: string
  suffix?: string
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  duration = 2,
  delay = 0,
  className,
  prefix = '',
  suffix = '',
  decimalPlaces = 0,
}: NumberTickerProps) {
  const [count, setCount] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now() + delay * 1000
    const endTime = startTime + duration * 1000

    const updateCount = () => {
      const now = Date.now()
      if (now < startTime) {
        requestAnimationFrame(updateCount)
        return
      }

      const progress = Math.min((now - startTime) / (duration * 1000), 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = easeOut * value

      setCount(current)

      if (now < endTime) {
        requestAnimationFrame(updateCount)
      } else {
        setCount(value)
      }
    }

    requestAnimationFrame(updateCount)
  }, [isVisible, value, duration, delay])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toFixed(decimalPlaces)}
      {suffix}
    </span>
  )
}

// =============================================================================
// MORPHING TEXT - Text that morphs between states
// =============================================================================

interface MorphingTextProps {
  texts: string[]
  duration?: number
  className?: string
}

export function MorphingText({
  texts,
  duration = 3000,
  className,
}: MorphingTextProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length)
        setIsTransitioning(false)
      }, 300)
    }, duration)

    return () => clearInterval(interval)
  }, [texts.length, duration])

  return (
    <span
      className={cn(
        'inline-block transition-all duration-300',
        isTransitioning && 'blur-sm scale-95 opacity-0',
        !isTransitioning && 'blur-0 scale-100 opacity-100',
        className
      )}
    >
      {texts[currentIndex]}
    </span>
  )
}

// =============================================================================
// GLITCH TEXT - Glitch effect text
// =============================================================================

interface GlitchTextProps {
  children: string
  className?: string
}

export function GlitchText({ children, className }: GlitchTextProps) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="relative z-10">{children}</span>
      <span
        className="absolute top-0 left-0 text-cyan-500 animate-glitch-1"
        aria-hidden="true"
      >
        {children}
      </span>
      <span
        className="absolute top-0 left-0 text-red-500 animate-glitch-2"
        aria-hidden="true"
      >
        {children}
      </span>
      <style jsx>{`
        @keyframes glitch-1 {
          0% {
            clip-path: inset(40% 0 61% 0);
            transform: translate(0);
          }
          20% {
            clip-path: inset(92% 0 1% 0);
            transform: translate(-2px, 2px);
          }
          40% {
            clip-path: inset(43% 0 1% 0);
            transform: translate(-2px, -2px);
          }
          60% {
            clip-path: inset(25% 0 58% 0);
            transform: translate(2px, 2px);
          }
          80% {
            clip-path: inset(54% 0 7% 0);
            transform: translate(2px, -2px);
          }
          100% {
            clip-path: inset(58% 0 43% 0);
            transform: translate(0);
          }
        }
        @keyframes glitch-2 {
          0% {
            clip-path: inset(25% 0 58% 0);
            transform: translate(0);
          }
          20% {
            clip-path: inset(54% 0 7% 0);
            transform: translate(2px, -2px);
          }
          40% {
            clip-path: inset(58% 0 43% 0);
            transform: translate(2px, 2px);
          }
          60% {
            clip-path: inset(40% 0 61% 0);
            transform: translate(-2px, -2px);
          }
          80% {
            clip-path: inset(92% 0 1% 0);
            transform: translate(-2px, 2px);
          }
          100% {
            clip-path: inset(43% 0 1% 0);
            transform: translate(0);
          }
        }
        .animate-glitch-1 {
          animation: glitch-1 0.3s infinite linear alternate-reverse;
        }
        .animate-glitch-2 {
          animation: glitch-2 0.3s infinite linear alternate-reverse;
        }
      `}</style>
    </span>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { springs, buttonAnimation } from '@/lib/animations'
import clsx from 'clsx'

// =============================================================================
// TYPES
// =============================================================================

interface ScrollProgressProps {
  /** Show scroll-to-top button when scrolled */
  showScrollTop?: boolean
  /** Threshold (in pixels) to show scroll-to-top button */
  scrollTopThreshold?: number
  /** Position of the progress bar */
  position?: 'top' | 'bottom'
  /** Color variant */
  variant?: 'brand' | 'gradient'
  /** Height of the progress bar */
  height?: number
  /** Custom className */
  className?: string
}

// =============================================================================
// SCROLL PROGRESS BAR
// =============================================================================

export function ScrollProgress({
  showScrollTop = true,
  scrollTopThreshold = 300,
  position = 'top',
  variant = 'brand',
  height = 3,
  className,
}: ScrollProgressProps) {
  const [showButton, setShowButton] = useState(false)
  const { scrollYProgress } = useScroll()

  // Smooth spring animation for progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Handle scroll-to-top button visibility
  useEffect(() => {
    if (!showScrollTop) return

    const handleScroll = () => {
      setShowButton(window.scrollY > scrollTopThreshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showScrollTop, scrollTopThreshold])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const variantStyles = {
    brand: 'bg-brand-500',
    gradient: 'bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500',
  }

  const positionStyles = {
    top: 'top-0',
    bottom: 'bottom-0',
  }

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className={clsx(
          'fixed left-0 right-0 z-50 origin-left',
          positionStyles[position],
          variantStyles[variant],
          className
        )}
        style={{
          scaleX,
          height: `${height}px`,
        }}
      />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{
            opacity: showButton ? 1 : 0,
            scale: showButton ? 1 : 0.8,
            y: showButton ? 0 : 20,
          }}
          transition={springs.smooth}
          onClick={scrollToTop}
          {...(buttonAnimation as any)}
          className={clsx(
            'fixed bottom-8 right-8 z-40',
            'p-3 rounded-full',
            'bg-brand-500 text-white',
            'shadow-lg hover:shadow-xl',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            !showButton && 'pointer-events-none'
          )}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </>
  )
}

// =============================================================================
// CIRCULAR SCROLL PROGRESS (alternative style)
// =============================================================================

interface CircularScrollProgressProps {
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularScrollProgress({
  size = 48,
  strokeWidth = 3,
  className,
}: CircularScrollProgressProps) {
  const [showButton, setShowButton] = useState(false)
  const { scrollYProgress } = useScroll()

  const circumference = 2 * Math.PI * (size / 2 - strokeWidth / 2)
  const strokeDashoffset = useTransform(
    scrollYProgress,
    [0, 1],
    [circumference, 0]
  )

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: showButton ? 1 : 0,
        scale: showButton ? 1 : 0.8,
      }}
      transition={springs.smooth}
      onClick={scrollToTop}
      {...(buttonAnimation as any)}
      className={clsx(
        'fixed bottom-8 right-8 z-40',
        'rounded-full bg-bg-primary border border-border',
        'shadow-lg hover:shadow-xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        !showButton && 'pointer-events-none',
        className
      )}
      style={{
        width: size,
        height: size,
      }}
      aria-label="Scroll to top"
    >
      {/* Progress Circle */}
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth / 2}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-border"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth / 2}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-brand-500"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset,
            strokeLinecap: 'round',
          }}
        />
      </svg>

      {/* Arrow icon */}
      <div className="relative z-10 flex items-center justify-center">
        <ArrowUp className="w-5 h-5 text-brand-500" />
      </div>
    </motion.button>
  )
}

// =============================================================================
// READING PROGRESS (for articles/docs)
// =============================================================================

interface ReadingProgressProps {
  /** Target element to track (defaults to document body) */
  target?: HTMLElement | null
  /** Show time estimate */
  showTimeEstimate?: boolean
  /** Average reading speed (words per minute) */
  wordsPerMinute?: number
}

export function ReadingProgress({
  target,
  showTimeEstimate = false,
  wordsPerMinute = 200,
}: ReadingProgressProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const { scrollYProgress } = useScroll({
    target: target as any,
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const progress = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    if (!showTimeEstimate) return

    const calculateTimeRemaining = () => {
      const element = target || document.body
      const text = element.innerText || ''
      const words = text.split(/\s+/).length
      const currentProgress = scrollYProgress.get()
      const wordsRemaining = words * (1 - currentProgress)
      const minutesRemaining = Math.ceil(wordsRemaining / wordsPerMinute)

      if (minutesRemaining < 1) {
        setTimeRemaining('< 1 min left')
      } else if (minutesRemaining === 1) {
        setTimeRemaining('1 min left')
      } else {
        setTimeRemaining(`${minutesRemaining} mins left`)
      }
    }

    const unsubscribe = scrollYProgress.onChange(calculateTimeRemaining)
    calculateTimeRemaining()

    return () => unsubscribe()
  }, [scrollYProgress, target, showTimeEstimate, wordsPerMinute])

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-bg-primary/80 backdrop-blur-sm border-b border-border">
      <div className="container-docs py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">Reading progress</span>
          {showTimeEstimate && (
            <span className="text-xs text-text-tertiary">{timeRemaining}</span>
          )}
        </div>

        <motion.div
          className="text-sm font-medium text-brand-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.span>{Math.round(progress.get())}%</motion.span>
        </motion.div>
      </div>

      <motion.div
        className="h-1 bg-gradient-to-r from-brand-500 to-purple-500 origin-left"
        style={{ scaleX }}
      />
    </div>
  )
}

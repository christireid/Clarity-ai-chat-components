'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { Avatar } from '@clarity-chat/primitives'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { getMotionSafeDuration } from '../animations/motion-safe'

/**
 * Typing indicator variant styles
 */
export type TypingIndicatorVariant = 'dots' | 'pulse' | 'wave'

/**
 * TypingIndicator component props
 */
export interface TypingIndicatorProps {
  /** Show avatar (default: true) */
  showAvatar?: boolean
  /** Avatar source URL */
  avatarSrc?: string
  /** Avatar fallback text */
  avatarFallback?: string
  /** Custom label text (default: "AI is typing") */
  label?: string
  /** Animation variant */
  variant?: TypingIndicatorVariant
  /** Custom className */
  className?: string
}

/**
 * TypingIndicator - Classic "typing..." indicator for chat interfaces
 *
 * Displays a lightweight typing indicator with animated dots, matching
 * modern chat application patterns (iMessage, Slack, Discord, etc.).
 *
 * **Features:**
 * - Three bouncing dots animation (classic)
 * - Optional avatar display
 * - Multiple animation variants
 * - Reduced motion support
 * - Accessible with aria-live
 *
 * **Use Cases:**
 * - Show when AI is generating a response
 * - Indicate active processing
 * - Provide visual feedback during streaming
 *
 * @example
 * ```tsx
 * // Basic usage
 * {isAITyping && <TypingIndicator />}
 *
 * // With custom label
 * <TypingIndicator label="Assistant is thinking" />
 *
 * // Without avatar
 * <TypingIndicator showAvatar={false} />
 *
 * // Different animation variant
 * <TypingIndicator variant="pulse" />
 * ```
 */
export function TypingIndicator({
  showAvatar = true,
  avatarSrc,
  avatarFallback = 'AI',
  label = 'AI is typing',
  variant = 'dots',
  className,
}: TypingIndicatorProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn('flex gap-3.5 p-4', className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {/* Avatar */}
      {showAvatar && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
            delay: getMotionSafeDuration(prefersReducedMotion, 0.05),
          }}
        >
          <Avatar
            src={avatarSrc}
            alt="AI Assistant"
            fallback={avatarFallback}
            className="flex-shrink-0"
          />
        </motion.div>
      )}

      {/* Typing Bubble */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
          delay: getMotionSafeDuration(prefersReducedMotion, 0.1),
        }}
        className={cn(
          'flex items-center gap-1.5 px-4 py-3 rounded-xl bg-muted/60 border border-border/40 shadow-md',
          'min-w-[70px]'
        )}
      >
        {variant === 'dots' && <DotsAnimation prefersReducedMotion={prefersReducedMotion} />}
        {variant === 'pulse' && <PulseAnimation prefersReducedMotion={prefersReducedMotion} />}
        {variant === 'wave' && <WaveAnimation prefersReducedMotion={prefersReducedMotion} />}
      </motion.div>
    </motion.div>
  )
}

TypingIndicator.displayName = 'TypingIndicator'

/**
 * Classic bouncing dots animation
 */
function DotsAnimation({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  if (prefersReducedMotion) {
    return (
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-muted-foreground/60"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [-2, -6, -2],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
          className="w-2 h-2 rounded-full bg-muted-foreground"
        />
      ))}
    </div>
  )
}

/**
 * Pulse animation (expanding circles)
 */
function PulseAnimation({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  if (prefersReducedMotion) {
    return (
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-muted-foreground/60"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
          className="w-2 h-2 rounded-full bg-muted-foreground"
        />
      ))}
    </div>
  )
}

/**
 * Wave animation (sequential fade)
 */
function WaveAnimation({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  if (prefersReducedMotion) {
    return (
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-muted-foreground/60"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.25,
            ease: 'linear',
          }}
          className="w-2 h-2 rounded-full bg-muted-foreground"
        />
      ))}
    </div>
  )
}

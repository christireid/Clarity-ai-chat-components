'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn, Avatar, useReducedMotion } from '@clarity-chat/primitives'
import { getMotionSafeDuration } from '../../animations/motion-safe'
import { AnimatedDots } from '../ui/AnimatedDots'
import { ANIMATION_PRESETS } from '../../animations/constants'

/**
 * Typing indicator variant styles
 *
 * @enhanced Framer Motion 12: Now using spring physics for smoother animations
 * - Enhanced spring damping for natural motion
 * - Improved bounce physics for dots animation
 * - More responsive entrance/exit animations
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
      {...(prefersReducedMotion
        ? ANIMATION_PRESETS.fadeIn
        : ANIMATION_PRESETS.scale)}
      transition={{
        // Framer Motion 12: Enhanced spring physics for smoother entrance
        type: 'spring',
        damping: 20,
        stiffness: 300,
        duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
      }}
      className={cn('flex gap-3.5 p-4', className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {/* Avatar */}
      {showAvatar && (
        <motion.div
          {...(prefersReducedMotion
            ? ANIMATION_PRESETS.fadeIn
            : ANIMATION_PRESETS.scale)}
          transition={{
            // Framer Motion 12: Spring physics for avatar entrance
            type: 'spring',
            damping: 15,
            stiffness: 200,
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
        {...(prefersReducedMotion
          ? ANIMATION_PRESETS.fadeIn
          : ANIMATION_PRESETS.scale)}
        transition={{
          // Framer Motion 12: Smoother bubble entrance with spring
          type: 'spring',
          damping: 18,
          stiffness: 250,
          delay: getMotionSafeDuration(prefersReducedMotion, 0.1),
        }}
        className={cn(
          'flex items-center gap-1.5 px-4 py-3 rounded-xl bg-muted/60 border border-border/40 shadow-md',
          'min-w-[70px]'
        )}
      >
        <AnimatedDots
          variant={variant === 'dots' ? 'bounce' : variant}
          size="md"
          className="text-muted-foreground"
        />
      </motion.div>
    </motion.div>
  )
}

TypingIndicator.displayName = 'TypingIndicator'

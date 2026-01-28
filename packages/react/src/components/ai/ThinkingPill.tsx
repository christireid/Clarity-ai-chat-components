'use client'

/**
 * ThinkingPill Component
 *
 * Lightweight, pill-shaped thinking/loading indicator inspired by prompt-kit.
 * Uses shimmer text with dotted underline for a modern, polished look.
 *
 * This is a simpler alternative to ThinkingBar when you need a compact
 * inline indicator without progress bars or detailed status.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ThinkingPill />
 *
 * // Custom message
 * <ThinkingPill message="Analyzing..." />
 *
 * // With stop button
 * <ThinkingPill onStop={() => cancelRequest()} />
 *
 * // Without dots animation
 * <ThinkingPill showDots={false} />
 *
 * // Different variants
 * <ThinkingPill variant="subtle" />
 * <ThinkingPill variant="glass" />
 * ```
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Visual variant of the thinking pill
 */
export type ThinkingPillVariant = 'default' | 'subtle' | 'glass' | 'outline'

/**
 * Size preset
 */
export type ThinkingPillSize = 'sm' | 'md' | 'lg'

/**
 * Props for ThinkingPill component
 */
export interface ThinkingPillProps {
  /** Custom message to display (default: "Thinking") */
  message?: string
  /** Visual variant (default: 'default') */
  variant?: ThinkingPillVariant
  /** Size preset (default: 'md') */
  size?: ThinkingPillSize
  /** Show animated dots after message */
  showDots?: boolean
  /** Show shimmer animation on text */
  showShimmer?: boolean
  /** Show stop/cancel button */
  onStop?: () => void
  /** Additional CSS class */
  className?: string
  /** Whether the pill is visible */
  visible?: boolean
  /** Custom icon to display */
  icon?: React.ReactNode
  /** Accessible label */
  'aria-label'?: string
  /** Disable all animations */
  disableAnimations?: boolean
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Size configurations
 */
const SIZE_CONFIG: Record<ThinkingPillSize, {
  container: string
  text: string
  dot: string
  icon: string
  stopBtn: string
}> = {
  sm: {
    container: 'px-2.5 py-1.5 gap-1.5',
    text: 'text-xs',
    dot: 'w-1 h-1',
    icon: 'w-3 h-3',
    stopBtn: 'w-4 h-4',
  },
  md: {
    container: 'px-3 py-2 gap-2',
    text: 'text-sm',
    dot: 'w-1.5 h-1.5',
    icon: 'w-4 h-4',
    stopBtn: 'w-5 h-5',
  },
  lg: {
    container: 'px-4 py-2.5 gap-2.5',
    text: 'text-base',
    dot: 'w-2 h-2',
    icon: 'w-5 h-5',
    stopBtn: 'w-6 h-6',
  },
}

/**
 * Variant configurations
 */
const VARIANT_CONFIG: Record<ThinkingPillVariant, string> = {
  default: 'bg-muted border border-border',
  subtle: 'bg-muted/50',
  glass: 'glass',
  outline: 'bg-transparent border border-border',
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Animated dots indicator
 */
interface DotsProps {
  dotClass: string
  prefersReducedMotion: boolean
}

const AnimatedDots = React.memo(function AnimatedDots({
  dotClass,
  prefersReducedMotion,
}: DotsProps) {
  const dots = [0, 1, 2]

  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {dots.map((i) => (
        <motion.span
          key={i}
          className={cn('rounded-full bg-current opacity-60', dotClass)}
          animate={
            prefersReducedMotion
              ? { opacity: [0.4, 0.7, 0.4] }
              : { y: [-1, -4, -1], opacity: [0.4, 1, 0.4] }
          }
          transition={{
            duration: 0.6,
            delay: i * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </span>
  )
})

AnimatedDots.displayName = 'AnimatedDots'

/**
 * Stop button
 */
interface StopButtonProps {
  onClick: () => void
  size: string
  prefersReducedMotion: boolean
}

const StopButton = React.memo(function StopButton({
  onClick,
  size,
  prefersReducedMotion,
}: StopButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        'thinking-bar-stop',
        size
      )}
      whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      aria-label="Stop generation"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-2.5 h-2.5"
      >
        <rect x="6" y="6" width="12" height="12" rx="1" />
      </svg>
    </motion.button>
  )
})

StopButton.displayName = 'StopButton'

/**
 * Brain/thinking icon
 */
const BrainIcon = React.memo(function BrainIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54" />
    </svg>
  )
})

BrainIcon.displayName = 'BrainIcon'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * ThinkingPill - Compact thinking/loading indicator
 *
 * A lightweight, pill-shaped indicator for showing AI processing state.
 * Features shimmer text, animated dots, and optional stop button.
 *
 * Uses CSS classes from globals.css for consistent styling:
 * - .thinking-bar: Base container styles
 * - .thinking-bar-text: Shimmer text with dotted underline
 * - .thinking-bar-stop: Stop button styles
 */
export function ThinkingPill({
  message = 'Thinking',
  variant = 'default',
  size = 'md',
  showDots = true,
  showShimmer = true,
  onStop,
  className,
  visible = true,
  icon,
  'aria-label': ariaLabel,
  disableAnimations = false,
}: ThinkingPillProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations

  const sizeConfig = SIZE_CONFIG[size]
  const variantClass = VARIANT_CONFIG[variant]

  // Determine text class based on shimmer preference
  const textClass = showShimmer && !prefersReducedMotion
    ? 'thinking-bar-text'
    : sizeConfig.text

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label={ariaLabel || `${message}...`}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          transition={{
            duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.fast,
            ease: EASING_FRAMER.out,
          }}
          className={cn(
            'inline-flex items-center rounded-full',
            sizeConfig.container,
            variantClass,
            className
          )}
        >
          {/* Icon */}
          {icon ?? (
            <motion.span
              animate={prefersReducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={cn('text-muted-foreground', sizeConfig.icon)}
            >
              <BrainIcon className="w-full h-full" />
            </motion.span>
          )}

          {/* Message text */}
          <span className={cn(textClass, 'text-foreground')}>
            {message}
          </span>

          {/* Animated dots */}
          {showDots && (
            <AnimatedDots
              dotClass={sizeConfig.dot}
              prefersReducedMotion={prefersReducedMotion}
            />
          )}

          {/* Stop button */}
          {onStop && (
            <StopButton
              onClick={onStop}
              size={sizeConfig.stopBtn}
              prefersReducedMotion={prefersReducedMotion}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

ThinkingPill.displayName = 'ThinkingPill'

// =============================================================================
// CONVENIENCE HOOK
// =============================================================================

/**
 * Options for useThinkingPill hook
 */
export interface UseThinkingPillOptions {
  /** Initial visibility */
  initialVisible?: boolean
  /** Auto-hide after timeout (ms) */
  autoHideAfter?: number
  /** Initial message */
  initialMessage?: string
}

/**
 * Return type for useThinkingPill hook
 */
export interface UseThinkingPillReturn {
  /** Whether pill is visible */
  visible: boolean
  /** Current message */
  message: string
  /** Show the pill */
  show: (message?: string) => void
  /** Hide the pill */
  hide: () => void
  /** Update message */
  setMessage: (message: string) => void
  /** Props to spread on ThinkingPill */
  pillProps: { visible: boolean; message: string }
}

/**
 * Hook for managing ThinkingPill state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const thinking = useThinkingPill({ autoHideAfter: 5000 })
 *
 *   const handleSubmit = async () => {
 *     thinking.show('Processing...')
 *     await doSomething()
 *     thinking.hide()
 *   }
 *
 *   return (
 *     <>
 *       <ThinkingPill {...thinking.pillProps} />
 *       <button onClick={handleSubmit}>Submit</button>
 *     </>
 *   )
 * }
 * ```
 */
export function useThinkingPill({
  initialVisible = false,
  autoHideAfter,
  initialMessage = 'Thinking',
}: UseThinkingPillOptions = {}): UseThinkingPillReturn {
  const [visible, setVisible] = React.useState(initialVisible)
  const [message, setMessage] = React.useState(initialMessage)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const clearTimeoutRef = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const show = React.useCallback((newMessage?: string) => {
    clearTimeoutRef()
    if (newMessage) {
      setMessage(newMessage)
    }
    setVisible(true)

    if (autoHideAfter) {
      timeoutRef.current = setTimeout(() => {
        setVisible(false)
      }, autoHideAfter)
    }
  }, [autoHideAfter, clearTimeoutRef])

  const hide = React.useCallback(() => {
    clearTimeoutRef()
    setVisible(false)
  }, [clearTimeoutRef])

  // Cleanup on unmount
  React.useEffect(() => {
    return clearTimeoutRef
  }, [clearTimeoutRef])

  return {
    visible,
    message,
    show,
    hide,
    setMessage,
    pillProps: { visible, message },
  }
}

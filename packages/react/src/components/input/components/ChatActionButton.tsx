/**
 * ChatActionButton Component
 *
 * Animated button for send/stop actions in PillChatInput.
 * Handles transitions between send and stop states with proper animations.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../../animations/constants'

// =============================================================================
// ICONS
// =============================================================================

const SendIcon = React.memo(function SendIcon({
  size = 18,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
})

SendIcon.displayName = 'SendIcon'

const StopIcon = React.memo(function StopIcon({
  size = 18,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  )
})

StopIcon.displayName = 'StopIcon'

const SpinnerIcon = React.memo(function SpinnerIcon() {
  return (
    <div
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
      aria-hidden="true"
    />
  )
})

SpinnerIcon.displayName = 'SpinnerIcon'

// =============================================================================
// TYPES
// =============================================================================

export interface ChatActionButtonProps {
  /** Whether AI is currently generating */
  isGenerating: boolean
  /** Whether submission is allowed */
  canSubmit: boolean
  /** Whether currently submitting */
  isSubmitting: boolean
  /** Stop generation handler */
  onStop?: () => void
  /** Submit handler */
  onSubmit: () => void
  /** Button size classes */
  buttonClasses: string
  /** Icon size in pixels */
  iconSize: number
  /** Disable animations */
  disableAnimations: boolean
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ChatActionButton - Animated send/stop button
 *
 * Switches between send and stop states with smooth animations.
 */
export const ChatActionButton = React.memo(function ChatActionButton({
  isGenerating,
  canSubmit,
  isSubmitting,
  onStop,
  onSubmit,
  buttonClasses,
  iconSize,
  disableAnimations,
}: ChatActionButtonProps) {
  if (isGenerating && onStop) {
    return (
      <motion.button
        key="stop"
        type="button"
        onClick={onStop}
        initial={disableAnimations ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={disableAnimations ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
        transition={{
          duration: disableAnimations ? 0.1 : DURATION_SECONDS.fast,
          ease: EASING_FRAMER.out,
        }}
        className={cn(
          'chat-input-send-btn',
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive/90',
          buttonClasses
        )}
        aria-label="Stop generation"
      >
        <StopIcon size={iconSize - 4} />
      </motion.button>
    )
  }

  return (
    <motion.button
      key="send"
      type="button"
      onClick={onSubmit}
      disabled={!canSubmit}
      initial={disableAnimations ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={disableAnimations ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
      transition={{
        duration: disableAnimations ? 0.1 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.out,
      }}
      className={cn(
        'chat-input-send-btn',
        buttonClasses,
        canSubmit
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'bg-muted text-muted-foreground cursor-not-allowed'
      )}
      aria-label={isSubmitting ? 'Sending...' : 'Send message'}
    >
      {isSubmitting ? <SpinnerIcon /> : <SendIcon size={iconSize} />}
    </motion.button>
  )
})

ChatActionButton.displayName = 'ChatActionButton'

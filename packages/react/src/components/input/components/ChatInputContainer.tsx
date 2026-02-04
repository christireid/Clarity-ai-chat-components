/**
 * ChatInputContainer Component
 *
 * Container component for PillChatInput that handles the motion animation
 * and layout structure. Reduces complexity in the main component.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../../animations/constants'

export interface ChatInputContainerProps {
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean
  /** Container classes */
  containerClasses: string
  /** Whether input is focused */
  isFocused: boolean
  /** Whether input is disabled */
  disabled: boolean
  /** Animation state */
  containerAnimation: {
    boxShadow: string
  }
  /** Children elements */
  children: React.ReactNode
}

/**
 * ChatInputContainer - Animated container for chat input
 *
 * Handles motion animation and provides the pill-shaped container.
 */
export const ChatInputContainer = React.memo(function ChatInputContainer({
  prefersReducedMotion,
  containerClasses,
  isFocused,
  disabled,
  containerAnimation,
  children,
}: ChatInputContainerProps) {
  return (
    <motion.div
      animate={containerAnimation}
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.out,
      }}
      className={cn(
        containerClasses,
        isFocused && 'chat-input-focus',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      {children}
    </motion.div>
  )
})

ChatInputContainer.displayName = 'ChatInputContainer'

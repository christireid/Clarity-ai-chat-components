import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, cn } from '@clarity-chat/primitives'
import { CopyButton } from '../copy-button'
import { ThumbsUpIcon, ThumbsDownIcon, RefreshIcon } from '../icons'
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  INTERACTION_VARIANTS,
} from '../../animations/constants'
import { ConfettiAnimation } from './confetti-animation'

export interface MessageActionsProps {
  messageContent: string
  feedbackGiven: 'up' | 'down' | null
  showConfetti: boolean
  hasError: boolean
  onFeedback: (type: 'up' | 'down') => void
  onRetry?: () => void
  show: boolean
}

/**
 * Message actions component (copy, feedback, retry)
 * Extracted from Message component for better organization
 */
export const MessageActions = React.memo<MessageActionsProps>(
  ({
    messageContent,
    feedbackGiven,
    showConfetti,
    hasError,
    onFeedback,
    onRetry,
    show,
  }) => {
    if (!show) return null

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: 10, height: 0 }}
          transition={{
            duration: ANIMATION_DURATION.fast / 1000,
            ease: ANIMATION_EASING.out,
          }}
          className="flex items-center gap-2 overflow-hidden"
        >
          <CopyButton text={messageContent} size="sm" />

          {/* Thumbs Up with Confetti */}
          <div className="relative">
            <motion.div
              whileHover={{
                scale: 1.1,
                rotate: feedbackGiven === 'up' ? 0 : -15,
              }}
              whileTap={{ scale: 0.9 }}
              animate={
                feedbackGiven === 'up'
                  ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, -15, 15, -15, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFeedback('up')}
                className={cn(
                  'transition-colors',
                  feedbackGiven === 'up' && 'text-success bg-success/10'
                )}
                aria-label="Good response"
              >
                <ThumbsUpIcon size={16} />
              </Button>
            </motion.div>

            <ConfettiAnimation show={showConfetti} />
          </div>

          {/* Thumbs Down */}
          <motion.div
            whileHover={{
              scale: 1.1,
              rotate: feedbackGiven === 'down' ? 0 : 15,
            }}
            whileTap={{ scale: 0.9 }}
            animate={
              feedbackGiven === 'down'
                ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 15, -15, 15, 0],
                  }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFeedback('down')}
              className={cn(
                'transition-colors',
                feedbackGiven === 'down' &&
                  'text-destructive bg-destructive/10'
              )}
              aria-label="Poor response"
            >
              <ThumbsDownIcon size={16} />
            </Button>
          </motion.div>

          {hasError && onRetry && (
            <motion.div
              whileHover={INTERACTION_VARIANTS.button.hover}
              whileTap={INTERACTION_VARIANTS.button.tap}
              transition={INTERACTION_VARIANTS.button.transition}
            >
              <Button variant="ghost" size="sm" onClick={onRetry} className="gap-1.5">
                <RefreshIcon size={16} />
                Retry
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    )
  }
)

MessageActions.displayName = 'MessageActions'

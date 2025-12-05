import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, cn } from '@clarity-chat/primitives'
import { CopyButton } from '../copy-button'
import { ThumbsUpIcon, ThumbsDownIcon, RefreshIcon, EditIcon, TrashIcon } from '../icons'
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  INTERACTION_VARIANTS,
} from '../../animations/constants'
import { ConfettiAnimation } from './confetti-animation'
import { useToast } from '../toast'

export interface MessageActionsProps {
  messageContent: string
  messageId: string
  role: 'user' | 'assistant' | 'system'
  feedbackGiven: 'up' | 'down' | null
  showConfetti: boolean
  hasError: boolean
  onFeedback: (type: 'up' | 'down') => void
  onRetry?: () => void
  onEdit?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  show: boolean
}

/**
 * Message actions component (copy, feedback, retry)
 * Extracted from Message component for better organization
 *
 * Enhanced with:
 * - Staggered entrance animations
 * - Icon-only buttons (cleaner, more minimal)
 * - Delete feedback with animation
 * - Improved hover/tap interactions
 */
export const MessageActions = React.memo<MessageActionsProps>(
  ({
    messageContent,
    messageId,
    role,
    feedbackGiven,
    showConfetti,
    hasError,
    onFeedback,
    onRetry,
    onEdit,
    onRegenerate,
    onDelete,
    show,
  }) => {
    const [isDeleting, setIsDeleting] = React.useState(false)
    const toast = useToast()

    const isUserMessage = role === 'user'
    const isAssistantMessage = role === 'assistant'

    const handleDelete = React.useCallback(() => {
      setIsDeleting(true)

      // Show feedback toast
      toast?.info('Message deleted')

      // Delay actual delete to allow animation
      setTimeout(() => {
        onDelete?.(messageId)
      }, 300)
    }, [messageId, onDelete, toast])

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
          className="flex items-center gap-1.5 overflow-hidden mt-3"
        >
          {/* Copy button - icon only, staggered animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05, duration: 0.2 }}
          >
            <CopyButton
              text={messageContent}
              size="icon"
              iconOnly
              className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-accent/50 transition-colors"
            />
          </motion.div>

          {/* Thumbs Up with Confetti - cleaner, smaller */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <motion.div
              whileHover={{
                scale: 1.15,
                rotate: feedbackGiven === 'up' ? 0 : -12,
              }}
              whileTap={{ scale: 0.85 }}
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
                size="icon"
                onClick={() => onFeedback('up')}
                className={cn(
                  'h-7 w-7 rounded-lg transition-all text-gray-400 hover:text-gray-600',
                  'hover:bg-accent/50',
                  feedbackGiven === 'up' && 'text-success bg-success/10 hover:bg-success/15'
                )}
                aria-label="Good response"
              >
                <ThumbsUpIcon size={14} />
              </Button>
            </motion.div>

            <ConfettiAnimation show={showConfetti} />
          </motion.div>

          {/* Thumbs Down - cleaner, smaller */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.2 }}
            whileHover={{
              scale: 1.15,
              rotate: feedbackGiven === 'down' ? 0 : 12,
            }}
            whileTap={{ scale: 0.85 }}
          >
            <motion.div
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
                size="icon"
                onClick={() => onFeedback('down')}
                className={cn(
                  'h-7 w-7 rounded-lg transition-all text-gray-400 hover:text-gray-600',
                  'hover:bg-accent/50',
                  feedbackGiven === 'down' &&
                    'text-destructive bg-destructive/10 hover:bg-destructive/15'
                )}
                aria-label="Poor response"
              >
                <ThumbsDownIcon size={14} />
              </Button>
            </motion.div>
          </motion.div>

          {hasError && onRetry && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onRetry}
                className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-accent/50 transition-colors"
                aria-label="Retry"
              >
                <RefreshIcon size={14} />
              </Button>
            </motion.div>
          )}

          {/* Edit button for user messages - icon only */}
          {isUserMessage && onEdit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(messageId)}
                className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-accent/50 transition-colors"
                aria-label="Edit message"
              >
                <EditIcon size={14} />
              </Button>
            </motion.div>
          )}

          {/* Regenerate button for assistant messages - icon only */}
          {isAssistantMessage && onRegenerate && !hasError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRegenerate(messageId)}
                className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-accent/50 transition-colors"
                aria-label="Regenerate response"
              >
                <RefreshIcon size={14} />
              </Button>
            </motion.div>
          )}

          {/* Delete button - icon only with delete animation */}
          {onDelete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: 0.3, duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className={cn(
                  'h-7 w-7 rounded-lg text-gray-400 hover:text-destructive hover:bg-destructive/10 transition-colors',
                  isDeleting && 'opacity-50 cursor-not-allowed'
                )}
                aria-label="Delete message"
              >
                <motion.div
                  animate={isDeleting ? {
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 0.9, 0.9, 0.9, 0.8],
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <TrashIcon size={14} />
                </motion.div>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    )
  }
)

MessageActions.displayName = 'MessageActions'

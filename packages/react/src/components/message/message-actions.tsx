'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, cn, Tooltip } from '@clarity-chat/primitives'
import { CopyButton } from '../copy-button'
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  RefreshIcon,
  EditIcon,
  StopIcon,
} from '../icons'
import {
  ANIMATION_DURATION,
  DURATION_SECONDS as durations,
  EASING_FRAMER,
} from '../../animations/constants'
import { ConfettiAnimation } from './confetti-animation'
import { FeedbackDialog } from './feedback-dialog'
import { DeleteButton } from './delete-button'
import { useToast } from '../toast'

export interface MessageActionsProps {
  messageContent: string
  messageId: string
  role: 'user' | 'assistant' | 'system'
  feedbackGiven: 'up' | 'down' | null
  showConfetti: boolean
  hasError: boolean
  isStreaming?: boolean
  onFeedback: (type: 'up' | 'down', comment?: string) => void
  onRetry?: () => void
  onEdit?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  onStopGeneration?: () => void
  show: boolean
  /**
   * Always show actions regardless of hover state
   * Useful for accessibility when actions should be discoverable
   * @default false
   */
  alwaysVisible?: boolean
  /**
   * Ref for the edit button - used to return focus after editing
   */
  editButtonRef?: React.RefObject<HTMLButtonElement | null>
}

// Animation variants for buttons
const buttonVariants = {
  initial: { opacity: 0, scale: 0.8, y: 4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 4 },
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
}

// Stagger configuration for entrance animation
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
}

/**
 * ActionButton - Reusable action button with tooltip and animations
 */
interface ActionButtonProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  tooltipContent: string
  isActive?: boolean
  activeClassName?: string
  hoverClassName?: string
  disabled?: boolean
  delay?: number
  'aria-pressed'?: boolean
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      onClick,
      icon,
      label,
      tooltipContent,
      isActive = false,
      activeClassName = '',
      hoverClassName = 'hover:text-gray-600 hover:bg-accent/50',
      disabled = false,
      delay = 0,
      'aria-pressed': ariaPressed,
    },
    ref
  ) => {
    return (
      <Tooltip content={tooltipContent} side="top" delay={300}>
        <motion.div
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          whileHover={disabled ? undefined : 'hover'}
          whileTap={disabled ? undefined : 'tap'}
          transition={{ delay, duration: durations.fast }}
        >
          <Button
            ref={ref}
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              'h-8 w-8 rounded-lg transition-all duration-200 text-muted-foreground/70',
              hoverClassName,
              isActive && activeClassName,
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={label}
            aria-pressed={ariaPressed}
          >
            {icon}
          </Button>
        </motion.div>
      </Tooltip>
    )
  }
)

ActionButton.displayName = 'ActionButton'

/**
 * Message actions component with delightful UX
 *
 * Enhanced with:
 * - Tooltips on all actions for discoverability
 * - Feedback dialog for thumbs down with optional comment
 * - Delete confirmation dialog to prevent accidents
 * - Stop button for streaming messages
 * - Role-specific actions (user: edit/delete/copy, assistant: regenerate/copy/feedback/stop)
 * - Staggered entrance animations
 * - Improved hover/tap interactions with spring physics
 * - Keyboard navigation (arrow keys, Tab)
 * - Focus-visible accessibility
 */
export const MessageActions = React.memo<MessageActionsProps>(
  ({
    messageContent,
    messageId,
    role,
    feedbackGiven,
    showConfetti,
    hasError,
    isStreaming = false,
    onFeedback,
    onRetry,
    onEdit,
    onRegenerate,
    onDelete,
    onStopGeneration,
    show,
    alwaysVisible = false,
    editButtonRef,
  }) => {
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [feedbackDialogOpen, setFeedbackDialogOpen] = React.useState(false)
    const toast = useToast()
    const deleteTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null
    )

    const isUserMessage = role === 'user'
    const isAssistantMessage = role === 'assistant'

    const actionsRef = React.useRef<HTMLDivElement>(null)
    const [focusedIndex, setFocusedIndex] = React.useState(-1)

    // Cleanup delete timeout on unmount
    React.useEffect(() => {
      return () => {
        if (deleteTimeoutRef.current) {
          clearTimeout(deleteTimeoutRef.current)
        }
      }
    }, [])

    // Reset focused index when visibility changes
    React.useEffect(() => {
      if (!show && !alwaysVisible) {
        setFocusedIndex(-1)
      }
    }, [show, alwaysVisible])

    const handleDelete = React.useCallback(() => {
      if (isDeleting) return // Prevent double-clicks
      setIsDeleting(true)

      // Delay actual delete to allow animation, with cleanup
      deleteTimeoutRef.current = setTimeout(() => {
        deleteTimeoutRef.current = null
        onDelete?.(messageId)
      }, 300)
    }, [messageId, onDelete, isDeleting])

    // Toast handler for DeleteButton
    const handleDeleteToast = React.useCallback(
      (message: string) => {
        toast?.info(message)
      },
      [toast]
    )

    const handleThumbsDown = React.useCallback(() => {
      setFeedbackDialogOpen(true)
    }, [])

    const handleFeedbackSubmit = React.useCallback(
      (comment: string) => {
        onFeedback('down', comment)
        toast?.info('Thanks for your feedback!')
      },
      [onFeedback, toast]
    )

    const handleFeedbackSkip = React.useCallback(() => {
      onFeedback('down')
    }, [onFeedback])

    const handleThumbsUp = React.useCallback(() => {
      onFeedback('up')
    }, [onFeedback])

    const handleRegenerate = React.useCallback(() => {
      onRegenerate?.(messageId)
      toast?.info('Regenerating response...')
    }, [messageId, onRegenerate, toast])

    const handleStopGeneration = React.useCallback(() => {
      onStopGeneration?.()
      toast?.info('Generation stopped')
    }, [onStopGeneration, toast])

    // Get all focusable buttons in the toolbar
    const getButtons = React.useCallback(() => {
      const container = actionsRef.current
      if (!container) return []
      return Array.from(
        container.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
      )
    }, [])

    // Keyboard navigation handler for arrow keys within the actions toolbar
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        const buttons = getButtons()
        if (buttons.length === 0) return

        const currentIndex = buttons.indexOf(
          document.activeElement as HTMLButtonElement
        )

        let newIndex = currentIndex

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault()
            newIndex =
              currentIndex === -1 ? 0 : (currentIndex + 1) % buttons.length
            break
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault()
            newIndex =
              currentIndex === -1
                ? buttons.length - 1
                : (currentIndex - 1 + buttons.length) % buttons.length
            break
          case 'Home':
            e.preventDefault()
            newIndex = 0
            break
          case 'End':
            e.preventDefault()
            newIndex = buttons.length - 1
            break
          case 'Enter':
          case ' ':
            return
          default:
            return
        }

        if (newIndex !== currentIndex && buttons[newIndex]) {
          buttons[newIndex].focus()
          setFocusedIndex(newIndex)
        }
      },
      [getButtons]
    )

    // Handle focus entering the toolbar
    const handleFocus = React.useCallback(
      (e: React.FocusEvent) => {
        if (e.target === actionsRef.current) {
          const buttons = getButtons()
          if (buttons.length > 0) {
            const indexToFocus = focusedIndex >= 0 ? focusedIndex : 0
            buttons[indexToFocus]?.focus()
            setFocusedIndex(indexToFocus)
          }
        }
      },
      [getButtons, focusedIndex]
    )

    if (!show && !alwaysVisible) return null

    return (
      <>
        <AnimatePresence mode="wait">
          <motion.div
            ref={actionsRef}
            variants={containerVariants}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: alwaysVisible || show ? 1 : 0.6,
              y: 0,
            }}
            exit={{ opacity: 0, y: 8 }}
            transition={{
              duration: ANIMATION_DURATION.fast / 1000,
              ease: EASING_FRAMER.out,
            }}
            role="toolbar"
            aria-label="Message actions"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className="flex items-center gap-1 overflow-hidden mt-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
          >
            {/* Stop button - shown during streaming for assistant messages */}
            {isStreaming && isAssistantMessage && onStopGeneration && (
              <Tooltip content="Stop generating" side="top" delay={100}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: durations.fast }}
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleStopGeneration}
                    className="h-8 px-3 gap-1.5 rounded-lg font-medium"
                    aria-label="Stop generating"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: durations.slower,
                        repeat: Infinity,
                      }}
                    >
                      <StopIcon size={14} />
                    </motion.div>
                    <span>Stop</span>
                  </Button>
                </motion.div>
              </Tooltip>
            )}

            {/* Copy button - always shown when not streaming */}
            {!isStreaming && (
              <motion.div
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.02, duration: durations.fast }}
              >
                <CopyButton
                  text={messageContent}
                  size="icon"
                  iconOnly
                  showTooltip
                  tooltipText="Copy message"
                  className="h-8 w-8 rounded-lg text-muted-foreground/70 hover:text-gray-600 hover:bg-accent/50 transition-all"
                />
              </motion.div>
            )}

            {/* User message actions: Edit, Delete */}
            {isUserMessage && !isStreaming && (
              <>
                {onEdit && (
                  <ActionButton
                    ref={editButtonRef}
                    onClick={() => onEdit(messageId)}
                    icon={<EditIcon size={15} />}
                    label="Edit message"
                    tooltipContent="Edit message"
                    hoverClassName="hover:text-primary hover:bg-primary/10"
                    delay={0.06}
                  />
                )}

                {onDelete && (
                  <DeleteButton
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                    delay={0.1}
                    showConfirmation={true}
                    messageType="user"
                    showToast={handleDeleteToast}
                  />
                )}
              </>
            )}

            {/* Assistant message actions: Feedback, Regenerate, Delete */}
            {isAssistantMessage && !isStreaming && (
              <>
                {/* Thumbs Up with Confetti */}
                <div className="relative">
                  <Tooltip
                    content={
                      feedbackGiven === 'up'
                        ? 'You liked this'
                        : 'Good response'
                    }
                    side="top"
                    delay={300}
                  >
                    <motion.div
                      variants={buttonVariants}
                      initial="initial"
                      animate="animate"
                      whileHover={{
                        scale: 1.1,
                        rotate: feedbackGiven === 'up' ? 0 : -8,
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ delay: 0.06, duration: durations.fast }}
                    >
                      <motion.div
                        animate={
                          feedbackGiven === 'up'
                            ? {
                                scale: [1, 1.25, 1],
                                rotate: [0, -12, 12, -8, 0],
                              }
                            : {}
                        }
                        transition={{ duration: durations.slow }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleThumbsUp}
                          className={cn(
                            'h-8 w-8 rounded-lg transition-all text-muted-foreground/70',
                            'hover:text-success hover:bg-success/10',
                            feedbackGiven === 'up' &&
                              'text-success bg-success/15 hover:bg-success/20'
                          )}
                          aria-label="Good response"
                          aria-pressed={feedbackGiven === 'up'}
                        >
                          <ThumbsUpIcon size={15} />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </Tooltip>
                  <ConfettiAnimation show={showConfetti} />
                </div>

                {/* Thumbs Down */}
                <Tooltip
                  content={
                    feedbackGiven === 'down'
                      ? 'You disliked this'
                      : 'Poor response'
                  }
                  side="top"
                  delay={300}
                >
                  <motion.div
                    variants={buttonVariants}
                    initial="initial"
                    animate="animate"
                    whileHover={{
                      scale: 1.1,
                      rotate: feedbackGiven === 'down' ? 0 : 8,
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ delay: 0.1, duration: durations.fast }}
                  >
                    <motion.div
                      animate={
                        feedbackGiven === 'down'
                          ? {
                              scale: [1, 1.15, 1],
                              rotate: [0, 12, -12, 8, 0],
                            }
                          : {}
                      }
                      transition={{ duration: durations.slow }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleThumbsDown}
                        className={cn(
                          'h-8 w-8 rounded-lg transition-all text-muted-foreground/70',
                          'hover:text-destructive hover:bg-destructive/10',
                          feedbackGiven === 'down' &&
                            'text-destructive bg-destructive/15 hover:bg-destructive/20'
                        )}
                        aria-label="Poor response"
                        aria-pressed={feedbackGiven === 'down'}
                      >
                        <ThumbsDownIcon size={15} />
                      </Button>
                    </motion.div>
                  </motion.div>
                </Tooltip>

                {/* Regenerate button */}
                {onRegenerate && !hasError && (
                  <Tooltip content="Regenerate response" side="top" delay={300}>
                    <motion.div
                      variants={buttonVariants}
                      initial="initial"
                      animate="animate"
                      whileHover={{ scale: 1.1, rotate: -15 }}
                      whileTap={{ scale: 0.9, rotate: -30 }}
                      transition={{ delay: 0.14, duration: durations.fast }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRegenerate}
                        className="h-8 w-8 rounded-lg text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition-all"
                        aria-label="Regenerate response"
                      >
                        <RefreshIcon size={15} />
                      </Button>
                    </motion.div>
                  </Tooltip>
                )}

                {/* Retry button - shown on error */}
                {hasError && onRetry && (
                  <Tooltip content="Retry" side="top" delay={300}>
                    <motion.div
                      variants={buttonVariants}
                      initial="initial"
                      animate="animate"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ delay: 0.14, duration: durations.fast }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onRetry}
                        className="h-8 w-8 rounded-lg text-muted-foreground/70 hover:text-warning hover:bg-warning/10 transition-all"
                        aria-label="Retry"
                      >
                        <RefreshIcon size={15} />
                      </Button>
                    </motion.div>
                  </Tooltip>
                )}

                {/* Delete button */}
                {onDelete && (
                  <DeleteButton
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                    delay={0.18}
                    showConfirmation={true}
                    messageType="assistant"
                    showToast={handleDeleteToast}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Feedback Dialog */}
        <FeedbackDialog
          open={feedbackDialogOpen}
          onOpenChange={setFeedbackDialogOpen}
          onSubmit={handleFeedbackSubmit}
          onSkip={handleFeedbackSkip}
        />
      </>
    )
  }
)

MessageActions.displayName = 'MessageActions'

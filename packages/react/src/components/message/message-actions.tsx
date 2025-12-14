import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button,
  cn,
  Tooltip,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Textarea,
} from '@clarity-chat/primitives'
import { CopyButton } from '../copy-button'
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  RefreshIcon,
  EditIcon,
  TrashIcon,
  StopIcon,
  CheckIcon,
  CloseIcon,
} from '../icons'
import {
  ANIMATION_DURATION,
  DURATION_SECONDS as durations,
  EASING_FRAMER,
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
  onKeyDown?: (e: React.KeyboardEvent) => void
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
      onKeyDown,
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
            onKeyDown={onKeyDown}
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
 * DeleteButton - Reusable delete button with animation
 */
interface DeleteButtonProps {
  onClick: () => void
  isDeleting: boolean
  delay?: number
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  isDeleting,
  delay = 0.1,
}) => (
  <Tooltip content="Delete message" side="top" delay={300}>
    <motion.div
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={isDeleting ? undefined : 'hover'}
      whileTap={isDeleting ? undefined : 'tap'}
      transition={{ delay, duration: durations.fast }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        disabled={isDeleting}
        className={cn(
          'h-8 w-8 rounded-lg text-muted-foreground/70',
          'hover:text-destructive hover:bg-destructive/10 transition-all',
          isDeleting && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Delete message"
      >
        <motion.div
          animate={
            isDeleting
              ? {
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 0.9, 0.9, 0.9, 0.8],
                }
              : {}
          }
          transition={{ duration: durations.moderate }}
        >
          <TrashIcon size={15} />
        </motion.div>
      </Button>
    </motion.div>
  </Tooltip>
)

/**
 * FeedbackDialog - Dialog for collecting feedback comment on thumbs down
 */
interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (comment: string) => void
  onSkip: () => void
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  onSkip,
}) => {
  const [comment, setComment] = React.useState('')

  // Reset comment when dialog closes (handles backdrop click, escape key, etc.)
  React.useEffect(() => {
    if (!open) {
      setComment('')
    }
  }, [open])

  const handleSubmit = () => {
    onSubmit(comment)
    setComment('')
    onOpenChange(false)
  }

  const handleSkip = () => {
    onSkip()
    setComment('')
    onOpenChange(false)
  }

  // Handle dialog close without submitting (backdrop click, escape)
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && open) {
      // Dialog is being closed without explicit submit/skip - treat as skip
      onSkip()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="sm" animation="scale">
        <DialogHeader>
          <DialogTitle>What went wrong?</DialogTitle>
          <DialogDescription>
            Help us improve by sharing what could be better. This is optional.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="The response was inaccurate, unhelpful, or..."
            className="min-h-[100px] resize-none"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
          <Button variant="default" onClick={handleSubmit}>
            Submit feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Message actions component with delightful UX
 *
 * Enhanced with:
 * - Tooltips on all actions for discoverability
 * - Feedback dialog for thumbs down with optional comment
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

    // Cleanup delete timeout on unmount
    React.useEffect(() => {
      return () => {
        if (deleteTimeoutRef.current) {
          clearTimeout(deleteTimeoutRef.current)
        }
      }
    }, [])

    const handleDelete = React.useCallback(() => {
      if (isDeleting) return // Prevent double-clicks
      setIsDeleting(true)
      toast?.info('Message deleted')

      // Delay actual delete to allow animation, with cleanup
      deleteTimeoutRef.current = setTimeout(() => {
        deleteTimeoutRef.current = null
        onDelete?.(messageId)
      }, 300)
    }, [messageId, onDelete, toast, isDeleting])

    const handleThumbsDown = React.useCallback(() => {
      // Open feedback dialog for optional comment
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

    // Keyboard navigation handler for arrow keys within the actions toolbar
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
      const container = actionsRef.current
      if (!container) return

      if (e.key === 'Enter' || e.key === ' ') {
        const active = document.activeElement as HTMLElement | null
        if (
          active &&
          container.contains(active) &&
          active.tagName === 'BUTTON'
        ) {
          e.preventDefault()
          ;(active as HTMLButtonElement).click()
          return
        }
      }

      const buttons = Array.from(
        container.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
      )
      const currentIndex = buttons.indexOf(
        document.activeElement as HTMLButtonElement
      )

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % buttons.length
        buttons[nextIndex]?.focus()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length
        buttons[prevIndex]?.focus()
      } else if (e.key === 'Home') {
        e.preventDefault()
        buttons[0]?.focus()
      } else if (e.key === 'End') {
        e.preventDefault()
        buttons[buttons.length - 1]?.focus()
      }
    }, [])

    // Don't render if not shown and not always visible
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
            onKeyDown={handleKeyDown}
            className="flex items-center gap-1 overflow-hidden mt-3"
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

            {/* Copy button - always shown */}
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
                {/* Edit button */}
                {onEdit && (
                  <ActionButton
                    onClick={() => onEdit(messageId)}
                    icon={<EditIcon size={15} />}
                    label="Edit message"
                    tooltipContent="Edit message"
                    hoverClassName="hover:text-primary hover:bg-primary/10"
                    delay={0.06}
                  />
                )}

                {/* Delete button */}
                {onDelete && (
                  <DeleteButton
                    onClick={handleDelete}
                    isDeleting={isDeleting}
                    delay={0.1}
                  />
                )}
              </>
            )}

            {/* Assistant message actions: Feedback, Regenerate */}
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

                {/* Delete button for assistant messages too */}
                {onDelete && (
                  <DeleteButton
                    onClick={handleDelete}
                    isDeleting={isDeleting}
                    delay={0.18}
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

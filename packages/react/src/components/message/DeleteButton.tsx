'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Button,
  cn,
  Tooltip,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'
import { TrashIcon } from '../ui/icons'
import { DURATION_SECONDS as durations } from '../../animations/constants'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'

// Animation variants for buttons
const buttonVariants = {
  initial: { opacity: 0, scale: 0.8, y: 4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 4 },
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
}

export interface DeleteButtonProps {
  /** Callback when delete is confirmed */
  onDelete: () => void
  /** Whether delete is in progress */
  isDeleting: boolean
  /** Animation delay */
  delay?: number
  /** Show confirmation dialog before delete */
  showConfirmation?: boolean
  /** Message type for confirmation text */
  messageType?: 'user' | 'assistant'
  /** Toast function to show confirmation message after delete */
  showToast?: (message: string) => void
}

/**
 * DeleteButton - Reusable delete button with optional confirmation dialog
 *
 * Features:
 * - Optional confirmation dialog to prevent accidental deletes
 * - Animated trash icon during deletion
 * - Tooltip for accessibility
 */
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  isDeleting,
  delay = 0.1,
  showConfirmation = true,
  messageType = 'user',
  showToast,
}) => {
  const [showDialog, setShowDialog] = React.useState(false)
  const prefersReducedMotion = useReducedMotion()

  const handleClick = () => {
    if (showConfirmation) {
      setShowDialog(true)
    } else {
      onDelete()
    }
  }

  const handleConfirm = () => {
    setShowDialog(false)
    // Note: Toast is handled by parent component to ensure it only shows
    // after the delete actually succeeds (not blocked by loading guard)
    onDelete()
  }

  return (
    <>
      <Tooltip content="Delete message" side="top" delay={300}>
        <motion.div
          variants={prefersReducedMotion ? {} : buttonVariants}
          initial={prefersReducedMotion ? false : 'initial'}
          animate={prefersReducedMotion ? {} : 'animate'}
          whileHover={isDeleting || prefersReducedMotion ? undefined : 'hover'}
          whileTap={isDeleting || prefersReducedMotion ? undefined : 'tap'}
          transition={{
            delay: prefersReducedMotion ? 0 : delay,
            duration: prefersReducedMotion ? 0 : durations.fast,
          }}
          viewport={{ once: true }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
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
                isDeleting && !prefersReducedMotion
                  ? {
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 0.9, 0.9, 0.9, 0.8],
                    }
                  : {}
              }
              transition={{
                duration: prefersReducedMotion ? 0 : durations.moderate,
              }}
              viewport={{ once: true }}
            >
              <TrashIcon size={15} />
            </motion.div>
          </Button>
        </motion.div>
      </Tooltip>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader className="">
            <DialogTitle>Delete message?</DialogTitle>
            <DialogDescription>
              {messageType === 'assistant'
                ? 'This will remove the AI response. You can regenerate it if needed.'
                : 'This will remove your message and any responses to it. This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

DeleteButton.displayName = 'DeleteButton'

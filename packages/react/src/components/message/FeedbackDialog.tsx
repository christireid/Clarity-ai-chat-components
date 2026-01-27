'use client'

import * as React from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Textarea,
} from '@clarity-chat/primitives'

export interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (comment: string) => void
  onSkip: () => void
}

/**
 * FeedbackDialog - Dialog for collecting feedback comment on thumbs down
 *
 * Features:
 * - Optional comment collection
 * - Resets state on close (backdrop click, escape key)
 * - Treats close-without-action as skip
 */
export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
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
        <DialogHeader className="">
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
        <DialogFooter className="">
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

FeedbackDialog.displayName = 'FeedbackDialog'

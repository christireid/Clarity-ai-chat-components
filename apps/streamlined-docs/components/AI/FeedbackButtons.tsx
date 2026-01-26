'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface FeedbackButtonsProps {
  messageId: string
  onFeedback?: (messageId: string, type: 'positive' | 'negative', comment?: string) => void
  className?: string
}

export function FeedbackButtons({ messageId, onFeedback, className }: FeedbackButtonsProps) {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null)
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFeedback = async (type: 'positive' | 'negative') => {
    if (feedback === type) {
      // Un-select if clicking the same button
      setFeedback(null)
      setShowComment(false)
      setComment('')
      return
    }

    setFeedback(type)

    // For negative feedback, show comment box
    if (type === 'negative') {
      setShowComment(true)
    } else {
      // For positive feedback, submit immediately
      if (onFeedback) {
        setIsSubmitting(true)
        await onFeedback(messageId, type)
        setIsSubmitting(false)
      }
    }
  }

  const handleSubmitComment = async () => {
    if (onFeedback && feedback) {
      setIsSubmitting(true)
      await onFeedback(messageId, feedback, comment)
      setIsSubmitting(false)
      setShowComment(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Feedback Buttons */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-2">Was this helpful?</span>

        {/* Thumbs Up - min 44x44px touch target for WCAG AA */}
        <button
          onClick={() => handleFeedback('positive')}
          disabled={isSubmitting}
          className={cn(
            'min-w-[44px] min-h-[44px] p-2.5 rounded-md transition-all duration-200',
            'flex items-center justify-center',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            feedback === 'positive'
              ? 'bg-success-subtle text-success dark:bg-green-900/30 dark:text-green-400'
              : 'text-muted-foreground'
          )}
          aria-label="Mark as helpful"
          aria-pressed={feedback === 'positive'}
        >
          <ThumbsUp className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Thumbs Down - min 44x44px touch target for WCAG AA */}
        <button
          onClick={() => handleFeedback('negative')}
          disabled={isSubmitting}
          className={cn(
            'min-w-[44px] min-h-[44px] p-2.5 rounded-md transition-all duration-200',
            'flex items-center justify-center',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            feedback === 'negative'
              ? 'bg-error-subtle text-error dark:bg-red-900/30 dark:text-red-400'
              : 'text-muted-foreground'
          )}
          aria-label="Mark as not helpful"
          aria-pressed={feedback === 'negative'}
        >
          <ThumbsDown className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Thank you message */}
        <AnimatePresence>
          {feedback && !showComment && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              viewport={{ once: true }}
              className="text-xs text-muted-foreground ml-2"
            >
              Thanks for your feedback!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Comment Box for Negative Feedback */}
      <AnimatePresence>
        {showComment && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <label htmlFor={`feedback-comment-${messageId}`} className="sr-only">
              Feedback comment
            </label>
            <textarea
              id={`feedback-comment-${messageId}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What could be improved? (optional)"
              className={cn(
                'w-full px-3 py-2 text-sm rounded-md',
                'border border-input bg-background',
                'placeholder:text-neutral-500',
                'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
                'resize-none'
              )}
              rows={3}
              aria-describedby={`feedback-hint-${messageId}`}
            />
            <p id={`feedback-hint-${messageId}`} className="sr-only">
              Optional: Provide additional context about why this response was not helpful
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleSubmitComment}
                disabled={isSubmitting}
                className={cn(
                  'min-h-[44px] px-4 py-2 text-sm font-medium rounded-md',
                  'bg-primary text-primary-foreground',
                  'hover:bg-primary/90',
                  'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors'
                )}
                aria-label={isSubmitting ? 'Submitting feedback' : 'Submit feedback'}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                onClick={() => {
                  setShowComment(false)
                  setComment('')
                  setFeedback(null)
                }}
                disabled={isSubmitting}
                className={cn(
                  'min-h-[44px] px-4 py-2 text-sm font-medium rounded-md',
                  'bg-secondary text-secondary-foreground',
                  'hover:bg-secondary/80',
                  'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors'
                )}
                aria-label="Cancel feedback"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

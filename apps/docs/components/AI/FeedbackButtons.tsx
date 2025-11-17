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

        {/* Thumbs Up */}
        <button
          onClick={() => handleFeedback('positive')}
          disabled={isSubmitting}
          className={cn(
            'p-1.5 rounded-md transition-all duration-200',
            'hover:bg-accent hover:text-accent-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            feedback === 'positive'
              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
              : 'text-muted-foreground'
          )}
          aria-label="Helpful"
        >
          <ThumbsUp className="w-4 h-4" />
        </button>

        {/* Thumbs Down */}
        <button
          onClick={() => handleFeedback('negative')}
          disabled={isSubmitting}
          className={cn(
            'p-1.5 rounded-md transition-all duration-200',
            'hover:bg-accent hover:text-accent-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            feedback === 'negative'
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : 'text-muted-foreground'
          )}
          aria-label="Not helpful"
        >
          <ThumbsDown className="w-4 h-4" />
        </button>

        {/* Thank you message */}
        <AnimatePresence>
          {feedback && !showComment && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
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
            className="space-y-2"
          >
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What could be improved? (optional)"
              className={cn(
                'w-full px-3 py-2 text-sm rounded-md',
                'border border-input bg-background',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'resize-none'
              )}
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmitComment}
                disabled={isSubmitting}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md',
                  'bg-primary text-primary-foreground',
                  'hover:bg-primary/90',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors'
                )}
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
                  'px-3 py-1.5 text-xs font-medium rounded-md',
                  'bg-secondary text-secondary-foreground',
                  'hover:bg-secondary/80',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors'
                )}
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

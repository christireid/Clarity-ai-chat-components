'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type FeedbackType = 'helpful' | 'not-helpful' | null

interface FeedbackWidgetProps {
  pageId?: string
  className?: string
}

export function FeedbackWidget({ pageId, className = '' }: FeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<FeedbackType>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitFeedback = async (type: FeedbackType, userComment: string) => {
    setIsSubmitting(true)
    setError(null)

    const feedbackData = {
      messageId: pageId || window.location.pathname,
      type: type === 'helpful' ? 'positive' : 'negative',
      comment: userComment || undefined,
      metadata: {
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
      },
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      setSubmitted(true)
      setShowDetails(false)
    } catch (err) {
      console.error('Feedback submission error:', err)
      setError('Failed to submit feedback. Please try again.')
      // Still mark as submitted to not frustrate user
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFeedback = (type: FeedbackType) => {
    setFeedback(type)
    if (type === 'not-helpful') {
      setShowDetails(true)
    } else {
      submitFeedback(type, '')
    }
  }

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault()
    submitFeedback(feedback, comment)
  }

  if (submitted) {
    return (
      <div
        className={cn(
          'relative rounded-xl p-4 overflow-hidden',
          'bg-green-50 dark:bg-green-950/50',
          // Multi-layer shadow with success glow
          'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04),0_0_20px_rgba(34,197,94,0.1)]',
          'dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.15),0_0_20px_rgba(34,197,94,0.15)]',
          className
        )}
        role="status"
        aria-live="polite"
      >
        {/* Success gradient border */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.5) 0%, rgba(16,185,129,0.3) 50%, rgba(34,197,94,0.4) 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex items-center gap-2 text-green-700 dark:text-green-300">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Thanks for your feedback!</span>
        </div>
        <p className="relative z-10 text-sm text-green-600 dark:text-green-400 mt-1">
          Your input helps us improve the documentation.
        </p>
        {error && (
          <p className="relative z-10 text-xs text-amber-600 dark:text-amber-400 mt-2" role="alert">
            Note: {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group/feedback relative rounded-xl p-4 overflow-hidden',
        'bg-white dark:bg-gray-900/50',
        // Multi-layer shadow system
        'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]',
        'dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.15)]',
        'transition-all duration-300',
        'hover:shadow-[0_4px_12px_rgba(99,102,241,0.08),0_8px_24px_rgba(99,102,241,0.06)]',
        'dark:hover:shadow-[0_4px_12px_rgba(129,140,248,0.12),0_8px_24px_rgba(129,140,248,0.08)]',
        className
      )}
      role="form"
      aria-label="Page feedback"
    >
      {/* Gradient border on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover/feedback:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          padding: '1px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.2) 50%, rgba(244,114,182,0.25) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        aria-hidden="true"
      />
      {!showDetails ? (
        <fieldset className="relative z-10">
          <legend className="text-sm font-medium mb-3">Was this page helpful?</legend>
          <div className="flex gap-3" role="group" aria-label="Feedback options">
            <button
              onClick={() => handleFeedback('helpful')}
              disabled={isSubmitting}
              className={cn(
                'flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg border transition-all duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                feedback === 'helpful'
                  ? 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 shadow-[0_0_16px_rgba(34,197,94,0.2)]'
                  : 'hover:bg-muted hover:shadow-sm border-gray-200 dark:border-gray-700',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
              aria-pressed={feedback === 'helpful'}
              aria-label="Yes, this page was helpful"
            >
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span className="text-sm">{isSubmitting && feedback === 'helpful' ? 'Sending...' : 'Yes'}</span>
            </button>
            <button
              onClick={() => handleFeedback('not-helpful')}
              disabled={isSubmitting}
              className={cn(
                'flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg border transition-all duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                feedback === 'not-helpful'
                  ? 'bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700 shadow-[0_0_16px_rgba(239,68,68,0.2)]'
                  : 'hover:bg-muted hover:shadow-sm border-gray-200 dark:border-gray-700',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
              aria-pressed={feedback === 'not-helpful'}
              aria-label="No, this page was not helpful"
            >
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
              </svg>
              <span className="text-sm">No</span>
            </button>
          </div>
        </fieldset>
      ) : (
        <form onSubmit={handleSubmitDetails} aria-label="Feedback details form" className="relative z-10">
          <label htmlFor="feedback-comment" className="text-sm font-medium mb-3 block">What could we improve?</label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Missing information, unclear explanation, code errors..."
            className={cn(
              'w-full px-3 py-2 rounded-lg bg-background text-sm resize-none',
              'border border-gray-200 dark:border-gray-700',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              'transition-all duration-300',
              'focus:border-brand-300 dark:focus:border-brand-600'
            )}
            rows={3}
            disabled={isSubmitting}
            aria-describedby={error ? "feedback-error" : undefined}
          />
          {error && (
            <p id="feedback-error" className="text-xs text-red-600 dark:text-red-400 mt-2" role="alert">{error}</p>
          )}
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className={cn(
                'px-4 py-2 min-h-[44px] rounded-lg text-sm text-white',
                'bg-gradient-to-r from-brand-500 to-purple-500',
                'shadow-[0_2px_8px_rgba(99,102,241,0.3)]',
                'hover:shadow-[0_4px_12px_rgba(99,102,241,0.4),0_0_20px_rgba(99,102,241,0.2)]',
                'transition-all duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDetails(false)
                setFeedback(null)
                setError(null)
              }}
              disabled={isSubmitting}
              className={cn(
                'px-4 py-2 min-h-[44px] border border-gray-200 dark:border-gray-700 rounded-lg text-sm',
                'hover:bg-muted hover:shadow-sm transition-all duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
              )}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'

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
        className={`border rounded-lg p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Thanks for your feedback!</span>
        </div>
        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
          Your input helps us improve the documentation.
        </p>
        {error && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2" role="alert">
            Note: {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`border rounded-lg p-4 ${className}`} role="form" aria-label="Page feedback">
      {!showDetails ? (
        <fieldset>
          <legend className="text-sm font-medium mb-3">Was this page helpful?</legend>
          <div className="flex gap-3" role="group" aria-label="Feedback options">
            <button
              onClick={() => handleFeedback('helpful')}
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                feedback === 'helpful'
                  ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700'
                  : 'hover:bg-muted'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                feedback === 'not-helpful'
                  ? 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700'
                  : 'hover:bg-muted'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        <form onSubmit={handleSubmitDetails} aria-label="Feedback details form">
          <label htmlFor="feedback-comment" className="text-sm font-medium mb-3 block">What could we improve?</label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Missing information, unclear explanation, code errors..."
            className="w-full px-3 py-2 border rounded-lg bg-background text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
              className={`px-4 py-2 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
              className="px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

/**
 * Error Feedback Component
 *
 * This component allows users to provide feedback when an error occurs.
 * It collects additional context from the user to help with debugging.
 */

import React, { useState } from 'react'
import type { ErrorFeedback as ErrorFeedbackData } from './types'

/**
 * Error Feedback Props
 */
export interface ErrorFeedbackProps {
  /** Error that occurred */
  error?: Error

  /** Error message if no Error object */
  errorMessage?: string

  /** Callback when feedback is submitted */
  onSubmit: (feedback: ErrorFeedbackData) => void

  /** Callback when feedback is cancelled */
  onCancel?: () => void

  /** Whether to show the component */
  show: boolean

  /** Custom CSS class */
  className?: string
}

/**
 * Error Feedback Component
 *
 * @example
 * ```tsx
 * import { ErrorFeedback } from '@chat-ui/react'
 *
 * function MyErrorBoundary() {
 *   const [showFeedback, setShowFeedback] = useState(false)
 *   const [error, setError] = useState<Error | null>(null)
 *
 *   const handleFeedbackSubmit = (feedback) => {
 *     console.log('User feedback:', feedback)
 *     // Report to error tracking service
 *     setShowFeedback(false)
 *   }
 *
 *   return (
 *     <>
 *       <ErrorFeedback
 *         show={showFeedback}
 *         error={error}
 *         onSubmit={handleFeedbackSubmit}
 *         onCancel={() => setShowFeedback(false)}
 *       />
 *     </>
 *   )
 * }
 * ```
 */
export function ErrorFeedback({
  error,
  errorMessage,
  onSubmit,
  onCancel,
  show,
  className = '',
}: ErrorFeedbackProps) {
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [stepsToReproduce, setStepsToReproduce] = useState('')
  const [expectedBehavior, setExpectedBehavior] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!show) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!description.trim()) {
      alert('Please provide a description of what happened')
      return
    }

    setIsSubmitting(true)

    try {
      const feedback: ErrorFeedbackData = {
        description: description.trim(),
        email: email.trim() || undefined,
        stepsToReproduce: stepsToReproduce.trim() || undefined,
        expectedBehavior: expectedBehavior.trim() || undefined,
      }

      await onSubmit(feedback)

      // Reset form
      setDescription('')
      setEmail('')
      setStepsToReproduce('')
      setExpectedBehavior('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setDescription('')
    setEmail('')
    setStepsToReproduce('')
    setExpectedBehavior('')
    onCancel?.()
  }

  const displayError = error ? error.message : errorMessage || 'An error occurred'

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${className}`}
      role="dialog"
      aria-labelledby="error-feedback-title"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4">
          <h2
            id="error-feedback-title"
            className="text-2xl font-bold text-gray-900"
          >
            Help Us Fix This Issue
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We're sorry you encountered an error. Your feedback will help us resolve this issue.
          </p>
        </div>

        {/* Error Display */}
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
          <div className="font-medium">Error:</div>
          <div className="mt-1 font-mono text-xs">{displayError}</div>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description (Required) */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              What were you doing when this happened? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Please describe what you were doing when the error occurred..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Steps to Reproduce */}
          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-gray-700">
              Steps to reproduce (optional)
            </label>
            <textarea
              id="steps"
              value={stepsToReproduce}
              onChange={(e) => setStepsToReproduce(e.target.value)}
              rows={3}
              placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Expected Behavior */}
          <div>
            <label htmlFor="expected" className="block text-sm font-medium text-gray-700">
              What did you expect to happen? (optional)
            </label>
            <textarea
              id="expected"
              value={expectedBehavior}
              onChange={(e) => setExpectedBehavior(e.target.value)}
              rows={2}
              placeholder="I expected to..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email (optional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              We'll only use this to follow up about this specific issue
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Privacy Notice */}
        <div className="mt-4 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
          <strong>Privacy:</strong> This feedback will be sent along with technical details about the error (browser info, error message, stack trace). We will not collect any personal data beyond what you choose to provide.
        </div>
      </div>
    </div>
  )
}

/**
 * Compact Error Feedback Button
 * Shows a small button that opens the feedback modal
 */
export interface ErrorFeedbackButtonProps {
  /** Error to report */
  error?: Error

  /** Error message if no Error object */
  errorMessage?: string

  /** Callback when feedback is submitted */
  onSubmit: (feedback: ErrorFeedbackData) => void

  /** Custom CSS class */
  className?: string

  /** Button text */
  children?: React.ReactNode
}

/**
 * Compact Error Feedback Button Component
 *
 * @example
 * ```tsx
 * <ErrorFeedbackButton
 *   error={error}
 *   onSubmit={handleFeedback}
 * >
 *   Report Issue
 * </ErrorFeedbackButton>
 * ```
 */
export function ErrorFeedbackButton({
  error,
  errorMessage,
  onSubmit,
  className = '',
  children = 'Report Issue',
}: ErrorFeedbackButtonProps) {
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = (feedback: ErrorFeedbackData) => {
    onSubmit(feedback)
    setShowModal(false)
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      >
        {children}
      </button>

      <ErrorFeedback
        show={showModal}
        error={error}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        onCancel={() => setShowModal(false)}
      />
    </>
  )
}

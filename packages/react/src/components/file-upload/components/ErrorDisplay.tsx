'use client'

/**
 * ErrorDisplay Component
 *
 * Displays file upload errors with dismiss and retry actions.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@clarity-chat/primitives'
import type { FileUploadError } from '../types'
import { isRetryableError } from '../utils'

export interface ErrorDisplayProps {
  errors: FileUploadError[]
  uploading: boolean
  prefersReducedMotion: boolean
  onDismiss: (index: number) => void
  onRetry: () => void
}

export function ErrorDisplay({
  errors,
  uploading,
  prefersReducedMotion,
  onDismiss,
  onRetry,
}: ErrorDisplayProps) {
  if (errors.length === 0) return null

  const hasRetryableErrors = errors.some(isRetryableError)

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
        role="alert"
        aria-live="assertive"
        className="space-y-2"
      >
        {errors.map((error, index) => (
          <motion.div
            key={`${error.code}-${error.file?.name || index}`}
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3"
          >
            {/* Error icon */}
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Error content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-destructive">
                {error.file ? `${error.file.name}: ` : ''}
                {error.message}
              </p>
              {error.suggestion && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {error.suggestion}
                </p>
              )}
            </div>

            {/* Dismiss button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(index)}
              className="flex-shrink-0 h-6 w-6 p-0 hover:bg-destructive/20"
              aria-label={`Dismiss error: ${error.message}`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </motion.div>
        ))}

        {/* Retry all button for retryable errors */}
        {hasRetryableErrors && !uploading && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="text-destructive hover:text-destructive"
            >
              <svg
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry All
            </Button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

ErrorDisplay.displayName = 'ErrorDisplay'

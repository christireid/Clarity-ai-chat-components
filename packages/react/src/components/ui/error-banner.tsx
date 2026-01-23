'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@clarity-chat/primitives'
import { duration } from '../../animations/constants'

export interface ErrorBannerProps {
  error: string | null
  onRetry?: () => void
  onDismissError?: () => void
}

export function ErrorBanner({
  error,
  onRetry,
  onDismissError,
}: ErrorBannerProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{
            duration: duration('normal'),
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="border-b border-destructive/30 bg-destructive/5"
          role="alert"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <svg
                className="h-4 w-4 text-destructive shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-sm text-destructive truncate">{error}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onRetry && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={onRetry}
                  className="h-7 px-3 text-xs font-medium"
                >
                  Retry
                </Button>
              )}
              {onDismissError && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDismissError}
                  className="h-7 w-7 p-0"
                  aria-label="Dismiss error"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

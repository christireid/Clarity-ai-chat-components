'use client'
import { SecureLogger } from '@/lib/security/secureLogger';

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

import { SecureLogger } from '@/lib/security/secureLogger';
/**
 * Error Boundary Page
 *
 * Catches runtime errors and displays a user-friendly error message
 * with a retry option. This follows Next.js App Router conventions.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to your error reporting service
    SecureLogger.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle
            className="w-8 h-8 text-destructive"
            aria-hidden="true"
          />
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>

        {/* Error Digest for debugging */}
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono bg-muted px-3 py-1 rounded">
            Error ID: {error.digest}
          </p>
        )}

        {/* Retry Button */}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  )
}

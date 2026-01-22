'use client'

import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import Link from 'next/link'

interface DemoErrorFallbackProps {
  demoName?: string
  error?: Error | null
  onReset?: () => void
}

/**
 * Fallback UI displayed when a demo crashes
 * Provides helpful error information and recovery options
 */
export function DemoErrorFallback({
  demoName,
  error,
  onReset,
}: DemoErrorFallbackProps) {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Demo Encountered an Error
        </h2>

        {/* Demo Name */}
        {demoName && (
          <p className="text-text-secondary mb-4">
            The <span className="font-medium text-text-primary">{demoName}</span> demo
            ran into an unexpected issue.
          </p>
        )}

        {/* Error Message (dev only) */}
        {isDev && error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-left">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-medium text-sm mb-2">
              <Bug className="w-4 h-4" />
              Development Error Details
            </div>
            <pre className="text-xs text-red-600 dark:text-red-400 overflow-x-auto whitespace-pre-wrap">
              {error.message}
            </pre>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-xs text-red-500 cursor-pointer hover:underline">
                  Show stack trace
                </summary>
                <pre className="mt-2 text-xs text-red-400 overflow-x-auto whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Helpful Message */}
        <p className="text-sm text-text-secondary mb-6">
          Don&apos;t worry, your other demos are unaffected. You can try refreshing
          or return to the demos index.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              aria-label="Try loading the demo again"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </button>
          )}

          <Link
            href="/demos"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-text-primary rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            aria-label="View all demos"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            All Demos
          </Link>
        </div>

        {/* Report Issue Link */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-text-secondary">
            If this keeps happening,{' '}
            <a
              href="https://github.com/clarity-chat/clarity-chat/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              please report the issue
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default DemoErrorFallback

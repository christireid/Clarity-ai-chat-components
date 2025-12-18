'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary for Hero Chat
 * Catches React errors and displays a recovery UI
 */
export class HeroChatErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    // Log error to console in development
    logger.error('Hero Chat Error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <HeroChatErrorFallback
          onReset={this.handleReset}
          error={this.state.error}
        />
      )
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  onReset: () => void
  error: Error | null
}

function HeroChatErrorFallback({ onReset, error }: ErrorFallbackProps) {
  return (
    <div className="relative flex flex-col h-[700px] w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white to-orange-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-red-950/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center mb-6"
        >
          <AlertTriangle className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-slate-900 dark:text-white mb-2"
        >
          Oops! Something went wrong
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 dark:text-slate-400 mb-6 max-w-md"
        >
          An unexpected error occurred in the chat. Don&apos;t worry, your
          conversations are safe.
        </motion.p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 max-w-md w-full"
          >
            <div className="flex items-start gap-2">
              <Bug className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300 text-left font-mono">
                {error.message}
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3"
        >
          <motion.button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>

          <motion.button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Refresh Page
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

/**
 * Toast with retry button for recoverable errors
 */
interface ErrorToastProps {
  message: string
  onRetry?: () => void
  onDismiss: () => void
  isRetrying?: boolean
  retryAttempt?: number
  maxRetries?: number
}

export function HeroChatErrorToast({
  message,
  onRetry,
  onDismiss,
  isRetrying = false,
  retryAttempt = 0,
  maxRetries = 3,
}: ErrorToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 text-white shadow-2xl max-w-md"
    >
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{message}</p>
        {isRetrying && (
          <p className="text-xs text-red-200 mt-0.5">
            Retrying... ({retryAttempt}/{maxRetries})
          </p>
        )}
      </div>
      {onRetry && !isRetrying && (
        <motion.button
          onClick={onRetry}
          className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry
        </motion.button>
      )}
      <button
        onClick={onDismiss}
        className="p-1 rounded hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        ×
      </button>
    </motion.div>
  )
}

/**
 * Offline indicator banner
 */
export function HeroChatOfflineBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-0 left-0 right-0 z-50 px-4 py-2 bg-amber-500 text-amber-900 text-center text-sm font-medium"
    >
      You&apos;re offline. Some features may be unavailable.
    </motion.div>
  )
}

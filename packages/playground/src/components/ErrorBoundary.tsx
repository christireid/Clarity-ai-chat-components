import { logger } from '@clarity-chat/utils/logger';
/**
 * Error Boundary Component
 *
 * A beautifully designed error boundary with:
 * - Helpful error suggestions
 * - Common error patterns recognition
 * - Recovery options
 * - Professional visual design
 * - Copy error functionality
 */

import { Component, type ReactNode } from 'react'
import {
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Lightbulb,
  Bug,
  AlertTriangle,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { copyToClipboard, cn } from '../utils'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  copied: boolean
}

// Common error patterns and suggestions
const errorSuggestions: Array<{
  pattern: RegExp
  title: string
  suggestions: string[]
}> = [
  {
    pattern: /is not defined|is not a function/i,
    title: 'Undefined Reference',
    suggestions: [
      'Check if the variable or function is properly imported',
      'Verify the spelling and case sensitivity',
      'Make sure the component is exported correctly',
    ],
  },
  {
    pattern: /cannot read propert|undefined|null/i,
    title: 'Null Reference',
    suggestions: [
      'Add null checks before accessing properties',
      'Use optional chaining (?.) for safer property access',
      'Initialize state with default values',
    ],
  },
  {
    pattern: /invalid hook call|hooks can only be called/i,
    title: 'Invalid Hook Call',
    suggestions: [
      'Hooks must be called at the top level of your component',
      "Don't call hooks inside loops, conditions, or nested functions",
      'Ensure you have only one copy of React in your bundle',
    ],
  },
  {
    pattern: /jsx|unexpected token/i,
    title: 'Syntax Error',
    suggestions: [
      'Check for missing or extra brackets, parentheses, or braces',
      'Ensure JSX elements are properly closed',
      'Verify all imports are correct',
    ],
  },
  {
    pattern: /maximum update depth|infinite loop/i,
    title: 'Infinite Loop',
    suggestions: [
      'Check useEffect dependencies array',
      'Avoid setting state unconditionally in useEffect',
      'Use useCallback for functions passed as dependencies',
    ],
  },
  {
    pattern: /render|component/i,
    title: 'Render Error',
    suggestions: [
      'Check if all required props are passed',
      'Verify conditional rendering logic',
      'Make sure the component returns valid JSX',
    ],
  },
]

function getErrorSuggestion(errorMessage: string) {
  for (const suggestion of errorSuggestions) {
    if (suggestion.pattern.test(errorMessage)) {
      return suggestion
    }
  }
  return {
    title: 'Runtime Error',
    suggestions: [
      'Check the console for more details',
      'Review recent code changes',
      'Try resetting to the original template',
    ],
  }
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)

    // Log to console for debugging
    logger.logger.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    this.props.onReset?.()
  }

  handleCopyError = async () => {
    const { error, errorInfo } = this.state
    const errorText = `Error: ${error?.message}\n\nStack:\n${error?.stack}\n\nComponent Stack:\n${errorInfo?.componentStack}`
    const success = await copyToClipboard(errorText)
    if (success) {
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2000)
    }
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorInfo, copied } = this.state
      const suggestion = getErrorSuggestion(error?.message || '')

      return (
        <div className="p-6 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl animate-fade-in">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center flex-shrink-0">
              <Bug className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-rose-900 dark:text-rose-100">
                  Something went wrong
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  {suggestion.title}
                </span>
              </div>

              <p className="text-sm text-rose-800 dark:text-rose-200 mb-4">
                An error occurred while rendering the component. This might be
                due to invalid code or a runtime error.
              </p>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-rose-200 dark:border-rose-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-sm font-semibold text-rose-900 dark:text-rose-100">
                      Error Message
                    </span>
                  </div>
                  <pre className="text-sm text-rose-700 dark:text-rose-300 bg-rose-100/50 dark:bg-rose-900/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                    {error.message}
                  </pre>
                </div>
              )}

              {/* Suggestions */}
              <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                    Suggestions
                  </span>
                </div>
                <ul className="space-y-2">
                  {suggestion.suggestions.map((tip, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center flex-shrink-0 text-xs font-bold text-amber-700 dark:text-amber-300">
                        {index + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Component Stack (collapsible) */}
              {errorInfo?.componentStack && (
                <details className="mb-4 group">
                  <summary className="flex items-center gap-2 text-sm font-medium text-rose-700 dark:text-rose-300 cursor-pointer hover:text-rose-900 dark:hover:text-rose-100 transition-colors">
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                    View Component Stack
                  </summary>
                  <pre className="mt-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-100/50 dark:bg-rose-900/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-rose-500/25"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={this.handleCopyError}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors',
                    copied
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Error
                    </>
                  )}
                </button>
                <a
                  href="https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Preview-specific Error Boundary
 *
 * A simpler, more compact error boundary for the preview iframe area.
 */
interface PreviewErrorBoundaryProps {
  children: ReactNode
  onRetry?: () => void
}

interface PreviewErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class PreviewErrorBoundary extends Component<
  PreviewErrorBoundaryProps,
  PreviewErrorBoundaryState
> {
  constructor(props: PreviewErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<PreviewErrorBoundaryState> {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.logger.error('Preview error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onRetry?.()
  }

  override render() {
    if (this.state.hasError) {
      const suggestion = getErrorSuggestion(this.state.error?.message || '')

      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 flex items-center justify-center mb-4 shadow-lg">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Preview Error
          </h3>

          {/* Error type badge */}
          <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-medium mb-3">
            {suggestion.title}
          </span>

          {/* Error message */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
            {this.state.error?.message || 'An error occurred in the preview'}
          </p>

          {/* Quick tip */}
          <div className="mb-6 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 text-left max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                Quick Tip
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {suggestion.suggestions[0]}
            </p>
          </div>

          {/* Retry button */}
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

/**
 * Error Boundary for Playground
 *
 * This module:
 * - Re-exports EnhancedErrorBoundary from error-handling package as ErrorBoundary
 * - Provides PreviewErrorBoundary for preview-specific error handling
 */

import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Lightbulb } from 'lucide-react'

// Re-export the main ErrorBoundary from error-handling package
export { EnhancedErrorBoundary as ErrorBoundary } from '@clarity-chat/error-handling'

// Error suggestion patterns
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

// PreviewErrorBoundary - specific to preview functionality
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
    console.error('Preview error:', error, errorInfo)
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

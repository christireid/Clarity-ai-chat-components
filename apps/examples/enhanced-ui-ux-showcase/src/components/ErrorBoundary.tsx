/**
 * ErrorBoundary Component - Enhanced UI/UX Showcase
 *
 * Catches errors in React component tree and displays a beautiful
 * glassmorphism-styled error UI with recovery options
 * Uses Tailwind CSS and framer-motion for animations
 */

import { Component, ErrorInfo, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: ReactNode
  fallback?: (error: Error, resetError: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  enableReporting?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorCount: number
  isDetailsOpen: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      isDetailsOpen: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }))

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    if (this.props.enableReporting) {
      this.reportError(error, errorInfo)
    }
  }

  reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }

      console.log('Error report:', errorReport)

      // In production, send to error tracking service
      // await fetch('/api/error-report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // })
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isDetailsOpen: false,
    })
  }

  reloadPage = () => {
    window.location.reload()
  }

  copyErrorDetails = () => {
    const { error, errorInfo } = this.state
    const errorDetails = `
Error: ${error?.message}

Stack:
${error?.stack}

Component Stack:
${errorInfo?.componentStack}
    `.trim()

    navigator.clipboard.writeText(errorDetails).then(() => {
      alert('Error details copied to clipboard!')
    })
  }

  toggleDetails = () => {
    this.setState((prev) => ({ isDetailsOpen: !prev.isDetailsOpen }))
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.resetError)
      }

      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Aurora background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
                  backgroundSize: '400% 400%',
                  animation: 'aurora 15s ease infinite',
                }}
              />
            </div>

            {/* Glassmorphic error card */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative max-w-2xl w-full bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 pointer-events-none" />

              <div className="relative p-8">
                {/* Error icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-red-400/50"
                    />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-white text-center mb-3"
                >
                  Oops! Something went wrong
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 text-center mb-6 text-lg"
                >
                  We encountered an unexpected error. Don't worry, your data is
                  safe.
                </motion.p>

                {/* Error details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6 p-4 bg-red-500/20 backdrop-blur-lg rounded-2xl border border-red-300/30"
                >
                  <div className="text-red-100 text-sm">
                    <strong className="block mb-2 text-base">Error:</strong>
                    <p className="break-words">{this.state.error?.message}</p>
                  </div>

                  {this.state.errorCount > 1 && (
                    <div className="mt-3 pt-3 border-t border-red-300/30">
                      <p className="text-red-200 text-xs font-medium">
                        This error has occurred {this.state.errorCount} times
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
                >
                  <button
                    onClick={this.resetError}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    Try Again
                  </button>

                  <button
                    onClick={this.reloadPage}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 text-white font-semibold hover:bg-white/30 transition-all"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="1 4 1 10 7 10" />
                      <polyline points="23 20 23 14 17 14" />
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                    </svg>
                    Reload
                  </button>

                  <button
                    onClick={this.copyErrorDetails}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy Details
                  </button>
                </motion.div>

                {/* Error stack (development only) */}
                {process.env.NODE_ENV === 'development' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <button
                      onClick={this.toggleDetails}
                      className="w-full p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white font-medium hover:bg-white/15 transition-all mb-3 flex items-center justify-between"
                    >
                      <span>View Error Stack</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`transition-transform ${this.state.isDetailsOpen ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {this.state.isDetailsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 max-h-64 overflow-y-auto">
                            <pre className="text-xs text-white/80 font-mono whitespace-pre-wrap break-words">
                              {this.state.error?.stack}
                            </pre>
                            {this.state.errorInfo && (
                              <pre className="mt-4 text-xs text-white/70 font-mono whitespace-pre-wrap break-words">
                                {this.state.errorInfo.componentStack}
                              </pre>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="pt-6 border-t border-white/10 text-center"
                >
                  <p className="text-white/70 text-sm">
                    If this problem persists, please{' '}
                    <a
                      href="https://github.com/christireid/Clarity-ai-chat-components/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 font-semibold hover:text-purple-200 underline"
                    >
                      report an issue
                    </a>
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Aurora animation styles */}
            <style>{`
              @keyframes aurora {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>
          </motion.div>
        </AnimatePresence>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

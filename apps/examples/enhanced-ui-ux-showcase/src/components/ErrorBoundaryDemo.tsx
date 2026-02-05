/**
 * ErrorBoundary Demo Component - Enhanced UI/UX Showcase
 *
 * Demonstrates the ErrorBoundary with glassmorphism styling
 * and various error scenarios
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import ErrorBoundary from './ErrorBoundary'

// Component that throws an error
function ThrowError({ message }: { message?: string }) {
  throw new Error(message || 'This is a test error!')
}

// Component that throws async error
function AsyncErrorComponent() {
  const [shouldError, setShouldError] = useState(false)

  const triggerAsyncError = () => {
    setTimeout(() => {
      setShouldError(true)
    }, 1000)
  }

  if (shouldError) {
    throw new Error('Async error occurred after delay!')
  }

  return (
    <button
      onClick={triggerAsyncError}
      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold hover:scale-105 transition-all shadow-lg"
    >
      Trigger Async Error
    </button>
  )
}

export function ErrorBoundaryDemo() {
  const [errorType, setErrorType] = useState<string | null>(null)
  const [showBrokenComponent, setShowBrokenComponent] = useState(false)

  const errorScenarios = [
    {
      id: 'immediate',
      title: 'Immediate Error',
      description: 'Throws an error during render',
      gradient: 'from-red-500 to-orange-500',
      icon: '⚠️',
    },
    {
      id: 'async',
      title: 'Async Error',
      description: 'Triggers an error after a delay',
      gradient: 'from-orange-500 to-yellow-500',
      icon: '⏱️',
    },
    {
      id: 'network',
      title: 'Network Error',
      description: 'Simulates a network request failure',
      gradient: 'from-blue-500 to-cyan-500',
      icon: '🌐',
    },
    {
      id: 'tree',
      title: 'Component Tree Error',
      description: 'Error deep in component tree',
      gradient: 'from-green-500 to-emerald-500',
      icon: '🌳',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      {/* Aurora background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            ErrorBoundary Demo
          </h1>
          <p className="text-xl text-gray-600">
            Test the error boundary with different error scenarios
          </p>
        </motion.div>

        {/* Error scenarios grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {errorScenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 hover:shadow-3xl transition-all"
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{scenario.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {scenario.title}
                </h3>
                <p className="text-gray-600 mb-6">{scenario.description}</p>

                <ErrorBoundary>
                  {showBrokenComponent && errorType === scenario.id ? (
                    scenario.id === 'async' ? (
                      <AsyncErrorComponent />
                    ) : (
                      <ThrowError
                        message={`${scenario.title} - Test error!`}
                      />
                    )
                  ) : (
                    <button
                      onClick={() => {
                        setErrorType(scenario.id)
                        setShowBrokenComponent(true)
                      }}
                      className={`px-8 py-4 rounded-xl bg-gradient-to-r ${scenario.gradient} text-white font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl`}
                    >
                      Trigger {scenario.title}
                    </button>
                  )}
                </ErrorBoundary>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>💡</span>
            How It Works
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                Click any button to trigger different types of errors
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold">•</span>
              <span>Each demo is wrapped in its own ErrorBoundary</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                Errors are caught and displayed with glassmorphism styling
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                Try the "Try Again" button to recover from errors without
                reloading
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                Error details are automatically logged and can be copied to
                clipboard
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                Production-ready error reporting integration available
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Features showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl border border-purple-200/30 p-6">
            <div className="text-3xl mb-3">🎨</div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              Glassmorphism Design
            </h4>
            <p className="text-gray-600 text-sm">
              Beautiful frosted glass effects with backdrop blur and transparency
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl border border-blue-200/30 p-6">
            <div className="text-3xl mb-3">🔄</div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              Smart Recovery
            </h4>
            <p className="text-gray-600 text-sm">
              Multiple recovery options: retry, reload, or copy error details
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl border border-green-200/30 p-6">
            <div className="text-3xl mb-3">📊</div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              Error Reporting
            </h4>
            <p className="text-gray-600 text-sm">
              Automatic error tracking and reporting to monitoring services
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ErrorBoundaryDemo

'use client'

import { useState } from 'react'

/**
 * {{EXAMPLE_TITLE}}
 *
 * {{EXAMPLE_DESCRIPTION}}
 *
 * @example
 * ```tsx
 * // Example usage will be generated here
 * ```
 */
export default function {{EXAMPLE_COMPONENT_NAME}}() {
  const [message, setMessage] = useState('Hello from {{EXAMPLE_TITLE}}!')

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-xl">
                {{EXAMPLE_ICON}}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {{EXAMPLE_TITLE}}
                </h1>
                <p className="text-sm text-slate-600">
                  {{EXAMPLE_SUBTITLE}}
                </p>
              </div>
            </div>
            <a
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Back to Docs
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        {/* How to Use Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <h2 className="text-base font-semibold text-slate-900 mb-2">
            💡 How to Use
          </h2>
          <p className="text-sm text-slate-600">
            {{USAGE_INSTRUCTIONS}}
          </p>
        </div>

        {/* Example Implementation Area */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="text-center">
            <p className="text-lg text-slate-700">{message}</p>
            <button
              onClick={() => setMessage('Template loaded successfully!')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Test Button
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <p>{{EXAMPLE_TITLE}} • Clarity Chat Components</p>
            <div className="flex gap-4">
              <a
                href="https://clarity-chat.dev"
                className="hover:text-slate-900 transition-colors"
              >
                📖 Documentation
              </a>
              <a
                href="https://github.com/christireid/Clarity-ai-chat-components"
                className="hover:text-slate-900 transition-colors"
              >
                💻 GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

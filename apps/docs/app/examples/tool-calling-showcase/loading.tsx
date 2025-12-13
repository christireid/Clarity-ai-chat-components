/**
 * Loading state for Tool Calling Showcase route
 *
 * Next.js automatically shows this component while the page is loading.
 * Uses skeleton patterns consistent with the main component.
 */

import { Sparkles, Zap } from 'lucide-react'

export default function ToolCallingShowcaseLoading() {
  return (
    <div className="container-docs py-12 animate-pulse">
      {/* Back link skeleton */}
      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-8" />

      <div className="max-w-6xl mx-auto">
        {/* Hero Section skeleton */}
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg shadow-purple-500/25">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="h-12 w-80 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="h-6 w-full max-w-xl bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded-full" />
          ))}
        </div>

        {/* Features skeleton */}
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
              <div className="h-5 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-1" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>

        {/* Demo section skeleton */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-500" />
            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          {/* Chat interface skeleton */}
          <div className="h-[700px] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500" />
                <div>
                  <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                  <div className="h-3 w-60 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-14 w-40 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  />
                ))}
              </div>
            </div>

            {/* Input area */}
            <div className="px-6 pb-6">
              <div className="h-12 w-full bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'

/**
 * Custom 404 page for Streamlined Docs
 * Designed for render-correct empty state with clear navigation
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl">
        {/* 404 Visual */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-2">
            This page doesn't exist in the streamlined docs shell.
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            Content is intentionally omitted. This shell focuses on structure, navigation, and rendering integrity.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="p-6 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Explore the streamlined structure:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/get-started"
              className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/build"
              className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              Build
            </Link>
            <Link
              href="/api"
              className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              API
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

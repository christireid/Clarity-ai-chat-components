import { Metadata } from 'next'
import Link from 'next/link'
import { Code, Box, Zap, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Standalone API Documentation',
  description: 'Standalone API documentation for primitives, components, and utilities',
}

const apiDocs = [
  {
    title: 'React Components',
    href: '/reference/api-standalone/react-components',
    description: 'Complete API reference for React components',
    icon: Box,
    category: 'Components',
  },
  {
    title: 'Primitives',
    href: '/reference/api-standalone/primitives',
    description: 'Core primitive components and utilities',
    icon: Code,
    category: 'Primitives',
  },
  {
    title: 'Token Optimization',
    href: '/reference/api-standalone/token-optimization',
    description: 'Token optimization utilities and APIs',
    icon: Zap,
    category: 'Utilities',
  },
  {
    title: 'Vercel AI SDK Hooks',
    href: '/reference/api-standalone/vercel-ai-sdk-hooks',
    description: 'Hooks for integrating with Vercel AI SDK',
    icon: BookOpen,
    category: 'Integration',
  },
]

export default function ApiStandalonePage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-4xl">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Standalone API Documentation</h1>
          <p className="text-xl text-text-secondary">
            Complete API reference documentation for components, primitives, and utilities.
          </p>
        </div>

        <div className="grid gap-6">
          {apiDocs.map((doc) => {
            const Icon = doc.icon
            return (
              <Link
                key={doc.href}
                href={doc.href}
                className="group block p-6 border border-border rounded-xl hover:border-brand-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-bg-secondary text-text-secondary rounded-full text-sm font-medium">
                        {doc.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 mb-2">
                      {doc.title}
                    </h2>
                    <p className="text-text-secondary">{doc.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Full API Reference</h2>
          <p className="text-text-secondary mb-6">
            For complete API documentation including all components, hooks, and utilities, visit the main API reference.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/reference"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              View Full API Reference
            </Link>
            <a
              href="https://storybook.clarity-chat.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              Open Storybook
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

const apiCategories = [
  {
    name: 'Types',
    description: 'TypeScript type definitions and interfaces',
    href: '/reference/api/types',
    icon: '📝',
  },
  {
    name: 'Primitives',
    description: 'Low-level building blocks for chat components',
    href: '/reference/api/primitives',
    icon: '🧱',
  },
  {
    name: 'React Components',
    description: 'Pre-built React components for chat UI',
    href: '/reference/api/react-components',
    icon: '⚛️',
  },
  {
    name: 'Streaming Components',
    description: 'Components optimized for streaming responses',
    href: '/reference/api/streaming-components',
    icon: '🌊',
  },
  {
    name: 'Model Adapters',
    description: 'Adapters for different AI providers',
    href: '/reference/api/model-adapters',
    icon: '🔌',
  },
  {
    name: 'Components',
    description: 'Full component API reference',
    href: '/reference/api/components',
    icon: '🎨',
  },
]

export default function ApiReferencePage() {
  return (
    <>
      <Breadcrumbs />

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
          API Reference
        </h1>

        <p className="text-xl text-text-secondary leading-relaxed">
          Complete API reference for Clarity Chat. Explore types, primitives,
          components, and model adapters.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Understand the type system and interfaces',
          'Learn about primitive building blocks',
          'Explore pre-built React components',
          'Configure model adapters for AI providers',
        ]}
      />

      <Callout type="info" className="mb-8">
        <p>
          <strong>Note:</strong> This reference covers the core API. For
          React-specific hooks, see the{' '}
          <Link
            href="/reference/hooks"
            className="text-brand-500 hover:underline"
          >
            Hooks Reference
          </Link>
          .
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">API Categories</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="block p-6 rounded-xl border border-border hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{category.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {category.name}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Callout type="tip">
        <p>
          <strong>Need help?</strong> Check out our{' '}
          <Link
            href="/reference/quick-reference"
            className="text-brand-500 hover:underline"
          >
            Quick Reference
          </Link>{' '}
          for common patterns and usage examples.
        </p>
      </Callout>
    </>
  )
}

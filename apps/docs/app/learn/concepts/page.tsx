import { Metadata } from 'next'
import Link from 'next/link'
import { LIBRARY_STATS } from '@/lib/library-stats'

export const metadata: Metadata = {
  title: 'Core Concepts - Learn Clarity Chat',
  description:
    'Understand the fundamental concepts behind Clarity Chat: theming, components, hooks, and animations.',
}

const concepts = [
  {
    title: 'Theming',
    href: '/learn/concepts/theming',
    description:
      'Customize colors, typography, spacing, and animation presets using CSS variables.',
    icon: '🎨',
  },
  {
    title: 'Components',
    href: '/learn/concepts/components',
    description:
      'Learn about the component architecture and how to compose chat interfaces.',
    icon: '🧱',
  },
  {
    title: 'Hooks',
    href: '/learn/concepts/hooks',
    description:
      'Understand the React hooks that power chat state, streaming, and more.',
    icon: '🪝',
  },
  {
    title: 'Animations',
    href: '/learn/concepts/animations',
    description:
      'Add life to your chat with smooth, accessible animations and transitions.',
    icon: '✨',
  },
]

export default function ConceptsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Learn</span>
        <h1>Core Concepts</h1>
        <p className="docs-lead">
          Master the foundational concepts that power Clarity Chat.
          Understanding these will help you build better, more maintainable chat
          applications.
        </p>
      </div>

      <section className="docs-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {concepts.map((concept) => (
            <Link
              key={concept.href}
              href={concept.href}
              className="group p-6 rounded-xl border-2 border-border hover:border-brand-500 bg-bg-primary hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{concept.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                    {concept.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {concept.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="docs-section">
        <h2>Where to Go Next</h2>
        <p className="mb-4">
          Once you understand the core concepts, explore these resources:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary">
          <li>
            <Link
              href="/reference/components"
              className="text-brand-500 hover:underline"
            >
              Component Reference
            </Link>{' '}
            - Full API documentation for all {LIBRARY_STATS.components} components
          </li>
          <li>
            <Link
              href="/reference/hooks"
              className="text-brand-500 hover:underline"
            >
              Hooks Reference
            </Link>{' '}
            - Complete guide to all {LIBRARY_STATS.hooks} hooks
          </li>
          <li>
            <Link href="/examples" className="text-brand-500 hover:underline">
              Examples
            </Link>{' '}
            - See concepts in action with real code
          </li>
        </ul>
      </section>
    </div>
  )
}

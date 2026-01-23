import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Guides - Learn Clarity Chat',
  description:
    'In-depth guides for advanced topics: performance, accessibility, testing, styling, and more.',
}

const guides = [
  {
    title: 'Performance',
    href: '/learn/guides/performance',
    description:
      'Optimize your chat application for speed and efficiency with virtualization, memoization, and smart rendering.',
    icon: '⚡',
  },
  {
    title: 'Accessibility',
    href: '/learn/guides/accessibility',
    description:
      'Build inclusive chat experiences that work for everyone with WCAG compliance and assistive technology support.',
    icon: '♿',
  },
  {
    title: 'Testing',
    href: '/learn/guides/testing',
    description:
      'Write reliable tests for your chat components with testing utilities and best practices.',
    icon: '🧪',
  },
  {
    title: 'Styling',
    href: '/learn/guides/styling',
    description:
      'Master CSS variables, themes, and customization options to match your brand.',
    icon: '🎨',
  },
  {
    title: 'TypeScript',
    href: '/learn/guides/typescript',
    description:
      'Leverage full TypeScript support with proper typing for components, hooks, and utilities.',
    icon: '📘',
  },
  {
    title: 'Bundle Size',
    href: '/learn/guides/bundle-size',
    description:
      'Keep your bundle lean with tree-shaking, code splitting, and import optimization.',
    icon: '📦',
  },
  {
    title: 'Common Patterns',
    href: '/learn/guides/common-patterns',
    description:
      'Learn recurring patterns for handling messages, streaming, errors, and more.',
    icon: '🔄',
  },
]

export default function GuidesPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Learn</span>
        <h1>Guides</h1>
        <p className="docs-lead">
          Deep dives into advanced topics. Go beyond the basics and master the
          techniques that make production chat apps shine.
        </p>
      </div>

      <section className="docs-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group p-6 rounded-xl border-2 border-border hover:border-brand-500 bg-bg-primary hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{guide.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                    {guide.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {guide.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="docs-section">
        <h2>Looking for Recipes?</h2>
        <p className="mb-4">
          For step-by-step implementation tutorials, check out:
        </p>
        <ul className="list-disc list-inside space-y-2 text-text-secondary">
          <li>
            <Link href="/cookbook" className="text-brand-500 hover:underline">
              Cookbook
            </Link>{' '}
            - Practical recipes for common use cases
          </li>
          <li>
            <Link href="/guides" className="text-brand-500 hover:underline">
              Topic Guides
            </Link>{' '}
            - Deep dives into specific topics like RAG, agents, and streaming
          </li>
        </ul>
      </section>
    </div>
  )
}

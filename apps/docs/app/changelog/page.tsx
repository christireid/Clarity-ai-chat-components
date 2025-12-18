'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Sparkles,
  Bug,
  Zap,
  Package,
  ArrowRight,
  GitBranch,
  Calendar,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { cn } from '@/lib/utils'

interface ChangelogEntry {
  version: string
  date: string
  title: string
  description: string
  type: 'major' | 'minor' | 'patch'
  changes: {
    type: 'feature' | 'fix' | 'improvement' | 'breaking'
    description: string
  }[]
}

const changelog: ChangelogEntry[] = [
  {
    version: '2.1.0',
    date: '2025-12-08',
    title: 'Developer Experience Improvements',
    description:
      'Enhanced documentation, fuzzy search, and social sharing features.',
    type: 'minor',
    changes: [
      {
        type: 'feature',
        description:
          'Added fuzzy search with relevance scoring to documentation',
      },
      {
        type: 'feature',
        description: 'New comparison page showing Clarity vs alternatives',
      },
      {
        type: 'feature',
        description: 'Social sharing buttons with pre-filled text',
      },
      {
        type: 'feature',
        description: 'GitHub stars badge with loading skeleton and retry logic',
      },
      {
        type: 'feature',
        description: 'Enhanced copy button with confetti animation',
      },
      {
        type: 'improvement',
        description: 'Improved search accessibility with ARIA live regions',
      },
      {
        type: 'improvement',
        description: 'Added search analytics for documentation insights',
      },
      {
        type: 'improvement',
        description: 'Better search debouncing for performance',
      },
    ],
  },
  {
    version: '2.0.0',
    date: '2025-12-01',
    title: 'AI Documentation APIs',
    description:
      'Comprehensive AI-optimized documentation infrastructure for LLM accessibility.',
    type: 'major',
    changes: [
      {
        type: 'feature',
        description:
          'AI-optimized API endpoints for components, hooks, and search',
      },
      {
        type: 'feature',
        description: 'MCP server for Claude Code integration',
      },
      {
        type: 'feature',
        description: 'OpenAPI specification for all documentation APIs',
      },
      {
        type: 'feature',
        description: 'Rate limiting and caching for API endpoints',
      },
      { type: 'feature', description: 'Health check endpoint for monitoring' },
      {
        type: 'feature',
        description: 'Auto-generated component data from TypeScript sources',
      },
      {
        type: 'improvement',
        description: 'llms.txt and robots.txt for AI crawler guidance',
      },
      {
        type: 'breaking',
        description: 'API routes moved from /api/docs to /api/ai namespace',
      },
    ],
  },
  {
    version: '1.9.0',
    date: '2025-11-15',
    title: 'Enterprise Features',
    description: 'Added enterprise-ready features for production deployments.',
    type: 'minor',
    changes: [
      {
        type: 'feature',
        description: 'Role-based access control (RBAC) system',
      },
      {
        type: 'feature',
        description: 'Multi-tenancy support with tenant isolation',
      },
      {
        type: 'feature',
        description: 'Audit logging for compliance requirements',
      },
      { type: 'feature', description: 'PII detection and redaction utilities' },
      {
        type: 'improvement',
        description: 'Performance optimizations for 1000+ message lists',
      },
    ],
  },
  {
    version: '1.8.0',
    date: '2025-11-01',
    title: 'Accessibility Excellence',
    description: 'Achieved WCAG AAA compliance across all components.',
    type: 'minor',
    changes: [
      {
        type: 'feature',
        description: 'Full keyboard navigation for all interactive components',
      },
      {
        type: 'feature',
        description: 'Screen reader optimizations with proper ARIA attributes',
      },
      {
        type: 'feature',
        description: 'High contrast theme for visual accessibility',
      },
      { type: 'improvement', description: 'Focus management improvements' },
      { type: 'fix', description: 'Fixed focus trap in modal components' },
    ],
  },
  {
    version: '1.7.0',
    date: '2025-10-15',
    title: 'Theming System',
    description: 'Comprehensive theming with 11 built-in themes.',
    type: 'minor',
    changes: [
      {
        type: 'feature',
        description: '11 built-in themes including dark mode variants',
      },
      {
        type: 'feature',
        description: 'CSS variable-based theming for easy customization',
      },
      { type: 'feature', description: 'Theme persistence with localStorage' },
      {
        type: 'improvement',
        description: 'Automatic system preference detection',
      },
    ],
  },
]

function getChangeTypeIcon(type: string) {
  switch (type) {
    case 'feature':
      return <Sparkles className="w-4 h-4 text-green-500" />
    case 'fix':
      return <Bug className="w-4 h-4 text-red-500" />
    case 'improvement':
      return <Zap className="w-4 h-4 text-blue-500" />
    case 'breaking':
      return <Package className="w-4 h-4 text-orange-500" />
    default:
      return <GitBranch className="w-4 h-4 text-gray-500" />
  }
}

function getVersionBadgeColor(type: string) {
  switch (type) {
    case 'major':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
    case 'minor':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    case 'patch':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function ChangelogPage() {
  return (
    <>
      <Breadcrumbs />

      <div className="mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          What's{' '}
          <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
            New
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-text-secondary max-w-3xl"
        >
          Stay up to date with the latest features, improvements, and fixes in
          Clarity Chat.
        </motion.p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

        <div className="space-y-12">
          {changelog.map((entry, index) => (
            <motion.article
              key={entry.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute left-6 top-8 w-5 h-5 rounded-full bg-brand-500 border-4 border-bg-primary hidden md:block" />

              <div className="md:ml-20">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-bold',
                      getVersionBadgeColor(entry.type)
                    )}
                  >
                    v{entry.version}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-text-tertiary">
                    <Calendar className="w-4 h-4" />
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Content Card */}
                <div className="p-6 rounded-xl border border-border bg-bg-secondary/50 hover:border-brand-300 transition-colors">
                  <h2 className="text-2xl font-bold mb-2">{entry.title}</h2>
                  <p className="text-text-secondary mb-6">
                    {entry.description}
                  </p>

                  {/* Changes List */}
                  <ul className="space-y-3">
                    {entry.changes.map((change, changeIndex) => (
                      <li key={changeIndex} className="flex items-start gap-3">
                        <span className="mt-0.5">
                          {getChangeTypeIcon(change.type)}
                        </span>
                        <span
                          className={cn(
                            'text-sm',
                            change.type === 'breaking'
                              ? 'text-orange-600 dark:text-orange-400 font-medium'
                              : 'text-text-secondary'
                          )}
                        >
                          {change.type === 'breaking' && (
                            <span className="font-bold mr-1">[BREAKING]</span>
                          )}
                          {change.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-brand-500 to-purple-500 text-white text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-brand-100 mb-6 max-w-xl mx-auto">
          Install Clarity Chat and start building beautiful AI chat interfaces
          in minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/learn/quick-start"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Quick Start
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="https://github.com/christireid/Clarity-ai-chat-components/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors border border-white/20"
          >
            View on GitHub
          </Link>
        </div>
      </motion.div>
    </>
  )
}

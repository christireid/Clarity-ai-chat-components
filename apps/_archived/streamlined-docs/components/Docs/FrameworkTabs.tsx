'use client'

import * as React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CodePreview } from './CodePreview'

// ============================================================================
// Types
// ============================================================================

type Framework = 'nextjs-app' | 'nextjs-pages' | 'vite' | 'remix' | 'cra'

interface FrameworkExample {
  framework: Framework
  code: string
  filename?: string
  description?: string
}

interface FrameworkTabsProps {
  /** Examples for each framework */
  examples: FrameworkExample[]
  /** Custom className */
  className?: string
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Default framework */
  defaultFramework?: Framework
}

// ============================================================================
// Framework Metadata
// ============================================================================

const frameworkMeta: Record<
  Framework,
  { label: string; icon: string; color: string }
> = {
  'nextjs-app': {
    label: 'Next.js (App)',
    icon: '▲',
    color: 'text-black dark:text-white',
  },
  'nextjs-pages': {
    label: 'Next.js (Pages)',
    icon: '▲',
    color: 'text-black dark:text-white',
  },
  vite: {
    label: 'Vite',
    icon: '⚡',
    color: 'text-purple-500',
  },
  remix: {
    label: 'Remix',
    icon: '💿',
    color: 'text-blue-500',
  },
  cra: {
    label: 'Create React App',
    icon: '⚛️',
    color: 'text-cyan-500',
  },
}

// ============================================================================
// Framework Tabs Component
// ============================================================================

export function FrameworkTabs({
  examples,
  className,
  showLineNumbers = true,
  defaultFramework,
}: FrameworkTabsProps) {
  const availableFrameworks = examples.map((e) => e.framework)
  const [activeFramework, setActiveFramework] = useState<Framework>(
    defaultFramework || availableFrameworks[0] || 'nextjs-app'
  )

  const activeExample =
    examples.find((e) => e.framework === activeFramework) || examples[0]

  if (!activeExample) return null

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden',
        className
      )}
    >
      {/* Framework Tabs */}
      <div className="flex overflow-x-auto bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {examples.map(({ framework }) => {
          const meta = frameworkMeta[framework]
          const isActive = activeFramework === framework

          return (
            <button
              key={framework}
              onClick={() => setActiveFramework(framework)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
                isActive
                  ? 'border-brand-500 text-gray-900 dark:text-white bg-white dark:bg-gray-900'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              <span className={meta.color}>{meta.icon}</span>
              {meta.label}
            </button>
          )
        })}
      </div>

      {/* Description (if provided) */}
      {activeExample.description && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {activeExample.description}
          </p>
        </div>
      )}

      {/* Code Display */}
      <CodePreview
        code={activeExample.code}
        title={activeExample.filename}
        language="tsx"
        showLineNumbers={showLineNumbers}
        className="rounded-none border-0"
      />
    </div>
  )
}

// ============================================================================
// Quick Framework Guide Component
// ============================================================================

interface FrameworkGuideProps {
  className?: string
}

export function FrameworkGuide({ className }: FrameworkGuideProps) {
  const frameworks: Array<{
    id: Framework
    setup: string
    entryPoint: string
    notes: string
  }> = [
    {
      id: 'nextjs-app',
      setup: 'npx create-next-app@latest --app',
      entryPoint: 'app/page.tsx',
      notes: 'Recommended. Uses App Router with Server Components.',
    },
    {
      id: 'nextjs-pages',
      setup: 'npx create-next-app@latest',
      entryPoint: 'pages/index.tsx',
      notes: 'Legacy Pages Router. Good for existing projects.',
    },
    {
      id: 'vite',
      setup: 'npm create vite@latest -- --template react-ts',
      entryPoint: 'src/App.tsx',
      notes: 'Fast development. Great for SPAs.',
    },
    {
      id: 'remix',
      setup: 'npx create-remix@latest',
      entryPoint: 'app/routes/_index.tsx',
      notes: 'Full-stack framework with nested routing.',
    },
  ]

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Framework Setup Guide
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Framework
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Setup Command
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Entry Point
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {frameworks.map((fw) => {
              const meta = frameworkMeta[fw.id]
              return (
                <tr key={fw.id}>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-2">
                      <span className={meta.color}>{meta.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {meta.label}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {fw.setup}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs text-blue-600 dark:text-blue-400">
                      {fw.entryPoint}
                    </code>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {fw.notes}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

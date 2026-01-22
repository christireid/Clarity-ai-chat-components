'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Github } from 'lucide-react'
import { CollapsibleSection } from '@/components/CollapsibleSection'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CopyButton } from '@/components/CopyButton'
import { categoryConfig, type HookCategory } from '@/lib/hook-metadata'
import { cn } from '@/lib/utils'

export interface HookDocumentationPageProps {
  name: string
  description: string
  category: HookCategory
  architectureLayer?: string
  domain?: string
  importStatement: string
  quickStartCode: string
  whenToUse: string[]
  whenNotToUse?: Array<{
    text: string
    alternative?: string
    alternativeHref?: string
  }>
  features?: Array<{ title: string; items: string[] }>
  children?: ReactNode
  relatedHooks?: Array<{ name: string; href: string; description: string }>
  relatedGuides?: Array<{ name: string; href: string; description: string }>
  githubPath?: string
}

// Map category to badge background styles (derived from categoryConfig text colors)
const categoryBadgeBgMap: Record<HookCategory, string> = {
  'top-level': 'bg-brand-100 dark:bg-brand-900/50',
  chat: 'bg-amber-100 dark:bg-amber-900/50',
  memory: 'bg-green-100 dark:bg-green-900/50',
  streaming: 'bg-blue-100 dark:bg-blue-900/50',
  ui: 'bg-purple-100 dark:bg-purple-900/50',
  utility: 'bg-gray-100 dark:bg-gray-800',
  agent: 'bg-orange-100 dark:bg-orange-900/50',
  storage: 'bg-cyan-100 dark:bg-cyan-900/50',
  performance: 'bg-red-100 dark:bg-red-900/50',
}

function getCategoryBadgeClass(category: HookCategory): string {
  const config = categoryConfig[category]
  return cn(
    'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
    categoryBadgeBgMap[category],
    config.colorClass
  )
}

export function HookDocumentationPage({
  name,
  description,
  category,
  architectureLayer = 'Mid-Level',
  domain,
  importStatement,
  quickStartCode,
  whenToUse,
  whenNotToUse,
  features,
  children,
  relatedHooks,
  relatedGuides,
  githubPath,
}: HookDocumentationPageProps) {
  const config = categoryConfig[category]
  const pageId = name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className={getCategoryBadgeClass(category)}>
          <span>{config.label}</span>
        </div>
        <h1 className="text-4xl font-bold mt-4 mb-4">{name}</h1>
        <p className="text-xl text-muted-foreground mb-4">{description}</p>
        {(architectureLayer || domain) && (
          <p className="text-muted-foreground">
            {architectureLayer && (
              <>
                <strong>Architecture Layer:</strong> {architectureLayer}
              </>
            )}
            {architectureLayer && domain && ' • '}
            {domain && (
              <>
                <strong>Domain:</strong> {domain}
              </>
            )}
          </p>
        )}
      </div>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Quick Start</h2>
          <CopyButton text={quickStartCode} label="Copy code" />
        </div>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{quickStartCode}</code>
        </pre>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Import:</span>
          <code className="bg-background px-2 py-1 rounded text-xs">
            {importStatement}
          </code>
          <CopyButton text={importStatement} size="sm" />
        </div>
      </section>

      {/* When to Use */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-success mb-2">Use This When:</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {whenToUse.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          {whenNotToUse && whenNotToUse.length > 0 && (
            <div>
              <h3 className="font-semibold text-error mb-2">
                Consider Alternatives When:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {whenNotToUse.map((item, i) => (
                  <li key={i}>
                    {item.text}
                    {item.alternative && item.alternativeHref && (
                      <>
                        {' '}
                        →{' '}
                        <Link
                          href={item.alternativeHref}
                          className="text-brand-600 hover:underline"
                        >
                          {item.alternative}
                        </Link>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      {features && features.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {feature.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Content (examples, API reference, etc.) */}
      {children}

      {/* Related */}
      {((relatedHooks && relatedHooks.length > 0) ||
        (relatedGuides && relatedGuides.length > 0)) && (
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Related</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {relatedHooks?.map((hook) => (
              <Link
                key={hook.name}
                href={hook.href}
                className="border rounded-lg p-4 hover:bg-muted transition-colors"
              >
                <h3 className="font-semibold mb-2">{hook.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {hook.description}
                </p>
              </Link>
            ))}
            {relatedGuides?.map((guide) => (
              <Link
                key={guide.name}
                href={guide.href}
                className="border rounded-lg p-4 hover:bg-muted transition-colors"
              >
                <h3 className="font-semibold mb-2">{guide.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {guide.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer with Edit Link and Feedback */}
      <footer className="mt-12 pt-8 border-t">
        {githubPath && (
          <div className="mb-6 text-sm">
            <a
              href={`https://github.com/christireid/Clarity-ai-chat-components/edit/main/${githubPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              Edit this page on GitHub
            </a>
          </div>
        )}
        <FeedbackWidget pageId={pageId} />
      </footer>
    </div>
  )
}

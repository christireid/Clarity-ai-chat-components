'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { CollapsibleSection } from '@/components/CollapsibleSection'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CopyButton } from '@/components/CopyButton'

export interface HookDocumentationPageProps {
  name: string
  description: string
  category: string
  categoryColor?: string
  architectureLayer?: string
  domain?: string
  importStatement: string
  quickStartCode: string
  whenToUse: string[]
  whenNotToUse?: Array<{ text: string; alternative?: string; alternativeHref?: string }>
  features?: Array<{ title: string; items: string[] }>
  children?: ReactNode
  relatedHooks?: Array<{ name: string; href: string; description: string }>
  relatedGuides?: Array<{ name: string; href: string; description: string }>
  githubPath?: string
}

const categoryColors: Record<string, string> = {
  'top-level': 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300',
  'chat': 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  'memory': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
  'streaming': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  'ui': 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
  'utility': 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  'agent': 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  'storage': 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300',
  'performance': 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
}

export function HookDocumentationPage({
  name,
  description,
  category,
  categoryColor,
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
  const colorClass = categoryColor || categoryColors[category.toLowerCase()] || categoryColors['utility']
  const pageId = name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${colorClass}`}>
          <span>{category}</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">{name}</h1>
        <p className="text-xl text-muted-foreground mb-4">{description}</p>
        {(architectureLayer || domain) && (
          <p className="text-muted-foreground">
            {architectureLayer && <><strong>Architecture Layer:</strong> {architectureLayer}</>}
            {architectureLayer && domain && ' • '}
            {domain && <><strong>Domain:</strong> {domain}</>}
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
          <code className="bg-background px-2 py-1 rounded text-xs">{importStatement}</code>
          <CopyButton text={importStatement} size="sm" />
        </div>
      </section>

      {/* When to Use */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Use This When:</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {whenToUse.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          {whenNotToUse && whenNotToUse.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Consider Alternatives When:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {whenNotToUse.map((item, i) => (
                  <li key={i}>
                    {item.text}
                    {item.alternative && item.alternativeHref && (
                      <> → <Link href={item.alternativeHref} className="text-brand-600 hover:underline">{item.alternative}</Link></>
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
      {((relatedHooks && relatedHooks.length > 0) || (relatedGuides && relatedGuides.length > 0)) && (
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
                <p className="text-sm text-muted-foreground">{hook.description}</p>
              </Link>
            ))}
            {relatedGuides?.map((guide) => (
              <Link
                key={guide.name}
                href={guide.href}
                className="border rounded-lg p-4 hover:bg-muted transition-colors"
              >
                <h3 className="font-semibold mb-2">{guide.name}</h3>
                <p className="text-sm text-muted-foreground">{guide.description}</p>
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
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Edit this page on GitHub
            </a>
          </div>
        )}
        <FeedbackWidget pageId={pageId} />
      </footer>
    </div>
  )
}

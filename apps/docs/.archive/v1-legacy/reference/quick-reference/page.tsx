'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  hookMetadata,
  componentMetadata,
  getHooksByCategory,
  getComponentsByCategory,
  categoryConfig,
  componentCategoryConfig,
  type HookCategory,
  type ComponentCategory,
} from '@/lib/hook-metadata'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-muted-foreground/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
      title="Copy import statement"
      aria-label={copied ? 'Copied!' : 'Copy import statement'}
    >
      {copied ? (
        <svg
          className="w-4 h-4 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  )
}

const hookCategories: HookCategory[] = [
  'top-level',
  'chat',
  'memory',
  'streaming',
  'ui',
  'utility',
]
const componentCategories: ComponentCategory[] = ['core', 'provider']

export default function QuickReferencePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">API Quick Reference</h1>
        <p className="text-xl text-muted-foreground">
          Scannable reference for all Clarity Chat hooks and components.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Click any item to view full documentation. Use the copy button to copy
          import statements.
        </p>
      </div>

      {/* Hooks Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Hooks</h2>

        {hookCategories.map((category) => {
          const hooks = getHooksByCategory(category)
          if (hooks.length === 0) return null
          const config = categoryConfig[category]

          return (
            <div key={category} className="mb-8">
              <h3 className={`text-lg font-semibold ${config.colorClass} mb-3`}>
                {config.label}
              </h3>
              <div className="border rounded-lg divide-y">
                {hooks.map((hook) => (
                  <div key={hook.name} className="flex items-center">
                    <Link
                      href={hook.href}
                      className="flex items-start gap-4 p-3 hover:bg-muted transition-colors flex-1"
                    >
                      <code className="font-mono font-semibold text-sm whitespace-nowrap">
                        {hook.name}
                      </code>
                      <code className="text-xs text-muted-foreground flex-1 font-mono">
                        {hook.signature}
                      </code>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {hook.description}
                      </span>
                    </Link>
                    <div className="pr-3">
                      <CopyButton text={hook.importStatement} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* Components Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Components</h2>

        {componentCategories.map((category) => {
          const components = getComponentsByCategory(category)
          if (components.length === 0) return null
          const config = componentCategoryConfig[category]

          return (
            <div key={category} className="mb-8">
              <h3 className={`text-lg font-semibold ${config.colorClass} mb-3`}>
                {config.label}
              </h3>
              <div className="border rounded-lg divide-y">
                {components.map((comp) => (
                  <div key={comp.name} className="flex items-center">
                    <Link
                      href={comp.href}
                      className="flex items-start gap-4 p-3 hover:bg-muted transition-colors flex-1"
                    >
                      <code className="font-mono font-semibold text-sm whitespace-nowrap">
                        &lt;{comp.name}&gt;
                      </code>
                      <code className="text-xs text-muted-foreground flex-1 font-mono">
                        {comp.props}
                      </code>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {comp.description}
                      </span>
                    </Link>
                    <div className="pr-3">
                      <CopyButton text={comp.importStatement} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Minimal Setup</h2>
        <div className="relative">
          <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { ClarityChat } from '@clarity-chat/react'

function App() {
  return <ClarityChat api="/api/chat" />
}`}</code>
          </pre>
          <div className="absolute top-2 right-2">
            <CopyButton
              text={`import { ClarityChat } from '@clarity-chat/react'

function App() {
  return <ClarityChat api="/api/chat" />
}`}
            />
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <div className="flex gap-4 text-sm">
        <Link
          href="/reference/hooks"
          className="text-brand-600 dark:text-brand-400 hover:underline"
        >
          All Hooks →
        </Link>
        <Link
          href="/reference/components"
          className="text-brand-600 dark:text-brand-400 hover:underline"
        >
          All Components →
        </Link>
        <Link
          href="/reference/hooks/selector"
          className="text-brand-600 dark:text-brand-400 hover:underline"
        >
          Hook Selector →
        </Link>
      </div>
    </div>
  )
}

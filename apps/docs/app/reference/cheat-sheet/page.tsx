'use client'

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

const hookCategories: HookCategory[] = ['top-level', 'chat', 'memory', 'streaming', 'ui', 'utility', 'agent', 'storage', 'performance']
const componentCategories: ComponentCategory[] = ['core', 'provider', 'input']

export default function CheatSheetPage() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="cheat-sheet-page">
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          /* Hide non-essential elements */
          nav, header, footer, .no-print, [data-sidebar], [data-header] {
            display: none !important;
          }

          /* Optimize for printing */
          body {
            font-size: 9pt !important;
            line-height: 1.3 !important;
            color: black !important;
            background: white !important;
          }

          .cheat-sheet-page {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .cheat-sheet-grid {
            display: block !important;
          }

          .cheat-sheet-section {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 12pt !important;
          }

          .cheat-sheet-header {
            font-size: 14pt !important;
            margin-bottom: 8pt !important;
          }

          .cheat-sheet-subheader {
            font-size: 10pt !important;
            margin-bottom: 4pt !important;
          }

          .cheat-sheet-item {
            font-size: 8pt !important;
            padding: 2pt 4pt !important;
            border-bottom: 0.5pt solid #ddd !important;
          }

          .cheat-sheet-code {
            font-size: 7pt !important;
            background: #f5f5f5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          a {
            color: black !important;
            text-decoration: none !important;
          }

          /* Multi-column layout for print */
          .print-columns {
            column-count: 2;
            column-gap: 20pt;
          }
        }

        @page {
          size: letter;
          margin: 0.5in;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 py-8 print:max-w-full print:px-0 print:py-0">
        {/* Header - hidden on print */}
        <div className="mb-8 no-print">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">API Cheat Sheet</h1>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Cheat Sheet
            </button>
          </div>
          <p className="text-xl text-muted-foreground">
            Printable quick reference for Clarity Chat API.
          </p>
        </div>

        {/* Print Header */}
        <div className="hidden print:block mb-4">
          <h1 className="cheat-sheet-header text-2xl font-bold">Clarity Chat API Cheat Sheet</h1>
          <p className="text-sm text-gray-600">docs.clarity-chat.com</p>
        </div>

        {/* Main Content */}
        <div className="print-columns">
          {/* Quick Start */}
          <section className="cheat-sheet-section mb-8 print:mb-4">
            <h2 className="cheat-sheet-header text-xl font-bold mb-3 pb-2 border-b print:text-sm">Quick Start</h2>
            <pre className="cheat-sheet-code bg-muted p-3 rounded text-sm overflow-x-auto print:text-xs print:p-2">
              <code>{`import { ClarityChat } from '@clarity-chat/react'

<ClarityChat api="/api/chat" />`}</code>
            </pre>
          </section>

          {/* Hooks by Category */}
          {hookCategories.map((category) => {
            const hooks = getHooksByCategory(category)
            if (hooks.length === 0) return null
            const config = categoryConfig[category]

            return (
              <section key={category} className="cheat-sheet-section mb-6 print:mb-3">
                <h2 className={`cheat-sheet-subheader font-semibold mb-2 ${config.colorClass} print:text-black`}>
                  {config.label}
                </h2>
                <div className="border rounded print:border-gray-300">
                  {hooks.map((hook, idx) => (
                    <div
                      key={hook.name}
                      className={`cheat-sheet-item p-2 text-sm ${idx !== hooks.length - 1 ? 'border-b' : ''} print:p-1 print:text-xs`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <code className="font-mono font-semibold text-xs">{hook.name}</code>
                        <span className="text-xs text-muted-foreground print:text-gray-600 truncate">
                          {hook.description}
                        </span>
                      </div>
                      <code className="cheat-sheet-code text-xs text-muted-foreground block mt-1 bg-muted px-1 rounded print:bg-gray-100">
                        {hook.signature}
                      </code>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}

          {/* Components */}
          <section className="cheat-sheet-section mb-6 print:mb-3">
            <h2 className="cheat-sheet-header text-xl font-bold mb-3 pb-2 border-b print:text-sm">Components</h2>

            {componentCategories.map((category) => {
              const components = getComponentsByCategory(category)
              if (components.length === 0) return null
              const config = componentCategoryConfig[category]

              return (
                <div key={category} className="mb-4 print:mb-2">
                  <h3 className={`cheat-sheet-subheader font-semibold mb-2 ${config.colorClass} print:text-black text-sm`}>
                    {config.label}
                  </h3>
                  <div className="border rounded print:border-gray-300">
                    {components.map((comp, idx) => (
                      <div
                        key={comp.name}
                        className={`cheat-sheet-item p-2 text-sm ${idx !== components.length - 1 ? 'border-b' : ''} print:p-1 print:text-xs`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <code className="font-mono font-semibold text-xs">&lt;{comp.name}&gt;</code>
                          <span className="text-xs text-muted-foreground print:text-gray-600">
                            {comp.description}
                          </span>
                        </div>
                        <code className="cheat-sheet-code text-xs text-muted-foreground block mt-1 bg-muted px-1 rounded print:bg-gray-100">
                          {comp.props}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </section>

          {/* Common Patterns */}
          <section className="cheat-sheet-section mb-6 print:mb-3">
            <h2 className="cheat-sheet-header text-xl font-bold mb-3 pb-2 border-b print:text-sm">Common Patterns</h2>

            <div className="space-y-3 print:space-y-2">
              <div>
                <h3 className="font-semibold text-sm mb-1">Chat with Tools</h3>
                <pre className="cheat-sheet-code bg-muted p-2 rounded text-xs overflow-x-auto print:p-1">
                  <code>{`const { messages, toolResults } = useClarityChatWithTools({
  api: '/api/chat',
  toolUIRegistry: { weather: WeatherCard }
})`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-1">Memory Context</h3>
                <pre className="cheat-sheet-code bg-muted p-2 rounded text-xs overflow-x-auto print:p-1">
                  <code>{`<MemoryProvider config={{ maxTokens: 10000 }}>
  <ChatWithMemory />
</MemoryProvider>

// Inside component:
const memory = useMemoryContext()
await memory?.addMemory(content, 'fact', 'user')`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-1">Structured Output</h3>
                <pre className="cheat-sheet-code bg-muted p-2 rounded text-xs overflow-x-auto print:p-1">
                  <code>{`const { object } = useClarityObject<UserData>({
  api: '/api/extract',
  schema: userSchema
})`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-1">Theme Switching</h3>
                <pre className="cheat-sheet-code bg-muted p-2 rounded text-xs overflow-x-auto print:p-1">
                  <code>{`const { theme, setTheme } = useTheme()
setTheme('dark') // 'light' | 'dark' | 'system'`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Key Types */}
          <section className="cheat-sheet-section mb-6 print:mb-3">
            <h2 className="cheat-sheet-header text-xl font-bold mb-3 pb-2 border-b print:text-sm">Key Types</h2>
            <pre className="cheat-sheet-code bg-muted p-3 rounded text-xs overflow-x-auto print:p-2 print:text-[7pt]">
              <code>{`interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  metadata?: Record<string, unknown>
}

interface UseClarityChatOptions {
  api: string
  memory?: { strategy: 'local' | 'vector-store' }
  onMessage?: (msg: Message) => void
  onError?: (error: Error) => void
}

interface MemoryItem {
  id: string
  content: string
  type: 'preference' | 'fact' | 'context' | 'task'
  scope: 'user' | 'session' | 'global'
  metadata?: Record<string, unknown>
}`}</code>
            </pre>
          </section>
        </div>

        {/* Footer Links - hidden on print */}
        <div className="mt-8 pt-8 border-t flex gap-4 text-sm no-print">
          <Link href="/reference/quick-reference" className="text-brand-600 dark:text-brand-400 hover:underline">
            ← Quick Reference
          </Link>
          <Link href="/reference/hooks" className="text-brand-600 dark:text-brand-400 hover:underline">
            All Hooks →
          </Link>
          <Link href="/reference/hooks/compare" className="text-brand-600 dark:text-brand-400 hover:underline">
            Compare Hooks →
          </Link>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-4 pt-2 border-t text-xs text-gray-500 text-center">
          Clarity Chat Documentation - clarity-chat.com
        </div>
      </div>
    </div>
  )
}

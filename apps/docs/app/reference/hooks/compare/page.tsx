'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  hookMetadata,
  categoryConfig,
  type HookMetadata,
  type HookCategory,
} from '@/lib/hook-metadata'
import { FeedbackWidget } from '@/components/FeedbackWidget'

type CompareField = 'description' | 'signature' | 'category' | 'useCases' | 'relatedHooks' | 'tags'

const compareFields: { key: CompareField; label: string }[] = [
  { key: 'description', label: 'Description' },
  { key: 'signature', label: 'Signature' },
  { key: 'category', label: 'Category' },
  { key: 'useCases', label: 'Use Cases' },
  { key: 'relatedHooks', label: 'Related Hooks' },
  { key: 'tags', label: 'Tags' },
]

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
        type === 'success'
          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      }`}
      role="alert"
    >
      {type === 'success' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function HookSelector({
  selectedHooks,
  onToggle,
}: {
  selectedHooks: string[]
  onToggle: (hookName: string) => void
}) {
  const [search, setSearch] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<HookCategory[]>(['top-level', 'chat'])

  const filteredHooks = useMemo(() => {
    if (!search) return hookMetadata
    const lower = search.toLowerCase()
    return hookMetadata.filter(
      (h) =>
        h.name.toLowerCase().includes(lower) ||
        h.description.toLowerCase().includes(lower) ||
        h.tags.some((t) => t.toLowerCase().includes(lower))
    )
  }, [search])

  const groupedHooks = useMemo(() => {
    const groups: Record<HookCategory, HookMetadata[]> = {} as Record<HookCategory, HookMetadata[]>
    filteredHooks.forEach((hook) => {
      if (!groups[hook.category]) {
        groups[hook.category] = []
      }
      groups[hook.category].push(hook)
    })
    return groups
  }, [filteredHooks])

  const toggleCategory = (category: HookCategory) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Select Hooks to Compare</h3>
      <input
        type="text"
        placeholder="Search hooks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg mb-4 bg-background focus:outline-none focus:ring-2 focus:ring-brand-500"
        aria-label="Search hooks"
      />

      <div className="max-h-96 overflow-y-auto space-y-2">
        {(Object.keys(groupedHooks) as HookCategory[]).map((category) => {
          const hooks = groupedHooks[category]
          if (!hooks || hooks.length === 0) return null
          const config = categoryConfig[category]
          const isExpanded = expandedCategories.includes(category)

          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full text-left px-2 py-1 rounded text-sm font-medium ${config.colorClass} hover:bg-muted flex items-center gap-2`}
                aria-expanded={isExpanded}
              >
                <svg
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {config.label} ({hooks.length})
              </button>

              {isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {hooks.map((hook) => (
                    <label
                      key={hook.name}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedHooks.includes(hook.name)}
                        onChange={() => onToggle(hook.name)}
                        className="rounded border-muted-foreground focus:ring-brand-500"
                      />
                      <span className="text-sm font-mono">{hook.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedHooks.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Selected: {selectedHooks.length} hook{selectedHooks.length !== 1 ? 's' : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedHooks.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 px-2 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded text-xs font-mono"
              >
                {name}
                <button
                  onClick={() => onToggle(name)}
                  className="hover:text-brand-900 dark:hover:text-brand-100"
                  aria-label={`Remove ${name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ExportMenu({
  hooks,
  onCopy,
}: {
  hooks: HookMetadata[]
  onCopy: (success: boolean, message: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const copyToClipboard = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text)
      onCopy(true, successMessage)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        onCopy(true, successMessage)
      } catch {
        onCopy(false, 'Failed to copy to clipboard')
      }
      document.body.removeChild(textArea)
    }
    setIsOpen(false)
  }

  const generateMarkdown = () => {
    if (hooks.length === 0) return ''

    let md = '# Hook Comparison\n\n'
    md += '| Property | ' + hooks.map((h) => h.name).join(' | ') + ' |\n'
    md += '|----------|' + hooks.map(() => '----------').join('|') + '|\n'

    compareFields.forEach((field) => {
      md += `| ${field.label} | `
      md += hooks
        .map((hook) => {
          const value = hook[field.key]
          if (Array.isArray(value)) {
            return value.join(', ') || '—'
          }
          return String(value || '—')
        })
        .join(' | ')
      md += ' |\n'
    })

    md += '\n## Import Statements\n\n```typescript\n'
    md += hooks.map((h) => h.importStatement).join('\n')
    md += '\n```\n'

    return md
  }

  const generateJSON = () => {
    return JSON.stringify(
      hooks.map((h) => ({
        name: h.name,
        description: h.description,
        signature: h.signature,
        category: h.category,
        tags: h.tags,
        useCases: h.useCases,
        relatedHooks: h.relatedHooks,
        importStatement: h.importStatement,
      })),
      null,
      2
    )
  }

  const generateImports = () => {
    const allImports = hooks.map((h) => h.name)
    return `import { ${allImports.join(', ')} } from '@clarity-chat/react'`
  }

  if (hooks.length === 0) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Export
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-background border rounded-lg shadow-lg z-50 py-1">
            <button
              onClick={() => copyToClipboard(generateImports(), 'Imports copied!')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy All Imports
            </button>
            <button
              onClick={() => copyToClipboard(generateMarkdown(), 'Markdown copied!')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Copy as Markdown
            </button>
            <button
              onClick={() => copyToClipboard(generateJSON(), 'JSON copied!')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Copy as JSON
            </button>
            <hr className="my-1" />
            <button
              onClick={() => {
                const url = window.location.href
                copyToClipboard(url, 'Link copied!')
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Copy Share Link
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function ComparisonTable({
  hooks,
  onRemove,
}: {
  hooks: HookMetadata[]
  onRemove: (name: string) => void
}) {
  if (hooks.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="font-medium mb-2">No hooks selected</p>
        <p className="text-sm">Select hooks from the sidebar to compare them side by side.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-3 font-semibold border-b w-32">Property</th>
              {hooks.map((hook) => (
                <th key={hook.name} className="text-left p-3 font-semibold border-b min-w-64">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={hook.href}
                      className="font-mono text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {hook.name}
                    </Link>
                    <button
                      onClick={() => onRemove(hook.name)}
                      className="p-1 hover:bg-muted-foreground/10 rounded"
                      aria-label={`Remove ${hook.name}`}
                    >
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareFields.map((field, idx) => (
              <tr key={field.key} className={idx % 2 === 0 ? '' : 'bg-muted/50'}>
                <td className="p-3 font-medium text-sm border-r">{field.label}</td>
                {hooks.map((hook) => (
                  <td key={hook.name} className="p-3 text-sm">
                    {renderFieldValue(hook, field.key)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-muted/50">
              <td className="p-3 font-medium text-sm border-r">Import</td>
              {hooks.map((hook) => (
                <td key={hook.name} className="p-3">
                  <code className="text-xs bg-background px-2 py-1 rounded block overflow-x-auto">
                    {hook.importStatement}
                  </code>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function renderFieldValue(hook: HookMetadata, field: CompareField): React.ReactNode {
  switch (field) {
    case 'description':
      return hook.description
    case 'signature':
      return <code className="text-xs bg-muted px-2 py-1 rounded">{hook.signature}</code>
    case 'category':
      const config = categoryConfig[hook.category]
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${config.colorClass}`}>
          {config.label}
        </span>
      )
    case 'useCases':
      if (!hook.useCases || hook.useCases.length === 0) {
        return <span className="text-muted-foreground">—</span>
      }
      return (
        <ul className="list-disc list-inside space-y-1">
          {hook.useCases.map((uc, i) => (
            <li key={i} className="text-muted-foreground">{uc}</li>
          ))}
        </ul>
      )
    case 'relatedHooks':
      if (!hook.relatedHooks || hook.relatedHooks.length === 0) {
        return <span className="text-muted-foreground">—</span>
      }
      return (
        <div className="flex flex-wrap gap-1">
          {hook.relatedHooks.map((name) => (
            <Link
              key={name}
              href={`/reference/hooks/${name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '').replace('use-', 'use-')}`}
              className="text-xs bg-muted px-2 py-1 rounded hover:bg-brand-100 dark:hover:bg-brand-900"
            >
              {name}
            </Link>
          ))}
        </div>
      )
    case 'tags':
      return (
        <div className="flex flex-wrap gap-1">
          {hook.tags.map((tag) => (
            <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )
    default:
      return null
  }
}

// Suggested comparison sets
const suggestedComparisons = [
  {
    label: 'Chat Hooks',
    hooks: ['useClarityChat', 'useClarityChatWithTools', 'useChatOptimized'],
  },
  {
    label: 'Storage Options',
    hooks: ['useLocalStorage', 'useIndexedDB', 'useMemoryContext'],
  },
  {
    label: 'Streaming Methods',
    hooks: ['useStreamingSSE', 'useStreamingWebSocket', 'useStreamableUI'],
  },
  {
    label: 'UI Helpers',
    hooks: ['useKeyboardShortcuts', 'useCommandPalette', 'useTheme'],
  },
]

export default function CompareHooksPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Initialize from URL params
  const [selectedHooks, setSelectedHooks] = useState<string[]>(() => {
    const hooksParam = searchParams.get('hooks')
    if (hooksParam) {
      const hooks = hooksParam.split(',').filter((h) => hookMetadata.some((m) => m.name === h))
      return hooks
    }
    return []
  })

  // Update URL when selection changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedHooks.length > 0) {
      params.set('hooks', selectedHooks.join(','))
    }
    const newUrl = selectedHooks.length > 0
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname
    router.replace(newUrl, { scroll: false })
  }, [selectedHooks, router])

  const toggleHook = useCallback((hookName: string) => {
    setSelectedHooks((prev) =>
      prev.includes(hookName)
        ? prev.filter((h) => h !== hookName)
        : [...prev, hookName]
    )
  }, [])

  const selectedHookData = useMemo(
    () => hookMetadata.filter((h) => selectedHooks.includes(h.name)),
    [selectedHooks]
  )

  const loadSuggestion = useCallback((hooks: string[]) => {
    setSelectedHooks(hooks)
  }, [])

  const handleCopy = useCallback((success: boolean, message: string) => {
    setToast({ message, type: success ? 'success' : 'error' })
  }, [])

  const clearAll = useCallback(() => {
    setSelectedHooks([])
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Compare Hooks</h1>
        <p className="text-xl text-muted-foreground">
          Select multiple hooks to compare their features, signatures, and use cases side by side.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Tip: Share your comparison by copying the URL or using the Export button.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Quick comparisons:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedComparisons.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => loadSuggestion(suggestion.hooks)}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-muted transition-colors"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedHooks.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              Clear All
            </button>
          )}
          <ExportMenu hooks={selectedHookData} onCopy={handleCopy} />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Selector Sidebar */}
        <div className="lg:col-span-1">
          <HookSelector selectedHooks={selectedHooks} onToggle={toggleHook} />
        </div>

        {/* Comparison Table */}
        <div className="lg:col-span-3">
          <ComparisonTable hooks={selectedHookData} onRemove={toggleHook} />
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-8 pt-8 border-t flex gap-4 text-sm">
        <Link href="/reference/hooks" className="text-brand-600 dark:text-brand-400 hover:underline">
          ← All Hooks
        </Link>
        <Link href="/reference/hooks/selector" className="text-brand-600 dark:text-brand-400 hover:underline">
          Hook Selector →
        </Link>
        <Link href="/reference/quick-reference" className="text-brand-600 dark:text-brand-400 hover:underline">
          Quick Reference →
        </Link>
      </div>

      {/* Feedback Widget */}
      <FeedbackWidget pageId="compare-hooks" className="mt-12" />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  hookMetadata,
  categoryConfig,
  type HookMetadata,
  type HookCategory,
} from '@/lib/hook-metadata'

type CompareField = 'description' | 'signature' | 'category' | 'useCases' | 'relatedHooks' | 'tags'

const compareFields: { key: CompareField; label: string }[] = [
  { key: 'description', label: 'Description' },
  { key: 'signature', label: 'Signature' },
  { key: 'category', label: 'Category' },
  { key: 'useCases', label: 'Use Cases' },
  { key: 'relatedHooks', label: 'Related Hooks' },
  { key: 'tags', label: 'Tags' },
]

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
        <p>Select hooks from the sidebar to compare them side by side.</p>
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
  const [selectedHooks, setSelectedHooks] = useState<string[]>([])

  const toggleHook = (hookName: string) => {
    setSelectedHooks((prev) =>
      prev.includes(hookName)
        ? prev.filter((h) => h !== hookName)
        : [...prev, hookName]
    )
  }

  const selectedHookData = useMemo(
    () => hookMetadata.filter((h) => selectedHooks.includes(h.name)),
    [selectedHooks]
  )

  const loadSuggestion = (hooks: string[]) => {
    setSelectedHooks(hooks)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Compare Hooks</h1>
        <p className="text-xl text-muted-foreground">
          Select multiple hooks to compare their features, signatures, and use cases side by side.
        </p>
      </div>

      {/* Suggested Comparisons */}
      <div className="mb-6">
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
    </div>
  )
}

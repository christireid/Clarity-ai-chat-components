'use client'

/**
 * DocsCommandBar - Global search command palette for documentation
 *
 * Features:
 * - Cmd+K / Ctrl+K keyboard shortcut
 * - Fuzzy search through all documentation pages
 * - Quick navigation to components, hooks, examples
 * - Recent pages history
 * - Category-based filtering
 */

import { useState, useEffect, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  FileText,
  Box,
  Zap,
  BookOpen,
  Code,
  Search,
  Clock,
  Sparkles,
} from 'lucide-react'

// Re-export CommandPalette from primitives or create wrapper
// For now, using inline implementation structure
interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  category?: string
  shortcut?: string[]
  onSelect: () => void
  url?: string
}

// Documentation pages index
const DOCS_PAGES: Array<{
  title: string
  url: string
  description?: string
  category: string
}> = [
  // Components
  {
    title: 'Chat Window',
    url: '/reference/components/clarity-chat',
    description: 'Main chat interface component',
    category: 'Components',
  },
  {
    title: 'Chat Input',
    url: '/reference/components/chat-input',
    description: 'Message input with formatting',
    category: 'Components',
  },
  {
    title: 'Message',
    url: '/reference/components/streaming-message',
    description: 'Display chat messages with streaming support',
    category: 'Components',
  },
  {
    title: 'Command Palette',
    url: '/reference/components/command-palette',
    description: 'Keyboard-driven command interface',
    category: 'Components',
  },
  {
    title: 'Token Usage Meter',
    url: '/reference/components/token-usage-meter',
    description: 'Visual token consumption tracking',
    category: 'Components',
  },

  // Hooks
  {
    title: 'useClarityChat',
    url: '/reference/hooks/use-clarity-chat',
    description: 'Core chat functionality hook',
    category: 'Hooks',
  },
  {
    title: 'useTokenBudgetMonitor',
    url: '/reference/hooks/use-token-budget-monitor',
    description: 'Monitor and manage token budgets',
    category: 'Hooks',
  },

  // Examples
  {
    title: 'Enhanced RAG Demo',
    url: '/examples/enhanced-rag',
    description: 'Interactive RAG system demo',
    category: 'Examples',
  },
  {
    title: 'RAG Comparison',
    url: '/examples/rag-comparison',
    description: 'Compare baseline vs enhanced RAG',
    category: 'Examples',
  },

  // Cookbook
  {
    title: 'RAG Document Chat',
    url: '/cookbook/rag-document-chat',
    description: 'Production RAG implementation guide',
    category: 'Cookbook',
  },
  {
    title: 'Streaming with Memory',
    url: '/cookbook/streaming-with-memory',
    description: 'Advanced streaming + memory pattern',
    category: 'Cookbook',
  },

  // Guides
  {
    title: 'Getting Started',
    url: '/getting-started',
    description: 'Installation and setup guide',
    category: 'Guides',
  },
  {
    title: 'Token Optimization',
    url: '/guides/token-optimization',
    description: 'Optimize token usage and costs',
    category: 'Guides',
  },
  {
    title: 'RAG System',
    url: '/reference/rag-system',
    description: 'Complete RAG feature documentation',
    category: 'Features',
  },
]

export function DocsCommandBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [recentPages, setRecentPages] = useState<string[]>([])
  const router = useRouter()
  const pathname = usePathname()

  // Track recent pages in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('docs-recent-pages')
      if (stored) {
        try {
          setRecentPages(JSON.parse(stored))
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [])

  // Save current page to recent when pathname changes
  useEffect(() => {
    if (pathname && pathname !== '/') {
      setRecentPages((prevPages) => {
        const updated = [
          pathname,
          ...prevPages.filter((p) => p !== pathname),
        ].slice(0, 5)
        if (typeof window !== 'undefined') {
          localStorage.setItem('docs-recent-pages', JSON.stringify(updated))
        }
        return updated
      })
    }
  }, [pathname])

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Build command items from pages
  const commandItems = useBuildCommandItems(search, recentPages, router, () =>
    setIsOpen(false)
  )

  return (
    <>
      <SearchTriggerButton onOpen={() => setIsOpen(true)} />
      {isOpen && (
        <CommandPaletteOverlay
          search={search}
          onSearchChange={setSearch}
          onClose={() => setIsOpen(false)}
          commandItems={commandItems}
        />
      )}
    </>
  )
}

// Hook to build command items
function useBuildCommandItems(
  search: string,
  recentPages: string[],
  router: ReturnType<typeof useRouter>,
  onClose: () => void
): CommandItem[] {
  return useMemo(() => {
    const items: CommandItem[] = []

    // Add search results from docs pages
    const query = search.toLowerCase()
    const filteredPages = search
      ? DOCS_PAGES.filter(
          (page) =>
            page.title.toLowerCase().includes(query) ||
            page.description?.toLowerCase().includes(query) ||
            page.category.toLowerCase().includes(query)
        )
      : DOCS_PAGES

    filteredPages.forEach((page) => {
      items.push({
        id: page.url,
        label: page.title,
        description: page.description,
        category: page.category,
        icon: getCategoryIcon(page.category),
        url: page.url,
        onSelect: () => {
          router.push(page.url)
          onClose()
        },
      })
    })

    // Add recent pages if no search query
    if (!search && recentPages.length > 0) {
      recentPages.forEach((url) => {
        const page = DOCS_PAGES.find((p) => p.url === url)
        if (page && !items.find((i) => i.id === page.url)) {
          items.unshift({
            id: `recent-${page.url}`,
            label: page.title,
            description: page.description,
            category: 'Recent',
            icon: <Clock className="w-4 h-4" />,
            url: page.url,
            onSelect: () => {
              router.push(page.url)
              onClose()
            },
          })
        }
      })
    }

    // Add quick actions
    if (!search) {
      items.push(
        {
          id: 'action-components',
          label: 'Browse Components',
          description: 'View all available components',
          category: 'Quick Actions',
          icon: <Box className="w-4 h-4" />,
          shortcut: ['C'],
          onSelect: () => {
            router.push('/reference/components')
            onClose()
          },
        },
        {
          id: 'action-hooks',
          label: 'Browse Hooks',
          description: 'View all available hooks',
          category: 'Quick Actions',
          icon: <Zap className="w-4 h-4" />,
          shortcut: ['H'],
          onSelect: () => {
            router.push('/reference/hooks')
            onClose()
          },
        },
        {
          id: 'action-examples',
          label: 'Browse Examples',
          description: 'View interactive examples',
          category: 'Quick Actions',
          icon: <Sparkles className="w-4 h-4" />,
          shortcut: ['E'],
          onSelect: () => {
            router.push('/examples')
            onClose()
          },
        }
      )
    }

    return items
  }, [search, recentPages, router, onClose])
}

// Search trigger button component
function SearchTriggerButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      aria-label="Search documentation (⌘K)"
    >
      <Search className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
      <span className="text-neutral-600 dark:text-neutral-400">Search...</span>
      <kbd className="ml-auto text-xs px-1.5 py-0.5 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
        ⌘K
      </kbd>
    </button>
  )
}

// Command palette overlay component
function CommandPaletteOverlay({
  search,
  onSearchChange,
  onClose,
  commandItems,
}: {
  search: string
  onSearchChange: (value: string) => void
  onClose: () => void
  commandItems: CommandItem[]
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Command Palette */}
      <div
        className="fixed inset-0 z-[70] flex items-start justify-center pt-[20vh]"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
      >
        <div className="bg-white dark:bg-neutral-950 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl mx-4 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <Search className="w-5 h-5 text-neutral-600 dark:text-neutral-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search documentation..."
              className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onClose()
                }
              }}
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <SearchResults commandItems={commandItems} />

          <CommandPaletteFooter resultsCount={commandItems.length} />
        </div>
      </div>
    </>
  )
}

// Search results component
function SearchResults({ commandItems }: { commandItems: CommandItem[] }) {
  if (commandItems.length === 0) {
    return (
      <div className="max-h-[60vh] overflow-y-auto scrollbar-hide p-2">
        <div className="py-12 text-center text-neutral-600 dark:text-neutral-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No results found</p>
          <p className="text-xs mt-1 opacity-60">Try a different search term</p>
        </div>
      </div>
    )
  }

  const groupedItems = commandItems.reduce(
    (acc, item) => {
      const cat = item.category || 'Other'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    },
    {} as Record<string, CommandItem[]>
  )

  return (
    <div className="max-h-[60vh] overflow-y-auto scrollbar-hide p-2">
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <div className="px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              {category}
            </div>
            <div className="space-y-1">
              {items.map((item) => (
                <CommandItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Individual command item component
function CommandItem({ item }: { item: CommandItem }) {
  return (
    <button
      onClick={item.onSelect}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
    >
      {item.icon && (
        <div className="flex-shrink-0 text-neutral-600 dark:text-neutral-400">
          {item.icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{item.label}</div>
        {item.description && (
          <div className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
            {item.description}
          </div>
        )}
      </div>
      {item.shortcut && (
        <div className="flex gap-1 flex-shrink-0">
          {item.shortcut.map((key, i) => (
            <kbd
              key={i}
              className="px-1.5 py-0.5 text-xs rounded bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
            >
              {key}
            </kbd>
          ))}
        </div>
      )}
    </button>
  )
}

// Command palette footer component
function CommandPaletteFooter({ resultsCount }: { resultsCount: number }) {
  return (
    <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
      <div className="flex gap-4">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
            ↑↓
          </kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
            ↵
          </kbd>
          Select
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
            esc
          </kbd>
          Close
        </span>
      </div>
      <div className="font-medium">
        {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
      </div>
    </div>
  )
}

// Helper to get category icon
function getCategoryIcon(category: string): React.ReactNode {
  switch (category) {
    case 'Components':
      return <Box className="w-4 h-4" />
    case 'Hooks':
      return <Zap className="w-4 h-4" />
    case 'Examples':
      return <Sparkles className="w-4 h-4" />
    case 'Cookbook':
      return <BookOpen className="w-4 h-4" />
    case 'Guides':
      return <FileText className="w-4 h-4" />
    case 'Features':
      return <Code className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

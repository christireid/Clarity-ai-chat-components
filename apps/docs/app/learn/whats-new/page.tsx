import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "What's New | Clarity Chat",
  description:
    'Latest updates to Clarity Chat documentation, new features, and improvements.',
}

export default function WhatsNewPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">What&apos;s New</h1>
        <p className="text-xl text-muted-foreground">
          Latest updates to Clarity Chat documentation, new features, and
          improvements.
        </p>
      </div>

      <section className="mb-12">
        <div className="border-l-4 border-brand-500 pl-4 mb-6">
          <h2 className="text-2xl font-semibold mb-2">December 2025</h2>
          <p className="text-sm text-muted-foreground">
            Documentation Enhancement Release
          </p>
        </div>

        <div className="space-y-8">
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                NEW
              </span>
              <h3 className="text-xl font-semibold">
                New Hook Reference Pages
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Added comprehensive documentation for 7 hooks that were previously
              undocumented:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <Link
                href="/reference/hooks/use-memory-context"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-green-500">+</span>
                <div>
                  <div className="font-medium">useMemoryContext</div>
                  <div className="text-xs text-muted-foreground">
                    Memory operations hook
                  </div>
                </div>
              </Link>
              <Link
                href="/reference/hooks/use-clarity-chat-with-tools"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-green-500">+</span>
                <div>
                  <div className="font-medium">useClarityChatWithTools</div>
                  <div className="text-xs text-muted-foreground">
                    Tool integration hook
                  </div>
                </div>
              </Link>
              <Link
                href="/reference/hooks/use-indexed-db"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-green-500">+</span>
                <div>
                  <div className="font-medium">useIndexedDB</div>
                  <div className="text-xs text-muted-foreground">
                    IndexedDB persistence
                  </div>
                </div>
              </Link>
              <Link
                href="/reference/hooks/use-embeddings"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-green-500">+</span>
                <div>
                  <div className="font-medium">useEmbeddings</div>
                  <div className="text-xs text-muted-foreground">
                    Embedding generation
                  </div>
                </div>
              </Link>
              <Link
                href="/reference/hooks/use-design-tokens"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-green-500">+</span>
                <div>
                  <div className="font-medium">useDesignTokens</div>
                  <div className="text-xs text-muted-foreground">
                    Design system tokens
                  </div>
                </div>
              </Link>
              <Link
                href="/reference/hooks/use-command-palette"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-green-500">+</span>
                <div>
                  <div className="font-medium">useCommandPalette</div>
                  <div className="text-xs text-muted-foreground">
                    Command palette state
                  </div>
                </div>
              </Link>
              <Link
                href="/reference/hooks/use-dashboard-data"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-green-500">+</span>
                <div>
                  <div className="font-medium">useDashboardData</div>
                  <div className="text-xs text-muted-foreground">
                    Dashboard data fetching
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                NEW
              </span>
              <h3 className="text-xl font-semibold">New Component Reference</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Added documentation for the MemoryProvider context component:
            </p>
            <Link
              href="/reference/components/memory-provider"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors w-fit"
            >
              <span className="text-green-500">+</span>
              <div>
                <div className="font-medium">MemoryProvider</div>
                <div className="text-xs text-muted-foreground">
                  Memory context provider for AI memory operations
                </div>
              </div>
            </Link>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                IMPROVED
              </span>
              <h3 className="text-xl font-semibold">Navigation Improvements</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Enhanced documentation navigation with better organization:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>
                  New &quot;Memory &amp; Context&quot; section in Reference for
                  memory-related hooks
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>
                  New &quot;Providers&quot; section for context provider
                  components
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>
                  Consolidated getting-started paths to single canonical
                  location
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>
                  Fixed broken internal links throughout documentation
                </span>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                CLEANUP
              </span>
              <h3 className="text-xl font-semibold">Repository Cleanup</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Archived 99 obsolete documentation files to reduce clutter:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>
                  Moved 61 status reports to{' '}
                  <code className="bg-muted px-1 rounded">
                    .archive/status-reports/
                  </code>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>
                  Moved 38 implementation notes to{' '}
                  <code className="bg-muted px-1 rounded">
                    .archive/implementation-notes/
                  </code>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>
                  Reduced root directory from 103 to 5 essential markdown files
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/learn/quick-start"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Quick Start</h3>
            <p className="text-sm text-muted-foreground">
              Get up and running in 5 minutes.
            </p>
          </Link>
          <Link
            href="/reference/hooks"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Hooks Reference</h3>
            <p className="text-sm text-muted-foreground">
              Complete API reference for all hooks.
            </p>
          </Link>
          <Link
            href="/cookbook"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Cookbook</h3>
            <p className="text-sm text-muted-foreground">
              Ready-to-use recipes and patterns.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}

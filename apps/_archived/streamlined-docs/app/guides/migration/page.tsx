import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Migration Guides | Clarity Chat',
  description: 'Complete migration resources for upgrading Clarity Chat between major versions',
}

export default function MigrationGuidesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Migration Guides</h1>
        <p className="text-lg text-muted-foreground">
          Complete migration resources for Clarity Chat version upgrades with automated tools,
          comprehensive testing guides, and rollback plans.
        </p>
      </div>

      {/* v1 to v2 Migration Card */}
      <div className="mb-8 overflow-hidden rounded-lg border bg-card">
        <div className="border-b bg-muted/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">v1.x → v2.0 Migration</h2>
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-500">
              Latest
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Major architecture improvement with 60-92% bundle size reduction
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 text-2xl font-bold text-green-500">60-92%</div>
              <div className="text-sm text-muted-foreground">Bundle Size Reduction</div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 text-2xl font-bold text-blue-500">10-30min</div>
              <div className="text-sm text-muted-foreground">Average Migration Time</div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 text-2xl font-bold text-purple-500">95%</div>
              <div className="text-sm text-muted-foreground">Automated with Codemod</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 font-semibold">What&apos;s Included</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                <span>Complete breaking changes list with before/after examples</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                <span>Automated codemod script for code transformation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                <span>Step-by-step migration process with validation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                <span>Comprehensive testing guide and checklist</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                <span>Rollback plan if issues arise</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-500">✓</span>
                <span>Deprecation warnings and replacements</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/guides/migration/v1-to-v2"
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              View Migration Guide
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <a
              href="https://raw.githubusercontent.com/christireid/Clarity-ai-chat-components/main/scripts/migrate-v1-to-v2.js"
              download
              className="inline-flex items-center rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Download Codemod Script
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </a>
            <Link
              href="/guides/migration/testing"
              className="inline-flex items-center rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Testing Guide
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-8 rounded-lg border bg-muted/30 p-6">
        <h2 className="mb-4 text-xl font-semibold">Quick Start</h2>
        <ol className="space-y-4 text-sm">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            <div>
              <div className="font-medium">Review the Migration Guide</div>
              <p className="text-muted-foreground">
                Understand what&apos;s changing and why
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </span>
            <div>
              <div className="font-medium">Run Automated Migration</div>
              <code className="mt-1 block rounded bg-muted p-2 text-xs">
                node migrate-v1-to-v2.js src/ --dry-run
              </code>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </span>
            <div>
              <div className="font-medium">Install Peer Dependencies</div>
              <code className="mt-1 block rounded bg-muted p-2 text-xs">
                npm install @clarity-chat/react@2.0.0 framer-motion lucide-react zod
              </code>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              4
            </span>
            <div>
              <div className="font-medium">Test Thoroughly</div>
              <code className="mt-1 block rounded bg-muted p-2 text-xs">
                npm run typecheck && npm test && npm run build
              </code>
            </div>
          </li>
        </ol>
      </div>

      {/* Additional Resources */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-3 font-semibold">Migration Checklist</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Printable checklist for tracking migration progress across your team
          </p>
          <a
            href="/guides/migration/MIGRATION_CHECKLIST.md"
            download
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Download Checklist
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </a>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-3 font-semibold">Need Help?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Get support from the community or report migration issues
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="https://github.com/christireid/Clarity-ai-chat-components/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              GitHub Issues
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <a
              href="https://clarity-chat.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Documentation
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Preview */}
      <div className="mt-8 rounded-lg border bg-muted/30 p-6">
        <h2 className="mb-4 text-xl font-semibold">Frequently Asked Questions</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium">Do I need to change any code?</h4>
            <p className="text-muted-foreground">
              The codemod handles 90%+ of changes automatically. You&apos;ll mainly need to
              install peer dependencies and verify everything works.
            </p>
          </div>
          <div>
            <h4 className="font-medium">How long does migration take?</h4>
            <p className="text-muted-foreground">
              10-30 minutes for most projects, including running the codemod, installing
              dependencies, and basic testing.
            </p>
          </div>
          <div>
            <h4 className="font-medium">What if something breaks?</h4>
            <p className="text-muted-foreground">
              The guide includes a comprehensive rollback plan. You can easily revert to v1.x
              if needed.
            </p>
          </div>
        </div>
        <Link
          href="/guides/migration/v1-to-v2#faq"
          className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          View all FAQs
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}

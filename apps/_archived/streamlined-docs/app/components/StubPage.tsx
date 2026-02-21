import Link from 'next/link'
import { Clock, AlertCircle, ArrowLeft, BookOpen } from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

export interface StubPageProps {
  /** Title of the planned page */
  title: string
  /** Brief description of what this page will contain */
  description: string
  /** Category of the page (e.g., "API Reference", "Cookbook", "Guide") */
  category: string
  /** Estimated availability date (e.g., "Q1 2026", "February 2026") */
  estimatedDate: string
  /** Related pages that already exist */
  relatedLinks?: Array<{
    title: string
    href: string
    description?: string
  }>
  /** Priority level for completion */
  priority?: 'high' | 'medium' | 'low'
}

// ============================================================================
// Component
// ============================================================================

export default function StubPage({
  title,
  description,
  category,
  estimatedDate,
  relatedLinks = [],
  priority = 'medium',
}: StubPageProps) {
  const priorityColors = {
    high: 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400',
    medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400',
    low: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400',
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Main Content */}
        <div className="bg-muted/50 border border-border rounded-lg p-8 mb-8">
          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            {category}
          </div>

          {/* Coming Soon Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <p className="text-lg text-muted-foreground">Coming Soon</p>
            </div>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-base leading-relaxed">{description}</p>
          </div>

          {/* Priority & Timeline */}
          <div className="flex flex-wrap gap-4 items-center">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border ${priorityColors[priority]}`}
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {priority === 'high' && 'High Priority'}
                {priority === 'medium' && 'Medium Priority'}
                {priority === 'low' && 'Planned'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Estimated: <span className="font-medium">{estimatedDate}</span>
            </div>
          </div>
        </div>

        {/* Related Content */}
        {relatedLinks.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Related Content</h2>
            <p className="text-sm text-muted-foreground mb-4">
              While this page is being developed, you might find these resources helpful:
            </p>
            <div className="space-y-3">
              {relatedLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="block p-4 rounded-md border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {link.title}
                      </h3>
                      {link.description && (
                        <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                      )}
                    </div>
                    <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transform rotate-180 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/20 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Looking for something specific?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you need this documentation urgently, please let us know on{' '}
            <a
              href="https://github.com/your-org/clarity-chat/discussions"
              className="text-primary hover:underline"
            >
              GitHub Discussions
            </a>{' '}
            or{' '}
            <a href="https://github.com/christireid/Clarity-ai-chat-components/discussions" className="text-primary hover:underline">
              GitHub Discussions
            </a>
            . Community feedback helps us prioritize documentation development.
          </p>
        </div>
      </div>
    </div>
  )
}

StubPage.displayName = 'StubPage'

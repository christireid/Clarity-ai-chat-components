'use client'

/**
 * DocPage - Standard page layout for documentation
 *
 * Features:
 * - Consistent page structure
 * - Header with breadcrumbs
 * - Table of contents sidebar
 * - Footer with navigation
 * - Responsive layout
 * - Dark mode support
 * - Fully accessible
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Edit, Github } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DocPageProps {
  /** Page title */
  title: string
  /** Page description */
  description?: string
  /** Breadcrumb items */
  breadcrumbs?: Array<{ label: string; href: string }>
  /** Main content */
  children: React.ReactNode
  /** Table of contents (rendered in sidebar) */
  tableOfContents?: React.ReactNode
  /** Previous page link */
  previousPage?: { title: string; href: string }
  /** Next page link */
  nextPage?: { title: string; href: string }
  /** Edit on GitHub URL */
  editUrl?: string
  /** Additional CSS classes */
  className?: string
  /** Show last updated date */
  lastUpdated?: Date
  /** Contributors */
  contributors?: Array<{ name: string; avatar?: string }>
}

export function DocPage({
  title,
  description,
  breadcrumbs,
  children,
  tableOfContents,
  previousPage,
  nextPage,
  editUrl,
  className,
  lastUpdated,
  contributors,
}: DocPageProps) {
  return (
    <div className={cn('min-h-screen', className)}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={crumb.href} className="flex items-center gap-2">
                      {index > 0 && (
                        <span className="text-border" aria-hidden="true">/</span>
                      )}
                      {index === breadcrumbs.length - 1 ? (
                        <span className="text-foreground font-medium" aria-current="page">
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className="hover:text-brand-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded px-1 -mx-1"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Page header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
              {description && (
                <p className="text-lg text-muted-foreground max-w-3xl">
                  {description}
                </p>
              )}
            </motion.header>

            {/* Page content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="prose prose-neutral dark:prose-invert max-w-none"
            >
              {children}
            </motion.article>

            {/* Page footer */}
            <motion.footer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-12 pt-8 border-t border-border/50"
            >
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
                {lastUpdated && (
                  <div>
                    Last updated:{' '}
                    <time dateTime={lastUpdated.toISOString()}>
                      {lastUpdated.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                )}
                {editUrl && (
                  <a
                    href={editUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-brand-500 transition-colors"
                  >
                    <Edit className="w-4 h-4" aria-hidden="true" />
                    Edit this page
                  </a>
                )}
                {contributors && contributors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span>Contributors:</span>
                    <div className="flex -space-x-2">
                      {contributors.map((contributor, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium"
                          title={contributor.name}
                        >
                          {contributor.avatar ? (
                            <img
                              src={contributor.avatar}
                              alt={contributor.name}
                              className="w-full h-full rounded-full"
                            />
                          ) : (
                            contributor.name.charAt(0).toUpperCase()
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              {(previousPage || nextPage) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {previousPage && (
                    <Link
                      href={previousPage.href}
                      className={cn(
                        'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                        'hover:border-brand-500/30 hover:shadow-sm transition-all',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                      )}
                    >
                      <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground mb-1">Previous</div>
                        <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                          {previousPage.title}
                        </div>
                      </div>
                    </Link>
                  )}
                  {nextPage && (
                    <Link
                      href={nextPage.href}
                      className={cn(
                        'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                        'hover:border-brand-500/30 hover:shadow-sm transition-all',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                        !previousPage && 'sm:col-start-2'
                      )}
                    >
                      <div className="flex-1 min-w-0 text-right">
                        <div className="text-xs text-muted-foreground mb-1">Next</div>
                        <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                          {nextPage.title}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              )}
            </motion.footer>
          </main>

          {/* Table of contents sidebar (desktop only) */}
          {tableOfContents && (
            <aside className="hidden xl:block w-64 shrink-0">
              {tableOfContents}
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

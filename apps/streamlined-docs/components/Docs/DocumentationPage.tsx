import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { TableOfContents, type TocItem } from './TableOfContents'

/**
 * Badge Configuration
 */
export interface Badge {
  label: string
  variant: 'stable' | 'beta' | 'deprecated' | 'experimental' | 'new'
}

/**
 * Feature Highlight
 */
export interface FeatureHighlight {
  icon: LucideIcon
  label: string
  description: string
}

/**
 * Related API Link
 */
export interface RelatedAPI {
  name: string
  type: 'component' | 'hook' | 'utility'
  description: string
  href: string
}

/**
 * Footer Navigation Link
 */
export interface FooterLink {
  label: string
  href: string
  direction: 'previous' | 'next'
}

/**
 * DocumentationPage - Main template for component/hook documentation pages
 *
 * Provides consistent layout and structure for all documentation pages:
 * - Animated header with icon, badges, and description
 * - Feature highlights grid
 * - Main content area with two-column layout
 * - Sticky table of contents sidebar
 * - Related APIs section
 * - Footer navigation (previous/next)
 *
 * @example
 * ```tsx
 * <DocumentationPage
 *   title="ChatWindow"
 *   description="A mid-level composable chat window component..."
 *   icon={Layout}
 *   badges={[{ label: 'Stable', variant: 'stable' }]}
 *   packageName="@clarity-chat/react"
 *   features={[...]}
 *   tableOfContents={[...]}
 *   relatedAPIs={[...]}
 *   footerNavigation={[...]}
 * >
 *   <Section id="overview" title="Overview">...</Section>
 * </DocumentationPage>
 * ```
 */
export interface DocumentationPageProps {
  // Header
  title: string
  description: string
  icon: LucideIcon
  badges: Badge[]
  packageName: string

  // Features (optional)
  features?: FeatureHighlight[]

  // Content
  children: React.ReactNode

  // Navigation
  tableOfContents: TocItem[]
  relatedAPIs?: RelatedAPI[]
  footerNavigation?: FooterLink[]

  // ISR Configuration
  revalidate?: number
}

const badgeStyles: Record<Badge['variant'], string> = {
  stable: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  beta: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  deprecated: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  experimental: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  new: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
}

const apiTypeStyles: Record<RelatedAPI['type'], string> = {
  hook: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  component: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  utility: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
}

export function DocumentationPage({
  title,
  description,
  icon: Icon,
  badges,
  packageName,
  features,
  children,
  tableOfContents,
  relatedAPIs,
  footerNavigation,
}: DocumentationPageProps) {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {badges.map((badge) => (
                      <span
                        key={badge.label}
                        className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded-full border',
                          badgeStyles[badge.variant]
                        )}
                      >
                        {badge.label}
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground">
                      {packageName}
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                {title}
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                {description}
              </p>
            </motion.header>

            {/* Feature highlights */}
            {features && features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: durations.slow,
                  delay: 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {features.map(({ icon: FeatureIcon, label, description }) => (
                  <div
                    key={label}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <FeatureIcon
                      className="w-5 h-5 text-brand-500 mb-2"
                      aria-hidden="true"
                    />
                    <p className="font-medium text-foreground text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Main content sections */}
            {children}

            {/* Related APIs */}
            {relatedAPIs && relatedAPIs.length > 0 && (
              <section id="related" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Related
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {relatedAPIs.map((api) => (
                    <Link
                      key={api.name}
                      href={api.href}
                      className={cn(
                        'group p-4 rounded-lg border border-border/50',
                        'hover:border-brand-500/30 hover:shadow-sm transition-all',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {api.name}
                        </span>
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            apiTypeStyles[api.type]
                          )}
                        >
                          {api.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {api.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Footer Navigation */}
            {footerNavigation && footerNavigation.length > 0 && (
              <div className="border-t border-border/50 pt-8 mt-12">
                <div className="grid gap-4 sm:grid-cols-2">
                  {footerNavigation.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                        'hover:border-brand-500/30 hover:shadow-sm transition-all',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                        link.direction === 'next' && 'text-right'
                      )}
                    >
                      {link.direction === 'previous' && (
                        <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                      )}
                      <div className={link.direction === 'next' ? 'flex-1' : ''}>
                        <div className="text-xs text-muted-foreground mb-1">
                          {link.direction === 'previous' ? 'Previous' : 'Next'}
                        </div>
                        <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {link.label}
                        </div>
                      </div>
                      {link.direction === 'next' && (
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents items={tableOfContents} />
          </aside>
        </div>
      </div>
    </div>
  )
}

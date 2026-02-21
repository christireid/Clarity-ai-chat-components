'use client'

/**
 * RelatedAPIs - Display links to related documentation
 *
 * Features:
 * - Grouped by category
 * - Visual icons for API types
 * - Hover effects
 * - Responsive grid layout
 * - Dark mode support
 * - Fully accessible
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Box, Zap, Wrench, FileCode } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RelatedAPI {
  /** API name */
  name: string
  /** URL slug */
  slug: string
  /** API type */
  type: 'component' | 'hook' | 'utility' | 'service'
  /** Short description */
  description?: string
}

export interface RelatedAPIsProps {
  /** Related APIs to display */
  apis: RelatedAPI[]
  /** Section title */
  title?: string
  /** Additional CSS classes */
  className?: string
  /** Group by type */
  groupByType?: boolean
}

const typeIcons = {
  component: Box,
  hook: Zap,
  utility: Wrench,
  service: FileCode,
}

const typeColors = {
  component: 'text-blue-600 dark:text-blue-400',
  hook: 'text-purple-600 dark:text-purple-400',
  utility: 'text-green-600 dark:text-green-400',
  service: 'text-orange-600 dark:text-orange-400',
}

export function RelatedAPIs({
  apis,
  title = 'Related APIs',
  className,
  groupByType = false,
}: RelatedAPIsProps) {
  if (apis.length === 0) {
    return null
  }

  const groupedApis = React.useMemo(() => {
    if (!groupByType) {
      return { all: apis }
    }

    return apis.reduce((acc, api) => {
      if (!acc[api.type]) {
        acc[api.type] = []
      }
      acc[api.type].push(api)
      return acc
    }, {} as Record<string, RelatedAPI[]>)
  }, [apis, groupByType])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('space-y-4', className)}
    >
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>

      {Object.entries(groupedApis).map(([type, typeApis]) => (
        <div key={type} className="space-y-2">
          {groupByType && type !== 'all' && (
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-6 mb-3">
              {type}s
            </h3>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {typeApis.map((api, index) => {
              const Icon = typeIcons[api.type]

              return (
                <motion.div
                  key={api.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <Link
                    href={`/api/reference/${api.slug}`}
                    className={cn(
                      'group flex items-start gap-3 p-4 rounded-lg',
                      'border border-border/50 bg-card',
                      'hover:border-brand-500/30 hover:shadow-sm',
                      'transition-all duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
                    )}
                  >
                    <div className={cn(
                      'p-2 rounded-md bg-muted',
                      'group-hover:bg-muted/80 transition-colors'
                    )}>
                      <Icon className={cn('w-4 h-4', typeColors[api.type])} aria-hidden="true" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {api.name}
                        </h4>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" aria-hidden="true" />
                      </div>
                      {api.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                          {api.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      ))}
    </motion.section>
  )
}

/**
 * RelatedAPIsCompact - Compact list of related APIs
 */
export interface RelatedAPIsCompactProps {
  /** Related APIs to display */
  apis: RelatedAPI[]
  /** Section title */
  title?: string
  /** Additional CSS classes */
  className?: string
}

export function RelatedAPIsCompact({
  apis,
  title = 'See also',
  className,
}: RelatedAPIsCompactProps) {
  if (apis.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-1">
        {apis.map((api) => {
          const Icon = typeIcons[api.type]

          return (
            <li key={api.slug}>
              <Link
                href={`/api/reference/${api.slug}`}
                className="group inline-flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="group-hover:underline">{api.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

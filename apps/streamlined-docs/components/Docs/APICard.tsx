'use client'

/**
 * APICard - Display API metadata in interactive cards
 *
 * Features:
 * - Displays API name, type, description
 * - Visual badges for API type (component, hook, utility)
 * - Hover effects and transitions
 * - Links to detailed documentation
 * - Dark mode support
 * - Fully accessible with ARIA labels
 * - Responsive design
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, FileCode, Zap, Box, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface APIMetadata {
  /** API identifier (used in URL) */
  slug: string
  /** Display name */
  name: string
  /** API type */
  type: 'component' | 'hook' | 'utility' | 'service' | 'primitive'
  /** Short description */
  description: string
  /** Is this API new? */
  isNew?: boolean
  /** Is this API experimental? */
  isExperimental?: boolean
  /** Is this API deprecated? */
  isDeprecated?: boolean
  /** Category for grouping */
  category?: string
  /** Tags for filtering */
  tags?: string[]
}

export interface APICardProps {
  /** API metadata to display */
  api: APIMetadata
  /** Additional CSS classes */
  className?: string
  /** Click handler (optional, defaults to navigation) */
  onClick?: () => void
  /** Show full description */
  showFullDescription?: boolean
  /** Animation delay for stagger effect */
  animationDelay?: number
}

const typeIcons = {
  component: Box,
  hook: Zap,
  utility: Wrench,
  service: FileCode,
  primitive: FileCode,
}

const typeColors = {
  component: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  hook: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  utility: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  service: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  primitive: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800',
}

export function APICard({
  api,
  className,
  onClick,
  showFullDescription = false,
  animationDelay = 0,
}: APICardProps) {
  const Icon = typeIcons[api.type]

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: animationDelay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'group relative rounded-xl border bg-card text-card-foreground',
        'shadow-sm hover:shadow-lg transition-all duration-300',
        'border-border/50 hover:border-brand-500/30',
        'dark:shadow-glass-dark',
        api.isDeprecated && 'opacity-60',
        className
      )}
    >
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative p-6 space-y-4">
        {/* Header with icon and badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2.5 rounded-lg border',
              typeColors[api.type]
            )}>
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {api.name}
              </h3>
              {api.category && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {api.category}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {api.isNew && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                New
              </span>
            )}
            {api.isExperimental && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Beta
              </span>
            )}
            {api.isDeprecated && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                Deprecated
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className={cn(
          'text-sm text-muted-foreground leading-relaxed',
          !showFullDescription && 'line-clamp-2'
        )}>
          {api.description}
        </p>

        {/* Tags */}
        {api.tags && api.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {api.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs font-medium rounded-md bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {api.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs font-medium text-muted-foreground">
                +{api.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer with link */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
            View documentation
          </span>
          <ArrowRight className="w-4 h-4 text-brand-500 transform group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  )

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-xl"
        aria-label={`View ${api.name} documentation`}
      >
        {card}
      </button>
    )
  }

  return (
    <Link
      href={`/api/reference/${api.slug}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-xl"
      aria-label={`View ${api.name} documentation`}
    >
      {card}
    </Link>
  )
}

/**
 * APICardGrid - Display a grid of API cards with responsive layout
 */
export interface APICardGridProps {
  /** APIs to display */
  apis: APIMetadata[]
  /** Additional CSS classes */
  className?: string
  /** Show full descriptions */
  showFullDescriptions?: boolean
  /** Filter by type */
  filterType?: APIMetadata['type']
  /** Filter by category */
  filterCategory?: string
}

export function APICardGrid({
  apis,
  className,
  showFullDescriptions = false,
  filterType,
  filterCategory,
}: APICardGridProps) {
  const filteredApis = React.useMemo(() => {
    let filtered = apis

    if (filterType) {
      filtered = filtered.filter((api) => api.type === filterType)
    }

    if (filterCategory) {
      filtered = filtered.filter((api) => api.category === filterCategory)
    }

    return filtered
  }, [apis, filterType, filterCategory])

  if (filteredApis.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No APIs found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid gap-6',
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {filteredApis.map((api, index) => (
        <APICard
          key={api.slug}
          api={api}
          showFullDescription={showFullDescriptions}
          animationDelay={index * 0.05}
        />
      ))}
    </div>
  )
}

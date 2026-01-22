'use client'

import { durations } from '@/lib/animations'
import { useState } from 'react'
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  Link as LinkIcon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface Source {
  url: string
  title: string
  score?: number
  snippet?: string
  type?: 'documentation' | 'guide' | 'api' | 'example' | 'other'
}

export interface SourceCardProps {
  source: Source
  index?: number
  expanded?: boolean
  onToggle?: () => void
  className?: string
  variant?: 'default' | 'compact'
}

export function SourceCard({
  source,
  index,
  expanded = false,
  onToggle,
  className,
  variant = 'default',
}: SourceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get icon based on source type
  const Icon = getSourceIcon(source.type)

  // Get relevance label
  const relevanceLabel = source.score ? getRelevanceLabel(source.score) : null
  const relevanceColor = source.score ? getRelevanceColor(source.score) : null

  if (variant === 'compact') {
    return (
      <motion.a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: durations.moderate,
          delay: index ? index * 0.05 : 0,
        }}
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md',
          'bg-secondary/50 hover:bg-secondary',
          'transition-all duration-200',
          'group',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </motion.div>
        <span className="text-sm truncate flex-1">{source.title}</span>
        {source.score && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded',
              relevanceColor
            )}
          >
            {Math.round(source.score * 100)}%
          </motion.span>
        )}
        <motion.div
          whileHover={{ x: 2 }}
          transition={{ duration: durations.normal }}
        >
          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </motion.div>
      </motion.a>
    )
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: durations.moderate,
        delay: index ? index * 0.05 : 0,
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        'transition-all duration-200',
        isHovered && 'shadow-md',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className={cn(
            'p-2 rounded-md',
            'bg-primary/10 text-primary',
            'flex-shrink-0'
          )}
        >
          <Icon className="w-4 h-4" />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'text-sm font-medium hover:underline',
                'flex items-center gap-1.5 group'
              )}
            >
              <span className="truncate">{source.title}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>

            {/* Index badge */}
            {index !== undefined && (
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded flex-shrink-0">
                #{index + 1}
              </span>
            )}
          </div>

          {/* URL */}
          <div className="text-xs text-muted-foreground mt-1 overflow-hidden">
            <span className="block truncate max-w-full" title={source.url}>
              {source.url}
            </span>
          </div>

          {/* Relevance score */}
          {source.score && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${source.score * 100}%` }}
                  transition={{ duration: durations.slow, delay: 0.1 }}
                  className={cn('h-full', relevanceColor)}
                />
              </div>
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded',
                  relevanceColor
                )}
              >
                {relevanceLabel}
              </span>
            </div>
          )}
        </div>

        {/* Expand/collapse button */}
        {source.snippet && onToggle && (
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'p-1.5 rounded-md',
              'hover:bg-accent hover:text-accent-foreground',
              'transition-colors flex-shrink-0'
            )}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: durations.normal }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.button>
        )}
      </div>

      {/* Expandable snippet */}
      <AnimatePresence>
        {expanded && source.snippet && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: durations.normal }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md border-l-2 border-primary">
                {source.snippet}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * Get icon based on source type
 */
function getSourceIcon(type?: string) {
  switch (type) {
    case 'documentation':
      return BookOpen
    case 'guide':
      return FileText
    case 'api':
      return FileText
    case 'example':
      return FileText
    default:
      return LinkIcon
  }
}

/**
 * Get relevance label from score
 */
function getRelevanceLabel(score: number): string {
  if (score >= 0.9) return 'Excellent'
  if (score >= 0.8) return 'Very Good'
  if (score >= 0.7) return 'Good'
  if (score >= 0.6) return 'Fair'
  return 'Low'
}

/**
 * Get color class for relevance score
 */
function getRelevanceColor(score: number): string {
  if (score >= 0.9) return 'bg-green-500/20 text-green-700 dark:text-green-300'
  if (score >= 0.8) return 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
  if (score >= 0.7)
    return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
  if (score >= 0.6)
    return 'bg-orange-500/20 text-orange-700 dark:text-orange-300'
  return 'bg-red-500/20 text-red-700 dark:text-red-300'
}

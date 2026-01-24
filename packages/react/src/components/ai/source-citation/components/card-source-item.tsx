/**
 * Card source item component
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  DURATION_SECONDS as durations,
  EASING_FRAMER,
  STAGGER_TIMING,
} from '../../../../animations/constants'
import { SIZE_CONFIG } from '../constants'
import { extractDomain, formatDate } from '../utils'
import { ExternalLinkIcon } from '../icons'
import { Favicon } from './favicon'
import { ConfidenceBadge } from './confidence-badge'
import type { Source, SourceCitationSize } from '../types'

export interface CardSourceItemProps {
  source: Source
  index: number
  size: SourceCitationSize
  showFavicons: boolean
  showConfidence: boolean
  showDomain: boolean
  showDate: boolean
  showAuthor: boolean
  onClick?: () => void
  openInNewTab: boolean
  prefersReducedMotion: boolean
  className?: string
}

export const CardSourceItem: React.FC<CardSourceItemProps> = ({
  source,
  index,
  size,
  showFavicons,
  showConfidence,
  showDomain,
  showDate,
  showAuthor,
  onClick,
  openInNewTab,
  prefersReducedMotion,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const sizeConfig = SIZE_CONFIG[size]
  const domain = source.domain || extractDomain(source.url)
  const hasDetails = source.snippet && source.snippet.length > 100

  const handleClick = (e: React.MouseEvent) => {
    onClick?.()
  }

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : durations.normal,
        ease: EASING_FRAMER.out,
        delay: index * STAGGER_TIMING.fast,
      }}
      viewport={{ once: true }}
      className={cn(
        'group relative rounded-lg border border-border/60 bg-card',
        'hover:border-primary/40 hover:shadow-sm transition-all duration-150',
        'focus-within:ring-2 focus-within:ring-ring/50 focus-within:ring-offset-1',
        sizeConfig.padding,
        className
      )}
      onClick={handleClick}
      role="article"
      aria-label={`Source ${index + 1}: ${source.title}`}
    >
      {/* Header */}
      <div className={cn('flex items-start', sizeConfig.gap)}>
        {/* Citation number */}
        <span
          className={cn(
            'flex-shrink-0 flex items-center justify-center rounded-full',
            'bg-primary/10 text-primary font-semibold',
            size === 'sm' ? 'w-5 h-5 text-[10px]' : size === 'lg' ? 'w-8 h-8 text-sm' : 'w-6 h-6 text-xs'
          )}
        >
          {index + 1}
        </span>

        {/* Favicon */}
        {showFavicons && (
          <Favicon url={source.url} favicon={source.favicon} size={size} />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={source.url}
              target={openInNewTab ? '_blank' : undefined}
              rel={openInNewTab ? 'noopener noreferrer' : undefined}
              onClick={handleLinkClick}
              className={cn(
                sizeConfig.title,
                'text-foreground hover:text-primary truncate',
                'focus:outline-none focus-visible:underline'
              )}
            >
              {source.title}
            </a>

            {showConfidence && source.confidence !== undefined && (
              <ConfidenceBadge confidence={source.confidence} size={size} />
            )}
          </div>

          {/* Meta row */}
          <div className={cn('flex items-center gap-2 mt-0.5', sizeConfig.snippet, 'text-muted-foreground')}>
            {showDomain && <span>{domain}</span>}
            {showDomain && (showDate || showAuthor) && <span aria-hidden="true">-</span>}
            {showDate && source.date && <span>{formatDate(source.date)}</span>}
            {showDate && source.date && showAuthor && source.author && (
              <span aria-hidden="true">-</span>
            )}
            {showAuthor && source.author && <span>{source.author}</span>}
          </div>
        </div>

        {/* External link */}
        <a
          href={source.url}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
          onClick={handleLinkClick}
          className={cn(
            'flex-shrink-0 p-1.5 rounded-md',
            'text-muted-foreground hover:text-primary hover:bg-primary/10',
            'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
          aria-label={`Open ${source.title} in ${openInNewTab ? 'new tab' : 'current tab'}`}
        >
          <ExternalLinkIcon size={sizeConfig.iconSize} />
        </a>
      </div>

      {/* Snippet */}
      {source.snippet && (
        <div className="mt-2">
          <p className={cn(sizeConfig.snippet, 'text-muted-foreground', !isExpanded && 'line-clamp-2')}>
            {source.snippet}
          </p>

          {hasDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className={cn(
                'mt-1 text-primary hover:text-primary/80',
                'text-xs font-medium focus:outline-none focus-visible:underline'
              )}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {/* Metadata */}
      {source.metadata && Object.keys(source.metadata).length > 0 && isExpanded && (
        <div className="mt-3 pt-2 border-t border-border/40">
          <dl className="flex flex-wrap gap-x-4 gap-y-1">
            {Object.entries(source.metadata).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1.5">
                <dt className="text-[10px] text-muted-foreground">{key}:</dt>
                <dd className="text-[10px] font-medium text-foreground">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </motion.div>
  )
}

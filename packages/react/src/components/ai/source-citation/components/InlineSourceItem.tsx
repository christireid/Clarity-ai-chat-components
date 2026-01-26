/**
 * Inline source item component
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  DURATION_SECONDS as durations,
  EASING_FRAMER,
  STAGGER_TIMING,
  ANIMATION_PRESETS,
} from '../../../../animations/constants'
import { SIZE_CONFIG } from '../constants'
import { extractDomain } from '../utils'
import { ExternalLinkIcon } from '../icons'
import { Favicon } from './favicon'
import { ConfidenceBadge } from './ConfidenceBadge'
import type { Source, SourceCitationSize } from '../types'

export interface InlineSourceItemProps {
  source: Source
  index: number
  size: SourceCitationSize
  showFavicons: boolean
  showConfidence: boolean
  expandOnHover: boolean
  onClick?: () => void
  openInNewTab: boolean
  prefersReducedMotion: boolean
  className?: string
}

export const InlineSourceItem: React.FC<InlineSourceItemProps> = ({
  source,
  index,
  size,
  showFavicons,
  showConfidence,
  expandOnHover,
  onClick,
  openInNewTab,
  prefersReducedMotion,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const sizeConfig = SIZE_CONFIG[size]
  const domain = source.domain || extractDomain(source.url)

  const handleClick = (e: React.MouseEvent) => {
    onClick?.()
    if (!openInNewTab) {
      e.preventDefault()
      window.location.href = source.url
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
      if (openInNewTab) {
        window.open(source.url, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = source.url
      }
    }
  }

  return (
    <motion.a
      href={source.url}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...(prefersReducedMotion
        ? ANIMATION_PRESETS.fadeIn
        : ANIMATION_PRESETS.scale)}
      transition={{
        duration: prefersReducedMotion ? 0.1 : durations.fast,
        ease: EASING_FRAMER.out,
        delay: index * STAGGER_TIMING.faster,
      }}
      viewport={{ once: true }}
      className={cn(
        'inline-flex items-center rounded-md border border-border/60',
        'bg-background hover:bg-muted/50 hover:border-primary/40',
        'transition-all duration-150 cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1',
        sizeConfig.gap,
        size === 'sm'
          ? 'px-1.5 py-0.5'
          : size === 'lg'
            ? 'px-3 py-1.5'
            : 'px-2 py-1',
        className
      )}
      role="link"
      aria-label={`Source ${index + 1}: ${source.title} from ${domain}`}
    >
      {/* Citation number */}
      <span
        className={cn(
          'flex-shrink-0 flex items-center justify-center rounded-full',
          'bg-primary/10 text-primary font-semibold',
          size === 'sm'
            ? 'w-4 h-4 text-[9px]'
            : size === 'lg'
              ? 'w-6 h-6 text-xs'
              : 'w-5 h-5 text-[10px]'
        )}
      >
        {index + 1}
      </span>

      {/* Favicon */}
      {showFavicons && (
        <Favicon url={source.url} favicon={source.favicon} size={size} />
      )}

      {/* Title/Domain */}
      <span
        className={cn(
          sizeConfig.title,
          'truncate max-w-[120px] text-foreground'
        )}
      >
        {source.title || domain}
      </span>

      {/* Confidence badge */}
      {showConfidence && source.confidence !== undefined && (
        <ConfidenceBadge confidence={source.confidence} size={size} />
      )}

      {/* External link indicator */}
      <ExternalLinkIcon
        size={sizeConfig.iconSize - 2}
        className="flex-shrink-0 text-muted-foreground"
      />

      {/* Hover tooltip with snippet */}
      {prefersReducedMotion ? (
        expandOnHover &&
        isHovered &&
        source.snippet && (
          <div
            className={cn(
              'absolute z-50 top-full left-0 mt-1.5 p-2.5 rounded-lg',
              'bg-popover border border-border shadow-lg',
              'max-w-xs w-max'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs text-muted-foreground line-clamp-3">
              {source.snippet}
            </p>
          </div>
        )
      ) : (
        <AnimatePresence>
          {expandOnHover && isHovered && source.snippet && (
            <motion.div
              {...ANIMATION_PRESETS.slideUp}
              transition={{ duration: durations.fast }}
              viewport={{ once: true }}
              className={cn(
                'absolute z-50 top-full left-0 mt-1.5 p-2.5 rounded-lg',
                'bg-popover border border-border shadow-lg',
                'max-w-xs w-max'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs text-muted-foreground line-clamp-3">
                {source.snippet}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.a>
  )
}

/**
 * List source item component
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  DURATION_SECONDS as durations,
  EASING_FRAMER,
  STAGGER_TIMING,
} from '../../../../animations/constants'
import { SIZE_CONFIG } from '../constants'
import { extractDomain } from '../utils'
import { ExternalLinkIcon } from '../icons'
import { Favicon } from './favicon'
import { ConfidenceBadge } from './ConfidenceBadge'
import type { Source, SourceCitationSize } from '../types'

export interface ListSourceItemProps {
  source: Source
  index: number
  size: SourceCitationSize
  showFavicons: boolean
  showConfidence: boolean
  showDomain: boolean
  expandOnHover: boolean
  onClick?: () => void
  openInNewTab: boolean
  prefersReducedMotion: boolean
  className?: string
}

export const ListSourceItem: React.FC<ListSourceItemProps> = ({
  source,
  index,
  size,
  showFavicons,
  showConfidence,
  showDomain,
  expandOnHover,
  onClick,
  openInNewTab,
  prefersReducedMotion,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const sizeConfig = SIZE_CONFIG[size]
  const domain = source.domain || extractDomain(source.url)

  return (
    <motion.li
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : durations.fast,
        ease: EASING_FRAMER.out,
        delay: index * STAGGER_TIMING.faster,
      }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative flex items-start py-2 border-b border-border/40 last:border-b-0',
        'hover:bg-muted/30 transition-colors -mx-2 px-2 rounded-md',
        sizeConfig.gap,
        className
      )}
      role="listitem"
    >
      {/* Citation number */}
      <span
        className={cn(
          'flex-shrink-0 flex items-center justify-center rounded-full',
          'bg-primary/10 text-primary font-semibold mt-0.5',
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
        <Favicon
          url={source.url}
          favicon={source.favicon}
          size={size}
          className="mt-0.5"
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={source.url}
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            onClick={() => onClick?.()}
            className={cn(
              sizeConfig.title,
              'text-foreground hover:text-primary truncate',
              'focus:outline-none focus-visible:underline'
            )}
          >
            {source.title}
          </a>

          {showDomain && (
            <span className={cn(sizeConfig.snippet, 'text-muted-foreground')}>
              ({domain})
            </span>
          )}

          {showConfidence && source.confidence !== undefined && (
            <ConfidenceBadge confidence={source.confidence} size={size} />
          )}
        </div>

        {/* Snippet preview */}
        {prefersReducedMotion ? (
          (expandOnHover ? isHovered : true) &&
          source.snippet && (
            <p
              className={cn(
                sizeConfig.snippet,
                'text-muted-foreground mt-0.5 line-clamp-2'
              )}
            >
              {source.snippet}
            </p>
          )
        ) : (
          <AnimatePresence>
            {(expandOnHover ? isHovered : true) && source.snippet && (
              <motion.p
                initial={expandOnHover ? { opacity: 0, height: 0 } : false}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: durations.fast }}
                viewport={{ once: true }}
                className={cn(
                  sizeConfig.snippet,
                  'text-muted-foreground mt-0.5 line-clamp-2'
                )}
              >
                {source.snippet}
              </motion.p>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* External link */}
      <a
        href={source.url}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className={cn(
          'flex-shrink-0 p-1 rounded-md mt-0.5',
          'text-muted-foreground hover:text-primary',
          'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
        aria-label={`Open ${source.title}`}
      >
        <ExternalLinkIcon size={sizeConfig.iconSize - 2} />
      </a>
    </motion.li>
  )
}

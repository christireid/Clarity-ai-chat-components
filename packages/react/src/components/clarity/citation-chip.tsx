'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type { Citation, WebSearchResult } from './types/ai-types'
import { ExternalLink, Globe, FileText, Link2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'

interface CitationChipProps {
  citation?: Citation
  index: number
  title?: string
  url?: string
  variant?: 'default' | 'compact' | 'inline'
  className?: string
}

export function CitationChip({
  citation,
  index,
  title: titleProp,
  url: urlProp,
  variant = 'default',
  className,
}: CitationChipProps) {
  // Support both citation object and direct props
  const url = urlProp || citation?.url || '#'
  const title = titleProp || citation?.title || `Source ${index}`

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) return null // Prevent hydration mismatch for tooltips

  if (variant === 'inline') {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center justify-center w-5 h-5 rounded-full bg-ai-user/20 text-ai-user text-xs font-medium hover:bg-ai-user/30 transition-colors',
                className
              )}
            >
              {index}
            </a>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-medium">{title}</p>
            <p className="text-xs text-muted-foreground truncate">{url}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (variant === 'compact') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary hover:bg-secondary/80 transition-colors text-xs',
          className
        )}
      >
        <span className="w-4 h-4 rounded-full bg-ai-user/20 text-ai-user flex items-center justify-center text-[10px] font-medium">
          {index}
        </span>
        <span className="truncate max-w-[120px]">{title}</span>
      </a>
    )
  }

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors group',
            className
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            {citation?.favicon ? (
              <img
                src={citation.favicon || '/placeholder.svg'}
                alt=""
                className="w-4 h-4 rounded-sm"
              />
            ) : (
              <Globe className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm truncate max-w-[150px]">{title}</span>
          </span>
          <Badge
            variant="outline"
            className="bg-ai-user/10 text-ai-user border-ai-user/30 text-xs px-1.5"
          >
            {index}
          </Badge>
          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            {citation?.favicon ? (
              <img
                src={citation.favicon || '/placeholder.svg'}
                alt=""
                className="w-6 h-6 rounded-sm mt-0.5"
              />
            ) : (
              <Globe className="w-6 h-6 text-muted-foreground mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm line-clamp-2">{title}</p>
              {citation?.domain && (
                <p className="text-xs text-muted-foreground">
                  {citation.domain}
                </p>
              )}
            </div>
          </div>
          {citation?.snippet && (
            <p className="text-xs text-muted-foreground line-clamp-3">
              {citation.snippet}
            </p>
          )}
          <p className="text-xs text-ai-user truncate">{url}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

// Inline citation marker for use within text
export function InlineCitation({
  index,
  url,
  title,
}: {
  index: number
  url: string
  title: string
}) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-ai-user/20 text-ai-user text-[10px] font-medium hover:bg-ai-user/30 transition-colors align-super ml-0.5"
          >
            {index}
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Sources section display
export function SourcesList({
  sources,
  title = 'Sources',
  className,
}: {
  sources: Citation[] | WebSearchResult[]
  title?: string
  className?: string
}) {
  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="text-sm font-medium flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        {title}
      </h4>
      <div className="grid gap-2">
        {sources.map((source, idx) => (
          <SourceCard key={source.id} source={source} index={idx + 1} />
        ))}
      </div>
    </div>
  )
}

interface SourceCardProps {
  source?: Citation | WebSearchResult
  index?: number
  title?: string
  url?: string
  description?: string
  favicon?: string
}

export function SourceCard({
  source,
  index,
  title: titleProp,
  url: urlProp,
  description: descriptionProp,
  favicon: faviconProp,
}: SourceCardProps) {
  const url = urlProp || source?.url || '#'
  const title = titleProp || source?.title || `Source ${index || 1}`
  const snippet = descriptionProp || source?.snippet || ''

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors group"
    >
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-ai-user/10 text-ai-user text-xs font-medium shrink-0">
        {index}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium line-clamp-1 group-hover:text-ai-user transition-colors">
          {title}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
          {snippet}
        </p>
        <p className="text-xs text-ai-user/80 truncate mt-1">{url}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </a>
  )
}

// Link preview card
export function LinkPreview({
  url,
  title,
  description,
  image,
  favicon,
  className,
}: {
  url: string
  title: string
  description?: string
  image?: string
  favicon?: string
  className?: string
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'block rounded-lg border border-border overflow-hidden hover:bg-secondary/30 transition-colors group',
        className
      )}
    >
      {image && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={image || '/placeholder.svg'}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          {favicon ? (
            <img
              src={favicon || '/placeholder.svg'}
              alt=""
              className="w-4 h-4 rounded-sm"
            />
          ) : (
            <Link2 className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground truncate">
            {new URL(url).hostname}
          </span>
        </div>
        <p className="font-medium text-sm line-clamp-2 group-hover:text-ai-user transition-colors">
          {title}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {description}
          </p>
        )}
      </div>
    </a>
  )
}

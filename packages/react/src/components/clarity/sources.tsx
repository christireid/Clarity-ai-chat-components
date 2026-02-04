'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  ExternalLink,
  Globe,
  FileText,
  Book,
  Video,
  ImageIcon,
  ChevronDown,
  ChevronRight,
  Search,
  Star,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Badge } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'

export interface Source {
  id: string
  title: string
  url?: string
  snippet?: string
  type?: 'web' | 'document' | 'article' | 'video' | 'image'
  favicon?: string
  publishedAt?: string
  author?: string
  relevance?: number
  verified?: boolean
}

interface SourcesProps {
  sources: Source[]
  title?: string
  compact?: boolean
  maxVisible?: number
  onSourceClick?: (source: Source) => void
  className?: string
}

export function Sources({
  sources,
  title = 'Sources',
  compact = false,
  maxVisible = 5,
  onSourceClick,
  className,
}: SourcesProps) {
  const [expanded, setExpanded] = React.useState(false)
  const visibleSources = expanded ? sources : sources.slice(0, maxVisible)
  const hasMore = sources.length > maxVisible

  const typeIcons = {
    web: Globe,
    document: FileText,
    article: Book,
    video: Video,
    image: ImageIcon,
  }

  if (compact) {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {sources.map((source, index) => (
          <SourceChip
            key={source.id}
            source={source}
            index={index + 1}
            onClick={() => onSourceClick?.(source)}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {sources.length}
          </Badge>
        </div>
      </div>

      <div className="divide-y divide-border">
        {visibleSources.map((source, index) => {
          const Icon = typeIcons[source.type || 'web']

          return (
            <div
              key={source.id}
              className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onSourceClick?.(source)}
            >
              <div className="flex items-start gap-3">
                {/* Index */}
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium">{index + 1}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {source.favicon ? (
                      <img
                        src={source.favicon || '/placeholder.svg'}
                        alt=""
                        className="w-4 h-4 rounded"
                      />
                    ) : (
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    )}
                    <h4 className="font-medium text-sm truncate">
                      {source.title}
                    </h4>
                    {source.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    )}
                  </div>

                  {source.snippet && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {source.snippet}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {source.url && (
                      <span className="truncate max-w-[200px]">
                        {new URL(source.url).hostname}
                      </span>
                    )}
                    {source.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {source.publishedAt}
                      </span>
                    )}
                    {source.relevance !== undefined && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {source.relevance}%
                      </span>
                    )}
                  </div>
                </div>

                {/* External link */}
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-muted"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-3 text-sm text-muted-foreground hover:bg-muted/50 flex items-center justify-center gap-1"
        >
          {expanded ? (
            <>
              Show less <ChevronDown className="w-4 h-4" />
            </>
          ) : (
            <>
              Show {sources.length - maxVisible} more{' '}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}

// Source Chip (inline citation)
interface SourceChipProps {
  source: Source
  index: number
  onClick?: () => void
  className?: string
}

export function SourceChip({
  source,
  index,
  onClick,
  className,
}: SourceChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs',
        'bg-accent/10 text-accent hover:bg-accent/20 transition-colors',
        className
      )}
    >
      <span className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-medium">
        {index}
      </span>
      <span className="truncate max-w-[150px]">{source.title}</span>
    </button>
  )
}

// Suggestions Component
interface Suggestion {
  id: string
  text: string
  type?: 'followup' | 'related' | 'alternative'
}

interface SuggestionsProps {
  suggestions: Suggestion[]
  title?: string
  onSelect: (suggestion: Suggestion) => void
  className?: string
}

export function Suggestions({
  suggestions,
  title = 'Suggested questions',
  onSelect,
  className,
}: SuggestionsProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {title && (
        <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
      )}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className="px-3 py-1.5 text-sm rounded-full border border-border bg-card hover:bg-muted transition-colors text-left"
          >
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  )
}

// Web Search Component
interface WebSearchResultsProps {
  query: string
  results: Source[]
  isSearching?: boolean
  onResultClick?: (result: Source) => void
  className?: string
}

export function WebSearchResults({
  query,
  results,
  isSearching,
  onResultClick,
  className,
}: WebSearchResultsProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      {/* Search Header */}
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            Searching for: <strong>{query}</strong>
          </span>
          {isSearching && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Searching...
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="divide-y divide-border">
          {results.map((result, index) => (
            <div
              key={result.id}
              className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onResultClick?.(result)}
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  {result.favicon ? (
                    <img
                      src={result.favicon || '/placeholder.svg'}
                      alt=""
                      className="w-3 h-3"
                    />
                  ) : (
                    <ImageIcon className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:underline truncate block"
                  >
                    {result.url}
                  </a>
                  <h4 className="font-medium text-sm text-accent hover:underline mt-0.5">
                    {result.title}
                  </h4>
                  {result.snippet && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {result.snippet}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isSearching && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No results found
          </div>
        )
      )}

      {isSearching && results.length === 0 && (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-muted" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// SourcesList - Alias for Sources
export function SourcesList(props: Parameters<typeof Sources>[0]) {
  return <Sources {...props} />
}

// LinkPreview Component
interface LinkPreviewProps {
  url: string
  title?: string
  description?: string
  image?: string
  favicon?: string
  isLoading?: boolean
  className?: string
}

export function LinkPreview({
  url,
  title,
  description,
  image,
  favicon,
  isLoading = false,
  className,
}: LinkPreviewProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'rounded-lg border border-border overflow-hidden animate-pulse',
          className
        )}
      >
        <div className="h-32 bg-muted" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
          <div className="h-3 bg-muted rounded w-full" />
        </div>
      </div>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'block rounded-lg border border-border overflow-hidden hover:border-accent transition-colors',
        className
      )}
    >
      {image && (
        <div className="h-32 bg-muted">
          <img
            src={image || '/placeholder.svg'}
            alt={title || ''}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          {favicon && (
            <img
              src={favicon || '/placeholder.svg'}
              alt=""
              className="w-4 h-4"
            />
          )}
          <span className="text-xs text-muted-foreground truncate">
            {new URL(url).hostname}
          </span>
        </div>
        {title && <h4 className="font-medium text-sm line-clamp-1">{title}</h4>}
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {description}
          </p>
        )}
      </div>
    </a>
  )
}

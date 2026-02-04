// @ts-nocheck
// TODO: Fix lucide-react icon imports
'use client'

import * as React from 'react'
import {
  Search,
  Globe,
  ExternalLink,
  Clock,
  ImageIcon,
  FileText,
  Video,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Filter,
  Calendar,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Skeleton } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

// Types
export interface SearchResult {
  id: string
  title: string
  url: string
  snippet: string
  favicon?: string
  siteName?: string
  publishedDate?: Date
  type?: 'web' | 'image' | 'video' | 'news'
  thumbnail?: string
  relevance?: number
}

export interface SearchQuery {
  query: string
  filters?: {
    type?: 'all' | 'web' | 'images' | 'videos' | 'news'
    timeRange?: 'any' | 'hour' | 'day' | 'week' | 'month' | 'year'
    region?: string
  }
}

// Search Result Card
interface SearchResultCardProps {
  result: SearchResult
  onSave?: (id: string) => void
  onFeedback?: (id: string, type: 'positive' | 'negative') => void
  compact?: boolean
}

export function SearchResultCard({
  result,
  onSave,
  onFeedback,
  compact = false,
}: SearchResultCardProps) {
  return (
    <div className={cn('group', compact ? 'py-2' : 'py-3')}>
      <div className="flex items-start gap-3">
        {result.favicon ? (
          <img
            src={result.favicon || '/placeholder.svg'}
            alt=""
            className="h-5 w-5 rounded mt-0.5"
          />
        ) : (
          <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs text-muted-foreground truncate">
              {result.siteName || new URL(result.url).hostname}
            </span>
            {result.publishedDate && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(result.publishedDate).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent hover:underline line-clamp-1"
          >
            {result.title}
          </a>
          {!compact && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {result.snippet}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onFeedback?.(result.id, 'positive')}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onFeedback?.(result.id, 'negative')}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onSave?.(result.id)}
          >
            <Bookmark className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {result.thumbnail && !compact && (
        <div className="mt-2 ml-8">
          <img
            src={result.thumbnail || '/placeholder.svg'}
            alt=""
            className="rounded-lg max-h-32 object-cover"
          />
        </div>
      )}
    </div>
  )
}

// Search Results List
interface SearchResultsListProps {
  results: SearchResult[]
  isLoading?: boolean
  query?: string
  onSave?: (id: string) => void
  onFeedback?: (id: string, type: 'positive' | 'negative') => void
  compact?: boolean
}

export function SearchResultsList({
  results,
  isLoading = false,
  query,
  onSave,
  onFeedback,
  compact = false,
}: SearchResultsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="font-medium">No results found</p>
        {query && (
          <p className="text-sm text-muted-foreground mt-1">
            No results for "{query}". Try different keywords.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={cn('divide-y divide-border', compact && 'divide-y-0')}>
      {results.map((result) => (
        <SearchResultCard
          key={result.id}
          result={result}
          onSave={onSave}
          onFeedback={onFeedback}
          compact={compact}
        />
      ))}
    </div>
  )
}

// Web Search Component
interface WebSearchProps {
  onSearch?: (query: SearchQuery) => void
  results?: SearchResult[]
  isSearching?: boolean
  initialQuery?: string
}

export function WebSearch({
  onSearch,
  results = [],
  isSearching = false,
  initialQuery = '',
}: WebSearchProps) {
  const [query, setQuery] = React.useState(initialQuery)
  const [activeTab, setActiveTab] = React.useState('all')
  const [timeFilter, setTimeFilter] = React.useState('any')

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return
    onSearch?.({
      query,
      filters: {
        type: activeTab as 'all' | 'web' | 'images' | 'videos' | 'news',
        timeRange: timeFilter as
          | 'any'
          | 'hour'
          | 'day'
          | 'week'
          | 'month'
          | 'year',
      },
    })
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the web..."
            className="pl-9 pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTimeFilter('any')}>
                  Any time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('hour')}>
                  Past hour
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('day')}>
                  Past 24 hours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('week')}>
                  Past week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('month')}>
                  Past month
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              type="submit"
              size="sm"
              disabled={!query.trim() || isSearching}
            >
              {isSearching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </div>
      </form>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            <Globe className="h-4 w-4 mr-1.5" />
            All
          </TabsTrigger>
          <TabsTrigger value="images">
            <ImageIcon className="h-4 w-4 mr-1.5" />
            Images
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-1.5" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="news">
            <FileText className="h-4 w-4 mr-1.5" />
            News
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {timeFilter !== 'any' && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Calendar className="h-3 w-3" />
            {timeFilter === 'hour' && 'Past hour'}
            {timeFilter === 'day' && 'Past 24 hours'}
            {timeFilter === 'week' && 'Past week'}
            {timeFilter === 'month' && 'Past month'}
            <button
              type="button"
              className="ml-1 hover:text-foreground"
              onClick={() => setTimeFilter('any')}
            >
              ×
            </button>
          </Badge>
        </div>
      )}

      <SearchResultsList
        results={results}
        isLoading={isSearching}
        query={query}
      />
    </div>
  )
}

// AI Search Summary
interface AISearchSummaryProps {
  query: string
  summary: string
  sources: SearchResult[]
  isLoading?: boolean
}

export function AISearchSummary({
  query,
  summary,
  sources,
  isLoading = false,
}: AISearchSummaryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            <CardTitle className="text-base">AI Summary</CardTitle>
          </div>
          <CardDescription>Searching and analyzing results...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <CardTitle className="text-base">AI Summary</CardTitle>
        </div>
        <CardDescription>Based on {sources.length} sources</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{summary}</p>
        <div className="flex flex-wrap gap-2">
          {sources.slice(0, 4).map((source, i) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-background border text-xs hover:bg-muted transition-colors"
            >
              <span className="text-accent font-medium">[{i + 1}]</span>
              <span className="truncate max-w-[150px]">
                {source.siteName || source.title}
              </span>
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Search Status Indicator
interface SearchStatusProps {
  status: 'idle' | 'searching' | 'complete' | 'error'
  resultCount?: number
  error?: string
}

export function SearchStatus({
  status,
  resultCount = 0,
  error,
}: SearchStatusProps) {
  const statusConfig = {
    idle: {
      icon: Search,
      label: 'Ready to search',
      color: 'text-muted-foreground',
    },
    searching: { icon: RefreshCw, label: 'Searching...', color: 'text-accent' },
    complete: {
      icon: CheckCircle2,
      label: `Found ${resultCount} results`,
      color: 'text-green-500',
    },
    error: {
      icon: AlertCircle,
      label: error || 'Search failed',
      color: 'text-destructive',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon
        className={cn(
          'h-4 w-4',
          config.color,
          status === 'searching' && 'animate-spin'
        )}
      />
      <span className={config.color}>{config.label}</span>
    </div>
  )
}

// Compact Search Chip (for inline display)
interface SearchChipProps {
  query: string
  onClick?: () => void
  onRemove?: () => void
}

export function SearchChip({ query, onClick, onRemove }: SearchChipProps) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-sm group">
      <Search className="h-3 w-3 text-muted-foreground" />
      <button type="button" className="hover:text-accent" onClick={onClick}>
        {query}
      </button>
      {onRemove && (
        <button
          type="button"
          className="opacity-0 group-hover:opacity-100 ml-1 hover:text-foreground"
          onClick={onRemove}
        >
          ×
        </button>
      )}
    </div>
  )
}

'use client'

import * as React from 'react'
import {
  ExternalLink,
  FileText,
  Globe,
  Book,
  Newspaper,
  Video,
  ImageIcon,
  File,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Link2,
  Quote,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
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
import { cn } from '@clarity-chat/primitives'

// Types
export type SourceType =
  | 'web'
  | 'document'
  | 'book'
  | 'article'
  | 'video'
  | 'image'
  | 'file'
  | 'unknown'

export interface Citation {
  id: string
  number: number
  title: string
  url?: string
  snippet?: string
  source?: string
  type?: SourceType
  publishedDate?: string
  author?: string
  favicon?: string
}

// Inline Citation (the [1] style reference)
export interface InlineCitationProps {
  citation: Citation
  onClick?: () => void
  showPreview?: boolean
  className?: string
}

export function InlineCitation({
  citation,
  onClick,
  showPreview = true,
  className,
}: InlineCitationProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (citation.url) {
      await navigator.clipboard.writeText(citation.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const content = (
    <button
      className={cn(
        'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-medium',
        'bg-accent/20 text-accent hover:bg-accent/30 rounded transition-colors',
        'align-baseline',
        className
      )}
      onClick={onClick}
    >
      {citation.number}
    </button>
  )

  if (!showPreview) return content

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>{content}</HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <CitationPreview
          citation={citation}
          onCopy={handleCopy}
          copied={copied}
        />
      </HoverCardContent>
    </HoverCard>
  )
}

// Citation Preview (shown in hover card or popover)
export interface CitationPreviewProps {
  citation: Citation
  onCopy?: (e: React.MouseEvent) => void
  copied?: boolean
  className?: string
}

export function CitationPreview({
  citation,
  onCopy,
  copied,
  className,
}: CitationPreviewProps) {
  const typeIcons: Record<SourceType, React.ReactNode> = {
    web: <Globe className="h-4 w-4" />,
    document: <FileText className="h-4 w-4" />,
    book: <Book className="h-4 w-4" />,
    article: <Newspaper className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    image: <ImageIcon className="h-4 w-4" />,
    file: <File className="h-4 w-4" />,
    unknown: <Link2 className="h-4 w-4" />,
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start gap-2">
        {citation.favicon ? (
          <img
            src={citation.favicon || '/placeholder.svg'}
            alt=""
            className="w-4 h-4 rounded mt-0.5"
          />
        ) : (
          <span className="text-muted-foreground mt-0.5">
            {typeIcons[citation.type || 'unknown']}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline line-clamp-2"
          >
            {citation.title}
          </a>
          {citation.source && (
            <p className="text-xs text-muted-foreground truncate">
              {citation.source}
            </p>
          )}
        </div>
        <Badge variant="outline" className="text-xs shrink-0">
          [{citation.number}]
        </Badge>
      </div>

      {citation.snippet && (
        <p className="text-xs text-muted-foreground line-clamp-3 italic">
          "{citation.snippet}"
        </p>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {citation.author && <span>{citation.author}</span>}
          {citation.publishedDate && (
            <>
              {citation.author && <span>•</span>}
              <span>{citation.publishedDate}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onCopy && citation.url && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onCopy}
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? 'Copied!' : 'Copy URL'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {citation.url && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    asChild
                  >
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open source</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  )
}

// Citation List (full list of all citations)
export interface CitationListProps {
  citations: Citation[]
  onCitationClick?: (citation: Citation) => void
  collapsible?: boolean
  defaultExpanded?: boolean
  maxVisible?: number
  className?: string
}

export function CitationList({
  citations,
  onCitationClick,
  collapsible = true,
  defaultExpanded = false,
  maxVisible = 3,
  className,
}: CitationListProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const visibleCitations = expanded ? citations : citations.slice(0, maxVisible)
  const hasMore = citations.length > maxVisible

  const handleCopy = async (citation: Citation) => {
    if (citation.url) {
      await navigator.clipboard.writeText(citation.url)
      setCopiedId(citation.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  if (citations.length === 0) return null

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Quote className="h-4 w-4" />
          Sources
          <Badge variant="secondary" className="text-xs">
            {citations.length}
          </Badge>
        </h4>
      </div>

      <div className="space-y-2">
        {visibleCitations.map((citation) => (
          <CitationCard
            key={citation.id}
            citation={citation}
            onClick={() => onCitationClick?.(citation)}
            onCopy={() => handleCopy(citation)}
            copied={copiedId === citation.id}
          />
        ))}
      </div>

      {collapsible && hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Show {citations.length - maxVisible} more sources
            </>
          )}
        </Button>
      )}
    </div>
  )
}

// Citation Card (used in the citation list)
export interface CitationCardProps {
  citation: Citation
  onClick?: () => void
  onCopy?: () => void
  copied?: boolean
  className?: string
}

export function CitationCard({
  citation,
  onClick,
  onCopy,
  copied,
  className,
}: CitationCardProps) {
  const typeIcons: Record<SourceType, React.ReactNode> = {
    web: <Globe className="h-4 w-4" />,
    document: <FileText className="h-4 w-4" />,
    book: <Book className="h-4 w-4" />,
    article: <Newspaper className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    image: <ImageIcon className="h-4 w-4" />,
    file: <File className="h-4 w-4" />,
    unknown: <Link2 className="h-4 w-4" />,
  }

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-6 h-6 rounded bg-accent/10 text-accent text-xs font-medium shrink-0">
        {citation.number}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          {citation.favicon ? (
            <img
              src={citation.favicon || '/placeholder.svg'}
              alt=""
              className="w-4 h-4 rounded mt-0.5"
            />
          ) : (
            <span className="text-muted-foreground mt-0.5 shrink-0">
              {typeIcons[citation.type || 'unknown']}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{citation.title}</p>
            {citation.source && (
              <p className="text-xs text-muted-foreground truncate">
                {citation.source}
              </p>
            )}
          </div>
        </div>

        {citation.snippet && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {citation.snippet}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onCopy && citation.url && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              onCopy()
            }}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
        {citation.url && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={citation.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

// Superscript Citation (alternative inline style)
export interface SuperscriptCitationProps {
  citations: Citation[]
  showPreview?: boolean
  className?: string
}

export function SuperscriptCitation({
  citations,
  showPreview = true,
  className,
}: SuperscriptCitationProps) {
  if (citations.length === 0) return null

  const content = (
    <sup
      className={cn(
        'inline-flex items-center gap-0.5 text-[10px] font-medium text-accent cursor-pointer',
        className
      )}
    >
      [
      {citations.map((c, i) => (
        <React.Fragment key={c.id}>
          {i > 0 && ','}
          {c.number}
        </React.Fragment>
      ))}
      ]
    </sup>
  )

  if (!showPreview) return content

  return (
    <Popover>
      <PopoverTrigger asChild>{content}</PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-3">
          {citations.map((citation) => (
            <CitationPreview key={citation.id} citation={citation} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Citation Highlight (wrap text with citation)
export interface CitationHighlightProps {
  children: React.ReactNode
  citation: Citation
  className?: string
}

export function CitationHighlight({
  children,
  citation,
  className,
}: CitationHighlightProps) {
  return (
    <span className={cn('relative group', className)}>
      <span className="bg-accent/10 px-0.5 rounded">{children}</span>
      <InlineCitation citation={citation} className="ml-0.5" />
    </span>
  )
}

// Citation Chip (compact clickable citation)
export interface CitationChipProps {
  citation: Citation
  onClick?: () => void
  className?: string
}

export function CitationChip({
  citation,
  onClick,
  className,
}: CitationChipProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full',
        'bg-muted hover:bg-muted/80 transition-colors',
        'text-xs font-medium',
        className
      )}
      onClick={onClick}
    >
      {citation.favicon ? (
        <img
          src={citation.favicon || '/placeholder.svg'}
          alt=""
          className="w-3 h-3 rounded"
        />
      ) : (
        <ImageIcon className="h-3 w-3" />
      )}
      <span className="truncate max-w-[120px]">
        {citation.source || citation.title}
      </span>
    </button>
  )
}

// Citation Group (inline group of citations)
export interface CitationGroupProps {
  citations: Citation[]
  maxVisible?: number
  className?: string
}

export function CitationGroup({
  citations,
  maxVisible = 3,
  className,
}: CitationGroupProps) {
  const visible = citations.slice(0, maxVisible)
  const remaining = citations.length - maxVisible

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      {visible.map((citation) => (
        <InlineCitation key={citation.id} citation={citation} />
      ))}
      {remaining > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1 text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 rounded transition-colors">
              +{remaining}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="start">
            <div className="space-y-3">
              {citations.slice(maxVisible).map((citation) => (
                <CitationPreview key={citation.id} citation={citation} />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

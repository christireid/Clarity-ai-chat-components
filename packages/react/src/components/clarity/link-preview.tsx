'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  ExternalLink,
  Globe,
  ImageIcon,
  Play,
  FileText,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Link as LinkIcon,
} from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@clarity-chat/primitives'
import { Skeleton } from '@clarity-chat/primitives'

// Types
export interface LinkMetadata {
  url: string
  title?: string
  description?: string
  image?: string
  favicon?: string
  siteName?: string
  type?:
    | 'website'
    | 'article'
    | 'video'
    | 'github'
    | 'twitter'
    | 'linkedin'
    | 'youtube'
}

interface LinkPreviewProps {
  url: string
  metadata?: LinkMetadata
  loading?: boolean
  variant?: 'inline' | 'card' | 'compact'
  className?: string
  children?: React.ReactNode
}

// Get domain from URL
function getDomain(url: string): string {
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return url
  }
}

// Get site icon
function getSiteIcon(url: string, type?: string): React.ReactNode {
  const domain = getDomain(url)

  if (type === 'github' || domain.includes('github')) {
    return <Github className="h-4 w-4" />
  }
  if (
    type === 'twitter' ||
    domain.includes('twitter') ||
    domain.includes('x.com')
  ) {
    return <Twitter className="h-4 w-4" />
  }
  if (type === 'linkedin' || domain.includes('linkedin')) {
    return <Linkedin className="h-4 w-4" />
  }
  if (type === 'youtube' || domain.includes('youtube')) {
    return <Youtube className="h-4 w-4" />
  }
  if (type === 'video') {
    return <Play className="h-4 w-4" />
  }
  if (type === 'article') {
    return <FileText className="h-4 w-4" />
  }
  return <Globe className="h-4 w-4" />
}

// Inline link with hover preview
export function LinkPreview({
  url,
  metadata,
  loading = false,
  variant = 'inline',
  className,
  children,
}: LinkPreviewProps) {
  const domain = getDomain(url)

  if (variant === 'inline') {
    return (
      <HoverCard openDelay={300} closeDelay={100}>
        <HoverCardTrigger asChild>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-1 text-accent underline underline-offset-2 hover:text-accent/80',
              className
            )}
          >
            {children || metadata?.title || domain}
            <ExternalLink className="h-3 w-3" />
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-0 overflow-hidden" align="start">
          {loading ? (
            <LinkPreviewSkeleton />
          ) : (
            <LinkPreviewContent metadata={metadata || { url }} />
          )}
        </HoverCardContent>
      </HoverCard>
    )
  }

  if (variant === 'compact') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 hover:bg-muted transition-colors text-sm',
          className
        )}
      >
        {metadata?.favicon ? (
          <img
            src={metadata.favicon || '/placeholder.svg'}
            alt=""
            className="h-4 w-4 rounded"
          />
        ) : (
          getSiteIcon(url, metadata?.type)
        )}
        <span className="truncate max-w-[200px]">
          {metadata?.title || domain}
        </span>
        <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
      </a>
    )
  }

  // Card variant
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'block rounded-lg border border-border bg-card overflow-hidden hover:border-accent/50 transition-colors',
        className
      )}
    >
      {loading ? (
        <LinkPreviewSkeleton />
      ) : (
        <LinkPreviewContent metadata={metadata || { url }} />
      )}
    </a>
  )
}

// Preview content
function LinkPreviewContent({ metadata }: { metadata: LinkMetadata }) {
  const domain = getDomain(metadata.url)

  return (
    <div className="flex flex-col">
      {/* Image */}
      {metadata.image && (
        <div className="relative aspect-video bg-muted overflow-hidden">
          <img
            src={metadata.image || '/placeholder.svg'}
            alt={metadata.title || ''}
            className="w-full h-full object-cover"
          />
          {metadata.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="h-6 w-6 text-foreground ml-1" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-3 space-y-1.5">
        {metadata.title && (
          <h4 className="font-medium text-sm line-clamp-2">{metadata.title}</h4>
        )}
        {metadata.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {metadata.description}
          </p>
        )}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {metadata.favicon ? (
            <img
              src={metadata.favicon || '/placeholder.svg'}
              alt=""
              className="h-3.5 w-3.5 rounded"
            />
          ) : (
            getSiteIcon(metadata.url, metadata.type)
          )}
          <span className="truncate">{metadata.siteName || domain}</span>
        </div>
      </div>
    </div>
  )
}

// Skeleton loader
function LinkPreviewSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-video w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}

// Rich link embed (for messages)
interface RichLinkEmbedProps {
  links: LinkMetadata[]
  className?: string
}

export function RichLinkEmbed({ links, className }: RichLinkEmbedProps) {
  if (links.length === 0) return null

  if (links.length === 1) {
    return (
      <LinkPreview
        url={links[0].url}
        metadata={links[0]}
        variant="card"
        className={cn('max-w-sm', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'grid gap-2',
        links.length === 2 ? 'grid-cols-2' : 'grid-cols-1',
        className
      )}
    >
      {links.map((link, index) => (
        <LinkPreview
          key={index}
          url={link.url}
          metadata={link}
          variant="compact"
        />
      ))}
    </div>
  )
}

// URL detection and auto-link component
interface AutoLinkTextProps {
  text: string
  linkMetadata?: Record<string, LinkMetadata>
  className?: string
}

export function AutoLinkText({
  text,
  linkMetadata = {},
  className,
}: AutoLinkTextProps) {
  // Simple URL regex
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g
  const parts = text.split(urlRegex)

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          // Reset regex state
          urlRegex.lastIndex = 0
          return (
            <LinkPreview
              key={index}
              url={part}
              metadata={linkMetadata[part]}
              variant="inline"
            />
          )
        }
        return part
      })}
    </span>
  )
}

// Favicon component
interface FaviconProps {
  url: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Favicon({ url, size = 'md', className }: FaviconProps) {
  const [error, setError] = React.useState(false)
  const domain = getDomain(url)
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  if (error) {
    return (
      <Globe
        className={cn(sizeClasses[size], 'text-muted-foreground', className)}
      />
    )
  }

  return (
    <img
      src={faviconUrl || '/placeholder.svg'}
      alt=""
      className={cn(sizeClasses[size], 'rounded', className)}
      onError={() => setError(true)}
    />
  )
}

// Source link chip (for citations)
interface SourceChipProps {
  url: string
  title?: string
  index?: number
  className?: string
}

export function SourceChip({ url, title, index, className }: SourceChipProps) {
  const domain = getDomain(url)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-border bg-muted/50',
        'hover:bg-muted hover:border-accent/50 transition-colors text-xs',
        className
      )}
    >
      {index !== undefined && (
        <span className="flex items-center justify-center h-4 w-4 rounded-full bg-accent/20 text-accent text-[10px] font-medium">
          {index}
        </span>
      )}
      <Favicon url={url} size="sm" />
      <span className="truncate max-w-[150px]">{title || domain}</span>
    </a>
  )
}

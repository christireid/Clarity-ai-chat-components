import * as React from 'react'
import { motion } from 'framer-motion'
import { Card, Badge, cn } from '@clarity-chat/primitives'

export interface LinkMetadata {
  url: string
  title?: string
  description?: string
  image?: string
  siteName?: string
  favicon?: string
}

export interface LinkPreviewProps {
  metadata: LinkMetadata
  onClick?: () => void
  onRemove?: () => void
  loading?: boolean
  className?: string
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({
  metadata,
  onClick,
  onRemove,
  loading = false,
  className,
}) => {
  const [imageError, setImageError] = React.useState(false)

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  if (loading) {
    return (
      <Card className={cn('p-4 animate-pulse', className)}>
        <div className="flex gap-3">
          <div className="w-24 h-24 bg-muted rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={className}
    >
      <Card
        className={cn(
          'group relative overflow-hidden transition-all',
          onClick && 'cursor-pointer hover:shadow-lg'
        )}
        onClick={onClick}
      >
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
          >
            ✕
          </button>
        )}

        <div className="flex gap-3 p-4">
          {/* Image */}
          {metadata.image && !imageError ? (
            <div className="flex-shrink-0 w-24 h-24 rounded overflow-hidden bg-muted">
              <img
                src={metadata.image}
                alt={metadata.title || 'Link preview'}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-24 h-24 rounded bg-muted flex items-center justify-center text-4xl">
              🔗
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">
            {/* Site Name / Domain */}
            <div className="flex items-center gap-2">
              {metadata.favicon && (
                <img
                  src={metadata.favicon}
                  alt=""
                  className="w-4 h-4"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <p className="text-xs text-muted-foreground truncate">
                {metadata.siteName || getDomain(metadata.url)}
              </p>
            </div>

            {/* Title */}
            {metadata.title && (
              <h4 className="font-semibold text-sm line-clamp-2 leading-tight">
                {metadata.title}
              </h4>
            )}

            {/* Description */}
            {metadata.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {metadata.description}
              </p>
            )}

            {/* URL */}
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="text-xs">
                🔗 {getDomain(metadata.url)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Bottom Border Effect */}
        {onClick && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        )}
      </Card>
    </motion.div>
  )
}

// Hook for fetching link metadata
export function useLinkPreview() {
  const [loading, setLoading] = React.useState(false)
  const [metadata, setMetadata] = React.useState<LinkMetadata | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const fetchMetadata = React.useCallback(async (url: string): Promise<LinkMetadata> => {
    setLoading(true)
    setError(null)

    try {
      // In a real implementation, this would call your backend API
      // which would fetch the URL and extract metadata
      // For now, return mock data
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockMetadata: LinkMetadata = {
        url,
        title: 'Example Website Title',
        description: 'This is a description of the linked content that provides context.',
        image: 'https://via.placeholder.com/400x300',
        siteName: 'Example Site',
        favicon: 'https://via.placeholder.com/16x16',
      }

      setMetadata(mockMetadata)
      return mockMetadata
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch link metadata'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = React.useCallback(() => {
    setMetadata(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    loading,
    metadata,
    error,
    fetchMetadata,
    reset,
  }
}

// Component for rendering link in message
export interface InlineLinkProps {
  url: string
  onPreview?: (url: string) => void
  children?: React.ReactNode
  className?: string
}

export const InlineLink: React.FC<InlineLinkProps> = ({
  url,
  onPreview,
  children,
  className,
}) => {
  const [showPreview, setShowPreview] = React.useState(false)
  const { metadata, loading, fetchMetadata } = useLinkPreview()

  const handleMouseEnter = () => {
    if (!metadata && !loading) {
      fetchMetadata(url)
    }
    setShowPreview(true)
  }

  const handleMouseLeave = () => {
    setShowPreview(false)
  }

  return (
    <span className="relative inline-block">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'text-primary hover:underline cursor-pointer',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          if (onPreview) {
            e.preventDefault()
            onPreview(url)
          }
        }}
      >
        {children || url}
      </a>

      {/* Hover Preview */}
      {showPreview && metadata && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-0 mb-2 w-80 z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <LinkPreview metadata={metadata} onClick={() => window.open(url, '_blank')} />
        </motion.div>
      )}
    </span>
  )
}

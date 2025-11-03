/**
 * Citation Card Component
 *
 * Displays RAG sources/citations with expandable preview
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  cn,
} from '@clarity-chat/primitives'
import type { Citation } from '../adapters/types'

// Helper to safely render metadata values
const renderMetadataValue = (value: unknown): React.ReactNode => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }
  return null
}

export interface CitationCardProps {
  /** Citation data */
  citation: Citation
  /** Show expanded view by default */
  defaultExpanded?: boolean
  /** Maximum characters for preview (before truncation) */
  previewLength?: number
  /** Show confidence score badge */
  showConfidence?: boolean
  /** Callback when citation is clicked */
  onClick?: (citation: Citation) => void
  /** Callback when source link is clicked */
  onSourceClick?: (url: string) => void
  /** Additional CSS class */
  className?: string
}

export const CitationCard = React.memo(function CitationCard({
  citation,
  defaultExpanded = false,
  previewLength = 150,
  showConfidence = true,
  onClick,
  onSourceClick,
  className = '',
}: CitationCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const truncatedText =
    citation.chunkText.length > previewLength
      ? citation.chunkText.slice(0, previewLength) + '...'
      : citation.chunkText

  const getConfidenceVariant = (
    confidence: number
  ): 'success' | 'info' | 'warning' | 'destructive' => {
    if (confidence >= 0.9) return 'success'
    if (confidence >= 0.7) return 'info'
    if (confidence >= 0.5) return 'warning'
    return 'destructive'
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'High'
    if (confidence >= 0.7) return 'Medium'
    if (confidence >= 0.5) return 'Low'
    return 'Very Low'
  }

  const handleSourceClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (citation.url && onSourceClick) {
      onSourceClick(citation.url)
    } else if (citation.url) {
      window.open(citation.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5',
          onClick && 'cursor-pointer',
          className
        )}
        onClick={() => {
          if (onClick) onClick(citation)
          else setIsExpanded(!isExpanded)
        }}
      >
        <CardHeader className="flex flex-row items-start gap-3 pb-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </span>
          <div className="flex-1 space-y-1">
            <CardTitle className="truncate leading-tight">
              {citation.source}
            </CardTitle>
            {(() => {
              const author = citation.metadata?.author
              if (!author) return null
              const authorText = renderMetadataValue(author)
              if (!authorText) return null
              return (
                <CardDescription className="text-xs text-muted-foreground">
                  {authorText}
                </CardDescription>
              )
            })()}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {showConfidence && citation.confidence !== undefined && (
              <Badge
                variant={getConfidenceVariant(citation.confidence)}
                title={`${(citation.confidence * 100).toFixed(0)}% confidence`}
              >
                {getConfidenceLabel(citation.confidence)}
              </Badge>
            )}
            {citation.url && (
              <Button
                size="icon"
                variant="ghost"
                onClick={(event) => {
                  event.stopPropagation()
                  handleSourceClick(event)
                }}
                className="h-8 w-8 rounded-full"
                title="Open source"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-pre-wrap text-foreground"
                >
                  {citation.chunkText}
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {truncatedText}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {citation.chunkText.length > previewLength && (
            <Button
              variant="link"
              size="sm"
              onClick={(event) => {
                event.stopPropagation()
                setIsExpanded((expanded) => !expanded)
              }}
              className="px-0 text-sm font-medium text-primary"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </Button>
          )}

          {citation.metadata && Object.keys(citation.metadata).length > 0 && (
            <div className="space-y-2 rounded-xl border bg-muted/50 p-3">
              <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                Metadata
              </span>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const date = citation.metadata?.date
                  if (!date) return null
                  const dateText = renderMetadataValue(date)
                  if (!dateText) return null
                  return <Badge variant="outline">{dateText}</Badge>
                })()}
                {(() => {
                  const page = citation.metadata?.page
                  if (!page) return null
                  const pageText = renderMetadataValue(page)
                  if (!pageText) return null
                  return <Badge variant="outline">Page {pageText}</Badge>
                })()}
                {(() => {
                  const section = citation.metadata?.section
                  if (!section) return null
                  const sectionText = renderMetadataValue(section)
                  if (!sectionText) return null
                  return <Badge variant="outline">{sectionText}</Badge>
                })()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
})

CitationCard.displayName = 'CitationCard'

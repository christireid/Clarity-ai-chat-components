'use client'

/**
 * InlineCitation Component
 *
 * A citation component for inline references within AI-generated text.
 * Supports numbered citations, footnotes, and interactive hover/click previews.
 *
 * Features:
 * - Multiple variants (number, bracket, superscript, footnote)
 * - Hover preview with source details
 * - Click to expand full citation
 * - Grouped citation management
 * - Keyboard accessible
 * - Link to source
 *
 * @example
 * ```tsx
 * <InlineCitation
 *   number={1}
 *   source={{
 *     title: "React Documentation",
 *     url: "https://react.dev",
 *     author: "React Team"
 *   }}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type InlineCitationVariant = 'number' | 'bracket' | 'superscript' | 'footnote' | 'link'

export interface CitationSource {
  /** Source title */
  title: string
  /** Source URL */
  url?: string
  /** Author name(s) */
  author?: string
  /** Publication date */
  date?: string
  /** Publisher/site name */
  publisher?: string
  /** Snippet/excerpt */
  snippet?: string
  /** Favicon URL */
  favicon?: string
  /** Source type */
  type?: 'webpage' | 'article' | 'paper' | 'book' | 'video' | 'document'
}

export interface InlineCitationProps {
  /** Citation number */
  number: number
  /** Source information */
  source: CitationSource
  /** Display variant */
  variant?: InlineCitationVariant
  /** Whether to show preview on hover */
  showPreview?: boolean
  /** Whether citation is verified */
  isVerified?: boolean
  /** Click handler */
  onClick?: () => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

function getSourceIcon(type?: CitationSource['type']): React.ReactNode {
  switch (type) {
    case 'article':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6Z" />
        </svg>
      )
    case 'paper':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      )
    case 'book':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      )
    case 'video':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m22 8-6 4 6 4V8Z" />
          <rect width="14" height="12" x="2" y="6" rx="2" />
        </svg>
      )
    case 'document':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      )
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      )
  }
}

// ============================================================================
// CitationPreview Component
// ============================================================================

interface CitationPreviewProps {
  source: CitationSource
  isVerified?: boolean
}

function CitationPreview({ source, isVerified }: CitationPreviewProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="inline-citation-preview"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: 4, scale: 0.95 }}
      transition={{
        duration: DURATION_SECONDS.fast,
        ease: EASING_FRAMER.standard,
      }}
    >
      {/* Header */}
      <div className="inline-citation-preview-header">
        {source.favicon ? (
          <img
            src={source.favicon}
            alt=""
            className="inline-citation-preview-favicon"
          />
        ) : (
          <span className="inline-citation-preview-icon">
            {getSourceIcon(source.type)}
          </span>
        )}
        <div className="inline-citation-preview-meta">
          {source.publisher && (
            <span className="inline-citation-preview-publisher">
              {source.publisher}
            </span>
          )}
          {source.author && (
            <span className="inline-citation-preview-author">
              {source.author}
            </span>
          )}
        </div>
        {isVerified && (
          <span className="inline-citation-verified" title="Verified source">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="inline-citation-preview-title">{source.title}</h4>

      {/* Snippet */}
      {source.snippet && (
        <p className="inline-citation-preview-snippet">{source.snippet}</p>
      )}

      {/* Footer */}
      <div className="inline-citation-preview-footer">
        {source.date && (
          <span className="inline-citation-preview-date">{source.date}</span>
        )}
        {source.url && (
          <span className="inline-citation-preview-url">
            {new URL(source.url).hostname}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// InlineCitation Component
// ============================================================================

export function InlineCitation({
  number,
  source,
  variant = 'number',
  showPreview = true,
  isVerified = false,
  onClick,
  className,
}: InlineCitationProps) {
  const prefersReducedMotion = useReducedMotion()
  const [showPopover, setShowPopover] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const handleMouseEnter = () => {
    if (showPreview) setShowPopover(true)
  }

  const handleMouseLeave = () => {
    if (!isFocused) setShowPopover(false)
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (showPreview) setShowPopover(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setShowPopover(false)
  }

  const handleClick = () => {
    if (source.url && !onClick) {
      window.open(source.url, '_blank', 'noopener,noreferrer')
    }
    onClick?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const renderCitation = () => {
    switch (variant) {
      case 'bracket':
        return `[${number}]`
      case 'superscript':
        return <sup>{number}</sup>
      case 'footnote':
        return <sup className="inline-citation-footnote">*{number}</sup>
      case 'link':
        return (
          <span className="inline-citation-link">
            {source.title}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </span>
        )
      default:
        return number
    }
  }

  return (
    <span className={cn('inline-citation-wrapper', className)}>
      <motion.button
        ref={triggerRef}
        type="button"
        className={cn(
          'inline-citation',
          `inline-citation-${variant}`,
          isVerified && 'inline-citation-verified-source'
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
        whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
        aria-label={`Citation ${number}: ${source.title}`}
        aria-describedby={showPopover ? `citation-preview-${number}` : undefined}
      >
        {renderCitation()}
      </motion.button>

      <AnimatePresence>
        {showPopover && (
          <div
            id={`citation-preview-${number}`}
            className="inline-citation-popover"
            role="tooltip"
          >
            <CitationPreview source={source} isVerified={isVerified} />
          </div>
        )}
      </AnimatePresence>
    </span>
  )
}

// ============================================================================
// InlineCitationList Component
// ============================================================================

export interface InlineCitationListProps {
  /** Array of citations */
  citations: Array<{ number: number; source: CitationSource; isVerified?: boolean }>
  /** Display variant */
  variant?: InlineCitationVariant
  /** Click handler */
  onCitationClick?: (number: number) => void
  /** Additional class names */
  className?: string
}

export function InlineCitationList({
  citations,
  variant = 'number',
  onCitationClick,
  className,
}: InlineCitationListProps) {
  return (
    <span className={cn('inline-citation-list', className)}>
      {citations.map((citation, index) => (
        <React.Fragment key={citation.number}>
          <InlineCitation
            number={citation.number}
            source={citation.source}
            variant={variant}
            isVerified={citation.isVerified}
            onClick={() => onCitationClick?.(citation.number)}
          />
          {index < citations.length - 1 && (
            <span className="inline-citation-separator">,</span>
          )}
        </React.Fragment>
      ))}
    </span>
  )
}

// ============================================================================
// CitationFootnotes Component
// ============================================================================

export interface CitationFootnotesProps {
  /** Array of citations to display as footnotes */
  citations: Array<{ number: number; source: CitationSource; isVerified?: boolean }>
  /** Title for the footnotes section */
  title?: string
  /** Additional class names */
  className?: string
}

export function CitationFootnotes({
  citations,
  title = 'References',
  className,
}: CitationFootnotesProps) {
  const prefersReducedMotion = useReducedMotion()

  if (citations.length === 0) return null

  return (
    <motion.div
      className={cn('citation-footnotes', className)}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION_SECONDS.normal,
        ease: EASING_FRAMER.standard,
      }}
      role="region"
      aria-label={title}
    >
      <h3 className="citation-footnotes-title">{title}</h3>
      <ol className="citation-footnotes-list">
        {citations.map((citation) => (
          <li key={citation.number} className="citation-footnote-item">
            <span className="citation-footnote-number">{citation.number}.</span>
            <div className="citation-footnote-content">
              <div className="citation-footnote-header">
                {citation.source.favicon && (
                  <img
                    src={citation.source.favicon}
                    alt=""
                    className="citation-footnote-favicon"
                  />
                )}
                {citation.source.url ? (
                  <a
                    href={citation.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="citation-footnote-title"
                  >
                    {citation.source.title}
                  </a>
                ) : (
                  <span className="citation-footnote-title">
                    {citation.source.title}
                  </span>
                )}
                {citation.isVerified && (
                  <span className="citation-footnote-verified">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="citation-footnote-meta">
                {citation.source.author && (
                  <span className="citation-footnote-author">
                    {citation.source.author}
                  </span>
                )}
                {citation.source.publisher && (
                  <span className="citation-footnote-publisher">
                    {citation.source.publisher}
                  </span>
                )}
                {citation.source.date && (
                  <span className="citation-footnote-date">
                    {citation.source.date}
                  </span>
                )}
              </div>
              {citation.source.snippet && (
                <p className="citation-footnote-snippet">
                  {citation.source.snippet}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </motion.div>
  )
}

// ============================================================================
// useCitations Hook
// ============================================================================

export interface UseCitationsOptions {
  /** Initial citations */
  initialCitations?: Array<{ number: number; source: CitationSource; isVerified?: boolean }>
}

export interface UseCitationsReturn {
  /** Current citations */
  citations: Array<{ number: number; source: CitationSource; isVerified?: boolean }>
  /** Add a citation */
  addCitation: (source: CitationSource, isVerified?: boolean) => number
  /** Remove a citation */
  removeCitation: (number: number) => void
  /** Update a citation */
  updateCitation: (number: number, source: Partial<CitationSource>) => void
  /** Get citation by number */
  getCitation: (number: number) => { number: number; source: CitationSource; isVerified?: boolean } | undefined
  /** Clear all citations */
  clearCitations: () => void
}

export function useCitations(options: UseCitationsOptions = {}): UseCitationsReturn {
  const { initialCitations = [] } = options
  const [citations, setCitations] = React.useState(initialCitations)
  const nextNumberRef = React.useRef(
    initialCitations.length > 0
      ? Math.max(...initialCitations.map((c) => c.number)) + 1
      : 1
  )

  const addCitation = React.useCallback((source: CitationSource, isVerified = false) => {
    const number = nextNumberRef.current++
    setCitations((prev) => [...prev, { number, source, isVerified }])
    return number
  }, [])

  const removeCitation = React.useCallback((number: number) => {
    setCitations((prev) => prev.filter((c) => c.number !== number))
  }, [])

  const updateCitation = React.useCallback((number: number, source: Partial<CitationSource>) => {
    setCitations((prev) =>
      prev.map((c) =>
        c.number === number ? { ...c, source: { ...c.source, ...source } } : c
      )
    )
  }, [])

  const getCitation = React.useCallback(
    (number: number) => citations.find((c) => c.number === number),
    [citations]
  )

  const clearCitations = React.useCallback(() => {
    setCitations([])
    nextNumberRef.current = 1
  }, [])

  return {
    citations,
    addCitation,
    removeCitation,
    updateCitation,
    getCitation,
    clearCitations,
  }
}

export default InlineCitation

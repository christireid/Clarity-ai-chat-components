/**
 * Citation Card Component
 * 
 * Displays RAG sources/citations with expandable preview
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Citation } from '../adapters/types'

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

export function CitationCard({
  citation,
  defaultExpanded = false,
  previewLength = 150,
  showConfidence = true,
  onClick,
  onSourceClick,
  className = ''
}: CitationCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  
  const truncatedText = citation.chunkText.length > previewLength
    ? citation.chunkText.slice(0, previewLength) + '...'
    : citation.chunkText
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (confidence >= 0.7) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (confidence >= 0.5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-colors ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={() => {
        if (onClick) onClick(citation)
        else setIsExpanded(!isExpanded)
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {citation.source}
                </h4>
                {citation.metadata?.author && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {citation.metadata.author}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {showConfidence && citation.confidence !== undefined && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getConfidenceColor(
                      citation.confidence
                    )}`}
                    title={`${(citation.confidence * 100).toFixed(0)}% confidence`}
                  >
                    {getConfidenceLabel(citation.confidence)}
                  </span>
                )}
                {citation.url && (
                  <button
                    onClick={handleSourceClick}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    title="Open source"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Preview Text */}
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-pre-wrap"
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
            
            {/* Expand/Collapse Button */}
            {citation.chunkText.length > previewLength && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
                className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                {isExpanded ? (
                  <>
                    Show less
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Show more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            )}
            
            {/* Metadata */}
            {citation.metadata && Object.keys(citation.metadata).length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {citation.metadata.date && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      📅 {citation.metadata.date}
                    </span>
                  )}
                  {citation.metadata.page && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      📄 Page {citation.metadata.page}
                    </span>
                  )}
                  {citation.metadata.section && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      § {citation.metadata.section}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

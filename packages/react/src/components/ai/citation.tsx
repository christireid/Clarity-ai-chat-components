'use client'

import * as React from 'react'
import { cn } from '../../utils/cn'

export interface CitationSource {
  documentName: string
  text: string
  relevanceScore: number
  page?: number
  url?: string
}

export interface CitationProps extends React.HTMLAttributes<HTMLDivElement> {
  source: CitationSource
  index?: number
  compact?: boolean
}

export function Citation({
  source,
  index,
  compact = false,
  className,
  ...props
}: CitationProps) {
  const confidence =
    source.relevanceScore > 0.8
      ? 'High'
      : source.relevanceScore > 0.5
      ? 'Medium'
      : 'Low'

  const confidenceColor =
    confidence === 'High'
      ? 'bg-green-100 text-green-700 border-green-200'
      : confidence === 'Medium'
      ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
      : 'bg-red-100 text-red-700 border-red-200'

  if (compact) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors cursor-help',
          className
        )}
        title={`${confidence} Confidence (${source.relevanceScore.toFixed(2)})`}
        {...props}
      >
        <span className="font-medium text-gray-700">[{index ?? 1}]</span>
        <span className="truncate max-w-[100px] text-gray-500">
          {source.documentName}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group flex flex-col gap-2 p-3 rounded-md border border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
            {index ?? 1}
          </span>
          <span className="font-medium text-sm text-gray-900 truncate" title={source.documentName}>
            {source.documentName}
          </span>
        </div>
        <span
          className={cn(
            'flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium border',
            confidenceColor
          )}
        >
          {confidence}
        </span>
      </div>
      
      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
        {source.text}
      </p>

      {(source.page || source.url) && (
        <div className="flex items-center gap-2 mt-1">
          {source.page && (
            <span className="text-[10px] text-gray-400">Page {source.page}</span>
          )}
          {source.url && (
            <a 
              href={source.url}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-blue-500 hover:underline flex items-center gap-1"
            >
              Open Link ↗
            </a>
          )}
        </div>
      )}
    </div>
  )
}

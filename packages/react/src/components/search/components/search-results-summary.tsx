'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button,
  Badge,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
  useReducedMotion,
} from '@clarity-chat/primitives'
import { Download, Check, Copy } from 'lucide-react'
import type { Message } from '@clarity-chat/types'
import type { SortOption, ExportFormat } from '../types'
import { DURATION_SECONDS as durations } from '../../../animations/constants'

// Type assertions for icons
const DownloadIcon = Download as React.ComponentType<{ className?: string }>
const CheckIcon = Check as React.ComponentType<{ className?: string }>
const CopyIcon = Copy as React.ComponentType<{ className?: string }>

export interface SearchResultsSummaryProps {
  results: Message[]
  totalMessages: number
  sortOption: SortOption
  isPending?: boolean
  enableExport?: boolean
  onExport?: (format: ExportFormat) => void
  onCopyResults?: () => void
}

/**
 * Component to display search results summary and export actions
 */
export const SearchResultsSummary = React.memo(function SearchResultsSummary({
  results,
  totalMessages,
  sortOption,
  isPending = false,
  enableExport = true,
  onExport,
  onCopyResults,
}: SearchResultsSummaryProps) {
  const prefersReducedMotion = useReducedMotion()
  const [copied, setCopied] = React.useState(false)
  const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const handleCopy = React.useCallback(() => {
    onCopyResults?.()
    setCopied(true)

    // Clear any existing timeout before setting a new one
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current)
    }

    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false)
      copyTimeoutRef.current = null
    }, 2000)
  }, [onCopyResults])

  return prefersReducedMotion ? (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span
          className={cn(
            'inline-block w-2 h-2 rounded-full',
            results.length > 0 ? 'bg-green-500' : 'bg-amber-500'
          )}
        />
        <span>
          Found <span className="font-semibold text-foreground">{results.length}</span> of{' '}
          {totalMessages} messages
        </span>
        {sortOption !== 'relevance' && (
          <Badge variant="outline" className="text-xs">
            Sorted by {sortOption}
          </Badge>
        )}
      </div>

      {/* Export Actions */}
      {enableExport && results.length > 0 && onExport && onCopyResults && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 text-xs gap-1"
          >
            {copied ? (
              <CheckIcon className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <CopyIcon className="h-3.5 w-3.5" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                <DownloadIcon className="h-3.5 w-3.5" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="space-y-1">
                {(['json', 'csv', 'md'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => onExport(format)}
                    className="w-full px-2 py-1.5 text-sm text-left rounded hover:bg-accent flex items-center justify-between"
                  >
                    Export as .{format}
                    <Badge variant="outline" className="text-[10px]">
                      {format.toUpperCase()}
                    </Badge>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  ) : (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        viewport={{ once: true }}
        className="flex items-center justify-between text-sm"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <motion.span
            className={cn(
              'inline-block w-2 h-2 rounded-full',
              results.length > 0 ? 'bg-green-500' : 'bg-amber-500'
            )}
            animate={isPending ? { scale: [1, 1.2, 1] } : {}}
            transition={{
              duration: durations.slower,
              repeat: isPending ? Infinity : 0,
            }}
            viewport={{ once: true }}
          />
          <span>
            Found{' '}
            <motion.span
              key={results.length}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              viewport={{ once: true }}
              className="font-semibold text-foreground"
            >
              {results.length}
            </motion.span>{' '}
            of {totalMessages} messages
          </span>
          {sortOption !== 'relevance' && (
            <Badge variant="outline" className="text-xs">
              Sorted by {sortOption}
            </Badge>
          )}
        </div>

        {/* Export Actions */}
        {enableExport && results.length > 0 && onExport && onCopyResults && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 text-xs gap-1"
            >
              {copied ? (
                <CheckIcon className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <CopyIcon className="h-3.5 w-3.5" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <DownloadIcon className="h-3.5 w-3.5" />
                  Export
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                <div className="space-y-1">
                  {(['json', 'csv', 'md'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => onExport(format)}
                      className="w-full px-2 py-1.5 text-sm text-left rounded hover:bg-accent flex items-center justify-between"
                    >
                      Export as .{format}
                      <Badge variant="outline" className="text-[10px]">
                        {format.toUpperCase()}
                      </Badge>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
})

SearchResultsSummary.displayName = 'SearchResultsSummary'

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Button,
  Badge,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import { ANIMATION_PRESETS } from '../../../animations/constants'
import { Clock } from 'lucide-react'
import type { SearchHistoryEntry } from '../AdvancedMessageSearchSemantic.types'

const ClockIcon = Clock as React.ComponentType<{ className?: string }>

export interface SearchHistoryPanelProps {
  /** Search history entries */
  searchHistory: SearchHistoryEntry[]
  /** Current panel state */
  isOpen: boolean
  /** State change handler */
  onOpenChange: (open: boolean) => void
  /** Handler for selecting a history entry */
  onSelectEntry: (query: string) => void
  /** Handler for clearing history */
  onClearHistory: () => void
}

/**
 * SearchHistoryPanel Component
 *
 * Displays recent search queries with result counts
 */
export function SearchHistoryPanel({
  searchHistory,
  isOpen,
  onOpenChange,
  onSelectEntry,
  onClearHistory,
}: SearchHistoryPanelProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 w-7 p-0 ${searchHistory.length > 0 ? 'text-violet-500' : ''}`}
        >
          <ClockIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Recent Searches</h4>
            {searchHistory.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearHistory}
                className="h-6 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear
              </Button>
            )}
          </div>
          {searchHistory.length > 0 ? (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {searchHistory.map((entry, index) => (
                <motion.button
                  key={index}
                  {...ANIMATION_PRESETS.slideLeft}
                  transition={{ delay: index * 0.03 }}
                  viewport={{ once: true }}
                  onClick={() => onSelectEntry(entry.query)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-accent flex items-center justify-between"
                >
                  <span className="text-sm truncate">{entry.query}</span>
                  <Badge variant="secondary" className="text-xs">
                    {entry.resultCount}
                  </Badge>
                </motion.button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent searches
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

SearchHistoryPanel.displayName = 'SearchHistoryPanel'

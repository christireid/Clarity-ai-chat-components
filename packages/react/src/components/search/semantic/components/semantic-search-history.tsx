'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Badge,
  useReducedMotion,
} from '@clarity-chat/primitives'
import { Clock } from 'lucide-react'
import type { SearchHistoryEntry } from '../../shared/types'
import { ANIMATION_PRESETS } from '../../../../animations/constants'

// Type assertions for icons
const ClockIcon = Clock as React.ComponentType<{ className?: string }>

export interface SemanticSearchHistoryProps {
  history: SearchHistoryEntry[]
  onSelectQuery: (query: string) => void
  onClearHistory: () => void
}

export function SemanticSearchHistory({
  history,
  onSelectQuery,
  onClearHistory,
}: SemanticSearchHistoryProps) {
  const [showHistory, setShowHistory] = React.useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <Popover open={showHistory} onOpenChange={setShowHistory}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 w-7 p-0 ${history.length > 0 ? 'text-violet-500' : ''}`}
        >
          <ClockIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Recent Searches</h4>
            {history.length > 0 && (
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
          {history.length > 0 ? (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {prefersReducedMotion ? (
                history.map((entry, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onSelectQuery(entry.query)
                      setShowHistory(false)
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-accent flex items-center justify-between"
                  >
                    <span className="text-sm truncate">{entry.query}</span>
                    <Badge variant="secondary" className="text-xs">
                      {entry.resultCount}
                    </Badge>
                  </button>
                ))
              ) : (
                history.map((entry, index) => (
                  <motion.button
                    key={index}
                    {...ANIMATION_PRESETS.slideLeft}
                    transition={{ delay: index * 0.03 }}
                    viewport={{ once: true }}
                    onClick={() => {
                      onSelectQuery(entry.query)
                      setShowHistory(false)
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-accent flex items-center justify-between"
                  >
                    <span className="text-sm truncate">{entry.query}</span>
                    <Badge variant="secondary" className="text-xs">
                      {entry.resultCount}
                    </Badge>
                  </motion.button>
                ))
              )}
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

SemanticSearchHistory.displayName = 'SemanticSearchHistory'

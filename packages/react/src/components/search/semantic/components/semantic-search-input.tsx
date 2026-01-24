'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Button, cn } from '@clarity-chat/primitives'
import { Search, X } from 'lucide-react'
import { DURATION_SECONDS as durations } from '../../../../animations/constants'

// Type assertions for icons
const SearchIcon = Search as React.ComponentType<{ className?: string }>
const XIcon = X as React.ComponentType<{ className?: string }>

export interface SemanticSearchInputProps {
  query: string
  onQueryChange: (query: string) => void
  placeholder?: string
  isSearching?: boolean
  disabled?: boolean
  compact?: boolean
  children?: React.ReactNode
}

export const SemanticSearchInput = React.forwardRef<
  HTMLInputElement,
  SemanticSearchInputProps
>(
  (
    {
      query,
      onQueryChange,
      placeholder = 'Search semantically...',
      isSearching = false,
      disabled = false,
      compact = false,
      children,
    },
    ref
  ) => {
    return (
      <div className="relative">
        <div className="relative group">
          <motion.div
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors z-10',
              query && 'text-violet-500'
            )}
            animate={isSearching ? { scale: [1, 1.1, 1] } : {}}
            transition={{
              duration: durations.slower,
              repeat: isSearching ? Infinity : 0,
            }}
          >
            <SearchIcon className="h-4 w-4" />
          </motion.div>

          <Input
            ref={ref}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'pl-9 pr-24 h-11 transition-all duration-200 border-2',
              'focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20',
              'bg-gradient-to-r from-background to-muted/30'
            )}
            disabled={disabled || isSearching}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onQueryChange('')
                if (ref && 'current' in ref && ref.current) {
                  ref.current.blur()
                }
              }
            }}
          />

          {/* Right controls */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Loading indicator */}
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="h-4 w-4 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin"
                />
              )}
            </AnimatePresence>

            {/* Clear button */}
            <AnimatePresence>
              {query && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onQueryChange('')}
                    className="h-6 w-6 p-0 hover:bg-transparent hover:text-destructive"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Additional controls (history, config, etc.) */}
            {children}
          </div>
        </div>

        {/* Progress bar */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted overflow-hidden rounded-b-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: durations.slower,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

SemanticSearchInput.displayName = 'SemanticSearchInput'

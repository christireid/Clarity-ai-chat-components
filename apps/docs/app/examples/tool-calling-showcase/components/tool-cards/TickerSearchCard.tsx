'use client'

/**
 * TickerSearchCard Component
 *
 * Displays search results for stock ticker symbols with
 * animated entrance and interactive hover states.
 * Enhanced with keyboard navigation for accessibility.
 */

import { useRef, useState, useCallback, useEffect, memo } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, Building2, Bitcoin } from 'lucide-react'
import type { TickerSearchResult, TickerMatch } from '../../lib/types'

interface TickerSearchCardProps {
  data: TickerSearchResult
  onSelect?: (symbol: string) => void
  isLoading?: boolean
}

const typeIcons: Record<string, React.ReactNode> = {
  stock: <Building2 className="w-4 h-4" />,
  etf: <TrendingUp className="w-4 h-4" />,
  crypto: <Bitcoin className="w-4 h-4" />,
}

const typeColors: Record<string, string> = {
  stock: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  etf: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  crypto: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
}

function MatchScoreBadge({ score }: { score: number }) {
  const getScoreColor = () => {
    if (score >= 150) return 'bg-green-500/20 text-green-700 dark:text-green-400'
    if (score >= 100) return 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
    if (score >= 50) return 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
    return 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
  }

  const getScoreLabel = () => {
    if (score >= 150) return 'Exact'
    if (score >= 100) return 'High'
    if (score >= 50) return 'Good'
    return 'Partial'
  }

  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getScoreColor()}`}>
      {getScoreLabel()}
    </span>
  )
}

interface TickerItemProps {
  match: TickerMatch
  index: number
  onSelect?: (symbol: string) => void
  isFocused?: boolean
  onFocus?: () => void
}

function TickerItem({ match, index, onSelect, isFocused, onFocus }: TickerItemProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Auto-focus when isFocused changes (keyboard navigation)
  useEffect(() => {
    if (isFocused && buttonRef.current) {
      buttonRef.current.focus()
    }
  }, [isFocused])

  return (
    <motion.button
      ref={buttonRef}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.08,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      onClick={() => onSelect?.(match.symbol)}
      onFocus={onFocus}
      role="option"
      aria-selected={isFocused}
      aria-label={`${match.symbol} - ${match.name}, ${match.type} on ${match.exchange}. Press Enter to analyze.`}
      className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5
                 hover:bg-blue-50 dark:hover:bg-blue-500/10
                 focus:bg-blue-50 dark:focus:bg-blue-500/10
                 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30
                 focus:border-blue-300 dark:focus:border-blue-500/50
                 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                 transition-all duration-150 group text-left"
    >
      {/* Type Icon */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[match.type]}`}
        aria-hidden="true"
      >
        {typeIcons[match.type]}
      </div>

      {/* Symbol & Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground group-hover:text-blue-600 group-focus:text-blue-600 dark:group-hover:text-blue-400 dark:group-focus:text-blue-400 transition-colors">
            {match.symbol}
          </span>
          <MatchScoreBadge score={match.matchScore} />
        </div>
        <div className="text-sm text-muted-foreground truncate">{match.name}</div>
        <div className="text-xs text-muted-foreground/70">{match.exchange}</div>
      </div>

      {/* Action Hint */}
      <div className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity" aria-hidden="true">
        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Analyze →</span>
      </div>
    </motion.button>
  )
}

export const TickerSearchCard = memo(function TickerSearchCard({ data, onSelect, isLoading }: TickerSearchCardProps) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const listRef = useRef<HTMLDivElement>(null)

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (data.matches.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) => (prev < data.matches.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : data.matches.length - 1))
          break
        case 'Home':
          e.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          e.preventDefault()
          setFocusedIndex(data.matches.length - 1)
          break
        case 'Enter':
          if (focusedIndex >= 0 && focusedIndex < data.matches.length) {
            e.preventDefault()
            onSelect?.(data.matches[focusedIndex].symbol)
          }
          break
      }
    },
    [data.matches, focusedIndex, onSelect]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="rounded-xl border border-blue-200 dark:border-blue-500/30
                 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50
                 overflow-hidden shadow-sm"
      role="region"
      aria-label="Ticker search results"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-blue-200/50 dark:border-blue-500/20 bg-white/50 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-sm" aria-hidden="true">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h4 id="ticker-results-title" className="font-semibold text-sm text-foreground">Ticker Search Results</h4>
            <p className="text-xs text-muted-foreground">
              Found {data.matches.length} match{data.matches.length !== 1 ? 'es' : ''} for "
              {data.query}"
            </p>
          </div>
        </div>
      </div>

      {/* Results - Listbox pattern for accessibility */}
      <div
        ref={listRef}
        className="p-3 space-y-2"
        role="listbox"
        aria-labelledby="ticker-results-title"
        aria-activedescendant={focusedIndex >= 0 ? `ticker-option-${data.matches[focusedIndex]?.symbol}` : undefined}
        onKeyDown={handleKeyDown}
        tabIndex={data.matches.length > 0 ? 0 : -1}
      >
        {data.matches.length > 0 ? (
          data.matches.map((match, index) => (
            <TickerItem
              key={match.symbol}
              match={match}
              index={index}
              onSelect={onSelect}
              isFocused={focusedIndex === index}
              onFocus={() => setFocusedIndex(index)}
            />
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm" role="status">
            No matches found. Try a different search term.
          </div>
        )}
      </div>

      {/* Footer Hint */}
      {data.matches.length > 0 && (
        <div className="px-4 py-2 bg-blue-500/5 border-t border-blue-200/50 dark:border-blue-500/20">
          <p className="text-xs text-muted-foreground text-center">
            Use arrow keys to navigate, Enter to select
          </p>
        </div>
      )}
    </motion.div>
  )
})

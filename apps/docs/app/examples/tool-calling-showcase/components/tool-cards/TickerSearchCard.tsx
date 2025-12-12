'use client'

/**
 * TickerSearchCard Component
 *
 * Displays search results for stock ticker symbols with
 * animated entrance and interactive hover states.
 */

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

function TickerItem({
  match,
  index,
  onSelect,
}: {
  match: TickerMatch
  index: number
  onSelect?: (symbol: string) => void
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.08,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      onClick={() => onSelect?.(match.symbol)}
      className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5
                 hover:bg-blue-50 dark:hover:bg-blue-500/10
                 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30
                 transition-all duration-150 group text-left"
    >
      {/* Type Icon */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[match.type]}`}
      >
        {typeIcons[match.type]}
      </div>

      {/* Symbol & Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {match.symbol}
          </span>
          <MatchScoreBadge score={match.matchScore} />
        </div>
        <div className="text-sm text-muted-foreground truncate">{match.name}</div>
        <div className="text-xs text-muted-foreground/70">{match.exchange}</div>
      </div>

      {/* Action Hint */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Analyze →</span>
      </div>
    </motion.button>
  )
}

export function TickerSearchCard({ data, onSelect, isLoading }: TickerSearchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="rounded-xl border border-blue-200 dark:border-blue-500/30
                 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50
                 overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-blue-200/50 dark:border-blue-500/20 bg-white/50 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-sm">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground">Ticker Search Results</h4>
            <p className="text-xs text-muted-foreground">
              Found {data.matches.length} match{data.matches.length !== 1 ? 'es' : ''} for "
              {data.query}"
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-3 space-y-2">
        {data.matches.length > 0 ? (
          data.matches.map((match, index) => (
            <TickerItem key={match.symbol} match={match} index={index} onSelect={onSelect} />
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm">
            No matches found. Try a different search term.
          </div>
        )}
      </div>

      {/* Footer Hint */}
      {data.matches.length > 0 && (
        <div className="px-4 py-2 bg-blue-500/5 border-t border-blue-200/50 dark:border-blue-500/20">
          <p className="text-xs text-muted-foreground text-center">
            Click a ticker to analyze its financials
          </p>
        </div>
      )}
    </motion.div>
  )
}

TickerSearchCard.displayName = 'TickerSearchCard'

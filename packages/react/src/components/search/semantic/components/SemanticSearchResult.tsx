'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  Badge,
  Button,
  cn,
  useReducedMotion,
} from '@clarity-chat/primitives'
import { Copy, Check, Eye, EyeOff, Brain, Search, Zap } from 'lucide-react'
import type { SemanticSearchResult } from '../types'
import { getMatchQuality } from '../utils'

// Type assertions for icons
const CopyIcon = Copy as React.ComponentType<{ className?: string }>
const CheckIcon = Check as React.ComponentType<{ className?: string }>
const EyeIcon = Eye as React.ComponentType<{ className?: string }>
const EyeOffIcon = EyeOff as React.ComponentType<{ className?: string }>
const BrainIcon = Brain as React.ComponentType<{ className?: string }>
const SearchIcon = Search as React.ComponentType<{ className?: string }>
const ZapIcon = Zap as React.ComponentType<{ className?: string }>

export interface SemanticSearchResultProps {
  result: SemanticSearchResult
  index: number
  isExpanded: boolean
  isCopied: boolean
  onExpand: () => void
  onCopy: () => void
  onSelect?: () => void
}

export function SemanticSearchResultCard({
  result,
  index,
  isExpanded,
  isCopied,
  onExpand,
  onCopy,
  onSelect,
}: SemanticSearchResultProps) {
  const prefersReducedMotion = useReducedMotion()
  const quality = getMatchQuality(result.score, {
    target: <span className="h-3 w-3" />,
    trending: <span className="h-3 w-3" />,
    check: <CheckIcon className="h-3 w-3" />,
    lightbulb: <span className="h-3 w-3" />,
    search: <SearchIcon className="h-3 w-3" />,
  })

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      transition={{ delay: prefersReducedMotion ? 0 : index * 0.05 }}
      viewport={{ once: true }}
    >
      <Card
        className={cn(
          'shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden',
          'border-l-4',
          result.score >= 0.9
            ? 'border-l-green-500'
            : result.score >= 0.8
              ? 'border-l-emerald-500'
              : result.score >= 0.7
                ? 'border-l-blue-500'
                : result.score >= 0.6
                  ? 'border-l-yellow-500'
                  : 'border-l-orange-500'
        )}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          {/* Result header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Score badge */}
              <Badge className={cn('text-xs gap-1 text-white', quality.color)}>
                {quality.icon}
                {Math.round(result.score * 100)}%
              </Badge>

              {/* Match type badge */}
              <Badge variant="outline" className="text-xs gap-1">
                {result.matchType === 'semantic' && (
                  <BrainIcon className="h-3 w-3" />
                )}
                {result.matchType === 'keyword' && (
                  <SearchIcon className="h-3 w-3" />
                )}
                {result.matchType === 'hybrid' && (
                  <ZapIcon className="h-3 w-3" />
                )}
                {result.matchType}
              </Badge>

              {/* Role badge */}
              <Badge variant="secondary" className="text-xs">
                {result.message.role}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onCopy()
                }}
                className="h-7 w-7 p-0"
              >
                {isCopied ? (
                  <CheckIcon className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <CopyIcon className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onExpand()
                }}
                className="h-7 w-7 p-0"
              >
                {isExpanded ? (
                  <EyeOffIcon className="h-3.5 w-3.5" />
                ) : (
                  <EyeIcon className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>

          {/* Content preview */}
          <div className={cn('text-sm mb-2', !isExpanded && 'line-clamp-2')}>
            {result.message.content}
          </div>

          {/* Highlights */}
          {result.highlights && result.highlights.length > 0 && (
            <div className="space-y-1 mt-3">
              {result.highlights.map((highlight, i) => (
                <div
                  key={i}
                  className="text-xs bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded"
                >
                  ...{highlight}...
                </div>
              ))}
            </div>
          )}

          {/* Quality indicator */}
          <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              {quality.icon}
              {quality.label} match
            </span>
            <span>{result.explanation}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

SemanticSearchResultCard.displayName = 'SemanticSearchResultCard'

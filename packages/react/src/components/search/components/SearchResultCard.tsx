'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  Badge,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { ANIMATION_PRESETS } from '../../../animations/constants'
import {
  Brain,
  Search,
  Zap,
  Copy,
  Check,
  Eye,
  EyeOff,
  Target,
  TrendingUp,
  Lightbulb,
} from 'lucide-react'
import type { SemanticSearchResult } from '../AdvancedMessageSearchSemantic.types'

// Type assertions for icons
const BrainIcon = Brain as React.ComponentType<{ className?: string }>
const SearchIcon = Search as React.ComponentType<{ className?: string }>
const ZapIcon = Zap as React.ComponentType<{ className?: string }>
const CopyIcon = Copy as React.ComponentType<{ className?: string }>
const CheckIcon = Check as React.ComponentType<{ className?: string }>
const EyeIcon = Eye as React.ComponentType<{ className?: string }>
const EyeOffIcon = EyeOff as React.ComponentType<{ className?: string }>
const TargetIcon = Target as React.ComponentType<{ className?: string }>
const TrendingIcon = TrendingUp as React.ComponentType<{ className?: string }>
const LightbulbIcon = Lightbulb as React.ComponentType<{ className?: string }>

export interface SearchResultCardProps {
  /** Search result to display */
  result: SemanticSearchResult
  /** Whether the result is expanded */
  isExpanded: boolean
  /** Whether this result is copied */
  isCopied: boolean
  /** Index for staggered animations */
  index?: number
  /** Handler for result selection */
  onSelect?: (result: SemanticSearchResult) => void
  /** Handler for copy action */
  onCopy?: (result: SemanticSearchResult) => void
  /** Handler for expand/collapse */
  onToggleExpand?: (messageId: string) => void
  /** Use animations */
  animated?: boolean
}

/**
 * Get match quality label and styling based on score
 */
function getMatchQuality(score: number): {
  label: string
  color: string
  icon: React.ReactNode
} {
  if (score >= 0.9) {
    return {
      label: 'Excellent',
      color: 'bg-green-500',
      icon: <TargetIcon className="h-3 w-3" />,
    }
  } else if (score >= 0.8) {
    return {
      label: 'Very Good',
      color: 'bg-emerald-500',
      icon: <TrendingIcon className="h-3 w-3" />,
    }
  } else if (score >= 0.7) {
    return {
      label: 'Good',
      color: 'bg-blue-500',
      icon: <CheckIcon className="h-3 w-3" />,
    }
  } else if (score >= 0.6) {
    return {
      label: 'Fair',
      color: 'bg-yellow-500',
      icon: <LightbulbIcon className="h-3 w-3" />,
    }
  }
  return {
    label: 'Partial',
    color: 'bg-orange-500',
    icon: <SearchIcon className="h-3 w-3" />,
  }
}

/**
 * Get border color based on score
 */
function getBorderColor(score: number): string {
  if (score >= 0.9) return 'border-l-green-500'
  if (score >= 0.8) return 'border-l-emerald-500'
  if (score >= 0.7) return 'border-l-blue-500'
  if (score >= 0.6) return 'border-l-yellow-500'
  return 'border-l-orange-500'
}

/**
 * SearchResultCard Component
 *
 * Displays a single search result with quality indicators, highlights, and actions
 */
export function SearchResultCard({
  result,
  isExpanded,
  isCopied,
  index = 0,
  onSelect,
  onCopy,
  onToggleExpand,
  animated = true,
}: SearchResultCardProps) {
  const quality = getMatchQuality(result.score)
  const borderColor = getBorderColor(result.score)

  const cardContent = (
    <Card
      className={cn(
        'shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden',
        'border-l-4',
        borderColor
      )}
      onClick={() => onSelect?.(result)}
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
              {result.matchType === 'hybrid' && <ZapIcon className="h-3 w-3" />}
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
                onCopy?.(result)
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
                onToggleExpand?.(result.message.id)
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
  )

  if (!animated) {
    return <div>{cardContent}</div>
  }

  return (
    <motion.div
      {...ANIMATION_PRESETS.slideLeft}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      {cardContent}
    </motion.div>
  )
}

SearchResultCard.displayName = 'SearchResultCard'

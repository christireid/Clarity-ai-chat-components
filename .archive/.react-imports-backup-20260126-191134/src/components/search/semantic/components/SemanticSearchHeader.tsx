'use client'

import * as React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import { Brain, Zap, TrendingUp, Wand2 } from 'lucide-react'
import type { SemanticSearchConfig } from '../types'

// Type assertions for icons
const BrainIcon = Brain as React.ComponentType<{ className?: string }>
const ZapIcon = Zap as React.ComponentType<{ className?: string }>
const TrendingIcon = TrendingUp as React.ComponentType<{ className?: string }>
const WandIcon = Wand2 as React.ComponentType<{ className?: string }>

export interface SemanticSearchHeaderProps {
  config: SemanticSearchConfig
  compact?: boolean
}

export function SemanticSearchHeader({
  config,
  compact,
}: SemanticSearchHeaderProps) {
  if (compact) return null

  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25">
            <BrainIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Semantic Search
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              AI-powered understanding of your queries
            </p>
          </div>
        </div>

        {/* Config badges */}
        <div className="hidden sm:flex items-center gap-1.5">
          {config.hybrid.enabled && (
            <Badge variant="secondary" className="text-xs gap-1">
              <ZapIcon className="h-3 w-3" />
              Hybrid
            </Badge>
          )}
          {config.queryExpansion && (
            <Badge variant="secondary" className="text-xs gap-1">
              <WandIcon className="h-3 w-3" />
              Expansion
            </Badge>
          )}
          {config.reranking?.enabled && (
            <Badge variant="secondary" className="text-xs gap-1">
              <TrendingIcon className="h-3 w-3" />
              Reranking
            </Badge>
          )}
        </div>
      </div>
    </CardHeader>
  )
}

SemanticSearchHeader.displayName = 'SemanticSearchHeader'

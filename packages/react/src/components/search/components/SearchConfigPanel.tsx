'use client'

import * as React from 'react'
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import { Sliders, Settings } from 'lucide-react'
import type { SemanticSearchConfig } from '../AdvancedMessageSearchSemantic.types'

const SlidersIcon = Sliders as React.ComponentType<{ className?: string }>
const SettingsIcon = Settings as React.ComponentType<{ className?: string }>

export interface SearchConfigPanelProps {
  /** Current configuration */
  config: SemanticSearchConfig
  /** Current panel state */
  isOpen: boolean
  /** State change handler */
  onOpenChange: (open: boolean) => void
  /** Configuration update handler */
  onConfigChange: (config: SemanticSearchConfig) => void
}

/**
 * SearchConfigPanel Component
 *
 * Allows users to adjust semantic search parameters
 */
export function SearchConfigPanel({
  config,
  isOpen,
  onOpenChange,
  onConfigChange,
}: SearchConfigPanelProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <SlidersIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Search Settings
          </h4>

          {/* Semantic weight slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">
                Semantic Weight
              </label>
              <span className="text-sm font-medium">
                {Math.round(config.hybrid.semanticWeight * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={config.hybrid.semanticWeight * 100}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  hybrid: {
                    ...config.hybrid,
                    semanticWeight: parseInt(e.target.value, 10) / 100,
                  },
                })
              }
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Keyword</span>
              <span>Semantic</span>
            </div>
          </div>

          {/* Similarity threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">
                Min Similarity
              </label>
              <span className="text-sm font-medium">
                {Math.round((config.similarityThreshold || 0.6) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={(config.similarityThreshold || 0.6) * 100}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  similarityThreshold: parseInt(e.target.value, 10) / 100,
                })
              }
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
          </div>

          {/* Max results */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Max Results</label>
            <Input
              type="number"
              min="1"
              max="50"
              value={config.maxResults || 10}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  maxResults: parseInt(e.target.value, 10) || 10,
                })
              }
              className="h-8"
            />
          </div>

          {/* Toggle options */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.queryExpansion}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    queryExpansion: e.target.checked,
                  })
                }
                className="rounded"
              />
              <span className="text-sm">Query Expansion</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.hybrid.enabled}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    hybrid: {
                      ...config.hybrid,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="rounded"
              />
              <span className="text-sm">Hybrid Search</span>
            </label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

SearchConfigPanel.displayName = 'SearchConfigPanel'

/**
 * Model Selector Component
 * 
 * Dropdown to switch between AI models with metrics (speed, cost, quality)
 */

"use client"

import * as React from "react"
import {
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@clarity-chat/primitives"
import type { ModelConfig, ModelInfo } from '../adapters/types'

export interface ModelSelectorProps {
  /** Available models */
  models: ModelInfo[]
  /** Currently selected model ID */
  value: string
  /** Callback when model is selected */
  onChange: (modelId: string, config: ModelConfig) => void
  /** Additional CSS class */
  className?: string
  /** Show speed/cost/quality badges */
  showMetrics?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Show extended info */
  showDescription?: boolean
}

export function ModelSelector({
  models,
  value,
  onChange,
  className = "",
  showMetrics = true,
  disabled = false,
  showDescription = true,
}: ModelSelectorProps) {
  // Memoize selected model lookup
  const selectedModel = React.useMemo(
    () => models.find((m) => m.id === value),
    [models, value]
  )
  
  // Memoize select handler
  const handleSelect = React.useCallback(
    (modelId: string) => {
      const model = models.find((m) => m.id === modelId)
      if (!model) return
      onChange(model.id, {
        provider: model.provider,
        model: model.id,
      })
    },
    [models, onChange]
  )
  
  // Memoize badge props getter
  const getBadgeProps = React.useCallback((type: 'speed' | 'cost' | 'quality', value: string): { variant: React.ComponentProps<typeof Badge>['variant']; label: string } => {
    switch (type) {
      case 'speed':
        if (value === 'fast') return { variant: 'success', label: 'Fast' }
        if (value === 'medium') return { variant: 'warning', label: 'Moderate' }
        return { variant: 'destructive', label: 'Slow' }
      case 'cost':
        if (value === 'low') return { variant: 'success', label: 'Low cost' }
        if (value === 'medium') return { variant: 'warning', label: 'Medium cost' }
        return { variant: 'destructive', label: 'High cost' }
      case 'quality':
        if (value === 'best') return { variant: 'success', label: 'Best quality' }
        if (value === 'excellent') return { variant: 'info', label: 'Excellent' }
        return { variant: 'secondary', label: 'Good' }
      default:
        return { variant: 'secondary', label: value }
    }
  }, [])

  return (
    <Select value={value} onValueChange={handleSelect} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "h-auto w-full justify-between rounded-xl border border-border/40 bg-card/95 px-4 py-3 text-left text-sm shadow-sm transition-all duration-200 ease-out hover:border-border/60 hover:shadow-md focus:ring-2 focus:ring-ring/60 focus:ring-offset-2",
          className
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          <span className="truncate font-semibold text-foreground">
            {selectedModel?.name || "Select model"}
          </span>
          {showMetrics && selectedModel && (
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/90">
              {(["speed", "cost"] as const).map((type) => {
                const { variant, label } = getBadgeProps(
                  type,
                  selectedModel[type]
                )
                const displayValue =
                  type === "cost"
                    ? `$${selectedModel[type]}`
                    : selectedModel[type]
                return (
                  <Badge
                    key={type}
                    variant={variant}
                    className="rounded-full px-2 py-0.5 capitalize"
                    title={label}
                  >
                    {displayValue}
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
        <SelectValue
          aria-label={selectedModel?.name ?? "Select model"}
          placeholder="Select model"
          className="sr-only"
        />
      </SelectTrigger>
      <SelectContent
        className="w-[var(--radix-select-trigger-width)] rounded-2xl border border-border/40 bg-card/98 backdrop-blur-lg shadow-xl"
        align="center"
      >
        {models.map((model) => (
          <SelectItem
            key={model.id}
            value={model.id}
            className="px-0 py-0 text-foreground focus-visible:outline-none"
          >
            <div className="w-full px-4 py-3 text-left">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-foreground">
                    {model.name}
                  </span>
                  {showMetrics && (
                    <div className="flex flex-wrap gap-1.5">
                      {(["speed", "quality", "cost"] as const).map((type) => {
                        const { variant, label } = getBadgeProps(
                          type,
                          model[type]
                        )
                        const displayValue =
                          type === "cost" ? `$${model[type]}` : model[type]
                        return (
                          <Badge
                            key={type}
                            variant={variant}
                            className="rounded-full px-2 py-0.5 capitalize"
                            title={label}
                          >
                            {displayValue}
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                </div>
                {showDescription && model.description && (
                  <p className="text-sm text-muted-foreground/90">
                    {model.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/90">
                  {(model.contextWindow / 1000).toFixed(0)}K context
                  {model.vision && " · Vision"}
                  {model.toolCalling && " · Tools"}
                </p>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

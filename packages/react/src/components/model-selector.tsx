/**
 * Model Selector Component
 * 
 * Dropdown to switch between AI models with metrics (speed, cost, quality)
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Badge, Button, cn } from '@clarity-chat/primitives'
import type { ModelConfig, ModelInfo } from '../adapters/types'
import type { ComponentProps } from 'react'

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
  className = '',
  showMetrics = true,
  disabled = false,
  showDescription = true
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Memoize selected model lookup
  const selectedModel = React.useMemo(
    () => models.find(m => m.id === value),
    [models, value]
  )
  
  // Memoize select handler
  const handleSelect = React.useCallback((model: ModelInfo) => {
    onChange(model.id, {
      provider: model.provider,
      model: model.id
    })
    setIsOpen(false)
  }, [onChange])
  
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
    <div ref={containerRef} className={cn('relative', className)}>
      <Button
        type="button"
        variant="surface"
        onClick={handleToggle}
        disabled={disabled}
        className="w-full justify-between rounded-lg border border-border/50 bg-background px-4 py-3 text-left text-sm shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] hover:bg-accent"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="truncate text-foreground font-medium">
            {selectedModel?.name || 'Select model'}
          </span>
          {showMetrics && selectedModel && (
            <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              {(['speed', 'cost'] as const).map((type) => {
                const { variant, label } = getBadgeProps(type, selectedModel[type])
                const displayValue = type === 'cost' ? `$${selectedModel[type]}` : selectedModel[type]
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
        <svg
          className={cn('h-4 w-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
          <div
            role="listbox"
            className="absolute z-20 mt-2 w-full overflow-auto rounded-lg border border-border/50 bg-popover shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] backdrop-blur-sm"
          >
            {models.map((model) => (
              <button
                key={model.id}
                type="button"
                role="option"
                aria-selected={model.id === value}
                onClick={() => handleSelect(model)}
                className={cn(
                  'w-full px-4 py-3 text-left transition-colors first:rounded-t-2xl last:rounded-b-2xl',
                  model.id === value
                    ? 'bg-[hsl(var(--surface-muted))] text-foreground'
                    : 'text-muted-foreground hover:bg-[hsl(var(--surface-muted))] hover:text-foreground'
                )}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-foreground">
                      {model.name}
                    </span>
                    {showMetrics && (
                      <div className="flex flex-wrap gap-1">
                        {(['speed', 'quality', 'cost'] as const).map((type) => {
                          const { variant, label } = getBadgeProps(type, model[type])
                          const displayValue =
                            type === 'cost' ? `$${model[type]}` : model[type]
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
                    <p className="text-sm text-muted-foreground">
                      {model.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/80">
                    {(model.contextWindow / 1000).toFixed(0)}K context
                    {model.vision && ' · Vision'}
                    {model.toolCalling && ' · Tools'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

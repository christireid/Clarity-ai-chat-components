'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Sparkles, Zap, Brain, Bot } from 'lucide-react'

/**
 * ModelSelector Component
 *
 * Dropdown selector for choosing AI models with provider grouping.
 * Inspired by LibreChat and shadcn patterns.
 *
 * @example
 * ```tsx
 * <ModelSelector
 *   models={[
 *     { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', context: '128k' },
 *     { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
 *   ]}
 *   value="gpt-4o"
 *   onChange={(modelId) => setModel(modelId)}
 * />
 * ```
 */

export interface ModelInfo {
  /** Unique model identifier */
  id: string
  /** Display name */
  name: string
  /** Provider name */
  provider: string
  /** Context window size */
  context?: string
  /** Model description */
  description?: string
  /** Whether the model is recommended */
  recommended?: boolean
  /** Whether the model supports vision */
  supportsVision?: boolean
  /** Whether the model supports tools/functions */
  supportsTools?: boolean
  /** Custom icon */
  icon?: React.ReactNode
  /** Whether model is disabled */
  disabled?: boolean
}

export interface ModelSelectorProps {
  /** Available models */
  models: ModelInfo[]
  /** Currently selected model ID */
  value: string
  /** Callback when model changes */
  onChange: (modelId: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Group models by provider */
  groupByProvider?: boolean
  /** Show model capabilities */
  showCapabilities?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Additional CSS classes */
  className?: string
  /** Disabled state */
  disabled?: boolean
  /** Pass Through API for styling */
  pt?: {
    root?: React.HTMLAttributes<HTMLDivElement>
    trigger?: React.ButtonHTMLAttributes<HTMLButtonElement>
    dropdown?: React.HTMLAttributes<HTMLDivElement>
    group?: React.HTMLAttributes<HTMLDivElement>
    groupLabel?: React.HTMLAttributes<HTMLDivElement>
    option?: React.ButtonHTMLAttributes<HTMLButtonElement>
  }
}

const providerIcons: Record<string, React.ReactNode> = {
  OpenAI: <Sparkles className="h-4 w-4 text-green-500" />,
  Anthropic: <Brain className="h-4 w-4 text-orange-500" />,
  Google: <Zap className="h-4 w-4 text-blue-500" />,
  Default: <Bot className="h-4 w-4 text-muted-foreground" />,
}

const sizeClasses = {
  sm: {
    trigger: 'h-8 px-2 text-xs',
    dropdown: 'text-xs',
    icon: 'h-3 w-3',
  },
  md: {
    trigger: 'h-10 px-3 text-sm',
    dropdown: 'text-sm',
    icon: 'h-4 w-4',
  },
  lg: {
    trigger: 'h-12 px-4 text-base',
    dropdown: 'text-base',
    icon: 'h-5 w-5',
  },
}

export function ModelSelector({
  models,
  value,
  onChange,
  placeholder = 'Select a model',
  groupByProvider = true,
  showCapabilities = true,
  size = 'md',
  className = '',
  disabled = false,
  pt = {},
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sizes = sizeClasses[size]

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Get selected model
  const selectedModel = models.find((m) => m.id === value)

  // Group models by provider
  const groupedModels = React.useMemo(() => {
    if (!groupByProvider) return { '': models }

    return models.reduce(
      (acc, model) => {
        const provider = model.provider
        if (!acc[provider]) acc[provider] = []
        acc[provider].push(model)
        return acc
      },
      {} as Record<string, ModelInfo[]>
    )
  }, [models, groupByProvider])

  const getProviderIcon = (provider: string) => {
    return providerIcons[provider] || providerIcons.Default
  }

  const handleSelect = (modelId: string) => {
    onChange(modelId)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`} {...pt.root}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          ${sizes.trigger}
          w-full flex items-center justify-between gap-2
          rounded-lg border border-input bg-background
          hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-primary/50
          transition-colors
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select AI model"
        {...pt.trigger}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedModel ? (
            <>
              {selectedModel.icon || getProviderIcon(selectedModel.provider)}
              <span className="truncate font-medium">{selectedModel.name}</span>
              {selectedModel.context && (
                <span className="text-muted-foreground hidden sm:inline">
                  ({selectedModel.context})
                </span>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`${sizes.icon} text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
            ${sizes.dropdown}
            absolute z-50 mt-1 w-full min-w-[240px]
            rounded-lg border border-border bg-popover shadow-lg
            max-h-80 overflow-auto
          `}
          role="listbox"
          {...pt.dropdown}
        >
          {Object.entries(groupedModels).map(([provider, providerModels]) => (
            <div key={provider || 'default'} {...pt.group}>
              {/* Provider Group Label */}
              {provider && groupByProvider && (
                <div
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border/50"
                  {...pt.groupLabel}
                >
                  {getProviderIcon(provider)}
                  {provider}
                </div>
              )}

              {/* Model Options */}
              {providerModels.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => !model.disabled && handleSelect(model.id)}
                  disabled={model.disabled}
                  className={`
                    w-full flex items-start gap-3 px-3 py-2 text-left
                    hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed
                    focus:outline-none focus:bg-muted
                    ${model.id === value ? 'bg-muted' : ''}
                  `}
                  role="option"
                  aria-selected={model.id === value}
                  {...pt.option}
                >
                  {/* Selection Indicator */}
                  <div className="w-4 h-4 mt-0.5 shrink-0">
                    {model.id === value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>

                  {/* Model Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{model.name}</span>
                      {model.recommended && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          Recommended
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {model.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {model.description}
                      </p>
                    )}

                    {/* Capabilities */}
                    {showCapabilities && (
                      <div className="flex items-center gap-2 mt-1">
                        {model.context && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {model.context}
                          </span>
                        )}
                        {model.supportsVision && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Vision
                          </span>
                        )}
                        {model.supportsTools && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                            Tools
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ModelSelector

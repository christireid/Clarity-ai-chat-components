/**
 * Model Selector Component
 *
 * Dropdown to switch between AI models with metrics (speed, cost, quality)
 *
 * Accessibility features:
 * - Full keyboard navigation (Arrow keys, Home, End, Enter, Escape)
 * - Proper ARIA listbox pattern with aria-activedescendant
 * - Focus management and restoration
 * - Reduced motion support
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Badge, Button, cn, useReducedMotion } from '@clarity-chat/primitives'
import type { ModelConfig, ModelInfo } from '../../adapters/types'

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
  /** Accessible label for the selector */
  'aria-label'?: string
}

export function ModelSelector({
  models,
  value,
  onChange,
  className = '',
  showMetrics = true,
  disabled = false,
  showDescription = true,
  'aria-label': ariaLabel = 'Select AI model',
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const listboxRef = React.useRef<HTMLDivElement>(null)
  const optionRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())
  const prefersReducedMotion = useReducedMotion()
  const listboxId = React.useId()

  const handleToggle = React.useCallback(() => {
    if (!isOpen) {
      // Opening - set focus to currently selected item
      const selectedIndex = models.findIndex((m) => m.id === value)
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    }
    setIsOpen(!isOpen)
  }, [isOpen, models, value])

  const handleClose = React.useCallback(() => {
    setIsOpen(false)
    setFocusedIndex(-1)
    // Restore focus to trigger button
    buttonRef.current?.focus()
  }, [])

  // Memoize selected model lookup
  const selectedModel = React.useMemo(
    () => models.find((m) => m.id === value),
    [models, value]
  )

  // Memoize select handler
  const handleSelect = React.useCallback(
    (model: ModelInfo) => {
      onChange(model.id, {
        provider: model.provider,
        model: model.id,
      })
      handleClose()
    },
    [onChange, handleClose]
  )

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          handleClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) =>
            prev < models.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev))
          break
        case 'Home':
          e.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          e.preventDefault()
          setFocusedIndex(models.length - 1)
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (focusedIndex >= 0 && models[focusedIndex]) {
            handleSelect(models[focusedIndex])
          }
          break
        case 'Tab':
          // Close on tab to allow natural focus flow
          handleClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, focusedIndex, models, handleSelect, handleClose])

  // Scroll focused item into view
  React.useEffect(() => {
    if (isOpen && focusedIndex >= 0 && models[focusedIndex]) {
      const focusedOption = optionRefs.current.get(models[focusedIndex].id)
      focusedOption?.scrollIntoView({ block: 'nearest' })
    }
  }, [isOpen, focusedIndex, models])

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, handleClose])

  // Get aria-activedescendant value
  const activeDescendant =
    isOpen && focusedIndex >= 0 && models[focusedIndex]
      ? `${listboxId}-option-${models[focusedIndex].id}`
      : undefined

  // Memoize badge props getter
  const getBadgeProps = React.useCallback(
    (
      type: 'speed' | 'cost' | 'quality',
      value: string
    ): {
      variant: React.ComponentProps<typeof Badge>['variant']
      label: string
    } => {
      switch (type) {
        case 'speed':
          if (value === 'fast') return { variant: 'success', label: 'Fast' }
          if (value === 'medium')
            return { variant: 'warning', label: 'Moderate' }
          return { variant: 'destructive', label: 'Slow' }
        case 'cost':
          if (value === 'low') return { variant: 'success', label: 'Low cost' }
          if (value === 'medium')
            return { variant: 'warning', label: 'Medium cost' }
          return { variant: 'destructive', label: 'High cost' }
        case 'quality':
          if (value === 'best')
            return { variant: 'success', label: 'Best quality' }
          if (value === 'excellent')
            return { variant: 'info', label: 'Excellent' }
          return { variant: 'secondary', label: 'Good' }
        default:
          return { variant: 'secondary', label: value }
      }
    },
    []
  )

  // Animation variants respecting reduced motion
  const dropdownVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: -8, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -8, scale: 0.96 },
      }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Button
        ref={buttonRef}
        type="button"
        variant="surface"
        onClick={handleToggle}
        disabled={disabled}
        className="w-full justify-between rounded-xl border border-border/40 bg-card/95 backdrop-blur-md px-4 py-3 text-left text-sm shadow-sm hover:shadow-md hover:border-border/60 transition-all duration-200 ease-out"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeDescendant}
        aria-label={ariaLabel}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          <span className="truncate text-foreground font-semibold">
            {selectedModel?.name || 'Select model'}
          </span>
          {showMetrics && selectedModel && (
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/90">
              {(['speed', 'cost'] as const).map((type) => {
                const { variant, label } = getBadgeProps(
                  type,
                  selectedModel[type]
                )
                const displayValue =
                  type === 'cost'
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
        <svg
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={handleClose}
            aria-hidden="true"
          />
          <motion.div
            ref={listboxRef}
            id={listboxId}
            {...dropdownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    type: 'spring',
                    damping: 24,
                    stiffness: 300,
                  }
            }
            role="listbox"
            aria-label={ariaLabel}
            tabIndex={-1}
            className="absolute z-20 mt-2 w-full overflow-auto rounded-2xl border border-border/40 bg-card/98 backdrop-blur-lg shadow-xl max-h-80 focus:outline-none"
          >
            {models.map((model, index) => {
              const isSelected = model.id === value
              const isFocused = index === focusedIndex
              const optionId = `${listboxId}-option-${model.id}`

              return (
                <button
                  key={model.id}
                  id={optionId}
                  ref={(el) => {
                    if (el) optionRefs.current.set(model.id, el)
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(model)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={cn(
                    'w-full px-4 py-3.5 text-left transition-all duration-150 ease-out first:rounded-t-2xl last:rounded-b-2xl',
                    'focus:outline-none',
                    isSelected
                      ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-foreground border-l-2 border-primary'
                      : isFocused
                        ? 'bg-muted/50 text-foreground'
                        : 'text-muted-foreground/90 hover:bg-muted/30 hover:text-foreground'
                  )}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-foreground">
                        {model.name}
                      </span>
                      {showMetrics && (
                        <div className="flex flex-wrap gap-1.5">
                          {(['speed', 'quality', 'cost'] as const).map(
                            (type) => {
                              const { variant, label } = getBadgeProps(
                                type,
                                model[type]
                              )
                              const displayValue =
                                type === 'cost'
                                  ? `$${model[type]}`
                                  : model[type]
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
                            }
                          )}
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
                      {model.vision && ' · Vision'}
                      {model.toolCalling && ' · Tools'}
                    </p>
                  </div>
                </button>
              )
            })}
          </motion.div>
        </>
      )}
    </div>
  )
}

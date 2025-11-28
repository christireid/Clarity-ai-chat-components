'use client'

import * as React from 'react'
import { cn } from '../utils/cn'
import {
  type OutputPreference,
  type TaskType,
  getPreferenceConfig,
  calculateDynamicOutputLimit,
} from '../utils/dynamic-output-limit'

/**
 * Full output preference with calculated values
 */
export interface OutputPreferenceValue {
  /** Selected verbosity mode */
  mode: OutputPreference
  /** Recommended max tokens based on mode and context */
  maxTokens: number
  /** Brevity instruction to inject into system prompt */
  brevityInstruction: string
}

/**
 * Props for OutputPreferenceSelector component
 */
export interface OutputPreferenceSelectorProps {
  /** Current selected mode */
  value: OutputPreference
  /** Callback when preference changes */
  onChange: (preference: OutputPreferenceValue) => void
  /** Model's total context capacity (for token calculation) */
  modelCapacity?: number
  /** Current input token count (for token calculation) */
  inputTokens?: number
  /** Task type for more accurate calculation */
  taskType?: TaskType
  /** Show estimated token counts for each option */
  showTokenEstimate?: boolean
  /** Display mode: compact (inline) or expanded (with descriptions) */
  displayMode?: 'compact' | 'expanded'
  /** Disabled state */
  disabled?: boolean
  /** Custom CSS class */
  className?: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Configuration for each preference option
 */
interface PreferenceOption {
  value: OutputPreference
  label: string
  shortLabel: string
  description: string
  icon: React.ReactNode
}

/**
 * Icon component for preference options
 * Memoized to prevent re-renders
 */
const PreferenceIcon = React.memo(function PreferenceIcon({ type }: { type: OutputPreference }) {
  const paths: Record<OutputPreference, string> = {
    concise: 'M4 6h16M4 12h8',
    balanced: 'M4 6h16M4 12h16M4 18h12',
    detailed: 'M4 6h16M4 10h16M4 14h16M4 18h16',
  }

  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[type]} />
    </svg>
  )
})

/**
 * Preference options configuration (without JSX to prevent re-creation)
 */
const PREFERENCE_OPTIONS: Omit<PreferenceOption, 'icon'>[] = [
  {
    value: 'concise',
    label: 'Concise',
    shortLabel: 'Brief',
    description: 'Short, to-the-point responses',
  },
  {
    value: 'balanced',
    label: 'Balanced',
    shortLabel: 'Normal',
    description: 'Standard response length',
  },
  {
    value: 'detailed',
    label: 'Detailed',
    shortLabel: 'Full',
    description: 'Comprehensive explanations',
  },
]

/**
 * Valid preference values for validation
 */
const VALID_PREFERENCES = new Set<OutputPreference>(['concise', 'balanced', 'detailed'])

/**
 * Format token count for display
 */
function formatTokens(tokens: number): string {
  if (tokens <= 0) {
    return '0'
  }
  if (tokens >= 1000) {
    return `~${(tokens / 1000).toFixed(1)}K`
  }
  return `~${tokens}`
}

/**
 * Safe wrapper for calculateDynamicOutputLimit that returns fallback on error
 */
function safeCalculateOutputLimit(
  modelCapacity: number,
  inputTokens: number,
  preference: OutputPreference,
  taskType: TaskType
): { recommendedMaxTokens: number; brevityInstruction: string } {
  try {
    // Guard against invalid inputs that would throw
    const safeCapacity = Math.max(1, modelCapacity)
    const safeInputTokens = Math.max(0, inputTokens)

    return calculateDynamicOutputLimit({
      modelCapacity: safeCapacity,
      inputTokenCount: safeInputTokens,
      userPreference: preference,
      taskType,
    })
  } catch {
    // Fallback defaults if calculation fails
    const fallbackTokens: Record<OutputPreference, number> = {
      concise: 500,
      balanced: 1000,
      detailed: 2000,
    }
    return {
      recommendedMaxTokens: fallbackTokens[preference] ?? 1000,
      brevityInstruction: '',
    }
  }
}

/**
 * Output Preference Selector Component
 *
 * A UI component for users to select their preferred response verbosity.
 * Maps user preferences to technical constraints (max_tokens, brevity prompts).
 *
 * **Features:**
 * - Three clear preference options (concise, balanced, detailed)
 * - Token estimate display for context-aware choices
 * - Compact (toolbar) and expanded (settings) display modes
 * - Full keyboard accessibility
 * - Emits complete preference object with max_tokens and instructions
 *
 * **Use Cases:**
 * - Chat interface toolbar for quick verbosity selection
 * - Settings panel for default preference configuration
 * - Integration with dynamic output limit calculation
 *
 * @example
 * ```tsx
 * // Basic controlled usage
 * const [preference, setPreference] = useState<OutputPreference>('balanced')
 *
 * <OutputPreferenceSelector
 *   value={preference}
 *   onChange={(pref) => {
 *     setPreference(pref.mode)
 *     console.log('Max tokens:', pref.maxTokens)
 *     console.log('Instruction:', pref.brevityInstruction)
 *   }}
 * />
 *
 * // With token estimates
 * <OutputPreferenceSelector
 *   value={preference}
 *   onChange={handleChange}
 *   modelCapacity={128000}
 *   inputTokens={5000}
 *   showTokenEstimate={true}
 * />
 *
 * // Compact mode for toolbars
 * <OutputPreferenceSelector
 *   value={preference}
 *   onChange={handleChange}
 *   displayMode="compact"
 *   size="sm"
 * />
 * ```
 */
export function OutputPreferenceSelector({
  value,
  onChange,
  modelCapacity = 128000,
  inputTokens = 0,
  taskType = 'chat',
  showTokenEstimate = false,
  displayMode = 'expanded',
  disabled = false,
  className,
  size = 'md',
}: OutputPreferenceSelectorProps) {
  // Refs for focus management
  const buttonRefs = React.useRef<Map<OutputPreference, HTMLButtonElement>>(new Map())

  // Validate value prop and fall back to balanced if invalid
  const safeValue = VALID_PREFERENCES.has(value) ? value : 'balanced'

  // Warn in development if invalid value is passed
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !VALID_PREFERENCES.has(value)) {
      console.warn(
        `[OutputPreferenceSelector] Invalid value "${value}" passed. ` +
        'Expected one of: concise, balanced, detailed. Falling back to "balanced".'
      )
    }
  }, [value])

  /**
   * Calculate token estimate for a given preference (with error handling)
   */
  const calculateTokenEstimate = React.useCallback(
    (pref: OutputPreference): number => {
      const result = safeCalculateOutputLimit(modelCapacity, inputTokens, pref, taskType)
      return result.recommendedMaxTokens
    },
    [modelCapacity, inputTokens, taskType]
  )

  /**
   * Handle option selection (with error handling)
   */
  const handleSelect = React.useCallback(
    (selectedMode: OutputPreference, focusTarget?: HTMLButtonElement | null) => {
      if (disabled) return

      const result = safeCalculateOutputLimit(modelCapacity, inputTokens, selectedMode, taskType)

      onChange({
        mode: selectedMode,
        maxTokens: result.recommendedMaxTokens,
        brevityInstruction: result.brevityInstruction,
      })

      // Move focus to newly selected item (WAI-ARIA radiogroup pattern)
      if (focusTarget) {
        focusTarget.focus()
      }
    },
    [disabled, modelCapacity, inputTokens, taskType, onChange]
  )

  /**
   * Handle keyboard navigation with focus management
   */
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      if (disabled) return

      let newIndex = currentIndex

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          newIndex = (currentIndex + 1) % PREFERENCE_OPTIONS.length
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          newIndex = (currentIndex - 1 + PREFERENCE_OPTIONS.length) % PREFERENCE_OPTIONS.length
          break
        case 'Home':
          e.preventDefault()
          newIndex = 0
          break
        case 'End':
          e.preventDefault()
          newIndex = PREFERENCE_OPTIONS.length - 1
          break
        default:
          return
      }

      const option = PREFERENCE_OPTIONS[newIndex]
      if (option) {
        // Get the button ref for the new option to move focus
        const newButton = buttonRefs.current.get(option.value)
        handleSelect(option.value, newButton)
      }
    },
    [disabled, handleSelect]
  )

  // Size classes
  const sizeClasses = {
    sm: {
      button: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3',
      gap: 'gap-1',
    },
    md: {
      button: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-2',
    },
    lg: {
      button: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      gap: 'gap-3',
    },
  }

  const sizes = sizeClasses[size]

  // Compact mode - inline toggle buttons
  if (displayMode === 'compact') {
    return (
      <div
        className={cn('inline-flex rounded-lg border border-border bg-muted/50 p-0.5', className)}
        role="radiogroup"
        aria-label="Response length preference"
      >
        {PREFERENCE_OPTIONS.map((option, index) => {
          const isSelected = safeValue === option.value
          const tokenEstimate = showTokenEstimate ? calculateTokenEstimate(option.value) : null

          return (
            <button
              key={option.value}
              ref={(el) => {
                if (el) buttonRefs.current.set(option.value, el)
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              disabled={disabled}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'flex items-center rounded-md font-medium transition-all',
                sizes.button,
                sizes.gap,
                isSelected
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className={sizes.icon}>
                <PreferenceIcon type={option.value} />
              </span>
              <span>{size === 'sm' ? option.shortLabel : option.label}</span>
              {tokenEstimate !== null && (
                <span className="text-xs text-muted-foreground font-mono">
                  {formatTokens(tokenEstimate)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Expanded mode - cards with descriptions
  return (
    <div
      className={cn('space-y-2', className)}
      role="radiogroup"
      aria-label="Response length preference"
    >
      {PREFERENCE_OPTIONS.map((option, index) => {
        const isSelected = safeValue === option.value
        const config = getPreferenceConfig(option.value)
        const tokenEstimate = showTokenEstimate ? calculateTokenEstimate(option.value) : null

        return (
          <button
            key={option.value}
            ref={(el) => {
              if (el) buttonRefs.current.set(option.value, el)
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={disabled}
            onClick={() => handleSelect(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left',
              isSelected
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border bg-background hover:bg-muted/50 hover:border-border/80',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* Radio indicator */}
            <div
              className={cn(
                'mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                isSelected ? 'border-primary' : 'border-muted-foreground/50'
              )}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn('text-muted-foreground', isSelected && 'text-primary')}>
                  <PreferenceIcon type={option.value} />
                </span>
                <span className={cn('font-medium', isSelected && 'text-primary')}>
                  {option.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {option.description}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {config.typicalRange}
              </p>
            </div>

            {/* Token estimate */}
            {tokenEstimate !== null && (
              <div className="flex flex-col items-end text-right flex-shrink-0">
                <span className={cn(
                  'text-sm font-mono font-medium',
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {formatTokens(tokenEstimate)}
                </span>
                <span className="text-xs text-muted-foreground">tokens</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Hook for managing output preference state
 *
 * Provides a convenient way to manage output preference with
 * automatic token calculation.
 *
 * @param initialMode - Initial preference mode (default: 'balanced')
 * @param config - Configuration for token calculation
 *
 * @example
 * ```tsx
 * const {
 *   preference,
 *   setPreference,
 *   maxTokens,
 *   brevityInstruction,
 * } = useOutputPreference('balanced', {
 *   modelCapacity: 128000,
 *   inputTokens: 5000,
 * })
 *
 * // Use in API call
 * const response = await api.chat({
 *   messages,
 *   max_tokens: maxTokens,
 *   system: injectBrevityInstruction(systemPrompt, brevityInstruction),
 * })
 * ```
 */
export function useOutputPreference(
  initialMode: OutputPreference = 'balanced',
  config?: {
    modelCapacity?: number
    inputTokens?: number
    taskType?: TaskType
  }
) {
  const {
    modelCapacity = 128000,
    inputTokens = 0,
    taskType = 'chat',
  } = config ?? {}

  // Validate initial mode
  const safeInitial = VALID_PREFERENCES.has(initialMode) ? initialMode : 'balanced'
  const [mode, setMode] = React.useState<OutputPreference>(safeInitial)

  // Calculate derived values (with error handling)
  const result = React.useMemo(() => {
    const safeResult = safeCalculateOutputLimit(modelCapacity, inputTokens, mode, taskType)
    return {
      recommendedMaxTokens: safeResult.recommendedMaxTokens,
      brevityInstruction: safeResult.brevityInstruction,
      // Provide stub values for other properties to match the full result shape
      absoluteMaxTokens: Math.max(0, modelCapacity - inputTokens),
      reasoning: '',
      inputConstrained: false,
      inputUtilization: modelCapacity > 0 ? (inputTokens / modelCapacity) * 100 : 0,
    }
  }, [modelCapacity, inputTokens, mode, taskType])

  const handlePreferenceChange = React.useCallback((pref: OutputPreferenceValue) => {
    setMode(pref.mode)
  }, [])

  return {
    /** Current preference mode */
    preference: mode,
    /** Set preference mode directly */
    setPreference: setMode,
    /** Recommended max tokens */
    maxTokens: result.recommendedMaxTokens,
    /** Brevity instruction for system prompt */
    brevityInstruction: result.brevityInstruction,
    /** Full calculation result */
    result,
    /** Handler for OutputPreferenceSelector onChange */
    handlePreferenceChange,
  }
}

/**
 * Uncontrolled Output Preference Selector
 *
 * Self-managing variant that maintains its own state.
 * Useful when you only need to read the value occasionally.
 *
 * @example
 * ```tsx
 * const selectorRef = useRef<{ getValue: () => OutputPreferenceValue }>(null)
 *
 * <UncontrolledOutputPreferenceSelector
 *   ref={selectorRef}
 *   defaultValue="balanced"
 *   onValueChange={(pref) => console.log('Changed:', pref)}
 * />
 *
 * // Later, read current value
 * const current = selectorRef.current?.getValue()
 * ```
 */
export interface UncontrolledOutputPreferenceSelectorProps
  extends Omit<OutputPreferenceSelectorProps, 'value' | 'onChange'> {
  /** Default preference mode */
  defaultValue?: OutputPreference
  /** Optional callback when value changes */
  onValueChange?: (preference: OutputPreferenceValue) => void
}

export interface UncontrolledOutputPreferenceSelectorRef {
  /** Get current preference value */
  getValue: () => OutputPreferenceValue
  /** Set preference mode */
  setValue: (mode: OutputPreference) => void
}

export const UncontrolledOutputPreferenceSelector = React.forwardRef<
  UncontrolledOutputPreferenceSelectorRef,
  UncontrolledOutputPreferenceSelectorProps
>(function UncontrolledOutputPreferenceSelector(
  { defaultValue = 'balanced', onValueChange, modelCapacity = 128000, inputTokens = 0, taskType = 'chat', ...props },
  ref
) {
  // Validate default value
  const safeDefault = VALID_PREFERENCES.has(defaultValue) ? defaultValue : 'balanced'
  const [mode, setMode] = React.useState<OutputPreference>(safeDefault)

  const getCurrentValue = React.useCallback((): OutputPreferenceValue => {
    const result = safeCalculateOutputLimit(modelCapacity, inputTokens, mode, taskType)

    return {
      mode,
      maxTokens: result.recommendedMaxTokens,
      brevityInstruction: result.brevityInstruction,
    }
  }, [mode, modelCapacity, inputTokens, taskType])

  React.useImperativeHandle(ref, () => ({
    getValue: getCurrentValue,
    setValue: setMode,
  }), [getCurrentValue])

  const handleChange = React.useCallback(
    (pref: OutputPreferenceValue) => {
      setMode(pref.mode)
      onValueChange?.(pref)
    },
    [onValueChange]
  )

  return (
    <OutputPreferenceSelector
      {...props}
      value={mode}
      onChange={handleChange}
      modelCapacity={modelCapacity}
      inputTokens={inputTokens}
      taskType={taskType}
    />
  )
})

export default OutputPreferenceSelector

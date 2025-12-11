'use client'

import * as React from 'react'

/**
 * Options for the useAnimatedValue hook
 */
export interface UseAnimatedValueOptions {
  /** Animation duration in milliseconds (default: 500) */
  duration?: number
  /** Easing function name (default: 'easeOut') */
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
  /** Decimal places for number formatting (default: 0) */
  decimals?: number
  /** Prefix string (e.g., '$') */
  prefix?: string
  /** Suffix string (e.g., '%', 'ms') */
  suffix?: string
  /** Whether to animate (respects reduced motion by default) */
  animate?: boolean
  /** Callback when animation completes */
  onAnimationComplete?: (value: number) => void
}

/**
 * Result of useAnimatedValue hook
 */
export interface AnimatedValueResult {
  /** The current displayed value (animated) */
  displayValue: number
  /** The formatted string with prefix/suffix */
  formattedValue: string
  /** Whether animation is currently running */
  isAnimating: boolean
  /** The target value */
  targetValue: number
  /** The direction of change ('up', 'down', or 'none') */
  direction: 'up' | 'down' | 'none'
  /** Props to spread on the element for accessibility */
  ariaProps: {
    'aria-live': 'polite'
    'aria-atomic': 'true'
  }
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
}

/**
 * Hook for animating numeric value changes with smooth transitions.
 *
 * Useful for dashboard metrics that update in real-time, providing
 * visual feedback when values change. Respects prefers-reduced-motion.
 *
 * @example
 * ```tsx
 * function TokenCounter({ tokens }: { tokens: number }) {
 *   const { formattedValue, direction, ariaProps } = useAnimatedValue(tokens, {
 *     duration: 300,
 *     suffix: ' tokens',
 *   })
 *
 *   return (
 *     <span
 *       {...ariaProps}
 *       className={cn(
 *         direction === 'up' && 'text-green-500',
 *         direction === 'down' && 'text-red-500'
 *       )}
 *     >
 *       {formattedValue}
 *     </span>
 *   )
 * }
 * ```
 */
export function useAnimatedValue(
  value: number,
  options: UseAnimatedValueOptions = {}
): AnimatedValueResult {
  const {
    duration = 500,
    easing = 'easeOut',
    decimals = 0,
    prefix = '',
    suffix = '',
    animate = true,
    onAnimationComplete,
  } = options

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const shouldAnimate = animate && !prefersReducedMotion

  const [displayValue, setDisplayValue] = React.useState(value)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [direction, setDirection] = React.useState<'up' | 'down' | 'none'>(
    'none'
  )

  const previousValueRef = React.useRef(value)
  const animationFrameRef = React.useRef<number | null>(null)
  const startTimeRef = React.useRef<number | null>(null)
  const startValueRef = React.useRef(value)

  React.useEffect(() => {
    const previousValue = previousValueRef.current

    // Determine direction
    if (value > previousValue) {
      setDirection('up')
    } else if (value < previousValue) {
      setDirection('down')
    } else {
      setDirection('none')
    }

    // Update previous value ref
    previousValueRef.current = value

    // If not animating or value hasn't changed, just set directly
    if (!shouldAnimate || value === displayValue) {
      setDisplayValue(value)
      return
    }

    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // Start animation
    setIsAnimating(true)
    startTimeRef.current = null
    startValueRef.current = displayValue

    const easingFn = easingFunctions[easing]

    const animateFrame = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easingFn(progress)

      const currentValue =
        startValueRef.current + (value - startValueRef.current) * easedProgress

      setDisplayValue(currentValue)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateFrame)
      } else {
        setIsAnimating(false)
        setDisplayValue(value)
        onAnimationComplete?.(value)

        // Reset direction after animation completes
        setTimeout(() => setDirection('none'), 100)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animateFrame)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [value, duration, easing, shouldAnimate, onAnimationComplete])

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const formattedValue = React.useMemo(() => {
    const formatted = displayValue.toFixed(decimals)
    return `${prefix}${formatted}${suffix}`
  }, [displayValue, decimals, prefix, suffix])

  return {
    displayValue,
    formattedValue,
    isAnimating,
    targetValue: value,
    direction,
    ariaProps: {
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
  }
}

/**
 * Props for AnimatedNumber component
 */
export interface AnimatedNumberProps extends UseAnimatedValueOptions {
  /** The number value to display */
  value: number
  /** CSS class name */
  className?: string
  /** Whether to highlight increases in green and decreases in red */
  highlightChange?: boolean
  /** Custom render function for the number */
  render?: (result: AnimatedValueResult) => React.ReactNode
}

/**
 * Component that displays an animated number with optional change highlighting.
 *
 * @example
 * ```tsx
 * <AnimatedNumber
 *   value={tokenCount}
 *   suffix=" tokens"
 *   highlightChange
 *   duration={300}
 * />
 * ```
 */
export function AnimatedNumber({
  value,
  className,
  highlightChange = false,
  render,
  ...options
}: AnimatedNumberProps): React.ReactElement {
  const result = useAnimatedValue(value, options)

  if (render) {
    return <>{render(result)}</>
  }

  const highlightClass =
    highlightChange && result.direction !== 'none'
      ? result.direction === 'up'
        ? 'text-green-600 dark:text-green-400'
        : 'text-red-600 dark:text-red-400'
      : ''

  return (
    <span
      {...result.ariaProps}
      className={`${highlightClass} ${className || ''} ${
        result.isAnimating ? 'transition-colors duration-200' : ''
      }`.trim()}
    >
      {result.formattedValue}
    </span>
  )
}

AnimatedNumber.displayName = 'AnimatedNumber'

/**
 * Hook for tracking and highlighting value changes over time.
 *
 * Useful for showing trends and changes in dashboard metrics.
 *
 * @example
 * ```tsx
 * function MetricCard({ value, label }: Props) {
 *   const { changePercent, trend, flash } = useValueChange(value)
 *
 *   return (
 *     <div className={flash ? 'animate-pulse' : ''}>
 *       <span className="text-2xl font-bold">{value}</span>
 *       {trend !== 'stable' && (
 *         <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
 *           {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
 *         </span>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useValueChange(
  value: number,
  options: {
    /** Duration to show flash highlight (ms) */
    flashDuration?: number
    /** Minimum change percentage to trigger highlight */
    threshold?: number
  } = {}
): {
  /** Previous value */
  previousValue: number
  /** Absolute change */
  change: number
  /** Percentage change */
  changePercent: number
  /** Trend direction */
  trend: 'up' | 'down' | 'stable'
  /** Whether currently flashing (just changed) */
  flash: boolean
} {
  const { flashDuration = 500, threshold = 0.1 } = options

  const previousValueRef = React.useRef(value)
  const [previousValue, setPreviousValue] = React.useState(value)
  const [flash, setFlash] = React.useState(false)

  React.useEffect(() => {
    const prev = previousValueRef.current

    if (prev !== value) {
      setPreviousValue(prev)
      previousValueRef.current = value

      // Trigger flash
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), flashDuration)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [value, flashDuration])

  const change = value - previousValue
  const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0

  let trend: 'up' | 'down' | 'stable' = 'stable'
  if (Math.abs(changePercent) >= threshold) {
    trend = change > 0 ? 'up' : 'down'
  }

  return {
    previousValue,
    change,
    changePercent,
    trend,
    flash,
  }
}

/**
 * Props for FlashingValue component
 */
export interface FlashingValueProps {
  /** The value to display */
  value: number | string
  /** CSS class name */
  className?: string
  /** Class to apply during flash */
  flashClassName?: string
  /** Duration of flash in ms */
  flashDuration?: number
  /** Children to render (overrides value) */
  children?: React.ReactNode
}

/**
 * Component that flashes when its value changes.
 *
 * @example
 * ```tsx
 * <FlashingValue
 *   value={messageCount}
 *   flashClassName="bg-yellow-200 dark:bg-yellow-800"
 * >
 *   {messageCount} messages
 * </FlashingValue>
 * ```
 */
export function FlashingValue({
  value,
  className = '',
  flashClassName = 'bg-yellow-100 dark:bg-yellow-900/30',
  flashDuration = 500,
  children,
}: FlashingValueProps): React.ReactElement {
  const [flash, setFlash] = React.useState(false)
  const previousValueRef = React.useRef(value)

  React.useEffect(() => {
    if (previousValueRef.current !== value) {
      previousValueRef.current = value
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), flashDuration)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [value, flashDuration])

  return (
    <span
      className={`transition-colors duration-200 ${className} ${
        flash ? flashClassName : ''
      }`.trim()}
      aria-live="polite"
      aria-atomic="true"
    >
      {children ?? value}
    </span>
  )
}

FlashingValue.displayName = 'FlashingValue'

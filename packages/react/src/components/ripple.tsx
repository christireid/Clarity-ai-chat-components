/**
 * Ripple Effect Component
 * 
 * Material Design-inspired ripple effect for buttons and clickable elements.
 * Provides tactile feedback on click/tap.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ANIMATION_EASING } from '../animations/constants'

interface RippleType {
  id: number
  x: number
  y: number
  size: number
}

export interface UseRippleProps {
  /** Duration of ripple animation in ms */
  duration?: number
  /** Color of ripple (uses currentColor by default) */
  color?: string
  /** Opacity of ripple */
  opacity?: number
  /** Disabled state */
  disabled?: boolean
}

/**
 * Hook to manage ripple effect state
 */
export function useRipple({
  duration = 600,
  color,
  opacity = 0.3,
  disabled = false,
}: UseRippleProps = {}) {
  const [ripples, setRipples] = React.useState<RippleType[]>()
  const rippleIdRef = React.useRef(0)

  const addRipple = React.useCallback(
    (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
      if (disabled) return

      const target = event.currentTarget
      const rect = target.getBoundingClientRect()

      // Get click/touch position
      const x = 'touches' in event 
        ? event.touches[0].clientX - rect.left
        : event.clientX - rect.left
      const y = 'touches' in event
        ? event.touches[0].clientY - rect.top
        : event.clientY - rect.top

      // Calculate size (diameter to cover the entire element)
      const size = Math.max(rect.width, rect.height) * 2

      const ripple: RippleType = {
        id: rippleIdRef.current++,
        x,
        y,
        size,
      }

      setRipples((prev) => [...(prev || []), ripple])

      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples((prev) => prev?.filter((r) => r.id !== ripple.id))
      }, duration)
    },
    [duration, disabled]
  )

  const clearRipples = React.useCallback(() => {
    setRipples([])
  }, [])

  return {
    ripples,
    addRipple,
    clearRipples,
    rippleProps: {
      color,
      opacity,
      duration,
    },
  }
}

/**
 * Ripple component that renders individual ripples
 */
export interface RippleProps {
  /** Array of active ripples */
  ripples?: RippleType[]
  /** Color of ripples */
  color?: string
  /** Opacity of ripples */
  opacity?: number
  /** Animation duration in ms */
  duration?: number
}

export const Ripple: React.FC<RippleProps> = ({
  ripples = [],
  color,
  opacity = 0.3,
  duration = 600,
}) => {
  return (
    <span
      className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none"
      aria-hidden="true"
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: color || 'currentColor',
              opacity: opacity,
            }}
            initial={{ scale: 0, opacity: opacity }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000,
              ease: ANIMATION_EASING.out,
            }}
          />
        ))}
      </AnimatePresence>
    </span>
  )
}

/**
 * Higher-order component to add ripple effect to any clickable element
 */
export interface WithRippleProps extends UseRippleProps {
  children: React.ReactNode
  className?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  onTouchStart?: (event: React.TouchEvent<HTMLElement>) => void
}

export const WithRipple: React.FC<WithRippleProps> = ({
  children,
  className,
  onClick,
  onTouchStart,
  ...rippleProps
}) => {
  const { ripples, addRipple, rippleProps: computedRippleProps } = useRipple(rippleProps)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    addRipple(event)
    onClick?.(event)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    addRipple(event)
    onTouchStart?.(event)
  }

  return (
    <span
      className={`relative overflow-hidden ${className || ''}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
    >
      {children}
      <Ripple ripples={ripples} {...computedRippleProps} />
    </span>
  )
}

/**
 * Example usage:
 * 
 * // With hook
 * const MyButton = () => {
 *   const { ripples, addRipple } = useRipple()
 *   
 *   return (
 *     <button onClick={addRipple} className="relative overflow-hidden">
 *       Click me
 *       <Ripple ripples={ripples} />
 *     </button>
 *   )
 * }
 * 
 * // With HOC
 * const MyButton = () => (
 *   <WithRipple onClick={() => console.log('clicked')}>
 *     <button>Click me</button>
 *   </WithRipple>
 * )
 */

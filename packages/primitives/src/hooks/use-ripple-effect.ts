import * as React from 'react'

export interface RippleType {
  id: number
  x: number
  y: number
  size: number
}

interface UseRippleEffectOptions {
  enabled: boolean
  onRipple?: (ripple: RippleType) => void
}

/**
 * Custom hook for managing ripple effects on buttons
 * 
 * @example
 * ```tsx
 * const { ripples, handleClick } = useRippleEffect({
 *   enabled: true,
 * })
 * ```
 */
export function useRippleEffect({ enabled, onRipple }: UseRippleEffectOptions = { enabled: true }) {
  const [ripples, setRipples] = React.useState<RippleType[]>([])
  const rippleIdRef = React.useRef(0)
  const timeoutRefsRef = React.useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const addRipple = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!enabled) return

      const button = e.currentTarget
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const size = Math.max(rect.width, rect.height) * 2

      const ripple: RippleType = {
        id: rippleIdRef.current++,
        x,
        y,
        size,
      }

      setRipples((prev) => [...prev, ripple])
      onRipple?.(ripple)

      // Remove ripple after animation
      const timeoutId = setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id))
        timeoutRefsRef.current.delete(ripple.id)
      }, 600)

      timeoutRefsRef.current.set(ripple.id, timeoutId)
    },
    [enabled, onRipple]
  )

  // Cleanup all timeouts on unmount
  React.useEffect(() => {
    const timeoutRefs = timeoutRefsRef.current
    return () => {
      timeoutRefs.forEach((timeout) => clearTimeout(timeout))
      timeoutRefs.clear()
    }
  }, [])

  return {
    ripples,
    addRipple,
  }
}

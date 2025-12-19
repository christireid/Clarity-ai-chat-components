import { useState, useRef, useCallback } from 'react'
import { useReducedMotion } from './use-reduced-motion'

export interface UseMagneticOptions {
  strength?: number
  throttleMs?: number
  disabled?: boolean
}

export interface UseMagneticReturn {
  ref: React.RefObject<HTMLDivElement | null>
  position: { x: number; y: number }
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseLeave: () => void
}

export function useMagnetic({
  strength = 0.15,
  throttleMs = 16,
  disabled = false,
}: UseMagneticOptions = {}): UseMagneticReturn {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const prefersReducedMotion = useReducedMotion()
  const lastUpdateRef = useRef<number>(0)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || prefersReducedMotion || !ref.current) {
        return
      }

      const now = Date.now()
      if (now - lastUpdateRef.current < throttleMs) {
        return
      }
      lastUpdateRef.current = now

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      setPosition({ x: deltaX, y: deltaY })
    },
    [disabled, prefersReducedMotion, strength, throttleMs]
  )

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  return {
    ref,
    position,
    handleMouseMove,
    handleMouseLeave,
  }
}

import { useRef, useState, useCallback, useEffect } from 'react'
import { throttle } from '@clarity-chat/utils'
import { useReducedMotion } from './use-reduced-motion'

export interface UseMagneticOptions {
  strength?: number
  throttleMs?: number
  disabled?: boolean
}

export function useMagnetic({ strength = 0.15, throttleMs = 16, disabled = false }: UseMagneticOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const prefersReducedMotion = useReducedMotion()
  
  // Disable effect if explicitly disabled OR user prefers reduced motion
  const isEffectActive = !disabled && !prefersReducedMotion

  // Create throttled handler
  const handleMouseMove = useCallback(
    throttle((e: React.MouseEvent) => {
      if (!isEffectActive) return

      const { clientX, clientY } = e
      const rect = ref.current?.getBoundingClientRect()
      
      if (!rect) return

      const { left, top, width, height } = rect
      const x = clientX - (left + width / 2)
      const y = clientY - (top + height / 2)
      
      setPosition({ x: x * strength, y: y * strength })
    }, throttleMs),
    [strength, throttleMs, isEffectActive]
  )

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  // Reset position if effect becomes disabled (e.g. user changes system prefs)
  useEffect(() => {
    if (!isEffectActive) {
      setPosition({ x: 0, y: 0 })
    }
  }, [isEffectActive])

  return {
    ref,
    position,
    handleMouseMove,
    handleMouseLeave
  }
}

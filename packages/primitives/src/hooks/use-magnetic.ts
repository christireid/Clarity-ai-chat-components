import { useRef, useState, useCallback } from 'react'
import { throttle } from '@clarity-chat/utils'

export interface UseMagneticOptions {
  strength?: number
  throttleMs?: number
}

export function useMagnetic({ strength = 0.15, throttleMs = 16 }: UseMagneticOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Create throttled handler
  const handleMouseMove = useCallback(
    throttle((e: React.MouseEvent) => {
      const { clientX, clientY } = e
      const rect = ref.current?.getBoundingClientRect()
      
      if (!rect) return

      const { left, top, width, height } = rect
      const x = clientX - (left + width / 2)
      const y = clientY - (top + height / 2)
      
      setPosition({ x: x * strength, y: y * strength })
    }, throttleMs),
    [strength, throttleMs]
  )

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  return {
    ref,
    position,
    handleMouseMove,
    handleMouseLeave
  }
}

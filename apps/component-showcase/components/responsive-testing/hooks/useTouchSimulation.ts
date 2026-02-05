'use client'

import { useEffect, useCallback, useState } from 'react'

interface TouchSimulationOptions {
  enabled: boolean
  feedbackDuration?: number
  showVisualFeedback?: boolean
}

export function useTouchSimulation({
  enabled,
  feedbackDuration = 300,
  showVisualFeedback = true,
}: TouchSimulationOptions) {
  const [touchPoints, setTouchPoints] = useState<{ id: string; x: number; y: number }[]>([])

  const simulateTouchEvent = useCallback(
    (e: MouseEvent, type: 'touchstart' | 'touchmove' | 'touchend') => {
      if (!enabled) return

      const touch = {
        identifier: 0,
        target: e.target,
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        screenX: e.screenX,
        screenY: e.screenY,
        radiusX: 20,
        radiusY: 20,
        rotationAngle: 0,
        force: 1,
      }

      const touchEvent = new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches: type === 'touchend' ? [] : [touch as any],
        targetTouches: type === 'touchend' ? [] : [touch as any],
        changedTouches: [touch as any],
      })

      e.target?.dispatchEvent(touchEvent)

      // Visual feedback
      if (showVisualFeedback && type === 'touchstart') {
        const id = Math.random().toString(36).substr(2, 9)
        setTouchPoints((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])

        setTimeout(() => {
          setTouchPoints((prev) => prev.filter((p) => p.id !== id))
        }, feedbackDuration)
      }
    },
    [enabled, showVisualFeedback, feedbackDuration]
  )

  useEffect(() => {
    if (!enabled) return

    const handleMouseDown = (e: MouseEvent) => {
      simulateTouchEvent(e, 'touchstart')
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons === 1) {
        simulateTouchEvent(e, 'touchmove')
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      simulateTouchEvent(e, 'touchend')
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [enabled, simulateTouchEvent])

  return {
    touchPoints,
  }
}

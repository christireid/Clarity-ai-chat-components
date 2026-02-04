/**
 * Micro-Interaction Enhancements
 */

import * as React from 'react'
import { durations } from '../utils'
import type { MicroInteractionSkeletonProps } from '../types'

export const MicroInteractionSkeleton: React.FC<
  MicroInteractionSkeletonProps
> = ({
  children,
  interactions = [
    { type: 'hover', effect: 'pulse', duration: durations.slower },
    { type: 'focus', effect: 'glow', duration: durations.slower },
  ],
  enableSound = false,
  enableHaptics = false,
}) => {
  const elementRef = React.useRef<HTMLDivElement>(null)

  const playInteractionSound = React.useCallback(
    (effect: string) => {
      if (!enableSound) return

      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different frequencies for different effects
      const frequencies = {
        pulse: 440,
        glow: 523,
        scale: 659,
        shake: 294,
      }

      oscillator.frequency.setValueAtTime(
        frequencies[effect as keyof typeof frequencies] || 440,
        audioContext.currentTime
      )
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      )

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    },
    [enableSound]
  )

  React.useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current
    const eventListeners: Array<{ event: string; listener: EventListener }> = []

    interactions.forEach(({ type, effect, duration = 200 }) => {
      const handler = () => {
        // Apply visual effect
        element.classList.add(`skeleton-micro-${effect}`)

        // Apply sound effect
        if (enableSound) {
          playInteractionSound(effect)
        }

        // Apply haptic feedback
        if (enableHaptics && navigator.vibrate) {
          navigator.vibrate(duration)
        }

        // Remove effect after duration
        setTimeout(() => {
          element.classList.remove(`skeleton-micro-${effect}`)
        }, duration)
      }

      const eventName = type === 'hover' ? 'mouseenter' : type
      element.addEventListener(eventName, handler)
      eventListeners.push({ event: eventName, listener: handler })
    })

    return () => {
      eventListeners.forEach(({ event, listener }) => {
        element.removeEventListener(event, listener)
      })
    }
  }, [interactions, enableSound, enableHaptics, playInteractionSound])

  return (
    <div ref={elementRef} className="skeleton-micro-interactions">
      {children}
    </div>
  )
}

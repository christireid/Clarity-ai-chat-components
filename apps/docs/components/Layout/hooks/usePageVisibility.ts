import { useEffect, useRef } from 'react'
import type { Container } from '@tsparticles/engine'

/**
 * Hook to pause/play particle animations based on page visibility.
 * Uses the Page Visibility API to improve performance when the tab is hidden.
 * 
 * @param container - The particles container instance
 * @param enabled - Whether to enable visibility handling (default: true)
 * 
 * @example
 * ```tsx
 * const containerRef = useRef<Container | null>(null)
 * usePageVisibility(containerRef.current, isInitialized)
 * ```
 */
export function usePageVisibility(
  container: Container | null,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled || !container || typeof document === 'undefined') return

    const handleVisibilityChange = () => {
      if (!container) return

      try {
        if (document.hidden) {
          container.pause()
        } else {
          container.play()
        }
      } catch {
        // Silently handle errors - container may be destroyed
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [container, enabled])
}

import { useEffect, useRef } from 'react'
import type { Container } from '@tsparticles/engine'

/**
 * Hook to pause/play particle animations based on page visibility.
 * Uses the Page Visibility API to improve performance when the tab is hidden.
 * 
 * @param container - The particles container instance (can be null initially)
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
  // Use a ref to store the latest container value to avoid stale closures
  const containerRef = useRef<Container | null>(container)
  
  // Update ref when container changes
  useEffect(() => {
    containerRef.current = container
  }, [container])

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return

    const handleVisibilityChange = () => {
      const currentContainer = containerRef.current
      if (!currentContainer) return

      try {
        if (document.hidden) {
          currentContainer.pause()
        } else {
          currentContainer.play()
        }
      } catch {
        // Silently handle errors - container may be destroyed
      }
    }

    // Only set up listener if container exists
    if (containerRef.current) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, container]) // Include container to re-run when it becomes available
}

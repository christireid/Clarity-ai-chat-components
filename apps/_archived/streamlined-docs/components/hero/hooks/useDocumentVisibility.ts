'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to detect if the document/tab is currently visible
 * Uses the Page Visibility API to determine if user is looking at the page
 *
 * @returns boolean indicating if the page is visible
 *
 * @example
 * ```tsx
 * const isVisible = useDocumentVisibility()
 * if (!isVisible) {
 *   // Pause expensive animations
 * }
 * ```
 */
export function useDocumentVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (typeof document === 'undefined') return

    // Set initial state
    setIsVisible(!document.hidden)

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return isVisible
}

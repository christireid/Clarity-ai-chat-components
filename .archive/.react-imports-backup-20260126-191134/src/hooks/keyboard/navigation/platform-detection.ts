import * as React from 'react'

/**
 * Platform Detection (SSR-safe)
 *
 * Detect if the user is on a Mac/iOS device
 * Uses userAgentData when available (modern API), falls back to userAgent
 * Returns false during SSR for safe hydration
 */
function detectMacPlatform(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false // SSR fallback
  }

  // Modern API (Chrome 90+, Edge 90+)

  const userAgentData = (navigator as any).userAgentData
  if (userAgentData?.platform) {
    return /macOS|iOS/i.test(userAgentData.platform)
  }

  // Fallback to userAgent (more reliable than deprecated navigator.platform)
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

// Memoize the result after first client-side check
let cachedIsMac: boolean | null = null

export function getIsMac(): boolean {
  if (cachedIsMac === null) {
    cachedIsMac = detectMacPlatform()
  }
  return cachedIsMac
}

/**
 * Hook for SSR-safe platform detection
 * Returns stable value after hydration
 */
export function useIsMac(): boolean {
  const [isMac, setIsMac] = React.useState(false)

  React.useEffect(() => {
    setIsMac(detectMacPlatform())
  }, [])

  return isMac
}

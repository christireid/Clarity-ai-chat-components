'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to detect if component has mounted (client-side only)
 * Useful for preventing hydration mismatches in Next.js
 * 
 * @returns boolean indicating if component is mounted
 * 
 * @example
 * ```tsx
 * const mounted = useMounted()
 * if (!mounted) return null
 * ```
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

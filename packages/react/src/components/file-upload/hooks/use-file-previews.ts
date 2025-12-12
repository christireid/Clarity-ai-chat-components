'use client'

/**
 * useFilePreviews Hook
 *
 * Manages image preview URL generation with proper memory cleanup.
 * Fixes the stale closure issue by using refs to track URLs.
 */

import * as React from 'react'
import { getFileKey } from '../utils'

export interface UseFilePreviewsOptions {
  files: File[]
  enabled?: boolean
}

export interface UseFilePreviewsReturn {
  previews: Record<string, string>
  getPreview: (file: File) => string | undefined
  clearPreviews: () => void
}

export function useFilePreviews({
  files,
  enabled = true,
}: UseFilePreviewsOptions): UseFilePreviewsReturn {
  const [previews, setPreviews] = React.useState<Record<string, string>>({})

  // Use ref to track all created URLs for proper cleanup
  // This fixes the stale closure issue in the cleanup function
  const urlsRef = React.useRef<Map<string, string>>(new Map())

  // Generate previews for new image files
  React.useEffect(() => {
    if (!enabled) return

    const newPreviews: Record<string, string> = {}
    const currentKeys = new Set<string>()

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const key = getFileKey(file)
        currentKeys.add(key)

        // Only create URL if we don't have one for this file
        if (!urlsRef.current.has(key)) {
          const url = URL.createObjectURL(file)
          urlsRef.current.set(key, url)
          newPreviews[key] = url
        }
      }
    })

    // Clean up URLs for removed files
    urlsRef.current.forEach((url, key) => {
      if (!currentKeys.has(key)) {
        URL.revokeObjectURL(url)
        urlsRef.current.delete(key)
      }
    })

    // Update state with current previews
    const currentPreviews: Record<string, string> = {}
    urlsRef.current.forEach((url, key) => {
      currentPreviews[key] = url
    })

    setPreviews(currentPreviews)
  }, [files, enabled])

  // Cleanup all URLs on unmount
  React.useEffect(() => {
    const urls = urlsRef.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])

  // Get preview for a specific file
  const getPreview = React.useCallback(
    (file: File): string | undefined => {
      const key = getFileKey(file)
      return previews[key]
    },
    [previews]
  )

  // Clear all previews manually
  const clearPreviews = React.useCallback(() => {
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    urlsRef.current.clear()
    setPreviews({})
  }, [])

  return {
    previews,
    getPreview,
    clearPreviews,
  }
}

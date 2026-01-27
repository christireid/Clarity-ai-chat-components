/**
 * Hook for managing source citation state
 */

import * as React from 'react'
import { extractDomain } from '../utils'
import type {
  Source,
  UseSourceCitationOptions,
  UseSourceCitationReturn,
} from '../types'

export function useSourceCitation({
  initialSources = [],
  maxSources,
}: UseSourceCitationOptions = {}): UseSourceCitationReturn {
  const [sources, setSources] = React.useState<Source[]>(initialSources)

  const addSource = React.useCallback(
    (source: Source) => {
      setSources((prev) => {
        const exists = prev.some((s) => s.url === source.url)
        if (exists) return prev
        const newSources = [...prev, source]
        if (maxSources && newSources.length > maxSources) {
          return newSources.slice(-maxSources)
        }
        return newSources
      })
    },
    [maxSources]
  )

  const addSources = React.useCallback(
    (newSources: Source[]) => {
      setSources((prev) => {
        const urlSet = new Set(prev.map((s) => s.url))
        const uniqueNew = newSources.filter((s) => !urlSet.has(s.url))
        const combined = [...prev, ...uniqueNew]
        if (maxSources && combined.length > maxSources) {
          return combined.slice(-maxSources)
        }
        return combined
      })
    },
    [maxSources]
  )

  const removeSource = React.useCallback((url: string) => {
    setSources((prev) => prev.filter((s) => s.url !== url))
  }, [])

  const clearSources = React.useCallback(() => {
    setSources([])
  }, [])

  const updateSource = React.useCallback(
    (url: string, updates: Partial<Omit<Source, 'url'>>) => {
      setSources((prev) =>
        prev.map((s) => (s.url === url ? { ...s, ...updates } : s))
      )
    },
    []
  )

  const getSource = React.useCallback(
    (url: string) => sources.find((s) => s.url === url),
    [sources]
  )

  const hasSource = React.useCallback(
    (url: string) => sources.some((s) => s.url === url),
    [sources]
  )

  const sortedByConfidence = React.useMemo(
    () =>
      [...sources].sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0)),
    [sources]
  )

  const domains = React.useMemo(() => {
    const domainSet = new Set(sources.map((s) => s.domain || extractDomain(s.url)))
    return Array.from(domainSet)
  }, [sources])

  return {
    sources,
    addSource,
    addSources,
    removeSource,
    clearSources,
    setSources,
    updateSource,
    getSource,
    hasSource,
    sortedByConfidence,
    domains,
  }
}

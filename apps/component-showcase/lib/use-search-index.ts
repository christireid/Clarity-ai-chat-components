'use client'

import { useState, useEffect, useRef } from 'react'
import type { SearchEntry } from '@/data/search-index'

/**
 * Singleton hook for the search index — builds once and caches.
 * Prevents double-building when SearchDialog and StatsPage both mount.
 *
 * Uses dynamic import() to avoid import.meta.glob being evaluated during SSR.
 */

let cachedIndex: SearchEntry[] | null = null
let buildPromise: Promise<SearchEntry[]> | null = null

function getOrBuildIndex(): Promise<SearchEntry[]> {
  if (cachedIndex) return Promise.resolve(cachedIndex)
  if (!buildPromise) {
    buildPromise = import('@/data/search-index')
      .then((mod) => mod.buildSearchIndex())
      .then((index) => {
        cachedIndex = index
        return index
      })
  }
  return buildPromise
}

export function useSearchIndex() {
  const [index, setIndex] = useState<SearchEntry[]>(cachedIndex ?? [])
  const [loading, setLoading] = useState(!cachedIndex)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    if (cachedIndex) {
      setIndex(cachedIndex)
      setLoading(false)
      return
    }

    setLoading(true)
    getOrBuildIndex()
      .then((result) => {
        if (mountedRef.current) {
          setIndex(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('[useSearchIndex] Failed to build index:', err)
        if (mountedRef.current) setLoading(false)
      })

    return () => {
      mountedRef.current = false
    }
  }, [])

  return { index, loading }
}

/**
 * Tests for Peer Detection Utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import {
  detectPeerCapabilities,
  isPeerAvailable,
  getPeerModule,
  clearPeerCache,
  getPeerDetectionStats,
  usePeerCapabilities,
  usePeerAvailable,
  usePeerModule,
  getInstallationInstructions,
  type PeerCapabilities,
} from '../peer-detection'

describe('Peer Detection Utilities', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearPeerCache()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('detectPeerCapabilities', () => {
    it('should detect all peer capabilities', async () => {
      const capabilities = await detectPeerCapabilities()

      expect(capabilities).toBeDefined()
      expect(typeof capabilities.tokenCounting).toBe('boolean')
      expect(typeof capabilities.diagrams).toBe('boolean')
      expect(typeof capabilities.pdfParsing).toBe('boolean')
      expect(typeof capabilities.docxParsing).toBe('boolean')
      expect(typeof capabilities.reranking).toBe('boolean')
      expect(typeof capabilities.syntaxHighlighting).toBe('boolean')
      expect(typeof capabilities.zipHandling).toBe('boolean')
      expect(typeof capabilities.markdown).toBe('boolean')
      expect(typeof capabilities.markdownGfm).toBe('boolean')
      expect(typeof capabilities.markdownCodeHighlight).toBe('boolean')
      expect(typeof capabilities.prismHighlighting).toBe('boolean')
    })

    it('should cache detection results', async () => {
      const capabilities1 = await detectPeerCapabilities()
      const capabilities2 = await detectPeerCapabilities()

      // Should return identical objects due to caching
      expect(capabilities1).toEqual(capabilities2)
    })

    it('should detect prismjs as available in test environment', async () => {
      const capabilities = await detectPeerCapabilities()

      // prismjs is installed as a dev dependency
      expect(capabilities.prismHighlighting).toBe(true)
    })
  })

  describe('isPeerAvailable', () => {
    it('should return true for available peers', async () => {
      // prismjs is available in test environment
      const available = await isPeerAvailable('prismjs')
      expect(available).toBe(true)
    })

    it('should return false for unavailable peers', async () => {
      const available = await isPeerAvailable('non-existent-package-xyz')
      expect(available).toBe(false)
    })

    it('should cache availability checks', async () => {
      await isPeerAvailable('prismjs')

      const stats = getPeerDetectionStats()
      expect(stats.total).toBeGreaterThan(0)
      expect(stats.available).toContain('prismjs')
    })
  })

  describe('getPeerModule', () => {
    it('should return module for available peers', async () => {
      const module = await getPeerModule('prismjs')
      expect(module).toBeDefined()
    })

    it('should return null for unavailable peers', async () => {
      const module = await getPeerModule('non-existent-package-xyz')
      expect(module).toBeNull()
    })
  })

  describe('clearPeerCache', () => {
    it('should clear entire cache when no argument provided', async () => {
      await isPeerAvailable('prismjs')

      let stats = getPeerDetectionStats()
      expect(stats.total).toBeGreaterThan(0)

      clearPeerCache()

      stats = getPeerDetectionStats()
      expect(stats.total).toBe(0)
    })

    it('should clear specific package from cache', async () => {
      await isPeerAvailable('prismjs')
      await isPeerAvailable('react-markdown')

      clearPeerCache('prismjs')

      const stats = getPeerDetectionStats()
      expect(stats.available).not.toContain('prismjs')
    })
  })

  describe('getPeerDetectionStats', () => {
    it('should return empty stats initially', () => {
      const stats = getPeerDetectionStats()

      expect(stats.total).toBe(0)
      expect(stats.available).toEqual([])
      expect(stats.unavailable).toEqual([])
      expect(stats.inFlight).toBe(0)
    })

    it('should track detection results', async () => {
      await isPeerAvailable('prismjs')
      await isPeerAvailable('non-existent-package-xyz')

      const stats = getPeerDetectionStats()

      expect(stats.total).toBe(2)
      expect(stats.available).toContain('prismjs')
      expect(stats.unavailable).toContain('non-existent-package-xyz')
    })
  })

  describe('usePeerCapabilities', () => {
    it('should provide capabilities object', async () => {
      const { result } = renderHook(() => usePeerCapabilities())

      // Initially loading
      expect(result.current.isLoading).toBe(true)
      expect(result.current.capabilities).toBeNull()

      // Wait for capabilities to load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.capabilities).toBeDefined()
      expect(result.current.error).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      const { result } = renderHook(() => usePeerCapabilities())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Even with errors, should complete loading
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('usePeerAvailable', () => {
    it('should detect available peer', async () => {
      const { result } = renderHook(() => usePeerAvailable('prismjs'))

      // Initially loading
      expect(result.current.isLoading).toBe(true)
      expect(result.current.available).toBeNull()

      // Wait for detection
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.available).toBe(true)
      expect(result.current.error).toBeNull()
    })

    it('should detect unavailable peer', async () => {
      const { result } = renderHook(() =>
        usePeerAvailable('non-existent-package-xyz')
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.available).toBe(false)
    })
  })

  describe('usePeerModule', () => {
    it('should load available peer module', async () => {
      const { result } = renderHook(() => usePeerModule('prismjs'))

      // Initially loading
      expect(result.current.isLoading).toBe(true)
      expect(result.current.module).toBeNull()

      // Wait for module to load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.module).toBeDefined()
      expect(result.current.available).toBe(true)
      expect(result.current.error).toBeNull()
    })

    it('should handle unavailable peer module', async () => {
      const { result } = renderHook(() =>
        usePeerModule('non-existent-package-xyz')
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.module).toBeNull()
      expect(result.current.available).toBe(false)
    })
  })

  describe('getInstallationInstructions', () => {
    it('should generate instructions for missing packages', () => {
      const capabilities: PeerCapabilities = {
        tokenCounting: false,
        diagrams: false,
        pdfParsing: true,
        docxParsing: true,
        reranking: false,
        syntaxHighlighting: true,
        zipHandling: true,
        markdown: false,
        markdownGfm: false,
        markdownCodeHighlight: false,
        prismHighlighting: true,
      }

      const instructions = getInstallationInstructions(capabilities)

      expect(instructions.missing).toContain('flowtoken')
      expect(instructions.missing).toContain('mermaid')
      expect(instructions.missing).toContain('cohere-ai')
      expect(instructions.missing).toContain('react-markdown')
      expect(instructions.missing).toContain('remark-gfm')
      expect(instructions.missing).toContain('rehype-highlight')

      expect(instructions.npm).toContain('flowtoken')
      expect(instructions.pnpm).toContain('mermaid')
      expect(instructions.yarn).toContain('cohere-ai')
    })

    it('should return null commands when all packages installed', () => {
      const capabilities: PeerCapabilities = {
        tokenCounting: true,
        diagrams: true,
        pdfParsing: true,
        docxParsing: true,
        reranking: true,
        syntaxHighlighting: true,
        zipHandling: true,
        markdown: true,
        markdownGfm: true,
        markdownCodeHighlight: true,
        prismHighlighting: true,
      }

      const instructions = getInstallationInstructions(capabilities)

      expect(instructions.missing).toEqual([])
      expect(instructions.npm).toBeNull()
      expect(instructions.pnpm).toBeNull()
      expect(instructions.yarn).toBeNull()
    })
  })

  describe('Concurrent Detection', () => {
    it('should handle concurrent detection attempts', async () => {
      // Start multiple concurrent detections
      const promises = [
        isPeerAvailable('prismjs'),
        isPeerAvailable('prismjs'),
        isPeerAvailable('prismjs'),
      ]

      const results = await Promise.all(promises)

      // All should return the same result
      expect(results).toEqual([true, true, true])

      // Should only have one cache entry
      const stats = getPeerDetectionStats()
      expect(stats.available.filter((pkg) => pkg === 'prismjs').length).toBe(1)
    })
  })

  describe('SSR Compatibility', () => {
    it('should handle missing window gracefully', async () => {
      // Detection should work in non-browser environments
      const capabilities = await detectPeerCapabilities()
      expect(capabilities).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should cache failed detections', async () => {
      const available1 = await isPeerAvailable('non-existent-package-xyz')
      const available2 = await isPeerAvailable('non-existent-package-xyz')

      expect(available1).toBe(false)
      expect(available2).toBe(false)

      const stats = getPeerDetectionStats()
      expect(stats.unavailable).toContain('non-existent-package-xyz')
    })

    it('should handle import errors gracefully', async () => {
      const module = await getPeerModule('non-existent-package-xyz')
      expect(module).toBeNull()

      // Should not throw error
      const stats = getPeerDetectionStats()
      expect(stats.unavailable).toContain('non-existent-package-xyz')
    })
  })
})

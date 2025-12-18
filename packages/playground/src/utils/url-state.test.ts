/**
 * URL State Utilities Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  compress,
  decompress,
  encodePlaygroundState,
  decodePlaygroundState,
  createShareableUrl,
  estimateCompressionRatio,
  isShareable,
} from './url-state'
import type { PlaygroundState } from '../types'

describe('URL State Utilities', () => {
  describe('compress / decompress', () => {
    it('should compress and decompress a string correctly', () => {
      const original = 'Hello, World!'
      const compressed = compress(original)
      const decompressed = decompress(compressed)

      expect(decompressed).toBe(original)
    })

    it('should handle empty strings', () => {
      const original = ''
      const compressed = compress(original)
      const decompressed = decompress(compressed)

      expect(decompressed).toBe(original)
    })

    it('should handle long code strings', () => {
      const original = `
        import React, { useState } from 'react'

        function App() {
          const [count, setCount] = useState(0)
          return (
            <div>
              <h1>Count: {count}</h1>
              <button onClick={() => setCount(count + 1)}>
                Increment
              </button>
            </div>
          )
        }

        export default App
      `.trim()

      const compressed = compress(original)
      const decompressed = decompress(compressed)

      expect(decompressed).toBe(original)
      // Verify compression is actually happening
      expect(compressed.length).toBeLessThan(original.length)
    })

    it('should handle special characters', () => {
      const original = 'const message = "Hello! @#$%^&*()"'
      const compressed = compress(original)
      const decompressed = decompress(compressed)

      expect(decompressed).toBe(original)
    })

    it('should handle unicode characters', () => {
      const original = 'const greeting = "こんにちは 🎉"'
      const compressed = compress(original)
      const decompressed = decompress(compressed)

      expect(decompressed).toBe(original)
    })

    it('should return null for invalid compressed strings', () => {
      const result = decompress('invalid-not-compressed')
      expect(result).toBeNull()
    })
  })

  describe('encodePlaygroundState / decodePlaygroundState', () => {
    const sampleState: PlaygroundState = {
      code: 'const x = 1',
      templateId: 'basic-chat',
      theme: 'dark',
      settings: {
        autoRun: true,
        lineNumbers: true,
        fontSize: 14,
        tabSize: 2,
        wordWrap: false,
        minimap: false,
      },
    }

    it('should encode and decode playground state correctly', () => {
      const encoded = encodePlaygroundState(sampleState)
      const decoded = decodePlaygroundState(encoded)

      expect(decoded).toEqual(sampleState)
    })

    it('should handle state without templateId', () => {
      const stateWithoutTemplate: PlaygroundState = {
        code: 'logger.debug("test")',
        theme: 'light',
        settings: sampleState.settings,
      }

      const encoded = encodePlaygroundState(stateWithoutTemplate)
      const decoded = decodePlaygroundState(encoded)

      expect(decoded?.code).toBe(stateWithoutTemplate.code)
      expect(decoded?.theme).toBe(stateWithoutTemplate.theme)
    })

    it('should return null for invalid encoded state', () => {
      const result = decodePlaygroundState('invalid')
      expect(result).toBeNull()
    })
  })

  describe('createShareableUrl', () => {
    beforeEach(() => {
      // Mock window.location
      vi.stubGlobal('window', {
        location: {
          origin: 'https://example.com',
          pathname: '/playground',
        },
      })
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('should create a shareable URL', () => {
      const state: PlaygroundState = {
        code: 'const x = 1',
        theme: 'light',
        settings: {
          autoRun: true,
          lineNumbers: true,
          fontSize: 14,
          tabSize: 2,
          wordWrap: false,
          minimap: false,
        },
      }

      const { url, shortened } = createShareableUrl(state)

      expect(url).toContain('https://example.com/playground')
      expect(url).toContain('state=')
      expect(shortened).toBe(false)
    })

    it('should use custom base URL', () => {
      const state: PlaygroundState = {
        code: 'const x = 1',
        theme: 'light',
        settings: {
          autoRun: true,
          lineNumbers: true,
          fontSize: 14,
          tabSize: 2,
          wordWrap: false,
          minimap: false,
        },
      }

      const { url } = createShareableUrl(state, 'https://custom.com/play')

      expect(url).toContain('https://custom.com/play')
    })
  })

  describe('estimateCompressionRatio', () => {
    it('should return correct compression ratio', () => {
      const code = 'const x = 1'
      const result = estimateCompressionRatio(code)

      expect(result.original).toBe(code.length)
      expect(result.compressed).toBeGreaterThan(0)
      expect(result.ratio).toBeGreaterThan(0)
    })

    it('should show compression for longer code', () => {
      const longCode = `
        import React, { useState, useEffect } from 'react'

        function App() {
          const [data, setData] = useState([])
          const [loading, setLoading] = useState(true)

          useEffect(() => {
            fetch('/api/data')
              .then(res => res.json())
              .then(data => {
                setData(data)
                setLoading(false)
              })
          }, [])

          if (loading) return <div>Loading...</div>

          return (
            <ul>
              {data.map(item => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          )
        }
      `.trim()

      const result = estimateCompressionRatio(longCode)

      // Compression should help with longer code
      expect(result.ratio).toBeLessThan(1)
    })
  })

  describe('isShareable', () => {
    it('should return true for short code', () => {
      const state: PlaygroundState = {
        code: 'const x = 1',
        theme: 'light',
        settings: {
          autoRun: true,
          lineNumbers: true,
          fontSize: 14,
          tabSize: 2,
          wordWrap: false,
          minimap: false,
        },
      }

      // Mock window.location
      vi.stubGlobal('window', {
        location: {
          origin: 'https://example.com',
          pathname: '/playground',
        },
      })

      expect(isShareable(state)).toBe(true)

      vi.unstubAllGlobals()
    })
  })
})

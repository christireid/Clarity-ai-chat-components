/**
 * Export Utilities Tests
 *
 * Tests for clipboard operations and export URL generation.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { copyToClipboard, copyCode } from './export'

describe('Clipboard Utilities', () => {
  describe('copyToClipboard', () => {
    beforeEach(() => {
      // Reset mocks before each test
      vi.resetAllMocks()
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('should use modern Clipboard API when available', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('navigator', {
        clipboard: {
          writeText: writeTextMock,
        },
      })

      const result = await copyToClipboard('test text')

      expect(writeTextMock).toHaveBeenCalledWith('test text')
      expect(result).toBe(true)
    })

    it('should return false when modern Clipboard API throws', async () => {
      const writeTextMock = vi
        .fn()
        .mockRejectedValue(new Error('Permission denied'))

      // Mock document methods for fallback
      const mockTextArea = {
        value: '',
        style: {} as CSSStyleDeclaration,
        focus: vi.fn(),
        select: vi.fn(),
      }
      const appendChildMock = vi.fn()
      const removeChildMock = vi.fn()
      const execCommandMock = vi.fn().mockReturnValue(false)

      vi.stubGlobal('navigator', {
        clipboard: {
          writeText: writeTextMock,
        },
      })

      vi.stubGlobal('document', {
        createElement: vi.fn().mockReturnValue(mockTextArea),
        body: {
          appendChild: appendChildMock,
          removeChild: removeChildMock,
        },
        execCommand: execCommandMock,
      })

      const result = await copyToClipboard('test text')

      expect(writeTextMock).toHaveBeenCalledWith('test text')
      // Should fall back to execCommand
      expect(execCommandMock).toHaveBeenCalledWith('copy')
      expect(result).toBe(false)
    })

    it('should fall back to execCommand when Clipboard API unavailable', async () => {
      const mockTextArea = {
        value: '',
        style: {} as CSSStyleDeclaration,
        focus: vi.fn(),
        select: vi.fn(),
      }
      const appendChildMock = vi.fn()
      const removeChildMock = vi.fn()
      const execCommandMock = vi.fn().mockReturnValue(true)

      vi.stubGlobal('navigator', {
        clipboard: undefined,
      })

      vi.stubGlobal('document', {
        createElement: vi.fn().mockReturnValue(mockTextArea),
        body: {
          appendChild: appendChildMock,
          removeChild: removeChildMock,
        },
        execCommand: execCommandMock,
      })

      const result = await copyToClipboard('fallback text')

      expect(mockTextArea.value).toBe('fallback text')
      expect(mockTextArea.focus).toHaveBeenCalled()
      expect(mockTextArea.select).toHaveBeenCalled()
      expect(execCommandMock).toHaveBeenCalledWith('copy')
      expect(removeChildMock).toHaveBeenCalledWith(mockTextArea)
      expect(result).toBe(true)
    })

    it('should set correct styles on textarea for fallback', async () => {
      const mockTextArea = {
        value: '',
        style: {} as Record<string, string>,
        focus: vi.fn(),
        select: vi.fn(),
      }
      const appendChildMock = vi.fn()
      const removeChildMock = vi.fn()
      const execCommandMock = vi.fn().mockReturnValue(true)

      vi.stubGlobal('navigator', {
        clipboard: undefined,
      })

      vi.stubGlobal('document', {
        createElement: vi.fn().mockReturnValue(mockTextArea),
        body: {
          appendChild: appendChildMock,
          removeChild: removeChildMock,
        },
        execCommand: execCommandMock,
      })

      await copyToClipboard('test')

      // Verify textarea is styled to be invisible
      expect(mockTextArea.style.top).toBe('0')
      expect(mockTextArea.style.left).toBe('0')
      expect(mockTextArea.style.position).toBe('fixed')
      expect(mockTextArea.style.opacity).toBe('0')
      expect(mockTextArea.style.pointerEvents).toBe('none')
    })

    it('should return false when fallback throws', async () => {
      vi.stubGlobal('navigator', {
        clipboard: undefined,
      })

      vi.stubGlobal('document', {
        createElement: vi.fn().mockImplementation(() => {
          throw new Error('Cannot create element')
        }),
        body: {
          appendChild: vi.fn(),
          removeChild: vi.fn(),
        },
        execCommand: vi.fn(),
      })

      const result = await copyToClipboard('test')

      expect(result).toBe(false)
    })

    it('should handle empty string', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('navigator', {
        clipboard: {
          writeText: writeTextMock,
        },
      })

      const result = await copyToClipboard('')

      expect(writeTextMock).toHaveBeenCalledWith('')
      expect(result).toBe(true)
    })

    it('should handle special characters', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('navigator', {
        clipboard: {
          writeText: writeTextMock,
        },
      })

      const specialText = 'const greeting = "Hello! @#$%^&*() 🎉"'
      const result = await copyToClipboard(specialText)

      expect(writeTextMock).toHaveBeenCalledWith(specialText)
      expect(result).toBe(true)
    })

    it('should handle multiline text', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('navigator', {
        clipboard: {
          writeText: writeTextMock,
        },
      })

      const multilineText = `line 1
line 2
line 3`
      const result = await copyToClipboard(multilineText)

      expect(writeTextMock).toHaveBeenCalledWith(multilineText)
      expect(result).toBe(true)
    })
  })

  describe('copyCode', () => {
    beforeEach(() => {
      vi.resetAllMocks()
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('should be an alias for copyToClipboard', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined)

      vi.stubGlobal('navigator', {
        clipboard: {
          writeText: writeTextMock,
        },
      })

      const result = await copyCode('const x = 1')

      expect(writeTextMock).toHaveBeenCalledWith('const x = 1')
      expect(result).toBe(true)
    })
  })
})

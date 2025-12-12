/**
 * PlaygroundContext Tests
 *
 * Tests for the playground context provider and hooks.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  PlaygroundProvider,
  usePlayground,
  usePlaygroundState,
  usePlaygroundActions,
  usePlaygroundCode,
  usePlaygroundTheme,
  usePlaygroundSettings,
  usePlaygroundConsole,
} from './PlaygroundContext'

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
}
Object.defineProperty(navigator, 'clipboard', { value: mockClipboard })

// Wrapper component for hooks
function wrapper({ children }: { children: ReactNode }) {
  return <PlaygroundProvider>{children}</PlaygroundProvider>
}

describe('PlaygroundContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000',
        pathname: '/',
        search: '',
      },
      writable: true,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('usePlayground', () => {
    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => usePlayground())
      }).toThrow('usePlayground must be used within a PlaygroundProvider')

      consoleSpy.mockRestore()
    })

    it('provides state and actions', () => {
      const { result } = renderHook(() => usePlayground(), { wrapper })

      expect(result.current.state).toBeDefined()
      expect(result.current.actions).toBeDefined()
      expect(typeof result.current.actions.setCode).toBe('function')
      expect(typeof result.current.actions.setTheme).toBe('function')
    })
  })

  describe('usePlaygroundState', () => {
    it('returns current state', () => {
      const { result } = renderHook(() => usePlaygroundState(), { wrapper })

      expect(result.current.code).toBeDefined()
      expect(result.current.theme).toBe('light')
      expect(result.current.settings).toBeDefined()
      expect(result.current.consoleEntries).toEqual([])
    })
  })

  describe('usePlaygroundActions', () => {
    it('setCode updates code', () => {
      const { result } = renderHook(() => usePlayground(), { wrapper })

      act(() => {
        result.current.actions.setCode('const x = 1')
      })

      expect(result.current.state.code).toBe('const x = 1')
    })

    it('setTheme updates theme', () => {
      const { result } = renderHook(() => usePlayground(), { wrapper })

      act(() => {
        result.current.actions.setTheme('dark')
      })

      expect(result.current.state.theme).toBe('dark')
    })

    it('toggleTheme toggles between light and dark', () => {
      const { result } = renderHook(() => usePlayground(), { wrapper })

      expect(result.current.state.theme).toBe('light')

      act(() => {
        result.current.actions.toggleTheme()
      })

      expect(result.current.state.theme).toBe('dark')

      act(() => {
        result.current.actions.toggleTheme()
      })

      expect(result.current.state.theme).toBe('light')
    })

    it('updateSettings merges settings', () => {
      const { result } = renderHook(() => usePlayground(), { wrapper })

      expect(result.current.state.settings.autoRun).toBe(true)

      act(() => {
        result.current.actions.updateSettings({ autoRun: false })
      })

      expect(result.current.state.settings.autoRun).toBe(false)
      // Other settings should be preserved
      expect(result.current.state.settings.lineNumbers).toBe(true)
    })

    it('addConsoleEntry adds entry with id and timestamp', () => {
      const { result } = renderHook(() => usePlayground(), { wrapper })

      act(() => {
        result.current.actions.addConsoleEntry({
          level: 'log',
          message: 'Test message',
        })
      })

      expect(result.current.state.consoleEntries).toHaveLength(1)
      expect(result.current.state.consoleEntries[0].level).toBe('log')
      expect(result.current.state.consoleEntries[0].message).toBe(
        'Test message'
      )
      expect(result.current.state.consoleEntries[0].id).toBeDefined()
      expect(result.current.state.consoleEntries[0].timestamp).toBeInstanceOf(
        Date
      )
    })

    it('clearConsole removes all entries', () => {
      const { result } = renderHook(() => usePlayground(), { wrapper })

      act(() => {
        result.current.actions.addConsoleEntry({ level: 'log', message: '1' })
        result.current.actions.addConsoleEntry({ level: 'warn', message: '2' })
      })

      expect(result.current.state.consoleEntries).toHaveLength(2)

      act(() => {
        result.current.actions.clearConsole()
      })

      expect(result.current.state.consoleEntries).toHaveLength(0)
    })

    it('toggleSettings toggles showSettings', () => {
      const { result } = renderHook(() => usePlayground(), { wrapper })

      expect(result.current.state.showSettings).toBe(false)

      act(() => {
        result.current.actions.toggleSettings()
      })

      expect(result.current.state.showSettings).toBe(true)

      act(() => {
        result.current.actions.toggleSettings()
      })

      expect(result.current.state.showSettings).toBe(false)
    })

    it('toggleConsole toggles showConsole', () => {
      const { result } = renderHook(() => usePlayground(), { wrapper })

      expect(result.current.state.showConsole).toBe(false)

      act(() => {
        result.current.actions.toggleConsole()
      })

      expect(result.current.state.showConsole).toBe(true)
    })

    it('toggleExportMenu toggles showExportMenu', () => {
      const { result } = renderHook(() => usePlayground(), { wrapper })

      expect(result.current.state.showExportMenu).toBe(false)

      act(() => {
        result.current.actions.toggleExportMenu()
      })

      expect(result.current.state.showExportMenu).toBe(true)
    })

    it('closeExportMenu sets showExportMenu to false', () => {
      const { result } = renderHook(() => usePlayground(), { wrapper })

      act(() => {
        result.current.actions.toggleExportMenu()
      })

      expect(result.current.state.showExportMenu).toBe(true)

      act(() => {
        result.current.actions.closeExportMenu()
      })

      expect(result.current.state.showExportMenu).toBe(false)
    })
  })

  describe('usePlaygroundCode', () => {
    it('returns current code', () => {
      const { result } = renderHook(() => usePlaygroundCode(), { wrapper })

      expect(typeof result.current).toBe('string')
    })
  })

  describe('usePlaygroundTheme', () => {
    it('returns theme state and actions', () => {
      const { result } = renderHook(() => usePlaygroundTheme(), { wrapper })

      expect(result.current.theme).toBe('light')
      expect(typeof result.current.setTheme).toBe('function')
      expect(typeof result.current.toggleTheme).toBe('function')
    })
  })

  describe('usePlaygroundSettings', () => {
    it('returns settings state and updateSettings action', () => {
      const { result } = renderHook(() => usePlaygroundSettings(), { wrapper })

      expect(result.current.settings).toBeDefined()
      expect(typeof result.current.updateSettings).toBe('function')
    })
  })

  describe('usePlaygroundConsole', () => {
    it('returns console state and actions', () => {
      const { result } = renderHook(() => usePlaygroundConsole(), { wrapper })

      expect(result.current.entries).toEqual([])
      expect(typeof result.current.addEntry).toBe('function')
      expect(typeof result.current.clear).toBe('function')
      expect(typeof result.current.toggleConsole).toBe('function')
    })
  })
})

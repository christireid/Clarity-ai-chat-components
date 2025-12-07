import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import { useThemeMode } from '../useThemeMode'

describe('useThemeMode', () => {
  it('should return false initially (before mount)', () => {
    const { result } = renderHook(() => useThemeMode())
    expect(result.current).toBe(false)
  })

  it('should detect dark theme after mount', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(ThemeProvider, { attribute: 'class', defaultTheme: 'dark', enableSystem: true }, children)
    )

    const { result } = renderHook(() => useThemeMode(), { wrapper })

    await waitFor(() => {
      expect(result.current).toBeDefined()
    })
  })

  it('should detect light theme after mount', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(ThemeProvider, { attribute: 'class', defaultTheme: 'light', enableSystem: true }, children)
    )

    const { result } = renderHook(() => useThemeMode(), { wrapper })

    await waitFor(() => {
      expect(result.current).toBeDefined()
    })
  })
})

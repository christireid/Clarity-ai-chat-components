import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme, ThemeToggle } from '../ThemeProvider'
import { modernThemes } from '../modern-presets'
import type { CompleteThemeConfig } from '../theme-config'

// Mock matchMedia
const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: query === '(prefers-color-scheme: dark)',
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
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

beforeEach(() => {
  vi.stubGlobal('matchMedia', mockMatchMedia)
  vi.stubGlobal('localStorage', localStorageMock)
  localStorageMock.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/**
 * Test component that consumes theme context
 */
function ThemeConsumer() {
  const { mode, resolvedTheme, theme, availablePresets } = useTheme()
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="theme-name">{resolvedTheme?.name ?? 'none'}</span>
      <span data-testid="theme-mode">{theme.mode}</span>
      <span data-testid="preset-count">{availablePresets.length}</span>
    </div>
  )
}

describe('ThemeProvider', () => {
  describe('basic rendering', () => {
    it('should render children', () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Hello</div>
        </ThemeProvider>
      )
      expect(screen.getByTestId('child')).toHaveTextContent('Hello')
    })

    it('should provide default theme context', () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      )

      // Default mode is 'system', which resolves based on matchMedia mock (returns dark)
      expect(screen.getByTestId('mode')).toHaveTextContent('dark')
    })

    it('should provide all 8 available presets', () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      )
      expect(screen.getByTestId('preset-count')).toHaveTextContent('8')
    })
  })

  describe('preset selection', () => {
    it('should apply preset theme', async () => {
      render(
        <ThemeProvider defaultTheme={{ preset: 'neutral' }}>
          <ThemeConsumer />
        </ThemeProvider>
      )
      // Wait for theme to be applied
      await waitFor(() => {
        expect(screen.getByTestId('theme-name')).toHaveTextContent('neutral')
      })
    })

    it('should apply dark preset', async () => {
      render(
        <ThemeProvider defaultTheme={{ preset: 'neutral-dark' }}>
          <ThemeConsumer />
        </ThemeProvider>
      )
      await waitFor(() => {
        expect(screen.getByTestId('theme-name')).toHaveTextContent(
          'neutral-dark'
        )
      })
    })
  })

  describe('custom theme', () => {
    it('should accept CompleteThemeConfig directly', async () => {
      const customTheme: CompleteThemeConfig = {
        ...modernThemes['default'],
        name: 'my-custom-theme',
      }

      render(
        <ThemeProvider defaultTheme={customTheme}>
          <ThemeConsumer />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('theme-name')).toHaveTextContent(
          'my-custom-theme'
        )
      })
    })

    it('should accept customTheme in config object', async () => {
      const customTheme: CompleteThemeConfig = {
        ...modernThemes['default'],
        name: 'wrapped-custom',
      }

      render(
        <ThemeProvider defaultTheme={{ customTheme }}>
          <ThemeConsumer />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('theme-name')).toHaveTextContent(
          'wrapped-custom'
        )
      })
    })
  })

  describe('mode switching', () => {
    it('should start with system mode by default', () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      )
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('system')
    })

    it('should respect explicit light mode', async () => {
      render(
        <ThemeProvider defaultTheme={{ mode: 'light' }}>
          <ThemeConsumer />
        </ThemeProvider>
      )
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('light')
      expect(screen.getByTestId('mode')).toHaveTextContent('light')
    })

    it('should respect explicit dark mode', async () => {
      render(
        <ThemeProvider defaultTheme={{ mode: 'dark' }}>
          <ThemeConsumer />
        </ThemeProvider>
      )
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
      expect(screen.getByTestId('mode')).toHaveTextContent('dark')
    })
  })
})

describe('useTheme', () => {
  it('should throw when used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<ThemeConsumer />)
    }).toThrow('useTheme must be used within a ThemeProvider')

    spy.mockRestore()
  })

  it('should provide setTheme function', async () => {
    function ThemeUpdater() {
      const { setTheme, theme } = useTheme()
      return (
        <div>
          <button
            onClick={() => setTheme({ preset: 'vibrant' })}
            data-testid="set-preset"
          >
            Set Vibrant
          </button>
          <span data-testid="current-preset">{theme.preset ?? 'none'}</span>
        </div>
      )
    }

    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeUpdater />
      </ThemeProvider>
    )

    await user.click(screen.getByTestId('set-preset'))

    await waitFor(() => {
      expect(screen.getByTestId('current-preset')).toHaveTextContent('vibrant')
    })
  })

  it('should provide toggleMode function', async () => {
    function ModeToggler() {
      const { toggleMode, mode } = useTheme()
      return (
        <div>
          <button onClick={toggleMode} data-testid="toggle">
            Toggle
          </button>
          <span data-testid="current-mode">{mode}</span>
        </div>
      )
    }

    const user = userEvent.setup()
    render(
      <ThemeProvider defaultTheme={{ mode: 'light' }}>
        <ModeToggler />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-mode')).toHaveTextContent('light')

    await user.click(screen.getByTestId('toggle'))

    await waitFor(() => {
      expect(screen.getByTestId('current-mode')).toHaveTextContent('dark')
    })
  })

  it('should provide setPreset function', async () => {
    function PresetSetter() {
      const { setPreset, resolvedTheme } = useTheme()
      return (
        <div>
          <button
            onClick={() => setPreset('high-contrast')}
            data-testid="set-preset"
          >
            High Contrast
          </button>
          <span data-testid="theme-name">{resolvedTheme?.name ?? 'none'}</span>
        </div>
      )
    }

    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <PresetSetter />
      </ThemeProvider>
    )

    await user.click(screen.getByTestId('set-preset'))

    await waitFor(() => {
      expect(screen.getByTestId('theme-name')).toHaveTextContent(
        'high-contrast'
      )
    })
  })
})

describe('ThemeToggle', () => {
  it('should render toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should have accessible label', () => {
    render(
      <ThemeProvider defaultTheme={{ mode: 'light' }}>
        <ThemeToggle />
      </ThemeProvider>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
  })

  it('should toggle mode when clicked', async () => {
    const user = userEvent.setup()

    function ModeDisplay() {
      const { mode } = useTheme()
      return <span data-testid="current-mode">{mode}</span>
    }

    render(
      <ThemeProvider defaultTheme={{ mode: 'light' }}>
        <ThemeToggle />
        <ModeDisplay />
      </ThemeProvider>
    )

    // Initially in light mode
    expect(screen.getByTestId('current-mode')).toHaveTextContent('light')

    // Click to toggle
    await user.click(screen.getByRole('button'))

    // Should switch to dark mode
    await waitFor(() => {
      expect(screen.getByTestId('current-mode')).toHaveTextContent('dark')
    })
  })

  it('should show label when showLabel prop is true', () => {
    render(
      <ThemeProvider defaultTheme={{ mode: 'light' }}>
        <ThemeToggle showLabel />
      </ThemeProvider>
    )
    expect(screen.getByText('Dark')).toBeInTheDocument()
  })
})

describe('localStorage persistence', () => {
  it('should persist mode to localStorage', async () => {
    const user = userEvent.setup()

    function ModeChanger() {
      const { setTheme } = useTheme()
      return (
        <button onClick={() => setTheme({ mode: 'dark' })} data-testid="change">
          Dark
        </button>
      )
    }

    render(
      <ThemeProvider storageKey="test-theme">
        <ModeChanger />
      </ThemeProvider>
    )

    // Wait for hydration
    await waitFor(() => {
      expect(localStorageMock.getItem).toHaveBeenCalled()
    })

    await user.click(screen.getByTestId('change'))

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-theme',
        expect.stringContaining('"mode":"dark"')
      )
    })
  })

  it('should restore mode from localStorage', async () => {
    localStorageMock.getItem.mockReturnValueOnce(
      JSON.stringify({ mode: 'dark' })
    )

    render(
      <ThemeProvider storageKey="test-theme">
        <ThemeConsumer />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
    })
  })

  it('should handle corrupted localStorage gracefully', async () => {
    localStorageMock.getItem.mockReturnValueOnce('not valid json')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <ThemeProvider storageKey="test-theme">
        <ThemeConsumer />
      </ThemeProvider>
    )

    // Should render without crashing, falling back to defaults
    expect(screen.getByTestId('mode')).toBeInTheDocument()
    expect(warnSpy).toHaveBeenCalled()

    warnSpy.mockRestore()
  })
})

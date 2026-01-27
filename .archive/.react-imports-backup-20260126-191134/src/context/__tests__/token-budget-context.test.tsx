import * as React from 'react'
import { render, screen, act, renderHook } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import {
  TokenBudgetProvider,
  useTokenBudget,
  useTokenBudgetOptional,
} from '../token-budget-context'

// Mock the underlying hook
vi.mock('../../hooks/use-token-budget-monitor', async () => {
  const actual = await vi.importActual('../../hooks/use-token-budget-monitor')
  return {
    ...actual,
    useTokenBudgetMonitor: vi.fn(() => ({
      usage: {
        current: 0,
        max: 128000,
        available: 123904,
        utilizationPercent: 0,
        exceededPercent: 0,
        status: 'safe',
        reservedForOutput: 4096,
        effectiveMax: 123904,
      },
      isWarning: false,
      isCritical: false,
      isExceeded: false,
      wouldExceed: vi.fn(() => false),
      calculateTokens: vi.fn(async () => 10),
      updateMessages: vi.fn(),
      trimToCritical: vi.fn(() => null),
      reset: vi.fn(),
      lastTrimResult: null,
      isCalculating: false,
    })),
  }
})

describe('TokenBudgetProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('renders children', () => {
      render(
        <TokenBudgetProvider>
          <div data-testid="child">Hello</div>
        </TokenBudgetProvider>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('accepts custom config', () => {
      render(
        <TokenBudgetProvider
          config={{ maxInputTokens: 64000, reservedForOutput: 2048 }}
        >
          <div>Content</div>
        </TokenBudgetProvider>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('accepts model preset', () => {
      render(
        <TokenBudgetProvider model="gpt-4o">
          <div>Content</div>
        </TokenBudgetProvider>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })
})

describe('useTokenBudget', () => {
  it('provides budget context values', () => {
    function TestComponent() {
      const budget = useTokenBudget()
      return (
        <div>
          <span data-testid="current">{budget.usage.current}</span>
          <span data-testid="max">{budget.usage.max}</span>
          <span data-testid="status">{budget.usage.status}</span>
        </div>
      )
    }

    render(
      <TokenBudgetProvider>
        <TestComponent />
      </TokenBudgetProvider>
    )

    expect(screen.getByTestId('current')).toHaveTextContent('0')
    expect(screen.getByTestId('max')).toHaveTextContent('128000')
    expect(screen.getByTestId('status')).toHaveTextContent('safe')
  })

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function TestComponent() {
      useTokenBudget()
      return <div>Should not render</div>
    }

    expect(() => render(<TestComponent />)).toThrow(
      '[useTokenBudget] must be used within a TokenBudgetProvider'
    )

    consoleSpy.mockRestore()
  })

  it('provides model setter', () => {
    let capturedSetModel: ((model: string) => void) | null = null

    function TestComponent() {
      const budget = useTokenBudget()
      capturedSetModel = budget.setModel
      return <div data-testid="model">{budget.model ?? 'none'}</div>
    }

    render(
      <TokenBudgetProvider model="gpt-4o">
        <TestComponent />
      </TokenBudgetProvider>
    )

    expect(screen.getByTestId('model')).toHaveTextContent('gpt-4o')
    expect(capturedSetModel).toBeDefined()
  })

  it('provides config updater', () => {
    let capturedUpdateConfig:
      | ((config: { maxInputTokens?: number }) => void)
      | null = null

    function TestComponent() {
      const budget = useTokenBudget()
      capturedUpdateConfig = budget.updateConfig
      return <div data-testid="config">{budget.config.maxInputTokens}</div>
    }

    render(
      <TokenBudgetProvider config={{ maxInputTokens: 64000 }}>
        <TestComponent />
      </TokenBudgetProvider>
    )

    expect(screen.getByTestId('config')).toHaveTextContent('64000')
    expect(capturedUpdateConfig).toBeDefined()
  })
})

describe('useTokenBudgetOptional', () => {
  it('returns context when inside provider', () => {
    function TestComponent() {
      const budget = useTokenBudgetOptional()
      return (
        <div data-testid="result">{budget ? 'has-context' : 'no-context'}</div>
      )
    }

    render(
      <TokenBudgetProvider>
        <TestComponent />
      </TokenBudgetProvider>
    )

    expect(screen.getByTestId('result')).toHaveTextContent('has-context')
  })

  it('returns null when outside provider', () => {
    function TestComponent() {
      const budget = useTokenBudgetOptional()
      return (
        <div data-testid="result">{budget ? 'has-context' : 'no-context'}</div>
      )
    }

    render(<TestComponent />)

    expect(screen.getByTestId('result')).toHaveTextContent('no-context')
  })
})

describe('model changes', () => {
  it('updates config when model changes', () => {
    let capturedSetModel: ((model: string) => void) | null = null

    function TestComponent() {
      const budget = useTokenBudget()
      capturedSetModel = budget.setModel
      return <div data-testid="model">{budget.model ?? 'none'}</div>
    }

    const { rerender } = render(
      <TokenBudgetProvider model="gpt-4o">
        <TestComponent />
      </TokenBudgetProvider>
    )

    expect(screen.getByTestId('model')).toHaveTextContent('gpt-4o')

    // Change model via setModel
    act(() => {
      capturedSetModel?.('claude-sonnet-4')
    })

    // The component should show updated model
    expect(screen.getByTestId('model')).toHaveTextContent('claude-sonnet-4')
  })

  it('warns on invalid model', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    let capturedSetModel: ((model: string) => void) | null = null

    function TestComponent() {
      const budget = useTokenBudget()
      capturedSetModel = budget.setModel
      return <div data-testid="model">{budget.model ?? 'none'}</div>
    }

    render(
      <TokenBudgetProvider model="gpt-4o">
        <TestComponent />
      </TokenBudgetProvider>
    )

    // Try to set invalid model
    act(() => {
      capturedSetModel?.('invalid-model')
    })

    // Should warn and not change
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid model')
    )
    expect(screen.getByTestId('model')).toHaveTextContent('gpt-4o')

    consoleSpy.mockRestore()
  })
})

describe('config overrides', () => {
  it('applies config overrides with model preset', () => {
    function TestComponent() {
      const budget = useTokenBudget()
      return (
        <div>
          <span data-testid="model">{budget.model}</span>
          <span data-testid="autoTrim">
            {budget.config.autoTrim ? 'yes' : 'no'}
          </span>
        </div>
      )
    }

    render(
      <TokenBudgetProvider model="gpt-4o" configOverrides={{ autoTrim: true }}>
        <TestComponent />
      </TokenBudgetProvider>
    )

    expect(screen.getByTestId('model')).toHaveTextContent('gpt-4o')
    expect(screen.getByTestId('autoTrim')).toHaveTextContent('yes')
  })
})

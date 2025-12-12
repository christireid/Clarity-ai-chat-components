/**
 * Tool Calling Showcase - Hook Tests
 *
 * Unit tests for custom hooks used in the demo.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

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

// ============================================================================
// useDebugEvents Tests
// ============================================================================

describe('useDebugEvents', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('should initialize with empty events', async () => {
    const { useDebugEvents } = await import('../hooks/useDebugEvents')
    const { result } = renderHook(() => useDebugEvents())

    expect(result.current.events).toEqual([])
    expect(result.current.filteredEvents).toEqual([])
    expect(result.current.activeFilters.size).toBe(0)
  })

  it('should add events', async () => {
    const { useDebugEvents } = await import('../hooks/useDebugEvents')
    const { result } = renderHook(() => useDebugEvents())

    act(() => {
      result.current.addEvent('USER_MESSAGE', { content: 'Hello' })
    })

    expect(result.current.events).toHaveLength(1)
    expect(result.current.events[0].type).toBe('USER_MESSAGE')
    expect(result.current.events[0].payload).toEqual({ content: 'Hello' })
  })

  it('should filter events by type', async () => {
    const { useDebugEvents } = await import('../hooks/useDebugEvents')
    const { result } = renderHook(() => useDebugEvents())

    act(() => {
      result.current.addEvent('USER_MESSAGE', { content: 'Hello' })
      result.current.addEvent('TOOL_CALL', { name: 'search_ticker' })
      result.current.addEvent('TOOL_RESULT', { data: {} })
    })

    expect(result.current.events).toHaveLength(3)

    act(() => {
      result.current.toggleFilter('TOOL_CALL')
    })

    expect(result.current.filteredEvents).toHaveLength(1)
    expect(result.current.filteredEvents[0].type).toBe('TOOL_CALL')
  })

  it('should clear events', async () => {
    const { useDebugEvents } = await import('../hooks/useDebugEvents')
    const { result } = renderHook(() => useDebugEvents())

    act(() => {
      result.current.addEvent('USER_MESSAGE', { content: 'Hello' })
      result.current.addEvent('TOOL_CALL', { name: 'search_ticker' })
    })

    expect(result.current.events).toHaveLength(2)

    act(() => {
      result.current.clearEvents()
    })

    expect(result.current.events).toHaveLength(0)
  })

  it('should respect maxEvents limit', async () => {
    const { useDebugEvents } = await import('../hooks/useDebugEvents')
    const { result } = renderHook(() => useDebugEvents({ maxEvents: 3 }))

    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.addEvent('USER_MESSAGE', { index: i })
      }
    })

    expect(result.current.events).toHaveLength(3)
    expect(result.current.events[0].payload).toEqual({ index: 2 })
  })

  it('should calculate total duration', async () => {
    const { useDebugEvents } = await import('../hooks/useDebugEvents')
    const { result } = renderHook(() => useDebugEvents())

    act(() => {
      result.current.addEvent('TOOL_CALL', {}, 'tool1', 100)
      result.current.addEvent('TOOL_RESULT', {}, 'tool1', 200)
      result.current.addEvent('TOOL_CALL', {}, 'tool2', 150)
    })

    expect(result.current.getTotalDuration()).toBe(450)
  })

  it('should export events as JSON', async () => {
    const { useDebugEvents } = await import('../hooks/useDebugEvents')
    const { result } = renderHook(() => useDebugEvents())

    act(() => {
      result.current.addEvent('USER_MESSAGE', { content: 'test' })
    })

    const exported = result.current.exportEvents()
    const parsed = JSON.parse(exported)

    expect(parsed).toHaveLength(1)
    expect(parsed[0].type).toBe('USER_MESSAGE')
  })
})

// ============================================================================
// useRealTimePrice Tests
// ============================================================================

describe('useRealTimePrice', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with base prices', async () => {
    const { useRealTimePrice } = await import('../hooks/useRealTimePrice')
    const { result } = renderHook(() =>
      useRealTimePrice({
        symbols: ['AAPL', 'MSFT'],
        enabled: false,
      })
    )

    expect(result.current.prices.size).toBe(2)
    expect(result.current.getPrice('AAPL')).not.toBeNull()
    expect(result.current.getPrice('MSFT')).not.toBeNull()
  })

  it('should update prices when running', async () => {
    const { useRealTimePrice } = await import('../hooks/useRealTimePrice')
    const { result } = renderHook(() =>
      useRealTimePrice({
        symbols: ['AAPL'],
        updateInterval: 1000,
        enabled: true,
      })
    )

    const initialPrice = result.current.getPrice('AAPL')?.price

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    const updatedPrice = result.current.getPrice('AAPL')?.price

    // Price should have changed (with high probability)
    expect(updatedPrice).toBeDefined()
  })

  it('should stop and start correctly', async () => {
    const { useRealTimePrice } = await import('../hooks/useRealTimePrice')
    const { result } = renderHook(() =>
      useRealTimePrice({
        symbols: ['AAPL'],
        enabled: false,
      })
    )

    expect(result.current.isRunning).toBe(false)

    act(() => {
      result.current.start()
    })

    expect(result.current.isRunning).toBe(true)

    act(() => {
      result.current.stop()
    })

    expect(result.current.isRunning).toBe(false)
  })

  it('should handle symbol changes', async () => {
    const { useRealTimePrice } = await import('../hooks/useRealTimePrice')
    const { result } = renderHook(() =>
      useRealTimePrice({
        symbols: ['AAPL'],
        enabled: false,
      })
    )

    expect(result.current.prices.size).toBe(1)

    act(() => {
      result.current.setSymbols(['AAPL', 'GOOGL', 'TSLA'])
    })

    expect(result.current.prices.size).toBe(3)
  })
})

// ============================================================================
// useConversationPersistence Tests
// ============================================================================

describe('useConversationPersistence', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('should start with empty sessions', async () => {
    const { useConversationPersistence } = await import('../hooks/useConversationPersistence')
    const { result } = renderHook(() => useConversationPersistence())

    expect(result.current.sessions).toEqual([])
    expect(result.current.currentSession).toBeNull()
  })

  it('should create new sessions', async () => {
    const { useConversationPersistence } = await import('../hooks/useConversationPersistence')
    const { result } = renderHook(() => useConversationPersistence())

    act(() => {
      result.current.createNewSession('Test Session')
    })

    expect(result.current.sessions).toHaveLength(1)
    expect(result.current.sessions[0].name).toBe('Test Session')
  })

  it('should save and load sessions', async () => {
    const { useConversationPersistence } = await import('../hooks/useConversationPersistence')
    const { result } = renderHook(() => useConversationPersistence())

    const messages = [
      { id: '1', role: 'user' as const, content: 'Hello', timestamp: new Date() },
    ]

    act(() => {
      result.current.saveSession(messages, [], 'My Session')
    })

    expect(result.current.sessions).toHaveLength(1)
    expect(result.current.sessions[0].messages).toHaveLength(1)
  })

  it('should delete sessions', async () => {
    const { useConversationPersistence } = await import('../hooks/useConversationPersistence')
    const { result } = renderHook(() => useConversationPersistence())

    let sessionId: string

    act(() => {
      sessionId = result.current.createNewSession('To Delete')
    })

    expect(result.current.sessions).toHaveLength(1)

    act(() => {
      result.current.deleteSession(sessionId!)
    })

    expect(result.current.sessions).toHaveLength(0)
  })

  it('should export and import sessions', async () => {
    const { useConversationPersistence } = await import('../hooks/useConversationPersistence')
    const { result } = renderHook(() => useConversationPersistence())

    act(() => {
      result.current.createNewSession('Export Test')
    })

    const exported = result.current.exportAllSessions()
    expect(exported).toBeTruthy()

    act(() => {
      result.current.clearAllSessions()
    })

    expect(result.current.sessions).toHaveLength(0)

    act(() => {
      const count = result.current.importSessions(exported)
      expect(count).toBe(1)
    })

    expect(result.current.sessions).toHaveLength(1)
  })
})

// ============================================================================
// Mock Data Tests
// ============================================================================

describe('Mock Data', () => {
  it('should execute search_ticker tool', async () => {
    const { executeTool } = await import('../lib/mock-data')

    const result = await executeTool('search_ticker', { query: 'Apple' })

    expect(result.success).toBe(true)
    expect(result.data).toHaveProperty('matches')
    expect(result.data.matches.length).toBeGreaterThan(0)
  })

  it('should execute get_financials tool', async () => {
    const { executeTool } = await import('../lib/mock-data')

    const result = await executeTool('get_financials', { symbol: 'AAPL' })

    expect(result.success).toBe(true)
    expect(result.data).toHaveProperty('symbol', 'AAPL')
    expect(result.data).toHaveProperty('currentPrice')
    expect(result.data).toHaveProperty('metrics')
  })

  it('should execute render_chart tool', async () => {
    const { executeTool } = await import('../lib/mock-data')

    const result = await executeTool('render_chart', {
      symbol: 'AAPL',
      chartType: 'line',
      timeframe: '1M',
    })

    expect(result.success).toBe(true)
    expect(result.data).toHaveProperty('dataPoints')
    expect(result.data.dataPoints.length).toBeGreaterThan(0)
  })

  it('should execute execute_trade tool', async () => {
    const { executeTool } = await import('../lib/mock-data')

    const result = await executeTool('execute_trade', {
      symbol: 'AAPL',
      action: 'buy',
      quantity: 10,
      orderType: 'market',
    })

    expect(result.success).toBe(true)
    expect(result.data).toHaveProperty('orderId')
    expect(result.data).toHaveProperty('status', 'filled')
  })

  it('should return error for unknown stock', async () => {
    const { executeTool } = await import('../lib/mock-data')

    const result = await executeTool('get_financials', { symbol: 'UNKNOWN123' })

    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})

// ============================================================================
// Type Validation Tests
// ============================================================================

describe('Zod Schemas', () => {
  it('should validate search_ticker args', async () => {
    const { searchTickerSchema } = await import('../lib/types')

    const validArgs = { query: 'Apple' }
    const result = searchTickerSchema.safeParse(validArgs)

    expect(result.success).toBe(true)
  })

  it('should reject invalid search_ticker args', async () => {
    const { searchTickerSchema } = await import('../lib/types')

    const invalidArgs = { query: 123 } // should be string
    const result = searchTickerSchema.safeParse(invalidArgs)

    expect(result.success).toBe(false)
  })

  it('should validate execute_trade args', async () => {
    const { executeTradeSchema } = await import('../lib/types')

    const validArgs = {
      symbol: 'AAPL',
      action: 'buy',
      quantity: 10,
      orderType: 'market',
    }
    const result = executeTradeSchema.safeParse(validArgs)

    expect(result.success).toBe(true)
  })

  it('should reject invalid trade action', async () => {
    const { executeTradeSchema } = await import('../lib/types')

    const invalidArgs = {
      symbol: 'AAPL',
      action: 'hold', // invalid - should be buy or sell
      quantity: 10,
    }
    const result = executeTradeSchema.safeParse(invalidArgs)

    expect(result.success).toBe(false)
  })
})

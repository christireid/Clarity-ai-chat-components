'use client'

/**
 * useRealTimePrice Hook
 *
 * Simulates real-time price updates for stock symbols.
 * Useful for demonstrating live data updates in the UI.
 */

import { useState, useEffect, useCallback, useRef } from 'react'

interface PriceUpdate {
  symbol: string
  price: number
  previousPrice: number
  change: number
  changePercent: number
  timestamp: Date
  volume: number
}

interface UseRealTimePriceOptions {
  symbols: string[]
  updateInterval?: number // ms
  volatility?: number // percentage
  enabled?: boolean
}

interface UseRealTimePriceReturn {
  prices: Map<string, PriceUpdate>
  getPrice: (symbol: string) => PriceUpdate | null
  isRunning: boolean
  start: () => void
  stop: () => void
  setSymbols: (symbols: string[]) => void
}

// Simulated base prices for common stocks
const BASE_PRICES: Record<string, number> = {
  AAPL: 178.50,
  MSFT: 378.25,
  GOOGL: 141.80,
  AMZN: 178.95,
  NVDA: 495.75,
  META: 505.60,
  TSLA: 248.30,
  AMD: 178.90,
  NFLX: 485.20,
  DIS: 91.45,
}

function getBasePrice(symbol: string): number {
  return BASE_PRICES[symbol.toUpperCase()] || 100 + Math.random() * 200
}

function simulatePriceChange(
  currentPrice: number,
  volatility: number
): { newPrice: number; volume: number } {
  // Random walk with mean reversion tendency
  const randomFactor = (Math.random() - 0.5) * 2
  const changePercent = randomFactor * volatility
  const newPrice = Math.max(0.01, currentPrice * (1 + changePercent / 100))

  // Simulate volume based on price movement magnitude
  const baseVolume = 100000
  const volumeMultiplier = 1 + Math.abs(changePercent) * 10
  const volume = Math.floor(baseVolume * volumeMultiplier * (0.5 + Math.random()))

  return { newPrice, volume }
}

export function useRealTimePrice(options: UseRealTimePriceOptions): UseRealTimePriceReturn {
  const {
    symbols: initialSymbols,
    updateInterval = 2000,
    volatility = 0.5,
    enabled = true,
  } = options

  const [symbols, setSymbols] = useState<string[]>(initialSymbols)
  const [prices, setPrices] = useState<Map<string, PriceUpdate>>(new Map())
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const pricesRef = useRef<Map<string, PriceUpdate>>(new Map())

  // Initialize prices for symbols
  useEffect(() => {
    const initialPrices = new Map<string, PriceUpdate>()

    symbols.forEach((symbol) => {
      const existing = pricesRef.current.get(symbol)
      if (existing) {
        initialPrices.set(symbol, existing)
      } else {
        const basePrice = getBasePrice(symbol)
        initialPrices.set(symbol, {
          symbol,
          price: basePrice,
          previousPrice: basePrice,
          change: 0,
          changePercent: 0,
          timestamp: new Date(),
          volume: Math.floor(Math.random() * 1000000),
        })
      }
    })

    setPrices(initialPrices)
    pricesRef.current = initialPrices
  }, [symbols])

  // Update prices periodically
  const updatePrices = useCallback(() => {
    setPrices((currentPrices) => {
      const newPrices = new Map<string, PriceUpdate>()

      currentPrices.forEach((current, symbol) => {
        const { newPrice, volume } = simulatePriceChange(current.price, volatility)
        const change = newPrice - current.price
        const changePercent = (change / current.price) * 100

        newPrices.set(symbol, {
          symbol,
          price: newPrice,
          previousPrice: current.price,
          change,
          changePercent,
          timestamp: new Date(),
          volume: current.volume + volume,
        })
      })

      pricesRef.current = newPrices
      return newPrices
    })
  }, [volatility])

  // Start/stop interval
  const start = useCallback(() => {
    if (intervalRef.current) return

    setIsRunning(true)
    intervalRef.current = setInterval(updatePrices, updateInterval)
  }, [updatePrices, updateInterval])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
  }, [])

  // Auto-start if enabled
  useEffect(() => {
    if (enabled && symbols.length > 0) {
      start()
    } else {
      stop()
    }

    return () => stop()
  }, [enabled, symbols.length, start, stop])

  // Get price for a specific symbol
  const getPrice = useCallback(
    (symbol: string): PriceUpdate | null => {
      return prices.get(symbol.toUpperCase()) || null
    },
    [prices]
  )

  // Set symbols handler
  const handleSetSymbols = useCallback((newSymbols: string[]) => {
    setSymbols(newSymbols.map((s) => s.toUpperCase()))
  }, [])

  return {
    prices,
    getPrice,
    isRunning,
    start,
    stop,
    setSymbols: handleSetSymbols,
  }
}

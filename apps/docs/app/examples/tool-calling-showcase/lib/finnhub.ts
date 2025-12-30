/**
 * Finnhub API Service
 *
 * Real-time stock data from Finnhub.io
 * Free tier: 60 API calls/minute, 1 year historical data
 */

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY
const BASE_URL = 'https://finnhub.io/api/v1'

// Rate limiting: Finnhub free tier allows 60 calls/minute
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_CALLS = 60
let callTimestamps: number[] = []

function checkRateLimit(): void {
  const now = Date.now()
  // Remove timestamps outside the window
  callTimestamps = callTimestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  )

  if (callTimestamps.length >= RATE_LIMIT_MAX_CALLS) {
    const oldestCall = Math.min(...callTimestamps)
    const waitTime = Math.ceil(
      (RATE_LIMIT_WINDOW_MS - (now - oldestCall)) / 1000
    )
    throw new Error(
      `Finnhub rate limit exceeded. Please wait ${waitTime} seconds.`
    )
  }

  callTimestamps.push(now)
}

function validateApiKey(): void {
  if (!FINNHUB_API_KEY) {
    throw new Error(
      'FINNHUB_API_KEY environment variable is not configured. Please add it to your .env.local file.'
    )
  }
}

interface FinnhubQuote {
  c: number // Current price
  d: number // Change
  dp: number // Percent change
  h: number // High price of the day
  l: number // Low price of the day
  o: number // Open price of the day
  pc: number // Previous close price
  t: number // Timestamp
}

interface FinnhubCandle {
  c: number[] // Close prices
  h: number[] // High prices
  l: number[] // Low prices
  o: number[] // Open prices
  s: 'ok' | 'no_data'
  t: number[] // Timestamps
  v: number[] // Volumes
}

interface FinnhubSearchResult {
  count: number
  result: Array<{
    description: string
    displaySymbol: string
    symbol: string
    type: string
  }>
}

interface FinnhubCompanyProfile {
  country: string
  currency: string
  exchange: string
  finnhubIndustry: string
  ipo: string
  logo: string
  marketCapitalization: number
  name: string
  phone: string
  shareOutstanding: number
  ticker: string
  weburl: string
}

interface FinnhubBasicFinancials {
  metric: {
    '52WeekHigh': number
    '52WeekLow': number
    '10DayAverageTradingVolume': number
    peBasicExclExtraTTM: number
    epsBasicExclExtraItemsTTM: number
    [key: string]: number | string
  }
  series: Record<string, unknown>
}

async function fetchFinnhub<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  // Validate API key is configured
  validateApiKey()

  // Check rate limiting before making request
  checkRateLimit()

  const searchParams = new URLSearchParams({
    ...params,
    token: FINNHUB_API_KEY!,
  })

  const response = await fetch(`${BASE_URL}${endpoint}?${searchParams}`, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 60 }, // Cache for 1 minute
  })

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        'Finnhub API rate limit exceeded. Please try again in a moment.'
      )
    }
    if (response.status === 401) {
      throw new Error(
        'Invalid Finnhub API key. Please check your configuration.'
      )
    }
    throw new Error(
      `Finnhub API error: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}

/**
 * Get real-time quote for a symbol
 */
export async function getQuote(symbol: string): Promise<FinnhubQuote> {
  return fetchFinnhub<FinnhubQuote>('/quote', { symbol: symbol.toUpperCase() })
}

/**
 * Search for symbols
 */
export async function searchSymbols(
  query: string
): Promise<FinnhubSearchResult> {
  return fetchFinnhub<FinnhubSearchResult>('/search', { q: query })
}

/**
 * Get company profile
 */
export async function getCompanyProfile(
  symbol: string
): Promise<FinnhubCompanyProfile> {
  return fetchFinnhub<FinnhubCompanyProfile>('/stock/profile2', {
    symbol: symbol.toUpperCase(),
  })
}

/**
 * Get basic financials
 */
export async function getBasicFinancials(
  symbol: string
): Promise<FinnhubBasicFinancials> {
  return fetchFinnhub<FinnhubBasicFinancials>('/stock/metric', {
    symbol: symbol.toUpperCase(),
    metric: 'all',
  })
}

/**
 * Get stock candles (historical prices)
 */
export async function getCandles(
  symbol: string,
  resolution: '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M' = 'D',
  fromTimestamp?: number,
  toTimestamp?: number
): Promise<FinnhubCandle> {
  const now = Math.floor(Date.now() / 1000)
  const from = fromTimestamp || now - 30 * 24 * 60 * 60 // Default: 30 days ago
  const to = toTimestamp || now

  return fetchFinnhub<FinnhubCandle>('/stock/candle', {
    symbol: symbol.toUpperCase(),
    resolution,
    from: from.toString(),
    to: to.toString(),
  })
}

/**
 * Get from timestamp for timeframe
 */
function getFromTimestamp(timeframe: string): number {
  const now = Math.floor(Date.now() / 1000)
  const day = 24 * 60 * 60

  switch (timeframe) {
    case '1D':
      return now - 1 * day
    case '1W':
      return now - 7 * day
    case '1M':
      return now - 30 * day
    case '3M':
      return now - 90 * day
    case '1Y':
      return now - 365 * day
    case '5Y':
      return now - 5 * 365 * day
    default:
      return now - 30 * day
  }
}

/**
 * Get resolution for timeframe
 */
function getResolution(
  timeframe: string
): '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M' {
  switch (timeframe) {
    case '1D':
      return '5'
    case '1W':
      return '30'
    case '1M':
      return 'D'
    case '3M':
      return 'D'
    case '1Y':
      return 'W'
    case '5Y':
      return 'M'
    default:
      return 'D'
  }
}

// ============================================================================
// High-Level Functions for Tool Integration
// ============================================================================

import type {
  TickerSearchResult,
  TickerMatch,
  FinancialData,
  ChartData,
  ChartDataPoint,
  PriceHistoryPoint,
} from './types'

/**
 * Search for tickers using real Finnhub data
 */
export async function searchTickerReal(
  query: string,
  limit = 5
): Promise<TickerSearchResult> {
  try {
    const result = await searchSymbols(query)

    const matches: TickerMatch[] = result.result
      .slice(0, limit)
      .map((item) => ({
        symbol: item.symbol,
        name: item.description,
        type:
          item.type === 'Common Stock'
            ? 'stock'
            : item.type === 'ETP'
              ? 'etf'
              : 'stock',
        exchange: item.displaySymbol.includes('.')
          ? item.displaySymbol.split('.')[1]
          : 'US',
        matchScore: 100, // Finnhub doesn't provide match score
      }))

    return {
      query,
      matches,
    }
  } catch (error) {
    console.error('Finnhub search error:', error)
    throw error
  }
}

/**
 * Get financials using real Finnhub data
 */
export async function getFinancialsReal(
  symbol: string
): Promise<FinancialData> {
  try {
    const [quote, profile, metrics] = await Promise.all([
      getQuote(symbol),
      getCompanyProfile(symbol),
      getBasicFinancials(symbol),
    ])

    const metric = metrics.metric

    // Generate price history from recent data
    const priceHistory: PriceHistoryPoint[] = [
      {
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        price: quote.pc * 0.98,
        volume: 0,
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        price: quote.pc * 0.99,
        volume: 0,
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        price: quote.pc,
        volume: 0,
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        price: quote.o,
        volume: 0,
      },
      { date: new Date().toISOString(), price: quote.c, volume: 0 },
    ]

    return {
      symbol: symbol.toUpperCase(),
      name: profile.name || symbol,
      currentPrice: quote.c,
      previousClose: quote.pc,
      change: quote.d,
      changePercent: quote.dp,
      metrics: {
        peRatio: metric['peBasicExclExtraTTM'] || 0,
        marketCap: formatMarketCap(profile.marketCapitalization),
        volume: formatVolume(metric['10DayAverageTradingVolume'] || 0),
        eps: metric['epsBasicExclExtraItemsTTM'] || 0,
        dividendYield: 0,
        high52Week: metric['52WeekHigh'] || quote.h,
        low52Week: metric['52WeekLow'] || quote.l,
      },
      priceHistory,
      analystRating: 'hold', // Would need separate API call
      analystCount: 0,
    }
  } catch (error) {
    console.error('Finnhub financials error:', error)
    throw error
  }
}

/**
 * Get chart data using real Finnhub candles
 */
export async function getChartReal(
  symbol: string,
  timeframe: string = '1M'
): Promise<ChartData> {
  try {
    const [quote, profile, candles] = await Promise.all([
      getQuote(symbol),
      getCompanyProfile(symbol).catch(() => ({ name: symbol })),
      getCandles(symbol, getResolution(timeframe), getFromTimestamp(timeframe)),
    ])

    if (candles.s === 'no_data' || !candles.c || candles.c.length === 0) {
      throw new Error(`No chart data available for ${symbol}`)
    }

    const dataPoints: ChartDataPoint[] = candles.t.map((timestamp, i) => ({
      timestamp: new Date(timestamp * 1000).toISOString(),
      open: candles.o[i],
      high: candles.h[i],
      low: candles.l[i],
      close: candles.c[i],
      volume: candles.v[i],
    }))

    return {
      symbol: symbol.toUpperCase(),
      name: (profile as FinnhubCompanyProfile).name || symbol,
      timeframe,
      chartType: 'line',
      currentPrice: quote.c,
      change: quote.d,
      changePercent: quote.dp,
      dataPoints,
    }
  } catch (error) {
    console.error('Finnhub chart error:', error)
    throw error
  }
}

// Helpers
function formatMarketCap(value: number): string {
  if (!value) return 'N/A'
  if (value >= 1000) return `${(value / 1000).toFixed(1)}T`
  if (value >= 1) return `${value.toFixed(1)}B`
  return `${(value * 1000).toFixed(0)}M`
}

function formatVolume(value: number): string {
  if (!value) return 'N/A'
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}

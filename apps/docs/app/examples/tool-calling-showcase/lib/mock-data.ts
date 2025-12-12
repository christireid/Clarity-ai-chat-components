/**
 * Advanced Tool Calling Showcase - Mock Data & Tool Execution
 *
 * Simulated API responses for the Stock Market Analyst demo
 * No real API keys required - fully self-contained
 */

import {
  searchTickerSchema,
  getFinancialsSchema,
  renderChartSchema,
  executeTradeSchema,
  type SearchTickerArgs,
  type GetFinancialsArgs,
  type RenderChartArgs,
  type ExecuteTradeArgs,
  type TickerSearchResult,
  type FinancialData,
  type ChartData,
  type TradeResult,
  type PriceHistoryPoint,
  type ChartDataPoint,
  type ToolName,
  TOOL_NAMES,
} from './types'

// ============================================================================
// Mock Stock Database
// ============================================================================

const STOCK_DATABASE: Record<
  string,
  {
    symbol: string
    name: string
    exchange: string
    type: 'stock' | 'etf' | 'crypto'
    basePrice: number
    volatility: number
    peRatio: number
    marketCap: string
    eps: number
    dividendYield: number
  }
> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    type: 'stock',
    basePrice: 189.25,
    volatility: 0.02,
    peRatio: 29.5,
    marketCap: '$2.95T',
    eps: 6.42,
    dividendYield: 0.5,
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    type: 'stock',
    basePrice: 141.8,
    volatility: 0.025,
    peRatio: 24.2,
    marketCap: '$1.78T',
    eps: 5.86,
    dividendYield: 0,
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    type: 'stock',
    basePrice: 378.91,
    volatility: 0.018,
    peRatio: 35.8,
    marketCap: '$2.81T',
    eps: 10.58,
    dividendYield: 0.8,
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    exchange: 'NASDAQ',
    type: 'stock',
    basePrice: 178.25,
    volatility: 0.028,
    peRatio: 62.4,
    marketCap: '$1.85T',
    eps: 2.86,
    dividendYield: 0,
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    exchange: 'NASDAQ',
    type: 'stock',
    basePrice: 248.5,
    volatility: 0.045,
    peRatio: 72.1,
    marketCap: '$789B',
    eps: 3.45,
    dividendYield: 0,
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    type: 'stock',
    basePrice: 875.35,
    volatility: 0.04,
    peRatio: 68.5,
    marketCap: '$2.16T',
    eps: 12.78,
    dividendYield: 0.02,
  },
  META: {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    exchange: 'NASDAQ',
    type: 'stock',
    basePrice: 505.75,
    volatility: 0.032,
    peRatio: 28.9,
    marketCap: '$1.29T',
    eps: 17.5,
    dividendYield: 0.4,
  },
  SPY: {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    exchange: 'NYSE',
    type: 'etf',
    basePrice: 512.45,
    volatility: 0.012,
    peRatio: 22.5,
    marketCap: '$485B',
    eps: 22.78,
    dividendYield: 1.3,
  },
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    exchange: 'CRYPTO',
    type: 'crypto',
    basePrice: 67250,
    volatility: 0.06,
    peRatio: 0,
    marketCap: '$1.32T',
    eps: 0,
    dividendYield: 0,
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    exchange: 'CRYPTO',
    type: 'crypto',
    basePrice: 3485,
    volatility: 0.07,
    peRatio: 0,
    marketCap: '$418B',
    eps: 0,
    dividendYield: 0,
  },
}

// ============================================================================
// Utility Functions
// ============================================================================

function randomVariation(base: number, volatility: number): number {
  const variation = (Math.random() - 0.5) * 2 * volatility * base
  return Math.round((base + variation) * 100) / 100
}

function generatePriceHistory(
  basePrice: number,
  volatility: number,
  days: number
): PriceHistoryPoint[] {
  const history: PriceHistoryPoint[] = []
  let currentPrice = basePrice * (1 - volatility * days * 0.01) // Start lower for uptrend

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const open = currentPrice
    const dailyChange = randomVariation(currentPrice, volatility)
    const high = Math.max(open, dailyChange) * (1 + Math.random() * volatility)
    const low = Math.min(open, dailyChange) * (1 - Math.random() * volatility)
    const close = dailyChange
    const volume = Math.floor(Math.random() * 50000000) + 10000000

    history.push({
      date: date.toISOString().split('T')[0],
      price: close,
      volume,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
    })

    currentPrice = close
  }

  return history
}

function generateChartData(
  basePrice: number,
  volatility: number,
  timeframe: string
): ChartDataPoint[] {
  const pointsMap: Record<string, number> = {
    '1D': 78, // 5-min intervals for 6.5 hours
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '1Y': 252,
    '5Y': 1260,
  }

  const points = pointsMap[timeframe] || 30
  const data: ChartDataPoint[] = []
  let currentPrice = basePrice * (1 - volatility * 0.1)

  for (let i = 0; i < points; i++) {
    const timestamp = new Date()

    if (timeframe === '1D') {
      timestamp.setMinutes(timestamp.getMinutes() - (points - i) * 5)
    } else {
      timestamp.setDate(timestamp.getDate() - (points - i))
    }

    const open = currentPrice
    const change = randomVariation(currentPrice, volatility * 0.5)
    const high = Math.max(open, change) * (1 + Math.random() * volatility * 0.3)
    const low = Math.min(open, change) * (1 - Math.random() * volatility * 0.3)
    const close = change
    const volume = Math.floor(Math.random() * 10000000) + 1000000

    data.push({
      timestamp: timestamp.toISOString(),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    })

    currentPrice = close
  }

  return data
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================================================
// Tool Execution Functions
// ============================================================================

export async function executeSearchTicker(args: SearchTickerArgs): Promise<TickerSearchResult> {
  await delay(300 + Math.random() * 400)

  const query = args.query.toLowerCase()
  const limit = args.limit || 5

  const matches = Object.values(STOCK_DATABASE)
    .filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query)
    )
    .map((stock) => {
      const symbolMatch = stock.symbol.toLowerCase().startsWith(query) ? 100 : 0
      const nameMatch = stock.name.toLowerCase().includes(query) ? 50 : 0
      const exactMatch = stock.symbol.toLowerCase() === query ? 150 : 0

      return {
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
        type: stock.type,
        matchScore: symbolMatch + nameMatch + exactMatch,
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)

  // If no matches, return some suggestions
  if (matches.length === 0) {
    const suggestions = Object.values(STOCK_DATABASE)
      .slice(0, 3)
      .map((stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
        type: stock.type,
        matchScore: 10,
      }))

    return {
      matches: suggestions,
      query: args.query,
    }
  }

  return {
    matches,
    query: args.query,
  }
}

export async function executeGetFinancials(args: GetFinancialsArgs): Promise<FinancialData> {
  await delay(500 + Math.random() * 500)

  const symbol = args.symbol.toUpperCase()
  const stock = STOCK_DATABASE[symbol]

  if (!stock) {
    throw new Error(`Stock not found: ${symbol}`)
  }

  const currentPrice = randomVariation(stock.basePrice, stock.volatility * 0.5)
  const previousClose = stock.basePrice
  const change = currentPrice - previousClose
  const changePercent = (change / previousClose) * 100

  const ratings: Array<'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'> = [
    'strong_buy',
    'buy',
    'hold',
  ]
  const analystRating = ratings[Math.floor(Math.random() * ratings.length)]

  return {
    symbol: stock.symbol,
    name: stock.name,
    currentPrice,
    previousClose,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    metrics: {
      peRatio: stock.peRatio,
      marketCap: stock.marketCap,
      volume: `${Math.floor(Math.random() * 50 + 20)}M`,
      eps: stock.eps,
      dividendYield: stock.dividendYield,
      high52Week: Math.round(stock.basePrice * 1.25 * 100) / 100,
      low52Week: Math.round(stock.basePrice * 0.75 * 100) / 100,
    },
    priceHistory: args.includeHistory
      ? generatePriceHistory(stock.basePrice, stock.volatility, 30)
      : [],
    analystRating,
    analystCount: Math.floor(Math.random() * 20) + 15,
  }
}

export async function executeRenderChart(args: RenderChartArgs): Promise<ChartData> {
  await delay(400 + Math.random() * 400)

  const symbol = args.symbol.toUpperCase()
  const stock = STOCK_DATABASE[symbol]

  if (!stock) {
    throw new Error(`Stock not found: ${symbol}`)
  }

  const dataPoints = generateChartData(stock.basePrice, stock.volatility, args.timeframe)
  const lastPoint = dataPoints[dataPoints.length - 1]
  const firstPoint = dataPoints[0]

  const change = lastPoint.close - firstPoint.open
  const changePercent = (change / firstPoint.open) * 100

  // Generate indicators if requested
  const indicators: Record<string, number[]> = {}

  if (args.indicators?.includes('sma_20') && dataPoints.length >= 20) {
    indicators.sma_20 = dataPoints.map((_, i, arr) => {
      if (i < 19) return arr[i].close
      const slice = arr.slice(i - 19, i + 1)
      return Math.round((slice.reduce((sum, p) => sum + p.close, 0) / 20) * 100) / 100
    })
  }

  if (args.indicators?.includes('sma_50') && dataPoints.length >= 50) {
    indicators.sma_50 = dataPoints.map((_, i, arr) => {
      if (i < 49) return arr[i].close
      const slice = arr.slice(i - 49, i + 1)
      return Math.round((slice.reduce((sum, p) => sum + p.close, 0) / 50) * 100) / 100
    })
  }

  return {
    symbol: stock.symbol,
    name: stock.name,
    timeframe: args.timeframe,
    chartType: args.chartType,
    dataPoints,
    indicators: Object.keys(indicators).length > 0 ? indicators : undefined,
    currentPrice: lastPoint.close,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
  }
}

export async function executeExecuteTrade(args: ExecuteTradeArgs): Promise<TradeResult> {
  await delay(800 + Math.random() * 700)

  const symbol = args.symbol.toUpperCase()
  const stock = STOCK_DATABASE[symbol]

  if (!stock) {
    throw new Error(`Stock not found: ${symbol}`)
  }

  const executedPrice =
    args.orderType === 'limit' && args.limitPrice
      ? args.limitPrice
      : randomVariation(stock.basePrice, stock.volatility * 0.1)

  const totalValue = executedPrice * args.quantity
  const fees = Math.round(totalValue * 0.001 * 100) / 100 // 0.1% fee

  return {
    orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'filled',
    symbol: stock.symbol,
    action: args.action,
    quantity: args.quantity,
    executedPrice: Math.round(executedPrice * 100) / 100,
    totalValue: Math.round(totalValue * 100) / 100,
    fees,
    timestamp: new Date().toISOString(),
  }
}

// ============================================================================
// Unified Tool Executor
// ============================================================================

export type ToolResult = {
  success: boolean
  data: unknown
  error?: string
}

/**
 * Type-safe tool executor with Zod validation
 * Validates arguments before execution to prevent runtime type errors
 */
export async function executeTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  // Validate tool name
  if (!TOOL_NAMES.includes(name as ToolName)) {
    return {
      success: false,
      data: null,
      error: `Unknown tool: ${name}. Valid tools are: ${TOOL_NAMES.join(', ')}`,
    }
  }

  try {
    let data: unknown

    switch (name) {
      case 'search_ticker': {
        const parsed = searchTickerSchema.safeParse(args)
        if (!parsed.success) {
          throw new Error(`Invalid search_ticker args: ${parsed.error.message}`)
        }
        data = await executeSearchTicker(parsed.data)
        break
      }
      case 'get_financials': {
        const parsed = getFinancialsSchema.safeParse(args)
        if (!parsed.success) {
          throw new Error(`Invalid get_financials args: ${parsed.error.message}`)
        }
        data = await executeGetFinancials(parsed.data)
        break
      }
      case 'render_chart': {
        const parsed = renderChartSchema.safeParse(args)
        if (!parsed.success) {
          throw new Error(`Invalid render_chart args: ${parsed.error.message}`)
        }
        data = await executeRenderChart(parsed.data)
        break
      }
      case 'execute_trade': {
        const parsed = executeTradeSchema.safeParse(args)
        if (!parsed.success) {
          throw new Error(`Invalid execute_trade args: ${parsed.error.message}`)
        }
        data = await executeExecuteTrade(parsed.data)
        break
      }
      default:
        // This should never happen due to the check above
        throw new Error(`Unknown tool: ${name}`)
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Tool execution failed',
    }
  }
}

// ============================================================================
// Simulated AI Responses
// ============================================================================

export interface SimulatedResponse {
  thinking?: string
  toolCalls?: Array<{
    id: string
    name: string
    args: Record<string, unknown>
  }>
  content?: string
}

export function getSimulatedResponse(userMessage: string): SimulatedResponse {
  const message = userMessage.toLowerCase()

  // Pattern matching for different intents
  if (message.includes('analyze') || message.includes('look up') || message.includes('tell me about')) {
    const stockMatch = message.match(/\b(aapl|apple|googl|google|msft|microsoft|amzn|amazon|tsla|tesla|nvda|nvidia|meta|facebook|spy|btc|bitcoin|eth|ethereum)\b/i)
    const symbol = stockMatch ? stockMatch[1].toUpperCase() : 'AAPL'

    // Map common names to symbols
    const symbolMap: Record<string, string> = {
      APPLE: 'AAPL',
      GOOGLE: 'GOOGL',
      MICROSOFT: 'MSFT',
      AMAZON: 'AMZN',
      TESLA: 'TSLA',
      NVIDIA: 'NVDA',
      FACEBOOK: 'META',
      BITCOIN: 'BTC',
      ETHEREUM: 'ETH',
    }
    const resolvedSymbol = symbolMap[symbol] || symbol

    return {
      thinking: `User wants to analyze ${resolvedSymbol}. I'll first search for the ticker to confirm, then get detailed financials.`,
      toolCalls: [
        {
          id: `tc_${Date.now()}_1`,
          name: 'search_ticker',
          args: { query: resolvedSymbol, limit: 3 },
        },
      ],
    }
  }

  if (message.includes('chart') || message.includes('graph') || message.includes('visualize')) {
    const stockMatch = message.match(/\b(aapl|googl|msft|amzn|tsla|nvda|meta|spy|btc|eth)\b/i)
    const symbol = stockMatch ? stockMatch[1].toUpperCase() : 'AAPL'
    const timeframe = message.includes('year') ? '1Y' : message.includes('week') ? '1W' : '1M'

    return {
      thinking: `User wants a chart for ${symbol}. I'll render an interactive chart with the ${timeframe} timeframe.`,
      toolCalls: [
        {
          id: `tc_${Date.now()}_1`,
          name: 'render_chart',
          args: {
            symbol,
            chartType: 'area',
            timeframe,
            indicators: ['sma_20'],
          },
        },
      ],
    }
  }

  if (message.includes('buy') || message.includes('sell') || message.includes('trade')) {
    const action = message.includes('sell') ? 'sell' : 'buy'
    const stockMatch = message.match(/\b(aapl|googl|msft|amzn|tsla|nvda|meta|spy)\b/i)
    const symbol = stockMatch ? stockMatch[1].toUpperCase() : 'AAPL'
    const quantityMatch = message.match(/(\d+)\s*(shares?)?/i)
    const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 10

    return {
      thinking: `User wants to ${action} ${quantity} shares of ${symbol}. This requires approval before execution.`,
      toolCalls: [
        {
          id: `tc_${Date.now()}_1`,
          name: 'execute_trade',
          args: {
            symbol,
            action,
            quantity,
            orderType: 'market',
          },
        },
      ],
    }
  }

  if (message.includes('search') || message.includes('find') || message.includes('ticker')) {
    const queryMatch = message.match(/(?:for|ticker|symbol)\s+["']?(\w+)["']?/i)
    const query = queryMatch ? queryMatch[1] : 'tech'

    return {
      thinking: `User is searching for ticker symbols matching "${query}".`,
      toolCalls: [
        {
          id: `tc_${Date.now()}_1`,
          name: 'search_ticker',
          args: { query, limit: 5 },
        },
      ],
    }
  }

  // Default: helpful response
  return {
    content: `I'm your AI Stock Market Analyst. I can help you with:

• **Search Tickers** - Find stock symbols (e.g., "Search for Apple")
• **Analyze Stocks** - Get detailed financials (e.g., "Analyze TSLA")
• **View Charts** - Interactive price charts (e.g., "Show me a chart of NVDA")
• **Execute Trades** - Buy/sell with approval (e.g., "Buy 10 shares of AAPL")

What would you like to explore?`,
  }
}

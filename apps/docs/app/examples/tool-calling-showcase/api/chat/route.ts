import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'

// Real Finnhub data for search, financials, and charts
import {
  searchTickerReal,
  getFinancialsReal,
  getChartReal,
} from '../../lib/finnhub'

// Mock trade execution (trades remain simulated for safety)
import { executeExecuteTrade } from '../../lib/mock-data'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are an AI Stock Market Analyst assistant powered by REAL market data from Finnhub. You help users research stocks, analyze financials, view charts, and execute simulated trades.

Available tools:
- search_ticker: Search for REAL stock ticker symbols by company name (uses Finnhub API)
- get_financials: Get REAL financial data for a stock - live prices, P/E, market cap (uses Finnhub API)
- render_chart: Display an interactive price chart with REAL historical data (uses Finnhub API)
- execute_trade: Execute a simulated buy/sell trade (CRITICAL - requires user confirmation)

Guidelines:
1. When a user mentions a company name, first search for the ticker
2. After finding a ticker, automatically fetch financials to provide analysis
3. The data you retrieve is REAL and LIVE from the market
4. Offer insights based on the real metrics you retrieve
5. For trades, always confirm - these are simulated but feel real

Keep responses concise and insightful. Reference the actual numbers you retrieve.`,
    messages,
    tools: {
      search_ticker: tool({
        description: 'Search for stock ticker symbols by company name using REAL Finnhub data',
        parameters: z.object({
          query: z.string().describe('Company name or partial ticker symbol to search'),
          limit: z.number().optional().default(5).describe('Maximum results to return'),
        }),
        execute: async ({ query, limit }) => {
          try {
            return await searchTickerReal(query, limit)
          } catch (error) {
            return {
              query,
              matches: [],
              error: error instanceof Error ? error.message : 'Search failed',
              timestamp: new Date().toISOString(),
            }
          }
        },
      }),
      get_financials: tool({
        description: 'Get REAL comprehensive financial data for a stock including live price, metrics, and more',
        parameters: z.object({
          symbol: z.string().describe('Stock ticker symbol (e.g., AAPL, MSFT)'),
          includeHistory: z.boolean().optional().default(true).describe('Include price history'),
        }),
        execute: async ({ symbol }) => {
          try {
            return await getFinancialsReal(symbol)
          } catch (error) {
            return {
              symbol,
              error: error instanceof Error ? error.message : 'Failed to fetch financials',
              currentPrice: 0,
              change: 0,
              changePercent: 0,
            }
          }
        },
      }),
      render_chart: tool({
        description: 'Render an interactive stock price chart with REAL historical candlestick data',
        parameters: z.object({
          symbol: z.string().describe('Stock ticker symbol'),
          chartType: z.enum(['line', 'candlestick', 'area']).optional().default('candlestick'),
          timeframe: z.enum(['1D', '1W', '1M', '3M', '1Y', '5Y']).optional().default('1M'),
          indicators: z.array(z.string()).optional().describe('Technical indicators to show'),
        }),
        execute: async ({ symbol, timeframe }) => {
          try {
            return await getChartReal(symbol, timeframe)
          } catch (error) {
            return {
              symbol,
              error: error instanceof Error ? error.message : 'Failed to fetch chart data',
              dataPoints: [],
            }
          }
        },
      }),
      execute_trade: tool({
        description: 'Execute a SIMULATED stock trade. CRITICAL ACTION - requires user confirmation',
        parameters: z.object({
          symbol: z.string().describe('Stock ticker symbol'),
          action: z.enum(['buy', 'sell']).describe('Buy or sell'),
          quantity: z.number().positive().describe('Number of shares'),
          orderType: z.enum(['market', 'limit']).optional().default('market'),
          limitPrice: z.number().optional().describe('Limit price if order type is limit'),
        }),
        execute: async ({ symbol, action, quantity, orderType, limitPrice }) => {
          return executeExecuteTrade({ symbol, action, quantity, orderType, limitPrice })
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}

/**
 * Advanced Tool Calling Showcase - Type Definitions
 *
 * Complete type system for the Stock Market Analyst demo
 */

import { z } from 'zod'

// ============================================================================
// Tool Schemas (Zod)
// ============================================================================

export const searchTickerSchema = z.object({
  query: z.string().describe('Company name or partial ticker symbol'),
  limit: z.number().optional().default(5).describe('Max results to return'),
})

export const getFinancialsSchema = z.object({
  symbol: z.string().describe('Stock ticker symbol'),
  metrics: z
    .array(z.enum(['price', 'pe_ratio', 'market_cap', 'volume', 'earnings', 'dividends']))
    .optional()
    .default(['price', 'pe_ratio', 'market_cap']),
  includeHistory: z.boolean().optional().default(true).describe('Include 30-day price history'),
})

export const renderChartSchema = z.object({
  symbol: z.string().describe('Stock ticker symbol'),
  chartType: z.enum(['line', 'candlestick', 'area', 'comparison']),
  timeframe: z.enum(['1D', '1W', '1M', '3M', '1Y', '5Y']).default('1M'),
  indicators: z.array(z.enum(['sma_20', 'sma_50', 'rsi', 'macd', 'bollinger'])).optional(),
  compareWith: z.array(z.string()).optional().describe('Other tickers to compare'),
})

export const executeTradeSchema = z.object({
  symbol: z.string().describe('Stock ticker symbol'),
  action: z.enum(['buy', 'sell']),
  quantity: z.number().positive().describe('Number of shares'),
  orderType: z.enum(['market', 'limit', 'stop_loss']).default('market'),
  limitPrice: z.number().optional().describe('Required for limit orders'),
})

// ============================================================================
// Inferred Types from Schemas
// ============================================================================

export type SearchTickerArgs = z.infer<typeof searchTickerSchema>
export type GetFinancialsArgs = z.infer<typeof getFinancialsSchema>
export type RenderChartArgs = z.infer<typeof renderChartSchema>
export type ExecuteTradeArgs = z.infer<typeof executeTradeSchema>

// ============================================================================
// Tool Result Types
// ============================================================================

export interface TickerMatch {
  symbol: string
  name: string
  exchange: string
  type: 'stock' | 'etf' | 'crypto'
  matchScore: number
}

export interface TickerSearchResult {
  matches: TickerMatch[]
  query: string
}

export interface PriceHistoryPoint {
  date: string
  price: number
  volume: number
  open?: number
  high?: number
  low?: number
  close?: number
}

export interface FinancialData {
  symbol: string
  name: string
  currentPrice: number
  previousClose: number
  change: number
  changePercent: number
  metrics: {
    peRatio: number
    marketCap: string
    volume: string
    eps: number
    dividendYield: number
    high52Week: number
    low52Week: number
  }
  priceHistory: PriceHistoryPoint[]
  analystRating: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'
  analystCount: number
}

export interface ChartDataPoint {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface ChartData {
  symbol: string
  name: string
  timeframe: string
  chartType: string
  dataPoints: ChartDataPoint[]
  indicators?: Record<string, number[]>
  currentPrice: number
  change: number
  changePercent: number
}

export interface TradeResult {
  orderId: string
  status: 'pending' | 'filled' | 'partial' | 'rejected'
  symbol: string
  action: 'buy' | 'sell'
  quantity: number
  executedPrice: number
  totalValue: number
  fees: number
  timestamp: string
}

// ============================================================================
// Debug Event Types (Glass Box)
// ============================================================================

export type DebugEventType =
  | 'USER_MESSAGE'
  | 'ASSISTANT_THINKING'
  | 'ASSISTANT_MESSAGE'
  | 'TOOL_CALL'
  | 'TOOL_RESULT'
  | 'TOOL_ERROR'
  | 'AWAITING_APPROVAL'
  | 'APPROVAL_GRANTED'
  | 'APPROVAL_DENIED'
  | 'STREAM_START'
  | 'STREAM_END'

export interface DebugEvent {
  id: string
  timestamp: Date
  type: DebugEventType
  payload: unknown
  duration?: number
  toolName?: string
}

// ============================================================================
// UI State Types
// ============================================================================

export type ToolStatus = 'idle' | 'pending' | 'executing' | 'awaiting_approval' | 'complete' | 'error'

export interface ToolCallState {
  id: string
  name: string
  args: Record<string, unknown>
  status: ToolStatus
  result?: unknown
  error?: string
  startTime?: number
  endTime?: number
}

export type OrchestratorState =
  | 'idle'
  | 'streaming'
  | 'tool_pending'
  | 'awaiting_approval'
  | 'executing_tool'
  | 'completed'
  | 'error'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  toolCalls?: ToolCallState[]
  timestamp: Date
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface ToolComponentProps<TData = unknown> {
  data: TData
  toolCall?: {
    name: string
    args: Record<string, unknown>
  }
  isLoading?: boolean
  onAction?: (action: string, payload?: unknown) => void
}

export interface TradeConfirmationProps {
  toolCall: {
    name: 'execute_trade'
    args: ExecuteTradeArgs
  }
  currentPrice: number
  onApprove: () => void
  onReject: () => void
  isProcessing?: boolean
}

export interface GlassBoxPanelProps {
  events: DebugEvent[]
  isExpanded: boolean
  onToggle: () => void
  maxEvents?: number
  filterTypes?: DebugEventType[]
}

// ============================================================================
// Tool Registry Type
// ============================================================================

export const TOOL_NAMES = ['search_ticker', 'get_financials', 'render_chart', 'execute_trade'] as const
export type ToolName = (typeof TOOL_NAMES)[number]

export const CRITICAL_TOOLS: ToolName[] = ['execute_trade']

export interface ToolDefinition {
  name: ToolName
  description: string
  schema: z.ZodObject<z.ZodRawShape>
  requiresApproval: boolean
  icon: string
  color: string
}

export const TOOL_DEFINITIONS: Record<ToolName, ToolDefinition> = {
  search_ticker: {
    name: 'search_ticker',
    description: 'Search for stock ticker symbols',
    schema: searchTickerSchema,
    requiresApproval: false,
    icon: '🔍',
    color: 'from-blue-500 to-cyan-500',
  },
  get_financials: {
    name: 'get_financials',
    description: 'Get financial data and metrics',
    schema: getFinancialsSchema,
    requiresApproval: false,
    icon: '📊',
    color: 'from-purple-500 to-pink-500',
  },
  render_chart: {
    name: 'render_chart',
    description: 'Render interactive stock chart',
    schema: renderChartSchema,
    requiresApproval: false,
    icon: '📈',
    color: 'from-green-500 to-emerald-500',
  },
  execute_trade: {
    name: 'execute_trade',
    description: 'Execute a stock trade',
    schema: executeTradeSchema,
    requiresApproval: true,
    icon: '💰',
    color: 'from-amber-500 to-orange-500',
  },
}

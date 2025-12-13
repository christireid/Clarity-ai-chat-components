/**
 * LLM Integration Configuration
 *
 * This file provides configuration options for integrating with real LLM providers.
 * Currently uses mock data by default, but can be configured to use actual APIs.
 */

import type { ToolName } from './types'

// ============================================================================
// Provider Configuration
// ============================================================================

export type LLMProvider = 'mock' | 'openai' | 'anthropic' | 'custom'

export interface LLMConfig {
  provider: LLMProvider
  apiKey?: string
  baseUrl?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

export interface ToolDefinitionForLLM {
  name: ToolName
  description: string
  parameters: Record<string, unknown>
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_LLM_CONFIG: LLMConfig = {
  provider: 'mock',
  model: 'gpt-4',
  maxTokens: 4096,
  temperature: 0.7,
}

// ============================================================================
// Tool Definitions for LLM
// ============================================================================

export const TOOL_DEFINITIONS_FOR_LLM: ToolDefinitionForLLM[] = [
  {
    name: 'search_ticker',
    description: 'Search for stock ticker symbols by company name or partial ticker',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Company name or partial ticker symbol to search for',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
          default: 5,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_financials',
    description: 'Get financial data and metrics for a specific stock',
    parameters: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Stock ticker symbol (e.g., AAPL, MSFT)',
        },
        metrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['price', 'pe_ratio', 'market_cap', 'volume', 'earnings', 'dividends'],
          },
          description: 'Specific metrics to retrieve',
        },
        includeHistory: {
          type: 'boolean',
          description: 'Whether to include 30-day price history',
          default: true,
        },
      },
      required: ['symbol'],
    },
  },
  {
    name: 'render_chart',
    description: 'Render an interactive stock price chart',
    parameters: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Stock ticker symbol',
        },
        chartType: {
          type: 'string',
          enum: ['line', 'candlestick', 'area', 'comparison'],
          description: 'Type of chart to render',
        },
        timeframe: {
          type: 'string',
          enum: ['1D', '1W', '1M', '3M', '1Y', '5Y'],
          description: 'Time period for the chart',
          default: '1M',
        },
        indicators: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['sma_20', 'sma_50', 'rsi', 'macd', 'bollinger'],
          },
          description: 'Technical indicators to overlay',
        },
      },
      required: ['symbol', 'chartType'],
    },
  },
  {
    name: 'execute_trade',
    description: 'Execute a stock trade (buy or sell). REQUIRES USER APPROVAL.',
    parameters: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Stock ticker symbol',
        },
        action: {
          type: 'string',
          enum: ['buy', 'sell'],
          description: 'Trade action to perform',
        },
        quantity: {
          type: 'number',
          description: 'Number of shares to trade',
        },
        orderType: {
          type: 'string',
          enum: ['market', 'limit', 'stop_loss'],
          description: 'Type of order',
          default: 'market',
        },
        limitPrice: {
          type: 'number',
          description: 'Price for limit orders',
        },
      },
      required: ['symbol', 'action', 'quantity'],
    },
  },
]

// ============================================================================
// System Prompt
// ============================================================================

export const SYSTEM_PROMPT = `You are a helpful AI stock market analyst assistant. You help users research stocks, analyze financial data, view charts, and execute trades.

You have access to the following tools:

1. **search_ticker**: Search for stock ticker symbols by company name
2. **get_financials**: Get detailed financial data and metrics for a stock
3. **render_chart**: Display an interactive stock price chart
4. **execute_trade**: Execute buy/sell orders (requires user approval)

Guidelines:
- When users ask about a stock by name, first use search_ticker to find the symbol
- After finding a symbol, automatically fetch financials to provide context
- Offer to show charts when discussing price movements
- Always confirm trade details before calling execute_trade
- Be concise but informative in your responses

Example workflow:
User: "Tell me about Apple stock"
1. Call search_ticker with query "Apple" to find AAPL
2. Call get_financials for AAPL to get current data
3. Provide a summary and offer to show a chart or execute trades`

// ============================================================================
// API Integration Helpers
// ============================================================================

/**
 * Format tools for OpenAI API
 */
export function formatToolsForOpenAI(): Array<{
  type: 'function'
  function: { name: string; description: string; parameters: Record<string, unknown> }
}> {
  return TOOL_DEFINITIONS_FOR_LLM.map((tool) => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }))
}

/**
 * Format tools for Anthropic API
 */
export function formatToolsForAnthropic(): Array<{
  name: string
  description: string
  input_schema: Record<string, unknown>
}> {
  return TOOL_DEFINITIONS_FOR_LLM.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.parameters,
  }))
}

/**
 * Parse tool calls from OpenAI response
 */
export function parseOpenAIToolCalls(
  toolCalls: Array<{ id: string; function: { name: string; arguments: string } }>
): Array<{ id: string; name: ToolName; args: Record<string, unknown> }> {
  return toolCalls.map((tc) => ({
    id: tc.id,
    name: tc.function.name as ToolName,
    args: JSON.parse(tc.function.arguments),
  }))
}

/**
 * Parse tool calls from Anthropic response
 */
export function parseAnthropicToolCalls(
  content: Array<{ type: string; id?: string; name?: string; input?: Record<string, unknown> }>
): Array<{ id: string; name: ToolName; args: Record<string, unknown> }> {
  return content
    .filter((block) => block.type === 'tool_use')
    .map((block) => ({
      id: block.id || `tool-${Date.now()}`,
      name: block.name as ToolName,
      args: block.input || {},
    }))
}

// ============================================================================
// Example API Integration
// ============================================================================

/**
 * Example: Call OpenAI API with tools
 *
 * Note: This is a reference implementation. In production, you would:
 * 1. Call this from a server-side API route
 * 2. Handle streaming responses
 * 3. Implement proper error handling
 */
export async function callOpenAI(
  config: LLMConfig,
  messages: Array<{ role: string; content: string }>,
  onToolCall?: (toolCall: { id: string; name: ToolName; args: Record<string, unknown> }) => Promise<unknown>
): Promise<string> {
  if (config.provider !== 'openai' || !config.apiKey) {
    throw new Error('OpenAI API key required')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      tools: formatToolsForOpenAI(),
      tool_choice: 'auto',
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  const choice = data.choices[0]

  // Handle tool calls
  if (choice.message.tool_calls && onToolCall) {
    const toolCalls = parseOpenAIToolCalls(choice.message.tool_calls)
    const results = []

    for (const tc of toolCalls) {
      const result = await onToolCall(tc)
      results.push({
        tool_call_id: tc.id,
        role: 'tool',
        content: JSON.stringify(result),
      })
    }

    // Continue conversation with tool results
    return callOpenAI(
      config,
      [
        ...messages,
        choice.message,
        ...results,
      ] as Array<{ role: string; content: string }>,
      onToolCall
    )
  }

  return choice.message.content
}

/**
 * Example: Call Anthropic API with tools
 */
export async function callAnthropic(
  config: LLMConfig,
  messages: Array<{ role: string; content: string }>,
  onToolCall?: (toolCall: { id: string; name: ToolName; args: Record<string, unknown> }) => Promise<unknown>
): Promise<string> {
  if (config.provider !== 'anthropic' || !config.apiKey) {
    throw new Error('Anthropic API key required')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model || 'claude-3-opus-20240229',
      system: SYSTEM_PROMPT,
      messages,
      tools: formatToolsForAnthropic(),
      max_tokens: config.maxTokens,
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`)
  }

  const data = await response.json()

  // Handle tool calls
  const toolUseBlocks = data.content.filter((block: { type: string }) => block.type === 'tool_use')
  if (toolUseBlocks.length > 0 && onToolCall) {
    const toolCalls = parseAnthropicToolCalls(data.content)
    const toolResults = []

    for (const tc of toolCalls) {
      const result = await onToolCall(tc)
      toolResults.push({
        type: 'tool_result',
        tool_use_id: tc.id,
        content: JSON.stringify(result),
      })
    }

    // Continue conversation with tool results
    return callAnthropic(
      config,
      [
        ...messages,
        { role: 'assistant', content: data.content },
        { role: 'user', content: toolResults },
      ] as Array<{ role: string; content: string }>,
      onToolCall
    )
  }

  // Extract text response
  const textBlock = data.content.find((block: { type: string }) => block.type === 'text')
  return textBlock?.text || ''
}

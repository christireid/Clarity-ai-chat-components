/**
 * Tool definitions for AI function calling
 */

import type { ChatCompletionTool } from 'openai/resources/chat/completions'

// ============================================================================
// Tool Definitions (OpenAI format)
// ============================================================================

export const TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get the current weather in a given location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA',
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'Temperature unit',
          },
        },
        required: ['location'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_web',
      description: 'Search the web for current information',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query',
          },
          num_results: {
            type: 'number',
            description: 'Number of results to return (1-10)',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculate',
      description: 'Perform mathematical calculations',
      parameters: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description:
              'The mathematical expression to evaluate, e.g. "2 + 2 * 3"',
          },
        },
        required: ['expression'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_stock_price',
      description: 'Get the current stock price for a symbol',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'The stock symbol, e.g. AAPL, GOOGL',
          },
        },
        required: ['symbol'],
      },
    },
  },
]

// ============================================================================
// Tool Execution (Simulated)
// ============================================================================

export interface ToolResult {
  success: boolean
  data: unknown
  error?: string
}

// Simulated tool execution
export async function executeTool(
  name: string,
  args: Record<string, unknown>
): Promise<ToolResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))

  switch (name) {
    case 'get_weather':
      return simulateWeather(args.location as string, args.unit as string)
    case 'search_web':
      return simulateSearch(args.query as string, args.num_results as number)
    case 'calculate':
      return simulateCalculate(args.expression as string)
    case 'get_stock_price':
      return simulateStockPrice(args.symbol as string)
    default:
      return { success: false, data: null, error: `Unknown tool: ${name}` }
  }
}

function simulateWeather(location: string, unit = 'fahrenheit'): ToolResult {
  const temp = Math.round(50 + Math.random() * 40)
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Snowy']
  const condition = conditions[Math.floor(Math.random() * conditions.length)]
  const humidity = Math.round(30 + Math.random() * 50)

  return {
    success: true,
    data: {
      location,
      temperature:
        unit === 'celsius' ? Math.round(((temp - 32) * 5) / 9) : temp,
      unit: unit === 'celsius' ? 'C' : 'F',
      condition,
      humidity: `${humidity}%`,
      wind: `${Math.round(5 + Math.random() * 20)} mph`,
    },
  }
}

function simulateSearch(query: string, numResults = 3): ToolResult {
  const results = []
  for (let i = 0; i < Math.min(numResults || 3, 5); i++) {
    results.push({
      title: `Result ${i + 1} for "${query}"`,
      url: `https://example.com/result-${i + 1}`,
      snippet: `This is a simulated search result about ${query}. It contains relevant information that might be helpful.`,
    })
  }

  return {
    success: true,
    data: {
      query,
      results,
      totalResults: Math.floor(Math.random() * 1000000) + 1000,
    },
  }
}

/**
 * Safe mathematical expression evaluator
 * Supports: +, -, *, /, %, parentheses, and decimal numbers
 * Does NOT use eval() - implements a proper tokenizer and parser
 * @exported for testing
 */
export function safeEvaluate(expression: string): number {
  // Tokenize the expression
  const tokens: string[] = []
  let current = ''

  for (const char of expression.replace(/\s/g, '')) {
    if ('+-*/%()'.includes(char)) {
      if (current) {
        tokens.push(current)
        current = ''
      }
      tokens.push(char)
    } else if (/[0-9.]/.test(char)) {
      current += char
    } else {
      throw new Error(`Invalid character: ${char}`)
    }
  }
  if (current) tokens.push(current)

  let pos = 0

  function parseNumber(): number {
    if (tokens[pos] === '(') {
      pos++ // skip '('
      const result = parseAddition()
      if (tokens[pos] !== ')') throw new Error('Missing closing parenthesis')
      pos++ // skip ')'
      return result
    }

    // Handle unary minus
    if (tokens[pos] === '-') {
      pos++
      return -parseNumber()
    }

    const num = parseFloat(tokens[pos])
    if (isNaN(num)) throw new Error(`Invalid number: ${tokens[pos]}`)
    pos++
    return num
  }

  function parseMultiplication(): number {
    let left = parseNumber()

    while (pos < tokens.length && ['*', '/', '%'].includes(tokens[pos])) {
      const op = tokens[pos]
      pos++
      const right = parseNumber()

      if (op === '*') left *= right
      else if (op === '/') {
        if (right === 0) throw new Error('Division by zero')
        left /= right
      } else if (op === '%') left %= right
    }

    return left
  }

  function parseAddition(): number {
    let left = parseMultiplication()

    while (pos < tokens.length && ['+', '-'].includes(tokens[pos])) {
      const op = tokens[pos]
      pos++
      const right = parseMultiplication()

      if (op === '+') left += right
      else left -= right
    }

    return left
  }

  const result = parseAddition()
  if (pos !== tokens.length)
    throw new Error('Unexpected tokens after expression')
  return result
}

function simulateCalculate(expression: string): ToolResult {
  try {
    const result = safeEvaluate(expression)

    return {
      success: true,
      data: {
        expression,
        result: isFinite(result) ? result : 'Invalid expression',
      },
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : 'Invalid mathematical expression',
    }
  }
}

function simulateStockPrice(symbol: string): ToolResult {
  const basePrice = Math.random() * 500 + 50
  const change = (Math.random() - 0.5) * 20
  const changePercent = (change / basePrice) * 100

  return {
    success: true,
    data: {
      symbol: symbol.toUpperCase(),
      price: basePrice.toFixed(2),
      change: change.toFixed(2),
      changePercent: changePercent.toFixed(2),
      volume: Math.floor(Math.random() * 10000000).toLocaleString(),
      marketCap: `$${(Math.random() * 2000 + 100).toFixed(0)}B`,
    },
  }
}

// ============================================================================
// Tool Info for UI
// ============================================================================

export const TOOL_INFO: Record<
  string,
  { icon: string; color: string; description: string }
> = {
  get_weather: {
    icon: '🌤️',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    description: 'Weather lookup',
  },
  search_web: {
    icon: '🔍',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    description: 'Web search',
  },
  calculate: {
    icon: '🧮',
    color: 'bg-green-500/10 text-green-600 border-green-500/20',
    description: 'Calculator',
  },
  get_stock_price: {
    icon: '📈',
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    description: 'Stock price',
  },
}

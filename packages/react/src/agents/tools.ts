/**
 * Built-in Tools for Agents
 *
 * Common tools that agents can use for various tasks.
 */

import type { Tool } from './types'
import { safeEvaluate } from '../utils/math/safe-evaluator'

// ============================================================================
// SAFE MATH EXPRESSION EVALUATOR
// ============================================================================

/**
 * Safe math expression evaluator using a recursive descent parser.
 * Supports: numbers, +, -, *, /, parentheses, unary minus
 * Does NOT use eval() - completely safe from code injection.
 *
 * @deprecated Use safeEvaluate from '../utils/math/safe-evaluator' instead
 */
function safeEvaluateMath(expression: string): number {
  const tokens: string[] = []
  let i = 0

  // Guard against DoS via extremely long expressions
  if (expression.length > 1000) {
    throw new Error('Expression too long (max 1000 characters)')
  }

  // Tokenize
  while (i < expression.length) {
    const char = expression.charAt(i)
    if (/\s/.test(char)) {
      i++
      continue
    }
    if (/\d/.test(char) || (char === '.' && i + 1 < expression.length && /\d/.test(expression.charAt(i + 1)))) {
      let num = ''
      let hasDecimal = false
      while (i < expression.length) {
        const c = expression.charAt(i)
        if (!/\d/.test(c) && c !== '.') break
        if (c === '.') {
          if (hasDecimal) {
            throw new Error('Invalid number: multiple decimal points')
          }
          hasDecimal = true
        }
        num += c
        i++
      }
      tokens.push(num)
      continue
    }
    if (/[+\-*/()]/.test(char)) {
      tokens.push(char)
      i++
      continue
    }
    throw new Error(`Invalid character: "${char}"`)
  }

  // Parse with recursive descent
  let pos = 0
  let depth = 0
  const MAX_DEPTH = 100 // Prevent stack overflow from deeply nested expressions

  function parseAddSub(): number {
    let left = parseMulDiv()
    while (pos < tokens.length && (tokens[pos] === '+' || tokens[pos] === '-')) {
      const op = tokens[pos++]
      const right = parseMulDiv()
      left = op === '+' ? left + right : left - right
    }
    return left
  }

  function parseMulDiv(): number {
    let left = parseUnary()
    while (pos < tokens.length && (tokens[pos] === '*' || tokens[pos] === '/')) {
      const op = tokens[pos++]
      const right = parseUnary()
      if (op === '/' && right === 0) throw new Error('Division by zero')
      left = op === '*' ? left * right : left / right
    }
    return left
  }

  function parseUnary(): number {
    depth++
    if (depth > MAX_DEPTH) {
      throw new Error('Expression too deeply nested (max 100 levels)')
    }
    try {
      if (tokens[pos] === '-') {
        pos++
        return -parseUnary()
      }
      if (tokens[pos] === '+') {
        pos++
        return parseUnary()
      }
      return parsePrimary()
    } finally {
      depth--
    }
  }

  function parsePrimary(): number {
    const token = tokens[pos]
    if (token === undefined) throw new Error('Unexpected end of expression')
    if (token === '(') {
      pos++
      const result = parseAddSub()
      if (tokens[pos] !== ')') throw new Error('Missing closing parenthesis')
      pos++
      return result
    }
    const num = parseFloat(token)
    if (isNaN(num)) throw new Error(`Invalid number: "${token}"`)
    pos++
    return num
  }

  const result = parseAddSub()
  if (pos < tokens.length) throw new Error(`Unexpected token: "${tokens[pos]}"`)
  if (!isFinite(result)) throw new Error('Result is not a finite number')
  return result
}

/**
 * Calculator tool for mathematical operations
 */
export const calculatorTool: Tool = {
  name: 'calculator',
  description: 'Perform basic mathematical calculations. Supports +, -, *, /, parentheses, and negative numbers.',
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'The mathematical expression to evaluate (e.g., "2 + 2", "(10 - 5) * 2", "-3 + 4")',
      },
    },
    required: ['expression'],
  },
  async execute(args) {
    const expression = args['expression']
    if (typeof expression !== 'string') {
      throw new Error('Expression must be a string')
    }
    // SECURITY: Use safe math evaluator - no eval() or code injection risk
    const result = safeEvaluate(expression)
    return { result, expression }
  },
  category: 'utility',
  tags: ['math', 'calculation'],
}

/**
 * Web search tool (mock implementation)
 */
export const webSearchTool: Tool = {
  name: 'web_search',
  description: 'Search the web for information. Returns relevant results with titles, snippets, and URLs.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query',
      },
      maxResults: {
        type: 'number',
        description: 'Maximum number of results to return (default: 5)',
      },
    },
    required: ['query'],
  },
  async execute(args) {
    // Mock implementation - in production, integrate with real search API
    return {
      query: args['query'],
      results: [
        {
          title: 'Example Result 1',
          snippet: 'This is a mock search result...',
          url: 'https://example.com/1',
        },
        {
          title: 'Example Result 2',
          snippet: 'This is another mock result...',
          url: 'https://example.com/2',
        },
      ],
    }
  },
  category: 'information',
  tags: ['search', 'web', 'information'],
}

/**
 * Database query tool (mock implementation)
 */
export const databaseQueryTool: Tool = {
  name: 'database_query',
  description: 'Query a database using SQL. Returns results as an array of objects.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The SQL query to execute',
      },
      database: {
        type: 'string',
        description: 'The database to query (optional)',
      },
    },
    required: ['query'],
  },
  requiresApproval: true, // Database queries should require approval
  async execute(args) {
    // Mock implementation
    return {
      query: args['query'],
      rows: [
        { id: 1, name: 'Example' },
        { id: 2, name: 'Another' },
      ],
      rowCount: 2,
    }
  },
  category: 'data',
  tags: ['database', 'sql', 'query'],
}

/**
 * File system read tool
 */
export const fileReadTool: Tool = {
  name: 'file_read',
  description: 'Read the contents of a file.',
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'The file path to read',
      },
      encoding: {
        type: 'string',
        description: 'File encoding (default: utf-8)',
      },
    },
    required: ['path'],
  },
  requiresApproval: true,
  async execute(_args) {
    // Mock implementation - in production, use fs/fs-promises
    throw new Error('File system access not available in browser')
  },
  category: 'filesystem',
  tags: ['file', 'read', 'filesystem'],
}

/**
 * API call tool
 */
export const apiCallTool: Tool = {
  name: 'api_call',
  description: 'Make an HTTP API request. Supports GET, POST, PUT, DELETE methods.',
  parameters: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The API endpoint URL',
      },
      method: {
        type: 'string',
        enum: ['GET', 'POST', 'PUT', 'DELETE'],
        description: 'HTTP method',
      },
      headers: {
        type: 'object',
        description: 'Request headers',
      },
      body: {
        type: 'object',
        description: 'Request body (for POST/PUT)',
      },
    },
    required: ['url', 'method'],
  },
  requiresApproval: true,
  async execute(args) {
    const url = args['url'] as string
    const method = args['method'] as string
    const headers = args['headers'] as Record<string, string> | undefined
    const body = args['body'] as Record<string, unknown> | undefined

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json()

    return {
      status: response.status,
      statusText: response.statusText,
      data,
    }
  },
  category: 'integration',
  tags: ['api', 'http', 'rest'],
}

/**
 * Code execution tool (sandboxed)
 */
export const codeExecutionTool: Tool = {
  name: 'code_execution',
  description: 'Execute code in a sandboxed environment. Supports JavaScript/TypeScript.',
  parameters: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'The code to execute',
      },
      language: {
        type: 'string',
        enum: ['javascript', 'typescript', 'python'],
        description: 'Programming language',
      },
      timeout: {
        type: 'number',
        description: 'Execution timeout in milliseconds (default: 5000)',
      },
    },
    required: ['code', 'language'],
  },
  requiresApproval: true,
  async execute(_args) {
    // Mock implementation - in production, use a proper sandbox like vm2 or isolated-vm
    throw new Error('Code execution requires a secure sandbox environment')
  },
  category: 'development',
  tags: ['code', 'execution', 'sandbox'],
}

/**
 * Collection of all built-in tools
 */
export const builtInTools: Tool[] = [
  calculatorTool,
  webSearchTool,
  databaseQueryTool,
  fileReadTool,
  apiCallTool,
  codeExecutionTool,
]

/**
 * Tool registry for managing tools
 *
 * @deprecated This legacy ToolRegistry is deprecated and will be removed in a future version.
 * Please migrate to the canonical ToolRegistry from '@clarity/core/tool-registry':
 *
 * ```typescript
 * // Old (deprecated):
 * import { ToolRegistry } from '@clarity/agents/tools'
 *
 * // New (recommended):
 * import { ToolRegistry } from '@clarity/core/tool-registry'
 * // or use the global instance:
 * import { globalToolRegistry } from '@clarity/core/tool-registry'
 * ```
 *
 * Migration benefits:
 * - Comprehensive JSON Schema validation
 * - Event system for lifecycle tracking
 * - Namespace support for tool organization
 * - Better TypeScript inference
 * - Consistent with ToolOrchestrator API
 *
 * @see packages/react/src/core/tool-registry.ts for the canonical implementation
 */
export class ToolRegistry {
  private tools = new Map<string, Tool>()

  constructor(initialTools?: Tool[]) {
    // Emit deprecation warning
    console.warn(
      '[DEPRECATION WARNING] ToolRegistry from agents/tools.ts is deprecated.\n' +
      'Please migrate to the canonical ToolRegistry from core/tool-registry.ts:\n' +
      '  import { ToolRegistry } from \'./core/tool-registry\'\n' +
      'This legacy class will be removed in a future version.'
    )

    if (initialTools) {
      initialTools.forEach(t => this.register(t))
    }
  }
  
  /**
   * Register a tool
   *
   * @deprecated Use canonical ToolRegistry from core/tool-registry.ts instead
   */
  register(tool: Tool): void {
    this.tools.set(tool.name, tool)
  }

  /**
   * Unregister a tool
   *
   * @deprecated Use canonical ToolRegistry from core/tool-registry.ts instead
   */
  unregister(name: string): boolean {
    return this.tools.delete(name)
  }

  /**
   * Get a tool by name
   *
   * @deprecated Use canonical ToolRegistry from core/tool-registry.ts instead
   */
  get(name: string): Tool | undefined {
    return this.tools.get(name)
  }

  /**
   * Get all tools
   *
   * @deprecated Use canonical ToolRegistry from core/tool-registry.ts instead
   */
  getAll(): Tool[] {
    return Array.from(this.tools.values())
  }

  /**
   * Get tools by category
   *
   * @deprecated Use canonical ToolRegistry from core/tool-registry.ts instead
   */
  getByCategory(category: string): Tool[] {
    return this.getAll().filter(t => t.category === category)
  }

  /**
   * Get tools by tag
   *
   * @deprecated Use canonical ToolRegistry from core/tool-registry.ts instead
   */
  getByTag(tag: string): Tool[] {
    return this.getAll().filter(t => t.tags?.includes(tag))
  }

  /**
   * Search tools by query
   *
   * @deprecated Use canonical ToolRegistry from core/tool-registry.ts instead
   */
  search(query: string): Tool[] {
    const lowerQuery = query.toLowerCase()
    return this.getAll().filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }
}


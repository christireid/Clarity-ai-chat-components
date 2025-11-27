/**
 * Built-in Tools for Agents
 *
 * Common tools that agents can use for various tasks.
 */

import type { Tool } from './types'

// ============================================================================
// SAFE MATH EXPRESSION EVALUATOR
// ============================================================================

/**
 * Safe math expression evaluator using a recursive descent parser.
 * Supports: numbers, +, -, *, /, parentheses, unary minus
 * Does NOT use eval() - completely safe from code injection.
 */
function safeEvaluateMath(expression: string): number {
  const tokens: string[] = []
  let i = 0

  // Tokenize
  while (i < expression.length) {
    const char = expression[i]
    if (/\s/.test(char)) {
      i++
      continue
    }
    if (/\d/.test(char) || (char === '.' && i + 1 < expression.length && /\d/.test(expression[i + 1]))) {
      let num = ''
      while (i < expression.length && (/\d/.test(expression[i]) || expression[i] === '.')) {
        num += expression[i++]
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
    if (tokens[pos] === '-') {
      pos++
      return -parseUnary()
    }
    if (tokens[pos] === '+') {
      pos++
      return parseUnary()
    }
    return parsePrimary()
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
    // Use safe math evaluator - no eval() or code injection risk
    const result = safeEvaluateMath(expression)
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
    const response = await fetch(args['url'], {
      method: args['method'],
      headers: args['headers'],
      body: args['body'] ? JSON.stringify(args['body']) : undefined,
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
 */
export class ToolRegistry {
  private tools = new Map<string, Tool>()
  
  constructor(initialTools?: Tool[]) {
    if (initialTools) {
      initialTools.forEach(t => this.register(t))
    }
  }
  
  /**
   * Register a tool
   */
  register(tool: Tool): void {
    this.tools.set(tool.name, tool)
  }
  
  /**
   * Unregister a tool
   */
  unregister(name: string): boolean {
    return this.tools.delete(name)
  }
  
  /**
   * Get a tool by name
   */
  get(name: string): Tool | undefined {
    return this.tools.get(name)
  }
  
  /**
   * Get all tools
   */
  getAll(): Tool[] {
    return Array.from(this.tools.values())
  }
  
  /**
   * Get tools by category
   */
  getByCategory(category: string): Tool[] {
    return this.getAll().filter(t => t.category === category)
  }
  
  /**
   * Get tools by tag
   */
  getByTag(tag: string): Tool[] {
    return this.getAll().filter(t => t.tags?.includes(tag))
  }
  
  /**
   * Search tools by query
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


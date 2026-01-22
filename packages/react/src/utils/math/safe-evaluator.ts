/**
 * Safe Mathematical Expression Evaluator
 *
 * Implements a recursive descent parser for safe evaluation of mathematical expressions.
 * Supports: numbers, +, -, *, /, %, parentheses, unary minus
 *
 * **Security**: Does NOT use eval() or Function() - completely safe from code injection.
 *
 * **Features**:
 * - Length limit (1000 chars) prevents DoS via long expressions
 * - Depth limit (100 levels) prevents stack overflow
 * - Only mathematical operators allowed
 * - Validates all input characters
 *
 * @example
 * ```typescript
 * safeEvaluate('2 + 2')              // 4
 * safeEvaluate('(10 - 5) * 2')       // 10
 * safeEvaluate('-3 + 4')             // 1
 * safeEvaluate('10 / 2.5')           // 4
 * safeEvaluate('alert("xss")')       // Error: Invalid character
 * ```
 */

/**
 * Safe mathematical expression evaluator using a recursive descent parser.
 *
 * @param expression - Mathematical expression to evaluate
 * @returns Computed result
 * @throws Error if expression is invalid, too long, or too deeply nested
 */
export function safeEvaluate(expression: string): number {
  // Guard against DoS via extremely long expressions
  if (expression.length > 1000) {
    throw new Error('Expression too long (max 1000 characters)')
  }

  // Tokenize the expression
  const tokens: string[] = []
  let i = 0

  while (i < expression.length) {
    const char = expression.charAt(i)

    // Skip whitespace
    if (/\s/.test(char)) {
      i++
      continue
    }

    // Parse number (including decimals)
    if (
      /\d/.test(char) ||
      (char === '.' && i + 1 < expression.length && /\d/.test(expression.charAt(i + 1)))
    ) {
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

    // Parse operators and parentheses
    if (/[+\-*/%()]/.test(char)) {
      tokens.push(char)
      i++
      continue
    }

    // Invalid character - reject to prevent injection
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

    while (pos < tokens.length && (tokens[pos] === '*' || tokens[pos] === '/' || tokens[pos] === '%')) {
      const op = tokens[pos++]
      const right = parseUnary()

      if (op === '*') {
        left *= right
      } else if (op === '/') {
        if (right === 0) throw new Error('Division by zero')
        left /= right
      } else if (op === '%') {
        left %= right
      }
    }

    return left
  }

  function parseUnary(): number {
    depth++
    if (depth > MAX_DEPTH) {
      throw new Error('Expression too deeply nested (max 100 levels)')
    }

    try {
      // Handle unary minus and plus
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

    if (token === undefined) {
      throw new Error('Unexpected end of expression')
    }

    // Handle parentheses
    if (token === '(') {
      pos++
      const result = parseAddSub()

      if (tokens[pos] !== ')') {
        throw new Error('Missing closing parenthesis')
      }

      pos++
      return result
    }

    // Parse number
    const num = parseFloat(token)
    if (isNaN(num)) {
      throw new Error(`Invalid number: "${token}"`)
    }

    pos++
    return num
  }

  // Evaluate expression
  const result = parseAddSub()

  // Check for unexpected trailing tokens
  if (pos < tokens.length) {
    throw new Error(`Unexpected token: "${tokens[pos]}"`)
  }

  // Ensure result is finite
  if (!isFinite(result)) {
    throw new Error('Result is not a finite number')
  }

  return result
}

/**
 * Validate a mathematical expression without evaluating it
 *
 * @param expression - Expression to validate
 * @returns true if valid, false otherwise
 */
export function isValidExpression(expression: string): boolean {
  try {
    safeEvaluate(expression)
    return true
  } catch {
    return false
  }
}

/**
 * Evaluate expression with custom error handling
 *
 * @param expression - Expression to evaluate
 * @returns Object with success flag, result, and error message
 */
export function safeEvaluateWithError(
  expression: string
): { success: boolean; result?: number; error?: string } {
  try {
    const result = safeEvaluate(expression)
    return { success: true, result }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

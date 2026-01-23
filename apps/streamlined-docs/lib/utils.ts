import { truncate } from '@clarity-chat/utils/format'
import { debounce } from '@clarity-chat/utils/async'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Local implementation to ensure server component compatibility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export { truncate, debounce }

/**
 * Safe math expression evaluator using recursive descent parser
 * Only allows numbers and basic arithmetic operators (+, -, *, /, parentheses)
 * Does NOT use eval() or new Function() - CSP-compliant
 */
export function safeMathEval(expr: string): number | null {
  // Tokenize: numbers, operators, parentheses
  const tokens = expr.match(/(\d+\.?\d*|[+\-*/()])/g)
  if (!tokens) return null

  let pos = 0

  const peek = () => tokens[pos]
  const consume = () => tokens[pos++]

  // Grammar: expr -> term (('+' | '-') term)*
  const parseExpr = (): number | null => {
    let left = parseTerm()
    if (left === null) return null

    while (peek() === '+' || peek() === '-') {
      const op = consume()
      const right = parseTerm()
      if (right === null) return null
      left = op === '+' ? left + right : left - right
    }
    return left
  }

  // term -> factor (('*' | '/') factor)*
  const parseTerm = (): number | null => {
    let left = parseFactor()
    if (left === null) return null

    while (peek() === '*' || peek() === '/') {
      const op = consume()
      const right = parseFactor()
      if (right === null) return null
      if (op === '/' && right === 0) return null // Division by zero
      left = op === '*' ? left * right : left / right
    }
    return left
  }

  // factor -> number | '(' expr ')' | '-' factor
  const parseFactor = (): number | null => {
    const token = peek()
    if (!token) return null

    // Unary minus
    if (token === '-') {
      consume()
      const val = parseFactor()
      return val !== null ? -val : null
    }

    // Parenthesized expression
    if (token === '(') {
      consume() // '('
      const val = parseExpr()
      if (peek() !== ')') return null
      consume() // ')'
      return val
    }

    // Number
    const num = parseFloat(token)
    if (!isNaN(num)) {
      consume()
      return num
    }

    return null
  }

  const result = parseExpr()
  // Ensure all tokens consumed
  if (pos !== tokens.length) return null
  return result !== null && isFinite(result) ? result : null
}

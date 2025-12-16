import { logger } from '@clarity-chat/utils/logger';
/**
 * TOON (Token-Oriented Object Notation) Decoder
 *
 * Converts TOON format back to JSON
 */

export interface ToonDecodeOptions {
  /** Strict mode - throw on parse errors */
  strict?: boolean
  /** Type hints for parsing */
  typeHints?: Record<string, 'string' | 'number' | 'boolean' | 'object' | 'array'>
}

/**
 * Convert TOON to JSON
 *
 * @example
 * ```ts
 * const toon = `
 * name, age, city
 * Alice, 30, NYC
 * Bob, 25, SF
 * `
 *
 * const data = toonToJson(toon)
 * // Returns: [
 * //   { name: "Alice", age: 30, city: "NYC" },
 * //   { name: "Bob", age: 25, city: "SF" }
 * // ]
 * ```
 */
export function toonToJson(toon: string, options: ToonDecodeOptions = {}): any {
  const { strict = false } = options

  try {
    const lines = toon.trim().split('\n').filter(line => line.trim().length > 0)

    if (lines.length === 0) return null

    // Check for table format (has comma-separated header)
    if (isTableFormat(lines)) {
      return parseTable(lines, options)
    }

    // Check for list format (starts with -)
    if (isListFormat(lines)) {
      return parseList(lines, options)
    }

    // Check for object format (key: value pairs)
    if (isObjectFormat(lines)) {
      return parseObject(lines, options)
    }

    // Single value
    if (lines.length === 1) {
      return parseValue(lines[0]!, options)
    }

    throw new Error('Unable to determine TOON format')
  } catch (error) {
    if (strict) {
      throw error
    }
    logger.warn('TOON parse error:', error)
    return null
  }
}

/**
 * Check if TOON is in table format
 */
function isTableFormat(lines: string[]): boolean {
  return lines.length >= 2 && lines[0]!.includes(',')
}

/**
 * Check if TOON is in list format
 */
function isListFormat(lines: string[]): boolean {
  return lines.some(line => line.trim().startsWith('-'))
}

/**
 * Check if TOON is in object format
 */
function isObjectFormat(lines: string[]): boolean {
  return lines.some(line => line.includes(':') && !line.trim().startsWith('-'))
}

/**
 * Parse table format (CSV-style)
 */
function parseTable(lines: string[], options: ToonDecodeOptions): any[] {
  const [headerLine, ...dataLines] = lines
  if (!headerLine) return []

  // Parse header
  const headers = parseCsvLine(headerLine)

  // Parse data rows
  return dataLines.map(line => {
    const values = parseCsvLine(line)
    const obj: any = {}

    headers.forEach((header, index) => {
      const value = values[index]
      obj[header] = parseValue(value ?? '', options)
    })

    return obj
  })
}

/**
 * Parse list format
 */
function parseList(lines: string[], options: ToonDecodeOptions): any[] {
  const items: any[] = []
  let currentItem = ''

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('-')) {
      // New item
      if (currentItem) {
        items.push(parseValue(currentItem.trim(), options))
      }
      currentItem = trimmed.substring(1).trim()
    } else {
      // Continuation of current item
      currentItem += '\n' + line
    }
  }

  // Add last item
  if (currentItem) {
    items.push(parseValue(currentItem.trim(), options))
  }

  return items
}

/**
 * Parse object format (YAML-style)
 */
function parseObject(lines: string[], options: ToonDecodeOptions): any {
  const obj: any = {}
  let currentKey: string | null = null
  let currentValue = ''
  let indent = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    const trimmed = line.trim()

    if (!trimmed) continue

    // Detect indent level
    const lineIndent = line.length - line.trimStart().length

    // Key-value pair
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex > 0 && lineIndent <= indent) {
      // Save previous key-value
      if (currentKey) {
        obj[currentKey] = parseValue(currentValue.trim(), options)
      }

      // Parse new key-value
      currentKey = trimmed.substring(0, colonIndex).trim()
      currentValue = trimmed.substring(colonIndex + 1).trim()
      indent = lineIndent
    } else if (currentKey) {
      // Continuation of previous value
      currentValue += '\n' + trimmed
    }
  }

  // Add last key-value
  if (currentKey) {
    obj[currentKey] = parseValue(currentValue.trim(), options)
  }

  return obj
}

/**
 * Parse CSV line (handles quoted strings)
 */
function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]!
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next char
      } else {
        // Toggle quotes
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // End of value
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  // Add last value
  values.push(current.trim())

  return values
}

/**
 * Parse single value
 */
function parseValue(value: string, options: ToonDecodeOptions): any {
  const trimmed = value.trim()

  // Null
  if (trimmed === 'null' || trimmed === '') {
    return null
  }

  // Boolean
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false

  // Number
  const num = Number(trimmed)
  if (!isNaN(num) && trimmed !== '') {
    return num
  }

  // Array (inline format)
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const items = trimmed.substring(1, trimmed.length - 1).split(',')
    return items.map(item => parseValue(item.trim(), options))
  }

  // Object (inline format)
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    // Simple object parsing
    return JSON.parse(trimmed)
  }

  // String (remove quotes if present)
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.substring(1, trimmed.length - 1).replace(/""/g, '"')
  }

  // Plain string
  return trimmed
}

/**
 * Validate TOON format
 */
export function validateToon(toon: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  try {
    toonToJson(toon, { strict: true })
    return { valid: true, errors: [] }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error))
    return { valid: false, errors }
  }
}

/**
 * TOON (Token-Oriented Object Notation) Encoder
 *
 * Converts JSON to TOON format for 30-60% token savings.
 *
 * TOON combines YAML's indentation for nested objects with CSV-style
 * tabular layout for uniform arrays, eliminating repetitive JSON syntax.
 *
 * @see https://github.com/toon-format/toon
 */

export interface ToonOptions {
  /** Indent size for nested objects (default: 2) */
  indent?: number
  /** Use compact format (no extra spacing) */
  compact?: boolean
  /** Preserve null values (default: true) */
  preserveNulls?: boolean
  /** Quote strings with special characters */
  quoteStrings?: boolean
}

/**
 * Convert JSON to TOON format
 *
 * @example
 * ```ts
 * const data = [
 *   { name: "Alice", age: 30, city: "NYC" },
 *   { name: "Bob", age: 25, city: "SF" }
 * ]
 *
 * const toon = jsonToToon(data)
 * // Output:
 * // name, age, city
 * // Alice, 30, NYC
 * // Bob, 25, SF
 * ```
 */
export function jsonToToon(data: any, options: ToonOptions = {}): string {
  const {
    indent = 2,
    compact = false,
    preserveNulls = true,
    quoteStrings = false,
  } = options

  return encodeValue(data, 0, indent, compact, preserveNulls, quoteStrings)
}

/**
 * Encode a value to TOON format
 */
function encodeValue(
  value: any,
  depth: number,
  indent: number,
  compact: boolean,
  preserveNulls: boolean,
  quoteStrings: boolean
): string {
  // Null/undefined
  if (value === null || value === undefined) {
    return preserveNulls ? 'null' : ''
  }

  // Primitives
  if (typeof value === 'string') {
    return encodeString(value, quoteStrings)
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  // Arrays
  if (Array.isArray(value)) {
    return encodeArray(value, depth, indent, compact, preserveNulls, quoteStrings)
  }

  // Objects
  if (typeof value === 'object') {
    return encodeObject(value, depth, indent, compact, preserveNulls, quoteStrings)
  }

  return String(value)
}

/**
 * Encode string value
 */
function encodeString(str: string, quoteStrings: boolean): string {
  // Check if string needs quoting (contains comma, newline, or special chars)
  const needsQuoting = /[,\n\r"]/.test(str)

  if (needsQuoting || quoteStrings) {
    // Escape quotes and wrap in quotes
    return `"${str.replace(/"/g, '""')}"`
  }

  return str
}

/**
 * Encode array to TOON format
 */
function encodeArray(
  arr: any[],
  depth: number,
  indent: number,
  compact: boolean,
  preserveNulls: boolean,
  quoteStrings: boolean
): string {
  if (arr.length === 0) return '[]'

  // Check if array of uniform objects (TOON's sweet spot)
  if (isUniformObjectArray(arr)) {
    return encodeUniformObjectArray(arr, depth, indent, compact, preserveNulls, quoteStrings)
  }

  // Check if array of primitives
  if (arr.every(item => isPrimitive(item))) {
    return encodePrimitiveArray(arr, quoteStrings)
  }

  // Mixed array - encode as list
  const indentStr = ' '.repeat(depth * indent)
  const items = arr.map(item =>
    `${indentStr}- ${encodeValue(item, depth + 1, indent, compact, preserveNulls, quoteStrings)}`
  )

  return items.join('\n')
}

/**
 * Encode array of uniform objects as table (CSV-style)
 */
function encodeUniformObjectArray(
  arr: any[],
  depth: number,
  indent: number,
  compact: boolean,
  preserveNulls: boolean,
  quoteStrings: boolean
): string {
  const indentStr = ' '.repeat(depth * indent)
  const separator = compact ? ',' : ', '

  // Get all unique keys
  const keys = getUniformKeys(arr)

  // Header row
  const header = indentStr + keys.join(separator)

  // Data rows
  const rows = arr.map(obj => {
    const values = keys.map(key => {
      const value = obj[key]
      if (value === null || value === undefined) {
        return preserveNulls ? 'null' : ''
      }
      if (typeof value === 'object') {
        // Nested object/array - encode inline with special syntax
        return encodeValue(value, 0, indent, true, preserveNulls, quoteStrings)
      }
      return encodeValue(value, 0, indent, compact, preserveNulls, quoteStrings)
    })
    return indentStr + values.join(separator)
  })

  return [header, ...rows].join('\n')
}

/**
 * Encode array of primitives
 */
function encodePrimitiveArray(arr: any[], quoteStrings: boolean): string {
  const values = arr.map(item => encodeValue(item, 0, 0, true, true, quoteStrings))
  return `[${values.join(', ')}]`
}

/**
 * Encode object to TOON format (YAML-style)
 */
function encodeObject(
  obj: any,
  depth: number,
  indent: number,
  compact: boolean,
  preserveNulls: boolean,
  quoteStrings: boolean
): string {
  const entries = Object.entries(obj)
  if (entries.length === 0) return '{}'

  const indentStr = ' '.repeat(depth * indent)
  const separator = compact ? ':' : ': '

  const lines = entries.map(([key, value]) => {
    const encodedValue = encodeValue(value, depth + 1, indent, compact, preserveNulls, quoteStrings)

    // If value is multiline, indent it
    if (encodedValue.includes('\n')) {
      const indented = encodedValue
        .split('\n')
        .map((line, i) => (i === 0 ? line : ' '.repeat(indent) + line))
        .join('\n')
      return `${indentStr}${key}${separator}\n${' '.repeat(indent)}${indented}`
    }

    return `${indentStr}${key}${separator}${encodedValue}`
  })

  return lines.join('\n')
}

/**
 * Check if array contains uniform objects
 */
function isUniformObjectArray(arr: any[]): boolean {
  if (arr.length === 0) return false
  if (!arr.every(item => typeof item === 'object' && !Array.isArray(item) && item !== null)) {
    return false
  }

  // Check if all objects have similar keys (at least 50% overlap)
  const allKeys = new Set<string>()
  arr.forEach(obj => {
    Object.keys(obj).forEach(key => allKeys.add(key))
  })

  const avgKeyCount = arr.reduce((sum, obj) => sum + Object.keys(obj).length, 0) / arr.length
  return avgKeyCount / allKeys.size >= 0.5
}

/**
 * Get uniform keys from array of objects
 */
function getUniformKeys(arr: any[]): string[] {
  const keySet = new Set<string>()
  arr.forEach(obj => {
    Object.keys(obj).forEach(key => keySet.add(key))
  })
  return Array.from(keySet)
}

/**
 * Check if value is primitive
 */
function isPrimitive(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

/**
 * Estimate token savings from using TOON vs JSON
 */
export function estimateToonSavings(data: any): {
  jsonTokens: number
  toonTokens: number
  savings: number
  savingsPercent: number
} {
  const json = JSON.stringify(data)
  const toon = jsonToToon(data, { compact: true })

  // Rough approximation: 4 chars per token
  const jsonTokens = Math.ceil(json.length / 4)
  const toonTokens = Math.ceil(toon.length / 4)
  const savings = jsonTokens - toonTokens
  const savingsPercent = jsonTokens > 0 ? (savings / jsonTokens) * 100 : 0

  return {
    jsonTokens,
    toonTokens,
    savings,
    savingsPercent,
  }
}

/**
 * Check if data is suitable for TOON format
 */
export function isSuitableForToon(data: any): boolean {
  // TOON works best for:
  // 1. Arrays of uniform objects
  // 2. Simple nested objects

  if (Array.isArray(data) && isUniformObjectArray(data)) {
    return true
  }

  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    // Check if object values are mostly primitives or uniform arrays
    const values = Object.values(data)
    const simpleValues = values.filter(v =>
      isPrimitive(v) || (Array.isArray(v) && isUniformObjectArray(v))
    )
    return simpleValues.length / values.length >= 0.6
  }

  return false
}

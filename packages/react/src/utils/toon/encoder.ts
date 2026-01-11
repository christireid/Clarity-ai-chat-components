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

import { estimateTokens } from '../tokenization/estimator'

/** JSON-like value type for TOON encoding */
type JsonValue = string | number | boolean | null | undefined | JsonObject | JsonArray
type JsonObject = { [key: string]: JsonValue }
type JsonArray = JsonValue[]

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
export function jsonToToon(data: JsonValue, options: ToonOptions = {}): string {
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
  value: JsonValue,
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
  arr: JsonArray,
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
  arr: JsonObject[],
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
function encodePrimitiveArray(arr: JsonArray, quoteStrings: boolean): string {
  const values = arr.map(item => encodeValue(item, 0, 0, true, true, quoteStrings))
  return `[${values.join(', ')}]`
}

/**
 * Encode object to TOON format (YAML-style)
 */
function encodeObject(
  obj: JsonObject,
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
 * Type guard to check if value is a JsonObject
 */
function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Check if array contains uniform objects
 */
function isUniformObjectArray(arr: JsonArray): arr is JsonObject[] {
  if (arr.length === 0) return false
  if (!arr.every(item => isJsonObject(item))) {
    return false
  }

  // Check if all objects have similar keys (at least 50% overlap)
  const allKeys = new Set<string>()
  ;(arr as JsonObject[]).forEach(obj => {
    Object.keys(obj).forEach(key => allKeys.add(key))
  })

  const avgKeyCount = (arr as JsonObject[]).reduce((sum, obj) => sum + Object.keys(obj).length, 0) / arr.length
  return avgKeyCount / allKeys.size >= 0.5
}

/**
 * Get uniform keys from array of objects
 */
function getUniformKeys(arr: JsonObject[]): string[] {
  const keySet = new Set<string>()
  arr.forEach(obj => {
    Object.keys(obj).forEach(key => keySet.add(key))
  })
  return Array.from(keySet)
}

/**
 * Check if value is primitive
 */
function isPrimitive(value: JsonValue): value is string | number | boolean | null | undefined {
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
export function estimateToonSavings(data: JsonValue): {
  jsonTokens: number
  toonTokens: number
  savings: number
  savingsPercent: number
} {
  const json = JSON.stringify(data)
  const toon = jsonToToon(data, { compact: true })

  // Use centralized token estimation
  const jsonTokens = estimateTokens(json)
  const toonTokens = estimateTokens(toon)
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
export function isSuitableForToon(data: JsonValue): boolean {
  // TOON works best for:
  // 1. Arrays of uniform objects
  // 2. Simple nested objects

  if (Array.isArray(data) && isUniformObjectArray(data)) {
    return true
  }

  if (isJsonObject(data)) {
    // Check if object values are mostly primitives or uniform arrays
    const values = Object.values(data)
    const simpleValues = values.filter(v =>
      isPrimitive(v) || (Array.isArray(v) && isUniformObjectArray(v))
    )
    return simpleValues.length / values.length >= 0.6
  }

  return false
}

/**
 * TOON format instructions for LLMs
 *
 * These instructions help LLMs understand and parse TOON-formatted data
 * when included in prompts.
 */
export const TOON_INSTRUCTIONS = {
  /** Brief instruction for simple cases */
  brief: `The data below is in TOON (Token-Oriented Object Notation) format. Parse headers as comma-separated column names, with each row containing corresponding values.`,

  /** Detailed instruction for complex cases */
  detailed: `The following data is in TOON (Token-Oriented Object Notation) format - a compact alternative to JSON.

TOON Format Rules:
1. For arrays of objects: first row contains comma-separated column names (headers), subsequent rows contain comma-separated values
2. For nested objects: YAML-style indentation with key: value pairs
3. Strings containing commas or quotes are wrapped in double quotes
4. Parse as tabular data where headers map to values by position

Example interpretation:
\`\`\`
name, age, city
Alice, 30, NYC
Bob, 25, SF
\`\`\`
Equals JSON: [{"name":"Alice","age":30,"city":"NYC"},{"name":"Bob","age":25,"city":"SF"}]`,

  /** System message version */
  system: `When you receive data in TOON format (indicated by comma-separated headers followed by matching rows), parse it as structured tabular data. TOON is a token-efficient alternative to JSON where the first row defines column headers and subsequent rows contain values.`,

  /** Inline instruction (minimal) */
  inline: `[TOON format: headers on first line, values in rows]`,
}

/**
 * Options for wrapping TOON data with instructions
 */
export interface ToonInstructionOptions {
  /** Include instructions for LLM comprehension */
  includeInstructions?: boolean
  /** Instruction detail level */
  instructionLevel?: 'brief' | 'detailed' | 'inline'
  /** Where to place instructions */
  instructionPlacement?: 'before' | 'after' | 'system'
  /** Mark whether instructions were already sent in conversation */
  instructionsAlreadySent?: boolean
}

/**
 * Wrap TOON-formatted data with instructions for LLM comprehension
 *
 * @example
 * ```ts
 * const toonData = jsonToToon(users)
 * const withInstructions = wrapWithToonInstructions(toonData, {
 *   includeInstructions: true,
 *   instructionLevel: 'brief'
 * })
 * ```
 */
export function wrapWithToonInstructions(
  toonData: string,
  options: ToonInstructionOptions = {}
): {
  content: string
  systemMessage?: string
  instructionsIncluded: boolean
} {
  const {
    includeInstructions = true,
    instructionLevel = 'brief',
    instructionPlacement = 'before',
    instructionsAlreadySent = false,
  } = options

  // Skip instructions if already sent or not requested
  if (!includeInstructions || instructionsAlreadySent) {
    return {
      content: toonData,
      instructionsIncluded: false,
    }
  }

  // Get appropriate instruction text
  let instruction: string
  switch (instructionLevel) {
    case 'detailed':
      instruction = TOON_INSTRUCTIONS.detailed
      break
    case 'inline':
      instruction = TOON_INSTRUCTIONS.inline
      break
    case 'brief':
    default:
      instruction = TOON_INSTRUCTIONS.brief
  }

  // Handle system message placement
  if (instructionPlacement === 'system') {
    return {
      content: toonData,
      systemMessage: TOON_INSTRUCTIONS.system,
      instructionsIncluded: true,
    }
  }

  // Handle before/after placement
  const content = instructionPlacement === 'before'
    ? `${instruction}\n\n${toonData}`
    : `${toonData}\n\n${instruction}`

  return {
    content,
    instructionsIncluded: true,
  }
}

/**
 * Create a conversation-aware TOON wrapper
 *
 * Tracks whether instructions have been sent to avoid repetition.
 *
 * @example
 * ```ts
 * const wrapper = createToonConversationWrapper()
 *
 * // First message - includes instructions
 * const first = wrapper.wrap(jsonToToon(data1))
 *
 * // Second message - no instructions (already sent)
 * const second = wrapper.wrap(jsonToToon(data2))
 * ```
 */
export function createToonConversationWrapper(
  defaultOptions: ToonInstructionOptions = {}
): {
  wrap: (toonData: string, options?: ToonInstructionOptions) => ReturnType<typeof wrapWithToonInstructions>
  reset: () => void
  instructionsSent: boolean
} {
  let instructionsSent = false

  return {
    wrap: (toonData: string, options: ToonInstructionOptions = {}) => {
      const result = wrapWithToonInstructions(toonData, {
        ...defaultOptions,
        ...options,
        instructionsAlreadySent: instructionsSent,
      })

      if (result.instructionsIncluded) {
        instructionsSent = true
      }

      return result
    },
    reset: () => {
      instructionsSent = false
    },
    get instructionsSent() {
      return instructionsSent
    },
  }
}

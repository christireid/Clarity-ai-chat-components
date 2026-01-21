/**
 * Simple TOON Implementation
 *
 * Basic TOON format conversion without external dependencies
 */

/**
 * Configuration for SimpleToonOptimizer
 */
export interface SimpleToonConfig {
  enableArrayTables: boolean
  maxArraySizeForTable: number
  preserveKeys: boolean
  compactNumbers: boolean
  quoteStrings: boolean
}

/**
 * Result of TOON optimization
 */
export interface SimpleToonOptimizationResult {
  optimized: string
  original: string
  savings: number
  percentage: number
}

/**
 * Token savings calculation result
 */
export interface SimpleToonSavings {
  jsonTokens: number
  toonTokens: number
  savings: number
  percentage: number
}

/**
 * JSON-compatible primitive value
 */
type JsonPrimitive = string | number | boolean | null | undefined

/**
 * JSON-compatible value type
 */
type JsonValue = JsonPrimitive | JsonObject | JsonArray

/**
 * JSON-compatible object type
 */
interface JsonObject {
  [key: string]: JsonValue
}

/**
 * JSON-compatible array type
 */
type JsonArray = JsonValue[]

export class SimpleToonOptimizer {
  private config: SimpleToonConfig

  constructor(config: Partial<SimpleToonConfig> = {}) {
    this.config = {
      enableArrayTables: true,
      maxArraySizeForTable: 100,
      preserveKeys: false,
      compactNumbers: true,
      quoteStrings: false,
      ...config,
    }
  }

  /**
   * Convert data to TOON format
   */
  convertToToon(data: unknown): string {
    if (typeof data !== 'object' || data === null) {
      return String(data)
    }

    if (Array.isArray(data)) {
      return this.convertArrayToToon(data as JsonArray)
    }

    return this.convertObjectToToon(data as JsonObject)
  }

  /**
   * Convert simple data to TOON-like format (alias)
   */
  optimizeForLLM(data: unknown): string {
    return this.convertToToon(data)
  }

  /**
   * Optimize data structure for LLM consumption
   */
  optimizeDataStructure(data: unknown): SimpleToonOptimizationResult {
    const original = JSON.stringify(data)
    const optimized = this.convertToToon(data)
    const savings = SimpleToonOptimizer.calculateSavings(original, optimized)

    return {
      optimized,
      original,
      savings: savings.savings,
      percentage: savings.percentage,
    }
  }

  private convertObjectToToon(obj: JsonObject): string {
    const lines: string[] = []

    for (const [key, value] of Object.entries(obj)) {
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        lines.push(`${key}:`)
        lines.push(
          '  ' +
            this.convertObjectToToon(value as JsonObject)
              .split('\n')
              .join('\n  ')
        )
      } else if (Array.isArray(value)) {
        lines.push(this.convertArrayToToon(value, key))
      } else {
        lines.push(`${key}: ${this.formatValue(value)}`)
      }
    }

    return lines.join('\n')
  }

  private convertArrayToToon(arr: JsonArray, name = 'items'): string {
    if (arr.length === 0) {
      return `${name}[0]:`
    }

    // Check if all items are objects with same structure
    const firstItem = arr[0]
    if (
      this.config.enableArrayTables &&
      arr.every(
        (item) =>
          typeof item === 'object' && item !== null && !Array.isArray(item)
      ) &&
      firstItem &&
      typeof firstItem === 'object'
    ) {
      const firstKeys = Object.keys(firstItem) // Don't sort to maintain original order
      const allSameStructure = arr.every((item) => {
        if (typeof item !== 'object' || item === null) return false
        const itemKeys = Object.keys(item)
        return JSON.stringify(firstKeys) === JSON.stringify(itemKeys)
      })

      if (allSameStructure && arr.length <= this.config.maxArraySizeForTable) {
        // Use table format
        const lines: string[] = [
          `${name}[${arr.length}]{${firstKeys.join(',')}}:`,
        ]

        arr.forEach((item) => {
          if (
            typeof item === 'object' &&
            item !== null &&
            !Array.isArray(item)
          ) {
            const typedItem = item as JsonObject
            const values = firstKeys.map((key) =>
              this.formatTableValue(typedItem[key])
            )
            lines.push(`  ${values.join(',')}`)
          }
        })

        return lines.join('\n')
      }
    }

    // Use regular array format
    const lines: string[] = [`${name}:`]
    arr.forEach((item) => {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        lines.push('-')
        lines.push(this.convertObjectToToon(item as JsonObject))
      } else {
        lines.push(`- ${this.formatValue(item)}`)
      }
    })

    return lines.join('\n')
  }

  private formatValue(value: JsonValue): string {
    if (value === null || value === undefined) return 'null'
    if (typeof value === 'boolean') return value ? 'true' : 'false'
    if (typeof value === 'number') return value.toString()
    if (typeof value === 'string')
      return this.config.quoteStrings ? `"${value}"` : value
    return JSON.stringify(value)
  }

  private formatTableValue(value: JsonValue): string {
    if (value === null || value === undefined) return ''
    if (typeof value === 'boolean') return value ? 'true' : 'false'
    if (typeof value === 'number') return value.toString()
    if (typeof value === 'string')
      return this.config.quoteStrings ? `"${value}"` : value
    return JSON.stringify(value)
  }

  /**
   * Calculate token savings compared to JSON
   */
  static calculateSavings(json: string, toon: string): SimpleToonSavings {
    const jsonTokens = Math.ceil(json.length / 4)
    const toonTokens = Math.ceil(toon.length / 4)
    const savings = jsonTokens - toonTokens
    const percentage = jsonTokens > 0 ? (savings / jsonTokens) * 100 : 0

    return {
      jsonTokens,
      toonTokens,
      savings,
      percentage: Math.round(percentage * 100) / 100,
    }
  }

  /**
   * Convert simple data to TOON-like format (static method)
   */
  static optimizeForLLM(data: unknown): string {
    const optimizer = new SimpleToonOptimizer()
    return optimizer.convertToToon(data)
  }
}

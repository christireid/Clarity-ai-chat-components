/**
 * TOON (Token-Oriented Object Notation) Optimizer
 *
 * Implements the TOON format for 30-60% token savings vs JSON
 * Combines YAML-like indentation with CSV-style tabular arrays
 */

export interface ToonConfig {
  enableArrayTables: boolean
  maxArraySizeForTable: number
  preserveKeys: boolean
  compactNumbers: boolean
  quoteStrings: boolean
}

export class ToonOptimizer {
  constructor(private config: ToonConfig) {}

  /**
   * Convert data to TOON format for optimal token usage
   */
  static optimizeForLLM(data: any): string {
    return new ToonOptimizer({
      enableArrayTables: true,
      maxArraySizeForTable: 100,
      preserveKeys: false,
      compactNumbers: true,
      quoteStrings: false,
    }).convertToToon(data)
  }

  /**
   * Convert any data structure to TOON format
   */
  convertToToon(data: any, indent: number = 0): string {
    if (data === null || data === undefined) return 'null'
    if (typeof data !== 'object') return this.formatPrimitive(data)

    const lines: string[] = []
    const indentStr = '  '.repeat(indent)

    if (Array.isArray(data)) {
      return this.convertArrayToToon(data, indent)
    }

    // Convert object to TOON format
    for (const [key, value] of Object.entries(data)) {
      const toonKey = this.formatKey(key)

      if (Array.isArray(value) && this.shouldUseTableFormat(value)) {
        // Convert to TOON table format
        lines.push(this.convertToTable(toonKey, value, indent))
      } else if (typeof value === 'object' && value !== null) {
        // Nested object
        lines.push(`${indentStr}${toonKey}:`)
        lines.push(this.convertToToon(value, indent + 1))
      } else {
        // Primitive value
        const formattedValue = this.formatPrimitive(value)
        lines.push(`${indentStr}${toonKey}: ${formattedValue}`)
      }
    }

    return lines.join('\n')
  }

  /**
   * Convert array to TOON format
   */
  private convertArrayToToon(arr: any[], indent: number): string {
    if (this.shouldUseTableFormat(arr)) {
      return this.convertToTable('array', arr, indent)
    }

    const lines: string[] = []
    const indentStr = '  '.repeat(indent)

    arr.forEach((item) => {
      if (typeof item === 'object' && item !== null) {
        // Complex item
        lines.push(`${indentStr}-`)
        lines.push(this.convertToToon(item, indent + 1))
      } else {
        // Simple item
        const formattedItem = this.formatPrimitive(item)
        lines.push(`${indentStr}- ${formattedItem}`)
      }
    })

    return lines.join('\n')
  }

  /**
   * Convert array to TOON table format (most efficient for uniform arrays)
   */
  private convertToTable(name: string, arr: any[], indent: number): string {
    if (arr.length === 0) {
      return `${'  '.repeat(indent)}${name}[0]:`
    }

    // Check if all items have the same structure
    if (!this.isUniformArray(arr)) {
      return this.convertArrayToToon(arr, indent)
    }

    const keys = this.extractKeys(arr[0])
    const indentStr = '  '.repeat(indent)

    // Table header with count and field names
    let result = `${indentStr}${name}[${arr.length}]{${keys.join(',')}}:\n`

    // Convert each row to comma-separated values
    arr.forEach((item) => {
      const values = keys.map((key) => {
        const value = this.getNestedValue(item, key)
        return this.formatTableValue(value)
      })
      result += `${indentStr}  ${values.join(',')}\n`
    })

    return result
  }

  /**
   * Check if array should use table format
   */
  private shouldUseTableFormat(arr: any[]): boolean {
    if (!this.config.enableArrayTables) return false
    if (arr.length === 0) return true
    if (arr.length > this.config.maxArraySizeForTable) return false

    return this.isUniformArray(arr)
  }

  /**
   * Check if all array items have the same structure
   */
  private isUniformArray(arr: any[]): boolean {
    if (arr.length === 0) return true

    // All items must be objects
    if (
      !arr.every(
        (item) =>
          typeof item === 'object' && item !== null && !Array.isArray(item)
      )
    ) {
      return false
    }

    // All objects must have the same keys
    const firstKeys = Object.keys(arr[0]).sort()
    return arr.every((item) => {
      const itemKeys = Object.keys(item).sort()
      return JSON.stringify(firstKeys) === JSON.stringify(itemKeys)
    })
  }

  /**
   * Extract keys from object, handling nested structures
   */
  private extractKeys(obj: any, prefix: string = ''): string[] {
    const keys: string[] = []

    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Nested object
        keys.push(...this.extractKeys(value, fullKey))
      } else {
        // Simple value
        keys.push(fullKey)
      }
    })

    return keys
  }

  /**
   * Get nested value using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  /**
   * Format value for table (compact representation)
   */
  private formatTableValue(value: any): string {
    if (value === null || value === undefined) return ''
    if (typeof value === 'boolean') return value ? 'true' : 'false'
    if (typeof value === 'number')
      return this.config.compactNumbers ? value.toString() : value.toString()
    if (typeof value === 'string') {
      // Remove quotes if configured
      return this.config.quoteStrings ? `"${value}"` : value
    }

    // Complex objects as JSON
    return JSON.stringify(value)
  }

  /**
   * Format primitive value
   */
  private formatPrimitive(value: any): string {
    if (value === null || value === undefined) return 'null'
    if (typeof value === 'boolean') return value ? 'true' : 'false'
    if (typeof value === 'number')
      return this.config.compactNumbers ? value.toString() : value.toString()
    if (typeof value === 'string') {
      return this.config.quoteStrings ? `"${value}"` : value
    }

    return JSON.stringify(value)
  }

  /**
   * Format key name
   */
  private formatKey(key: string): string {
    // Remove quotes and format consistently
    return key.replace(/["']/g, '')
  }

  /**
   * Parse TOON format back to JavaScript object
   */
  parseToon(toon: string): any {
    const lines = toon.split('\n')
    return this.parseToonLines(lines, 0).result
  }

  /**
   * Parse TOON lines recursively
   */
  private parseToonLines(
    lines: string[],
    startIndent: number
  ): { result: any; nextIndex: number } {
    const result: any = {}
    let i = 0

    while (i < lines.length) {
      const line = lines[i]
      if (!line.trim()) {
        i++
        continue
      }

      const currentIndent = this.getIndentLevel(line)

      if (currentIndent < startIndent) {
        // Back to parent level
        return { result, nextIndex: i }
      }

      if (currentIndent === startIndent) {
        // Same level
        const parsed = this.parseLine(line)
        if (parsed.table) {
          // Handle table format
          result[parsed.key] = this.parseTable(parsed.tableData)
        } else if (parsed.isArray) {
          // Handle array
          const arrayResult = this.parseArray(lines, i, currentIndent)
          result[parsed.key] = arrayResult.result
          i = arrayResult.nextIndex - 1
        } else if (parsed.isNested) {
          // Handle nested object
          const nestedResult = this.parseToonLines(
            lines.slice(i + 1),
            currentIndent + 1
          )
          result[parsed.key] = nestedResult.result
          i += nestedResult.nextIndex
        } else {
          // Simple key-value
          result[parsed.key] = parsed.value
        }
      }

      i++
    }

    return { result, nextIndex: lines.length }
  }

  /**
   * Parse a single TOON line
   */
  private parseLine(line: string): LineParse {
    const trimmed = line.trim()

    // Check for table format: key[count]{fields}:
    const tableMatch = trimmed.match(/^(\w+)\[(\d+)\]\{([^}]+)\}:\s*$/)
    if (tableMatch) {
      return {
        key: tableMatch[1],
        table: true,
        tableData: {
          count: parseInt(tableMatch[2], 10),
          fields: tableMatch[3].split(','),
        },
      }
    }

    // Check for simple key-value
    const kvMatch = trimmed.match(/^(\w+):\s*(.*)$/)
    if (kvMatch) {
      return {
        key: kvMatch[1],
        value: this.parseValue(kvMatch[2]),
        isArray: kvMatch[2].startsWith('-'),
        isNested: !kvMatch[2] || kvMatch[2] === '',
      }
    }

    // Assume it's a list item
    return {
      key: 'item',
      value: this.parseValue(trimmed.replace(/^-\s*/, '')),
      isArray: true,
    }
  }

  /**
   * Parse table data
   */
  private parseTable(_tableData: any): any[] {
    // const { count, fields } = tableData
    const result: any[] = []
    // Implementation would parse the table rows
    return result
  }

  /**
   * Parse array
   */
  private parseArray(
    lines: string[],
    startIndex: number,
    baseIndent: number
  ): { result: any[]; nextIndex: number } {
    const result: any[] = []
    let i = startIndex

    while (i < lines.length) {
      const line = lines[i]
      const currentIndent = this.getIndentLevel(line)

      if (currentIndent <= baseIndent) {
        break
      }

      if (line.trim().startsWith('-')) {
        const value = this.parseValue(line.trim().substring(1).trim())
        result.push(value)
      }

      i++
    }

    return { result, nextIndex: i }
  }

  /**
   * Parse value
   */
  private parseValue(value: string): any {
    if (value === 'null') return null
    if (value === 'true') return true
    if (value === 'false') return false
    if (/^\d+$/.test(value)) return parseInt(value, 10)
    if (/^\d+\.\d+$/.test(value)) return parseFloat(value)
    if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1)

    return value
  }

  /**
   * Get indentation level
   */
  private getIndentLevel(line: string): number {
    const match = line.match(/^(\s*)/)
    return match ? match[1].length / 2 : 0
  }

  /**
   * Calculate token savings compared to JSON
   */
  static calculateSavings(json: string, toon: string): SavingsInfo {
    const jsonTokens = Math.ceil(json.length / 4) // Approximate
    const toonTokens = Math.ceil(toon.length / 4) // Approximate

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
   * Optimize data structure for TOON
   */
  optimizeDataStructure(data: any): any {
    if (Array.isArray(data) && data.length > 0) {
      // Ensure uniform structure for arrays
      const firstItem = data[0]
      const keys = Object.keys(firstItem).sort()

      return data.map((item) => {
        const uniformItem: any = {}
        keys.forEach((key) => {
          uniformItem[key] = item[key] ?? null
        })
        return uniformItem
      })
    }

    if (typeof data === 'object' && data !== null) {
      // Optimize nested structures
      const optimized: any = {}

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          optimized[key] = this.optimizeDataStructure(value)
        } else if (typeof value === 'object' && value !== null) {
          optimized[key] = this.optimizeDataStructure(value)
        } else {
          optimized[key] = value
        }
      })

      return optimized
    }

    return data
  }
}

// Interfaces
interface LineParse {
  key: string
  value?: any
  table?: boolean
  tableData?: any
  isArray?: boolean
  isNested?: boolean
}

export interface SavingsInfo {
  jsonTokens: number
  toonTokens: number
  savings: number
  percentage: number
}

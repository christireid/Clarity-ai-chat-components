/**
 * Simple TOON Implementation
 * 
 * Basic TOON format conversion without external dependencies
 */

export class SimpleToonOptimizer {
  private config: any

  constructor(config: any = {}) {
    this.config = {
      enableArrayTables: true,
      maxArraySizeForTable: 100,
      preserveKeys: false,
      compactNumbers: true,
      quoteStrings: false,
      ...config
    }
  }

  /**
   * Convert data to TOON format
   */
  convertToToon(data: any): string {
    if (typeof data !== 'object' || data === null) {
      return String(data)
    }

    if (Array.isArray(data)) {
      return this.convertArrayToToon(data)
    }

    return this.convertObjectToToon(data)
  }

  /**
   * Convert simple data to TOON-like format (alias)
   */
  optimizeForLLM(data: any): string {
    return this.convertToToon(data)
  }

  /**
   * Optimize data structure for LLM consumption
   */
  optimizeDataStructure(data: any): {
    optimized: string
    original: string
    savings: number
    percentage: number
  } {
    const original = JSON.stringify(data)
    const optimized = this.convertToToon(data)
    const savings = SimpleToonOptimizer.calculateSavings(original, optimized)
    
    return {
      optimized,
      original,
      savings: savings.savings,
      percentage: savings.percentage
    }
  }

  private convertObjectToToon(obj: Record<string, any>): string {
    const lines: string[] = []
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        lines.push(`${key}:`)
        lines.push('  ' + this.convertObjectToToon(value).split('\n').join('\n  '))
      } else if (Array.isArray(value)) {
        lines.push(this.convertArrayToToon(value, key))
      } else {
        lines.push(`${key}: ${this.formatValue(value)}`)
      }
    }
    
    return lines.join('\n')
  }

  private convertArrayToToon(arr: any[], name = 'items'): string {
    if (arr.length === 0) {
      return `${name}[0]:`
    }

    // Check if all items are objects with same structure
    if (this.config.enableArrayTables && arr.every(item => typeof item === 'object' && item !== null && !Array.isArray(item))) {
      const firstKeys = Object.keys(arr[0]) // Don't sort to maintain original order
      const allSameStructure = arr.every(item => {
        const itemKeys = Object.keys(item)
        return JSON.stringify(firstKeys) === JSON.stringify(itemKeys)
      })

      if (allSameStructure && arr.length <= this.config.maxArraySizeForTable) {
        // Use table format
        const lines: string[] = [`${name}[${arr.length}]{${firstKeys.join(',')}}:`]
        
        arr.forEach(item => {
          const values = firstKeys.map(key => this.formatTableValue(item[key]))
          lines.push(`  ${values.join(',')}`)
        })
        
        return lines.join('\n')
      }
    }

    // Use regular array format
    const lines: string[] = [`${name}:`]
    arr.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        lines.push('-')
        lines.push(this.convertObjectToToon(item))
      } else {
        lines.push(`- ${this.formatValue(item)}`)
      }
    })
    
    return lines.join('\n')
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined) return 'null'
    if (typeof value === 'boolean') return value ? 'true' : 'false'
    if (typeof value === 'number') return value.toString()
    if (typeof value === 'string') return this.config.quoteStrings ? `"${value}"` : value
    return JSON.stringify(value)
  }

  private formatTableValue(value: any): string {
    if (value === null || value === undefined) return ''
    if (typeof value === 'boolean') return value ? 'true' : 'false'
    if (typeof value === 'number') return value.toString()
    if (typeof value === 'string') return this.config.quoteStrings ? `"${value}"` : value
    return JSON.stringify(value)
  }

  /**
   * Calculate token savings compared to JSON
   */
  static calculateSavings(json: string, toon: string): {
    jsonTokens: number
    toonTokens: number
    savings: number
    percentage: number
  } {
    const jsonTokens = Math.ceil(json.length / 4)
    const toonTokens = Math.ceil(toon.length / 4)
    const savings = jsonTokens - toonTokens
    const percentage = jsonTokens > 0 ? (savings / jsonTokens) * 100 : 0
    
    return {
      jsonTokens,
      toonTokens,
      savings,
      percentage: Math.round(percentage * 100) / 100
    }
  }

  /**
   * Convert simple data to TOON-like format (static method)
   */
  static optimizeForLLM(data: any): string {
    const optimizer = new SimpleToonOptimizer()
    return optimizer.convertToToon(data)
  }
}
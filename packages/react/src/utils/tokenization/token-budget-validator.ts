import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

export interface TokenBudget {
  total: number
  used: number
  remaining: number
  percentage: number
  isExceeded: boolean
}

/**
 * @deprecated Use `CanonicalTokenBudgetConfig` (or `ReactTokenBudgetConfig`) from
 * `@clarity-chat/token-optimization` instead. This local definition is kept for
 * backwards compatibility.
 */
export interface TokenBudgetConfig {
  maxTokens: number
  warningThreshold?: number // percentage (0-1)
  criticalThreshold?: number // percentage (0-1)
  autoTruncate?: boolean
  preserveContext?: boolean
  truncationStrategy?: 'truncate' | 'remove' | 'summarize'
}

export interface TokenBudgetValidation {
  isValid: boolean
  budget: TokenBudget
  violations: TokenBudgetViolation[]
  suggestions: string[]
}

export interface TokenBudgetViolation {
  type:
    | 'exceeds_total'
    | 'exceeds_remaining'
    | 'warning_threshold'
    | 'critical_threshold'
  message: string
  severity: 'warning' | 'error' | 'critical'
  suggestedAction: string
}

export interface TruncationOptions {
  strategy?: 'truncate' | 'remove' | 'summarize'
  preserveContext?: boolean
  minLength?: number
  maxLength?: number
}

/**
 * Token budget validation and management
 */
export class TokenBudgetValidator {
  private budgets = new Map<string, TokenBudget>()
  private configs = new Map<string, TokenBudgetConfig>()
  private counter = new AccurateTokenCounter({ model: 'gpt-4' })

  /**
   * Create a new token budget
   */
  public createBudget(id: string, config: TokenBudgetConfig): TokenBudget {
    const budget: TokenBudget = {
      total: config.maxTokens,
      used: 0,
      remaining: config.maxTokens,
      percentage: 0,
      isExceeded: false,
    }

    this.budgets.set(id, budget)
    this.configs.set(id, {
      warningThreshold: 0.8,
      criticalThreshold: 0.95,
      autoTruncate: false,
      preserveContext: true,
      truncationStrategy: 'truncate',
      ...config,
    })

    return { ...budget }
  }

  /**
   * Validate text against budget
   */
  public validateText(
    budgetId: string,
    text: string,
    options: {
      allowTruncation?: boolean
      contextId?: string
    } = {}
  ): TokenBudgetValidation {
    const budget = this.budgets.get(budgetId)
    const config = this.configs.get(budgetId)

    if (!budget || !config) {
      throw new Error(`Budget '${budgetId}' not found`)
    }

    const tokenCount = this.counter.count(text)
    const projectedUsed = budget.used + tokenCount
    const projectedPercentage = projectedUsed / budget.total

    const violations: TokenBudgetViolation[] = []
    const suggestions: string[] = []

    // Check if text exceeds total budget
    if (tokenCount > budget.total) {
      violations.push({
        type: 'exceeds_total',
        message: `Text requires ${tokenCount} tokens, but total budget is ${budget.total}`,
        severity: 'error',
        suggestedAction: 'Reduce text size or increase budget',
      })
    }

    // Check if text exceeds remaining budget
    if (projectedUsed > budget.total) {
      violations.push({
        type: 'exceeds_remaining',
        message: `Text would exceed remaining budget (${budget.remaining} tokens remaining)`,
        severity: 'error',
        suggestedAction: 'Truncate text or clear budget',
      })
    }

    // Set default thresholds
    const warningThreshold = config.warningThreshold ?? 0.8
    const criticalThreshold = config.criticalThreshold ?? 0.95

    // Check warning threshold
    if (projectedPercentage > warningThreshold) {
      violations.push({
        type: 'warning_threshold',
        message: `Projected usage (${(projectedPercentage * 100).toFixed(1)}%) exceeds warning threshold (${(warningThreshold * 100).toFixed(1)}%)`,
        severity: 'warning',
        suggestedAction: 'Consider reducing text size or clearing budget',
      })
    }

    // Check critical threshold
    if (projectedPercentage > criticalThreshold) {
      violations.push({
        type: 'critical_threshold',
        message: `Projected usage (${(projectedPercentage * 100).toFixed(1)}%) exceeds critical threshold (${(criticalThreshold * 100).toFixed(1)}%)`,
        severity: 'critical',
        suggestedAction:
          'Immediate action required to prevent budget exhaustion',
      })
    }

    // Generate suggestions
    if (violations.length > 0 && options.allowTruncation) {
      suggestions.push(
        ...this.generateTruncationSuggestions(text, budget, config)
      )
    }

    if (projectedPercentage > 0.9) {
      suggestions.push('Consider increasing the token budget')
      suggestions.push('Implement text truncation or summarization')
      suggestions.push('Clear budget periodically')
    }

    return {
      isValid: violations.filter((v) => v.severity === 'error').length === 0,
      budget: { ...budget },
      violations,
      suggestions,
    }
  }

  /**
   * Validate conversation against budget
   */
  public validateConversation(
    budgetId: string,
    messages: Array<{ role: string; content: string }>,
    options: {
      allowTruncation?: boolean
      systemMessage?: string
    } = {}
  ): TokenBudgetValidation {
    const budget = this.budgets.get(budgetId)
    const config = this.configs.get(budgetId)

    if (!budget || !config) {
      throw new Error(`Budget '${budgetId}' not found`)
    }

    let totalTokens = 0
    const messageTokens: number[] = []

    // Count system message if provided
    if (options.systemMessage) {
      const systemTokens = this.counter.count(options.systemMessage)
      totalTokens += systemTokens
      messageTokens.push(systemTokens)
    }

    // Count all messages
    messages.forEach((message, index) => {
      const messageContent = `${message.role}: ${message.content}`
      const tokens = this.counter.count(messageContent)
      totalTokens += tokens
      messageTokens.push(tokens)
    })

    const projectedUsed = budget.used + totalTokens
    const projectedPercentage = projectedUsed / budget.total

    const violations: TokenBudgetViolation[] = []
    const suggestions: string[] = []

    // Check if conversation exceeds total budget
    if (totalTokens > budget.total) {
      violations.push({
        type: 'exceeds_total',
        message: `Conversation requires ${totalTokens} tokens, but total budget is ${budget.total}`,
        severity: 'error',
        suggestedAction: 'Reduce number of messages or increase budget',
      })
    }

    // Check if conversation exceeds remaining budget
    if (projectedUsed > budget.total) {
      violations.push({
        type: 'exceeds_remaining',
        message: `Conversation would exceed remaining budget (${budget.remaining} tokens remaining)`,
        severity: 'error',
        suggestedAction: 'Truncate messages or clear budget',
      })
    }

    // Set default thresholds
    const warningThreshold = config.warningThreshold ?? 0.8
    const criticalThreshold = config.criticalThreshold ?? 0.95

    // Check thresholds
    if (projectedPercentage > warningThreshold) {
      violations.push({
        type: 'warning_threshold',
        message: `Projected usage (${(projectedPercentage * 100).toFixed(1)}%) exceeds warning threshold`,
        severity: 'warning',
        suggestedAction: 'Consider reducing conversation length',
      })
    }

    if (projectedPercentage > criticalThreshold) {
      violations.push({
        type: 'critical_threshold',
        message: `Projected usage (${(projectedPercentage * 100).toFixed(1)}%) exceeds critical threshold`,
        severity: 'critical',
        suggestedAction: 'Immediate action required',
      })
    }

    return {
      isValid: violations.filter((v) => v.severity === 'error').length === 0,
      budget: { ...budget },
      violations,
      suggestions,
    }
  }

  /**
   * Use tokens from budget
   */
  public useTokens(budgetId: string, tokenCount: number): TokenBudget {
    const budget = this.budgets.get(budgetId)
    const config = this.configs.get(budgetId)

    if (!budget || !config) {
      throw new Error(`Budget '${budgetId}' not found`)
    }

    budget.used += tokenCount
    budget.remaining = Math.max(0, budget.total - budget.used)
    budget.percentage = budget.used / budget.total
    budget.isExceeded = budget.used > budget.total

    return { ...budget }
  }

  /**
   * Auto-truncate text to fit budget
   */
  public autoTruncate(
    text: string,
    maxTokens: number,
    options: TruncationOptions = {}
  ): { text: string; originalTokens: number; truncatedTokens: number } {
    const originalTokens = this.counter.count(text)

    if (originalTokens <= maxTokens) {
      return { text, originalTokens, truncatedTokens: originalTokens }
    }

    const strategy = options.strategy || 'truncate'
    let truncatedText = text

    switch (strategy) {
      case 'truncate':
        truncatedText = this.truncateText(text, maxTokens, options)
        break
      case 'remove':
        truncatedText = this.removeContent(text, maxTokens, options)
        break
      case 'summarize':
        truncatedText = this.summarizeText(text, maxTokens, options)
        break
      default:
        truncatedText = this.truncateText(text, maxTokens, options)
    }

    const truncatedTokens = this.counter.count(truncatedText)
    return { text: truncatedText, originalTokens, truncatedTokens }
  }

  /**
   * Truncate text to fit token limit
   */
  private truncateText(
    text: string,
    maxTokens: number,
    options: TruncationOptions
  ): string {
    if (options.preserveContext) {
      return this.truncatePreserveContext(text, maxTokens)
    }

    // Binary search for optimal truncation point
    let left = 0
    let right = text.length
    let bestLength = 0

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      const truncated = text.substring(0, mid)
      const tokens = this.counter.count(truncated)

      if (tokens <= maxTokens) {
        bestLength = mid
        left = mid + 1
      } else {
        right = mid - 1
      }
    }

    return text.substring(0, bestLength)
  }

  /**
   * Truncate while preserving important context
   */
  private truncatePreserveContext(text: string, maxTokens: number): string {
    // Keep first and last parts, truncate middle
    const tokens = this.counter.count(text)
    if (tokens <= maxTokens) return text

    const keepRatio = 0.3 // Keep 30% from beginning and end
    const keepLength = Math.floor(text.length * keepRatio)

    const beginning = text.substring(0, keepLength)
    const end = text.substring(text.length - keepLength)

    return `${beginning}\n[... truncated ...]\n${end}`
  }

  /**
   * Remove less important content
   */
  private removeContent(
    text: string,
    maxTokens: number,
    options: TruncationOptions
  ): string {
    // Remove examples, explanations, or redundant content
    const lines = text.split('\n')
    let currentText = text
    let currentTokens = this.counter.count(currentText)

    // Remove lines from the end first
    while (currentTokens > maxTokens && lines.length > 1) {
      lines.pop()
      currentText = lines.join('\n')
      currentTokens = this.counter.count(currentText)
    }

    return currentText
  }

  /**
   * Summarize text to fit token limit
   */
  private summarizeText(
    text: string,
    maxTokens: number,
    options: TruncationOptions
  ): string {
    // Simple summarization - keep first and last sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

    if (sentences.length <= 2) {
      return this.truncateText(text, maxTokens, options)
    }

    const summary = `${sentences[0].trim()} ${sentences[sentences.length - 1].trim()}`
    const summaryTokens = this.counter.count(summary)

    if (summaryTokens <= maxTokens) {
      return summary
    }

    return this.truncateText(summary, maxTokens, options)
  }

  /**
   * Generate truncation suggestions
   */
  private generateTruncationSuggestions(
    text: string,
    budget: TokenBudget,
    config: TokenBudgetConfig
  ): string[] {
    const suggestions: string[] = []
    const maxTokens = budget.remaining

    suggestions.push(
      'Enable auto-truncation to automatically fit text to budget'
    )
    suggestions.push(`Consider using 'summarize' strategy for long text`)
    suggestions.push(`Current text could be truncated to ${maxTokens} tokens`)

    if (text.length > 1000) {
      suggestions.push('Break long text into smaller chunks')
      suggestions.push('Use progressive loading for large documents')
    }

    return suggestions
  }

  /**
   * Get budget status
   */
  public getBudget(id: string): TokenBudget | undefined {
    const budget = this.budgets.get(id)
    return budget ? { ...budget } : undefined
  }

  /**
   * Get all budgets
   */
  public getAllBudgets(): Record<string, TokenBudget> {
    const result: Record<string, TokenBudget> = {}
    this.budgets.forEach((budget, id) => {
      result[id] = { ...budget }
    })
    return result
  }

  /**
   * Clear budget
   */
  public clearBudget(id: string): void {
    const budget = this.budgets.get(id)
    const config = this.configs.get(id)

    if (budget && config) {
      budget.used = 0
      budget.remaining = budget.total
      budget.percentage = 0
      budget.isExceeded = false
    }
  }

  /**
   * Remove budget
   */
  public removeBudget(id: string): void {
    this.budgets.delete(id)
    this.configs.delete(id)
  }

  /**
   * Calculate optimal budget
   */
  public calculateOptimalBudget(
    text: string,
    conversation?: Array<{ role: string; content: string }>
  ): number {
    let totalTokens = this.counter.count(text)

    if (conversation) {
      conversation.forEach((message) => {
        totalTokens += this.counter.count(`${message.role}: ${message.content}`)
      })
    }

    // Add 20% buffer for safety
    return Math.ceil(totalTokens * 1.2)
  }
}

// Export singleton instance
export const tokenBudgetValidator = new TokenBudgetValidator()

// Convenience functions
export function validateTokenBudget(
  budgetId: string,
  text: string,
  options?: any
) {
  return tokenBudgetValidator.validateText(budgetId, text, options)
}

export function createTokenBudget(
  id: string,
  maxTokens: number,
  options?: Partial<TokenBudgetConfig>
) {
  return tokenBudgetValidator.createBudget(id, { maxTokens, ...options })
}

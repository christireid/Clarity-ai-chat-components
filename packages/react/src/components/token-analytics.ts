/**
 * Token Analytics Monitor
 * Tracks token usage and provides analytics
 */

export interface TokenUsageEvent {
  model: string
  tokens: number
  timestamp: Date
  operation: 'input' | 'output'
}

export interface TokenAnalytics {
  totalTokens: number
  inputTokens: number
  outputTokens: number
  eventCount: number
}

class TokenAnalyticsMonitor {
  private events: TokenUsageEvent[] = []
  private maxEvents: number = 1000

  track(event: Omit<TokenUsageEvent, 'timestamp'>): void {
    this.events.push({
      ...event,
      timestamp: new Date(),
    })

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }
  }

  getAnalytics(): TokenAnalytics {
    const inputTokens = this.events
      .filter((e) => e.operation === 'input')
      .reduce((sum, e) => sum + e.tokens, 0)

    const outputTokens = this.events
      .filter((e) => e.operation === 'output')
      .reduce((sum, e) => sum + e.tokens, 0)

    return {
      totalTokens: inputTokens + outputTokens,
      inputTokens,
      outputTokens,
      eventCount: this.events.length,
    }
  }

  clear(): void {
    this.events = []
  }
}

export const tokenAnalyticsMonitor = new TokenAnalyticsMonitor()

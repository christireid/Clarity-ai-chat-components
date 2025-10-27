/**
 * API Inspector for debugging AI provider API calls
 * 
 * Provides detailed logging and inspection of:
 * - Request headers and body
 * - Response headers and body
 * - Timing information
 * - Token usage and cost
 * - Streaming chunks
 */

export interface APICallLog {
  id: string
  timestamp: Date
  provider: string
  model: string
  endpoint: string
  request: {
    method: string
    headers: Record<string, string>
    body: any
  }
  response?: {
    status: number
    statusText: string
    headers: Record<string, string>
    body?: any
    streaming?: boolean
    chunks?: Array<{
      timestamp: Date
      content: string
      tokens?: number
    }>
  }
  timing: {
    startTime: number
    endTime?: number
    duration?: number
    ttfb?: number // Time to first byte
  }
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
    cost?: number
  }
  error?: {
    message: string
    code?: string
    stack?: string
  }
}

class APIInspector {
  private logs: Map<string, APICallLog> = new Map()
  private enabled: boolean = false
  private verbose: boolean = false
  private maxLogs: number = 100

  constructor(options: {
    enabled?: boolean
    verbose?: boolean
    maxLogs?: number
  } = {}) {
    this.enabled = options.enabled ?? process.env.NODE_ENV === 'development'
    this.verbose = options.verbose ?? false
    this.maxLogs = options.maxLogs ?? 100
  }

  /**
   * Start tracking an API call
   */
  startCall(options: {
    provider: string
    model: string
    endpoint: string
    method: string
    headers: Record<string, string>
    body: any
  }): string {
    if (!this.enabled) return ''

    const id = `${options.provider}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const log: APICallLog = {
      id,
      timestamp: new Date(),
      provider: options.provider,
      model: options.model,
      endpoint: options.endpoint,
      request: {
        method: options.method,
        headers: this.sanitizeHeaders(options.headers),
        body: this.sanitizeBody(options.body)
      },
      timing: {
        startTime: performance.now()
      }
    }

    this.logs.set(id, log)
    
    // Maintain max logs limit
    if (this.logs.size > this.maxLogs) {
      const firstKey = this.logs.keys().next().value
      if (firstKey) {
        this.logs.delete(firstKey)
      }
    }

    if (this.verbose) {
      console.log(`\n🔍 [API Inspector] Starting call ${id}`)
      console.log(`   Provider: ${options.provider}`)
      console.log(`   Model: ${options.model}`)
      console.log(`   Endpoint: ${options.endpoint}`)
      console.log(`   Request:`, JSON.stringify(log.request.body, null, 2))
    }

    return id
  }

  /**
   * Record first byte received (for streaming)
   */
  recordFirstByte(id: string): void {
    if (!this.enabled || !id) return

    const log = this.logs.get(id)
    if (!log) return

    log.timing.ttfb = performance.now() - log.timing.startTime

    if (this.verbose) {
      console.log(`   ⚡ TTFB: ${log.timing.ttfb.toFixed(2)}ms`)
    }
  }

  /**
   * Record streaming chunk
   */
  recordChunk(id: string, content: string, tokens?: number): void {
    if (!this.enabled || !id) return

    const log = this.logs.get(id)
    if (!log) return

    if (!log.response) {
      log.response = {
        status: 200,
        statusText: 'OK',
        headers: {},
        streaming: true,
        chunks: []
      }
    }

    log.response.chunks = log.response.chunks || []
    log.response.chunks.push({
      timestamp: new Date(),
      content,
      tokens
    })

    if (this.verbose) {
      console.log(`   📦 Chunk ${log.response.chunks.length}: ${content.substring(0, 50)}...`)
    }
  }

  /**
   * Complete an API call
   */
  completeCall(id: string, response: {
    status: number
    statusText: string
    headers: Record<string, string>
    body?: any
  }): void {
    if (!this.enabled || !id) return

    const log = this.logs.get(id)
    if (!log) return

    log.timing.endTime = performance.now()
    log.timing.duration = log.timing.endTime - log.timing.startTime

    if (!log.response) {
      log.response = {
        status: response.status,
        statusText: response.statusText,
        headers: this.sanitizeHeaders(response.headers),
        body: this.sanitizeBody(response.body)
      }
    } else {
      // Update response info for streaming calls
      log.response.status = response.status
      log.response.statusText = response.statusText
      log.response.headers = this.sanitizeHeaders(response.headers)
    }

    // Extract usage information
    if (response.body?.usage) {
      log.usage = {
        promptTokens: response.body.usage.prompt_tokens || 0,
        completionTokens: response.body.usage.completion_tokens || 0,
        totalTokens: response.body.usage.total_tokens || 0
      }
    }

    if (this.verbose) {
      console.log(`\n✅ [API Inspector] Completed call ${id}`)
      console.log(`   Duration: ${log.timing.duration?.toFixed(2)}ms`)
      if (log.usage) {
        console.log(`   Tokens: ${log.usage.totalTokens} (prompt: ${log.usage.promptTokens}, completion: ${log.usage.completionTokens})`)
      }
      if (log.response.chunks) {
        console.log(`   Chunks: ${log.response.chunks.length}`)
      }
    }
  }

  /**
   * Record an error
   */
  recordError(id: string, error: Error): void {
    if (!this.enabled || !id) return

    const log = this.logs.get(id)
    if (!log) return

    log.timing.endTime = performance.now()
    log.timing.duration = log.timing.endTime - log.timing.startTime

    log.error = {
      message: error.message,
      code: (error as any).code,
      stack: error.stack
    }

    if (this.verbose) {
      console.error(`\n❌ [API Inspector] Error in call ${id}`)
      console.error(`   Duration: ${log.timing.duration?.toFixed(2)}ms`)
      console.error(`   Error: ${error.message}`)
    }
  }

  /**
   * Get all logs
   */
  getLogs(): APICallLog[] {
    return Array.from(this.logs.values())
  }

  /**
   * Get specific log
   */
  getLog(id: string): APICallLog | undefined {
    return this.logs.get(id)
  }

  /**
   * Get logs by provider
   */
  getLogsByProvider(provider: string): APICallLog[] {
    return Array.from(this.logs.values()).filter(log => log.provider === provider)
  }

  /**
   * Get logs with errors
   */
  getErrorLogs(): APICallLog[] {
    return Array.from(this.logs.values()).filter(log => log.error)
  }

  /**
   * Get average response time
   */
  getAverageResponseTime(provider?: string): number {
    const logs = provider 
      ? this.getLogsByProvider(provider)
      : Array.from(this.logs.values())

    const completedLogs = logs.filter(log => log.timing.duration)
    
    if (completedLogs.length === 0) return 0

    const totalDuration = completedLogs.reduce((sum, log) => sum + (log.timing.duration || 0), 0)
    return totalDuration / completedLogs.length
  }

  /**
   * Get total token usage
   */
  getTotalUsage(provider?: string): {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  } {
    const logs = provider 
      ? this.getLogsByProvider(provider)
      : Array.from(this.logs.values())

    return logs.reduce((total, log) => {
      if (!log.usage) return total
      return {
        promptTokens: total.promptTokens + log.usage.promptTokens,
        completionTokens: total.completionTokens + log.usage.completionTokens,
        totalTokens: total.totalTokens + log.usage.totalTokens
      }
    }, { promptTokens: 0, completionTokens: 0, totalTokens: 0 })
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs.clear()
  }

  /**
   * Export logs to JSON
   */
  exportLogs(): string {
    return JSON.stringify(Array.from(this.logs.values()), null, 2)
  }

  /**
   * Enable/disable inspector
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Enable/disable verbose logging
   */
  setVerbose(verbose: boolean): void {
    this.verbose = verbose
  }

  /**
   * Sanitize headers (remove sensitive data)
   */
  private sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized = { ...headers }
    
    // Remove or mask sensitive headers
    if (sanitized['authorization']) {
      sanitized['authorization'] = sanitized['authorization'].replace(/Bearer .+/, 'Bearer [REDACTED]')
    }
    if (sanitized['api-key']) {
      sanitized['api-key'] = '[REDACTED]'
    }
    if (sanitized['x-api-key']) {
      sanitized['x-api-key'] = '[REDACTED]'
    }

    return sanitized
  }

  /**
   * Sanitize body (truncate long content)
   */
  private sanitizeBody(body: any): any {
    if (!body) return body

    const sanitized = JSON.parse(JSON.stringify(body))

    // Truncate long message content
    if (sanitized.messages) {
      sanitized.messages = sanitized.messages.map((msg: any) => {
        if (msg.content && typeof msg.content === 'string' && msg.content.length > 500) {
          return {
            ...msg,
            content: msg.content.substring(0, 500) + '... [truncated]'
          }
        }
        return msg
      })
    }

    return sanitized
  }
}

// Global singleton instance
let globalInspector: APIInspector | null = null

/**
 * Get the global API inspector instance
 */
export function getAPIInspector(): APIInspector {
  if (!globalInspector) {
    globalInspector = new APIInspector()
  }
  return globalInspector
}

/**
 * Create a new API inspector instance
 */
export function createAPIInspector(options?: {
  enabled?: boolean
  verbose?: boolean
  maxLogs?: number
}): APIInspector {
  return new APIInspector(options)
}

export { APIInspector }

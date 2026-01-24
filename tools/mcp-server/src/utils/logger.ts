/**
 * Structured logging utility for MCP server
 *
 * Uses console.error for stdio transport compatibility.
 * Re-exports the canonical logger from @clarity-chat/utils with MCP-specific adaptations.
 */

import { getLogger as utilsGetLogger } from '@clarity-chat/utils/logger'

// Re-export standard logger types
export { LogLevel } from '@clarity-chat/utils/logger'
export type { Logger, LogEntry, LoggerOptions } from '@clarity-chat/utils/logger'

/**
 * MCP Server Logger
 *
 * Uses console.error for logging to ensure stdio transport compatibility
 * (MCP uses stdin/stdout for communication, so we need stderr for logs)
 */
class MCPLogger {
  private requestId?: string
  private baseLogger = utilsGetLogger('mcp-server')

  setRequestId(requestId: string): void {
    this.requestId = requestId
  }

  clearRequestId(): void {
    this.requestId = undefined
  }

  private formatMessage(level: string, message: string, metadata?: Record<string, unknown>): string {
    const entry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(this.requestId && { requestId: this.requestId }),
      ...(metadata && { metadata }),
    }
    return JSON.stringify(entry)
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    console.error(this.formatMessage('debug', message, metadata))
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    console.error(this.formatMessage('info', message, metadata))
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    console.error(this.formatMessage('warn', message, metadata))
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    const entry = this.formatMessage('error', message, {
      ...metadata,
      ...(error && {
        error: error.message,
        ...(error.stack && { stack: error.stack }),
      }),
    })
    console.error(entry)
  }
}

/**
 * Global MCP logger instance
 *
 * This logger always uses stderr for output to avoid interfering
 * with the MCP protocol communication on stdout.
 */
export const logger = new MCPLogger()

/**
 * Command Validation Utilities
 *
 * Provides validation for command palette commands to prevent
 * command injection and ensure type safety.
 *
 * OWASP Top 10 2021: A03:2021 – Injection
 */

import type { CommandItem } from '../../components/navigation/CommandPalette'

export interface CommandValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Allowed command types for whitelist validation
 */
const ALLOWED_COMMAND_TYPES = new Set([
  'navigation',
  'action',
  'search',
  'ai',
  'settings',
  'help',
])

/**
 * Validates command structure to prevent injection attacks
 *
 * @param command - Command item to validate
 * @returns Validation result with errors
 *
 * @example
 * ```ts
 * const result = validateCommandStructure({
 *   id: 'cmd-1',
 *   label: 'Safe Command',
 *   onSelect: () => console.log('safe')
 * })
 * // Returns: { isValid: true, errors: [] }
 * ```
 */
export function validateCommandStructure(
  command: CommandItem
): CommandValidationResult {
  const errors: string[] = []

  // Validate required fields
  if (!command.id || typeof command.id !== 'string') {
    errors.push('Command must have a valid string ID')
  }

  if (!command.label || typeof command.label !== 'string') {
    errors.push('Command must have a valid string label')
  }

  // Validate onSelect is a function (not executable code string)
  if (typeof command.onSelect !== 'function') {
    errors.push('Command onSelect must be a function, not a string or object')
  }

  // Validate ID doesn't contain injection patterns
  if (command.id && /[<>\"'`]/.test(command.id)) {
    errors.push('Command ID contains invalid characters')
  }

  // Validate category if present
  if (command.category && typeof command.category !== 'string') {
    errors.push('Command category must be a string')
  }

  // Validate description if present
  if (command.description !== undefined) {
    if (typeof command.description !== 'string') {
      errors.push('Command description must be a string')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Checks if command type is in the allowed whitelist
 *
 * @param category - Command category
 * @returns True if category is allowed
 */
export function isAllowedCommandType(category?: string): boolean {
  if (!category) return true // Uncategorized commands are allowed
  return ALLOWED_COMMAND_TYPES.has(category.toLowerCase())
}

/**
 * Rate limiter for command execution to prevent DoS
 */
class CommandRateLimiter {
  private executionCounts: Map<string, number[]> = new Map()
  private readonly maxExecutionsPerMinute = 30

  /**
   * Checks if command can be executed based on rate limits
   *
   * @param commandId - ID of command to check
   * @returns True if execution is allowed
   */
  canExecute(commandId: string): boolean {
    const now = Date.now()
    const executions = this.executionCounts.get(commandId) || []

    // Filter out executions older than 1 minute
    const recentExecutions = executions.filter(
      (timestamp) => now - timestamp < 60000
    )

    if (recentExecutions.length >= this.maxExecutionsPerMinute) {
      return false
    }

    // Record this execution
    recentExecutions.push(now)
    this.executionCounts.set(commandId, recentExecutions)

    return true
  }

  /**
   * Resets rate limit for a command
   */
  reset(commandId: string): void {
    this.executionCounts.delete(commandId)
  }

  /**
   * Clears all rate limits
   */
  clear(): void {
    this.executionCounts.clear()
  }
}

// Global rate limiter instance
export const commandRateLimiter = new CommandRateLimiter()

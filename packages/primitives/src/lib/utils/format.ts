/**
 * Format Utilities
 * Data formatting functions
 */

/**
 * Format timestamp to ISO string
 */
export function formatTimestamp(date: Date): string {
  return date.toISOString()
}

/**
 * Validate configuration against schema
 */
export function validateConfig<T>(
  config: unknown,
  schema: { validate: (data: unknown) => T }
): T {
  try {
    return schema.validate(config)
  } catch (error) {
    throw new Error(`Configuration validation failed: ${error}`)
  }
}

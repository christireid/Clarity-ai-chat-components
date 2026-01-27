/**
 * Enterprise Error Classes
 * Standardized error handling for enterprise features
 */

/**
 * Base enterprise error
 */
export class EnterpriseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly severity: 'low' | 'medium' | 'high' = 'medium',
    public readonly details?: any
  ) {
    super(message)
    this.name = 'EnterpriseError'
  }
}

/**
 * Threshold exceeded error
 */
export class ThresholdExceededError extends EnterpriseError {
  constructor(
    public readonly threshold: number,
    public readonly actual: number,
    public readonly metric: string
  ) {
    super(
      `${metric} threshold exceeded: ${actual} > ${threshold}`,
      'THRESHOLD_EXCEEDED',
      'high',
      { threshold, actual, metric }
    )
    this.name = 'ThresholdExceededError'
  }
}

/**
 * Configuration error
 */
export class ConfigurationError extends EnterpriseError {
  constructor(
    message: string,
    public readonly configKey?: string,
    public readonly expected?: string,
    public readonly received?: any
  ) {
    super(`Configuration error: ${message}`, 'CONFIG_ERROR', 'high', {
      configKey,
      expected,
      received,
    })
    this.name = 'ConfigurationError'
  }
}

/**
 * Processing error
 */
export class ProcessingError extends EnterpriseError {
  constructor(
    message: string,
    public readonly stage?: string,
    public readonly cause?: Error
  ) {
    super(`Processing error: ${message}`, 'PROCESSING_ERROR', 'high', {
      stage,
      cause: cause?.message,
    })
    this.name = 'ProcessingError'
  }
}

/**
 * Resource error
 */
export class ResourceError extends EnterpriseError {
  constructor(
    public readonly resource: string,
    public readonly operation: string,
    public readonly reason?: string
  ) {
    super(
      `Resource error: ${operation} failed for ${resource}${reason ? `: ${reason}` : ''}`,
      'RESOURCE_ERROR',
      'high',
      { resource, operation, reason }
    )
    this.name = 'ResourceError'
  }
}

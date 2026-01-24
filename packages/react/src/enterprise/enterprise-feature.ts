/**
 * Enterprise Feature Base Class
 * Provides common functionality for all enterprise features
 */

import { EventEmitter } from 'events'
import { getLogger, LogLevel } from '../cli/src/utils/logger'
import { EnterpriseError, ThresholdExceededError } from './enterprise-errors'
import {
  formatBytes,
  formatTimestamp,
  ensureDirectories,
} from '@clarity-chat/primitives/lib/enterprise-utils'

/**
 * Base enterprise configuration
 */
export interface BaseEnterpriseConfig {
  enabled: boolean
  outputDir: string
  formats: string[]
  thresholds: Record<string, number>
  failOnThreshold: boolean
}

/**
 * Enterprise feature interface
 */
export interface EnterpriseFeatureInterface<TConfig, TData> {
  getDefaultConfig(): TConfig
  validateConfig(): void
  process(data: TData): Promise<TData>
  getConfig(): TConfig
  updateConfig(newConfig: Partial<TConfig>): void
}

/**
 * Enterprise event data
 */
export interface EnterpriseEvent<T = any> {
  type: string
  timestamp: Date
  severity: 'info' | 'warning' | 'error'
  data: T
  source: string
}

/**
 * Abstract base class for enterprise features
 */
export abstract class EnterpriseFeature<
  TConfig extends BaseEnterpriseConfig,
  TData,
>
  extends EventEmitter
  implements EnterpriseFeatureInterface<TConfig, TData>
{
  protected config: TConfig
  protected logger: ReturnType<typeof getLogger>
  protected metrics: any[] = []
  protected maxMetricsHistory = 100

  constructor(config: Partial<TConfig> = {}, namespace: string) {
    super()

    // Merge with default config
    this.config = { ...this.getDefaultConfig(), ...config }

    // Initialize logger
    this.logger = getLogger(namespace)

    // Ensure directories exist
    this.ensureDirectories()

    // Setup event handlers
    this.setupEventHandlers()

    this.logger.info('Enterprise feature initialized', {
      namespace,
      enabled: this.config.enabled,
    })
  }

  /**
   * Get default configuration
   */
  abstract getDefaultConfig(): TConfig

  /**
   * Validate configuration
   */
  abstract validateConfig(): void

  /**
   * Process data
   */
  abstract process(data: TData): Promise<TData>

  /**
   * Ensure required directories exist
   */
  protected ensureDirectories(): void {
    if (!this.config.outputDir) return

    const directories = [this.config.outputDir]
    ensureDirectories(directories)

    this.logger.debug('Directories ensured', { directories })
  }

  /**
   * Setup event handlers
   */
  protected setupEventHandlers(): void {
    // Log all events in debug mode
    if (process.env.DEBUG) {
      this.on('error', (error) => {
        this.logger.error('Feature error', error)
      })

      this.on('threshold-exceeded', (data) => {
        this.logger.warn('Threshold exceeded', data)
      })

      this.on('processing-complete', (data) => {
        this.logger.info('Processing complete', data)
      })
    }
  }

  /**
   * Check thresholds
   */
  protected checkThresholds(
    metric: string,
    value: number,
    threshold?: number
  ): void {
    const actualThreshold = threshold ?? this.config.thresholds[metric]
    if (actualThreshold && value > actualThreshold) {
      const error = new ThresholdExceededError(actualThreshold, value, metric)
      this.emit('threshold-exceeded', {
        metric,
        value,
        threshold: actualThreshold,
        error: error.message,
      })

      if (this.config.failOnThreshold) {
        throw error
      }
    }
  }

  /**
   * Update metrics
   */
  protected updateMetrics(metric: any): void {
    this.metrics.push({
      ...metric,
      timestamp: new Date(),
    })

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory)
    }

    this.emit('metrics-updated', metric)
  }

  /**
   * Get current configuration
   */
  getConfig(): TConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<TConfig>): void {
    const oldConfig = { ...this.config }
    this.config = { ...this.config, ...newConfig }

    this.emit('config-updated', {
      oldConfig,
      newConfig: this.config,
    })

    this.logger.info('Configuration updated', {
      changes: Object.keys(newConfig),
    })
  }

  /**
   * Get metrics history
   */
  getMetrics(): any[] {
    return [...this.metrics]
  }

  /**
   * Is feature enabled
   */
  isEnabled(): boolean {
    return this.config.enabled
  }

  /**
   * Enable feature
   */
  enable(): void {
    this.config.enabled = true
    this.emit('enabled')
    this.logger.info('Feature enabled')
  }

  /**
   * Disable feature
   */
  disable(): void {
    this.config.enabled = false
    this.emit('disabled')
    this.logger.info('Feature disabled')
  }
}

/**
 * Constructor type for enterprise features
 */
export type EnterpriseFeatureConstructor<
  TConfig extends BaseEnterpriseConfig,
  TData,
> = new (
  config?: Partial<TConfig>,
  namespace?: string
) => EnterpriseFeatureInterface<TConfig, TData>

/**
 * Enterprise feature factory
 */
export function createEnterpriseFeature<
  TConfig extends BaseEnterpriseConfig,
  TData,
>(
  name: string,
  config: {
    defaultConfig: TConfig
    validator: (config: TConfig) => void
    processor: (data: TData, config: TConfig) => Promise<TData>
  }
): EnterpriseFeatureConstructor<TConfig, TData> {
  return class extends EnterpriseFeature<TConfig, TData> {
    getDefaultConfig(): TConfig {
      return config.defaultConfig
    }

    validateConfig(): void {
      config.validator(this.config)
    }

    async process(data: TData): Promise<TData> {
      return config.processor(data, this.config)
    }
  }
}

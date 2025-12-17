/**
 * Enhanced Enterprise Feature Base Class
 * Integrates with existing CLI error patterns and provides comprehensive enterprise functionality
 */

import { EventEmitter } from 'events'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { CLIError, ExitCode } from '../../../cli/src/utils/errors.js'
import { getLogger } from '../../../cli/src/utils/logger.js'
import { 
  formatBytes, 
  formatTimestamp, 
  ensureDirectories, 
  calculatePercentage,
  generateUniqueFilename 
} from '../../../primitives/src/lib/enterprise-utils.js'

/**
 * Enhanced base enterprise configuration
 */
export interface EnhancedBaseEnterpriseConfig {
  enabled: boolean
  outputDir: string
  formats: string[]
  thresholds: Record<string, number>
  failOnThreshold: boolean
  generateReports: boolean
  includeGzip: boolean
  generateTrends: boolean
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

/**
 * Enterprise processing result
 */
export interface EnterpriseProcessingResult<TData = any> {
  success: boolean
  data: TData
  warnings: string[]
  errors: string[]
  metrics: Record<string, any>
  timestamp: Date
  duration: number
}

/**
 * Enhanced enterprise feature base class
 */
export abstract class EnhancedEnterpriseFeature<TConfig extends EnhancedBaseEnterpriseConfig, TInput, TOutput> 
  extends EventEmitter 
  implements EnterpriseFeatureInterface<TConfig, TInput, TOutput> {
  
  protected config: TConfig
  protected logger: ReturnType<typeof getLogger>
  protected metrics: Map<string, any[]> = new Map()
  protected maxMetricsHistory = 100
  protected startTime: Date | null = null

  constructor(config: Partial<TConfig> = {}, namespace: string) {
    super()
    
    // Initialize with enhanced default config
    this.config = this.mergeWithDefaults(config)
    
    // Initialize logger with configured level
    this.logger = getLogger(namespace)
    this.logger.setLevel(this.config.logLevel)
    
    // Setup feature
    this.setupFeature()
    
    this.logger.info('Enhanced enterprise feature initialized', { 
      namespace, 
      enabled: this.config.enabled,
      outputDir: this.config.outputDir 
    })
  }

  /**
   * Merge configuration with enhanced defaults
   */
  private mergeWithDefaults(userConfig: Partial<TConfig>): TConfig {
    const defaults = this.getEnhancedDefaultConfig()
    return { ...defaults, ...userConfig } as TConfig
  }

  /**
   * Get enhanced default configuration
   */
  private getEnhancedDefaultConfig(): EnhancedBaseEnterpriseConfig {
    return {
      enabled: true,
      outputDir: './enterprise-reports',
      formats: ['json', 'html'],
      thresholds: {},
      failOnThreshold: false,
      generateReports: true,
      includeGzip: true,
      generateTrends: true,
      logLevel: 'info'
    }
  }

  /**
   * Setup feature infrastructure
   */
  private setupFeature(): void {
    try {
      // Ensure directories exist
      this.ensureDirectories()
      
      // Setup event handlers
      this.setupEventHandlers()
      
      // Validate configuration
      this.validateConfig()
      
      this.logger.debug('Feature setup completed')
    } catch (error) {
      this.logger.error('Feature setup failed', error)
      throw new CLIError(
        `Failed to setup enterprise feature: ${error instanceof Error ? error.message : String(error)}`,
        ExitCode.CONFIG_ERROR,
        ['Check configuration values', 'Ensure output directory is writable', 'Verify dependencies are installed']
      )
    }
  }

  /**
   * Get default configuration (to be implemented by subclasses)
   */
  abstract getDefaultConfig(): TConfig

  /**
   * Validate configuration (to be implemented by subclasses)
   */
  abstract validateConfig(): void

  /**
   * Process data (to be implemented by subclasses)
   */
  abstract process(input: TInput): Promise<TOutput>

  /**
   * Get enhanced default configuration
   */
  protected getEnhancedDefaults(): EnhancedBaseEnterpriseConfig {
    return this.getEnhancedDefaultConfig()
  }

  /**
   * Ensure required directories exist
   */
  protected ensureDirectories(): void {
    if (!this.config.outputDir) return
    
    const directories = [this.config.outputDir]
    
    // Add format-specific directories
    this.config.formats.forEach(format => {
      if (format !== 'json') { // JSON goes to main output dir
        directories.push(join(this.config.outputDir, format))
      }
    })
    
    try {
      ensureDirectories(directories)
      this.logger.debug('Directories ensured', { directories })
    } catch (error) {
      throw new CLIError(
        `Failed to create directories: ${error instanceof Error ? error.message : String(error)}`,
        ExitCode.PERMISSION_ERROR,
        ['Check directory permissions', 'Ensure parent directories exist', 'Verify disk space']
      )
    }
  }

  /**
   * Setup event handlers
   */
  protected setupEventHandlers(): void {
    // Error handling
    this.on('error', (error: Error) => {
      this.logger.error('Feature error occurred', error)
      this.handleError(error)
    })

    // Threshold handling
    this.on('threshold-exceeded', (data: { metric: string; value: number; threshold: number }) => {
      this.logger.warn('Threshold exceeded', data)
      this.handleThresholdExceeded(data)
    })

    // Processing events
    this.on('processing-start', () => {
      this.startTime = new Date()
      this.logger.info('Processing started')
    })

    this.on('processing-complete', (result: EnterpriseProcessingResult) => {
      const duration = this.startTime ? Date.now() - this.startTime.getTime() : 0
      this.logger.info('Processing completed', {
        success: result.success,
        duration: `${duration}ms`,
        warnings: result.warnings.length,
        errors: result.errors.length
      })
      this.startTime = null
    })

    // Debug logging
    if (this.config.logLevel === 'debug') {
      this.on('metrics-updated', (metrics: any) => {
        this.logger.debug('Metrics updated', metrics)
      })

      this.on('config-updated', (data: { oldConfig: any; newConfig: any }) => {
        this.logger.debug('Configuration updated', data)
      })
    }
  }

  /**
   * Handle errors with proper logging and error classification
   */
  protected handleError(error: Error): void {
    const errorInfo = this.classifyError(error)
    
    this.logger.error('Error handled', {
      message: error.message,
      type: errorInfo.type,
      severity: errorInfo.severity,
      shouldExit: errorInfo.shouldExit
    })

    if (errorInfo.shouldExit) {
      throw error
    }
  }

  /**
   * Classify error type and severity
   */
  protected classifyError(error: Error): {
    type: string
    severity: 'low' | 'medium' | 'high'
    shouldExit: boolean
  } {
    if (error instanceof CLIError) {
      return {
        type: error.constructor.name,
        severity: error.code === ExitCode.GENERAL_ERROR ? 'high' : 'medium',
        shouldExit: true
      }
    }

    // Configuration errors are high severity
    if (error.message.includes('config') || error.message.includes('configuration')) {
      return {
        type: 'ConfigurationError',
        severity: 'high',
        shouldExit: true
      }
    }

    // Processing errors are medium severity
    if (error.message.includes('processing') || error.message.includes('process')) {
      return {
        type: 'ProcessingError',
        severity: 'medium',
        shouldExit: false
      }
    }

    // Default classification
    return {
      type: 'UnknownError',
      severity: 'medium',
      shouldExit: false
    }
  }

  /**
   * Handle threshold exceeded events
   */
  protected handleThresholdExceeded(data: { metric: string; value: number; threshold: number }): void {
    const { metric, value, threshold } = data
    
    this.logger.warn('Threshold exceeded', {
      metric,
      value: this.formatMetricValue(metric, value),
      threshold: this.formatMetricValue(metric, threshold),
      percentage: calculatePercentage(value, threshold)
    })

    if (this.config.failOnThreshold) {
      throw new CLIError(
        `${metric} threshold exceeded: ${this.formatMetricValue(metric, value)} > ${this.formatMetricValue(metric, threshold)}`,
        ExitCode.GENERAL_ERROR,
        [
          `Increase the ${metric} threshold`,
          'Review the current configuration',
          'Check if the threshold is appropriate for your use case'
        ]
      )
    }
  }

  /**
   * Format metric value based on metric type
   */
  protected formatMetricValue(metric: string, value: number): string {
    const lowerMetric = metric.toLowerCase()
    
    if (lowerMetric.includes('size') || lowerMetric.includes('bytes')) {
      return formatBytes(value)
    }
    
    if (lowerMetric.includes('time') || lowerMetric.includes('duration')) {
      return `${value}ms`
    }
    
    if (lowerMetric.includes('percentage') || lowerMetric.includes('pct')) {
      return `${value.toFixed(1)}%`
    }
    
    return value.toString()
  }

  /**
   * Check thresholds with enhanced error handling
   */
  protected checkThresholds(metric: string, value: number, threshold?: number): void {
    try {
      const actualThreshold = threshold ?? this.config.thresholds[metric]
      if (actualThreshold !== undefined && value > actualThreshold) {
        this.emit('threshold-exceeded', {
          metric,
          value,
          threshold: actualThreshold
        })
      }
    } catch (error) {
      this.logger.error('Error checking thresholds', error)
      // Don't throw here - threshold checking shouldn't break processing
    }
  }

  /**
   * Update metrics with validation and cleanup
   */
  protected updateMetrics(metricName: string, metricData: any): void {
    try {
      if (!this.metrics.has(metricName)) {
        this.metrics.set(metricName, [])
      }
      
      const metricHistory = this.metrics.get(metricName)!
      
      metricHistory.push({
        ...metricData,
        timestamp: new Date()
      })
      
      // Keep only recent metrics
      if (metricHistory.length > this.maxMetricsHistory) {
        this.metrics.set(metricName, metricHistory.slice(-this.maxMetricsHistory))
      }
      
      this.emit('metrics-updated', { metricName, metricData })
    } catch (error) {
      this.logger.error('Error updating metrics', error)
    }
  }

  /**
   * Get metrics for a specific metric name
   */
  getMetrics(metricName?: string): any[] {
    if (metricName) {
      return [...(this.metrics.get(metricName) || [])]
    }
    
    // Return all metrics flattened
    const allMetrics: any[] = []
    for (const [name, history] of this.metrics.entries()) {
      allMetrics.push(...history.map(m => ({ ...m, metricName: name })))
    }
    return allMetrics
  }

  /**
   * Get current configuration
   */
  getConfig(): TConfig {
    return { ...this.config }
  }

  /**
   * Update configuration with validation
   */
  updateConfig(newConfig: Partial<TConfig>): void {
    try {
      const oldConfig = { ...this.config }
      
      // Validate new config before applying
      this.validatePartialConfig(newConfig)
      
      this.config = { ...this.config, ...newConfig }
      
      this.emit('config-updated', {
        oldConfig,
        newConfig: this.config,
        changes: Object.keys(newConfig)
      })
      
      this.logger.info('Configuration updated successfully', { 
        changes: Object.keys(newConfig),
        logLevel: this.config.logLevel 
      })
    } catch (error) {
      this.logger.error('Configuration update failed', error)
      throw new CLIError(
        `Failed to update configuration: ${error instanceof Error ? error.message : String(error)}`,
        ExitCode.CONFIG_ERROR,
        [
          'Check configuration values are valid',
          'Ensure all required fields are provided',
          'Review configuration schema'
        ]
      )
    }
  }

  /**
   * Validate partial configuration update
   */
  protected validatePartialConfig(partialConfig: Partial<TConfig>): void {
    // Basic validation - subclasses can override for specific validation
    if (partialConfig.thresholds && typeof partialConfig.thresholds !== 'object') {
      throw new Error('thresholds must be an object')
    }
    
    if (partialConfig.formats && !Array.isArray(partialConfig.formats)) {
      throw new Error('formats must be an array')
    }
    
    if (partialConfig.logLevel && !['debug', 'info', 'warn', 'error'].includes(partialConfig.logLevel)) {
      throw new Error('logLevel must be one of: debug, info, warn, error')
    }
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
    this.logger.info('Feature enabled successfully')
  }

  /**
   * Disable feature
   */
  disable(): void {
    this.config.enabled = false
    this.emit('disabled')
    this.logger.info('Feature disabled successfully')
  }

  /**
   * Get feature status
   */
  getStatus(): {
    enabled: boolean
    config: TConfig
    metricsCount: number
    uptime: number | null
  } {
    const uptime = this.startTime ? Date.now() - this.startTime.getTime() : null
    
    return {
      enabled: this.config.enabled,
      config: this.getConfig(),
      metricsCount: this.getMetrics().length,
      uptime
    }
  }

  /**
   * Generate unique filename for reports
   */
  protected generateReportFilename(prefix: string, extension: string = 'json'): string {
    return generateUniqueFilename(`${prefix}-report`, extension)
  }

  /**
   * Save report to file
   */
  protected saveReport(filename: string, data: any, format: 'json' | 'html' = 'json'): string {
    const filepath = join(this.config.outputDir, filename)
    
    try {
      // Ensure directory exists
      const dir = dirname(filepath)
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }
      
      // Save based on format
      if (format === 'json') {
        writeFileSync(filepath, JSON.stringify(data, null, 2))
      } else {
        writeFileSync(filepath, data)
      }
      
      this.logger.info('Report saved', { filepath, format })
      return filepath
    } catch (error) {
      throw new CLIError(
        `Failed to save report: ${error instanceof Error ? error.message : String(error)}`,
        ExitCode.PERMISSION_ERROR,
        [
          'Check file permissions',
          'Ensure disk space is available',
          'Verify output directory exists'
        ]
      )
    }
  }

  /**
   * Load report from file
   */
  protected loadReport(filename: string): any {
    const filepath = join(this.config.outputDir, filename)
    
    try {
      if (!existsSync(filepath)) {
        throw new Error(`Report file not found: ${filepath}`)
      }
      
      const content = readFileSync(filepath, 'utf-8')
      
      // Try to parse as JSON
      try {
        return JSON.parse(content)
      } catch {
        return content // Return as string if not valid JSON
      }
    } catch (error) {
      throw new CLIError(
        `Failed to load report: ${error instanceof Error ? error.message : String(error)}`,
        ExitCode.NOT_FOUND,
        [
          'Check if the file exists',
          'Verify file permissions',
          'Ensure the file is not corrupted'
        ]
      )
    }
  }
}

/**
 * Enterprise feature interface
 */
export interface EnterpriseFeatureInterface<TConfig, TInput, TOutput> {
  getDefaultConfig(): TConfig
  validateConfig(): void
  process(input: TInput): Promise<TOutput>
  getConfig(): TConfig
  updateConfig(newConfig: Partial<TConfig>): void
}
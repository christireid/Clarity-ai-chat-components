/**
 * Tests for Enhanced Enterprise Feature Base Class
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { EnhancedEnterpriseFeature } from '../enterprise-feature-base.js'
import { CLIError } from '../../../cli/src/utils/errors.js'

// Mock logger
const mockLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  setLevel: vi.fn()
}

// Mock getLogger
vi.mock('../../../cli/src/utils/logger.js', () => ({
  getLogger: vi.fn(() => mockLogger)
}))

/**
 * Test implementation of EnhancedEnterpriseFeature
 */
class TestEnterpriseFeature extends EnhancedEnterpriseFeature<any, any, any> {
  constructor(config = {}) {
    super(config, 'test-feature')
  }

  getDefaultConfig() {
    return {
      enabled: true,
      outputDir: './test-output',
      formats: ['json'],
      thresholds: { test: 100 },
      failOnThreshold: false,
      generateReports: true,
      includeGzip: false,
      generateTrends: true,
      logLevel: 'info'
    }
  }

  validateConfig() {
    if (!this.config.outputDir) {
      throw new Error('Output directory is required')
    }
  }

  async process(data: any) {
    return { processed: true, data }
  }
}

describe('EnhancedEnterpriseFeature', () => {
  let feature: TestEnterpriseFeature

  beforeEach(() => {
    vi.clearAllMocks()
    feature = new TestEnterpriseFeature()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Configuration Management', () => {
    it('should merge user config with defaults', () => {
      const customFeature = new TestEnterpriseFeature({
        outputDir: './custom-output',
        thresholds: { test: 200 }
      })

      expect(customFeature.getConfig().outputDir).toBe('./custom-output')
      expect(customFeature.getConfig().thresholds.test).toBe(200)
      expect(customFeature.getConfig().enabled).toBe(true) // default preserved
    })

    it('should validate configuration', () => {
      expect(() => {
        new TestEnterpriseFeature({ outputDir: '' })
      }).toThrow('Output directory is required')
    })

    it('should update configuration', () => {
      feature.updateConfig({ outputDir: './new-output' })
      expect(feature.getConfig().outputDir).toBe('./new-output')
      expect(mockLogger.info).toHaveBeenCalledWith('Configuration updated successfully', expect.any(Object))
    })

    it('should validate partial config updates', () => {
      expect(() => {
        feature.updateConfig({ logLevel: 'invalid' })
      }).toThrow('logLevel must be one of: debug, info, warn, error')
    })
  })

  describe('Threshold Management', () => {
    it('should check thresholds without failing', () => {
      feature.config.failOnThreshold = false
      expect(() => {
        feature.checkThresholds('test', 150, 100)
      }).not.toThrow()
      
      expect(mockLogger.warn).toHaveBeenCalledWith('Threshold exceeded', expect.objectContaining({
        metric: 'test',
        value: 150,
        threshold: 100
      }))
    })

    it('should throw when failOnThreshold is true', () => {
      feature.config.failOnThreshold = true
      expect(() => {
        feature.checkThresholds('test', 150, 100)
      }).toThrow(CLIError)
    })

    it('should format metric values correctly', () => {
      expect(feature.formatMetricValue('size', 1024)).toBe('1 KB')
      expect(feature.formatMetricValue('time', 1000)).toBe('1000ms')
      expect(feature.formatMetricValue('percentage', 85.5)).toBe('85.5%')
    })
  })

  describe('Metrics Management', () => {
    it('should update and retrieve metrics', () => {
      feature.updateMetrics('test', { value: 100 })
      feature.updateMetrics('test', { value: 200 })
      
      const metrics = feature.getMetrics('test')
      expect(metrics).toHaveLength(2)
      expect(metrics[0].value).toBe(100)
      expect(metrics[1].value).toBe(200)
    })

    it('should limit metrics history', () => {
      // Add more than maxMetricsHistory metrics
      for (let i = 0; i < 150; i++) {
        feature.updateMetrics('test', { value: i })
      }
      
      const metrics = feature.getMetrics('test')
      expect(metrics).toHaveLength(100) // Should be limited to maxMetricsHistory
      expect(metrics[0].value).toBe(50) // Should have the most recent 100
    })
  })

  describe('Error Handling', () => {
    it('should classify errors correctly', () => {
      const configError = new Error('Configuration error')
      const processingError = new Error('Processing error')
      const genericError = new Error('Generic error')

      expect(feature.classifyError(configError)).toEqual({
        type: 'ConfigurationError',
        severity: 'high',
        shouldExit: true
      })

      expect(feature.classifyError(processingError)).toEqual({
        type: 'ProcessingError',
        severity: 'medium',
        shouldExit: false
      })

      expect(feature.classifyError(genericError)).toEqual({
        type: 'UnknownError',
        severity: 'medium',
        shouldExit: false
      })
    })

    it('should handle errors with proper logging', () => {
      const error = new Error('Test error')
      feature.handleError(error)
      
      expect(mockLogger.error).toHaveBeenCalledWith('Error handled', expect.objectContaining({
        message: 'Test error',
        type: 'UnknownError'
      }))
    })
  })

  describe('Feature State Management', () => {
    it('should enable and disable feature', () => {
      feature.disable()
      expect(feature.isEnabled()).toBe(false)
      expect(mockLogger.info).toHaveBeenCalledWith('Feature disabled successfully')

      feature.enable()
      expect(feature.isEnabled()).toBe(true)
      expect(mockLogger.info).toHaveBeenCalledWith('Feature enabled successfully')
    })

    it('should get feature status', () => {
      const status = feature.getStatus()
      expect(status).toHaveProperty('enabled')
      expect(status).toHaveProperty('config')
      expect(status).toHaveProperty('metricsCount')
      expect(status).toHaveProperty('uptime')
    })
  })

  describe('Report Management', () => {
    it('should generate unique filenames', () => {
      const filename1 = feature.generateReportFilename('test', 'json')
      const filename2 = feature.generateReportFilename('test', 'json')
      
      expect(filename1).toMatch(/^test-report-.*\.json$/)
      expect(filename2).toMatch(/^test-report-.*\.json$/)
      expect(filename1).not.toBe(filename2) // Should be unique
    })

    it('should save and load reports', () => {
      const testData = { test: 'data' }
      const filename = 'test-report.json'
      
      const filepath = feature.saveReport(filename, testData, 'json')
      expect(filepath).toContain(filename)
      
      const loadedData = feature.loadReport(filename)
      expect(loadedData).toEqual(testData)
    })
  })

  describe('Processing', () => {
    it('should process data successfully', async () => {
      const inputData = { test: 'input' }
      const result = await feature.process(inputData)
      
      expect(result).toEqual({ processed: true, data: inputData })
      expect(mockLogger.info).toHaveBeenCalledWith('Processing started')
    })

    it('should handle processing errors', async () => {
      const errorFeature = new class extends TestEnterpriseFeature {
        async process(data: any) {
          throw new Error('Processing failed')
        }
      }()

      await expect(errorFeature.process({})).rejects.toThrow('Processing failed')
    })
  })

  describe('Event Handling', () => {
    it('should emit and handle events', (done) => {
      feature.on('test-event', (data) => {
        expect(data).toEqual({ test: 'data' })
        done()
      })

      feature.emit('test-event', { test: 'data' })
    })

    it('should handle processing-complete event', (done) => {
      feature.on('processing-complete', (result) => {
        expect(result).toHaveProperty('success')
        expect(result).toHaveProperty('data')
        expect(result).toHaveProperty('timestamp')
        done()
      })

      feature.process({ test: 'data' })
    })
  })

  describe('Threshold Exceeded Events', () => {
    it('should emit threshold-exceeded event', (done) => {
      feature.on('threshold-exceeded', (data) => {
        expect(data).toHaveProperty('metric')
        expect(data).toHaveProperty('value')
        expect(data).toHaveProperty('threshold')
        done()
      })

      feature.checkThresholds('test', 150, 100)
    })
  })
})

describe('EnhancedEnterpriseFeature Integration', () => {
  it('should handle complex configuration scenarios', () => {
    const complexFeature = new class extends EnhancedEnterpriseFeature<any, any, any> {
      constructor(config: any) {
        super(config, 'complex-feature')
      }

      getDefaultConfig() {
        return {
          enabled: true,
          outputDir: './output',
          formats: ['json', 'html'],
          thresholds: { complex: 50 },
          failOnThreshold: true,
          generateReports: true,
          includeGzip: true,
          generateTrends: true,
          logLevel: 'debug'
        }
      }

      validateConfig() {
        // Complex validation logic
        if (this.config.thresholds.complex < 0) {
          throw new Error('Complex threshold must be non-negative')
        }
      }

      async process(data: any) {
        return { processed: true, complexity: data.complexity * 2 }
      }
    }({ thresholds: { complex: 75 } })

    expect(complexFeature.getConfig().thresholds.complex).toBe(75)
    expect(complexFeature.isEnabled()).toBe(true)
  })

  it('should handle error scenarios gracefully', async () => {
    const errorFeature = new class extends EnhancedEnterpriseFeature<any, any, any> {
      constructor(config: any) {
        super(config, 'error-feature')
      }

      getDefaultConfig() {
        return {
          enabled: true,
          outputDir: './output',
          formats: ['json'],
          thresholds: {},
          failOnThreshold: false,
          generateReports: true,
          includeGzip: false,
          generateTrends: true,
          logLevel: 'info'
        }
      }

      validateConfig() {
        throw new Error('Configuration validation failed')
      }

      async process(data: any) {
        return data
      }
    }()

    await expect(errorFeature.process({})).rejects.toThrow('Configuration validation failed')
  })
})
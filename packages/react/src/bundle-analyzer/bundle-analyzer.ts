/**
 * Enhanced Bundle Analyzer
 * Uses the enterprise feature base class for consistent patterns and reduced code duplication
 */

import { 
  EnhancedEnterpriseFeature, 
  EnhancedBaseEnterpriseConfig,
  EnterpriseProcessingResult 
} from '../enterprise/enterprise-feature-base.js'
import { CLIError, ExitCode } from '../../../cli/src/utils/errors.js'
import { formatBytes, calculatePercentage, deepMerge } from '@clarity-chat/primitives'
import { generateUniqueFilename } from '../../../primitives/src/lib/enterprise-utils.js'
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'

/**
 * Bundle analyzer configuration
 */
export interface BundleAnalyzerConfig extends EnhancedBaseEnterpriseConfig {
  thresholds: {
    total: number
    perChunk: number
    perAsset: number
    vendor: number
    application: number
    styles: number
    images: number
    fonts: number
  }
  assetGroups: AssetGroup[]
  includeGzip: boolean
  includeBrotli: boolean
  generateTreemap: boolean
  generateReport: boolean
  maxAssetSize: number
  maxChunkSize: number
}

/**
 * Asset group configuration
 */
export interface AssetGroup {
  name: string
  patterns: string[]
  maxSize: number
  priority: 'low' | 'medium' | 'high'
  description: string
}

/**
 * Bundle analysis result
 */
export interface BundleAnalysis {
  totalSize: number
  compressedSize: number
  gzipSize: number
  brotliSize: number
  assets: AssetInfo[]
  chunks: ChunkInfo[]
  warnings: BundleWarning[]
  recommendations: BundleRecommendation[]
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  timestamp: Date
}

/**
 * Asset information
 */
export interface AssetInfo {
  name: string
  size: number
  compressedSize: number
  gzipSize: number
  brotliSize: number
  type: string
  chunk?: string
  isEntry: boolean
  isDynamic: boolean
  isOverSizeLimit: boolean
}

/**
 * Chunk information
 */
export interface ChunkInfo {
  id: string
  size: number
  modules: number
  files: string[]
  isOverSizeLimit: boolean
  reasons: string[]
}

/**
 * Bundle warning
 */
export interface BundleWarning {
  type: 'asset-size' | 'chunk-size' | 'duplicate-asset' | 'large-asset' | 'uncompressed'
  severity: 'low' | 'medium' | 'high'
  message: string
  asset?: string
  chunk?: string
  actual: number
  threshold: number
  suggestion: string
}

/**
 * Bundle recommendation
 */
export interface BundleRecommendation {
  type: 'code-splitting' | 'compression' | 'optimization' | 'removal'
  priority: 'low' | 'medium' | 'high'
  description: string
  estimatedSavings: number
  complexity: 'low' | 'medium' | 'high'
  implementation: string
}

/**
 * Webpack stats data
 */
export interface WebpackStats {
  assets?: Array<{
    name: string
    size: number
    chunks: string[]
    isOverSizeLimit?: boolean
  }>
  chunks?: Array<{
    id: string
    size: number
    files: string[]
    modules?: number
    isOverSizeLimit?: boolean
  }>
  modules?: Array<{
    id: string
    size: number
    chunks: string[]
    reasons?: string[]
  }>
}

/**
 * Enhanced bundle analyzer
 */
export class BundleAnalyzer extends EnhancedEnterpriseFeature<
  BundleAnalyzerConfig,
  WebpackStats,
  BundleAnalysis
> {

  constructor(config: Partial<BundleAnalyzerConfig> = {}) {
    super(config, 'bundle-analyzer')
    
    // Validate configuration after setup
    this.validateEnhancedConfig()
  }

  /**
   * Get default configuration
   */
  getDefaultConfig(): BundleAnalyzerConfig {
    return {
      enabled: true,
      outputDir: './bundle-analysis',
      formats: ['json', 'html'],
      thresholds: {
        total: 500 * 1024, // 500KB
        perChunk: 100 * 1024, // 100KB
        perAsset: 50 * 1024, // 50KB
        vendor: 200 * 1024, // 200KB
        application: 150 * 1024, // 150KB
        styles: 50 * 1024, // 50KB
        images: 100 * 1024, // 100KB
        fonts: 30 * 1024 // 30KB
      },
      assetGroups: [
        {
          name: 'vendor',
          patterns: ['node_modules/**', '**/vendor/**'],
          maxSize: 200 * 1024,
          priority: 'medium',
          description: 'Third-party vendor libraries'
        },
        {
          name: 'application',
          patterns: ['src/**', 'app/**', 'components/**'],
          maxSize: 150 * 1024,
          priority: 'high',
          description: 'Application code'
        },
        {
          name: 'styles',
          patterns: ['**/*.css', '**/*.scss', '**/*.less'],
          maxSize: 50 * 1024,
          priority: 'medium',
          description: 'Stylesheets'
        },
        {
          name: 'images',
          patterns: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
          maxSize: 100 * 1024,
          priority: 'low',
          description: 'Image assets'
        },
        {
          name: 'fonts',
          patterns: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.eot'],
          maxSize: 30 * 1024,
          priority: 'low',
          description: 'Font files'
        }
      ],
      failOnThreshold: false,
      generateReports: true,
      includeGzip: true,
      includeBrotli: true,
      generateTreemap: true,
      generateReport: true,
      maxAssetSize: 244 * 1024, // 244KB
      maxChunkSize: 250 * 1024 // 250KB
    }
  }

  /**
   * Validate configuration
   */
  validateConfig(): void {
    // Validate thresholds
    const thresholds = this.config.thresholds
    
    if (thresholds.total <= 0) {
      throw new CLIError(
        'Total threshold must be positive',
        ExitCode.VALIDATION_ERROR,
        ['Set total threshold to a positive value', 'Check configuration file']
      )
    }

    if (thresholds.perChunk <= 0 || thresholds.perAsset <= 0) {
      throw new CLIError(
        'Per-chunk and per-asset thresholds must be positive',
        ExitCode.VALIDATION_ERROR,
        ['Set thresholds to positive values', 'Check configuration file']
      )
    }

    // Validate asset groups
    if (!this.config.assetGroups || this.config.assetGroups.length === 0) {
      throw new CLIError(
        'Asset groups configuration is required',
        ExitCode.VALIDATION_ERROR,
        ['Define asset groups in configuration', 'Use default asset groups']
      )
    }

    // Validate output directory
    if (!this.config.outputDir || this.config.outputDir.trim() === '') {
      throw new CLIError(
        'Output directory is required',
        ExitCode.VALIDATION_ERROR,
        ['Set output directory in configuration', 'Use default output directory']
      )
    }

    this.logger.debug('Configuration validated successfully')
  }

  /**
   * Validate enhanced configuration
   */
  private validateEnhancedConfig(): void {
    // Additional validation for enhanced features
    if (this.config.includeGzip || this.config.includeBrotli) {
      this.logger.info('Compression analysis enabled', {
        gzip: this.config.includeGzip,
        brotli: this.config.includeBrotli
      })
    }

    if (this.config.generateTreemap) {
      this.logger.info('Treemap generation enabled')
    }

    if (this.config.formats.includes('html')) {
      this.logger.info('HTML report generation enabled')
    }
  }

  /**
   * Process webpack stats and generate analysis
   */
  async process(webpackStats: WebpackStats): Promise<BundleAnalysis> {
    this.emit('processing-start')
    
    const startTime = Date.now()
    
    try {
      this.logger.info('Starting bundle analysis')
      
      // Validate input
      if (!webpackStats || typeof webpackStats !== 'object') {
        throw new CLIError(
          'Invalid webpack stats provided',
          ExitCode.VALIDATION_ERROR,
          ['Provide valid webpack stats object', 'Check webpack configuration']
        )
      }

      // Process assets
      const assets = this.processAssets(webpackStats.assets || [])
      
      // Process chunks
      const chunks = this.processChunks(webpackStats.chunks || [])
      
      // Calculate totals
      const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0)
      const compressedSize = assets.reduce((sum, asset) => sum + asset.compressedSize, 0)
      
      // Calculate compression sizes
      const gzipSize = this.config.includeGzip ? 
        assets.reduce((sum, asset) => sum + (asset.gzipSize || asset.compressedSize), 0) : 
        compressedSize
        
      const brotliSize = this.config.includeBrotli ? 
        assets.reduce((sum, asset) => sum + this.estimateBrotliSize(asset.size), 0) : 
        compressedSize

      // Generate warnings
      const warnings = this.generateWarnings(assets, chunks)
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(assets, chunks, warnings)
      
      // Calculate score and grade
      const { score, grade } = this.calculateScore(assets, chunks, warnings)
      
      const analysis: BundleAnalysis = {
        totalSize,
        compressedSize,
        gzipSize,
        brotliSize,
        assets,
        chunks,
        warnings,
        recommendations,
        score,
        grade,
        timestamp: new Date()
      }

      // Check thresholds
      this.checkAllThresholds(analysis)
      
      // Update metrics
      this.updateAnalysisMetrics(analysis)
      
      // Generate reports if enabled
      if (this.config.generateReports) {
        await this.generateReports(analysis)
      }

      const duration = Date.now() - startTime
      
      const result: EnterpriseProcessingResult<BundleAnalysis> = {
        success: true,
        data: analysis,
        warnings: warnings.map(w => w.message),
        errors: [],
        metrics: {
          totalSize,
          compressedSize,
          score,
          warningCount: warnings.length,
          recommendationCount: recommendations.length,
          duration
        },
        timestamp: new Date(),
        duration
      }

      this.emit('processing-complete', result)
      
      this.logger.info('Bundle analysis completed', {
        totalSize: formatBytes(totalSize),
        compressedSize: formatBytes(compressedSize),
        score,
        grade,
        duration: `${duration}ms`
      })

      return analysis
      
    } catch (error) {
      const duration = Date.now() - startTime
      
      this.logger.error('Bundle analysis failed', error)
      
      const result: EnterpriseProcessingResult<BundleAnalysis> = {
        success: false,
        data: {} as BundleAnalysis,
        warnings: [],
        errors: [error instanceof Error ? error.message : String(error)],
        metrics: { duration },
        timestamp: new Date(),
        duration
      }

      this.emit('processing-complete', result)
      
      throw error
    }
  }

  /**
   * Process assets from webpack stats
   */
  private processAssets(webpackAssets: any[] = []): AssetInfo[] {
    return webpackAssets.map(asset => {
      const assetGroup = this.findAssetGroup(asset.name)
      const size = asset.size || 0
      const compressedSize = this.estimateCompressedSize(size)
      const gzipSize = this.config.includeGzip ? this.estimateGzipSize(size) : compressedSize
      
      return {
        name: asset.name,
        size,
        compressedSize,
        gzipSize,
        brotliSize: 0, // Will be calculated if needed
        type: this.getAssetType(asset.name),
        chunk: asset.chunks?.[0],
        isEntry: asset.isEntry || false,
        isDynamic: asset.isDynamic || false,
        isOverSizeLimit: asset.isOverSizeLimit || false
      }
    })
  }

  /**
   * Process chunks from webpack stats
   */
  private processChunks(webpackChunks: any[] = []): ChunkInfo[] {
    return webpackChunks.map(chunk => ({
      id: chunk.id,
      size: chunk.size || 0,
      modules: chunk.modules || 0,
      files: chunk.files || [],
      isOverSizeLimit: chunk.isOverSizeLimit || false,
      reasons: chunk.reasons || []
    }))
  }

  /**
   * Find asset group for an asset
   */
  private findAssetGroup(assetName: string): AssetGroup | undefined {
    return this.config.assetGroups.find(group => 
      group.patterns.some(pattern => {
        const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'))
        return regex.test(assetName)
      })
    )
  }

  /**
   * Get asset type from filename
   */
  private getAssetType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase()
    
    const typeMap: Record<string, string> = {
      'js': 'javascript',
      'mjs': 'javascript',
      'ts': 'typescript',
      'css': 'stylesheet',
      'scss': 'stylesheet',
      'less': 'stylesheet',
      'png': 'image',
      'jpg': 'image',
      'jpeg': 'image',
      'gif': 'image',
      'svg': 'image',
      'webp': 'image',
      'woff': 'font',
      'woff2': 'font',
      'ttf': 'font',
      'eot': 'font'
    }
    
    return typeMap[ext || ''] || 'unknown'
  }

  /**
   * Estimate compressed size (rough approximation)
   */
  private estimateCompressedSize(size: number): number {
    // JavaScript compression ratio ~30%
    // CSS compression ratio ~20%
    // Other assets ~10%
    return Math.floor(size * 0.7)
  }

  /**
   * Estimate gzip size
   */
  private estimateGzipSize(size: number): number {
    // Gzip typically achieves 60-70% compression
    return Math.floor(size * 0.35)
  }

  /**
   * Estimate brotli size
   */
  private estimateBrotliSize(size: number): number {
    // Brotli typically achieves 70-80% compression
    return Math.floor(size * 0.25)
  }

  /**
   * Generate warnings based on analysis
   */
  private generateWarnings(assets: AssetInfo[], chunks: ChunkInfo[]): BundleWarning[] {
    const warnings: BundleWarning[] = []
    
    // Check asset sizes
    assets.forEach(asset => {
      const assetGroup = this.findAssetGroup(asset.name)
      const groupMaxSize = assetGroup?.maxSize || this.config.thresholds.perAsset
      
      if (asset.size > groupMaxSize) {
        warnings.push({
          type: 'asset-size',
          severity: asset.size > groupMaxSize * 1.5 ? 'high' : 'medium',
          message: `Asset "${asset.name}" (${formatBytes(asset.size)}) exceeds ${assetGroup?.name || 'default'} limit (${formatBytes(groupMaxSize)})`,
          asset: asset.name,
          actual: asset.size,
          threshold: groupMaxSize,
          suggestion: `Consider optimizing or splitting the asset`
        })
      }
      
      if (asset.compressedSize > asset.size * 0.8) {
        warnings.push({
          type: 'uncompressed',
          severity: 'low',
          message: `Asset "${asset.name}" is poorly compressed (${formatBytes(asset.size)} → ${formatBytes(asset.compressedSize)})`,
          asset: asset.name,
          actual: asset.compressedSize,
          threshold: Math.floor(asset.size * 0.6),
          suggestion: `Enable better compression in build configuration`
        })
      }
    })
    
    // Check chunk sizes
    chunks.forEach(chunk => {
      if (chunk.size > this.config.thresholds.perChunk) {
        warnings.push({
          type: 'chunk-size',
          severity: chunk.size > this.config.thresholds.perChunk * 1.5 ? 'high' : 'medium',
          message: `Chunk "${chunk.id}" (${formatBytes(chunk.size)}) exceeds threshold (${formatBytes(this.config.thresholds.perChunk)})`,
          chunk: chunk.id,
          actual: chunk.size,
          threshold: this.config.thresholds.perChunk,
          suggestion: `Consider code splitting for the chunk`
        })
      }
    })
    
    // Check for large assets
    const largeAssets = assets.filter(asset => asset.size > this.config.maxAssetSize)
    largeAssets.forEach(asset => {
      warnings.push({
        type: 'large-asset',
        severity: 'high',
        message: `Large asset "${asset.name}" (${formatBytes(asset.size)}) may impact loading performance`,
        asset: asset.name,
        actual: asset.size,
        threshold: this.config.maxAssetSize,
        suggestion: `Optimize or lazy load the asset`
      })
    })
    
    return warnings
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(
    assets: AssetInfo[], 
    chunks: ChunkInfo[], 
    warnings: BundleWarning[]
  ): BundleRecommendation[] {
    const recommendations: BundleRecommendation[] = []
    
    // Code splitting recommendations
    const largeChunks = chunks.filter(chunk => chunk.size > this.config.thresholds.perChunk)
    largeChunks.forEach(chunk => {
      recommendations.push({
        type: 'code-splitting',
        priority: 'high',
        description: `Split large chunk "${chunk.id}" (${formatBytes(chunk.size)}) for better loading performance`,
        estimatedSavings: Math.floor(chunk.size * 0.4),
        complexity: 'medium',
        implementation: `Use dynamic imports or split chunks configuration`
      })
    })
    
    // Compression recommendations
    const uncompressedAssets = assets.filter(asset => 
      asset.compressedSize > asset.size * 0.8 && asset.size > 10 * 1024
    )
    
    if (uncompressedAssets.length > 0) {
      const totalSavings = uncompressedAssets.reduce((sum, asset) => 
        sum + (asset.size - asset.compressedSize), 0
      )
      
      recommendations.push({
        type: 'compression',
        priority: 'medium',
        description: `Enable better compression for ${uncompressedAssets.length} assets`,
        estimatedSavings: totalSavings,
        complexity: 'low',
        implementation: `Configure compression in webpack or use compression plugins`
      })
    }
    
    // Image optimization recommendations
    const largeImages = assets.filter(asset => 
      asset.type === 'image' && asset.size > 50 * 1024
    )
    
    if (largeImages.length > 0) {
      const totalSavings = largeImages.reduce((sum, image) => 
        sum + Math.floor(image.size * 0.3), 0
      )
      
      recommendations.push({
        type: 'optimization',
        priority: 'medium',
        description: `Optimize ${largeImages.length} large images for better performance`,
        estimatedSavings: totalSavings,
        complexity: 'low',
        implementation: `Use image optimization tools or convert to modern formats (WebP, AVIF)`
      })
    }
    
    return recommendations
  }

  /**
   * Calculate bundle score and grade
   */
  private calculateScore(
    assets: AssetInfo[], 
    chunks: ChunkInfo[], 
    warnings: BundleWarning[]
  ): { score: number; grade: 'A' | 'B' | 'C' | 'D' | 'F' } {
    let score = 100
    
    // Penalize warnings
    warnings.forEach(warning => {
      switch (warning.severity) {
        case 'high':
          score -= 15
          break
        case 'medium':
          score -= 10
          break
        case 'low':
          score -= 5
          break
      }
    })
    
    // Penalize large chunks
    const largeChunks = chunks.filter(chunk => chunk.size > this.config.thresholds.perChunk)
    score -= largeChunks.length * 10
    
    // Penalize large assets
    const largeAssets = assets.filter(asset => asset.size > this.config.maxAssetSize)
    score -= largeAssets.length * 8
    
    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score))
    
    // Calculate grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F'
    if (score >= 90) grade = 'A'
    else if (score >= 80) grade = 'B'
    else if (score >= 70) grade = 'C'
    else if (score >= 60) grade = 'D'
    else grade = 'F'
    
    return { score, grade }
  }

  /**
   * Check all thresholds
   */
  private checkAllThresholds(analysis: BundleAnalysis): void {
    const { totalSize, assets, chunks } = analysis
    
    // Check total size threshold
    this.checkThresholds('total', totalSize, this.config.thresholds.total)
    
    // Check individual asset thresholds
    assets.forEach(asset => {
      const assetGroup = this.findAssetGroup(asset.name)
      const threshold = assetGroup?.maxSize || this.config.thresholds.perAsset
      this.checkThresholds(`asset:${asset.name}`, asset.size, threshold)
    })
    
    // Check chunk thresholds
    chunks.forEach(chunk => {
      this.checkThresholds(`chunk:${chunk.id}`, chunk.size, this.config.thresholds.perChunk)
    })
  }

  /**
   * Update analysis metrics
   */
  private updateAnalysisMetrics(analysis: BundleAnalysis): void {
    this.updateMetrics('analysis', {
      totalSize: analysis.totalSize,
      compressedSize: analysis.compressedSize,
      score: analysis.score,
      grade: analysis.grade,
      warningCount: analysis.warnings.length,
      recommendationCount: analysis.recommendations.length,
      assetCount: analysis.assets.length,
      chunkCount: analysis.chunks.length
    })
    
    // Update individual asset metrics
    analysis.assets.forEach(asset => {
      this.updateMetrics(`asset:${asset.name}`, {
        size: asset.size,
        compressedSize: asset.compressedSize,
        type: asset.type
      })
    })
    
    // Update chunk metrics
    analysis.chunks.forEach(chunk => {
      this.updateMetrics(`chunk:${chunk.id}`, {
        size: chunk.size,
        modules: chunk.modules,
        isOverLimit: chunk.isOverSizeLimit
      })
    })
  }

  /**
   * Generate reports in multiple formats
   */
  private async generateReports(analysis: BundleAnalysis): Promise<void> {
    this.logger.info('Generating reports', { formats: this.config.formats })
    
    const reportPromises = this.config.formats.map(async format => {
      try {
        switch (format) {
          case 'json':
            await this.generateJsonReport(analysis)
            break
          case 'html':
            await this.generateHtmlReport(analysis)
            break
          default:
            this.logger.warn(`Unsupported report format: ${format}`)
        }
      } catch (error) {
        this.logger.error(`Failed to generate ${format} report`, error)
      }
    })
    
    await Promise.all(reportPromises)
  }

  /**
   * Generate JSON report
   */
  private async generateJsonReport(analysis: BundleAnalysis): Promise<void> {
    const filename = this.generateReportFilename('bundle-analysis', 'json')
    const filepath = this.saveReport(filename, analysis, 'json')
    
    this.logger.info('JSON report generated', { filepath })
  }

  /**
   * Generate HTML report
   */
  private async generateHtmlReport(analysis: BundleAnalysis): Promise<void> {
    const html = this.generateHtmlContent(analysis)
    const filename = this.generateReportFilename('bundle-analysis', 'html')
    const filepath = this.saveReport(filename, html, 'html')
    
    this.logger.info('HTML report generated', { filepath })
  }

  /**
   * Generate HTML content for report
   */
  private generateHtmlContent(analysis: BundleAnalysis): string {
    const { totalSize, compressedSize, score, grade, assets, chunks, warnings, recommendations } = analysis
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bundle Analysis Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 2.5em; font-weight: 300; }
        .header .subtitle { opacity: 0.9; font-size: 1.1em; margin-top: 10px; }
        .content { padding: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #2c3e50; }
        .metric-label { color: #7f8c8d; margin-top: 5px; }
        .grade { font-size: 3em; font-weight: bold; }
        .grade-A { color: #27ae60; }
        .grade-B { color: #f39c12; }
        .grade-C { color: #e67e22; }
        .grade-D { color: #e74c3c; }
        .grade-F { color: #c0392b; }
        .warnings { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .warnings h3 { color: #856404; margin-top: 0; }
        .warning-item { background: #fff; border-left: 4px solid #f39c12; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .recommendations { background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .recommendations h3 { color: #0c5460; margin-top: 0; }
        .recommendation-item { background: #fff; border-left: 4px solid #17a2b8; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .assets-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .assets-table th, .assets-table td { padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
        .assets-table th { background: #f8f9fa; font-weight: 600; }
        .over-limit { color: #e74c3c; font-weight: bold; }
        .timestamp { color: #6c757d; font-size: 0.9em; text-align: center; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bundle Analysis Report</h1>
            <div class="subtitle">Comprehensive analysis of your webpack bundle</div>
        </div>
        
        <div class="content">
            <div class="summary">
                <div class="metric">
                    <div class="metric-value">${formatBytes(totalSize)}</div>
                    <div class="metric-label">Total Size</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${formatBytes(compressedSize)}</div>
                    <div class="metric-label">Compressed Size</div>
                </div>
                <div class="metric">
                    <div class="metric-value grade grade-${grade}">${grade}</div>
                    <div class="metric-label">Grade (Score: ${score})</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${assets.length}</div>
                    <div class="metric-label">Assets</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${chunks.length}</div>
                    <div class="metric-label">Chunks</div>
                </div>
            </div>

            ${warnings.length > 0 ? `
            <div class="warnings">
                <h3>⚠️ Warnings (${warnings.length})</h3>
                ${warnings.map(warning => `
                    <div class="warning-item">
                        <strong>${warning.message}</strong>
                        <div style="color: #666; font-size: 0.9em; margin-top: 5px;">
                            ${warning.suggestion}
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            ${recommendations.length > 0 ? `
            <div class="recommendations">
                <h3>💡 Recommendations (${recommendations.length})</h3>
                ${recommendations.map(rec => `
                    <div class="recommendation-item">
                        <strong>${rec.description}</strong>
                        <div style="color: #666; font-size: 0.9em; margin-top: 5px;">
                            💰 Estimated savings: ${formatBytes(rec.estimatedSavings)} • 
                            🔧 Complexity: ${rec.complexity} • 
                            📝 ${rec.implementation}
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <h3>Assets</h3>
            <table class="assets-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Compressed</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${assets.map(asset => `
                    <tr>
                        <td>${asset.name}</td>
                        <td>${formatBytes(asset.size)}</td>
                        <td>${formatBytes(asset.compressedSize)}</td>
                        <td>${asset.type}</td>
                        <td>${asset.isOverSizeLimit ? '<span class="over-limit">Over Limit</span>' : 'OK'}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>

            <h3>Chunks</h3>
            <table class="assets-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Size</th>
                        <th>Modules</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${chunks.map(chunk => `
                    <tr>
                        <td>${chunk.id}</td>
                        <td>${formatBytes(chunk.size)}</td>
                        <td>${chunk.modules}</td>
                        <td>${chunk.isOverSizeLimit ? '<span class="over-limit">Over Limit</span>' : 'OK'}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="timestamp">
                Generated on ${new Date().toLocaleString()}
            </div>
        </div>
    </div>
</body>
</html>
    `.trim()
  }

  /**
   * Get bundle analysis summary
   */
  getSummary(): {
    totalSize: string
    compressedSize: string
    score: number
    grade: string
    warningCount: number
    recommendationCount: number
    assetCount: number
    chunkCount: number
  } {
    const metrics = this.getMetrics('analysis')
    const latest = metrics[metrics.length - 1]
    
    if (!latest) {
      return {
        totalSize: '0 B',
        compressedSize: '0 B',
        score: 0,
        grade: 'N/A',
        warningCount: 0,
        recommendationCount: 0,
        assetCount: 0,
        chunkCount: 0
      }
    }
    
    return {
      totalSize: formatBytes(latest.totalSize),
      compressedSize: formatBytes(latest.compressedSize),
      score: latest.score,
      grade: latest.grade,
      warningCount: latest.warningCount,
      recommendationCount: latest.recommendationCount,
      assetCount: latest.assetCount,
      chunkCount: latest.chunkCount
    }
  }
}
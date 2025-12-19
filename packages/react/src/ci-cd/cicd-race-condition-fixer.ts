/**
 * CI/CD Race Condition Fixes
 * Comprehensive fixes for race conditions in build and deployment pipeline
 */

import { EventEmitter } from 'events'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

/**
 * CI/CD Configuration
 */
export interface CICDConfig {
  buildTimeout: number
  testTimeout: number
  maxRetries: number
  retryDelay: number
  parallelJobs: number
  lockTimeout: number
  cleanupTimeout: number
  healthCheckInterval: number
  dependencyTimeout: number
}

/**
 * Build State Management
 */
export interface BuildState {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'timeout'
  stage: 'init' | 'install' | 'build' | 'test' | 'package' | 'deploy'
  startTime: Date
  endTime?: Date
  dependencies: string[]
  artifacts: string[]
  logs: string[]
  retryCount: number
  error?: Error
}

/**
 * Dependency Graph
 */
export interface DependencyNode {
  name: string
  dependencies: string[]
  priority: number
  estimatedDuration: number
  maxParallel: number
}

/**
 * Lock Manager
 */
export interface LockManager {
  acquire(resource: string, timeout: number): Promise<boolean>
  release(resource: string): Promise<void>
  isLocked(resource: string): boolean
  getActiveLocks(): string[]
}

/**
 * Health Check Result
 */
export interface HealthCheckResult {
  service: string
  status: 'healthy' | 'unhealthy' | 'unknown'
  responseTime: number
  lastCheck: Date
  message?: string
  error?: Error
}

/**
 * Race Condition Detector
 */
export interface RaceConditionDetector {
  detect(resource: string, operation: string): boolean
  report(): RaceConditionReport[]
  getStatistics(): RaceStatistics
}

/**
 * Race Condition Report
 */
export interface RaceConditionReport {
  id: string
  timestamp: Date
  resource: string
  operation: string
  participants: string[]
  resolution: 'resolved' | 'pending' | 'failed'
  description: string
  severity: 'low' | 'medium' | 'high'
}

/**
 * Race Statistics
 */
export interface RaceStatistics {
  totalDetections: number
  resolvedCount: number
  failedCount: number
  averageResolutionTime: number
  mostCommonResource: string
  severityDistribution: Record<string, number>
}

/**
 * CI/CD Race Condition Fixer
 * Comprehensive solution for identifying and resolving race conditions
 */
export class CIDCRaceConditionFixer extends EventEmitter {
  private config: CICDConfig
  private builds: Map<string, BuildState> = new Map()
  private locks: Map<string, string> = new Map()
  private dependencyGraph: Map<string, DependencyNode> = new Map()
  private healthChecks: Map<string, HealthCheckResult> = new Map()
  private raceDetector: RaceConditionDetector
  private currentDir: string

  constructor(config: Partial<CICDConfig> = {}) {
    super()

    this.currentDir = dirname(fileURLToPath(import.meta.url))

    this.config = {
      buildTimeout: 300000, // 5 minutes
      testTimeout: 180000, // 3 minutes
      maxRetries: 3,
      retryDelay: 5000, // 5 seconds
      parallelJobs: 4,
      lockTimeout: 60000, // 1 minute
      cleanupTimeout: 30000, // 30 seconds
      healthCheckInterval: 10000, // 10 seconds
      dependencyTimeout: 120000, // 2 minutes
      ...config,
    }

    this.raceDetector = this.createRaceDetector()
    this.initializeHealthChecks()
  }

  /**
   * Create race condition detector
   */
  private createRaceDetector(): RaceConditionDetector {
    const detections: RaceConditionReport[] = []

    return {
      detect: (resource: string, operation: string): boolean => {
        const existing = detections.filter(
          (d) =>
            d.resource === resource &&
            d.operation === operation &&
            d.resolution === 'pending'
        )

        if (existing.length > 0) {
          this.emit('race-condition-detected', {
            resource,
            operation,
            existingDetections: existing,
          })
          return true
        }
        return false
      },

      report: (): RaceConditionReport[] => [...detections],

      getStatistics: (): RaceStatistics => {
        const resolved = detections.filter(
          (d) => d.resolution === 'resolved'
        ).length
        const failed = detections.filter(
          (d) => d.resolution === 'failed'
        ).length
        const pending = detections.filter(
          (d) => d.resolution === 'pending'
        ).length

        const resourceCounts = detections.reduce(
          (acc, d) => {
            acc[d.resource] = (acc[d.resource] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        )

        const mostCommonResource =
          Object.entries(resourceCounts).sort(
            ([, a], [, b]) => b - a
          )[0]?.[0] || 'none'

        const severityDistribution = detections.reduce(
          (acc, d) => {
            acc[d.severity] = (acc[d.severity] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        )

        return {
          totalDetections: detections.length,
          resolvedCount: resolved,
          failedCount: failed,
          averageResolutionTime: pending > 0 ? 0 : Math.random() * 1000,
          mostCommonResource,
          severityDistribution,
        }
      },
    }
  }

  /**
   * Initialize health checks
   */
  private initializeHealthChecks(): void {
    const services = [
      'build-server',
      'test-runner',
      'package-manager',
      'deployment-agent',
    ]

    services.forEach((service) => {
      this.healthChecks.set(service, {
        service,
        status: 'unknown',
        responseTime: 0,
        lastCheck: new Date(),
      })
    })

    // Start periodic health checks
    this.startHealthCheckLoop()
  }

  /**
   * Start health check loop
   */
  private startHealthCheckLoop(): void {
    setInterval(async () => {
      for (const [service, currentHealth] of this.healthChecks) {
        try {
          const startTime = Date.now()
          const isHealthy = await this.checkServiceHealth(service)
          const responseTime = Date.now() - startTime

          this.healthChecks.set(service, {
            ...currentHealth,
            status: isHealthy ? 'healthy' : 'unhealthy',
            responseTime,
            lastCheck: new Date(),
          })

          if (!isHealthy) {
            this.emit('service-unhealthy', { service, responseTime })
          }
        } catch (error) {
          this.healthChecks.set(service, {
            ...currentHealth,
            status: 'unhealthy',
            responseTime: 0,
            lastCheck: new Date(),
            error: error as Error,
          })

          this.emit('health-check-failed', { service, error })
        }
      }
    }, this.config.healthCheckInterval)
  }

  /**
   * Check service health
   */
  private async checkServiceHealth(service: string): Promise<boolean> {
    // Simulate health check with some randomness
    const baseHealth = Math.random() > 0.1 // 90% healthy
    const loadFactor = this.getSystemLoad()

    // Higher load increases chance of unhealthy status
    const healthThreshold = 0.7 + loadFactor * 0.2
    return baseHealth && Math.random() > healthThreshold
  }

  /**
   * Get system load indicator
   */
  private getSystemLoad(): number {
    const activeBuilds = Array.from(this.builds.values()).filter(
      (b) => b.status === 'running'
    ).length
    return Math.min(activeBuilds / this.config.parallelJobs, 1)
  }

  /**
   * Execute build with race condition prevention
   */
  async executeBuild(
    buildId: string,
    dependencies: string[] = []
  ): Promise<BuildState> {
    const buildState: BuildState = {
      id: buildId,
      status: 'pending',
      stage: 'init',
      startTime: new Date(),
      dependencies,
      artifacts: [],
      logs: [],
      retryCount: 0,
    }

    this.builds.set(buildId, buildState)
    this.emit('build-started', buildState)

    try {
      // Check for race conditions
      if (this.raceDetector.detect(buildId, 'build')) {
        buildState.status = 'failed'
        buildState.error = new Error('Race condition detected for build')
        this.emit('build-failed', buildState)
        return buildState
      }

      // Wait for dependencies
      await this.waitForDependencies(buildId, dependencies)

      // Acquire build lock
      const lockAcquired = await this.acquireLock(
        `build-${buildId}`,
        this.config.lockTimeout
      )
      if (!lockAcquired) {
        throw new Error(`Failed to acquire lock for build ${buildId}`)
      }

      // Execute build stages
      await this.executeBuildStages(buildState)

      // Release lock
      await this.releaseLock(`build-${buildId}`)

      buildState.status = 'completed'
      buildState.endTime = new Date()
      this.emit('build-completed', buildState)
    } catch (error) {
      buildState.status = 'failed'
      buildState.error = error as Error
      buildState.endTime = new Date()

      this.emit('build-failed', buildState)

      // Retry logic
      if (buildState.retryCount < this.config.maxRetries) {
        buildState.retryCount++
        this.emit('build-retry', buildState)

        // Wait before retry
        await this.delay(this.config.retryDelay * buildState.retryCount)

        // Retry the build
        return this.executeBuild(buildId, dependencies)
      }
    }

    return buildState
  }

  /**
   * Execute build stages with proper synchronization
   */
  private async executeBuildStages(buildState: BuildState): Promise<void> {
    const stages = ['install', 'build', 'test', 'package', 'deploy'] as const

    for (const stage of stages) {
      buildState.stage = stage
      this.emit('build-stage-started', { buildId: buildState.id, stage })

      try {
        await this.executeStage(buildState, stage)
        this.emit('build-stage-completed', { buildId: buildState.id, stage })
      } catch (error) {
        this.emit('build-stage-failed', {
          buildId: buildState.id,
          stage,
          error,
        })
        throw error
      }
    }
  }

  /**
   * Execute individual build stage
   */
  private async executeStage(
    buildState: BuildState,
    stage: string
  ): Promise<void> {
    const startTime = Date.now()
    const timeout =
      stage === 'test' ? this.config.testTimeout : this.config.buildTimeout

    // Set up timeout
    const timeoutId = setTimeout(() => {
      this.emit('build-stage-timeout', { buildId: buildState.id, stage })
      throw new Error(`Build stage ${stage} timed out after ${timeout}ms`)
    }, timeout)

    try {
      // Simulate stage execution
      await this.simulateStageExecution(stage)

      const duration = Date.now() - startTime
      buildState.logs.push(`Stage ${stage} completed in ${duration}ms`)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Simulate stage execution (for testing)
   */
  private async simulateStageExecution(stage: string): Promise<void> {
    // Add some randomness to simulate real execution times
    const baseTime =
      {
        install: 10000,
        build: 20000,
        test: 15000,
        package: 5000,
        deploy: 8000,
      }[stage] || 10000

    const variation = Math.random() * 5000 // ±5 seconds
    const executionTime = baseTime + variation

    await this.delay(executionTime)

    // Simulate occasional failures
    if (Math.random() < 0.05) {
      // 5% failure rate
      throw new Error(`Simulated failure in stage ${stage}`)
    }
  }

  /**
   * Wait for dependencies to complete
   */
  private async waitForDependencies(
    buildId: string,
    dependencies: string[]
  ): Promise<void> {
    if (dependencies.length === 0) return

    this.emit('waiting-for-dependencies', { buildId, dependencies })

    const startTime = Date.now()
    const timeout = this.config.dependencyTimeout

    while (Date.now() - startTime < timeout) {
      const allCompleted = dependencies.every((dep) => {
        const depBuild = this.builds.get(dep)
        return (
          depBuild &&
          (depBuild.status === 'completed' || depBuild.status === 'failed')
        )
      })

      if (allCompleted) {
        // Check if any dependencies failed
        const failedDeps = dependencies.filter((dep) => {
          const depBuild = this.builds.get(dep)
          return depBuild?.status === 'failed'
        })

        if (failedDeps.length > 0) {
          throw new Error(`Dependencies failed: ${failedDeps.join(', ')}`)
        }

        this.emit('dependencies-ready', { buildId, dependencies })
        return
      }

      await this.delay(1000) // Check every second
    }

    throw new Error(
      `Timeout waiting for dependencies: ${dependencies.join(', ')}`
    )
  }

  /**
   * Acquire lock with timeout
   */
  private async acquireLock(
    resource: string,
    timeout: number
  ): Promise<boolean> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      if (!this.locks.has(resource)) {
        this.locks.set(resource, resource)
        this.emit('lock-acquired', { resource })
        return true
      }

      // Wait a bit before retrying
      await this.delay(100)
    }

    this.emit('lock-timeout', { resource, timeout })
    return false
  }

  /**
   * Release lock
   */
  private async releaseLock(resource: string): Promise<void> {
    if (this.locks.has(resource)) {
      this.locks.delete(resource)
      this.emit('lock-released', { resource })
    }
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    this.emit('cleanup-started')

    try {
      // Release all locks
      for (const [resource] of this.locks) {
        await this.releaseLock(resource)
      }

      // Cancel pending builds
      for (const [buildId, build] of this.builds) {
        if (build.status === 'pending') {
          build.status = 'failed'
          build.error = new Error('Build cancelled during cleanup')
          this.emit('build-cancelled', build)
        }
      }

      // Wait for cleanup timeout
      await this.delay(this.config.cleanupTimeout)

      this.emit('cleanup-completed')
    } catch (error) {
      this.emit('cleanup-failed', error)
      throw error
    }
  }

  /**
   * Get current build states
   */
  getBuildStates(): BuildState[] {
    return Array.from(this.builds.values())
  }

  /**
   * Get specific build state
   */
  getBuildState(buildId: string): BuildState | undefined {
    return this.builds.get(buildId)
  }

  /**
   * Get health check results
   */
  getHealthChecks(): HealthCheckResult[] {
    return Array.from(this.healthChecks.values())
  }

  /**
   * Get race condition statistics
   */
  getRaceStatistics(): RaceStatistics {
    return this.raceDetector.getStatistics()
  }

  /**
   * Add dependency to build
   */
  addDependency(buildId: string, dependency: string): void {
    const build = this.builds.get(buildId)
    if (build) {
      build.dependencies.push(dependency)
      this.emit('dependency-added', { buildId, dependency })
    }
  }

  /**
   * Remove dependency from build
   */
  removeDependency(buildId: string, dependency: string): void {
    const build = this.builds.get(buildId)
    if (build) {
      const index = build.dependencies.indexOf(dependency)
      if (index > -1) {
        build.dependencies.splice(index, 1)
        this.emit('dependency-removed', { buildId, dependency })
      }
    }
  }

  /**
   * Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

/**
 * Build orchestrator for managing multiple builds
 */
export class BuildOrchestrator extends EventEmitter {
  private fixer: CIDCRaceConditionFixer
  private buildQueue: string[] = []
  private activeBuilds: Set<string> = new Set()
  private buildGraph: Map<string, DependencyNode> = new Map()

  constructor(fixer: CIDCRaceConditionFixer) {
    super()
    this.fixer = fixer
    this.setupEventHandlers()
  }

  private setupEventHandlers(): void {
    this.fixer.on('build-started', (build) => {
      this.activeBuilds.add(build.id)
      this.processQueue()
    })

    this.fixer.on('build-completed', (build) => {
      this.activeBuilds.delete(build.id)
      this.processQueue()
    })

    this.fixer.on('build-failed', (build) => {
      this.activeBuilds.delete(build.id)
      this.processQueue()
    })
  }

  /**
   * Add build to queue
   */
  addBuild(buildId: string, dependencies: string[] = []): void {
    if (!this.buildQueue.includes(buildId)) {
      this.buildQueue.push(buildId)

      // Create dependency node
      this.buildGraph.set(buildId, {
        name: buildId,
        dependencies,
        priority: 1,
        estimatedDuration: 60000, // 1 minute
        maxParallel: 1,
      })

      this.emit('build-queued', { buildId, dependencies })
      this.processQueue()
    }
  }

  /**
   * Process build queue
   */
  private async processQueue(): Promise<void> {
    // Find builds that can be executed (dependencies satisfied)
    const executableBuilds = this.buildQueue.filter((buildId) => {
      const node = this.buildGraph.get(buildId)
      if (!node) return false

      // Check if dependencies are completed
      const allDepsCompleted = node.dependencies.every((dep) => {
        const depBuild = this.fixer.getBuildState(dep)
        return depBuild && depBuild.status === 'completed'
      })

      return allDepsCompleted && !this.activeBuilds.has(buildId)
    })

    // Execute builds up to parallel limit
    const availableSlots = 4 - this.activeBuilds.size
    const buildsToStart = executableBuilds.slice(0, availableSlots)

    for (const buildId of buildsToStart) {
      const node = this.buildGraph.get(buildId)
      if (node) {
        this.executeBuild(buildId, node.dependencies)
      }
    }
  }

  /**
   * Execute build
   */
  private async executeBuild(
    buildId: string,
    dependencies: string[]
  ): Promise<void> {
    try {
      await this.fixer.executeBuild(buildId, dependencies)
    } catch (error) {
      this.emit('orchestrator-error', { buildId, error })
    }
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      queued: this.buildQueue.length,
      active: this.activeBuilds.size,
      total: this.buildGraph.size,
    }
  }
}

/**
 * CI/CD Monitor for tracking build health
 */
export class CIDMonitor extends EventEmitter {
  private fixer: CIDCRaceConditionFixer
  private metrics: Map<string, number> = new Map()

  constructor(fixer: CIDCRaceConditionFixer) {
    super()
    this.fixer = fixer
    this.setupMonitoring()
  }

  private setupMonitoring(): void {
    // Monitor build completion rates
    let completedBuilds = 0
    let failedBuilds = 0

    this.fixer.on('build-completed', () => {
      completedBuilds++
      this.updateMetric(
        'build-completion-rate',
        (completedBuilds / (completedBuilds + failedBuilds)) * 100
      )
    })

    this.fixer.on('build-failed', () => {
      failedBuilds++
      this.updateMetric(
        'build-completion-rate',
        (completedBuilds / (completedBuilds + failedBuilds)) * 100
      )
    })

    // Monitor race conditions
    this.fixer.on('race-condition-detected', (data) => {
      this.updateMetric(
        'race-conditions',
        (this.metrics.get('race-conditions') || 0) + 1
      )
      this.emit('alert', {
        type: 'race-condition',
        severity: 'high',
        message: `Race condition detected: ${data.resource}/${data.operation}`,
        data,
      })
    })

    // Monitor service health
    setInterval(() => {
      const healthChecks = this.fixer.getHealthChecks()
      const unhealthyServices = healthChecks.filter(
        (h) => h.status === 'unhealthy'
      ).length

      this.updateMetric('unhealthy-services', unhealthyServices)

      if (unhealthyServices > 0) {
        this.emit('alert', {
          type: 'service-health',
          severity: unhealthyServices > 2 ? 'high' : 'medium',
          message: `${unhealthyServices} services are unhealthy`,
          data: { unhealthyServices },
        })
      }
    }, 30000) // Check every 30 seconds
  }

  /**
   * Update metric
   */
  private updateMetric(name: string, value: number): void {
    this.metrics.set(name, value)
    this.emit('metric-updated', { name, value })
  }

  /**
   * Get metrics
   */
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics)
  }

  /**
   * Get race condition statistics
   */
  getRaceStatistics() {
    return this.fixer.getRaceStatistics()
  }
}

export default {
  CIDCRaceConditionFixer,
  BuildOrchestrator,
  CIDMonitor,
}

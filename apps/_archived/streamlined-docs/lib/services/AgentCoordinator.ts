/**
 * AgentCoordinator - Multi-agent workflow orchestration
 *
 * Provides coordination infrastructure for parallel agent operations with:
 * - File locking to prevent write conflicts
 * - Task queue with priority management
 * - Agent status tracking
 * - Conflict detection and resolution
 *
 * This is a critical service for the 40-agent documentation generation system.
 *
 * Responsibilities:
 * - Manage file locks across agents
 * - Queue and prioritize agent tasks
 * - Track agent status and progress
 * - Detect and resolve conflicts
 * - Provide coordination primitives
 *
 * @example
 * ```typescript
 * const coordinator = new AgentCoordinator()
 *
 * // Agent 1 acquires lock
 * if (await coordinator.acquireLock('agent-1', '/path/to/file.ts')) {
 *   await writeFile(...)
 *   await coordinator.releaseLock('agent-1', '/path/to/file.ts')
 * }
 *
 * // Agent 2 enqueues task
 * await coordinator.enqueueTask({
 *   id: 'task-1',
 *   agentId: 'agent-2',
 *   type: 'documentation',
 *   priority: 1
 * })
 * ```
 */

import { getLogger } from '../logger'

const logger = getLogger('AgentCoordinator')

export interface AgentLock {
  agentId: string
  filePath: string
  acquiredAt: number
  expiresAt: number
}

export interface AgentTask {
  id: string
  agentId: string
  type: 'documentation' | 'validation' | 'generation' | 'analysis'
  priority: number
  data?: Record<string, unknown>
  status: 'pending' | 'running' | 'completed' | 'failed'
  createdAt: number
  startedAt?: number
  completedAt?: number
  error?: string
}

export interface AgentStatus {
  id: string
  status: 'idle' | 'busy' | 'waiting' | 'error'
  currentTask?: string
  lockedFiles: string[]
  tasksCompleted: number
  tasksActive: number
}

export interface ConflictInfo {
  filePath: string
  agents: string[]
  detectedAt: number
}

/**
 * Task queue with priority support
 */
class TaskQueue {
  private tasks: Map<string, AgentTask> = new Map()
  private tasksByAgent: Map<string, Set<string>> = new Map()

  add(task: AgentTask): void {
    this.tasks.set(task.id, task)

    if (!this.tasksByAgent.has(task.agentId)) {
      this.tasksByAgent.set(task.agentId, new Set())
    }
    this.tasksByAgent.get(task.agentId)!.add(task.id)
  }

  get(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId)
  }

  update(taskId: string, updates: Partial<AgentTask>): void {
    const task = this.tasks.get(taskId)
    if (task) {
      this.tasks.set(taskId, { ...task, ...updates })
    }
  }

  remove(taskId: string): void {
    const task = this.tasks.get(taskId)
    if (task) {
      this.tasksByAgent.get(task.agentId)?.delete(taskId)
      this.tasks.delete(taskId)
    }
  }

  getByAgent(agentId: string): AgentTask[] {
    const taskIds = this.tasksByAgent.get(agentId) || new Set()
    return Array.from(taskIds)
      .map((id) => this.tasks.get(id)!)
      .filter(Boolean)
  }

  getPending(): AgentTask[] {
    return Array.from(this.tasks.values())
      .filter((t) => t.status === 'pending')
      .sort((a, b) => b.priority - a.priority) // Higher priority first
  }

  getRunning(): AgentTask[] {
    return Array.from(this.tasks.values()).filter((t) => t.status === 'running')
  }

  getStatus(agentId: string): 'idle' | 'busy' | 'waiting' {
    const agentTasks = this.getByAgent(agentId)
    const hasRunning = agentTasks.some((t) => t.status === 'running')
    const hasPending = agentTasks.some((t) => t.status === 'pending')

    if (hasRunning) return 'busy'
    if (hasPending) return 'waiting'
    return 'idle'
  }

  getAll(): AgentTask[] {
    return Array.from(this.tasks.values())
  }
}

/**
 * AgentCoordinator - Orchestrates multi-agent operations
 */
export class AgentCoordinator {
  private locks: Map<string, AgentLock> = new Map()
  private queue: TaskQueue = new TaskQueue()
  private agentStats: Map<string, { completed: number; active: number }> =
    new Map()
  private conflicts: ConflictInfo[] = []

  // Configuration
  private readonly lockTTL = 60000 // 60 seconds
  private readonly maxConcurrentTasks = 10

  /**
   * Acquire a lock on a file path
   *
   * @returns true if lock acquired, false if already locked by another agent
   */
  async acquireLock(agentId: string, filePath: string): Promise<boolean> {
    const existingLock = this.locks.get(filePath)
    const now = Date.now()

    // Check if lock exists and hasn't expired
    if (existingLock) {
      // Same agent can reacquire
      if (existingLock.agentId === agentId) {
        // Extend lock
        existingLock.expiresAt = now + this.lockTTL
        logger.debug(`Lock extended for ${filePath} by ${agentId}`)
        return true
      }

      // Check if lock has expired
      if (existingLock.expiresAt > now) {
        // Lock held by another agent and still valid
        logger.warn(
          `Lock acquisition failed: ${filePath} locked by ${existingLock.agentId}`
        )

        // Record potential conflict
        this.recordConflict(filePath, agentId, existingLock.agentId)

        return false
      }

      // Lock expired, can acquire
      logger.info(
        `Lock expired for ${filePath}, releasing from ${existingLock.agentId}`
      )
    }

    // Acquire lock
    this.locks.set(filePath, {
      agentId,
      filePath,
      acquiredAt: now,
      expiresAt: now + this.lockTTL,
    })

    logger.debug(`Lock acquired for ${filePath} by ${agentId}`)
    return true
  }

  /**
   * Release a lock on a file path
   */
  async releaseLock(agentId: string, filePath: string): Promise<void> {
    const lock = this.locks.get(filePath)

    if (!lock) {
      logger.warn(`No lock to release for ${filePath}`)
      return
    }

    if (lock.agentId !== agentId) {
      logger.error(
        `Lock release failed: ${filePath} locked by ${lock.agentId}, not ${agentId}`
      )
      throw new Error(
        `Cannot release lock held by another agent: ${lock.agentId}`
      )
    }

    this.locks.delete(filePath)
    logger.debug(`Lock released for ${filePath} by ${agentId}`)
  }

  /**
   * Get all files locked by an agent
   */
  getLockedFiles(agentId: string): string[] {
    return Array.from(this.locks.values())
      .filter((lock) => lock.agentId === agentId)
      .map((lock) => lock.filePath)
  }

  /**
   * Check if a file is locked
   */
  isLocked(filePath: string): boolean {
    const lock = this.locks.get(filePath)
    if (!lock) return false

    const now = Date.now()
    if (lock.expiresAt <= now) {
      // Lock expired
      this.locks.delete(filePath)
      return false
    }

    return true
  }

  /**
   * Force release all locks (emergency use only)
   */
  releaseAllLocks(agentId?: string): void {
    if (agentId) {
      // Release locks for specific agent
      for (const [filePath, lock] of this.locks.entries()) {
        if (lock.agentId === agentId) {
          this.locks.delete(filePath)
        }
      }
      logger.warn(`All locks released for agent ${agentId}`)
    } else {
      // Release all locks
      this.locks.clear()
      logger.warn('All locks forcibly released')
    }
  }

  /**
   * Enqueue a task for an agent
   */
  async enqueueTask(
    task: Omit<AgentTask, 'status' | 'createdAt'>
  ): Promise<string> {
    const fullTask: AgentTask = {
      ...task,
      status: 'pending',
      createdAt: Date.now(),
    }

    this.queue.add(fullTask)

    // Initialize agent stats if needed
    if (!this.agentStats.has(task.agentId)) {
      this.agentStats.set(task.agentId, { completed: 0, active: 0 })
    }

    logger.info(
      `Task ${task.id} enqueued for ${task.agentId} (priority: ${task.priority})`
    )

    return task.id
  }

  /**
   * Start a task (mark as running)
   */
  async startTask(taskId: string): Promise<void> {
    const task = this.queue.get(taskId)
    if (!task) {
      throw new Error(`Task not found: ${taskId}`)
    }

    if (task.status !== 'pending') {
      throw new Error(`Task ${taskId} is not pending (status: ${task.status})`)
    }

    this.queue.update(taskId, {
      status: 'running',
      startedAt: Date.now(),
    })

    const stats = this.agentStats.get(task.agentId)!
    stats.active++

    logger.info(`Task ${taskId} started by ${task.agentId}`)
  }

  /**
   * Complete a task
   */
  async completeTask(taskId: string, error?: string): Promise<void> {
    const task = this.queue.get(taskId)
    if (!task) {
      throw new Error(`Task not found: ${taskId}`)
    }

    this.queue.update(taskId, {
      status: error ? 'failed' : 'completed',
      completedAt: Date.now(),
      error,
    })

    const stats = this.agentStats.get(task.agentId)!
    stats.active--
    if (!error) {
      stats.completed++
    }

    logger.info(
      `Task ${taskId} ${error ? 'failed' : 'completed'} by ${task.agentId}`
    )
  }

  /**
   * Get next pending task (highest priority)
   */
  async getNextTask(agentId?: string): Promise<AgentTask | null> {
    const pending = this.queue.getPending()

    if (agentId) {
      // Get next task for specific agent
      return pending.find((t) => t.agentId === agentId) || null
    }

    // Get highest priority task
    return pending[0] || null
  }

  /**
   * Get agent status
   */
  getAgentStatus(agentId: string): AgentStatus {
    const stats = this.agentStats.get(agentId) || { completed: 0, active: 0 }
    const queueStatus = this.queue.getStatus(agentId)
    const lockedFiles = this.getLockedFiles(agentId)
    const currentTask = this.queue
      .getByAgent(agentId)
      .find((t) => t.status === 'running')

    return {
      id: agentId,
      status: queueStatus,
      currentTask: currentTask?.id,
      lockedFiles,
      tasksCompleted: stats.completed,
      tasksActive: stats.active,
    }
  }

  /**
   * Get all agent statuses
   */
  getAllAgentStatuses(): AgentStatus[] {
    const agentIds = new Set([
      ...Array.from(this.agentStats.keys()),
      ...Array.from(this.locks.values()).map((l) => l.agentId),
    ])

    return Array.from(agentIds).map((id) => this.getAgentStatus(id))
  }

  /**
   * Get coordination statistics
   */
  getStats() {
    return {
      activeLocks: this.locks.size,
      pendingTasks: this.queue.getPending().length,
      runningTasks: this.queue.getRunning().length,
      totalTasks: this.queue.getAll().length,
      activeAgents: this.getAllAgentStatuses().filter(
        (s) => s.status === 'busy'
      ).length,
      conflicts: this.conflicts.length,
    }
  }

  /**
   * Detect and record conflicts
   */
  private recordConflict(
    filePath: string,
    requestingAgent: string,
    holdingAgent: string
  ): void {
    const existing = this.conflicts.find((c) => c.filePath === filePath)

    if (existing) {
      if (!existing.agents.includes(requestingAgent)) {
        existing.agents.push(requestingAgent)
      }
    } else {
      this.conflicts.push({
        filePath,
        agents: [holdingAgent, requestingAgent],
        detectedAt: Date.now(),
      })
    }
  }

  /**
   * Get detected conflicts
   */
  getConflicts(): ConflictInfo[] {
    return [...this.conflicts]
  }

  /**
   * Clear resolved conflicts
   */
  clearConflicts(): void {
    this.conflicts = []
  }

  /**
   * Wait for a lock to become available
   * Returns true if acquired, false if timeout
   */
  async waitForLock(
    agentId: string,
    filePath: string,
    timeoutMs = 30000
  ): Promise<boolean> {
    const startTime = Date.now()
    const checkInterval = 100

    while (Date.now() - startTime < timeoutMs) {
      if (await this.acquireLock(agentId, filePath)) {
        return true
      }

      await new Promise((resolve) => setTimeout(resolve, checkInterval))
    }

    logger.warn(
      `Lock wait timeout for ${filePath} by ${agentId} after ${timeoutMs}ms`
    )
    return false
  }

  /**
   * Cleanup expired locks
   */
  cleanupExpiredLocks(): number {
    const now = Date.now()
    let cleaned = 0

    for (const [filePath, lock] of this.locks.entries()) {
      if (lock.expiresAt <= now) {
        this.locks.delete(filePath)
        cleaned++
        logger.info(`Expired lock cleaned up: ${filePath}`)
      }
    }

    return cleaned
  }
}

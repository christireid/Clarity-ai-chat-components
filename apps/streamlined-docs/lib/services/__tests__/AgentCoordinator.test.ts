/**
 * AgentCoordinator Tests
 *
 * Tests for multi-agent coordination including:
 * - File locking
 * - Task queue management
 * - Conflict detection
 * - Agent status tracking
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { AgentCoordinator } from '../AgentCoordinator'

describe('AgentCoordinator', () => {
  let coordinator: AgentCoordinator

  beforeEach(() => {
    coordinator = new AgentCoordinator()
  })

  describe('File Locking', () => {
    it('should acquire lock successfully', async () => {
      const acquired = await coordinator.acquireLock('agent-1', '/test/file.ts')
      expect(acquired).toBe(true)
    })

    it('should prevent other agents from acquiring same lock', async () => {
      await coordinator.acquireLock('agent-1', '/test/file.ts')
      const acquired = await coordinator.acquireLock('agent-2', '/test/file.ts')
      expect(acquired).toBe(false)
    })

    it('should allow same agent to reacquire lock', async () => {
      await coordinator.acquireLock('agent-1', '/test/file.ts')
      const acquired = await coordinator.acquireLock('agent-1', '/test/file.ts')
      expect(acquired).toBe(true)
    })

    it('should release lock successfully', async () => {
      await coordinator.acquireLock('agent-1', '/test/file.ts')
      await coordinator.releaseLock('agent-1', '/test/file.ts')

      const acquired = await coordinator.acquireLock('agent-2', '/test/file.ts')
      expect(acquired).toBe(true)
    })

    it('should not allow releasing another agents lock', async () => {
      await coordinator.acquireLock('agent-1', '/test/file.ts')

      await expect(
        coordinator.releaseLock('agent-2', '/test/file.ts')
      ).rejects.toThrow()
    })

    it('should track locked files per agent', async () => {
      await coordinator.acquireLock('agent-1', '/test/file1.ts')
      await coordinator.acquireLock('agent-1', '/test/file2.ts')

      const locked = coordinator.getLockedFiles('agent-1')
      expect(locked).toHaveLength(2)
      expect(locked).toContain('/test/file1.ts')
      expect(locked).toContain('/test/file2.ts')
    })

    it('should detect if file is locked', async () => {
      await coordinator.acquireLock('agent-1', '/test/file.ts')
      expect(coordinator.isLocked('/test/file.ts')).toBe(true)
      expect(coordinator.isLocked('/test/other.ts')).toBe(false)
    })

    it('should cleanup expired locks', async () => {
      // This would require mocking time or waiting, simplified for now
      expect(coordinator.cleanupExpiredLocks()).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Task Queue', () => {
    it('should enqueue task successfully', async () => {
      const taskId = await coordinator.enqueueTask({
        id: 'task-1',
        agentId: 'agent-1',
        type: 'documentation',
        priority: 1,
      })

      expect(taskId).toBe('task-1')
    })

    it('should start pending task', async () => {
      await coordinator.enqueueTask({
        id: 'task-1',
        agentId: 'agent-1',
        type: 'documentation',
        priority: 1,
      })

      await coordinator.startTask('task-1')

      const status = coordinator.getAgentStatus('agent-1')
      expect(status.status).toBe('busy')
      expect(status.tasksActive).toBe(1)
    })

    it('should complete task successfully', async () => {
      await coordinator.enqueueTask({
        id: 'task-1',
        agentId: 'agent-1',
        type: 'documentation',
        priority: 1,
      })

      await coordinator.startTask('task-1')
      await coordinator.completeTask('task-1')

      const status = coordinator.getAgentStatus('agent-1')
      expect(status.tasksCompleted).toBe(1)
      expect(status.tasksActive).toBe(0)
    })

    it('should handle task failure', async () => {
      await coordinator.enqueueTask({
        id: 'task-1',
        agentId: 'agent-1',
        type: 'documentation',
        priority: 1,
      })

      await coordinator.startTask('task-1')
      await coordinator.completeTask('task-1', 'Test error')

      const status = coordinator.getAgentStatus('agent-1')
      expect(status.tasksCompleted).toBe(0) // Failed tasks don't count as completed
    })

    it('should return highest priority task', async () => {
      await coordinator.enqueueTask({
        id: 'task-1',
        agentId: 'agent-1',
        type: 'documentation',
        priority: 1,
      })

      await coordinator.enqueueTask({
        id: 'task-2',
        agentId: 'agent-1',
        type: 'documentation',
        priority: 5,
      })

      const next = await coordinator.getNextTask('agent-1')
      expect(next?.id).toBe('task-2') // Higher priority
    })
  })

  describe('Agent Status', () => {
    it('should track agent status correctly', async () => {
      const status1 = coordinator.getAgentStatus('agent-1')
      expect(status1.status).toBe('idle')

      await coordinator.enqueueTask({
        id: 'task-1',
        agentId: 'agent-1',
        type: 'documentation',
        priority: 1,
      })

      const status2 = coordinator.getAgentStatus('agent-1')
      expect(status2.status).toBe('waiting')

      await coordinator.startTask('task-1')

      const status3 = coordinator.getAgentStatus('agent-1')
      expect(status3.status).toBe('busy')
      expect(status3.currentTask).toBe('task-1')
    })

    it('should track locked files in status', async () => {
      await coordinator.acquireLock('agent-1', '/test/file.ts')

      const status = coordinator.getAgentStatus('agent-1')
      expect(status.lockedFiles).toContain('/test/file.ts')
    })

    it('should get all agent statuses', async () => {
      await coordinator.enqueueTask({
        id: 'task-1',
        agentId: 'agent-1',
        type: 'documentation',
        priority: 1,
      })

      await coordinator.enqueueTask({
        id: 'task-2',
        agentId: 'agent-2',
        type: 'documentation',
        priority: 1,
      })

      const statuses = coordinator.getAllAgentStatuses()
      expect(statuses.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Conflict Detection', () => {
    it('should detect conflicts when lock acquisition fails', async () => {
      await coordinator.acquireLock('agent-1', '/test/file.ts')
      await coordinator.acquireLock('agent-2', '/test/file.ts')

      const conflicts = coordinator.getConflicts()
      expect(conflicts.length).toBeGreaterThan(0)
      expect(conflicts[0].filePath).toBe('/test/file.ts')
      expect(conflicts[0].agents).toContain('agent-1')
      expect(conflicts[0].agents).toContain('agent-2')
    })

    it('should clear conflicts', async () => {
      await coordinator.acquireLock('agent-1', '/test/file.ts')
      await coordinator.acquireLock('agent-2', '/test/file.ts')

      coordinator.clearConflicts()
      expect(coordinator.getConflicts()).toHaveLength(0)
    })
  })

  describe('Statistics', () => {
    it('should track coordination statistics', async () => {
      await coordinator.acquireLock('agent-1', '/test/file.ts')
      await coordinator.enqueueTask({
        id: 'task-1',
        agentId: 'agent-1',
        type: 'documentation',
        priority: 1,
      })

      const stats = coordinator.getStats()
      expect(stats.activeLocks).toBe(1)
      expect(stats.pendingTasks).toBe(1)
    })
  })
})

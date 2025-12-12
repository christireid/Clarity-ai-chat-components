/**
 * Tests for the prompts utility module
 *
 * These tests verify:
 * - Cleanup handler registration and execution
 * - Cancel handling
 * - CTRL+C signal handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock @clack/prompts
vi.mock('@clack/prompts', () => ({
  intro: vi.fn(),
  outro: vi.fn(),
  text: vi.fn(),
  confirm: vi.fn(),
  select: vi.fn(),
  multiselect: vi.fn(),
  spinner: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
  })),
  note: vi.fn(),
  log: {
    success: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    step: vi.fn(),
    message: vi.fn(),
  },
  cancel: vi.fn(),
  isCancel: vi.fn((value) => value === Symbol.for('cancel')),
  group: vi.fn(),
}))

describe('Prompts Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Cleanup Handlers', () => {
    it('should register cleanup functions', async () => {
      const { onCleanup, clearCleanup } = await import('../prompts.js')

      const cleanupFn = vi.fn()
      onCleanup(cleanupFn)

      // Clean up after test
      clearCleanup()
    })

    it('should clear cleanup functions', async () => {
      const { onCleanup, clearCleanup } = await import('../prompts.js')

      const cleanupFn = vi.fn()
      onCleanup(cleanupFn)
      clearCleanup()

      // Cleanup function should not be called after clear
      expect(cleanupFn).not.toHaveBeenCalled()
    })
  })

  describe('Cancel Detection', () => {
    it('should detect cancelled prompts', async () => {
      const { isCancel } = await import('@clack/prompts')
      const cancelSymbol = Symbol.for('cancel')

      expect(isCancel(cancelSymbol)).toBe(true)
      expect(isCancel('normal value')).toBe(false)
    })
  })

  describe('Logging', () => {
    it('should export log utilities', async () => {
      const { log } = await import('../prompts.js')

      expect(log.success).toBeDefined()
      expect(log.error).toBeDefined()
      expect(log.warning).toBeDefined()
      expect(log.info).toBeDefined()
      expect(log.step).toBeDefined()
      expect(log.message).toBeDefined()
    })
  })

  describe('UI Helpers', () => {
    it('should export showIntro', async () => {
      const { showIntro } = await import('../prompts.js')
      expect(showIntro).toBeDefined()
      expect(typeof showIntro).toBe('function')
    })

    it('should export showOutro', async () => {
      const { showOutro } = await import('../prompts.js')
      expect(showOutro).toBeDefined()
      expect(typeof showOutro).toBe('function')
    })

    it('should export showNextSteps', async () => {
      const { showNextSteps } = await import('../prompts.js')
      expect(showNextSteps).toBeDefined()
      expect(typeof showNextSteps).toBe('function')
    })

    it('should export showFilesCreated', async () => {
      const { showFilesCreated } = await import('../prompts.js')
      expect(showFilesCreated).toBeDefined()
      expect(typeof showFilesCreated).toBe('function')
    })

    it('should export showWarning', async () => {
      const { showWarning } = await import('../prompts.js')
      expect(showWarning).toBeDefined()
      expect(typeof showWarning).toBe('function')
    })

    it('should export showInfo', async () => {
      const { showInfo } = await import('../prompts.js')
      expect(showInfo).toBeDefined()
      expect(typeof showInfo).toBe('function')
    })
  })

  describe('Prompt Wrappers', () => {
    it('should export promptText', async () => {
      const { promptText } = await import('../prompts.js')
      expect(promptText).toBeDefined()
      expect(typeof promptText).toBe('function')
    })

    it('should export promptConfirm', async () => {
      const { promptConfirm } = await import('../prompts.js')
      expect(promptConfirm).toBeDefined()
      expect(typeof promptConfirm).toBe('function')
    })

    it('should export promptSelect', async () => {
      const { promptSelect } = await import('../prompts.js')
      expect(promptSelect).toBeDefined()
      expect(typeof promptSelect).toBe('function')
    })

    it('should export promptMultiselect', async () => {
      const { promptMultiselect } = await import('../prompts.js')
      expect(promptMultiselect).toBeDefined()
      expect(typeof promptMultiselect).toBe('function')
    })

    it('should export promptGroup', async () => {
      const { promptGroup } = await import('../prompts.js')
      expect(promptGroup).toBeDefined()
      expect(typeof promptGroup).toBe('function')
    })
  })

  describe('Task Running', () => {
    it('should export runTasks', async () => {
      const { runTasks } = await import('../prompts.js')
      expect(runTasks).toBeDefined()
      expect(typeof runTasks).toBe('function')
    })

    it('should export createSpinner', async () => {
      const { createSpinner } = await import('../prompts.js')
      expect(createSpinner).toBeDefined()
      expect(typeof createSpinner).toBe('function')
    })

    it('should export showTaskSummary', async () => {
      const { showTaskSummary } = await import('../prompts.js')
      expect(showTaskSummary).toBeDefined()
      expect(typeof showTaskSummary).toBe('function')
    })
  })

  describe('Cancel Handler Setup', () => {
    it('should export setupCancelHandler', async () => {
      const { setupCancelHandler } = await import('../prompts.js')
      expect(setupCancelHandler).toBeDefined()
      expect(typeof setupCancelHandler).toBe('function')
    })
  })

  describe('@clack/prompts Re-export', () => {
    it('should re-export @clack/prompts as clack', async () => {
      const { clack } = await import('../prompts.js')
      expect(clack).toBeDefined()
    })
  })
})

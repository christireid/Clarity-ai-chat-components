/**
 * usePromptComposer Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePromptComposer } from '../usePromptComposer'
import { createContextItem } from '../context-utils'
import type { PromptComposerConfig } from '../types'

describe('usePromptComposer', () => {
  const defaultConfig: PromptComposerConfig = {
    api: '/api/chat',
    tokenBudget: 8000,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Initialization Tests
  // ==========================================================================

  describe('Initialization', () => {
    it('initializes with default state', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      expect(result.current.state.value).toBe('')
      expect(result.current.state.currentState).toBe('collapsed')
      expect(result.current.state.contextItems).toEqual([])
      expect(result.current.state.attachments).toEqual([])
      expect(result.current.state.isSubmitting).toBe(false)
      expect(result.current.state.totalTokens).toBe(0)
    })

    it('initializes with custom token budget', () => {
      const { result } = renderHook(() =>
        usePromptComposer({ ...defaultConfig, tokenBudget: 16000 })
      )

      expect(result.current.state.tokenBudget).toBe(16000)
    })

    it('provides ref for textarea', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      expect(result.current.ref).toBeDefined()
      expect(result.current.ref.current).toBeNull() // Not attached yet
    })
  })

  // ==========================================================================
  // State Transitions
  // ==========================================================================

  describe('State Transitions', () => {
    it('transitions to focused state on focus', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      act(() => {
        result.current.actions.focus()
      })

      expect(result.current.state.isFocused).toBe(true)
      expect(result.current.state.currentState).toBe('focused')
    })

    it('transitions to typing state when value changes', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      act(() => {
        result.current.actions.setValue('Hello')
      })

      expect(result.current.state.value).toBe('Hello')
      expect(result.current.state.currentState).toBe('typing')
    })

    it('transitions to expanding state with long text', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      act(() => {
        result.current.actions.setValue('a'.repeat(150))
      })

      expect(result.current.state.isExpanded).toBe(true)
    })

    it('transitions to with-context state when context added', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const contextItem = createContextItem({
        id: 'test-file',
        type: 'file',
        label: 'test.ts',
        summary: 'Test file',
      })

      act(() => {
        result.current.actions.addContext(contextItem)
      })

      expect(result.current.state.contextItems).toHaveLength(1)
      expect(result.current.state.currentState).toBe('with-context')
    })

    it('transitions to submitting state during submit', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() =>
        usePromptComposer({ ...defaultConfig, onSubmit })
      )

      act(() => {
        result.current.actions.setValue('Test message')
      })

      let submitPromise: Promise<void>
      act(() => {
        submitPromise = result.current.actions.submit()
      })

      expect(result.current.state.isSubmitting).toBe(true)
      expect(result.current.state.currentState).toBe('submitting')

      await act(async () => {
        await submitPromise
      })

      expect(result.current.state.isSubmitting).toBe(false)
    })
  })

  // ==========================================================================
  // Context Management
  // ==========================================================================

  describe('Context Management', () => {
    it('adds context items', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'Button.tsx',
        summary: 'Button component',
      })

      act(() => {
        result.current.actions.addContext(item)
      })

      expect(result.current.state.contextItems).toHaveLength(1)
      expect(result.current.state.contextItems[0].id).toBe('file1')
    })

    it('removes context items', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'Button.tsx',
        summary: 'Button component',
      })

      act(() => {
        result.current.actions.addContext(item)
      })

      expect(result.current.state.contextItems).toHaveLength(1)

      act(() => {
        result.current.actions.removeContext('file1')
      })

      expect(result.current.state.contextItems).toHaveLength(0)
    })

    it('prevents duplicate context items', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'Button.tsx',
        summary: 'Button component',
      })

      act(() => {
        result.current.actions.addContext(item)
        result.current.actions.addContext(item)
      })

      expect(result.current.state.contextItems).toHaveLength(1)
    })

    it('tracks last accessed time', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'Button.tsx',
        summary: 'Button component',
      })

      act(() => {
        result.current.actions.addContext(item)
      })

      expect(result.current.state.contextItems[0].lastAccessed).toBeDefined()
      expect(result.current.state.contextItems[0].lastAccessed).toBeGreaterThan(0)
    })
  })

  // ==========================================================================
  // Token Tracking
  // ==========================================================================

  describe('Token Tracking', () => {
    it('calculates total tokens from value', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      act(() => {
        result.current.actions.setValue('Hello world')
      })

      expect(result.current.state.totalTokens).toBeGreaterThan(0)
    })

    it('includes context item tokens in total', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'Button.tsx',
        summary: 'Button component with 250 lines',
      })

      act(() => {
        result.current.actions.addContext(item)
      })

      expect(result.current.state.totalTokens).toBeGreaterThan(0)
    })

    it('calculates token usage percentage', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      act(() => {
        result.current.actions.setValue('a'.repeat(1000))
      })

      expect(result.current.state.tokenUsage).toBeGreaterThan(0)
      expect(result.current.state.tokenUsage).toBeLessThanOrEqual(1)
    })

    it('triggers onTokenUsageChange callback', () => {
      const onTokenUsageChange = vi.fn()
      const { result } = renderHook(() =>
        usePromptComposer({ ...defaultConfig, onTokenUsageChange })
      )

      act(() => {
        result.current.actions.setValue('Hello')
      })

      expect(onTokenUsageChange).toHaveBeenCalled()
      expect(onTokenUsageChange).toHaveBeenCalledWith(expect.any(Number))
    })
  })

  // ==========================================================================
  // Submit Action
  // ==========================================================================

  describe('Submit Action', () => {
    it('calls onSubmit with message', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() =>
        usePromptComposer({ ...defaultConfig, onSubmit })
      )

      act(() => {
        result.current.actions.setValue('Test message')
      })

      await act(async () => {
        await result.current.actions.submit()
      })

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining('Test message'),
          contextItems: [],
          attachments: [],
          metadata: expect.objectContaining({
            totalTokens: expect.any(Number),
            timestamp: expect.any(Number),
          }),
        })
      )
    })

    it('includes context items in submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() =>
        usePromptComposer({ ...defaultConfig, onSubmit })
      )

      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'Button.tsx',
        summary: 'Button component',
      })

      act(() => {
        result.current.actions.setValue('Test')
        result.current.actions.addContext(item)
      })

      await act(async () => {
        await result.current.actions.submit()
      })

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          contextItems: [expect.objectContaining({ id: 'file1' })],
        })
      )
    })

    it('clears state after successful submit', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() =>
        usePromptComposer({ ...defaultConfig, onSubmit })
      )

      act(() => {
        result.current.actions.setValue('Test')
      })

      await act(async () => {
        await result.current.actions.submit()
      })

      expect(result.current.state.value).toBe('')
      expect(result.current.state.contextItems).toEqual([])
    })

    it('handles submit errors', async () => {
      const error = new Error('Submit failed')
      const onSubmit = vi.fn().mockRejectedValue(error)
      const { result } = renderHook(() =>
        usePromptComposer({ ...defaultConfig, onSubmit })
      )

      act(() => {
        result.current.actions.setValue('Test')
      })

      await act(async () => {
        await result.current.actions.submit()
      })

      expect(result.current.state.error).toEqual(error)
      expect(result.current.state.isSubmitting).toBe(false)
    })

    it('does not submit empty messages', async () => {
      const onSubmit = vi.fn()
      const { result } = renderHook(() =>
        usePromptComposer({ ...defaultConfig, onSubmit })
      )

      await act(async () => {
        await result.current.actions.submit()
      })

      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // Clear Action
  // ==========================================================================

  describe('Clear Action', () => {
    it('resets all state', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'Button.tsx',
        summary: 'Button component',
      })

      act(() => {
        result.current.actions.setValue('Test')
        result.current.actions.addContext(item)
        result.current.actions.clear()
      })

      expect(result.current.state.value).toBe('')
      expect(result.current.state.contextItems).toEqual([])
      expect(result.current.state.attachments).toEqual([])
      expect(result.current.state.error).toBeNull()
    })
  })

  // ==========================================================================
  // State Change Callback
  // ==========================================================================

  describe('State Change Callback', () => {
    it('triggers onStateChange when state updates', () => {
      const onStateChange = vi.fn()
      const { result } = renderHook(() =>
        usePromptComposer({ ...defaultConfig, onStateChange })
      )

      act(() => {
        result.current.actions.setValue('Test')
      })

      expect(onStateChange).toHaveBeenCalled()
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 'Test',
          currentState: expect.any(String),
        })
      )
    })
  })
})

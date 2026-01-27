import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useMessageOperations } from '../use-message-operations'
import type { Message } from '../../../types/message'

describe('useMessageOperations - Rollback on Edit Failure', () => {
  let initialMessages: Message[]

  beforeEach(() => {
    initialMessages = [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Hello',
        timestamp: Date.now(),
        branchId: 'main',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Hi there!',
        timestamp: Date.now(),
        branchId: 'main',
      },
      {
        id: 'msg-3',
        role: 'user',
        content: 'How are you?',
        timestamp: Date.now(),
        branchId: 'main',
      },
    ]
  })

  it('should rollback failed edit to restore original content', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    // Edit a message
    act(() => {
      result.current.editMessage('msg-2', 'Updated response')
    })

    // Verify edit was applied
    const editedMessage = result.current.messages.find((m) => m.id === 'msg-2')
    expect(editedMessage?.content).toBe('Updated response')

    // Simulate edit failure - rollback the edit
    act(() => {
      result.current.rollbackEdit('msg-2')
    })

    // Verify rollback restored original content
    const rolledBackMessage = result.current.messages.find(
      (m) => m.id === 'msg-2'
    )
    expect(rolledBackMessage?.content).toBe('Hi there!')
  })

  it('should remove edit from history after rollback', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    // Edit a message
    act(() => {
      result.current.editMessage('msg-2', 'Updated response')
    })

    // Should be able to undo the edit
    expect(result.current.canUndo).toBe(true)

    // Rollback the edit
    act(() => {
      result.current.rollbackEdit('msg-2')
    })

    // After rollback, the edit should be removed from history
    // So we should no longer be able to undo it
    expect(result.current.canUndo).toBe(false)
  })

  it('should clear redo stack after rollback', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    // Make two edits
    act(() => {
      result.current.editMessage('msg-2', 'First edit')
    })
    act(() => {
      result.current.editMessage('msg-3', 'Second edit')
    })

    // Undo the second edit
    act(() => {
      result.current.undo()
    })

    // Should be able to redo
    expect(result.current.canRedo).toBe(true)

    // Rollback the first edit
    act(() => {
      result.current.rollbackEdit('msg-2')
    })

    // Redo stack should be cleared
    expect(result.current.canRedo).toBe(false)
  })

  it('should rollback only the most recent edit when message edited multiple times', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    // Edit the same message multiple times
    act(() => {
      result.current.editMessage('msg-2', 'First edit')
    })
    act(() => {
      result.current.editMessage('msg-2', 'Second edit')
    })
    act(() => {
      result.current.editMessage('msg-2', 'Third edit')
    })

    // Verify final state
    const editedMessage = result.current.messages.find((m) => m.id === 'msg-2')
    expect(editedMessage?.content).toBe('Third edit')

    // Rollback should restore to second edit
    act(() => {
      result.current.rollbackEdit('msg-2')
    })

    const rolledBackMessage = result.current.messages.find(
      (m) => m.id === 'msg-2'
    )
    expect(rolledBackMessage?.content).toBe('Second edit')
  })

  it('should handle rollback when no edit history exists', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    // Try to rollback without any edits
    act(() => {
      result.current.rollbackEdit('msg-2')
    })

    // Should remain unchanged
    const message = result.current.messages.find((m) => m.id === 'msg-2')
    expect(message?.content).toBe('Hi there!')
  })

  it('should handle rollback for non-existent message ID', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    // Edit a real message
    act(() => {
      result.current.editMessage('msg-2', 'Updated response')
    })

    // Try to rollback non-existent message
    act(() => {
      result.current.rollbackEdit('msg-nonexistent')
    })

    // Original edit should remain
    const message = result.current.messages.find((m) => m.id === 'msg-2')
    expect(message?.content).toBe('Updated response')
  })

  it('should support optimistic update pattern with rollback on failure', async () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    // Simulate optimistic update pattern:
    // 1. Immediately update UI (optimistic)
    act(() => {
      result.current.editMessage('msg-2', 'Optimistic edit')
    })

    // Verify optimistic update applied
    const optimisticMessage = result.current.messages.find(
      (m) => m.id === 'msg-2'
    )
    expect(optimisticMessage?.content).toBe('Optimistic edit')

    // 2. Simulate API call failure - rollback
    act(() => {
      result.current.rollbackEdit('msg-2')
    })

    // 3. Verify rollback restored original state
    const finalMessage = result.current.messages.find((m) => m.id === 'msg-2')
    expect(finalMessage?.content).toBe('Hi there!')
  })

  it('should preserve other messages when rolling back edit', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    // Edit middle message
    act(() => {
      result.current.editMessage('msg-2', 'Updated response')
    })

    // Rollback the edit
    act(() => {
      result.current.rollbackEdit('msg-2')
    })

    // Verify all messages still exist
    expect(result.current.messages).toHaveLength(3)
    expect(result.current.messages[0].content).toBe('Hello')
    expect(result.current.messages[1].content).toBe('Hi there!')
    expect(result.current.messages[2].content).toBe('How are you?')
  })
})

/**
 * Production-realistic race condition tests
 *
 * These tests simulate real-world usage where each undo/redo is triggered by
 * a separate user interaction (not called synchronously in a tight loop).
 */

import { describe, it, expect } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useMessageOperations } from '../use-message-operations'

describe('useMessageOperations - Production Race Conditions', () => {
  it('should handle rapid user clicks on undo button', async () => {
    const { result } = renderHook(() => useMessageOperations())

    // Add 10 messages
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.addMessage({
          role: 'user',
          content: `Message ${i + 1}`,
        })
      }
    })

    expect(result.current.messages).toHaveLength(10)

    // Simulate 10 rapid user clicks (each in separate act block)
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.undo()
      })
      // Allow React to process the update
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    expect(result.current.messages).toHaveLength(0)
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(true)
  })

  it('should handle alternating undo/redo clicks', async () => {
    const { result } = renderHook(() => useMessageOperations())

    // Add 5 messages
    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.addMessage({
          role: 'user',
          content: `Message ${i + 1}`,
        })
      }
    })

    // Simulate alternating clicks
    act(() => {
      result.current.undo()
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    act(() => {
      result.current.undo()
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    act(() => {
      result.current.redo()
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    act(() => {
      result.current.undo()
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(result.current.messages).toHaveLength(3)
  })

  it('should maintain data integrity under realistic rapid usage', async () => {
    const { result } = renderHook(() => useMessageOperations())

    // Add messages
    act(() => {
      result.current.addMessage({ role: 'user', content: 'First' })
      result.current.addMessage({ role: 'user', content: 'Second' })
      result.current.addMessage({ role: 'user', content: 'Third' })
    })

    // User rapidly clicks undo 2 times
    act(() => {
      result.current.undo()
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    act(() => {
      result.current.undo()
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    // Verify correct messages remain
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0]?.content).toBe('First')

    // User clicks redo once
    act(() => {
      result.current.redo()
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[1]?.content).toBe('Second')
  })
})

/**
 * Debug test to understand queue behavior
 */

import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMessageOperations } from '../use-message-operations'

describe('Queue Debug', () => {
  it('should process all queued operations', () => {
    const { result } = renderHook(() => useMessageOperations())

    // Add 3 messages
    act(() => {
      result.current.addMessage({ role: 'user', content: 'Message 1' })
      result.current.addMessage({ role: 'user', content: 'Message 2' })
      result.current.addMessage({ role: 'user', content: 'Message 3' })
    })

    console.log('After adding 3 messages:', result.current.messages.length)
    expect(result.current.messages).toHaveLength(3)

    // Try to undo 3 times
    act(() => {
      console.log('Calling undo #1')
      result.current.undo()
      console.log('After undo #1:', result.current.messages.length)

      console.log('Calling undo #2')
      result.current.undo()
      console.log('After undo #2:', result.current.messages.length)

      console.log('Calling undo #3')
      result.current.undo()
      console.log('After undo #3:', result.current.messages.length)
    })

    console.log('Final messages count:', result.current.messages.length)
    expect(result.current.messages).toHaveLength(0)
  })
})

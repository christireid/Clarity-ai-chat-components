/**
 * Test reducer with delays between operations
 */

import { describe, it, expect } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useMessageOperations } from '../use-message-operations'

describe('Reducer Debug - With Delays', () => {
  it('should process operations with delays between them', async () => {
    const { result } = renderHook(() => useMessageOperations())

    // Add 3 messages
    act(() => {
      result.current.addMessage({ role: 'user', content: 'Message 1' })
      result.current.addMessage({ role: 'user', content: 'Message 2' })
      result.current.addMessage({ role: 'user', content: 'Message 3' })
    })

    expect(result.current.messages).toHaveLength(3)

    // Undo with delays
    act(() => {
      result.current.undo()
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2)
    })

    act(() => {
      result.current.undo()
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1)
    })

    act(() => {
      result.current.undo()
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(0)
    })
  })
})

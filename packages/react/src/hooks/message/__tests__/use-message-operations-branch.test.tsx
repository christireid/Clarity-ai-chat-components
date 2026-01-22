import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useMessageOperations } from '../use-message-operations'
import type { MessageWithOperations } from '../use-message-operations'

describe('useMessageOperations - Branch Conversation Fix', () => {
  let initialMessages: MessageWithOperations[]

  beforeEach(() => {
    initialMessages = [
      {
        id: 'msg-1',
        role: 'user',
        content: 'First message',
        timestamp: Date.now(),
        branchId: 'main',
        parentId: undefined,
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'First response',
        timestamp: Date.now(),
        branchId: 'main',
        parentId: 'msg-1',
      },
      {
        id: 'msg-3',
        role: 'user',
        content: 'Second message',
        timestamp: Date.now(),
        branchId: 'main',
        parentId: 'msg-2',
      },
    ]
  })

  it('should not create self-referencing parentIds when branching', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    let newBranchId: string = ''
    act(() => {
      newBranchId = result.current.branchConversation('msg-2')
    })

    // Get all messages (including branched ones)
    const allMessages = result.current.messages

    // Switch to new branch to see branched messages
    act(() => {
      result.current.switchToBranch(newBranchId)
    })

    const branchedMessages = result.current.messages

    // Verify NO message has itself as parent (self-reference)
    branchedMessages.forEach((msg) => {
      expect(msg.parentId).not.toBe(msg.id)
    })
  })

  it('should preserve original parent chain in new branch', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    let newBranchId: string = ''
    act(() => {
      newBranchId = result.current.branchConversation('msg-2')
    })

    act(() => {
      result.current.switchToBranch(newBranchId)
    })

    const branchedMessages = result.current.messages

    // Should have 2 messages up to branch point
    expect(branchedMessages).toHaveLength(2)

    // Verify parent chain preserved
    const msg1 = branchedMessages.find((m) => m.content === 'First message')
    const msg2 = branchedMessages.find((m) => m.content === 'First response')

    expect(msg1).toBeDefined()
    expect(msg2).toBeDefined()

    // First message should have no parent (root)
    expect(msg1?.parentId).toBeUndefined()

    // Second message should point to first message (NOT itself)
    expect(msg2?.parentId).toBe('msg-1')
  })

  it('should not cause infinite loops when traversing message chains', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    let newBranchId: string = ''
    act(() => {
      newBranchId = result.current.branchConversation('msg-2')
    })

    act(() => {
      result.current.switchToBranch(newBranchId)
    })

    // With self-references, traversing parentId chain would cause infinite loops
    // This test verifies we can safely traverse the chain
    const branchedMessages = result.current.messages

    // Traverse the parent chain manually (what getMessagesUpTo would do internally)
    let current = branchedMessages[branchedMessages.length - 1]
    const traversed: string[] = []
    let maxIterations = 10 // Safety limit

    while (current && maxIterations-- > 0) {
      traversed.push(current.id)

      // Find parent
      if (current.parentId) {
        const parent = branchedMessages.find((m) => m.id === current.parentId)
        if (parent?.id === current.id) {
          // Self-reference detected!
          throw new Error(
            `Self-reference detected: ${current.id} points to itself`
          )
        }
        current = parent
      } else {
        break // Reached root
      }
    }

    // Should have traversed successfully without hitting safety limit
    expect(maxIterations).toBeGreaterThan(0)
    // Should have traversed some messages
    expect(traversed.length).toBeGreaterThan(0)
  })

  it('should create independent branches that can diverge', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    // Create branch at msg-2
    let branchId1: string = ''
    act(() => {
      branchId1 = result.current.branchConversation('msg-2')
    })

    // Switch to new branch and add message
    act(() => {
      result.current.switchToBranch(branchId1)
    })

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Alternative path',
      })
    })

    expect(result.current.messages).toHaveLength(3)

    // Switch back to main branch
    act(() => {
      result.current.switchToBranch('main')
    })

    // Main branch should still have original 3 messages
    expect(result.current.messages).toHaveLength(3)
    expect(result.current.messages[2]?.content).toBe('Second message')
  })

  it('should handle branching from first message', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    let newBranchId: string = ''
    act(() => {
      newBranchId = result.current.branchConversation('msg-1')
    })

    act(() => {
      result.current.switchToBranch(newBranchId)
    })

    const branchedMessages = result.current.messages

    // Should have 1 message (just the branch point)
    expect(branchedMessages).toHaveLength(1)

    // That message should have no parent
    expect(branchedMessages[0]?.parentId).toBeUndefined()

    // Should NOT be a self-reference
    expect(branchedMessages[0]?.parentId).not.toBe('msg-1')
  })

  it('should handle multiple levels of branching', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    // Create first branch
    let branch1: string = ''
    act(() => {
      branch1 = result.current.branchConversation('msg-2')
    })

    act(() => {
      result.current.switchToBranch(branch1)
    })

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Branch 1 message',
      })
    })

    // Create second branch from first branch
    let branch2: string = ''
    act(() => {
      branch2 = result.current.branchConversation('msg-2')
    })

    act(() => {
      result.current.switchToBranch(branch2)
    })

    const branch2Messages = result.current.messages

    // Verify no self-references in nested branch
    branch2Messages.forEach((msg) => {
      expect(msg.parentId).not.toBe(msg.id)
    })

    // Verify parent chain intact
    const msg2 = branch2Messages.find((m) => m.content === 'First response')
    expect(msg2?.parentId).toBe('msg-1')
  })

  it('should return unique branch IDs', () => {
    const { result } = renderHook(() =>
      useMessageOperations({ initialMessages })
    )

    let branch1: string = ''
    let branch2: string = ''

    act(() => {
      branch1 = result.current.branchConversation('msg-2')
    })

    act(() => {
      branch2 = result.current.branchConversation('msg-2')
    })

    expect(branch1).not.toBe(branch2)
    expect(branch1).toBeTruthy()
    expect(branch2).toBeTruthy()
  })
})

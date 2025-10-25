import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMessageOperations } from '../use-message-operations'

describe('useMessageOperations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should add messages', () => {
    const { result } = renderHook(() => useMessageOperations())

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Hello',
      })
    })

    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].content).toBe('Hello')
    expect(result.current.messages[0].role).toBe('user')
  })

  it('should edit messages', () => {
    const onEdit = vi.fn()
    const { result } = renderHook(() =>
      useMessageOperations({
        onEdit,
      })
    )

    let messageId = ''

    act(() => {
      messageId = result.current.addMessage({
        role: 'user',
        content: 'Original',
      })
    })

    act(() => {
      result.current.editMessage(messageId, 'Edited')
    })

    expect(result.current.messages[0].content).toBe('Edited')
    expect(result.current.messages[0].originalContent).toBe('Original')
    expect(result.current.messages[0].version).toBe(1)
    expect(onEdit).toHaveBeenCalledWith(messageId, 'Edited')
  })

  it('should delete messages', () => {
    const onDelete = vi.fn()
    const { result } = renderHook(() =>
      useMessageOperations({
        onDelete,
      })
    )

    let messageId = ''

    act(() => {
      messageId = result.current.addMessage({
        role: 'user',
        content: 'Test',
      })
    })

    expect(result.current.messages).toHaveLength(1)

    act(() => {
      result.current.deleteMessage(messageId)
    })

    expect(result.current.messages).toHaveLength(0)
    expect(onDelete).toHaveBeenCalledWith(messageId)
  })

  it('should regenerate messages', () => {
    const onRegenerate = vi.fn()
    const { result } = renderHook(() =>
      useMessageOperations({
        onRegenerate,
      })
    )

    let messageId = ''

    act(() => {
      messageId = result.current.addMessage({
        role: 'assistant',
        content: 'Response',
      })
    })

    act(() => {
      result.current.regenerateMessage(messageId)
    })

    expect(onRegenerate).toHaveBeenCalledWith(messageId)
  })

  it('should branch conversations', () => {
    const onBranch = vi.fn()
    const { result } = renderHook(() =>
      useMessageOperations({
        onBranch,
      })
    )

    let messageId = ''

    act(() => {
      messageId = result.current.addMessage({
        role: 'user',
        content: 'First',
      })
      result.current.addMessage({
        role: 'assistant',
        content: 'Second',
      })
    })

    let branchId = ''

    act(() => {
      branchId = result.current.branchConversation(messageId)
    })

    expect(onBranch).toHaveBeenCalledWith(branchId, messageId)
    expect(result.current.currentBranchId).toBe(branchId)
  })

  it('should undo operations', () => {
    const { result } = renderHook(() => useMessageOperations())

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Test',
      })
    })

    expect(result.current.messages).toHaveLength(1)
    expect(result.current.canUndo).toBe(true)

    act(() => {
      result.current.undo()
    })

    expect(result.current.messages).toHaveLength(0)
    expect(result.current.canUndo).toBe(false)
  })

  it('should redo operations', () => {
    const { result } = renderHook(() => useMessageOperations())

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Test',
      })
    })

    expect(result.current.messages).toHaveLength(1)

    act(() => {
      result.current.undo()
    })

    expect(result.current.messages).toHaveLength(0)
    expect(result.current.canRedo).toBe(true)

    act(() => {
      result.current.redo()
    })

    expect(result.current.messages).toHaveLength(1)
  })

  it('should start and cancel editing mode', () => {
    const { result } = renderHook(() => useMessageOperations())

    let messageId: string

    act(() => {
      messageId = result.current.addMessage({
        role: 'user',
        content: 'Test',
      })
    })

    act(() => {
      result.current.startEditing(messageId)
    })

    expect(result.current.messages[0].isEditing).toBe(true)

    act(() => {
      result.current.cancelEditing(messageId)
    })

    expect(result.current.messages[0].isEditing).toBe(false)
  })

  it('should get messages up to a point', () => {
    const { result } = renderHook(() => useMessageOperations())

    let msg2Id = ''

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'First',
      })
      msg2Id = result.current.addMessage({
        role: 'assistant',
        content: 'Second',
      })
      result.current.addMessage({
        role: 'user',
        content: 'Third',
      })
    })

    const messagesUpTo2 = result.current.getMessagesUpTo(msg2Id)

    expect(messagesUpTo2).toHaveLength(2)
    expect(messagesUpTo2[0].content).toBe('First')
    expect(messagesUpTo2[1].content).toBe('Second')
  })

  it('should get all branches', () => {
    const { result } = renderHook(() => useMessageOperations())

    let messageId: string

    act(() => {
      messageId = result.current.addMessage({
        role: 'user',
        content: 'Main',
      })
    })

    act(() => {
      result.current.branchConversation(messageId)
    })

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Branch message',
      })
    })

    const branches = result.current.getBranches()

    expect(branches.size).toBeGreaterThan(1)
    expect(branches.has('main')).toBe(true)
  })

  it('should switch between branches', () => {
    const { result } = renderHook(() => useMessageOperations())

    let messageId = ''

    act(() => {
      messageId = result.current.addMessage({
        role: 'user',
        content: 'Main',
      })
    })

    let branchId = ''

    act(() => {
      branchId = result.current.branchConversation(messageId)
    })

    expect(result.current.currentBranchId).toBe(branchId)

    act(() => {
      result.current.switchToBranch('main')
    })

    expect(result.current.currentBranchId).toBe('main')
  })

  it('should clear all messages', () => {
    const { result } = renderHook(() => useMessageOperations())

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Test 1',
      })
      result.current.addMessage({
        role: 'user',
        content: 'Test 2',
      })
    })

    expect(result.current.messages).toHaveLength(2)

    act(() => {
      result.current.clear()
    })

    expect(result.current.messages).toHaveLength(0)
    expect(result.current.canUndo).toBe(false)
  })

  it('should track version numbers on edits', () => {
    const { result } = renderHook(() => useMessageOperations())

    let messageId: string

    act(() => {
      messageId = result.current.addMessage({
        role: 'user',
        content: 'Original',
      })
    })

    expect(result.current.messages[0].version).toBeUndefined()

    act(() => {
      result.current.editMessage(messageId, 'Edit 1')
    })

    expect(result.current.messages[0].version).toBe(1)

    act(() => {
      result.current.editMessage(messageId, 'Edit 2')
    })

    expect(result.current.messages[0].version).toBe(2)
  })

  it('should preserve original content after first edit', () => {
    const { result } = renderHook(() => useMessageOperations())

    let messageId: string

    act(() => {
      messageId = result.current.addMessage({
        role: 'user',
        content: 'Original',
      })
    })

    act(() => {
      result.current.editMessage(messageId, 'Edit 1')
    })

    expect(result.current.messages[0].originalContent).toBe('Original')

    act(() => {
      result.current.editMessage(messageId, 'Edit 2')
    })

    // Original content should still be 'Original', not 'Edit 1'
    expect(result.current.messages[0].originalContent).toBe('Original')
  })
})

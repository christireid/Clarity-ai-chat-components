/**
 * Race Condition Tests for useMessageOperations
 *
 * Tests that rapid undo/redo operations don't cause data corruption
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useMessageOperations } from '../use-message-operations'

describe('useMessageOperations - Race Condition Prevention', () => {
  describe('Rapid Undo Operations', () => {
    it('should handle 10 rapid undo calls without corruption', async () => {
      const { result } = renderHook(() => useMessageOperations())

      // Add 10 messages
      const messageIds: string[] = []
      act(() => {
        for (let i = 0; i < 10; i++) {
          const id = result.current.addMessage({
            role: 'user',
            content: `Message ${i + 1}`,
          })
          messageIds.push(id)
        }
      })

      expect(result.current.messages).toHaveLength(10)

      // Rapidly undo all 10 operations (simulating rapid clicks)
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.undo()
        }
      })

      // Wait for all queued operations to complete
      await waitFor(
        () => {
          expect(result.current.messages).toHaveLength(0)
        },
        { timeout: 1000 }
      )

      // Verify state consistency
      expect(result.current.messages).toHaveLength(0)
      expect(result.current.canUndo).toBe(false)
      expect(result.current.canRedo).toBe(true)
    })

    it('should maintain correct message order after rapid undos', async () => {
      const { result } = renderHook(() => useMessageOperations())

      // Add messages with specific content
      act(() => {
        result.current.addMessage({ role: 'user', content: 'First' })
        result.current.addMessage({ role: 'user', content: 'Second' })
        result.current.addMessage({ role: 'user', content: 'Third' })
        result.current.addMessage({ role: 'user', content: 'Fourth' })
        result.current.addMessage({ role: 'user', content: 'Fifth' })
      })

      // Rapidly undo 3 messages
      act(() => {
        result.current.undo()
        result.current.undo()
        result.current.undo()
      })

      await waitFor(
        () => {
          expect(result.current.messages).toHaveLength(2)
        },
        { timeout: 1000 }
      )

      // Verify correct messages remain
      expect(result.current.messages).toHaveLength(2)
      expect(result.current.messages[0]?.content).toBe('First')
      expect(result.current.messages[1]?.content).toBe('Second')
    })

    it('should not undo more operations than exist in history', async () => {
      const { result } = renderHook(() => useMessageOperations())

      // Add 3 messages
      act(() => {
        result.current.addMessage({ role: 'user', content: 'Message 1' })
        result.current.addMessage({ role: 'user', content: 'Message 2' })
        result.current.addMessage({ role: 'user', content: 'Message 3' })
      })

      // Try to undo 10 times (more than history size)
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.undo()
        }
      })

      await waitFor(
        () => {
          expect(result.current.messages).toHaveLength(0)
        },
        { timeout: 1000 }
      )

      // Should have undone exactly 3 operations, not more
      expect(result.current.messages).toHaveLength(0)
      expect(result.current.canUndo).toBe(false)
    })
  })

  describe('Rapid Redo Operations', () => {
    it('should handle rapid redo calls without corruption', async () => {
      const { result } = renderHook(() => useMessageOperations())

      // Add and undo 5 messages
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.addMessage({
            role: 'user',
            content: `Message ${i + 1}`,
          })
        }
      })

      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.undo()
        }
      })

      await waitFor(
        () => {
          expect(result.current.messages).toHaveLength(0)
        },
        { timeout: 1000 }
      )

      // Rapidly redo all 5 operations
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.redo()
        }
      })

      await waitFor(
        () => {
          expect(result.current.messages).toHaveLength(5)
        },
        { timeout: 1000 }
      )

      // Verify all messages restored
      expect(result.current.messages).toHaveLength(5)
      expect(result.current.canRedo).toBe(false)
      expect(result.current.canUndo).toBe(true)
    })

    it('should maintain message content after rapid redo', async () => {
      const { result } = renderHook(() => useMessageOperations())

      const contents = ['Alpha', 'Beta', 'Gamma', 'Delta']

      // Add messages
      act(() => {
        contents.forEach((content) => {
          result.current.addMessage({ role: 'user', content })
        })
      })

      // Undo all
      act(() => {
        contents.forEach(() => result.current.undo())
      })

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(0)
      })

      // Rapidly redo all
      act(() => {
        contents.forEach(() => result.current.redo())
      })

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(4)
      })

      // Verify content matches original
      contents.forEach((content, index) => {
        expect(result.current.messages[index]?.content).toBe(content)
      })
    })
  })

  describe('Mixed Undo/Redo Operations', () => {
    it('should handle rapid alternating undo/redo without corruption', async () => {
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

      // Rapidly alternate undo/redo
      act(() => {
        result.current.undo() // 4 messages
        result.current.undo() // 3 messages
        result.current.redo() // 4 messages
        result.current.undo() // 3 messages
        result.current.undo() // 2 messages
        result.current.redo() // 3 messages
      })

      await waitFor(
        () => {
          // Final state should be 3 messages (5 - 2 + 1 - 2 + 1)
          expect(result.current.messages).toHaveLength(3)
        },
        { timeout: 1000 }
      )

      expect(result.current.messages).toHaveLength(3)
      expect(result.current.messages[0]?.content).toBe('Message 1')
      expect(result.current.messages[1]?.content).toBe('Message 2')
      expect(result.current.messages[2]?.content).toBe('Message 3')
    })

    it('should serialize operations in FIFO order', async () => {
      const { result } = renderHook(() => useMessageOperations())

      // Add messages
      act(() => {
        result.current.addMessage({ role: 'user', content: 'Message 1' })
        result.current.addMessage({ role: 'user', content: 'Message 2' })
        result.current.addMessage({ role: 'user', content: 'Message 3' })
      })

      // Queue multiple operations rapidly
      act(() => {
        result.current.undo() // Remove Message 3
        result.current.undo() // Remove Message 2
        result.current.redo() // Restore Message 2
      })

      // Wait for all operations to complete
      await waitFor(
        () => {
          expect(result.current.messages).toHaveLength(2)
        },
        { timeout: 1000 }
      )

      // Final state should be 2 messages
      expect(result.current.messages).toHaveLength(2)
      expect(result.current.messages[0]?.content).toBe('Message 1')
      expect(result.current.messages[1]?.content).toBe('Message 2')
    })
  })

  describe('Edit Operation Race Conditions', () => {
    it('should handle undo of edit operations correctly', async () => {
      const { result } = renderHook(() => useMessageOperations())

      // Add a message
      let messageId: string = ''
      act(() => {
        messageId = result.current.addMessage({
          role: 'user',
          content: 'Original content',
        })
      })

      // Edit the message
      act(() => {
        result.current.editMessage(messageId, 'Edited content')
      })

      // Verify edit
      expect(result.current.messages[0]?.content).toBe('Edited content')

      // Rapidly undo both operations (edit, then add)
      act(() => {
        result.current.undo() // Undo edit
        result.current.undo() // Undo add
      })

      await waitFor(
        () => {
          expect(result.current.messages).toHaveLength(0)
        },
        { timeout: 1000 }
      )

      expect(result.current.messages).toHaveLength(0)
    })
  })

  describe('Stress Test', () => {
    it('should handle 50 rapid operations without corruption', async () => {
      const { result } = renderHook(() => useMessageOperations())

      // Add 50 messages
      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.addMessage({
            role: 'user',
            content: `Message ${i + 1}`,
          })
        }
      })

      // Rapidly perform 100 random operations
      act(() => {
        for (let i = 0; i < 100; i++) {
          if (Math.random() > 0.5) {
            result.current.undo()
          } else {
            result.current.redo()
          }
        }
      })

      // Wait for all operations to complete
      await waitFor(
        () => {
          // After random operations, we should have a valid state
          expect(result.current.messages.length).toBeGreaterThanOrEqual(0)
          expect(result.current.messages.length).toBeLessThanOrEqual(50)
        },
        { timeout: 2000 }
      )

      // Verify no duplicate messages
      const messageIds = result.current.messages.map((m) => m.id)
      const uniqueIds = new Set(messageIds)
      expect(messageIds.length).toBe(uniqueIds.size)

      // Verify all messages have valid content
      result.current.messages.forEach((msg) => {
        expect(msg.content).toBeTruthy()
        expect(msg.content).toMatch(/^Message \d+$/)
      })
    })
  })
})

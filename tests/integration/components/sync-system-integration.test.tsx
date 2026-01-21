/**
 * Chat Synchronization Integration Tests
 *
 * Tests the complete chat synchronization system integration across components,
 * including conflict resolution, real-time updates, and offline support.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { ChatSyncStatus, useChatSync } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/react'

// Mock sync storage implementations
class MockLocalStorage {
  private data = new Map<string, any>()

  async getAll(): Promise<any[]> {
    return Array.from(this.data.values())
  }

  async get(id: string): Promise<any | null> {
    return this.data.get(id) || null
  }

  async set(data: any): Promise<void> {
    this.data.set(data.id, data)
  }

  async delete(id: string): Promise<void> {
    this.data.delete(id)
  }
}

class MockRemoteStorage {
  private data = new Map<string, any>()
  private conflicts: any[] = []

  async getAll(since?: number): Promise<any[]> {
    const values = Array.from(this.data.values())
    if (since) {
      return values.filter(item => item.lastModified > since)
    }
    return values
  }

  async get(id: string): Promise<any | null> {
    return this.data.get(id) || null
  }

  async set(data: any): Promise<void> {
    this.data.set(data.id, data)
  }

  async delete(id: string): Promise<void> {
    this.data.delete(id)
  }

  async getConflicts(localData: any[]): Promise<any[]> {
    return this.conflicts
  }

  addConflict(conflict: any) {
    this.conflicts.push(conflict)
  }

  clearConflicts() {
    this.conflicts = []
  }

  reset() {
    this.data.clear()
    this.clearConflicts()
  }
}

// Mock storage instances
let localStorage: MockLocalStorage
let remoteStorage: MockRemoteStorage

// Mock fetch for sync API
const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  localStorage = new MockLocalStorage()
  remoteStorage = new MockRemoteStorage()

  mockFetch.mockImplementation(async (url: string, options?: any) => {
    if (url.includes('/api/sync')) {
      const method = options?.method || 'GET'

      if (method === 'GET') {
        const data = await remoteStorage.getAll()
        return {
          ok: true,
          json: () => Promise.resolve(data),
        }
      } else if (method === 'PUT') {
        const body = JSON.parse(options?.body || '{}')
        await remoteStorage.set(body)
        return { ok: true }
      }
    }

    return { ok: false, status: 404 }
  })
})

afterEach(() => {
  remoteStorage.reset()
  vi.clearAllMocks()
})

// Test component that uses sync
function SyncTestComponent({
  conversationId,
  enableRealtime = false,
  conflictStrategy = 'merge' as const,
}: {
  conversationId: string
  enableRealtime?: boolean
  conflictStrategy?: 'merge' | 'local-wins' | 'remote-wins'
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')

  const sync = useChatSync(messages, setMessages, {
    conversationId,
    apiEndpoint: '/api/sync',
    enableRealtime,
    conflictStrategy,
    syncInterval: 1000, // Fast sync for testing
  })

  const addMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
  }

  return (
    <div>
      <div data-testid="sync-status">
        <ChatSyncStatus sync={sync} compact={true} />
      </div>

      <div data-testid="messages">
        {messages.map(msg => (
          <div key={msg.id} data-testid="message">
            {msg.content}
          </div>
        ))}
      </div>

      <input
        data-testid="message-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addMessage()}
      />
      <button data-testid="send-button" onClick={addMessage}>
        Send
      </button>

      <div data-testid="sync-info">
        <div data-testid="is-online">{sync.status.isOnline ? 'online' : 'offline'}</div>
        <div data-testid="last-sync">{sync.status.lastSyncTime}</div>
        <div data-testid="pending-changes">{sync.status.pendingChanges}</div>
        <div data-testid="realtime-enabled">{sync.status.realtimeEnabled ? 'enabled' : 'disabled'}</div>
        <div data-testid="is-syncing">{sync.status.isSyncing ? 'syncing' : 'idle'}</div>
      </div>
    </div>
  )
}

describe('Chat Synchronization Integration', () => {
  describe('Basic Synchronization', () => {
    it('syncs messages between local and remote storage', async () => {
      const user = userEvent.setup()

      render(<SyncTestComponent conversationId="test-conversation" />)

      // Add a message
      const input = screen.getByTestId('message-input')
      await user.type(input, 'Hello from device 1')

      const sendButton = screen.getByTestId('send-button')
      await user.click(sendButton)

      // Message should appear locally
      await waitFor(() => {
        expect(screen.getByText('Hello from device 1')).toBeInTheDocument()
      })

      // Wait for sync
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1100))
      })

      // Check that message was synced to remote
      const remoteData = await remoteStorage.getAll()
      expect(remoteData).toHaveLength(1)
      expect(remoteData[0].data.messages[0].content).toBe('Hello from device 1')
    })

    it('loads remote messages on initialization', async () => {
      // Pre-populate remote storage
      const remoteMessage = {
        id: 'conversation_test-conversation',
        lastModified: Date.now(),
        version: 1,
        data: {
          conversationId: 'test-conversation',
          messages: [{
            id: 'remote-msg-1',
            role: 'user',
            content: 'Remote message',
            timestamp: Date.now(),
          }],
        },
      }

      await remoteStorage.set(remoteMessage)

      render(<SyncTestComponent conversationId="test-conversation" />)

      // Remote message should load
      await waitFor(() => {
        expect(screen.getByText('Remote message')).toBeInTheDocument()
      })
    })

    it('handles offline/online transitions', async () => {
      const user = userEvent.setup()

      render(<SyncTestComponent conversationId="test-conversation" />)

      // Initially online
      expect(screen.getByTestId('is-online')).toHaveTextContent('online')

      // Simulate going offline
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })

      // Trigger online/offline event
      window.dispatchEvent(new Event('offline'))

      await waitFor(() => {
        expect(screen.getByTestId('is-online')).toHaveTextContent('offline')
      })

      // Add message while offline
      const input = screen.getByTestId('message-input')
      await user.type(input, 'Offline message')

      const sendButton = screen.getByTestId('send-button')
      await user.click(sendButton)

      // Message should still appear
      await waitFor(() => {
        expect(screen.getByText('Offline message')).toBeInTheDocument()
      })

      // Should be queued for sync
      expect(screen.getByTestId('pending-changes')).toHaveTextContent('1')

      // Simulate coming back online
      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
      window.dispatchEvent(new Event('online'))

      await waitFor(() => {
        expect(screen.getByTestId('is-online')).toHaveTextContent('online')
      })

      // Wait for sync
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1100))
      })

      // Message should be synced
      const remoteData = await remoteStorage.getAll()
      expect(remoteData[0].data.messages.some((m: any) => m.content === 'Offline message')).toBe(true)
    })
  })

  describe('Conflict Resolution', () => {
    it('merges concurrent changes automatically', async () => {
      // Set up initial message
      const initialMessage = {
        id: 'conversation_test-conversation',
        lastModified: Date.now() - 10000,
        version: 1,
        data: {
          conversationId: 'test-conversation',
          messages: [{
            id: 'initial-msg',
            role: 'user',
            content: 'Initial message',
            timestamp: Date.now() - 10000,
          }],
        },
      }

      await remoteStorage.set(initialMessage)

      const { rerender } = render(<SyncTestComponent conversationId="test-conversation" />)

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Initial message')).toBeInTheDocument()
      })

      // Simulate concurrent edit from another device (newer timestamp)
      const concurrentMessage = {
        id: 'conversation_test-conversation',
        lastModified: Date.now(),
        version: 2,
        data: {
          conversationId: 'test-conversation',
          messages: [
            {
              id: 'initial-msg',
              role: 'user',
              content: 'Initial message',
              timestamp: Date.now() - 10000,
            },
            {
              id: 'concurrent-msg',
              role: 'user',
              content: 'Concurrent edit',
              timestamp: Date.now(),
            },
          ],
        },
      }

      await remoteStorage.set(concurrentMessage)

      // Trigger sync
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1100))
      })

      // Both messages should be present (merged)
      await waitFor(() => {
        expect(screen.getByText('Initial message')).toBeInTheDocument()
        expect(screen.getByText('Concurrent edit')).toBeInTheDocument()
      })
    })

    it('handles local-wins conflict strategy', async () => {
      // Set up conflicting remote data
      const remoteData = {
        id: 'conversation_test-conversation',
        lastModified: Date.now(),
        version: 1,
        data: {
          conversationId: 'test-conversation',
          messages: [{
            id: 'msg-1',
            role: 'user',
            content: 'Remote version',
            timestamp: Date.now(),
          }],
        },
      }

      await remoteStorage.set(remoteData)

      render(<SyncTestComponent conversationId="test-conversation" conflictStrategy="local-wins" />)

      // Add local message
      const user = userEvent.setup()
      const input = screen.getByTestId('message-input')
      await user.type(input, 'Local version')

      const sendButton = screen.getByTestId('send-button')
      await user.click(sendButton)

      // Create local data with newer timestamp
      const localData = {
        id: 'conversation_test-conversation',
        lastModified: Date.now() + 1000,
        version: 2,
        data: {
          conversationId: 'test-conversation',
          messages: [{
            id: 'msg-2',
            role: 'user',
            content: 'Local version',
            timestamp: Date.now() + 1000,
          }],
        },
      }

      await localStorage.set(localData)

      // Trigger sync - local should win
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1100))
      })

      // Local version should be kept
      await waitFor(() => {
        expect(screen.getByText('Local version')).toBeInTheDocument()
        expect(screen.queryByText('Remote version')).not.toBeInTheDocument()
      })
    })
  })

  describe('Real-time Synchronization', () => {
    it('receives real-time updates when enabled', async () => {
      render(<SyncTestComponent conversationId="test-conversation" enableRealtime={true} />)

      // Initially no realtime
      expect(screen.getByTestId('realtime-enabled')).toHaveTextContent('enabled')

      // Simulate real-time update from server
      const realtimeUpdate = {
        id: 'conversation_test-conversation',
        lastModified: Date.now(),
        version: 1,
        data: {
          conversationId: 'test-conversation',
          messages: [{
            id: 'realtime-msg',
            role: 'assistant',
            content: 'Real-time message',
            timestamp: Date.now(),
          }],
        },
      }

      // Dispatch custom event to simulate real-time sync
      await act(async () => {
        window.dispatchEvent(new CustomEvent('chat-sync-update', {
          detail: realtimeUpdate,
        }))
      })

      // Message should appear immediately
      await waitFor(() => {
        expect(screen.getByText('Real-time message')).toBeInTheDocument()
      })
    })

    it('can be toggled on and off', async () => {
      const user = userEvent.setup()

      render(<SyncTestComponent conversationId="test-conversation" enableRealtime={true} />)

      // Initially enabled
      expect(screen.getByTestId('realtime-enabled')).toHaveTextContent('enabled')

      // Click the toggle (assuming the component exposes it)
      const toggleButton = screen.getByRole('button', { name: /real-time sync/i })
      if (toggleButton) {
        await user.click(toggleButton)

        await waitFor(() => {
          expect(screen.getByTestId('realtime-enabled')).toHaveTextContent('disabled')
        })
      }
    })
  })

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      // Mock network failure
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const user = userEvent.setup()

      render(<SyncTestComponent conversationId="test-conversation" />)

      // Add message
      const input = screen.getByTestId('message-input')
      await user.type(input, 'Test message')

      const sendButton = screen.getByTestId('send-button')
      await user.click(sendButton)

      // Message should still appear locally
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument()
      })

      // Should show sync error
      await waitFor(() => {
        expect(screen.getByText(/Sync Error/i)).toBeInTheDocument()
      })
    })

    it('retries failed sync operations', async () => {
      let callCount = 0
      mockFetch.mockImplementation(async () => {
        callCount++
        if (callCount === 1) {
          throw new Error('Temporary failure')
        }

        // Success on retry
        const data = await remoteStorage.getAll()
        return {
          ok: true,
          json: () => Promise.resolve(data),
        }
      })

      const user = userEvent.setup()

      render(<SyncTestComponent conversationId="test-conversation" />)

      // Add message
      const input = screen.getByTestId('message-input')
      await user.type(input, 'Retry test')

      const sendButton = screen.getByTestId('send-button')
      await user.click(sendButton)

      // Wait for retry and success
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
      })

      // Should eventually sync successfully
      const remoteData = await remoteStorage.getAll()
      expect(remoteData.some((d: any) => d.data.messages.some((m: any) => m.content === 'Retry test'))).toBe(true)
    })

    it('displays sync errors in status component', async () => {
      mockFetch.mockRejectedValue(new Error('Persistent network error'))

      render(<SyncTestComponent conversationId="test-conversation" />)

      // Wait for sync attempt
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1100))
      })

      // Should show error in status
      expect(screen.getByText(/Sync Error/i)).toBeInTheDocument()

      // Should show error details when expanded
      const errorToggle = screen.getByRole('button', { name: /sync error/i })
      if (errorToggle) {
        await userEvent.click(errorToggle)
        expect(screen.getByText(/Persistent network error/i)).toBeInTheDocument()
      }
    })
  })

  describe('Manual Sync Control', () => {
    it('allows manual sync triggering', async () => {
      const user = userEvent.setup()

      render(<SyncTestComponent conversationId="test-conversation" />)

      // Add message
      const input = screen.getByTestId('message-input')
      await user.type(input, 'Manual sync test')

      const sendButton = screen.getByTestId('send-button')
      await user.click(sendButton)

      // Wait for auto-sync
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1100))
      })

      // Click manual sync button
      const syncButton = screen.getByRole('button', { name: /sync now/i })
      await user.click(syncButton)

      // Should trigger sync
      await waitFor(() => {
        expect(screen.getByTestId('is-syncing')).toHaveTextContent('syncing')
      })

      await waitFor(() => {
        expect(screen.getByTestId('is-syncing')).toHaveTextContent('idle')
      })
    })

    it('shows sync progress and results', async () => {
      const user = userEvent.setup()

      render(<SyncTestComponent conversationId="test-conversation" />)

      // Add multiple messages
      for (let i = 1; i <= 3; i++) {
        const input = screen.getByTestId('message-input')
        await user.clear(input)
        await user.type(input, `Message ${i}`)

        const sendButton = screen.getByTestId('send-button')
        await user.click(sendButton)
      }

      // Trigger manual sync
      const syncButton = screen.getByRole('button', { name: /sync now/i })
      await user.click(syncButton)

      // Should show sync progress
      await waitFor(() => {
        expect(screen.getByTestId('is-syncing')).toHaveTextContent('syncing')
      })

      // Should complete and show results
      await waitFor(() => {
        expect(screen.getByTestId('is-syncing')).toHaveTextContent('idle')
      })

      // Check sync results are displayed
      const lastSyncTime = screen.getByTestId('last-sync')
      expect(parseInt(lastSyncTime.textContent || '0')).toBeGreaterThan(0)
    })
  })
})
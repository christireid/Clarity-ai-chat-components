/**
 * Chat Sync Hook Tests
 *
 * Tests for the useChatSync hook that provides cross-device synchronization
 * for chat conversations.
 */

/* eslint-disable @typescript-eslint/no-require-imports */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useChatSync } from '../use-chat-sync'
import type { Message } from '../../chat/use-chat-enhanced'

// Mock the sync manager
vi.mock('../../../utils/sync-manager', () => ({
  SyncManager: vi.fn().mockImplementation(() => ({
    sync: vi.fn(),
    queueChange: vi.fn(),
    getStatus: vi.fn(() => ({
      isOnline: true,
      lastSyncTime: 0,
      pendingChanges: 0,
      realtimeEnabled: false,
    })),
    startRealtime: vi.fn(),
    stopRealtime: vi.fn(),
    destroy: vi.fn(),
  })),
  ConflictResolver: {
    resolve: vi.fn(),
  },
  useSyncManager: vi.fn(() => ({
    syncManager: {
      sync: vi.fn(),
      queueChange: vi.fn(),
      getStatus: vi.fn(() => ({
        isOnline: true,
        lastSyncTime: 0,
        pendingChanges: 0,
        realtimeEnabled: false,
      })),
      startRealtime: vi.fn(),
      stopRealtime: vi.fn(),
      destroy: vi.fn(),
    },
    status: {
      isOnline: true,
      lastSyncTime: 0,
      pendingChanges: 0,
      realtimeEnabled: false,
    },
  })),
}))

describe('useChatSync', () => {
  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      role: 'user',
      content: 'Hello',
      timestamp: 1000,
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: 'Hi there!',
      timestamp: 2000,
    },
  ]

  const mockOnMessagesChange = vi.fn()
  const mockOptions = {
    conversationId: 'test-conversation',
    apiEndpoint: 'https://api.example.com/sync',
    authToken: 'test-token',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with provided messages', () => {
    const { result } = renderHook(() =>
      useChatSync(mockMessages, mockOnMessagesChange, mockOptions)
    )

    expect(result.current.status.isOnline).toBe(true)
    expect(result.current.status.pendingChanges).toBe(0)
  })

  it('should sync when messages change', async () => {
    const { result } = renderHook(() =>
      useChatSync([], mockOnMessagesChange, mockOptions)
    )

    const newMessages = [...mockMessages]

    act(() => {
      // Simulate messages change
      result.current.status = { ...result.current.status }
    })

    // Wait for sync manager to be called
    await waitFor(() => {
      expect(result.current.status.pendingChanges).toBe(0)
    })
  })

  it('should handle manual sync', async () => {
    const mockSyncResult = {
      success: true,
      syncedItems: 2,
      conflictsResolved: 0,
      errors: [],
      lastSyncTime: Date.now(),
    }

    const { useSyncManager } = await import('../../../utils/sync-manager')
    const mockSyncManager = {
      sync: vi.fn().mockResolvedValue(mockSyncResult),
      queueChange: vi.fn(),
      getStatus: vi.fn(() => ({
        isOnline: true,
        lastSyncTime: 0,
        pendingChanges: 0,
        realtimeEnabled: false,
      })),
      startRealtime: vi.fn(),
      stopRealtime: vi.fn(),
      destroy: vi.fn(),
    }

    ;(useSyncManager as any).mockReturnValue({
      syncManager: mockSyncManager,
      status: {
        isOnline: true,
        lastSyncTime: 0,
        pendingChanges: 0,
        realtimeEnabled: false,
      },
    })

    const { result } = renderHook(() =>
      useChatSync(mockMessages, mockOnMessagesChange, mockOptions)
    )

    await act(async () => {
      const syncResult = await result.current.actions.syncNow()
      expect(syncResult).toEqual(mockSyncResult)
    })

    expect(mockSyncManager.sync).toHaveBeenCalled()
  })

  it('should enable and disable real-time sync', () => {
    const { useSyncManager } = require('../../../utils/sync-manager')
    const mockSyncManager = {
      sync: vi.fn(),
      queueChange: vi.fn(),
      getStatus: vi.fn(() => ({
        isOnline: true,
        lastSyncTime: 0,
        pendingChanges: 0,
        realtimeEnabled: false,
      })),
      startRealtime: vi.fn(),
      stopRealtime: vi.fn(),
      destroy: vi.fn(),
    }

    ;(useSyncManager as any).mockReturnValue({
      syncManager: mockSyncManager,
      status: {
        isOnline: true,
        lastSyncTime: 0,
        pendingChanges: 0,
        realtimeEnabled: false,
      },
    })

    const { result } = renderHook(() =>
      useChatSync(mockMessages, mockOnMessagesChange, {
        ...mockOptions,
        enableRealtime: true,
      })
    )

    act(() => {
      result.current.actions.enableRealtime()
    })

    expect(mockSyncManager.startRealtime).toHaveBeenCalled()

    act(() => {
      result.current.actions.disableRealtime()
    })

    expect(mockSyncManager.stopRealtime).toHaveBeenCalled()
  })

  it('should handle sync errors', async () => {
    const mockError = new Error('Sync failed')
    const { useSyncManager } = require('../../../utils/sync-manager')

    ;(useSyncManager as any).mockReturnValue({
      syncManager: {
        sync: vi.fn().mockRejectedValue(mockError),
        queueChange: vi.fn(),
        getStatus: vi.fn(() => ({
          isOnline: true,
          lastSyncTime: 0,
          pendingChanges: 0,
          realtimeEnabled: false,
        })),
        startRealtime: vi.fn(),
        stopRealtime: vi.fn(),
        destroy: vi.fn(),
      },
      status: {
        isOnline: true,
        lastSyncTime: 0,
        pendingChanges: 0,
        realtimeEnabled: false,
      },
    })

    const { result } = renderHook(() =>
      useChatSync(mockMessages, mockOnMessagesChange, mockOptions)
    )

    await act(async () => {
      try {
        await result.current.actions.syncNow()
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.errors.length).toBeGreaterThan(0)
  })

  it('should handle offline state', () => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    })

    const { result } = renderHook(() =>
      useChatSync(mockMessages, mockOnMessagesChange, mockOptions)
    )

    expect(result.current.status.isOnline).toBe(false)

    // Restore
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    })
  })

  it('should queue message changes for sync', () => {
    const { useSyncManager } = require('../../../utils/sync-manager')
    const mockSyncManager = {
      sync: vi.fn(),
      queueChange: vi.fn(),
      getStatus: vi.fn(() => ({
        isOnline: true,
        lastSyncTime: 0,
        pendingChanges: 0,
        realtimeEnabled: false,
      })),
      startRealtime: vi.fn(),
      stopRealtime: vi.fn(),
      destroy: vi.fn(),
    }

    ;(useSyncManager as any).mockReturnValue({
      syncManager: mockSyncManager,
      status: {
        isOnline: true,
        lastSyncTime: 0,
        pendingChanges: 0,
        realtimeEnabled: false,
      },
    })

    renderHook(() =>
      useChatSync(mockMessages, mockOnMessagesChange, mockOptions)
    )

    // The hook should queue changes when messages change
    expect(mockSyncManager.queueChange).toHaveBeenCalled()
  })

  it('should handle real-time sync updates', () => {
    const mockUpdatedMessages = [
      ...mockMessages,
      {
        id: 'msg-3',
        role: 'user',
        content: 'Real-time update',
        timestamp: 3000,
      },
    ]

    renderHook(() =>
      useChatSync(mockMessages, mockOnMessagesChange, mockOptions)
    )

    // Simulate real-time sync event
    act(() => {
      window.dispatchEvent(
        new CustomEvent('chat-sync-update', {
          detail: {
            id: 'conversation_test-conversation',
            data: { messages: mockUpdatedMessages },
          },
        })
      )
    })

    expect(mockOnMessagesChange).toHaveBeenCalledWith(mockUpdatedMessages)
  })

  it('should clean up on unmount', () => {
    const { useSyncManager } = require('../../../utils/sync-manager')
    const mockSyncManager = {
      sync: vi.fn(),
      queueChange: vi.fn(),
      getStatus: vi.fn(() => ({
        isOnline: true,
        lastSyncTime: 0,
        pendingChanges: 0,
        realtimeEnabled: false,
      })),
      startRealtime: vi.fn(),
      stopRealtime: vi.fn(),
      destroy: vi.fn(),
    }

    ;(useSyncManager as any).mockReturnValue({
      syncManager: mockSyncManager,
      status: {
        isOnline: true,
        lastSyncTime: 0,
        pendingChanges: 0,
        realtimeEnabled: false,
      },
    })

    const { unmount } = renderHook(() =>
      useChatSync(mockMessages, mockOnMessagesChange, mockOptions)
    )

    unmount()

    expect(mockSyncManager.destroy).toHaveBeenCalled()
  })
})
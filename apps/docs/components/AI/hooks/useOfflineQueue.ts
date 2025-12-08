/**
 * useOfflineQueue Hook
 *
 * Manages offline message queuing with localStorage persistence.
 * Messages are queued when offline and automatically sent when back online.
 *
 * SSR-Safe: Uses lazy initialization to avoid hydration mismatches.
 * Listens to native browser online/offline events for automatic detection.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Message } from '@clarity-chat/types'

const MESSAGE_QUEUE_KEY = 'clarity-docs-assistant-queue'

export interface QueuedMessage {
  id: string
  content: string
  timestamp: number
}

export interface UseOfflineQueueOptions {
  onQueueMessage?: (message: QueuedMessage) => void
  onProcessQueue?: (queue: QueuedMessage[]) => void
  onStatusChange?: (isOnline: boolean) => void
}

export interface UseOfflineQueueReturn {
  isOnline: boolean
  messageQueue: QueuedMessage[]
  queueMessage: (content: string) => QueuedMessage
  processQueue: (
    sendMessage: (content: string) => Promise<void>
  ) => Promise<void>
  clearQueue: () => void
  handleNetworkStatusChange: (
    status: 'online' | 'offline' | 'slow' | 'unstable'
  ) => void
}

/**
 * Safely check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined'

/**
 * Safely get initial online status (SSR-safe)
 */
function getInitialOnlineStatus(): boolean {
  if (!isBrowser) return true // Assume online during SSR
  return navigator.onLine ?? true
}

/**
 * Safely load queue from localStorage (SSR-safe)
 */
function loadQueueFromStorage(): QueuedMessage[] {
  if (!isBrowser) return []
  try {
    const savedQueue = localStorage.getItem(MESSAGE_QUEUE_KEY)
    if (savedQueue) {
      const parsed = JSON.parse(savedQueue) as QueuedMessage[]
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Failed to load message queue:', e)
  }
  return []
}

export function useOfflineQueue(
  options: UseOfflineQueueOptions = {}
): UseOfflineQueueReturn {
  const { onQueueMessage, onProcessQueue, onStatusChange } = options

  // Use lazy initialization to avoid hydration mismatch
  // Initial state matches server (true for online, [] for queue)
  const [isOnline, setIsOnline] = useState(true)
  const [messageQueue, setMessageQueue] = useState<QueuedMessage[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const isProcessingQueueRef = useRef<boolean>(false)

  // Hydrate state from localStorage after mount (SSR-safe)
  useEffect(() => {
    setIsOnline(getInitialOnlineStatus())
    setMessageQueue(loadQueueFromStorage())
    setIsHydrated(true)
  }, [])

  // Listen to native browser online/offline events
  useEffect(() => {
    if (!isBrowser) return

    const handleOnline = () => {
      setIsOnline(true)
      onStatusChange?.(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
      onStatusChange?.(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onStatusChange])

  // Save queue to localStorage when it changes (SSR-safe)
  useEffect(() => {
    // Only persist after hydration to avoid SSR issues
    if (!isBrowser || !isHydrated) return

    try {
      if (messageQueue.length > 0) {
        localStorage.setItem(MESSAGE_QUEUE_KEY, JSON.stringify(messageQueue))
      } else {
        localStorage.removeItem(MESSAGE_QUEUE_KEY)
      }
    } catch (e) {
      console.error('Failed to save message queue:', e)
    }
  }, [messageQueue, isHydrated])

  // Handle network status changes
  const handleNetworkStatusChange = useCallback(
    (status: 'online' | 'offline' | 'slow' | 'unstable') => {
      const wasOffline = !isOnline
      const nowOnline =
        status === 'online' || status === 'slow' || status === 'unstable'

      setIsOnline(nowOnline)
      onStatusChange?.(nowOnline)

      // If we just came back online and have queued messages, trigger callback
      if (wasOffline && nowOnline && messageQueue.length > 0) {
        onProcessQueue?.(messageQueue)
      }
    },
    [isOnline, messageQueue, onStatusChange, onProcessQueue]
  )

  // Queue a message for later sending
  const queueMessage = useCallback(
    (content: string): QueuedMessage => {
      const queuedMsg: QueuedMessage = {
        id: `queued-${Date.now()}`,
        content,
        timestamp: Date.now(),
      }
      setMessageQueue((prev) => [...prev, queuedMsg])
      onQueueMessage?.(queuedMsg)
      return queuedMsg
    },
    [onQueueMessage]
  )

  // Process the message queue
  const processQueue = useCallback(
    async (sendMessage: (content: string) => Promise<void>) => {
      if (isProcessingQueueRef.current) return
      if (!isOnline || messageQueue.length === 0) return

      isProcessingQueueRef.current = true
      const queue = [...messageQueue]
      setMessageQueue([]) // Clear queue first to prevent duplicate processing

      try {
        for (const queuedMsg of queue) {
          await sendMessage(queuedMsg.content)
          // Small delay between messages to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      } finally {
        isProcessingQueueRef.current = false
      }
    },
    [isOnline, messageQueue]
  )

  // Clear the queue (SSR-safe)
  const clearQueue = useCallback(() => {
    setMessageQueue([])
    if (isBrowser) {
      localStorage.removeItem(MESSAGE_QUEUE_KEY)
    }
  }, [])

  return {
    isOnline,
    messageQueue,
    queueMessage,
    processQueue,
    clearQueue,
    handleNetworkStatusChange,
  }
}

/**
 * Create a pending message for the UI when queueing
 */
export function createPendingMessage(queuedMsg: QueuedMessage): Message {
  return {
    id: queuedMsg.id,
    chatId: 'docs-assistant',
    role: 'user',
    content: queuedMsg.content,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'sending',
  }
}

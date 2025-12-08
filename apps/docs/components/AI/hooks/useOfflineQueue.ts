/**
 * useOfflineQueue Hook
 *
 * Manages offline message queuing with localStorage persistence.
 * Messages are queued when offline and automatically sent when back online.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Message } from '@clarity-chat/types'

const MESSAGE_QUEUE_KEY = 'clarity-docs-assistant-queue'
const QUEUE_PROCESS_DELAY_MS = 1000

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
  processQueue: (sendMessage: (content: string) => Promise<void>) => Promise<void>
  clearQueue: () => void
  handleNetworkStatusChange: (status: 'online' | 'offline' | 'slow' | 'unstable') => void
}

export function useOfflineQueue(options: UseOfflineQueueOptions = {}): UseOfflineQueueReturn {
  const { onQueueMessage, onProcessQueue, onStatusChange } = options

  const [isOnline, setIsOnline] = useState(true)
  const [messageQueue, setMessageQueue] = useState<QueuedMessage[]>([])
  const isProcessingQueueRef = useRef<boolean>(false)

  // Load queue from localStorage on mount
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem(MESSAGE_QUEUE_KEY)
      if (savedQueue) {
        const parsed = JSON.parse(savedQueue) as QueuedMessage[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessageQueue(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to load message queue:', e)
    }
  }, [])

  // Save queue to localStorage when it changes
  useEffect(() => {
    try {
      if (messageQueue.length > 0) {
        localStorage.setItem(MESSAGE_QUEUE_KEY, JSON.stringify(messageQueue))
      } else {
        localStorage.removeItem(MESSAGE_QUEUE_KEY)
      }
    } catch (e) {
      console.error('Failed to save message queue:', e)
    }
  }, [messageQueue])

  // Handle network status changes
  const handleNetworkStatusChange = useCallback((status: 'online' | 'offline' | 'slow' | 'unstable') => {
    const wasOffline = !isOnline
    const nowOnline = status === 'online' || status === 'slow' || status === 'unstable'

    setIsOnline(nowOnline)
    onStatusChange?.(nowOnline)

    // If we just came back online and have queued messages, trigger callback
    if (wasOffline && nowOnline && messageQueue.length > 0) {
      onProcessQueue?.(messageQueue)
    }
  }, [isOnline, messageQueue, onStatusChange, onProcessQueue])

  // Queue a message for later sending
  const queueMessage = useCallback((content: string): QueuedMessage => {
    const queuedMsg: QueuedMessage = {
      id: `queued-${Date.now()}`,
      content,
      timestamp: Date.now(),
    }
    setMessageQueue(prev => [...prev, queuedMsg])
    onQueueMessage?.(queuedMsg)
    return queuedMsg
  }, [onQueueMessage])

  // Process the message queue
  const processQueue = useCallback(async (sendMessage: (content: string) => Promise<void>) => {
    if (isProcessingQueueRef.current) return
    if (!isOnline || messageQueue.length === 0) return

    isProcessingQueueRef.current = true
    const queue = [...messageQueue]
    setMessageQueue([]) // Clear queue first to prevent duplicate processing

    try {
      for (const queuedMsg of queue) {
        await sendMessage(queuedMsg.content)
        // Small delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } finally {
      isProcessingQueueRef.current = false
    }
  }, [isOnline, messageQueue])

  // Clear the queue
  const clearQueue = useCallback(() => {
    setMessageQueue([])
    localStorage.removeItem(MESSAGE_QUEUE_KEY)
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

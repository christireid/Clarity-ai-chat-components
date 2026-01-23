/**
 * Shared hooks for demo components
 * Provides reusable React hooks for common demo patterns
 */

import { useRef, useEffect, useState, useCallback } from 'react'
import { sleep } from './utils'

/**
 * Hook to track component mount state
 * Returns a ref that is true when mounted, false after unmount
 * Use this to prevent state updates after component unmounts
 *
 * @example
 * const isMountedRef = useMountedRef()
 *
 * const fetchData = async () => {
 *   await someAsyncOperation()
 *   if (!isMountedRef.current) return // Bail if unmounted
 *   setData(result)
 * }
 */
export const useMountedRef = () => {
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return isMountedRef
}

/**
 * Hook for simulating streaming text character by character
 *
 * @param options - Configuration options
 * @returns Object with stream function and current text
 *
 * @example
 * const { streamText, currentText, isStreaming } = useSimulatedStream()
 *
 * const handleSend = async () => {
 *   await streamText("Hello, I'm streaming!")
 * }
 */
export const useSimulatedStream = (options?: {
  minDelay?: number
  maxDelay?: number
  onComplete?: () => void
}) => {
  const { minDelay = 15, maxDelay = 25, onComplete } = options || {}
  const [currentText, setCurrentText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const isMountedRef = useMountedRef()
  const cancelRef = useRef(false)

  const cancel = useCallback(() => {
    cancelRef.current = true
  }, [])

  const reset = useCallback(() => {
    setCurrentText('')
    setIsStreaming(false)
    cancelRef.current = false
  }, [])

  const streamText = useCallback(async (text: string): Promise<boolean> => {
    if (isStreaming) return false

    setIsStreaming(true)
    cancelRef.current = false
    let accumulated = ''

    for (const char of text) {
      if (cancelRef.current || !isMountedRef.current) {
        setIsStreaming(false)
        return false
      }
      accumulated += char
      setCurrentText(accumulated)
      await sleep(minDelay + Math.random() * (maxDelay - minDelay))
    }

    if (isMountedRef.current) {
      setIsStreaming(false)
      onComplete?.()
    }
    return true
  }, [isStreaming, minDelay, maxDelay, onComplete, isMountedRef])

  return {
    streamText,
    currentText,
    isStreaming,
    cancel,
    reset,
    setCurrentText,
  }
}

/**
 * Hook for managing copy-to-clipboard state with automatic reset
 *
 * @param resetDelay - Delay in ms before resetting copied state (default: 2000)
 * @returns Object with copy function and copied state
 *
 * @example
 * const { copy, copied } = useCopyToClipboard()
 *
 * <button onClick={() => copy(code)}>
 *   {copied ? 'Copied!' : 'Copy'}
 * </button>
 */
export const useCopyToClipboard = (resetDelay = 2000) => {
  const [copied, setCopied] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const isMountedRef = useMountedRef()

  const copy = useCallback(async (text: string, id?: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (id) setCopiedId(id)
      setTimeout(() => {
        if (isMountedRef.current) {
          setCopied(false)
          setCopiedId(null)
        }
      }, resetDelay)
      return true
    } catch {
      // Fallback for browsers without Clipboard API
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.top = '-9999px'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        const success = document.execCommand('copy')
        document.body.removeChild(textarea)
        if (success) {
          setCopied(true)
          if (id) setCopiedId(id)
          setTimeout(() => {
            if (isMountedRef.current) {
              setCopied(false)
              setCopiedId(null)
            }
          }, resetDelay)
        }
        return success
      } catch {
        return false
      }
    }
  }, [resetDelay, isMountedRef])

  const isCopied = useCallback((id: string) => copiedId === id, [copiedId])

  return { copy, copied, copiedId, isCopied }
}

/**
 * Hook for managing async demo operations with proper cleanup
 * Provides loading state and cancellation support
 *
 * @example
 * const { execute, isExecuting, cancel } = useDemoExecution()
 *
 * const runDemo = () => execute(async (signal) => {
 *   await step1()
 *   if (signal.cancelled) return
 *   await step2()
 * })
 */
export const useDemoExecution = () => {
  const [isExecuting, setIsExecuting] = useState(false)
  const isMountedRef = useMountedRef()
  const cancelRef = useRef(false)

  const cancel = useCallback(() => {
    cancelRef.current = true
  }, [])

  const execute = useCallback(async <T>(
    fn: (signal: { cancelled: boolean; isMounted: boolean }) => Promise<T>
  ): Promise<T | undefined> => {
    if (isExecuting) return undefined

    setIsExecuting(true)
    cancelRef.current = false

    try {
      const result = await fn({
        get cancelled() { return cancelRef.current },
        get isMounted() { return isMountedRef.current },
      })
      return result
    } finally {
      if (isMountedRef.current) {
        setIsExecuting(false)
      }
    }
  }, [isExecuting, isMountedRef])

  return { execute, isExecuting, cancel }
}

/**
 * Hook for managing demo message state
 * Provides common operations for chat-like demos
 */
export interface DemoMessage<T = Record<string, unknown>> {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isStreaming?: boolean
  metadata?: T
}

export const useDemoMessages = <T = Record<string, unknown>>(
  initialMessages: DemoMessage<T>[] = []
) => {
  const [messages, setMessages] = useState<DemoMessage<T>[]>(initialMessages)

  const addMessage = useCallback((message: Omit<DemoMessage<T>, 'id' | 'timestamp'> & { id?: string }) => {
    const newMessage: DemoMessage<T> = {
      id: message.id || `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date(),
      ...message,
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }, [])

  const updateMessage = useCallback((id: string, updates: Partial<DemoMessage<T>>) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, ...updates } : msg
    ))
  }, [])

  const reset = useCallback(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  return { messages, setMessages, addMessage, updateMessage, reset }
}

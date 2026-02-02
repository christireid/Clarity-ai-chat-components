'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Message, Attachment } from './types'
import { TokenOptimizer } from '@clarity-chat/token-optimization'
import { StreamParser } from '@/lib/streaming/StreamParser'
import { StreamType } from '@/lib/streaming/StreamProtocol'
import type { SDKConfig } from '../devtools/SDKDevTools'
import { compilePrompt } from '@/lib/prompt-template'
import { ChatMiddleware } from './middleware'
import { z } from 'zod'

// ... (Interfaces remain same) ...
interface UseAdvancedChatOptions {
  api?: string
  initialMessages?: Message[]
  optimizerConfig?: {
    enabled: boolean
    contextWindow: number
  }
  initialConfig?: SDKConfig
  persistenceKey?: string
  middleware?: ChatMiddleware[]
  onResponse?: (message: Message) => void
  onFinish?: (messages: Message[]) => void
}

interface UseAdvancedChatResult {
  messages: Message[]
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  handleSubmit: (e?: React.FormEvent, metadata?: any) => Promise<void>
  append: (message: Message, schema?: z.ZodSchema) => Promise<void>
  reload: () => Promise<void>
  stop: () => void
  clear: () => void
  setMessages: (messages: Message[]) => void
  optimizationStats?: any
  streamLogs: string[]
  ragContext: any[]
  config: SDKConfig
  setConfig: (config: SDKConfig) => void
  contextWindow: Message[]
}

const optimizer = new TokenOptimizer({
  contextWindow: {
    maxTokens: 4000,
    strategy: 'hybrid',
    keepSystemMessages: true,
  },
  memoryConfig: {
    shortTermSize: 10,
    longTermSize: 50,
    compressionThreshold: 100,
  },
})

export function useAdvancedChat({
  api = process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/stream`
    : '/api/chat/stream',
  initialMessages = [],
  optimizerConfig = { enabled: true, contextWindow: 4000 },
  initialConfig = {
    systemPrompt: 'You are a helpful assistant.',
    temperature: 0.7,
    model: 'gpt-5.2',
  },
  persistenceKey,
  middleware = [],
  onResponse,
  onFinish,
}: UseAdvancedChatOptions = {}): UseAdvancedChatResult {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [optimizationStats, setOptimizationStats] = useState<any>(null)
  const [streamLogs, setStreamLogs] = useState<string[]>([])
  const [ragContext, setRagContext] = useState<any[]>([])
  const [config, setConfig] = useState<SDKConfig>(initialConfig)
  const [contextWindow, setContextWindow] = useState<Message[]>([])

  const parserRef = useRef(new StreamParser())
  const abortControllerRef = useRef<AbortController | null>(null)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    if (persistenceKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(persistenceKey)
      if (saved) {
        try {
          const parsed = JSON.parse(saved, (key, value) => {
            if (key === 'timestamp') return new Date(value)
            return value
          })
          setMessages(parsed)
        } catch (e) {
          console.error('Failed to load chat history', e)
        }
      }
    }
  }, [persistenceKey])

  useEffect(() => {
    if (isMounted.current && persistenceKey && messages.length > 0) {
      localStorage.setItem(persistenceKey, JSON.stringify(messages))
    }
  }, [messages, persistenceKey])

  const processMessage = async (
    originalUserMessage: Message,
    schema?: z.ZodSchema
  ) => {
    setIsLoading(true)
    setStreamLogs([])
    setRagContext([])
    abortControllerRef.current = new AbortController()

    try {
      // 1. Run Request Middleware
      let processedMessages = [originalUserMessage]
      for (const mw of middleware) {
        if (mw.onRequest) {
          const prevLen = JSON.stringify(processedMessages).length
          processedMessages = await mw.onRequest(processedMessages)
          const newLen = JSON.stringify(processedMessages).length
          if (prevLen !== newLen) {
            setStreamLogs((prev) => [
              ...prev,
              `Middleware modified request (${prevLen} -> ${newLen} chars)`,
            ])
          }
        }
      }

      const userMessage = processedMessages[0]
      let newMessages = [...messages, userMessage]
      setMessages(newMessages)

      // 2. Compile System Prompt
      const compiledSystemPrompt = compilePrompt(config.systemPrompt, {
        date: new Date().toLocaleDateString(),
        language: 'English',
      })
      setStreamLogs((prev) => [...prev, `System Prompt Compiled`])

      // 3. RAG Retrieval
      const retrievedDocs = optimizer.rag.retrieve(userMessage.content)
      setRagContext(retrievedDocs)
      if (retrievedDocs.length > 0) {
        setStreamLogs((prev) => [
          ...prev,
          `RAG: Retrieved ${retrievedDocs.length} docs`,
        ])
      }

      // 4. Token Optimization
      let contextToSend = newMessages
      if (optimizerConfig.enabled) {
        const optimized = optimizer.context.optimize(newMessages)
        setOptimizationStats(optimized.stats)
        contextToSend = optimized.messages
        setContextWindow(optimized.messages)
        setStreamLogs((prev) => [
          ...prev,
          `Token Optimization: Saved ${optimized.stats.saved} tokens`,
        ])
      } else {
        setContextWindow(newMessages)
      }

      // Prepare Response Message
      const generateId = () => Math.random().toString(36).substring(7)
      const aiResponseId = generateId()

      setMessages((currentMsgs) => [
        ...currentMsgs,
        {
          id: aiResponseId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          status: 'sending',
          thinkingSteps: [], // Initialize thinkingSteps
        },
      ])

      const unsubscribe = parserRef.current.subscribe((part) => {
        setStreamLogs((prev) => [...prev, `Received chunk: ${part.type}`])

        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== aiResponseId) return m

            if (part.type === StreamType.TEXT) {
              return { ...m, content: m.content + part.content }
            }

            if (part.type === StreamType.THINKING) {
              // Append to thinking steps
              // Check if the last step is "active" or create a new one
              // Simple logic: Create new step for each chunk line or append if partial?
              // Since backend sends "Analyzing..." as complete sentences, let's add as new steps
              // or update the last one if it's "Thinking..."

              // Better: Just append content for now, or create discrete steps.
              // Backend sends "8:Text\n".
              const newStep = {
                id: Math.random().toString(),
                type: 'thinking',
                content: part.content,
                status: 'active',
              }

              // Mark previous steps as complete
              const updatedSteps = (m.thinkingSteps || []).map((s) => ({
                ...s,
                status: 'complete',
              }))
              return {
                ...m,
                thinkingSteps: [...updatedSteps, newStep],
                status: 'streaming',
              }
            }

            if (part.type === StreamType.UI_STREAM) {
              try {
                const patch =
                  typeof part.content === 'string'
                    ? JSON.parse(part.content)
                    : part.content
                return {
                  ...m,
                  metadata: {
                    ...m.metadata,
                    component: patch.component,
                    props: patch.props,
                  },
                }
              } catch (e) {
                console.error(e)
              }
            }

            return m
          })
        )
      })

      // REAL BACKEND CALL
      const backendUrl = api.startsWith('http')
        ? api
        : `http://localhost:8001${api}`

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: contextToSend,
          config: { ...config, systemPrompt: compiledSystemPrompt },
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.body) throw new Error('No response body')
      const reader = response.body.getReader()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        parserRef.current.feed(value)
      }

      unsubscribe()
      setIsLoading(false)

      // Mark final message and thinking steps as sent/complete
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === aiResponseId) {
            const completedSteps = (m.thinkingSteps || []).map((s) => ({
              ...s,
              status: 'complete',
            }))
            return { ...m, status: 'sent', thinkingSteps: completedSteps }
          }
          return m
        })
      )
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error(error)
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: 'assistant',
            content: `Error: ${(error as Error).message}`,
            timestamp: new Date(),
            status: 'error',
          },
        ])
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  // ... (Keep existing handlers) ...
  const handleSubmit = async (e?: React.FormEvent, metadata?: any) => {
    e?.preventDefault()
    if (!input.trim()) return
    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: input,
      timestamp: new Date(),
      status: 'sent',
      metadata,
    }
    setInput('')
    await processMessage(userMessage)
  }

  const append = async (message: Message, schema?: z.ZodSchema) => {
    await processMessage(message, schema)
  }

  const reload = async () => {
    if (messages.length === 0) return
    let lastUserIndex = messages.length - 1
    while (lastUserIndex >= 0 && messages[lastUserIndex].role !== 'user')
      lastUserIndex--
    if (lastUserIndex >= 0) {
      const lastUserMessage = messages[lastUserIndex]
      const newHistory = messages.slice(0, lastUserIndex + 1)
      setMessages(newHistory)
      await processMessage(lastUserMessage)
    }
  }

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
      setStreamLogs((prev) => [...prev, 'Stream aborted by user'])
    }
  }

  const clear = useCallback(() => {
    setMessages([])
    if (persistenceKey) {
      localStorage.removeItem(persistenceKey)
    }
  }, [persistenceKey])

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit,
    append,
    reload,
    stop,
    clear,
    setMessages,
    optimizationStats,
    streamLogs,
    ragContext,
    config,
    setConfig,
    contextWindow,
  }
}

'use client'

import { useState, useCallback } from 'react'

export interface DemoChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface UseDemoChatOptions {
  /** Initial greeting message from the assistant */
  initialMessage: string
  /** Simulated assistant response (or function to generate one) */
  assistantResponse?: string | ((userMessage: string) => string)
  /** Delay before assistant responds in ms (default: 1000) */
  responseDelay?: number
}

export interface UseDemoChatReturn {
  input: string
  setInput: (value: string) => void
  messages: DemoChatMessage[]
  handleSend: () => void
  isTyping: boolean
}

/**
 * Shared hook for demo chat clones in the showcase.
 * Extracts the repeated useState + handleSend + setTimeout pattern
 * used by Claude, ChatGPT, Grok, Perplexity, and other clone demos.
 */
export function useDemoChat({
  initialMessage,
  assistantResponse = 'Thank you for your message. This is a simulated response for demonstration purposes.',
  responseDelay = 1000,
}: UseDemoChatOptions): UseDemoChatReturn {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<DemoChatMessage[]>([
    { role: 'assistant', content: initialMessage },
  ])

  const handleSend = useCallback(() => {
    if (!input.trim()) return

    const userMessage = input
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response =
        typeof assistantResponse === 'function'
          ? assistantResponse(userMessage)
          : assistantResponse

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ])
      setIsTyping(false)
    }, responseDelay)
  }, [input, assistantResponse, responseDelay])

  return { input, setInput, messages, handleSend, isTyping }
}

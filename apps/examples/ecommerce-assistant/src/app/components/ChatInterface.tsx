'use client'

import { useState, useCallback } from 'react'
import { Send } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ChatInterfaceProps {
  onProductsRecommended: (productIds: string[]) => void
}

export function ChatInterface({ onProductsRecommended }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Welcome to ShopBot! I can help you find the perfect product. What are you looking for today?',
      timestamp: Date.now(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  // Wrapped in useCallback for performance
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: input,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInput('')

      setIsLoading(true)
      try {
        // Simulate API call (replace with actual endpoint)
        await new Promise((resolve) => setTimeout(resolve, 500))

        const assistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content:
            'I can help you find the perfect product! What are you looking for today?',
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, assistantMessage])

        // Example: trigger product recommendations
        // onProductsRecommended(['prod-1', 'prod-2'])
      } catch (error) {
        console.error('Chat error:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [input, isLoading, onProductsRecommended]
  )

  return (
    <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat with ShopBot</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-purple-100 ml-auto max-w-[80%]'
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            />
            <div
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

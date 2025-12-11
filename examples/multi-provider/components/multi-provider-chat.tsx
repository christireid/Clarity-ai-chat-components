'use client'

/**
 * Multi-Provider Chat Component
 *
 * Demonstrates switching between AI providers:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Anthropic (Claude 3)
 * - Google (Gemini)
 *
 * Features:
 * - Provider selector with availability status
 * - Model selector per provider
 * - Cost estimation
 * - Context window visualization
 */

import { useState, useRef, useEffect, useCallback, FormEvent } from 'react'
import {
  PROVIDERS,
  MODELS,
  getModelsByProvider,
  getModelById,
  type ProviderType,
  type ModelInfo,
} from '@/lib/providers'

// ============================================================================
// Types
// ============================================================================

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  provider?: ProviderType
  model?: string
}

// ============================================================================
// Provider Selector Component
// ============================================================================

function ProviderSelector({
  selected,
  onSelect,
  available,
}: {
  selected: ProviderType
  onSelect: (provider: ProviderType) => void
  available: Record<ProviderType, boolean>
}) {
  return (
    <div className="flex gap-2">
      {(Object.keys(PROVIDERS) as ProviderType[]).map((provider) => {
        const info = PROVIDERS[provider]
        const isAvailable = available[provider]
        const isSelected = selected === provider

        return (
          <button
            key={provider}
            onClick={() => isAvailable && onSelect(provider)}
            disabled={!isAvailable}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : isAvailable
                    ? 'bg-muted hover:bg-muted/80'
                    : 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50'
              }
            `}
            title={!isAvailable ? 'API key not configured' : info.description}
          >
            <span>{info.icon}</span>
            <span>{info.name}</span>
            {!isAvailable && (
              <span className="text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">
                No key
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ============================================================================
// Model Selector Component
// ============================================================================

function ModelSelector({
  provider,
  selected,
  onSelect,
}: {
  provider: ProviderType
  selected: string
  onSelect: (modelId: string) => void
}) {
  const models = getModelsByProvider(provider)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">Model</label>
      <div className="grid gap-2">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`
              text-left p-3 rounded-lg border transition-all
              ${
                selected === model.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{model.name}</span>
              <span className="text-xs text-muted-foreground">
                ${model.costPer1kInput}/1K in
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {model.description}
            </p>
            <div className="flex gap-3 mt-2 text-xs">
              <span className="text-muted-foreground">
                Context: {(model.contextWindow / 1000).toFixed(0)}K
              </span>
              <span className="text-muted-foreground">
                Max out: {(model.maxOutput / 1000).toFixed(0)}K
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function MultiProviderChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [provider, setProvider] = useState<ProviderType>('openai')
  const [modelId, setModelId] = useState('gpt-4-turbo-preview')
  const [available, setAvailable] = useState<Record<ProviderType, boolean>>({
    openai: false,
    anthropic: false,
    google: false,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Check available providers on mount
  useEffect(() => {
    fetch('/api/chat')
      .then((res) => res.json())
      .then((data) => {
        setAvailable(data.available)
        // Auto-select first available provider
        const firstAvailable = (
          Object.keys(data.available) as ProviderType[]
        ).find((p) => data.available[p])
        if (firstAvailable) {
          setProvider(firstAvailable)
          setModelId(getModelsByProvider(firstAvailable)[0].id)
        }
      })
      .catch(console.error)
  }, [])

  // Update model when provider changes
  useEffect(() => {
    const models = getModelsByProvider(provider)
    if (models.length > 0 && !models.find((m) => m.id === modelId)) {
      setModelId(models[0].id)
    }
  }, [provider, modelId])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setError(null)

      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
      }
      setMessages((prev: Message[]) => [...prev, userMessage])
      setInput('')

      // Create assistant placeholder
      const assistantId = `assistant-${Date.now()}`
      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        provider,
        model: modelId,
      }
      setMessages((prev: Message[]) => [...prev, assistantMessage])
      setIsLoading(true)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m: Message) => ({
              role: m.role,
              content: m.content,
            })),
            provider,
            model: modelId,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send message')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) throw new Error('No response body')

        let fullContent = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk
            .split('\n')
            .filter((line) => line.startsWith('data:'))

          for (const line of lines) {
            const data = line.slice(5).trim()
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.type === 'text-delta') {
                fullContent += parsed.content
                setMessages((prev: Message[]) =>
                  prev.map((m: Message) =>
                    m.id === assistantId ? { ...m, content: fullContent } : m
                  )
                )
              } else if (parsed.type === 'error') {
                throw new Error(parsed.message)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message')
        setMessages((prev: Message[]) =>
          prev.filter((m: Message) => m.id !== assistantId)
        )
      } finally {
        setIsLoading(false)
        inputRef.current?.focus()
      }
    },
    [messages, isLoading, provider, modelId]
  )

  // Form handlers
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const currentModel = getModelById(modelId)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 border-r p-4 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-xl font-semibold">Multi-Provider Chat</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Switch between AI providers
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Provider
            </label>
            <ProviderSelector
              selected={provider}
              onSelect={setProvider}
              available={available}
            />
          </div>

          <ModelSelector
            provider={provider}
            selected={modelId}
            onSelect={setModelId}
          />

          {currentModel && (
            <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Input cost</span>
                <span>${currentModel.costPer1kInput}/1K tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Output cost</span>
                <span>${currentModel.costPer1kOutput}/1K tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Context</span>
                <span>
                  {(currentModel.contextWindow / 1000).toFixed(0)}K tokens
                </span>
              </div>
            </div>
          )}
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="w-full text-sm text-muted-foreground hover:text-foreground py-2 border rounded-lg transition-colors"
          >
            Clear conversation
          </button>
        )}
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          role="log"
          aria-label="Chat messages"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-4xl mb-4">{PROVIDERS[provider].icon}</div>
              <h2 className="text-lg font-medium">
                Chat with {PROVIDERS[provider].name}
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm mt-1">
                {currentModel?.description || 'Select a model to get started'}
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const msgProvider = message.provider
                ? PROVIDERS[message.provider]
                : null

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3'
                        : 'space-y-1'
                    }`}
                  >
                    {message.role === 'assistant' && msgProvider && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>{msgProvider.icon}</span>
                        <span>{msgProvider.name}</span>
                        {message.model && (
                          <>
                            <span>·</span>
                            <span>{getModelById(message.model)?.name}</span>
                          </>
                        )}
                      </div>
                    )}
                    {message.role === 'assistant' ? (
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {isLoading && message.content === '' && (
                          <span className="inline-flex gap-1">
                            <span
                              className="w-2 h-2 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: '0ms' }}
                            />
                            <span
                              className="w-2 h-2 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: '150ms' }}
                            />
                            <span
                              className="w-2 h-2 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: '300ms' }}
                            />
                          </span>
                        )}
                        {isLoading && message.content !== '' && (
                          <span className="inline-block w-2 h-4 ml-1 bg-current animate-blink" />
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${PROVIDERS[provider].name}...`}
              disabled={isLoading || !available[provider]}
              rows={1}
              className="flex-1 px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !available[provider]}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MultiProviderChat

/**
 * AI Assistant Template
 *
 * General-purpose AI assistant with rich features
 */

import { useState } from 'react'
import { ChatWindow } from '../components/chat-window'
import { ContextManager } from '../components/context-manager'
import { ModelSelector } from '../components/model-selector'
import { ThemeProvider } from '../theme/ThemeProvider'
import { oceanTheme } from '../theme/presets'
import { openAIAdapter } from '../adapters/openai'
import { anthropicAdapter } from '../adapters/anthropic'
import { googleAdapter } from '../adapters/google'
import { useLocalStorage } from '../hooks/use-local-storage'
import type { Message, Context } from '@clarity-chat/types'

export interface AIAssistantTemplateProps {
  apiKeys?: {
    openai?: string
    anthropic?: string
    google?: string
  }
  defaultModel?: string
  enableFileUpload?: boolean
  enableVoiceInput?: boolean
  enableContextManagement?: boolean
  systemPrompt?: string
  maxTokens?: number
}

/**
 * AI Assistant Template
 *
 * Features:
 * - Multiple AI model support
 * - Streaming responses
 * - Context management
 * - File uploads
 * - Voice input
 * - Conversation history
 *
 * @example
 * ```tsx
 * <AIAssistantTemplate
 *   apiKeys={{
 *     openai: process.env.OPENAI_API_KEY,
 *     anthropic: process.env.ANTHROPIC_API_KEY,
 *   }}
 *   defaultModel="gpt-4"
 *   enableFileUpload
 *   enableVoiceInput
 * />
 * ```
 */
export function AIAssistantTemplate({
  apiKeys = {},
  defaultModel = 'gpt-4-turbo-preview',
  enableContextManagement = true,
  systemPrompt = 'You are a helpful AI assistant. Be concise, accurate, and friendly.',
  maxTokens = 4096,
}: AIAssistantTemplateProps) {
  const [messages, setMessages] = useLocalStorage<Message[]>(
    'ai-assistant-messages',
    []
  )
  const [context, setContext] = useLocalStorage<Context[]>(
    'ai-assistant-context',
    []
  )
  const [selectedModel, setSelectedModel] = useState(defaultModel)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize adapters
  const adapters = {
    openai: apiKeys.openai ? openAIAdapter : null,
    anthropic: apiKeys.anthropic ? anthropicAdapter : null,
    google: apiKeys.google ? googleAdapter : null,
  }

  const availableModels = [
    ...(adapters.openai
      ? [
          {
            id: 'gpt-4-turbo-preview',
            name: 'GPT-4 Turbo',
            provider: 'openai' as const,
            speed: 'medium' as const,
            cost: 'high' as const,
            quality: 'best' as const,
            contextWindow: 128000,
          },
          { 
            id: 'gpt-4', 
            name: 'GPT-4', 
            provider: 'openai' as const,
            speed: 'medium' as const,
            cost: 'high' as const,
            quality: 'excellent' as const,
            contextWindow: 8192,
          },
          { 
            id: 'gpt-3.5-turbo', 
            name: 'GPT-3.5 Turbo', 
            provider: 'openai' as const,
            speed: 'fast' as const,
            cost: 'low' as const,
            quality: 'good' as const,
            contextWindow: 16384,
          },
        ]
      : []),
    ...(adapters.anthropic
      ? [
          { 
            id: 'claude-3-opus', 
            name: 'Claude 3 Opus', 
            provider: 'anthropic' as const,
            speed: 'medium' as const,
            cost: 'high' as const,
            quality: 'best' as const,
            contextWindow: 200000,
          },
          {
            id: 'claude-3-sonnet',
            name: 'Claude 3 Sonnet',
            provider: 'anthropic' as const,
            speed: 'fast' as const,
            cost: 'medium' as const,
            quality: 'excellent' as const,
            contextWindow: 200000,
          },
        ]
      : []),
    ...(adapters.google
      ? [{ 
          id: 'gemini-pro', 
          name: 'Gemini Pro', 
          provider: 'google' as const,
          speed: 'fast' as const,
          cost: 'low' as const,
          quality: 'excellent' as const,
          contextWindow: 32768,
        }]
      : []),
  ]

  const handleSendMessage = async (content: string) => {
    const now = new Date()
    const chatId = 'ai-assistant-chat'

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      chatId,
      role: 'user',
      content,
      status: 'sent',
      createdAt: now,
      updatedAt: now,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Determine which adapter to use
    const model = availableModels.find((m) => m.id === selectedModel)
    const adapter = model
      ? adapters[model.provider as keyof typeof adapters]
      : null

    if (!adapter || !model) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId,
        role: 'assistant',
        content: 'No AI model available. Please configure API keys.',
        status: 'error',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { error: true },
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
      return
    }

    try {
      // Create assistant message for streaming
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId,
        role: 'assistant',
        content: '',
        status: 'streaming',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Note: streamChat is not part of ModelAdapter interface
      // This template demonstrates concept but needs proper adapter implementation
      // For now, use the chat method for non-streaming responses
      const response = await adapter.chat(
        [
          { role: 'system', content: systemPrompt },
          ...(context.length > 0
            ? [
                {
                  role: 'system' as const,
                  content: `Context:\n${context.map((c) => `- ${c.name}: ${c.content}`).join('\n')}`,
                },
              ]
            : []),
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user' as const, content },
        ],
        {
          provider: model.provider,
          model: selectedModel,
          maxTokens,
          temperature: 0.7,
        }
      )

      // Update message with response
      const responseContent = typeof response.content === 'string' 
        ? response.content 
        : response.content.map(p => p.type === 'text' ? p.text : '').join('')

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { 
                ...msg, 
                content: responseContent, 
                status: 'sent' as const,
                updatedAt: new Date(),
                metadata: { 
                  model: selectedModel,
                },
              }
            : msg
        )
      )
    } catch (error) {
      console.error('AI Assistant error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 'error',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { error: true },
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleContextAdd = (newContexts: Context[]) => {
    setContext((prev) => [...prev, ...newContexts])
  }

  const handleContextRemove = (id: string) => {
    setContext((prev) => prev.filter((c) => c.id !== id))
  }

  const handleContextToggle = (id: string) => {
    setContext((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    )
  }

  const handleExport = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    if (confirm('Clear all messages? This cannot be undone.')) {
      setMessages([])
    }
  }

  return (
    <ThemeProvider defaultTheme={oceanTheme}>
      <div className="ai-assistant-template flex h-full w-full bg-background">
        {/* Context Sidebar */}
        {enableContextManagement && (
          <div className="w-80 border-r bg-card/50 backdrop-blur-sm">
            <ContextManager
              contexts={context}
              onAdd={handleContextAdd}
              onRemove={handleContextRemove}
              onToggle={handleContextToggle}
            />
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Model Selector Header */}
          <div className="flex items-center justify-between gap-4 border-b bg-card/80 backdrop-blur-sm px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <ModelSelector
                models={availableModels}
                value={selectedModel}
                onChange={(modelId) => setSelectedModel(modelId)}
              />
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 overflow-hidden">
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              showHeader
              sessionTitle="AI Assistant"
              sessionSubtitle={`Using ${availableModels.find(m => m.id === selectedModel)?.name || 'AI Model'}`}
              showMessageCount
              onExport={handleExport}
              onClear={handleClear}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

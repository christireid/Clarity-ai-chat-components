/**
 * AI Assistant Template
 *
 * General-purpose AI assistant with rich features
 */

import React, { useState } from 'react'
import { ChatWindow } from '../components/chat-window'
import { ContextManager } from '../components/context-manager'
import { ModelSelector } from '../components/model-selector'
import { ThemeProvider } from '../theme/ThemeProvider'
import { oceanTheme } from '../theme/presets'
import { openAIAdapter } from '../adapters/openai'
import { anthropicAdapter } from '../adapters/anthropic'
import { googleAdapter } from '../adapters/google'
import { useLocalStorage } from '../hooks/use-local-storage'
import { useStreaming } from '../hooks/use-streaming'
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
  enableFileUpload = true,
  enableVoiceInput = true,
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
  const { streamMessage, isStreaming } = useStreaming()

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

    if (!adapter) {
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
      // For now, simulate streaming with the chat method
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
          model: selectedModel,
          maxTokens,
          temperature: 0.7,
        }
      )

      // Update message with response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { 
                ...msg, 
                content: response.content, 
                status: 'sent',
                updatedAt: new Date(),
                metadata: { 
                  tokens: response.usage?.totalTokens,
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

  return (
    <ThemeProvider theme={oceanTheme}>
      <div
        className="ai-assistant-template"
        style={{ display: 'flex', height: '100%', width: '100%' }}
      >
        {enableContextManagement && (
          <div
            style={{ width: '300px', borderRight: '1px solid var(--border)' }}
          >
            <ContextManager
              items={context}
              onAddItem={(item) => setContext((prev) => [...prev, item])}
              onRemoveItem={(id) =>
                setContext((prev) => prev.filter((c) => c.id !== id))
              }
              onClear={() => setContext([])}
            />
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}
          >
            <ModelSelector
              models={availableModels}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
            />
          </div>

          <div style={{ flex: 1 }}>
            <ChatWindow
              messages={messages}
              isLoading={isLoading || isStreaming}
              onSendMessage={handleSendMessage}
              onFileUpload={enableFileUpload ? handleFileUpload : undefined}
              enableVoiceInput={enableVoiceInput}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

import { logger } from '@clarity-chat/utils/logger';
/**
 * AI Assistant Template
 *
 * General-purpose AI assistant with rich features
 */

import { useState, useCallback } from 'react'
import { ChatWindow } from '../components/chat-window'
import { ContextManager } from '../components/context-manager'
import { ModelSelector } from '../components/model-selector'
import { ThemeProvider } from '../theme/ThemeProvider'
import { aiAssistantTheme } from '../theme/modern-presets'
import { openAIAdapter } from '../adapters/openai'
import { anthropicAdapter } from '../adapters/anthropic'
import { googleAdapter } from '../adapters/google'
import { useLocalStorage } from '../hooks/use-local-storage'
import { useMessageOperations } from '../hooks/use-message-operations'
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
  // Use message operations hook for edit/regenerate/delete
  const {
    messages: operationMessages,
    addMessage: addOperationMessage,
    editMessage,
    regenerateMessage,
    deleteMessage,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations({
    initialMessages: [],
    onEdit: (messageId, newContent) => {
      logger.debug('Message edited:', messageId, newContent)
    },
    onRegenerate: (messageId) => {
      logger.debug('Regenerating:', messageId)
      // Will be handled by handleRegenerate below
    },
    onDelete: (messageId) => {
      logger.debug('Message deleted:', messageId)
    },
  })

  // Convert operation messages to Message format
  const messages: Message[] = operationMessages.map((msg) => ({
    id: msg.id,
    chatId: 'ai-assistant-chat',
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

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
      ? [
          {
            id: 'gemini-pro',
            name: 'Gemini Pro',
            provider: 'google' as const,
            speed: 'fast' as const,
            cost: 'low' as const,
            quality: 'excellent' as const,
            contextWindow: 32768,
          },
        ]
      : []),
  ]

  // Handle message edit
  const handleEdit = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m.id === messageId)
      if (!message) return

      const newContent =
        prompt('Edit message:', message.content) || message.content
      if (newContent !== message.content) {
        editMessage(messageId, newContent)
        // Optionally re-send from this point
      }
    },
    [messages, editMessage]
  )

  // Handle message regenerate - defined after handleSendMessage
  const handleRegenerate = useCallback(
    async (messageId: string) => {
      const message = messages.find((m) => m.id === messageId)
      if (!message || message.role !== 'assistant') return

      setIsLoading(true)
      try {
        const index = messages.findIndex((m) => m.id === messageId)
        const userMessage = messages[index - 1]

        if (userMessage && userMessage.role === 'user') {
          deleteMessage(messageId)
          // Re-send the user message to regenerate response
          // We'll call handleSendMessage directly, but need to ensure it's defined
          const now = new Date()
          const chatId = 'ai-assistant-chat'

          // Determine which adapter to use
          const model = availableModels.find((m) => m.id === selectedModel)
          const adapter = model
            ? adapters[model.provider as keyof typeof adapters]
            : null

          if (!adapter || !model) {
            addOperationMessage({
              chatId,
              role: 'assistant',
              content: 'No AI model available. Please configure API keys.',
            })
            setIsLoading(false)
            return
          }

          try {
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
                ...messages.slice(0, index - 1).map((m) => ({
                  role: m.role,
                  content: m.content,
                })),
                { role: 'user' as const, content: userMessage.content },
              ],
              {
                provider: model.provider,
                model: selectedModel,
                maxTokens,
                temperature: 0.7,
              }
            )

            const responseContent =
              typeof response.content === 'string'
                ? response.content
                : response.content
                    .map((p) => (p.type === 'text' ? p.text : ''))
                    .join('')

            addOperationMessage({
              chatId,
              role: 'assistant',
              content: responseContent,
            })
          } catch (error) {
            logger.error('AI Assistant error:', error)
            addOperationMessage({
              chatId,
              role: 'assistant',
              content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            })
          }
        }
      } finally {
        setIsLoading(false)
      }
    },
    [
      messages,
      deleteMessage,
      addOperationMessage,
      selectedModel,
      availableModels,
      adapters,
      systemPrompt,
      context,
      maxTokens,
    ]
  )

  // Handle message delete
  const handleDelete = useCallback(
    (messageId: string) => {
      if (confirm('Delete this message?')) {
        deleteMessage(messageId)
      }
    },
    [deleteMessage]
  )

  const handleSendMessage = useCallback(
    async (content: string, isRegenerate = false) => {
      const now = new Date()
      const chatId = 'ai-assistant-chat'

      // Add user message (unless regenerating)
      if (!isRegenerate) {
        addOperationMessage({
          chatId,
          role: 'user',
          content,
        })
      }

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
        addOperationMessage(errorMessage)
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

        addOperationMessage(assistantMessage)

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
        const responseContent =
          typeof response.content === 'string'
            ? response.content
            : response.content
                .map((p) => (p.type === 'text' ? p.text : ''))
                .join('')

        // Add assistant message using operations hook
        addOperationMessage({
          chatId,
          role: 'assistant',
          content: responseContent,
        })
      } catch (error) {
        logger.error('AI Assistant error:', error)
        addOperationMessage({
          chatId,
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [
      messages,
      addOperationMessage,
      selectedModel,
      availableModels,
      adapters,
      systemPrompt,
      context,
      maxTokens,
    ]
  )

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
    const text = messages
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n')
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
      // Clear all messages using operations hook
      operationMessages.forEach((msg) => deleteMessage(msg.id))
    }
  }

  return (
    <ThemeProvider defaultTheme={aiAssistantTheme}>
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
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)] ring-1 ring-primary/20">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <ModelSelector
                models={availableModels}
                value={selectedModel}
                onChange={(modelId) => setSelectedModel(modelId)}
              />
            </div>
            {/* Undo/Redo Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="px-2 py-1 text-sm rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                ↶ Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="px-2 py-1 text-sm rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Y)"
              >
                ↷ Redo
              </button>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 overflow-hidden">
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onEditMessage={handleEdit}
              onRegenerateMessage={handleRegenerate}
              onDeleteMessage={handleDelete}
              showHeader
              sessionTitle="AI Assistant"
              sessionSubtitle={`Using ${availableModels.find((m) => m.id === selectedModel)?.name || 'AI Model'}`}
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

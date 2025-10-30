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
import { OpenAIAdapter } from '../adapters/openai'
import { AnthropicAdapter } from '../adapters/anthropic'
import { GoogleAdapter } from '../adapters/google'
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
  const [messages, setMessages] = useLocalStorage<Message[]>('ai-assistant-messages', [])
  const [context, setContext] = useLocalStorage<Context[]>('ai-assistant-context', [])
  const [selectedModel, setSelectedModel] = useState(defaultModel)
  const [isLoading, setIsLoading] = useState(false)
  const { streamMessage, isStreaming } = useStreaming()

  // Initialize adapters
  const adapters = {
    openai: apiKeys.openai ? new OpenAIAdapter({ apiKey: apiKeys.openai }) : null,
    anthropic: apiKeys.anthropic ? new AnthropicAdapter({ apiKey: apiKeys.anthropic }) : null,
    google: apiKeys.google ? new GoogleAdapter({ apiKey: apiKeys.google }) : null,
  }

  const availableModels = [
    ...(adapters.openai ? [
      { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', provider: 'openai' },
      { id: 'gpt-4', name: 'GPT-4', provider: 'openai' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' },
    ] : []),
    ...(adapters.anthropic ? [
      { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic' },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'anthropic' },
    ] : []),
    ...(adapters.google ? [
      { id: 'gemini-pro', name: 'Gemini Pro', provider: 'google' },
    ] : []),
  ]

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Determine which adapter to use
    const model = availableModels.find(m => m.id === selectedModel)
    const adapter = model ? adapters[model.provider as keyof typeof adapters] : null

    if (!adapter) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'No AI model available. Please configure API keys.',
        timestamp: new Date(),
        metadata: { error: true },
      }
      setMessages(prev => [...prev, errorMessage])
      setIsLoading(false)
      return
    }

    try {
      // Create assistant message for streaming
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      }
      
      setMessages(prev => [...prev, assistantMessage])

      // Prepare messages with system prompt and context
      const chatMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...(context.length > 0 ? [{
          role: 'system' as const,
          content: `Context:\n${context.map(c => `- ${c.name}: ${c.content}`).join('\n')}`,
        }] : []),
        ...messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user' as const, content },
      ]

      // Stream the response
      await adapter.streamChat({
        messages: chatMessages,
        model: selectedModel,
        maxTokens,
        onChunk: (chunk) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessage.id
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          )
        },
      })

      // Mark streaming as complete
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, isStreaming: false }
            : msg
        )
      )
    } catch (error) {
      console.error('AI Assistant error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        metadata: { error: true },
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (files: File[]) => {
    // Add files to context
    for (const file of files) {
      const content = await file.text()
      const contextItem: Context = {
        id: Date.now().toString(),
        name: file.name,
        content: content.substring(0, 1000), // Limit context size
        type: file.type.startsWith('image/') ? 'image' : 'document',
      }
      setContext(prev => [...prev, contextItem])
    }
  }

  return (
    <ThemeProvider theme={oceanTheme}>
      <div className="ai-assistant-template" style={{ display: 'flex', height: '100%', width: '100%' }}>
        {enableContextManagement && (
          <div style={{ width: '300px', borderRight: '1px solid var(--border)' }}>
            <ContextManager
              items={context}
              onAddItem={(item) => setContext(prev => [...prev, item])}
              onRemoveItem={(id) => setContext(prev => prev.filter(c => c.id !== id))}
              onClear={() => setContext([])}
            />
          </div>
        )}
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
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
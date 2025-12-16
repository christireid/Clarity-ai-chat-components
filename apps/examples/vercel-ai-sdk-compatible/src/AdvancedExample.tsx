import { SecureLogger } from '@/lib/security/secureLogger';
/**
 * Advanced Example: Multi-modal chat with tool calling
 * 
 * Demonstrates advanced features:
 * - Multi-modal content (text + images)
 * - Tool calling
 * - Message transformation
 * - Token management
 */

import * as React from 'react'
import { useChat, useAssistant } from '@clarity-chat/react'
import {
  messageToText,
  extractToolCalls,
  truncateMessagesToTokenLimit,
  createUserMessage,
  createAssistantMessage,
} from '@clarity-chat/react'
import type { CoreMessage } from '@clarity-chat/react'

function MultiModalChatExample() {
  const { messages, append, isLoading, setMessages } = useChat({
    api: '/api/chat',
    transform: (messages) => {
      // Limit to last 10 messages or 4000 tokens
      return truncateMessagesToTokenLimit(messages, 4000).slice(-10)
    },
    onFinish: (message) => {
      SecureLogger.debug('Message finished:', message)
      
      // Check for tool calls
      const toolCalls = extractToolCalls(message)
      if (toolCalls.length > 0) {
        SecureLogger.debug('Tool calls detected:', toolCalls)
      }
    },
  })

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result
      if (imageData) {
        append({
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'What do you see in this image?',
            },
            {
              type: 'image',
              image: imageData as ArrayBuffer,
            },
          ],
        })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Multi-Modal Chat</h2>
      
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleImageUpload(file)
            }
          }}
          className="mb-2"
        />
      </div>

      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'
            }`}
          >
            <div className="text-sm font-semibold mb-1">{msg.role}</div>
            <div>{messageToText(msg)}</div>
            {Array.isArray(msg.content) && msg.content.some((p) => p.type === 'image') && (
              <div className="mt-2 text-sm text-gray-600">[Image attached]</div>
            )}
          </div>
        ))}
      </div>

      {isLoading && <div className="text-gray-500">Thinking...</div>}
    </div>
  )
}

function ToolCallingExample() {
  const {
    status,
    messages,
    submitMessage,
    input,
    setInput,
    isLoading,
    toolInvocations,
  } = useAssistant({
    api: '/api/assistant',
    assistantId: 'tool-assistant',
    onToolCall: (toolCall) => {
      SecureLogger.debug('Tool called:', toolCall)
      
      // Simulate tool execution
      if (toolCall.toolName === 'get_weather') {
        // In real app, this would call an actual API
        SecureLogger.debug('Getting weather for:', toolCall.args)
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      submitMessage(input.trim())
      setInput('')
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tool Calling Assistant</h2>
      
      <div className="mb-4 flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-sm ${
          status === 'idle' ? 'bg-green-100 text-green-800' :
          status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
        {toolInvocations.length > 0 && (
          <span className="text-sm text-gray-600">
            {toolInvocations.length} tool{toolInvocations.length > 1 ? 's' : ''} invoked
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
        {messages.map((msg) => {
          const toolCalls = extractToolCalls(msg)
          return (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'
              }`}
            >
              <div className="text-sm font-semibold mb-1">{msg.role}</div>
              <div>{messageToText(msg)}</div>
              {toolCalls.length > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Tool Calls:</div>
                  {toolCalls.map((tc, idx) => (
                    <div key={idx} className="text-xs text-gray-500">
                      • {tc.toolName}({JSON.stringify(tc.args)})
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {toolInvocations.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-2">Active Tool Invocations:</h3>
          {toolInvocations.map((inv, idx) => (
            <div key={idx} className="text-sm mb-1">
              <strong>{inv.toolName}</strong> ({inv.state})
              {inv.args && (
                <div className="text-xs text-gray-600 ml-4">
                  Args: {JSON.stringify(inv.args)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask to use a tool (e.g., 'What's the weather in San Francisco?')"
          className="flex-1 px-4 py-2 border rounded-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}

function MessageManagementExample() {
  const { messages, append, setMessages, reload } = useChat({
    api: '/api/chat',
  })

  const handleClear = () => {
    setMessages([])
  }

  const handleExport = () => {
    const exportData = {
      messages: messages.map((msg) => ({
        role: msg.role,
        content: messageToText(msg),
        timestamp: new Date().toISOString(),
      })),
      exportedAt: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Message Management</h2>
      
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Clear Chat
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
          disabled={messages.length === 0}
        >
          Export Chat
        </button>
        <button
          onClick={() => reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          disabled={messages.length === 0}
        >
          Reload Last Response
        </button>
      </div>

      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'
              }`}
            >
              <div className="text-sm font-semibold mb-1">{msg.role}</div>
              <div>{messageToText(msg)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function AdvancedExamples() {
  const [activeExample, setActiveExample] = React.useState<
    'multimodal' | 'tools' | 'management'
  >('multimodal')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold mb-4">Advanced Examples</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveExample('multimodal')}
              className={`px-4 py-2 rounded-lg ${
                activeExample === 'multimodal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Multi-Modal
            </button>
            <button
              onClick={() => setActiveExample('tools')}
              className={`px-4 py-2 rounded-lg ${
                activeExample === 'tools'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Tool Calling
            </button>
            <button
              onClick={() => setActiveExample('management')}
              className={`px-4 py-2 rounded-lg ${
                activeExample === 'management'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Message Management
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6">
        {activeExample === 'multimodal' && <MultiModalChatExample />}
        {activeExample === 'tools' && <ToolCallingExample />}
        {activeExample === 'management' && <MessageManagementExample />}
      </div>
    </div>
  )
}

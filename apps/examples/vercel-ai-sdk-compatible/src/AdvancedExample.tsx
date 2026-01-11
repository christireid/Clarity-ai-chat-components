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
import { useClarityChat } from '@clarity-chat/react'

// Helper to extract text from message content
function messageToText(msg: { content: unknown }): string {
  if (typeof msg.content === 'string') {
    return msg.content
  }
  if (Array.isArray(msg.content)) {
    return msg.content
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map((part) => part.text)
      .join('\n')
  }
  return JSON.stringify(msg.content)
}

function MultiModalChatExample() {
  const { messages, append, isLoading, setMessages } = useClarityChat({
    api: '/api/chat',
    transport: 'sse',
  })

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result
      if (imageData) {
        append({
          role: 'user',
          content: `[Image uploaded: ${file.name}] What do you see in this image?`,
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
          </div>
        ))}
      </div>

      {isLoading && <div className="text-gray-500">Thinking...</div>}
    </div>
  )
}

function ToolCallingExample() {
  const [messages, setMessages] = React.useState<
    Array<{ id: string; role: string; content: string }>
  >([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [status, setStatus] = React.useState<'idle' | 'in_progress'>('idle')
  const [toolInvocations, setToolInvocations] = React.useState<
    Array<{ toolName: string; state: string; args?: unknown }>
  >([])

  const submitMessage = async (content: string) => {
    const userMessage = { id: Date.now().toString(), role: 'user', content }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setStatus('in_progress')
    setToolInvocations([])

    try {
      // Simulate tool detection
      if (content.toLowerCase().includes('weather')) {
        setToolInvocations([
          { toolName: 'get_weather', state: 'executing', args: { location: 'San Francisco' } },
        ])
        await new Promise((resolve) => setTimeout(resolve, 500))
        setToolInvocations([
          { toolName: 'get_weather', state: 'completed', args: { location: 'San Francisco' } },
        ])
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: content.toLowerCase().includes('weather')
          ? 'The weather in San Francisco is 72F and sunny.'
          : `You asked: "${content}". This is a demo response.`,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
      setStatus('idle')
    }
  }

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
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            status === 'idle'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {status}
        </span>
        {toolInvocations.length > 0 && (
          <span className="text-sm text-gray-600">
            {toolInvocations.length} tool{toolInvocations.length > 1 ? 's' : ''} invoked
          </span>
        )}
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
            <div>{msg.content}</div>
          </div>
        ))}
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
  const { messages, append, setMessages } = useClarityChat({
    api: '/api/chat',
    transport: 'sse',
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

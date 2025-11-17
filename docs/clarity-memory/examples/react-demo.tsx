/**
 * Clarity Memory - React Demo
 * 
 * This demo shows how to use Clarity Memory in a React application
 * with hooks, providers, and the DevTools inspector.
 */

import React, { useState } from 'react'
import { MemoryProvider, useMemory, MemoryInspector } from '@clarity-chat/memory/react'

// ============================================
// Main App Component
// ============================================
function App() {
  return (
    <MemoryProvider
      config={{
        context: "demo-user",
        store: {
          type: 'indexeddb',  // Persists in browser
        },
        tokenBudget: {
          maxTokens: 4000,
          reserveTokens: 500,
        },
      }}
    >
      <ChatApp />
    </MemoryProvider>
  )
}

// ============================================
// Chat App Component
// ============================================
function ChatApp() {
  const { memory, add, recall, stats } = useMemory()
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState('')
  const [showInspector, setShowInspector] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    
    // Add to memory
    await add(input, { role: 'user' })

    // Recall relevant context
    const context = await recall(input, { includeSummary: true })

    // Simulate AI response (in real app, call your LLM API)
    const aiResponse = `I found ${context.memories.length} relevant memories. ${context.memories[0]?.content || 'No memories found.'}`
    
    const assistantMessage = { role: 'assistant', content: aiResponse }
    setMessages(prev => [...prev, assistantMessage])
    
    // Add AI response to memory
    await add(aiResponse, { role: 'assistant' })

    setInput('')
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Chat Interface */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <h1>Chat with Memory</h1>
          <div>
            <strong>Stats:</strong> {stats.totalMemories} memories, {stats.tokens} tokens
          </div>
          <button onClick={() => setShowInspector(!showInspector)}>
            {showInspector ? 'Hide' : 'Show'} Memory Inspector
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                borderRadius: '8px',
              }}
            >
              <strong>{msg.role}:</strong> {msg.content}
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              style={{ flex: 1, padding: '10px', fontSize: '16px' }}
            />
            <button onClick={handleSend} style={{ padding: '10px 20px' }}>
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Memory Inspector */}
      {showInspector && (
        <div style={{ width: '400px', borderLeft: '1px solid #eee' }}>
          <MemoryInspector memory={memory} />
        </div>
      )}
    </div>
  )
}

export default App

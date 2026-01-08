/**
 * Playground Templates
 *
 * A collection of pre-built code templates demonstrating various
 * Clarity Chat component patterns and use cases.
 */
// Getting Started Templates
const basicChat = {
    id: 'basic-chat',
    name: 'Basic Chat',
    description: 'A simple chat interface with message input and display',
    category: 'getting-started',
    tags: ['beginner', 'chat', 'messages'],
    code: `import React, { useState } from 'react'

function Component() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleSend = () => {
    if (!message.trim()) return

    setMessages([...messages, {
      id: Date.now(),
      role: 'user',
      content: message
    }])

    setMessage('')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Basic Chat</h2>

      <div style={{
        height: '400px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        overflowY: 'auto'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            marginBottom: '12px',
            padding: '8px 12px',
            background: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
            borderRadius: '8px'
          }}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '8px'
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '8px 16px',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Component`,
};
const streamingResponse = {
    id: 'streaming',
    name: 'Streaming Response',
    description: 'Demonstrates word-by-word streaming text display',
    category: 'streaming',
    tags: ['streaming', 'animation', 'ai-response'],
    code: `import React, { useState } from 'react'

function Component() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')

  const simulateStreaming = async () => {
    setIsStreaming(true)
    setStreamedText('')

    const text = "This is a simulated streaming response. Each word appears one at a time, mimicking real AI streaming. This creates a more engaging and natural user experience."
    const words = text.split(' ')

    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 80))
      setStreamedText(prev => prev + word + ' ')
    }

    setIsStreaming(false)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Streaming Response Demo</h2>

      <div style={{
        minHeight: '200px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        background: '#f9f9f9'
      }}>
        <p style={{ lineHeight: 1.6 }}>
          {streamedText}
          {isStreaming && <span style={{ animation: 'blink 1s infinite' }}>▋</span>}
        </p>
      </div>

      <button
        onClick={simulateStreaming}
        disabled={isStreaming}
        style={{
          padding: '10px 20px',
          background: isStreaming ? '#ccc' : '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isStreaming ? 'not-allowed' : 'pointer',
          fontSize: '14px'
        }}
      >
        {isStreaming ? 'Streaming...' : 'Start Streaming'}
      </button>

      <style>
        {\`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        \`}
      </style>
    </div>
  )
}

export default Component`,
};
const multiTurnConversation = {
    id: 'conversation',
    name: 'Multi-Turn Conversation',
    description: 'A conversation with system messages and multiple turns',
    category: 'getting-started',
    tags: ['conversation', 'multi-turn', 'system-message'],
    code: `import React, { useState } from 'react'

function Component() {
  const [input, setInput] = useState('')
  const [conversation, setConversation] = useState([
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ])

  const handleSend = () => {
    if (!input.trim()) return

    setConversation([
      ...conversation,
      { role: 'user', content: input },
      { role: 'assistant', content: 'This is a simulated response. In a real application, this would come from an AI model.' }
    ])

    setInput('')
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Multi-Turn Conversation</h2>

      <div style={{
        height: '450px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        overflowY: 'auto',
        background: '#fafafa'
      }}>
        {conversation.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: '12px',
            padding: '12px',
            background: msg.role === 'user' ? '#e3f2fd' :
                       msg.role === 'assistant' ? '#fff' : '#f5f5f5',
            borderRadius: '8px',
            border: msg.role === 'system' ? '1px dashed #ccc' : 'none'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginBottom: '4px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {msg.role}
            </div>
            <div style={{ lineHeight: 1.5 }}>{msg.content}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '8px'
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '12px 24px',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Component`,
};
// Chat Components Templates
const chatWindow = {
    id: 'chat-window',
    name: 'Chat Window',
    description: 'A complete chat window with header, messages, and input',
    category: 'chat-components',
    tags: ['chat', 'window', 'complete'],
    code: `import React, { useState } from 'react'

function Component() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hi! How can I help you today?' },
    { id: 2, role: 'user', content: 'Tell me about React' },
    { id: 3, role: 'assistant', content: 'React is a JavaScript library for building user interfaces. It uses a component-based architecture and virtual DOM for efficient updates.' }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { id: Date.now(), role: 'user', content: input }])
    setInput('')

    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: 'This is a demo response. In production, this would come from an AI API.'
      }])
    }, 500)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h3 style={{ margin: 0 }}>AI Assistant</h3>
        <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.9 }}>
          Online
        </p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        background: '#f5f5f5'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '12px'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: msg.role === 'user' ? '#667eea' : 'white',
              color: msg.role === 'user' ? 'white' : 'black',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #e0e0e0',
        background: 'white'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '24px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Component`,
};
const messageBubble = {
    id: 'message-bubble',
    name: 'Message Bubble',
    description: 'Custom-styled message bubbles with different alignments',
    category: 'chat-components',
    tags: ['message', 'bubble', 'styling'],
    code: `import React from 'react'

function Component() {
  const messages = [
    { id: 1, role: 'user', content: 'Hello! How are you?' },
    { id: 2, role: 'assistant', content: "I'm doing well, thank you for asking! How can I help you today?" },
    { id: 3, role: 'user', content: 'Can you explain React hooks?' }
  ]

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Message Bubble Component</h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '20px'
      }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? '#007bff' : '#e9ecef',
              color: msg.role === 'user' ? 'white' : 'black',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Component`,
};
// Controls Templates
const tokenCounter = {
    id: 'token-counter',
    name: 'Token Counter',
    description: 'Visual token count with progress indicator',
    category: 'controls',
    tags: ['tokens', 'counter', 'progress'],
    code: `import React, { useState, useMemo } from 'react'

function Component() {
  const [text, setText] = useState('')

  // Simple token estimation (roughly 1 token per 4 characters)
  const tokenCount = useMemo(() => {
    if (!text.trim()) return 0
    return Math.ceil(text.length / 4)
  }, [text])

  const maxTokens = 4096
  const percentage = (tokenCount / maxTokens) * 100
  const isWarning = percentage > 80
  const isError = percentage > 95

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Token Counter</h2>

      <div style={{ marginTop: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          Enter text:
        </label>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace',
            resize: 'vertical'
          }}
        />

        <div style={{ marginTop: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
              Token Count: <span style={{
                color: isError ? '#dc3545' : isWarning ? '#ffc107' : '#28a745'
              }}>{tokenCount.toLocaleString()}</span> / {maxTokens.toLocaleString()}
            </span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {percentage.toFixed(1)}%
            </span>
          </div>

          <div style={{
            width: '100%',
            height: '24px',
            background: '#e0e0e0',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: \`\${Math.min(percentage, 100)}%\`,
              height: '100%',
              background: isError ? '#dc3545' : isWarning ? '#ffc107' : '#28a745',
              transition: 'all 0.3s ease',
              borderRadius: '12px'
            }} />
          </div>

          {isError && (
            <div style={{
              marginTop: '8px',
              padding: '8px',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33',
              fontSize: '12px'
            }}>
              Token limit exceeded! Please reduce text length.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Component`,
};
const modelSelector = {
    id: 'model-selector',
    name: 'Model Selector',
    description: 'Dropdown to select AI model with descriptions',
    category: 'controls',
    tags: ['model', 'selector', 'dropdown'],
    code: `import React, { useState } from 'react'

function Component() {
  const [selectedModel, setSelectedModel] = useState('gpt-4')

  const models = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model', icon: '🌟' },
    { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', description: 'Fast and efficient', icon: '⚡' },
    { id: 'claude-3', name: 'Claude 3 Opus', description: 'Advanced reasoning', icon: '🧠' },
    { id: 'gemini', name: 'Gemini Pro', description: 'Multimodal capabilities', icon: '💎' }
  ]

  const selected = models.find(m => m.id === selectedModel)

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Model Selector</h2>

      <div style={{ marginTop: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          Select Model:
        </label>

        <div style={{ display: 'grid', gap: '8px' }}>
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                border: selectedModel === model.id ? '2px solid #2196f3' : '2px solid #e0e0e0',
                borderRadius: '8px',
                background: selectedModel === model.id ? '#e3f2fd' : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '24px' }}>{model.icon}</span>
              <div>
                <div style={{ fontWeight: 'bold' }}>{model.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{model.description}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f0f7ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
            Selected:
          </div>
          <div style={{ fontWeight: 'bold', color: '#0066cc' }}>
            {selected?.icon} {selected?.name}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component`,
};
// Advanced Templates
const functionCalling = {
    id: 'function-calling',
    name: 'Function Calling',
    description: 'Demonstrates AI function/tool calling pattern',
    category: 'advanced',
    tags: ['function-calling', 'tools', 'advanced'],
    code: `import React, { useState } from 'react'

function Component() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  // Simulated function definitions
  const functions = {
    getWeather: (location) => \`The weather in \${location} is sunny, 72°F\`,
    calculate: (expression) => {
      try {
        // Safe math evaluation - only allows numbers and basic operators
        const sanitized = expression.replace(/[^0-9+\\-*/().\\s]/g, '')
        if (sanitized !== expression) return 'Invalid expression: only numbers and +, -, *, / allowed'
        // Use Function constructor with restricted scope (safer than eval)
        const result = new Function(\`"use strict"; return (\${sanitized})\`)()
        if (typeof result !== 'number' || !isFinite(result)) return 'Invalid result'
        return \`Result: \${result}\`
      } catch {
        return 'Invalid expression'
      }
    },
    getTime: () => \`Current time: \${new Date().toLocaleTimeString()}\`
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input, id: Date.now() }
    setMessages(prev => [...prev, userMessage])

    // Simulate function calling
    let response = ''
    let functionUsed = null

    if (input.toLowerCase().includes('weather')) {
      const location = input.match(/weather in (.+)/i)?.[1] || 'your location'
      response = functions.getWeather(location)
      functionUsed = 'getWeather'
    } else if (input.toLowerCase().includes('calculate') || input.match(/\\d+[+\\-*/]\\d+/)) {
      const expr = input.match(/(\\d+[+\\-*/]\\d+)/)?.[1] || input
      response = functions.calculate(expr)
      functionUsed = 'calculate'
    } else if (input.toLowerCase().includes('time')) {
      response = functions.getTime()
      functionUsed = 'getTime'
    } else {
      response = 'I can help with weather, calculations, or time. Try: "What\\'s the weather in Paris?" or "Calculate 5+3"'
    }

    const assistantMessage = {
      role: 'assistant',
      content: response,
      functionUsed,
      id: Date.now() + 1
    }
    setMessages(prev => [...prev, assistantMessage])
    setInput('')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Function Calling Pattern</h2>

      <div style={{
        marginTop: '20px',
        marginBottom: '16px',
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Available functions:</strong> getWeather, calculate, getTime
        <br />
        <strong>Try:</strong> "What's the weather in New York?" or "Calculate 10*5"
      </div>

      <div style={{
        height: '350px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        overflowY: 'auto',
        background: '#fafafa'
      }}>
        {messages.length === 0 ? (
          <div style={{ color: '#999', textAlign: 'center', marginTop: '50px' }}>
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              style={{
                marginBottom: '12px',
                padding: '12px',
                background: msg.role === 'user' ? '#e3f2fd' : '#fff',
                borderRadius: '8px',
                border: msg.role === 'assistant' ? '1px solid #e0e0e0' : 'none'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#666' }}>
                {msg.role.toUpperCase()}
                {msg.functionUsed && (
                  <span style={{
                    marginLeft: '8px',
                    padding: '2px 6px',
                    background: '#e8f5e9',
                    borderRadius: '4px',
                    color: '#2e7d32'
                  }}>
                    {msg.functionUsed}()
                  </span>
                )}
              </div>
              <div>{msg.content}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about weather, calculations, or time..."
          style={{
            flex: 1,
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '12px 24px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Component`,
};
const ragPattern = {
    id: 'rag-pattern',
    name: 'RAG Pattern',
    description: 'Retrieval-Augmented Generation pattern demo',
    category: 'advanced',
    tags: ['rag', 'retrieval', 'knowledge-base'],
    code: `import React, { useState } from 'react'

function Component() {
  const [query, setQuery] = useState('')
  const [context, setContext] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Simulated knowledge base
  const knowledgeBase = [
    { id: 1, content: 'React is a JavaScript library for building user interfaces. It uses a component-based architecture.' },
    { id: 2, content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.' },
    { id: 3, content: 'Next.js is a React framework for building full-stack web applications.' },
  ]

  const handleQuery = async () => {
    if (!query.trim()) return

    setIsLoading(true)

    // Simulate retrieval delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Simple keyword matching for demo
    const relevant = knowledgeBase.find(doc =>
      query.toLowerCase().split(' ').some(word =>
        doc.content.toLowerCase().includes(word)
      )
    )

    const retrievedContext = relevant?.content || 'No relevant context found in knowledge base.'
    setContext(retrievedContext)

    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 500))

    setResponse(\`Based on the retrieved context, here's my answer to "\${query}": \${retrievedContext}\`)
    setIsLoading(false)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h2>RAG Pattern Demo</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
        Retrieval-Augmented Generation: Query → Retrieve → Generate
      </p>

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
          placeholder="Ask about React, TypeScript, or Next.js..."
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />

        <button
          onClick={handleQuery}
          disabled={!query.trim() || isLoading}
          style={{
            marginTop: '12px',
            padding: '10px 24px',
            background: (!query.trim() || isLoading) ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (!query.trim() || isLoading) ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Processing...' : 'Retrieve & Generate'}
        </button>
      </div>

      {context && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#0066cc' }}>
            📚 RETRIEVED CONTEXT
          </div>
          <div style={{ fontSize: '14px', color: '#333' }}>
            {context}
          </div>
        </div>
      )}

      {response && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: '#f0f9f0',
          border: '1px solid #b3e6b3',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#28a745' }}>
            🤖 GENERATED RESPONSE
          </div>
          <div style={{ fontSize: '14px', color: '#333', lineHeight: 1.6 }}>
            {response}
          </div>
        </div>
      )}
    </div>
  )
}

export default Component`,
};
// Patterns Templates
const typingIndicator = {
    id: 'typing-indicator',
    name: 'Typing Indicator',
    description: 'Animated typing indicator with three bouncing dots',
    category: 'patterns',
    tags: ['typing', 'animation', 'loading', 'indicator'],
    code: `import React, { useState } from 'react'

function Component() {
  const [isTyping, setIsTyping] = useState(true)

  const dotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#6366f1',
    display: 'inline-block',
    animation: 'bounce 1.4s ease-in-out infinite',
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Typing Indicator</h2>

      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '12px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {isTyping && (
          <>
            <div style={{ ...dotStyle, animationDelay: '0s' }} />
            <div style={{ ...dotStyle, animationDelay: '0.2s' }} />
            <div style={{ ...dotStyle, animationDelay: '0.4s' }} />
          </>
        )}
      </div>

      <div style={{ marginTop: '24px' }}>
        <button
          onClick={() => setIsTyping(!isTyping)}
          style={{
            padding: '10px 20px',
            background: isTyping ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isTyping ? 'Stop' : 'Start'} Typing
        </button>
      </div>

      <style>
        {\`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
          }
        \`}
      </style>
    </div>
  )
}

export default Component`,
};
const loadingStates = {
    id: 'loading-states',
    name: 'Loading States',
    description: 'Various loading states and skeleton screens',
    category: 'patterns',
    tags: ['loading', 'skeleton', 'states', 'ux'],
    code: `import React, { useState } from 'react'

function Component() {
  const [loadingType, setLoadingType] = useState('spinner')

  const LoadingSpinner = () => (
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #e5e7eb',
      borderTop: '4px solid #6366f1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  )

  const LoadingDots = () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#6366f1',
            animation: \`pulse 1.4s ease-in-out \${i * 0.2}s infinite\`
          }}
        />
      ))}
    </div>
  )

  const LoadingSkeleton = () => (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '60%',
        height: '20px',
        background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
        backgroundSize: '200% 100%',
        borderRadius: '4px',
        animation: 'shimmer 1.5s infinite',
        marginBottom: '12px'
      }} />
      <div style={{
        width: '100%',
        height: '16px',
        background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
        backgroundSize: '200% 100%',
        borderRadius: '4px',
        animation: 'shimmer 1.5s infinite',
        marginBottom: '8px'
      }} />
      <div style={{
        width: '80%',
        height: '16px',
        background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
        backgroundSize: '200% 100%',
        borderRadius: '4px',
        animation: 'shimmer 1.5s infinite'
      }} />
    </div>
  )

  const LoadingProgress = () => (
    <div style={{
      width: '100%',
      height: '6px',
      background: '#e5e7eb',
      borderRadius: '3px',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '30%',
        height: '100%',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        borderRadius: '3px',
        animation: 'progress 2s ease-in-out infinite'
      }} />
    </div>
  )

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Loading States</h2>

      <div style={{ display: 'flex', gap: '8px', marginTop: '20px', marginBottom: '24px' }}>
        {['spinner', 'dots', 'skeleton', 'progress'].map(type => (
          <button
            key={type}
            onClick={() => setLoadingType(type)}
            style={{
              padding: '8px 16px',
              background: loadingType === type ? '#6366f1' : '#e5e7eb',
              color: loadingType === type ? 'white' : '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              textTransform: 'capitalize'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div style={{
        padding: '40px',
        background: '#f8fafc',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '150px'
      }}>
        {loadingType === 'spinner' && <LoadingSpinner />}
        {loadingType === 'dots' && <LoadingDots />}
        {loadingType === 'skeleton' && <LoadingSkeleton />}
        {loadingType === 'progress' && <LoadingProgress />}
      </div>

      <style>
        {\`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.5); opacity: 0.5; }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
        \`}
      </style>
    </div>
  )
}

export default Component`,
};
const errorHandling = {
    id: 'error-handling',
    name: 'Error Handling',
    description: 'Error states, retry logic, and error messages',
    category: 'patterns',
    tags: ['error', 'handling', 'retry', 'ux'],
    code: `import React, { useState } from 'react'

function Component() {
  const [status, setStatus] = useState('idle')
  const [retryCount, setRetryCount] = useState(0)

  const simulateRequest = async () => {
    setStatus('loading')

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 50% chance of error for demo
    if (Math.random() > 0.5) {
      setStatus('error')
      setRetryCount(prev => prev + 1)
    } else {
      setStatus('success')
      setRetryCount(0)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Error Handling Patterns</h2>

      <div style={{
        marginTop: '20px',
        padding: '24px',
        borderRadius: '12px',
        background: status === 'error' ? '#fef2f2' :
                   status === 'success' ? '#f0fdf4' : '#f8fafc',
        border: status === 'error' ? '1px solid #fecaca' :
               status === 'success' ? '1px solid #bbf7d0' : '1px solid #e5e7eb',
        transition: 'all 0.3s ease'
      }}>
        {status === 'idle' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚀</div>
            <p style={{ color: '#6b7280', margin: 0 }}>Click the button to simulate a request</p>
          </div>
        )}

        {status === 'loading' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              margin: '0 auto 12px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #6366f1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#6b7280', margin: 0 }}>Processing request...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#fee2e2',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                ❌
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#dc2626' }}>Request Failed</h4>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#9ca3af' }}>
                  Attempt {retryCount} of 3
                </p>
              </div>
            </div>
            <p style={{ color: '#b91c1c', fontSize: '14px', margin: '0 0 16px' }}>
              Unable to complete request. Please try again.
            </p>
            <button
              onClick={simulateRequest}
              disabled={retryCount >= 3}
              style={{
                padding: '10px 20px',
                background: retryCount >= 3 ? '#d1d5db' : '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: retryCount >= 3 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {retryCount >= 3 ? 'Max retries reached' : 'Retry'}
            </button>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              margin: '0 auto 12px',
              background: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px'
            }}>
              ✓
            </div>
            <h4 style={{ margin: 0, color: '#059669' }}>Success!</h4>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '8px 0 0' }}>
              Request completed successfully
            </p>
          </div>
        )}
      </div>

      {status !== 'loading' && (
        <button
          onClick={() => { setStatus('idle'); simulateRequest(); }}
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          {status === 'idle' ? 'Make Request' : 'Try Again'}
        </button>
      )}

      <style>
        {\`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        \`}
      </style>
    </div>
  )
}

export default Component`,
};
const voiceInput = {
    id: 'voice-input',
    name: 'Voice Input',
    description: 'Voice-to-text input simulation with waveform',
    category: 'patterns',
    tags: ['voice', 'audio', 'input', 'speech'],
    code: `import React, { useState, useEffect } from 'react'

function Component() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [waveHeights, setWaveHeights] = useState(Array(20).fill(10))

  useEffect(() => {
    if (!isRecording) return

    const interval = setInterval(() => {
      setWaveHeights(prev => prev.map(() => Math.random() * 30 + 5))
    }, 100)

    // Simulate speech recognition
    const words = ['Hello,', 'this', 'is', 'a', 'voice', 'message', 'simulation.']
    let wordIndex = 0

    const transcriptInterval = setInterval(() => {
      if (wordIndex < words.length) {
        setTranscript(prev => prev + (prev ? ' ' : '') + words[wordIndex])
        wordIndex++
      }
    }, 400)

    return () => {
      clearInterval(interval)
      clearInterval(transcriptInterval)
    }
  }, [isRecording])

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
    } else {
      setTranscript('')
      setIsRecording(true)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Voice Input</h2>

      <div style={{
        marginTop: '20px',
        padding: '24px',
        background: '#f8fafc',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        {/* Waveform */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          height: '60px',
          marginBottom: '20px'
        }}>
          {waveHeights.map((height, i) => (
            <div
              key={i}
              style={{
                width: '4px',
                height: isRecording ? \`\${height}px\` : '10px',
                background: isRecording
                  ? \`linear-gradient(180deg, #6366f1, #8b5cf6)\`
                  : '#d1d5db',
                borderRadius: '2px',
                transition: 'height 0.1s ease'
              }}
            />
          ))}
        </div>

        {/* Record Button */}
        <button
          onClick={toggleRecording}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: 'none',
            background: isRecording
              ? 'linear-gradient(135deg, #ef4444, #f87171)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '32px',
            boxShadow: isRecording
              ? '0 0 0 8px rgba(239, 68, 68, 0.2)'
              : '0 4px 20px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isRecording ? '⬛' : '🎤'}
        </button>

        <p style={{
          marginTop: '16px',
          color: isRecording ? '#ef4444' : '#6b7280',
          fontWeight: '500'
        }}>
          {isRecording ? 'Recording...' : 'Tap to speak'}
        </p>
      </div>

      {/* Transcript */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        minHeight: '100px'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginBottom: '8px',
          fontWeight: '500'
        }}>
          TRANSCRIPT
        </div>
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: transcript ? '#1f2937' : '#9ca3af',
          lineHeight: 1.6
        }}>
          {transcript || 'Your speech will appear here...'}
          {isRecording && <span style={{ animation: 'blink 1s infinite' }}>|</span>}
        </p>
      </div>

      <style>
        {\`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        \`}
      </style>
    </div>
  )
}

export default Component`,
};
const multiModal = {
    id: 'multi-modal',
    name: 'Multi-Modal Chat',
    description: 'Chat interface supporting text, images, and files',
    category: 'advanced',
    tags: ['multi-modal', 'images', 'files', 'upload'],
    code: `import React, { useState, useRef, useEffect } from 'react'

function Component() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      type: 'text',
      content: 'Hi! I can understand text, images, and files. Try uploading something!'
    }
  ])
  const [input, setInput] = useState('')
  const fileInputRef = useRef(null)

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      messages.forEach(msg => {
        if (msg.preview) {
          URL.revokeObjectURL(msg.preview)
        }
      })
    }
  }, [])

  const handleSend = () => {
    if (!input.trim()) return

    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      type: 'text',
      content: input
    }])
    setInput('')

    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        type: 'text',
        content: 'Thanks for your message! I can process both text and visual content.'
      }])
    }, 500)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isImage = file.type.startsWith('image/')
    const preview = isImage ? URL.createObjectURL(file) : null

    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      type: isImage ? 'image' : 'file',
      content: file.name,
      preview
    }])

    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        type: 'text',
        content: isImage
          ? 'I can see the image you uploaded! In a real app, I would analyze its contents.'
          : \`I received your file: \${file.name}. I can process documents and extract information.\`
      }])
    }, 500)

    e.target.value = ''
  }

  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #e5e7eb',
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: 'white'
      }}>
        <h3 style={{ margin: 0, fontWeight: '600' }}>Multi-Modal Chat</h3>
        <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.9 }}>
          Text • Images • Files
        </p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        background: '#f9fafb'
      }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '75%',
              padding: msg.type === 'image' ? '8px' : '12px 16px',
              borderRadius: '16px',
              background: msg.role === 'user' ? '#6366f1' : 'white',
              color: msg.role === 'user' ? 'white' : '#1f2937',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              {msg.type === 'image' ? (
                <div>
                  <img
                    src={msg.preview}
                    alt="Uploaded"
                    style={{
                      maxWidth: '200px',
                      borderRadius: '12px',
                      display: 'block'
                    }}
                  />
                  <div style={{
                    padding: '8px 0 4px',
                    fontSize: '12px',
                    opacity: 0.8
                  }}>
                    📷 {msg.content}
                  </div>
                </div>
              ) : msg.type === 'file' ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '24px' }}>📄</span>
                  <span>{msg.content}</span>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        background: 'white'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '12px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            📎
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '12px 24px',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Component`,
};
// Memory Templates
const conversationMemory = {
    id: 'memory-conversation',
    name: 'Conversation Memory',
    description: 'Chat with conversation history management',
    category: 'memory',
    tags: ['memory', 'history', 'context'],
    code: `import React, { useState } from 'react'

function Component() {
  const [sessions, setSessions] = useState([
    { id: 1, title: 'React Questions', messages: ['What is React?', 'React is a library...'] },
    { id: 2, title: 'TypeScript Help', messages: ['How do I use types?'] },
  ])
  const [currentSession, setCurrentSession] = useState(1)
  const [input, setInput] = useState('')

  const handleNewSession = () => {
    const newId = Date.now()
    setSessions([...sessions, { id: newId, title: 'New Chat', messages: [] }])
    setCurrentSession(newId)
  }

  const handleSend = () => {
    if (!input.trim()) return
    setSessions(sessions.map(s =>
      s.id === currentSession
        ? { ...s, messages: [...s.messages, input] }
        : s
    ))
    setInput('')
  }

  const current = sessions.find(s => s.id === currentSession)

  return (
    <div style={{ display: 'flex', height: '500px', maxWidth: '800px', margin: '0 auto', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: '200px', background: '#f5f5f5', borderRight: '1px solid #e0e0e0', padding: '12px' }}>
        <button
          onClick={handleNewSession}
          style={{ width: '100%', padding: '8px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '12px' }}
        >
          + New Chat
        </button>
        {sessions.map(s => (
          <div
            key={s.id}
            onClick={() => setCurrentSession(s.id)}
            style={{
              padding: '8px 12px',
              marginBottom: '4px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: s.id === currentSession ? '#e3f2fd' : 'transparent',
              fontWeight: s.id === currentSession ? 'bold' : 'normal'
            }}
          >
            {s.title}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
          {current?.messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: '8px', padding: '8px 12px', background: '#f0f0f0', borderRadius: '8px' }}>
              {msg}
            </div>
          ))}
        </div>
        <div style={{ padding: '12px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button onClick={handleSend} style={{ padding: '8px 16px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Component`,
};
// Export all templates
export const templates = [
    // Getting Started
    basicChat,
    streamingResponse,
    multiTurnConversation,
    // Chat Components
    chatWindow,
    messageBubble,
    // Controls
    tokenCounter,
    modelSelector,
    // Advanced
    functionCalling,
    ragPattern,
    multiModal,
    // Memory
    conversationMemory,
    // Patterns
    typingIndicator,
    loadingStates,
    errorHandling,
    voiceInput,
];
// Template categories for UI grouping
export const templateCategories = {
    'getting-started': {
        label: 'Getting Started',
        description: 'Basic examples to get you started',
        icon: '🚀',
    },
    'chat-components': {
        label: 'Chat Components',
        description: 'Pre-built chat UI components',
        icon: '💬',
    },
    streaming: {
        label: 'Streaming',
        description: 'Real-time streaming examples',
        icon: '⚡',
    },
    controls: {
        label: 'Controls',
        description: 'Input and control components',
        icon: '🎛️',
    },
    advanced: {
        label: 'Advanced',
        description: 'Complex patterns and integrations',
        icon: '🔧',
    },
    memory: {
        label: 'Memory',
        description: 'Conversation memory and context',
        icon: '🧠',
    },
    patterns: {
        label: 'Patterns',
        description: 'Common design patterns',
        icon: '📐',
    },
};
// Helper functions
export function getTemplateById(id) {
    return templates.find((t) => t.id === id);
}
export function getTemplatesByCategory(category) {
    return templates.filter((t) => t.category === category);
}
export function searchTemplates(query) {
    const lowerQuery = query.toLowerCase();
    return templates.filter((t) => t.name.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)));
}
// Legacy export for backwards compatibility
export const legacyTemplates = {
    basic: basicChat.code,
    streaming: streamingResponse.code,
    conversation: multiTurnConversation.code,
    'chat-window': chatWindow.code,
    'message-bubble': messageBubble.code,
    'token-counter': tokenCounter.code,
    'model-selector': modelSelector.code,
    'function-calling': functionCalling.code,
    'rag-pattern': ragPattern.code,
};
//# sourceMappingURL=index.js.map
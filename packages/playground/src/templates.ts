/**
 * Code Templates for Playground
 */

export const templates = {
  basic: `import React, { useState } from 'react'

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

  streaming: `import React, { useState } from 'react'

function Component() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')

  const simulateStreaming = async () => {
    setIsStreaming(true)
    setStreamedText('')
    
    const text = "This is a simulated streaming response. Each word appears one at a time, mimicking real AI streaming."
    const words = text.split(' ')
    
    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setStreamedText(prev => prev + word + ' ')
    }
    
    setIsStreaming(false)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Streaming Response</h2>
      
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
          padding: '8px 16px',
          background: isStreaming ? '#ccc' : '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isStreaming ? 'not-allowed' : 'pointer'
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

  conversation: `import React, { useState } from 'react'

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
      { role: 'assistant', content: 'This is a simulated response.' }
    ])
    
    setInput('')
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Multi-Turn Conversation</h2>
      
      <div style={{ 
        height: '500px',
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
              fontWeight: 'bold'
            }}>
              {msg.role.toUpperCase()}
            </div>
            <div>{msg.content}</div>
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

  'chat-window': `import React, { useState } from 'react'

function Component() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hi! How can I help you?' },
    { id: 2, role: 'user', content: 'Tell me about React' },
    { id: 3, role: 'assistant', content: 'React is a JavaScript library for building user interfaces.' }
  ])
  
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
        <h3 style={{ margin: 0 }}>Chat Window</h3>
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
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '24px',
              outline: 'none'
            }}
          />
          <button style={{
            padding: '12px 24px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Component`,

  'message-bubble': `import React from 'react'

function Component() {
  const messages = [
    { id: 1, role: 'user', content: 'Hello! How are you?' },
    { id: 2, role: 'assistant', content: "I'm doing great, thanks for asking! How can I help you today?" },
    { id: 3, role: 'user', content: 'Can you explain React hooks?' },
    { id: 4, role: 'assistant', content: 'React hooks are functions that let you use state and other React features in functional components. The most common ones are useState and useEffect.' }
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
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '75%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? '#007bff' : '#e9ecef',
              color: msg.role === 'user' ? 'white' : 'black',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
                {msg.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div>{msg.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Component`,

  'chat-input': `import React, { useState } from 'react'

function Component() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  const handleSend = () => {
    if (!input.trim()) return
    
    setMessages([...messages, {
      id: Date.now(),
      content: input,
      timestamp: new Date().toLocaleTimeString()
    }])
    setInput('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Chat Input Component</h2>
      
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '20px',
        background: '#f8f9fa'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            marginBottom: '8px',
            padding: '8px',
            background: 'white',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
              {msg.timestamp}
            </div>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '16px',
        border: '2px solid #007bff',
        borderRadius: '24px',
        padding: '4px',
        background: 'white'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            padding: '8px 16px',
            fontSize: '14px'
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            padding: '8px 20px',
            background: input.trim() ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Component`,

  'model-selector': `import React, { useState } from 'react'

function Component() {
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  
  const models = [
    { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model', maxTokens: 8192 },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient', maxTokens: 4096 },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', description: "Anthropic's most powerful", maxTokens: 200000 },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced performance', maxTokens: 200000 }
  ]

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Model Selector</h2>
      
      <div style={{ marginTop: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          Select AI Model:
        </label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {models.map(model => (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              style={{
                padding: '12px',
                border: selectedModel === model.id ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                background: selectedModel === model.id ? '#e7f3ff' : 'white',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {model.name}
                    {selectedModel === model.id && (
                      <span style={{ marginLeft: '8px', color: '#007bff' }}>✓</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {model.description}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {model.maxTokens.toLocaleString()} tokens
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <strong>Selected:</strong> {models.find(m => m.id === selectedModel)?.name}
        </div>
      </div>
    </div>
  )
}

export default Component`,

  'token-counter': `import React, { useState, useMemo } from 'react'

function Component() {
  const [text, setText] = useState('')
  
  // Simple token estimation (rough approximation)
  const estimateTokens = (input) => {
    if (!input.trim()) return 0
    // Rough estimate: ~4 characters per token for English text
    return Math.ceil(input.length / 4)
  }
  
  const tokens = useMemo(() => estimateTokens(text), [text])
  const costEstimate = (tokens * 0.00003).toFixed(6) // Rough GPT-4 pricing estimate

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
          Enter text to count tokens:
        </label>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
        
        <div style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}>
          <div style={{
            padding: '16px',
            background: '#e7f3ff',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
              {tokens.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Estimated Tokens
            </div>
          </div>
          
          <div style={{
            padding: '16px',
            background: '#fff3cd',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>
              {text.length.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Characters
            </div>
          </div>
          
          <div style={{
            padding: '16px',
            background: '#d4edda',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
              {costEstimate}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Est. Cost (GPT-4)
            </div>
          </div>
        </div>
        
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>Note:</strong> Token count is an estimation. Actual tokenization may vary based on the model used.
        </div>
      </div>
    </div>
  )
}

export default Component`,

  'rag-pattern': `import React, { useState } from 'react'

function Component() {
  const [query, setQuery] = useState('')
  const [context, setContext] = useState([])
  const [response, setResponse] = useState('')

  const simulateRAG = () => {
    // Simulate RAG pattern: Retrieve -> Augment -> Generate
    const retrievedDocs = [
      'Document 1: React is a JavaScript library for building user interfaces.',
      'Document 2: React uses a virtual DOM to optimize rendering performance.',
      'Document 3: React components are reusable pieces of UI.'
    ]
    
    setContext(retrievedDocs)
    
    // Simulate augmented prompt
    const augmentedPrompt = \`Context:
\${retrievedDocs.join('\\n')}

Question: \${query}

Answer:\`
    
    // Simulate response
    setTimeout(() => {
      setResponse('Based on the provided context, React is a JavaScript library that helps developers build user interfaces efficiently using components and a virtual DOM system.')
    }, 1000)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h2>RAG (Retrieval-Augmented Generation) Pattern</h2>
      
      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            Enter your question:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && simulateRAG()}
              placeholder="Ask a question about React..."
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <button
              onClick={simulateRAG}
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
              Search
            </button>
          </div>
        </div>

        {context.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              Retrieved Context:
            </h3>
            <div style={{
              background: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {context.map((doc, idx) => (
                <div key={idx} style={{
                  marginBottom: '8px',
                  padding: '8px',
                  background: 'white',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}>
                  {doc}
                </div>
              ))}
            </div>
          </div>
        )}

        {response && (
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              Generated Response:
            </h3>
            <div style={{
              background: '#e7f3ff',
              border: '1px solid #007bff',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Component`,

  'function-calling': `import React, { useState } from 'react'

function Component() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'I can help you with weather, calculations, and more. Try asking me something!' }
  ])
  const [input, setInput] = useState('')

  const availableFunctions = [
    { name: 'get_weather', description: 'Get current weather for a location' },
    { name: 'calculate', description: 'Perform mathematical calculations' },
    { name: 'get_time', description: 'Get current time in a timezone' }
  ]

  const simulateFunctionCall = (message) => {
    if (message.includes('weather')) {
      return { function: 'get_weather', result: 'Sunny, 72°F in San Francisco' }
    }
    if (message.match(/\\d+[+\\-*/]\\d+/)) {
      const result = eval(message.match(/\\d+[+\\-*/]\\d+/)[0])
      return { function: 'calculate', result: \`Result: \${result}\` }
    }
    if (message.includes('time')) {
      return { function: 'get_time', result: new Date().toLocaleTimeString() }
    }
    return null
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])

    const functionCall = simulateFunctionCall(input)
    
    if (functionCall) {
      const assistantMessage = {
        role: 'assistant',
        content: \`Called function: \${functionCall.function}\\nResult: \${functionCall.result}\`
      }
      setMessages(prev => [...prev, assistantMessage])
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I don't have a function for that. Try asking about weather, calculations, or time."
      }])
    }

    setInput('')
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h2>Function Calling Pattern</h2>
      
      <div style={{ marginTop: '20px', marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
          Available Functions:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {availableFunctions.map((fn, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 12px',
                background: '#e7f3ff',
                border: '1px solid #007bff',
                borderRadius: '16px',
                fontSize: '12px'
              }}
            >
              <strong>{fn.name}</strong>: {fn.description}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        background: '#f8f9fa',
        minHeight: '300px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '12px',
              padding: '12px',
              background: msg.role === 'user' ? '#007bff' : 'white',
              color: msg.role === 'user' ? 'white' : 'black',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
              {msg.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Try: 'What's the weather?' or 'Calculate 5+3'"
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
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
}

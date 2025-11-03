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
}

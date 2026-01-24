/**
 * Function Calling Template
 *
 * Demonstrates AI function/tool calling pattern
 */

import type { PlaygroundTemplate } from '../../types'

export const functionCalling: PlaygroundTemplate = {
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
}

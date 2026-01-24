/**
 * conversation Memory Template
 */

import type { PlaygroundTemplate } from '../../types'

export const conversationMemory: PlaygroundTemplate = {
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
}

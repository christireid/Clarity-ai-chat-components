/**
 * Multi-Modal Chat Template
 *
 * Chat interface supporting text, images, and files
 */

import type { PlaygroundTemplate } from '../../types'

export const multiModal: PlaygroundTemplate = {
  id: 'multi-modal',
  name: 'Multi-Modal Chat',
  description: 'Chat interface supporting text, images, and files',
  category: 'advanced',
  tags: ['multi-modal', 'images', 'files', 'upload'],
  code: String.raw`import React, { useState, useRef, useEffect } from 'react'

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
}

/**
 * End-to-End Chat Workflow Tests
 *
 * Tests complete chat workflows from start to finish
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Button } from '@clarity-chat/primitives'
import { ChatInput } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

// Simple Chat Component for E2E testing
function SimpleChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: 'test-chat',
      role: 'user',
      content: input,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }

    setMessages((prev) => [...prev, newMessage])
    setInput('')
  }

  return (
    <div data-testid="chat-app">
      <div data-testid="messages">
        {messages.length === 0 ? (
          <div>No messages</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} data-testid="message">
              {msg.content}
            </div>
          ))
        )}
      </div>
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        placeholder="Type a message..."
      />
    </div>
  )
}

describe('End-to-End Chat Workflow', () => {
  it('completes full chat interaction', async () => {
    const user = userEvent.setup()

    render(<SimpleChatApp />)

    // Initial state - no messages
    expect(screen.getByText('No messages')).toBeInTheDocument()

    // Type a message
    const input = screen.getByPlaceholderText('Type a message...')
    await user.type(input, 'Hello, world!')

    // Submit message
    await user.keyboard('{Enter}')

    // Message appears
    await waitFor(() => {
      expect(screen.getByText('Hello, world!')).toBeInTheDocument()
    })

    // Input is cleared
    expect(input).toHaveValue('')
  })

  it('handles multiple messages', async () => {
    const user = userEvent.setup()

    render(<SimpleChatApp />)

    const input = screen.getByPlaceholderText('Type a message...')

    // Send first message
    await user.type(input, 'First message{Enter}')

    await waitFor(() => {
      expect(screen.getByText('First message')).toBeInTheDocument()
    })

    // Send second message
    await user.type(input, 'Second message{Enter}')

    await waitFor(() => {
      expect(screen.getByText('Second message')).toBeInTheDocument()
    })

    // Both messages visible
    const messages = screen.getAllByTestId('message')
    expect(messages).toHaveLength(2)
  })

  it('prevents empty message submission', async () => {
    const user = userEvent.setup()

    render(<SimpleChatApp />)

    const input = screen.getByPlaceholderText('Type a message...')

    // Try to submit empty message
    await user.click(input)
    await user.keyboard('{Enter}')

    // No messages should appear
    expect(screen.getByText('No messages')).toBeInTheDocument()
  })
})

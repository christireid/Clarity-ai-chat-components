/**
 * Primitives + React Package Integration Tests
 * 
 * Tests verifying @clarity-chat/primitives and @clarity-chat/react work together
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, Input } from '@clarity-chat/primitives'
import { ChatInput } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

describe('Primitives + React Integration', () => {
  describe('ChatInput uses Primitives', () => {
    it('renders with primitive components', () => {
      const handleChange = vi.fn()
      const handleSubmit = vi.fn()
      
      render(
        <ChatInput
          value=""
          onChange={handleChange}
          onSubmit={handleSubmit}
          placeholder="Type a message"
        />
      )
      
      expect(screen.getByPlaceholderText('Type a message')).toBeInTheDocument()
    })
    
    it('integrates button and textarea primitives', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      
      render(
        <ChatInput
          value=""
          onChange={() => {}}
          onSubmit={handleSubmit}
        />
      )
      
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Hello{Enter}')
      
      // ChatInput should handle submission
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe('Custom Button with Chat Components', () => {
    it('allows custom button in chat interface', () => {
      const CustomButton = () => (
        <Button variant="outline">Custom Send</Button>
      )
      
      render(
        <div>
          <Input placeholder="Chat message" />
          <CustomButton />
        </div>
      )
      
      expect(screen.getByRole('button', { name: 'Custom Send' })).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Chat message')).toBeInTheDocument()
    })
  })

  describe('Styling Consistency', () => {
    it('chat components inherit primitive styles', () => {
      const { container } = render(
        <ChatInput
          value=""
          onChange={() => {}}
          onSubmit={() => {}}
        />
      )
      
      const textarea = container.querySelector('textarea')
      
      // Should use primitive design tokens
      expect(textarea?.className).toContain('rounded')
      expect(textarea?.className).toContain('ring')
    })
  })
})

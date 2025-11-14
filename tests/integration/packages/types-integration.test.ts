/**
 * Types Package Integration Tests
 * 
 * Tests verifying @clarity-chat/types works across packages
 */

import { describe, it, expect } from 'vitest'
import type { Message, ChatSettings, User } from '@clarity-chat/types'

describe('Types Integration', () => {
  describe('Message Type Usage', () => {
    it('creates valid message objects', () => {
      const message: Message = {
        id: '123',
        chatId: 'chat-1',
        role: 'user',
        content: 'Hello',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
      }
      
      expect(message.id).toBe('123')
      expect(message.role).toBe('user')
      expect(message.content).toBe('Hello')
      expect(message.status).toBe('sent')
    })
    
    it('supports optional message fields', () => {
      const message: Message = {
        id: '123',
        chatId: 'chat-1',
        role: 'assistant',
        content: 'Response',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
        metadata: {
          model: 'gpt-4',
          tokens: 50,
        },
      }
      
      expect(message.metadata?.model).toBe('gpt-4')
      expect(message.metadata?.tokens).toBe(50)
    })
  })

  describe('ChatSettings Type Usage', () => {
    it('creates valid settings objects', () => {
      const settings: ChatSettings = {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000,
      }
      
      expect(settings.model).toBe('gpt-4')
      expect(settings.temperature).toBe(0.7)
      expect(settings.maxTokens).toBe(1000)
    })
  })

  describe('User Type Usage', () => {
    it('creates valid user objects', () => {
      const user: User = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
      }
      
      expect(user.id).toBe('user-1')
      expect(user.name).toBe('John Doe')
      expect(user.email).toBe('john@example.com')
    })
  })

  describe('Type Compatibility', () => {
    it('message types work with component props', () => {
      const messages: Message[] = [
        {
          id: '1',
          chatId: 'chat-1',
          role: 'user',
          content: 'Hello',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'sent',
        },
        {
          id: '2',
          chatId: 'chat-1',
          role: 'assistant',
          content: 'Hi there!',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'sent',
        },
      ]
      
      expect(messages).toHaveLength(2)
      expect(messages[0].role).toBe('user')
      expect(messages[1].role).toBe('assistant')
    })
  })
})

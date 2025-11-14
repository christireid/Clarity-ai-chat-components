/**
 * Mock Data Generators
 * 
 * Generate mock data for testing components
 */

/**
 * Generate a mock message
 */
export function mockMessage(overrides?: Partial<Message>): Message {
  return {
    id: Math.random().toString(36).substring(7),
    role: 'assistant',
    content: 'This is a mock message for testing purposes.',
    createdAt: new Date(),
    ...overrides,
  }
}

/**
 * Generate multiple mock messages
 */
export function mockMessages(count: number, overrides?: Partial<Message>): Message[] {
  return Array.from({ length: count }, (_, i) => 
    mockMessage({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'assistant' : 'user',
      content: `Message ${i + 1}`,
      ...overrides,
    })
  )
}

/**
 * Generate a mock conversation
 */
export function mockConversation(overrides?: Partial<Conversation>): Conversation {
  return {
    id: Math.random().toString(36).substring(7),
    title: 'Test Conversation',
    messages: mockMessages(3),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

/**
 * Generate multiple mock conversations
 */
export function mockConversations(count: number): Conversation[] {
  return Array.from({ length: count }, (_, i) => 
    mockConversation({
      id: `conv-${i}`,
      title: `Conversation ${i + 1}`,
    })
  )
}

/**
 * Generate mock user data
 */
export function mockUser(overrides?: Partial<User>): User {
  return {
    id: Math.random().toString(36).substring(7),
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'https://via.placeholder.com/150',
    ...overrides,
  }
}

/**
 * Generate mock file upload
 */
export function mockFile(overrides?: Partial<File>): File {
  const blob = new Blob(['test content'], { type: 'text/plain' })
  return new File([blob], 'test.txt', {
    type: 'text/plain',
    lastModified: Date.now(),
    ...overrides,
  })
}

// Type definitions
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
  metadata?: Record<string, unknown>
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, unknown>
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  metadata?: Record<string, unknown>
}

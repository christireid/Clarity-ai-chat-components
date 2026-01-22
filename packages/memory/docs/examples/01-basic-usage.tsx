/**
 * Example 1: Basic Usage
 *
 * Demonstrates the fundamental memory operations using the latest API.
 * Shows how to store and retrieve memories with proper typing.
 */

import { clarityMemory } from '@clarity-chat/memory'
import type { MemoryItem } from '@clarity-chat/memory'

async function basicUsageExample() {
  // Initialize memory service with default configuration
  const memory = clarityMemory()

  // 1. Store an episodic memory (conversation message)
  const userMessage = await memory.add('User asked about pricing plans', {
    type: 'episodic',
    scope: 'thread',
    metadata: {
      userId: 'user_123',
      threadId: 'thread_456',
      role: 'user',
      topic: 'pricing',
    },
  })

  console.log('Stored memory:', userMessage.id)

  // 2. Store a semantic memory (user preference)
  const preference = await memory.add('User prefers concise explanations', {
    type: 'semantic',
    scope: 'user',
    metadata: {
      userId: 'user_123',
      category: 'communication_style',
    },
    priority: 'high',
  })

  console.log('Stored preference:', preference.id)

  // 3. Query memories
  const results = await memory.query('pricing', {
    filters: {
      type: 'episodic',
      scope: 'thread',
      metadata: { threadId: 'thread_456' },
    },
    limit: 10,
  })

  console.log(`Found ${results.length} relevant memories`)
  results.forEach((mem) => {
    console.log(`- [${mem.type}] ${mem.content.slice(0, 50)}...`)
  })

  // 4. Update a memory
  await memory.updateMemory(userMessage.id, {
    content: 'User asked about startup pricing plans (updated)',
    metadata: {
      ...userMessage.metadata,
      updated: true,
      entities: ['pricing', 'startup'],
    },
  })

  console.log('Memory updated')

  // 5. Get memory statistics
  const stats = await memory.getStats()
  console.log('Memory statistics:', {
    total: stats.totalMemories,
    byType: stats.byType,
    tokenUsage: `${stats.totalTokens} / ${stats.maxTotalTokens}`,
  })

  // 6. Delete a memory
  await memory.deleteMemory(userMessage.id)
  console.log('Memory deleted')
}

// React Component Example
import React, { useState, useEffect } from 'react'
import { useMemoryService } from '@clarity-chat/memory'

export function BasicChatComponent() {
  const memory = useMemoryService()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<MemoryItem[]>([])

  // Load thread messages on mount
  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    const threadMessages = await memory.query('', {
      filters: {
        type: 'episodic',
        scope: 'thread',
        metadata: { threadId: 'thread_123' },
      },
      limit: 50,
    })

    setMessages(threadMessages)
  }

  async function handleSend() {
    if (!input.trim()) return

    // Store user message
    await memory.add(input, {
      type: 'episodic',
      scope: 'thread',
      metadata: {
        threadId: 'thread_123',
        role: 'user',
      },
    })

    // Reload messages
    await loadMessages()
    setInput('')
  }

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.metadata.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}

// Run the example
if (require.main === module) {
  basicUsageExample().catch(console.error)
}

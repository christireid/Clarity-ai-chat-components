/**
 * Example 5: Streaming Message Handling
 *
 * Demonstrates how to handle streaming AI responses without creating
 * duplicate memories, with proper deduplication and final storage.
 */

import { clarityMemory } from '@clarity-chat/memory'

async function streamingExample() {
  const memory = clarityMemory({
    deduplication: {
      enabled: true,
      similarityThreshold: 0.95, // High threshold for streaming
    },
  })

  const messageId = `msg_${Date.now()}`
  let buffer = ''
  let memoryId: string | null = null

  // Simulate streaming chunks
  const chunks = [
    'Hello',
    ' there!',
    ' How',
    ' can',
    ' I',
    ' help',
    ' you',
    ' today?',
  ]

  console.log('Starting stream...')

  for (const chunk of chunks) {
    buffer += chunk

    if (!memoryId) {
      // First chunk: create initial memory
      const mem = await memory.add(buffer, {
        type: 'working',
        scope: 'session',
        metadata: {
          messageId,
          role: 'assistant',
          isStreaming: true,
        },
      })

      memoryId = mem.id
      console.log('Created streaming memory:', memoryId)
    } else {
      // Subsequent chunks: update existing memory
      await memory.updateMemory(memoryId, {
        content: buffer,
        metadata: {
          messageId,
          role: 'assistant',
          isStreaming: true,
        },
      })

      console.log('Updated memory with chunk:', chunk)
    }
  }

  // Stream complete: promote to episodic
  await memory.updateMemory(memoryId!, {
    type: 'episodic',
    scope: 'thread',
    content: buffer,
    metadata: {
      messageId,
      role: 'assistant',
      isStreaming: false,
      completed: true,
    },
  })

  console.log('Stream complete, memory finalized')
}

// Alternative approach: Store only on completion
async function streamingCompletionOnlyExample() {
  const memory = clarityMemory()

  let buffer = ''
  const messageId = `msg_${Date.now()}`

  // Simulate streaming
  const chunks = [
    'Hello',
    ' there!',
    ' How',
    ' can',
    ' I',
    ' help',
    ' you',
    ' today?',
  ]

  // Accumulate chunks without storing
  for (const chunk of chunks) {
    buffer += chunk
    console.log('Received chunk:', chunk)
  }

  // Store complete message once
  await memory.add(buffer, {
    type: 'episodic',
    scope: 'thread',
    metadata: {
      messageId,
      role: 'assistant',
    },
  })

  console.log('Complete message stored')
}

// React Component with Streaming
import React, { useState, useRef, useEffect } from 'react'
import { useMemoryService } from '@clarity-chat/memory'

export function StreamingChatComponent({ threadId }: { threadId: string }) {
  const memory = useMemoryService()
  const [messages, setMessages] = useState<any[]>([])
  const [streaming, setStreaming] = useState(false)
  const streamingMemoryId = useRef<string | null>(null)
  const streamingBuffer = useRef<string>('')

  async function sendMessage(userMessage: string) {
    // Store user message
    await memory.add(userMessage, {
      type: 'episodic',
      scope: 'thread',
      metadata: {
        threadId,
        role: 'user',
        messageId: `msg_${Date.now()}`,
      },
    })

    // Start streaming response
    setStreaming(true)
    streamingBuffer.current = ''
    streamingMemoryId.current = null

    // Simulate streaming from LLM
    const response = await streamLLMResponse(userMessage, (chunk) => {
      handleStreamChunk(chunk)
    })

    // Finalize
    await finalizeStream()
    setStreaming(false)
  }

  async function handleStreamChunk(chunk: string) {
    streamingBuffer.current += chunk

    if (!streamingMemoryId.current) {
      // Create initial streaming memory
      const mem = await memory.add(streamingBuffer.current, {
        type: 'working',
        scope: 'session',
        metadata: {
          threadId,
          role: 'assistant',
          isStreaming: true,
          messageId: `msg_${Date.now()}`,
        },
      })

      streamingMemoryId.current = mem.id

      // Add to UI
      setMessages((prev) => [
        ...prev,
        {
          id: mem.id,
          role: 'assistant',
          content: streamingBuffer.current,
          streaming: true,
        },
      ])
    } else {
      // Update existing memory
      await memory.updateMemory(streamingMemoryId.current, {
        content: streamingBuffer.current,
      })

      // Update UI
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingMemoryId.current
            ? { ...msg, content: streamingBuffer.current }
            : msg
        )
      )
    }
  }

  async function finalizeStream() {
    if (!streamingMemoryId.current) return

    // Promote to episodic memory
    await memory.updateMemory(streamingMemoryId.current, {
      type: 'episodic',
      scope: 'thread',
      metadata: {
        threadId,
        role: 'assistant',
        isStreaming: false,
        completed: true,
      },
    })

    // Update UI
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === streamingMemoryId.current
          ? { ...msg, streaming: false }
          : msg
      )
    )

    streamingMemoryId.current = null
    streamingBuffer.current = ''
  }

  return (
    <div>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <strong>{msg.role}:</strong> {msg.content}
            {msg.streaming && <span className="streaming-indicator">...</span>}
          </div>
        ))}
      </div>

      <input
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !streaming) {
            sendMessage(e.currentTarget.value)
            e.currentTarget.value = ''
          }
        }}
        disabled={streaming}
        placeholder={streaming ? 'Streaming...' : 'Type a message...'}
      />
    </div>
  )
}

// Deduplication approach for high-frequency updates
export function StreamingWithDeduplication({ threadId }: { threadId: string }) {
  const memory = useMemoryService()
  const messageId = useRef(`msg_${Date.now()}`)
  const buffer = useRef('')

  async function handleStreamChunk(chunk: string) {
    buffer.current += chunk

    // Store with same messageId for deduplication
    await memory.add(buffer.current, {
      type: 'episodic',
      scope: 'thread',
      metadata: {
        threadId,
        role: 'assistant',
        messageId: messageId.current, // Same ID = deduplication
        isStreaming: true,
      },
    })
  }

  async function handleStreamComplete() {
    // Final update with completed flag
    await memory.add(buffer.current, {
      type: 'episodic',
      scope: 'thread',
      metadata: {
        threadId,
        role: 'assistant',
        messageId: messageId.current,
        isStreaming: false,
        completed: true,
      },
    })

    // Reset for next message
    messageId.current = `msg_${Date.now()}`
    buffer.current = ''
  }

  return <div>{/* UI implementation */}</div>
}

// Abort handling for streaming
export function StreamingWithAbort() {
  const memory = useMemoryService()
  const abortController = useRef<AbortController | null>(null)
  const streamingMemoryId = useRef<string | null>(null)

  async function startStreaming(userMessage: string) {
    abortController.current = new AbortController()

    try {
      await streamLLMResponseWithAbort(
        userMessage,
        (chunk) => handleChunk(chunk),
        abortController.current.signal
      )
    } catch (error) {
      if (error.name === 'AbortError') {
        // Handle abort
        if (streamingMemoryId.current) {
          await memory.updateMemory(streamingMemoryId.current, {
            metadata: {
              aborted: true,
              abortReason: 'User cancelled',
            },
          })
        }

        console.log('Stream aborted by user')
      } else {
        throw error
      }
    }
  }

  function cancelStreaming() {
    abortController.current?.abort()
  }

  async function handleChunk(chunk: string) {
    // Same implementation as before
  }

  return (
    <div>
      <button onClick={() => startStreaming('test')}>Start</button>
      <button onClick={cancelStreaming}>Cancel</button>
    </div>
  )
}

// Helper functions
async function streamLLMResponse(
  message: string,
  onChunk: (chunk: string) => void
): Promise<string> {
  // Mock streaming
  const chunks = ['Hello', ' there!', ' How', ' can', ' I', ' help?']
  let response = ''

  for (const chunk of chunks) {
    await delay(100)
    response += chunk
    onChunk(chunk)
  }

  return response
}

async function streamLLMResponseWithAbort(
  message: string,
  onChunk: (chunk: string) => void,
  signal: AbortSignal
): Promise<string> {
  const chunks = ['Hello', ' there!', ' How', ' can', ' I', ' help?']
  let response = ''

  for (const chunk of chunks) {
    if (signal.aborted) {
      throw new DOMException('Stream aborted', 'AbortError')
    }

    await delay(100)
    response += chunk
    onChunk(chunk)
  }

  return response
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Run example
if (require.main === module) {
  console.log('=== Streaming with Updates ===')
  streamingExample()
    .then(() => console.log('\n=== Streaming with Completion Only ==='))
    .then(() => streamingCompletionOnlyExample())
    .catch(console.error)
}

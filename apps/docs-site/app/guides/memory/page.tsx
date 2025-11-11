import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Memory System - Clarity Chat',
  description: 'Clarity Chat\'s memory system allows your AI assistant to remember information across conversations, creating more personalized and context-aware experiences.',
}

export default function MemoryGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Memory System</h1>
        <p className="docs-lead">
          Clarity Chat&apos;s memory system allows your AI assistant to remember information across conversations, creating more personalized and context-aware experiences.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The memory system provides:
        </p>
        <ul>
          <li><strong>Session Memory</strong>: Temporary memory for the current session</li>
          <li><strong>Thread Memory</strong>: Persistent memory for a conversation thread</li>
          <li><strong>Global Memory</strong>: Shared memory across all conversations</li>
          <li><strong>Semantic Search</strong>: Find memories by meaning, not just keywords</li>
          <li><strong>Automatic Extraction</strong>: Automatically extract and store important facts</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Quick Start</h2>
        <CodeBlock
          language="tsx"
          code={`import { MemoryService, MemoryProvider } from '@clarity-chat/react'

const memoryService = new MemoryService({
  provider: 'local', // or 'vector-store' for persistent memory
})

function ChatWithMemory() {
  return (
    <MemoryProvider service={memoryService}>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </MemoryProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Memory Scopes</h2>

        <h3>Session Memory</h3>
        <p>
          Temporary memory cleared when the session ends:
        </p>
        <CodeBlock
          language="tsx"
          code={`await memoryService.store({
  key: 'current_topic',
  value: 'discussing TypeScript',
  scope: 'session',
})`}
        />

        <h3>Thread Memory</h3>
        <p>
          Persists across sessions for a specific conversation:
        </p>
        <CodeBlock
          language="tsx"
          code={`await memoryService.store({
  key: 'user_preference',
  value: 'prefers dark mode',
  scope: 'thread',
  threadId: 'conversation-123',
})`}
        />

        <h3>Global Memory</h3>
        <p>
          Shared across all conversations:
        </p>
        <CodeBlock
          language="tsx"
          code={`await memoryService.store({
  key: 'user_name',
  value: 'Alice',
  scope: 'global',
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Storing Memories</h2>

        <h3>Manual Storage</h3>
        <CodeBlock
          language="tsx"
          code={`// Store a simple key-value memory
await memoryService.store({
  key: 'favorite_color',
  value: 'blue',
  scope: 'thread',
})

// Store structured data
await memoryService.store({
  key: 'user_profile',
  value: {
    name: 'Alice',
    age: 30,
    preferences: ['dark mode', 'notifications'],
  },
  scope: 'global',
})`}
        />

        <h3>Automatic Extraction</h3>
        <p>
          Automatically extract and store important information from conversations:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { MemoryExtractor } from '@clarity-chat/react'

const extractor = new MemoryExtractor({
  enabled: true,
  extractTypes: ['names', 'preferences', 'facts', 'dates'],
})

// Extract memories from a message
const memories = await extractor.extract({
  message: "My name is Alice and I prefer dark mode",
  scope: 'thread',
})

// Memories are automatically stored`}
        />
      </section>

      <section className="docs-section">
        <h2>Retrieving Memories</h2>

        <h3>By Key</h3>
        <CodeBlock
          language="tsx"
          code={`const memory = await memoryService.retrieve({
  key: 'favorite_color',
  scope: 'thread',
})

console.log(memory.value) // 'blue'`}
        />

        <h3>Semantic Search</h3>
        <p>
          Find memories by meaning:
        </p>
        <CodeBlock
          language="tsx"
          code={`const memories = await memoryService.search({
  query: 'user preferences',
  scope: 'thread',
  limit: 5,
})

// Returns memories semantically related to "user preferences"`}
        />

        <h3>All Memories in Scope</h3>
        <CodeBlock
          language="tsx"
          code={`const allMemories = await memoryService.getAll({
  scope: 'thread',
  threadId: 'conversation-123',
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li><strong>Scope Appropriately</strong>: Use the right scope for each memory type</li>
          <li><strong>Extract Automatically</strong>: Enable automatic extraction for better UX</li>
          <li><strong>Privacy</strong>: Don&apos;t store sensitive PII without consent</li>
          <li><strong>Cleanup</strong>: Regularly prune old or irrelevant memories</li>
          <li><strong>Semantic Search</strong>: Use semantic search for better retrieval</li>
          <li><strong>User Control</strong>: Allow users to view and delete their memories</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/reference/components">Components API</a> - View MemoryInspector component</li>
          <li><a href="/guides/rag">Vector Stores</a> - Use vector stores for persistent memory</li>
          <li><a href="/reference/hooks">Hooks API</a> - Memory-related hooks</li>
        </ul>
      </section>
    </div>
  )
}

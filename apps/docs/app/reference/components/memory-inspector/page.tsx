import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Memory Inspector - Clarity Chat Components',
  description:
    'Inspect and manage what the AI remembers from conversations - debug memory, remove outdated info, or promote important details.',
}

export default function MemoryInspectorPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Memory Inspector</h1>
        <p className="docs-lead">
          See what your AI remembers. Like opening the AI's notebook to see what
          notes it took during your conversation.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          AI assistants can "remember" things from your conversation - your
          name, preferences, previous topics. The Memory Inspector lets you SEE
          what it remembered and MANAGE it (remove outdated info, promote
          important details).
        </p>

        <Callout type="info" title="What's AI Memory?">
          Modern AI can store information between messages. For example, if you
          say "My name is Sarah" early on, it remembers for the whole
          conversation. This component lets you see and manage that memory.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function SimpleMemory() {
  const memories = [
    {
      id: '1',
      label: 'User name',
      value: 'Sarah Chen',
      scope: 'session',
      lastUpdated: new Date(),
      confidence: 0.95
    },
    {
      id: '2',
      label: 'Preferred language',
      value: 'TypeScript',
      scope: 'session',
      lastUpdated: new Date(),
      confidence: 0.88
    },
    {
      id: '3',
      label: 'Current project',
      value: 'Building a chat app',
      scope: 'thread',
      lastUpdated: new Date(),
      confidence: 0.92
    }
  ]

  return <MemoryInspector memories={memories} />
}

render(<SimpleMemory />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Memory Scopes</h2>
        <p>Memories can be scoped to different levels:</p>
        <ul>
          <li>
            <strong>Session</strong> 💬 - Just this conversation (cleared when
            chat ends)
          </li>
          <li>
            <strong>Thread</strong> 🧵 - This topic/thread (persists across
            sessions)
          </li>
          <li>
            <strong>Global</strong> 🌍 - Permanent user memory (never forgotten)
          </li>
        </ul>

        <CodePlayground
          initialCode={`function MemoryScopes() {
  const memories = [
    {
      id: '1',
      label: 'Current topic',
      value: 'Learning about React hooks',
      scope: 'session',
      lastUpdated: new Date(),
      source: 'Inferred from conversation'
    },
    {
      id: '2',
      label: 'Coding style preference',
      value: 'Functional components with TypeScript',
      scope: 'thread',
      lastUpdated: new Date('2024-11-01'),
      source: 'User explicitly stated'
    },
    {
      id: '3',
      label: 'User timezone',
      value: 'America/Los_Angeles (PST)',
      scope: 'global',
      lastUpdated: new Date('2024-10-15'),
      source: 'Detected from system'
    }
  ]

  return (
    <MemoryInspector
      memories={memories}
      title="AI Memory by Scope"
      subtitle="Different types of information the AI remembers"
    />
  )
}

render(<MemoryScopes />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Managing Memories</h2>
        <p>
          Add remove and promote actions to let users control what the AI
          remembers.
        </p>
        <CodePlayground
          initialCode={`import { useState } from 'react'

function ManageableMemory() {
  const [memories, setMemories] = useState([
    {
      id: '1',
      label: 'Favorite color',
      value: 'Blue',
      scope: 'session',
      lastUpdated: new Date(),
      confidence: 0.7
    },
    {
      id: '2',
      label: 'Programming language',
      value: 'TypeScript',
      scope: 'thread',
      lastUpdated: new Date(),
      confidence: 0.95
    }
  ])

  const handleRemove = (memory) => {
    if (confirm(\`Remove "\${memory.label}"?\`)) {
      setMemories(prev => prev.filter(m => m.id !== memory.id))
    }
  }

  const handlePromote = (memory) => {
    // Promote from session → thread → global
    const scopeOrder = ['session', 'thread', 'global']
    const currentIndex = scopeOrder.indexOf(memory.scope)
    if (currentIndex < scopeOrder.length - 1) {
      const newScope = scopeOrder[currentIndex + 1]
      setMemories(prev => prev.map(m =>
        m.id === memory.id ? { ...m, scope: newScope } : m
      ))
    }
  }

  const handleRefresh = () => {
    console.log('Refreshing memories from AI...')
    // In real app: fetch updated memories from backend
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="text-sm">
          <strong>{memories.length}</strong> memories stored
        </div>
        <button
          onClick={handleRefresh}
          className="text-xs text-primary hover:underline"
        >
          Refresh
        </button>
      </div>

      <MemoryInspector
        memories={memories}
        onRemove={handleRemove}
        onPromote={handlePromote}
        onRefresh={handleRefresh}
        showHeaderActions={true}
      />

      {memories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No memories stored yet
        </div>
      )}
    </div>
  )
}

render(<ManageableMemory />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable title="MemoryInspector Props" data={memoryProps} />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>When to Use</h3>
        <ul>
          <li>✅ Building AI with persistent memory across conversations</li>
          <li>✅ Debugging what the AI knows</li>
          <li>✅ Letting users control their data</li>
          <li>✅ Admin tools for managing AI memory</li>
        </ul>

        <h3>Guidelines</h3>
        <ul>
          <li>Show confidence scores - AI memory isn't always 100% accurate</li>
          <li>Let users remove incorrect memories</li>
          <li>Clearly label memory scopes (what gets saved how long)</li>
          <li>Show when memories were last updated</li>
          <li>Group by scope for easier scanning</li>
        </ul>

        <Callout type="warning" title="Privacy Consideration">
          Always give users control over what's remembered. Add clear
          remove/clear options and explain what data persists.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>TypeScript</h2>
        <pre>
          <code>{`import { 
  MemoryInspector,
  type MemoryInspectorProps,
  type MemoryItem,
  type MemoryScope
} from '@clarity-chat/react'

interface MemoryItem {
  id: string
  label: string               // What is this? "User name", "Preference"
  value: string              // The actual value
  scope: 'session' | 'thread' | 'global'
  confidence?: number        // How sure AI is (0-1)
  source?: string           // Where did this come from?
  lastUpdated: Date
  tokens?: number           // Token count if relevant
}

// Usage
const [memories, setMemories] = useState<MemoryItem[]>([])

const handleRemove = (memory: MemoryItem) => {
  setMemories(prev => prev.filter(m => m.id !== memory.id))
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/context-manager" className="docs-card">
            <h3>Context Manager</h3>
            <p>Manage RAG documents</p>
          </a>
          <a href="/reference/components/settings-panel" className="docs-card">
            <h3>Settings Panel</h3>
            <p>User preferences</p>
          </a>
          <a href="/reference/hooks/use-local-storage" className="docs-card">
            <h3>useLocalStorage</h3>
            <p>Browser storage hook</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const memoryProps = [
  {
    name: 'memories',
    type: 'MemoryItem[]',
    required: true,
    description: 'Array of memory items to display',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Show loading skeleton',
  },
  {
    name: 'onRemove',
    type: '(memory: MemoryItem) => void',
    required: false,
    description: 'Callback when user removes a memory',
  },
  {
    name: 'onPromote',
    type: '(memory: MemoryItem) => void',
    required: false,
    description: 'Callback to promote memory to higher scope',
  },
  {
    name: 'onRefresh',
    type: '() => void',
    required: false,
    description: 'Callback to refresh memories from backend',
  },
  {
    name: 'title',
    type: 'string',
    required: false,
    default: "'Conversation memory'",
    description: 'Section heading',
  },
  {
    name: 'subtitle',
    type: 'string',
    required: false,
    description: 'Description text',
  },
  {
    name: 'showHeaderActions',
    type: 'boolean',
    required: false,
    default: 'true',
    description: 'Show refresh and clear all buttons in header',
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes',
  },
]

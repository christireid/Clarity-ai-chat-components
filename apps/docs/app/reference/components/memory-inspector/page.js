import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { LiveDemo } from '@/components/Demo/LiveDemo';
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'Memory Inspector - Clarity Chat Components',
    description: 'Inspect and manage what the AI remembers from conversations - debug memory, remove outdated info, or promote important details.',
};
export default function MemoryInspectorPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Component" }), _jsx("h1", { children: "Memory Inspector" }), _jsx("p", { className: "docs-lead", children: "See what your AI remembers. Like opening the AI's notebook to see what notes it took during your conversation." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "AI assistants can \"remember\" things from your conversation - your name, preferences, previous topics. The Memory Inspector lets you SEE what it remembered and MANAGE it (remove outdated info, promote important details)." }), _jsx(Callout, { type: "info", title: "What's AI Memory?", children: "Modern AI can store information between messages. For example, if you say \"My name is Sarah\" early on, it remembers for the whole conversation. This component lets you see and manage that memory." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(LiveDemo, { title: "Simple Memory Inspector", code: `import { MemoryInspector } from '@clarity-chat/react'

function SimpleMemory() {
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

export default SimpleMemory`, height: "350px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Memory Scopes" }), _jsx("p", { children: "Memories can be scoped to different levels:" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Session" }), " \uD83D\uDCAC - Just this conversation (cleared when chat ends)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Thread" }), " \uD83E\uDDF5 - This topic/thread (persists across sessions)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Global" }), " \uD83C\uDF0D - Permanent user memory (never forgotten)"] })] }), _jsx(LiveDemo, { title: "Different Memory Scopes", code: `import { MemoryInspector } from '@clarity-chat/react'

function MemoryScopes() {
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

export default MemoryScopes`, height: "400px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Managing Memories" }), _jsx("p", { children: "Add remove and promote actions to let users control what the AI remembers." }), _jsx(LiveDemo, { title: "Interactive Memory Management", code: `import { MemoryInspector } from '@clarity-chat/react'
import { useState } from 'react'

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

export default ManageableMemory`, height: "500px" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "MemoryInspector Props", data: memoryProps })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx("h3", { children: "When to Use" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Building AI with persistent memory across conversations" }), _jsx("li", { children: "\u2705 Debugging what the AI knows" }), _jsx("li", { children: "\u2705 Letting users control their data" }), _jsx("li", { children: "\u2705 Admin tools for managing AI memory" })] }), _jsx("h3", { children: "Guidelines" }), _jsxs("ul", { children: [_jsx("li", { children: "Show confidence scores - AI memory isn't always 100% accurate" }), _jsx("li", { children: "Let users remove incorrect memories" }), _jsx("li", { children: "Clearly label memory scopes (what gets saved how long)" }), _jsx("li", { children: "Show when memories were last updated" }), _jsx("li", { children: "Group by scope for easier scanning" })] }), _jsx(Callout, { type: "warning", title: "Privacy Consideration", children: "Always give users control over what's remembered. Add clear remove/clear options and explain what data persists." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "TypeScript" }), _jsx("pre", { children: _jsx("code", { children: `import { 
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/context-manager", className: "docs-card", children: [_jsx("h3", { children: "Context Manager" }), _jsx("p", { children: "Manage RAG documents" })] }), _jsxs("a", { href: "/reference/components/settings-panel", className: "docs-card", children: [_jsx("h3", { children: "Settings Panel" }), _jsx("p", { children: "User preferences" })] }), _jsxs("a", { href: "/reference/hooks/use-local-storage", className: "docs-card", children: [_jsx("h3", { children: "useLocalStorage" }), _jsx("p", { children: "Browser storage hook" })] })] })] })] }));
}
const memoryProps = [
    {
        name: 'memories',
        type: 'MemoryItem[]',
        required: true,
        description: 'Array of memory items to display'
    },
    {
        name: 'isLoading',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Show loading skeleton'
    },
    {
        name: 'onRemove',
        type: '(memory: MemoryItem) => void',
        required: false,
        description: 'Callback when user removes a memory'
    },
    {
        name: 'onPromote',
        type: '(memory: MemoryItem) => void',
        required: false,
        description: 'Callback to promote memory to higher scope'
    },
    {
        name: 'onRefresh',
        type: '() => void',
        required: false,
        description: 'Callback to refresh memories from backend'
    },
    {
        name: 'title',
        type: 'string',
        required: false,
        default: "'Conversation memory'",
        description: 'Section heading'
    },
    {
        name: 'subtitle',
        type: 'string',
        required: false,
        description: 'Description text'
    },
    {
        name: 'showHeaderActions',
        type: 'boolean',
        required: false,
        default: 'true',
        description: 'Show refresh and clear all buttons in header'
    },
    {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Additional CSS classes'
    }
];
//# sourceMappingURL=page.js.map
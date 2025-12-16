import { logger } from '@clarity-chat/utils/logger';
export interface PlaygroundTemplate {
  id: string
  name: string
  category: string
  description: string
  code: string
  dependencies?: Record<string, string>
}

export const playgroundTemplates: PlaygroundTemplate[] = [
  {
    id: 'simple-chat',
    name: 'Simple Chat',
    category: 'basics',
    description: 'Basic chat window with streaming support',
    code: `import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'Hello! How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (content: string) => {
    const userMessage = { 
      id: Date.now().toString(), 
      role: 'user' as const, 
      content 
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate streaming response
    const assistantMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'assistant' as const, 
      content: '' 
    }
    
    setMessages(prev => [...prev, assistantMessage])

    const response = \`This is a simulated response to: "\${content}"\`
    for (let i = 0; i < response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20))
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1].content = response.slice(0, i + 1)
        return updated
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="h-[600px] border rounded-lg">
      <ChatWindow
        messages={messages}
        input={input}
        onInputChange={(e) => setInput(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim()) handleSend(input)
        }}
        isLoading={isLoading}
        placeholder="Type a message..."
      />
    </div>
  )
}`,
  },
  {
    id: 'chat-with-avatars',
    name: 'Chat with Avatars',
    category: 'basics',
    description: 'Chat window with custom avatars and metadata',
    code: `import { ChatWindow, Message } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Hello! I\\'m your AI assistant.',
      metadata: {
        avatar: '🤖',
        timestamp: new Date().toISOString()
      }
    }
  ])

  return (
    <div className="h-[600px] border rounded-lg">
      <ChatWindow
        messages={messages}
        renderMessage={(message) => (
          <div className="flex gap-3 p-4">
            <div className="text-2xl">
              {message.metadata?.avatar || (message.role === 'user' ? '👤' : '🤖')}
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div className="prose">{message.content}</div>
              {message.metadata?.timestamp && (
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(message.metadata.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        )}
      />
    </div>
  )
}`,
  },
  {
    id: 'themed-chat',
    name: 'Custom Theme',
    category: 'theming',
    description: 'Chat with custom colors and styling',
    code: `import { ChatWindow, ThemeProvider } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'Check out this custom theme!' }
  ])

  const customTheme = {
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      background: '#faf5ff',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280'
    },
    borderRadius: '16px',
    fontFamily: 'Inter, system-ui, sans-serif'
  }

  return (
    <ThemeProvider theme={customTheme}>
      <div className="h-[600px] border rounded-lg" style={{ background: customTheme.colors.background }}>
        <ChatWindow
          messages={messages}
          placeholder="Type with style..."
        />
      </div>
    </ThemeProvider>
  )
}`,
  },
  {
    id: 'file-upload',
    name: 'File Upload',
    category: 'advanced',
    description: 'Chat with file upload capability',
    code: `import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'You can upload files to this chat!' }
  ])
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const handleFileUpload = async (file: File) => {
    setUploadedFiles(prev => [...prev, file.name])
    
    const message = {
      id: Date.now().toString(),
      role: 'system' as const,
      content: \`Uploaded: \${file.name} (\${(file.size / 1024).toFixed(2)} KB)\`
    }
    
    setMessages(prev => [...prev, message])
  }

  return (
    <div className="space-y-4">
      <div className="h-[500px] border rounded-lg">
        <ChatWindow
          messages={messages}
          enableFileUpload={true}
          acceptedFileTypes={['.pdf', '.txt', '.md', '.json']}
          maxFileSize={10 * 1024 * 1024}
          onFileUpload={handleFileUpload}
        />
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Uploaded Files:</h4>
          <ul className="space-y-1">
            {uploadedFiles.map((name, i) => (
              <li key={i} className="text-sm text-gray-600">📎 {name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}`,
  },
  {
    id: 'markdown-support',
    name: 'Markdown & Code',
    category: 'advanced',
    description: 'Rich markdown rendering with code highlighting',
    code: `import { ChatWindow } from '@clarity-chat/react'

export default function App() {
  const messages = [
    {
      id: '1',
      role: 'assistant' as const,
      content: \`# Hello! 👋

I support **rich markdown** formatting including:

- Lists (like this one)
- **Bold** and *italic* text
- [Links](https://example.com)
- Code blocks

Here's a code example:

\\\`\\\`\\\`javascript
function greet(name) {
  logger.debug(\\\`Hello, \\\${name}!\\\`)
}

greet('World')
\\\`\\\`\\\`

And inline code: \\\`const x = 42\\\`

> This is a blockquote
> with multiple lines\`
    }
  ]

  return (
    <div className="h-[600px] border rounded-lg">
      <ChatWindow
        messages={messages}
        placeholder="Try sending markdown..."
      />
    </div>
  )
}`,
  },
  {
    id: 'token-tracking',
    name: 'Token Tracking',
    category: 'optimization',
    description: 'Monitor token usage and costs in real-time',
    code: `import { ChatWindow, TokenOptimizationBadge } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'I\\'m tracking tokens!' }
  ])
  const [tokenCount, setTokenCount] = useState(150)
  const [costEstimate, setCostEstimate] = useState(0.003)

  // Simulate token counting
  const addMessage = (content: string) => {
    const tokens = content.split(' ').length * 4 // Rough estimate
    setTokenCount(prev => prev + tokens)
    setCostEstimate(prev => prev + (tokens / 1000) * 0.02)
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content
    }])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <TokenOptimizationBadge savingsPercent={0} />
        <div className="text-sm">
          <div className="font-semibold">{tokenCount.toLocaleString()} tokens used</div>
          <div className="text-gray-500">≈ \${costEstimate.toFixed(4)}</div>
        </div>
      </div>
      
      <div className="h-[500px] border rounded-lg">
        <ChatWindow
          messages={messages}
          onSendMessage={(content) => addMessage(content)}
        />
      </div>
    </div>
  )
}`,
  },
  {
    id: 'multi-modal',
    name: 'Multi-Modal Preview',
    category: 'advanced',
    description: 'Handle images and rich media in chat',
    code: `import { ChatWindow, MultiModalPreview } from '@clarity-chat/react'

export default function App() {
  const messages = [
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Here\\'s an image example:',
      metadata: {
        attachments: [{
          type: 'image',
          url: 'https://via.placeholder.com/400x300',
          alt: 'Placeholder image'
        }]
      }
    },
    {
      id: '2',
      role: 'user' as const,
      content: 'What\\'s in this image?'
    },
    {
      id: '3',
      role: 'assistant' as const,
      content: 'I can see a placeholder image with dimensions 400x300 pixels.'
    }
  ]

  return (
    <div className="h-[600px] border rounded-lg">
      <ChatWindow
        messages={messages}
        renderMessage={(message) => (
          <div className="p-4">
            <div className="prose mb-2">{message.content}</div>
            {message.metadata?.attachments && (
              <MultiModalPreview 
                attachments={message.metadata.attachments}
              />
            )}
          </div>
        )}
      />
    </div>
  )
}`,
  },
  {
    id: 'agent-with-tools',
    name: 'Agent with Tools',
    category: 'agents',
    description: 'AI agent that can call functions and tools',
    code: `import { ChatWindow, ToolInvocationCard } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'I can use tools! Try asking me to search or calculate.' }
  ])
  const [toolCalls, setToolCalls] = useState<any[]>([])

  const tools = {
    search: (query: string) => {
      return \`Found results for: \${query}\`
    },
    calculate: (expression: string) => {
      try {
        // Safe math evaluation - only allows numbers and basic operators
        const sanitized = expression.replace(/[^0-9+\\-*/().\\s]/g, '')
        if (sanitized !== expression) return 'Invalid expression'
        const result = new Function(\`"use strict"; return (\${sanitized})\`)()
        return typeof result === 'number' && isFinite(result) ? \`Result: \${result}\` : 'Invalid result'
      } catch {
        return 'Invalid expression'
      }
    }
  }

  const handleMessage = (content: string) => {
    if (content.includes('search')) {
      const toolCall = {
        id: Date.now().toString(),
        name: 'search',
        input: { query: content },
        status: 'succeeded',
        output: tools.search(content)
      }
      setToolCalls(prev => [...prev, toolCall])
    }
  }

  return (
    <div className="space-y-4">
      <div className="h-[500px] border rounded-lg">
        <ChatWindow
          messages={messages}
          onSendMessage={handleMessage}
        />
      </div>
      
      {toolCalls.map(call => (
        <ToolInvocationCard key={call.id} run={call} />
      ))}
    </div>
  )
}`,
  },
  {
    id: 'performance-dashboard',
    name: 'Performance Dashboard',
    category: 'monitoring',
    description: 'Monitor chat performance metrics',
    code: `import { ChatWindow, PerformanceDashboard } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'Performance is being monitored!' }
  ])

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <div className="h-[600px] border rounded-lg">
          <ChatWindow messages={messages} />
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <PerformanceDashboard
          compact={true}
          showCharts={false}
        />
      </div>
    </div>
  )
}`,
  },
  {
    id: 'enterprise-sso',
    name: 'Enterprise SSO',
    category: 'enterprise',
    description: 'Enterprise authentication with SSO',
    code: `import { ChatWindow, SSOConfigWizard } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSSO, setShowSSO] = useState(true)

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Enterprise SSO Setup</h1>
        {showSSO && (
          <SSOConfigWizard
            onComplete={() => {
              setIsAuthenticated(true)
              setShowSSO(false)
            }}
          />
        )}
        <button
          onClick={() => setIsAuthenticated(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Skip SSO (Demo)
        </button>
      </div>
    )
  }

  return (
    <div className="h-[600px] border rounded-lg">
      <ChatWindow
        messages={[
          { id: '1', role: 'assistant', content: 'Welcome! You\\'re authenticated via SSO.' }
        ]}
      />
    </div>
  )
}`,
  },
  {
    id: 'rag-chat',
    name: 'RAG Document Chat',
    category: 'advanced',
    description: 'Chat with retrieval-augmented generation',
    code: `import { ChatWindow, CitationCard } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Ask me about our documentation!',
      metadata: {
        citations: []
      }
    }
  ])

  const handleSend = (content: string) => {
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content }
    
    // Simulate RAG response with citations
    const response = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: \`Based on the documentation, \${content.toLowerCase()} is explained in our guides. [1][2]\`,
      metadata: {
        citations: [
          { source: 'Getting Started Guide', url: '/docs/quick-start', text: 'Installation instructions...' },
          { source: 'API Reference', url: '/docs/api', text: 'Component API details...' }
        ]
      }
    }
    
    setMessages(prev => [...prev, userMsg, response])
  }

  return (
    <div className="space-y-4">
      <div className="h-[500px] border rounded-lg">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSend}
          renderMessage={(msg) => (
            <div className="p-4">
              <div>{msg.content}</div>
              {msg.metadata?.citations && msg.metadata.citations.map((cit, i) => (
                <CitationCard key={i} {...cit} className="mt-2" />
              ))}
            </div>
          )}
        />
      </div>
    </div>
  )
}`,
  },
  {
    id: 'command-palette',
    name: 'Command Palette',
    category: 'interactive',
    description: 'Keyboard-driven command palette',
    code: `import { CommandPalette, ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])

  const commands = [
    { 
      id: 'new-chat', 
      label: 'New Chat', 
      icon: '💬',
      action: () => setMessages([])
    },
    { 
      id: 'clear', 
      label: 'Clear Messages', 
      icon: '🗑️',
      action: () => setMessages([])
    },
    { 
      id: 'export', 
      label: 'Export Chat', 
      icon: '📥',
      action: () => logger.debug('Export')
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️',
      action: () => logger.debug('Settings')
    }
  ]

  // Open on Cmd+K
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="h-[600px] border rounded-lg relative">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1.5 bg-white dark:bg-gray-800 border rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"
        >
          <span>⌘K</span>
          <span className="text-gray-500">Commands</span>
        </button>
      </div>
      
      <ChatWindow messages={messages} />
      
      <CommandPalette
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        commands={commands}
      />
    </div>
  )
}`,
  },
  {
    id: 'memory-inspector',
    name: 'Memory Inspector',
    category: 'monitoring',
    description: 'Visualize conversation memory and context',
    code: `import { ChatWindow, MemoryInspector } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'I remember our conversation!' },
    { id: '2', role: 'user', content: 'What\\'s my name?' },
    { id: '3', role: 'assistant', content: 'Let me check my memory...' }
  ])

  const memoryData = {
    shortTerm: [
      { key: 'user_name', value: 'John Doe' },
      { key: 'context', value: 'Documentation discussion' }
    ],
    longTerm: [
      { key: 'preferences', value: { theme: 'dark', language: 'en' } },
      { key: 'history', value: '5 previous conversations' }
    ],
    stats: {
      totalTokens: 1250,
      messagesStored: 12,
      compressionRatio: 0.65
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <div className="h-[600px] border rounded-lg">
          <ChatWindow messages={messages} />
        </div>
      </div>
      
      <div className="border rounded-lg p-4 overflow-auto" style={{ maxHeight: '600px' }}>
        <MemoryInspector data={memoryData} />
      </div>
    </div>
  )
}`,
  },
  {
    id: 'conversation-timeline',
    name: 'Conversation Timeline',
    category: 'advanced',
    description: 'Visual timeline of conversation flow',
    code: `import { ConversationTimeline } from '@clarity-chat/react'

export default function App() {
  const events = [
    {
      id: '1',
      type: 'message',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      content: 'User asked about features'
    },
    {
      id: '2',
      type: 'tool',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      content: 'Searched documentation',
      metadata: { tool: 'search', duration: 1200 }
    },
    {
      id: '3',
      type: 'message',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      content: 'Assistant provided answer with citations'
    },
    {
      id: '4',
      type: 'feedback',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      content: 'User rated response as helpful'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Conversation Flow</h2>
      <ConversationTimeline events={events} />
    </div>
  )
}`,
  },
  {
    id: 'follow-up-suggestions',
    name: 'Follow-up Suggestions',
    category: 'interactive',
    description: 'Smart suggestion chips for continuing conversation',
    code: `import { ChatWindow, FollowUpSuggestions } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'I can help you with many tasks!' }
  ])
  const [suggestions] = useState([
    'Tell me more',
    'Show an example',
    'How does this work?',
    'What are the alternatives?'
  ])

  const handleSuggestionClick = (suggestion: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: suggestion
    }, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: \`Great question! Let me explain...\`
    }])
  }

  return (
    <div className="space-y-4">
      <div className="h-[500px] border rounded-lg">
        <ChatWindow messages={messages} />
      </div>
      
      <FollowUpSuggestions
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  )
}`,
  },
  {
    id: 'context-visualizer',
    name: 'Context Visualizer',
    category: 'monitoring',
    description: 'Visualize what context the AI sees',
    code: `import { ChatWindow, ContextVisualizer } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'system', content: 'You are a helpful assistant.' },
    { id: '2', role: 'user', content: 'Hello!' },
    { id: '3', role: 'assistant', content: 'Hi! How can I help?' }
  ])

  const contextData = {
    systemPrompt: messages.find(m => m.role === 'system')?.content || '',
    conversationHistory: messages.filter(m => m.role !== 'system'),
    retrievedDocs: [
      { title: 'Getting Started', relevance: 0.92 },
      { title: 'API Reference', relevance: 0.85 }
    ],
    totalTokens: 450,
    maxTokens: 4000,
    compressionApplied: false
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <div className="h-[600px] border rounded-lg">
          <ChatWindow messages={messages} />
        </div>
      </div>
      
      <div className="border rounded-lg p-4 overflow-auto" style={{ maxHeight: '600px' }}>
        <h3 className="font-semibold mb-4">AI Context</h3>
        <ContextVisualizer data={contextData} />
      </div>
    </div>
  )
}`,
  },
  {
    id: 'error-handling',
    name: 'Error Handling',
    category: 'advanced',
    description: 'Graceful error handling and retry logic',
    code: `import { ChatWindow, ErrorBoundary } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'Try typing "error" to see error handling!' }
  ])
  const [hasError, setHasError] = useState(false)

  const handleSend = async (content: string) => {
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content }
    setMessages(prev => [...prev, userMsg])

    if (content.toLowerCase().includes('error')) {
      setHasError(true)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error: Simulated API failure',
        metadata: { error: true }
      }])
      return
    }

    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: \`Response to: \${content}\`
    }])
  }

  const handleRetry = () => {
    setHasError(false)
    setMessages(prev => prev.filter(m => !m.metadata?.error))
  }

  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">⚠️ Something went wrong</div>
          <button 
            onClick={reset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}
    >
      <div className="space-y-4">
        <div className="h-[500px] border rounded-lg">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSend}
          />
        </div>
        {hasError && (
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🔄 Retry Failed Request
          </button>
        )}
      </div>
    </ErrorBoundary>
  )
}`,
  },
  {
    id: 'thinking-indicator',
    name: 'Thinking Indicator',
    category: 'basics',
    description: 'Show AI thinking/processing state',
    code: `import { ChatWindow, ThinkingIndicator } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'Ask me anything!' }
  ])
  const [isThinking, setIsThinking] = useState(false)

  const handleSend = async (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content
    }])

    setIsThinking(true)
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsThinking(false)
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: \`Thought about it... here's my response to "\${content}"\`
    }])
  }

  return (
    <div className="h-[600px] border rounded-lg">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
        footer={isThinking && (
          <div className="p-4 border-t">
            <ThinkingIndicator text="Thinking..." />
          </div>
        )}
      />
    </div>
  )
}`,
  },
  {
    id: 'keyboard-shortcuts',
    name: 'Keyboard Shortcuts',
    category: 'interactive',
    description: 'Custom keyboard shortcuts for chat',
    code: `import { ChatWindow } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'Try keyboard shortcuts: Cmd+N (new), Cmd+/ (help)' }
  ])
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'n') {
          e.preventDefault()
          setMessages([{ id: Date.now().toString(), role: 'assistant', content: 'New chat started!' }])
        }
        if (e.key === '/') {
          e.preventDefault()
          setShowHelp(prev => !prev)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="relative">
      {showHelp && (
        <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-lg">
          <h3 className="font-semibold mb-2">Keyboard Shortcuts</h3>
          <div className="space-y-1 text-sm">
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">⌘N</kbd> New chat</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">⌘/</kbd> Toggle help</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">⌘K</kbd> Commands</div>
          </div>
        </div>
      )}
      
      <div className="h-[600px] border rounded-lg">
        <ChatWindow messages={messages} />
      </div>
    </div>
  )
}`,
  },
  {
    id: 'streaming-progress',
    name: 'Streaming Progress',
    category: 'advanced',
    description: 'Show streaming progress with token count',
    code: `import { ChatWindow, Progress } from '@clarity-chat/react'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: 'Watch the progress bar as I stream!' }
  ])
  const [progress, setProgress] = useState(0)
  const [isStreaming, setIsStreaming] = useState(false)

  const handleSend = async (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content
    }])

    setIsStreaming(true)
    setProgress(0)

    const response = 'This is a longer streaming response that shows progress as tokens arrive. '.repeat(5)
    const assistantMsg = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: ''
    }

    setMessages(prev => [...prev, assistantMsg])

    for (let i = 0; i < response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 10))
      const percent = ((i + 1) / response.length) * 100
      setProgress(percent)
      
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1].content = response.slice(0, i + 1)
        return updated
      })
    }

    setIsStreaming(false)
  }

  return (
    <div className="space-y-4">
      {isStreaming && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span>Streaming response...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}
      
      <div className="h-[520px] border rounded-lg">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSend}
          isLoading={isStreaming}
        />
      </div>
    </div>
  )
}`,
  },
]

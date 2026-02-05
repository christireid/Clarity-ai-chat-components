'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { PageHeader } from '@/components/component-section'
import { cn } from '@clarity-chat/primitives'
import { useAutoScroll, useClipboard } from '@clarity-chat/react/internal'
import {
  Send,
  Globe,
  Settings,
  Download,
  Slash,
  Loader2,
  Bot,
  User,
  PanelRight,
  PanelRightClose,
} from 'lucide-react'

import {
  ApiKeyBar,
  MessageActions,
  ThinkingDisplay,
  TokenPanel,
  MemoryPanel,
  ChatExportDialog,
  CodeBlockDisplay,
  SettingsDialog,
  type ChatMessage,
  type ThinkingStep,
  type Source,
  type Conversation,
  type SavedPrompt,
  type FileAttachment,
  type MCPServer,
  type MemorySettings,
  type TokenSettings,
  type ToolExecution,
  generateId,
  simulateStreaming,
  formatTimestamp,
  estimateTokens,
  escapeHtml,
} from '../_shared'

import {
  ResearchPipeline,
  type PipelineStep,
} from './components/research-pipeline'
import { MCPManager as MCPManagerPanel } from './components/mcp-manager'
import { ToolExecutionCard } from './components/tool-cards'
import { SourceDisplay } from './components/source-display'
import { ResearchSidebar } from './components/chat-sidebar'
import { ResearchContextPanel } from './components/context-panel'
import { ResearchWelcomeScreen } from './components/welcome-screen'

export const dynamic = 'force-dynamic'

function createConversation(): Conversation {
  return {
    id: generateId(),
    title: 'New Research',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

const defaultMCPServers: MCPServer[] = [
  {
    id: '1',
    name: 'Web Search MCP',
    endpoint: 'https://search.mcp.local:3001',
    status: 'connected',
    enabled: true,
    tools: ['web_search', 'image_search'],
  },
  {
    id: '2',
    name: 'Code Execution MCP',
    endpoint: 'https://code.mcp.local:3002',
    status: 'connected',
    enabled: true,
    tools: ['run_python', 'run_javascript'],
  },
  {
    id: '3',
    name: 'Database MCP',
    endpoint: 'https://db.mcp.local:3003',
    status: 'disconnected',
    enabled: false,
    tools: ['query_db', 'schema_info'],
  },
  {
    id: '4',
    name: 'File System MCP',
    endpoint: 'https://fs.mcp.local:3004',
    status: 'connected',
    enabled: true,
    tools: ['read_file', 'list_dir'],
  },
]

const defaultPrompts: SavedPrompt[] = [
  { id: '1', text: 'Research best practices for building RAG systems' },
  { id: '2', text: 'Compare React chat UI libraries' },
  { id: '3', text: 'Analyze the latest AI framework trends' },
  { id: '4', text: 'How to implement streaming in Next.js' },
]

const researchSources: Source[] = [
  {
    id: 's1',
    title: 'Building Effective RAG Systems in Production',
    url: 'https://arxiv.org/abs/2312.10997',
    excerpt:
      'A comprehensive guide to retrieval-augmented generation systems, covering chunking strategies, embedding models, and retrieval optimization.',
    type: 'academic',
    relevance: 95,
  },
  {
    id: 's2',
    title: 'React Chat UI Libraries Comparison 2025',
    url: 'https://dev.to/react-chat-comparison-2025',
    excerpt:
      'An in-depth comparison of the top React chat libraries including Clarity Chat, Stream Chat, and Chatscope.',
    type: 'web',
    relevance: 88,
  },
  {
    id: 's3',
    title: 'Clarity Chat Components Documentation',
    url: 'https://docs.clarity-chat.dev',
    excerpt:
      'Official documentation for the Clarity Chat component library with 180+ components for AI interfaces.',
    type: 'documentation',
    relevance: 92,
  },
  {
    id: 's4',
    title: 'AI Framework Market Analysis Q4 2024',
    url: 'https://techcrunch.com/ai-frameworks-2024',
    excerpt:
      'Market analysis showing rapid adoption of AI-native development tools and their impact on software engineering.',
    type: 'news',
    relevance: 82,
  },
  {
    id: 's5',
    title: 'Model Context Protocol Specification',
    url: 'https://modelcontextprotocol.io/spec',
    excerpt:
      'The official MCP specification enabling standardized communication between AI models and external tools.',
    type: 'documentation',
    relevance: 90,
  },
  {
    id: 's6',
    title: 'Streaming Architectures for Real-time AI',
    url: 'https://stackoverflow.com/questions/streaming-ai',
    excerpt:
      'Community discussion on implementing SSE and WebSocket streaming for AI chat applications.',
    type: 'forum',
    relevance: 78,
  },
]

function generateResearchResponse(
  query: string,
  isDeepResearch: boolean
): {
  response: string
  sources: Source[]
  tools: ToolExecution[]
  thinkingSteps: string[]
} {
  const tools: ToolExecution[] = [
    {
      id: generateId(),
      name: 'web_search',
      status: 'completed',
      input: `Searching: "${query.slice(0, 50)}"`,
      output: `Found ${3 + Math.floor(Math.random() * 5)} relevant results`,
      duration: `${(0.8 + Math.random()).toFixed(1)}s`,
    },
  ]

  if (isDeepResearch) {
    tools.push(
      {
        id: generateId(),
        name: 'url_reader',
        status: 'completed',
        input: 'Reading top 3 sources...',
        output: 'Extracted 2,400 words from 3 documents',
        duration: `${(1.2 + Math.random()).toFixed(1)}s`,
      },
      {
        id: generateId(),
        name: 'code_interpreter',
        status: 'completed',
        input: 'Analyzing data patterns...',
        output: 'Analysis complete: 4 key findings identified',
        duration: `${(0.5 + Math.random()).toFixed(1)}s`,
      }
    )
  }

  const selectedSources = researchSources
    .sort(() => Math.random() - 0.5)
    .slice(0, isDeepResearch ? 5 : 3)

  const thinkingSteps = isDeepResearch
    ? [
        'Planning research strategy...',
        `Decomposing query: "${query.slice(0, 40)}..."`,
        'Identifying relevant source categories...',
        'Executing web search across multiple providers...',
        'Reading and extracting key information from top sources...',
        'Cross-referencing findings across sources...',
        'Synthesizing comprehensive response with citations...',
      ]
    : [
        'Understanding the question...',
        'Searching relevant sources...',
        'Composing response with citations...',
      ]

  const response = isDeepResearch
    ? `## Research Findings: ${query.slice(0, 50)}

Based on comprehensive analysis across ${selectedSources.length} sources, here are the key findings:

### 1. Current State

The research landscape for "${query.slice(0, 30)}" shows significant developments in recent months. According to multiple sources [1][2], the technology has matured considerably with production-grade implementations now available.

### 2. Key Insights

- **Performance**: Modern implementations achieve 95%+ accuracy with optimized retrieval strategies [1]
- **Architecture**: The recommended approach involves chunked indexing with semantic search [3]
- **Integration**: Standardized protocols like MCP enable seamless tool integration [4]
- **Cost**: Token optimization techniques can reduce costs by 40-60% without quality loss [5]

### 3. Best Practices

\`\`\`typescript
// Example: Setting up a research pipeline
import { useClarityChat } from '@clarity-chat/react'

const research = useClarityChat({
  api: '/api/research',
  memory: { enabled: true, strategy: 'vector-store' },
  tools: ['web_search', 'url_reader', 'code_interpreter'],
})
\`\`\`

### 4. Recommendations

Based on the cross-referenced findings:
1. Start with a well-structured knowledge base [1][3]
2. Implement progressive retrieval for better relevance [2]
3. Use MCP servers for extensible tool integration [4][5]
4. Monitor token usage with built-in optimization [5]

### 5. Conclusion

The field continues to evolve rapidly, with ${query.includes('chat') || query.includes('AI') ? 'AI chat interfaces' : 'the technology'} becoming increasingly sophisticated. The combination of RAG, streaming, and tool-calling creates powerful research capabilities.

Would you like me to dive deeper into any of these areas?`
    : `## ${query.slice(0, 50)}

Here's what I found based on ${selectedSources.length} sources:

${selectedSources
  .slice(0, 3)
  .map((s, i) => `**${s.title}** [${i + 1}]: ${s.excerpt}`)
  .join('\n\n')}

### Summary

Based on the available research, the key takeaways are:
- The technology is well-established with multiple production implementations [1]
- Community best practices recommend a layered approach [2]
- Integration with modern frameworks like React is straightforward [3]

Would you like me to perform a deeper analysis with \`/research\`?`

  return { response, sources: selectedSources, tools, thinkingSteps }
}

export default function DeepResearchAssistantPage() {
  const [provider, setProvider] = useState('openai')
  const [model, setModel] = useState('gpt-4o')
  const [apiKey, setApiKey] = useState('')

  const [conversations, setConversations] = useState<Conversation[]>([
    createConversation(),
  ])
  const [activeConvId, setActiveConvId] = useState(conversations[0].id)
  const [savedPrompts, setSavedPrompts] =
    useState<SavedPrompt[]>(defaultPrompts)
  const [mcpServers, setMcpServers] = useState<MCPServer[]>(defaultMCPServers)

  const [memorySettings, setMemorySettings] = useState<MemorySettings>({
    enabled: true,
    strategy: 'vector-store',
    maxTokens: 8192,
    usage: 2340,
    rememberFindings: true,
    crossReference: true,
  })
  const [tokenSettings, setTokenSettings] = useState<TokenSettings>({
    optimizationEnabled: true,
    techniques: { compression: true, summarization: true, pruning: false },
    budget: 16000,
    used: { input: 3200, output: 1890, total: 5090 },
    showExpenditure: true,
  })

  // Research context
  const [researchFocus, setResearchFocus] = useState('')
  const [preferredSources, setPreferredSources] = useState<
    Record<string, boolean>
  >({ academic: true, documentation: true, news: true, forums: false })
  const [depthLevel, setDepthLevel] = useState(1)
  const [deepResearchMode, setDeepResearchMode] = useState(false)
  const [contextFiles, setContextFiles] = useState<FileAttachment[]>([])

  // UI state
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [activeThinking, setActiveThinking] = useState<ThinkingStep[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [activePipeline, setActivePipeline] = useState<PipelineStep[] | null>(
    null
  )
  const [activeTools, setActiveTools] = useState<ToolExecution[]>([])
  const [showExport, setShowExport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [settingsTemp, setSettingsTemp] = useState(0.3)
  const [settingsMaxTokens, setSettingsMaxTokens] = useState(4096)
  const [settingsCodeTheme, setSettingsCodeTheme] = useState('monokai')
  const [settingsResponseLength, setSettingsResponseLength] =
    useState('detailed')
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const { copy } = useClipboard()
  const streamCancelRef = useRef<(() => void) | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0]
  const messages = useMemo(
    () => activeConversation?.messages ?? [],
    [activeConversation?.messages]
  )
  const { scrollRef } = useAutoScroll({
    dependencies: [messages, streamingText, activeThinking, activePipeline],
  })

  const updateMessages = useCallback(
    (newMessages: ChatMessage[]) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, messages: newMessages, updatedAt: new Date() }
            : c
        )
      )
    },
    [activeConvId]
  )

  const cancelStreaming = useCallback(() => {
    streamCancelRef.current?.()
    streamCancelRef.current = null
    setIsStreaming(false)
    setIsThinking(false)
    setStreamingText('')
    setActiveThinking([])
    setActivePipeline(null)
    setActiveTools([])
  }, [])

  const handleSelectConversation = useCallback(
    (id: string) => {
      cancelStreaming()
      setActiveConvId(id)
    },
    [cancelStreaming]
  )

  // Slash commands
  const slashCommands = [
    {
      id: 'research',
      label: '/research',
      description: 'Deep research on a topic',
    },
    { id: 'search', label: '/search', description: 'Quick web search' },
    { id: 'analyze', label: '/analyze', description: 'Analyze a URL' },
    { id: 'compare', label: '/compare', description: 'Compare two things' },
    {
      id: 'summarize',
      label: '/summarize',
      description: 'Summarize conversation',
    },
    { id: 'sources', label: '/sources', description: 'Show all sources' },
    { id: 'tools', label: '/tools', description: 'List available tools' },
  ]

  const handleSend = async (overrideText?: string) => {
    const text = overrideText || input.trim()
    if (!text || isStreaming) return

    const isResearch =
      deepResearchMode || text.startsWith('/research') || depthLevel === 2
    const cleanText = text
      .replace(/^\/research\s*/, '')
      .replace(/^\/search\s*/, '')

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      status: 'sent',
    }
    const newMessages = [...messages, userMessage]
    updateMessages(newMessages)
    setInput('')
    setShowSlashMenu(false)
    setIsThinking(true)
    setActiveThinking([])
    setActiveTools([])

    // Local array to track thinking steps (avoids stale closure in streaming callback)
    const localThinking: ThinkingStep[] = []

    const { response, sources, tools, thinkingSteps } =
      generateResearchResponse(cleanText || text, isResearch)

    // Simulate pipeline for deep research
    if (isResearch) {
      const steps: PipelineStep[] = [
        {
          id: '1',
          label: 'Planning',
          description: 'Planning research strategy',
          status: 'active',
        },
        {
          id: '2',
          label: 'Searching',
          description: 'Searching sources',
          status: 'pending',
        },
        {
          id: '3',
          label: 'Reading',
          description: 'Reading & extracting',
          status: 'pending',
        },
        {
          id: '4',
          label: 'Cross-referencing',
          description: 'Cross-referencing findings',
          status: 'pending',
        },
        {
          id: '5',
          label: 'Synthesizing',
          description: 'Synthesizing response',
          status: 'pending',
        },
      ]
      setActivePipeline(steps)

      for (let i = 0; i < steps.length; i++) {
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 500))
        setActivePipeline((prev) =>
          prev!.map((s, idx) => ({
            ...s,
            status:
              idx < i + 1
                ? ('completed' as const)
                : idx === i + 1
                  ? ('active' as const)
                  : ('pending' as const),
          }))
        )
        if (thinkingSteps[i]) {
          const thinkingStep: ThinkingStep = {
            id: generateId(),
            content: thinkingSteps[i],
            timestamp: new Date(),
          }
          localThinking.push(thinkingStep)
          setActiveThinking([...localThinking])
        }
      }
      setActivePipeline((prev) =>
        prev!.map((s) => ({ ...s, status: 'completed' as const }))
      )
    } else {
      for (const step of thinkingSteps) {
        await new Promise((r) => setTimeout(r, 400))
        const thinkingStep: ThinkingStep = {
          id: generateId(),
          content: step,
          timestamp: new Date(),
        }
        localThinking.push(thinkingStep)
        setActiveThinking([...localThinking])
      }
    }

    // Show tool executions
    for (const tool of tools) {
      setActiveTools((prev) => [...prev, { ...tool, status: 'running' }])
      await new Promise((r) => setTimeout(r, 600))
      setActiveTools((prev) =>
        prev.map((t) =>
          t.id === tool.id ? { ...t, status: 'completed' as const } : t
        )
      )
    }

    setIsThinking(false)
    setIsStreaming(true)
    setStreamingText('')

    streamCancelRef.current = simulateStreaming(
      response,
      (chunk) => setStreamingText((prev) => prev + chunk),
      () => {
        streamCancelRef.current = null
        setIsStreaming(false)
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          thinking: localThinking,
          sources,
          tools: [...tools],
          status: 'delivered',
        }
        updateMessages([...newMessages, assistantMessage])
        setStreamingText('')
        setActivePipeline(null)
        setActiveTools([])

        const inTokens = estimateTokens(text)
        const outTokens = estimateTokens(response)
        setTokenSettings((prev) => ({
          ...prev,
          used: {
            input: prev.used.input + inTokens,
            output: prev.used.output + outTokens,
            total: prev.used.total + inTokens + outTokens,
          },
        }))
      },
      12
    )
  }

  const handleFeedback = (msgId: string, feedback: 'up' | 'down') => {
    updateMessages(
      messages.map((m) => (m.id === msgId ? { ...m, feedback } : m))
    )
  }
  const handleDeleteMessage = (msgId: string) => {
    updateMessages(messages.filter((m) => m.id !== msgId))
  }
  const handleRegenerate = (msgId: string) => {
    const idx = messages.findIndex((m) => m.id === msgId)
    if (idx > 0 && messages[idx - 1]?.role === 'user') {
      updateMessages(messages.slice(0, idx))
      setTimeout(() => handleSend(messages[idx - 1].content), 100)
    }
  }
  const handleEditStart = (msgId: string) => {
    const msg = messages.find((m) => m.id === msgId)
    if (msg) {
      setEditingMessageId(msgId)
      setEditingText(msg.content)
    }
  }
  const handleEditSave = (msgId: string) => {
    const idx = messages.findIndex((m) => m.id === msgId)
    if (idx === -1) return
    updateMessages(
      messages.slice(0, idx).concat({ ...messages[idx], content: editingText })
    )
    setEditingMessageId(null)
    setTimeout(() => handleSend(editingText), 100)
  }

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).split('\n')
        const lang = lines[0]?.trim() || 'typescript'
        const code = lines.slice(1).join('\n')
        return <CodeBlockDisplay key={i} code={code} language={lang} />
      }
      return (
        <div key={i}>
          {part.split('\n').map((line, j) => {
            if (line.startsWith('## '))
              return (
                <h2 key={j} className="text-lg font-bold mt-4 mb-2">
                  {line.slice(3)}
                </h2>
              )
            if (line.startsWith('### '))
              return (
                <h3 key={j} className="text-base font-semibold mt-3 mb-1">
                  {line.slice(4)}
                </h3>
              )
            if (line.startsWith('- **')) {
              const end = line.indexOf('**', 4)
              if (end > 0)
                return (
                  <div key={j} className="flex gap-2 py-0.5">
                    <span className="text-muted-foreground">-</span>
                    <span>
                      <strong>{line.slice(4, end)}</strong>
                      {line.slice(end + 2)}
                    </span>
                  </div>
                )
            }
            if (line.startsWith('- '))
              return (
                <div key={j} className="flex gap-2 py-0.5">
                  <span className="text-muted-foreground">-</span>
                  <span>{line.slice(2)}</span>
                </div>
              )
            if (/^\d+\.\s/.test(line))
              return (
                <div key={j} className="flex gap-2 py-0.5">
                  <span className="text-muted-foreground font-mono text-xs w-4">
                    {line.match(/^\d+/)?.[0]}.
                  </span>
                  <span>{line.replace(/^\d+\.\s/, '')}</span>
                </div>
              )
            if (line.trim() === '') return <div key={j} className="h-2" />
            const escaped = escapeHtml(line)
            const rendered = escaped
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(
                /`(.*?)`/g,
                '<code class="px-1 py-0.5 rounded bg-muted text-sm font-mono">$1</code>'
              )
              .replace(
                /\[(\d+)\]/g,
                '<sup class="text-blue-500 font-medium cursor-pointer">[$1]</sup>'
              )
            return (
              <p
                key={j}
                className="py-0.5"
                dangerouslySetInnerHTML={{ __html: rendered }}
              />
            )
          })}
        </div>
      )
    })
  }

  return (
    <div>
      <PageHeader
        title="Deep Research Assistant"
        description="Multi-step research with MCP servers, enriched sources, tool plugins, and cross-referenced findings."
        icon={Globe}
        badge="40 Components"
      />

      <div className="glass-card overflow-hidden border-0 h-[calc(100vh-14rem)]">
        <ApiKeyBar
          provider={provider}
          onProviderChange={setProvider}
          model={model}
          onModelChange={setModel}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
        />

        <div className="flex h-[calc(100%-3rem)]">
          {/* Sidebar */}
          <ResearchSidebar
            conversations={conversations}
            activeConversationId={activeConvId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={() => {
              cancelStreaming()
              const c = createConversation()
              setConversations((prev) => [c, ...prev])
              setActiveConvId(c.id)
            }}
            onDeleteConversation={(id) => {
              if (conversations.length <= 1) return
              if (id === activeConvId) cancelStreaming()
              setConversations((prev) => prev.filter((c) => c.id !== id))
              if (id === activeConvId)
                setActiveConvId(conversations.find((c) => c.id !== id)!.id)
            }}
            savedPrompts={savedPrompts}
            onUsePrompt={(text) => {
              setInput(text)
              inputRef.current?.focus()
            }}
            onDeletePrompt={(id) =>
              setSavedPrompts((prev) => prev.filter((p) => p.id !== id))
            }
            onSavePrompt={(text) =>
              setSavedPrompts((prev) => [...prev, { id: generateId(), text }])
            }
            collapsed={sidebarCollapsed}
            onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Chat */}
          <div className="flex-1 flex flex-col min-w-0">
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              {messages.length === 0 && !isStreaming ? (
                <ResearchWelcomeScreen
                  onSuggestionClick={(text) => {
                    setInput(text)
                    inputRef.current?.focus()
                  }}
                />
              ) : (
                <div className="p-4 space-y-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'group flex gap-3',
                        msg.role === 'user' && 'justify-end'
                      )}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[75%] min-w-0',
                          msg.role === 'user' ? 'order-first' : ''
                        )}
                      >
                        {msg.role === 'assistant' &&
                          msg.thinking &&
                          msg.thinking.length > 0 && (
                            <ThinkingDisplay steps={msg.thinking} />
                          )}
                        {msg.role === 'assistant' &&
                          msg.tools &&
                          msg.tools.length > 0 && (
                            <div className="mb-2 space-y-1.5">
                              {msg.tools.map((tool) => (
                                <ToolExecutionCard key={tool.id} tool={tool} />
                              ))}
                            </div>
                          )}
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-3',
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : 'bg-muted/50'
                          )}
                        >
                          {editingMessageId === msg.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="w-full bg-transparent border rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                                rows={3}
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => setEditingMessageId(null)}
                                  className="text-xs px-2 py-1 rounded bg-muted"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleEditSave(msg.id)}
                                  className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground"
                                >
                                  Save & Resend
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm">
                              {renderContent(msg.content)}
                            </div>
                          )}
                        </div>
                        {msg.sources && msg.sources.length > 0 && (
                          <SourceDisplay sources={msg.sources} />
                        )}
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">
                            {formatTimestamp(msg.timestamp)}
                          </span>
                          <MessageActions
                            role={msg.role as 'user' | 'assistant'}
                            feedback={msg.feedback}
                            onFeedback={(fb) => handleFeedback(msg.id, fb)}
                            onCopy={() => copy(msg.content)}
                            onRegenerate={
                              msg.role === 'assistant'
                                ? () => handleRegenerate(msg.id)
                                : undefined
                            }
                            onDelete={() => handleDeleteMessage(msg.id)}
                            onEdit={
                              msg.role === 'user'
                                ? () => handleEditStart(msg.id)
                                : undefined
                            }
                          />
                        </div>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Active pipeline */}
                  {activePipeline && (
                    <ResearchPipeline steps={activePipeline} />
                  )}

                  {/* Active tools */}
                  {activeTools.length > 0 && !isStreaming && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="space-y-1.5 max-w-[75%]">
                        {isThinking && (
                          <ThinkingDisplay steps={activeThinking} isActive />
                        )}
                        {activeTools.map((t) => (
                          <ToolExecutionCard key={t.id} tool={t} />
                        ))}
                      </div>
                    </div>
                  )}

                  {isStreaming && streamingText && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-muted/50">
                        <div className="text-sm">
                          {renderContent(streamingText)}
                        </div>
                        <span className="inline-block w-1.5 h-4 bg-primary animate-pulse rounded-sm ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4 bg-card/50 relative">
              {showSlashMenu && (
                <div className="absolute bottom-full left-4 mb-2 w-64 rounded-xl border bg-card shadow-xl z-50 py-1">
                  {slashCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        setInput(cmd.label + ' ')
                        setShowSlashMenu(false)
                        inputRef.current?.focus()
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <span className="font-mono text-xs text-primary">
                        {cmd.label}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {cmd.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      setShowSlashMenu(e.target.value.endsWith('/'))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                      if (e.key === 'Escape') setShowSlashMenu(false)
                    }}
                    placeholder={
                      deepResearchMode
                        ? 'Enter a research topic for deep analysis...'
                        : 'Ask anything... (/ for commands)'
                    }
                    rows={1}
                    className="w-full px-4 py-2.5 pr-20 rounded-xl bg-muted/50 border border-muted-foreground/10 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
                  />
                  <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
                    <button
                      onClick={() => setShowSlashMenu(!showSlashMenu)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <Slash className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isStreaming}
                      className={cn(
                        'p-1.5 rounded-md transition-colors',
                        input.trim() && !isStreaming
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {isStreaming ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  {deepResearchMode && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-medium">
                      Deep Research ON
                    </span>
                  )}
                  <span>
                    {mcpServers.filter((s) => s.status === 'connected').length}{' '}
                    MCP servers connected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowExport(true)}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Download className="h-3 w-3" /> Export
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Settings className="h-3 w-3" /> Settings
                  </button>
                  <button
                    onClick={() => setRightPanelOpen(!rightPanelOpen)}
                    className="hover:text-foreground transition-colors"
                  >
                    {rightPanelOpen ? (
                      <PanelRightClose className="h-3 w-3" />
                    ) : (
                      <PanelRight className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          {rightPanelOpen && (
            <div className="w-72 border-l bg-card/30 overflow-y-auto p-4 space-y-6 shrink-0">
              <MCPManagerPanel
                servers={mcpServers}
                onServersChange={setMcpServers}
              />
              <div className="h-px bg-border" />
              <ResearchContextPanel
                researchFocus={researchFocus}
                onResearchFocusChange={setResearchFocus}
                preferredSources={preferredSources}
                onToggleSource={(s) =>
                  setPreferredSources((prev) => ({ ...prev, [s]: !prev[s] }))
                }
                depthLevel={depthLevel}
                onDepthLevelChange={setDepthLevel}
                deepResearchMode={deepResearchMode}
                onToggleDeepResearch={() =>
                  setDeepResearchMode(!deepResearchMode)
                }
                files={contextFiles}
                onFilesChange={setContextFiles}
              />
              <div className="h-px bg-border" />
              <MemoryPanel
                settings={memorySettings}
                onUpdate={setMemorySettings}
                extraToggles={[
                  {
                    key: 'findings',
                    label: 'Remember findings',
                    checked: memorySettings.rememberFindings || false,
                  },
                  {
                    key: 'crossRef',
                    label: 'Cross-reference research',
                    checked: memorySettings.crossReference || false,
                  },
                ]}
                onExtraToggle={(key) =>
                  setMemorySettings((prev) => ({
                    ...prev,
                    [key === 'findings'
                      ? 'rememberFindings'
                      : 'crossReference']: !(key === 'findings'
                      ? prev.rememberFindings
                      : prev.crossReference),
                  }))
                }
              />
              <div className="h-px bg-border" />
              <TokenPanel
                settings={tokenSettings}
                onUpdate={setTokenSettings}
              />
            </div>
          )}
        </div>
      </div>

      <ChatExportDialog
        open={showExport}
        onClose={() => setShowExport(false)}
        onExport={() => {}}
        formats={[
          {
            id: 'report',
            label: 'Research Report',
            description: 'Markdown with citations and sources',
            icon: <Globe className="h-4 w-4" />,
          },
          {
            id: 'json',
            label: 'JSON',
            description: 'Full structured data',
            icon: <Download className="h-4 w-4" />,
          },
          {
            id: 'markdown',
            label: 'Markdown',
            description: 'Plain markdown format',
            icon: <Download className="h-4 w-4" />,
          },
        ]}
      />
      <SettingsDialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        temperature={settingsTemp}
        onTemperatureChange={setSettingsTemp}
        maxTokens={settingsMaxTokens}
        onMaxTokensChange={setSettingsMaxTokens}
        codeTheme={settingsCodeTheme}
        onCodeThemeChange={setSettingsCodeTheme}
        responseLength={settingsResponseLength}
        onResponseLengthChange={setSettingsResponseLength}
      />
    </div>
  )
}

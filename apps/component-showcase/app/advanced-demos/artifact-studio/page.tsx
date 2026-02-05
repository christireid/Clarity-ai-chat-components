'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { PageHeader } from '@/components/component-section'
import { cn } from '@clarity-chat/primitives'
import { useAutoScroll, useClipboard } from '@clarity-chat/react/internal'
import {
  Send,
  Blocks,
  Settings,
  Download,
  Slash,
  Loader2,
  Bot,
  User,
  Layers,
  Wrench,
  Code,
  FileText,
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
  type Artifact,
  type ArtifactType,
  type ArtifactRef,
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

import { ArtifactPanel } from './components/artifact-panel'
import { ArtifactRenderer } from './components/artifact-renderer'
import {
  ARTIFACT_TEMPLATES as artifactTemplates,
  type ArtifactTemplate,
} from './components/artifact-data'
import { ArtifactMCPManager } from './components/mcp-manager'
import { ToolPanel } from './components/tool-panel'
import { ArtifactSidebar } from './components/chat-sidebar'
import { ArtifactWelcomeScreen } from './components/welcome-screen'

export const dynamic = 'force-dynamic'

function createConversation(): Conversation {
  return {
    id: generateId(),
    title: 'New Project',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    artifactCount: 0,
  }
}

const defaultMCPServers: MCPServer[] = [
  {
    id: '1',
    name: 'Code Runner MCP',
    endpoint: 'https://code.mcp.local:3001',
    status: 'connected',
    enabled: true,
    tools: ['run_code', 'lint_code', 'format_code'],
  },
  {
    id: '2',
    name: 'Design Tool MCP',
    endpoint: 'https://design.mcp.local:3002',
    status: 'connected',
    enabled: true,
    tools: ['generate_svg', 'create_layout'],
  },
  {
    id: '3',
    name: 'Data Viz MCP',
    endpoint: 'https://viz.mcp.local:3003',
    status: 'disconnected',
    enabled: false,
    tools: ['create_chart', 'plot_data'],
  },
]

const defaultPrompts: SavedPrompt[] = [
  { id: '1', text: 'Create a React login form component' },
  { id: '2', text: 'Generate a data flow diagram' },
  { id: '3', text: 'Write a REST API documentation' },
  { id: '4', text: 'Build a dashboard layout in HTML' },
  { id: '5', text: 'Create a TypeScript utility library' },
]

function findTemplate(text: string): ArtifactTemplate | null {
  const lower = text.toLowerCase()
  for (const template of artifactTemplates) {
    if (template.trigger.some((t) => lower.includes(t))) {
      return template
    }
  }
  return null
}

export default function ArtifactStudioPage() {
  const [provider, setProvider] = useState('anthropic')
  const [model, setModel] = useState('claude-3.5-sonnet')
  const [apiKey, setApiKey] = useState('')

  const [conversations, setConversations] = useState<Conversation[]>([
    createConversation(),
  ])
  const [activeConvId, setActiveConvId] = useState(conversations[0].id)
  const [savedPrompts, setSavedPrompts] =
    useState<SavedPrompt[]>(defaultPrompts)
  const [mcpServers, setMcpServers] = useState<MCPServer[]>(defaultMCPServers)

  // Artifacts
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null)
  const [artifactPanelOpen, setArtifactPanelOpen] = useState(false)
  const [isGeneratingArtifact, setIsGeneratingArtifact] = useState(false)
  const [toolUsageCounts, setToolUsageCounts] = useState<
    Record<string, number>
  >({})

  // Settings
  const [memorySettings, setMemorySettings] = useState<MemorySettings>({
    enabled: true,
    strategy: 'sliding-window',
    maxTokens: 4096,
    usage: 890,
    trackPatterns: true,
    rememberPreferences: true,
  })
  const [tokenSettings, setTokenSettings] = useState<TokenSettings>({
    optimizationEnabled: true,
    techniques: { compression: true, summarization: false, pruning: true },
    budget: 12000,
    used: { input: 1800, output: 1200, total: 3000 },
    showExpenditure: true,
  })

  // Context
  const [masterContext, setMasterContext] = useState('')
  const [techStack, setTechStack] = useState<string[]>(['React', 'TypeScript'])
  const [contextFiles, setContextFiles] = useState<FileAttachment[]>([])

  // UI state
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [activeThinking, setActiveThinking] = useState<ThinkingStep[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [activeTools, setActiveTools] = useState<ToolExecution[]>([])
  const [showExport, setShowExport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [settingsTemp, setSettingsTemp] = useState(0.7)
  const [settingsMaxTokens, setSettingsMaxTokens] = useState(4096)
  const [settingsCodeTheme, setSettingsCodeTheme] = useState('monokai')
  const [settingsResponseLength, setSettingsResponseLength] =
    useState('balanced')
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
    dependencies: [messages, streamingText, activeThinking],
  })
  const activeArtifact = artifacts.find((a) => a.id === activeArtifactId)

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
    setStreamingText('')
    setActiveThinking([])
  }, [])

  const handleSelectConversation = useCallback(
    (id: string) => {
      cancelStreaming()
      setActiveConvId(id)
    },
    [cancelStreaming]
  )

  const slashCommands = [
    { id: 'create', label: '/create', description: 'Create a new artifact' },
    { id: 'edit', label: '/edit', description: 'Edit latest artifact' },
    { id: 'version', label: '/version', description: 'Show version history' },
    { id: 'preview', label: '/preview', description: 'Toggle artifact panel' },
    { id: 'export', label: '/export', description: 'Export artifacts' },
    { id: 'tools', label: '/tools', description: 'List available tools' },
  ]

  const handleSend = async (overrideText?: string) => {
    const text = overrideText || input.trim()
    if (!text || isStreaming) return

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

    // Local array to track thinking steps (avoids stale closure in callbacks)
    const localThinking: ThinkingStep[] = []

    // Check if this should create an artifact
    const template = findTemplate(text)
    const isUpdate =
      text.toLowerCase().includes('update') ||
      text.toLowerCase().includes('modify') ||
      text.toLowerCase().includes('change')

    if (template && !isUpdate) {
      // Create artifact flow
      const thinkingSteps = template.thinkingSteps
      for (const step of thinkingSteps) {
        await new Promise((r) => setTimeout(r, 500))
        const thinkingStep: ThinkingStep = {
          id: generateId(),
          content: step,
          timestamp: new Date(),
        }
        localThinking.push(thinkingStep)
        setActiveThinking([...localThinking])
      }

      // Tool execution
      const toolId = generateId()
      const tool: ToolExecution = {
        id: toolId,
        name: template.toolName,
        status: 'running',
        input: `Creating ${template.artifact.type} artifact...`,
      }
      setActiveTools([tool])
      await new Promise((r) => setTimeout(r, 1200))
      setActiveTools([
        {
          ...tool,
          status: 'completed',
          output: `${template.artifact.title} created`,
          duration: '1.2s',
        },
      ])

      // Update tool usage
      const toolMap: Record<string, string> = {
        'Code Generator': 'code-gen',
        'Document Writer': 'doc-writer',
        'Diagram Creator': 'diagram-creator',
        'Data Transformer': 'data-transformer',
        'HTML Builder': 'html-builder',
      }
      const toolKey = toolMap[template.toolName] || 'code-gen'
      setToolUsageCounts((prev) => ({
        ...prev,
        [toolKey]: (prev[toolKey] || 0) + 1,
      }))

      setIsThinking(false)
      setIsGeneratingArtifact(true)

      // Create artifact
      const newArtifact: Artifact = {
        id: generateId(),
        title: template.artifact.title,
        type: template.artifact.type,
        content: template.artifact.content,
        language: template.artifact.language,
        versions: [
          {
            id: generateId(),
            content: template.artifact.content,
            timestamp: new Date(),
            label: 'v1',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Progressively reveal artifact
      setArtifactPanelOpen(true)
      setArtifacts((prev) => [...prev, { ...newArtifact, content: '' }])
      setActiveArtifactId(newArtifact.id)

      // Simulate progressive generation
      const lines = template.artifact.content.split('\n')
      for (let i = 0; i < lines.length; i += 3) {
        await new Promise((r) => setTimeout(r, 50))
        const partial = lines.slice(0, i + 3).join('\n')
        setArtifacts((prev) =>
          prev.map((a) =>
            a.id === newArtifact.id ? { ...a, content: partial } : a
          )
        )
      }
      setArtifacts((prev) =>
        prev.map((a) => (a.id === newArtifact.id ? newArtifact : a))
      )
      setIsGeneratingArtifact(false)

      // Update conversation artifact count
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, artifactCount: (c.artifactCount || 0) + 1 }
            : c
        )
      )

      // Stream response
      setIsStreaming(true)
      setStreamingText('')
      streamCancelRef.current = simulateStreaming(
        template.response,
        (chunk) => setStreamingText((prev) => prev + chunk),
        () => {
          setIsStreaming(false)
          const assistantMessage: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: template.response,
            timestamp: new Date(),
            thinking: localThinking,
            tools: [
              {
                ...tool,
                status: 'completed',
                output: `${template.artifact.title} created`,
                duration: '1.2s',
              },
            ],
            artifacts: [
              {
                id: newArtifact.id,
                title: newArtifact.title,
                type: newArtifact.type,
                version: 1,
              },
            ],
            status: 'delivered',
          }
          updateMessages([...newMessages, assistantMessage])
          setStreamingText('')
          setActiveTools([])
          const inT = estimateTokens(text)
          const outT = estimateTokens(template.response)
          setTokenSettings((prev) => ({
            ...prev,
            used: {
              input: prev.used.input + inT,
              output: prev.used.output + outT,
              total: prev.used.total + inT + outT,
            },
          }))
        },
        12
      )
    } else if (isUpdate && artifacts.length > 0) {
      // Update existing artifact
      const latest = artifacts[artifacts.length - 1]
      await new Promise((r) => setTimeout(r, 400))
      const step1: ThinkingStep = {
        id: generateId(),
        content: 'Understanding modification request...',
        timestamp: new Date(),
      }
      localThinking.push(step1)
      setActiveThinking([...localThinking])
      await new Promise((r) => setTimeout(r, 400))
      const step2: ThinkingStep = {
        id: generateId(),
        content: `Updating artifact: ${latest.title}...`,
        timestamp: new Date(),
      }
      localThinking.push(step2)
      setActiveThinking([...localThinking])
      await new Promise((r) => setTimeout(r, 600))

      setIsThinking(false)

      // Create new version with a small modification
      const updatedContent =
        latest.content + '\n// Updated based on user request: ' + text
      const newVersion = {
        id: generateId(),
        content: updatedContent,
        timestamp: new Date(),
        label: `v${latest.versions.length + 1}`,
      }
      setArtifacts((prev) =>
        prev.map((a) =>
          a.id === latest.id
            ? {
                ...a,
                content: updatedContent,
                versions: [...a.versions, newVersion],
                updatedAt: new Date(),
              }
            : a
        )
      )
      setActiveArtifactId(latest.id)
      setArtifactPanelOpen(true)

      const updateResponse = `I've updated **${latest.title}** (now ${newVersion.label}). The changes reflect your request: "${text.slice(0, 50)}". You can view the version history in the artifact panel.`

      setIsStreaming(true)
      setStreamingText('')
      streamCancelRef.current = simulateStreaming(
        updateResponse,
        (chunk) => setStreamingText((prev) => prev + chunk),
        () => {
          setIsStreaming(false)
          updateMessages([
            ...newMessages,
            {
              id: generateId(),
              role: 'assistant',
              content: updateResponse,
              timestamp: new Date(),
              artifacts: [
                {
                  id: latest.id,
                  title: latest.title,
                  type: latest.type,
                  version: latest.versions.length + 1,
                },
              ],
              status: 'delivered',
            },
          ])
          setStreamingText('')
        },
        12
      )
    } else {
      // Normal conversation
      await new Promise((r) => setTimeout(r, 400))
      const thinkStep1: ThinkingStep = {
        id: generateId(),
        content: 'Processing your request...',
        timestamp: new Date(),
      }
      localThinking.push(thinkStep1)
      setActiveThinking([...localThinking])
      await new Promise((r) => setTimeout(r, 500))
      const thinkStep2: ThinkingStep = {
        id: generateId(),
        content: 'Generating response...',
        timestamp: new Date(),
      }
      localThinking.push(thinkStep2)
      setActiveThinking([...localThinking])
      setIsThinking(false)

      const response = `I'd be happy to help! You can ask me to create various artifacts:\n\n- **Code**: React components, TypeScript modules, utility functions\n- **Documents**: API docs, README files, guides\n- **Diagrams**: Flowcharts, sequence diagrams (Mermaid)\n- **HTML**: Layouts, dashboards, web pages\n- **Data**: Tables, JSON schemas, structured data\n\nTry asking something like "Create a React component" or "Generate a flowchart diagram".\n\nYou can also use \`/create\` followed by a type, or reference existing artifacts with \`@artifact-name\`.`

      setIsStreaming(true)
      setStreamingText('')
      streamCancelRef.current = simulateStreaming(
        response,
        (chunk) => setStreamingText((prev) => prev + chunk),
        () => {
          setIsStreaming(false)
          updateMessages([
            ...newMessages,
            {
              id: generateId(),
              role: 'assistant',
              content: response,
              timestamp: new Date(),
              thinking: localThinking,
              status: 'delivered',
            },
          ])
          setStreamingText('')
          const inT = estimateTokens(text)
          const outT = estimateTokens(response)
          setTokenSettings((prev) => ({
            ...prev,
            used: {
              input: prev.used.input + inT,
              output: prev.used.output + outT,
              total: prev.used.total + inT + outT,
            },
          }))
        },
        12
      )
    }
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
            if (line.trim() === '') return <div key={j} className="h-2" />
            const escaped = escapeHtml(line)
            const rendered = escaped
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(
                /`(.*?)`/g,
                '<code class="px-1 py-0.5 rounded bg-muted text-sm font-mono">$1</code>'
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
        title="Artifact Studio"
        description="Create code, documents, diagrams, and interactive previews with Claude-style artifact generation and live preview."
        icon={Blocks}
        badge="38 Components"
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
          <ArtifactSidebar
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
            masterContext={masterContext}
            onMasterContextChange={setMasterContext}
            techStack={techStack}
            onToggleTech={(tech) =>
              setTechStack((prev) =>
                prev.includes(tech)
                  ? prev.filter((t) => t !== tech)
                  : [...prev, tech]
              )
            }
            collapsed={sidebarCollapsed}
            onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Chat */}
          <div className="flex-1 flex flex-col min-w-0">
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              {messages.length === 0 && !isStreaming ? (
                <ArtifactWelcomeScreen
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
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
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
                            <div className="mb-2 space-y-1">
                              {msg.tools.map((tool) => (
                                <div
                                  key={tool.id}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 text-xs"
                                >
                                  <Wrench className="h-3 w-3 text-orange-500" />
                                  <span className="font-medium">
                                    {tool.name}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {tool.output}
                                  </span>
                                  {tool.duration && (
                                    <span className="text-muted-foreground ml-auto font-mono">
                                      {tool.duration}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        {/* Artifact references */}
                        {msg.artifacts && msg.artifacts.length > 0 && (
                          <div className="mb-2 space-y-1">
                            {msg.artifacts.map((ref) => (
                              <button
                                key={ref.id}
                                onClick={() => {
                                  setActiveArtifactId(ref.id)
                                  setArtifactPanelOpen(true)
                                }}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-sm hover:bg-violet-500/15 transition-colors w-full text-left"
                              >
                                <Layers className="h-4 w-4 text-violet-500" />
                                <div className="flex-1">
                                  <span className="font-medium">
                                    {ref.title}
                                  </span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    v{ref.version} &middot; {ref.type}
                                  </span>
                                </div>
                                <span className="text-xs text-violet-500">
                                  View
                                </span>
                              </button>
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
                                className="w-full bg-transparent border rounded-lg p-2 text-sm resize-none focus:outline-none"
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

                  {/* Active state */}
                  {(isThinking || activeTools.length > 0) && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="max-w-[75%] space-y-2">
                        {isThinking && (
                          <ThinkingDisplay steps={activeThinking} isActive />
                        )}
                        {activeTools.map((t) => (
                          <div
                            key={t.id}
                            className={cn(
                              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs',
                              t.status === 'running'
                                ? 'bg-yellow-500/10'
                                : 'bg-muted/30'
                            )}
                          >
                            {t.status === 'running' ? (
                              <Loader2 className="h-3 w-3 animate-spin text-yellow-500" />
                            ) : (
                              <Wrench className="h-3 w-3 text-green-500" />
                            )}
                            <span className="font-medium">{t.name}</span>
                            <span className="text-muted-foreground">
                              {t.status === 'running' ? t.input : t.output}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isStreaming && streamingText && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-muted/50">
                        <div className="text-sm">
                          {renderContent(streamingText)}
                        </div>
                        <span className="inline-block w-1.5 h-4 bg-violet-500 animate-pulse rounded-sm ml-0.5" />
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
                        if (cmd.id === 'preview') {
                          setArtifactPanelOpen(!artifactPanelOpen)
                          setShowSlashMenu(false)
                        } else if (cmd.id === 'export') {
                          setShowExport(true)
                          setShowSlashMenu(false)
                        } else {
                          setInput(cmd.label + ' ')
                          setShowSlashMenu(false)
                          inputRef.current?.focus()
                        }
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <span className="font-mono text-xs text-violet-500">
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
                  placeholder="Describe what to create... (/ for commands)"
                  rows={1}
                  className="flex-1 px-4 py-2.5 pr-20 rounded-xl bg-muted/50 border border-muted-foreground/10 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
                />
                <div className="absolute right-6 bottom-5.5 flex items-center gap-1">
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
              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>
                    {artifacts.length} artifact
                    {artifacts.length !== 1 ? 's' : ''} created
                  </span>
                  <span>
                    {mcpServers.filter((s) => s.status === 'connected').length}{' '}
                    MCP servers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowExport(true)}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    <Download className="h-3 w-3" /> Export
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    <Settings className="h-3 w-3" /> Settings
                  </button>
                  <button
                    onClick={() => setArtifactPanelOpen(!artifactPanelOpen)}
                    className={cn(
                      'flex items-center gap-1 hover:text-foreground',
                      artifactPanelOpen && 'text-violet-500'
                    )}
                  >
                    <Layers className="h-3 w-3" /> Artifacts
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Artifact Panel */}
          {artifactPanelOpen && (
            <ArtifactPanel
              artifacts={artifacts}
              activeArtifactId={activeArtifactId}
              onActiveArtifactChange={setActiveArtifactId}
              onClose={() => setArtifactPanelOpen(false)}
              isGenerating={isGeneratingArtifact}
            />
          )}
        </div>
      </div>

      <ChatExportDialog
        open={showExport}
        onClose={() => setShowExport(false)}
        onExport={() => {}}
        formats={[
          {
            id: 'all',
            label: 'Conversation + Artifacts',
            description: 'Everything as structured JSON',
            icon: <Layers className="h-4 w-4" />,
          },
          {
            id: 'artifacts',
            label: 'Artifacts Only',
            description: 'Individual artifact files',
            icon: <Code className="h-4 w-4" />,
          },
          {
            id: 'markdown',
            label: 'Conversation Only',
            description: 'Chat as Markdown',
            icon: <FileText className="h-4 w-4" />,
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
      >
        <div className="space-y-4">
          <h3 className="font-medium">MCP Servers</h3>
          <ArtifactMCPManager
            servers={mcpServers}
            onServersChange={setMcpServers}
          />
          <div className="h-px bg-border" />
          <h3 className="font-medium">Creation Tools</h3>
          <ToolPanel usageCounts={toolUsageCounts} />
        </div>
      </SettingsDialog>
    </div>
  )
}

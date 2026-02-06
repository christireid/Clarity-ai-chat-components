'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { useClarityChat } from '@clarity-chat/react'
import { PageHeader } from '@/components/component-section'
import { cn } from '@clarity-chat/primitives'
import { useAutoScroll, MarkdownRenderer } from '@clarity-chat/react'
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
  Code,
  FileText,
} from 'lucide-react'

import {
  ApiKeyBar,
  MessageActions,
  ChatExportDialog,
  SettingsDialog,
  type ChatMessage,
  type Artifact,
  type Conversation,
  type SavedPrompt,
  type MCPServer,
  type HookMessage,
  getTextContent,
  generateId,
  MARKDOWN_CONFIG,
  createConversation as createConversationBase,
} from '../_shared'

import { ArtifactPanel } from './components/artifact-panel'
import { ArtifactMCPManager } from './components/mcp-manager'
import { ToolPanel } from './components/tool-panel'
import { ArtifactSidebar } from './components/chat-sidebar'
import { ArtifactWelcomeScreen } from './components/welcome-screen'

export const dynamic = 'force-dynamic'

function createConversation(): Conversation {
  return { ...createConversationBase('New Project'), artifactCount: 0 }
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
  const [artifacts] = useState<Artifact[]>([])
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null)
  const [artifactPanelOpen, setArtifactPanelOpen] = useState(false)

  // Context
  const [masterContext, setMasterContext] = useState('')
  const [techStack, setTechStack] = useState<string[]>(['React', 'TypeScript'])

  // UI state
  const [input, setInput] = useState('')
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
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({})

  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Chat hook — replaces all simulation code
  const chat = useClarityChat({
    api: '/api/advanced-demos/chat',
    body: {
      apiKey,
      model,
      systemPrompt: `You are a creative AI assistant specializing in generating artifacts. When asked to create code, documents, HTML, SVG, diagrams, tables, or JSON, generate high-quality, complete content. Format code with proper syntax. Be creative and thorough.`,
      temperature: settingsTemp,
      maxTokens: settingsMaxTokens,
    },
  })

  // Typed accessors — workaround for missing .d.ts declarations
  const chatMessages: HookMessage[] = useMemo(
    () => chat.messages ?? [],
    [chat.messages]
  )
  const chatData = chat.data as HookMessage | undefined
  const chatError = chat.error as Error | undefined

  const { scrollRef } = useAutoScroll({
    dependencies: [chatMessages, chat.isLoading],
  })

  // Sync chat messages to conversation state when they change
  useEffect(() => {
    if (chatMessages.length > 0) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? {
                ...c,
                messages: chatMessages.map(
                  (m: HookMessage): ChatMessage => ({
                    id: m.id || generateId(),
                    role: m.role as 'user' | 'assistant',
                    content: getTextContent(m.content),
                    timestamp: new Date(),
                  })
                ),
                updatedAt: new Date(),
              }
            : c
        )
      )
    }
  }, [chatMessages, activeConvId])

  const handleSend = async (overrideText?: string) => {
    const text = overrideText || input.trim()
    if (!text || chat.isLoading) return
    setInput('')
    setShowSlashMenu(false)
    try {
      await chat.append({ role: 'user', content: text })
    } catch {
      // Error is captured by chat.error state
    }
  }

  const handleSelectConversation = useCallback(
    (id: string) => {
      chat.stop()
      const targetConv = conversations.find((c) => c.id === id)
      if (targetConv) {
        chat.setMessages(
          targetConv.messages.map((m: ChatMessage) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          })) as never
        )
      }
      setActiveConvId(id)
    },
    [chat, conversations]
  )

  const handleFeedback = (msgId: string, fb: 'up' | 'down') => {
    setFeedback((prev) => ({ ...prev, [msgId]: fb }))
  }

  const handleDeleteMessage = (msgId: string) => {
    chat.setMessages(
      chatMessages.filter((m: HookMessage) => m.id !== msgId) as never
    )
  }

  const handleRegenerate = (msgId: string) => {
    const idx = chatMessages.findIndex((m: HookMessage) => m.id === msgId)
    if (idx < 0) return
    if (idx === chatMessages.length - 1) {
      // Last assistant message — use reload
      chat.reload()
    } else if (idx > 0 && chatMessages[idx - 1]?.role === 'user') {
      const userContent =
        typeof chatMessages[idx - 1].content === 'string'
          ? (chatMessages[idx - 1].content as string)
          : ''
      chat.setMessages(chatMessages.slice(0, idx - 1) as never)
      setTimeout(() => {
        chat.append({ role: 'user', content: userContent })
      }, 100)
    }
  }

  const handleEditStart = (msgId: string) => {
    const msg = chatMessages.find((m: HookMessage) => m.id === msgId)
    if (msg) {
      setEditingMessageId(msgId)
      setEditingText(getTextContent(msg.content))
    }
  }

  const handleEditSave = (msgId: string) => {
    const idx = chatMessages.findIndex((m: HookMessage) => m.id === msgId)
    if (idx === -1) return
    chat.setMessages(chatMessages.slice(0, idx) as never)
    setEditingMessageId(null)
    setTimeout(() => {
      chat.append({ role: 'user', content: editingText })
    }, 100)
  }

  const slashCommands = [
    { id: 'create', label: '/create', description: 'Create a new artifact' },
    { id: 'edit', label: '/edit', description: 'Edit latest artifact' },
    { id: 'version', label: '/version', description: 'Show version history' },
    { id: 'preview', label: '/preview', description: 'Toggle artifact panel' },
    { id: 'export', label: '/export', description: 'Export artifacts' },
    { id: 'tools', label: '/tools', description: 'List available tools' },
  ]

  const markdownConfig = MARKDOWN_CONFIG

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
              chat.stop()
              chat.setMessages([])
              const c = createConversation()
              setConversations((prev) => [c, ...prev])
              setActiveConvId(c.id)
            }}
            onDeleteConversation={(id) => {
              if (conversations.length <= 1) return
              if (id === activeConvId) {
                chat.stop()
                chat.setMessages([])
              }
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
            <div
              ref={scrollRef as React.RefObject<HTMLDivElement>}
              className="flex-1 overflow-y-auto"
            >
              {chatMessages.length === 0 && !chat.isLoading ? (
                <ArtifactWelcomeScreen
                  onSuggestionClick={(text) => {
                    setInput(text)
                    inputRef.current?.focus()
                  }}
                />
              ) : (
                <div className="p-4 space-y-6">
                  {chatMessages
                    .filter(
                      (m: HookMessage) =>
                        m.role === 'user' || m.role === 'assistant'
                    )
                    .map(
                      (
                        msg: HookMessage,
                        index: number,
                        filtered: HookMessage[]
                      ) => {
                        const msgId = msg.id || `msg-${index}`
                        const isLastAssistant =
                          msg.role === 'assistant' &&
                          index === filtered.length - 1
                        const content = getTextContent(msg.content)

                        return (
                          <div
                            key={msgId}
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
                              <div
                                className={cn(
                                  'rounded-2xl px-4 py-3',
                                  msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground ml-auto'
                                    : 'bg-muted/50'
                                )}
                              >
                                {editingMessageId === msgId ? (
                                  <div className="space-y-2">
                                    <textarea
                                      value={editingText}
                                      onChange={(e) =>
                                        setEditingText(e.target.value)
                                      }
                                      className="w-full bg-transparent border rounded-lg p-2 text-sm resize-none focus:outline-none"
                                      rows={3}
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={() =>
                                          setEditingMessageId(null)
                                        }
                                        className="text-xs px-2 py-1 rounded bg-muted"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => handleEditSave(msgId)}
                                        className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground"
                                      >
                                        Save & Resend
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm">
                                    <MarkdownRenderer
                                      content={content}
                                      isStreaming={
                                        isLastAssistant && chat.isLoading
                                      }
                                      config={markdownConfig}
                                    />
                                    {isLastAssistant && chat.isLoading && (
                                      <span className="inline-block w-1.5 h-4 bg-violet-500 animate-pulse rounded-sm ml-0.5" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <MessageActions
                                  role={msg.role as 'user' | 'assistant'}
                                  feedback={feedback[msgId]}
                                  onFeedback={(fb) => handleFeedback(msgId, fb)}
                                  copyText={content}
                                  onRegenerate={
                                    msg.role === 'assistant'
                                      ? () => handleRegenerate(msgId)
                                      : undefined
                                  }
                                  onDelete={() => handleDeleteMessage(msgId)}
                                  onEdit={
                                    msg.role === 'user'
                                      ? () => handleEditStart(msgId)
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
                        )
                      }
                    )}

                  {/* Thinking indicator — shown while loading and no content streamed yet */}
                  {chat.isLoading && !chatData?.content && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-muted/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error display */}
                  {chatError && (
                    <div className="mx-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                      {chatError.message}
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
                      if (chat.isLoading) {
                        chat.stop()
                      } else {
                        handleSend()
                      }
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
                    onClick={() => {
                      if (chat.isLoading) {
                        chat.stop()
                      } else {
                        handleSend()
                      }
                    }}
                    disabled={!input.trim() && !chat.isLoading}
                    className={cn(
                      'p-1.5 rounded-md transition-colors',
                      chat.isLoading
                        ? 'bg-red-500/20 text-red-500'
                        : input.trim()
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground'
                    )}
                  >
                    {chat.isLoading ? (
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
              isGenerating={false}
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
          <ToolPanel usageCounts={{}} />
        </div>
      </SettingsDialog>
    </div>
  )
}

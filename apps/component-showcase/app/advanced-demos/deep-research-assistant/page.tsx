'use client'

import { useState, useRef, useEffect } from 'react'
import { PageHeader } from '@/components/component-section'
import { cn } from '@clarity-chat/primitives'
import { useAutoScroll, MarkdownRenderer } from '@clarity-chat/react'
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
  TokenOptimizationShowcase,
  MemoryPanel,
  ChatExportDialog,
  SettingsDialog,
  ChatThinkingIndicator,
  ChatErrorDisplay,
  useConversationManager,
  useMessageEditing,
  useMessageActions,
  useTypedChat,
  type SavedPrompt,
  type FileAttachment,
  type MCPServer,
  type MemorySettings,
  type TokenSettings,
  getTextContent,
  MARKDOWN_CONFIG,
  generateId,
  exportConversation,
  formatTimestamp,
} from '../_shared'

import { MCPManager as MCPManagerPanel } from './components/mcp-manager'
import { ResearchSidebar } from './components/chat-sidebar'
import { ResearchContextPanel } from './components/context-panel'
import { ResearchWelcomeScreen } from './components/welcome-screen'

const AVATAR_GRADIENT = 'from-blue-500 to-indigo-600'

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

export default function DeepResearchAssistantPage() {
  const [provider, setProvider] = useState('openai')
  const [model, setModel] = useState('gpt-4o')
  const [apiKey, setApiKey] = useState('')

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

  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Track message timestamps (HookMessage has no timestamp field)
  const messageTimestampsRef = useRef<Record<string, Date>>({})

  const systemPrompt = deepResearchMode
    ? `You are a deep research assistant operating in Deep Research Mode. When users ask questions, provide thorough, well-structured research responses with proper markdown formatting. Include headers, bullet points, code examples where relevant, and numbered references. Provide comprehensive analysis with multiple sections, cross-referenced findings, and detailed recommendations.`
    : `You are a deep research assistant. When users ask questions, provide thorough, well-structured research responses with proper markdown formatting. Include headers, bullet points, code examples where relevant, and numbered references. For /research queries, provide more comprehensive analysis with multiple sections.`

  const chat = useTypedChat({
    api: '/api/advanced-demos/chat',
    body: {
      apiKey,
      model,
      systemPrompt,
      temperature: settingsTemp,
      maxTokens: settingsMaxTokens,
    },
  })

  // Conversation management
  const {
    conversations,
    activeConvId,
    handleSelectConversation,
    handleNewConversation,
    handleDeleteConversation,
  } = useConversationManager({
    defaultTitle: 'New Research',
    chat,
  })

  // Message editing
  const {
    editingMessageId,
    editingText,
    setEditingText,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
  } = useMessageEditing({
    chat,
    onResend: (text) => handleSend(text),
  })

  // Message actions (feedback, delete, regenerate)
  const { feedback, handleFeedback, handleDeleteMessage, handleRegenerate } =
    useMessageActions({ chat, onResend: (text) => handleSend(text) })

  const { scrollRef } = useAutoScroll({
    dependencies: [chat.messages, chat.isLoading],
  })

  // Record timestamps for new messages
  useEffect(() => {
    for (const msg of chat.messages) {
      if (msg.id && !messageTimestampsRef.current[msg.id]) {
        messageTimestampsRef.current[msg.id] = new Date()
      }
    }
  }, [chat.messages])

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
    if (!text || chat.isLoading) return
    setInput('')
    setShowSlashMenu(false)
    try {
      await chat.append({ role: 'user', content: text })
    } catch {
      // Error is captured by chat.error state
    }
  }

  const lastMsg =
    chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1]
      : undefined
  const showThinkingIndicator =
    chat.isLoading &&
    (!lastMsg ||
      lastMsg.role !== 'assistant' ||
      !getTextContent(lastMsg.content))

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
            onNewConversation={handleNewConversation}
            onDeleteConversation={handleDeleteConversation}
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
            onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
          />

          {/* Main Chat */}
          <div className="flex-1 flex flex-col min-w-0">
            <div
              ref={scrollRef as React.RefObject<HTMLDivElement>}
              className="flex-1 overflow-y-auto"
            >
              {chat.messages.length === 0 && !chat.isLoading ? (
                <ResearchWelcomeScreen
                  onSuggestionClick={(text) => {
                    setInput(text)
                    inputRef.current?.focus()
                  }}
                />
              ) : (
                <div
                  className="p-4 space-y-6"
                  role="log"
                  aria-live="polite"
                  aria-label="Chat messages"
                >
                  {chat.messages
                    .filter((m) => m.role === 'user' || m.role === 'assistant')
                    .map((msg, index, filtered) => {
                      const msgKey = msg.id || `msg-${index}`
                      const isLastAssistant =
                        msg.role === 'assistant' &&
                        index === filtered.length - 1
                      const content = getTextContent(msg.content)

                      return (
                        <div
                          key={msgKey}
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
                                    onChange={(e) =>
                                      setEditingText(e.target.value)
                                    }
                                    className="w-full bg-transparent border rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    rows={3}
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => handleEditCancel()}
                                      className="text-xs px-2 py-1 rounded bg-muted"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() =>
                                        msg.id && handleEditSave(msg.id)
                                      }
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
                                    config={MARKDOWN_CONFIG}
                                    isStreaming={
                                      isLastAssistant && chat.isLoading
                                    }
                                  />
                                </div>
                              )}
                              {isLastAssistant && chat.isLoading && (
                                <span className="inline-block w-1.5 h-4 bg-primary animate-pulse rounded-sm ml-0.5" />
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              {msg.id &&
                                messageTimestampsRef.current[msg.id] && (
                                  <span className="text-[10px] text-muted-foreground">
                                    {formatTimestamp(
                                      messageTimestampsRef.current[msg.id]
                                    )}
                                  </span>
                                )}
                              {msg.id && (
                                <MessageActions
                                  role={msg.role as 'user' | 'assistant'}
                                  feedback={feedback[msg.id]}
                                  onFeedback={(fb) =>
                                    handleFeedback(msg.id!, fb)
                                  }
                                  copyText={content}
                                  onRegenerate={
                                    msg.role === 'assistant'
                                      ? () => handleRegenerate(msg.id!)
                                      : undefined
                                  }
                                  onDelete={() => handleDeleteMessage(msg.id!)}
                                  onEdit={
                                    msg.role === 'user'
                                      ? () => handleEditStart(msg.id!)
                                      : undefined
                                  }
                                />
                              )}
                            </div>
                          </div>
                          {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      )
                    })}

                  <ChatThinkingIndicator
                    visible={showThinkingIndicator}
                    avatarGradient={AVATAR_GRADIENT}
                    label="Researching..."
                  />

                  <ChatErrorDisplay
                    error={chat.error}
                    variant="chat-bubble"
                    avatarGradient="from-red-500 to-rose-600"
                  />
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
                        if (chat.isLoading) {
                          chat.stop()
                        } else {
                          handleSend()
                        }
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
                      onClick={() => setShowSlashMenu((prev) => !prev)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                      title="Slash commands"
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
                    onClick={() => setRightPanelOpen((prev) => !prev)}
                    className="hover:text-foreground transition-colors"
                    title="Toggle context panel"
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
                  setDeepResearchMode((prev) => !prev)
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
              <TokenOptimizationShowcase
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
        onExport={(format) =>
          exportConversation(chat.messages, format, 'deep-research')
        }
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

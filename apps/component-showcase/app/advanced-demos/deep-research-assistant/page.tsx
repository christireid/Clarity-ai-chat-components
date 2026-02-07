'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { PageHeader } from '@/components/component-section'
import {
  useAutoScroll,
  ErrorBoundary,
  ChatInput,
  CommandPalette,
  FollowUpSuggestions,
  useKeyboardShortcuts,
  type PromptSuggestion,
  type CommandItem,
} from '@clarity-chat/react'
import {
  Globe,
  Settings,
  Download,
  Bot,
  PanelRight,
  PanelRightClose,
  Search,
  MessageSquarePlus,
  PanelLeft,
} from 'lucide-react'

import {
  ApiKeyBar,
  TokenOptimizationShowcase,
  MemoryPanel,
  ChatExportDialog,
  SettingsDialog,
  ChatThinkingIndicator,
  ChatErrorDisplay,
  ChatMessageItem,
  useConversationManager,
  useMessageEditing,
  useMessageActions,
  useTypedChat,
  useChatDerivedState,
  useChatInputHandlers,
  type SavedPrompt,
  type FileAttachment,
  type MCPServer,
  type MemorySettings,
  type TokenSettings,
  type HookMessage,
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

// Slash commands (constant data, no dependency on component state)
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

const defaultFollowUps: PromptSuggestion[] = [
  { id: '1', text: 'Dive deeper into this topic', type: 'follow-up' },
  { id: '2', text: 'Compare with alternatives', type: 'follow-up' },
  { id: '3', text: 'Show practical examples', type: 'follow-up' },
]

/** Shared assistant avatar for MessageBubble */
const AssistantAvatar = (
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
    <Bot className="h-4 w-4 text-white" />
  </div>
)

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
  const [showExport, setShowExport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [settingsTemp, setSettingsTemp] = useState(0.3)
  const [settingsMaxTokens, setSettingsMaxTokens] = useState(4096)
  const [settingsCodeTheme, setSettingsCodeTheme] = useState('monokai')
  const [settingsResponseLength, setSettingsResponseLength] =
    useState('detailed')

  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Track message timestamps (HookMessage has no timestamp field)
  const messageTimestampsRef = useRef<Record<string, Date>>({})

  const systemPrompt = useMemo(
    () =>
      deepResearchMode
        ? `You are a deep research assistant operating in Deep Research Mode. When users ask questions, provide thorough, well-structured research responses with proper markdown formatting. Include headers, bullet points, code examples where relevant, and numbered references. Provide comprehensive analysis with multiple sections, cross-referenced findings, and detailed recommendations.`
        : `You are a deep research assistant. When users ask questions, provide thorough, well-structured research responses with proper markdown formatting. Include headers, bullet points, code examples where relevant, and numbered references. For /research queries, provide more comprehensive analysis with multiple sections.`,
    [deepResearchMode]
  )

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

  // Shared input state & handlers
  const {
    input,
    setInput,
    showSlashMenu,
    setShowSlashMenu,
    handleSend,
    handleInputChange,
    handleInputSubmit,
    handleFollowUp,
  } = useChatInputHandlers(chat)

  // Derived chat UI state
  const {
    showThinkingIndicator,
    showFollowUp,
    followUpSuggestions,
    streamingMsgId,
  } = useChatDerivedState(chat, defaultFollowUps)

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
    handleEditStart,
    handleEditSaveWithText,
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

  // CommandPalette items
  const commandItems: CommandItem[] = useMemo(
    () => [
      {
        id: 'new-research',
        label: 'New Research',
        description: 'Start a new research topic',
        icon: <MessageSquarePlus className="h-4 w-4" />,
        shortcut: ['mod', 'n'],
        category: 'Chat',
        onSelect: () => {
          handleNewConversation()
          setShowCommandPalette(false)
        },
      },
      {
        id: 'export',
        label: 'Export Research',
        description: 'Save research to file',
        icon: <Download className="h-4 w-4" />,
        shortcut: ['mod', 'e'],
        category: 'Chat',
        onSelect: () => {
          setShowExport(true)
          setShowCommandPalette(false)
        },
      },
      {
        id: 'settings',
        label: 'Settings',
        description: 'Configure model and preferences',
        icon: <Settings className="h-4 w-4" />,
        shortcut: ['mod', ','],
        category: 'App',
        onSelect: () => {
          setShowSettings(true)
          setShowCommandPalette(false)
        },
      },
      {
        id: 'toggle-context',
        label: 'Toggle Context Panel',
        description: 'Show or hide the research context panel',
        icon: <PanelRight className="h-4 w-4" />,
        shortcut: ['mod', 'b'],
        category: 'View',
        onSelect: () => {
          setRightPanelOpen((prev) => !prev)
          setShowCommandPalette(false)
        },
      },
      {
        id: 'toggle-sidebar',
        label: 'Toggle Sidebar',
        description: 'Show or hide the sidebar',
        icon: <PanelLeft className="h-4 w-4" />,
        shortcut: ['mod', '\\'],
        category: 'View',
        onSelect: () => {
          setSidebarCollapsed((prev) => !prev)
          setShowCommandPalette(false)
        },
      },
      {
        id: 'toggle-deep-research',
        label: deepResearchMode
          ? 'Disable Deep Research'
          : 'Enable Deep Research',
        description: 'Toggle deep research mode for thorough analysis',
        icon: <Search className="h-4 w-4" />,
        category: 'Research',
        onSelect: () => {
          setDeepResearchMode((prev) => !prev)
          setShowCommandPalette(false)
        },
      },
      ...slashCommands.map((cmd) => ({
        id: `slash-${cmd.id}`,
        label: cmd.label,
        description: cmd.description,
        category: 'Commands',
        onSelect: () => {
          setInput(cmd.label + ' ')
          inputRef.current?.focus()
          setShowCommandPalette(false)
        },
      })),
    ],
    [handleNewConversation, deepResearchMode, setInput]
  )

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'mod+k',
      callback: () => setShowCommandPalette((prev) => !prev),
      description: 'Toggle command palette',
    },
  ])

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

        <ErrorBoundary onRetry={() => window.location.reload()}>
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
                    className="p-4 space-y-2"
                    role="log"
                    aria-live="polite"
                    aria-label="Chat messages"
                  >
                    {chat.messages
                      .filter(
                        (m: HookMessage) =>
                          m.role === 'user' || m.role === 'assistant'
                      )
                      .map((msg: HookMessage) => (
                        <ChatMessageItem
                          key={msg.id || msg.content?.toString().slice(0, 20)}
                          msg={msg}
                          isStreaming={streamingMsgId === msg.id}
                          assistantAvatar={AssistantAvatar}
                          timestamp={
                            msg.id
                              ? messageTimestampsRef.current[msg.id]
                              : undefined
                          }
                          editingMessageId={editingMessageId}
                          onEditSaveWithText={handleEditSaveWithText}
                          onEditCancel={handleEditCancel}
                          feedback={msg.id ? feedback[msg.id] : undefined}
                          onFeedback={handleFeedback}
                          onRegenerate={handleRegenerate}
                          onDelete={handleDeleteMessage}
                          onEditStart={handleEditStart}
                        />
                      ))}

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

                    <FollowUpSuggestions
                      showFollowUp={showFollowUp}
                      followUpSuggestions={followUpSuggestions}
                      onPromptSelect={handleFollowUp}
                    />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t p-4 bg-card/50 relative">
                {showSlashMenu && (
                  <div
                    className="absolute bottom-full left-4 mb-2 w-64 rounded-xl border bg-card shadow-xl z-50 py-1"
                    role="listbox"
                    aria-label="Slash commands"
                  >
                    {slashCommands.map((cmd) => (
                      <button
                        key={cmd.id}
                        role="option"
                        aria-selected={false}
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

                <ChatInput
                  value={input}
                  onChange={handleInputChange}
                  onSubmit={handleInputSubmit}
                  placeholder={
                    deepResearchMode
                      ? 'Enter a research topic for deep analysis... (⌘K for palette)'
                      : 'Ask anything... (/ for commands, ⌘K for palette)'
                  }
                  disabled={false}
                  maxLength={4000}
                  showCharCounter={true}
                  animateHeight={true}
                  glowOnFocus={true}
                  aria-label="Research input"
                />

                <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {deepResearchMode && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-medium">
                        Deep Research ON
                      </span>
                    )}
                    <span>
                      {
                        mcpServers.filter((s) => s.status === 'connected')
                          .length
                      }{' '}
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
                    setPreferredSources((prev) => ({
                      ...prev,
                      [s]: !prev[s],
                    }))
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
        </ErrorBoundary>
      </div>

      {/* Command Palette */}
      <CommandPalette
        items={commandItems}
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        placeholder="Search commands..."
        aria-label="Command palette"
      />

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

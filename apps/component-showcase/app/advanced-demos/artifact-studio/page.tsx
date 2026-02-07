'use client'

import { useState, useRef, useMemo } from 'react'
import { PageHeader } from '@/components/component-section'
import { cn } from '@clarity-chat/primitives'
import {
  useAutoScroll,
  ErrorBoundary,
  ThinkingBar,
  ChatInput,
  CommandPalette,
  FollowUpSuggestions,
  useKeyboardShortcuts,
  type PromptSuggestion,
  type CommandItem,
} from '@clarity-chat/react'

import {
  Blocks,
  Settings,
  Download,
  Bot,
  Layers,
  Code,
  FileText,
  Search,
  MessageSquarePlus,
  PanelLeft,
} from 'lucide-react'

import {
  ApiKeyBar,
  ChatExportDialog,
  SettingsDialog,
  ChatThinkingIndicator,
  ChatErrorDisplay,
  ChatMessageItem,
  TokenOptimizationShowcase,
  useConversationManager,
  useMessageEditing,
  useMessageActions,
  useTypedChat,
  useChatDerivedState,
  useChatInputHandlers,
  type Artifact,
  type SavedPrompt,
  type MCPServer,
  type TokenSettings,
  type HookMessage,
  generateId,
  exportConversation,
} from '../_shared'

import { ArtifactPanel } from './components/artifact-panel'
import { ArtifactMCPManager } from './components/mcp-manager'
import { ToolPanel } from './components/tool-panel'
import { ArtifactSidebar } from './components/chat-sidebar'
import { ArtifactWelcomeScreen } from './components/welcome-screen'

const AVATAR_GRADIENT = 'from-violet-500 to-purple-600'

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

const slashCommands = [
  { id: 'create', label: '/create', description: 'Create a new artifact' },
  { id: 'edit', label: '/edit', description: 'Edit latest artifact' },
  { id: 'version', label: '/version', description: 'Show version history' },
  { id: 'preview', label: '/preview', description: 'Toggle artifact panel' },
  { id: 'export', label: '/export', description: 'Export artifacts' },
  { id: 'tools', label: '/tools', description: 'List available tools' },
]

const defaultFollowUps: PromptSuggestion[] = [
  { id: '1', text: 'Add dark mode support', type: 'follow-up' },
  { id: '2', text: 'Make it responsive', type: 'follow-up' },
  { id: '3', text: 'Add form validation', type: 'follow-up' },
]

/** Shared assistant avatar for MessageBubble */
const AssistantAvatar = (
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
    <Bot className="h-4 w-4 text-white" />
  </div>
)

export default function ArtifactStudioPage() {
  const [provider, setProvider] = useState('anthropic')
  const [model, setModel] = useState('claude-3.5-sonnet')
  const [apiKey, setApiKey] = useState('')

  const [savedPrompts, setSavedPrompts] =
    useState<SavedPrompt[]>(defaultPrompts)
  const [mcpServers, setMcpServers] = useState<MCPServer[]>(defaultMCPServers)

  // Artifacts (placeholder for future artifact creation)
  const artifacts: Artifact[] = []
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null)
  const [artifactPanelOpen, setArtifactPanelOpen] = useState(false)

  // Context
  const [masterContext, setMasterContext] = useState('')
  const [techStack, setTechStack] = useState<string[]>(['React', 'TypeScript'])

  // UI state
  const [showExport, setShowExport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [settingsTemp, setSettingsTemp] = useState(0.7)
  const [settingsMaxTokens, setSettingsMaxTokens] = useState(4096)
  const [settingsCodeTheme, setSettingsCodeTheme] = useState('monokai')
  const [settingsResponseLength, setSettingsResponseLength] =
    useState('balanced')
  const [tokenSettings, setTokenSettings] = useState<TokenSettings>({
    optimizationEnabled: true,
    techniques: { compression: true, summarization: false, pruning: false },
    budget: 16000,
    used: { input: 0, output: 0, total: 0 },
    showExpenditure: true,
  })

  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Chat hook — typed wrapper around useClarityChat
  const chat = useTypedChat({
    api: '/api/advanced-demos/chat',
    body: {
      apiKey,
      model,
      systemPrompt: `You are a creative AI assistant specializing in generating artifacts. When asked to create code, documents, HTML, SVG, diagrams, tables, or JSON, generate high-quality, complete content. Format code with proper syntax. Be creative and thorough.`,
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
    thinkingBarStatus,
  } = useChatDerivedState(chat, defaultFollowUps)

  // Conversation management
  const {
    conversations,
    activeConvId,
    handleSelectConversation,
    handleNewConversation,
    handleDeleteConversation,
  } = useConversationManager({
    defaultTitle: 'New Project',
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
    messages: chat.messages,
    onResend: (text) => handleSend(text),
  })

  // Message actions (feedback, delete, regenerate)
  const { feedback, handleFeedback, handleDeleteMessage, handleRegenerate } =
    useMessageActions({
      chat,
      messages: chat.messages,
      onResend: (text) => handleSend(text),
    })

  const { scrollRef } = useAutoScroll({
    dependencies: [chat.messages, chat.isLoading],
  })

  // CommandPalette items
  const commandItems: CommandItem[] = useMemo(
    () => [
      {
        id: 'new-conversation',
        label: 'New Conversation',
        description: 'Start a new project',
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
        label: 'Export Conversation',
        description: 'Save conversation to file',
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
        id: 'toggle-artifacts',
        label: 'Toggle Artifact Panel',
        description: 'Show or hide the artifact preview',
        icon: <Layers className="h-4 w-4" />,
        shortcut: ['mod', 'b'],
        category: 'View',
        onSelect: () => {
          setArtifactPanelOpen((prev) => !prev)
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
        id: 'focus-input',
        label: 'Focus Chat Input',
        description: 'Jump to the message input',
        icon: <Search className="h-4 w-4" />,
        shortcut: ['mod', 'l'],
        category: 'Navigation',
        onSelect: () => {
          inputRef.current?.focus()
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
    [handleNewConversation, setInput]
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

        <ThinkingBar
          status={thinkingBarStatus}
          message={
            showThinkingIndicator
              ? 'Thinking...'
              : chat.isLoading
                ? 'Generating artifact...'
                : undefined
          }
          variant="minimal"
        />

        <ErrorBoundary onRetry={() => window.location.reload()}>
          <div className="flex h-[calc(100%-3rem)]">
            {/* Sidebar */}
            <ArtifactSidebar
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
              onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
            />

            {/* Main Chat */}
            <div className="flex-1 flex flex-col min-w-0">
              <div
                ref={scrollRef as React.RefObject<HTMLDivElement>}
                className="flex-1 overflow-y-auto"
              >
                {chat.messages.length === 0 && !chat.isLoading ? (
                  <ArtifactWelcomeScreen
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
                          editingMessageId={editingMessageId}
                          editingText={editingText}
                          onEditingTextChange={setEditingText}
                          onEditSave={handleEditSave}
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
                    />

                    <ChatErrorDisplay
                      error={chat.error}
                      variant="chat-bubble"
                      avatarIcon="alert"
                      onRetry={() => chat.reload()}
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
                          if (cmd.id === 'preview') {
                            setArtifactPanelOpen((prev) => !prev)
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

                <ChatInput
                  value={input}
                  onChange={handleInputChange}
                  onSubmit={handleInputSubmit}
                  placeholder="Describe what to create... (/ for commands, ⌘K for palette)"
                  disabled={false}
                  maxLength={4000}
                  showCharCounter={true}
                  animateHeight={true}
                  glowOnFocus={true}
                  aria-label="Chat message input"
                />

                <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>
                      {artifacts.length} artifact
                      {artifacts.length !== 1 ? 's' : ''} created
                    </span>
                    <span>
                      {
                        mcpServers.filter((s) => s.status === 'connected')
                          .length
                      }{' '}
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
                      onClick={() => setArtifactPanelOpen((prev) => !prev)}
                      className={cn(
                        'flex items-center gap-1 hover:text-foreground',
                        artifactPanelOpen && 'text-violet-500'
                      )}
                      title="Toggle artifact panel"
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
                isGenerating={chat.isLoading}
              />
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
          exportConversation(chat.messages, format, 'artifact-studio')
        }
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
          <h3 className="font-medium">Token Optimization</h3>
          <TokenOptimizationShowcase
            settings={tokenSettings}
            onUpdate={setTokenSettings}
          />
          <div className="h-px bg-border" />
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

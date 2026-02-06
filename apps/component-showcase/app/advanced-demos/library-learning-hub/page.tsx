'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { PageHeader } from '@/components/component-section'
import { cn } from '@clarity-chat/primitives'
import { useAutoScroll, MarkdownRenderer } from '@clarity-chat/react'
import {
  Send,
  GraduationCap,
  Settings,
  Download,
  Slash,
  AtSign,
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
  type MemorySettings,
  type TokenSettings,
  type HookMessage,
  getTextContent,
  MARKDOWN_CONFIG,
  generateId,
  formatTimestamp,
} from '../_shared'

import {
  KNOWLEDGE_BASE,
  type KnowledgeEntry,
} from './components/knowledge-base'
import { ChatSidebar as LibrarySidebar } from './components/chat-sidebar'
import {
  SlashCommandMenu,
  SLASH_COMMANDS,
  type SlashCommand,
} from './components/slash-commands'
import { MentionPopup, type MentionItem } from './components/mention-popup'
import { RagCitations } from './components/rag-citations'
import { ContextPanel } from './components/context-panel'
import { WelcomeScreen as LibraryWelcomeScreen } from './components/welcome-screen'

// Simple keyword search for RAG simulation
function searchKnowledgeBase(query: string): KnowledgeEntry[] {
  const lower = query.toLowerCase()
  const words = lower.split(/\s+/).filter((w) => w.length > 2)
  return KNOWLEDGE_BASE.filter((entry) => {
    const searchText =
      `${entry.title} ${entry.tags.join(' ')} ${entry.content}`.toLowerCase()
    return words.some((w) => searchText.includes(w))
  }).slice(0, 5)
}

const knowledgeBase = KNOWLEDGE_BASE

export const dynamic = 'force-dynamic'

const AVATAR_GRADIENT = 'from-emerald-500 to-teal-600'

// Use built-in slash commands from the component
const slashCommands = SLASH_COMMANDS

// Mention items
const mentionItems: MentionItem[] = [
  ...knowledgeBase
    .filter((e) => e.category === 'component')
    .map((e) => ({ id: e.id, label: e.title, type: 'component' as const })),
  ...knowledgeBase
    .filter((e) => e.category === 'hook')
    .map((e) => ({ id: e.id, label: e.title, type: 'hook' as const })),
]

// Default prompts
const defaultPrompts: SavedPrompt[] = [
  { id: '1', text: 'How do I set up streaming?', category: 'setup' },
  {
    id: '2',
    text: 'Show me ChatInput with file upload',
    category: 'component',
  },
  { id: '3', text: 'How to configure memory?', category: 'memory' },
  { id: '4', text: 'Token optimization best practices', category: 'token' },
  { id: '5', text: 'How to use model adapters?', category: 'adapter' },
  { id: '6', text: 'Set up a RAG pipeline', category: 'rag' },
]

export default function LibraryLearningHubPage() {
  // Provider/model state
  const [provider, setProvider] = useState('anthropic')
  const [model, setModel] = useState('claude-3.5-sonnet')
  const [apiKey, setApiKey] = useState('')

  // Prompts
  const [savedPrompts, setSavedPrompts] =
    useState<SavedPrompt[]>(defaultPrompts)

  // Settings state
  const [memorySettings, setMemorySettings] = useState<MemorySettings>({
    enabled: true,
    strategy: 'semantic-chunks',
    maxTokens: 4096,
    usage: 1247,
  })
  const [tokenSettings, setTokenSettings] = useState<TokenSettings>({
    optimizationEnabled: true,
    techniques: { compression: true, summarization: false, pruning: true },
    budget: 8000,
    used: { input: 1245, output: 892, total: 2137 },
    showExpenditure: true,
  })

  // UI state
  const [input, setInput] = useState('')
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [showMentionMenu, setShowMentionMenu] = useState(false)
  const [slashFilter, setSlashFilter] = useState('')
  const [mentionFilter, setMentionFilter] = useState('')
  const [showExport, setShowExport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [masterContext, setMasterContext] = useState('')
  const [contextFiles, setContextFiles] = useState<FileAttachment[]>([])
  const [settingsTemp, setSettingsTemp] = useState(0.7)
  const [settingsMaxTokens, setSettingsMaxTokens] = useState(4096)
  const [settingsCodeTheme, setSettingsCodeTheme] = useState('monokai')
  const [settingsResponseLength, setSettingsResponseLength] =
    useState('balanced')
  // RAG citations per assistant message
  const [messageCitations, setMessageCitations] = useState<
    Record<string, KnowledgeEntry[]>
  >({})
  const pendingCitationsRef = useRef<KnowledgeEntry[]>([])

  // Message timestamps (HookMessage has no timestamp field)
  const messageTimestampsRef = useRef<Record<string, Date>>({})

  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Build system prompt with optional RAG context
  const buildSystemPrompt = useCallback(
    (ragContext?: string, slashCommandId?: string) => {
      let prompt = `You are a helpful AI tutor for the Clarity Chat component library. You have deep knowledge of all components, hooks, adapters, and features. When users ask questions:

1. Provide clear, detailed explanations with code examples
2. Use proper markdown formatting with headers, code blocks, and lists
3. Reference specific component names and hook APIs
4. Show TypeScript code examples with proper imports`

      if (masterContext) {
        prompt += `\n\nAdditional context provided by user:\n${masterContext}`
      }

      if (slashCommandId) {
        prompt += `\n\nThe user is executing the /${slashCommandId} command. Provide a comprehensive response for this command.`
      }

      if (ragContext) {
        prompt += `\n\nRelevant documentation from the knowledge base:\n${ragContext}\n\nPlease answer the question using the documentation above. Include code examples where relevant.`
      }

      return prompt
    },
    [masterContext]
  )

  // onFinish callback — associate pending RAG citations with the assistant message
  const handleChatFinish = useCallback(
    (message: { id?: string; role: string; content: unknown }) => {
      if (pendingCitationsRef.current.length > 0 && message.id) {
        setMessageCitations((prev) => ({
          ...prev,
          [message.id as string]: pendingCitationsRef.current,
        }))
        pendingCitationsRef.current = []
      }
    },
    []
  )

  // onError callback
  const handleChatError = useCallback((error: Error) => {
    console.error('[LibraryLearningHub] Chat error:', error.message)
  }, [])

  // Chat instance (typed wrapper)
  const chat = useTypedChat({
    api: '/api/advanced-demos/chat',
    body: {
      apiKey,
      model,
      temperature: settingsTemp,
      maxTokens: settingsMaxTokens,
    },
    onFinish: handleChatFinish,
    onError: handleChatError,
  })

  // Eagerly record timestamps for new messages during render
  for (const msg of chat.messages) {
    if (msg.id && !messageTimestampsRef.current[msg.id]) {
      messageTimestampsRef.current[msg.id] = new Date()
    }
  }

  // Title derivation: auto-name conversation from first user message
  const deriveTitle = useCallback(
    (currentTitle: string, messages: HookMessage[]) => {
      if (currentTitle !== 'New Chat' || messages[0]?.role !== 'user')
        return currentTitle
      const text = getTextContent(messages[0].content)
      return text.slice(0, 30) + (text.length > 30 ? '...' : '') || 'Chat'
    },
    []
  )

  // Conversation management with custom sync (timestamps + title derivation)
  const syncOptions = useMemo(
    () => ({
      getTimestamp: (msgId: string) => messageTimestampsRef.current[msgId],
      deriveTitle,
    }),
    [deriveTitle]
  )

  const {
    conversations,
    activeConvId,
    handleSelectConversation,
    handleNewConversation,
    handleDeleteConversation,
  } = useConversationManager({
    defaultTitle: 'New Chat',
    chat,
    sync: syncOptions,
  })

  const { scrollRef } = useAutoScroll({
    dependencies: [chat.messages, chat.isLoading],
  })

  // Input handling - only trigger slash menu when / is first char or follows whitespace
  const handleInputChange = (value: string) => {
    setInput(value)
    const lastChar = value.slice(-1)
    const charBeforeLast = value.length >= 2 ? value[value.length - 2] : ''

    if (lastChar === '/' && (value.length === 1 || /\s/.test(charBeforeLast))) {
      setShowSlashMenu(true)
      setSlashFilter('')
      setShowMentionMenu(false)
    } else if (showSlashMenu) {
      const slashIdx = value.lastIndexOf('/')
      if (slashIdx >= 0 && (slashIdx === 0 || /\s/.test(value[slashIdx - 1]))) {
        setSlashFilter(value.slice(slashIdx + 1).toLowerCase())
      } else {
        setShowSlashMenu(false)
      }
    }

    if (lastChar === '@' && (value.length === 1 || /\s/.test(charBeforeLast))) {
      setShowMentionMenu(true)
      setMentionFilter('')
      setShowSlashMenu(false)
    } else if (showMentionMenu) {
      const atIdx = value.lastIndexOf('@')
      if (atIdx >= 0 && (atIdx === 0 || /\s/.test(value[atIdx - 1]))) {
        setMentionFilter(value.slice(atIdx + 1).toLowerCase())
      } else {
        setShowMentionMenu(false)
      }
    }
  }

  const handleSlashCommand = (cmd: SlashCommand) => {
    setShowSlashMenu(false)
    setInput('')
    handleSend(cmd.label, cmd.id)
  }

  const handleMention = (item: MentionItem) => {
    setShowMentionMenu(false)
    const atIdx = input.lastIndexOf('@')
    setInput(input.slice(0, atIdx) + `@${item.label} `)
    inputRef.current?.focus()
  }

  // Main send handler
  const handleSend = async (overrideText?: string, slashCommandId?: string) => {
    const text = overrideText || input.trim()
    if (!text || chat.isLoading) return

    setInput('')
    setShowSlashMenu(false)
    setShowMentionMenu(false)

    // Build RAG context from knowledge base search
    const matches = searchKnowledgeBase(text)
    const ragContext =
      matches.length > 0
        ? matches
            .map(
              (m) =>
                `### ${m.title}\n${m.content}\n\`\`\`typescript\n${m.codeExample}\n\`\`\``
            )
            .join('\n\n')
        : ''

    // Store pending citations for the upcoming assistant response
    if (matches.length > 0) {
      pendingCitationsRef.current = matches.slice(0, 4)
    } else {
      pendingCitationsRef.current = []
    }

    // Build system prompt with RAG context and pass via data override
    const systemPrompt = buildSystemPrompt(ragContext, slashCommandId)

    await chat.append(
      { role: 'user', content: text },
      { data: { systemPrompt } }
    )
  }

  // Message actions (feedback, delete, regenerate)
  const { feedback, handleFeedback, handleDeleteMessage, handleRegenerate } =
    useMessageActions({
      chat,
      onResend: (text) => handleSend(text),
      onDeleteCleanup: (msgId) => {
        setMessageCitations((prev) => {
          const next = { ...prev }
          delete next[msgId]
          return next
        })
      },
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

  // Prompt management
  const handleSavePrompt = (text: string) => {
    setSavedPrompts((prev) => [...prev, { id: generateId(), text }])
  }
  const handleDeletePrompt = (id: string) => {
    setSavedPrompts((prev) => prev.filter((p) => p.id !== id))
  }

  const markdownConfig = MARKDOWN_CONFIG

  // Determine if the last message is an assistant message currently streaming
  const lastMessage = chat.messages[chat.messages.length - 1]
  const isStreamingLastMessage =
    chat.isLoading &&
    lastMessage?.role === 'assistant' &&
    getTextContent(lastMessage.content).length > 0

  return (
    <div>
      <PageHeader
        title="Library Learning Hub"
        description="RAG-powered AI tutor for the Clarity Chat component library. Ask about components, hooks, adapters, and get code examples."
        icon={GraduationCap}
        badge="35 Components"
      />

      <div className="glass-card overflow-hidden border-0 h-[calc(100vh-14rem)]">
        {/* API Key Bar */}
        <ApiKeyBar
          provider={provider}
          onProviderChange={setProvider}
          model={model}
          onModelChange={setModel}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
        />

        <div className="flex h-[calc(100%-3rem)]">
          {/* Left Sidebar */}
          <LibrarySidebar
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
            onDeletePrompt={handleDeletePrompt}
            onSavePrompt={handleSavePrompt}
            collapsed={sidebarCollapsed}
            onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Messages */}
            <div
              ref={scrollRef as React.RefObject<HTMLDivElement>}
              className="flex-1 overflow-y-auto"
            >
              {chat.messages.length === 0 && !chat.isLoading ? (
                <LibraryWelcomeScreen
                  onSuggestionClick={(text) => {
                    setInput(text)
                    inputRef.current?.focus()
                  }}
                />
              ) : (
                <div className="p-4 space-y-6">
                  {chat.messages.map((msg: HookMessage, idx: number) => {
                    const msgId = msg.id || `msg-${idx}`
                    const content =
                      getTextContent(msg.content) || String(msg.content)
                    const isLastAssistantStreaming =
                      idx === chat.messages.length - 1 && isStreamingLastMessage

                    return (
                      <div
                        key={msgId}
                        className={cn(
                          'group flex gap-3',
                          msg.role === 'user' && 'justify-end'
                        )}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-sm">
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
                                  isStreaming={isLastAssistantStreaming}
                                  config={markdownConfig}
                                />
                                {isLastAssistantStreaming && (
                                  <span className="inline-block w-1.5 h-4 bg-primary animate-pulse rounded-sm ml-0.5" />
                                )}
                              </div>
                            )}
                          </div>

                          {/* RAG Citations */}
                          {msg.role === 'assistant' &&
                            msgId in messageCitations &&
                            messageCitations[msgId].length > 0 && (
                              <RagCitations entries={messageCitations[msgId]} />
                            )}

                          {/* Message Actions */}
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground">
                              {messageTimestampsRef.current[msgId]
                                ? formatTimestamp(
                                    messageTimestampsRef.current[msgId]
                                  )
                                : ''}
                            </span>
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
                          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    )
                  })}

                  <ChatThinkingIndicator
                    visible={chat.isLoading && !isStreamingLastMessage}
                    avatarGradient={AVATAR_GRADIENT}
                  />

                  <ChatErrorDisplay
                    error={chat.error}
                    variant="chat-bubble"
                    avatarIcon="alert"
                    onRetry={() => chat.reload()}
                  />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-card/50 relative">
              {/* Slash Command Menu */}
              {showSlashMenu && (
                <div className="absolute bottom-full left-4 right-4 mb-2">
                  <SlashCommandMenu
                    commands={slashCommands}
                    filter={slashFilter}
                    onSelect={handleSlashCommand}
                    onClose={() => setShowSlashMenu(false)}
                  />
                </div>
              )}

              {/* Mention Popup */}
              {showMentionMenu && (
                <div className="absolute bottom-full left-4 right-4 mb-2">
                  <MentionPopup
                    items={mentionItems}
                    filter={mentionFilter}
                    onSelect={handleMention}
                    onClose={() => setShowMentionMenu(false)}
                  />
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                      if (e.key === 'Escape') {
                        setShowSlashMenu(false)
                        setShowMentionMenu(false)
                      }
                    }}
                    placeholder="Ask about any component, hook, or feature... (/ for commands, @ for mentions)"
                    rows={1}
                    className="w-full px-4 py-2.5 pr-24 rounded-xl bg-muted/50 border border-muted-foreground/10 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
                  />
                  <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
                    <button
                      onClick={() => {
                        setShowSlashMenu(!showSlashMenu)
                        setShowMentionMenu(false)
                      }}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                      title="Slash commands"
                    >
                      <Slash className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setShowMentionMenu(!showMentionMenu)
                        setShowSlashMenu(false)
                      }}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                      title="Mention"
                    >
                      <AtSign className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        chat.isLoading ? chat.stop() : handleSend()
                      }
                      disabled={!input.trim() && !chat.isLoading}
                      className={cn(
                        'p-1.5 rounded-md transition-colors',
                        chat.isLoading
                          ? 'bg-destructive/20 text-destructive hover:bg-destructive/30'
                          : input.trim()
                            ? 'bg-primary text-primary-foreground hover:opacity-90'
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
                <div className="flex items-center gap-3">
                  <span>
                    Type{' '}
                    <kbd className="px-1 py-0.5 rounded bg-muted text-[9px]">
                      /
                    </kbd>{' '}
                    for commands
                  </span>
                  <span>
                    Type{' '}
                    <kbd className="px-1 py-0.5 rounded bg-muted text-[9px]">
                      @
                    </kbd>{' '}
                    for mentions
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
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
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
              {/* Context */}
              <ContextPanel
                context={masterContext}
                onContextChange={setMasterContext}
                files={contextFiles}
                onFilesChange={setContextFiles}
              />

              <div className="h-px bg-border" />

              {/* Memory */}
              <MemoryPanel
                settings={memorySettings}
                onUpdate={setMemorySettings}
              />

              <div className="h-px bg-border" />

              {/* Tokens */}
              <TokenOptimizationShowcase
                settings={tokenSettings}
                onUpdate={setTokenSettings}
              />
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ChatExportDialog
        open={showExport}
        onClose={() => setShowExport(false)}
        onExport={() => {}}
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

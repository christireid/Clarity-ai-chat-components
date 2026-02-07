'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { PageHeader } from '@/components/component-section'
import {
  useAutoScroll,
  ErrorBoundary,
  FollowUpSuggestions,
  SourceList,
  ChatInput,
  CommandPalette,
  useKeyboardShortcuts,
  type PromptSuggestion,
  type SourceData,
  type CommandItem,
} from '@clarity-chat/react'
import {
  GraduationCap,
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
  type SavedPrompt,
  type FileAttachment,
  type MemorySettings,
  type TokenSettings,
  type HookMessage,
  getTextContent,
  generateId,
  exportConversation,
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

const AVATAR_GRADIENT = 'from-emerald-500 to-teal-600'

const slashCommands = SLASH_COMMANDS

const mentionItems: MentionItem[] = [
  ...KNOWLEDGE_BASE.filter((e) => e.category === 'component').map((e) => ({
    id: e.id,
    label: e.title,
    type: 'component' as const,
  })),
  ...KNOWLEDGE_BASE.filter((e) => e.category === 'hook').map((e) => ({
    id: e.id,
    label: e.title,
    type: 'hook' as const,
  })),
]

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

const defaultFollowUps: PromptSuggestion[] = [
  { id: '1', text: 'Show me a code example', type: 'follow-up' },
  { id: '2', text: 'Explain the API in detail', type: 'follow-up' },
  { id: '3', text: 'Compare with similar components', type: 'follow-up' },
]

const AssistantAvatar = (
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
    <Bot className="h-4 w-4 text-white" />
  </div>
)

export default function LibraryLearningHubPage() {
  const [provider, setProvider] = useState('anthropic')
  const [model, setModel] = useState('claude-3.5-sonnet')
  const [apiKey, setApiKey] = useState('')
  const [savedPrompts, setSavedPrompts] =
    useState<SavedPrompt[]>(defaultPrompts)
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

  const [input, setInput] = useState('')
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [showMentionMenu, setShowMentionMenu] = useState(false)
  const [slashFilter, setSlashFilter] = useState('')
  const [mentionFilter, setMentionFilter] = useState('')
  const [showExport, setShowExport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [masterContext, setMasterContext] = useState('')
  const [contextFiles, setContextFiles] = useState<FileAttachment[]>([])
  const [settingsTemp, setSettingsTemp] = useState(0.7)
  const [settingsMaxTokens, setSettingsMaxTokens] = useState(4096)
  const [settingsCodeTheme, setSettingsCodeTheme] = useState('monokai')
  const [settingsResponseLength, setSettingsResponseLength] =
    useState('balanced')
  const [messageCitations, setMessageCitations] = useState<
    Record<string, KnowledgeEntry[]>
  >({})
  const citationQueueRef = useRef<Map<string, KnowledgeEntry[]>>(new Map())
  const messageTimestampsRef = useRef<Record<string, Date>>({})
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const buildSystemPrompt = useCallback(
    (ragContext?: string, slashCommandId?: string) => {
      let prompt = `You are a helpful AI tutor for the Clarity Chat component library. You have deep knowledge of all components, hooks, adapters, and features. When users ask questions:

1. Provide clear, detailed explanations with code examples
2. Use proper markdown formatting with headers, code blocks, and lists
3. Reference specific component names and hook APIs
4. Show TypeScript code examples with proper imports`

      if (masterContext)
        prompt += `\n\nAdditional context provided by user:\n${masterContext}`
      if (slashCommandId)
        prompt += `\n\nThe user is executing the /${slashCommandId} command. Provide a comprehensive response for this command.`
      if (ragContext)
        prompt += `\n\nRelevant documentation from the knowledge base:\n${ragContext}\n\nPlease answer the question using the documentation above. Include code examples where relevant.`
      return prompt
    },
    [masterContext]
  )

  const handleChatFinish = useCallback(
    (message: { id?: string; role: string; content: unknown }) => {
      if (!message.id) return
      const firstKey = citationQueueRef.current.keys().next().value
      if (firstKey !== undefined) {
        const citations = citationQueueRef.current.get(firstKey)
        if (citations && citations.length > 0) {
          setMessageCitations((prev) => ({
            ...prev,
            [message.id as string]: citations,
          }))
        }
        citationQueueRef.current.delete(firstKey)
      }
    },
    []
  )

  const handleChatError = useCallback((_error: Error) => {}, [])

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

  useEffect(() => {
    for (const msg of chat.messages) {
      if (msg.id && !messageTimestampsRef.current[msg.id]) {
        messageTimestampsRef.current[msg.id] = new Date()
      }
    }
  }, [chat.messages])

  const deriveTitle = useCallback(
    (currentTitle: string, messages: HookMessage[]) => {
      if (currentTitle !== 'New Chat' || messages[0]?.role !== 'user')
        return currentTitle
      const text = getTextContent(messages[0].content)
      return text.slice(0, 30) + (text.length > 30 ? '...' : '') || 'Chat'
    },
    []
  )

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

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value)
      const lastChar = value.slice(-1)
      const charBeforeLast = value.length >= 2 ? value[value.length - 2] : ''

      if (
        lastChar === '/' &&
        (value.length === 1 || /\s/.test(charBeforeLast))
      ) {
        setShowSlashMenu(true)
        setSlashFilter('')
        setShowMentionMenu(false)
      } else if (showSlashMenu) {
        const slashIdx = value.lastIndexOf('/')
        if (
          slashIdx >= 0 &&
          (slashIdx === 0 || /\s/.test(value[slashIdx - 1]))
        ) {
          setSlashFilter(value.slice(slashIdx + 1).toLowerCase())
        } else {
          setShowSlashMenu(false)
        }
      }

      if (
        lastChar === '@' &&
        (value.length === 1 || /\s/.test(charBeforeLast))
      ) {
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
    },
    [showSlashMenu, showMentionMenu]
  )

  const handleSend = useCallback(
    async (overrideText?: string, slashCommandId?: string) => {
      const text = overrideText || input.trim()
      if (!text || chat.isLoading) return
      setInput('')
      setShowSlashMenu(false)
      setShowMentionMenu(false)

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

      const userMsgKey = generateId()
      citationQueueRef.current.set(
        userMsgKey,
        matches.length > 0 ? matches.slice(0, 4) : []
      )
      const systemPrompt = buildSystemPrompt(ragContext, slashCommandId)

      try {
        await chat.append(
          { role: 'user', content: text },
          { data: { systemPrompt } }
        )
      } catch {
        citationQueueRef.current.delete(userMsgKey)
      }
    },
    [input, chat, buildSystemPrompt]
  )

  const handleSlashCommand = useCallback(
    (cmd: SlashCommand) => {
      setShowSlashMenu(false)
      setInput('')
      handleSend(cmd.label, cmd.id)
    },
    [handleSend]
  )

  const handleMention = useCallback(
    (item: MentionItem) => {
      setShowMentionMenu(false)
      const atIdx = input.lastIndexOf('@')
      setInput(input.slice(0, atIdx) + `@${item.label} `)
      inputRef.current?.focus()
    },
    [input]
  )

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

  const {
    editingMessageId,
    editingText,
    setEditingText,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
  } = useMessageEditing({ chat, onResend: (text) => handleSend(text) })

  const handleSavePrompt = useCallback((text: string) => {
    setSavedPrompts((prev) => [...prev, { id: generateId(), text }])
  }, [])

  const handleDeletePrompt = useCallback((id: string) => {
    setSavedPrompts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const handleFollowUp = useCallback(
    (suggestion: PromptSuggestion) => {
      handleSend(suggestion.text)
    },
    [handleSend]
  )

  // Derived chat UI state (shared hook)
  const {
    showThinkingIndicator,
    showFollowUp,
    followUpSuggestions,
    streamingMsgId,
  } = useChatDerivedState(chat, defaultFollowUps)

  const handleInputSubmit = useCallback(
    async (value: string) => {
      if (chat.isLoading) {
        chat.stop()
      } else {
        await handleSend(value)
      }
    },
    [chat, handleSend]
  )

  const commandItems: CommandItem[] = useMemo(
    () => [
      {
        id: 'new-chat',
        label: 'New Chat',
        description: 'Start a new conversation',
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
        id: 'toggle-context',
        label: 'Toggle Context Panel',
        description: 'Show or hide the context panel',
        icon: <PanelRight className="h-4 w-4" />,
        shortcut: ['mod', 'b'],
        category: 'View',
        onSelect: () => {
          setRightPanelOpen((p) => !p)
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
          setSidebarCollapsed((p) => !p)
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
      ...SLASH_COMMANDS.map((cmd) => ({
        id: `slash-${cmd.id}`,
        label: cmd.label,
        description: cmd.description,
        category: 'Commands',
        onSelect: () => {
          handleSlashCommand(cmd)
          setShowCommandPalette(false)
        },
      })),
    ],
    [handleNewConversation, handleSlashCommand]
  )

  useKeyboardShortcuts([
    {
      key: 'mod+k',
      callback: () => setShowCommandPalette((p) => !p),
      description: 'Toggle command palette',
    },
  ])

  return (
    <div>
      <PageHeader
        title="Library Learning Hub"
        description="RAG-powered AI tutor for the Clarity Chat component library. Ask about components, hooks, adapters, and get code examples."
        icon={GraduationCap}
        badge="35 Components"
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
              onToggleCollapsed={() => setSidebarCollapsed((p) => !p)}
            />

            <div className="flex-1 flex flex-col min-w-0">
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
                          editingText={editingText}
                          onEditingTextChange={setEditingText}
                          onEditSave={handleEditSave}
                          onEditCancel={handleEditCancel}
                          feedback={msg.id ? feedback[msg.id] : undefined}
                          onFeedback={handleFeedback}
                          onRegenerate={handleRegenerate}
                          onDelete={handleDeleteMessage}
                          onEditStart={handleEditStart}
                          extraContent={
                            msg.role === 'assistant' &&
                            msg.id &&
                            msg.id in messageCitations &&
                            messageCitations[msg.id].length > 0 ? (
                              <SourceList
                                sources={messageCitations[msg.id].map((c) => ({
                                  title: c.title,
                                  description: c.content.slice(0, 120),
                                  type: 'document' as const,
                                  url: `#${c.id}`,
                                }))}
                                variant="compact"
                                title="Sources"
                                maxSources={4}
                              />
                            ) : undefined
                          }
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

              <div className="border-t p-4 bg-card/50 relative">
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

                <ChatInput
                  value={input}
                  onChange={handleInputChange}
                  onSubmit={handleInputSubmit}
                  placeholder="Ask about any component, hook, or feature... (/ commands, @ mentions, ⌘K palette)"
                  disabled={false}
                  maxLength={4000}
                  showCharCounter={true}
                  animateHeight={true}
                  glowOnFocus={true}
                  aria-label="Chat message input"
                />

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
                    <span>
                      <kbd className="px-1 py-0.5 rounded bg-muted text-[9px]">
                        ⌘K
                      </kbd>{' '}
                      palette
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
                      onClick={() => setRightPanelOpen((p) => !p)}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
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

            {rightPanelOpen && (
              <div className="w-72 border-l bg-card/30 overflow-y-auto p-4 space-y-6 shrink-0">
                <ContextPanel
                  context={masterContext}
                  onContextChange={setMasterContext}
                  files={contextFiles}
                  onFilesChange={setContextFiles}
                />
                <div className="h-px bg-border" />
                <MemoryPanel
                  settings={memorySettings}
                  onUpdate={setMemorySettings}
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
          exportConversation(chat.messages, format, 'library-learning-hub')
        }
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

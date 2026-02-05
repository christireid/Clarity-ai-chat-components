'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { PageHeader } from '@/components/component-section'
import { cn } from '@clarity-chat/primitives'
import { useAutoScroll, useClipboard } from '@clarity-chat/react/internal'
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
  ThinkingDisplay,
  TokenPanel,
  MemoryPanel,
  ChatExportDialog,
  CodeBlockDisplay,
  SettingsDialog,
  type ChatMessage,
  type ThinkingStep,
  type Citation,
  type Conversation,
  type SavedPrompt,
  type FileAttachment,
  type MemorySettings,
  type TokenSettings,
  generateId,
  simulateStreaming,
  formatTimestamp,
  estimateTokens,
  escapeHtml,
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

// Default conversations
function createDefaultConversation(): Conversation {
  return {
    id: generateId(),
    title: 'New Chat',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

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

function generateLibraryResponse(
  query: string,
  matches: KnowledgeEntry[]
): { response: string; citations: Citation[] } {
  const citations: Citation[] = matches.slice(0, 4).map((m, i) => ({
    id: `cit-${i}`,
    title: m.title,
    snippet: m.content.slice(0, 120) + '...',
    type: 'library',
    relevance: 0.95 - i * 0.1,
  }))

  if (matches.length === 0) {
    return {
      response: `I'd be happy to help with your question about "${query}". While I couldn't find a specific match in the library documentation, here are some general pointers:\n\n- Check the **component reference** with \`/components\`\n- Explore available **hooks** with \`/hooks\`\n- Look at **adapters** with \`/adapters\`\n\nCould you provide more details about what you're trying to build?`,
      citations: [],
    }
  }

  const primary = matches[0]
  let response = `## ${primary.title}\n\n${primary.content}\n\n### Code Example\n\n\`\`\`typescript\n${primary.codeExample}\n\`\`\``

  if (matches.length > 1) {
    response += `\n\n### Related\n\n`
    matches.slice(1, 4).forEach((m) => {
      response += `- **${m.title}**: ${m.content.slice(0, 80)}...\n`
    })
  }

  response += `\n\nWould you like me to show more examples or explain any of these in detail?`

  return { response, citations }
}

function generateSlashResponse(commandId: string): {
  response: string
  citations: Citation[]
} {
  switch (commandId) {
    case 'components': {
      const components = knowledgeBase.filter((e) => e.category === 'component')
      return {
        response: `## Available Components (${components.length})\n\n${components.map((c) => `- **${c.title}**: ${c.content.slice(0, 60)}...`).join('\n')}\n\nUse \`@ComponentName\` to learn more about any component, or \`/example ComponentName\` for code examples.`,
        citations: [],
      }
    }
    case 'hooks': {
      const hooks = knowledgeBase.filter((e) => e.category === 'hook')
      return {
        response: `## Available Hooks (${hooks.length})\n\n${hooks.map((h) => `- **${h.title}**: ${h.content.slice(0, 60)}...`).join('\n')}\n\nUse \`@hookName\` to learn more about any hook.`,
        citations: [],
      }
    }
    case 'adapters': {
      const adapters = knowledgeBase.filter((e) => e.category === 'adapter')
      return {
        response: `## Model Adapters\n\n${adapters.map((a) => `### ${a.title}\n${a.content}\n\n\`\`\`typescript\n${a.codeExample}\n\`\`\``).join('\n\n')}`,
        citations: adapters.map((a, i) => ({
          id: `cit-${i}`,
          title: a.title,
          snippet: a.content.slice(0, 100),
          type: 'library' as const,
          relevance: 0.9,
        })),
      }
    }
    case 'memory': {
      const memEntries = knowledgeBase.filter((e) => e.category === 'memory')
      return {
        response:
          memEntries.length > 0
            ? `## Memory System\n\n${memEntries.map((m) => `${m.content}\n\n\`\`\`typescript\n${m.codeExample}\n\`\`\``).join('\n\n')}`
            : '## Memory System\n\nThe memory system supports sliding-window, semantic-chunks, and vector-store strategies. Configure with `<MemoryProvider strategy="vector-store">` wrapper.',
        citations: [],
      }
    }
    case 'tokens': {
      const tokenEntries = knowledgeBase.filter((e) => e.category === 'token')
      return {
        response:
          tokenEntries.length > 0
            ? `## Token Optimization\n\n${tokenEntries.map((t) => `${t.content}\n\n\`\`\`typescript\n${t.codeExample}\n\`\`\``).join('\n\n')}`
            : '## Token Optimization\n\nUse `useTokenBudgetMonitor` hook to track usage. Enable compression, summarization, and pruning to reduce costs.',
        citations: [],
      }
    }
    default:
      return {
        response:
          'Command not recognized. Available commands: /components, /hooks, /adapters, /example, /memory, /tokens',
        citations: [],
      }
  }
}

export default function LibraryLearningHubPage() {
  // Provider/model state
  const [provider, setProvider] = useState('anthropic')
  const [model, setModel] = useState('claude-3.5-sonnet')
  const [apiKey, setApiKey] = useState('')

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    createDefaultConversation(),
  ])
  const [activeConvId, setActiveConvId] = useState(conversations[0].id)

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
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [activeThinking, setActiveThinking] = useState<ThinkingStep[]>([])
  const [isThinking, setIsThinking] = useState(false)
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

  // Update messages helper
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
    setShowMentionMenu(false)
    setIsThinking(true)
    setActiveThinking([])

    // Thinking steps
    const thinkingSteps: ThinkingStep[] = []
    const addThinkingStep = (content: string) => {
      const step = { id: generateId(), content, timestamp: new Date() }
      thinkingSteps.push(step)
      setActiveThinking([...thinkingSteps])
    }

    await new Promise((r) => setTimeout(r, 400))
    addThinkingStep('Understanding the question...')

    // Determine response type
    let responseData: { response: string; citations: Citation[] }

    if (slashCommandId) {
      await new Promise((r) => setTimeout(r, 300))
      addThinkingStep(`Executing /${slashCommandId} command...`)
      await new Promise((r) => setTimeout(r, 500))
      responseData = generateSlashResponse(slashCommandId)
    } else {
      // RAG search
      addThinkingStep('Searching knowledge base...')
      await new Promise((r) => setTimeout(r, 500))

      const matches = searchKnowledgeBase(text)
      if (matches.length > 0) {
        addThinkingStep(
          `Found ${matches.length} relevant entries: ${matches
            .slice(0, 3)
            .map((m) => m.title)
            .join(', ')}`
        )
        await new Promise((r) => setTimeout(r, 400))
        addThinkingStep('Composing response with code examples...')
      } else {
        addThinkingStep(
          'No direct matches found, generating general guidance...'
        )
      }
      await new Promise((r) => setTimeout(r, 400))

      responseData = generateLibraryResponse(text, matches)
    }

    addThinkingStep('Formatting response...')
    setIsThinking(false)

    // Stream response
    setIsStreaming(true)
    setStreamingText('')

    streamCancelRef.current = simulateStreaming(
      responseData.response,
      (chunk) => setStreamingText((prev) => prev + chunk),
      () => {
        setIsStreaming(false)
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: responseData.response,
          timestamp: new Date(),
          thinking: [...thinkingSteps],
          citations: responseData.citations,
          status: 'delivered',
        }
        updateMessages([...newMessages, assistantMessage])
        setStreamingText('')

        // Update token usage
        const inputTokens = estimateTokens(text)
        const outputTokens = estimateTokens(responseData.response)
        setTokenSettings((prev) => ({
          ...prev,
          used: {
            input: prev.used.input + inputTokens,
            output: prev.used.output + outputTokens,
            total: prev.used.total + inputTokens + outputTokens,
          },
        }))
        setMemorySettings((prev) => ({
          ...prev,
          usage: Math.min(
            prev.usage + inputTokens + outputTokens,
            prev.maxTokens
          ),
        }))
      },
      12
    )
  }

  // Message actions
  const handleFeedback = (msgId: string, feedback: 'up' | 'down') => {
    updateMessages(
      messages.map((m) => (m.id === msgId ? { ...m, feedback } : m))
    )
  }

  const handleDeleteMessage = (msgId: string) => {
    updateMessages(messages.filter((m) => m.id !== msgId))
  }

  const handleRegenerate = (msgId: string) => {
    const msgIndex = messages.findIndex((m) => m.id === msgId)
    if (msgIndex <= 0) return
    const userMsg = messages[msgIndex - 1]
    if (userMsg?.role !== 'user') return
    updateMessages(messages.slice(0, msgIndex))
    setTimeout(() => handleSend(userMsg.content), 100)
  }

  const handleEditStart = (msgId: string) => {
    const msg = messages.find((m) => m.id === msgId)
    if (msg) {
      setEditingMessageId(msgId)
      setEditingText(msg.content)
    }
  }

  const handleEditSave = (msgId: string) => {
    const msgIndex = messages.findIndex((m) => m.id === msgId)
    if (msgIndex === -1) return
    const newText = editingText
    updateMessages(
      messages
        .slice(0, msgIndex)
        .concat({ ...messages[msgIndex], content: newText })
    )
    setEditingMessageId(null)
    setEditingText('')
    // Re-send with edited text
    setTimeout(() => handleSend(newText), 100)
  }

  // Conversation management
  const handleNewConversation = () => {
    cancelStreaming()
    const conv = createDefaultConversation()
    setConversations((prev) => [conv, ...prev])
    setActiveConvId(conv.id)
  }

  const handleDeleteConversation = (id: string) => {
    if (conversations.length <= 1) return
    if (id === activeConvId) cancelStreaming()
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (id === activeConvId) {
      setActiveConvId(conversations.find((c) => c.id !== id)!.id)
    }
  }

  // Prompt management
  const handleSavePrompt = (text: string) => {
    setSavedPrompts((prev) => [...prev, { id: generateId(), text }])
  }
  const handleDeletePrompt = (id: string) => {
    setSavedPrompts((prev) => prev.filter((p) => p.id !== id))
  }

  // Render message content with code blocks
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).split('\n')
        const lang = lines[0]?.trim() || 'typescript'
        const code = lines.slice(1).join('\n')
        return <CodeBlockDisplay key={i} code={code} language={lang} />
      }
      // Basic markdown rendering
      return (
        <div key={i} className="prose prose-sm dark:prose-invert max-w-none">
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
              const boldEnd = line.indexOf('**', 4)
              if (boldEnd > 0) {
                return (
                  <div key={j} className="flex gap-2 py-0.5">
                    <span className="text-muted-foreground">-</span>
                    <span>
                      <strong>{line.slice(4, boldEnd)}</strong>
                      {line.slice(boldEnd + 2)}
                    </span>
                  </div>
                )
              }
            }
            if (line.startsWith('- '))
              return (
                <div key={j} className="flex gap-2 py-0.5">
                  <span className="text-muted-foreground">-</span>
                  <span>{line.slice(2)}</span>
                </div>
              )
            if (line.trim() === '') return <div key={j} className="h-2" />
            // Inline code and bold
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
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              {messages.length === 0 && !isStreaming ? (
                <LibraryWelcomeScreen
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
                        {/* Thinking display */}
                        {msg.role === 'assistant' &&
                          msg.thinking &&
                          msg.thinking.length > 0 && (
                            <ThinkingDisplay steps={msg.thinking} />
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

                        {/* Citations - find matching knowledge entries */}
                        {msg.citations && msg.citations.length > 0 && (
                          <RagCitations
                            entries={
                              msg.citations
                                .map((c) =>
                                  knowledgeBase.find((k) => k.title === c.title)
                                )
                                .filter(Boolean) as KnowledgeEntry[]
                            }
                          />
                        )}

                        {/* Message Actions */}
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
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Active thinking */}
                  {isThinking && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="max-w-[75%]">
                        <ThinkingDisplay
                          steps={activeThinking}
                          isActive={true}
                        />
                      </div>
                    </div>
                  )}

                  {/* Streaming response */}
                  {isStreaming && streamingText && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
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
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isStreaming}
                      className={cn(
                        'p-1.5 rounded-md transition-colors',
                        input.trim() && !isStreaming
                          ? 'bg-primary text-primary-foreground hover:opacity-90'
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
              <TokenPanel
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

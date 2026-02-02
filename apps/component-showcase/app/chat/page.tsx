'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  ChatInput,
  CodeBlock,
  MarkdownRenderer,
  TokenUsageMeter,
  TokenBudgetBar,
  TokenCounter,
  TypingIndicator,
  StreamingMessage,
  CitationCard,
  FollowUpSuggestions,
  ExportDialog,
  NetworkStatus,
  CommandPalette,
  PromptSuggestions,
  MemoryActivityIndicator,
  VoiceInput,
} from '@clarity-chat/react'
import {
  Card,
  Button,
  Badge,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
  Avatar,
  Tooltip,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Kbd,
  cn,
} from '@clarity-chat/primitives'
import {
  Send,
  Paperclip,
  Mic,
  Settings,
  Plus,
  MessageSquare,
  Search,
  Globe,
  Sparkles,
  Bot,
  Zap,
  Code,
  Image,
  FileText,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Share,
  ChevronDown,
  ChevronRight,
  Star,
  Bookmark,
  ExternalLink,
  Play,
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowUp,
  Loader2,
  Brain,
  Terminal,
  X,
  Download,
  Upload,
  Clock,
  Trash2,
  Edit3,
  GitBranch,
  FolderOpen,
  History,
  Command,
  Hash,
  AtSign,
  Slash,
  File,
  ImageIcon,
  Video,
  Music,
  Archive,
  Link,
  Eye,
  AlertCircle,
  Info,
  Cpu,
  Database,
  Wifi,
  WifiOff,
  Volume2,
  Square,
  Keyboard,
} from 'lucide-react'

// ============================================================================
// INTERACTIVE CHAT DEMO
// ============================================================================
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function InteractiveChatDemo() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI assistant. I can help you with coding, analysis, writing, and more. Try asking me something!`,
      timestamp: new Date(Date.now() - 60000),
    },
  ])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const simulateStreaming = (text: string) => {
    setIsStreaming(true)
    setStreamingText('')
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamingText((prev) => prev + text[index])
        index++
      } else {
        clearInterval(interval)
        setIsStreaming(false)
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            role: 'assistant',
            content: text,
            timestamp: new Date(),
          } as ChatMessage,
        ])
        setStreamingText('')
      }
    }, 20)
  }

  const handleSend = () => {
    if (!input.trim() || isStreaming) return

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    setTimeout(() => {
      const responses = [
        "That's a great question! Let me break this down for you. The key concepts involve understanding the fundamentals first, then building up from there with practical examples.",
        "I'd be happy to help with that. Here's what I recommend: start by identifying the core problem, then work through potential solutions systematically.",
        'Interesting! Based on my analysis, there are several approaches you could take. Let me outline the pros and cons of each option.',
      ]
      const response = responses[Math.floor(Math.random() * responses.length)]
      simulateStreaming(response)
    }, 500)
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamingText])

  return (
    <Card className="h-[500px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-sm">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3',
                msg.role === 'user' && 'flex-row-reverse'
              )}
            >
              <Avatar
                fallback={msg.role === 'assistant' ? 'AI' : 'U'}
                size="sm"
                className={cn(
                  msg.role === 'assistant'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                )}
              />
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5',
                  msg.role === 'assistant'
                    ? 'bg-muted'
                    : 'bg-primary text-primary-foreground'
                )}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Streaming message */}
          {isStreaming && (
            <div className="flex gap-3">
              <Avatar
                fallback="AI"
                size="sm"
                className="bg-primary text-primary-foreground"
              />
              <div className="max-w-[80%] rounded-2xl px-4 py-2.5 bg-muted">
                <p className="text-sm leading-relaxed">
                  {streamingText}
                  <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="pr-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            size="icon"
            className="h-9 w-9 shrink-0"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// TYPING INDICATORS DEMO
// ============================================================================
function TypingIndicatorsDemo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-3">Dots</p>
          <div className="flex items-center gap-2">
            <Avatar
              fallback="AI"
              size="sm"
              className="bg-primary text-primary-foreground"
            />
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-3">Pulse</p>
          <div className="flex items-center gap-2">
            <Avatar
              fallback="AI"
              size="sm"
              className="bg-primary text-primary-foreground"
            />
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary/50 animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-3">Wave</p>
          <div className="flex items-center gap-2">
            <Avatar
              fallback="AI"
              size="sm"
              className="bg-primary text-primary-foreground"
            />
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex gap-0.5 items-end h-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${8 + Math.sin(i) * 8}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Thinking with steps */}
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-3">
          Thinking with Steps
        </p>
        <div className="flex gap-3">
          <Avatar
            fallback="AI"
            size="sm"
            className="bg-primary text-primary-foreground"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-muted-foreground">
                Analyzing your question...
              </span>
            </div>
            <div className="pl-6 space-y-1.5 border-l-2 border-muted">
              {[
                { text: 'Understanding context', done: true },
                { text: 'Gathering relevant information', done: true },
                { text: 'Formulating response', done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {step.done ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                  )}
                  <span className={step.done ? 'text-muted-foreground' : ''}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// TOKEN OPTIMIZATION DEMO
// ============================================================================
function TokenOptimizationDemo() {
  const [tokenUsage, setTokenUsage] = useState({
    used: 3500,
    budget: 8000,
    inputTokens: 1200,
    outputTokens: 2300,
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Token Usage Meter */}
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-4">Token Usage Meter</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Used</span>
                <span className="font-mono">
                  {tokenUsage.used.toLocaleString()} /{' '}
                  {tokenUsage.budget.toLocaleString()}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${(tokenUsage.used / tokenUsage.budget) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Input</p>
                <p className="text-lg font-mono font-medium">
                  {tokenUsage.inputTokens.toLocaleString()}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Output</p>
                <p className="text-lg font-mono font-medium">
                  {tokenUsage.outputTokens.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Token Budget with Warnings */}
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-4">Budget Warnings</h4>
          <div className="space-y-3">
            {[
              {
                label: 'Normal',
                used: 2000,
                total: 8000,
                color: 'bg-green-500',
              },
              {
                label: 'Warning',
                used: 6000,
                total: 8000,
                color: 'bg-yellow-500',
              },
              {
                label: 'Critical',
                used: 7500,
                total: 8000,
                color: 'bg-red-500',
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-mono text-xs">
                    {Math.round((item.used / item.total) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      item.color
                    )}
                    style={{ width: `${(item.used / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Cost Estimation */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-4">Cost Estimation</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'This Message', value: '$0.004', tokens: '~400 tokens' },
            { label: 'Conversation', value: '$0.035', tokens: '~3,500 tokens' },
            { label: 'Today', value: '$0.82', tokens: '~82,000 tokens' },
            { label: 'This Month', value: '$24.50', tokens: '~2.4M tokens' },
          ].map((item) => (
            <div key={item.label} className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-xl font-mono font-bold text-primary">
                {item.value}
              </p>
              <p className="text-xs text-muted-foreground">{item.tokens}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Token Optimization Tips */}
      <Card className="p-4 border-primary/20 bg-primary/5">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">
              Optimization Suggestions
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Enable context compression to save ~40% tokens</li>
              <li>• Use memory summarization for long conversations</li>
              <li>• Consider a smaller model for simple queries</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// PROMPT INPUT VARIATIONS
// ============================================================================
function PromptInputVariationsDemo() {
  const [basicInput, setBasicInput] = useState('')
  const [advancedInput, setAdvancedInput] = useState('')
  const [showCommands, setShowCommands] = useState(false)
  const [showMentions, setShowMentions] = useState(false)
  const [attachments, setAttachments] = useState<
    { name: string; type: string; size: string }[]
  >([])

  const commands = [
    { icon: Code, label: '/code', description: 'Generate code' },
    { icon: FileText, label: '/summarize', description: 'Summarize text' },
    { icon: Globe, label: '/search', description: 'Search the web' },
    { icon: Image, label: '/image', description: 'Generate image' },
    { icon: Terminal, label: '/run', description: 'Execute code' },
    { icon: Brain, label: '/analyze', description: 'Analyze data' },
  ]

  const mentions = [
    { avatar: 'D', name: '@documents', description: 'Your uploaded documents' },
    { avatar: 'C', name: '@code', description: 'Codebase context' },
    { avatar: 'W', name: '@web', description: 'Web search results' },
    { avatar: 'M', name: '@memory', description: 'Conversation memory' },
  ]

  const handleAddAttachment = () => {
    const types = [
      { name: 'report.pdf', type: 'pdf', size: '2.4 MB' },
      { name: 'data.csv', type: 'csv', size: '156 KB' },
      { name: 'screenshot.png', type: 'image', size: '890 KB' },
      { name: 'audio-note.mp3', type: 'audio', size: '1.2 MB' },
    ]
    const randomFile = types[Math.floor(Math.random() * types.length)]
    setAttachments((prev) => [...prev, randomFile])
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4" />
      case 'csv':
        return <Database className="h-4 w-4" />
      case 'image':
        return <ImageIcon className="h-4 w-4" />
      case 'audio':
        return <Music className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Input */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3">Basic Input</h4>
        <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
          <Input
            value={basicInput}
            onChange={(e) => setBasicInput(e.target.value)}
            placeholder="Type a message..."
            className="border-0 bg-transparent focus-visible:ring-0"
          />
          <Button size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Advanced Input with Slash Commands */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3">
          Advanced Input with <Kbd shortcut="/" /> Commands
        </h4>
        <div className="relative">
          <div className="flex items-end gap-2 bg-muted rounded-xl p-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleAddAttachment}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {attachments.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-background rounded-lg px-3 py-1.5 text-sm"
                    >
                      {getFileIcon(file.type)}
                      <span className="max-w-[100px] truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {file.size}
                      </span>
                      <button
                        onClick={() =>
                          setAttachments((prev) =>
                            prev.filter((_, idx) => idx !== i)
                          )
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Input
                value={advancedInput}
                onChange={(e) => {
                  setAdvancedInput(e.target.value)
                  setShowCommands(e.target.value.startsWith('/'))
                  setShowMentions(e.target.value.includes('@'))
                }}
                placeholder="Type / for commands, @ for mentions..."
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon" className="h-8 w-8">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Slash Commands Dropdown */}
          {showCommands && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border rounded-lg shadow-lg p-1 z-10">
              <p className="text-xs text-muted-foreground px-2 py-1">
                Commands
              </p>
              {commands.map((cmd) => (
                <button
                  key={cmd.label}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted text-left"
                  onClick={() => {
                    setAdvancedInput(cmd.label + ' ')
                    setShowCommands(false)
                  }}
                >
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                    <cmd.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{cmd.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {cmd.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Mentions Dropdown */}
          {showMentions && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border rounded-lg shadow-lg p-1 z-10">
              <p className="text-xs text-muted-foreground px-2 py-1">
                Mentions
              </p>
              {mentions.map((mention) => (
                <button
                  key={mention.name}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted text-left"
                  onClick={() => {
                    setAdvancedInput((prev) =>
                      prev.replace(/@\w*$/, mention.name + ' ')
                    )
                    setShowMentions(false)
                  }}
                >
                  <Avatar fallback={mention.avatar} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{mention.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {mention.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Kbd shortcut="/" /> for commands
          <span className="text-muted-foreground/50">•</span>
          <Kbd shortcut="@" /> for mentions
          <span className="text-muted-foreground/50">•</span>
          <Kbd shortcut="mod+enter" /> to send
        </div>
      </Card>

      {/* File Attachments Showcase */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3">File Attachments Preview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              name: 'document.pdf',
              type: 'pdf',
              size: '2.4 MB',
              icon: FileText,
              color: 'text-red-500',
            },
            {
              name: 'photo.jpg',
              type: 'image',
              size: '1.8 MB',
              icon: ImageIcon,
              color: 'text-blue-500',
              preview: true,
            },
            {
              name: 'data.csv',
              type: 'csv',
              size: '156 KB',
              icon: Database,
              color: 'text-green-500',
            },
            {
              name: 'recording.mp3',
              type: 'audio',
              size: '3.2 MB',
              icon: Music,
              color: 'text-purple-500',
            },
          ].map((file) => (
            <div
              key={file.name}
              className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
            >
              {file.preview ? (
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-md mb-2 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-md mb-2 flex items-center justify-center">
                  <file.icon className={cn('h-8 w-8', file.color)} />
                </div>
              )}
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{file.size}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// PROMPT SUGGESTIONS DEMO
// ============================================================================
function PromptSuggestionsDemo() {
  const suggestions = [
    { icon: Code, text: 'Write a React component for...', category: 'Code' },
    { icon: FileText, text: 'Summarize this document...', category: 'Writing' },
    { icon: Brain, text: 'Explain the concept of...', category: 'Learning' },
    {
      icon: Sparkles,
      text: 'Generate creative ideas for...',
      category: 'Creative',
    },
    { icon: Search, text: 'Research and compare...', category: 'Research' },
    { icon: Terminal, text: 'Debug this code snippet...', category: 'Debug' },
  ]

  const followUpSuggestions = [
    'Can you explain that in more detail?',
    'Show me an example',
    'What are the alternatives?',
    'How does this compare to...',
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Suggestions */}
      <Card className="p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-1">
            How can I help you today?
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a suggestion or type your own
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {suggestions.map((s) => (
            <button
              key={s.text}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <Badge variant="outline" className="mb-1 text-xs">
                  {s.category}
                </Badge>
                <p className="text-sm">{s.text}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Follow-up Suggestions */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3">Follow-up Suggestions</h4>
        <div className="flex flex-wrap gap-2">
          {followUpSuggestions.map((s) => (
            <Button
              key={s}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              {s}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// CITATIONS AND LINKS DEMO
// ============================================================================
function CitationsDemo() {
  const citations = [
    {
      title: 'React Documentation',
      url: 'https://react.dev/learn',
      snippet:
        'React lets you build user interfaces out of individual pieces called components...',
      favicon: '⚛️',
    },
    {
      title: 'MDN Web Docs - JavaScript',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      snippet:
        'JavaScript (JS) is a lightweight interpreted programming language...',
      favicon: '📘',
    },
    {
      title: 'Stack Overflow Discussion',
      url: 'https://stackoverflow.com/questions/12345',
      snippet: 'The best practice for handling this scenario involves...',
      favicon: '📗',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Message with Citations */}
      <Card className="p-4">
        <div className="flex gap-3">
          <Avatar
            fallback="AI"
            size="sm"
            className="bg-primary text-primary-foreground"
          />
          <div className="flex-1">
            <p className="text-sm leading-relaxed mb-4">
              Based on my research, React components are reusable pieces of UI
              <sup className="text-primary cursor-pointer hover:underline">
                [1]
              </sup>
              . JavaScript provides the foundation for building these
              interactive experiences
              <sup className="text-primary cursor-pointer hover:underline">
                [2]
              </sup>
              . The community has established best practices for handling common
              scenarios
              <sup className="text-primary cursor-pointer hover:underline">
                [3]
              </sup>
              .
            </p>

            {/* Citations List */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                Sources
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {citations.map((cite, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[200px] border rounded-lg p-3 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{cite.favicon}</span>
                      <span className="text-xs text-primary">[{i + 1}]</span>
                    </div>
                    <p className="text-sm font-medium truncate">{cite.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {cite.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Link Preview */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3">Link Preview</h4>
        <div className="border rounded-lg overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
            <Globe className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">react.dev</p>
            <h3 className="font-semibold mb-1">
              React - The library for web and native user interfaces
            </h3>
            <p className="text-sm text-muted-foreground">
              Create user interfaces from components. React lets you build user
              interfaces out of individual pieces called components.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// TOOL CALLING DEMO
// ============================================================================
function ToolCallingDemo() {
  const tools = [
    {
      name: 'web_search',
      status: 'completed',
      icon: Search,
      description: 'Searching for "React best practices 2024"',
      result: 'Found 5 relevant articles',
    },
    {
      name: 'code_interpreter',
      status: 'running',
      icon: Terminal,
      description: 'Executing Python code...',
      result: null,
    },
    {
      name: 'file_read',
      status: 'pending',
      icon: FileText,
      description: 'Reading config.json',
      result: null,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Tool Execution Cards */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-4">Tool Execution</h4>
        <div className="space-y-3">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                tool.status === 'running' && 'border-primary/50 bg-primary/5'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-md flex items-center justify-center',
                  tool.status === 'completed'
                    ? 'bg-green-500/10'
                    : tool.status === 'running'
                      ? 'bg-primary/10'
                      : 'bg-muted'
                )}
              >
                {tool.status === 'running' ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                ) : tool.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <tool.icon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium font-mono">
                    {tool.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      tool.status === 'completed' &&
                        'border-green-500 text-green-500',
                      tool.status === 'running' && 'border-primary text-primary'
                    )}
                  >
                    {tool.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
                {tool.result && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    ✓ {tool.result}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Browser Preview */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3">Browser Tool</h4>
        <div className="border rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-background rounded px-3 py-1 text-sm">
              <Globe className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">https://example.com</span>
            </div>
          </div>
          <div className="aspect-video bg-background flex items-center justify-center">
            <div className="text-center">
              <Eye className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Browser preview</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Terminal */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3">Terminal Output</h4>
        <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <span>$</span>
            <span>python analyze.py</span>
          </div>
          <div className="text-gray-300 space-y-1">
            <p>Loading dataset...</p>
            <p>Processing 1,234 records...</p>
            <p className="text-green-400">✓ Analysis complete</p>
            <p>Results saved to output.json</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// CONVERSATION HISTORY DEMO
// ============================================================================
function ConversationHistoryDemo() {
  const conversations = [
    {
      id: '1',
      title: 'React Performance Optimization',
      preview: 'How can I improve the performance of my React app?',
      date: 'Today',
      messages: 12,
      branch: false,
    },
    {
      id: '2',
      title: 'TypeScript Generics Guide',
      preview: 'Can you explain TypeScript generics with examples?',
      date: 'Yesterday',
      messages: 8,
      branch: true,
    },
    {
      id: '3',
      title: 'API Design Best Practices',
      preview: 'What are the best practices for REST API design?',
      date: '2 days ago',
      messages: 15,
      branch: false,
    },
  ]

  const projects = [
    { name: 'Work', count: 12, color: 'bg-blue-500' },
    { name: 'Personal', count: 8, color: 'bg-green-500' },
    { name: 'Learning', count: 24, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Conversation List */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">Recent Conversations</h4>
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <MessageSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-medium truncate">
                      {conv.title}
                    </h5>
                    {conv.branch && (
                      <GitBranch className="h-3.5 w-3.5 text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.preview}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{conv.date}</span>
                    <span>•</span>
                    <span>{conv.messages} messages</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit3 className="h-4 w-4 mr-2" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <GitBranch className="h-4 w-4 mr-2" /> Branch
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" /> Export
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </Card>

        {/* Projects */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">Projects</h4>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.name}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <div className={cn('w-3 h-3 rounded-full', project.color)} />
                <span className="text-sm font-medium flex-1">
                  {project.name}
                </span>
                <Badge variant="secondary">{project.count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Conversation Branching */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-4">Conversation Branching</h4>
        <div className="flex items-start gap-4">
          {/* Main Branch */}
          <div className="flex-1">
            <div className="border-l-2 border-primary pl-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-primary" />
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm">Message {i} in main branch</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Branch */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <GitBranch className="h-4 w-4" />
              <span>Branch from message 2</span>
            </div>
            <div className="border-l-2 border-green-500 pl-4 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-green-500" />
                  <div className="bg-green-500/10 rounded-lg p-3">
                    <p className="text-sm">Alternative message {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// EXPORT/IMPORT DEMO
// ============================================================================
function ExportImportDemo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Options */}
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-4">Export Conversation</h4>
          <div className="space-y-2">
            {[
              {
                icon: FileText,
                label: 'Markdown (.md)',
                description: 'Human-readable format',
              },
              {
                icon: Code,
                label: 'JSON (.json)',
                description: 'Full data with metadata',
              },
              {
                icon: FileText,
                label: 'Plain Text (.txt)',
                description: 'Simple text format',
              },
              {
                icon: FileText,
                label: 'PDF (.pdf)',
                description: 'Printable document',
              },
            ].map((option) => (
              <button
                key={option.label}
                className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors text-left"
              >
                <option.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{option.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <Download className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Card>

        {/* Import */}
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-4">Import Conversation</h4>
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium mb-1">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              Supports .json, .md, .txt
            </p>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Recent Imports</p>
            <div className="space-y-2">
              {[
                { name: 'conversation-backup.json', date: '2 hours ago' },
                { name: 'project-notes.md', date: 'Yesterday' },
              ].map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {file.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ============================================================================
// KEYBOARD SHORTCUTS DEMO
// ============================================================================
function KeyboardShortcutsDemo() {
  const shortcuts = [
    {
      category: 'General',
      items: [
        { keys: 'mod+k', description: 'Open command palette' },
        { keys: 'mod+/', description: 'Show keyboard shortcuts' },
        { keys: 'mod+n', description: 'New conversation' },
        { keys: 'Escape', description: 'Close dialog / Cancel' },
      ],
    },
    {
      category: 'Chat',
      items: [
        { keys: 'mod+enter', description: 'Send message' },
        { keys: 'mod+shift+c', description: 'Copy last response' },
        { keys: 'mod+shift+r', description: 'Regenerate response' },
        { keys: 'mod+up', description: 'Edit last message' },
      ],
    },
    {
      category: 'Navigation',
      items: [
        { keys: 'mod+1', description: 'Go to conversations' },
        { keys: 'mod+2', description: 'Go to projects' },
        { keys: 'mod+3', description: 'Go to settings' },
        { keys: 'mod+f', description: 'Search conversations' },
      ],
    },
  ]

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Keyboard className="h-5 w-5" />
        <h4 className="text-sm font-medium">Keyboard Shortcuts</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shortcuts.map((group) => (
          <div key={group.category}>
            <h5 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              {group.category}
            </h5>
            <div className="space-y-2">
              {group.items.map((shortcut) => (
                <div
                  key={shortcut.keys}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm text-muted-foreground">
                    {shortcut.description}
                  </span>
                  <Kbd shortcut={shortcut.keys} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ============================================================================
// COMMAND PALETTE DEMO
// ============================================================================
function CommandPaletteDemo() {
  const [open, setOpen] = useState(false)

  const commands = [
    { icon: Plus, label: 'New Conversation', shortcut: 'mod+n' },
    { icon: Search, label: 'Search', shortcut: 'mod+f' },
    { icon: Settings, label: 'Settings', shortcut: 'mod+,' },
    { icon: Download, label: 'Export', shortcut: 'mod+e' },
    { icon: Upload, label: 'Import', shortcut: 'mod+i' },
    { icon: MessageSquare, label: 'Recent Chats', shortcut: 'mod+1' },
    { icon: FolderOpen, label: 'Projects', shortcut: 'mod+2' },
    { icon: History, label: 'History', shortcut: 'mod+h' },
  ]

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium">Command Palette</h4>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Command className="h-4 w-4 mr-2" />
          Open
          <Kbd shortcut="mod+k" className="ml-2" />
        </Button>
      </div>

      {/* Inline Preview */}
      <div className="border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/50">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-0 outline-none text-sm"
          />
        </div>
        <div className="p-2 max-h-[250px] overflow-y-auto">
          <p className="text-xs text-muted-foreground px-2 py-1">Commands</p>
          {commands.map((cmd) => (
            <button
              key={cmd.label}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted text-left"
            >
              <cmd.icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm">{cmd.label}</span>
              <Kbd shortcut={cmd.shortcut} />
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// MEMORY INDICATOR DEMO
// ============================================================================
function MemoryIndicatorDemo() {
  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-4">Memory & Context</h4>
      <div className="space-y-4">
        {/* Memory Status */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Memory Active</p>
            <p className="text-xs text-muted-foreground">
              Remembering context from 12 previous conversations
            </p>
          </div>
          <Badge variant="secondary">12 memories</Badge>
        </div>

        {/* Memory Items */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Recent Memory Updates</p>
          {[
            {
              type: 'preference',
              text: 'User prefers TypeScript over JavaScript',
            },
            { type: 'fact', text: 'Working on a React e-commerce project' },
            { type: 'context', text: 'Uses VS Code as primary editor' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-2 rounded-lg bg-muted/50"
            >
              <Database className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <Badge variant="outline" className="text-xs mb-1">
                  {item.type}
                </Badge>
                <p className="text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// NETWORK STATUS DEMO
// ============================================================================
function NetworkStatusDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <Wifi className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium">Connected</p>
            <p className="text-xs text-muted-foreground">Latency: 45ms</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Wifi className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-medium">Reconnecting</p>
            <p className="text-xs text-muted-foreground">Attempt 2/5</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <WifiOff className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium">Offline</p>
            <p className="text-xs text-muted-foreground">
              Check your connection
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function ChatComponentsPage() {
  return (
    <div className="space-y-12">
      <PageHeader
        title="Chat Components"
        description="Comprehensive showcase of all chat interface components with working examples"
      />

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="mb-8 flex-wrap h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="chat" className="rounded-lg">
            Chat Interface
          </TabsTrigger>
          <TabsTrigger value="streaming" className="rounded-lg">
            Streaming & Indicators
          </TabsTrigger>
          <TabsTrigger value="tokens" className="rounded-lg">
            Token Optimization
          </TabsTrigger>
          <TabsTrigger value="input" className="rounded-lg">
            Input Variations
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="rounded-lg">
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="citations" className="rounded-lg">
            Citations & Links
          </TabsTrigger>
          <TabsTrigger value="tools" className="rounded-lg">
            Tool Calling
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg">
            History & Branching
          </TabsTrigger>
          <TabsTrigger value="export" className="rounded-lg">
            Export/Import
          </TabsTrigger>
          <TabsTrigger value="shortcuts" className="rounded-lg">
            Shortcuts & Commands
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-8">
          <ComponentSection
            title="Interactive Chat"
            description="Full-featured chat interface with streaming responses"
          >
            <InteractiveChatDemo />
          </ComponentSection>

          <ComponentSection
            title="Memory Indicator"
            description="Shows memory and context status"
          >
            <MemoryIndicatorDemo />
          </ComponentSection>

          <ComponentSection
            title="Network Status"
            description="Connection state indicators"
          >
            <NetworkStatusDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="streaming" className="space-y-8">
          <ComponentSection
            title="Typing Indicators"
            description="Various typing and thinking indicator styles"
          >
            <TypingIndicatorsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-8">
          <ComponentSection
            title="Token Usage & Optimization"
            description="Token counting, budget tracking, and optimization tools"
          >
            <TokenOptimizationDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="input" className="space-y-8">
          <ComponentSection
            title="Prompt Input Variations"
            description="From basic to advanced input with slash commands, mentions, and attachments"
          >
            <PromptInputVariationsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-8">
          <ComponentSection
            title="Prompt Suggestions"
            description="Welcome suggestions and follow-up prompts"
          >
            <PromptSuggestionsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="citations" className="space-y-8">
          <ComponentSection
            title="Citations & Link Previews"
            description="Source citations and rich link previews"
          >
            <CitationsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="tools" className="space-y-8">
          <ComponentSection
            title="Tool Calling"
            description="Tool execution cards, browser preview, and terminal output"
          >
            <ToolCallingDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="history" className="space-y-8">
          <ComponentSection
            title="Conversation Management"
            description="History, projects, and conversation branching"
          >
            <ConversationHistoryDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="export" className="space-y-8">
          <ComponentSection
            title="Export & Import"
            description="Export conversations and import data"
          >
            <ExportImportDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="shortcuts" className="space-y-8">
          <ComponentSection
            title="Command Palette"
            description="Quick access to all commands"
          >
            <CommandPaletteDemo />
          </ComponentSection>

          <ComponentSection
            title="Keyboard Shortcuts"
            description="All available keyboard shortcuts"
          >
            <KeyboardShortcutsDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}

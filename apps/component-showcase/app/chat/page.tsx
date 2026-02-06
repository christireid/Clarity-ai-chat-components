'use client'

import { useState, useRef, useEffect } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  // Core Chat Components
  ChatInput,
  ChatWindow,
  FollowUpSuggestions,
  CodeBlock,
  MarkdownRenderer,

  // Streaming & Messages
  TypingIndicator,
  StreamingMessage,
  CitationCard,

  // Navigation & Commands
  CommandPalette,

  // Input
  VoiceInput,

  // Media
  ExportDialog,

  // Network
  NetworkStatus,

  // Prompts
  PromptSuggestions,

  // Agent & Tools
  AgentPanel,
} from '@clarity-chat/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Separator,
  Switch,
  Checkbox,
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
  Image as ImageIcon,
  FileText,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Share,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Star,
  Bookmark,
  ExternalLink,
  Play,
  Pause,
  Square,
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
  Folder,
  File,
  History,
  Command,
  Hash,
  AtSign,
  Slash,
  Video,
  Music,
  Archive,
  Link,
  Eye,
  EyeOff,
  AlertCircle,
  AlertTriangle,
  Info,
  Cpu,
  Database,
  Wifi,
  WifiOff,
  Volume2,
  Keyboard,
  Check,
  Filter,
  SortAsc,
  RotateCw,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Gauge,
  Target,
  Layers,
  Package,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Bug,
  TestTube,
  Wrench,
  Cog,
  Lock,
  Unlock,
  Key,
  User,
  Users,
  UserPlus,
  Mail,
  Bell,
  BellOff,
  Calendar,
  MapPin,
  Navigation,
  Compass,
  Award,
  Gift,
  Heart,
  Lightbulb,
  Wand2,
  Move,
  Maximize2,
  Minimize2,
  MoreVertical,
  Forward,
  Reply,
  ReplyAll,
  ArchiveIcon,
  Inbox,
  Tag,
  Flag,
  Pin,
  PinOff,
  MessageCircle,
  Send as SendIcon,
  RotateCcw,
  AlertOctagon,
  Timer,
  Hourglass,
} from 'lucide-react'

// Force dynamic rendering to avoid SSR issues with complex components
export const dynamic = 'force-dynamic'

// ============================================================================
// TYPES
// ============================================================================
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  tools?: ToolExecution[]
  thinking?: ThinkingStep[]
  citations?: Citation[]
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error'
  isDraft?: boolean
  isArchived?: boolean
  isPinned?: boolean
}

interface ToolExecution {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  input?: string
  output?: string
  duration?: string
}

interface ThinkingStep {
  id: string
  content: string
  timestamp: Date
}

interface Citation {
  id: string
  title: string
  url: string
  snippet: string
}

// ============================================================================
// ADVANCED AGENTIC CHAT DEMO
// ============================================================================
function AdvancedAgenticChatDemo() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome! I'm an AI assistant with full tool-calling capabilities. I can:

- **Search the web** for real-time information
- **Execute code** in a sandboxed environment
- **Read and analyze files** you upload
- **Generate images** from descriptions
- **Manage tasks** and workflows

Try asking me something that requires tools!`,
      timestamp: new Date(Date.now() - 60000),
      status: 'read',
    },
  ])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [activeTools, setActiveTools] = useState<ToolExecution[]>([])
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([])
  const [showThinking, setShowThinking] = useState(true)
  const [tokenUsage, setTokenUsage] = useState({
    input: 1245,
    output: 892,
    total: 2137,
    budget: 8000,
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  const simulateToolExecution = async (toolName: string) => {
    const toolId = String(Date.now())
    const tool: ToolExecution = {
      id: toolId,
      name: toolName,
      status: 'running',
      input: `Executing ${toolName}...`,
    }
    setActiveTools((prev) => [...prev, tool])

    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000))

    setActiveTools((prev) =>
      prev.map((t) =>
        t.id === toolId
          ? {
              ...t,
              status: 'completed',
              output: `${toolName} completed successfully`,
              duration: `${(1.5 + Math.random()).toFixed(1)}s`,
            }
          : t
      )
    )

    return tool
  }

  const simulateThinking = async (steps: string[]) => {
    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 500))
      setThinkingSteps((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          content: step,
          timestamp: new Date(),
        },
      ])
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: input,
      timestamp: new Date(),
      status: 'sending',
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setActiveTools([])
    setThinkingSteps([])
    setIsStreaming(true)

    // Update status to sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessage.id ? { ...m, status: 'sent' } : m
        )
      )
    }, 200)

    // Simulate thinking
    await simulateThinking([
      'Understanding the request...',
      'Determining which tools to use...',
      'Planning execution strategy...',
    ])

    // Check if user asked for tool usage
    const lowerInput = input.toLowerCase()
    if (lowerInput.includes('search') || lowerInput.includes('find')) {
      await simulateToolExecution('web_search')
    }
    if (
      lowerInput.includes('code') ||
      lowerInput.includes('run') ||
      lowerInput.includes('execute')
    ) {
      await simulateToolExecution('code_interpreter')
    }
    if (
      lowerInput.includes('file') ||
      lowerInput.includes('read') ||
      lowerInput.includes('analyze')
    ) {
      await simulateToolExecution('file_reader')
    }

    // Simulate streaming response
    const response = `Based on my analysis${activeTools.length > 0 ? ` using ${activeTools.map((t) => t.name).join(', ')}` : ''}, here's what I found:

The requested task has been completed successfully. I've processed the information and here are the key findings:

1. **Primary Result**: The main objective was achieved with high confidence
2. **Supporting Data**: Additional context was gathered from multiple sources
3. **Recommendations**: Based on the analysis, I suggest the following next steps

Would you like me to elaborate on any of these points or perform additional analysis?`

    let index = 0
    const interval = setInterval(() => {
      if (index < response.length) {
        setStreamingText((prev) => prev + response[index])
        index++
      } else {
        clearInterval(interval)
        setIsStreaming(false)
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            role: 'assistant',
            content: response,
            timestamp: new Date(),
            tools: [...activeTools],
            thinking: [...thinkingSteps],
            citations: [
              {
                id: '1',
                title: 'Documentation',
                url: 'https://docs.example.com',
                snippet: 'Official documentation',
              },
              {
                id: '2',
                title: 'Best Practices',
                url: 'https://example.com/guide',
                snippet: 'Industry best practices',
              },
            ],
            status: 'delivered',
          },
        ])
        setStreamingText('')
        setTokenUsage((prev) => ({
          ...prev,
          input: prev.input + Math.floor(Math.random() * 500),
          output: prev.output + Math.floor(Math.random() * 300),
          total: prev.total + Math.floor(Math.random() * 800),
        }))
      }
    }, 15)
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamingText, thinkingSteps])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Chat */}
      <Card className="lg:col-span-2 h-[700px] flex flex-col overflow-hidden glass-card border-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Agentic Assistant</h3>
                <Badge className="bg-green-500/20 text-green-600">Online</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Claude 3.5 Sonnet • Tools Enabled
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Token Counter */}
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted text-sm">
              <span className="font-mono">
                {tokenUsage.total.toLocaleString()}
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="font-mono text-muted-foreground">
                {tokenUsage.budget.toLocaleString()}
              </span>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Token Budget Bar */}
        <div className="px-4 py-2 border-b">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Token Budget</span>
              <span>
                {Math.round((tokenUsage.total / tokenUsage.budget) * 100)}% used
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  tokenUsage.total > tokenUsage.budget * 0.9
                    ? 'bg-red-500'
                    : tokenUsage.total > tokenUsage.budget * 0.7
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                )}
                style={{
                  width: `${(tokenUsage.total / tokenUsage.budget) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-6">
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
                  className={cn(
                    'w-8 h-8 shrink-0',
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                      : 'bg-primary text-primary-foreground'
                  )}
                />
                <div
                  className={cn(
                    'flex-1 space-y-2',
                    msg.role === 'user' && 'flex flex-col items-end'
                  )}
                >
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3 max-w-[85%]',
                      msg.role === 'assistant'
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    )}
                  >
                    <MarkdownRenderer content={msg.content} />
                  </div>

                  {/* Status Indicator */}
                  {msg.role === 'user' && msg.status && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {msg.status === 'sending' && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      {msg.status === 'sent' && <Check className="h-3 w-3" />}
                      {msg.status === 'delivered' && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                      {msg.status === 'read' && (
                        <CheckCircle className="h-3 w-3 text-blue-500" />
                      )}
                      <span className="capitalize">{msg.status}</span>
                    </div>
                  )}

                  {/* Tool Executions */}
                  {msg.tools && msg.tools.length > 0 && (
                    <div className="space-y-2 max-w-[85%]">
                      <p className="text-xs text-muted-foreground font-medium">
                        Tools Used
                      </p>
                      {msg.tools.map((tool) => (
                        <div
                          key={tool.id}
                          className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-sm"
                        >
                          <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          </div>
                          <span className="font-mono">{tool.name}</span>
                          <span className="text-muted-foreground">
                            {tool.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 max-w-[85%]">
                      {msg.citations.map((cite, i) => (
                        <div
                          key={cite.id}
                          className="flex-shrink-0 w-40 p-2 border rounded-lg text-xs cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {i + 1}
                            </Badge>
                          </div>
                          <p className="font-medium truncate">{cite.title}</p>
                          <p className="text-muted-foreground truncate">
                            {cite.url}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Actions */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Forward className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Pin className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Streaming Response */}
            {isStreaming && (
              <div className="flex gap-3">
                <Avatar
                  fallback="AI"
                  className="w-8 h-8 shrink-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                />
                <div className="flex-1 space-y-2">
                  {showThinking && thinkingSteps.length > 0 && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                        <Brain className="h-4 w-4 animate-pulse" />
                        Thinking...
                      </div>
                      {thinkingSteps.map((step) => (
                        <div
                          key={step.id}
                          className="flex items-center gap-2 text-sm text-muted-foreground pl-6"
                        >
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                          {step.content}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTools.length > 0 && (
                    <div className="space-y-2">
                      {activeTools.map((tool) => (
                        <div
                          key={tool.id}
                          className={cn(
                            'flex items-center gap-2 p-2 rounded-lg text-sm',
                            tool.status === 'running'
                              ? 'bg-yellow-500/10 border border-yellow-500/20'
                              : 'bg-green-500/10 border border-green-500/20'
                          )}
                        >
                          {tool.status === 'running' ? (
                            <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          <span className="font-mono">{tool.name}</span>
                          {tool.status === 'running' && (
                            <span className="text-muted-foreground">
                              Running...
                            </span>
                          )}
                          {tool.duration && (
                            <span className="text-muted-foreground">
                              {tool.duration}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {streamingText && (
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <MarkdownRenderer content={streamingText} />
                      <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything or request a tool..."
                className="h-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
              className="h-10 px-4 gap-2"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Kbd shortcut="Enter" /> to send
            </div>
            <div className="flex items-center gap-1">
              <Kbd shortcut="/" /> for commands
            </div>
            <div className="flex items-center gap-1">
              <Kbd shortcut="@" /> to mention
            </div>
          </div>
        </div>
      </Card>

      {/* Right Sidebar */}
      <div className="space-y-4">
        {/* Available Tools */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              Available Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { name: 'web_search', icon: Globe, desc: 'Search the web' },
              {
                name: 'code_interpreter',
                icon: Terminal,
                desc: 'Execute code',
              },
              { name: 'file_reader', icon: FileText, desc: 'Read files' },
              { name: 'image_gen', icon: ImageIcon, desc: 'Generate images' },
              { name: 'calendar', icon: Calendar, desc: 'Manage events' },
            ].map((tool) => (
              <div
                key={tool.name}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <tool.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium font-mono">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Ready
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Memory & Token Usage */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              Memory & Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Memory Activity */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-600">
                Memory active • Storing context
              </span>
            </div>
            <Separator className="my-3" />
            {/* Token Usage */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Input tokens</span>
                <span className="font-mono">
                  {tokenUsage.input.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Output tokens</span>
                <span className="font-mono">
                  {tokenUsage.output.toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span className="font-mono">
                  {tokenUsage.total.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${(tokenUsage.total / tokenUsage.budget) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {Math.round((tokenUsage.total / tokenUsage.budget) * 100)}% of
                budget
              </p>
            </div>
            <div className="mt-3 p-2 bg-primary/5 rounded-lg">
              <p className="text-xs text-muted-foreground">Estimated cost</p>
              <p className="text-lg font-bold text-primary">
                ${((tokenUsage.total / 1000) * 0.01).toFixed(4)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <Download className="h-4 w-4" />
              Export Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <GitBranch className="h-4 w-4" />
              Branch Conversation
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============================================================================
// CODE & TERMINAL DEMO
// ============================================================================
function CodeTerminalDemo() {
  const [activeTab, setActiveTab] = useState('code')
  const [isRunning, setIsRunning] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ npm install @clarity-chat/react',
    'added 45 packages in 2.3s',
    '',
    '$ npm run build',
    '> clarity-chat@1.0.0 build',
    '✓ Compiled successfully in 3.2s',
  ])

  const sampleCode = `import { ClarityChatApp, useClarityChat } from '@clarity-chat/react'

export default function ChatPage() {
  const { messages, sendMessage, isStreaming } = useClarityChat({
    api: '/api/chat',
    onFinish: (message) => console.log('Done:', message),
  })

  return (
    <ClarityChatApp
      api="/api/chat"
      features={{
        memory: true,
        tools: ['web_search', 'code_interpreter'],
        tokenOptimization: true,
      }}
      preset="enterprise"
    />
  )
}`

  const runCode = () => {
    setIsRunning(true)
    setTerminalOutput((prev) => [...prev, '', '$ tsx example.ts'])
    setTimeout(
      () =>
        setTerminalOutput((prev) => [...prev, 'Initializing Clarity Chat...']),
      500
    )
    setTimeout(
      () => setTerminalOutput((prev) => [...prev, '✓ Connected to API']),
      1000
    )
    setTimeout(
      () => setTerminalOutput((prev) => [...prev, '✓ Memory initialized']),
      1500
    )
    setTimeout(() => {
      setTerminalOutput((prev) => [
        ...prev,
        '',
        'Server running at http://localhost:3000',
      ])
      setIsRunning(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Code & Terminal</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="code" className="gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="terminal" className="gap-2">
              <Terminal className="h-4 w-4" />
              Terminal
            </TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="mt-0">
            <CodeBlock language="typescript" showLineNumbers>
              {sampleCode}
            </CodeBlock>
          </TabsContent>
          <TabsContent value="terminal" className="mt-0">
            <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm h-[300px] overflow-auto">
              {terminalOutput.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    line.startsWith('✓') && 'text-green-400',
                    line.startsWith('$') && 'text-blue-400',
                    line.startsWith('>') && 'text-yellow-400',
                    !line.startsWith('✓') &&
                      !line.startsWith('$') &&
                      !line.startsWith('>') &&
                      'text-gray-300'
                  )}
                >
                  {line || '\u00A0'}
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Running...
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// FILE TREE DEMO
// ============================================================================
function FileTreeDemo() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['src', 'src/components'])
  )
  const [selectedFile, setSelectedFile] = useState(
    'src/components/ChatWindow.tsx'
  )

  const fileTree = [
    {
      name: 'src',
      type: 'folder' as const,
      children: [
        {
          name: 'components',
          type: 'folder' as const,
          children: [
            { name: 'ChatWindow.tsx', type: 'file' as const },
            { name: 'ChatInput.tsx', type: 'file' as const },
            { name: 'MessageList.tsx', type: 'file' as const },
          ],
        },
        {
          name: 'hooks',
          type: 'folder' as const,
          children: [{ name: 'useClarityChat.ts', type: 'file' as const }],
        },
      ],
    },
    { name: 'package.json', type: 'file' as const },
    { name: 'README.md', type: 'file' as const },
  ]

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const renderNode = (
    node: { name: string; type: 'file' | 'folder'; children?: any[] },
    path: string = '',
    depth: number = 0
  ): React.ReactNode => {
    const fullPath = path ? `${path}/${node.name}` : node.name
    const isExpanded = expandedFolders.has(fullPath)
    const isSelected = selectedFile === fullPath

    return (
      <div key={fullPath}>
        <button
          onClick={() =>
            node.type === 'folder'
              ? toggleFolder(fullPath)
              : setSelectedFile(fullPath)
          }
          className={cn(
            'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md',
            isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {node.type === 'folder' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-yellow-500" />
              ) : (
                <Folder className="h-4 w-4 text-yellow-500" />
              )}
            </>
          ) : (
            <>
              <span className="w-4" />
              <File className="h-4 w-4 text-blue-500" />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {node.type === 'folder' &&
          isExpanded &&
          node.children?.map((child: any) =>
            renderNode(child, fullPath, depth + 1)
          )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          File Explorer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-2 max-h-[300px] overflow-auto">
          {fileTree.map((node) => renderNode(node))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SAFETY ALERTS & GUARDRAILS DEMO
// ============================================================================
function SafetyAlertsDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Safety & Guardrails
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          {
            type: 'success',
            title: 'Safe Response',
            message: 'Content passed all safety checks',
            icon: ShieldCheck,
          },
          {
            type: 'warning',
            title: 'Caution',
            message: 'Response may contain sensitive information',
            icon: AlertTriangle,
          },
          {
            type: 'error',
            title: 'Blocked',
            message: 'Request was blocked due to policy violation',
            icon: ShieldAlert,
          },
          {
            type: 'info',
            title: 'Rate Limited',
            message: 'Request throttled - 5 requests per minute',
            icon: Timer,
          },
        ].map((alert, i) => (
          <div
            key={i}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border',
              alert.type === 'success' && 'bg-green-500/10 border-green-500/30',
              alert.type === 'warning' &&
                'bg-yellow-500/10 border-yellow-500/30',
              alert.type === 'error' && 'bg-red-500/10 border-red-500/30',
              alert.type === 'info' && 'bg-blue-500/10 border-blue-500/30'
            )}
          >
            <alert.icon
              className={cn(
                'h-5 w-5 shrink-0',
                alert.type === 'success' && 'text-green-500',
                alert.type === 'warning' && 'text-yellow-500',
                alert.type === 'error' && 'text-red-500',
                alert.type === 'info' && 'text-blue-500'
              )}
            />
            <div>
              <p className="font-medium text-sm">{alert.title}</p>
              <p className="text-xs text-muted-foreground">{alert.message}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// APPROVAL CARD DEMO
// ============================================================================
function ApprovalCardDemo() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>(
    'pending'
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Tool Approval
        </CardTitle>
        <CardDescription>
          Human-in-the-loop for sensitive operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'p-4 rounded-lg border-2 border-dashed',
            status === 'pending' && 'border-yellow-500/50 bg-yellow-500/5',
            status === 'approved' && 'border-green-500/50 bg-green-500/5',
            status === 'rejected' && 'border-red-500/50 bg-red-500/5'
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                status === 'pending' && 'bg-yellow-500/20',
                status === 'approved' && 'bg-green-500/20',
                status === 'rejected' && 'bg-red-500/20'
              )}
            >
              {status === 'pending' && (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              {status === 'approved' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {status === 'rejected' && <X className="h-5 w-5 text-red-500" />}
            </div>
            <div className="flex-1">
              <p className="font-medium">Delete user data</p>
              <p className="text-sm text-muted-foreground mt-1">
                The AI wants to execute{' '}
                <code className="px-1 py-0.5 bg-muted rounded">
                  delete_user_data
                </code>
              </p>
              <div className="mt-3 p-2 bg-muted rounded font-mono text-xs">
                {`{ "user_id": "usr_123", "reason": "account_deletion" }`}
              </div>
            </div>
          </div>

          {status === 'pending' && (
            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => setStatus('approved')}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-500"
                onClick={() => setStatus('rejected')}
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
          {status !== 'pending' && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setStatus('pending')}
            >
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CHAIN OF THOUGHT DEMO
// ============================================================================
function ChainOfThoughtDemo() {
  const [expanded, setExpanded] = useState(true)
  const steps = [
    {
      id: 1,
      content: "Understanding the user's question about React hooks",
      time: '0.2s',
    },
    {
      id: 2,
      content:
        'Identifying relevant concepts: useState, useEffect, custom hooks',
      time: '0.4s',
    },
    {
      id: 3,
      content: 'Recalling best practices from documentation',
      time: '0.6s',
    },
    {
      id: 4,
      content: 'Formulating clear explanation with examples',
      time: '0.8s',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full"
        >
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-500" />
            Chain of Thought
          </CardTitle>
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="relative pl-6 space-y-4">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-violet-500/30" />
            {steps.map((step, i) => (
              <div key={step.id} className="relative flex items-start gap-3">
                <div className="absolute left-[-13px] w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium bg-violet-500 text-white">
                  {i + 1}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-sm">{step.content}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// ============================================================================
// EMPTY STATE DEMO
// ============================================================================
function EmptyStateDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Empty States</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-8 border rounded-lg text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No conversations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start a new chat to get going
            </p>
            <Button className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
          <div className="p-8 border rounded-lg text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No results found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ERROR PAGE DEMO
// ============================================================================
function ErrorPageDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Error States</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertOctagon className="h-10 w-10 text-red-500 mb-3" />
            <p className="font-medium text-red-600">Connection Failed</p>
            <p className="text-sm text-muted-foreground mt-1">
              Unable to reach the server
            </p>
            <Button variant="outline" size="sm" className="mt-3 gap-2">
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
          </div>
          <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertTriangle className="h-10 w-10 text-yellow-500 mb-3" />
            <p className="font-medium text-yellow-600">Rate Limited</p>
            <p className="text-sm text-muted-foreground mt-1">
              Too many requests. Retry in 30s
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Hourglass className="h-4 w-4" />
              Waiting...
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MESSAGE DRAFTS & ARCHIVE
// ============================================================================
function MessageDraftsDemo() {
  const drafts = [
    { id: 1, preview: 'Can you help me with...', time: '2 min ago' },
    { id: 2, preview: 'I need to understand how...', time: '1 hour ago' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          Drafts & Archive
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Drafts</p>
          <div className="space-y-2">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
              >
                <Edit3 className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm truncate">{draft.preview}</span>
                <span className="text-xs text-muted-foreground">
                  {draft.time}
                </span>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Archived messages</span>
          </div>
          <Badge variant="secondary">12</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// QUICK REPLIES DEMO
// ============================================================================
function QuickRepliesDemo() {
  const replies = [
    'Yes, please continue',
    'Can you explain more?',
    'Show me an example',
    "That's helpful, thanks!",
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Reply className="h-5 w-5" />
          Quick Replies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {replies.map((reply, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              {reply}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// NOTIFICATIONS & UNREAD DEMO
// ============================================================================
function NotificationsDemo() {
  const notifications = [
    {
      id: 1,
      title: 'New message',
      desc: 'AI responded to your query',
      time: '2m',
      unread: true,
    },
    {
      id: 2,
      title: 'Task completed',
      desc: 'Code execution finished',
      time: '5m',
      unread: true,
    },
    {
      id: 3,
      title: 'Memory updated',
      desc: 'New facts stored',
      time: '10m',
      unread: false,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <Badge className="bg-red-500">2</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={cn(
              'flex items-start gap-3 p-2 rounded-lg',
              notif.unread && 'bg-primary/5'
            )}
          >
            {notif.unread && (
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
            )}
            {!notif.unread && <div className="w-2" />}
            <div className="flex-1">
              <p className="text-sm font-medium">{notif.title}</p>
              <p className="text-xs text-muted-foreground">{notif.desc}</p>
            </div>
            <span className="text-xs text-muted-foreground">{notif.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PERSONAS DEMO
// ============================================================================
function PersonasDemo() {
  const personas = [
    {
      id: 1,
      name: 'Code Assistant',
      desc: 'Expert in programming',
      icon: Code,
      active: true,
    },
    {
      id: 2,
      name: 'Writing Helper',
      desc: 'Creative writing & editing',
      icon: Edit3,
      active: false,
    },
    {
      id: 3,
      name: 'Research Agent',
      desc: 'Deep research & analysis',
      icon: Search,
      active: false,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Personas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
              persona.active
                ? 'bg-primary/10 border border-primary/30'
                : 'hover:bg-muted'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                persona.active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <persona.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{persona.name}</p>
              <p className="text-xs text-muted-foreground">{persona.desc}</p>
            </div>
            {persona.active && <Badge>Active</Badge>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SOURCES DISPLAY DEMO
// ============================================================================
function SourcesDemo() {
  const sources = [
    {
      id: 1,
      title: 'React Documentation',
      url: 'react.dev',
      snippet: 'Official React docs...',
    },
    {
      id: 2,
      title: 'MDN Web Docs',
      url: 'developer.mozilla.org',
      snippet: 'Web technology reference...',
    },
    {
      id: 3,
      title: 'Stack Overflow',
      url: 'stackoverflow.com',
      snippet: 'Community Q&A...',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Link className="h-5 w-5" />
          Sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sources.map((source, i) => (
            <div
              key={source.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer"
            >
              <Badge variant="outline">{i + 1}</Badge>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{source.title}</p>
                <p className="text-xs text-primary truncate">{source.url}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {source.snippet}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// RETRY LOGIC DEMO
// ============================================================================
function RetryLogicDemo() {
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<
    'idle' | 'retrying' | 'success' | 'failed'
  >('idle')

  const simulateRetry = async () => {
    setStatus('retrying')
    setAttempt(1)

    for (let i = 1; i <= 3; i++) {
      await new Promise((r) => setTimeout(r, 1000))
      setAttempt(i + 1)
      if (i === 3) {
        setStatus('success')
      }
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <RotateCw className="h-5 w-5" />
          Retry Logic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Request Status</span>
              <Badge
                className={cn(
                  status === 'idle' && 'bg-gray-500/20 text-gray-600',
                  status === 'retrying' && 'bg-yellow-500/20 text-yellow-600',
                  status === 'success' && 'bg-green-500/20 text-green-600',
                  status === 'failed' && 'bg-red-500/20 text-red-600'
                )}
              >
                {status}
              </Badge>
            </div>
            {status === 'retrying' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Attempt {attempt} of 3...
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all"
                    style={{ width: `${(attempt / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Request successful after {attempt - 1} retries
              </div>
            )}
          </div>
          <Button
            onClick={simulateRetry}
            disabled={status === 'retrying'}
            className="w-full gap-2"
          >
            {status === 'retrying' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4" />
            )}
            Simulate Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MESSAGE SEARCH DEMO
// ============================================================================
function MessageSearchDemo() {
  const [query, setQuery] = useState('')
  const results = [
    { id: 1, content: 'How to implement React hooks...', time: 'Yesterday' },
    { id: 2, content: 'Best practices for TypeScript...', time: '3 days ago' },
    { id: 3, content: 'Understanding async/await...', time: 'Last week' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5" />
          Message Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages..."
            className="pl-9"
          />
        </div>
        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm truncate">{result.content}</span>
              <span className="text-xs text-muted-foreground">
                {result.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MODEL FALLBACK DEMO
// ============================================================================
function ModelFallbackDemo() {
  const models = [
    { name: 'GPT-4o', status: 'primary', latency: '234ms' },
    { name: 'Claude 3.5', status: 'fallback', latency: '198ms' },
    { name: 'GPT-4o-mini', status: 'fallback', latency: '89ms' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Model Fallback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {models.map((model, i) => (
            <div
              key={model.name}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border',
                i === 0 && 'border-primary bg-primary/5'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                  i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{model.name}</p>
                <p className="text-xs text-muted-foreground">
                  Latency: {model.latency}
                </p>
              </div>
              <Badge variant={i === 0 ? 'default' : 'secondary'}>
                {model.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DATE PICKER DEMO
// ============================================================================
function DatePickerDemo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const currentMonth = new Date().toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Date Picker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-3 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon">
              <ChevronUp className="h-4 w-4 rotate-[-90deg]" />
            </Button>
            <span className="font-medium">{currentMonth}</span>
            <Button variant="ghost" size="icon">
              <ChevronUp className="h-4 w-4 rotate-90" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {days.map((day) => (
              <div key={day} className="text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                className={cn(
                  'py-2 rounded-lg hover:bg-muted transition-colors',
                  day === new Date().getDate() &&
                    'bg-primary text-primary-foreground'
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// INLINE CITATIONS DEMO
// ============================================================================
function InlineCitationsDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Inline Citations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm leading-relaxed">
            React components are reusable pieces of UI
            <sup className="text-primary cursor-pointer hover:underline mx-0.5">
              [1]
            </sup>
            that can manage their own state. The Virtual DOM
            <sup className="text-primary cursor-pointer hover:underline mx-0.5">
              [2]
            </sup>
            enables efficient updates by comparing changes before applying them
            to the real DOM
            <sup className="text-primary cursor-pointer hover:underline mx-0.5">
              [3]
            </sup>
            .
          </p>
        </div>
        <div className="mt-3 space-y-2">
          {[
            {
              num: 1,
              title: 'React Docs - Components',
              url: 'react.dev/learn/components',
            },
            {
              num: 2,
              title: 'Virtual DOM Explained',
              url: 'react.dev/learn/vdom',
            },
            {
              num: 3,
              title: 'Reconciliation',
              url: 'react.dev/learn/reconciliation',
            },
          ].map((cite) => (
            <div key={cite.num} className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="w-5 h-5 p-0 justify-center">
                {cite.num}
              </Badge>
              <span className="font-medium">{cite.title}</span>
              <span className="text-muted-foreground">- {cite.url}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function ChatPage() {
  return (
    <div className="space-y-12 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-primary -top-40 -right-40 opacity-30" />
        <div className="orb-violet top-1/2 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="Advanced Chat Components"
        description="Comprehensive showcase of all chat, agentic, code, tool-calling, and workflow components with full working functionality"
        icon={MessageSquare}
        badge="45+ Components"
      />

      <Tabs defaultValue="agentic" className="w-full">
        <TabsList className="mb-8 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger
            value="agentic"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Brain className="h-4 w-4" />
            Agentic Chat
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Code className="h-4 w-4" />
            Code & Files
          </TabsTrigger>
          <TabsTrigger
            value="tools"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Wrench className="h-4 w-4" />
            Tools & Approval
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger
            value="ui"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Layers className="h-4 w-4" />
            UI Components
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agentic" className="space-y-8">
          <ComponentSection
            title="Agentic Chat with Tool Calling"
            description="Full-featured chat with thinking, tools, citations, and token tracking"
            icon={Brain}
          >
            <AdvancedAgenticChatDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="code" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Code Editor & Terminal"
              description="Syntax-highlighted code with live execution"
              icon={Terminal}
            >
              <CodeTerminalDemo />
            </ComponentSection>
            <ComponentSection
              title="File Explorer"
              description="Navigate project structure"
              icon={FolderOpen}
            >
              <FileTreeDemo />
            </ComponentSection>
          </div>
          <ComponentSection
            title="Chain of Thought"
            description="AI reasoning visualization"
            icon={Brain}
          >
            <ChainOfThoughtDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="tools" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Tool Approval"
              description="Human-in-the-loop"
              icon={ShieldCheck}
            >
              <ApprovalCardDemo />
            </ComponentSection>
            <ComponentSection
              title="Safety & Guardrails"
              description="Content moderation"
              icon={Shield}
            >
              <SafetyAlertsDemo />
            </ComponentSection>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Retry Logic"
              description="Automatic retry with backoff"
              icon={RotateCw}
            >
              <RetryLogicDemo />
            </ComponentSection>
            <ComponentSection
              title="Model Fallback"
              description="Automatic model failover"
              icon={Layers}
            >
              <ModelFallbackDemo />
            </ComponentSection>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Drafts & Archive"
              description="Message drafts and archiving"
              icon={Edit3}
            >
              <MessageDraftsDemo />
            </ComponentSection>
            <ComponentSection
              title="Quick Replies"
              description="Pre-defined responses"
              icon={Reply}
            >
              <QuickRepliesDemo />
            </ComponentSection>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Message Search"
              description="Full-text search"
              icon={Search}
            >
              <MessageSearchDemo />
            </ComponentSection>
            <ComponentSection
              title="Sources"
              description="Citation sources"
              icon={Link}
            >
              <SourcesDemo />
            </ComponentSection>
          </div>
          <ComponentSection
            title="Inline Citations"
            description="Citations within text"
            icon={FileText}
          >
            <InlineCitationsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="ui" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Notifications"
              description="Real-time alerts"
              icon={Bell}
            >
              <NotificationsDemo />
            </ComponentSection>
            <ComponentSection
              title="Personas"
              description="AI personas"
              icon={Users}
            >
              <PersonasDemo />
            </ComponentSection>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Empty States"
              description="Empty content handling"
              icon={Inbox}
            >
              <EmptyStateDemo />
            </ComponentSection>
            <ComponentSection
              title="Error States"
              description="Error handling"
              icon={AlertCircle}
            >
              <ErrorPageDemo />
            </ComponentSection>
          </div>
          <ComponentSection
            title="Date Picker"
            description="Date selection"
            icon={Calendar}
          >
            <DatePickerDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}

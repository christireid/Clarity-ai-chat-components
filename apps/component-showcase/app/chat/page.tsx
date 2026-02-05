'use client'

import { useState, useRef, useEffect } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import { CodeBlock, MarkdownRenderer } from '@clarity-chat/react'
import {
  VeryLongMessageDemo,
  RateLimitingDemo as EdgeCaseRateLimitingDemo,
  NetworkErrorDemo,
  OfflineModeDemo,
  MemoryLimitDemo,
  TokenLimitWarningDemo,
  ToolExecutionFailureDemo,
  ConcurrentStreamDemo,
  MessageEditHistoryDemo,
  BranchVisualizationDemo,
} from './edge-case-demos'
import { MemoryManagementDemo } from './MemoryManagementDemo'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Button, Badge, Input, Tabs, TabsList, TabsTrigger, TabsContent,
  ScrollArea, Avatar, Separator, cn,
} from '@clarity-chat/primitives'
import {
  Send, Paperclip, Mic, MessageSquare, Code, FileText, Copy,
  ChevronDown, Loader2, Brain, Terminal, X, Download, CheckCircle,
  Check, File, Play, Square, AlertTriangle, AlertCircle, Globe,
  Wrench, Zap, ExternalLink, Clock, Database, Package, RotateCw,
  Eye, EyeOff, Info, Image as ImageIcon,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  status?: 'sending' | 'sent' | 'delivered' | 'error'
  thinking?: string[]
  tools?: { id: string; name: string; status: string; input?: any; output?: any; duration?: string }[]
  citations?: { id: string; title: string; url: string; snippet: string }[]
  attachments?: { id: string; name: string; type: string; size: string }[]
  codeBlocks?: { id: string; language: string; code: string; output?: string; status?: string }[]
  error?: string
}

// Demo 1: Simple Chat
function SimpleChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'user', content: 'What is React?', timestamp: new Date(Date.now() - 120000), status: 'delivered' },
    { id: '2', role: 'assistant', content: `React is a JavaScript library for building user interfaces.

**Key Features:**
- Component-based architecture
- Virtual DOM for performance
- Declarative syntax with JSX
- Large ecosystem

**Simple Example:**
\`\`\`jsx
function Hello({ name }) {
  return <h1>Hello, {name}!</h1>
}
\`\`\``, timestamp: new Date(Date.now() - 110000), status: 'delivered' },
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    const msg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: input,
      timestamp: new Date(),
      status: 'sending',
    }
    setMessages(prev => [...prev, msg])
    setInput('')
    setTimeout(() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'delivered' } : m)), 500)
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  return (
    <Card className="h-[600px] flex flex-col glass-card border-0">
      <CardHeader className="pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Simple Chat</CardTitle>
            <CardDescription>Basic conversation with 3-4 messages</CardDescription>
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
              <Avatar fallback={msg.role === 'assistant' ? 'AI' : 'U'} className={cn('w-8 h-8 shrink-0', msg.role === 'assistant' ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white' : 'bg-primary text-primary-foreground')} />
              <div className={cn('flex-1 space-y-2', msg.role === 'user' && 'flex flex-col items-end')}>
                <div className={cn('rounded-2xl px-4 py-3 max-w-[85%]', msg.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
                  <MarkdownRenderer content={msg.content} />
                </div>
                {msg.role === 'user' && msg.status && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {msg.status === 'sending' && <Loader2 className="h-3 w-3 animate-spin" />}
                    {msg.status === 'delivered' && <CheckCircle className="h-3 w-3 text-blue-500" />}
                    <span className="capitalize">{msg.status}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} />
          <Button onClick={handleSend} disabled={!input.trim()}><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </Card>
  )
}

// Demo 2: Code Execution
function CodeExecutionDemo() {
  const codeExample = `def fibonacci(n):
    """Calculate nth fibonacci number"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`

  const output = `F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13
F(8) = 21
F(9) = 34

Execution time: 0.003s`

  const [executing, setExecuting] = useState(false)

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Code Execution</CardTitle>
              <CardDescription>Run code with live output</CardDescription>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Executed</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between px-3 py-2 bg-slate-800 rounded-t-lg">
            <span className="text-sm text-gray-300">python</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-7 text-gray-400" onClick={() => navigator.clipboard.writeText(codeExample)}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-green-400" onClick={() => {setExecuting(true); setTimeout(() => setExecuting(false), 2000)}}>
                {executing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
          <CodeBlock language="python" showLineNumbers>{codeExample}</CodeBlock>
        </div>
        <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-400">Output:</span>
          </div>
          <pre className="text-sm text-green-400 font-mono whitespace-pre">{output}</pre>
        </div>
      </CardContent>
    </Card>
  )
}

// Demo 3: Tool Usage
function ToolUsageDemo() {
  const tools = [
    { id: 't1', name: 'get_weather', status: 'completed', input: { location: 'San Francisco' }, output: { temp: 62, condition: 'Partly Cloudy' }, duration: '0.8s' },
    { id: 't2', name: 'web_search', status: 'completed', input: { query: 'SF attractions' }, output: { results: 5 }, duration: '1.2s' },
    { id: 't3', name: 'get_location_info', status: 'completed', input: { city: 'San Francisco' }, output: { population: '874,961' }, duration: '0.5s' },
  ]

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Multiple Tool Usage</CardTitle>
            <CardDescription>AI using {tools.length} tools together</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tools.map(tool => (
          <div key={tool.id} className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span className="font-mono text-sm font-medium">{tool.name}</span>
              </div>
              <Badge className="bg-green-500/20 text-green-600 text-xs">{tool.duration}</Badge>
            </div>
            <div className="space-y-1 text-xs ml-6">
              <div><span className="text-muted-foreground">Input:</span> <code className="ml-2 px-2 py-0.5 bg-black/20 rounded text-purple-300">{JSON.stringify(tool.input)}</code></div>
              <div><span className="text-muted-foreground">Output:</span> <code className="ml-2 px-2 py-0.5 bg-black/20 rounded text-green-300">{JSON.stringify(tool.output)}</code></div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Demo 4: File Attachments
function FileAttachmentsDemo() {
  const files = [
    { id: 'f1', name: 'quarterly-report.pdf', type: 'PDF', size: '2.4 MB' },
    { id: 'f2', name: 'sales-data.xlsx', type: 'Excel', size: '1.8 MB' },
    { id: 'f3', name: 'presentation.pptx', type: 'PowerPoint', size: '5.2 MB' },
  ]

  const getIcon = (type: string) => {
    if (type === 'PDF') return <FileText className="h-5 w-5 text-red-500" />
    if (type === 'Excel') return <Database className="h-5 w-5 text-green-500" />
    return <Package className="h-5 w-5 text-orange-500" />
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Paperclip className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>File Attachments</CardTitle>
            <CardDescription>Upload and analyze documents</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {files.map(file => (
          <div key={file.id} className="flex items-center gap-3 p-3 bg-muted border border-white/10 rounded-lg hover:glass-subtle transition-all cursor-pointer">
            {getIcon(file.type)}
            <div className="flex-1">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{file.type} • {file.size}</p>
            </div>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Download className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button variant="outline" className="w-full gap-2 mt-2"><Paperclip className="h-4 w-4" />Attach More Files</Button>
      </CardContent>
    </Card>
  )
}

// Demo 5: Voice Input
function VoiceInputDemo() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')

  const startRecording = () => {
    setIsRecording(true)
    setTranscript('Listening...')
    setTimeout(() => {
      setTranscript('Tell me about the benefits of exercise')
      setIsRecording(false)
    }, 3000)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Voice Input</CardTitle>
            <CardDescription>Speak your messages</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isRecording && (
          <div className="flex items-center justify-center gap-3 p-4 bg-pink-500/10 border border-pink-500/20 rounded-lg">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Recording...</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 bg-pink-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        )}
        {transcript && !isRecording && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Transcribed:</p>
            <p className="text-sm font-medium mt-1">{transcript}</p>
          </div>
        )}
        <Button size="lg" className={cn('w-full gap-2', isRecording && 'bg-red-500 hover:bg-red-600')} onClick={isRecording ? () => setIsRecording(false) : startRecording}>
          {isRecording ? <><Square className="h-4 w-4" />Stop</> : <><Mic className="h-4 w-4" />Speak</>}
        </Button>
      </CardContent>
    </Card>
  )
}

// Demo 6: Thinking/Reasoning
function ThinkingDemo() {
  const [showThinking, setShowThinking] = useState(true)
  const steps = [
    'Breaking down the problem',
    'Initial amount: 3 apples',
    'Buying 2 bags × 5 apples = 10',
    'Total: 3 + 10 = 13 apples',
    'Giving away 4: 13 - 4 = 9',
    'Verifying: 3 + (2×5) - 4 = 9 ✓',
  ]

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Thinking & Reasoning</CardTitle>
              <CardDescription>Chain of thought visualization</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowThinking(!showThinking)}>
            {showThinking ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {showThinking && (
        <CardContent>
          <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-violet-600 mb-3">
              <Brain className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-semibold">Chain of Thought</span>
            </div>
            <div className="relative pl-6 space-y-2">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-violet-500/30" />
              {steps.map((step, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  <div className="absolute left-[-13px] w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-[10px] font-bold text-white">{i + 1}</div>
                  <p className="text-sm text-muted-foreground pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Demo 7: Citations
function CitationsDemo() {
  const citations = [
    { id: '1', title: 'Neuroscience of mindfulness meditation', url: 'nature.com/meditation', snippet: 'Study shows meditation increases gray matter density...' },
    { id: '2', title: 'Meditation and cardiovascular health', url: 'heart.org/meditation', snippet: 'Meta-analysis demonstrates significant BP reduction...' },
    { id: '3', title: 'MBSR outcomes', url: 'psychiatry.org/mbsr', snippet: '30% reduction in anxiety symptoms...' },
  ]

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Citations & Sources</CardTitle>
            <CardDescription>Research-backed with {citations.length} sources</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {citations.map((cite, i) => (
          <a key={cite.id} href={cite.url} className="flex gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg hover:bg-blue-500/10 transition-all group">
            <Badge variant="outline" className="shrink-0 h-6 w-6 p-0 flex items-center justify-center">{i + 1}</Badge>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="font-medium text-sm line-clamp-1 group-hover:text-blue-600">{cite.title}</p>
              <p className="text-xs text-blue-600 truncate">{cite.url}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{cite.snippet}</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </a>
        ))}
      </CardContent>
    </Card>
  )
}

// Demo 8: Error & Retry
function ErrorRetryDemo() {
  const [attemptCount, setAttemptCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleRetry = () => {
    setIsRetrying(true)
    setTimeout(() => {
      if (attemptCount < 2) {
        setAttemptCount(prev => prev + 1)
        setIsRetrying(false)
      } else {
        setSuccess(true)
        setIsRetrying(false)
      }
    }, 2000)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Error Handling & Retry</CardTitle>
            <CardDescription>Auto-retry with exponential backoff</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!success ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="font-semibold text-red-600">Connection Failed</p>
                <p className="text-sm text-muted-foreground">Network timeout after 30 seconds</p>
                {isRetrying && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                    <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
                    <span className="text-sm text-yellow-600">Retrying... (Attempt {attemptCount + 1}/3)</span>
                  </div>
                )}
                {!isRetrying && (
                  <Button size="sm" variant="outline" className="gap-2" onClick={handleRetry}>
                    <RotateCw className="h-4 w-4" />Retry
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="font-semibold text-green-600">Successfully recovered after {attemptCount} retries!</p>
            </div>
          </div>
        )}
        {attemptCount > 0 && !success && (
          <div className="p-3 bg-muted rounded-lg text-sm space-y-1 font-mono text-xs">
            {[...Array(attemptCount)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <X className="h-3 w-3 text-red-500" />
                Attempt {i + 1}: Failed ({(i + 1) * 2}s delay)
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Demo 9: Multi-Turn Conversation
function MultiTurnDemo() {
  const messages = [
    { role: 'user' as const, content: 'I want to build a todo app', time: '10:00 AM' },
    { role: 'assistant' as const, content: 'Great! What platform? (Web/Mobile/Desktop)', time: '10:00 AM' },
    { role: 'user' as const, content: 'Web app with React', time: '10:01 AM' },
    { role: 'assistant' as const, content: 'Perfect! Need authentication?', time: '10:01 AM' },
    { role: 'user' as const, content: 'Yes, with categories and due dates', time: '10:02 AM' },
    { role: 'assistant' as const, content: 'Here\'s your tech stack: React + TS, Firebase Auth, Firestore, Tailwind CSS', time: '10:02 AM' },
  ]

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Multi-Turn Conversation</CardTitle>
              <CardDescription>Context across {messages.length} exchanges</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex gap-2', msg.role === 'user' && 'flex-row-reverse')}>
                <Avatar fallback={msg.role === 'assistant' ? 'AI' : 'U'} className={cn('w-7 h-7', msg.role === 'assistant' ? 'bg-cyan-500 text-white' : 'bg-primary text-primary-foreground')} />
                <div className={cn('flex-1', msg.role === 'user' && 'flex flex-col items-end')}>
                  <div className={cn('rounded-lg px-3 py-2 text-sm max-w-[85%]', msg.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
                    {msg.content}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-3 p-2 bg-cyan-500/5 rounded-lg flex items-center gap-2 text-sm text-cyan-600">
          <Info className="h-4 w-4" />
          <span>AI remembers full conversation context</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Demo 10: Streaming
function StreamingDemo() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [text, setText] = useState('')

  const startStreaming = () => {
    const fullText = 'Streaming responses provide better UX by showing content as it generates. Users see immediate feedback, reducing perceived latency. Perfect for long responses!'
    setIsStreaming(true)
    setText('')
    let i = 0
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(prev => prev + fullText[i])
        i++
      } else {
        clearInterval(interval)
        setIsStreaming(false)
      }
    }, 30)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Streaming Responses</CardTitle>
              <CardDescription>Token-by-token generation</CardDescription>
            </div>
          </div>
          {isStreaming && <Badge className="bg-emerald-500/20 text-emerald-600 animate-pulse"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Streaming</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {text && (
          <div className="p-4 bg-muted rounded-lg min-h-[100px]">
            <p className="text-sm">{text}<span className="inline-block w-2 h-4 bg-emerald-500 animate-pulse ml-1 align-middle" /></p>
          </div>
        )}
        <Button onClick={startStreaming} disabled={isStreaming} className="w-full gap-2" size="lg">
          {isStreaming ? <><Loader2 className="h-4 w-4 animate-spin" />Streaming...</> : <><Play className="h-4 w-4" />Start Demo</>}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ChatPage() {
  return (
    <div className="space-y-12 relative">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-primary -top-40 -right-40 opacity-30" />
        <div className="orb-violet top-1/2 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="Chat Feature Demos"
        description="20 comprehensive interactive demos showing chat capabilities and edge cases"
        icon={MessageSquare}
        badge="20 Demos"
      />

      <Tabs defaultValue="simple" className="w-full">
        <TabsList className="mb-8 flex-wrap h-auto gap-2 p-2 glass-panel">
          <TabsTrigger value="simple">Simple</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="thinking">Thinking</TabsTrigger>
          <TabsTrigger value="citations">Citations</TabsTrigger>
          <TabsTrigger value="error">Error</TabsTrigger>
          <TabsTrigger value="multiturn">Multi-Turn</TabsTrigger>
          <TabsTrigger value="streaming">Streaming</TabsTrigger>
          <Separator className="my-2" />
          <TabsTrigger value="long-messages">Long Text</TabsTrigger>
          <TabsTrigger value="rate-limit">Rate Limit</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="offline">Offline</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="tool-failures">Tool Failures</TabsTrigger>
          <TabsTrigger value="concurrent">Concurrent</TabsTrigger>
          <TabsTrigger value="edit-history">Edit History</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
        </TabsList>

        <TabsContent value="simple"><ComponentSection title="Demo 1: Simple Conversation" description="Basic 3-4 message chat" icon={MessageSquare}><SimpleChatDemo /></ComponentSection></TabsContent>
        <TabsContent value="code"><ComponentSection title="Demo 2: Code Execution" description="Run Python with output" icon={Terminal}><CodeExecutionDemo /></ComponentSection></TabsContent>
        <TabsContent value="tools"><ComponentSection title="Demo 3: Multiple Tools" description="Using 3 tools together" icon={Wrench}><ToolUsageDemo /></ComponentSection></TabsContent>
        <TabsContent value="files"><ComponentSection title="Demo 4: File Attachments" description="Upload PDF, Excel, PowerPoint" icon={Paperclip}><FileAttachmentsDemo /></ComponentSection></TabsContent>
        <TabsContent value="voice"><ComponentSection title="Demo 5: Voice Input" description="Speak your messages" icon={Mic}><VoiceInputDemo /></ComponentSection></TabsContent>
        <TabsContent value="thinking"><ComponentSection title="Demo 6: Thinking Display" description="Chain of thought reasoning" icon={Brain}><ThinkingDemo /></ComponentSection></TabsContent>
        <TabsContent value="citations"><ComponentSection title="Demo 7: Citations" description="Research sources" icon={FileText}><CitationsDemo /></ComponentSection></TabsContent>
        <TabsContent value="error"><ComponentSection title="Demo 8: Error & Retry" description="Auto-retry with backoff" icon={AlertTriangle}><ErrorRetryDemo /></ComponentSection></TabsContent>
        <TabsContent value="multiturn"><ComponentSection title="Demo 9: Multi-Turn" description="Context-aware dialogue" icon={MessageSquare}><MultiTurnDemo /></ComponentSection></TabsContent>
        <TabsContent value="streaming"><ComponentSection title="Demo 10: Streaming" description="Real-time generation" icon={Zap}><StreamingDemo /></ComponentSection></TabsContent>

        <TabsContent value="long-messages"><ComponentSection title="Edge Case 1: Very Long Messages" description="Truncation with expand/collapse" icon={FileText}><VeryLongMessageDemo /></ComponentSection></TabsContent>
        <TabsContent value="rate-limit"><ComponentSection title="Edge Case 2: Rate Limiting" description="Throttling with cooldown" icon={Clock}><EdgeCaseRateLimitingDemo /></ComponentSection></TabsContent>
        <TabsContent value="network"><ComponentSection title="Edge Case 3: Network Errors" description="Auto-reconnection logic" icon={Globe}><NetworkErrorDemo /></ComponentSection></TabsContent>
        <TabsContent value="offline"><ComponentSection title="Edge Case 4: Offline Mode" description="Queue and sync messages" icon={AlertCircle}><OfflineModeDemo /></ComponentSection></TabsContent>
        <TabsContent value="memory"><ComponentSection title="Memory Management System" description="Memory strategies, context tracking, and retrieval examples" icon={Database}><MemoryManagementDemo /></ComponentSection></TabsContent>
        <TabsContent value="tokens"><ComponentSection title="Edge Case 6: Token Warnings" description="Progressive limit alerts" icon={AlertTriangle}><TokenLimitWarningDemo /></ComponentSection></TabsContent>
        <TabsContent value="tool-failures"><ComponentSection title="Edge Case 7: Tool Failures" description="Graceful error handling" icon={Wrench}><ToolExecutionFailureDemo /></ComponentSection></TabsContent>
        <TabsContent value="concurrent"><ComponentSection title="Edge Case 8: Concurrent Streams" description="Multiple simultaneous responses" icon={Zap}><ConcurrentStreamDemo /></ComponentSection></TabsContent>
        <TabsContent value="edit-history"><ComponentSection title="Edge Case 9: Edit History" description="Version tracking" icon={Clock}><MessageEditHistoryDemo /></ComponentSection></TabsContent>
        <TabsContent value="branches"><ComponentSection title="Edge Case 10: Branch Visualization" description="Alternative conversation paths" icon={Brain}><BranchVisualizationDemo /></ComponentSection></TabsContent>
      </Tabs>
    </div>
  )
}

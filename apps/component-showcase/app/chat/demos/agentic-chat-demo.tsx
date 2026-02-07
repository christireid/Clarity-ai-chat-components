'use client'

import { useState, useRef } from 'react'
import type { ChatMessage, ToolExecution, ThinkingStep } from '../types'
import { MarkdownRenderer, useAutoScroll } from '@clarity-chat/react'
import { useSafeInterval, useSafeTimeout } from '@clarity-chat/react/internal'
import { StreamingCursor, AI_AVATAR_CLASSES } from '@/lib/demo-utils'
import {
  Card,
  Button,
  Badge,
  Input,
  ScrollArea,
  Avatar,
  Kbd,
  cn,
} from '@clarity-chat/primitives'
import {
  Send,
  Paperclip,
  Mic,
  Settings,
  Brain,
  Code,
  CheckCircle,
  Loader2,
  X,
} from 'lucide-react'
import { AgenticSidebar } from './agentic-sidebar'
import { AgenticMessageBubble } from './agentic-message-bubble'

let demoIdCounter = 0
function nextDemoId(prefix = 'msg') {
  return `${prefix}-${Date.now()}-${++demoIdCounter}`
}

export function AdvancedAgenticChatDemo() {
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
  const { scrollRef } = useAutoScroll({
    dependencies: [messages, streamingText, thinkingSteps],
  })
  const { setSafeInterval, clearAllIntervals } = useSafeInterval()
  const { setSafeTimeout } = useSafeTimeout()
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const simulateToolExecution = async (toolName: string) => {
    const toolId = nextDemoId()
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
          id: nextDemoId(),
          content: step,
          timestamp: new Date(),
        },
      ])
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage: ChatMessage = {
      id: nextDemoId(),
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
    setSafeTimeout(() => {
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

    // Check if user asked for tool usage and track which tools were used
    const lowerInput = input.toLowerCase()
    const usedToolNames: string[] = []
    if (lowerInput.includes('search') || lowerInput.includes('find')) {
      await simulateToolExecution('web_search')
      usedToolNames.push('web_search')
    }
    if (
      lowerInput.includes('code') ||
      lowerInput.includes('run') ||
      lowerInput.includes('execute')
    ) {
      await simulateToolExecution('code_interpreter')
      usedToolNames.push('code_interpreter')
    }
    if (
      lowerInput.includes('file') ||
      lowerInput.includes('read') ||
      lowerInput.includes('analyze')
    ) {
      await simulateToolExecution('file_reader')
      usedToolNames.push('file_reader')
    }

    // Build response using local variable to avoid stale closure over activeTools state
    const toolSuffix =
      usedToolNames.length > 0 ? ` using ${usedToolNames.join(', ')}` : ''
    const response = `Based on my analysis${toolSuffix}, here's what I found:

The requested task has been completed successfully. I've processed the information and here are the key findings:

1. **Primary Result**: The main objective was achieved with high confidence
2. **Supporting Data**: Additional context was gathered from multiple sources
3. **Recommendations**: Based on the analysis, I suggest the following next steps

Would you like me to elaborate on any of these points or perform additional analysis?`

    let index = 0
    intervalIdRef.current = setSafeInterval(() => {
      if (index < response.length) {
        setStreamingText((prev) => prev + response[index])
        index++
      } else {
        clearAllIntervals()
        intervalIdRef.current = null
        setIsStreaming(false)
        setMessages((prev) => [
          ...prev,
          {
            id: nextDemoId(),
            role: 'assistant',
            content: response,
            timestamp: new Date(),
            // Use functional state access to get current values
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Chat */}
      <Card className="lg:col-span-2 h-[700px] flex flex-col overflow-hidden glass-card border-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shadow-lg',
                AI_AVATAR_CLASSES
              )}
            >
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
                  width: `${Math.min(100, (tokenUsage.total / tokenUsage.budget) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((msg) => (
              <AgenticMessageBubble key={msg.id} msg={msg} />
            ))}

            {/* Streaming Response */}
            {isStreaming && (
              <div className="flex gap-3">
                <Avatar
                  fallback="AI"
                  className={cn(
                    'w-8 h-8 shrink-0 text-white',
                    AI_AVATAR_CLASSES
                  )}
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
                      <StreamingCursor height="h-4" />
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
      <AgenticSidebar tokenUsage={tokenUsage} />
    </div>
  )
}

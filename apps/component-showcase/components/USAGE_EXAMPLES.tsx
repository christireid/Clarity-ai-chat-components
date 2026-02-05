/**
 * USAGE EXAMPLES FOR GLASSMORPHISM COMPONENTS
 *
 * This file contains practical examples of how to use the glassmorphism
 * component molecules in real-world scenarios.
 */

import { useState } from 'react'
import {
  GlassMessageBubble,
  GlassToolCard,
  GlassStatusBadge,
  GlassActionButton,
  GlassPanel,
  GlassInputContainer,
  GlassCard,
  GlassDivider,
  GlassIconContainer,
} from './glass-molecules'
import { Avatar, Input, ScrollArea } from '@clarity-chat/primitives'
import {
  Brain,
  Send,
  Paperclip,
  Mic,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Globe,
  Terminal,
  FileText,
  CheckCircle,
  Loader2,
  Settings,
  Zap,
} from 'lucide-react'

// ============================================================================
// EXAMPLE 1: Complete Chat Interface
// ============================================================================
export function CompleteChatInterface() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [activeTools, setActiveTools] = useState<any[]>([])

  const handleSend = () => {
    if (!input.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user' as const,
        content: input,
        timestamp: new Date(),
      },
    ])
    setInput('')
  }

  return (
    <GlassPanel
      variant="default"
      padding="none"
      shadow="lg"
      className="h-[600px] flex flex-col"
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <GlassIconContainer icon={Brain} variant="primary" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">AI Assistant</h3>
              <GlassStatusBadge variant="success" size="sm" pulse>
                Online
              </GlassStatusBadge>
            </div>
            <p className="text-xs text-muted-foreground">
              Claude 3.5 Sonnet
            </p>
          </div>
        </div>
        <GlassActionButton variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </GlassActionButton>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((msg) => (
            <GlassMessageBubble
              key={msg.id}
              variant={msg.role}
              avatar={
                <Avatar
                  fallback={msg.role === 'assistant' ? 'AI' : 'U'}
                  className={
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                      : 'bg-primary text-primary-foreground'
                  }
                />
              }
              timestamp={
                <span className="text-muted-foreground">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              }
              actions={
                msg.role === 'assistant' && (
                  <>
                    <GlassActionButton variant="ghost" size="sm">
                      <Copy className="h-3.5 w-3.5" />
                    </GlassActionButton>
                    <GlassActionButton variant="ghost" size="sm">
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </GlassActionButton>
                    <GlassActionButton variant="ghost" size="sm">
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </GlassActionButton>
                    <GlassActionButton variant="ghost" size="sm">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </GlassActionButton>
                  </>
                )
              }
            >
              <p className="text-sm">{msg.content}</p>
            </GlassMessageBubble>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <GlassInputContainer
          actions={
            <>
              <GlassActionButton variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </GlassActionButton>
              <GlassActionButton variant="ghost" size="sm">
                <Mic className="h-4 w-4" />
              </GlassActionButton>
              <GlassActionButton size="sm" icon={Send} onClick={handleSend}>
                Send
              </GlassActionButton>
            </>
          }
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Type a message..."
            className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0"
          />
        </GlassInputContainer>
      </div>
    </GlassPanel>
  )
}

// ============================================================================
// EXAMPLE 2: Tool Execution Panel
// ============================================================================
export function ToolExecutionPanel() {
  const tools = [
    {
      id: '1',
      name: 'web_search',
      icon: Globe,
      description: 'Search the web',
      status: 'completed' as const,
      duration: '1.2s',
    },
    {
      id: '2',
      name: 'code_interpreter',
      icon: Terminal,
      description: 'Execute code',
      status: 'running' as const,
      duration: '0.8s',
    },
    {
      id: '3',
      name: 'file_reader',
      icon: FileText,
      description: 'Read files',
      status: 'idle' as const,
    },
  ]

  return (
    <GlassCard
      variant="default"
      shadow="md"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GlassIconContainer icon={Zap} variant="primary" size="sm" />
            <h3 className="font-semibold">Active Tools</h3>
          </div>
          <GlassStatusBadge variant="info" size="sm">
            {tools.filter((t) => t.status === 'running').length} running
          </GlassStatusBadge>
        </div>
      }
    >
      <div className="space-y-2">
        {tools.map((tool) => (
          <GlassToolCard
            key={tool.id}
            icon={tool.icon}
            title={tool.name}
            description={tool.description}
            status={tool.status}
            duration={tool.duration}
            badge={
              tool.status === 'completed' ? (
                <GlassStatusBadge variant="success" size="sm">
                  Done
                </GlassStatusBadge>
              ) : tool.status === 'running' ? (
                <GlassStatusBadge variant="warning" size="sm" pulse>
                  Running
                </GlassStatusBadge>
              ) : (
                <GlassStatusBadge variant="default" size="sm">
                  Ready
                </GlassStatusBadge>
              )
            }
          />
        ))}
      </div>
    </GlassCard>
  )
}

// ============================================================================
// EXAMPLE 3: Status Dashboard
// ============================================================================
export function StatusDashboard() {
  const stats = [
    {
      label: 'Messages',
      value: '1,234',
      change: '+12%',
      trend: 'up' as const,
      status: 'success' as const,
    },
    {
      label: 'Active Users',
      value: '456',
      change: '+5%',
      trend: 'up' as const,
      status: 'info' as const,
    },
    {
      label: 'Response Time',
      value: '234ms',
      change: '-8%',
      trend: 'down' as const,
      status: 'warning' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <GlassPanel
          key={stat.label}
          variant="default"
          shadow="md"
          className="relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <GlassStatusBadge variant={stat.status} size="sm">
              {stat.change}
            </GlassStatusBadge>
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
        </GlassPanel>
      ))}
    </div>
  )
}

// ============================================================================
// EXAMPLE 4: Settings Panel
// ============================================================================
export function SettingsPanel() {
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: false,
    autoSave: true,
  })

  return (
    <GlassCard
      header={
        <div className="flex items-center gap-2">
          <GlassIconContainer icon={Settings} variant="primary" size="sm" />
          <h3 className="font-semibold">Settings</h3>
        </div>
      }
      footer={
        <div className="flex justify-end gap-2">
          <GlassActionButton variant="ghost">Cancel</GlassActionButton>
          <GlassActionButton variant="strong" icon={CheckCircle}>
            Save Changes
          </GlassActionButton>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Notifications</p>
            <p className="text-xs text-muted-foreground">
              Receive desktop notifications
            </p>
          </div>
          <GlassStatusBadge variant={settings.notifications ? 'success' : 'default'}>
            {settings.notifications ? 'On' : 'Off'}
          </GlassStatusBadge>
        </div>

        <GlassDivider />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Sound Effects</p>
            <p className="text-xs text-muted-foreground">
              Play sound on message
            </p>
          </div>
          <GlassStatusBadge variant={settings.soundEffects ? 'success' : 'default'}>
            {settings.soundEffects ? 'On' : 'Off'}
          </GlassStatusBadge>
        </div>

        <GlassDivider />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Auto Save</p>
            <p className="text-xs text-muted-foreground">
              Automatically save drafts
            </p>
          </div>
          <GlassStatusBadge variant={settings.autoSave ? 'success' : 'default'}>
            {settings.autoSave ? 'On' : 'Off'}
          </GlassStatusBadge>
        </div>
      </div>
    </GlassCard>
  )
}

// ============================================================================
// EXAMPLE 5: Message with Tools
// ============================================================================
export function MessageWithTools() {
  return (
    <GlassMessageBubble
      variant="assistant"
      avatar={
        <Avatar
          fallback="AI"
          className="bg-gradient-to-br from-violet-500 to-purple-600 text-white"
        />
      }
      timestamp={<span className="text-muted-foreground">2:30 PM</span>}
      actions={
        <>
          <GlassActionButton variant="ghost" size="sm">
            <Copy className="h-3.5 w-3.5" />
          </GlassActionButton>
          <GlassActionButton variant="ghost" size="sm">
            <ThumbsUp className="h-3.5 w-3.5" />
          </GlassActionButton>
        </>
      }
    >
      <p className="text-sm mb-3">
        I've searched the web and found the information you requested.
      </p>

      {/* Tool Cards */}
      <div className="space-y-2 max-w-[85%]">
        <p className="text-xs text-muted-foreground font-medium">Tools Used</p>
        <GlassToolCard
          icon={Globe}
          title="web_search"
          description="Searched for latest documentation"
          status="completed"
          duration="1.2s"
          badge={
            <GlassStatusBadge variant="success" size="sm">
              Done
            </GlassStatusBadge>
          }
        />
        <GlassToolCard
          icon={Terminal}
          title="code_interpreter"
          description="Analyzed code samples"
          status="completed"
          duration="0.8s"
          badge={
            <GlassStatusBadge variant="success" size="sm">
              Done
            </GlassStatusBadge>
          }
        />
      </div>
    </GlassMessageBubble>
  )
}

// ============================================================================
// EXAMPLE 6: Multi-Variant Button Group
// ============================================================================
export function ButtonGroupExample() {
  return (
    <GlassPanel variant="subtle" className="inline-flex gap-2">
      <GlassActionButton variant="ghost" size="sm" icon={Copy}>
        Copy
      </GlassActionButton>
      <GlassActionButton variant="ghost" size="sm" icon={RefreshCw}>
        Refresh
      </GlassActionButton>
      <GlassActionButton variant="strong" size="sm" icon={Send} glow>
        Send
      </GlassActionButton>
    </GlassPanel>
  )
}

// ============================================================================
// EXAMPLE 7: Loading State
// ============================================================================
export function LoadingStateExample() {
  return (
    <GlassPanel variant="default">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <GlassStatusBadge variant="info" pulse icon={Loader2}>
            Processing
          </GlassStatusBadge>
          <span className="text-sm text-muted-foreground">
            Analyzing your request...
          </span>
        </div>

        <GlassToolCard
          icon={Brain}
          title="reasoning_engine"
          description="Thinking through the problem"
          status="running"
          duration="1.5s"
          badge={
            <GlassStatusBadge variant="warning" size="sm" pulse>
              Running
            </GlassStatusBadge>
          }
        />
      </div>
    </GlassPanel>
  )
}

// ============================================================================
// EXAMPLE 8: Nested Panels
// ============================================================================
export function NestedPanelsExample() {
  return (
    <GlassPanel variant="default" shadow="lg">
      <h3 className="font-semibold mb-4">Conversation History</h3>

      <div className="space-y-3">
        <GlassPanel variant="subtle" padding="sm" className="cursor-pointer hover:glass transition-all">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Today's Conversation</p>
            <GlassStatusBadge variant="success" size="sm">
              Active
            </GlassStatusBadge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last message 2 minutes ago
          </p>
        </GlassPanel>

        <GlassPanel variant="subtle" padding="sm" className="cursor-pointer hover:glass transition-all">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Yesterday</p>
            <GlassStatusBadge variant="default" size="sm">
              Archived
            </GlassStatusBadge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            15 messages
          </p>
        </GlassPanel>
      </div>
    </GlassPanel>
  )
}

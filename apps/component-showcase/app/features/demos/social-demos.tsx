'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
  Checkbox,
  cn,
} from '@clarity-chat/primitives'
import {
  Bookmark,
  X,
  Plus,
  MessageSquare,
  RefreshCw,
  Share,
  MoreHorizontal,
  CheckCircle,
  Check,
  Play,
  Brain,
  GitBranch,
  XCircle,
  Bot,
  Copy,
  Download,
  Trash2,
  Search,
} from 'lucide-react'

// ============================================================================
// PINNED MESSAGES
// ============================================================================
export function PinnedMessagesDemo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Pinned Messages</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            {
              content: 'API documentation for the new endpoints',
              author: 'AI',
              time: '2h ago',
            },
            {
              content: 'Important: Security update required by Friday',
              author: 'You',
              time: '1d ago',
            },
          ].map((msg, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg"
            >
              <Bookmark className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {msg.author} · {msg.time}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// REACTIONS
// ============================================================================
export function ReactionsDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Message Reactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm mb-3">
            This is a message that users can react to.
          </p>
          <div className="flex items-center gap-2">
            {[
              { emoji: '👍', count: 5 },
              { emoji: '❤️', count: 3 },
              { emoji: '🎉', count: 2 },
              { emoji: '😄', count: 1 },
            ].map((reaction, i) => (
              <button
                key={i}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-sm"
              >
                <span>{reaction.emoji}</span>
                <span className="text-xs text-muted-foreground">
                  {reaction.count}
                </span>
              </button>
            ))}
            <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted text-muted-foreground">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// QUICK REPLY
// ============================================================================
export function QuickReplyDemo() {
  const replies = [
    'Got it, thanks!',
    'Can you explain more?',
    'Let me check and get back to you',
    'Perfect!',
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Replies</CardTitle>
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
// SOCIAL POSTS
// ============================================================================
export function SocialPostsDemo() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">AI Assistant</span>
              <span className="text-xs text-muted-foreground">
                @ai_assistant · 2h
              </span>
            </div>
            <p className="text-sm mt-1">
              Just launched our new chat components library! 🚀 Check out the
              150+ components for building AI interfaces.
            </p>
            <div className="flex items-center gap-6 mt-3 text-muted-foreground">
              <button className="flex items-center gap-1 text-xs hover:text-primary">
                <MessageSquare className="h-4 w-4" />
                24
              </button>
              <button className="flex items-center gap-1 text-xs hover:text-green-500">
                <RefreshCw className="h-4 w-4" />
                12
              </button>
              <button className="flex items-center gap-1 text-xs hover:text-red-500">
                ❤️ 128
              </button>
              <button className="flex items-center gap-1 text-xs hover:text-primary">
                <Share className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SORTABLE LIST
// ============================================================================
export function SortableListDemo() {
  const items = ['First item', 'Second item', 'Third item', 'Fourth item']

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Sortable List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg bg-card cursor-move hover:border-primary/50"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground rotate-90" />
              <span className="text-sm flex-1">{item}</span>
              <Badge variant="outline">{i + 1}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TABLE OF CONTENTS
// ============================================================================
export function TableOfContentsDemo() {
  const sections = [
    { title: 'Getting Started', level: 1, active: false },
    { title: 'Installation', level: 2, active: false },
    { title: 'Quick Start', level: 2, active: true },
    { title: 'Components', level: 1, active: false },
    { title: 'Chat Input', level: 2, active: false },
    { title: 'Message List', level: 2, active: false },
    { title: 'API Reference', level: 1, active: false },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Table of Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="space-y-1">
          {sections.map((section, i) => (
            <a
              key={i}
              href="#"
              className={cn(
                'block text-sm py-1 transition-colors',
                section.level === 1 ? 'font-medium' : 'ml-4',
                section.active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TRACE VIEW
// ============================================================================
export function TraceViewDemo() {
  const traces = [
    {
      name: 'HTTP Request',
      duration: '245ms',
      status: 'success',
      children: [
        { name: 'Parse Body', duration: '12ms', status: 'success' },
        { name: 'Validate Token', duration: '34ms', status: 'success' },
        { name: 'Process Request', duration: '189ms', status: 'success' },
      ],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trace View</CardTitle>
        <CardDescription>Request execution timeline</CardDescription>
      </CardHeader>
      <CardContent>
        {traces.map((trace, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium flex-1">{trace.name}</span>
              <span className="text-xs text-muted-foreground">
                {trace.duration}
              </span>
            </div>
            <div className="ml-4 space-y-1">
              {trace.children?.map((child, j) => (
                <div key={j} className="flex items-center gap-3 p-2 rounded-lg">
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-sm flex-1">{child.name}</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${parseInt(child.duration, 10) / 2.5}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {child.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// WEB SEARCH COMPONENT
// ============================================================================
export function WebSearchDemo() {
  const results = [
    {
      title: 'React Documentation',
      url: 'react.dev',
      snippet: 'The library for web and native user interfaces...',
    },
    {
      title: 'React Hooks Guide',
      url: 'react.dev/hooks',
      snippet: 'Hooks let you use state and other React features...',
    },
    {
      title: 'Next.js Documentation',
      url: 'nextjs.org',
      snippet: 'The React Framework for the Web...',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Web Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input placeholder="Search the web..." className="flex-1" />
          <Button className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
        <div className="space-y-4">
          {results.map((result, i) => (
            <div key={i} className="group cursor-pointer">
              <p className="text-xs text-muted-foreground">{result.url}</p>
              <p className="text-sm font-medium text-primary group-hover:underline">
                {result.title}
              </p>
              <p className="text-sm text-muted-foreground">{result.snippet}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// WORKFLOW NODES
// ============================================================================
export function WorkflowNodesDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Workflow Nodes</CardTitle>
        <CardDescription>Visual node-based workflow builder</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 bg-muted/30 rounded-lg p-4 overflow-hidden">
          {/* Start Node */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-24 p-2 bg-green-500/20 border border-green-500/50 rounded-lg text-center">
            <Play className="h-4 w-4 text-green-500 mx-auto mb-1" />
            <span className="text-xs font-medium">Start</span>
          </div>
          {/* Line */}
          <div className="absolute left-28 top-1/2 w-12 h-0.5 bg-muted-foreground/30" />
          {/* Process Node */}
          <div className="absolute left-40 top-1/2 -translate-y-1/2 w-28 p-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-center">
            <Brain className="h-4 w-4 text-blue-500 mx-auto mb-1" />
            <span className="text-xs font-medium">AI Process</span>
          </div>
          {/* Line */}
          <div className="absolute left-[17rem] top-1/2 w-12 h-0.5 bg-muted-foreground/30" />
          {/* Branch */}
          <div className="absolute left-[19.5rem] top-1/2 -translate-y-1/2 w-24 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-center">
            <GitBranch className="h-4 w-4 text-yellow-500 mx-auto mb-1" />
            <span className="text-xs font-medium">Branch</span>
          </div>
          {/* End nodes */}
          <div className="absolute right-4 top-8 w-24 p-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-center">
            <CheckCircle className="h-4 w-4 text-purple-500 mx-auto mb-1" />
            <span className="text-xs font-medium">Success</span>
          </div>
          <div className="absolute right-4 bottom-8 w-24 p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
            <XCircle className="h-4 w-4 text-red-500 mx-auto mb-1" />
            <span className="text-xs font-medium">Error</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// BRANCH PICKER
// ============================================================================
export function BranchPickerDemo() {
  const branches = [
    { name: 'main', current: true, commits: 234 },
    { name: 'develop', current: false, commits: 156 },
    { name: 'feature/chat-ui', current: false, commits: 12 },
    { name: 'fix/token-count', current: false, commits: 3 },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Branch Picker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {branches.map((branch, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                branch.current
                  ? 'bg-primary/10 border border-primary/50'
                  : 'hover:bg-muted'
              )}
            >
              <GitBranch
                className={cn(
                  'h-4 w-4',
                  branch.current ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-sm flex-1 font-mono',
                  branch.current && 'font-medium'
                )}
              >
                {branch.name}
              </span>
              {branch.current && <Badge className="bg-primary">Current</Badge>}
              <span className="text-xs text-muted-foreground">
                {branch.commits} commits
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CHAT SIDEBAR
// ============================================================================
export function ChatSidebarDemo() {
  const conversations = [
    {
      title: 'React Hooks Help',
      preview: 'Can you explain useEffect...',
      time: '2m',
      unread: 2,
    },
    {
      title: 'API Design',
      preview: 'The endpoints should be...',
      time: '1h',
      unread: 0,
    },
    {
      title: 'Code Review',
      preview: 'Looks good overall, but...',
      time: '3h',
      unread: 0,
    },
    {
      title: 'Bug Investigation',
      preview: 'Found the issue in...',
      time: '1d',
      unread: 0,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Conversations</CardTitle>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {conversations.map((conv, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50',
                i === 0 && 'bg-muted/50'
              )}
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{conv.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {conv.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {conv.preview}
                </p>
              </div>
              {conv.unread > 0 && (
                <Badge className="bg-primary shrink-0">{conv.unread}</Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// COPY BUTTON
// ============================================================================
export function CopyButtonDemo() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Copy Button</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <code className="text-sm flex-1 font-mono">
              npm install @clarity-chat/react
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy as Markdown
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CONVERSATION MANAGER
// ============================================================================
export function ConversationManagerDemo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Conversation Manager</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            {
              title: 'Project Planning',
              messages: 24,
              tokens: '12.4k',
              date: 'Today',
            },
            {
              title: 'Code Review Session',
              messages: 56,
              tokens: '28.1k',
              date: 'Yesterday',
            },
            {
              title: 'Debug Session',
              messages: 18,
              tokens: '8.2k',
              date: '3 days ago',
            },
          ].map((conv, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <Checkbox />
              <div className="flex-1">
                <p className="text-sm font-medium">{conv.title}</p>
                <p className="text-xs text-muted-foreground">
                  {conv.messages} messages · {conv.tokens} tokens · {conv.date}
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

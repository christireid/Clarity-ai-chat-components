'use client'

import { useState, useRef, useEffect } from 'react'
import { PageHeader } from '@/components/component-section'
import { ChatInput, CodeBlock, MarkdownRenderer } from '@clarity-chat/react'
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
  Layers,
  Terminal,
  Heart,
  X,
  Loader2,
  Brain,
  Wand2,
  Palette,
  Layout,
  Package,
  Database,
  Users,
  Clock,
  Edit3,
  Trash2,
  AlertCircle,
  Menu,
  PanelLeftClose,
  PanelLeft,
  RotateCcw,
  Pen,
  History,
  Folder,
  File,
  Monitor,
  Smartphone,
  Tablet,
  Link,
  GitBranch,
  Cpu,
  Network,
  Workflow,
  ListTodo,
  CheckCheck,
  Timer,
  Activity,
  TrendingUp,
  Eye,
  Download,
} from 'lucide-react'

// ============================================================================
// CLAUDE CLONE - Authentic claude.ai interface
// ============================================================================
function ClaudeClone() {
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm Claude, an AI assistant created by Anthropic to be helpful, harmless, and honest. How can I help you today?`,
    },
  ])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I understand you're asking about that. Let me provide a thoughtful and detailed response that considers multiple perspectives while being direct and helpful.",
        },
      ])
    }, 1000)
  }

  return (
    <div className="flex h-[700px] bg-[#2b2a27] rounded-xl overflow-hidden border border-[#3d3c38]">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-[260px] bg-[#2b2a27] flex flex-col border-r border-[#3d3c38]">
          {/* Logo & New Chat */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#da7756] flex items-center justify-center">
                <span className="text-white font-semibold text-xs">C</span>
              </div>
              <span className="text-[#d4d3cf] font-medium text-sm">Claude</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#8b8984] hover:text-[#d4d3cf] hover:bg-[#3d3c38]"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1 px-2">
            <div className="py-2">
              <p className="text-xs text-[#8b8984] px-3 py-1.5 font-medium">
                Today
              </p>
              {[
                'React component optimization',
                'API design patterns',
                'TypeScript best practices',
              ].map((chat, i) => (
                <button
                  key={i}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm text-[#d4d3cf] hover:bg-[#3d3c38] truncate group flex items-center justify-between',
                    i === 0 && 'bg-[#3d3c38]'
                  )}
                >
                  <span className="truncate">{chat}</span>
                  <MoreHorizontal className="h-4 w-4 text-[#8b8984] opacity-0 group-hover:opacity-100" />
                </button>
              ))}

              <p className="text-xs text-[#8b8984] px-3 py-1.5 font-medium mt-4">
                Yesterday
              </p>
              {['Python debugging session', 'Database schema review'].map(
                (chat, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#d4d3cf] hover:bg-[#3d3c38] truncate"
                  >
                    {chat}
                  </button>
                )
              )}
            </div>
          </ScrollArea>

          {/* User Section */}
          <div className="p-3 border-t border-[#3d3c38]">
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-[#3d3c38] cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#d4d3cf] truncate">User</p>
                <p className="text-xs text-[#8b8984]">Pro Plan</p>
              </div>
              <ChevronRight className="h-4 w-4 text-[#8b8984]" />
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#343330]">
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-[#3d3c38]">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 text-[#8b8984] hover:text-[#d4d3cf] hover:bg-[#3d3c38]"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
            <button className="flex items-center gap-1.5 text-[#d4d3cf] hover:bg-[#3d3c38] px-2 py-1 rounded-md">
              <span className="text-sm font-medium">Claude 3.5 Sonnet</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#8b8984]" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#8b8984] hover:text-[#d4d3cf] hover:bg-[#3d3c38]"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="max-w-[48rem] mx-auto py-6 px-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'mb-6',
                  msg.role === 'user' && 'flex justify-end'
                )}
              >
                {msg.role === 'assistant' ? (
                  <div className="flex gap-4">
                    <div className="w-7 h-7 rounded-md bg-[#da7756] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white font-semibold text-xs">
                        C
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[#ececea] leading-relaxed text-[15px]">
                        {msg.content}
                      </p>
                      <div className="flex items-center gap-1 mt-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-[#8b8984] hover:text-[#d4d3cf] hover:bg-[#3d3c38]"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-[#8b8984] hover:text-[#d4d3cf] hover:bg-[#3d3c38]"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-[#8b8984] hover:text-[#d4d3cf] hover:bg-[#3d3c38]"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-[#8b8984] hover:text-[#d4d3cf] hover:bg-[#3d3c38]"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#403f3b] rounded-2xl px-4 py-3 max-w-[80%]">
                    <p className="text-[#ececea] text-[15px]">{msg.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4">
          <div className="max-w-[48rem] mx-auto">
            <div className="bg-[#403f3b] rounded-2xl border border-[#4a4944]">
              <div className="flex items-end p-2">
                <div className="flex items-center gap-1 px-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#8b8984] hover:text-[#d4d3cf] hover:bg-[#4a4944]"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Reply to Claude..."
                  rows={1}
                  className="flex-1 bg-transparent border-0 text-[#ececea] placeholder:text-[#8b8984] focus:outline-none resize-none py-2 px-2 text-[15px] min-h-[40px] max-h-[200px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  disabled={!input.trim()}
                  className="h-8 w-8 bg-[#da7756] hover:bg-[#c56a4d] disabled:opacity-40 disabled:bg-[#4a4944] rounded-lg"
                >
                  <ArrowUp className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-[#8b8984] text-center mt-2">
              Claude can make mistakes. Please double-check responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CHATGPT CLONE - Authentic chat.openai.com interface
// ============================================================================
function ChatGPTClone() {
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! How can I help you today?`,
    },
  ])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "That's a great question! Let me break this down into manageable parts and provide you with a comprehensive answer.",
        },
      ])
    }, 1000)
  }

  return (
    <div className="flex h-[700px] bg-[#212121] rounded-xl overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-[260px] bg-[#171717] flex flex-col">
          {/* New Chat */}
          <div className="p-2">
            <button className="w-full flex items-center gap-2 p-3 rounded-lg text-[#ececec] hover:bg-[#212121] transition-colors text-sm">
              <div className="w-6 h-6 rounded-full border border-[#4e4e4e] flex items-center justify-center">
                <Plus className="h-4 w-4" />
              </div>
              <span>New chat</span>
            </button>
          </div>

          {/* Search */}
          <div className="px-2 mb-1">
            <button className="w-full flex items-center gap-2 p-2 rounded-lg text-[#8e8e8e] hover:bg-[#212121] transition-colors text-sm">
              <Search className="h-4 w-4" />
              <span>Search chats</span>
            </button>
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1 px-2">
            <p className="text-xs text-[#8e8e8e] px-2 py-2">Today</p>
            {[
              'Building a React application',
              'SQL optimization techniques',
              'Code review best practices',
            ].map((chat, i) => (
              <button
                key={i}
                className={cn(
                  'w-full text-left p-2 rounded-lg text-sm text-[#ececec] hover:bg-[#212121] truncate group flex items-center gap-2',
                  i === 0 && 'bg-[#212121]'
                )}
              >
                <MessageSquare className="h-4 w-4 text-[#8e8e8e] shrink-0" />
                <span className="truncate">{chat}</span>
              </button>
            ))}

            <p className="text-xs text-[#8e8e8e] px-2 py-2 mt-3">Yesterday</p>
            {['Python data analysis', 'REST API design'].map((chat, i) => (
              <button
                key={i}
                className="w-full text-left p-2 rounded-lg text-sm text-[#ececec] hover:bg-[#212121] truncate flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4 text-[#8e8e8e] shrink-0" />
                <span className="truncate">{chat}</span>
              </button>
            ))}
          </ScrollArea>

          {/* User */}
          <div className="p-2 border-t border-[#2f2f2f]">
            <button className="w-full flex items-center gap-2 p-2 rounded-lg text-[#ececec] hover:bg-[#212121] transition-colors text-sm">
              <div className="w-8 h-8 rounded-full bg-[#19c37d] flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
              <span>User</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-[#212121]">
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-9 w-9 text-[#b4b4b4] hover:text-white hover:bg-[#2f2f2f]"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <button className="flex items-center gap-1.5 text-[#ececec] hover:bg-[#2f2f2f] px-3 py-1.5 rounded-lg">
              <span className="font-semibold">ChatGPT</span>
              <Badge className="bg-[#19c37d]/20 text-[#19c37d] text-xs">
                4o
              </Badge>
              <ChevronDown className="h-4 w-4 text-[#8e8e8e]" />
            </button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-[#b4b4b4] hover:text-white hover:bg-[#2f2f2f]"
          >
            <Edit3 className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto py-4 px-4">
            {messages.map((msg, i) => (
              <div key={i} className="mb-6">
                <div className="flex gap-4">
                  {msg.role === 'assistant' ? (
                    <div className="w-8 h-8 rounded-full bg-[#19c37d] flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#5436DA] flex items-center justify-center shrink-0 text-white text-sm font-medium">
                      U
                    </div>
                  )}
                  <div className="flex-1 pt-0.5">
                    <p className="font-semibold text-[#ececec] text-sm mb-1">
                      {msg.role === 'assistant' ? 'ChatGPT' : 'You'}
                    </p>
                    <p className="text-[#d1d1d1] text-[15px] leading-relaxed">
                      {msg.content}
                    </p>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1 mt-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-[#8e8e8e] hover:text-white hover:bg-[#2f2f2f]"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-[#8e8e8e] hover:text-white hover:bg-[#2f2f2f]"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-[#8e8e8e] hover:text-white hover:bg-[#2f2f2f]"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-[#8e8e8e] hover:text-white hover:bg-[#2f2f2f]"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#2f2f2f] rounded-3xl border border-[#4e4e4e]">
              <div className="flex items-end p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-[#b4b4b4] hover:text-white hover:bg-[#404040] rounded-full"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message ChatGPT"
                  rows={1}
                  className="flex-1 bg-transparent border-0 text-[#ececec] placeholder:text-[#8e8e8e] focus:outline-none resize-none py-2 px-2 text-[15px] min-h-[40px] max-h-[200px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  disabled={!input.trim()}
                  className="h-9 w-9 bg-white hover:bg-gray-200 disabled:bg-[#676767] rounded-full"
                >
                  <ArrowUp className="h-5 w-5 text-[#212121]" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-[#8e8e8e] text-center mt-2">
              ChatGPT can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// PERPLEXITY CLONE - Authentic perplexity.ai interface
// ============================================================================
function PerplexityClone() {
  const [input, setInput] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (!input.trim()) return
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      setHasSearched(true)
    }, 1500)
  }

  const sources = [
    { title: 'MDN Web Docs', url: 'developer.mozilla.org', favicon: '📘' },
    { title: 'Stack Overflow', url: 'stackoverflow.com', favicon: '📗' },
    { title: 'GitHub', url: 'github.com', favicon: '🐙' },
    { title: 'Wikipedia', url: 'wikipedia.org', favicon: '📚' },
  ]

  const relatedQuestions = [
    'What are the best practices?',
    'How does it compare to alternatives?',
    'What are common mistakes to avoid?',
  ]

  return (
    <div className="flex h-[700px] bg-[#191a1a] rounded-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-[220px] bg-[#1b1c1c] flex flex-col border-r border-[#2b2c2c]">
        {/* Logo */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#20b8cd] to-[#1e9bad] flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white text-lg">perplexity</span>
          </div>
        </div>

        {/* New Thread */}
        <div className="px-3 mb-4">
          <Button className="w-full bg-[#20b8cd] hover:bg-[#1e9bad] text-white gap-2 rounded-lg h-9">
            <Plus className="h-4 w-4" />
            New Thread
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#d4d4d4] hover:bg-[#2b2c2c] text-sm">
            <Search className="h-4 w-4" />
            <span>Home</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#d4d4d4] hover:bg-[#2b2c2c] text-sm">
            <Globe className="h-4 w-4" />
            <span>Discover</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#d4d4d4] hover:bg-[#2b2c2c] text-sm">
            <Bookmark className="h-4 w-4" />
            <span>Library</span>
          </button>
        </nav>

        {/* Recent */}
        <div className="mt-6 px-3">
          <p className="text-xs text-[#8b8b8b] px-2 mb-2 font-medium">Recent</p>
          {[
            'React hooks tutorial',
            'TypeScript generics',
            'API best practices',
          ].map((item, i) => (
            <button
              key={i}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#a0a0a0] hover:bg-[#2b2c2c] truncate"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {!hasSearched ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-semibold text-white mb-3">
              What do you want to know?
            </h1>
            <p className="text-[#8b8b8b] mb-8 text-lg">
              Search anything with AI
            </p>
            <div className="w-full max-w-2xl">
              <div className="bg-[#232425] rounded-2xl border border-[#3b3c3d] p-1">
                <div className="flex items-center gap-2 px-4 py-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    rows={1}
                    className="flex-1 bg-transparent border-0 text-white placeholder:text-[#8b8b8b] focus:outline-none resize-none text-[15px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSearch()
                      }
                    }}
                  />
                </div>
                <div className="flex items-center justify-between px-2 py-2 border-t border-[#3b3c3d]">
                  <div className="flex items-center gap-1">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#20b8cd] bg-[#20b8cd]/10 text-sm">
                      <Globe className="h-3.5 w-3.5" />
                      Web
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#8b8b8b] hover:bg-[#2b2c2c] text-sm">
                      <FileText className="h-3.5 w-3.5" />
                      Academic
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#8b8b8b] hover:bg-[#2b2c2c] text-sm">
                      <Code className="h-3.5 w-3.5" />
                      Code
                    </button>
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={!input.trim()}
                    size="sm"
                    className="bg-[#20b8cd] hover:bg-[#1e9bad] disabled:bg-[#3b3c3d] rounded-lg h-8 px-4"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {[
                  'Explain quantum computing',
                  'Latest AI news',
                  'Best programming languages 2024',
                ].map((q, i) => (
                  <button
                    key={i}
                    className="px-4 py-2 rounded-full border border-[#3b3c3d] text-[#a0a0a0] text-sm hover:bg-[#2b2c2c] hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="max-w-3xl mx-auto py-8 px-6">
              {/* Query */}
              <h2 className="text-2xl font-semibold text-white mb-6">
                {input}
              </h2>

              {isSearching ? (
                <div className="flex items-center gap-3 text-[#8b8b8b]">
                  <Loader2 className="h-5 w-5 animate-spin text-[#20b8cd]" />
                  <span>Searching the web...</span>
                </div>
              ) : (
                <>
                  {/* Sources */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="h-4 w-4 text-[#8b8b8b]" />
                      <span className="text-sm text-[#8b8b8b]">Sources</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {sources.map((source, i) => (
                        <Card
                          key={i}
                          className="bg-[#232425] border-[#3b3c3d] p-3 min-w-[160px] cursor-pointer hover:bg-[#2b2c2c] flex-shrink-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{source.favicon}</span>
                            <div className="min-w-0">
                              <p className="text-sm text-white font-medium truncate">
                                {source.title}
                              </p>
                              <p className="text-xs text-[#8b8b8b] truncate">
                                {source.url}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Answer */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-[#20b8cd] to-[#1e9bad] flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white">
                        Answer
                      </span>
                    </div>
                    <div className="text-[#d4d4d4] leading-relaxed space-y-4">
                      <p>
                        Based on my research across multiple authoritative
                        sources, here is a comprehensive answer to your
                        question.
                      </p>
                      <p>
                        The information has been synthesized from MDN Web Docs,
                        Stack Overflow, GitHub repositories, and Wikipedia to
                        provide you with accurate and up-to-date information on
                        this topic.
                      </p>
                      <p>
                        Key points to consider include the fundamental concepts,
                        best practices recommended by the community, and common
                        patterns used in production applications.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#8b8b8b] hover:text-white"
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#8b8b8b] hover:text-white"
                      >
                        <Share className="h-4 w-4 mr-1" /> Share
                      </Button>
                    </div>
                  </div>

                  {/* Related */}
                  <div className="border-t border-[#3b3c3d] pt-6">
                    <p className="text-sm text-[#8b8b8b] mb-3">Related</p>
                    <div className="space-y-2">
                      {relatedQuestions.map((q, i) => (
                        <button
                          key={i}
                          className="w-full flex items-center justify-between p-3 rounded-lg bg-[#232425] hover:bg-[#2b2c2c] text-left"
                        >
                          <span className="text-white text-sm">{q}</span>
                          <ArrowRight className="h-4 w-4 text-[#8b8b8b]" />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// GROK CLONE - Authentic X/Grok interface
// ============================================================================
function GrokClone() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hey there! I'm Grok, made by xAI. I'm designed to answer your questions with a bit of wit and an outside perspective on humanity. What can I help you with today?`,
    },
  ])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Ah, that's an interesting one! Let me give you the straight answer while keeping things entertaining. Here's what you need to know...",
        },
      ])
    }, 1000)
  }

  return (
    <div className="flex h-[700px] bg-black rounded-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-[275px] flex flex-col border-r border-[#2f3336]">
        {/* Logo */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-white fill-current"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-2 space-y-1">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-white hover:bg-[#181818] text-lg font-bold">
            <Zap className="h-6 w-6" />
            <span>Grok</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-[#e7e9ea] hover:bg-[#181818] text-lg">
            <MessageSquare className="h-6 w-6" />
            <span>Messages</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-[#e7e9ea] hover:bg-[#181818] text-lg">
            <Bookmark className="h-6 w-6" />
            <span>Bookmarks</span>
          </button>
        </nav>

        {/* History */}
        <div className="flex-1 mt-4 px-4">
          <p className="text-[#71767b] text-sm mb-2">Recent chats</p>
          {[
            'The meaning of life',
            'Quantum physics explained',
            'Best coding practices',
          ].map((chat, i) => (
            <button
              key={i}
              className="w-full text-left py-2 text-[#e7e9ea] text-sm hover:underline truncate"
            >
              {chat}
            </button>
          ))}
        </div>

        {/* User */}
        <div className="p-4">
          <button className="w-full flex items-center gap-3 p-3 rounded-full hover:bg-[#181818]">
            <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center text-white font-bold">
              U
            </div>
            <div className="flex-1 text-left">
              <p className="text-[#e7e9ea] font-bold text-sm">User</p>
              <p className="text-[#71767b] text-sm">@user</p>
            </div>
            <MoreHorizontal className="h-5 w-5 text-[#71767b]" />
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-[53px] flex items-center justify-between px-4 border-b border-[#2f3336]">
          <div className="flex items-center gap-4">
            <span className="text-[#e7e9ea] text-xl font-bold">Grok</span>
            <Badge className="bg-[#1d9bf0]/20 text-[#1d9bf0]">Beta</Badge>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-full text-sm text-[#71767b] hover:bg-[#181818]">
              Fun
            </button>
            <button className="px-3 py-1.5 rounded-full text-sm bg-[#1d9bf0] text-white">
              Regular
            </button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="max-w-2xl mx-auto py-6 px-4">
            {messages.map((msg, i) => (
              <div key={i} className="mb-6">
                <div className="flex gap-3">
                  {msg.role === 'assistant' ? (
                    <div className="w-10 h-10 rounded-full bg-black border border-[#2f3336] flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center shrink-0 text-white font-bold">
                      U
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-[#e7e9ea] text-[15px]">
                      {msg.role === 'assistant' ? 'Grok' : 'You'}
                    </p>
                    <p className="text-[#e7e9ea] text-[15px] leading-relaxed mt-0.5">
                      {msg.content}
                    </p>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-4 mt-3">
                        <button className="text-[#71767b] hover:text-[#1d9bf0]">
                          <Copy className="h-4 w-4" />
                        </button>
                        <button className="text-[#71767b] hover:text-[#1d9bf0]">
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button className="text-[#71767b] hover:text-[#f91880]">
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                        <button className="text-[#71767b] hover:text-[#f91880]">
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-[#2f3336]">
          <div className="max-w-2xl mx-auto">
            <div className="bg-black rounded-2xl border border-[#2f3336]">
              <div className="flex items-end p-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Grok anything"
                  rows={1}
                  className="flex-1 bg-transparent border-0 text-[#e7e9ea] placeholder:text-[#71767b] focus:outline-none resize-none text-[15px] min-h-[24px] max-h-[200px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  disabled={!input.trim()}
                  className="h-9 w-9 bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:bg-[#1d9bf0]/50 rounded-full"
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MANUS CLONE - Authentic Manus agent interface
// ============================================================================
function ManusClone() {
  const [tasks] = useState([
    {
      id: 1,
      name: 'Research competitor analysis',
      status: 'completed',
      progress: 100,
      subtasks: ['Gather data', 'Analyze trends', 'Generate report'],
      completedSubtasks: 3,
      duration: '2m 34s',
    },
    {
      id: 2,
      name: 'Generate marketing copy',
      status: 'running',
      progress: 65,
      subtasks: ['Understand brand voice', 'Draft copy', 'Review & refine'],
      completedSubtasks: 2,
      duration: '1m 12s',
    },
    {
      id: 3,
      name: 'Create product roadmap',
      status: 'pending',
      progress: 0,
      subtasks: ['Define goals', 'Prioritize features', 'Create timeline'],
      completedSubtasks: 0,
      duration: '--',
    },
  ])

  return (
    <div className="flex h-[700px] bg-[#0c0c0d] rounded-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-[240px] bg-[#0c0c0d] flex flex-col border-r border-[#1f1f23]">
        {/* Logo */}
        <div className="p-4 border-b border-[#1f1f23]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Manus</span>
          </div>
        </div>

        {/* New Agent */}
        <div className="p-3">
          <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white gap-2 rounded-xl h-10">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Agents */}
        <div className="px-3 mt-2">
          <p className="text-xs text-[#71717a] px-2 mb-2 font-medium uppercase tracking-wider">
            Agents
          </p>
          {[
            { name: 'Research Agent', status: 'active' },
            { name: 'Writing Agent', status: 'active' },
            { name: 'Code Agent', status: 'idle' },
          ].map((agent, i) => (
            <button
              key={i}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-[#1f1f23] transition-colors',
                i === 0 && 'bg-[#1f1f23]'
              )}
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  agent.status === 'active' ? 'bg-green-500' : 'bg-[#71717a]'
                )}
              />
              <span className="text-[#fafafa]">{agent.name}</span>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-auto p-4 border-t border-[#1f1f23]">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1f1f23] rounded-lg p-3">
              <p className="text-xs text-[#71717a]">Tasks</p>
              <p className="text-xl font-bold text-white">24</p>
            </div>
            <div className="bg-[#1f1f23] rounded-lg p-3">
              <p className="text-xs text-[#71717a]">Success</p>
              <p className="text-xl font-bold text-green-500">98%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#09090b]">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-[#1f1f23]">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Agent Workspace
            </h2>
            <p className="text-xs text-[#71717a]">Autonomous task execution</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#27272a] text-[#fafafa] hover:bg-[#1f1f23]"
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#27272a] text-[#fafafa] hover:bg-[#1f1f23]"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Tasks */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className={cn(
                  'bg-[#18181b] border-[#27272a] p-5 transition-all',
                  task.status === 'running' &&
                    'border-violet-500/50 shadow-lg shadow-violet-500/10'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {task.status === 'completed' ? (
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    ) : task.status === 'running' ? (
                      <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 text-violet-500 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-[#27272a] flex items-center justify-center">
                        <Circle className="h-4 w-4 text-[#71717a]" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-medium">{task.name}</h3>
                      <p className="text-xs text-[#71717a] mt-0.5">
                        {task.completedSubtasks}/{task.subtasks.length} subtasks
                        • {task.duration}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      'text-xs',
                      task.status === 'completed'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : task.status === 'running'
                          ? 'bg-violet-500/20 text-violet-400 border-violet-500/30'
                          : 'bg-[#27272a] text-[#71717a] border-[#3f3f46]'
                    )}
                    variant="outline"
                  >
                    {task.status}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden mb-4">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      task.status === 'completed'
                        ? 'bg-green-500'
                        : 'bg-violet-500'
                    )}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>

                {/* Subtasks */}
                <div className="space-y-2">
                  {task.subtasks.map((subtask, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center gap-2 text-sm',
                        i < task.completedSubtasks
                          ? 'text-[#a1a1aa]'
                          : 'text-[#52525b]'
                      )}
                    >
                      {i < task.completedSubtasks ? (
                        <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                      ) : i === task.completedSubtasks &&
                        task.status === 'running' ? (
                        <Loader2 className="h-3.5 w-3.5 text-violet-500 animate-spin" />
                      ) : (
                        <Circle className="h-3.5 w-3.5" />
                      )}
                      {subtask}
                    </div>
                  ))}
                </div>

                {/* Live output for running task */}
                {task.status === 'running' && (
                  <div className="mt-4 p-3 bg-[#09090b] rounded-lg border border-[#27272a]">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="h-3.5 w-3.5 text-violet-400" />
                      <span className="text-xs text-violet-400 font-medium">
                        Live Output
                      </span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] font-mono">
                      Generating marketing copy based on brand guidelines...
                      <span className="animate-pulse">▌</span>
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-[#1f1f23]">
          <div className="flex items-center gap-3 bg-[#18181b] rounded-xl p-3 border border-[#27272a]">
            <Input
              placeholder="Describe a task for the agent..."
              className="flex-1 bg-transparent border-0 text-white placeholder:text-[#71717a] focus-visible:ring-0"
            />
            <Button className="bg-violet-600 hover:bg-violet-700 gap-2">
              <Play className="h-4 w-4" />
              Run Agent
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// EMERGENT CLONE - Multi-agent collaboration interface
// ============================================================================
function EmergentClone() {
  const [input, setInput] = useState('')
  const [agents] = useState([
    {
      id: 1,
      name: 'Coordinator',
      icon: Network,
      color: 'emerald',
      status: 'thinking',
    },
    {
      id: 2,
      name: 'Researcher',
      icon: Search,
      color: 'blue',
      status: 'active',
    },
    { id: 3, name: 'Coder', icon: Code, color: 'violet', status: 'idle' },
    { id: 4, name: 'Reviewer', icon: Eye, color: 'amber', status: 'idle' },
  ])

  return (
    <div className="flex h-[700px] bg-gradient-to-br from-[#030712] via-[#0a0f1a] to-[#030712] rounded-xl overflow-hidden border border-[#1e293b]">
      {/* Sidebar */}
      <div className="w-[260px] bg-[#030712]/80 backdrop-blur flex flex-col border-r border-[#1e293b]">
        {/* Logo */}
        <div className="p-4 border-b border-[#1e293b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Workflow className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-lg">Emergent</span>
              <p className="text-xs text-emerald-400">Multi-Agent AI</p>
            </div>
          </div>
        </div>

        {/* New Session */}
        <div className="p-3">
          <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white gap-2 rounded-xl h-10 shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-4 w-4" />
            New Session
          </Button>
        </div>

        {/* Agents */}
        <div className="px-3 mt-2">
          <p className="text-xs text-slate-500 px-2 mb-2 font-medium uppercase tracking-wider">
            Active Agents
          </p>
          {agents.map((agent) => {
            const Icon = agent.icon
            return (
              <div
                key={agent.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 bg-[#0f172a]/50 border border-[#1e293b]"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    agent.color === 'emerald' && 'bg-emerald-500/20',
                    agent.color === 'blue' && 'bg-blue-500/20',
                    agent.color === 'violet' && 'bg-violet-500/20',
                    agent.color === 'amber' && 'bg-amber-500/20'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      agent.color === 'emerald' && 'text-emerald-400',
                      agent.color === 'blue' && 'text-blue-400',
                      agent.color === 'violet' && 'text-violet-400',
                      agent.color === 'amber' && 'text-amber-400'
                    )}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{agent.name}</p>
                  <p
                    className={cn(
                      'text-xs capitalize',
                      agent.status === 'active' && 'text-emerald-400',
                      agent.status === 'thinking' && 'text-blue-400',
                      agent.status === 'idle' && 'text-slate-500'
                    )}
                  >
                    {agent.status === 'thinking' && (
                      <span className="inline-block animate-pulse">●</span>
                    )}{' '}
                    {agent.status}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Metrics */}
        <div className="mt-auto p-4 border-t border-[#1e293b]">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#0f172a] rounded-lg p-3 border border-[#1e293b]">
              <div className="flex items-center gap-1.5 mb-1">
                <Activity className="h-3 w-3 text-emerald-400" />
                <span className="text-xs text-slate-400">Tokens</span>
              </div>
              <p className="text-lg font-bold text-white">12.4k</p>
            </div>
            <div className="bg-[#0f172a] rounded-lg p-3 border border-[#1e293b]">
              <div className="flex items-center gap-1.5 mb-1">
                <Timer className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-slate-400">Time</span>
              </div>
              <p className="text-lg font-bold text-white">2m 14s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Visualization Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFmMjkzNyIgb3BhY2l0eT0iMC4zIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />

          {/* Center visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Outer ring */}
              <div
                className="w-64 h-64 rounded-full border border-emerald-500/20 animate-spin"
                style={{ animationDuration: '20s' }}
              />

              {/* Middle ring */}
              <div
                className="absolute inset-4 rounded-full border border-teal-500/30 animate-spin"
                style={{
                  animationDuration: '15s',
                  animationDirection: 'reverse',
                }}
              />

              {/* Inner glow */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl" />

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                  <Brain className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Agent nodes */}
              {agents.map((agent, i) => {
                const Icon = agent.icon
                const angle = (i * 90 - 45) * (Math.PI / 180)
                const x = Math.cos(angle) * 120
                const y = Math.sin(angle) * 120
                return (
                  <div
                    key={agent.id}
                    className="absolute w-12 h-12 -ml-6 -mt-6"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                    }}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg transition-all',
                        agent.status === 'active' &&
                          'bg-emerald-500/20 border-emerald-500/50 shadow-emerald-500/20 scale-110',
                        agent.status === 'thinking' &&
                          'bg-blue-500/20 border-blue-500/50 shadow-blue-500/20 animate-pulse',
                        agent.status === 'idle' &&
                          'bg-slate-800 border-slate-700'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          agent.color === 'emerald' && 'text-emerald-400',
                          agent.color === 'blue' && 'text-blue-400',
                          agent.color === 'violet' && 'text-violet-400',
                          agent.color === 'amber' && 'text-amber-400'
                        )}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Status */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
            <h2 className="text-2xl font-bold text-white mb-1">
              Emergent Intelligence
            </h2>
            <p className="text-slate-400 text-sm">
              Coordinating multi-agent collaboration...
            </p>
          </div>

          {/* Activity feed */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-[#0f172a]/90 backdrop-blur rounded-xl border border-[#1e293b] p-4 max-w-md">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-white">
                  Activity Feed
                </span>
              </div>
              <div className="space-y-2">
                {[
                  {
                    agent: 'Coordinator',
                    action: 'Delegating research task...',
                    time: '2s ago',
                  },
                  {
                    agent: 'Researcher',
                    action: 'Gathering information from sources...',
                    time: '5s ago',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-400 font-medium">
                      {item.agent}
                    </span>
                    <span className="text-slate-400">{item.action}</span>
                    <span className="text-slate-600 text-xs ml-auto">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#1e293b] bg-[#030712]/80 backdrop-blur">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 bg-[#0f172a] rounded-xl p-3 border border-[#1e293b]">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your objective for the agent swarm..."
                className="flex-1 bg-transparent border-0 text-white placeholder:text-slate-500 focus-visible:ring-0"
              />
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 gap-2 shadow-lg shadow-emerald-500/20">
                <Sparkles className="h-4 w-4" />
                Initialize
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// LOVABLE CLONE - Authentic lovable.dev interface
// ============================================================================
function LovableClone() {
  const [input, setInput] = useState('')
  const [messages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm here to help you build your next project. Describe what you want to create, and I'll generate the code and preview for you.`,
    },
  ])
  const [previewMode, setPreviewMode] = useState<
    'desktop' | 'tablet' | 'mobile'
  >('desktop')

  return (
    <div className="flex h-[700px] bg-[#09090b] rounded-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-[240px] bg-[#09090b] flex flex-col border-r border-[#27272a]">
        {/* Logo */}
        <div className="p-4 border-b border-[#27272a]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ec4899] to-[#f43f5e] flex items-center justify-center">
              <Heart className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="font-bold text-white text-lg">lovable</span>
          </div>
        </div>

        {/* New Project */}
        <div className="p-3">
          <Button className="w-full bg-gradient-to-r from-[#ec4899] to-[#f43f5e] hover:from-[#db2777] hover:to-[#e11d48] text-white gap-2 rounded-lg h-9">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Projects */}
        <div className="px-3 mt-2">
          <p className="text-xs text-[#71717a] px-2 mb-2 font-medium">
            Recent Projects
          </p>
          {[
            { name: 'E-commerce Dashboard', icon: Layout, color: 'pink' },
            { name: 'Landing Page', icon: FileText, color: 'purple' },
            { name: 'Portfolio Site', icon: Palette, color: 'blue' },
          ].map((project, i) => (
            <button
              key={i}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-[#18181b] transition-colors',
                i === 0 && 'bg-[#18181b]'
              )}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded flex items-center justify-center',
                  project.color === 'pink' && 'bg-pink-500/20',
                  project.color === 'purple' && 'bg-purple-500/20',
                  project.color === 'blue' && 'bg-blue-500/20'
                )}
              >
                <project.icon
                  className={cn(
                    'h-3.5 w-3.5',
                    project.color === 'pink' && 'text-pink-400',
                    project.color === 'purple' && 'text-purple-400',
                    project.color === 'blue' && 'text-blue-400'
                  )}
                />
              </div>
              <span className="text-[#fafafa] truncate">{project.name}</span>
            </button>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-auto p-3 border-t border-[#27272a]">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#a1a1aa] hover:bg-[#18181b] transition-colors">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Panel */}
        <div className="w-[380px] flex flex-col border-r border-[#27272a]">
          {/* Header */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-[#27272a]">
            <span className="text-white font-medium">Chat</span>
            <button className="text-[#71717a] hover:text-white">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.map((msg, i) => (
              <div key={i} className="mb-4">
                <div className="flex gap-3">
                  {msg.role === 'assistant' ? (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ec4899] to-[#f43f5e] flex items-center justify-center shrink-0">
                      <Heart className="h-3.5 w-3.5 text-white fill-white" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-[#3f3f46] flex items-center justify-center shrink-0 text-white text-xs font-medium">
                      U
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-[#fafafa] text-sm leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-[#27272a]">
            <div className="bg-[#18181b] rounded-xl border border-[#27272a]">
              <div className="flex items-end p-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you want to build..."
                  rows={2}
                  className="flex-1 bg-transparent border-0 text-[#fafafa] placeholder:text-[#71717a] focus:outline-none resize-none py-1 px-2 text-sm"
                />
              </div>
              <div className="flex items-center justify-between px-2 py-2 border-t border-[#27272a]">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-[#71717a] hover:text-white hover:bg-[#27272a]"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-[#71717a] hover:text-white hover:bg-[#27272a]"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="bg-[#ec4899] hover:bg-[#db2777] h-7 px-3"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col bg-[#0c0c0d]">
          {/* Toolbar */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-[#27272a]">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'text-[#71717a] hover:text-white gap-1.5',
                  previewMode === 'desktop' && 'text-white bg-[#27272a]'
                )}
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'text-[#71717a] hover:text-white gap-1.5',
                  previewMode === 'tablet' && 'text-white bg-[#27272a]'
                )}
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'text-[#71717a] hover:text-white gap-1.5',
                  previewMode === 'mobile' && 'text-white bg-[#27272a]'
                )}
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#71717a] hover:text-white gap-1.5"
              >
                <Code className="h-4 w-4" />
                Code
              </Button>
              <Button
                size="sm"
                className="bg-[#ec4899] hover:bg-[#db2777] gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Deploy
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 flex items-center justify-center p-8 bg-[#09090b]">
            <div
              className={cn(
                'bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300',
                previewMode === 'desktop' && 'w-full max-w-4xl h-full',
                previewMode === 'tablet' && 'w-[768px] h-[90%]',
                previewMode === 'mobile' && 'w-[375px] h-[90%]'
              )}
            >
              {/* Preview browser chrome */}
              <div className="h-8 bg-[#f4f4f5] flex items-center px-3 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded px-3 py-0.5 text-xs text-[#71717a] flex items-center gap-1">
                    <Link className="h-3 w-3" />
                    preview.lovable.dev
                  </div>
                </div>
              </div>
              {/* Preview content */}
              <div className="flex-1 flex items-center justify-center h-[calc(100%-32px)] bg-gradient-to-br from-[#fdf4ff] to-[#fce7f3]">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#f43f5e] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30">
                    <Wand2 className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-[#18181b] font-medium">
                    Your preview will appear here
                  </p>
                  <p className="text-[#71717a] text-sm mt-1">
                    Describe your app to get started
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function ClonesPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-violet -top-40 -right-40 opacity-20" />
        <div className="orb-cyan bottom-40 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="AI Interface Clones"
        description="Pixel-perfect recreations of popular AI chat interfaces built with Clarity Chat components. These demonstrate the flexibility and power of our component library."
        icon={Layers}
        badge="7 Clones"
      />

      <Tabs defaultValue="claude" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger
            value="claude"
            className="data-[state=active]:bg-[#da7756] data-[state=active]:text-white rounded-lg px-4 py-2"
          >
            Claude
          </TabsTrigger>
          <TabsTrigger
            value="chatgpt"
            className="data-[state=active]:bg-[#19c37d] data-[state=active]:text-white rounded-lg px-4 py-2"
          >
            ChatGPT
          </TabsTrigger>
          <TabsTrigger
            value="perplexity"
            className="data-[state=active]:bg-[#20b8cd] data-[state=active]:text-white rounded-lg px-4 py-2"
          >
            Perplexity
          </TabsTrigger>
          <TabsTrigger
            value="grok"
            className="data-[state=active]:bg-black data-[state=active]:text-white border data-[state=active]:border-[#2f3336] rounded-lg px-4 py-2"
          >
            Grok
          </TabsTrigger>
          <TabsTrigger
            value="manus"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-lg px-4 py-2"
          >
            Manus
          </TabsTrigger>
          <TabsTrigger
            value="emergent"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-lg px-4 py-2"
          >
            Emergent
          </TabsTrigger>
          <TabsTrigger
            value="lovable"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ec4899] data-[state=active]:to-[#f43f5e] data-[state=active]:text-white rounded-lg px-4 py-2"
          >
            Lovable
          </TabsTrigger>
        </TabsList>

        <TabsContent value="claude">
          <ClaudeClone />
        </TabsContent>
        <TabsContent value="chatgpt">
          <ChatGPTClone />
        </TabsContent>
        <TabsContent value="perplexity">
          <PerplexityClone />
        </TabsContent>
        <TabsContent value="grok">
          <GrokClone />
        </TabsContent>
        <TabsContent value="manus">
          <ManusClone />
        </TabsContent>
        <TabsContent value="emergent">
          <EmergentClone />
        </TabsContent>
        <TabsContent value="lovable">
          <LovableClone />
        </TabsContent>
      </Tabs>
    </div>
  )
}

'use client'

/**
 * MentionInput Component - API Reference Documentation
 *
 * An input component with @mention autocomplete support for user mentions,
 * fuzzy search, keyboard navigation, and visual mention highlighting.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AtSign,
  Users,
  Search,
  Keyboard,
  Zap,
  Shield,
  Accessibility,
  MessageSquare,
  ChevronRight,
  Copy,
  Check,
  Send,
  AlertTriangle,
  UserPlus,
  Filter,
  Hash,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span className="text-brand-600 dark:text-brand-400">
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

interface MentionableUser {
  id: string
  name: string
  username: string
  role?: string
  avatar?: string
  isOnline?: boolean
}

function LiveDemo() {
  const [input, setInput] = React.useState('')
  const [messages, setMessages] = React.useState<
    Array<{ id: string; content: string; mentions: string[] }>
  >([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<MentionableUser[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [mentionStartPos, setMentionStartPos] = React.useState(-1)
  const [enableFuzzy, setEnableFuzzy] = React.useState(true)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const users: MentionableUser[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      username: 'alice',
      role: 'Designer',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Bob Smith',
      username: 'bob',
      role: 'Developer',
      isOnline: true,
    },
    {
      id: '3',
      name: 'Carol Williams',
      username: 'carol',
      role: 'Product Manager',
      isOnline: false,
    },
    {
      id: '4',
      name: 'David Brown',
      username: 'david',
      role: 'Engineer',
      isOnline: true,
    },
    {
      id: '5',
      name: 'Emma Davis',
      username: 'emma',
      role: 'Designer',
      isOnline: false,
    },
  ]

  const fuzzySearch = (query: string, text: string): boolean => {
    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()
    let queryIndex = 0
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++
      }
    }
    return queryIndex === queryLower.length
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPos = e.target.selectionStart || 0
    setInput(newValue)

    const textBeforeCursor = newValue.slice(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)

      if (!/\s/.test(textAfterAt)) {
        setMentionStartPos(lastAtIndex)
        const query = textAfterAt.toLowerCase()

        const filtered = users.filter((user) => {
          if (enableFuzzy) {
            return (
              fuzzySearch(query, user.name) || fuzzySearch(query, user.username)
            )
          }
          return (
            user.name.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
          )
        })

        setSuggestions(filtered.slice(0, 5))
        setShowSuggestions(filtered.length > 0)
        setSelectedIndex(0)
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }
  }

  const insertMention = (user: MentionableUser) => {
    if (mentionStartPos === -1) return

    const before = input.slice(0, mentionStartPos)
    const cursorPos = inputRef.current?.selectionStart || 0
    const after = input.slice(cursorPos)
    const mention = `@${user.username} `
    const newValue = before + mention + after

    setInput(newValue)
    setShowSuggestions(false)
    setMentionStartPos(-1)

    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPos = mentionStartPos + mention.length
        inputRef.current.focus()
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
      case 'Tab':
        e.preventDefault()
        if (suggestions[selectedIndex]) {
          insertMention(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowSuggestions(false)
        break
    }
  }

  const handleSend = () => {
    if (input.trim()) {
      const mentionRegex = /@(\w+)/g
      const mentions: string[] = []
      let match

      while ((match = mentionRegex.exec(input)) !== null) {
        mentions.push(match[1])
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), content: input, mentions },
      ])
      setInput('')
      setShowSuggestions(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enableFuzzy}
            onChange={(e) => setEnableFuzzy(e.target.checked)}
            className="rounded"
          />
          <span className="text-muted-foreground">Enable fuzzy search</span>
        </label>
        <div className="text-sm text-muted-foreground">
          Type <kbd className="px-1.5 py-0.5 rounded bg-background border">@</kbd> to mention someone
        </div>
      </div>

      {/* Demo component */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Messages */}
        <div className="h-64 overflow-y-auto p-4 space-y-2 bg-background/50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Type @ to mention users</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="max-w-[80%] rounded-lg px-4 py-2 bg-muted/50"
              >
                <p className="text-sm">
                  {msg.content.split(/(@\w+)/g).map((part, i) =>
                    part.startsWith('@') ? (
                      <span
                        key={i}
                        className="font-medium text-brand-600 dark:text-brand-400"
                      >
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </p>
                {msg.mentions.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Mentioned: {msg.mentions.join(', ')}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <div className="relative border-t border-border/50">
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-popover border border-border/60 rounded-lg shadow-xl max-h-48 overflow-y-auto">
              {suggestions.map((user, index) => (
                <button
                  key={user.id}
                  onClick={() => insertMention(user)}
                  className={cn(
                    'w-full text-left px-4 py-2 hover:bg-accent transition-colors',
                    index === selectedIndex && 'bg-accent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-sm font-medium shrink-0">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{user.name}</span>
                        {user.isOnline && (
                          <span
                            className="w-2 h-2 rounded-full bg-green-500"
                            title="Online"
                          />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        @{user.username}
                        {user.role && ` • ${user.role}`}
                      </div>
                    </div>
                    {index === selectedIndex && (
                      <kbd className="px-1.5 py-0.5 text-xs rounded bg-muted border">
                        Enter
                      </kbd>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2 p-4">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type @ to mention..."
              className="flex-1 resize-none bg-transparent border-0 focus:outline-none focus:ring-0 text-sm min-h-[40px]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-md bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'basic-usage', title: 'Basic Usage' },
  {
    id: 'props',
    title: 'Props Reference',
    children: [
      { id: 'core-props', title: 'Core Props' },
      { id: 'search-props', title: 'Search Options' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-fuzzy-search', title: 'Fuzzy Search' },
      { id: 'example-custom-trigger', title: 'Custom Trigger' },
      { id: 'example-with-roles', title: 'With User Roles' },
    ],
  },
  { id: 'types', title: 'TypeScript Types' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'users',
    type: 'MentionableUser[]',
    required: true,
    description: 'Array of users available for mentioning.',
  },
  {
    name: 'value',
    type: 'string',
    required: true,
    description: 'Current input value.',
  },
  {
    name: 'onChange',
    type: '(value: string, mentions: Mention[]) => void',
    required: true,
    description: 'Callback when input value changes with extracted mentions.',
  },
  {
    name: 'onSubmit',
    type: '() => void',
    description: 'Callback when Enter is pressed (without shift).',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: '"Type @ to mention..."',
    description: 'Input placeholder text.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the input.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container.',
  },
]

const searchProps: PropDefinition[] = [
  {
    name: 'mentionTrigger',
    type: 'string',
    default: '"@"',
    description: 'Character that triggers mention suggestions.',
  },
  {
    name: 'enableFuzzySearch',
    type: 'boolean',
    default: 'true',
    description:
      'Enable fuzzy search matching (e.g., "aj" matches "Alice Johnson").',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { MentionInput } from '@clarity-chat/react'
import type { MentionInputProps, MentionableUser, Mention } from '@clarity-chat/react'`

const basicUsageCode = `import { useState } from 'react'
import { MentionInput, type Mention } from '@clarity-chat/react'

const users = [
  { id: '1', name: 'Alice Johnson', username: 'alice', role: 'Designer' },
  { id: '2', name: 'Bob Smith', username: 'bob', role: 'Developer' },
  { id: '3', name: 'Carol Williams', username: 'carol', role: 'PM' },
]

export function ChatWithMentions() {
  const [message, setMessage] = useState('')
  const [mentions, setMentions] = useState<Mention[]>([])

  const handleChange = (value: string, extractedMentions: Mention[]) => {
    setMessage(value)
    setMentions(extractedMentions)
  }

  const handleSubmit = () => {
    console.log('Message:', message)
    console.log('Mentions:', mentions)
    // Send message with mentions
    setMessage('')
    setMentions([])
  }

  return (
    <MentionInput
      users={users}
      value={message}
      onChange={handleChange}
      onSubmit={handleSubmit}
      placeholder="Type @ to mention someone"
    />
  )
}`

const fuzzySearchCode = `import { MentionInput } from '@clarity-chat/react'

export function FuzzyMentionInput() {
  const [message, setMessage] = useState('')

  return (
    <MentionInput
      users={users}
      value={message}
      onChange={(value, mentions) => setMessage(value)}
      enableFuzzySearch={true}
      placeholder="Try typing 'aj' to find Alice Johnson"
    />
  )
}

// Fuzzy search examples:
// "aj" matches "Alice Johnson"
// "bsm" matches "Bob Smith"
// "cw" matches "Carol Williams"`

const customTriggerCode = `import { MentionInput } from '@clarity-chat/react'

export function HashtagMention() {
  const [message, setMessage] = useState('')

  // Use # instead of @ for mentions
  return (
    <MentionInput
      users={users}
      value={message}
      onChange={(value, mentions) => setMessage(value)}
      mentionTrigger="#"
      placeholder="Type # to mention someone"
    />
  )
}`

const withRolesCode = `import { MentionInput } from '@clarity-chat/react'

const teamMembers = [
  {
    id: '1',
    name: 'Alice Johnson',
    username: 'alice',
    role: 'Senior Designer',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    username: 'bob',
    role: 'Tech Lead',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Carol Williams',
    username: 'carol',
    role: 'Product Manager',
    isOnline: false,
  },
]

export function TeamMentions() {
  const [message, setMessage] = useState('')

  return (
    <MentionInput
      users={teamMembers}
      value={message}
      onChange={(value, mentions) => {
        setMessage(value)
        // Show notification to mentioned users
        mentions.forEach((mention) => {
          const user = teamMembers.find((u) => u.id === mention.userId)
          if (user) {
            notifyUser(user.id, 'You were mentioned in a message')
          }
        })
      }}
      placeholder="Mention team members with @"
    />
  )
}`

const typescriptCode = `// MentionInput props
interface MentionInputProps {
  users: MentionableUser[]
  value: string
  onChange: (value: string, mentions: Mention[]) => void
  onSubmit?: () => void
  placeholder?: string
  disabled?: boolean
  mentionTrigger?: string
  enableFuzzySearch?: boolean
  className?: string
}

// Mentionable user
interface MentionableUser {
  id: string
  name: string
  username: string
  role?: string
  avatar?: string
  isOnline?: boolean
}

// Extracted mention
interface Mention {
  id: string
  userId: string
  messageId: string
  position: number
  length: number
  isRead: boolean
  timestamp: number
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function MentionInputPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <AtSign className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      P2
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                MentionInput
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                An input component with @mention autocomplete support for user mentions.
                Features fuzzy search, keyboard navigation, visual mention highlighting,
                and automatic mention extraction. Perfect for team collaboration and
                social features.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: AtSign, label: '@Mentions', desc: 'User autocomplete' },
                { icon: Search, label: 'Fuzzy Search', desc: 'Smart matching' },
                { icon: Keyboard, label: 'Keyboard Nav', desc: 'Arrow keys' },
                { icon: Users, label: 'User Roles', desc: 'Show team info' },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  <code>MentionInput</code> is an input component that provides @mention
                  autocomplete functionality. As users type the @ symbol, a dropdown appears
                  with matching users, allowing quick mentions with keyboard navigation.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>@Mention Autocomplete:</strong> Type @ to trigger user suggestions
                    with real-time filtering
                  </li>
                  <li>
                    <strong>Fuzzy Search:</strong> Smart matching - "aj" finds "Alice Johnson"
                  </li>
                  <li>
                    <strong>Keyboard Navigation:</strong> Arrow keys to navigate, Enter/Tab to
                    select, Escape to dismiss
                  </li>
                  <li>
                    <strong>Visual Highlighting:</strong> Mentions are automatically highlighted
                    in the input
                  </li>
                  <li>
                    <strong>Mention Extraction:</strong> Automatically extracts all mentions
                    with position and metadata
                  </li>
                  <li>
                    <strong>User Status:</strong> Shows online status and role information
                  </li>
                  <li>
                    <strong>Customizable Trigger:</strong> Use @ or any custom character
                  </li>
                  <li>
                    <strong>Reduced Motion Support:</strong> Respects prefers-reduced-motion
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <ul className="space-y-2">
                  <li>Team collaboration tools</li>
                  <li>Social messaging applications</li>
                  <li>Comment systems with user mentions</li>
                  <li>Task management with assignee mentions</li>
                  <li>Any application requiring user notifications</li>
                </ul>
              </div>
            </Section>

            {/* Installation Section */}
            <Section id="installation" title="Installation">
              <div className="space-y-4">
                <CodeBlock
                  code="npm install @clarity-chat/react"
                  language="bash"
                  filename="Terminal"
                  showDownloadButton={false}
                />

                <p className="text-muted-foreground">Import the component:</p>

                <CodeBlock
                  code={importCode}
                  language="tsx"
                  filename="App.tsx"
                  showDownloadButton={false}
                />
              </div>
            </Section>

            {/* Live Demo Section */}
            <Section id="demo" title="Live Demo">
              <p className="text-muted-foreground mb-6">
                Try the MentionInput component. Type{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs">@</kbd> to
                see user suggestions with fuzzy search.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Basic setup with user mentions:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="ChatWithMentions.tsx"
                />
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection id="search-props" title="Search Options">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure search behavior:
                </p>
                <PropsTable props={searchProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Simple mention input with user list:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicExample.tsx"
                />
              </SubSection>

              <SubSection id="example-fuzzy-search" title="With Fuzzy Search">
                <p className="text-muted-foreground mb-4">
                  Enable fuzzy search for smarter matching:
                </p>
                <CodeBlock
                  code={fuzzySearchCode}
                  language="tsx"
                  filename="FuzzySearchExample.tsx"
                />
              </SubSection>

              <SubSection id="example-custom-trigger" title="Custom Trigger Character">
                <p className="text-muted-foreground mb-4">
                  Use a different trigger character like #:
                </p>
                <CodeBlock
                  code={customTriggerCode}
                  language="tsx"
                  filename="CustomTriggerExample.tsx"
                />
              </SubSection>

              <SubSection id="example-with-roles" title="With User Roles">
                <p className="text-muted-foreground mb-4">
                  Display user roles and online status:
                </p>
                <CodeBlock
                  code={withRolesCode}
                  language="tsx"
                  filename="TeamMentionsExample.tsx"
                />
              </SubSection>
            </Section>

            {/* TypeScript Section */}
            <Section id="types" title="TypeScript Types">
              <p className="text-muted-foreground mb-4">
                Full type definitions:
              </p>
              <CodeBlock
                code={typescriptCode}
                language="tsx"
                filename="types.ts"
                showLineNumbers
              />
            </Section>

            {/* Accessibility Section */}
            <Section id="accessibility" title="Accessibility">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5" aria-hidden="true" />
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">@</kbd> - Trigger
                    mention suggestions
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Arrow Up/Down
                    </kbd>{' '}
                    - Navigate suggestions list
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">Enter</kbd> or{' '}
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">Tab</kbd> - Select
                    highlighted user
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">Escape</kbd> - Close
                    suggestions dropdown
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">Enter</kbd> - Submit
                    message (when suggestions closed)
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">Shift + Enter</kbd>{' '}
                    - New line in message
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>ARIA labels for all interactive elements</li>
                  <li>Suggestions count announced to screen readers</li>
                  <li>Selected suggestion announced with aria-selected</li>
                  <li>Loading states communicated via aria-live</li>
                  <li>Online status indicated with semantic markup</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Reduced Motion
                </h4>
                <p>
                  Respects <code>prefers-reduced-motion</code>. When enabled, dropdown
                  animations are disabled and replaced with instant transitions.
                </p>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Suggestions not appearing
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Verify <code>users</code> array is populated</li>
                        <li>Check that users have valid <code>username</code> fields</li>
                        <li>Ensure @ is typed without spaces after it</li>
                        <li>Verify <code>enableFuzzySearch</code> setting matches search behavior</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Mentions not extracted
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Check <code>onChange</code> callback receives mentions array</li>
                        <li>Verify mentions match existing users in the <code>users</code> array</li>
                        <li>Ensure username format matches (no special characters)</li>
                        <li>Check that mention trigger character is correctly configured</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Performance with large user lists
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Component automatically limits suggestions to 10 results</li>
                        <li>Consider implementing server-side filtering for 1000+ users</li>
                        <li>Use debouncing for remote user search</li>
                        <li>Cache frequently mentioned users for faster access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'AdvancedChatInput',
                    type: 'component',
                    description: 'Full-featured input with mentions and slash commands',
                    href: '/reference/components/advanced-chat-input',
                  },
                  {
                    name: 'MentionList',
                    type: 'component',
                    description: 'Display list of mentions for a user',
                    href: '/reference/components/mention-list',
                  },
                  {
                    name: 'useMentions',
                    type: 'hook',
                    description: 'Hook to manage mention state',
                    href: '/reference/hooks/use-mentions',
                  },
                  {
                    name: 'ChatInput',
                    type: 'component',
                    description: 'Basic chat input without mentions',
                    href: '/reference/components/chat-input',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/components/advanced-chat-input"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      AdvancedChatInput
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/chat-input"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      ChatInput
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}

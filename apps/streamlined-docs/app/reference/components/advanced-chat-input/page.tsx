'use client'

/**
 * AdvancedChatInput Component - API Reference Documentation
 *
 * A power-user chat input component with advanced features including slash commands,
 * mentions, file attachments, autocomplete, and rich text capabilities.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Terminal,
  AtSign,
  FileText,
  Zap,
  Sparkles,
  Shield,
  Accessibility,
  Code2,
  MessageSquare,
  ChevronRight,
  Keyboard,
  Copy,
  Check,
  Paperclip,
  Command,
  Send,
  AlertTriangle,
  HelpCircle,
  Search,
  Timer,
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
  deprecated?: boolean
  deprecatedMessage?: string
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
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
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
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
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

function LiveDemo() {
  const [input, setInput] = React.useState('')
  const [messages, setMessages] = React.useState<
    Array<{ id: string; role: 'user' | 'assistant'; content: string }>
  >([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [triggerType, setTriggerType] = React.useState<'@' | '/' | null>(null)

  const suggestions = React.useMemo(() => {
    if (triggerType === '/') {
      return [
        { id: '1', label: 'help', description: 'Show available commands' },
        { id: '2', label: 'clear', description: 'Clear conversation' },
        { id: '3', label: 'export', description: 'Export chat history' },
      ]
    } else if (triggerType === '@') {
      return [
        { id: '1', label: 'summarize', description: 'Summarize content' },
        { id: '2', label: 'analyze', description: 'Analyze data' },
        { id: '3', label: 'explain', description: 'Explain concept' },
      ]
    }
    return []
  }, [triggerType])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInput(value)

    const lastChar = value.slice(-1)
    if (lastChar === '/' || lastChar === '@') {
      setTriggerType(lastChar as '@' | '/')
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
      setTriggerType(null)
    }
  }

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'user', content: input },
      ])
      setInput('')
      setShowSuggestions(false)
      setTriggerType(null)

      // Simulate response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'This is a demo response. Try using @ or / to see autocomplete!',
          },
        ])
      }, 1000)
    }
  }

  const selectSuggestion = (suggestion: { label: string }) => {
    const beforeTrigger = input.slice(0, -1)
    setInput(beforeTrigger + triggerType + suggestion.label + ' ')
    setShowSuggestions(false)
    setTriggerType(null)
  }

  return (
    <div className="space-y-4">
      {/* Feature toggles */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="text-sm text-muted-foreground">
          Type <kbd className="px-1.5 py-0.5 rounded bg-background border">@</kbd> for mentions or{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-background border">/</kbd> for commands
        </div>
      </div>

      {/* Demo component */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Messages */}
        <div className="h-64 overflow-y-auto p-4 space-y-2 bg-background/50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Start typing to test advanced features</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2',
                  msg.role === 'user'
                    ? 'ml-auto bg-brand-500 text-white'
                    : 'bg-muted/50 text-foreground'
                )}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <div className="relative border-t border-border/50">
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-popover border border-border/60 rounded-lg shadow-xl max-h-48 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {triggerType === '/' ? (
                      <Command className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <AtSign className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{suggestion.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2 p-4">
            <button
              className="p-2 rounded-md hover:bg-muted/50 transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type @ for prompts, / for commands..."
              className="flex-1 resize-none bg-transparent border-0 focus:outline-none focus:ring-0 text-sm"
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
      { id: 'autocomplete-props', title: 'Autocomplete' },
      { id: 'file-upload-props', title: 'File Upload' },
      { id: 'display-props', title: 'Display Options' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-slash-commands', title: 'Slash Commands' },
      { id: 'example-mentions', title: 'Mentions & Autocomplete' },
      { id: 'example-file-upload', title: 'File Upload' },
    ],
  },
  { id: 'typescript', title: 'TypeScript' },
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
    name: 'value',
    type: 'string',
    required: true,
    description: 'Current input value.',
  },
  {
    name: 'onChange',
    type: '(value: string) => void',
    required: true,
    description: 'Callback when input value changes.',
  },
  {
    name: 'onSubmit',
    type: '(value: string, attachments?: MessageAttachment[]) => void',
    required: true,
    description: 'Callback when message is submitted.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the input.',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: '"Type a message... Use @ for prompts, / for commands"',
    description: 'Input placeholder text.',
  },
  {
    name: 'maxLength',
    type: 'number',
    description: 'Maximum character limit with visual indicator.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container.',
  },
  {
    name: 'ref',
    type: 'React.Ref<HTMLTextAreaElement>',
    description: 'Ref to the textarea element (React 19 ref as prop).',
  },
]

const autocompleteProps: PropDefinition[] = [
  {
    name: 'suggestions',
    type: 'InputSuggestion[]',
    description: 'Static suggestions to display.',
  },
  {
    name: 'onSuggestionRequest',
    type: '(query: string, trigger: "@" | "/") => Promise<InputSuggestion[]>',
    description: 'Async callback to fetch suggestions based on query.',
  },
  {
    name: 'savedPrompts',
    type: 'SavedPrompt[]',
    default: '[]',
    description: 'Array of saved prompts for @ mention autocomplete.',
  },
  {
    name: 'onPromptSelect',
    type: '(prompt: SavedPrompt) => void',
    description: 'Callback when a saved prompt is selected.',
  },
]

const fileUploadProps: PropDefinition[] = [
  {
    name: 'onFileUpload',
    type: '(files: File[]) => Promise<MessageAttachment[]>',
    description: 'Callback to handle file uploads, returns attachments.',
  },
  {
    name: 'maxFiles',
    type: 'number',
    default: '5',
    description: 'Maximum number of files allowed.',
  },
  {
    name: 'acceptedFileTypes',
    type: 'string[]',
    default: '["image/*", "application/pdf", ".txt", ".doc", ".docx"]',
    description: 'Array of accepted file types (MIME types or extensions).',
  },
  {
    name: 'onLinkPaste',
    type: '(url: string) => Promise<{title: string; description?: string; image?: string}>',
    description: 'Callback to generate link preview when URL is pasted.',
  },
]

const displayProps: PropDefinition[] = [
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for styling.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { AdvancedChatInput } from '@clarity-chat/react'
import type { AdvancedChatInputProps, InputSuggestion } from '@clarity-chat/react'`

const basicUsageCode = `import { useState } from 'react'
import { AdvancedChatInput } from '@clarity-chat/react'

export function ChatInterface() {
  const [input, setInput] = useState('')

  const handleSubmit = (value: string, attachments) => {
    console.log('Sending:', value)
    if (attachments) {
      console.log('Attachments:', attachments)
    }
    setInput('')
  }

  return (
    <AdvancedChatInput
      value={input}
      onChange={setInput}
      onSubmit={handleSubmit}
      placeholder="Type a message..."
    />
  )
}`

const slashCommandsCode = `import { AdvancedChatInput } from '@clarity-chat/react'

const commands = [
  { id: '1', type: 'command', label: 'help', description: 'Show help', value: '/help' },
  { id: '2', type: 'command', label: 'clear', description: 'Clear chat', value: '/clear' },
  { id: '3', type: 'command', label: 'export', description: 'Export chat', value: '/export' },
  { id: '4', type: 'command', label: 'model', description: 'Switch model', value: '/model' },
]

export function ChatWithCommands() {
  const [input, setInput] = useState('')

  const handleSuggestionRequest = async (query: string, trigger: '@' | '/') => {
    if (trigger === '/') {
      // Filter commands based on query
      return commands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
      )
    }
    return []
  }

  return (
    <AdvancedChatInput
      value={input}
      onChange={setInput}
      onSubmit={(value) => handleCommand(value)}
      onSuggestionRequest={handleSuggestionRequest}
    />
  )
}`

const mentionsCode = `import { AdvancedChatInput } from '@clarity-chat/react'

const savedPrompts = [
  { id: '1', name: 'summarize', description: 'Summarize text', content: 'Please summarize:' },
  { id: '2', name: 'explain', description: 'Explain concept', content: 'Please explain:' },
  { id: '3', name: 'analyze', description: 'Analyze data', content: 'Please analyze:' },
]

export function ChatWithMentions() {
  const [input, setInput] = useState('')

  const handlePromptSelect = (prompt: SavedPrompt) => {
    console.log('Selected prompt:', prompt)
    // Optionally auto-insert prompt content
    setInput(prev => prev + ' ' + prompt.content)
  }

  return (
    <AdvancedChatInput
      value={input}
      onChange={setInput}
      onSubmit={(value) => sendMessage(value)}
      savedPrompts={savedPrompts}
      onPromptSelect={handlePromptSelect}
      placeholder="Type @ to see saved prompts"
    />
  )
}`

const fileUploadCode = `import { AdvancedChatInput } from '@clarity-chat/react'
import type { MessageAttachment } from '@clarity-chat/types'

export function ChatWithFiles() {
  const [input, setInput] = useState('')

  const handleFileUpload = async (files: File[]): Promise<MessageAttachment[]> => {
    // Upload files to your server
    const uploadedAttachments = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const { url } = await response.json()

        return {
          id: crypto.randomUUID(),
          type: file.type.startsWith('image/') ? 'image' : 'document',
          name: file.name,
          size: file.size,
          mimeType: file.type,
          url,
        }
      })
    )

    return uploadedAttachments
  }

  return (
    <AdvancedChatInput
      value={input}
      onChange={setInput}
      onSubmit={(value, attachments) => {
        sendMessage(value, attachments)
      }}
      onFileUpload={handleFileUpload}
      maxFiles={5}
      acceptedFileTypes={['image/*', 'application/pdf', '.txt']}
    />
  )
}`

const typescriptCode = `// AdvancedChatInput props
interface AdvancedChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string, attachments?: MessageAttachment[]) => void

  // Autocomplete
  suggestions?: InputSuggestion[]
  onSuggestionRequest?: (
    query: string,
    trigger: '@' | '/'
  ) => Promise<InputSuggestion[]>

  // File upload
  onFileUpload?: (files: File[]) => Promise<MessageAttachment[]>
  maxFiles?: number
  acceptedFileTypes?: string[]

  // Link preview
  onLinkPaste?: (
    url: string
  ) => Promise<{ title: string; description?: string; image?: string }>

  // Prompts
  savedPrompts?: SavedPrompt[]
  onPromptSelect?: (prompt: SavedPrompt) => void

  // State
  disabled?: boolean
  placeholder?: string
  maxLength?: number
  className?: string

  // React 19: ref as prop
  ref?: React.Ref<HTMLTextAreaElement>
}

// InputSuggestion type
interface InputSuggestion {
  id: string
  type: 'prompt' | 'command' | 'mention'
  label: string
  description?: string
  value: string
  icon?: string
}

// SavedPrompt type
interface SavedPrompt {
  id: string
  name: string
  description?: string
  content: string
}

// MessageAttachment type
interface MessageAttachment {
  id: string
  type: 'image' | 'document' | 'video' | 'audio'
  name: string
  size: number
  mimeType: string
  url: string
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function AdvancedChatInputPage() {
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
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      P1
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                AdvancedChatInput
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                A power-user chat input component with advanced features including slash commands,
                @ mentions, file attachments, autocomplete, debounced suggestion loading, and
                rich text capabilities. Perfect for professional chat interfaces that need
                sophisticated input handling.
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
                {
                  icon: Command,
                  label: 'Slash Commands',
                  desc: '/help, /clear, etc',
                },
                {
                  icon: AtSign,
                  label: 'Mentions',
                  desc: '@prompts autocomplete',
                },
                { icon: Paperclip, label: 'File Upload', desc: 'Drag & drop' },
                {
                  icon: Search,
                  label: 'Autocomplete',
                  desc: 'Smart suggestions',
                },
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
                  <code>AdvancedChatInput</code> is a feature-rich chat input component designed
                  for power users. It extends the basic ChatInput with advanced capabilities
                  like slash commands, mentions, file attachments, and intelligent autocomplete.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Slash Commands:</strong> Type <code>/</code> to trigger command
                    autocomplete with built-in defaults (help, clear, export, model)
                  </li>
                  <li>
                    <strong>Mentions/Prompts:</strong> Type <code>@</code> to access saved
                    prompts and templates with smart filtering
                  </li>
                  <li>
                    <strong>File Attachments:</strong> Drag & drop or click to attach files
                    (images, PDFs, documents) with preview
                  </li>
                  <li>
                    <strong>Smart Autocomplete:</strong> Context-aware suggestions with
                    debounced loading (150ms) for optimal performance
                  </li>
                  <li>
                    <strong>Character Counter:</strong> Optional max length with visual indicator
                  </li>
                  <li>
                    <strong>Keyboard Navigation:</strong> Full keyboard support with Tab/Enter
                    to select, arrow keys to navigate, Escape to dismiss
                  </li>
                  <li>
                    <strong>React 19 Ready:</strong> Uses ref as prop for better type inference
                  </li>
                  <li>
                    <strong>Performance Optimized:</strong> useTransition for non-blocking
                    updates, memoized callbacks, debounced suggestions
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <ul className="space-y-2">
                  <li>Professional chat interfaces with power users</li>
                  <li>Developer tools and IDEs</li>
                  <li>Support chat with canned responses</li>
                  <li>Collaborative tools with shared templates</li>
                  <li>Any application needing rich input features</li>
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
                Try the AdvancedChatInput component. Type <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs">@</kbd> for
                mentions or <kbd className="px-1.5 py-0.5 rounded bg-muted border text-xs">/</kbd> for commands to see autocomplete in action.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Basic setup with controlled input:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="ChatInterface.tsx"
                />
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection id="autocomplete-props" title="Autocomplete Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure autocomplete behavior:
                </p>
                <PropsTable props={autocompleteProps} />
              </SubSection>

              <SubSection id="file-upload-props" title="File Upload Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Handle file attachments:
                </p>
                <PropsTable props={fileUploadProps} />
              </SubSection>

              <SubSection id="display-props" title="Display Options">
                <p className="text-sm text-muted-foreground mb-4">
                  Visual customization:
                </p>
                <PropsTable props={displayProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Simple controlled input with submit handler:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicExample.tsx"
                />
              </SubSection>

              <SubSection id="example-slash-commands" title="With Slash Commands">
                <p className="text-muted-foreground mb-4">
                  Implement custom slash commands with autocomplete:
                </p>
                <CodeBlock
                  code={slashCommandsCode}
                  language="tsx"
                  filename="SlashCommandsExample.tsx"
                />
              </SubSection>

              <SubSection id="example-mentions" title="With Mentions & Autocomplete">
                <p className="text-muted-foreground mb-4">
                  Add saved prompts accessible via @ mentions:
                </p>
                <CodeBlock
                  code={mentionsCode}
                  language="tsx"
                  filename="MentionsExample.tsx"
                />
              </SubSection>

              <SubSection id="example-file-upload" title="With File Upload">
                <p className="text-muted-foreground mb-4">
                  Handle file attachments with drag & drop:
                </p>
                <CodeBlock
                  code={fileUploadCode}
                  language="tsx"
                  filename="FileUploadExample.tsx"
                />
              </SubSection>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
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
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Enter
                    </kbd>{' '}
                    - Submit message (when suggestions not open)
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Shift + Enter
                    </kbd>{' '}
                    - New line in message
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Tab
                    </kbd>{' '}
                    or{' '}
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Enter
                    </kbd>{' '}
                    - Select highlighted suggestion
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Arrow Up/Down
                    </kbd>{' '}
                    - Navigate suggestions
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Escape
                    </kbd>{' '}
                    - Close suggestions dropdown
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    ARIA labels for all interactive elements
                  </li>
                  <li>
                    Suggestions dropdown marked with <code>role="listbox"</code>
                  </li>
                  <li>
                    Each suggestion has <code>role="option"</code> and{' '}
                    <code>aria-selected</code>
                  </li>
                  <li>
                    Loading states announced via aria-live
                  </li>
                  <li>
                    File attachments have descriptive labels
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Reduced Motion
                </h4>
                <p>
                  Respects <code>prefers-reduced-motion</code>. When enabled,
                  animations are replaced with instant transitions using static
                  divs instead of Framer Motion components.
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
                        Suggestions not showing
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure <code>onSuggestionRequest</code> or{' '}
                          <code>savedPrompts</code> is provided
                        </li>
                        <li>Check that trigger character (@, /) is correctly typed</li>
                        <li>
                          Verify suggestions array has correct <code>InputSuggestion</code> shape
                        </li>
                        <li>Check browser console for errors</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        File upload not working
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Implement <code>onFileUpload</code> handler that returns{' '}
                          <code>Promise&lt;MessageAttachment[]&gt;</code>
                        </li>
                        <li>
                          Check <code>acceptedFileTypes</code> matches files being uploaded
                        </li>
                        <li>
                          Verify server endpoint accepts multipart/form-data
                        </li>
                        <li>Check file size limits on both client and server</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Performance issues with large suggestion lists
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Component already uses 150ms debouncing for suggestions
                        </li>
                        <li>
                          Limit suggestion results to top 10-20 most relevant
                        </li>
                        <li>
                          Implement server-side filtering for large datasets
                        </li>
                        <li>
                          Use <code>useTransition</code> (already implemented) for non-blocking updates
                        </li>
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
                    name: 'ChatInput',
                    type: 'component',
                    description: 'Basic chat input without advanced features',
                    href: '/reference/components/chat-input',
                  },
                  {
                    name: 'MentionInput',
                    type: 'component',
                    description: 'Input with @ mention autocomplete',
                    href: '/reference/components/mention-input',
                  },
                  {
                    name: 'StructuredInputBuilder',
                    type: 'component',
                    description: 'Visual builder for structured inputs',
                    href: '/reference/components/structured-input-builder',
                  },
                  {
                    name: 'FileUpload',
                    type: 'component',
                    description: 'Standalone file upload component',
                    href: '/reference/components/file-upload',
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
                  href="/reference/components/chat-input"
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
                      ChatInput
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/mention-input"
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
                      MentionInput
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

'use client'

/**
 * ChatInput Component - API Reference Documentation
 *
 * A mid-level composable input component for chat interfaces with character counting,
 * validation, smooth animations, and keyboard shortcuts.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Copy,
  Check,
  ChevronRight,
  Keyboard,
  Upload,
  Mic,
  Send,
  AlertTriangle,
  Zap,
  Type,
  Command,
  Maximize2,
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
  const [inputValue, setInputValue] = React.useState('')
  const [messages, setMessages] = React.useState<string[]>([])
  const [maxLength, setMaxLength] = React.useState<number>(500)
  const [showCharCounter, setShowCharCounter] = React.useState(true)
  const [animateHeight, setAnimateHeight] = React.useState(true)
  const [glowOnFocus, setGlowOnFocus] = React.useState(true)

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return
    setMessages((prev) => [...prev, value])
    setInputValue('')
    // Simulate response
    setTimeout(() => {
      setMessages((prev) => [...prev, `Echo: ${value}`])
    }, 500)
  }

  const charCount = inputValue.length
  const isNearLimit = charCount >= maxLength * 0.8
  const isOverLimit = charCount > maxLength

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <span>Max Length:</span>
          <input
            type="number"
            value={maxLength}
            onChange={(e) => setMaxLength(Number(e.target.value))}
            className="w-20 px-2 py-1 rounded border border-border/50 bg-background"
            min={10}
            max={2000}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showCharCounter}
            onChange={(e) => setShowCharCounter(e.target.checked)}
            className="rounded"
          />
          Show Counter
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={animateHeight}
            onChange={(e) => setAnimateHeight(e.target.checked)}
            className="rounded"
          />
          Animate Height
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={glowOnFocus}
            onChange={(e) => setGlowOnFocus(e.target.checked)}
            className="rounded"
          />
          Focus Glow
        </label>
        <button
          onClick={() => {
            setMessages([])
            setInputValue('')
          }}
          className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted/50"
        >
          Clear
        </button>
      </div>

      {/* Demo Component */}
      <div className="relative rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Messages Area */}
        <div className="h-40 overflow-y-auto p-4 space-y-2 bg-background/50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Send a message to get started</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: durations.normal }}
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2 text-sm',
                  index % 2 === 0
                    ? 'ml-auto bg-brand-500 text-white'
                    : 'bg-muted/50 text-foreground'
                )}
              >
                {msg}
              </motion.div>
            ))
          )}
        </div>

        {/* ChatInput Component */}
        <div className="border-t border-border/50 p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(inputValue)
                  }
                }}
                placeholder="Type a message..."
                maxLength={maxLength}
                className={cn(
                  'w-full px-3 py-2 rounded-lg border border-border/50',
                  'bg-background text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                  'resize-none',
                  isOverLimit && 'border-destructive focus:ring-destructive/50'
                )}
                rows={1}
                style={{
                  minHeight: '44px',
                  maxHeight: '120px',
                }}
              />

              {/* Character Counter */}
              {showCharCounter && charCount > 0 && (
                <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
                  <div className="w-16 h-1 bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all',
                        isOverLimit
                          ? 'bg-destructive'
                          : isNearLimit
                            ? 'bg-amber-500'
                            : 'bg-primary'
                      )}
                      style={{
                        width: `${Math.min((charCount / maxLength) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div
                    className={cn(
                      'text-xs',
                      isOverLimit
                        ? 'text-destructive font-semibold'
                        : isNearLimit
                          ? 'text-amber-600 font-medium'
                          : 'text-muted-foreground'
                    )}
                  >
                    {charCount}/{maxLength}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleSubmit(inputValue)}
              disabled={!inputValue.trim() || isOverLimit}
              className={cn(
                'p-3 rounded-lg transition-all',
                inputValue.trim() && !isOverLimit
                  ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-md'
                  : 'bg-muted/50 text-muted-foreground'
              )}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {isOverLimit && (
            <p className="text-xs text-destructive mt-2">
              Message exceeds maximum length by {charCount - maxLength}{' '}
              characters
            </p>
          )}
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
      { id: 'validation-props', title: 'Validation' },
      { id: 'animation-props', title: 'Animation' },
      { id: 'accessibility-props', title: 'Accessibility' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-character-limit', title: 'With Character Limit' },
      { id: 'example-multiline', title: 'Multiline Support' },
      { id: 'example-async', title: 'Async Submission' },
    ],
  },
  { id: 'keyboard-shortcuts', title: 'Keyboard Shortcuts' },
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
    description: 'Current input value (controlled component).',
  },
  {
    name: 'onChange',
    type: '(value: string) => void',
    required: true,
    description: 'Callback when input value changes.',
  },
  {
    name: 'onSubmit',
    type: '(value: string) => void | Promise<void>',
    required: true,
    description:
      'Callback when form is submitted (Enter key or button click).',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: "'Type a message...'",
    description: 'Placeholder text shown when input is empty.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the input and submit button.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container.',
  },
]

const validationProps: PropDefinition[] = [
  {
    name: 'maxLength',
    type: 'number',
    description:
      'Maximum character length. Enables validation and character counter.',
  },
  {
    name: 'showCharCounter',
    type: 'boolean',
    default: 'true',
    description:
      'Show character counter (default: true if maxLength is set).',
  },
  {
    name: 'warningThreshold',
    type: 'number',
    default: '0.8',
    description:
      'Warning threshold percentage (default: 0.8 = 80%). Counter turns amber when reached.',
  },
]

const animationProps: PropDefinition[] = [
  {
    name: 'animateHeight',
    type: 'boolean',
    default: 'true',
    description: 'Enable smooth expand/contract animation as text wraps.',
  },
  {
    name: 'glowOnFocus',
    type: 'boolean',
    default: 'true',
    description: 'Enable focus ring glow animation.',
  },
]

const accessibilityProps: PropDefinition[] = [
  {
    name: 'id',
    type: 'string',
    description: 'HTML id attribute for skip link targeting.',
  },
  {
    name: 'aria-label',
    type: 'string',
    description: 'ARIA label for screen readers.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { ChatInput } from '@clarity-chat/react'
import type { ChatInputProps } from '@clarity-chat/react'`

const basicUsageCode = `import { ChatInput } from '@clarity-chat/react'
import { useState } from 'react'

function MyChatInput() {
  const [value, setValue] = useState('')

  const handleSubmit = (text: string) => {
    console.log('Sending:', text)
    // Send message to your API
    setValue('') // Clear input after sending
  }

  return (
    <ChatInput
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      placeholder="Type your message..."
    />
  )
}`

const characterLimitCode = `import { ChatInput } from '@clarity-chat/react'
import { useState } from 'react'

function LimitedInput() {
  const [value, setValue] = useState('')

  return (
    <ChatInput
      value={value}
      onChange={setValue}
      onSubmit={(text) => console.log(text)}
      maxLength={500}
      showCharCounter
      warningThreshold={0.9} // Warn at 90%
    />
  )
}`

const multilineCode = `import { ChatInput } from '@clarity-chat/react'
import { useState } from 'react'

function MultilineInput() {
  const [value, setValue] = useState('')

  return (
    <ChatInput
      value={value}
      onChange={setValue}
      onSubmit={(text) => console.log(text)}
      placeholder="Type a message... (Shift+Enter for new line)"
    />
  )
}

// Keyboard shortcuts:
// - Enter: Submit message
// - Shift+Enter: New line`

const asyncSubmitCode = `import { ChatInput } from '@clarity-chat/react'
import { useState } from 'react'

function AsyncInput() {
  const [value, setValue] = useState('')

  const handleSubmit = async (text: string) => {
    try {
      // Show loading state automatically
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Show success state, then clear
      setValue('')
    } catch (error) {
      // Show error state automatically
      console.error('Send failed:', error)
    }
  }

  return (
    <ChatInput
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      disabled={false} // Or disable during loading
    />
  )
}`

const typescriptCode = `// ChatInput props
interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void | Promise<void>
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  showCharCounter?: boolean
  warningThreshold?: number
  animateHeight?: boolean
  glowOnFocus?: boolean
  className?: string
  id?: string
  'aria-label'?: string
}

// Usage with TypeScript
import type { ChatInputProps } from '@clarity-chat/react'

const props: ChatInputProps = {
  value: '',
  onChange: (v) => console.log(v),
  onSubmit: async (v) => {
    await sendMessage(v)
  },
  maxLength: 1000,
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function ChatInputPage() {
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
                <div className="p-2.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
                  <MessageSquare className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Mid-Level
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                ChatInput
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                A composable input component for chat interfaces with character
                counting, validation, smooth animations, and keyboard shortcuts.
                Auto-resizes as users type and provides visual feedback for
                character limits.
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
                  icon: Keyboard,
                  label: 'Keyboard Shortcuts',
                  desc: 'Enter to send',
                },
                {
                  icon: Type,
                  label: 'Auto-resize',
                  desc: 'Grows with text',
                },
                {
                  icon: Zap,
                  label: 'Validation',
                  desc: 'Character limits',
                },
                {
                  icon: Maximize2,
                  label: 'Multiline',
                  desc: 'Shift+Enter',
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
                  <code>ChatInput</code> is a mid-level component that provides
                  a polished input experience for chat interfaces. It handles
                  character counting, validation, animations, and keyboard
                  shortcuts while maintaining full accessibility.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Character Counter:</strong> Visual progress bar and
                    count with warning thresholds
                  </li>
                  <li>
                    <strong>Auto-resizing:</strong> Textarea grows automatically
                    as text wraps
                  </li>
                  <li>
                    <strong>Smooth Animations:</strong> Height expansion, focus
                    glow, button states
                  </li>
                  <li>
                    <strong>Keyboard Shortcuts:</strong> Enter to submit,
                    Shift+Enter for newline
                  </li>
                  <li>
                    <strong>Validation:</strong> Max length enforcement with
                    visual feedback
                  </li>
                  <li>
                    <strong>Async Support:</strong> Handles async submissions
                    with loading states
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <ul className="space-y-2">
                  <li>Building custom chat interfaces</li>
                  <li>Need input with character counting and validation</li>
                  <li>Want smooth animations and polished UX</li>
                  <li>Require keyboard shortcut support</li>
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
                Try the ChatInput component. Adjust settings to see character
                counting, validation, and animations in action.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  ChatInput is a controlled component that requires{' '}
                  <code>value</code>, <code>onChange</code>, and{' '}
                  <code>onSubmit</code> props:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="ChatInput.tsx"
                />
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection id="validation-props" title="Validation Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Control character counting and validation:
                </p>
                <PropsTable props={validationProps} />
              </SubSection>

              <SubSection id="animation-props" title="Animation Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure animations (respects prefers-reduced-motion):
                </p>
                <PropsTable props={animationProps} />
              </SubSection>

              <SubSection id="accessibility-props" title="Accessibility Props">
                <p className="text-sm text-muted-foreground mb-4">
                  ARIA attributes for screen readers:
                </p>
                <PropsTable props={accessibilityProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Simple controlled input with submit handling:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicChatInput.tsx"
                />
              </SubSection>

              <SubSection id="example-character-limit" title="With Character Limit">
                <p className="text-muted-foreground mb-4">
                  Add character counting with custom warning threshold:
                </p>
                <CodeBlock
                  code={characterLimitCode}
                  language="tsx"
                  filename="LimitedInput.tsx"
                />
              </SubSection>

              <SubSection id="example-multiline" title="Multiline Support">
                <p className="text-muted-foreground mb-4">
                  Use Shift+Enter for new lines, Enter to submit:
                </p>
                <CodeBlock
                  code={multilineCode}
                  language="tsx"
                  filename="MultilineInput.tsx"
                />
              </SubSection>

              <SubSection id="example-async" title="Async Submission">
                <p className="text-muted-foreground mb-4">
                  Handle async submissions with automatic state management:
                </p>
                <CodeBlock
                  code={asyncSubmitCode}
                  language="tsx"
                  filename="AsyncInput.tsx"
                />
              </SubSection>
            </Section>

            {/* Keyboard Shortcuts Section */}
            <Section id="keyboard-shortcuts" title="Keyboard Shortcuts">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Keyboard className="w-5 h-5" aria-hidden="true" />
                    Built-in Shortcuts
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono">
                        Enter
                      </kbd>
                      <div>
                        <p className="text-sm font-medium">Submit Message</p>
                        <p className="text-xs text-muted-foreground">
                          Submit the message if input has content and is under
                          maxLength
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono">
                        Shift + Enter
                      </kbd>
                      <div>
                        <p className="text-sm font-medium">New Line</p>
                        <p className="text-xs text-muted-foreground">
                          Insert a line break without submitting
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> When input exceeds maxLength and you
                    press Enter, the textarea will shake to provide visual
                    feedback instead of submitting.
                  </p>
                </div>
              </div>
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
                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Tab
                    </kbd>{' '}
                    - Focus input field
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Enter
                    </kbd>{' '}
                    - Submit message
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Shift + Enter
                    </kbd>{' '}
                    - Insert new line
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    Textarea has <code>aria-label</code> for identification
                  </li>
                  <li>
                    Button states announced (loading, success, error)
                  </li>
                  <li>
                    Character counter has <code>role="status"</code> and{' '}
                    <code>aria-live="polite"</code>
                  </li>
                  <li>
                    Error messages use <code>aria-live="assertive"</code>
                  </li>
                  <li>
                    Disabled state announced with <code>aria-disabled</code>
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Reduced Motion
                </h4>
                <p>
                  Respects <code>prefers-reduced-motion</code>. When enabled:
                </p>
                <ul className="space-y-2">
                  <li>No height expansion animations</li>
                  <li>No focus glow animations</li>
                  <li>No button state transitions</li>
                  <li>Simple fade-in for character counter</li>
                </ul>
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
                        Input not submitting
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Check that input has content (whitespace is trimmed)</li>
                        <li>Verify character count is under maxLength</li>
                        <li>Ensure input is not disabled</li>
                        <li>Check that onSubmit is defined</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Character counter not showing
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Ensure maxLength prop is set</li>
                        <li>Check that showCharCounter is true (default)</li>
                        <li>Counter only shows when charCount greater than 0</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Animations not working
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Check that user has not enabled prefers-reduced-motion</li>
                        <li>Verify animateHeight and glowOnFocus are true</li>
                        <li>Ensure framer-motion is installed</li>
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
                    name: 'ChatWindow',
                    type: 'component',
                    description:
                      'Complete chat UI with input and message list',
                    href: '/reference/components/chat-window',
                  },
                  {
                    name: 'AdvancedChatInput',
                    type: 'component',
                    description:
                      'Extended input with file upload and voice input',
                    href: '/reference/components/advanced-chat-input',
                  },
                  {
                    name: 'VoiceInput',
                    type: 'component',
                    description: 'Voice recording component for chat input',
                    href: '/reference/components/voice-input',
                  },
                  {
                    name: 'FileUpload',
                    type: 'component',
                    description: 'File attachment component for messages',
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
                  href="/reference/components/message-list"
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
                      MessageList
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/advanced-chat-input"
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
                      AdvancedChatInput
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

'use client'

/**
 * VoiceInput Component - API Reference Documentation
 *
 * A robust voice input component with Web Speech API support,
 * real-time transcription, multi-language support, and visual feedback.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Globe,
  Shield,
  Accessibility,
  Play,
  AlertTriangle,
  HelpCircle,
  Keyboard,
  Radio,
  Waves,
  MessageSquare,
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
  const [transcript, setTranscript] = React.useState('')
  const [isListening, setIsListening] = React.useState(false)
  const [lang, setLang] = React.useState('en-US')
  const [autoSubmit, setAutoSubmit] = React.useState(true)
  const [showInterim, setShowInterim] = React.useState(true)
  const [permissionGranted, setPermissionGranted] = React.useState<
    boolean | null
  >(null)

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      setPermissionGranted(true)
    } catch (error) {
      setPermissionGranted(false)
    }
  }

  const simulateListening = () => {
    setIsListening(true)
    setTranscript('This is a simulated voice transcript...')
    setTimeout(() => {
      setIsListening(false)
      setTranscript('This is a simulated voice transcript. Voice input works!')
    }, 3000)
  }

  return (
    <div className="space-y-4">
      {/* Permission Notice */}
      {permissionGranted === null && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Mic className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Microphone Permission Required
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Voice input requires microphone access. Click below to grant
                permission.
              </p>
              <button
                onClick={requestPermission}
                className="text-sm px-4 py-2 rounded bg-brand-500 text-white hover:bg-brand-600 transition-colors"
              >
                Request Permission
              </button>
            </div>
          </div>
        </div>
      )}

      {permissionGranted === false && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Permission Denied
              </h4>
              <p className="text-sm text-muted-foreground">
                Please allow microphone access in your browser settings to use
                voice input.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="rounded px-2 py-1 bg-background border border-border"
          >
            <option value="en-US">English (US)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="ja-JP">Japanese</option>
            <option value="zh-CN">Chinese</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoSubmit}
            onChange={(e) => setAutoSubmit(e.target.checked)}
            className="rounded"
          />
          Auto-submit
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showInterim}
            onChange={(e) => setShowInterim(e.target.checked)}
            className="rounded"
          />
          Show interim
        </label>
        <button
          onClick={() => setTranscript('')}
          className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted/50"
        >
          Clear
        </button>
      </div>

      {/* Demo Component */}
      <div className="relative rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">VoiceInput Demo</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {lang.split('-')[0].toUpperCase()}
          </span>
        </div>

        {/* Voice Input Area */}
        <div className="p-6 space-y-4 bg-background/50 min-h-[200px] flex flex-col items-center justify-center">
          {/* Voice Button */}
          <button
            onClick={simulateListening}
            disabled={isListening}
            className={cn(
              'relative w-16 h-16 rounded-full transition-all duration-200',
              'flex items-center justify-center',
              isListening
                ? 'bg-destructive text-destructive-foreground shadow-[0_0_20px_-4px_hsl(var(--destructive)/0.5)] scale-105'
                : 'bg-muted text-foreground hover:scale-105 hover:bg-muted/80'
            )}
            aria-label={isListening ? 'Stop recording' : 'Start voice input'}
          >
            {isListening ? (
              <div className="flex items-center gap-1">
                <div className="w-1 h-6 bg-current rounded-full animate-pulse" />
                <div className="w-1 h-6 bg-current rounded-full animate-pulse delay-75" />
              </div>
            ) : (
              <Mic className="w-6 h-6" />
            )}

            {/* Pulse rings when listening */}
            {isListening && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full bg-destructive"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-destructive"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: 0.5,
                  }}
                />
              </>
            )}
          </button>

          {/* Status */}
          <div className="text-center">
            {isListening ? (
              <p className="text-sm text-destructive font-medium flex items-center gap-2">
                <Radio className="w-4 h-4 animate-pulse" />
                Listening...
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click microphone to start
              </p>
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-4 bg-muted/30 border border-border/40 rounded-xl"
            >
              <p className="text-sm text-foreground">{transcript}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Browser Support Note */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
        <h4 className="text-sm font-semibold text-foreground mb-2">
          Browser Support
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Chrome/Edge</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Safari (iOS 14.5+)</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Firefox (not supported)</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Mobile browsers (limited)</span>
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
      { id: 'callback-props', title: 'Callback Props' },
      { id: 'display-props', title: 'Display Options' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-multilingual', title: 'Multi-language' },
      { id: 'example-inline', title: 'Inline Integration' },
    ],
  },
  { id: 'browser-support', title: 'Browser Support' },
  { id: 'permissions', title: 'Permission Handling' },
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
    name: 'onTranscript',
    type: '(transcript: string) => void',
    required: true,
    description: 'Callback when transcript is finalized.',
  },
  {
    name: 'lang',
    type: 'string',
    default: "'en-US'",
    description:
      "Language code for speech recognition (e.g., 'en-US', 'es-ES', 'fr-FR').",
  },
  {
    name: 'showInterim',
    type: 'boolean',
    default: 'true',
    description: 'Show real-time interim results as user speaks.',
  },
  {
    name: 'autoSubmit',
    type: 'boolean',
    default: 'true',
    description:
      'Automatically submit transcript when speech ends (after 2 second pause).',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Button size.',
  },
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'ghost'",
    default: "'ghost'",
    description: 'Button variant style.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable voice input.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container.',
  },
]

const callbackProps: PropDefinition[] = [
  {
    name: 'onStart',
    type: '() => void',
    description: 'Callback when listening starts.',
  },
  {
    name: 'onStop',
    type: '() => void',
    description: 'Callback when listening stops.',
  },
  {
    name: 'onError',
    type: '(error: string) => void',
    description: 'Callback on error (permission denied, no speech, etc.).',
  },
]

const displayProps: PropDefinition[] = [
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Custom icon when not listening (default: microphone icon).',
  },
  {
    name: 'listeningIcon',
    type: 'ReactNode',
    description: 'Custom icon when listening (default: pause icon).',
  },
  {
    name: 'showTooltip',
    type: 'boolean',
    default: 'true',
    description: 'Show tooltip on hover.',
  },
  {
    name: 'tooltipText',
    type: 'string',
    default: "'Click to speak'",
    description: 'Tooltip text.',
  },
]

const inlineProps: PropDefinition[] = [
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
    description: 'Callback when value changes.',
  },
  {
    name: 'lang',
    type: 'string',
    default: "'en-US'",
    description: 'Language code.',
  },
  {
    name: 'position',
    type: "'inside' | 'outside'",
    default: "'inside'",
    description: 'Position relative to input field.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { VoiceInput, InlineVoiceInput } from '@clarity-chat/react'
import type { VoiceInputProps, InlineVoiceInputProps } from '@clarity-chat/react'`

const basicUsageCode = `import { VoiceInput } from '@clarity-chat/react'

function ChatWithVoice() {
  const handleVoiceInput = (transcript: string) => {
    console.log('Voice input:', transcript)
    sendMessage(transcript)
  }

  return (
    <VoiceInput
      onTranscript={handleVoiceInput}
      showInterim={true}
      autoSubmit={true}
    />
  )
}`

const multilingualCode = `import { VoiceInput } from '@clarity-chat/react'
import { useState } from 'react'

function MultilingualVoice() {
  const [lang, setLang] = useState('en-US')

  const handleVoiceInput = (transcript: string) => {
    console.log(\`[\${lang}] Voice input:\`, transcript)
  }

  return (
    <div className="space-y-4">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="rounded px-3 py-2 border"
      >
        <option value="en-US">English (US)</option>
        <option value="es-ES">Español</option>
        <option value="fr-FR">Français</option>
        <option value="de-DE">Deutsch</option>
        <option value="ja-JP">日本語</option>
        <option value="zh-CN">中文</option>
      </select>

      <VoiceInput
        onTranscript={handleVoiceInput}
        lang={lang}
        tooltipText={\`Speak in \${lang.split('-')[0]}\`}
      />
    </div>
  )
}`

const inlineCode = `import { InlineVoiceInput } from '@clarity-chat/react'
import { useState } from 'react'

function ChatInput() {
  const [message, setMessage] = useState('')

  return (
    <div className="relative">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type or speak your message..."
        className="w-full px-4 py-2 pr-12 rounded-lg border"
      />

      <InlineVoiceInput
        value={message}
        onChange={setMessage}
        position="inside"
        lang="en-US"
      />
    </div>
  )
}`

const callbacksCode = `import { VoiceInput } from '@clarity-chat/react'

function VoiceWithCallbacks() {
  const handleStart = () => {
    console.log('Started listening')
    // Show recording indicator
  }

  const handleStop = () => {
    console.log('Stopped listening')
    // Hide recording indicator
  }

  const handleError = (error: string) => {
    console.error('Voice input error:', error)
    // Show error notification
    if (error.includes('permission denied')) {
      showPermissionDialog()
    }
  }

  const handleTranscript = (transcript: string) => {
    console.log('Final transcript:', transcript)
    sendMessage(transcript)
  }

  return (
    <VoiceInput
      onTranscript={handleTranscript}
      onStart={handleStart}
      onStop={handleStop}
      onError={handleError}
    />
  )
}`

const typescriptCode = `// VoiceInput props
interface VoiceInputProps {
  onTranscript: (transcript: string) => void
  lang?: string // default: 'en-US'
  showInterim?: boolean // default: true
  autoSubmit?: boolean // default: true
  size?: 'sm' | 'md' | 'lg' // default: 'md'
  variant?: 'primary' | 'secondary' | 'ghost' // default: 'ghost'
  icon?: ReactNode
  listeningIcon?: ReactNode
  showTooltip?: boolean // default: true
  tooltipText?: string // default: 'Click to speak'
  disabled?: boolean // default: false
  className?: string
  onStart?: () => void
  onStop?: () => void
  onError?: (error: string) => void
}

// InlineVoiceInput props
interface InlineVoiceInputProps {
  value: string
  onChange: (value: string) => void
  lang?: string // default: 'en-US'
  position?: 'inside' | 'outside' // default: 'inside'
  className?: string
}

// useVoiceInput hook
interface UseVoiceInputOptions {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  maxAlternatives?: number
  autoStopTimeout?: number
  onTranscript?: (transcript: string, isFinal: boolean) => void
  onSpeechStart?: () => void
  onSpeechEnd?: () => void
  onError?: (error: string) => void
}

interface VoiceInputState {
  isListening: boolean
  transcript: string
  finalTranscript: string
  interimTranscript: string
  isSupported: boolean
  error: string | null
  confidence: number
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function VoiceInputPage() {
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
                  <Mic className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Input Component
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                VoiceInput
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                A robust voice input component with Web Speech API
                support, real-time transcription, visual feedback, multi-language
                support, and accessibility features. Enables hands-free chat
                interaction with animated pulse effects and confidence scoring.
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
                  icon: Mic,
                  label: 'Voice Recognition',
                  desc: 'Web Speech API',
                },
                {
                  icon: Globe,
                  label: 'Multi-language',
                  desc: '50+ languages',
                },
                {
                  icon: Waves,
                  label: 'Visual Feedback',
                  desc: 'Pulse animations',
                },
                {
                  icon: Accessibility,
                  label: 'Accessible',
                  desc: 'WCAG 2.1 AA',
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
                  <code>VoiceInput</code> is a robust component that
                  enables speech-to-text input for chat applications. It uses the
                  Web Speech API for real-time transcription with visual
                  feedback, error handling, and accessibility features.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Real-time Transcription:</strong> Shows interim
                    results as the user speaks with confidence scores
                  </li>
                  <li>
                    <strong>Multi-language Support:</strong> Supports 50+
                    languages including English, Spanish, French, German,
                    Japanese, Chinese, and more
                  </li>
                  <li>
                    <strong>Visual Feedback:</strong> Animated pulse rings and
                    waveform visualization during recording
                  </li>
                  <li>
                    <strong>Auto-submit:</strong> Automatically submits
                    transcript after 2 seconds of silence
                  </li>
                  <li>
                    <strong>Permission Handling:</strong> Gracefully handles
                    microphone permission requests and denials
                  </li>
                  <li>
                    <strong>Error Recovery:</strong> User-friendly error messages
                    for common issues (no speech, network error, etc.)
                  </li>
                  <li>
                    <strong>Reduced Motion:</strong> Respects{' '}
                    <code>prefers-reduced-motion</code> for accessibility
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">Use Cases</h4>
                <ul className="space-y-2">
                  <li>Voice message input in chat applications</li>
                  <li>Hands-free interaction for mobile users</li>
                  <li>Accessibility feature for users with typing difficulties</li>
                  <li>Multi-language customer support</li>
                  <li>Voice commands and dictation</li>
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

                <p className="text-muted-foreground">Import the components:</p>

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
                Try the VoiceInput component. Click the microphone to start
                voice input. Toggle settings to see different behaviors.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  VoiceInput requires a callback to receive the transcribed text:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="ChatWithVoice.tsx"
                />
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection id="callback-props" title="Callback Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Optional callbacks for lifecycle events:
                </p>
                <PropsTable props={callbackProps} />
              </SubSection>

              <SubSection id="display-props" title="Display Options">
                <p className="text-sm text-muted-foreground mb-4">
                  Customize the appearance:
                </p>
                <PropsTable props={displayProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Simple voice input with transcript callback:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicVoice.tsx"
                />
              </SubSection>

              <SubSection id="example-multilingual" title="Multi-language Support">
                <p className="text-muted-foreground mb-4">
                  Support multiple languages with a language selector:
                </p>
                <CodeBlock
                  code={multilingualCode}
                  language="tsx"
                  filename="MultilingualVoice.tsx"
                />
              </SubSection>

              <SubSection id="example-inline" title="Inline Integration">
                <p className="text-muted-foreground mb-4">
                  Integrate voice input inside a text input field:
                </p>
                <CodeBlock
                  code={inlineCode}
                  language="tsx"
                  filename="InlineVoice.tsx"
                />
              </SubSection>

              <SubSection id="example-callbacks" title="With Callbacks">
                <p className="text-muted-foreground mb-4">
                  Handle lifecycle events and errors:
                </p>
                <CodeBlock
                  code={callbacksCode}
                  language="tsx"
                  filename="VoiceWithCallbacks.tsx"
                />
              </SubSection>
            </Section>

            {/* Browser Support Section */}
            <Section id="browser-support" title="Browser Support">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  VoiceInput uses the Web Speech API, which has varying support
                  across browsers:
                </p>

                <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
                  <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-500/10">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      Fully Supported
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✅ Chrome 25+ (Desktop & Mobile)</li>
                      <li>✅ Edge 79+ (Desktop & Mobile)</li>
                      <li>✅ Safari 14.1+ (macOS 14.3+)</li>
                      <li>✅ Safari iOS 14.5+</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-500/10">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      Limited or No Support
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>❌ Firefox (not yet supported)</li>
                      <li>❌ Firefox Mobile</li>
                      <li>⚠️ Samsung Internet (partial)</li>
                      <li>⚠️ Opera Mobile (partial)</li>
                    </ul>
                  </div>
                </div>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Detection & Fallback
                </h4>
                <p>
                  VoiceInput automatically detects browser support and shows a
                  message if the Web Speech API is not available:
                </p>
                <CodeBlock
                  code={`const voice = useVoiceInput()

if (!voice.isSupported) {
  return (
    <div className="text-sm text-muted-foreground">
      Voice input not supported in this browser
    </div>
  )
}`}
                  language="tsx"
                  filename="SupportCheck.tsx"
                  showDownloadButton={false}
                />
              </div>
            </Section>

            {/* Permission Handling Section */}
            <Section id="permissions" title="Permission Handling">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  VoiceInput requires microphone permission. The component handles
                  permission requests and provides clear error messages:
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Permission States
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Granted:</strong> Voice input works normally
                  </li>
                  <li>
                    <strong>Denied:</strong> Shows "Microphone permission denied"
                    error
                  </li>
                  <li>
                    <strong>Prompt:</strong> Browser shows permission dialog on
                    first use
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Error Handling
                </h4>
                <p>Common errors and their handling:</p>
                <ul className="space-y-2">
                  <li>
                    <code>not-allowed</code>: Permission denied by user
                  </li>
                  <li>
                    <code>no-speech</code>: No speech detected
                  </li>
                  <li>
                    <code>audio-capture</code>: No microphone found
                  </li>
                  <li>
                    <code>network</code>: Network connection error
                  </li>
                </ul>
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
                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5" aria-hidden="true" />
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Enter
                    </kbd>{' '}
                    or{' '}
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Space
                    </kbd>{' '}
                    - Start/stop voice input
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Escape
                    </kbd>{' '}
                    - Cancel voice input
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Tab
                    </kbd>{' '}
                    - Navigate to/from voice button
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    Button has <code>aria-label</code> describing current state
                  </li>
                  <li>Announces "Start voice input" when ready</li>
                  <li>Announces "Stop recording" when listening</li>
                  <li>Error messages are announced via aria-live</li>
                  <li>Transcript updates announced in real-time</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Reduced Motion
                </h4>
                <p>
                  Respects <code>prefers-reduced-motion</code>. When enabled,
                  pulse animations are disabled and only essential visual feedback
                  is shown.
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
                        Voice input not working
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Check browser support (Chrome/Edge/Safari only)</li>
                        <li>Ensure microphone permission is granted</li>
                        <li>Verify microphone is not used by another app</li>
                        <li>Check browser console for errors</li>
                        <li>Try using HTTPS (required by some browsers)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Transcription accuracy issues
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Ensure quiet environment with minimal background noise</li>
                        <li>Speak clearly and at moderate pace</li>
                        <li>Select correct language code for your speech</li>
                        <li>Check microphone quality and positioning</li>
                        <li>
                          Review confidence scores (available in{' '}
                          <code>useVoiceInput</code> hook)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Auto-submit not working
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Verify <code>autoSubmit</code> prop is set to{' '}
                          <code>true</code>
                        </li>
                        <li>Wait 2 seconds of silence after speaking</li>
                        <li>Check that onTranscript callback is provided</li>
                        <li>
                          Manually stop recording if auto-stop doesn't trigger
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
                    description: 'Standard text input with send button',
                    href: '/reference/components/chat-input',
                  },
                  {
                    name: 'AdvancedChatInput',
                    type: 'component',
                    description:
                      'Rich input with file attachments and voice support',
                    href: '/reference/components/advanced-chat-input',
                  },
                  {
                    name: 'useVoiceInput',
                    type: 'hook',
                    description: 'Low-level hook for voice recognition',
                    href: '/reference/hooks/use-voice-input',
                  },
                  {
                    name: 'ChatWindow',
                    type: 'component',
                    description: 'Complete chat UI with integrated voice input',
                    href: '/reference/components/chat-window',
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

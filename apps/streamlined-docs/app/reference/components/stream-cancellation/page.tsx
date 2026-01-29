'use client'

/**
 * StreamCancellation Component - API Reference Documentation
 *
 * Provides UI controls for canceling streaming AI responses with optional
 * confirmation dialogs, abort controller integration, and graceful cleanup.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  XCircle,
  StopCircle,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Shield,
  Clock,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'
import { DocumentationPage } from '@/components/Docs/DocumentationPage'
import type { TocItem } from '@/components/Docs/TableOfContents'

// ISR Configuration
export const revalidate = 3600 // Revalidate every hour

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
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [streamContent, setStreamContent] = React.useState('')
  const [showConfirmation, setShowConfirmation] = React.useState(true)
  const [cancelButtonText, setCancelButtonText] = React.useState('Cancel')
  const [confirmationMessage, setConfirmationMessage] = React.useState(
    'Are you sure you want to cancel the streaming response?'
  )
  const [variant, setVariant] = React.useState<'default' | 'icon' | 'minimal'>('default')
  const [position, setPosition] = React.useState<'inline' | 'floating'>('inline')
  const [showDialog, setShowDialog] = React.useState(false)
  const abortControllerRef = React.useRef<AbortController | null>(null)

  const sampleText =
    'StreamCancellation provides a user-friendly way to stop streaming AI responses. It integrates seamlessly with AbortController and supports confirmation dialogs to prevent accidental cancellations. The component offers multiple variants and positions to fit your UI design, with smooth animations and accessibility features built-in.'

  const startStreaming = async () => {
    setStreamContent('')
    setIsStreaming(true)
    abortControllerRef.current = new AbortController()

    try {
      for (let i = 0; i <= sampleText.length; i += 3) {
        if (abortControllerRef.current?.signal.aborted) {
          break
        }
        setStreamContent(sampleText.slice(0, i))
        await new Promise((r) => setTimeout(r, 50))
      }
      setStreamContent(sampleText)
    } catch (error) {
      // Handle cancellation
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleCancel = () => {
    if (showConfirmation) {
      setShowDialog(true)
    } else {
      performCancel()
    }
  }

  const performCancel = () => {
    abortControllerRef.current?.abort()
    setIsStreaming(false)
    setShowDialog(false)
    setStreamContent(streamContent + ' [Cancelled]')
  }

  const cancelDialog = () => {
    setShowDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Variant
            </label>
            <div className="flex flex-wrap gap-2">
              {(['default', 'icon', 'minimal'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-sm font-medium transition-all capitalize',
                    variant === v
                      ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                      : 'border-border/50 hover:border-border hover:bg-muted/50'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Position
            </label>
            <div className="flex flex-wrap gap-2">
              {(['inline', 'floating'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPosition(p)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-sm font-medium transition-all capitalize',
                    position === p
                      ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                      : 'border-border/50 hover:border-border hover:bg-muted/50'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showConfirmation}
              onChange={(e) => setShowConfirmation(e.target.checked)}
              className="rounded"
            />
            Show Confirmation Dialog
          </label>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Cancel Button Text
            </label>
            <input
              type="text"
              value={cancelButtonText}
              onChange={(e) => setCancelButtonText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Confirmation Message
            </label>
            <input
              type="text"
              value={confirmationMessage}
              onChange={(e) => setConfirmationMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-sm"
            />
          </div>
        </div>

        <button
          onClick={startStreaming}
          disabled={isStreaming}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {isStreaming ? 'Streaming...' : 'Start Demo Stream'}
        </button>
      </div>

      {/* Demo Component */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StopCircle className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium">StreamCancellation Demo</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {streamContent.length} / {sampleText.length} characters
          </span>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[250px] bg-background/50 relative">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-foreground">
              {streamContent}
              {isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                  }}
                  className="inline-block ml-1"
                >
                  &#9612;
                </motion.span>
              )}
            </p>
          </div>

          {/* Cancel Button - Inline */}
          {isStreaming && position === 'inline' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4"
            >
              <button
                onClick={handleCancel}
                className={cn(
                  'inline-flex items-center gap-2 transition-all',
                  variant === 'default' &&
                    'px-4 py-2 rounded-lg bg-red-500/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-500/20',
                  variant === 'icon' &&
                    'p-2 rounded-lg bg-red-500/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-500/20',
                  variant === 'minimal' &&
                    'text-red-600 dark:text-red-400 hover:underline'
                )}
                aria-label={cancelButtonText}
              >
                {variant !== 'minimal' && <XCircle className="w-4 h-4" />}
                {variant !== 'icon' && (
                  <span className="text-sm font-medium">{cancelButtonText}</span>
                )}
              </button>
            </motion.div>
          )}

          {/* Cancel Button - Floating */}
          <AnimatePresence>
            {isStreaming && position === 'floating' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-4 right-4"
              >
                <button
                  onClick={handleCancel}
                  className={cn(
                    'inline-flex items-center gap-2 transition-all shadow-lg',
                    variant === 'default' &&
                      'px-4 py-2 rounded-full bg-red-500/10 backdrop-blur-sm border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-500/20',
                    variant === 'icon' &&
                      'p-3 rounded-full bg-red-500/10 backdrop-blur-sm border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-500/20',
                    variant === 'minimal' &&
                      'p-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-full'
                  )}
                  aria-label={cancelButtonText}
                >
                  {variant !== 'minimal' && <XCircle className="w-5 h-5" />}
                  {variant !== 'icon' && (
                    <span className="text-sm font-medium">{cancelButtonText}</span>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showDialog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelDialog}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Dialog */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-card border border-border/50 rounded-xl shadow-2xl max-w-md w-full p-6"
                role="dialog"
                aria-modal="true"
                aria-labelledby="cancel-dialog-title"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3
                      id="cancel-dialog-title"
                      className="text-lg font-semibold text-foreground mb-2"
                    >
                      Cancel Streaming
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {confirmationMessage}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={cancelDialog}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    Continue Streaming
                  </button>
                  <button
                    onClick={performCancel}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'onCancel',
    type: '() => void | Promise<void>',
    required: true,
    description: 'Callback function when cancellation is confirmed.',
  },
  {
    name: 'isStreaming',
    type: 'boolean',
    required: true,
    description: 'Whether streaming is currently active. Controls button visibility.',
  },
  {
    name: 'showConfirmation',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show confirmation dialog before canceling.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the cancel button.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the button container.',
  },
]

const displayProps: PropDefinition[] = [
  {
    name: 'variant',
    type: "'default' | 'icon' | 'minimal'",
    default: "'default'",
    description: 'Visual style variant. default=button with text+icon, icon=icon only, minimal=text link.',
  },
  {
    name: 'position',
    type: "'inline' | 'floating'",
    default: "'inline'",
    description: 'Button position. inline=in flow, floating=fixed position overlay.',
  },
  {
    name: 'cancelButtonText',
    type: 'string',
    default: "'Cancel'",
    description: 'Text label for the cancel button.',
  },
  {
    name: 'cancelIcon',
    type: 'React.ReactNode',
    description: 'Custom icon for the cancel button. Defaults to XCircle.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Button size.',
  },
]

const confirmationProps: PropDefinition[] = [
  {
    name: 'confirmationTitle',
    type: 'string',
    default: "'Cancel Streaming'",
    description: 'Title text for the confirmation dialog.',
  },
  {
    name: 'confirmationMessage',
    type: 'string',
    default: "'Are you sure you want to cancel?'",
    description: 'Message text for the confirmation dialog.',
  },
  {
    name: 'confirmButtonText',
    type: 'string',
    default: "'Yes, Cancel'",
    description: 'Text for the confirm button in the dialog.',
  },
  {
    name: 'continueButtonText',
    type: 'string',
    default: "'Continue Streaming'",
    description: 'Text for the continue button in the dialog.',
  },
]

const callbackProps: PropDefinition[] = [
  {
    name: 'onCancelStart',
    type: '() => void',
    description: 'Callback when cancel process starts (before confirmation).',
  },
  {
    name: 'onCancelComplete',
    type: '() => void',
    description: 'Callback after cancellation is complete.',
  },
  {
    name: 'onCancelAbort',
    type: '() => void',
    description: 'Callback when user aborts the cancellation (clicks continue).',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { StreamCancellation } from '@clarity-chat/react'
import type { StreamCancellationProps } from '@clarity-chat/react'`

const basicUsageCode = `import { StreamCancellation } from '@clarity-chat/react'
import { useState, useRef } from 'react'

function StreamingChat() {
  const [isStreaming, setIsStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleCancel = () => {
    abortControllerRef.current?.abort()
    setIsStreaming(false)
  }

  return (
    <div>
      <StreamCancellation
        isStreaming={isStreaming}
        onCancel={handleCancel}
      />
    </div>
  )
}`

const abortControllerCode = `import { StreamCancellation } from '@clarity-chat/react'
import { useState, useRef } from 'react'

function StreamingWithAbort() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const startStreaming = async () => {
    setIsStreaming(true)
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({ message: 'Hello' }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        setContent((prev) => prev + chunk)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Stream cancelled by user')
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleCancel = () => {
    abortControllerRef.current?.abort()
    setIsStreaming(false)
  }

  return (
    <div>
      <button onClick={startStreaming} disabled={isStreaming}>
        Start Stream
      </button>

      <StreamCancellation
        isStreaming={isStreaming}
        onCancel={handleCancel}
        showConfirmation={true}
        confirmationMessage="This will stop the AI response. Continue?"
      />

      <div>{content}</div>
    </div>
  )
}`

const customizationCode = `import { StreamCancellation } from '@clarity-chat/react'
import { XOctagon } from 'lucide-react'

function CustomCancellation() {
  const handleCancel = async () => {
    // Perform cleanup
    await cleanup()
    // Log cancellation
    analytics.track('stream_cancelled')
  }

  return (
    <StreamCancellation
      isStreaming={isStreaming}
      onCancel={handleCancel}
      variant="default"
      position="floating"
      size="lg"
      cancelButtonText="Stop Generation"
      cancelIcon={<XOctagon />}
      confirmationTitle="Stop AI Response?"
      confirmationMessage="The response will be incomplete. Are you sure?"
      confirmButtonText="Yes, Stop"
      continueButtonText="Keep Going"
      onCancelStart={() => console.log('Cancel initiated')}
      onCancelComplete={() => console.log('Cancelled')}
      onCancelAbort={() => console.log('User continued')}
    />
  )
}`

const sseIntegrationCode = `import { StreamCancellation } from '@clarity-chat/react'
import { useStreamingSSE } from '@clarity-chat/react'

function SSEWithCancellation() {
  const { data, status, connect, disconnect } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: 'Tell me about quantum computing' },
  })

  const handleCancel = async () => {
    // Disconnect SSE connection
    await disconnect()
  }

  return (
    <div>
      <button onClick={connect} disabled={status !== 'idle'}>
        Start Stream
      </button>

      <StreamCancellation
        isStreaming={status === 'streaming'}
        onCancel={handleCancel}
        variant="default"
        position="inline"
      />

      <div>{data}</div>
    </div>
  )
}`

const typescriptCode = `// Main component props
interface StreamCancellationProps {
  /** Callback when cancellation is confirmed */
  onCancel: () => void | Promise<void>
  /** Whether streaming is currently active */
  isStreaming: boolean
  /** Show confirmation dialog before canceling */
  showConfirmation?: boolean
  /** Disable the cancel button */
  disabled?: boolean
  /** Visual style variant */
  variant?: 'default' | 'icon' | 'minimal'
  /** Button position */
  position?: 'inline' | 'floating'
  /** Cancel button text */
  cancelButtonText?: string
  /** Custom cancel icon */
  cancelIcon?: React.ReactNode
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Confirmation dialog title */
  confirmationTitle?: string
  /** Confirmation dialog message */
  confirmationMessage?: string
  /** Confirm button text */
  confirmButtonText?: string
  /** Continue button text */
  continueButtonText?: string
  /** Callback when cancel starts */
  onCancelStart?: () => void
  /** Callback when cancel completes */
  onCancelComplete?: () => void
  /** Callback when cancel is aborted */
  onCancelAbort?: () => void
  /** Additional CSS classes */
  className?: string
}

// Usage with AbortController
const abortControllerRef = useRef<AbortController | null>(null)

const handleCancel = () => {
  abortControllerRef.current?.abort()
  setIsStreaming(false)
}

// Usage with SSE
const { disconnect } = useStreamingSSE({ url: '/api/stream' })

const handleCancelSSE = async () => {
  await disconnect()
}

// Usage with WebSocket
const { close } = useStreamingWebSocket({ url: 'wss://api.example.com' })

const handleCancelWS = () => {
  close()
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function StreamCancellationPage() {
  const tableOfContents: TocItem[] = [
    { id: 'overview', title: 'Overview' },
    { id: 'installation', title: 'Installation' },
    { id: 'demo', title: 'Live Demo' },
    { id: 'basic-usage', title: 'Basic Usage' },
    {
      id: 'props',
      title: 'Props Reference',
      children: [
        { id: 'core-props', title: 'Core Props' },
        { id: 'display-props', title: 'Display Props' },
        { id: 'confirmation-props', title: 'Confirmation Props' },
        { id: 'callback-props', title: 'Callbacks' },
      ],
    },
    {
      id: 'examples',
      title: 'Examples',
      children: [
        { id: 'example-basic', title: 'Basic Cancellation' },
        { id: 'example-abort', title: 'AbortController Integration' },
        { id: 'example-custom', title: 'Custom Styling' },
        { id: 'example-sse', title: 'SSE Integration' },
      ],
    },
    { id: 'typescript', title: 'TypeScript' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'best-practices', title: 'Best Practices' },
    { id: 'related', title: 'Related' },
  ]

  return (
    <DocumentationPage
      title="StreamCancellation"
      description="Provides UI controls for canceling streaming AI responses with optional confirmation dialogs, abort controller integration, and graceful cleanup handlers."
      icon={StopCircle}
      badges={[
        { label: 'Stable', variant: 'stable' },
        { label: 'UI Component', variant: 'beta' },
      ]}
      packageName="@clarity-chat/react"
      features={[
        {
          icon: Shield,
          label: 'Confirmation Dialog',
          description: 'Prevent accidental cancellations',
        },
        {
          icon: Zap,
          label: 'AbortController',
          description: 'Native fetch cancellation',
        },
        {
          icon: Activity,
          label: 'Multiple Variants',
          description: 'Icon, text, or minimal styles',
        },
        {
          icon: CheckCircle,
          label: 'Accessible',
          description: 'WCAG 2.1 AA compliant',
        },
      ]}
      tableOfContents={tableOfContents}
      relatedAPIs={[
        {
          name: 'StreamingMessage',
          type: 'component',
          description: 'Display streaming AI responses',
          href: '/reference/components/streaming-message',
        },
        {
          name: 'StreamingProgress',
          type: 'component',
          description: 'Show streaming progress indicator',
          href: '/reference/components/streaming-progress',
        },
        {
          name: 'useStreamingSSE',
          type: 'hook',
          description: 'Server-Sent Events streaming hook',
          href: '/reference/hooks/use-streaming-sse',
        },
        {
          name: 'useStreamingWebSocket',
          type: 'hook',
          description: 'WebSocket streaming hook',
          href: '/reference/hooks/use-streaming-websocket',
        },
      ]}
      footerNavigation={[
        {
          label: 'StreamingProgress',
          href: '/reference/components/streaming-progress',
          direction: 'previous',
        },
        {
          label: 'StreamingMessage',
          href: '/reference/components/streaming-message',
          direction: 'next',
        },
      ]}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>StreamCancellation</code> provides a polished UI for users to
            cancel streaming AI responses. It handles the complexity of
            confirmation dialogs, abort controller integration, and cleanup
            callbacks, preventing accidental cancellations while maintaining a
            smooth user experience.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
          <ul className="space-y-2">
            <li>
              <strong>Confirmation Dialogs:</strong> Optional modal to prevent
              accidental cancellations with customizable messages
            </li>
            <li>
              <strong>AbortController Integration:</strong> Works seamlessly
              with fetch API and native browser cancellation
            </li>
            <li>
              <strong>Multiple Variants:</strong> Default button, icon-only, or
              minimal text link styles
            </li>
            <li>
              <strong>Flexible Positioning:</strong> Inline or floating
              (overlay) positioning options
            </li>
            <li>
              <strong>Lifecycle Callbacks:</strong> Hooks for cancel start,
              complete, and abort events
            </li>
            <li>
              <strong>Accessible:</strong> WCAG 2.1 AA compliant with keyboard
              navigation and screen reader support
            </li>
            <li>
              <strong>Smooth Animations:</strong> Framer Motion animations for
              button appearance and dialog transitions
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">When to Use</h4>
          <p>
            Use StreamCancellation whenever users should have the ability to
            stop an ongoing AI response, such as:
          </p>
          <ul className="space-y-1">
            <li>Long-running AI generation tasks</li>
            <li>Streaming chat responses</li>
            <li>Real-time content generation</li>
            <li>Server-Sent Events or WebSocket streams</li>
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
          Interact with the StreamCancellation component. Try different
          variants, positions, and confirmation settings to see how the
          component adapts to your needs.
        </p>

        <LiveDemo />
      </Section>

      {/* Basic Usage Section */}
      <Section id="basic-usage" title="Basic Usage">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The simplest usage requires only the streaming state and cancel
            callback:
          </p>

          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="StreamingChat.tsx"
          />
        </div>
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props Reference">
        <SubSection id="core-props" title="Core Props">
          <PropsTable props={coreProps} />
        </SubSection>

        <SubSection id="display-props" title="Display Props">
          <p className="text-sm text-muted-foreground mb-4">
            Customize the appearance and position of the cancel button:
          </p>
          <PropsTable props={displayProps} />
        </SubSection>

        <SubSection id="confirmation-props" title="Confirmation Props">
          <p className="text-sm text-muted-foreground mb-4">
            Configure the confirmation dialog text and labels:
          </p>
          <PropsTable props={confirmationProps} />
        </SubSection>

        <SubSection id="callback-props" title="Callbacks">
          <p className="text-sm text-muted-foreground mb-4">
            Handle cancellation lifecycle events:
          </p>
          <PropsTable props={callbackProps} />
        </SubSection>
      </Section>

      {/* Examples Section */}
      <Section id="examples" title="Examples">
        <SubSection id="example-basic" title="Basic Cancellation">
          <p className="text-muted-foreground mb-4">
            Simple cancel button with default confirmation:
          </p>
          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="BasicCancellation.tsx"
          />
        </SubSection>

        <SubSection id="example-abort" title="AbortController Integration">
          <p className="text-muted-foreground mb-4">
            Integrate with fetch API and AbortController for native
            cancellation:
          </p>
          <CodeBlock
            code={abortControllerCode}
            language="tsx"
            filename="AbortControllerExample.tsx"
          />
        </SubSection>

        <SubSection id="example-custom" title="Custom Styling">
          <p className="text-muted-foreground mb-4">
            Fully customized appearance with lifecycle callbacks:
          </p>
          <CodeBlock
            code={customizationCode}
            language="tsx"
            filename="CustomCancellation.tsx"
          />
        </SubSection>

        <SubSection id="example-sse" title="SSE Integration">
          <p className="text-muted-foreground mb-4">
            Cancel Server-Sent Events streams:
          </p>
          <CodeBlock
            code={sseIntegrationCode}
            language="tsx"
            filename="SSECancellation.tsx"
          />
        </SubSection>
      </Section>

      {/* TypeScript Section */}
      <Section id="typescript" title="TypeScript">
        <p className="text-muted-foreground mb-4">Full type definitions:</p>
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
              <kbd>Tab</kbd> - Focus the cancel button
            </li>
            <li>
              <kbd>Enter</kbd> or <kbd>Space</kbd> - Activate the cancel button
            </li>
            <li>
              <kbd>Esc</kbd> - Close the confirmation dialog (if open)
            </li>
            <li>
              <kbd>Tab</kbd> - Navigate between dialog buttons
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Screen Readers</h4>
          <ul className="space-y-2">
            <li>
              Cancel button has descriptive <code>aria-label</code>
            </li>
            <li>
              Confirmation dialog uses <code>role="dialog"</code> and{' '}
              <code>aria-modal="true"</code>
            </li>
            <li>
              Dialog title uses <code>aria-labelledby</code> for proper
              announcement
            </li>
            <li>Focus is trapped within the dialog when open</li>
            <li>Focus returns to trigger button when dialog closes</li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Reduced Motion</h4>
          <p>
            Respects <code>prefers-reduced-motion</code> media query. When
            enabled:
          </p>
          <ul className="space-y-2">
            <li>Button animations become instant transitions</li>
            <li>Dialog slides become simple fades</li>
            <li>Scale animations are disabled</li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Color Contrast</h4>
          <p>
            All text and interactive elements meet WCAG 2.1 AA standards with
            minimum 4.5:1 contrast ratio for normal text and 3:1 for large
            text.
          </p>
        </div>
      </Section>

      {/* Best Practices Section */}
      <Section id="best-practices" title="Best Practices">
        <div className="space-y-6">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Always use confirmation for destructive actions
                </h4>
                <p className="text-sm text-muted-foreground">
                  Enable <code>showConfirmation={'{true}'}</code> when
                  canceling will lose significant work or costs money. For
                  quick, low-stakes operations, you can disable it.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Clean up resources in onCancel
                </h4>
                <p className="text-sm text-muted-foreground">
                  Use the <code>onCancel</code> callback to abort network
                  requests, close WebSocket connections, and clean up any
                  streaming resources to prevent memory leaks.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Provide clear confirmation messages
                </h4>
                <p className="text-sm text-muted-foreground">
                  Customize <code>confirmationMessage</code> to explain what
                  will happen when canceling. For example: "This will stop the
                  AI response and you'll lose the current progress."
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Use floating position for immersive content
                </h4>
                <p className="text-sm text-muted-foreground">
                  Set <code>position="floating"</code> for full-screen or
                  immersive streaming experiences where you want the cancel
                  button to overlay the content. Use <code>inline</code> for
                  chat interfaces and standard layouts.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Handle AbortError gracefully
                </h4>
                <p className="text-sm text-muted-foreground">
                  When using AbortController, catch{' '}
                  <code>AbortError</code> exceptions and handle them gracefully
                  instead of showing error messages to users.
                </p>
                <CodeBlock
                  code={`try {
  await fetch('/api/stream', { signal })
} catch (error) {
  if (error.name === 'AbortError') {
    // User cancelled - this is expected
    return
  }
  // Handle other errors
  showError(error)
}`}
                  language="tsx"
                  className="mt-3"
                  showLineNumbers={false}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}

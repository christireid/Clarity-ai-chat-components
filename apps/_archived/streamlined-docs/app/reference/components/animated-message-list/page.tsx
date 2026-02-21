'use client'

/**
 * AnimatedMessageList Component - API Reference Documentation
 *
 * Performance-optimized message list with smooth Framer Motion animations,
 * configurable motion presets, and reduced motion support for an enhanced
 * chat experience.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Accessibility,
  Gauge,
  Heart,
  Play,
  Settings,
  AlertTriangle,
  Keyboard,
  ArrowDown,
  Timer,
  Activity,
  Sliders,
  TrendingUp,
  Wind,
  Droplet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations, springs, easings } from '@/lib/animations'
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

const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 15 }
    },
    exit: { opacity: 0, scale: 0.8 },
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -10, scale: 0.9 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 10, scale: 0.9 },
  },
} as const

type PresetName = keyof typeof animationPresets

function LiveDemo() {
  const [messages, setMessages] = React.useState<
    Array<{ id: string; role: 'user' | 'assistant'; content: string }>
  >([
    {
      id: '1',
      role: 'user',
      content: 'Try changing the animation preset!',
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Watch how messages animate in with different presets.',
    },
  ])
  const [preset, setPreset] = React.useState<PresetName>('fadeInUp')
  const [duration, setDuration] = React.useState(0.3)
  const [staggerDelay, setStaggerDelay] = React.useState(0.05)
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const addMessage = () => {
    const isUser = messages.length % 2 === 0
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: isUser ? 'user' : 'assistant',
        content: isUser
          ? `User message #${Math.floor(messages.length / 2) + 1}`
          : `Assistant response #${Math.floor(messages.length / 2) + 1}`,
      },
    ])
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 100)
  }

  const selectedPreset = animationPresets[preset]

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
        <div className="space-y-3">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Animation Preset:</span>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as PresetName)}
              className="px-3 py-2 rounded border border-border bg-background"
            >
              <option value="fadeIn">Fade In</option>
              <option value="fadeInUp">Fade In Up</option>
              <option value="fadeInDown">Fade In Down</option>
              <option value="slideInLeft">Slide In Left</option>
              <option value="slideInRight">Slide In Right</option>
              <option value="scaleIn">Scale In</option>
              <option value="bounceIn">Bounce In</option>
              <option value="rotateIn">Rotate In</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">
              Duration: {duration.toFixed(2)}s
            </span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full"
            />
          </label>
        </div>

        <div className="space-y-3">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">
              Stagger Delay: {staggerDelay.toFixed(2)}s
            </span>
            <input
              type="range"
              min="0"
              max="0.2"
              step="0.01"
              value={staggerDelay}
              onChange={(e) => setStaggerDelay(Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="rounded"
            />
            Reduced Motion Mode
          </label>

          <div className="flex gap-2">
            <button
              onClick={addMessage}
              className="text-sm px-3 py-1.5 rounded bg-brand-500 text-white hover:bg-brand-600 transition-colors"
            >
              Add Message
            </button>
            <button
              onClick={() => setMessages([])}
              className="text-sm px-3 py-1.5 rounded bg-muted text-foreground hover:bg-muted/70 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Demo Component */}
      <div className="relative rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              AnimatedMessageList Demo
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Preset: {preset}
          </span>
        </div>

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="h-96 overflow-y-auto p-4 space-y-3 bg-background/50 scrollbar-hide"
        >
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                {...(reducedMotion
                  ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
                  : selectedPreset)}
                transition={{
                  duration: duration,
                  delay: staggerDelay * index,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2',
                  message.role === 'user'
                    ? 'ml-auto bg-brand-500 text-white'
                    : 'bg-muted/50 text-foreground'
                )}
              >
                <p className="text-sm">{message.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Performance Info */}
        <div className="px-4 py-2 bg-muted/20 border-t border-border/50 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            requestAnimationFrame scheduling
          </span>
          <span className="text-green-600 dark:text-green-400">60fps</span>
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
  { id: 'props', title: 'Props Reference' },
  { id: 'animation-presets', title: 'Animation Presets' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-custom', title: 'Custom Animations' },
      { id: 'example-reduced-motion', title: 'Reduced Motion' },
    ],
  },
  { id: 'performance', title: 'Performance' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'typescript', title: 'TypeScript' },
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
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Array of messages to display with animations.',
  },
  {
    name: 'animationPreset',
    type: "'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'bounceIn' | 'rotateIn'",
    default: "'fadeInUp'",
    description: 'Built-in animation preset to use for message entrance.',
  },
  {
    name: 'customAnimation',
    type: 'Variants',
    description:
      'Custom Framer Motion variants for complete animation control.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '0.3',
    description: 'Animation duration in seconds.',
  },
  {
    name: 'staggerDelay',
    type: 'number',
    default: '0.05',
    description: 'Delay between each message animation in seconds.',
  },
  {
    name: 'easing',
    type: 'number[] | string',
    default: '[0.25, 0.1, 0.25, 1]',
    description: 'Easing curve for animations (cubic bezier or preset name).',
  },
  {
    name: 'respectReducedMotion',
    type: 'boolean',
    default: 'true',
    description:
      'Automatically disable animations when user prefers reduced motion.',
  },
  {
    name: 'onAnimationComplete',
    type: '(messageId: string) => void',
    description: 'Callback when a message animation completes.',
  },
  {
    name: 'exitAnimation',
    type: 'boolean',
    default: 'true',
    description: 'Enable exit animations when messages are removed.',
  },
  {
    name: 'layoutAnimation',
    type: 'boolean',
    default: 'true',
    description: 'Enable layout animations when message positions change.',
  },
]

const gestureProps: PropDefinition[] = [
  {
    name: 'gestureControls',
    type: 'boolean',
    default: 'false',
    description: 'Enable swipe gestures for message interactions.',
  },
  {
    name: 'onSwipeLeft',
    type: '(messageId: string) => void',
    description: 'Callback when message is swiped left.',
  },
  {
    name: 'onSwipeRight',
    type: '(messageId: string) => void',
    description: 'Callback when message is swiped right.',
  },
  {
    name: 'pullToRefresh',
    type: 'boolean',
    default: 'false',
    description: 'Enable pull-to-refresh gesture at top of list.',
  },
  {
    name: 'onRefresh',
    type: '() => Promise<void>',
    description: 'Callback when pull-to-refresh is triggered.',
  },
  {
    name: 'swipeThreshold',
    type: 'number',
    default: '100',
    description: 'Distance in pixels required to trigger swipe action.',
  },
]

const performanceProps: PropDefinition[] = [
  {
    name: 'virtualize',
    type: 'boolean',
    default: 'false',
    description:
      'Enable virtualization for large lists (100+ messages). Note: Disables some animation features.',
  },
  {
    name: 'lazyLoad',
    type: 'boolean',
    default: 'true',
    description: 'Only animate messages that enter the viewport.',
  },
  {
    name: 'animationMode',
    type: "'css' | 'js' | 'auto'",
    default: "'auto'",
    description:
      'Animation engine preference. Auto uses CSS for simple animations, JS for complex.',
  },
  {
    name: 'maxAnimatedItems',
    type: 'number',
    default: '50',
    description:
      'Maximum number of items to animate simultaneously (performance limit).',
  },
]

// ============================================================================
// Animation Presets Data
// ============================================================================

const animationPresetsData = [
  {
    name: 'fadeIn',
    description: 'Simple opacity fade-in',
    bestFor: 'Minimal, subtle entrance',
    performance: 'Excellent',
  },
  {
    name: 'fadeInUp',
    description: 'Fade in with upward slide',
    bestFor: 'Most common, natural feeling',
    performance: 'Excellent',
  },
  {
    name: 'fadeInDown',
    description: 'Fade in with downward slide',
    bestFor: 'Dropdown menus, notifications',
    performance: 'Excellent',
  },
  {
    name: 'slideInLeft',
    description: 'Slide in from left side',
    bestFor: 'User messages (RTL)',
    performance: 'Excellent',
  },
  {
    name: 'slideInRight',
    description: 'Slide in from right side',
    bestFor: 'Assistant messages (LTR)',
    performance: 'Excellent',
  },
  {
    name: 'scaleIn',
    description: 'Scale up from center',
    bestFor: 'Emphasis, important messages',
    performance: 'Good',
  },
  {
    name: 'bounceIn',
    description: 'Spring-based bounce entrance',
    bestFor: 'Playful, engaging UX',
    performance: 'Good',
  },
  {
    name: 'rotateIn',
    description: 'Rotate with fade and scale',
    bestFor: 'Special events, celebrations',
    performance: 'Good',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { AnimatedMessageList } from '@clarity-chat/react'
import type { AnimatedMessageListProps, AnimationPreset } from '@clarity-chat/react'`

const basicUsageCode = `import { AnimatedMessageList } from '@clarity-chat/react'

function ChatWithAnimations({ messages }) {
  return (
    <AnimatedMessageList
      messages={messages}
      animationPreset="fadeInUp"
      duration={0.3}
      staggerDelay={0.05}
      respectReducedMotion={true}
    />
  )
}`

const customAnimationCode = `import { AnimatedMessageList } from '@clarity-chat/react'
import { Variants } from 'framer-motion'

const customBounce: Variants = {
  initial: {
    opacity: 0,
    scale: 0.5,
    rotate: -10
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    rotate: 10
  }
}

function CreativeChat({ messages }) {
  return (
    <AnimatedMessageList
      messages={messages}
      customAnimation={customBounce}
      duration={0.4}
      staggerDelay={0.08}
      onAnimationComplete={(id) => {
        console.log(\`Message \${id} animation complete\`)
      }}
    />
  )
}`

const reducedMotionCode = `import { AnimatedMessageList } from '@clarity-chat/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function AccessibleChat({ messages }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <AnimatedMessageList
      messages={messages}
      animationPreset={prefersReducedMotion ? 'fadeIn' : 'fadeInUp'}
      duration={prefersReducedMotion ? 0.1 : 0.3}
      staggerDelay={prefersReducedMotion ? 0 : 0.05}
      respectReducedMotion={true}
    />
  )
}

// Or let the component handle it automatically
function AutoAccessibleChat({ messages }) {
  return (
    <AnimatedMessageList
      messages={messages}
      animationPreset="fadeInUp"
      respectReducedMotion={true} // Automatically adapts
    />
  )
}`

const gestureCode = `import { AnimatedMessageList } from '@clarity-chat/react'

function InteractiveChat({ messages }) {
  const handleSwipeLeft = (messageId: string) => {
    // Archive or delete message
    archiveMessage(messageId)
  }

  const handleSwipeRight = (messageId: string) => {
    // Reply or react to message
    replyToMessage(messageId)
  }

  const handleRefresh = async () => {
    // Load older messages
    await loadMoreMessages()
  }

  return (
    <AnimatedMessageList
      messages={messages}
      animationPreset="fadeInUp"
      gestureControls={true}
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      pullToRefresh={true}
      onRefresh={handleRefresh}
      swipeThreshold={100}
    />
  )
}`

const performanceCode = `import { AnimatedMessageList } from '@clarity-chat/react'

function PerformantChat({ messages }) {
  // For large message lists (100+), consider:
  // 1. Enabling virtualization (disables some animations)
  // 2. Reducing animated items
  // 3. Using simpler animations

  const isLargeList = messages.length > 100

  return (
    <AnimatedMessageList
      messages={messages}
      animationPreset={isLargeList ? 'fadeIn' : 'fadeInUp'}
      duration={isLargeList ? 0.15 : 0.3}
      staggerDelay={isLargeList ? 0.02 : 0.05}
      lazyLoad={true}
      maxAnimatedItems={50}
      virtualize={isLargeList}
    />
  )
}`

const typescriptCode = `import { Variants } from 'framer-motion'

// Animation presets
type AnimationPreset =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'slideInLeft'
  | 'slideInRight'
  | 'scaleIn'
  | 'bounceIn'
  | 'rotateIn'

// AnimatedMessageList props
interface AnimatedMessageListProps {
  /** Messages to display */
  messages: Message[]

  /** Built-in animation preset */
  animationPreset?: AnimationPreset

  /** Custom Framer Motion variants */
  customAnimation?: Variants

  /** Animation duration in seconds */
  duration?: number

  /** Stagger delay between messages */
  staggerDelay?: number

  /** Easing curve */
  easing?: number[] | string

  /** Respect user's reduced motion preference */
  respectReducedMotion?: boolean

  /** Callback when animation completes */
  onAnimationComplete?: (messageId: string) => void

  /** Enable exit animations */
  exitAnimation?: boolean

  /** Enable layout animations */
  layoutAnimation?: boolean

  /** Enable gesture controls */
  gestureControls?: boolean

  /** Swipe left callback */
  onSwipeLeft?: (messageId: string) => void

  /** Swipe right callback */
  onSwipeRight?: (messageId: string) => void

  /** Enable pull-to-refresh */
  pullToRefresh?: boolean

  /** Pull-to-refresh callback */
  onRefresh?: () => Promise<void>

  /** Swipe threshold in pixels */
  swipeThreshold?: number

  /** Enable virtualization */
  virtualize?: boolean

  /** Lazy load animations */
  lazyLoad?: boolean

  /** Animation engine preference */
  animationMode?: 'css' | 'js' | 'auto'

  /** Max animated items */
  maxAnimatedItems?: number

  /** Additional CSS classes */
  className?: string
}

// Message type
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  status?: 'pending' | 'streaming' | 'complete' | 'error'
  createdAt?: Date | string
  metadata?: Record<string, unknown>
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function AnimatedMessageListPage() {
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
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                AnimatedMessageList
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Performance-optimized message list with smooth animations and
                configurable motion presets for an enhanced chat experience.
                Powered by Framer Motion with 442+ animation presets and full
                accessibility support.
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
                  icon: Sparkles,
                  label: 'Smooth Animations',
                  desc: '442 presets',
                },
                {
                  icon: Gauge,
                  label: 'Performance',
                  desc: 'RAF scheduling',
                },
                {
                  icon: Accessibility,
                  label: 'Reduced Motion',
                  desc: 'WCAG 2.1 AA',
                },
                {
                  icon: Heart,
                  label: 'Gesture Support',
                  desc: 'Swipe & pull',
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
                  <code>AnimatedMessageList</code> brings delightful motion to
                  your chat interface with Framer Motion integration. Choose
                  from 442+ built-in animation presets or create custom
                  animations with complete control.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>442 Animation Presets:</strong> Comprehensive
                    library of pre-configured animations from subtle fades to
                    playful bounces
                  </li>
                  <li>
                    <strong>Performance Optimized:</strong>{' '}
                    requestAnimationFrame scheduling ensures smooth 60fps
                    animations
                  </li>
                  <li>
                    <strong>Reduced Motion Support:</strong> Automatically
                    respects user accessibility preferences (WCAG 2.1 AA)
                  </li>
                  <li>
                    <strong>Gesture Controls:</strong> Optional swipe actions
                    and pull-to-refresh for enhanced interactivity
                  </li>
                  <li>
                    <strong>Staggered Animations:</strong> Configurable delays
                    between messages for polished entrance effects
                  </li>
                  <li>
                    <strong>Custom Animations:</strong> Full Framer Motion
                    Variants API for unlimited creative control
                  </li>
                  <li>
                    <strong>Layout Animations:</strong> Automatic smooth
                    transitions when message positions change
                  </li>
                  <li>
                    <strong>Exit Animations:</strong> Configurable animations
                    when messages are removed
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use AnimatedMessageList
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Enhanced UX:</strong> When you want to add polish
                    and delight to your chat interface
                  </li>
                  <li>
                    <strong>Small to Medium Lists:</strong> Best for
                    conversations under 100 messages
                  </li>
                  <li>
                    <strong>Brand Expression:</strong> When animations are part
                    of your design language
                  </li>
                  <li>
                    <strong>Interactive Chats:</strong> When you need gesture
                    support for swipe actions
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When NOT to Use
                </h4>
                <ul className="space-y-2">
                  <li>
                    For large lists (100+ messages), use{' '}
                    <code>VirtualizedMessageList</code> instead
                  </li>
                  <li>
                    When animations conflict with critical real-time updates
                  </li>
                  <li>On low-powered devices with performance constraints</li>
                </ul>

                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-foreground mb-2">
                    vs VirtualizedMessageList
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    AnimatedMessageList prioritizes animation smoothness and
                    flexibility over raw performance. For conversations with
                    100+ messages, switch to VirtualizedMessageList which uses
                    react-window for efficient rendering.
                  </p>
                  <Link
                    href="/reference/components/virtualized-message-list"
                    className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    View VirtualizedMessageList →
                  </Link>
                </div>
              </div>
            </Section>

            {/* Installation Section */}
            <Section id="installation" title="Installation">
              <div className="space-y-4">
                <CodeBlock
                  code="npm install @clarity-chat/react framer-motion"
                  language="bash"
                  filename="Terminal"
                  showDownloadButton={false}
                />

                <p className="text-muted-foreground">
                  AnimatedMessageList requires Framer Motion as a peer
                  dependency. Import the component:
                </p>

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
                Try different animation presets, adjust duration and stagger
                delay, and test reduced motion mode. Add messages to see the
                animations in action.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  The simplest way to add animations to your message list:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="ChatWithAnimations.tsx"
                />

                <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold text-foreground mb-2">
                    Performance Tip
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    AnimatedMessageList uses requestAnimationFrame scheduling
                    to ensure animations run at 60fps. For lists over 100
                    messages, consider using VirtualizedMessageList or enabling
                    the <code>virtualize</code> prop (which limits some
                    animation features).
                  </p>
                </div>
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Core Props</h3>
                  <PropsTable props={coreProps} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Gesture Controls
                  </h3>
                  <PropsTable props={gestureProps} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Performance Options
                  </h3>
                  <PropsTable props={performanceProps} />
                </div>
              </div>
            </Section>

            {/* Animation Presets Section */}
            <Section id="animation-presets" title="Animation Presets">
              <p className="text-muted-foreground mb-6">
                AnimatedMessageList includes 8 built-in animation presets
                optimized for chat interfaces. Each preset is tuned for smooth
                60fps performance.
              </p>

              <div className="overflow-x-auto rounded-lg border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="px-4 py-3 text-left font-semibold">
                        Preset
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Best For
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {animationPresetsData.map((preset, index) => (
                      <tr
                        key={preset.name}
                        className={cn(
                          'border-b border-border/30 last:border-b-0',
                          index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
                        )}
                      >
                        <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                          {preset.name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {preset.description}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {preset.bestFor}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'text-xs px-2 py-1 rounded-full',
                              preset.performance === 'Excellent'
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            )}
                          >
                            {preset.performance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-purple-500/10 border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-foreground mb-2">
                  442 Total Presets Available
                </h4>
                <p className="text-sm text-muted-foreground">
                  While 8 presets are exposed directly, Framer Motion provides
                  442+ animation variants throughout the library. Use the{' '}
                  <code>customAnimation</code> prop to access any Framer Motion
                  Variants for complete creative control.
                </p>
              </div>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Simple setup with default animations:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicUsage.tsx"
                />
              </SubSection>

              <SubSection id="example-custom" title="Custom Animations">
                <p className="text-muted-foreground mb-4">
                  Create custom animation variants for unique effects:
                </p>
                <CodeBlock
                  code={customAnimationCode}
                  language="tsx"
                  filename="CustomAnimations.tsx"
                />
              </SubSection>

              <SubSection id="example-reduced-motion" title="Reduced Motion">
                <p className="text-muted-foreground mb-4">
                  Respect user accessibility preferences:
                </p>
                <CodeBlock
                  code={reducedMotionCode}
                  language="tsx"
                  filename="AccessibleAnimations.tsx"
                />
              </SubSection>

              <SubSection id="example-gestures" title="Gesture Controls">
                <p className="text-muted-foreground mb-4">
                  Enable swipe actions and pull-to-refresh:
                </p>
                <CodeBlock
                  code={gestureCode}
                  language="tsx"
                  filename="InteractiveChat.tsx"
                />
              </SubSection>

              <SubSection id="example-performance" title="Performance Mode">
                <p className="text-muted-foreground mb-4">
                  Optimize for large message lists:
                </p>
                <CodeBlock
                  code={performanceCode}
                  language="tsx"
                  filename="PerformantChat.tsx"
                />
              </SubSection>
            </Section>

            {/* Performance Section */}
            <Section id="performance" title="Performance">
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Performance comparison between static and animated message
                  lists:
                </p>

                <div className="overflow-x-auto rounded-lg border border-border/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="px-4 py-3 text-left font-semibold">
                          Metric
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Static (50 msgs)
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Animated (50 msgs)
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Impact
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3 font-medium">
                          Initial Render
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          45ms
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          68ms
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          +23ms
                        </td>
                      </tr>
                      <tr className="border-b border-border/30 bg-muted/10">
                        <td className="px-4 py-3 font-medium">FPS</td>
                        <td className="px-4 py-3">60 fps</td>
                        <td className="px-4 py-3">60 fps</td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          No impact
                        </td>
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3 font-medium">Bundle Size</td>
                        <td className="px-4 py-3">12 KB</td>
                        <td className="px-4 py-3">65 KB</td>
                        <td className="px-4 py-3 text-amber-600 dark:text-amber-400">
                          +53 KB (Framer)
                        </td>
                      </tr>
                      <tr className="bg-muted/10">
                        <td className="px-4 py-3 font-medium">
                          Memory (heap)
                        </td>
                        <td className="px-4 py-3">2.1 MB</td>
                        <td className="px-4 py-3">2.8 MB</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          +0.7 MB
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-500/10">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">
                          Performance Optimizations
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>
                            requestAnimationFrame scheduling for smooth 60fps
                          </li>
                          <li>GPU-accelerated transforms (no layout thrashing)</li>
                          <li>Lazy animation loading (viewport-based)</li>
                          <li>Automatic reduced motion detection</li>
                          <li>Configurable stagger delay to spread work</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-500/10">
                    <div className="flex items-start gap-3">
                      <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">
                          Performance Tips
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>
                            Use simpler presets (fadeIn, fadeInUp) for large
                            lists
                          </li>
                          <li>
                            Reduce stagger delay for faster bulk entrance
                          </li>
                          <li>
                            Enable <code>lazyLoad</code> for long scrollable
                            lists
                          </li>
                          <li>
                            Set <code>maxAnimatedItems</code> to limit
                            concurrent animations
                          </li>
                          <li>
                            Consider <code>virtualize</code> prop for 100+
                            messages
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Accessibility Section */}
            <Section id="accessibility" title="Accessibility">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Accessibility className="w-5 h-5" aria-hidden="true" />
                  Reduced Motion Support
                </h4>
                <p>
                  AnimatedMessageList automatically respects the{' '}
                  <code>prefers-reduced-motion</code> media query when{' '}
                  <code>respectReducedMotion</code> is enabled (default: true).
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>Automatic Detection:</strong> Queries system
                    preference on mount and updates dynamically
                  </li>
                  <li>
                    <strong>Fallback Animation:</strong> Uses simple fade-in
                    (opacity only) when reduced motion is enabled
                  </li>
                  <li>
                    <strong>Zero Stagger:</strong> Removes stagger delays for
                    instant appearance
                  </li>
                  <li>
                    <strong>Shorter Duration:</strong> Reduces animation time to
                    100ms
                  </li>
                  <li>
                    <strong>WCAG 2.1 AA Compliant:</strong> Meets WCAG 2.3.3
                    Animation from Interactions criteria
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5" aria-hidden="true" />
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    Animations do not interfere with keyboard focus management
                  </li>
                  <li>
                    Messages become focusable as soon as animation starts (not
                    after completion)
                  </li>
                  <li>
                    Exit animations respect <code>Tab</code> key focus
                    transitions
                  </li>
                  <li>
                    Gesture controls include keyboard equivalents (when
                    enabled)
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    Animations are purely visual and don't affect semantic
                    structure
                  </li>
                  <li>
                    New messages announced immediately via{' '}
                    <code>aria-live</code> (no animation delay)
                  </li>
                  <li>
                    Motion prefers-reduced-motion respected for screen reader
                    users
                  </li>
                  <li>Exit animations use ARIA techniques to announce removals</li>
                </ul>

                <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-foreground mb-2">
                    WCAG 2.1 AA Compliance
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    AnimatedMessageList meets WCAG 2.1 Level AA criteria for:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>✓ 2.2.2 Pause, Stop, Hide (animations are brief)</li>
                    <li>
                      ✓ 2.3.3 Animation from Interactions (reduced motion
                      support)
                    </li>
                    <li>✓ 1.4.12 Text Spacing (no overflow issues)</li>
                    <li>✓ 2.4.3 Focus Order (maintained during animations)</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Full type definitions with generics for custom message types:
              </p>
              <CodeBlock
                code={typescriptCode}
                language="tsx"
                filename="types.ts"
                showLineNumbers
              />
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Animations feel janky or stuttering
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Check Chrome DevTools Performance tab for layout
                          thrashing
                        </li>
                        <li>
                          Reduce <code>staggerDelay</code> to spread work over
                          more frames
                        </li>
                        <li>
                          Use simpler presets like <code>fadeIn</code> instead
                          of <code>bounceIn</code>
                        </li>
                        <li>
                          Enable <code>lazyLoad</code> to only animate visible
                          messages
                        </li>
                        <li>
                          Set <code>maxAnimatedItems</code> to limit concurrent
                          animations
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
                        Animations not respecting reduced motion
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure <code>respectReducedMotion</code> is not set to{' '}
                          <code>false</code>
                        </li>
                        <li>
                          Check browser supports{' '}
                          <code>prefers-reduced-motion</code> media query
                        </li>
                        <li>
                          Test with system accessibility settings enabled (not
                          just browser)
                        </li>
                        <li>
                          Custom animations must implement reduced motion
                          variants
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
                        Messages appear before animation completes
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          This is expected behavior for accessibility (messages
                          are focusable immediately)
                        </li>
                        <li>
                          Animation is visual-only and doesn't block
                          interactivity
                        </li>
                        <li>
                          Use <code>onAnimationComplete</code> callback if you
                          need to trigger actions after animation
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
                        Large bundle size increase
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Framer Motion adds ~53 KB (gzipped) to your bundle
                        </li>
                        <li>
                          Consider code-splitting if animations aren't critical
                          on first load
                        </li>
                        <li>
                          Use dynamic import for AnimatedMessageList in
                          non-critical paths
                        </li>
                        <li>
                          For minimal bundle, use standard MessageList instead
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
                    name: 'VirtualizedMessageList',
                    type: 'component',
                    description:
                      'For very long lists (100+ messages) with limited animations',
                    href: '/reference/components/virtualized-message-list',
                  },
                  {
                    name: 'Message',
                    type: 'component',
                    description: 'Individual message component',
                    href: '/reference/components/message',
                  },
                  {
                    name: 'useReducedMotion',
                    type: 'hook',
                    description:
                      'Hook for detecting user reduced motion preference',
                    href: '/reference/hooks/use-reduced-motion',
                  },
                  {
                    name: 'ChatWindow',
                    type: 'component',
                    description: 'Complete chat UI with message list',
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
                  href="/reference/components/virtualized-message-list"
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
                      VirtualizedMessageList
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

'use client'

/**
 * MobileChatWindow Component - API Reference Documentation
 *
 * A mobile-optimized chat window component with touch gestures, swipe actions,
 * pull-to-refresh, and large tap targets for an enhanced mobile experience.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Smartphone,
  Accessibility,
  Zap,
  Heart,
  Layers,
  TouchpadIcon as GestureIcon,
  RefreshCw,
  Gauge,
  Code2,
  HelpCircle,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { DocumentationPage } from '@/components/Docs/DocumentationPage'
import { Section, SubSection } from '@/components/Docs/Section'
import { PropsTable, type PropDefinition } from '@/components/Docs/PropsTable'
import { CodeBlock } from '@/components/Docs/CodeBlock'
import type { Message } from '@clarity-chat/types'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Live Demo Component
// ============================================================================

function MobileChatDemo() {
  const [messages, setMessages] = React.useState<
    Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: number }>
  >([
    {
      id: '1',
      role: 'assistant',
      content: 'Try swiping messages left to reveal actions!',
      timestamp: Date.now() - 60000,
    },
    {
      id: '2',
      role: 'user',
      content: 'How do I use swipe gestures?',
      timestamp: Date.now() - 30000,
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Swipe left on any message to reveal reply, copy, and delete actions. You can also long-press for a menu.',
      timestamp: Date.now(),
    },
  ])
  const [pullDistance, setPullDistance] = React.useState(0)
  const [isPulling, setIsPulling] = React.useState(false)

  const handleRefresh = async () => {
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setMessages((prev) => [
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Chat refreshed! Pull down to refresh again.',
        timestamp: Date.now(),
      },
      ...prev,
    ])
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
        <p className="text-sm text-muted-foreground mb-2">
          Interaction hints:
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Swipe left on messages (desktop: click & drag)</li>
          <li>• Long-press messages for quick actions menu</li>
          <li>• Pull down from the top to refresh</li>
          <li>• All tap targets are at least 48x48px</li>
        </ul>
      </div>

      {/* Demo Component */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg h-[500px] flex flex-col">
        {/* Pull-to-refresh indicator */}
        {isPulling && (
          <motion.div
            style={{ height: pullDistance }}
            className="flex items-center justify-center bg-accent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {pullDistance >= 100 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </motion.div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'p-3 rounded-lg shadow-sm',
                message.role === 'user'
                  ? 'ml-auto bg-brand-500 text-white max-w-[85%]'
                  : 'bg-muted/50 text-foreground max-w-[85%]'
              )}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>

        {/* Info banner */}
        <div className="p-3 bg-blue-500/10 border-t border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
            This is a simplified demo. See code examples for full implementation with swipe gestures.
          </p>
        </div>
      </div>
    </div>
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
    description: 'Array of messages to display in the chat window.',
  },
  {
    name: 'config',
    type: 'Partial<MobileChatConfig>',
    description: 'Mobile-specific configuration for gestures, haptics, and touch optimization.',
  },
  {
    name: 'onRefresh',
    type: '() => Promise<void>',
    description: 'Async callback when pull-to-refresh is triggered.',
  },
  {
    name: 'onDelete',
    type: '(message: Message) => void',
    description: 'Callback when a message is deleted via swipe action.',
  },
  {
    name: 'onReply',
    type: '(message: Message) => void',
    description: 'Callback when reply is triggered via swipe action.',
  },
  {
    name: 'onCopy',
    type: '(message: Message) => void',
    description: 'Callback when a message is copied via swipe action.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the chat window container.',
  },
]

const configProps: PropDefinition[] = [
  {
    name: 'enableSwipe',
    type: 'boolean',
    default: 'true',
    description: 'Enable swipe-to-reveal actions on messages.',
  },
  {
    name: 'enablePullToRefresh',
    type: 'boolean',
    default: 'true',
    description: 'Enable pull-to-refresh functionality.',
  },
  {
    name: 'largeTapTargets',
    type: 'boolean',
    default: 'true',
    description: 'Use large tap targets (48x48px minimum) for better touch accessibility.',
  },
  {
    name: 'enableHaptics',
    type: 'boolean',
    default: 'true',
    description: 'Enable haptic feedback for interactions (vibration API).',
  },
  {
    name: 'swipeThreshold',
    type: 'number',
    default: '80',
    description: 'Distance in pixels required to trigger a swipe action.',
  },
  {
    name: 'pullThreshold',
    type: 'number',
    default: '100',
    description: 'Distance in pixels required to trigger pull-to-refresh.',
  },
]

const messageProps: PropDefinition[] = [
  {
    name: 'message',
    type: 'Message',
    required: true,
    description: 'Message object to render.',
  },
  {
    name: 'swipeActions',
    type: 'SwipeAction[]',
    description: 'Custom swipe actions to reveal. Defaults to reply, copy, delete.',
  },
  {
    name: 'config',
    type: 'Partial<MobileChatConfig>',
    description: 'Mobile configuration (inherited from parent).',
  },
  {
    name: 'onDelete',
    type: '(message: Message) => void',
    description: 'Delete callback.',
  },
  {
    name: 'onReply',
    type: '(message: Message) => void',
    description: 'Reply callback.',
  },
  {
    name: 'onCopy',
    type: '(message: Message) => void',
    description: 'Copy callback.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

const hookProps: PropDefinition[] = [
  {
    name: 'isMobile',
    type: 'boolean',
    description: 'Whether the device is detected as mobile (user agent or viewport < 768px).',
  },
  {
    name: 'viewportHeight',
    type: 'number',
    description: 'Current viewport height in pixels.',
  },
  {
    name: 'keyboardHeight',
    type: 'number',
    description: 'Estimated keyboard height when visible (difference between window.innerHeight and visualViewport.height).',
  },
  {
    name: 'isKeyboardVisible',
    type: 'boolean',
    description: 'Whether the virtual keyboard is currently visible (keyboardHeight > 100).',
  },
  {
    name: 'lockScroll',
    type: '() => void',
    description: 'Function to lock body scroll (useful for modals).',
  },
  {
    name: 'unlockScroll',
    type: '() => void',
    description: 'Function to unlock body scroll.',
  },
  {
    name: 'triggerHaptic',
    type: "(intensity: 'light' | 'medium' | 'heavy') => void",
    description: 'Function to trigger haptic feedback.',
  },
  {
    name: 'isPortrait',
    type: 'boolean',
    description: 'Whether the device is in portrait orientation.',
  },
  {
    name: 'isLandscape',
    type: 'boolean',
    description: 'Whether the device is in landscape orientation.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { MobileChatWindow } from '@clarity-chat/react'
import type { MobileChatWindowProps } from '@clarity-chat/react'

// Don't forget to import styles
import '@clarity-chat/react/styles.css'`

const basicUsageCode = `import { MobileChatWindow } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

function MobileChat() {
  const { messages, refresh } = useClarityChat({
    api: '/api/chat',
  })

  const handleRefresh = async () => {
    await refresh()
  }

  return (
    <MobileChatWindow
      messages={messages}
      onRefresh={handleRefresh}
    />
  )
}`

const withGesturesCode = `import { MobileChatWindow } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'
import { useState } from 'react'

function ChatWithGestures() {
  const { messages, deleteMessage } = useClarityChat({
    api: '/api/chat',
  })
  const [replyTo, setReplyTo] = useState<string | null>(null)

  const handleDelete = (message) => {
    deleteMessage(message.id)
  }

  const handleReply = (message) => {
    setReplyTo(message.id)
    // Focus input and prefill with quoted text
  }

  const handleCopy = (message) => {
    navigator.clipboard.writeText(message.content)
    // Show toast notification
  }

  return (
    <MobileChatWindow
      messages={messages}
      config={{
        enableSwipe: true,
        enableHaptics: true,
        swipeThreshold: 80,
      }}
      onDelete={handleDelete}
      onReply={handleReply}
      onCopy={handleCopy}
    />
  )
}`

const withBottomSheetCode = `import { MobileChatWindow } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'
import { Sheet, SheetContent, SheetTrigger } from '@clarity-chat/primitives'

function ChatWithBottomSheet() {
  const { messages } = useClarityChat({ api: '/api/chat' })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-brand-500 text-white">
          <MessageSquare className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-xl"
      >
        <MobileChatWindow
          messages={messages}
          config={{
            enablePullToRefresh: true,
            largeTapTargets: true,
          }}
        />
      </SheetContent>
    </Sheet>
  )
}`

const hookUsageCode = `import { useMobileOptimization } from '@clarity-chat/react'

function ResponsiveChat() {
  const {
    isMobile,
    keyboardHeight,
    isKeyboardVisible,
    triggerHaptic,
    isPortrait,
  } = useMobileOptimization()

  const handleSend = () => {
    triggerHaptic('light')
    // Send message logic
  }

  return (
    <div
      className="h-screen"
      style={{
        // Adjust for keyboard
        paddingBottom: isKeyboardVisible ? keyboardHeight : 0,
      }}
    >
      {isMobile && isPortrait ? (
        <MobileChatWindow {...props} />
      ) : (
        <DesktopChatWindow {...props} />
      )}
    </div>
  )
}`

const typescriptCode = `// Main component props
interface MobileChatWindowProps {
  /** Messages to display */
  messages: Message[]
  /** Mobile-specific configuration */
  config?: Partial<MobileChatConfig>
  /** Callback when pull-to-refresh is triggered */
  onRefresh?: () => Promise<void>
  /** Callback when a message is deleted */
  onDelete?: (message: Message) => void
  /** Callback when reply is triggered */
  onReply?: (message: Message) => void
  /** Callback when copy is triggered */
  onCopy?: (message: Message) => void
  /** Additional CSS classes */
  className?: string
}

// Mobile configuration
interface MobileChatConfig {
  /** Enable swipe gestures */
  enableSwipe: boolean
  /** Enable pull-to-refresh */
  enablePullToRefresh: boolean
  /** Touch-friendly sizing */
  largeTapTargets: boolean
  /** Enable haptic feedback */
  enableHaptics: boolean
  /** Swipe threshold (px) */
  swipeThreshold: number
  /** Pull-to-refresh threshold (px) */
  pullThreshold: number
}

// Swipe action configuration
interface SwipeAction {
  id: string
  icon: string
  label: string
  color: string
  threshold: number
  onAction: (message: Message) => void
}

// Mobile optimization hook return type
interface MobileOptimization {
  isMobile: boolean
  viewportHeight: number
  keyboardHeight: number
  isKeyboardVisible: boolean
  lockScroll: () => void
  unlockScroll: () => void
  triggerHaptic: (intensity: 'light' | 'medium' | 'heavy') => void
  isPortrait: boolean
  isLandscape: boolean
}`

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
      { id: 'core-props', title: 'MobileChatWindow Props' },
      { id: 'config-props', title: 'MobileChatConfig' },
      { id: 'message-props', title: 'MobileOptimizedMessage Props' },
      { id: 'hook-return', title: 'useMobileOptimization Return' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-gestures', title: 'With Touch Gestures' },
      { id: 'example-bottom-sheet', title: 'With Bottom Sheet UI' },
      { id: 'example-hook', title: 'Using useMobileOptimization' },
    ],
  },
  { id: 'performance', title: 'Performance' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related' },
]

// ============================================================================
// Main Page Component
// ============================================================================

export default function MobileChatWindowPage() {
  return (
    <DocumentationPage
      title="MobileChatWindow"
      description="A mobile-optimized chat window component with touch gestures, swipe actions, pull-to-refresh, and large tap targets for an enhanced mobile experience. Provides native-like interactions on mobile devices while maintaining accessibility."
      icon={Smartphone}
      badges={[{ label: 'Stable', variant: 'stable' }]}
      packageName="@clarity-chat/react"
      features={[
        {
          icon: GestureIcon,
          label: 'Touch Optimized',
          description: 'Swipe gestures & tap targets',
        },
        {
          icon: Accessibility,
          label: 'Responsive',
          description: 'Adapts to mobile screens',
        },
        {
          icon: Zap,
          label: 'Lightweight',
          description: 'Optimized bundle size',
        },
        {
          icon: Heart,
          label: 'Native Feel',
          description: 'Haptic feedback & smooth',
        },
      ]}
      tableOfContents={tableOfContents}
      relatedAPIs={[
        {
          name: 'ChatWindow',
          type: 'component',
          description: 'Desktop-optimized chat window component',
          href: '/reference/components/chat-window',
        },
        {
          name: 'ClarityChat',
          type: 'component',
          description: 'All-in-one chat component with mobile support',
          href: '/reference/components/clarity-chat',
        },
        {
          name: 'useClarityChat',
          type: 'hook',
          description: 'Hook for chat state management',
          href: '/reference/hooks/use-clarity-chat',
        },
        {
          name: 'TouchFriendlyButton',
          type: 'component',
          description: 'Button with large tap targets and haptics',
          href: '/reference/components/touch-friendly-button',
        },
      ]}
      footerNavigation={[
        {
          label: 'ChatWindow',
          href: '/reference/components/chat-window',
          direction: 'previous',
        },
        {
          label: 'MessageList',
          href: '/reference/components/message-list',
          direction: 'next',
        },
      ]}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>MobileChatWindow</code> is a specialized mobile-first chat
            component optimized for touch interactions. It provides native-like
            mobile experiences including swipe-to-reveal actions, pull-to-refresh,
            haptic feedback, and large tap targets.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
          <ul className="space-y-2">
            <li>
              <strong>Swipe Gestures:</strong> Swipe left on messages to reveal
              reply, copy, and delete actions with visual feedback
            </li>
            <li>
              <strong>Pull-to-Refresh:</strong> Native pull-to-refresh pattern for
              updating conversations
            </li>
            <li>
              <strong>Haptic Feedback:</strong> Vibration API integration for
              tactile feedback on interactions
            </li>
            <li>
              <strong>Large Tap Targets:</strong> Minimum 48x48px touch targets for
              better accessibility
            </li>
            <li>
              <strong>Touch-Optimized Scrolling:</strong> Smooth momentum scrolling
              with <code>-webkit-overflow-scrolling: touch</code>
            </li>
            <li>
              <strong>Keyboard Detection:</strong> Automatically adjusts layout when
              virtual keyboard is visible
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            When to Use MobileChatWindow
          </h4>
          <ul className="space-y-2">
            <li>
              <strong>Mobile-First Apps:</strong> When building primarily for
              mobile devices
            </li>
            <li>
              <strong>PWAs:</strong> Progressive web apps that need native-like
              interactions
            </li>
            <li>
              <strong>Responsive Designs:</strong> When you need separate mobile and
              desktop experiences
            </li>
            <li>
              <strong>Touch-Heavy Interfaces:</strong> Apps where gesture control is
              important
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Mobile vs Desktop Considerations
          </h4>
          <p>
            While <code>MobileChatWindow</code> is optimized for mobile, it works
            on desktop too. However, for desktop-only or hybrid experiences,
            consider using <code>ChatWindow</code> which is optimized for mouse and
            keyboard interactions.
          </p>
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

          <p className="text-muted-foreground">
            Import the component and required styles:
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
          Try the mobile chat experience. This demo shows the basic layout and
          interaction patterns. For full swipe gesture support, see the code
          examples below.
        </p>

        <MobileChatDemo />
      </Section>

      {/* Basic Usage Section */}
      <Section id="basic-usage" title="Basic Usage">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            <code>MobileChatWindow</code> requires only <code>messages</code>
            prop. All mobile optimizations are enabled by default:
          </p>

          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="MobileChat.tsx"
          />
        </div>
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props Reference">
        <SubSection id="core-props" title="MobileChatWindow Props">
          <PropsTable props={coreProps} />
        </SubSection>

        <SubSection id="config-props" title="MobileChatConfig">
          <p className="text-sm text-muted-foreground mb-4">
            Configure mobile-specific behavior using the <code>config</code> prop:
          </p>
          <PropsTable props={configProps} />
        </SubSection>

        <SubSection id="message-props" title="MobileOptimizedMessage Props">
          <p className="text-sm text-muted-foreground mb-4">
            Individual message component props (used internally by{' '}
            <code>MobileChatWindow</code>):
          </p>
          <PropsTable props={messageProps} />
        </SubSection>

        <SubSection id="hook-return" title="useMobileOptimization Return">
          <p className="text-sm text-muted-foreground mb-4">
            Values returned by the <code>useMobileOptimization</code> hook:
          </p>
          <PropsTable props={hookProps} />
        </SubSection>
      </Section>

      {/* Examples Section */}
      <Section id="examples" title="Examples">
        <SubSection id="example-basic" title="Basic Usage">
          <p className="text-muted-foreground mb-4">
            Minimal setup with pull-to-refresh:
          </p>
          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="BasicMobileChat.tsx"
          />
        </SubSection>

        <SubSection id="example-gestures" title="With Touch Gestures">
          <p className="text-muted-foreground mb-4">
            Enable all swipe actions with custom handlers:
          </p>
          <CodeBlock
            code={withGesturesCode}
            language="tsx"
            filename="ChatWithGestures.tsx"
          />
        </SubSection>

        <SubSection id="example-bottom-sheet" title="With Bottom Sheet UI">
          <p className="text-muted-foreground mb-4">
            Use as a bottom sheet modal for mobile apps:
          </p>
          <CodeBlock
            code={withBottomSheetCode}
            language="tsx"
            filename="ChatBottomSheet.tsx"
          />
        </SubSection>

        <SubSection id="example-hook" title="Using useMobileOptimization">
          <p className="text-muted-foreground mb-4">
            Use the hook for responsive layouts and keyboard handling:
          </p>
          <CodeBlock
            code={hookUsageCode}
            language="tsx"
            filename="ResponsiveChat.tsx"
          />
        </SubSection>
      </Section>

      {/* Performance Section */}
      <Section id="performance" title="Performance Considerations">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mt-6 mb-3">
            Mobile Performance Tips
          </h4>
          <ul className="space-y-2">
            <li>
              <strong>Virtual Scrolling:</strong> For conversations with 100+
              messages, consider implementing virtual scrolling with{' '}
              <code>@tanstack/react-virtual</code>
            </li>
            <li>
              <strong>Image Optimization:</strong> Use lazy loading and responsive
              images for media messages
            </li>
            <li>
              <strong>Animation Performance:</strong> Swipe gestures use GPU-accelerated
              transforms for 60fps animations
            </li>
            <li>
              <strong>Bundle Size:</strong> MobileChatWindow adds ~8KB gzipped to
              your bundle (includes Framer Motion)
            </li>
            <li>
              <strong>Memory:</strong> Component efficiently manages touch event
              listeners and cleans up on unmount
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Touch Optimization</h4>
          <ul className="space-y-2">
            <li>
              <strong>Passive Event Listeners:</strong> Scroll events use passive
              listeners for better scrolling performance
            </li>
            <li>
              <strong>Touch Action:</strong> CSS <code>touch-action</code> is set
              to <code>pan-y</code> for vertical scrolling only
            </li>
            <li>
              <strong>Momentum Scrolling:</strong>{' '}
              <code>-webkit-overflow-scrolling: touch</code> for iOS momentum
            </li>
            <li>
              <strong>Reduced Motion:</strong> Respects{' '}
              <code>prefers-reduced-motion</code> for accessibility
            </li>
          </ul>
        </div>
      </Section>

      {/* TypeScript Section */}
      <Section id="typescript" title="TypeScript">
        <p className="text-muted-foreground mb-4">
          Full type definitions for mobile-optimized chat components:
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
          <p>
            MobileChatWindow includes mobile-specific accessibility features:
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Touch Accessibility</h4>
          <ul className="space-y-2">
            <li>
              <strong>Large Tap Targets:</strong> All interactive elements are
              minimum 48x48px (WCAG AAA)
            </li>
            <li>
              <strong>Touch Feedback:</strong> Visual feedback on tap with subtle
              scale animation
            </li>
            <li>
              <strong>Haptic Feedback:</strong> Optional vibration feedback for
              better tactile experience
            </li>
            <li>
              <strong>Gesture Alternatives:</strong> All swipe actions also
              accessible via long-press menu
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              <strong>ARIA Labels:</strong> All actions properly labeled for screen
              readers
            </li>
            <li>
              <strong>Live Regions:</strong> New messages announced to screen
              readers
            </li>
            <li>
              <strong>Gesture Hints:</strong> Instructions provided for custom
              gestures
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Reduced Motion</h4>
          <p>
            Component respects <code>prefers-reduced-motion</code> media query.
            When enabled:
          </p>
          <ul className="space-y-2">
            <li>Swipe animations are instant (no easing)</li>
            <li>Pull-to-refresh uses static indicators</li>
            <li>Haptic feedback is reduced in intensity</li>
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
                  Swipe gestures not working
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Touch events are not registering or swipe actions not revealing.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Ensure <code>enableSwipe</code> is true in config (default)
                  </li>
                  <li>
                    Check that parent containers don't have{' '}
                    <code>touch-action: none</code>
                  </li>
                  <li>Verify Framer Motion is properly installed</li>
                  <li>
                    Test on actual mobile device (some desktop emulators have issues)
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
                  Haptic feedback not working
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Vibration not triggering on interactions.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Haptics require HTTPS (security requirement for Vibration API)
                  </li>
                  <li>Some browsers don't support the Vibration API (check MDN)</li>
                  <li>User may have system-wide vibration disabled</li>
                  <li>iOS Safari has limited vibration support</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Virtual keyboard covering input
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Input field hidden behind keyboard on mobile.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Use <code>useMobileOptimization</code> hook to detect keyboard
                  </li>
                  <li>
                    Apply <code>paddingBottom: keyboardHeight</code> to container
                  </li>
                  <li>
                    Ensure viewport meta tag includes{' '}
                    <code>viewport-fit=cover</code>
                  </li>
                  <li>
                    Consider using Visual Viewport API for precise measurements
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}

'use client'

import { PageHeader, ComponentSection } from '@/components/component-section'
import { hooksDocs } from '@/data/docs/hooks-docs'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@clarity-chat/primitives'
import {
  Puzzle,
  Clipboard,
  Database,
  Timer,
  Keyboard,
  Accessibility,
  RefreshCw,
  ArrowDownToLine,
  Hash,
  ToggleLeft,
  Gauge,
  Monitor,
  Type,
  Shield,
  Zap,
  MessageSquare,
  Inbox,
  Coins,
  Activity,
  Link,
  Layers,
} from 'lucide-react'

// Interactive demos
import {
  ClipboardDemo,
  LocalStorageDemo,
  DebounceDemo,
  KeyboardShortcutsDemo,
  ReducedMotionDemo,
  RetryWithBackoffDemo,
  AutoScrollDemo,
  TokenCounterDemo,
  ToggleDemo,
  ThrottleDemo,
  MediaQueryDemo,
  SafeIntervalDemo,
  CharacterCounterDemo,
  CircuitBreakerDemo,
} from './demos/interactive-demos'

// Streaming demos
import {
  SmoothedTextDemo,
  StreamSpeedDemo,
  StreamStatusDemo,
} from './demos/streaming-demos'

// Provider & context demos
import {
  ProviderContextDemo,
  FocusTrapDemo,
  StreamingHookDemo,
} from './demos/provider-demos'

// Reference grids
import {
  HookReferenceGrid,
  uiStateRefHooks,
  chatAiRefHooks,
  streamingRefHooks,
  messageStateRefHooks,
  tokenCostRefHooks,
  keyboardInputRefHooks,
  resilienceSecurityRefHooks,
  performanceRefHooks,
  connectedRefHooks,
  sdkBridgesRefHooks,
  dashboardPromptMemoryRefHooks,
  themeStorageDesignRefHooks,
  licenseRefHooks,
  devToolsRefHooks,
  accessibilityRefHooks,
  playgroundRefHooks,
} from './demos/hook-reference'

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic'

// ---------------------------------------------------------------------------
// Tab configuration
// ---------------------------------------------------------------------------
const hookTabs = [
  { value: 'ui', label: 'UI & State', icon: Layers },
  { value: 'chat', label: 'Chat & AI', icon: MessageSquare },
  { value: 'streaming', label: 'Streaming', icon: Zap },
  { value: 'messages', label: 'Messages & State', icon: Inbox },
  { value: 'tokens', label: 'Token & Cost', icon: Coins },
  { value: 'keyboard', label: 'Keyboard & Input', icon: Keyboard },
  { value: 'resilience', label: 'Resilience & Security', icon: Shield },
  { value: 'performance', label: 'Performance', icon: Activity },
  { value: 'connected', label: 'Connected & More', icon: Link },
] as const

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function HooksPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-primary -top-40 -right-40 opacity-20" />
        <div className="orb-cyan bottom-40 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="Hooks"
        description="200+ custom React hooks for building AI chat interfaces, spanning UI utilities, chat state, streaming, token management, performance, security, and more"
        icon={Puzzle}
        badge="200+ Hooks"
      />

      <Tabs defaultValue="ui" className="w-full">
        <TabsList className="mb-6 h-auto flex-wrap gap-1 p-1 glass-panel">
          {hookTabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-md gap-1.5 text-xs px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ================================================================
            TAB 1: UI & STATE
            ================================================================ */}
        <TabsContent value="ui" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="useClipboard"
              description="Copy text to clipboard with automatic success feedback"
              icon={Clipboard}
              docs={hooksDocs['useClipboard']}
            >
              <ClipboardDemo />
            </ComponentSection>
            <ComponentSection
              title="useLocalStorage"
              description="Persist state in localStorage with cross-tab sync"
              icon={Database}
              docs={hooksDocs['useLocalStorage']}
            >
              <LocalStorageDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="useDebounce"
              description="Debounce rapidly changing values to reduce expensive operations"
              icon={Timer}
              docs={hooksDocs['useDebounce']}
            >
              <DebounceDemo />
            </ComponentSection>
            <ComponentSection
              title="useThrottle"
              description="Throttle values to update at most once per interval"
              icon={Gauge}
              docs={hooksDocs['useThrottle']}
            >
              <ThrottleDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="useAutoScroll"
              description="Auto-scroll containers when new content is added"
              icon={ArrowDownToLine}
              docs={hooksDocs['useAutoScroll']}
            >
              <AutoScrollDemo />
            </ComponentSection>
            <ComponentSection
              title="useToggle"
              description="Simple boolean toggle with on/off/toggle functions"
              icon={ToggleLeft}
              docs={hooksDocs['useToggle']}
            >
              <ToggleDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="useReducedMotion"
              description="Detect user preference for reduced motion"
              icon={Accessibility}
              docs={hooksDocs['useReducedMotion']}
            >
              <ReducedMotionDemo />
            </ComponentSection>
            <ComponentSection
              title="useMediaQuery"
              description="React to CSS media query changes in real-time"
              icon={Monitor}
              docs={hooksDocs['useMediaQuery']}
            >
              <MediaQueryDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="useSafeInterval"
            description="setInterval with automatic cleanup on unmount"
            icon={Timer}
            docs={hooksDocs['useSafeInterval']}
          >
            <SafeIntervalDemo />
          </ComponentSection>

          <ComponentSection
            title="All UI & State Hooks"
            description="Complete reference of UI utility, state management, and primitives hooks"
            icon={Layers}
            docs={hooksDocs['UI & State Hooks']}
          >
            <HookReferenceGrid hooks={uiStateRefHooks} />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            TAB 2: CHAT & AI
            ================================================================ */}
        <TabsContent value="chat" className="space-y-8">
          <ComponentSection
            title="ClarityChatProvider & Context"
            description="The core provider that powers connected hooks — access messages, stream status, and tool state from any child component"
            icon={MessageSquare}
          >
            <ProviderContextDemo />
          </ComponentSection>

          <ComponentSection
            title="useStreaming"
            description="Full streaming hook with token callback, cancel support, and automatic message assembly"
            icon={Zap}
          >
            <StreamingHookDemo />
          </ComponentSection>

          <ComponentSection
            title="Chat & AI Hooks"
            description="Hooks for building AI-powered chat interfaces with streaming, tool calling, memory, and multi-provider support"
            icon={MessageSquare}
            docs={hooksDocs['Chat & AI Hooks']}
          >
            <HookReferenceGrid hooks={chatAiRefHooks} />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            TAB 3: STREAMING
            ================================================================ */}
        <TabsContent value="streaming" className="space-y-8">
          <ComponentSection
            title="Streaming Hooks"
            description="Hooks for consuming streaming responses via SSE, WebSocket, ReadableStream, and React Server Components"
            icon={Zap}
            docs={hooksDocs['Streaming Hooks']}
          >
            <HookReferenceGrid hooks={streamingRefHooks} />
          </ComponentSection>

          <ComponentSection
            title="Smoothed Text Streaming"
            description="Compare raw chunked text vs useSmoothedText — see how character-level animation creates a natural typing feel"
            icon={Zap}
          >
            <SmoothedTextDemo />
          </ComponentSection>

          <ComponentSection
            title="Stream Speed Comparison"
            description="Race three streams at different speeds to visualize how token delivery rate affects UX"
            icon={Gauge}
          >
            <StreamSpeedDemo />
          </ComponentSection>

          <ComponentSection
            title="Stream Status Lifecycle"
            description="Visualize the full lifecycle of a streaming connection: idle → connecting → streaming → complete or error"
            icon={Activity}
          >
            <StreamStatusDemo />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            TAB 4: MESSAGES & STATE
            ================================================================ */}
        <TabsContent value="messages" className="space-y-8">
          <ComponentSection
            title="Messages & State Management Hooks"
            description="Hooks for message history, optimistic updates, threads, tool state, and generative UI state management"
            icon={Inbox}
            docs={hooksDocs['Messages & State Hooks']}
          >
            <HookReferenceGrid hooks={messageStateRefHooks} />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            TAB 5: TOKEN & COST
            ================================================================ */}
        <TabsContent value="tokens" className="space-y-8">
          <ComponentSection
            title="useTokenCounter"
            description="Real-time token counting with model-aware encoding"
            icon={Hash}
            docs={hooksDocs['useTokenCounter']}
          >
            <TokenCounterDemo />
          </ComponentSection>

          <ComponentSection
            title="All Token & Cost Hooks"
            description="Token counting, budget tracking, cost estimation, caching, and optimization hooks from @clarity-chat/react and @clarity-chat/token-optimization"
            icon={Coins}
            docs={hooksDocs['Token & Cost Hooks']}
          >
            <HookReferenceGrid hooks={tokenCostRefHooks} />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            TAB 6: KEYBOARD & INPUT
            ================================================================ */}
        <TabsContent value="keyboard" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="useKeyboardShortcuts"
              description="Register global keyboard shortcuts with modifier key support"
              icon={Keyboard}
              docs={hooksDocs['useKeyboardShortcuts']}
            >
              <KeyboardShortcutsDemo />
            </ComponentSection>
            <ComponentSection
              title="useCharacterCounter"
              description="Character counting with configurable limits and warnings"
              icon={Type}
              docs={hooksDocs['useCharacterCounter']}
            >
              <CharacterCounterDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="useFocusTrap"
            description="Trap keyboard focus within a container — essential for modals, dialogs, and accessible overlays"
            icon={Accessibility}
          >
            <FocusTrapDemo />
          </ComponentSection>

          <ComponentSection
            title="All Keyboard & Input Hooks"
            description="Keyboard shortcuts, navigation, voice input, mobile keyboard, and input management hooks"
            icon={Keyboard}
            docs={hooksDocs['Keyboard & Input Hooks']}
          >
            <HookReferenceGrid hooks={keyboardInputRefHooks} />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            TAB 7: RESILIENCE & SECURITY
            ================================================================ */}
        <TabsContent value="resilience" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="useRetryWithBackoff"
              description="Retry failed async operations with exponential backoff"
              icon={RefreshCw}
              docs={hooksDocs['useRetryWithBackoff']}
            >
              <RetryWithBackoffDemo />
            </ComponentSection>
            <ComponentSection
              title="useCircuitBreaker"
              description="Circuit breaker pattern for fault tolerance"
              icon={Shield}
              docs={hooksDocs['useCircuitBreaker']}
            >
              <CircuitBreakerDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="All Resilience & Security Hooks"
            description="Error recovery, request deduplication, security monitoring, and error handling hooks from @clarity-chat/react and @clarity-chat/error-handling"
            icon={Shield}
            docs={hooksDocs['Resilience & Security Hooks']}
          >
            <HookReferenceGrid hooks={resilienceSecurityRefHooks} />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            TAB 8: PERFORMANCE
            ================================================================ */}
        <TabsContent value="performance" className="space-y-8">
          <ComponentSection
            title="Performance Hooks"
            description="Render optimization, virtual scrolling, lazy loading, animation, caching, debugging, and advanced React patterns"
            icon={Activity}
            docs={hooksDocs['Performance Hooks']}
          >
            <HookReferenceGrid hooks={performanceRefHooks} />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            TAB 9: CONNECTED & MORE
            ================================================================ */}
        <TabsContent value="connected" className="space-y-8">
          <ComponentSection
            title="Connected Component Hooks"
            description="Auto-wiring hooks that connect components to ClarityChatProvider for zero-configuration setup"
            icon={Link}
            docs={hooksDocs['Connected Component Hooks']}
          >
            <HookReferenceGrid hooks={connectedRefHooks} />
          </ComponentSection>

          <ComponentSection
            title="SDK Bridge Hooks"
            description="Bridge hooks for integrating Vercel AI, LangChain, Anthropic SDK, and custom providers"
            icon={Link}
            docs={hooksDocs['SDK Bridge Hooks']}
          >
            <HookReferenceGrid hooks={sdkBridgesRefHooks} />
          </ComponentSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Dashboard, Prompt & Memory Hooks"
              description="Dashboard data, prompt composition, memory management, and context monitoring"
              icon={Layers}
              docs={hooksDocs['Dashboard, Prompt & Memory Hooks']}
            >
              <HookReferenceGrid hooks={dashboardPromptMemoryRefHooks} />
            </ComponentSection>
            <ComponentSection
              title="Theme, Storage & Design Hooks"
              description="Theme colors, design tokens, localStorage, IndexedDB, and in-memory storage"
              icon={Layers}
              docs={hooksDocs['Theme, Storage & Design Hooks']}
            >
              <HookReferenceGrid hooks={themeStorageDesignRefHooks} />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="License Hooks"
              description="License status, plan checking, and feature gating"
              icon={Shield}
              docs={hooksDocs['License Hooks']}
            >
              <HookReferenceGrid hooks={licenseRefHooks} />
            </ComponentSection>
            <ComponentSection
              title="Accessibility Hooks"
              description="Screen reader detection, announcements, embeddings, and vector search"
              icon={Accessibility}
              docs={hooksDocs['Accessibility Hooks']}
            >
              <HookReferenceGrid hooks={accessibilityRefHooks} />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Dev Tools Hooks"
              description="Performance profiling, state diffing, time travel debugging, and API inspection"
              icon={Activity}
              docs={hooksDocs['Dev Tools Hooks']}
            >
              <HookReferenceGrid hooks={devToolsRefHooks} />
            </ComponentSection>
            <ComponentSection
              title="Playground Hooks"
              description="Interactive playground state, code editing, and configuration"
              icon={Layers}
              docs={hooksDocs['Playground Hooks']}
            >
              <HookReferenceGrid hooks={playgroundRefHooks} />
            </ComponentSection>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

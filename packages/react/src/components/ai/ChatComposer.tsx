'use client'

/**
 * ChatComposer - Declarative Chat Layout Builder
 *
 * A composable chat builder with sensible defaults that allows
 * declaratively assembling chat UIs from clarity-chat components.
 *
 * Features:
 * - Multiple layout presets (standard, split-panel, minimal, fullscreen)
 * - Feature toggles for thinking, streaming, tools, suggestions
 * - Slot-based composition with Header, Messages, Input, etc.
 * - Auto-connection to ClarityChatProvider when available
 * - Responsive design with customizable breakpoints
 *
 * @example
 * ```tsx
 * // Simple usage with defaults
 * <ChatComposer>
 *   <ChatComposer.Messages />
 *   <ChatComposer.Input />
 * </ChatComposer>
 *
 * // Full-featured with customization
 * <ChatComposer layout="split-panel" features={['thinking', 'tools']}>
 *   <ChatComposer.Header>
 *     <Welcome title="My Assistant" />
 *   </ChatComposer.Header>
 *   <ChatComposer.Sidebar>
 *     <AgentPanel />
 *   </ChatComposer.Sidebar>
 *   <ChatComposer.Messages />
 *   <ChatComposer.Input>
 *     <Sender allowAttachments />
 *   </ChatComposer.Input>
 * </ChatComposer>
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

/** Available layout presets */
export type ChatComposerLayout =
  | 'standard'      // Header, Messages, Input stacked
  | 'split-panel'   // Messages left, Agent panel right
  | 'minimal'       // Compact, no frills
  | 'fullscreen'    // Full viewport with optional sidebar
  | 'embedded'      // For embedding in other UIs

/** Features that can be enabled/disabled */
export type ChatComposerFeature =
  | 'thinking'      // Show thinking indicators
  | 'streaming'     // Show streaming progress
  | 'tools'         // Show tool execution cards
  | 'suggestions'   // Show suggestion chips
  | 'citations'     // Show citation overlays
  | 'attachments'   // Allow file attachments
  | 'voice'         // Voice input support
  | 'welcome'       // Show welcome screen when empty

/** Slot identifiers for composition */
export type ChatComposerSlot =
  | 'header'
  | 'sidebar'
  | 'messages'
  | 'thinking'
  | 'tools'
  | 'input'
  | 'suggestions'
  | 'footer'

/** Chat composer context value */
export interface ChatComposerContextValue {
  /** Current layout */
  layout: ChatComposerLayout
  /** Enabled features */
  features: Set<ChatComposerFeature>
  /** Check if a feature is enabled */
  hasFeature: (feature: ChatComposerFeature) => boolean
  /** Current variant */
  variant: 'default' | 'compact' | 'comfortable'
  /** Whether to auto-connect to ClarityChatProvider */
  autoConnect: boolean
  /** Whether sidebar is open (for split layouts) */
  sidebarOpen: boolean
  /** Toggle sidebar */
  toggleSidebar: () => void
  /** Set sidebar state */
  setSidebarOpen: (open: boolean) => void
  /** Registered slots */
  slots: Map<ChatComposerSlot, React.ReactNode>
  /** Register a slot */
  registerSlot: (slot: ChatComposerSlot, content: React.ReactNode) => void
  /** Unregister a slot */
  unregisterSlot: (slot: ChatComposerSlot) => void
}

/** Main component props */
export interface ChatComposerProps {
  children?: React.ReactNode
  /** Layout preset */
  layout?: ChatComposerLayout
  /** Features to enable */
  features?: ChatComposerFeature[]
  /** Component variant */
  variant?: 'default' | 'compact' | 'comfortable'
  /** Auto-connect components to ClarityChatProvider */
  autoConnect?: boolean
  /** Custom class name */
  className?: string
  /** Custom styles */
  style?: React.CSSProperties
  /** Default sidebar state for split layouts */
  defaultSidebarOpen?: boolean
  /** Controlled sidebar state */
  sidebarOpen?: boolean
  /** Sidebar state change callback */
  onSidebarOpenChange?: (open: boolean) => void
  /** Min height for the composer */
  minHeight?: string | number
  /** Max height for the composer */
  maxHeight?: string | number
  /** Show empty state when no messages */
  showEmptyState?: boolean
  /** Custom empty state content */
  emptyState?: React.ReactNode
}

/** Slot component props */
export interface SlotProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/** Header slot props */
export interface HeaderSlotProps extends SlotProps {
  sticky?: boolean
  bordered?: boolean
}

/** Messages slot props */
export interface MessagesSlotProps extends SlotProps {
  /** Enable auto-scroll */
  autoScroll?: boolean
  /** Scroll behavior */
  scrollBehavior?: 'smooth' | 'instant'
  /** Padding variant */
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

/** Sidebar slot props */
export interface SidebarSlotProps extends SlotProps {
  /** Sidebar position */
  position?: 'left' | 'right'
  /** Sidebar width */
  width?: string | number
  /** Collapsible on mobile */
  collapsible?: boolean
  /** Overlay on mobile vs push content */
  mobileMode?: 'overlay' | 'push'
}

/** Input slot props */
export interface InputSlotProps extends SlotProps {
  /** Sticky to bottom */
  sticky?: boolean
  /** Show border at top */
  bordered?: boolean
  /** Padding variant */
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

// ============================================================================
// Context
// ============================================================================

const ChatComposerContext = React.createContext<ChatComposerContextValue | null>(null)

/**
 * Hook to access ChatComposer context
 */
export function useChatComposer(): ChatComposerContextValue {
  const context = React.useContext(ChatComposerContext)
  if (!context) {
    throw new Error('useChatComposer must be used within a ChatComposer')
  }
  return context
}

/**
 * Check if inside a ChatComposer
 */
export function useIsChatComposerChild(): boolean {
  return React.useContext(ChatComposerContext) !== null
}

// ============================================================================
// Default Features
// ============================================================================

const DEFAULT_FEATURES: ChatComposerFeature[] = [
  'thinking',
  'streaming',
  'tools',
  'suggestions',
]

// ============================================================================
// Main Component
// ============================================================================

/**
 * ChatComposer - Main component
 */
export function ChatComposer({
  children,
  layout = 'standard',
  features = DEFAULT_FEATURES,
  variant = 'default',
  autoConnect = true,
  className,
  style,
  defaultSidebarOpen = true,
  sidebarOpen: controlledSidebarOpen,
  onSidebarOpenChange,
  minHeight = '400px',
  maxHeight,
  showEmptyState = true,
  emptyState,
}: ChatComposerProps) {
  const prefersReducedMotion = useReducedMotion()
  const [slots, setSlots] = React.useState<Map<ChatComposerSlot, React.ReactNode>>(new Map())
  const [internalSidebarOpen, setInternalSidebarOpen] = React.useState(defaultSidebarOpen)

  const sidebarOpen = controlledSidebarOpen ?? internalSidebarOpen
  const setSidebarOpen = React.useCallback(
    (open: boolean) => {
      setInternalSidebarOpen(open)
      onSidebarOpenChange?.(open)
    },
    [onSidebarOpenChange]
  )

  const toggleSidebar = React.useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen, setSidebarOpen])

  const featureSet = React.useMemo(() => new Set(features), [features])
  const hasFeature = React.useCallback(
    (feature: ChatComposerFeature) => featureSet.has(feature),
    [featureSet]
  )

  const registerSlot = React.useCallback(
    (slot: ChatComposerSlot, content: React.ReactNode) => {
      setSlots((prev) => {
        const next = new Map(prev)
        next.set(slot, content)
        return next
      })
    },
    []
  )

  const unregisterSlot = React.useCallback((slot: ChatComposerSlot) => {
    setSlots((prev) => {
      const next = new Map(prev)
      next.delete(slot)
      return next
    })
  }, [])

  const contextValue: ChatComposerContextValue = React.useMemo(
    () => ({
      layout,
      features: featureSet,
      hasFeature,
      variant,
      autoConnect,
      sidebarOpen,
      toggleSidebar,
      setSidebarOpen,
      slots,
      registerSlot,
      unregisterSlot,
    }),
    [
      layout,
      featureSet,
      hasFeature,
      variant,
      autoConnect,
      sidebarOpen,
      toggleSidebar,
      setSidebarOpen,
      slots,
      registerSlot,
      unregisterSlot,
    ]
  )

  // Build the layout
  const renderLayout = () => {
    const header = slots.get('header')
    const sidebar = slots.get('sidebar')
    const messages = slots.get('messages')
    const thinking = slots.get('thinking')
    const tools = slots.get('tools')
    const input = slots.get('input')
    const suggestions = slots.get('suggestions')
    const footer = slots.get('footer')

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: prefersReducedMotion ? 0 : DURATION_SECONDS.normal,
          ease: EASING_FRAMER.easeOut,
        },
      },
    }

    const sidebarVariants = {
      open: {
        width: 'auto',
        opacity: 1,
        transition: {
          duration: prefersReducedMotion ? 0 : DURATION_SECONDS.normal,
          ease: EASING_FRAMER.easeOut,
        },
      },
      closed: {
        width: 0,
        opacity: 0,
        transition: {
          duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
          ease: EASING_FRAMER.easeIn,
        },
      },
    }

    switch (layout) {
      case 'split-panel':
        return (
          <motion.div
            className="chat-composer-split"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="chat-composer-main">
              {header && <div className="chat-composer-header">{header}</div>}
              {hasFeature('thinking') && thinking && (
                <div className="chat-composer-thinking">{thinking}</div>
              )}
              <div className="chat-composer-messages">{messages}</div>
              {hasFeature('tools') && tools && (
                <div className="chat-composer-tools">{tools}</div>
              )}
              {hasFeature('suggestions') && suggestions && (
                <div className="chat-composer-suggestions">{suggestions}</div>
              )}
              {input && <div className="chat-composer-input">{input}</div>}
              {footer && <div className="chat-composer-footer">{footer}</div>}
            </div>
            <AnimatePresence>
              {sidebarOpen && sidebar && (
                <motion.div
                  className="chat-composer-sidebar"
                  variants={sidebarVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {sidebar}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )

      case 'minimal':
        return (
          <motion.div
            className="chat-composer-minimal"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="chat-composer-messages">{messages}</div>
            {input && <div className="chat-composer-input">{input}</div>}
          </motion.div>
        )

      case 'fullscreen':
        return (
          <motion.div
            className="chat-composer-fullscreen"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {header && <div className="chat-composer-header">{header}</div>}
            <div className="chat-composer-body">
              <AnimatePresence>
                {sidebarOpen && sidebar && (
                  <motion.div
                    className="chat-composer-sidebar"
                    variants={sidebarVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    {sidebar}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="chat-composer-content">
                {hasFeature('thinking') && thinking && (
                  <div className="chat-composer-thinking">{thinking}</div>
                )}
                <div className="chat-composer-messages">{messages}</div>
                {hasFeature('tools') && tools && (
                  <div className="chat-composer-tools">{tools}</div>
                )}
              </div>
            </div>
            {hasFeature('suggestions') && suggestions && (
              <div className="chat-composer-suggestions">{suggestions}</div>
            )}
            {input && <div className="chat-composer-input">{input}</div>}
            {footer && <div className="chat-composer-footer">{footer}</div>}
          </motion.div>
        )

      case 'embedded':
        return (
          <motion.div
            className="chat-composer-embedded"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {hasFeature('thinking') && thinking && (
              <div className="chat-composer-thinking">{thinking}</div>
            )}
            <div className="chat-composer-messages">{messages}</div>
            {input && <div className="chat-composer-input">{input}</div>}
          </motion.div>
        )

      case 'standard':
      default:
        return (
          <motion.div
            className="chat-composer-standard"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {header && <div className="chat-composer-header">{header}</div>}
            {hasFeature('thinking') && thinking && (
              <div className="chat-composer-thinking">{thinking}</div>
            )}
            <div className="chat-composer-messages">{messages}</div>
            {hasFeature('tools') && tools && (
              <div className="chat-composer-tools">{tools}</div>
            )}
            {hasFeature('suggestions') && suggestions && (
              <div className="chat-composer-suggestions">{suggestions}</div>
            )}
            {input && <div className="chat-composer-input">{input}</div>}
            {footer && <div className="chat-composer-footer">{footer}</div>}
          </motion.div>
        )
    }
  }

  return (
    <ChatComposerContext.Provider value={contextValue}>
      <div
        className={`chat-composer chat-composer-${layout} chat-composer-${variant} ${className || ''}`}
        style={{
          minHeight,
          maxHeight,
          ...style,
        }}
        data-layout={layout}
        data-variant={variant}
        data-auto-connect={autoConnect}
      >
        {children}
        {renderLayout()}
        {showEmptyState && slots.size === 0 && emptyState && (
          <div className="chat-composer-empty">{emptyState}</div>
        )}
      </div>
    </ChatComposerContext.Provider>
  )
}

// ============================================================================
// Slot Components
// ============================================================================

/**
 * Generic slot component
 */
function createSlotComponent(slotName: ChatComposerSlot) {
  function SlotComponent({ children, className, style }: SlotProps) {
    const { registerSlot, unregisterSlot } = useChatComposer()

    React.useEffect(() => {
      registerSlot(
        slotName,
        <div className={`chat-composer-slot-${slotName} ${className || ''}`} style={style}>
          {children}
        </div>
      )
      return () => unregisterSlot(slotName)
    }, [children, className, style, registerSlot, unregisterSlot])

    return null
  }

  SlotComponent.displayName = `ChatComposer.${slotName.charAt(0).toUpperCase() + slotName.slice(1)}`
  return SlotComponent
}

/**
 * Header slot - For welcome messages, model selectors, etc.
 */
function Header({ children, className, style, sticky = false, bordered = true }: HeaderSlotProps) {
  const { registerSlot, unregisterSlot } = useChatComposer()

  React.useEffect(() => {
    registerSlot(
      'header',
      <div
        className={`chat-composer-slot-header ${sticky ? 'sticky' : ''} ${bordered ? 'bordered' : ''} ${className || ''}`}
        style={style}
      >
        {children}
      </div>
    )
    return () => unregisterSlot('header')
  }, [children, className, style, sticky, bordered, registerSlot, unregisterSlot])

  return null
}

/**
 * Messages slot - For conversation display
 */
function Messages({
  children,
  className,
  style,
  autoScroll = true,
  scrollBehavior = 'smooth',
  padding = 'md',
}: MessagesSlotProps) {
  const { registerSlot, unregisterSlot } = useChatComposer()
  const messagesRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll effect
  React.useEffect(() => {
    if (autoScroll && messagesRef.current) {
      const element = messagesRef.current
      element.scrollTo({
        top: element.scrollHeight,
        behavior: scrollBehavior,
      })
    }
  }, [children, autoScroll, scrollBehavior])

  React.useEffect(() => {
    registerSlot(
      'messages',
      <div
        ref={messagesRef}
        className={`chat-composer-slot-messages padding-${padding} ${className || ''}`}
        style={style}
        data-auto-scroll={autoScroll}
      >
        {children}
      </div>
    )
    return () => unregisterSlot('messages')
  }, [children, className, style, padding, autoScroll, registerSlot, unregisterSlot])

  return null
}

/**
 * Sidebar slot - For agent panels, settings, etc.
 */
function Sidebar({
  children,
  className,
  style,
  position = 'right',
  width = '320px',
  collapsible = true,
  mobileMode = 'overlay',
}: SidebarSlotProps) {
  const { registerSlot, unregisterSlot, sidebarOpen, toggleSidebar } = useChatComposer()

  React.useEffect(() => {
    registerSlot(
      'sidebar',
      <div
        className={`chat-composer-slot-sidebar position-${position} mobile-${mobileMode} ${className || ''}`}
        style={{ width, ...style }}
        data-collapsible={collapsible}
        data-open={sidebarOpen}
      >
        {collapsible && (
          <button
            className="chat-composer-sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <span className="toggle-icon">{sidebarOpen ? '×' : '☰'}</span>
          </button>
        )}
        <div className="chat-composer-sidebar-content">{children}</div>
      </div>
    )
    return () => unregisterSlot('sidebar')
  }, [
    children,
    className,
    style,
    position,
    width,
    collapsible,
    mobileMode,
    sidebarOpen,
    toggleSidebar,
    registerSlot,
    unregisterSlot,
  ])

  return null
}

/**
 * Thinking slot - For thinking indicators
 */
function Thinking({ children, className, style }: SlotProps) {
  const { registerSlot, unregisterSlot, hasFeature } = useChatComposer()

  React.useEffect(() => {
    if (!hasFeature('thinking')) return

    registerSlot(
      'thinking',
      <div className={`chat-composer-slot-thinking ${className || ''}`} style={style}>
        {children}
      </div>
    )
    return () => unregisterSlot('thinking')
  }, [children, className, style, hasFeature, registerSlot, unregisterSlot])

  return null
}

/**
 * Tools slot - For tool execution cards
 */
function Tools({ children, className, style }: SlotProps) {
  const { registerSlot, unregisterSlot, hasFeature } = useChatComposer()

  React.useEffect(() => {
    if (!hasFeature('tools')) return

    registerSlot(
      'tools',
      <div className={`chat-composer-slot-tools ${className || ''}`} style={style}>
        {children}
      </div>
    )
    return () => unregisterSlot('tools')
  }, [children, className, style, hasFeature, registerSlot, unregisterSlot])

  return null
}

/**
 * Input slot - For message input and attachments
 */
function Input({
  children,
  className,
  style,
  sticky = true,
  bordered = true,
  padding = 'md',
}: InputSlotProps) {
  const { registerSlot, unregisterSlot } = useChatComposer()

  React.useEffect(() => {
    registerSlot(
      'input',
      <div
        className={`chat-composer-slot-input ${sticky ? 'sticky' : ''} ${bordered ? 'bordered' : ''} padding-${padding} ${className || ''}`}
        style={style}
      >
        {children}
      </div>
    )
    return () => unregisterSlot('input')
  }, [children, className, style, sticky, bordered, padding, registerSlot, unregisterSlot])

  return null
}

/**
 * Suggestions slot - For suggestion chips
 */
function Suggestions({ children, className, style }: SlotProps) {
  const { registerSlot, unregisterSlot, hasFeature } = useChatComposer()

  React.useEffect(() => {
    if (!hasFeature('suggestions')) return

    registerSlot(
      'suggestions',
      <div className={`chat-composer-slot-suggestions ${className || ''}`} style={style}>
        {children}
      </div>
    )
    return () => unregisterSlot('suggestions')
  }, [children, className, style, hasFeature, registerSlot, unregisterSlot])

  return null
}

/**
 * Footer slot - For additional actions or info
 */
const Footer = createSlotComponent('footer')

// Attach slot components to ChatComposer
ChatComposer.Header = Header
ChatComposer.Messages = Messages
ChatComposer.Sidebar = Sidebar
ChatComposer.Thinking = Thinking
ChatComposer.Tools = Tools
ChatComposer.Input = Input
ChatComposer.Suggestions = Suggestions
ChatComposer.Footer = Footer

// ============================================================================
// Hook for Building Chat Composers Programmatically
// ============================================================================

export interface UseChatComposerOptions {
  layout?: ChatComposerLayout
  features?: ChatComposerFeature[]
  variant?: 'default' | 'compact' | 'comfortable'
  defaultSidebarOpen?: boolean
}

export interface UseChatComposerReturn {
  /** Props to spread on ChatComposer */
  composerProps: ChatComposerProps
  /** Layout state */
  layout: ChatComposerLayout
  /** Set layout */
  setLayout: (layout: ChatComposerLayout) => void
  /** Features */
  features: ChatComposerFeature[]
  /** Toggle feature */
  toggleFeature: (feature: ChatComposerFeature) => void
  /** Enable feature */
  enableFeature: (feature: ChatComposerFeature) => void
  /** Disable feature */
  disableFeature: (feature: ChatComposerFeature) => void
  /** Check if feature is enabled */
  hasFeature: (feature: ChatComposerFeature) => boolean
  /** Sidebar state */
  sidebarOpen: boolean
  /** Toggle sidebar */
  toggleSidebar: () => void
  /** Open sidebar */
  openSidebar: () => void
  /** Close sidebar */
  closeSidebar: () => void
}

/**
 * Hook for managing ChatComposer state programmatically
 */
export function useChatComposerBuilder(
  options: UseChatComposerOptions = {}
): UseChatComposerReturn {
  const {
    layout: initialLayout = 'standard',
    features: initialFeatures = DEFAULT_FEATURES,
    variant = 'default',
    defaultSidebarOpen = true,
  } = options

  const [layout, setLayout] = React.useState<ChatComposerLayout>(initialLayout)
  const [features, setFeatures] = React.useState<ChatComposerFeature[]>(initialFeatures)
  const [sidebarOpen, setSidebarOpen] = React.useState(defaultSidebarOpen)

  const toggleFeature = React.useCallback((feature: ChatComposerFeature) => {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    )
  }, [])

  const enableFeature = React.useCallback((feature: ChatComposerFeature) => {
    setFeatures((prev) => (prev.includes(feature) ? prev : [...prev, feature]))
  }, [])

  const disableFeature = React.useCallback((feature: ChatComposerFeature) => {
    setFeatures((prev) => prev.filter((f) => f !== feature))
  }, [])

  const hasFeature = React.useCallback(
    (feature: ChatComposerFeature) => features.includes(feature),
    [features]
  )

  const toggleSidebar = React.useCallback(() => setSidebarOpen((prev) => !prev), [])
  const openSidebar = React.useCallback(() => setSidebarOpen(true), [])
  const closeSidebar = React.useCallback(() => setSidebarOpen(false), [])

  const composerProps: ChatComposerProps = React.useMemo(
    () => ({
      layout,
      features,
      variant,
      sidebarOpen,
      onSidebarOpenChange: setSidebarOpen,
    }),
    [layout, features, variant, sidebarOpen]
  )

  return {
    composerProps,
    layout,
    setLayout,
    features,
    toggleFeature,
    enableFeature,
    disableFeature,
    hasFeature,
    sidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
  }
}

// ============================================================================
// Prebuilt Layouts
// ============================================================================

export interface PrebuiltChatProps {
  children?: React.ReactNode
  className?: string
}

/**
 * Minimal chat layout - Just messages and input
 */
export function MinimalChat({ children, className }: PrebuiltChatProps) {
  return (
    <ChatComposer layout="minimal" features={[]} className={className}>
      <ChatComposer.Messages>{children}</ChatComposer.Messages>
      <ChatComposer.Input />
    </ChatComposer>
  )
}

/**
 * Standard chat layout - With thinking and suggestions
 */
export function StandardChat({ children, className }: PrebuiltChatProps) {
  return (
    <ChatComposer layout="standard" className={className}>
      <ChatComposer.Header />
      <ChatComposer.Thinking />
      <ChatComposer.Messages>{children}</ChatComposer.Messages>
      <ChatComposer.Suggestions />
      <ChatComposer.Input />
    </ChatComposer>
  )
}

/**
 * Agent chat layout - With sidebar for agent panel
 */
export function AgentChat({ children, className }: PrebuiltChatProps) {
  return (
    <ChatComposer
      layout="split-panel"
      features={['thinking', 'tools', 'streaming']}
      className={className}
    >
      <ChatComposer.Header />
      <ChatComposer.Thinking />
      <ChatComposer.Messages>{children}</ChatComposer.Messages>
      <ChatComposer.Tools />
      <ChatComposer.Input />
      <ChatComposer.Sidebar position="right" width="360px" />
    </ChatComposer>
  )
}

/**
 * Fullscreen chat layout - Takes up full viewport
 */
export function FullscreenChat({ children, className }: PrebuiltChatProps) {
  return (
    <ChatComposer
      layout="fullscreen"
      features={['thinking', 'tools', 'suggestions', 'streaming']}
      className={className}
    >
      <ChatComposer.Header sticky />
      <ChatComposer.Sidebar collapsible />
      <ChatComposer.Thinking />
      <ChatComposer.Messages autoScroll>{children}</ChatComposer.Messages>
      <ChatComposer.Tools />
      <ChatComposer.Suggestions />
      <ChatComposer.Input sticky />
    </ChatComposer>
  )
}

export default ChatComposer

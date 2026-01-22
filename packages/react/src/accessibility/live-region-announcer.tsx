/**
 * Live Region Announcer
 *
 * Centralized utility for announcing dynamic content changes to screen readers.
 * Provides a React-based solution for ARIA live regions with proper lifecycle management.
 *
 * **Features:**
 * - Polite and assertive announcement priorities
 * - Automatic cleanup of old announcements
 * - Duplicate announcement prevention
 * - TypeScript support
 * - SSR-safe
 *
 * **WCAG 2.1 Compliance:**
 * - Guideline 4.1.3: Status Messages (Level AA)
 * - Provides screen reader notifications for dynamic content changes
 *
 * @module live-region-announcer
 */

'use client'

import * as React from 'react'

/**
 * Priority level for announcements
 * - polite: Announced at next opportunity (default for most updates)
 * - assertive: Announced immediately, interrupting other speech (errors, alerts)
 */
export type AnnouncementPriority = 'polite' | 'assertive'

/**
 * Announcement object
 */
export interface Announcement {
  /** Unique identifier */
  id: string
  /** Message to announce */
  message: string
  /** Priority level */
  priority: AnnouncementPriority
  /** Timestamp when announcement was created */
  timestamp: number
}

/**
 * Options for useLiveAnnouncer hook
 */
export interface UseLiveAnnouncerOptions {
  /** How long to keep announcements (ms). Default: 5000 */
  cleanupDelay?: number
  /** Prevent announcing duplicate messages within timeframe (ms). Default: 1000 */
  dedupeWindow?: number
}

/**
 * Hook for managing live region announcements
 *
 * Provides methods to announce messages to screen readers via ARIA live regions.
 *
 * @example
 * ```tsx
 * function ChatMessage({ message }) {
 *   const { announce } = useLiveAnnouncer()
 *
 *   React.useEffect(() => {
 *     if (message.role === 'assistant') {
 *       announce(`Assistant: ${message.content}`, 'polite')
 *     }
 *   }, [message, announce])
 *
 *   return <div>{message.content}</div>
 * }
 * ```
 *
 * @example With errors
 * ```tsx
 * function ChatInput() {
 *   const { announce } = useLiveAnnouncer()
 *
 *   const handleError = (error: string) => {
 *     announce(`Error: ${error}`, 'assertive')
 *   }
 *
 *   return <input onError={handleError} />
 * }
 * ```
 */
export function useLiveAnnouncer(
  options: UseLiveAnnouncerOptions = {}
): {
  announce: (message: string, priority?: AnnouncementPriority) => void
  announcements: Announcement[]
  clearAnnouncements: () => void
} {
  const { cleanupDelay = 5000, dedupeWindow = 1000 } = options

  const [announcements, setAnnouncements] = React.useState<Announcement[]>([])
  const recentMessagesRef = React.useRef<Map<string, number>>(new Map())

  const announce = React.useCallback(
    (message: string, priority: AnnouncementPriority = 'polite') => {
      if (!message.trim()) return

      // Deduplicate announcements
      const now = Date.now()
      const lastAnnounced = recentMessagesRef.current.get(message)
      if (lastAnnounced && now - lastAnnounced < dedupeWindow) {
        return
      }

      recentMessagesRef.current.set(message, now)

      const announcement: Announcement = {
        id: `announcement-${now}-${Math.random().toString(36).substring(2, 9)}`,
        message,
        priority,
        timestamp: now,
      }

      setAnnouncements((prev) => [...prev, announcement])

      // Clean up old announcement
      const timeoutId = setTimeout(() => {
        setAnnouncements((prev) =>
          prev.filter((a) => a.id !== announcement.id)
        )
      }, cleanupDelay)

      // Clean up dedupe map entry
      setTimeout(() => {
        recentMessagesRef.current.delete(message)
      }, dedupeWindow)

      return () => clearTimeout(timeoutId)
    },
    [cleanupDelay, dedupeWindow]
  )

  const clearAnnouncements = React.useCallback(() => {
    setAnnouncements([])
    recentMessagesRef.current.clear()
  }, [])

  return { announce, announcements, clearAnnouncements }
}

/**
 * Props for LiveRegionAnnouncer component
 */
export interface LiveRegionAnnouncerProps {
  /** Announcements to render */
  announcements: Announcement[]
  /** Optional className for the container */
  className?: string
}

/**
 * Live Region Announcer Component
 *
 * Renders ARIA live regions for screen reader announcements.
 * Should be placed once at the root of your application.
 *
 * @example
 * ```tsx
 * function App() {
 *   const { announce, announcements } = useLiveAnnouncer()
 *
 *   return (
 *     <div>
 *       <YourContent onUpdate={(msg) => announce(msg)} />
 *       <LiveRegionAnnouncer announcements={announcements} />
 *     </div>
 *   )
 * }
 * ```
 */
export function LiveRegionAnnouncer({
  announcements,
  className,
}: LiveRegionAnnouncerProps): React.ReactElement {
  const politeAnnouncements = announcements.filter(
    (a) => a.priority === 'polite'
  )
  const assertiveAnnouncements = announcements.filter(
    (a) => a.priority === 'assertive'
  )

  return (
    <div className={className} data-live-announcer="true">
      {/* Polite announcements - announced at next opportunity */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-priority="polite"
      >
        {politeAnnouncements.map((announcement) => (
          <div key={announcement.id}>{announcement.message}</div>
        ))}
      </div>

      {/* Assertive announcements - interrupts current speech */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        data-priority="assertive"
      >
        {assertiveAnnouncements.map((announcement) => (
          <div key={announcement.id}>{announcement.message}</div>
        ))}
      </div>
    </div>
  )
}

LiveRegionAnnouncer.displayName = 'LiveRegionAnnouncer'

/**
 * Context for live announcer
 */
const LiveAnnouncerContext = React.createContext<{
  announce: (message: string, priority?: AnnouncementPriority) => void
  announcements: Announcement[]
  clearAnnouncements: () => void
} | null>(null)

/**
 * Provider for live announcer context
 *
 * Wraps your application to provide live announcer functionality via context.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <LiveAnnouncerProvider>
 *       <YourApp />
 *     </LiveAnnouncerProvider>
 *   )
 * }
 *
 * function SomeComponent() {
 *   const { announce } = useLiveAnnouncerContext()
 *   announce('New message received', 'polite')
 * }
 * ```
 */
export function LiveAnnouncerProvider({
  children,
  options,
}: {
  children: React.ReactNode
  options?: UseLiveAnnouncerOptions
}): React.ReactElement {
  const announcer = useLiveAnnouncer(options)

  return (
    <LiveAnnouncerContext.Provider value={announcer}>
      {children}
      <LiveRegionAnnouncer announcements={announcer.announcements} />
    </LiveAnnouncerContext.Provider>
  )
}

LiveAnnouncerProvider.displayName = 'LiveAnnouncerProvider'

/**
 * Hook to access live announcer from context
 *
 * Must be used within LiveAnnouncerProvider.
 *
 * @throws Error if used outside LiveAnnouncerProvider
 *
 * @example
 * ```tsx
 * function ChatMessage() {
 *   const { announce } = useLiveAnnouncerContext()
 *
 *   const handleNewMessage = (text: string) => {
 *     announce(`New message: ${text}`, 'polite')
 *   }
 *
 *   return <button onClick={() => handleNewMessage('Hello')}>Send</button>
 * }
 * ```
 */
export function useLiveAnnouncerContext(): {
  announce: (message: string, priority?: AnnouncementPriority) => void
  announcements: Announcement[]
  clearAnnouncements: () => void
} {
  const context = React.useContext(LiveAnnouncerContext)

  if (!context) {
    throw new Error(
      'useLiveAnnouncerContext must be used within LiveAnnouncerProvider'
    )
  }

  return context
}

/**
 * Common announcement messages for chat applications
 */
export const ChatAnnouncements = {
  /** Announce new message */
  newMessage: (role: 'user' | 'assistant', content: string) =>
    `${role === 'user' ? 'You' : 'Assistant'}: ${content}`,

  /** Announce message sending */
  sending: () => 'Sending message',

  /** Announce message sent */
  sent: () => 'Message sent',

  /** Announce message error */
  error: (error: string) => `Error: ${error}`,

  /** Announce typing indicator */
  typing: () => 'Assistant is typing',

  /** Announce thinking */
  thinking: () => 'Assistant is thinking',

  /** Announce file upload */
  fileUpload: (filename: string) => `Uploading file: ${filename}`,

  /** Announce file uploaded */
  fileUploaded: (filename: string) => `File uploaded: ${filename}`,

  /** Announce stream started */
  streamStarted: () => 'Receiving response',

  /** Announce stream completed */
  streamCompleted: () => 'Response complete',

  /** Announce loading */
  loading: (what: string) => `Loading ${what}`,

  /** Announce loaded */
  loaded: (what: string) => `${what} loaded`,

  /** Announce queue position */
  queued: (position: number) =>
    `Your request is queued. Position: ${position}`,

  /** Announce rate limit */
  rateLimited: (resetTime: string) =>
    `Rate limit reached. Try again at ${resetTime}`,

  /** Announce network error */
  networkError: () => 'Network error. Please check your connection.',

  /** Announce retry */
  retrying: (attempt: number, max: number) =>
    `Retrying request. Attempt ${attempt} of ${max}`,
} as const

/**
 * Create announcement message for different scenarios
 *
 * @example
 * ```tsx
 * const { announce } = useLiveAnnouncer()
 *
 * // Announce new message
 * announce(
 *   createAnnouncement('message', { role: 'assistant', content: 'Hello!' }),
 *   'polite'
 * )
 *
 * // Announce error
 * announce(
 *   createAnnouncement('error', { message: 'Failed to send' }),
 *   'assertive'
 * )
 * ```
 */
export function createAnnouncement(
  type: keyof typeof ChatAnnouncements,
  params: any
): string {
  switch (type) {
    case 'newMessage':
      return ChatAnnouncements.newMessage(params.role, params.content)
    case 'error':
      return ChatAnnouncements.error(params.message || params.error)
    case 'fileUpload':
      return ChatAnnouncements.fileUpload(params.filename)
    case 'fileUploaded':
      return ChatAnnouncements.fileUploaded(params.filename)
    case 'loading':
      return ChatAnnouncements.loading(params.what)
    case 'loaded':
      return ChatAnnouncements.loaded(params.what)
    case 'queued':
      return ChatAnnouncements.queued(params.position)
    case 'rateLimited':
      return ChatAnnouncements.rateLimited(params.resetTime)
    case 'retrying':
      return ChatAnnouncements.retrying(params.attempt, params.max)
    default:
      return ''
  }
}

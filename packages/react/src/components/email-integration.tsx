'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  Badge,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { RefreshIcon, CloseIcon } from './icons'
import { useIsMounted } from '../hooks/use-is-mounted'

/**
 * Email provider types
 */
export type EmailProvider =
  | 'gmail'
  | 'outlook'
  | 'yahoo'
  | 'imap'
  | 'exchange'

/**
 * Email account
 */
export interface EmailAccount {
  id: string
  email: string
  name?: string
  provider: EmailProvider
  connected: boolean
  lastSync?: Date
  unreadCount?: number
}

/**
 * Email thread
 */
export interface EmailThread {
  id: string
  subject: string
  snippet: string
  participants: EmailParticipant[]
  messageCount: number
  unread: boolean
  starred: boolean
  labels: string[]
  lastMessageAt: Date
  messages?: EmailMessage[]
}

/**
 * Email participant
 */
export interface EmailParticipant {
  email: string
  name?: string
  isMe?: boolean
}

/**
 * Email message
 */
export interface EmailMessage {
  id: string
  threadId: string
  from: EmailParticipant
  to: EmailParticipant[]
  cc?: EmailParticipant[]
  bcc?: EmailParticipant[]
  subject: string
  body: string
  bodyHtml?: string
  snippet: string
  timestamp: Date
  read: boolean
  starred: boolean
  attachments?: EmailAttachment[]
  labels: string[]
  replyTo?: string
}

/**
 * Email attachment
 */
export interface EmailAttachment {
  id: string
  filename: string
  mimeType: string
  size: number
  url?: string
}

/**
 * Email notification
 */
export interface EmailNotification {
  id: string
  type: 'new-message' | 'reply' | 'mention' | 'digest'
  threadId: string
  messageId?: string
  title: string
  body: string
  timestamp: Date
  read: boolean
}

/**
 * Email template
 */
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
  category?: string
}

/**
 * Digest configuration
 */
export interface DigestConfig {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'realtime'
  time?: string // HH:MM format
  dayOfWeek?: number // 0-6 for weekly
  includeUnread: boolean
  includeSummary: boolean
  maxEmails: number
}

/**
 * Email integration state
 */
interface EmailIntegrationState {
  accounts: EmailAccount[]
  threads: EmailThread[]
  notifications: EmailNotification[]
  loading: boolean
  error: string | null
  syncing: boolean
}

/**
 * Props for EmailIntegration
 */
export interface EmailIntegrationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Connected accounts */
  accounts?: EmailAccount[]
  /** Initial threads */
  initialThreads?: EmailThread[]
  /** Show account selector */
  showAccountSelector?: boolean
  /** Show notifications */
  showNotifications?: boolean
  /** Max threads to display */
  maxThreads?: number
  /** Callback when thread selected */
  onThreadSelect?: (thread: EmailThread) => void
  /** Callback to send email */
  onSendEmail?: (message: Omit<EmailMessage, 'id' | 'timestamp' | 'read' | 'starred' | 'labels'>) => Promise<EmailMessage>
  /** Callback to reply to thread */
  onReply?: (threadId: string, body: string) => Promise<EmailMessage>
  /** Fetch threads function */
  fetchThreads?: (accountId?: string) => Promise<EmailThread[]>
  /** Fetch thread messages */
  fetchMessages?: (threadId: string) => Promise<EmailMessage[]>
  /** Mark as read function */
  markAsRead?: (threadId: string) => Promise<void>
  /** Ref to the root div element */
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Provider configuration
 */
const PROVIDER_CONFIG: Record<EmailProvider, { name: string; icon: string; color: string }> = {
  gmail: { name: 'Gmail', icon: '📧', color: '#EA4335' },
  outlook: { name: 'Outlook', icon: '📬', color: '#0078D4' },
  yahoo: { name: 'Yahoo', icon: '📩', color: '#6001D2' },
  imap: { name: 'IMAP', icon: '📮', color: '#6B7280' },
  exchange: { name: 'Exchange', icon: '📨', color: '#0078D4' },
}

/**
 * Format timestamp
 */
function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const dayInMs = 24 * 60 * 60 * 1000

  if (diff < dayInMs) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }

  if (diff < 7 * dayInMs) {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
    }).format(date)
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * Get participant display name
 */
function getParticipantName(participant: EmailParticipant): string {
  return participant.name || participant.email.split('@')[0]
}

/**
 * Get thread participants display
 */
function getParticipantsDisplay(participants: EmailParticipant[]): string {
  const others = participants.filter(p => !p.isMe)
  if (others.length === 0) return 'Me'
  if (others.length === 1) return getParticipantName(others[0])
  if (others.length === 2) return `${getParticipantName(others[0])}, ${getParticipantName(others[1])}`
  return `${getParticipantName(others[0])} +${others.length - 1}`
}

/**
 * EmailIntegration Component
 *
 * Email integration for:
 * - Viewing email threads
 * - Sending and replying to emails
 * - Managing notifications
 * - Email digests
 */
export function EmailIntegration({
  accounts = [],
  initialThreads = [],
  showAccountSelector = true,
  showNotifications = true,
  maxThreads = 20,
  onThreadSelect,
  onSendEmail: _onSendEmail,
  onReply,
  fetchThreads,
  fetchMessages,
  markAsRead,
  className,
  ref,
  ...props
}: EmailIntegrationProps) {
  const isMounted = useIsMounted()
  const [state, setState] = React.useState<EmailIntegrationState>({
    accounts,
    threads: initialThreads,
    notifications: [],
    loading: false,
    error: null,
    syncing: false,
  })

  const [selectedAccount, setSelectedAccount] = React.useState<string | null>(
    accounts.length > 0 ? accounts[0].id : null
  )
  const [selectedThread, setSelectedThread] = React.useState<EmailThread | null>(null)
  const [replyText, setReplyText] = React.useState('')

  // Clear error helper
  const clearError = React.useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Clear reply text when thread changes
  React.useEffect(() => {
    setReplyText('')
  }, [selectedThread?.id])

  // Load threads
  const loadThreads = React.useCallback(async () => {
    if (!fetchThreads) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const threads = await fetchThreads(selectedAccount || undefined)
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          threads: threads.slice(0, maxThreads),
          loading: false,
        }))
      }
    } catch (error) {
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to load emails',
          loading: false,
        }))
      }
    }
  }, [fetchThreads, selectedAccount, maxThreads, isMounted])

  // Select thread and load messages
  const selectThread = React.useCallback(async (thread: EmailThread) => {
    setSelectedThread(thread)
    onThreadSelect?.(thread)

    // Mark as read
    if (thread.unread && markAsRead) {
      try {
        await markAsRead(thread.id)
        if (isMounted.current) {
          setState(prev => ({
            ...prev,
            threads: prev.threads.map(t =>
              t.id === thread.id ? { ...t, unread: false } : t
            ),
          }))
        }
      } catch {
        // Silently fail for mark as read
      }
    }

    // Load full messages if needed
    if (fetchMessages && !thread.messages) {
      try {
        const messages = await fetchMessages(thread.id)
        if (isMounted.current) {
          setSelectedThread(prev => prev ? { ...prev, messages } : null)
        }
      } catch {
        // Failed to load messages, keep thread selected without full messages
      }
    }
  }, [onThreadSelect, markAsRead, fetchMessages, isMounted])

  // Send reply
  const sendReply = React.useCallback(async () => {
    if (!selectedThread || !onReply || !replyText.trim()) return

    setState(prev => ({ ...prev, syncing: true }))

    try {
      const message = await onReply(selectedThread.id, replyText)
      if (isMounted.current) {
        setSelectedThread(prev => prev ? {
          ...prev,
          messages: [...(prev.messages || []), message],
          messageCount: prev.messageCount + 1,
          lastMessageAt: message.timestamp,
        } : null)
        setReplyText('')
      }
    } catch (error) {
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to send reply',
        }))
      }
    } finally {
      if (isMounted.current) {
        setState(prev => ({ ...prev, syncing: false }))
      }
    }
  }, [selectedThread, onReply, replyText, isMounted])

  // Load threads on mount and account change
  React.useEffect(() => {
    if (fetchThreads) {
      loadThreads()
    }
  }, [loadThreads, fetchThreads])

  // Calculate unread count
  const unreadCount = React.useMemo(() => {
    return state.threads.filter(t => t.unread).length
  }, [state.threads])

  return (
    <div ref={ref} className={cn('space-y-4', className)} role="region" aria-label="Email integration" {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Email</h3>
          {unreadCount > 0 && (
            <Badge variant="default" aria-label={`${unreadCount} unread emails`}>{unreadCount}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {fetchThreads && (
            <Button
              variant="ghost"
              size="sm"
              onClick={loadThreads}
              disabled={state.loading}
              aria-label="Refresh emails"
            >
              <RefreshIcon className={cn('w-4 h-4', state.loading && 'animate-spin')} />
            </Button>
          )}
        </div>
      </div>

      {/* Account selector */}
      {showAccountSelector && state.accounts.length > 1 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Email accounts">
          {state.accounts.map(account => {
            const config = PROVIDER_CONFIG[account.provider]
            return (
              <Button
                key={account.id}
                variant={selectedAccount === account.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedAccount(account.id)}
                className="gap-2"
                role="tab"
                aria-selected={selectedAccount === account.id}
                aria-label={`Select ${account.email}`}
              >
                <span aria-hidden="true">{config.icon}</span>
                <span>{account.email}</span>
                {account.unreadCount && account.unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {account.unreadCount}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      )}

      {/* Error display */}
      {state.error && (
        <div
          className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center justify-between"
          role="alert"
        >
          <span>{state.error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            aria-label="Dismiss error"
            className="ml-2 h-6 w-6 p-0"
          >
            <CloseIcon className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Thread list or thread view */}
      {selectedThread ? (
        /* Thread view */
        <Card>
          <CardContent className="p-4">
            {/* Thread header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-medium">{selectedThread.subject}</h4>
                <div className="text-sm text-muted-foreground">
                  {getParticipantsDisplay(selectedThread.participants)}
                  {' - '}
                  {selectedThread.messageCount} message{selectedThread.messageCount !== 1 ? 's' : ''}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedThread(null)}
                aria-label="Close thread"
              >
                <CloseIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {selectedThread.messages?.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-l-2 border-muted pl-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {message.from.isMe ? 'Me' : getParticipantName(message.from)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {message.body}
                    </div>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.attachments.map(attachment => (
                          <Badge key={attachment.id} variant="outline" className="text-xs">
                            {attachment.filename}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Reply box */}
            {onReply && (
              <div className="mt-4 pt-4 border-t border-muted">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  aria-label="Reply message"
                  className="w-full min-h-[80px] p-2 border border-input bg-background text-foreground rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={sendReply}
                    disabled={!replyText.trim() || state.syncing}
                    aria-label={state.syncing ? 'Sending reply' : 'Send reply'}
                  >
                    {state.syncing ? 'Sending...' : 'Send Reply'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Thread list */
        <>
          {/* Loading state */}
          {state.loading && (
            <div className="flex items-center justify-center p-8">
              <RefreshIcon className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Thread list */}
          {!state.loading && state.threads.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  <AnimatePresence>
                    {state.threads.map((thread, index) => (
                      <motion.div
                        key={thread.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.02 }}
                        className={cn(
                          'flex items-start gap-3 p-3 hover:bg-accent/50 cursor-pointer transition-colors',
                          thread.unread && 'bg-primary/5'
                        )}
                        onClick={() => selectThread(thread)}
                      >
                        {/* Unread indicator */}
                        <div className={cn(
                          'w-2 h-2 rounded-full mt-2 shrink-0',
                          thread.unread ? 'bg-primary' : 'bg-transparent'
                        )} />

                        {/* Thread info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn(
                              'truncate',
                              thread.unread && 'font-semibold'
                            )}>
                              {getParticipantsDisplay(thread.participants)}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatTimestamp(thread.lastMessageAt)}
                            </span>
                          </div>
                          <div className={cn(
                            'text-sm truncate',
                            thread.unread ? 'text-foreground' : 'text-muted-foreground'
                          )}>
                            {thread.subject}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {thread.snippet}
                          </div>
                          {thread.labels.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {thread.labels.slice(0, 3).map(label => (
                                <Badge key={label} variant="outline" className="text-xs">
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Message count */}
                        {thread.messageCount > 1 && (
                          <Badge variant="secondary" className="shrink-0">
                            {thread.messageCount}
                          </Badge>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty state */}
          {!state.loading && state.threads.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <span className="text-4xl mb-3">📭</span>
              <div className="text-muted-foreground">No emails found</div>
            </div>
          )}
        </>
      )}

      {/* Notifications */}
      {showNotifications && state.notifications.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-3">Notifications</div>
            <div className="space-y-2">
              {state.notifications.slice(0, 5).map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'p-2 rounded-lg text-sm',
                    notification.read ? 'bg-muted/50' : 'bg-primary/10'
                  )}
                >
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-xs text-muted-foreground">{notification.body}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Display name for debugging
EmailIntegration.displayName = 'EmailIntegration'

/**
 * Hook for email integration
 */
export function useEmailIntegration(options: {
  apiEndpoint?: string
  apiKey?: string
  accountId?: string
}) {
  const [threads, setThreads] = React.useState<EmailThread[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch threads
  const fetchThreads = React.useCallback(async (accountId?: string): Promise<EmailThread[]> => {
    if (!options.apiEndpoint) return []

    const targetAccount = accountId || options.accountId
    setLoading(true)
    setError(null)

    try {
      const params = targetAccount ? `?accountId=${targetAccount}` : ''
      const response = await fetch(`${options.apiEndpoint}/threads${params}`, {
        headers: options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {},
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      const fetchedThreads = (data.threads || []).map((t: Record<string, unknown>) => ({
        ...t,
        lastMessageAt: new Date(t.lastMessageAt as string),
      }))

      setThreads(fetchedThreads)
      return fetchedThreads
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch threads'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [options.apiEndpoint, options.apiKey, options.accountId])

  // Fetch messages for a thread
  const fetchMessages = React.useCallback(async (threadId: string): Promise<EmailMessage[]> => {
    if (!options.apiEndpoint) return []

    const response = await fetch(`${options.apiEndpoint}/threads/${threadId}/messages`, {
      headers: options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {},
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    return (data.messages || []).map((m: Record<string, unknown>) => ({
      ...m,
      timestamp: new Date(m.timestamp as string),
    }))
  }, [options.apiEndpoint, options.apiKey])

  // Send email
  const sendEmail = React.useCallback(async (
    message: Omit<EmailMessage, 'id' | 'timestamp' | 'read' | 'starred' | 'labels'>
  ): Promise<EmailMessage> => {
    if (!options.apiEndpoint) {
      throw new Error('No API endpoint configured')
    }

    const response = await fetch(`${options.apiEndpoint}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      throw new Error(`Failed to send email: HTTP ${response.status}`)
    }

    return await response.json()
  }, [options.apiEndpoint, options.apiKey])

  // Reply to thread
  const replyToThread = React.useCallback(async (
    threadId: string,
    body: string
  ): Promise<EmailMessage> => {
    if (!options.apiEndpoint) {
      throw new Error('No API endpoint configured')
    }

    const response = await fetch(`${options.apiEndpoint}/threads/${threadId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
      body: JSON.stringify({ body }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send reply: HTTP ${response.status}`)
    }

    return await response.json()
  }, [options.apiEndpoint, options.apiKey])

  // Mark thread as read
  const markAsRead = React.useCallback(async (threadId: string): Promise<void> => {
    if (!options.apiEndpoint) return

    await fetch(`${options.apiEndpoint}/threads/${threadId}/read`, {
      method: 'POST',
      headers: options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {},
    })

    setThreads(prev => prev.map(t =>
      t.id === threadId ? { ...t, unread: false } : t
    ))
  }, [options.apiEndpoint, options.apiKey])

  // Search emails
  const searchEmails = React.useCallback(async (query: string): Promise<EmailThread[]> => {
    if (!options.apiEndpoint) return []

    const response = await fetch(
      `${options.apiEndpoint}/search?q=${encodeURIComponent(query)}`,
      {
        headers: options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {},
      }
    )

    if (!response.ok) {
      throw new Error(`Search failed: HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.threads || []
  }, [options.apiEndpoint, options.apiKey])

  return {
    threads,
    loading,
    error,
    fetchThreads,
    fetchMessages,
    sendEmail,
    replyToThread,
    markAsRead,
    searchEmails,
  }
}

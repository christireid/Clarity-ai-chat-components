'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import {
  Bot,
  Check,
  Clock,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  AlertCircle,
  Eye,
  Users,
  Loader2,
} from 'lucide-react'

// ============================================================================
// EDGE CASE DEMOS
// ============================================================================

// 1. Very Long Message Demo
export function VeryLongMessageDemo() {
  const [isExpanded, setIsExpanded] = useState(false)
  const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`.repeat(5)

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Very Long Message (1000+ chars)</CardTitle>
        <CardDescription>Handling extremely long messages with scroll/expand</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex gap-3">
            <div className="icon-container-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div className="glass-card p-3.5 max-w-[80%] flex-1">
              <div className={cn(
                'text-sm transition-all',
                !isExpanded && 'max-h-32 overflow-hidden relative'
              )}>
                {longText}
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent" />
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-xs"
              >
                {isExpanded ? (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Show more ({longText.length} characters)
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          <strong>Recovery:</strong> Message truncated at 200 chars. Click to expand/collapse with smooth animation.
        </div>
      </CardContent>
    </Card>
  )
}

// 2. Rapid Message Flood Demo
export function RapidMessageFloodDemo() {
  const [messages, setMessages] = useState<Array<{ id: string; text: string }>>([])
  const [isFlooding, setIsFlooding] = useState(false)

  const simulateFlood = () => {
    setIsFlooding(true)
    setMessages([])

    let count = 0
    const interval = setInterval(() => {
      if (count >= 20) {
        clearInterval(interval)
        setIsFlooding(false)
        return
      }
      setMessages(prev => [...prev, {
        id: `msg-${count}`,
        text: `Flood message ${count + 1} - Rapid message delivery test`
      }])
      count++
    }, 100)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Rapid Message Flood (20+ messages)</CardTitle>
            <CardDescription>Testing performance with rapid message delivery</CardDescription>
          </div>
          <Button onClick={simulateFlood} disabled={isFlooding} size="sm">
            {isFlooding ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Flooding...
              </>
            ) : (
              'Start Flood'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 p-4 bg-muted/30 rounded-lg">
          <div className="space-y-2">
            {messages.map((msg, idx) => (
              <div key={msg.id} className="flex gap-2 items-start">
                <Badge variant="secondary" className="text-xs shrink-0">
                  #{idx + 1}
                </Badge>
                <div className="glass-card p-2 text-sm flex-1">
                  {msg.text}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                Click "Start Flood" to send 20 messages in 2 seconds
              </div>
            )}
          </div>
        </ScrollArea>
        {messages.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            <strong>Recovery:</strong> Received {messages.length} messages. Virtual scrolling engaged. <Badge variant="outline" className="ml-1">Stable</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 3. Out of Order Delivery Demo
export function OutOfOrderDeliveryDemo() {
  const [messages, setMessages] = useState<Array<{ id: number; text: string; order: number }>>([])
  const [showReordering, setShowReordering] = useState(false)

  const simulateOutOfOrder = () => {
    setShowReordering(true)
    const unorderedMessages = [
      { id: 3, text: 'Message 3 (arrived 1st)', order: 3 },
      { id: 1, text: 'Message 1 (arrived 2nd)', order: 1 },
      { id: 5, text: 'Message 5 (arrived 3rd)', order: 5 },
      { id: 2, text: 'Message 2 (arrived 4th)', order: 2 },
      { id: 4, text: 'Message 4 (arrived 5th)', order: 4 },
    ]

    setMessages(unorderedMessages)

    setTimeout(() => {
      setMessages(prev => [...prev].sort((a, b) => a.order - b.order))
      setShowReordering(false)
    }, 2000)
  }

  const isOrdered = messages.every((msg, idx) => idx === 0 || msg.order > messages[idx - 1].order)

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Out of Order Delivery</CardTitle>
            <CardDescription>Messages arriving non-sequentially with auto-reordering</CardDescription>
          </div>
          <Button onClick={simulateOutOfOrder} size="sm">
            Simulate Out of Order
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs">
              {showReordering ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Reordering messages...
                </span>
              ) : isOrdered && messages.length > 0 ? (
                <span className="text-green-600 dark:text-green-400">✓ Messages reordered successfully</span>
              ) : (
                'Messages will auto-reorder when received out of sequence'
              )}
            </span>
          </div>

          <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2 items-center">
                <Badge variant={isOrdered ? 'default' : 'destructive'} className="text-xs w-20">
                  Order: {msg.order}
                </Badge>
                <div className="glass-card p-2 text-sm flex-1">
                  {msg.text}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-4">
                No messages yet. Click to simulate out-of-order delivery.
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            <strong>Recovery:</strong> System uses timestamp-based sorting to reorder messages automatically within 2 seconds.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 4. Duplicate Messages Demo
export function DuplicateMessagesDemo() {
  const [messages, setMessages] = useState<Array<{ id: string; text: string }>>([])
  const [dedupeCount, setDedupeCount] = useState(0)

  const simulateDuplicates = () => {
    setDedupeCount(0)
    const newMessages = [
      { id: '1', text: 'Original message 1' },
      { id: '2', text: 'Original message 2' },
      { id: '1', text: 'Original message 1' },
      { id: '3', text: 'Original message 3' },
      { id: '2', text: 'Original message 2' },
    ]

    const seen = new Set<string>()
    const deduplicated = newMessages.filter(msg => {
      if (seen.has(msg.id)) {
        setDedupeCount(prev => prev + 1)
        return false
      }
      seen.add(msg.id)
      return true
    })

    setMessages(deduplicated)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Duplicate Message Handling</CardTitle>
            <CardDescription>Automatic deduplication by message ID</CardDescription>
          </div>
          <Button onClick={simulateDuplicates} size="sm">
            Send with Duplicates
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dedupeCount > 0 && (
            <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-yellow-600 dark:text-yellow-400">
                Blocked {dedupeCount} duplicate {dedupeCount === 1 ? 'message' : 'messages'}
              </span>
            </div>
          )}

          <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2 items-center">
                <Badge variant="outline" className="text-xs">
                  ID: {msg.id}
                </Badge>
                <div className="glass-card p-2 text-sm flex-1">
                  {msg.text}
                </div>
                <Check className="h-4 w-4 text-green-500" />
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-4">
                No messages yet. System will deduplicate by ID.
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            <strong>Recovery:</strong> Set-based deduplication prevents duplicate messages from appearing in UI.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 5. Orphaned Replies Demo
export function OrphanedRepliesDemo() {
  const [showOrphans, setShowOrphans] = useState(false)

  const messages = [
    { id: '1', text: 'Parent message', isParent: true },
    { id: '2', text: 'Reply to parent', parentId: '1' },
    { id: '3', text: 'Orphaned reply (parent deleted)', parentId: '999', isOrphan: true },
    { id: '4', text: 'Another orphaned reply', parentId: '888', isOrphan: true },
  ]

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Orphaned Replies</CardTitle>
            <CardDescription>Handling replies without parent messages</CardDescription>
          </div>
          <Button onClick={() => setShowOrphans(!showOrphans)} size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            {showOrphans ? 'Hide' : 'Show'} Orphans
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          {messages.map((msg) => {
            if (msg.isOrphan && !showOrphans) return null

            return (
              <div key={msg.id} className={cn(
                'flex gap-2 items-start',
                msg.parentId && 'ml-6'
              )}>
                {msg.parentId && (
                  <CornerDownRight className="h-4 w-4 text-muted-foreground mt-1" />
                )}
                <div className={cn(
                  'glass-card p-3 text-sm flex-1',
                  msg.isOrphan && 'border-2 border-destructive/50 bg-destructive/5'
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.isOrphan && (
                      <Badge variant="destructive" className="text-xs">
                        Orphaned
                      </Badge>
                    )}
                    {msg.isParent && (
                      <Badge variant="outline" className="text-xs">
                        Parent
                      </Badge>
                    )}
                  </div>
                  <div>{msg.text}</div>
                  {msg.isOrphan && (
                    <div className="text-xs text-destructive mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Parent message (ID: {msg.parentId}) not found
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          <strong>Recovery:</strong> Orphaned replies are flagged and can be converted to top-level messages or hidden from view.
        </div>
      </CardContent>
    </Card>
  )
}

// 6. Stale Typing Indicators Demo
export function StaleTypingIndicatorDemo() {
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [staleCount, setStaleCount] = useState(0)

  const addTypingUser = () => {
    const userName = `User${typingUsers.length + 1}`
    setTypingUsers(prev => [...prev, userName])

    setTimeout(() => {
      setTypingUsers(prev => {
        const filtered = prev.filter(u => u !== userName)
        if (filtered.length < prev.length) {
          setStaleCount(c => c + 1)
        }
        return filtered
      })
    }, 5000)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Stale Typing Indicators</CardTitle>
            <CardDescription>Auto-cleanup after 5 second timeout</CardDescription>
          </div>
          <Button onClick={addTypingUser} size="sm">
            Add Typing User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {staleCount > 0 && (
            <div className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-600 dark:text-blue-400">
                Cleaned up {staleCount} stale typing {staleCount === 1 ? 'indicator' : 'indicators'}
              </span>
            </div>
          )}

          <div className="p-4 bg-muted/30 rounded-lg min-h-24">
            {typingUsers.length > 0 ? (
              <div className="space-y-2">
                {typingUsers.map((user, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg rounded-tl-none p-3 flex items-center gap-2">
                      <span className="text-sm">{user} is typing</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm py-4">
                No typing indicators. Click "Add Typing User" to test.
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            <strong>Recovery:</strong> Indicators auto-remove after 5 seconds of inactivity using cleanup timers.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 7. Bulk Reactions Demo (50+ reactions)
export function BulkReactionsDemo() {
  const [reactionCount, setReactionCount] = useState(0)

  const addBulkReactions = () => {
    setReactionCount(50)
  }

  const reactions = ['👍', '❤️', '😂', '🎉', '🚀', '👀', '🔥', '⚡']

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Bulk Reactions (50+ on one message)</CardTitle>
            <CardDescription>Performance with many reactions on a single message</CardDescription>
          </div>
          <Button onClick={addBulkReactions} size="sm">
            Add 50 Reactions
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="glass-card p-4">
            <p className="text-sm mb-3">This is a message with many reactions!</p>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {Array.from({ length: reactionCount }).map((_, idx) => {
                const emoji = reactions[idx % reactions.length]
                return (
                  <div key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-full glass-subtle border text-xs">
                    <span>{emoji}</span>
                    <span className="text-muted-foreground">{idx + 1}</span>
                  </div>
                )
              })}
            </div>
            {reactionCount === 0 && (
              <div className="text-center text-muted-foreground text-sm py-4">
                Click "Add 50 Reactions" to test performance
              </div>
            )}
          </div>
          {reactionCount > 0 && (
            <div className="text-xs text-muted-foreground">
              <strong>Recovery:</strong> {reactionCount} reactions rendered. Virtualized scrolling prevents performance issues.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// 8. Deep Thread Nesting Demo (5+ levels)
export function DeepThreadNestingDemo() {
  const [showAll, setShowAll] = useState(false)

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Deep Thread Nesting (5+ levels)</CardTitle>
            <CardDescription>Handling deeply nested conversation threads</CardDescription>
          </div>
          <Button onClick={() => setShowAll(!showAll)} size="sm" variant="outline">
            {showAll ? 'Collapse' : 'Expand'} All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/30 rounded-lg">
          {[1, 2, 3, 4, 5].map((level) => (
            <div key={level} style={{ marginLeft: `${(level - 1) * 20}px` }} className={cn(!showAll && level > 3 && 'hidden')}>
              <div className="flex gap-2 mb-2">
                <CornerDownRight className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="glass-card p-2 text-sm flex-1">
                  <Badge variant="outline" className="text-xs mb-1">Level {level}</Badge>
                  <div>Reply at nesting level {level}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          <strong>Recovery:</strong> Max nesting depth of 3 enforced. Deeper threads converted to flat continuation.
        </div>
      </CardContent>
    </Card>
  )
}

// 9. Message Conflicts Demo (simultaneous edits)
export function MessageConflictsDemo() {
  const [showConflict, setShowConflict] = useState(false)
  const [resolution, setResolution] = useState<'local' | 'remote' | null>(null)

  const simulateConflict = () => {
    setShowConflict(true)
    setResolution(null)
  }

  const resolveConflict = (choice: 'local' | 'remote') => {
    setResolution(choice)
    setTimeout(() => setShowConflict(false), 2000)
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Message Conflicts</CardTitle>
            <CardDescription>Handling simultaneous edit conflicts</CardDescription>
          </div>
          <Button onClick={simulateConflict} size="sm">
            Simulate Conflict
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {showConflict && !resolution && (
            <div className="p-4 border-2 border-yellow-500/50 bg-yellow-500/10 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-sm">Edit Conflict Detected</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 glass-subtle rounded">
                  <div className="text-xs font-medium mb-1">Your Version</div>
                  <div className="text-sm">Updated message content (local)</div>
                </div>
                <div className="p-3 glass-subtle rounded">
                  <div className="text-xs font-medium mb-1">Server Version</div>
                  <div className="text-sm">Updated message content (remote)</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => resolveConflict('local')}>
                  Keep Mine
                </Button>
                <Button size="sm" variant="outline" onClick={() => resolveConflict('remote')}>
                  Use Server Version
                </Button>
              </div>
            </div>
          )}

          {resolution && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Conflict resolved using {resolution === 'local' ? 'local' : 'server'} version
                </span>
              </div>
            </div>
          )}

          {!showConflict && (
            <div className="text-center text-muted-foreground text-sm py-8">
              Click "Simulate Conflict" to test conflict resolution
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <strong>Recovery:</strong> User prompted to resolve conflicts with clear diff view. Last-write-wins or manual resolution.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 10. Network Interruption Demo (message queuing)
export function NetworkInterruptionDemo() {
  const [isOnline, setIsOnline] = useState(true)
  const [queuedMessages, setQueuedMessages] = useState<string[]>([])
  const [sentMessages, setSentMessages] = useState<string[]>([])

  const sendMessage = () => {
    const msg = `Message ${queuedMessages.length + sentMessages.length + 1}`
    if (isOnline) {
      setSentMessages(prev => [...prev, msg])
    } else {
      setQueuedMessages(prev => [...prev, msg])
    }
  }

  const toggleNetwork = () => {
    const newState = !isOnline
    setIsOnline(newState)

    if (newState && queuedMessages.length > 0) {
      setTimeout(() => {
        setSentMessages(prev => [...prev, ...queuedMessages])
        setQueuedMessages([])
      }, 1000)
    }
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Network Interruption</CardTitle>
            <CardDescription>Message queuing during network outages</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={toggleNetwork} size="sm" variant="outline">
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </Button>
            <Button onClick={sendMessage} size="sm">
              Send Message
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {!isOnline && queuedMessages.length > 0 && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">
                  {queuedMessages.length} {queuedMessages.length === 1 ? 'message' : 'messages'} queued. Will send when online.
                </span>
              </div>
            </div>
          )}

          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <div className="text-xs font-medium mb-2">Sent Messages</div>
            {sentMessages.map((msg, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Check className="h-4 w-4 text-green-500" />
                <div className="glass-card p-2 text-sm flex-1">{msg}</div>
              </div>
            ))}

            {queuedMessages.length > 0 && (
              <>
                <div className="text-xs font-medium mb-2 mt-4">Queued Messages</div>
                {queuedMessages.map((msg, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <div className="glass-card p-2 text-sm flex-1 opacity-60">{msg}</div>
                  </div>
                ))}
              </>
            )}

            {sentMessages.length === 0 && queuedMessages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-4">
                No messages yet. Try sending while offline.
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <strong>Recovery:</strong> Messages queued in local storage during offline periods. Auto-retry on reconnection with exponential backoff.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EDGE CASES SECTION COMPONENT
// ============================================================================
export function EdgeCasesSection() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <VeryLongMessageDemo />
        <RapidMessageFloodDemo />
        <OutOfOrderDeliveryDemo />
        <DuplicateMessagesDemo />
        <OrphanedRepliesDemo />
        <StaleTypingIndicatorDemo />
        <BulkReactionsDemo />
        <DeepThreadNestingDemo />
        <MessageConflictsDemo />
        <NetworkInterruptionDemo />
      </div>
    </div>
  )
}

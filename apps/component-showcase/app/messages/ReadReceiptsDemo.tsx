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
  User,
  Check,
  Clock,
  CheckCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react'

export function ReadReceiptsDemo() {
  const [retrying, setRetrying] = useState<number | null>(null)
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null)

  // Realistic user data
  const users = [
    { id: 1, name: 'Alice Johnson', avatar: 'AJ', color: 'bg-blue-500' },
    { id: 2, name: 'Bob Smith', avatar: 'BS', color: 'bg-green-500' },
    { id: 3, name: 'Carol White', avatar: 'CW', color: 'bg-purple-500' },
    { id: 4, name: 'David Brown', avatar: 'DB', color: 'bg-orange-500' },
    { id: 5, name: 'Emma Davis', avatar: 'ED', color: 'bg-pink-500' },
  ]

  // Messages with different read states
  const messages = [
    {
      id: 1,
      text: 'Hey team! Check out the new design mockups I just shared.',
      time: '2:30 PM',
      status: 'read' as const,
      readBy: [
        { ...users[0], readAt: '5m ago' },
        { ...users[1], readAt: '3m ago' },
        { ...users[2], readAt: '2m ago' },
        { ...users[3], readAt: '1m ago' },
        { ...users[4], readAt: 'just now' },
      ],
    },
    {
      id: 2,
      text: 'Quick update on the project timeline.',
      time: '2:45 PM',
      status: 'read' as const,
      readBy: [
        { ...users[0], readAt: '10m ago' },
        { ...users[1], readAt: '8m ago' },
        { ...users[3], readAt: '5m ago' },
      ],
    },
    {
      id: 3,
      text: 'Can someone review the pull request?',
      time: '3:00 PM',
      status: 'delivered' as const,
      readBy: [{ ...users[0], readAt: '2m ago' }],
    },
    {
      id: 4,
      text: 'Meeting starts in 5 minutes!',
      time: '3:15 PM',
      status: 'sent' as const,
      readBy: [],
    },
    {
      id: 5,
      text: "I'll be running a few minutes late.",
      time: '3:16 PM',
      status: 'sending' as const,
      readBy: [],
    },
    {
      id: 6,
      text: 'Failed to send: Check your connection and try again.',
      time: '3:17 PM',
      status: 'failed' as const,
      readBy: [],
    },
  ]

  const handleRetry = (messageId: number) => {
    setRetrying(messageId)
    setTimeout(() => {
      setRetrying(null)
    }, 2000)
  }

  const getStatusIcon = (status: string, messageId: number) => {
    if (retrying === messageId) {
      return <Loader2 className="h-3 w-3 animate-spin opacity-70" />
    }

    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 opacity-70 animate-pulse" />
      case 'sent':
        return <Check className="h-3 w-3 opacity-70" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 opacity-70" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-400" />
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-destructive" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sending':
        return 'Sending...'
      case 'sent':
        return 'Sent'
      case 'delivered':
        return 'Delivered'
      case 'read':
        return 'Read'
      case 'failed':
        return 'Failed to send'
      default:
        return ''
    }
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Read Receipts</CardTitle>
        <CardDescription>
          Delivery status, read receipts, and avatar stacks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Avatar Stack Examples */}
          <div>
            <h4 className="text-sm font-medium mb-3">Avatar Stacks</h4>
            <div className="space-y-4">
              {/* Small Stack */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {users.slice(0, 3).map((user) => (
                    <div
                      key={user.id}
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ring-2 ring-background',
                        user.color
                      )}
                      title={user.name}
                    >
                      {user.avatar}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Read by 3 people
                </span>
              </div>

              {/* Large Stack with Overflow */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {users.slice(0, 4).map((user) => (
                    <div
                      key={user.id}
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ring-2 ring-background',
                        user.color
                      )}
                      title={user.name}
                    >
                      {user.avatar}
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium ring-2 ring-background">
                    +1
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  Read by 5 people
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Status Examples */}
          <div>
            <h4 className="text-sm font-medium mb-3">Delivery Status</h4>
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              {[
                { status: 'sending', label: 'Sending' },
                { status: 'sent', label: 'Sent' },
                { status: 'delivered', label: 'Delivered' },
                { status: 'read', label: 'Read' },
                { status: 'failed', label: 'Failed' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    {getStatusIcon(item.status, -1)}
                  </div>
                  <span className="text-sm">{item.label}</span>
                  <Badge
                    variant={item.status === 'failed' ? 'destructive' : 'secondary'}
                    className="ml-auto"
                  >
                    {getStatusText(item.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Full Message Thread with Read Receipts */}
          <div>
            <h4 className="text-sm font-medium mb-3">Message Thread</h4>
            <ScrollArea className="h-[500px]">
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex gap-3 flex-row-reverse group"
                    onMouseEnter={() => setHoveredMessage(message.id)}
                    onMouseLeave={() => setHoveredMessage(null)}
                  >
                    <div className="icon-container-sm gradient-accent text-white shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col items-end space-y-1 max-w-[80%]">
                      <div
                        className={cn(
                          'rounded-xl rounded-tr-none p-3 transition-all',
                          message.status === 'failed'
                            ? 'bg-destructive/10 border border-destructive/30'
                            : 'gradient-accent text-white glow-sm'
                        )}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>

                      {/* Status and Read Receipts */}
                      <div className="flex items-center gap-2">
                        {/* Failed Message Actions */}
                        {message.status === 'failed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => handleRetry(message.id)}
                            disabled={retrying === message.id}
                          >
                            {retrying === message.id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Retrying...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Retry
                              </>
                            )}
                          </Button>
                        )}

                        {/* Time and Status */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span>{message.time}</span>
                          {getStatusIcon(message.status, message.id)}
                        </div>

                        {/* Read By Avatars */}
                        {message.readBy.length > 0 && (
                          <div className="relative group/receipts">
                            <div className="flex -space-x-1.5 cursor-pointer">
                              {message.readBy.slice(0, 3).map((reader) => (
                                <div
                                  key={reader.id}
                                  className={cn(
                                    'w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-medium ring-2 ring-background',
                                    reader.color
                                  )}
                                  title={reader.name}
                                >
                                  {reader.avatar}
                                </div>
                              ))}
                              {message.readBy.length > 3 && (
                                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium ring-2 ring-background">
                                  +{message.readBy.length - 3}
                                </div>
                              )}
                            </div>

                            {/* Tooltip on Hover */}
                            {hoveredMessage === message.id && (
                              <div className="absolute bottom-full right-0 mb-2 w-64 p-3 glass-card border rounded-lg shadow-lg z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Eye className="h-4 w-4 text-primary" />
                                  <h5 className="text-sm font-medium">
                                    Read by {message.readBy.length} of {users.length}
                                  </h5>
                                </div>
                                <div className="space-y-1.5">
                                  {message.readBy.map((reader) => (
                                    <div
                                      key={reader.id}
                                      className="flex items-center gap-2 text-xs"
                                    >
                                      <div
                                        className={cn(
                                          'w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-medium',
                                          reader.color
                                        )}
                                      >
                                        {reader.avatar}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">
                                          {reader.name}
                                        </div>
                                        <div className="text-muted-foreground">
                                          {reader.readAt}
                                        </div>
                                      </div>
                                      <CheckCheck className="h-3 w-3 text-blue-400" />
                                    </div>
                                  ))}
                                  {message.readBy.length < users.length && (
                                    <>
                                      <div className="h-px bg-border my-1.5" />
                                      <div className="text-xs text-muted-foreground">
                                        Not yet read by{' '}
                                        {users.length - message.readBy.length}{' '}
                                        {users.length - message.readBy.length === 1
                                          ? 'person'
                                          : 'people'}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Read by text for partial reads */}
                      {message.readBy.length > 0 &&
                        message.readBy.length < users.length && (
                          <div className="text-xs text-muted-foreground">
                            Read by {message.readBy.length} of {users.length}
                          </div>
                        )}

                      {/* All read indicator */}
                      {message.readBy.length === users.length && (
                        <div className="text-xs text-blue-400 flex items-center gap-1">
                          <CheckCheck className="h-3 w-3" />
                          Read by everyone
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Read Receipt Variants */}
          <div>
            <h4 className="text-sm font-medium mb-3">Read Receipt Variants</h4>
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              {/* Simple Text */}
              <div className="text-xs text-muted-foreground">
                Read by Alice 5m ago
              </div>

              {/* With Avatar */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-medium">
                  AJ
                </div>
                <span className="text-xs text-muted-foreground">
                  Alice read this 5m ago
                </span>
              </div>

              {/* Partial Read Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Read by 3 of 5</span>
                  <span className="text-muted-foreground">60%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: '60%' }}
                  />
                </div>
              </div>

              {/* Detailed List */}
              <div className="space-y-2 mt-4">
                <h5 className="text-xs font-medium">Delivery Details</h5>
                <div className="space-y-1.5">
                  {[
                    { name: 'Alice Johnson', status: 'read', time: '5m ago' },
                    { name: 'Bob Smith', status: 'read', time: '3m ago' },
                    { name: 'Carol White', status: 'delivered', time: '1m ago' },
                    { name: 'David Brown', status: 'sent', time: 'just now' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs"
                    >
                      <span>{item.name}</span>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span>{item.time}</span>
                        {item.status === 'read' && (
                          <CheckCheck className="h-3 w-3 text-blue-400" />
                        )}
                        {item.status === 'delivered' && (
                          <CheckCheck className="h-3 w-3" />
                        )}
                        {item.status === 'sent' && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

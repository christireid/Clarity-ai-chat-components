'use client'

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
} from '@clarity-chat/primitives'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Wifi,
  WifiOff,
  RefreshCw,
  Bell,
  X,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
  Clock,
  Loader2,
  Zap,
} from 'lucide-react'

// ============================================================================
// TOAST NOTIFICATIONS DEMO
// ============================================================================
function ToastNotificationsDemo() {
  const toasts = [
    {
      type: 'success',
      title: 'Message sent',
      description: 'Your message has been delivered',
    },
    {
      type: 'error',
      title: 'Failed to send',
      description: 'Please check your connection',
    },
    {
      type: 'warning',
      title: 'Token limit',
      description: 'Approaching context limit (85%)',
    },
    {
      type: 'info',
      title: 'New feature',
      description: 'Voice input is now available',
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Toast Notifications</CardTitle>
        <CardDescription>Temporary notification messages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {toasts.map((toast, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border',
                toast.type === 'success' &&
                  'border-green-500/50 bg-green-500/5',
                toast.type === 'error' && 'border-red-500/50 bg-red-500/5',
                toast.type === 'warning' &&
                  'border-yellow-500/50 bg-yellow-500/5',
                toast.type === 'info' && 'border-blue-500/50 bg-blue-500/5'
              )}
            >
              {getIcon(toast.type)}
              <div className="flex-1">
                <p className="font-medium text-sm">{toast.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {toast.description}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// NETWORK STATUS DEMO
// ============================================================================
function NetworkStatusDemo() {
  const [status, setStatus] = useState<'online' | 'offline' | 'reconnecting'>(
    'online'
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Network Status</CardTitle>
        <CardDescription>Connection state indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={status === 'online' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatus('online')}
            >
              Online
            </Button>
            <Button
              variant={status === 'offline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatus('offline')}
            >
              Offline
            </Button>
            <Button
              variant={status === 'reconnecting' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatus('reconnecting')}
            >
              Reconnecting
            </Button>
          </div>

          {/* Status Displays */}
          <div className="space-y-4">
            {/* Inline Badge */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Inline Badge</p>
              <div className="flex items-center gap-2">
                {status === 'online' && (
                  <Badge className="bg-green-500/20 text-green-600 gap-1">
                    <Wifi className="h-3 w-3" /> Connected
                  </Badge>
                )}
                {status === 'offline' && (
                  <Badge className="bg-red-500/20 text-red-600 gap-1">
                    <WifiOff className="h-3 w-3" /> Offline
                  </Badge>
                )}
                {status === 'reconnecting' && (
                  <Badge className="bg-yellow-500/20 text-yellow-600 gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin" /> Reconnecting
                  </Badge>
                )}
              </div>
            </div>

            {/* Banner Style */}
            {status !== 'online' && (
              <div
                className={cn(
                  'p-3 rounded-lg flex items-center gap-3',
                  status === 'offline' &&
                    'bg-red-500/10 border border-red-500/20',
                  status === 'reconnecting' &&
                    'bg-yellow-500/10 border border-yellow-500/20'
                )}
              >
                {status === 'offline' ? (
                  <WifiOff className="h-5 w-5 text-red-500" />
                ) : (
                  <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {status === 'offline'
                      ? 'No internet connection'
                      : 'Reconnecting...'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {status === 'offline'
                      ? "Messages will be sent when you're back online"
                      : 'Attempting to restore connection'}
                  </p>
                </div>
                {status === 'offline' && (
                  <Button size="sm" variant="outline">
                    Retry
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ERROR STATES DEMO
// ============================================================================
function ErrorStatesDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Error States</CardTitle>
        <CardDescription>Error handling and display</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Inline Error */}
          <div className="p-4 border border-red-500/50 bg-red-500/5 rounded-lg">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm text-red-600">
                  Message failed to send
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  There was an error processing your request. Please try again.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Retry
                  </Button>
                  <Button size="sm" variant="ghost">
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Limit Error */}
          <div className="p-4 border border-yellow-500/50 bg-yellow-500/5 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm text-yellow-600">
                  Rate limit exceeded
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You&apos;ve reached the request limit. Please wait before
                  sending more messages.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Retry in 30 seconds
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* API Error */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">
                  Service temporarily unavailable
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  The AI service is experiencing high demand. Your message has
                  been queued.
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Position in queue: 3
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// FEEDBACK BUTTONS DEMO
// ============================================================================
function FeedbackButtonsDemo() {
  const [rating, setRating] = useState<'up' | 'down' | null>(null)
  const [starRating, setStarRating] = useState(0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Feedback Components</CardTitle>
        <CardDescription>User feedback collection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Thumbs Up/Down */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Thumbs Rating</p>
            <div className="flex items-center gap-2">
              <Button
                variant={rating === 'up' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRating(rating === 'up' ? null : 'up')}
                className="gap-2"
              >
                <ThumbsUp
                  className={cn('h-4 w-4', rating === 'up' && 'fill-current')}
                />
                Helpful
              </Button>
              <Button
                variant={rating === 'down' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRating(rating === 'down' ? null : 'down')}
                className="gap-2"
              >
                <ThumbsDown
                  className={cn('h-4 w-4', rating === 'down' && 'fill-current')}
                />
                Not Helpful
              </Button>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Star Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setStarRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={cn(
                      'h-6 w-6',
                      star <= starRating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-muted-foreground'
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {starRating > 0 ? `${starRating}/5` : 'Rate this response'}
              </span>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="p-4 border rounded-lg">
            <p className="text-sm font-medium mb-3">Share detailed feedback</p>
            <textarea
              placeholder="What could be improved?"
              className="w-full p-3 text-sm border rounded-lg resize-none outline-none focus:ring-2 focus:ring-primary/20"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                Your feedback helps improve responses
              </span>
              <Button size="sm">Submit Feedback</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// NOTIFICATION CENTER DEMO
// ============================================================================
function NotificationCenterDemo() {
  const notifications = [
    {
      id: 1,
      type: 'message',
      title: 'New response available',
      time: '2 min ago',
      read: false,
    },
    {
      id: 2,
      type: 'system',
      title: 'Model updated to GPT-4o',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      type: 'alert',
      title: 'Token usage at 80%',
      time: '3 hours ago',
      read: true,
    },
    {
      id: 4,
      type: 'message',
      title: 'Shared chat received',
      time: 'Yesterday',
      read: true,
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case 'system':
        return <Info className="h-4 w-4 text-purple-500" />
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Notification Center</CardTitle>
            <CardDescription>Manage all notifications</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            Mark all read
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer',
                !notif.read && 'bg-primary/5'
              )}
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <p className={cn('text-sm', !notif.read && 'font-medium')}>
                  {notif.title}
                </p>
                <p className="text-xs text-muted-foreground">{notif.time}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function FeedbackStatusPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-primary -top-40 -right-40 opacity-20" />
        <div className="orb-violet bottom-40 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="Feedback & Status"
        description="Toasts, error states, network status, and feedback"
        icon={Bell}
        badge="8+ Components"
      />

      <Tabs defaultValue="toasts" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger value="toasts">Toasts</TabsTrigger>
          <TabsTrigger value="network">Network Status</TabsTrigger>
          <TabsTrigger value="errors">Error States</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="toasts">
          <ComponentSection
            title="Toast Notifications"
            description="Temporary status messages"
          >
            <ToastNotificationsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="network">
          <ComponentSection
            title="Network Status"
            description="Connection indicators"
          >
            <NetworkStatusDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="errors">
          <ComponentSection
            title="Error States"
            description="Error handling displays"
          >
            <ErrorStatesDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="feedback">
          <ComponentSection
            title="Feedback Components"
            description="User feedback collection"
          >
            <FeedbackButtonsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="notifications">
          <ComponentSection
            title="Notification Center"
            description="Centralized notifications"
          >
            <NotificationCenterDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}

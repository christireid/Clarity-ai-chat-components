'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import {
  Check,
  Bot,
  ChevronRight,
  User,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle,
} from 'lucide-react'

// ============================================================================
// STEPS INDICATOR
// ============================================================================
export function StepsIndicatorDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Steps Indicator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Setup', status: 'completed' },
            { step: 2, label: 'Configure', status: 'completed' },
            { step: 3, label: 'Deploy', status: 'current' },
            { step: 4, label: 'Verify', status: 'upcoming' },
          ].map((item, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    item.status === 'completed' && 'bg-green-500 text-white',
                    item.status === 'current' &&
                      'bg-primary text-primary-foreground',
                    item.status === 'upcoming' &&
                      'bg-muted text-muted-foreground'
                  )}
                >
                  {item.status === 'completed' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    item.step
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-1',
                    item.status === 'current'
                      ? 'font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              </div>
              {i < 3 && (
                <div
                  className={cn(
                    'w-16 h-0.5 mx-2',
                    item.status === 'completed' ? 'bg-green-500' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// THREADS VIEW
// ============================================================================
export function ThreadsViewDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Conversation Threads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            {
              title: 'React Performance Discussion',
              replies: 5,
              unread: 2,
              time: '2m ago',
            },
            {
              title: 'API Design Question',
              replies: 12,
              unread: 0,
              time: '1h ago',
            },
            {
              title: 'Bug Report #1234',
              replies: 8,
              unread: 3,
              time: '3h ago',
            },
          ].map((thread, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Bot className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{thread.title}</p>
                  {thread.unread > 0 && (
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      {thread.unread}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {thread.replies} replies · {thread.time}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PROGRESS INDICATORS
// ============================================================================
export function ProgressIndicatorsDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Linear Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Uploading files...</span>
              <span>67%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: '67%' }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Processing...</span>
              <span>Indeterminate</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'CPU', value: 45, color: 'bg-green-500' },
          { label: 'Memory', value: 72, color: 'bg-yellow-500' },
          { label: 'Disk', value: 89, color: 'bg-red-500' },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className={item.color.replace('bg-', 'text-')}
                    strokeDasharray={`${item.value * 2.26} 226`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {item.value}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// REALTIME INDICATOR
// ============================================================================
export function RealtimeIndicatorDemo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Realtime Status</CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-500">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { event: 'User joined conversation', time: 'Just now', icon: User },
            { event: 'Message received', time: '2s ago', icon: Bot },
            { event: 'File uploaded', time: '5s ago', icon: FileText },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1">{item.event}</span>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SAFETY BANNER
// ============================================================================
export function SafetyComponentsDemo() {
  return (
    <div className="space-y-4">
      <Card className="border-red-500/50 bg-red-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-600">Content Warning</h4>
            <p className="text-sm text-muted-foreground mt-1">
              This response may contain sensitive content. User discretion is
              advised.
            </p>
            <div className="flex gap-2 mt-3">
              <Button variant="destructive" size="sm">
                Show Anyway
              </Button>
              <Button variant="outline" size="sm">
                Hide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-600">Rate Limit Warning</h4>
            <p className="text-sm text-muted-foreground mt-1">
              You are approaching your API rate limit. 85% of quota used.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-500/50 bg-green-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-600">Content Verified</h4>
            <p className="text-sm text-muted-foreground mt-1">
              This response has been verified for accuracy and safety.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

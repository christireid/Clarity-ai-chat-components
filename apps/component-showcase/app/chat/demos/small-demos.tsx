'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator,
  cn,
} from '@clarity-chat/primitives'
import {
  MessageSquare,
  Plus,
  Search,
  AlertOctagon,
  RotateCcw,
  AlertTriangle,
  Hourglass,
  Edit3,
  Archive,
  Reply,
  Bell,
  Code,
  Users,
  Link,
  ExternalLink,
  FileText,
} from 'lucide-react'

export function EmptyStateDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Empty States</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-8 border rounded-lg text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No conversations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start a new chat to get going
            </p>
            <Button className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
          <div className="p-8 border rounded-lg text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No results found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ErrorPageDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Error States</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertOctagon className="h-10 w-10 text-red-500 mb-3" />
            <p className="font-medium text-red-600">Connection Failed</p>
            <p className="text-sm text-muted-foreground mt-1">
              Unable to reach the server
            </p>
            <Button variant="outline" size="sm" className="mt-3 gap-2">
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
          </div>
          <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertTriangle className="h-10 w-10 text-yellow-500 mb-3" />
            <p className="font-medium text-yellow-600">Rate Limited</p>
            <p className="text-sm text-muted-foreground mt-1">
              Too many requests. Retry in 30s
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Hourglass className="h-4 w-4" />
              Waiting...
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MessageDraftsDemo() {
  const drafts = [
    { id: 1, preview: 'Can you help me with...', time: '2 min ago' },
    { id: 2, preview: 'I need to understand how...', time: '1 hour ago' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          Drafts & Archive
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Drafts</p>
          <div className="space-y-2">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
              >
                <Edit3 className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm truncate">{draft.preview}</span>
                <span className="text-xs text-muted-foreground">
                  {draft.time}
                </span>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Archived messages</span>
          </div>
          <Badge variant="secondary">12</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export function QuickRepliesDemo() {
  const replies = [
    'Yes, please continue',
    'Can you explain more?',
    'Show me an example',
    "That's helpful, thanks!",
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Reply className="h-5 w-5" />
          Quick Replies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {replies.map((reply) => (
            <Button
              key={reply}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              {reply}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function NotificationsDemo() {
  const notifications = [
    {
      id: 1,
      title: 'New message',
      desc: 'AI responded to your query',
      time: '2m',
      unread: true,
    },
    {
      id: 2,
      title: 'Task completed',
      desc: 'Code execution finished',
      time: '5m',
      unread: true,
    },
    {
      id: 3,
      title: 'Memory updated',
      desc: 'New facts stored',
      time: '10m',
      unread: false,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <Badge className="bg-red-500">2</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={cn(
              'flex items-start gap-3 p-2 rounded-lg',
              notif.unread && 'bg-primary/5'
            )}
          >
            {notif.unread && (
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
            )}
            {!notif.unread && <div className="w-2" />}
            <div className="flex-1">
              <p className="text-sm font-medium">{notif.title}</p>
              <p className="text-xs text-muted-foreground">{notif.desc}</p>
            </div>
            <span className="text-xs text-muted-foreground">{notif.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function PersonasDemo() {
  const personas = [
    {
      id: 1,
      name: 'Code Assistant',
      desc: 'Expert in programming',
      icon: Code,
      active: true,
    },
    {
      id: 2,
      name: 'Writing Helper',
      desc: 'Creative writing & editing',
      icon: Edit3,
      active: false,
    },
    {
      id: 3,
      name: 'Research Agent',
      desc: 'Deep research & analysis',
      icon: Search,
      active: false,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Personas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
              persona.active
                ? 'bg-primary/10 border border-primary/30'
                : 'hover:bg-muted'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                persona.active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <persona.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{persona.name}</p>
              <p className="text-xs text-muted-foreground">{persona.desc}</p>
            </div>
            {persona.active && <Badge>Active</Badge>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function SourcesDemo() {
  const sources = [
    {
      id: 1,
      title: 'React Documentation',
      url: 'react.dev',
      snippet: 'Official React docs...',
    },
    {
      id: 2,
      title: 'MDN Web Docs',
      url: 'developer.mozilla.org',
      snippet: 'Web technology reference...',
    },
    {
      id: 3,
      title: 'Stack Overflow',
      url: 'stackoverflow.com',
      snippet: 'Community Q&A...',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Link className="h-5 w-5" />
          Sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sources.map((source, i) => (
            <div
              key={source.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer"
            >
              <Badge variant="outline">{i + 1}</Badge>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{source.title}</p>
                <p className="text-xs text-primary truncate">{source.url}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {source.snippet}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function InlineCitationsDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Inline Citations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm leading-relaxed">
            React components are reusable pieces of UI
            <sup className="text-primary cursor-pointer hover:underline mx-0.5">
              [1]
            </sup>
            that can manage their own state. The Virtual DOM
            <sup className="text-primary cursor-pointer hover:underline mx-0.5">
              [2]
            </sup>
            enables efficient updates by comparing changes before applying them
            to the real DOM
            <sup className="text-primary cursor-pointer hover:underline mx-0.5">
              [3]
            </sup>
            .
          </p>
        </div>
        <div className="mt-3 space-y-2">
          {[
            {
              num: 1,
              title: 'React Docs - Components',
              url: 'react.dev/learn/components',
            },
            {
              num: 2,
              title: 'Virtual DOM Explained',
              url: 'react.dev/learn/vdom',
            },
            {
              num: 3,
              title: 'Reconciliation',
              url: 'react.dev/learn/reconciliation',
            },
          ].map((cite) => (
            <div key={cite.num} className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="w-5 h-5 p-0 justify-center">
                {cite.num}
              </Badge>
              <span className="font-medium">{cite.title}</span>
              <span className="text-muted-foreground">- {cite.url}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

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
  Input,
  cn,
} from '@clarity-chat/primitives'
import {
  Search,
  Command,
  MessageSquare,
  FileText,
  Settings,
  User,
  History,
  Star,
  Clock,
  ArrowRight,
  ChevronRight,
  Plus,
  Trash2,
  MoreHorizontal,
  Pin,
  Archive,
  Folder,
  Tag,
  Navigation,
} from 'lucide-react'

// ============================================================================
// COMMAND PALETTE DEMO
// ============================================================================
function CommandPaletteDemo() {
  const [query, setQuery] = useState('')

  const commands = [
    { icon: <Plus className="h-4 w-4" />, label: 'New Chat', shortcut: '⌘ N' },
    {
      icon: <Search className="h-4 w-4" />,
      label: 'Search Messages',
      shortcut: '⌘ K',
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: 'Upload File',
      shortcut: '⌘ U',
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: 'Open Settings',
      shortcut: '⌘ ,',
    },
    { icon: <User className="h-4 w-4" />, label: 'Profile', shortcut: '⌘ P' },
    {
      icon: <History className="h-4 w-4" />,
      label: 'Chat History',
      shortcut: '⌘ H',
    },
  ]

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Command Palette</CardTitle>
        <CardDescription>Quick actions with keyboard shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full max-w-lg mx-auto">
          <div className="border rounded-lg shadow-lg overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-2 p-3 border-b">
              <Command className="h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="border-0 focus-visible:ring-0 p-0 h-auto"
              />
              <kbd className="hidden sm:block px-2 py-1 text-xs bg-muted rounded">
                Esc
              </kbd>
            </div>

            {/* Commands List */}
            <div className="p-2 max-h-[300px] overflow-y-auto">
              <p className="px-2 py-1 text-xs text-muted-foreground">
                Commands
              </p>
              {filteredCommands.map((cmd, i) => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:glass-subtle text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{cmd.icon}</span>
                    <span>{cmd.label}</span>
                  </div>
                  <kbd className="px-2 py-0.5 text-xs bg-muted rounded font-mono">
                    {cmd.shortcut}
                  </kbd>
                </button>
              ))}
              {filteredCommands.length === 0 && (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  No commands found
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CONVERSATION LIST DEMO
// ============================================================================
function ConversationListDemo() {
  const conversations = [
    {
      id: 1,
      title: 'React Performance Tips',
      messages: 24,
      pinned: true,
      unread: 0,
      date: 'Today',
    },
    {
      id: 2,
      title: 'API Design Discussion',
      messages: 18,
      pinned: true,
      unread: 3,
      date: 'Today',
    },
    {
      id: 3,
      title: 'Debug Authentication Bug',
      messages: 45,
      pinned: false,
      unread: 0,
      date: 'Yesterday',
    },
    {
      id: 4,
      title: 'Code Review Session',
      messages: 12,
      pinned: false,
      unread: 0,
      date: 'Yesterday',
    },
    {
      id: 5,
      title: 'Database Schema Planning',
      messages: 30,
      pinned: false,
      unread: 0,
      date: '3 days ago',
    },
    {
      id: 6,
      title: 'UI Component Library',
      messages: 56,
      pinned: false,
      unread: 0,
      date: '1 week ago',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Conversations</CardTitle>
            <CardDescription>Chat history management</CardDescription>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>

          {/* Pinned Section */}
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-2 flex items-center gap-1">
              <Pin className="h-3 w-3" /> Pinned
            </p>
            <div className="space-y-1">
              {conversations
                .filter((c) => c.pinned)
                .map((conv) => (
                  <div
                    key={conv.id}
                    role="button"
                    tabIndex={0}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:glass-subtle transition-colors text-left cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {conv.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conv.messages} messages
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        {conv.unread}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>

          {/* Recent Section */}
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-2 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Recent
            </p>
            <div className="space-y-1">
              {conversations
                .filter((c) => !c.pinned)
                .map((conv) => (
                  <div
                    key={conv.id}
                    role="button"
                    tabIndex={0}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:glass-subtle transition-colors text-left cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {conv.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conv.date} • {conv.messages} messages
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// HISTORY TIMELINE DEMO
// ============================================================================
function HistoryTimelineDemo() {
  const timeline = [
    {
      date: 'Today',
      events: [
        {
          time: '10:30 AM',
          action: 'Created new chat',
          title: 'React Performance',
        },
        {
          time: '9:15 AM',
          action: 'Exported conversation',
          title: 'API Design',
        },
      ],
    },
    {
      date: 'Yesterday',
      events: [
        { time: '4:45 PM', action: 'Archived chat', title: 'Old Project' },
        { time: '2:30 PM', action: 'Starred message', title: 'Debug Session' },
        { time: '11:00 AM', action: 'Created new chat', title: 'Code Review' },
      ],
    },
    {
      date: '3 days ago',
      events: [
        {
          time: '3:20 PM',
          action: 'Shared conversation',
          title: 'Database Schema',
        },
      ],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity History</CardTitle>
        <CardDescription>Timeline of your chat activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timeline.map((day, i) => (
            <div key={i}>
              <p className="text-sm font-medium mb-3">{day.date}</p>
              <div className="space-y-3 pl-4 border-l">
                {day.events.map((event, j) => (
                  <div key={j} className="relative">
                    <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-primary/20 border-2 border-primary" />
                    <div className="pl-4">
                      <p className="text-sm">{event.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {event.time}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <Badge variant="secondary" className="text-xs">
                          {event.title}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// BREADCRUMB DEMO
// ============================================================================
function BreadcrumbDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Breadcrumbs</CardTitle>
        <CardDescription>Navigation path indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Breadcrumb */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Basic</p>
            <nav className="flex items-center gap-1 text-sm">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Home
              </a>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Conversations
              </a>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">React Tutorial</span>
            </nav>
          </div>

          {/* With Icons */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">With Icons</p>
            <nav className="flex items-center gap-1 text-sm">
              <a
                href="#"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <Folder className="h-4 w-4" />
                Projects
              </a>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <a
                href="#"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <Tag className="h-4 w-4" />
                Development
              </a>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="flex items-center gap-1 font-medium">
                <MessageSquare className="h-4 w-4" />
                Chat
              </span>
            </nav>
          </div>

          {/* Collapsed */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Collapsed</p>
            <nav className="flex items-center gap-1 text-sm">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Home
              </a>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <button className="text-muted-foreground hover:text-foreground">
                ...
              </button>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Parent
              </a>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Current Page</span>
            </nav>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// QUICK NAVIGATION DEMO
// ============================================================================
function QuickNavigationDemo() {
  const shortcuts = [
    {
      icon: <Plus className="h-5 w-5" />,
      label: 'New Chat',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      icon: <Star className="h-5 w-5" />,
      label: 'Starred',
      color: 'bg-yellow-500/10 text-yellow-500',
    },
    {
      icon: <Archive className="h-5 w-5" />,
      label: 'Archived',
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      icon: <Trash2 className="h-5 w-5" />,
      label: 'Trash',
      color: 'bg-red-500/10 text-red-500',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Navigation</CardTitle>
        <CardDescription>One-click access to common areas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shortcuts.map((item, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:glass-subtle/50 transition-colors"
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center',
                  item.color
                )}
              >
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function NavigationPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-cyan -top-40 -left-40 opacity-20" />
        <div className="orb-violet bottom-40 -right-40 opacity-20" />
      </div>

      <PageHeader
        title="Navigation"
        description="Command palette, conversation lists, and navigation components"
        icon={Navigation}
        badge="5+ Components"
      />

      <Tabs defaultValue="command" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger value="command">Command Palette</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="breadcrumb">Breadcrumbs</TabsTrigger>
          <TabsTrigger value="quick">Quick Nav</TabsTrigger>
        </TabsList>

        <TabsContent value="command">
          <ComponentSection
            title="Command Palette"
            description="Quick command execution"
          >
            <CommandPaletteDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="conversations">
          <ComponentSection
            title="Conversation List"
            description="Chat history sidebar"
          >
            <ConversationListDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="history">
          <ComponentSection
            title="Activity History"
            description="Timeline view"
          >
            <HistoryTimelineDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="breadcrumb">
          <ComponentSection title="Breadcrumbs" description="Navigation paths">
            <BreadcrumbDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="quick">
          <ComponentSection
            title="Quick Navigation"
            description="Shortcut buttons"
          >
            <QuickNavigationDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}

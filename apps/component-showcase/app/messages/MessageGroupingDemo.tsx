'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import {
  User,
  Bot,
  Layers,
  Sparkles,
  CheckCheck,
} from 'lucide-react'

export function MessageGroupingDemo() {
  const [compactMode, setCompactMode] = useState(true)

  // Simulated conversation spanning multiple days
  const conversationData = [
    // Jan 13 - 3 days ago
    {
      date: 'Jan 13',
      dateLabel: 'Jan 13',
      isToday: false,
      isYesterday: false,
      messages: [
        {
          id: '1',
          role: 'user' as const,
          content: "Hey! I'm working on a React project and need help with state management.",
          time: '2:15 PM',
          grouped: false,
        },
        {
          id: '2',
          role: 'assistant' as const,
          content: "I'd be happy to help! What specific challenges are you facing with state management?",
          time: '2:15 PM',
          grouped: false,
        },
        {
          id: '3',
          role: 'user' as const,
          content: 'I have multiple components that need to share state.',
          time: '2:16 PM',
          grouped: true,
        },
        {
          id: '4',
          role: 'user' as const,
          content: "Currently using prop drilling but it's getting messy.",
          time: '2:16 PM',
          grouped: true,
        },
        {
          id: '5',
          role: 'user' as const,
          content: 'Should I use Context API or something like Zustand?',
          time: '2:17 PM',
          grouped: true,
        },
        {
          id: '6',
          role: 'assistant' as const,
          content:
            "Great question! Both are viable options. Let me break down the trade-offs for each approach.",
          time: '2:17 PM',
          grouped: false,
        },
        {
          id: '7',
          role: 'assistant' as const,
          content:
            "Context API is built into React and works well for app-wide state that doesn't change frequently.",
          time: '2:17 PM',
          grouped: true,
        },
        {
          id: '8',
          role: 'assistant' as const,
          content:
            "Zustand is lightweight, has better performance for frequently updated state, and doesn't require providers.",
          time: '2:18 PM',
          grouped: true,
        },
      ],
    },
    // Yesterday
    {
      date: 'yesterday',
      dateLabel: 'Yesterday',
      isToday: false,
      isYesterday: true,
      messages: [
        {
          id: '9',
          role: 'user' as const,
          content: 'Thanks! I went with Zustand and it works great.',
          time: '9:30 AM',
          grouped: false,
        },
        {
          id: '10',
          role: 'assistant' as const,
          content: "Excellent choice! Glad it's working well for you. How's your project coming along?",
          time: '9:31 AM',
          grouped: false,
        },
        {
          id: '11',
          role: 'user' as const,
          content: 'Pretty good! Now I need help with optimizing renders.',
          time: '4:45 PM',
          grouped: false,
        },
        {
          id: '12',
          role: 'user' as const,
          content: "Some components are re-rendering when they shouldn't.",
          time: '4:45 PM',
          grouped: true,
        },
        {
          id: '13',
          role: 'assistant' as const,
          content:
            "Performance optimization! Let's look at a few strategies: React.memo(), useMemo, and useCallback.",
          time: '4:46 PM',
          grouped: false,
        },
        {
          id: '14',
          role: 'assistant' as const,
          content:
            "First, identify which components are re-rendering unnecessarily using React DevTools Profiler.",
          time: '4:46 PM',
          grouped: true,
        },
      ],
    },
    // Today
    {
      date: 'today',
      dateLabel: 'Today',
      isToday: true,
      isYesterday: false,
      hasUnread: true,
      unreadIndex: 4, // After message index 4
      messages: [
        {
          id: '15',
          role: 'user' as const,
          content: 'Good morning! Quick question about useCallback.',
          time: '8:15 AM',
          grouped: false,
        },
        {
          id: '16',
          role: 'assistant' as const,
          content: 'Good morning! Sure, what would you like to know about useCallback?',
          time: '8:15 AM',
          grouped: false,
        },
        {
          id: '17',
          role: 'user' as const,
          content: 'When should I use it vs useMemo?',
          time: '8:16 AM',
          grouped: false,
        },
        {
          id: '18',
          role: 'user' as const,
          content: 'They seem similar to me.',
          time: '8:16 AM',
          grouped: true,
        },
        {
          id: '19',
          role: 'assistant' as const,
          content:
            "Great question! They're related but serve different purposes.",
          time: '10:22 AM',
          grouped: false,
        },
        {
          id: '20',
          role: 'assistant' as const,
          content:
            'useCallback memoizes a function itself, preventing it from being recreated on every render.',
          time: '10:22 AM',
          grouped: true,
        },
        {
          id: '21',
          role: 'assistant' as const,
          content:
            'useMemo memoizes the result of a computation, preventing expensive calculations from running on every render.',
          time: '10:22 AM',
          grouped: true,
        },
        {
          id: '22',
          role: 'assistant' as const,
          content:
            'Use useCallback when passing functions as props to memoized child components.',
          time: '10:23 AM',
          grouped: true,
        },
        {
          id: '23',
          role: 'user' as const,
          content: 'Ah that makes sense! Thanks for clarifying.',
          time: '10:25 AM',
          grouped: false,
        },
      ],
    },
  ]

  // Scroll to date section
  const scrollToDate = (date: string) => {
    const element = document.getElementById(`date-${date}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Card className="glass-card backdrop-blur-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Message Grouping</CardTitle>
            <CardDescription>
              Realistic conversation with dates, grouping, and unread separator
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Date Jump Navigation */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Jump to:</span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => scrollToDate('today')}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => scrollToDate('yesterday')}
                >
                  Yesterday
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => scrollToDate('Jan 13')}
                >
                  Jan 13
                </Button>
              </div>
            </div>
            {/* Compact Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCompactMode(!compactMode)}
              className="gap-2"
            >
              <Layers className="h-3 w-3" />
              {compactMode ? 'Expanded' : 'Compact'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-6 p-4 glass-panel backdrop-blur-md rounded-lg">
            {conversationData.map((day) => (
              <div key={day.date} id={`date-${day.date}`}>
                {/* Date Separator */}
                <div className="glass-panel backdrop-blur-md text-center py-2 px-4 rounded-lg sticky top-0 z-10 -mx-4">
                  <span className="text-xs font-medium text-muted-foreground">
                    {day.dateLabel}
                  </span>
                </div>

                {/* Messages */}
                <div className="space-y-3 mt-4">
                  {day.messages.map((message, idx) => {
                    const isUser = message.role === 'user'
                    const showAvatar = !compactMode || !message.grouped
                    const showName = !compactMode || !message.grouped

                    // Check if unread separator should appear after this message
                    const showUnreadAfter =
                      day.hasUnread && idx === day.unreadIndex

                    return (
                      <div key={message.id}>
                        <div
                          className={cn(
                            'flex gap-3',
                            isUser && 'flex-row-reverse',
                            message.grouped && compactMode && 'mt-1'
                          )}
                        >
                          {/* Avatar */}
                          <div
                            className={cn(
                              'shrink-0 transition-opacity',
                              showAvatar ? 'opacity-100' : 'opacity-0'
                            )}
                          >
                            {isUser ? (
                              <div className="icon-container-sm gradient-accent text-white">
                                <User className="h-4 w-4" />
                              </div>
                            ) : (
                              <div className="icon-container-sm">
                                <Bot className="h-4 w-4" />
                              </div>
                            )}
                          </div>

                          {/* Message Content */}
                          <div
                            className={cn(
                              'flex flex-col gap-1',
                              isUser && 'items-end'
                            )}
                          >
                            {/* Name (if not grouped) */}
                            {showName && (
                              <span className="text-xs font-medium text-muted-foreground px-1">
                                {isUser ? 'You' : 'Assistant'}
                              </span>
                            )}

                            {/* Message Bubble */}
                            <div
                              className={cn(
                                'p-3 max-w-[85%]',
                                isUser
                                  ? 'gradient-accent text-white glow-sm backdrop-blur-md rounded-xl'
                                  : 'glass-subtle backdrop-blur-md rounded-xl',
                                // Adjust border radius for grouped messages
                                message.grouped &&
                                  compactMode &&
                                  (isUser
                                    ? 'rounded-tr-xl rounded-br-xl'
                                    : 'rounded-tl-xl rounded-bl-xl'),
                                !message.grouped &&
                                  (isUser ? 'rounded-tr-none' : 'rounded-tl-none')
                              )}
                            >
                              <p className="text-sm leading-relaxed">
                                {message.content}
                              </p>
                            </div>

                            {/* Timestamp (only for last message in group or ungrouped) */}
                            {(!message.grouped ||
                              !conversationData
                                .find((d) => d.date === day.date)
                                ?.messages[idx + 1]?.grouped) && (
                              <span
                                className={cn(
                                  'text-xs text-muted-foreground px-1',
                                  isUser && 'text-right'
                                )}
                              >
                                {message.time}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Unread Separator */}
                        {showUnreadAfter && (
                          <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-destructive/30" />
                            <div className="flex items-center gap-2 px-3 py-1.5 glass-panel backdrop-blur-sm border border-destructive/30 rounded-full">
                              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                              <span className="text-xs font-medium text-destructive">
                                New messages
                              </span>
                            </div>
                            <div className="flex-1 h-px bg-destructive/30" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Features Legend */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Features Demonstrated
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 text-xs">
                  <CheckCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Date Separators</div>
                    <div className="text-muted-foreground">
                      Today, Yesterday, specific dates
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <CheckCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">User Grouping</div>
                    <div className="text-muted-foreground">
                      Consecutive same-sender messages
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <CheckCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Time Gaps</div>
                    <div className="text-muted-foreground">
                      Separate groups when more than 5min apart
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <CheckCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Compact Mode</div>
                    <div className="text-muted-foreground">
                      Hide avatars/names for grouped
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <CheckCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Mixed Grouping</div>
                    <div className="text-muted-foreground">
                      User and assistant messages
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <CheckCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Scroll Anchors</div>
                    <div className="text-muted-foreground">
                      Jump to specific dates
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <CheckCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Unread Separator</div>
                    <div className="text-muted-foreground">
                      "New messages" divider
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <CheckCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Visual Hierarchy</div>
                    <div className="text-muted-foreground">
                      Proper spacing and design
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

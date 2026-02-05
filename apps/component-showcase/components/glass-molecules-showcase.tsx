/**
 * Glass Message Molecules Showcase
 *
 * This file contains a comprehensive demo component that can be dropped into
 * the messages page to showcase all the new glass molecule components.
 *
 * Usage in messages/page.tsx:
 * import { GlassMessageMoleculesShowcase } from '@/components/glass-molecules-showcase'
 *
 * Then add a new TabsContent section:
 * <TabsContent value="molecules">
 *   <GlassMessageMoleculesShowcase />
 * </TabsContent>
 */

'use client'

import React, { useState } from 'react'
import { Bot, User, ThumbsUp, Copy, Reply, Trash2, Send, Edit } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@clarity-chat/primitives'
import {
  GlassMessageContainer,
  GlassMessageHeader,
  GlassMessageContent,
  GlassMessageFooter,
  GlassMessageActions,
  GlassThreadIndicator,
  GlassTypingDots,
} from './glass-molecules'

export function GlassMessageMoleculesShowcase() {
  const [showActions, setShowActions] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null)
  const [reactions, setReactions] = useState([
    { emoji: '👍', count: 3, active: false },
    { emoji: '❤️', count: 1, active: false },
    { emoji: '😂', count: 5, active: false },
  ])

  const handleReactionClick = (emoji: string) => {
    setReactions((prev) =>
      prev.map((r) =>
        r.emoji === emoji
          ? { ...r, active: !r.active, count: r.active ? r.count - 1 : r.count + 1 }
          : r
      )
    )
  }

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Glass Message Molecules</CardTitle>
          <CardDescription>
            Reusable component molecules for building sophisticated message UI with
            glassmorphism design. All components are composable and follow the
            established design system.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 1. Message Container */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">1. GlassMessageContainer</CardTitle>
          <CardDescription>
            Wrapper with proper spacing and automatic layout for different message
            types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <GlassMessageContainer variant="assistant">
              <div className="icon-container-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <GlassMessageContent>
                  <p className="text-sm">Assistant message with container</p>
                </GlassMessageContent>
              </div>
            </GlassMessageContainer>

            <GlassMessageContainer variant="user">
              <div className="icon-container-sm gradient-accent text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <GlassMessageContent className="gradient-accent text-white">
                  <p className="text-sm">User message (reversed layout)</p>
                </GlassMessageContent>
              </div>
            </GlassMessageContainer>

            <div className="mt-6 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Features:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Auto flex-direction (user messages reversed)</li>
                <li>Smart spacing for grouped messages</li>
                <li>Supports isFirst, isLast, isGrouped props</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Message Header */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">2. GlassMessageHeader</CardTitle>
          <CardDescription>
            Name, timestamp, and status indicators with automatic layout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <GlassMessageHeader
                name="AI Assistant"
                timestamp="10:32 AM"
                avatar={
                  <div className="icon-container-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                }
              />
              <GlassMessageContent>
                <p className="text-sm">Message with full header</p>
              </GlassMessageContent>
            </div>

            <div className="space-y-2">
              <GlassMessageHeader
                name="You"
                timestamp="10:33 AM"
                status="read"
                variant="user"
              />
              <GlassMessageContent className="gradient-accent text-white">
                <p className="text-sm">Message with read status</p>
              </GlassMessageContent>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 text-xs">
              <div className="p-2 glass-subtle rounded">
                <span className="font-medium">sending</span> ⏳
              </div>
              <div className="p-2 glass-subtle rounded">
                <span className="font-medium">sent</span> ✓
              </div>
              <div className="p-2 glass-subtle rounded">
                <span className="font-medium">delivered</span> ✓✓
              </div>
              <div className="p-2 glass-subtle rounded text-blue-500">
                <span className="font-medium">read</span> ✓✓
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Message Content */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">3. GlassMessageContent</CardTitle>
          <CardDescription>
            Message body with three variants and streaming support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Default variant</p>
              <GlassMessageContent variant="default">
                <p className="text-sm">
                  Standard message with glass-subtle effect and hover state
                </p>
              </GlassMessageContent>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Code variant</p>
              <GlassMessageContent variant="code">
                {`const example = "code block";\nconsole.log(example);`}
              </GlassMessageContent>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Rich variant</p>
              <GlassMessageContent variant="rich">
                <p className="text-sm font-medium">Rich Content</p>
                <p className="text-sm text-muted-foreground">
                  Supports complex layouts with multiple elements
                </p>
              </GlassMessageContent>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Streaming (with animated cursor)
              </p>
              <GlassMessageContent streaming>
                <p className="text-sm">Generating content in real-time</p>
              </GlassMessageContent>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Message Footer */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">4. GlassMessageFooter</CardTitle>
          <CardDescription>
            Reactions and read receipts with interactive states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Interactive reactions (click to toggle)
              </p>
              <GlassMessageContent>
                <p className="text-sm">Message with reactions</p>
              </GlassMessageContent>
              <GlassMessageFooter
                reactions={reactions}
                onReactionClick={handleReactionClick}
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Read receipts (shows 3, then +N)
              </p>
              <GlassMessageContent>
                <p className="text-sm">Message with read receipts</p>
              </GlassMessageContent>
              <GlassMessageFooter
                readReceipts={[
                  { name: 'Alice', avatar: 'A' },
                  { name: 'Bob', avatar: 'B' },
                  { name: 'Charlie', avatar: 'C' },
                  { name: 'David', avatar: 'D' },
                  { name: 'Eve', avatar: 'E' },
                ]}
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Combined reactions + receipts
              </p>
              <GlassMessageContent>
                <p className="text-sm">Message with both features</p>
              </GlassMessageContent>
              <GlassMessageFooter
                reactions={[
                  { emoji: '👍', count: 2 },
                  { emoji: '🚀', count: 1 },
                ]}
                readReceipts={[
                  { name: 'Alice', avatar: 'A' },
                  { name: 'Bob', avatar: 'B' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Message Actions */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">5. GlassMessageActions</CardTitle>
          <CardDescription>
            Hover-activated action bar with color-coded variants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-3">
              Hover over the message to see actions
            </p>
            <div
              className="relative"
              onMouseEnter={() => setShowActions(true)}
              onMouseLeave={() => setShowActions(false)}
            >
              <GlassMessageContent>
                <p className="text-sm">
                  Actions appear on hover with fade/scale animation
                </p>
              </GlassMessageContent>
              <GlassMessageActions
                visible={showActions}
                position="top"
                actions={[
                  {
                    icon: ThumbsUp,
                    label: 'Like',
                    onClick: () => {},
                    variant: 'success',
                  },
                  { icon: Copy, label: 'Copy', onClick: () => {} },
                  { icon: Edit, label: 'Edit', onClick: () => {} },
                  {
                    icon: Trash2,
                    label: 'Delete',
                    onClick: () => {},
                    variant: 'danger',
                  },
                ]}
              />
            </div>

            <div className="mt-6 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Action variants:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>default - standard color</li>
                <li className="text-green-600">success - green hover</li>
                <li className="text-yellow-600">warning - yellow hover</li>
                <li className="text-red-600">danger - red hover</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Thread Indicator */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">6. GlassThreadIndicator</CardTitle>
          <CardDescription>Reply count badge with compact and expanded variants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Compact variant</p>
              <GlassMessageContent>
                <p className="text-sm">Message with thread</p>
              </GlassMessageContent>
              <GlassThreadIndicator
                count={3}
                variant="compact"
                onClick={() => alert('Open thread')}
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Expanded variant (with last reply time)
              </p>
              <GlassMessageContent>
                <p className="text-sm">Message with detailed thread info</p>
              </GlassMessageContent>
              <GlassThreadIndicator
                count={12}
                lastReplyTime="2 hours ago"
                variant="expanded"
                onClick={() => alert('Open thread')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. Typing Dots */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">7. GlassTypingDots</CardTitle>
          <CardDescription>
            Animated typing indicator with three styles and three sizes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Dots variant (classic bouncing)
              </p>
              <GlassTypingDots variant="dots" size="md" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Pulse variant (fading circles)
              </p>
              <GlassTypingDots variant="pulse" size="md" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Wave variant (height animation)
              </p>
              <GlassTypingDots variant="wave" size="md" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                With user name and avatar
              </p>
              <GlassTypingDots
                variant="dots"
                size="md"
                userName="AI Assistant"
                showAvatar
                avatar={
                  <div className="icon-container-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                }
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Size variants</p>
              <div className="flex items-end gap-6">
                <div>
                  <p className="text-xs mb-1">Small</p>
                  <GlassTypingDots variant="dots" size="sm" />
                </div>
                <div>
                  <p className="text-xs mb-1">Medium</p>
                  <GlassTypingDots variant="dots" size="md" />
                </div>
                <div>
                  <p className="text-xs mb-1">Large</p>
                  <GlassTypingDots variant="dots" size="lg" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Example */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Complete Message Example</CardTitle>
          <CardDescription>
            All molecules combined in a realistic message
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div
              className="relative"
              onMouseEnter={() => setShowActions(true)}
              onMouseLeave={() => setShowActions(false)}
            >
              <GlassMessageContainer variant="assistant">
                <div className="icon-container-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex-1 relative">
                  <GlassMessageHeader
                    name="AI Assistant"
                    timestamp="10:32 AM"
                    status="delivered"
                  />
                  <GlassMessageContent variant="rich">
                    <p className="text-sm font-medium mb-2">
                      Complete Message Showcase
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This message demonstrates all available molecule components
                      working together: header with status, rich content, reactions,
                      read receipts, thread indicator, and hover actions.
                    </p>
                  </GlassMessageContent>
                  <GlassMessageFooter
                    reactions={[
                      { emoji: '👍', count: 2 },
                      { emoji: '🚀', count: 1 },
                      { emoji: '💯', count: 3 },
                    ]}
                    readReceipts={[
                      { name: 'Alice', avatar: 'A' },
                      { name: 'Bob', avatar: 'B' },
                      { name: 'Charlie', avatar: 'C' },
                    ]}
                  />
                  <GlassThreadIndicator
                    count={5}
                    lastReplyTime="1 hour ago"
                    variant="expanded"
                    onClick={() => alert('Open thread')}
                  />
                  <GlassMessageActions
                    visible={showActions}
                    position="top"
                    actions={[
                      { icon: ThumbsUp, label: 'Like' },
                      { icon: Copy, label: 'Copy' },
                      { icon: Reply, label: 'Reply' },
                      { icon: Trash2, label: 'Delete', variant: 'danger' },
                    ]}
                  />
                </div>
              </GlassMessageContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Note */}
      <Card className="glass-subtle border-0">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Import & Usage:</p>
            <pre className="p-3 bg-background rounded text-xs overflow-x-auto">
              {`import {
  GlassMessageContainer,
  GlassMessageHeader,
  GlassMessageContent,
  GlassMessageFooter,
  GlassMessageActions,
  GlassThreadIndicator,
  GlassTypingDots,
} from '@/components/glass-molecules'`}
            </pre>
            <p className="mt-4">
              All components are fully typed, composable, and follow the
              glassmorphism design system. See the examples file for detailed usage
              patterns.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

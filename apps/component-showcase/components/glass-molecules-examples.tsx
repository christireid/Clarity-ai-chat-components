/**
 * Glass Message Molecules - Usage Examples
 *
 * This file demonstrates how to use the reusable message component molecules
 * created in glass-molecules.tsx
 */

import React, { useState } from 'react'
import { Bot, User, ThumbsUp, Copy, Reply, Trash2 } from 'lucide-react'
import {
  GlassMessageContainer,
  GlassMessageHeader,
  GlassMessageContent,
  GlassMessageFooter,
  GlassMessageActions,
  GlassThreadIndicator,
  GlassTypingDots,
} from './glass-molecules'

// ============================================================================
// EXAMPLE 1: Simple Message
// ============================================================================
export function SimpleMessageExample() {
  return (
    <GlassMessageContainer variant="assistant">
      <div className="icon-container-sm">
        <Bot className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <GlassMessageHeader
          name="AI Assistant"
          timestamp="10:32 AM"
          status="delivered"
        />
        <GlassMessageContent>
          <p>Hello! How can I help you today?</p>
        </GlassMessageContent>
      </div>
    </GlassMessageContainer>
  )
}

// ============================================================================
// EXAMPLE 2: User Message with Status
// ============================================================================
export function UserMessageExample() {
  return (
    <GlassMessageContainer variant="user">
      <div className="icon-container-sm gradient-accent text-white">
        <User className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <GlassMessageHeader
          name="You"
          timestamp="10:33 AM"
          status="read"
          variant="user"
        />
        <GlassMessageContent className="gradient-accent text-white">
          <p>Can you help me with React hooks?</p>
        </GlassMessageContent>
      </div>
    </GlassMessageContainer>
  )
}

// ============================================================================
// EXAMPLE 3: Message with Reactions
// ============================================================================
export function MessageWithReactionsExample() {
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
    <GlassMessageContainer variant="assistant">
      <div className="icon-container-sm">
        <Bot className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <GlassMessageContent>
          <p>
            React hooks are functions that let you use state and other React
            features in functional components.
          </p>
        </GlassMessageContent>
        <GlassMessageFooter
          reactions={reactions}
          onReactionClick={handleReactionClick}
        />
      </div>
    </GlassMessageContainer>
  )
}

// ============================================================================
// EXAMPLE 4: Message with Hover Actions
// ============================================================================
export function MessageWithActionsExample() {
  const [showActions, setShowActions] = useState(false)

  return (
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
          <GlassMessageContent>
            <p>Hover over this message to see the actions</p>
          </GlassMessageContent>
          <GlassMessageActions
            visible={showActions}
            position="top"
            actions={[
              { icon: ThumbsUp, label: 'Like', onClick: () => console.log('Like') },
              { icon: Copy, label: 'Copy', onClick: () => console.log('Copy') },
              { icon: Reply, label: 'Reply', onClick: () => console.log('Reply') },
              {
                icon: Trash2,
                label: 'Delete',
                onClick: () => console.log('Delete'),
                variant: 'danger',
              },
            ]}
          />
        </div>
      </GlassMessageContainer>
    </div>
  )
}

// ============================================================================
// EXAMPLE 5: Message with Thread
// ============================================================================
export function MessageWithThreadExample() {
  return (
    <GlassMessageContainer variant="assistant">
      <div className="icon-container-sm">
        <Bot className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <GlassMessageContent>
          <p>This message has a thread with 5 replies</p>
        </GlassMessageContent>
        <GlassThreadIndicator
          count={5}
          lastReplyTime="1 hour ago"
          variant="expanded"
          onClick={() => console.log('Open thread')}
        />
      </div>
    </GlassMessageContainer>
  )
}

// ============================================================================
// EXAMPLE 6: Typing Indicator Variants
// ============================================================================
export function TypingIndicatorExamples() {
  return (
    <div className="space-y-4">
      {/* Dots variant */}
      <GlassTypingDots variant="dots" size="md" />

      {/* Pulse variant */}
      <GlassTypingDots variant="pulse" size="md" />

      {/* Wave variant */}
      <GlassTypingDots variant="wave" size="md" />

      {/* With user info */}
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
  )
}

// ============================================================================
// EXAMPLE 7: Code Message
// ============================================================================
export function CodeMessageExample() {
  return (
    <GlassMessageContainer variant="assistant">
      <div className="icon-container-sm">
        <Bot className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <GlassMessageHeader name="AI Assistant" timestamp="10:35 AM" />
        <GlassMessageContent variant="code">
          {`const example = "code block";
console.log(example);`}
        </GlassMessageContent>
      </div>
    </GlassMessageContainer>
  )
}

// ============================================================================
// EXAMPLE 8: Streaming Message
// ============================================================================
export function StreamingMessageExample() {
  return (
    <GlassMessageContainer variant="assistant">
      <div className="icon-container-sm">
        <Bot className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <GlassMessageContent streaming>
          <p>This content is being generated in real-time</p>
        </GlassMessageContent>
      </div>
    </GlassMessageContainer>
  )
}

// ============================================================================
// EXAMPLE 9: Message with Read Receipts
// ============================================================================
export function MessageWithReadReceiptsExample() {
  return (
    <GlassMessageContainer variant="user">
      <div className="icon-container-sm gradient-accent text-white">
        <User className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <GlassMessageContent className="gradient-accent text-white">
          <p>This message has been read by multiple people</p>
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
    </GlassMessageContainer>
  )
}

// ============================================================================
// EXAMPLE 10: Complete Message (All Features)
// ============================================================================
export function CompleteMessageExample() {
  const [showActions, setShowActions] = useState(false)

  return (
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
            avatar={
              <div className="icon-container-sm">
                <Bot className="h-4 w-4" />
              </div>
            }
          />
          <GlassMessageContent variant="rich">
            <p className="text-sm font-medium mb-2">Complete Message Example</p>
            <p className="text-sm text-muted-foreground">
              This message combines all available features: header with avatar,
              rich content, reactions, read receipts, thread indicator, and hover
              actions.
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
            ]}
          />
          <GlassThreadIndicator
            count={5}
            lastReplyTime="1 hour ago"
            variant="expanded"
            onClick={() => console.log('Open thread')}
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
  )
}

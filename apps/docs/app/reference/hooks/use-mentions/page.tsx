import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'


export const metadata: Metadata = {
  title: 'useMentions - Clarity Chat Components',
  description: 'Hook for managing user mentions with extraction, tracking, and notification support.',
}

const optionsProps: Prop[] = [
  {
    name: 'users',
    type: 'MentionableUser[]',
    required: true,
    description: 'Available users to mention',
  },
  {
    name: 'onMention',
    type: '(mention: Mention) => void',
    description: 'Callback when user is mentioned',
  },
  {
    name: 'onMentionRead',
    type: '(mentionId: string) => void',
    description: 'Callback when mention is read',
  },
]

export default function UseMentionsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useMentions</h1>
        <p className="docs-lead">
          Hook for managing user mentions with extraction, tracking, read status, and notification support.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Extract mentions from text',
          'Track mention read status',
          'Get mentions for a user',
          'Handle mention notifications',
          'Filter and search mentions',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Extract and track mentions:
        </p>
        <CodePlayground
          initialCode={`import { useMentions } from '@clarity-chat/react'

function ChatWithMentions() {
  const users = [
    { id: '1', name: 'Alice', username: 'alice' },
    { id: '2', name: 'Bob', username: 'bob' },
  ]

  const {
    extractMentions,
    mentions,
    unreadCount,
    markAsRead,
  } = useMentions({
    users,
    onMention: (mention) => {
      console.log('User mentioned:', mention.userId)
      // Send notification
    },
  })

  const handleSend = (text: string) => {
    const extracted = extractMentions(text)
    console.log('Mentions in message:', extracted)
    // Send message with mentions
  }

  return (
    <div>
      <ChatInput onSend={handleSend} />
      {unreadCount > 0 && (
        <div>You have {unreadCount} unread mentions</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Get User Mentions</h2>
        <p>
          Get all mentions for a specific user:
        </p>
        <CodePlayground
          initialCode={`import { useMentions } from '@clarity-chat/react'

function UserMentions({ userId }: { userId: string }) {
  const { getUserMentions, unreadCount } = useMentions({ users })

  const userMentions = getUserMentions(userId)
  const unreadMentions = userMentions.filter(m => !m.isRead)

  return (
    <div>
      <div>Total mentions: {userMentions.length}</div>
      <div>Unread: {unreadMentions.length}</div>
      {unreadMentions.map(mention => (
        <div key={mention.id}>
          <div>{mention.messageId}</div>
          <button onClick={() => markAsRead(mention.id)}>
            Mark as read
          </button>
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Mention Notifications</h2>
        <p>
          Handle mention notifications:
        </p>
        <CodePlayground
          initialCode={`import { useMentions } from '@clarity-chat/react'

function WithNotifications({ currentUserId }: { currentUserId: string }) {
  const { mentions, unreadCount } = useMentions({
    users,
    onMention: (mention) => {
      if (mention.userId === currentUserId) {
        // Show notification
        showNotification(\`You were mentioned in a message\`)
      }
    },
  })

  return (
    <div>
      {unreadCount > 0 && (
        <NotificationBadge count={unreadCount} />
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Mark as Read</h2>
        <p>
          Mark mentions as read:
        </p>
        <CodePlayground
          initialCode={`import { useMentions } from '@clarity-chat/react'

function MentionList({ userId }: { userId: string }) {
  const { getUserMentions, markAsRead, markAllAsRead } = useMentions({ users })

  const mentions = getUserMentions(userId)

  return (
    <div>
      <button onClick={() => markAllAsRead(userId)}>
        Mark all as read
      </button>
      {mentions.map(mention => (
        <div key={mention.id}>
          <div>{mention.messageId}</div>
          {!mention.isRead && (
            <button onClick={() => markAsRead(mention.id)}>
              Mark as read
            </button>
          )}
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Options</h2>
        <PropsTable props={optionsProps} />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ul>
          <li><code>extractMentions</code>: Function to extract mentions from text</li>
          <li><code>mentions</code>: Array of all mentions</li>
          <li><code>unreadCount</code>: Total number of unread mentions</li>
          <li><code>getUserMentions</code>: Function to get mentions for a user</li>
          <li><code>markAsRead</code>: Function to mark a mention as read</li>
          <li><code>markAllAsRead</code>: Function to mark all mentions as read for a user</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Extract mentions before sending messages</li>
          <li>Show unread count badges for better UX</li>
          <li>Mark mentions as read when user views message</li>
          <li>Use <code>onMention</code> to send notifications</li>
          <li>Filter mentions by read status for better organization</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/mention-system">MentionInput & MentionList</a> - Mention components</li>
          <li><a href="/reference/components/chat-input">ChatInput</a> - Chat input component</li>
        </ul>
      </section>
    </div>
  )
}

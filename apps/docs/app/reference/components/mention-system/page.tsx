import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'MentionInput & MentionList - Clarity Chat Components',
  description:
    'User mention system with autocomplete, fuzzy search, and mention tracking.',
}

const mentionInputProps: Prop[] = [
  {
    name: 'users',
    type: 'MentionableUser[]',
    required: true,
    description: 'Available users to mention',
  },
  {
    name: 'value',
    type: 'string',
    required: true,
    description: 'Current input value',
  },
  {
    name: 'onChange',
    type: '(value: string, mentions: Mention[]) => void',
    required: true,
    description: 'Callback when value changes',
  },
  {
    name: 'onSubmit',
    type: '() => void',
    description: 'Callback when Enter is pressed',
  },
  {
    name: 'placeholder',
    type: 'string',
    description: 'Placeholder text',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disabled state',
  },
  {
    name: 'mentionTrigger',
    type: 'string',
    description: 'Mention trigger character (default: "@")',
  },
  {
    name: 'enableFuzzySearch',
    type: 'boolean',
    description: 'Enable fuzzy search for users',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

const mentionListProps: Prop[] = [
  {
    name: 'mentions',
    type: 'Mention[]',
    required: true,
    description: 'All mentions',
  },
  {
    name: 'messages',
    type: 'Map<string, { content: string; timestamp: number }>',
    required: true,
    description: 'Messages map for context',
  },
  {
    name: 'users',
    type: 'Map<string, MentionableUser>',
    required: true,
    description: 'Users map',
  },
  {
    name: 'currentUserId',
    type: 'string',
    required: true,
    description: 'Current user ID',
  },
  {
    name: 'onMentionClick',
    type: '(mention: Mention) => void',
    description: 'Callback when mention is clicked',
  },
  {
    name: 'onMarkAsRead',
    type: '(mentionId: string) => void',
    description: 'Callback when mark as read',
  },
  {
    name: 'showOnlyUnread',
    type: 'boolean',
    description: 'Show only unread mentions',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function MentionSystemPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>MentionInput & MentionList</h1>
        <p className="docs-lead">
          User mention system with @mention autocomplete, fuzzy search, keyboard
          navigation, and mention tracking.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Implement @mention autocomplete',
          'Use fuzzy search for user discovery',
          'Track and display mentions',
          'Handle mention interactions',
          'Filter mentions by read status',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Add mention support to a chat input:</p>
        <CodePlayground
          initialCode={`import { MentionInput } from '@clarity-chat/react'

function ChatWithMentions() {
  const [value, setValue] = React.useState('')
  const [mentions, setMentions] = React.useState([])

  const users = [
    { id: '1', name: 'Alice', username: 'alice', avatar: '/avatars/alice.jpg' },
    { id: '2', name: 'Bob', username: 'bob', avatar: '/avatars/bob.jpg' },
  ]

  return (
    <MentionInput
      users={users}
      value={value}
      onChange={(newValue, newMentions) => {
        setValue(newValue)
        setMentions(newMentions)
      }}
      onSubmit={() => {
        logger.debug('Message:', value)
        logger.debug('Mentions:', mentions)
        // Send message
      }}
      placeholder="Type @ to mention someone"
    />
  )
}

render(<ChatWithMentions />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Fuzzy Search</h2>
        <p>Enable fuzzy search for better user discovery:</p>
        <CodePlayground
          initialCode={`import { MentionInput } from '@clarity-chat/react'

function FuzzyMentions() {
  return (
    <MentionInput
      users={users}
      value={value}
      onChange={onChange}
      enableFuzzySearch={true}  // Enable fuzzy matching
      placeholder="Type @ to search users"
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Mention Trigger</h2>
        <p>Use a custom trigger character:</p>
        <CodePlayground
          initialCode={`import { MentionInput } from '@clarity-chat/react'

function CustomTrigger() {
  return (
    <MentionInput
      users={users}
      value={value}
      onChange={onChange}
      mentionTrigger="+"  // Use + instead of @
      placeholder="Type + to mention"
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Mention List</h2>
        <p>Display all mentions with context:</p>
        <CodePlayground
          initialCode={`import { MentionList } from '@clarity-chat/react'

function MentionsView({ mentions, messages, users }: { mentions: Mention[], messages: Map<string, any>, users: Map<string, any> }) {
  return (
    <MentionList
      mentions={mentions}
      messages={messages}
      users={users}
      currentUserId="user-1"
      onMentionClick={(mention) => {
        logger.debug('Clicked mention:', mention)
        // Navigate to message
      }}
      onMarkAsRead={(mentionId) => {
        logger.debug('Marked as read:', mentionId)
        // Update mention status
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Unread Mentions Only</h2>
        <p>Filter to show only unread mentions:</p>
        <CodePlayground
          initialCode={`import { MentionList } from '@clarity-chat/react'

function UnreadMentions({ mentions, messages, users }: { mentions: Mention[], messages: Map<string, any>, users: Map<string, any> }) {
  return (
    <MentionList
      mentions={mentions}
      messages={messages}
      users={users}
      currentUserId="user-1"
      showOnlyUnread={true}  // Only show unread mentions
      onMarkAsRead={(mentionId) => {
        markMentionAsRead(mentionId)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Keyboard Navigation</h2>
        <p>The MentionInput supports keyboard navigation:</p>
        <ul>
          <li>
            <strong>@</strong>: Trigger mention suggestions
          </li>
          <li>
            <strong>↑/↓</strong>: Navigate suggestions
          </li>
          <li>
            <strong>Enter</strong>: Select mention
          </li>
          <li>
            <strong>Escape</strong>: Close suggestions
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>MentionInput Props</h2>
        <PropsTable props={mentionInputProps} />
      </section>

      <section className="docs-section">
        <h2>MentionList Props</h2>
        <PropsTable props={mentionListProps} />
      </section>

      <section className="docs-section">
        <h2>Mention Data Structure</h2>
        <ul>
          <li>
            <code>id</code>: Unique mention identifier
          </li>
          <li>
            <code>userId</code>: ID of mentioned user
          </li>
          <li>
            <code>messageId</code>: ID of message containing mention
          </li>
          <li>
            <code>position</code>: Character position in message
          </li>
          <li>
            <code>length</code>: Length of mention text
          </li>
          <li>
            <code>isRead</code>: Whether mention has been read
          </li>
          <li>
            <code>timestamp</code>: When mention was created
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Enable <code>enableFuzzySearch</code> for better user discovery
          </li>
          <li>Limit suggestions to 10 users for performance</li>
          <li>Track mention read status for notifications</li>
          <li>
            Use <code>showOnlyUnread</code> to filter mentions
          </li>
          <li>Handle mention clicks to navigate to messages</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/chat-input">ChatInput</a> - Main chat
            input component
          </li>
          <li>
            <a href="/reference/hooks/use-mentions">useMentions</a> - Mention
            management hook
          </li>
        </ul>
      </section>
    </div>
  )
}

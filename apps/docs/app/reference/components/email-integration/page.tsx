import { logger } from '@clarity-chat/utils/logger';
import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'EmailIntegration - Clarity Chat Components',
  description:
    'Integrate with email providers (Gmail, Outlook) to read, send, and manage emails within chat.',
}

const props: Prop[] = [
  {
    name: 'accounts',
    type: 'EmailAccount[]',
    description: 'Email accounts',
  },
  {
    name: 'initialThreads',
    type: 'EmailThread[]',
    description: 'Initial email threads',
  },
  {
    name: 'showComposer',
    type: 'boolean',
    description: 'Show email composer',
  },
  {
    name: 'showNotifications',
    type: 'boolean',
    description: 'Show email notifications',
  },
  {
    name: 'onAccountConnect',
    type: '(provider: EmailProvider) => Promise<EmailAccount>',
    description: 'Callback when account connected',
  },
  {
    name: 'onThreadSelect',
    type: '(thread: EmailThread) => void',
    description: 'Callback when thread selected',
  },
  {
    name: 'onSendEmail',
    type: '(email: EmailMessage) => Promise<void>',
    description: 'Callback when email sent',
  },
  {
    name: 'fetchThreads',
    type: '(accountId: string, query?: string) => Promise<EmailThread[]>',
    description: 'Fetch threads function',
  },
  {
    name: 'fetchMessages',
    type: '(threadId: string) => Promise<EmailMessage[]>',
    description: 'Fetch messages function',
  },
]

export default function EmailIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>EmailIntegration</h1>
        <p className="docs-lead">
          Integrate with email providers (Gmail, Outlook, Yahoo, IMAP, Exchange)
          to read, send, and manage emails within chat.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Connect email accounts',
          'Read email threads',
          'Send emails',
          'Manage email notifications',
          'Search emails',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Integrate with email providers:</p>
        <CodePlayground
          initialCode={`import { EmailIntegration } from '@clarity-chat/react'

function EmailView() {
  return (
    <EmailIntegration
      onAccountConnect={async (provider) => {
        // Connect email account
        const response = await fetch(\`/api/email/connect/\${provider}\`, {
          method: 'POST',
        })
        return response.json()
      }}
      fetchThreads={async (accountId, query) => {
        const response = await fetch(\`/api/email/threads?accountId=\${accountId}&q=\${query}\`)
        return response.json()
      }}
      onThreadSelect={(thread) => {
        logger.debug('Selected thread:', thread.subject)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Email Composer</h2>
        <p>Send emails from chat:</p>
        <CodePlayground
          initialCode={`import { EmailIntegration } from '@clarity-chat/react'

function WithComposer() {
  return (
    <EmailIntegration
      showComposer={true}
      onSendEmail={async (email) => {
        const response = await fetch('/api/email/send', {
          method: 'POST',
          body: JSON.stringify(email),
        })
        if (!response.ok) {
          throw new Error('Failed to send email')
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Email Notifications</h2>
        <p>Show email notifications:</p>
        <CodePlayground
          initialCode={`import { EmailIntegration } from '@clarity-chat/react'

function WithNotifications() {
  return (
    <EmailIntegration
      showNotifications={true}
      fetchThreads={async (accountId) => {
        const response = await fetch(\`/api/email/threads?accountId=\${accountId}\`)
        return response.json()
      }}
      onThreadSelect={(thread) => {
        if (thread.unread) {
          // Mark as read
          markThreadAsRead(thread.id)
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Email Search</h2>
        <p>Search email threads:</p>
        <CodePlayground
          initialCode={`import { EmailIntegration, useEmailIntegration } from '@clarity-chat/react'

function EmailSearch() {
  const { searchThreads } = useEmailIntegration()

  const handleSearch = async (query: string) => {
    const threads = await searchThreads(query)
    return threads
  }

  return (
    <EmailIntegration
      fetchThreads={handleSearch}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Supported Providers</h2>
        <ul>
          <li>
            <strong>gmail</strong>: Gmail
          </li>
          <li>
            <strong>outlook</strong>: Outlook/Office 365
          </li>
          <li>
            <strong>yahoo</strong>: Yahoo Mail
          </li>
          <li>
            <strong>imap</strong>: IMAP servers
          </li>
          <li>
            <strong>exchange</strong>: Exchange servers
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use OAuth for secure account connection</li>
          <li>Cache email threads for performance</li>
          <li>Show unread counts for better UX</li>
          <li>Handle email sending errors gracefully</li>
          <li>Sync emails periodically for freshness</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/hooks/use-email-integration">
              useEmailIntegration
            </a>{' '}
            - Email integration hook
          </li>
          <li>
            <a href="/reference/components/chat-window">ChatWindow</a> - Main
            chat interface
          </li>
        </ul>
      </section>
    </div>
  )
}

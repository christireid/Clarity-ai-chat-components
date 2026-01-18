import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'useEmailIntegration - Clarity Chat Components',
  description:
    'Hook for integrating with email providers to read, send, and manage emails.',
}

const optionsProps: Prop[] = [
  {
    name: 'apiEndpoint',
    type: 'string',
    description: 'API endpoint for email operations',
  },
  {
    name: 'apiKey',
    type: 'string',
    description: 'API key for authentication',
  },
]

export default function UseEmailIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useEmailIntegration</h1>
        <p className="docs-lead">
          Hook for integrating with email providers (Gmail, Outlook, Yahoo,
          IMAP, Exchange) to read, send, and manage emails.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Connect email accounts',
          'Fetch email threads',
          'Read email messages',
          'Send emails',
          'Search emails',
          'Manage email notifications',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Integrate with email providers:</p>
        <CodePlayground
          initialCode={`import { useEmailIntegration } from '@clarity-chat/react'

function EmailManager() {
  const {
    accounts,
    threads,
    loading,
    connectAccount,
    fetchThreads,
    sendEmail,
  } = useEmailIntegration({
    apiEndpoint: '/api/email',
  })

  React.useEffect(() => {
    fetchThreads('account-123')
  }, [])

  return (
    <div>
      {loading && <div>Loading...</div>}
      {threads.map(thread => (
        <div key={thread.id}>{thread.subject}</div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Connect Email Account</h2>
        <p>Connect email accounts:</p>
        <CodePlayground
          initialCode={`import { useEmailIntegration } from '@clarity-chat/react'

function AccountConnector() {
  const { connectAccount } = useEmailIntegration()

  const handleConnect = async (provider: EmailProvider) => {
    const account = await connectAccount(provider)
    logger.debug('Account connected:', account.email)
  }

  return (
    <div>
      <button onClick={() => handleConnect('gmail')}>Connect Gmail</button>
      <button onClick={() => handleConnect('outlook')}>Connect Outlook</button>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Send Email</h2>
        <p>Send emails from chat:</p>
        <CodePlayground
          initialCode={`import { useEmailIntegration } from '@clarity-chat/react'

function EmailSender() {
  const { sendEmail } = useEmailIntegration()

  const handleSend = async () => {
    await sendEmail({
      to: [{ email: 'recipient@example.com', name: 'Recipient' }],
      subject: 'Hello from Chat',
      body: 'This email was sent from the chat interface.',
    })
    logger.debug('Email sent')
  }

  return <button onClick={handleSend}>Send Email</button>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Search Emails</h2>
        <p>Search email threads:</p>
        <CodePlayground
          initialCode={`import { useEmailIntegration } from '@clarity-chat/react'

function EmailSearch() {
  const { searchThreads } = useEmailIntegration()

  const handleSearch = async (query: string) => {
    const threads = await searchThreads('account-123', query)
    logger.debug('Search results:', threads)
  }

  return (
    <input
      type="search"
      placeholder="Search emails..."
      onChange={(e) => handleSearch(e.target.value)}
    />
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
          <li>
            <code>accounts</code>: Array of email accounts
          </li>
          <li>
            <code>threads</code>: Array of email threads
          </li>
          <li>
            <code>notifications</code>: Array of email notifications
          </li>
          <li>
            <code>loading</code>: Whether operation is in progress
          </li>
          <li>
            <code>connectAccount</code>: Function to connect email account
          </li>
          <li>
            <code>fetchThreads</code>: Function to fetch email threads
          </li>
          <li>
            <code>fetchMessages</code>: Function to fetch messages for thread
          </li>
          <li>
            <code>sendEmail</code>: Function to send email
          </li>
          <li>
            <code>searchThreads</code>: Function to search email threads
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use OAuth for secure account connection</li>
          <li>Cache email threads for performance</li>
          <li>Handle email sending errors gracefully</li>
          <li>Sync emails periodically for freshness</li>
          <li>Show unread counts for better UX</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/email-integration">
              EmailIntegration
            </a>{' '}
            - Email integration component
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

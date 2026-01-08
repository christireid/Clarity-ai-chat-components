import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'useConversationSharing - Clarity Chat Components',
  description:
    'Hook for sharing conversations with configurable visibility, expiration, and analytics tracking.',
}

const optionsProps: Prop[] = [
  {
    name: 'apiEndpoint',
    type: 'string',
    description: 'API endpoint for sharing operations',
  },
  {
    name: 'defaultVisibility',
    type: 'ShareVisibility',
    description: 'Default share visibility',
  },
]

export default function UseConversationSharingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useConversationSharing</h1>
        <p className="docs-lead">
          Hook for sharing conversations with configurable visibility,
          expiration, password protection, and analytics tracking.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Create share links',
          'Configure share settings',
          'Track share analytics',
          'Revoke shares',
          'Generate QR codes',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Share conversations:</p>
        <CodePlayground
          code={`import { useConversationSharing } from '@clarity-chat/react/internal'
import type { Message } from '@clarity-chat/types'

function ShareConversation({ messages, conversationId }: { messages: Message[], conversationId: string }) {
  const {
    createShareLink,
    shareLinks,
    analytics,
    revokeShare,
  } = useConversationSharing()

  const handleShare = async () => {
    const shareLink = await createShareLink({
      conversationId,
      visibility: 'public',
      expiration: '7days',
      allowComments: true,
      allowDownload: true,
    })
    logger.debug('Share link:', shareLink.url)
  }

  return (
    <div>
      <button onClick={handleShare}>Share Conversation</button>
      {shareLinks.map(link => (
        <div key={link.id}>
          <div>{link.url}</div>
          <div>Views: {analytics.get(link.id)?.views || 0}</div>
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Password Protection</h2>
        <p>Create password-protected shares:</p>
        <CodePlayground
          code={`import { useConversationSharing } from '@clarity-chat/react/internal'

function PasswordProtectedShare() {
  const { createShareLink } = useConversationSharing()

  const handleShare = async () => {
    const shareLink = await createShareLink({
      conversationId: 'conv-123',
      visibility: 'password-protected',
      password: 'secure-password',
      expiration: '30days',
    })
    logger.debug('Protected share link:', shareLink.url)
  }

  return <button onClick={handleShare}>Create Protected Share</button>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Share Analytics</h2>
        <p>Track share analytics:</p>
        <CodePlayground
          code={`import { useConversationSharing } from '@clarity-chat/react/internal'

function ShareAnalytics({ shareId }: { shareId: string }) {
  const { getAnalytics } = useConversationSharing()

  const analytics = getAnalytics(shareId)

  return (
    <div>
      <div>Views: {analytics.views}</div>
      <div>Unique visitors: {analytics.uniqueVisitors}</div>
      <div>Avg time on page: {analytics.avgTimeOnPage}s</div>
      <div>Referrers: {Array.from(analytics.referrers.entries()).map(([ref, count]) => (
        <div key={ref}>{ref}: {count}</div>
      ))}</div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Revoke Shares</h2>
        <p>Revoke share links:</p>
        <CodePlayground
          code={`import { useConversationSharing } from '@clarity-chat/react/internal'

function ShareManager() {
  const { shareLinks, revokeShare } = useConversationSharing()

  return (
    <div>
      {shareLinks.map(link => (
        <div key={link.id}>
          <div>{link.url}</div>
          <button onClick={() => revokeShare(link.id)}>Revoke</button>
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
          <li>
            <code>shareLinks</code>: Array of share link configurations
          </li>
          <li>
            <code>analytics</code>: Map of share analytics by share ID
          </li>
          <li>
            <code>createShareLink</code>: Function to create share link
          </li>
          <li>
            <code>revokeShare</code>: Function to revoke share link
          </li>
          <li>
            <code>getAnalytics</code>: Function to get analytics for share
          </li>
          <li>
            <code>generateQRCode</code>: Function to generate QR code for share
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Share Visibility</h2>
        <ul>
          <li>
            <strong>public</strong>: Anyone with link can view
          </li>
          <li>
            <strong>private</strong>: Only specific users can view
          </li>
          <li>
            <strong>password-protected</strong>: Requires password to view
          </li>
          <li>
            <strong>team-only</strong>: Only team members can view
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use appropriate visibility levels for security</li>
          <li>Set expiration dates for temporary shares</li>
          <li>Enable analytics to track share performance</li>
          <li>Use password protection for sensitive conversations</li>
          <li>Revoke shares when no longer needed</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/conversation-sharing">
              ConversationSharing
            </a>{' '}
            - Conversation sharing component
          </li>
          <li>
            <a href="/reference/components/user-interaction-analytics">
              UserInteractionAnalytics
            </a>{' '}
            - Analytics component
          </li>
        </ul>
      </section>
    </div>
  )
}

import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ApiTokenManager - Clarity Chat Components',
  description: 'Manage API access tokens with creation, regeneration, revocation, and scope management.',
}

const props: Prop[] = [
  {
    name: 'tokens',
    type: 'ApiTokenRecord[]',
    required: true,
    description: 'API token records',
  },
  {
    name: 'onCreate',
    type: '() => void',
    description: 'Callback when create token clicked',
  },
  {
    name: 'onRegenerate',
    type: '(token: ApiTokenRecord) => void',
    description: 'Callback when token regenerated',
  },
  {
    name: 'onRevoke',
    type: '(token: ApiTokenRecord) => void',
    description: 'Callback when token revoked',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function ApiTokenManagerPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>ApiTokenManager</h1>
        <p className="docs-lead">
          Manage API access tokens with creation, regeneration, revocation, scope management, and usage tracking.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Create API tokens',
          'Manage token scopes',
          'Regenerate tokens',
          'Revoke tokens',
          'Track token usage',
        ]}
      />

      <Callout type="warning">
        <p>
          <strong>Security:</strong> API tokens provide access to your account. Store them securely and rotate regularly.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Manage API tokens:
        </p>
        <CodePlayground
          initialCode={`import { ApiTokenManager } from '@clarity-chat/react'

function TokenManagement() {
  const [tokens, setTokens] = React.useState([])

  return (
    <ApiTokenManager
      tokens={tokens}
      onCreate={async () => {
        const newToken = await fetch('/api/tokens', {
          method: 'POST',
          body: JSON.stringify({
            label: 'Production API',
            scopes: ['read', 'write'],
          }),
        }).then(r => r.json())
        
        setTokens([...tokens, newToken])
        // Show token value (only shown once)
        showTokenValue(newToken.value)
      }}
      onRegenerate={async (token) => {
        const updated = await fetch(\`/api/tokens/\${token.id}/regenerate\`, {
          method: 'POST',
        }).then(r => r.json())
        
        setTokens(tokens.map(t => t.id === token.id ? updated : t))
      }}
      onRevoke={async (token) => {
        await fetch(\`/api/tokens/\${token.id}\`, {
          method: 'DELETE',
        })
        setTokens(tokens.filter(t => t.id !== token.id))
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Token Scopes</h2>
        <p>
          Manage token scopes:
        </p>
        <CodePlayground
          initialCode={`import { ApiTokenManager } from '@clarity-chat/react'

function WithScopes() {
  const tokens = [
    {
      id: 'token-1',
      label: 'Read-only API',
      scopes: ['read'],
      status: 'active' as const,
      createdAt: '2025-01-01',
    },
    {
      id: 'token-2',
      label: 'Full Access',
      scopes: ['read', 'write', 'admin'],
      status: 'active' as const,
      createdAt: '2025-01-02',
    },
  ]

  return (
    <ApiTokenManager
      tokens={tokens}
      onCreate={() => {
        // Create token with specific scopes
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Token Status</h2>
        <p>
          Track token status:
        </p>
        <CodePlayground
          initialCode={`import { ApiTokenManager } from '@clarity-chat/react'

function StatusTracking() {
  const tokens = [
    {
      id: 'active',
      label: 'Active Token',
      status: 'active' as const,
      lastUsed: '2025-01-15',
    },
    {
      id: 'expired',
      label: 'Expired Token',
      status: 'expired' as const,
      lastUsed: '2024-12-01',
    },
    {
      id: 'revoked',
      label: 'Revoked Token',
      status: 'revoked' as const,
    },
  ]

  return (
    <ApiTokenManager
      tokens={tokens}
      onRegenerate={(token) => {
        // Only active tokens can be regenerated
        if (token.status === 'active') {
          regenerateToken(token)
        }
      }}
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
        <h2>Token Status Types</h2>
        <ul>
          <li><strong>active</strong>: Token is active and can be used</li>
          <li><strong>expired</strong>: Token has expired</li>
          <li><strong>revoked</strong>: Token has been revoked</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use descriptive labels for tokens</li>
          <li>Grant minimum necessary scopes</li>
          <li>Rotate tokens regularly</li>
          <li>Revoke unused tokens</li>
          <li>Track last used date</li>
          <li>Store tokens securely</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <li><a href="/cookbook/multi-tenant-chat">Multi-Tenant Chat Recipe</a> - Multi-tenant setup</li>
        <li><a href="/reference/components/auth-tenant-dashboard">AuthTenantDashboard</a> - Tenant authentication</li>
      </section>
    </div>
  )
}

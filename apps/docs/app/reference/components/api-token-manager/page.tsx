'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ApiTokenManager | Clarity Chat',
  description: 'Enterprise component for managing API tokens with creation, rotation, and revocation.',
}

const apiTokenManagerProps: Prop[] = [
  {
    name: 'tokens',
    type: 'ApiTokenRecord[]',
    required: true,
    description: 'Array of API token records to display.',
  },
  {
    name: 'onCreate',
    type: '() => void',
    description: 'Callback when "Generate new token" is clicked.',
  },
  {
    name: 'onRegenerate',
    type: '(token: ApiTokenRecord) => void',
    description: 'Callback when a token is regenerated.',
  },
  {
    name: 'onRevoke',
    type: '(token: ApiTokenRecord) => void',
    description: 'Callback when a token is revoked.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Custom className.',
  },
]

const apiTokenRecordType: Prop[] = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: 'Unique token identifier.',
  },
  {
    name: 'label',
    type: 'string',
    required: true,
    description: 'Human-readable label for the token.',
  },
  {
    name: 'createdAt',
    type: 'string',
    required: true,
    description: 'Creation date (formatted string).',
  },
  {
    name: 'lastUsed',
    type: 'string',
    description: 'Last usage date (formatted string, optional).',
  },
  {
    name: 'scopes',
    type: 'string[]',
    required: true,
    description: 'Array of permission scopes (e.g., ["read", "write"]).',
  },
  {
    name: 'status',
    type: "'active' | 'expired' | 'revoked'",
    required: true,
    description: 'Token status.',
  },
]

export default function ApiTokenManagerPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>ApiTokenManager</h1>

      <p className="lead">
        Enterprise component for managing API access tokens with creation, rotation, revocation,
        and audit trails. Perfect for applications that need secure API key management.
      </p>

      <Callout type="warning" title="Security Best Practices">
        <p>
          Always implement proper authentication and authorization when managing API tokens.
          Tokens should be stored securely and never exposed in client-side code or logs.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the component:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ApiTokenManager } from '@clarity-chat/react'

function TokenManagement() {
  const tokens = [
    {
      id: 'token-1',
      label: 'Production API Key',
      createdAt: '2024-01-15',
      lastUsed: '2024-03-20',
      scopes: ['read', 'write'],
      status: 'active' as const,
    },
    {
      id: 'token-2',
      label: 'Development Key',
      createdAt: '2024-02-01',
      scopes: ['read'],
      status: 'active' as const,
    },
  ]

  return (
    <ApiTokenManager
      tokens={tokens}
      onCreate={() => console.log('Create new token')}
      onRegenerate={(token) => console.log('Regenerate:', token.id)}
      onRevoke={(token) => console.log('Revoke:', token.id)}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with ApiTokenManager:
        </p>
        <CodePlayground
          initialCode={`import { ApiTokenManager } from '@clarity-chat/react'

function Example() {
  const tokens = [
    {
      id: '1',
      label: 'My API Key',
      createdAt: '2024-01-01',
      scopes: ['read'],
      status: 'active',
    },
  ]

  return (
    <ApiTokenManager
      tokens={tokens}
      onCreate={() => alert('Create token')}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Backend Integration</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ApiTokenManager } from '@clarity-chat/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function TokenManagerWithBackend() {
  const queryClient = useQueryClient()

  const { data: tokens } = useQuery({
    queryKey: ['api-tokens'],
    queryFn: async () => {
      const res = await fetch('/api/tokens')
      return res.json()
    },
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/tokens', { method: 'POST' })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-tokens'] })
    },
  })

  const revokeMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      const res = await fetch(\`/api/tokens/\${tokenId}\`, { method: 'DELETE' })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-tokens'] })
    },
  })

  return (
    <ApiTokenManager
      tokens={tokens || []}
      onCreate={() => createMutation.mutate()}
      onRevoke={(token) => {
        if (confirm(\`Revoke token "\${token.label}"?\`)) {
          revokeMutation.mutate(token.id)
        }
      }}
      onRegenerate={(token) => {
        // Regenerate token
        fetch(\`/api/tokens/\${token.id}/regenerate\`, { method: 'POST' })
          .then(() => queryClient.invalidateQueries({ queryKey: ['api-tokens'] }))
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Token Creation Dialog</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ApiTokenManager } from '@clarity-chat/react'
import { useState } from 'react'

function TokenManagerWithDialog() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleCreate = () => {
    setShowCreateDialog(true)
  }

  const handleTokenCreated = (newToken: ApiTokenRecord) => {
    // Add token to list
    setTokens(prev => [...prev, newToken])
    setShowCreateDialog(false)
  }

  return (
    <>
      <ApiTokenManager
        tokens={tokens}
        onCreate={handleCreate}
        onRevoke={handleRevoke}
      />
      {showCreateDialog && (
        <CreateTokenDialog
          onClose={() => setShowCreateDialog(false)}
          onCreated={handleTokenCreated}
        />
      )}
    </>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Confirmation Dialogs</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ApiTokenManager } from '@clarity-chat/react'

function TokenManagerWithConfirmations() {
  const handleRevoke = (token: ApiTokenRecord) => {
    if (confirm(\`Are you sure you want to revoke "\${token.label}"? This action cannot be undone.\`)) {
      // Revoke token
      fetch(\`/api/tokens/\${token.id}\`, { method: 'DELETE' })
        .then(() => {
          // Refresh token list
        })
    }
  }

  const handleRegenerate = (token: ApiTokenRecord) => {
    if (confirm(\`Regenerate "\${token.label}"? The old token will be invalidated.\`)) {
      // Regenerate token
      fetch(\`/api/tokens/\${token.id}/regenerate\`, { method: 'POST' })
        .then(() => {
          // Show new token in modal
        })
    }
  }

  return (
    <ApiTokenManager
      tokens={tokens}
      onCreate={handleCreate}
      onRegenerate={handleRegenerate}
      onRevoke={handleRevoke}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Props</h2>
        <PropsTable props={apiTokenManagerProps} title="Component Props" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Token Record Type</h2>
        <PropsTable props={apiTokenRecordType} title="ApiTokenRecord" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Token List</strong> - Display all tokens with status, scopes, and usage</li>
          <li><strong>Create Tokens</strong> - Generate new API tokens</li>
          <li><strong>Regenerate</strong> - Rotate existing tokens</li>
          <li><strong>Revoke</strong> - Invalidate tokens</li>
          <li><strong>Status Tracking</strong> - Active, expired, and revoked states</li>
          <li><strong>Scope Display</strong> - Visual badges for permission scopes</li>
          <li><strong>Last Used Tracking</strong> - Show when tokens were last used</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Security Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Never expose tokens</strong> - Only show tokens once during creation</li>
          <li><strong>Implement rotation</strong> - Encourage regular token rotation</li>
          <li><strong>Use scopes</strong> - Limit token permissions with scopes</li>
          <li><strong>Track usage</strong> - Monitor token usage for security</li>
          <li><strong>Revoke unused tokens</strong> - Remove tokens that are no longer needed</li>
          <li><strong>Require confirmation</strong> - Always confirm destructive actions</li>
          <li><strong>Audit logging</strong> - Log all token operations</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/auth-tenant-dashboard" className="docs-card">
            <h3>AuthTenantDashboard Component</h3>
            <p>Tenant management</p>
          </a>
          <a href="/reference/components/seat-invite-dialog" className="docs-card">
            <h3>SeatInviteDialog Component</h3>
            <p>Team member invites</p>
          </a>
          <a href="/guides/rbac" className="docs-card">
            <h3>RBAC Guide</h3>
            <p>Role-based access control</p>
          </a>
          <a href="/guides/audit-logging" className="docs-card">
            <h3>Audit Logging Guide</h3>
            <p>Security audit trails</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'AuthTenantDashboard', href: '/reference/components/auth-tenant-dashboard' }}
        next={{ title: 'SeatInviteDialog', href: '/reference/components/seat-invite-dialog' }}
      />
    </>
  )
}

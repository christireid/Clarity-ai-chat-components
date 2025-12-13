import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'


export const metadata: Metadata = {
  title: 'Multi-Tenancy Setup Guide - Clarity Chat Components',
  description: 'Learn how to set up multi-tenancy with tenant isolation, seat management, and SSO configuration.',
}

export default function MultiTenancySetupPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Multi-Tenancy Setup</h1>
        <p className="docs-lead">
          Learn how to set up multi-tenancy with tenant isolation, seat management, SSO configuration, and API token management.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Set up tenant isolation',
          'Configure seat management',
          'Set up SSO',
          'Manage API tokens',
          'Handle tenant context',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Multi-tenancy allows you to serve multiple organizations (tenants) from a single application instance, with complete data isolation and separate configurations.
        </p>
      </section>

      <section className="docs-section">
        <h2>Tenant Context Setup</h2>
        <p>
          Set up tenant context:
        </p>
        <CodePlayground
          initialCode={`import { TenantProvider } from '@clarity-chat/react'

function App({ tenantId }: { tenantId: string }) {
  return (
    <TenantProvider tenantId={tenantId}>
      <ChatApp />
    </TenantProvider>
  )
}

// Access tenant context
import { useTenantContext } from '@clarity-chat/react'

function ChatApp() {
  const { tenantId, tenantConfig } = useTenantContext()

  return (
    <ClarityChat
      api={\`/api/tenants/\${tenantId}/chat\`}
      config={tenantConfig}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Seat Management</h2>
        <p>
          Manage seats for tenants:
        </p>
        <CodePlayground
          initialCode={`import { SeatInviteDialog, AuthTenantDashboard } from '@clarity-chat/react'

function TenantManagement({ tenantId }: { tenantId: string }) {
  const [seats, setSeats] = useState([])

  return (
    <div>
      <AuthTenantDashboard
        tenantId={tenantId}
        seatUsage={{
          used: seats.length,
          total: 10,
        }}
      />
      <SeatInviteDialog
        onInvite={async (invite) => {
          const response = await fetch(\`/api/tenants/\${tenantId}/seats\`, {
            method: 'POST',
            body: JSON.stringify(invite),
          })
          const newSeat = await response.json()
          setSeats([...seats, newSeat])
        }}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>SSO Configuration</h2>
        <p>
          Configure SSO for tenants:
        </p>
        <CodePlayground
          initialCode={`import { SSOConfigWizard, AuthTenantDashboard } from '@clarity-chat/react'

function SSOSetup({ tenantId }: { tenantId: string }) {
  return (
    <div>
      <AuthTenantDashboard tenantId={tenantId} />
      <SSOConfigWizard
        tenantId={tenantId}
        provider="saml"
        onComplete={async (config) => {
          await fetch(\`/api/tenants/\${tenantId}/sso\`, {
            method: 'POST',
            body: JSON.stringify(config),
          })
        }}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>API Token Management</h2>
        <p>
          Manage API tokens per tenant:
        </p>
        <CodePlayground
          initialCode={`import { ApiTokenManager } from '@clarity-chat/react'

function TokenManagement({ tenantId }: { tenantId: string }) {
  const [tokens, setTokens] = useState([])

  return (
    <ApiTokenManager
      tokens={tokens}
      onCreate={async () => {
        const response = await fetch(\`/api/tenants/\${tenantId}/tokens\`, {
          method: 'POST',
        })
        const newToken = await response.json()
        setTokens([...tokens, newToken])
      }}
      onRevoke={async (token) => {
        await fetch(\`/api/tenants/\${tenantId}/tokens/\${token.id}\`, {
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
        <h2>Complete Multi-Tenant Setup</h2>
        <p>
          Complete multi-tenant setup:
        </p>
        <CodePlayground
          initialCode={`import {
  TenantProvider,
  AuthTenantDashboard,
  SeatInviteDialog,
  SSOConfigWizard,
  ApiTokenManager,
} from '@clarity-chat/react'

function MultiTenantApp({ tenantId }: { tenantId: string }) {
  return (
    <TenantProvider tenantId={tenantId}>
      <div>
        <AuthTenantDashboard tenantId={tenantId} />
        <SeatInviteDialog tenantId={tenantId} />
        <SSOConfigWizard tenantId={tenantId} />
        <ApiTokenManager tenantId={tenantId} />
        <ClarityChat api={\`/api/tenants/\${tenantId}/chat\`} />
      </div>
    </TenantProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Isolate tenant data completely</li>
          <li>Use tenant context for all operations</li>
          <li>Manage seats and permissions</li>
          <li>Configure SSO for enterprise tenants</li>
          <li>Monitor tenant usage and limits</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/cookbook/multi-tenant-chat">Multi-Tenant Chat Recipe</a> - Complete recipe</li>
          <li><a href="/reference/components/auth-tenant-dashboard">AuthTenantDashboard</a> - Tenant dashboard</li>
          <li><a href="/reference/components/sso-config-wizard">SSOConfigWizard</a> - SSO configuration</li>
        </ul>
      </section>
    </div>
  )
}

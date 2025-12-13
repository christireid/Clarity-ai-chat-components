import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'


export const metadata: Metadata = {
  title: 'Multi-Tenant Chat Recipe - Clarity Chat Components',
  description: 'Build a multi-tenant chat application with tenant isolation, seat management, and SSO integration.',
}

export default function MultiTenantChatRecipePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Recipe</span>
        <h1>Multi-Tenant Chat</h1>
        <p className="docs-lead">
          Build a multi-tenant chat application with tenant isolation, seat management, SSO integration, and enterprise features.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Set up tenant isolation',
          'Implement seat management',
          'Configure SSO integration',
          'Handle tenant-specific configurations',
          'Manage API tokens per tenant',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          This recipe shows how to build a multi-tenant chat application where each organization (tenant) has isolated data,
          user management, and configurations.
        </p>
      </section>

      <section className="docs-section">
        <h2>Tenant Context Setup</h2>
        <p>
          Set up tenant context for isolation:
        </p>
        <CodePlayground
          initialCode={`import { createContext, useContext } from 'react'

interface TenantContext {
  tenantId: string
  tenantName: string
  seatCount: number
  maxSeats: number
  features: string[]
}

const TenantContext = createContext<TenantContext | null>(null)

export function TenantProvider({ children, tenantId }: { children: React.ReactNode, tenantId: string }) {
  const [tenant, setTenant] = React.useState<TenantContext | null>(null)

  React.useEffect(() => {
    // Fetch tenant data
    fetch(\`/api/tenants/\${tenantId}\`)
      .then(res => res.json())
      .then(setTenant)
  }, [tenantId])

  return (
    <TenantContext.Provider value={tenant}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) throw new Error('useTenant must be used within TenantProvider')
  return context
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Tenant-Isolated Chat</h2>
        <p>
          Create tenant-isolated chat instances:
        </p>
        <CodePlayground
          initialCode={`import { ClarityChat } from '@clarity-chat/react'
import { useTenant } from './tenant-context'

function TenantChat() {
  const tenant = useTenant()

  return (
    <ClarityChat
      api={\`/api/chat?tenantId=\${tenant.tenantId}\`}
      headers={{
        'X-Tenant-ID': tenant.tenantId,
      }}
      config={{
        // Tenant-specific configuration
        features: tenant.features,
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Seat Management</h2>
        <p>
          Manage seats for each tenant:
        </p>
        <CodePlayground
          initialCode={`import { SeatInviteDialog } from '@clarity-chat/react'
import { useTenant } from './tenant-context'

function SeatManagement() {
  const tenant = useTenant()

  return (
    <div>
      <div>Seats: {tenant.seatCount} / {tenant.maxSeats}</div>
      {tenant.seatCount < tenant.maxSeats && (
        <SeatInviteDialog
          tenantId={tenant.tenantId}
          onInvite={(email) => {
            // Send invitation
            fetch(\`/api/tenants/\${tenant.tenantId}/invites\`, {
              method: 'POST',
              body: JSON.stringify({ email }),
            })
          }}
        />
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>SSO Integration</h2>
        <p>
          Integrate SSO for tenant authentication:
        </p>
        <CodePlayground
          initialCode={`import { SSOConfigWizard } from '@clarity-chat/react'
import { useTenant } from './tenant-context'

function SSOIntegration() {
  const tenant = useTenant()

  return (
    <SSOConfigWizard
      tenantId={tenant.tenantId}
      onConfigure={(config) => {
        // Save SSO configuration
        fetch(\`/api/tenants/\${tenant.tenantId}/sso\`, {
          method: 'POST',
          body: JSON.stringify(config),
        })
      }}
    />
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
import { useTenant } from './tenant-context'

function TokenManagement() {
  const tenant = useTenant()

  return (
    <ApiTokenManager
      tenantId={tenant.tenantId}
      onTokenCreate={(token) => {
        console.log('Token created:', token.id)
      }}
      onTokenRevoke={(tokenId) => {
        fetch(\`/api/tenants/\${tenant.tenantId}/tokens/\${tokenId}\`, {
          method: 'DELETE',
        })
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Complete Example</h2>
        <p>
          Complete multi-tenant chat application:
        </p>
        <CodePlayground
          initialCode={`import { TenantProvider, useTenant } from './tenant-context'
import { ClarityChat, SeatInviteDialog, ApiTokenManager } from '@clarity-chat/react'

function MultiTenantApp({ tenantId }: { tenantId: string }) {
  return (
    <TenantProvider tenantId={tenantId}>
      <TenantDashboard />
    </TenantProvider>
  )
}

function TenantDashboard() {
  const tenant = useTenant()

  return (
    <div>
      <div>Tenant: {tenant.tenantName}</div>
      <div>Seats: {tenant.seatCount} / {tenant.maxSeats}</div>
      
      <ClarityChat
        api={\`/api/chat?tenantId=\${tenant.tenantId}\`}
        headers={{
          'X-Tenant-ID': tenant.tenantId,
        }}
      />
      
      <SeatInviteDialog tenantId={tenant.tenantId} />
      <ApiTokenManager tenantId={tenant.tenantId} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Always include tenant ID in API requests</li>
          <li>Isolate data at the database level</li>
          <li>Enforce seat limits server-side</li>
          <li>Use SSO for enterprise tenants</li>
          <li>Manage API tokens securely</li>
          <li>Audit tenant actions</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/seat-invite-dialog">SeatInviteDialog</a> - Seat invitation component</li>
          <li><a href="/reference/components/api-token-manager">ApiTokenManager</a> - API token management</li>
          <li><a href="/reference/components/sso-config-wizard">SSOConfigWizard</a> - SSO configuration</li>
        </ul>
      </section>
    </div>
  )
}

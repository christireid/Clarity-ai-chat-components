import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'AuthTenantDashboard - Clarity Chat Components',
  description:
    'Enterprise tenant authentication dashboard for managing tenants, users, SSO, and authentication settings.',
}

const props: Prop[] = [
  {
    name: 'tenantId',
    type: 'string',
    required: true,
    description: 'Current tenant ID',
  },
  {
    name: 'onTenantUpdate',
    type: '(updates: TenantUpdates) => void',
    description: 'Callback when tenant updated',
  },
  {
    name: 'onSSOConfigure',
    type: '(config: SSOConfig) => void',
    description: 'Callback when SSO configured',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function AuthTenantDashboardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>AuthTenantDashboard</h1>
        <p className="docs-lead">
          Enterprise tenant authentication dashboard for managing tenants,
          users, SSO configuration, and authentication settings.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Manage tenant authentication',
          'Configure SSO',
          'Manage tenant users',
          'View authentication logs',
          'Configure security settings',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Display tenant authentication dashboard:</p>
        <CodePlayground
          initialCode={`import { AuthTenantDashboard } from '@clarity-chat/react/internal'

function TenantAuth({ tenantId }: { tenantId: string }) {
  return (
    <AuthTenantDashboard
      tenantId={tenantId}
      onTenantUpdate={(updates) => {
        logger.debug('Tenant updated:', updates)
        // Update tenant settings
      }}
      onSSOConfigure={(config) => {
        logger.debug('SSO configured:', config)
        // Save SSO configuration
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>SSO Configuration</h2>
        <p>Configure SSO for tenant:</p>
        <CodePlayground
          initialCode={`import { AuthTenantDashboard } from '@clarity-chat/react/internal'

function WithSSO({ tenantId }: { tenantId: string }) {
  return (
    <AuthTenantDashboard
      tenantId={tenantId}
      onSSOConfigure={async (config) => {
        const response = await fetch(\`/api/tenants/\${tenantId}/sso\`, {
          method: 'POST',
          body: JSON.stringify(config),
        })
        
        if (response.ok) {
          logger.debug('SSO configured successfully')
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>User Management</h2>
        <p>Manage tenant users:</p>
        <CodePlayground
          initialCode={`import { AuthTenantDashboard } from '@clarity-chat/react/internal'

function UserManagement({ tenantId }: { tenantId: string }) {
  return (
    <AuthTenantDashboard
      tenantId={tenantId}
      onUserAdd={(user) => {
        logger.debug('Adding user:', user.email)
      }}
      onUserRemove={(userId) => {
        logger.debug('Removing user:', userId)
      }}
      onUserUpdate={(userId, updates) => {
        logger.debug('Updating user:', userId, updates)
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
        <h2>Best Practices</h2>
        <ul>
          <li>Configure SSO for enterprise tenants</li>
          <li>Manage user roles and permissions</li>
          <li>Monitor authentication logs</li>
          <li>Set up security policies</li>
          <li>Track tenant usage</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/sso-config-wizard">
              SSOConfigWizard
            </a>{' '}
            - SSO configuration wizard
          </li>
          <li>
            <a href="/reference/components/seat-invite-dialog">
              SeatInviteDialog
            </a>{' '}
            - Seat invitation
          </li>
          <li>
            <a href="/cookbook/multi-tenant-chat">Multi-Tenant Chat Recipe</a> -
            Multi-tenant setup
          </li>
        </ul>
      </section>
    </div>
  )
}

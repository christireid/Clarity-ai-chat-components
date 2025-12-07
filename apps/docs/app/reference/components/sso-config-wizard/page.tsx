import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SSOConfigWizard - Clarity Chat Components',
  description: 'Step-by-step wizard for configuring SSO (Single Sign-On) for enterprise tenants.',
}

const props: Prop[] = [
  {
    name: 'tenantId',
    type: 'string',
    required: true,
    description: 'Tenant ID to configure SSO for',
  },
  {
    name: 'provider',
    type: '"saml" | "oidc" | "oauth"',
    description: 'SSO provider type',
  },
  {
    name: 'onComplete',
    type: '(config: SSOConfig) => void',
    description: 'Callback when configuration is complete',
  },
  {
    name: 'onCancel',
    type: '() => void',
    description: 'Callback when wizard is cancelled',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function SSOConfigWizardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>SSOConfigWizard</h1>
        <p className="docs-lead">
          Step-by-step wizard for configuring SSO (Single Sign-On) for enterprise tenants with SAML, OIDC, and OAuth support.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Configure SSO step-by-step',
          'Set up SAML authentication',
          'Configure OIDC providers',
          'Set up OAuth integration',
          'Test SSO configuration',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Configure SSO for a tenant:
        </p>
        <CodePlayground
          initialCode={`import { SSOConfigWizard } from '@clarity-chat/react'

function SSOSetup({ tenantId }: { tenantId: string }) {
  return (
    <SSOConfigWizard
      tenantId={tenantId}
      onComplete={async (config) => {
        const response = await fetch(\`/api/tenants/\${tenantId}/sso\`, {
          method: 'POST',
          body: JSON.stringify(config),
        })
        
        if (response.ok) {
          console.log('SSO configured successfully')
        }
      }}
      onCancel={() => {
        console.log('SSO configuration cancelled')
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>SAML Configuration</h2>
        <p>
          Configure SAML SSO:
        </p>
        <CodePlayground
          initialCode={`import { SSOConfigWizard } from '@clarity-chat/react'

function SAMLSetup({ tenantId }: { tenantId: string }) {
  return (
    <SSOConfigWizard
      tenantId={tenantId}
      provider="saml"
      onComplete={(config) => {
        // Config includes:
        // - entityId
        // - ssoUrl
        // - certificate
        // - attribute mappings
        saveSAMLConfig(config)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>OIDC Configuration</h2>
        <p>
          Configure OIDC SSO:
        </p>
        <CodePlayground
          initialCode={`import { SSOConfigWizard } from '@clarity-chat/react'

function OIDCSetup({ tenantId }: { tenantId: string }) {
  return (
    <SSOConfigWizard
      tenantId={tenantId}
      provider="oidc"
      onComplete={(config) => {
        // Config includes:
        // - issuer
        // - clientId
        // - clientSecret
        // - scopes
        saveOIDCConfig(config)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>OAuth Configuration</h2>
        <p>
          Configure OAuth SSO:
        </p>
        <CodePlayground
          initialCode={`import { SSOConfigWizard } from '@clarity-chat/react'

function OAuthSetup({ tenantId }: { tenantId: string }) {
  return (
    <SSOConfigWizard
      tenantId={tenantId}
      provider="oauth"
      onComplete={(config) => {
        // Config includes:
        // - authorizationUrl
        // - tokenUrl
        // - clientId
        // - clientSecret
        saveOAuthConfig(config)
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
        <h2>SSO Providers</h2>
        <ul>
          <li><strong>SAML</strong>: Security Assertion Markup Language (enterprise standard)</li>
          <li><strong>OIDC</strong>: OpenID Connect (modern standard)</li>
          <li><strong>OAuth</strong>: OAuth 2.0 (authorization framework)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use SAML for enterprise integrations</li>
          <li>Use OIDC for modern applications</li>
          <li>Test SSO configuration before enabling</li>
          <li>Store credentials securely</li>
          <li>Configure attribute mappings correctly</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/auth-tenant-dashboard">AuthTenantDashboard</a> - Tenant authentication dashboard</li>
          <li><a href="/cookbook/multi-tenant-chat">Multi-Tenant Chat Recipe</a> - Multi-tenant setup</li>
        </ul>
      </section>
    </div>
  )
}

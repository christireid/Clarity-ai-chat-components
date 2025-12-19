import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'SSO Configuration Guide - Clarity Chat Components',
  description:
    'Learn how to configure SSO (Single Sign-On) for enterprise tenants with SAML, OIDC, and OAuth providers.',
}

export default function SSOConfigurationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>SSO Configuration</h1>
        <p className="docs-lead">
          Learn how to configure SSO (Single Sign-On) for enterprise tenants
          with SAML, OIDC, and OAuth providers.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Configure SAML SSO',
          'Set up OIDC providers',
          'Configure OAuth',
          'Test SSO configuration',
          'Troubleshoot SSO issues',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          SSO allows users to authenticate once and access multiple applications
          without re-entering credentials.
        </p>
      </section>

      <section className="docs-section">
        <h2>SAML Configuration</h2>
        <p>Configure SAML SSO:</p>
        <CodePlayground
          initialCode={`import { SSOConfigWizard } from '@clarity-chat/react/internal'

function SAMLConfiguration({ tenantId }: { tenantId: string }) {
  return (
    <SSOConfigWizard
      tenantId={tenantId}
      provider="saml"
      steps={[
        {
          id: '1',
          title: 'Configure Identity Provider',
          description: 'Set up your SAML identity provider',
          status: 'complete',
        },
        {
          id: '2',
          title: 'Download Metadata',
          description: 'Download service provider metadata',
          status: 'in-progress',
        },
        {
          id: '3',
          title: 'Test Configuration',
          description: 'Test SSO login',
          status: 'pending',
        },
      ]}
      metadata={{
        acsUrl: \`https://your-app.com/api/sso/saml/acs\`,
        entityId: \`https://your-app.com/api/sso/saml\`,
      }}
      onComplete={async (config) => {
        await fetch(\`/api/tenants/\${tenantId}/sso\`, {
          method: 'POST',
          body: JSON.stringify({
            provider: 'saml',
            ...config,
          }),
        })
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>OIDC Configuration</h2>
        <p>Configure OIDC SSO:</p>
        <CodePlayground
          initialCode={`import { SSOConfigWizard } from '@clarity-chat/react/internal'

function OIDCConfiguration({ tenantId }: { tenantId: string }) {
  return (
    <SSOConfigWizard
      tenantId={tenantId}
      provider="oidc"
      onComplete={async (config) => {
        await fetch(\`/api/tenants/\${tenantId}/sso\`, {
          method: 'POST',
          body: JSON.stringify({
            provider: 'oidc',
            issuer: 'https://your-idp.com',
            clientId: 'your-client-id',
            clientSecret: 'your-client-secret',
            scopes: ['openid', 'profile', 'email'],
            ...config,
          }),
        })
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>OAuth Configuration</h2>
        <p>Configure OAuth SSO:</p>
        <CodePlayground
          initialCode={`import { SSOConfigWizard } from '@clarity-chat/react/internal'

function OAuthConfiguration({ tenantId }: { tenantId: string }) {
  return (
    <SSOConfigWizard
      tenantId={tenantId}
      provider="oauth"
      onComplete={async (config) => {
        await fetch(\`/api/tenants/\${tenantId}/sso\`, {
          method: 'POST',
          body: JSON.stringify({
            provider: 'oauth',
            authorizationUrl: 'https://oauth-provider.com/authorize',
            tokenUrl: 'https://oauth-provider.com/token',
            clientId: 'your-client-id',
            clientSecret: 'your-client-secret',
            ...config,
          }),
        })
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Testing SSO</h2>
        <p>Test SSO configuration:</p>
        <CodePlayground
          initialCode={`async function testSSO(tenantId: string) {
  // Test SSO login
  const response = await fetch(\`/api/tenants/\${tenantId}/sso/test\`, {
    method: 'POST',
  })

  if (response.ok) {
    logger.debug('SSO test successful')
  } else {
    console.error('SSO test failed:', await response.text())
  }
}

// Use in component
function SSOTest({ tenantId }: { tenantId: string }) {
  return (
    <button onClick={() => testSSO(tenantId)}>
      Test SSO
    </button>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use SAML for enterprise integrations</li>
          <li>Use OIDC for modern applications</li>
          <li>Store credentials securely</li>
          <li>Test SSO before enabling</li>
          <li>Configure attribute mappings correctly</li>
          <li>Monitor SSO logs</li>
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
            <a href="/guides/multi-tenancy-setup">Multi-Tenancy Setup</a> -
            Multi-tenant setup
          </li>
        </ul>
      </section>
    </div>
  )
}

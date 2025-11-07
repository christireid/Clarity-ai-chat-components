import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'SSOConfigWizard - Clarity Chat Components',
  description: 'Enterprise: guided setup for SSO providers and metadata.',
}

export default function SSOConfigWizardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Enterprise</span>
        <h1>SSOConfigWizard</h1>
        <p className="docs-lead">Simplifies configuring SAML/OIDC providers and testing logins.</p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Example"
          code={`import { SSOConfigWizard } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-4">
      <SSOConfigWizard />
    </div>
  )
}`} 
          height="300px"
        />
      </section>
    </div>
  )
}

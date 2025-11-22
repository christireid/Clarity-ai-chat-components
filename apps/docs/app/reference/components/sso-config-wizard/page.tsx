import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
export const dynamic = 'force-dynamic'

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
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-4">
      <SSOConfigWizard />
    </div>
  )
}

render(<Example />)`}
        />
      </section>
    </div>
  )
}

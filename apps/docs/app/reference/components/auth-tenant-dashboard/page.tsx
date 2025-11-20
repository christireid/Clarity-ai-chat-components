import React from 'react'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AuthTenantDashboard - Clarity Chat Components',
  description: 'Enterprise: manage tenants, roles, and SSO mappings.',
}

export default function AuthTenantDashboardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Enterprise</span>
        <h1>AuthTenantDashboard</h1>
        <p className="docs-lead">View tenants, users, roles, and connection status.</p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-4">
      <AuthTenantDashboard />
    </div>
  )
}

render(<Example />)`}
        />
      </section>
    </div>
  )
}

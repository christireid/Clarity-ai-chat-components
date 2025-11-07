import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'

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
        <LiveDemo
          title="Example"
          code={`import { AuthTenantDashboard } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-4">
      <AuthTenantDashboard />
    </div>
  )
}`} 
          height="280px"
        />
      </section>
    </div>
  )
}

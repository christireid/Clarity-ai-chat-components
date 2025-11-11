import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Multi-Tenancy - Clarity Chat',
  description: 'Clarity Chat provides optional utilities for building multi-tenant AI applications with tenant isolation and management.',
}

export default function MultiTenancyGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Multi-Tenancy</h1>
        <p className="docs-lead">
          Clarity Chat provides optional utilities for building multi-tenant AI applications. These utilities help you isolate data, manage tenant-specific configurations, and enforce quotas per tenant.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Multi-tenancy features include:
        </p>
        <ul>
          <li>Tenant isolation (namespaces, cache prefixes, database names)</li>
          <li>Tenant context management</li>
          <li>Tenant-specific quotas and settings</li>
          <li>Integration with vector stores, caches, and databases</li>
          <li>Tenant status management</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Quick Start</h2>
        <CodeBlock
          language="tsx"
          code={`import { TenantManager, MemoryTenantStorage } from '@clarity-chat/react'

const storage = new MemoryTenantStorage()
const tenants = new TenantManager(storage)

// Add tenant
await storage.addTenant({
  id: 'acme-corp',
  name: 'Acme Corp',
  status: 'active',
  plan: 'enterprise',
  quotas: {
    tokens: 1000000,
    requests: 10000,
  },
  createdAt: Date.now(),
})

// Set tenant context
const tenant = await tenants.getTenant('acme-corp')
tenants.setContext({
  tenant,
  userId: 'user-123',
  roles: ['user'],
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li><strong>Always Set Context</strong>: Set tenant context at the start of each request</li>
          <li><strong>Use Namespaces</strong>: Always use tenant namespaces for data isolation</li>
          <li><strong>Check Status</strong>: Verify tenant is active before processing requests</li>
          <li><strong>Enforce Quotas</strong>: Check quotas before consuming resources</li>
          <li><strong>Isolate Storage</strong>: Use tenant-specific storage backends when possible</li>
          <li><strong>Clear Context</strong>: Clear tenant context after request completes</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li>Learn about <a href="/guides/rbac">RBAC</a> for tenant-specific permissions</li>
          <li>Check out <a href="/guides/usage-quotas">Usage Quotas</a> for resource limits</li>
          <li>See <a href="/guides/webhooks">Webhooks</a> for tenant-specific events</li>
        </ul>
      </section>
    </div>
  )
}

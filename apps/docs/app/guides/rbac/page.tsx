import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Role-Based Access Control (RBAC) - Clarity Chat',
  description: 'Clarity Chat provides optional RBAC utilities for implementing permissions and access control in your AI chat applications.',
}

export default function RBACGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Role-Based Access Control (RBAC)</h1>
        <p className="docs-lead">
          Clarity Chat provides optional RBAC utilities for implementing permissions and access control in your AI chat applications. The system is flexible and extensible - you bring your own storage backend.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          RBAC allows you to:
        </p>
        <ul>
          <li>Define roles with specific permissions</li>
          <li>Assign roles to users</li>
          <li>Check permissions before allowing actions</li>
          <li>Support role inheritance</li>
          <li>Integrate with multi-tenant applications</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Quick Start</h2>
        <CodeBlock
          language="tsx"
          code={`import { RBACManager, MemoryRBACStorage, CommonRoles } from '@clarity-chat/react'

const storage = new MemoryRBACStorage()
const rbac = new RBACManager(storage)

// Add predefined roles
storage.addRole(CommonRoles.ADMIN)
storage.addRole(CommonRoles.USER)
storage.addRole(CommonRoles.VIEWER)

// Assign roles to users
storage.assignRoles('user-123', ['user'])

// Check permissions
const canSend = await rbac.hasPermission(
  { userId: 'user-123', roles: ['user'] },
  'chat.send'
)

if (canSend) {
  // Allow sending message
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li><strong>Define Clear Permissions</strong>: Use consistent naming (<code>resource.action</code>)</li>
          <li><strong>Use Role Inheritance</strong>: Avoid duplicating permissions</li>
          <li><strong>Check Early</strong>: Verify permissions before expensive operations</li>
          <li><strong>Cache Strategically</strong>: Clear cache when roles change</li>
          <li><strong>Tenant Isolation</strong>: Always include tenantId in multi-tenant apps</li>
          <li><strong>Fail Securely</strong>: Default to denying access if permission check fails</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li>Learn about <a href="/guides/multi-tenancy">Multi-Tenancy</a> for tenant isolation</li>
          <li>Check out <a href="/guides/usage-quotas">Usage Quotas</a> for resource limits</li>
          <li>See <a href="/guides/audit-logging">Audit Logging</a> for permission tracking</li>
        </ul>
      </section>
    </div>
  )
}

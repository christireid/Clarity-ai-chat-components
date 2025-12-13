import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Enterprise SSO Setup - Cookbook',
  description: 'Configure SAML/OIDC authentication with role-based access control.',
}

export default function EnterpriseSSOCookbook() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Enterprise</span>
        <h1>Enterprise SSO Setup</h1>
        <p className="docs-lead">
          Configure single sign-on with SAML/OIDC and implement role-based access control for enterprise deployments.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Set up enterprise-grade authentication with support for SAML 2.0, OIDC, and custom
          identity providers. Includes multi-tenancy and granular permissions.
        </p>
        <Callout type="info" title="Enterprise Feature">
          SSO and advanced RBAC features require the Enterprise license.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>SSO Configuration</h2>
        <pre><code>{`// app/api/auth/[...nextauth]/route.ts
import { SSOProvider } from '@clarity-chat/react/enterprise'
import NextAuth from 'next-auth'

const ssoProvider = new SSOProvider({
  saml: {
    entryPoint: process.env.SAML_ENTRY_POINT,
    cert: process.env.SAML_CERT,
    issuer: 'clarity-chat',
    callbackUrl: process.env.SAML_CALLBACK_URL
  },
  oidc: {
    clientId: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    issuer: process.env.OIDC_ISSUER,
    scope: 'openid profile email'
  }
})

export const authOptions = {
  providers: [
    ssoProvider.getSAMLProvider(),
    ssoProvider.getOIDCProvider()
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Map SSO attributes to internal roles
      const tenant = await getTenantFromEmail(user.email)
      user.tenantId = tenant.id
      user.roles = mapSSOAttributes(account.attributes)
      return true
    },
    async session({ session, token }) {
      session.user.tenantId = token.tenantId
      session.user.roles = token.roles
      return session
    }
  }
}

export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Role-Based Access Control</h2>
        <pre><code>{`// lib/rbac.ts
import { RBACManager } from '@clarity-chat/react/enterprise'

export const rbac = new RBACManager({
  roles: {
    admin: {
      permissions: ['*']
    },
    manager: {
      permissions: [
        'chat:read',
        'chat:write',
        'users:read',
        'settings:read',
        'settings:write'
      ]
    },
    user: {
      permissions: ['chat:read', 'chat:write']
    },
    viewer: {
      permissions: ['chat:read']
    }
  },
  // Hierarchical roles
  hierarchy: {
    admin: ['manager', 'user', 'viewer'],
    manager: ['user', 'viewer'],
    user: ['viewer']
  }
})

// Check permissions
export function requirePermission(permission: string) {
  return async (req: Request) => {
    const session = await getSession(req)
    if (!rbac.hasPermission(session.user.roles, permission)) {
      return new Response('Forbidden', { status: 403 })
    }
  }
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Multi-Tenancy Setup</h2>
        <pre><code>{`// lib/tenancy.ts
import { TenantManager } from '@clarity-chat/react/enterprise'

export const tenantManager = new TenantManager({
  isolation: 'schema', // or 'database', 'row-level'
  database: {
    host: process.env.DB_HOST,
    port: 5432
  }
})

// Middleware to inject tenant context
export async function withTenant(req: Request) {
  const session = await getSession(req)
  const tenant = await tenantManager.getTenant(session.user.tenantId)
  
  // Set tenant context for this request
  return tenantManager.runInContext(tenant, async () => {
    // All DB queries are automatically scoped to this tenant
    return await handleRequest(req)
  })
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>SSO Configuration UI</h2>
        <pre><code>{`import { SSOConfigWizard } from '@clarity-chat/react/enterprise'

export default function AdminSSOPage() {
  const handleSSOConfig = async (config) => {
    await fetch('/api/admin/sso', {
      method: 'POST',
      body: JSON.stringify(config)
    })
  }

  return (
    <div className="admin-panel">
      <h1>SSO Configuration</h1>
      <SSOConfigWizard
        onSave={handleSSOConfig}
        providers={['saml', 'oidc', 'azure-ad', 'okta']}
        enableTesting={true}
      />
    </div>
  )
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>User Provisioning</h2>
        <pre><code>{`// SCIM 2.0 provisioning endpoint
// app/api/scim/v2/Users/route.ts
import { SCIMHandler } from '@clarity-chat/react/enterprise'

const scim = new SCIMHandler({
  onUserCreate: async (userData) => {
    const user = await db.user.create({
      data: {
        email: userData.emails[0].value,
        name: userData.name.formatted,
        roles: mapSCIMRoles(userData.roles)
      }
    })
    return user
  },
  onUserUpdate: async (userId, userData) => {
    return await db.user.update({
      where: { id: userId },
      data: {
        name: userData.name.formatted,
        roles: mapSCIMRoles(userData.roles)
      }
    })
  },
  onUserDelete: async (userId) => {
    await db.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() }
    })
  }
})

export const GET = scim.handleList
export const POST = scim.handleCreate
export const PUT = scim.handleUpdate
export const DELETE = scim.handleDelete`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Audit Logging</h2>
        <pre><code>{`import { AuditLogger } from '@clarity-chat/react/enterprise'

const auditLogger = new AuditLogger({
  storage: 'database', // or 's3', 'cloudwatch'
  retention: '7y', // SOC2/GDPR compliance
  sensitiveFields: ['password', 'apiKey', 'token']
})

// Log all authentication events
auditLogger.log({
  event: 'user.login',
  userId: user.id,
  tenantId: user.tenantId,
  ipAddress: req.headers.get('x-forwarded-for'),
  userAgent: req.headers.get('user-agent'),
  metadata: {
    provider: 'saml',
    success: true
  }
})

// Query audit logs
const logs = await auditLogger.query({
  userId: 'user_123',
  events: ['user.login', 'user.logout'],
  startDate: new Date('2024-01-01'),
  endDate: new Date()
})`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Session Management</h2>
        <pre><code>{`import { SessionManager } from '@clarity-chat/react/enterprise'

const sessionManager = new SessionManager({
  store: 'redis',
  maxAge: 8 * 60 * 60, // 8 hours
  rolling: true, // Extend on activity
  secure: true,
  sameSite: 'strict',
  // Enforce single session per user
  singleSession: false,
  // Session limits per tenant
  maxSessionsPerTenant: 1000
})

// Revoke all sessions for a user
await sessionManager.revokeAllSessions(userId)

// List active sessions
const sessions = await sessionManager.getActiveSessions(userId)`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use certificate-based SAML authentication for maximum security</li>
          <li>Implement session timeout and idle timeout separately</li>
          <li>Log all authentication and authorization events for audit trails</li>
          <li>Support JIT (Just-In-Time) provisioning for seamless onboarding</li>
          <li>Validate SSO assertions and tokens thoroughly</li>
          <li>Implement graceful fallback for SSO failures</li>
          <li>Test SSO configuration in staging before production</li>
          <li>Document SSO setup process for customer IT teams</li>
          <li>Support multiple identity providers per tenant</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Security Checklist</h2>
        <Callout type="warning" title="Security Requirements">
          ✅ HTTPS enforced for all SSO callbacks<br/>
          ✅ Certificate validation for SAML assertions<br/>
          ✅ Token signature verification for OIDC<br/>
          ✅ Rate limiting on auth endpoints<br/>
          ✅ Session fixation protection<br/>
          ✅ CSRF protection on login flows<br/>
          ✅ Audit logging for all auth events<br/>
          ✅ Password policies for local accounts<br/>
          ✅ MFA support (optional but recommended)<br/>
          ✅ IP allowlisting for admin accounts
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/sso-config-wizard" className="docs-card">
            <h3>SSO Config Wizard</h3>
            <p>UI component for SSO setup</p>
          </a>
          <a href="/reference/components/auth-tenant-dashboard" className="docs-card">
            <h3>Tenant Dashboard</h3>
            <p>Manage tenants and users</p>
          </a>
          <a href="/reference/components/api-token-manager" className="docs-card">
            <h3>API Token Manager</h3>
            <p>Manage API tokens</p>
          </a>
        </div>
      </section>
    </div>
  )
}

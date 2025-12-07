import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Enterprise SSO Setup - Cookbook',
    description: 'Configure SAML/OIDC authentication with role-based access control.',
};
export default function EnterpriseSSOCookbook() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Enterprise" }), _jsx("h1", { children: "Enterprise SSO Setup" }), _jsx("p", { className: "docs-lead", children: "Configure single sign-on with SAML/OIDC and implement role-based access control for enterprise deployments." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "Set up enterprise-grade authentication with support for SAML 2.0, OIDC, and custom identity providers. Includes multi-tenancy and granular permissions." }), _jsx(Callout, { type: "info", title: "Enterprise Feature", children: "SSO and advanced RBAC features require the Enterprise license." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "SSO Configuration" }), _jsx("pre", { children: _jsx("code", { children: `// app/api/auth/[...nextauth]/route.ts
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
export { handler as GET, handler as POST }` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Role-Based Access Control" }), _jsx("pre", { children: _jsx("code", { children: `// lib/rbac.ts
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Multi-Tenancy Setup" }), _jsx("pre", { children: _jsx("code", { children: `// lib/tenancy.ts
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "SSO Configuration UI" }), _jsx("pre", { children: _jsx("code", { children: `import { SSOConfigWizard } from '@clarity-chat/react/enterprise'

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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "User Provisioning" }), _jsx("pre", { children: _jsx("code", { children: `// SCIM 2.0 provisioning endpoint
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
export const DELETE = scim.handleDelete` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Audit Logging" }), _jsx("pre", { children: _jsx("code", { children: `import { AuditLogger } from '@clarity-chat/react/enterprise'

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
})` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Session Management" }), _jsx("pre", { children: _jsx("code", { children: `import { SessionManager } from '@clarity-chat/react/enterprise'

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
const sessions = await sessionManager.getActiveSessions(userId)` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Use certificate-based SAML authentication for maximum security" }), _jsx("li", { children: "Implement session timeout and idle timeout separately" }), _jsx("li", { children: "Log all authentication and authorization events for audit trails" }), _jsx("li", { children: "Support JIT (Just-In-Time) provisioning for seamless onboarding" }), _jsx("li", { children: "Validate SSO assertions and tokens thoroughly" }), _jsx("li", { children: "Implement graceful fallback for SSO failures" }), _jsx("li", { children: "Test SSO configuration in staging before production" }), _jsx("li", { children: "Document SSO setup process for customer IT teams" }), _jsx("li", { children: "Support multiple identity providers per tenant" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Security Checklist" }), _jsxs(Callout, { type: "warning", title: "Security Requirements", children: ["\u2705 HTTPS enforced for all SSO callbacks", _jsx("br", {}), "\u2705 Certificate validation for SAML assertions", _jsx("br", {}), "\u2705 Token signature verification for OIDC", _jsx("br", {}), "\u2705 Rate limiting on auth endpoints", _jsx("br", {}), "\u2705 Session fixation protection", _jsx("br", {}), "\u2705 CSRF protection on login flows", _jsx("br", {}), "\u2705 Audit logging for all auth events", _jsx("br", {}), "\u2705 Password policies for local accounts", _jsx("br", {}), "\u2705 MFA support (optional but recommended)", _jsx("br", {}), "\u2705 IP allowlisting for admin accounts"] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/sso-config-wizard", className: "docs-card", children: [_jsx("h3", { children: "SSO Config Wizard" }), _jsx("p", { children: "UI component for SSO setup" })] }), _jsxs("a", { href: "/reference/components/auth-tenant-dashboard", className: "docs-card", children: [_jsx("h3", { children: "Tenant Dashboard" }), _jsx("p", { children: "Manage tenants and users" })] }), _jsxs("a", { href: "/reference/components/api-token-manager", className: "docs-card", children: [_jsx("h3", { children: "API Token Manager" }), _jsx("p", { children: "Manage API tokens" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map
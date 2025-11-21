import type { Meta, StoryObj } from '@storybook/react'
import {
  SeatInviteDialog,
  SSOConfigWizard,
  ApiTokenManager,
  AuthTenantDashboard,
} from '@clarity-chat/react'

/**
 * Enterprise components for advanced organizational features.
 * 
 * **Features:**
 * - Multi-tenant management
 * - SSO configuration
 * - API token management
 * - User seat management
 */
const meta: Meta = {
  title: 'Examples/Enterprise',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Enterprise-grade components for organizational management and security.',
      },
    },
    layout: 'centered',
  },
}

export default meta

// ============================================================================
// Seat Invite Dialog
// ============================================================================

export const SeatInviteDialogDefault: StoryObj<typeof SeatInviteDialog> = {
  render: () => (
    <SeatInviteDialog
      open={true}
      onOpenChange={() => {}}
      onInvite={(emails, role) => {
        console.log('Inviting:', emails, 'with role:', role)
      }}
      availableSeats={5}
    />
  ),
}

export const SeatInviteDialogLimitedSeats: StoryObj<typeof SeatInviteDialog> = {
  render: () => (
    <SeatInviteDialog
      open={true}
      onOpenChange={() => {}}
      onInvite={(emails, role) => {
        console.log('Inviting:', emails, 'with role:', role)
      }}
      availableSeats={1}
    />
  ),
}

// ============================================================================
// SSO Config Wizard
// ============================================================================

export const SSOConfigWizardDefault: StoryObj<typeof SSOConfigWizard> = {
  render: () => (
    <div style={{ width: '800px', height: '600px' }}>
      <SSOConfigWizard
        onComplete={(config) => {
          console.log('SSO configured:', config)
          alert('SSO Configuration completed!')
        }}
      />
    </div>
  ),
}

export const SSOConfigWizardWithExisting: StoryObj<typeof SSOConfigWizard> = {
  render: () => (
    <div style={{ width: '800px', height: '600px' }}>
      <SSOConfigWizard
        existingConfig={{
          provider: 'okta',
          clientId: 'existing-client-id',
          issuer: 'https://company.okta.com',
          enabled: true,
        }}
        onComplete={(config) => {
          console.log('SSO updated:', config)
        }}
      />
    </div>
  ),
}

// ============================================================================
// API Token Manager
// ============================================================================

export const ApiTokenManagerDefault: StoryObj<typeof ApiTokenManager> = {
  render: () => (
    <div style={{ width: '800px' }}>
      <ApiTokenManager
        tokens={[
          {
            id: '1',
            name: 'Production API',
            token: 'sk_prod_xxxxxxxxxxxxxxxx',
            createdAt: Date.now() - 86400000 * 30,
            lastUsed: Date.now() - 3600000,
            expiresAt: Date.now() + 86400000 * 90,
            scopes: ['read:messages', 'write:messages', 'manage:users'],
          },
          {
            id: '2',
            name: 'Development API',
            token: 'sk_dev_xxxxxxxxxxxxxxxx',
            createdAt: Date.now() - 86400000 * 7,
            lastUsed: Date.now() - 7200000,
            expiresAt: Date.now() + 86400000 * 365,
            scopes: ['read:messages', 'write:messages'],
          },
        ]}
        onCreateToken={(name, scopes) => {
          console.log('Creating token:', name, scopes)
        }}
        onRevokeToken={(tokenId) => {
          console.log('Revoking token:', tokenId)
        }}
        onRegenerateToken={(tokenId) => {
          console.log('Regenerating token:', tokenId)
        }}
      />
    </div>
  ),
}

export const ApiTokenManagerEmpty: StoryObj<typeof ApiTokenManager> = {
  render: () => (
    <div style={{ width: '800px' }}>
      <ApiTokenManager
        tokens={[]}
        onCreateToken={(name, scopes) => {
          console.log('Creating first token:', name, scopes)
        }}
        onRevokeToken={(tokenId) => {}}
        onRegenerateToken={(tokenId) => {}}
      />
    </div>
  ),
}

// ============================================================================
// Auth Tenant Dashboard
// ============================================================================

export const AuthTenantDashboardDefault: StoryObj<typeof AuthTenantDashboard> = {
  render: () => (
    <div style={{ width: '1200px', height: '800px' }}>
      <AuthTenantDashboard
        tenantId="acme-corp"
        tenantName="Acme Corporation"
        stats={{
          totalUsers: 247,
          activeUsers: 189,
          ssoEnabled: true,
          mfaEnforced: true,
          lastActivity: Date.now() - 300000,
        }}
        users={[
          {
            id: '1',
            email: 'john.doe@acme.com',
            name: 'John Doe',
            role: 'admin',
            status: 'active',
            lastLogin: Date.now() - 3600000,
          },
          {
            id: '2',
            email: 'jane.smith@acme.com',
            name: 'Jane Smith',
            role: 'member',
            status: 'active',
            lastLogin: Date.now() - 7200000,
          },
          {
            id: '3',
            email: 'bob.johnson@acme.com',
            name: 'Bob Johnson',
            role: 'member',
            status: 'invited',
            lastLogin: null,
          },
        ]}
        onUserAction={(action, userId) => {
          console.log('User action:', action, userId)
        }}
      />
    </div>
  ),
}

export const AuthTenantDashboardMultipleTenants: StoryObj<typeof AuthTenantDashboard> = {
  render: () => (
    <div style={{ width: '1200px', height: '800px' }}>
      <AuthTenantDashboard
        tenantId="startup-inc"
        tenantName="Startup Inc"
        stats={{
          totalUsers: 12,
          activeUsers: 8,
          ssoEnabled: false,
          mfaEnforced: false,
          lastActivity: Date.now() - 600000,
        }}
        users={[
          {
            id: '1',
            email: 'founder@startup.com',
            name: 'Founder',
            role: 'owner',
            status: 'active',
            lastLogin: Date.now() - 600000,
          },
          {
            id: '2',
            email: 'dev@startup.com',
            name: 'Developer',
            role: 'member',
            status: 'active',
            lastLogin: Date.now() - 1800000,
          },
        ]}
        onUserAction={(action, userId) => {
          console.log('User action:', action, userId)
        }}
      />
    </div>
  ),
}

// ============================================================================
// Enterprise Features Overview
// ============================================================================

export const EnterpriseOverview: StoryObj = {
  render: () => (
    <div className="max-w-4xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Enterprise Features</h1>
        <p className="text-gray-600">
          Advanced components for enterprise-grade applications with multi-tenancy,
          SSO, and comprehensive security features.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-semibold">Multi-Tenancy</h3>
          </div>
          <p className="text-sm text-gray-600">
            Isolated workspaces for different organizations with tenant-level configuration
            and data separation.
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold">SSO Integration</h3>
          </div>
          <p className="text-sm text-gray-600">
            Seamless single sign-on with SAML 2.0 and OAuth 2.0 support for major
            identity providers.
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="font-semibold">API Management</h3>
          </div>
          <p className="text-sm text-gray-600">
            Generate and manage API tokens with granular permissions and usage tracking.
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="font-semibold">Audit Logs</h3>
          </div>
          <p className="text-sm text-gray-600">
            Comprehensive activity logging for compliance and security monitoring.
          </p>
        </div>
      </div>

      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Enterprise Support
        </h3>
        <p className="text-sm text-gray-700">
          All enterprise features include 24/7 support, SLA guarantees, dedicated account
          management, and custom integrations.
        </p>
      </div>
    </div>
  ),
}

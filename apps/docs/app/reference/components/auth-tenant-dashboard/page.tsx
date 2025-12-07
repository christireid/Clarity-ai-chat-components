'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AuthTenantDashboard | Clarity Chat',
  description: 'Enterprise component for managing tenants, seats, plans, and organization settings.',
}

const authTenantDashboardProps: Prop[] = [
  {
    name: 'organizationName',
    type: 'string',
    required: true,
    description: 'Name of the organization/tenant.',
  },
  {
    name: 'planName',
    type: 'string',
    required: true,
    description: 'Current subscription plan name.',
  },
  {
    name: 'planBadge',
    type: 'string',
    description: 'Badge text for the plan (e.g., "Active", "Trial").',
  },
  {
    name: 'renewalDate',
    type: 'string',
    description: 'Plan renewal date (formatted string).',
  },
  {
    name: 'seatUsage',
    type: '{ label: string; used: number; total: number }',
    required: true,
    description: 'Seat usage breakdown with used and total counts.',
  },
  {
    name: 'apiUsage',
    type: '{ label: string; value: string }',
    description: 'API usage information (optional).',
  },
  {
    name: 'actions',
    type: 'PlanAction[]',
    description: 'Array of action buttons (e.g., upgrade, manage seats).',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Custom className.',
  },
]

export default function AuthTenantDashboardPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>AuthTenantDashboard</h1>

      <p className="lead">
        Enterprise component for managing multi-tenant organizations, seat usage, subscription plans,
        and organization settings. Perfect for SaaS applications with team-based access control.
      </p>

      <Callout type="info" title="Enterprise Feature">
        <p>
          This component is designed for enterprise multi-tenant applications. It provides
          a comprehensive dashboard for managing organization settings, seat allocation,
          and subscription plans.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the component:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { AuthTenantDashboard } from '@clarity-chat/react'

function OrganizationSettings() {
  return (
    <AuthTenantDashboard
      organizationName="Acme Corp"
      planName="Enterprise"
      planBadge="Active"
      renewalDate="2024-12-31"
      seatUsage={{
        label: 'Team members',
        used: 45,
        total: 100,
      }}
      apiUsage={{
        label: 'API calls this month',
        value: '1.2M',
      }}
      actions={[
        {
          id: 'upgrade',
          label: 'Upgrade Plan',
          onClick: () => console.log('Upgrade clicked'),
        },
        {
          id: 'manage-seats',
          label: 'Manage Seats',
          onClick: () => console.log('Manage seats clicked'),
        },
      ]}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with AuthTenantDashboard:
        </p>
        <CodePlayground
          initialCode={`import { AuthTenantDashboard } from '@clarity-chat/react'

function Example() {
  return (
    <AuthTenantDashboard
      organizationName="Demo Organization"
      planName="Pro"
      seatUsage={{ label: 'Seats', used: 8, total: 20 }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Seat Management</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { AuthTenantDashboard } from '@clarity-chat/react'
import { useRouter } from 'next/navigation'

function TenantManagement() {
  const router = useRouter()

  return (
    <AuthTenantDashboard
      organizationName="My Company"
      planName="Business"
      planBadge="Active"
      renewalDate="2024-12-31"
      seatUsage={{
        label: 'Team members',
        used: 15,
        total: 50,
      }}
      actions={[
        {
          id: 'invite',
          label: 'Invite Members',
          onClick: () => router.push('/admin/invite'),
        },
        {
          id: 'upgrade',
          label: 'Upgrade to Enterprise',
          onClick: () => router.push('/admin/billing'),
        },
      ]}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With API Usage Tracking</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { AuthTenantDashboard } from '@clarity-chat/react'
import { useQuery } from '@tanstack/react-query'

function DashboardWithUsage() {
  const { data: usage } = useQuery({
    queryKey: ['api-usage'],
    queryFn: async () => {
      const res = await fetch('/api/usage')
      return res.json()
    },
  })

  return (
    <AuthTenantDashboard
      organizationName="Acme Corp"
      planName="Enterprise"
      seatUsage={{
        label: 'Seats',
        used: usage?.seatsUsed || 0,
        total: usage?.seatsTotal || 100,
      }}
      apiUsage={{
        label: 'API calls',
        value: usage?.apiCalls || '0',
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Trial Status</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { AuthTenantDashboard } from '@clarity-chat/react'

function TrialDashboard() {
  const isTrial = true
  const daysRemaining = 14

  return (
    <AuthTenantDashboard
      organizationName="New Company"
      planName="Pro Trial"
      planBadge={isTrial ? \`Trial - \${daysRemaining} days left\` : 'Active'}
      seatUsage={{
        label: 'Seats',
        used: 3,
        total: 10,
      }}
      actions={[
        {
          id: 'subscribe',
          label: 'Subscribe Now',
          onClick: () => window.location.href = '/pricing',
        },
      ]}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Props</h2>
        <PropsTable props={authTenantDashboardProps} title="Component Props" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Seat Management</strong> - Visual progress bar showing seat usage</li>
          <li><strong>Plan Information</strong> - Display current plan and renewal date</li>
          <li><strong>API Usage</strong> - Optional API usage tracking display</li>
          <li><strong>Action Buttons</strong> - Customizable action buttons for common tasks</li>
          <li><strong>Responsive Design</strong> - Works on desktop and mobile</li>
          <li><strong>Accessibility</strong> - ARIA labels and semantic HTML</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Update in real-time</strong> - Refresh seat usage when members are added/removed</li>
          <li><strong>Show warnings</strong> - Alert users when approaching seat limits</li>
          <li><strong>Provide actions</strong> - Include relevant action buttons (upgrade, invite, etc.)</li>
          <li><strong>Track API usage</strong> - Display API usage for transparency</li>
          <li><strong>Handle edge cases</strong> - Show appropriate messages when total is 0 or unlimited</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/api-token-manager" className="docs-card">
            <h3>ApiTokenManager Component</h3>
            <p>API token management</p>
          </a>
          <a href="/reference/components/seat-invite-dialog" className="docs-card">
            <h3>SeatInviteDialog Component</h3>
            <p>Invite team members</p>
          </a>
          <a href="/reference/components/sso-config-wizard" className="docs-card">
            <h3>SSOConfigWizard Component</h3>
            <p>SSO configuration</p>
          </a>
          <a href="/guides/multi-tenancy" className="docs-card">
            <h3>Multi-Tenancy Guide</h3>
            <p>Multi-tenant architecture</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'UsageDashboard', href: '/reference/components/usage-dashboard' }}
        next={{ title: 'ApiTokenManager', href: '/reference/components/api-token-manager' }}
      />
    </>
  )
}

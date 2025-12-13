import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'


export const metadata: Metadata = {
  title: 'Seat Management Guide - Clarity Chat Components',
  description: 'Learn how to manage seats for enterprise tenants, including invitations, role assignment, and seat limits.',
}

export default function SeatManagementPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Seat Management</h1>
        <p className="docs-lead">
          Learn how to manage seats for enterprise tenants, including invitations, role assignment, seat limits, and user management.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Invite users to seats',
          'Assign roles to users',
          'Manage seat limits',
          'Track seat usage',
          'Handle seat upgrades',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Seat management allows you to control who has access to your application and what permissions they have.
        </p>
      </section>

      <section className="docs-section">
        <h2>Inviting Users</h2>
        <p>
          Invite users to seats:
        </p>
        <CodePlayground
          initialCode={`import { SeatInviteDialog } from '@clarity-chat/react'

function InviteUsers({ tenantId }: { tenantId: string }) {
  return (
    <SeatInviteDialog
      roles={['admin', 'user', 'viewer']}
      defaultRole="user"
      onInvite={async (invite) => {
        const response = await fetch(\`/api/tenants/\${tenantId}/seats/invite\`, {
          method: 'POST',
          body: JSON.stringify({
            email: invite.email,
            role: invite.role,
            sendWelcome: invite.sendWelcome,
          }),
        })

        if (response.ok) {
          console.log('Invitation sent')
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Seat Usage Tracking</h2>
        <p>
          Track seat usage:
        </p>
        <CodePlayground
          initialCode={`import { AuthTenantDashboard } from '@clarity-chat/react'

function SeatTracking({ tenantId }: { tenantId: string }) {
  const [seatUsage, setSeatUsage] = useState({ used: 0, total: 10 })

  useEffect(() => {
    fetchSeatUsage(tenantId).then(usage => {
      setSeatUsage(usage)
    })
  }, [tenantId])

  return (
    <AuthTenantDashboard
      tenantId={tenantId}
      seatUsage={seatUsage}
      actions={[
        {
          id: 'upgrade',
          label: 'Upgrade Plan',
          onClick: () => {
            // Upgrade plan
          },
        },
      ]}
    />
  )
}

async function fetchSeatUsage(tenantId: string) {
  const response = await fetch(\`/api/tenants/\${tenantId}/seats/usage\`)
  return response.json()
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Role Management</h2>
        <p>
          Manage user roles:
        </p>
        <CodePlayground
          initialCode={`function RoleManagement({ tenantId }: { tenantId: string }) {
  const [users, setUsers] = useState([])

  const updateRole = async (userId: string, newRole: string) => {
    await fetch(\`/api/tenants/\${tenantId}/seats/\${userId}/role\`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
    })

    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ))
  }

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <span>{user.email}</span>
          <select
            value={user.role}
            onChange={(e) => updateRole(user.id, e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Seat Limits</h2>
        <p>
          Handle seat limits:
        </p>
        <CodePlayground
          initialCode={`import { AuthTenantDashboard, SeatInviteDialog } from '@clarity-chat/react'

function SeatLimits({ tenantId }: { tenantId: string }) {
  const [seatUsage, setSeatUsage] = useState({ used: 8, total: 10 })

  const canInvite = seatUsage.used < seatUsage.total

  return (
    <div>
      <AuthTenantDashboard
        tenantId={tenantId}
        seatUsage={seatUsage}
      />
      {canInvite ? (
        <SeatInviteDialog
          tenantId={tenantId}
          onInvite={async (invite) => {
            // Invite user
            await inviteUser(tenantId, invite)
            setSeatUsage({ ...seatUsage, used: seatUsage.used + 1 })
          }}
        />
      ) : (
        <div>
          All seats allocated. <button>Upgrade Plan</button>
        </div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Track seat usage accurately</li>
          <li>Set appropriate role permissions</li>
          <li>Handle seat limits gracefully</li>
          <li>Send welcome emails when inviting</li>
          <li>Monitor seat usage trends</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/seat-invite-dialog">SeatInviteDialog</a> - Seat invitation component</li>
          <li><a href="/reference/components/auth-tenant-dashboard">AuthTenantDashboard</a> - Tenant dashboard</li>
        </ul>
      </section>
    </div>
  )
}

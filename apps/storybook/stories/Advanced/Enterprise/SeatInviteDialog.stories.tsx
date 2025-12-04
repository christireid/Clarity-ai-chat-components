import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { SeatInviteDialog } from '@clarity-chat/react'

const meta = {
  title: 'Advanced/Enterprise/SeatInviteDialog',
  component: SeatInviteDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Seat Invite Dialog

Dialog component for inviting team members to your organization with role-based access control.

## Features

- **Email Invitation**: Send invite to team member email
- **Role Selection**: Assign roles (Admin, Editor, Viewer)
- **Welcome Email**: Optional welcome email with quick start guide
- **Form Validation**: Email validation and required fields
- **Customizable Roles**: Configure available roles

## Use Cases

- Team member onboarding
- Organization management
- Access control configuration
- Billing and seat management
`,
      },
    },
  },
  argTypes: {
    triggerLabel: {
      control: 'text',
      description: 'Label for the trigger button',
      table: { defaultValue: { summary: '"Invite teammate"' } },
    },
    roles: {
      control: 'object',
      description: 'Available roles for selection',
      table: { defaultValue: { summary: "['Administrator', 'Editor', 'Viewer']" } },
    },
    defaultRole: {
      control: 'text',
      description: 'Default selected role',
    },
    onInvite: {
      action: 'invited',
      description: 'Callback when invitation is sent',
    },
  },
} satisfies Meta<typeof SeatInviteDialog>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  args: {
    triggerLabel: 'Invite teammate',
    roles: ['Administrator', 'Editor', 'Viewer'],
    onInvite: (invite) => console.log('Invite sent:', invite),
  },
}

export const CustomRoles: Story = {
  args: {
    triggerLabel: 'Add team member',
    roles: ['Owner', 'Admin', 'Developer', 'Designer', 'Guest'],
    defaultRole: 'Developer',
    onInvite: (invite) => console.log('Invite sent:', invite),
  },
  parameters: {
    docs: {
      description: {
        story: 'Dialog with custom role options.',
      },
    },
  },
}

export const SingleRole: Story = {
  args: {
    triggerLabel: 'Invite viewer',
    roles: ['Viewer'],
    onInvite: (invite) => console.log('Invite sent:', invite),
  },
  parameters: {
    docs: {
      description: {
        story: 'Dialog with only one role option.',
      },
    },
  },
}

// ============================================================================
// Integration Examples
// ============================================================================

export const WithTeamList: Story = {
  render: () => {
    const [team, setTeam] = React.useState([
      { id: 1, email: 'john@company.com', role: 'Administrator', status: 'active' },
      { id: 2, email: 'jane@company.com', role: 'Editor', status: 'active' },
      { id: 3, email: 'bob@company.com', role: 'Viewer', status: 'pending' },
    ])

    const handleInvite = (invite: { email: string; role: string; sendWelcome: boolean }) => {
      const newMember = {
        id: team.length + 1,
        email: invite.email,
        role: invite.role,
        status: 'pending' as const,
      }
      setTeam([...team, newMember])
      console.log('Invite sent:', invite)
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Team Members</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your team and invite new members
            </p>
          </div>
          <SeatInviteDialog onInvite={handleInvite} />
        </div>

        <div className="border rounded-lg divide-y">
          {team.map((member) => (
            <div key={member.id} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">{member.email}</div>
                <div className="text-sm text-muted-foreground">{member.role}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    member.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete team management interface with invite dialog.',
      },
    },
  },
}

// ============================================================================
// Enterprise Scenarios
// ============================================================================

export const EnterpriseSetup: Story = {
  render: () => {
    const [invites, setInvites] = React.useState<
      Array<{ email: string; role: string; sendWelcome: boolean; timestamp: Date }>
    >([])

    const handleInvite = (invite: { email: string; role: string; sendWelcome: boolean }) => {
      setInvites([...invites, { ...invite, timestamp: new Date() }])
    }

    return (
      <div className="max-w-4xl space-y-6">
        <div className="border rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Organization Setup</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Set up your enterprise organization by inviting team members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">50</div>
              <div className="text-sm text-muted-foreground">Total Seats</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">23</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">27</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </div>

          <SeatInviteDialog
            triggerLabel="Invite team member"
            roles={['Organization Admin', 'Team Admin', 'Member', 'Guest']}
            defaultRole="Member"
            onInvite={handleInvite}
          />
        </div>

        {invites.length > 0 && (
          <div className="border rounded-lg p-6">
            <h4 className="font-semibold mb-4">Recent Invitations</h4>
            <div className="space-y-2">
              {invites.map((invite, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <div className="font-medium">{invite.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {invite.role} • {invite.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {invite.sendWelcome && (
                    <span className="text-xs text-muted-foreground">✉️ Welcome email sent</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete enterprise onboarding scenario with seat tracking.',
      },
    },
  },
}

// ============================================================================
// Permission Levels
// ============================================================================

export const PermissionLevels: Story = {
  render: () => {
    const [selectedRole, setSelectedRole] = React.useState('Member')

    const rolePermissions = {
      'Organization Admin': [
        'Full access to all features',
        'Manage billing and subscriptions',
        'Add/remove members',
        'Configure SSO and security',
        'Access audit logs',
      ],
      'Team Admin': [
        'Manage team members',
        'Configure team settings',
        'View team analytics',
        'Create and manage projects',
      ],
      'Member': [
        'Access assigned projects',
        'Create and edit content',
        'Collaborate with team',
        'View team analytics',
      ],
      'Guest': [
        'View shared projects',
        'Limited collaboration',
        'No administrative access',
      ],
    }

    const handleInvite = (invite: { email: string; role: string; sendWelcome: boolean }) => {
      console.log('Inviting with role:', invite)
      setSelectedRole(invite.role)
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SeatInviteDialog
            triggerLabel="Invite with permissions"
            roles={Object.keys(rolePermissions)}
            defaultRole="Member"
            onInvite={handleInvite}
          />
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-3">Permissions for {selectedRole}</h4>
          <ul className="space-y-2">
            {rolePermissions[selectedRole as keyof typeof rolePermissions].map((permission, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span className="text-sm">{permission}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Dialog with detailed permission levels for each role.',
      },
    },
  },
}

// ============================================================================
// Interactive Demo
// ============================================================================

export const InteractiveDemo: Story = {
  render: () => {
    const [invitations, setInvitations] = React.useState<
      Array<{
        email: string
        role: string
        sendWelcome: boolean
        status: 'pending' | 'accepted' | 'expired'
        sentAt: Date
      }>
    >([])

    const handleInvite = (invite: { email: string; role: string; sendWelcome: boolean }) => {
      const newInvitation = {
        ...invite,
        status: 'pending' as const,
        sentAt: new Date(),
      }
      setInvitations([newInvitation, ...invitations])
    }

    const updateStatus = (index: number, status: 'pending' | 'accepted' | 'expired') => {
      const updated = [...invitations]
      updated[index].status = status
      setInvitations(updated)
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <h3 className="font-semibold">Team Invitations</h3>
            <p className="text-sm text-muted-foreground">
              {invitations.length} total invitations sent
            </p>
          </div>
          <SeatInviteDialog
            onInvite={handleInvite}
            roles={['Administrator', 'Editor', 'Viewer', 'Guest']}
          />
        </div>

        {invitations.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No invitations yet. Click "Invite teammate" to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {invitations.map((invitation, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{invitation.email}</div>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          invitation.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : invitation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {invitation.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {invitation.role} • Sent {invitation.sentAt.toLocaleString()}
                      {invitation.sendWelcome && ' • Welcome email sent'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {invitation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(index, 'accepted')}
                          className="text-xs px-2 py-1 bg-success text-white rounded hover:opacity-90"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(index, 'expired')}
                          className="text-xs px-2 py-1 bg-destructive text-white rounded hover:opacity-90"
                        >
                          Expire
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo with invitation tracking and status management.',
      },
    },
  },
}

import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'SeatInviteDialog - Clarity Chat Components',
  description:
    'Dialog for inviting team members with role assignment and welcome email options.',
}

const props: Prop[] = [
  {
    name: 'triggerLabel',
    type: 'string',
    description: 'Label for trigger button (default: "Invite teammate")',
  },
  {
    name: 'roles',
    type: 'string[]',
    description:
      'Available roles (default: ["Administrator", "Editor", "Viewer"])',
  },
  {
    name: 'defaultRole',
    type: 'string',
    description: 'Default selected role',
  },
  {
    name: 'onInvite',
    type: '(invite: { email: string; role: string; sendWelcome: boolean }) => void',
    description: 'Callback when invite is sent',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function SeatInviteDialogPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>SeatInviteDialog</h1>
        <p className="docs-lead">
          Dialog for inviting team members to your organization with role
          assignment and optional welcome email.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Invite team members',
          'Assign roles',
          'Send welcome emails',
          'Manage seat invitations',
          'Handle invite callbacks',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Invite team members:</p>
        <CodePlayground
          initialCode={`import { SeatInviteDialog } from '@clarity-chat/react/internal'

function TeamInvites() {
  return (
    <SeatInviteDialog
      onInvite={async (invite) => {
        const response = await fetch('/api/team/invites', {
          method: 'POST',
          body: JSON.stringify({
            email: invite.email,
            role: invite.role,
            sendWelcome: invite.sendWelcome,
          }),
        })
        
        if (response.ok) {
          logger.debug('Invite sent to', invite.email)
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Roles</h2>
        <p>Define custom roles:</p>
        <CodePlayground
          initialCode={`import { SeatInviteDialog } from '@clarity-chat/react/internal'

function CustomRoles() {
  return (
    <SeatInviteDialog
      roles={['Owner', 'Admin', 'Member', 'Guest']}
      defaultRole="Member"
      onInvite={(invite) => {
        logger.debug('Inviting as', invite.role)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Welcome Email</h2>
        <p>Control welcome email sending:</p>
        <CodePlayground
          initialCode={`import { SeatInviteDialog } from '@clarity-chat/react/internal'

function WithWelcomeEmail() {
  return (
    <SeatInviteDialog
      onInvite={(invite) => {
        if (invite.sendWelcome) {
          // Send welcome email with onboarding
          sendWelcomeEmail(invite.email, {
            includeOnboarding: true,
          })
        } else {
          // Send simple invite
          sendInviteEmail(invite.email)
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Seat Management</h2>
        <p>Integrate with seat management:</p>
        <CodePlayground
          initialCode={`import { SeatInviteDialog } from '@clarity-chat/react/internal'

function SeatManagement({ availableSeats }: { availableSeats: number }) {
  return (
    <div>
      <div>Available seats: {availableSeats}</div>
      {availableSeats > 0 ? (
        <SeatInviteDialog
          onInvite={async (invite) => {
            // Check seat availability
            if (availableSeats <= 0) {
              alert('No seats available')
              return
            }
            
            // Send invite
            await sendInvite(invite)
          }}
        />
      ) : (
        <div>No seats available. Upgrade to invite more members.</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Invite Object</h2>
        <ul>
          <li>
            <code>email</code>: Email address of invitee
          </li>
          <li>
            <code>role</code>: Assigned role
          </li>
          <li>
            <code>sendWelcome</code>: Whether to send welcome email
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Validate email addresses before sending</li>
          <li>Check seat availability before inviting</li>
          <li>Use appropriate roles for security</li>
          <li>Send welcome emails for better onboarding</li>
          <li>Track invite status</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/cookbook/multi-tenant-chat">Multi-Tenant Chat Recipe</a> -
            Multi-tenant setup
          </li>
          <li>
            <a href="/reference/components/auth-tenant-dashboard">
              AuthTenantDashboard
            </a>{' '}
            - Tenant dashboard
          </li>
        </ul>
      </section>
    </div>
  )
}

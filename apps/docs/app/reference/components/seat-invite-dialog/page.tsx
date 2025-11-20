import React from 'react'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'SeatInviteDialog - Clarity Chat Components',
  description: 'Enterprise: invite users and assign roles to tenants.',
}

export default function SeatInviteDialogPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Enterprise</span>
        <h1>SeatInviteDialog</h1>
        <p className="docs-lead">Invite team members, set roles, and send emails.</p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-4">
      <SeatInviteDialog />
    </div>
  )
}

render(<Example />)`}
        />
      </section>
    </div>
  )
}

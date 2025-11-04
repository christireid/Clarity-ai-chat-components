import * as React from 'react'
import {
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
} from '@clarity-chat/primitives'

export interface SeatInviteDialogProps {
  triggerLabel?: string
  roles?: string[]
  defaultRole?: string
  onInvite?: (invite: { email: string; role: string; sendWelcome: boolean }) => void
  className?: string
}

export const SeatInviteDialog: React.FC<SeatInviteDialogProps> = ({
  triggerLabel = 'Invite teammate',
  roles = ['Administrator', 'Editor', 'Viewer'],
  defaultRole,
  onInvite,
  className,
}) => {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState(defaultRole ?? roles[0])
  const [sendWelcome, setSendWelcome] = React.useState(true)

  const resetState = React.useCallback(() => {
    setEmail('')
    setRole(defaultRole ?? roles[0])
    setSendWelcome(true)
  }, [defaultRole, roles])

  const handleInvite = () => {
    if (!email.trim()) return
    onInvite?.({ email: email.trim(), role, sendWelcome })
    resetState()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => {
      setOpen(next)
      if (!next) resetState()
    }}>
      <DialogTrigger asChild>
        <Button variant="surface" className={className}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite teammate</DialogTitle>
          <DialogDescription>
            Seats are billed per active member. Select a role and optionally send a welcome email.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
            Email address
            <Input
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoFocus
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {roles.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={sendWelcome}
              onChange={(event) => setSendWelcome(event.target.checked)}
              className="h-4 w-4 rounded border border-border/60"
            />
            Send welcome email with quick start instructions
          </label>
        </div>

        <DialogFooter className="flex flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="surface" onClick={handleInvite} disabled={!email.trim()}>
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

SeatInviteDialog.displayName = 'SeatInviteDialog'


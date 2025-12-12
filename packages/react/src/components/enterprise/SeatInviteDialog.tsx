import * as React from 'react'
import {
  Badge,
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Textarea,
  cn,
} from '@clarity-chat/primitives'

export interface RoleOption {
  id: string
  name: string
  description?: string
}

export interface PendingInvite {
  id: string
  email: string
  role: string
  sentAt: string
}

export interface SeatInviteDialogProps {
  /** Label for the trigger button */
  triggerLabel?: string
  /** Available roles (simple strings or objects with descriptions) */
  roles?: string[] | RoleOption[]
  /** Default role to select */
  defaultRole?: string
  /** Callback when invite(s) are sent */
  onInvite?: (
    invites: Array<{ email: string; role: string; sendWelcome: boolean }>
  ) => void
  /** Callback when a pending invite is canceled */
  onCancelInvite?: (invite: PendingInvite) => void
  /** Whether invite is being sent */
  isLoading?: boolean
  /** Remaining seats available */
  remainingSeats?: number
  /** List of pending invites */
  pendingInvites?: PendingInvite[]
  /** Custom message for the invite email */
  customMessage?: string
  /** Allow bulk invites */
  allowBulkInvite?: boolean
  className?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim())
}

const parseEmails = (input: string): string[] => {
  // Split by comma, newline, or space and filter valid emails
  return input
    .split(/[,\n\s]+/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0)
}

export const SeatInviteDialog: React.FC<SeatInviteDialogProps> = ({
  triggerLabel = 'Invite teammate',
  roles = ['Administrator', 'Editor', 'Viewer'],
  defaultRole,
  onInvite,
  onCancelInvite,
  isLoading = false,
  remainingSeats,
  pendingInvites = [],
  customMessage,
  allowBulkInvite = true,
  className,
}) => {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [bulkEmails, setBulkEmails] = React.useState('')
  const [role, setRole] = React.useState(() => {
    if (defaultRole) return defaultRole
    const firstRole = roles[0]
    return typeof firstRole === 'string' ? firstRole : (firstRole?.id ?? '')
  })
  const [sendWelcome, setSendWelcome] = React.useState(true)
  const [mode, setMode] = React.useState<'single' | 'bulk'>('single')
  const [emailError, setEmailError] = React.useState<string | null>(null)
  const [bulkErrors, setBulkErrors] = React.useState<string[]>([])

  // Normalize roles to RoleOption format
  const normalizedRoles: RoleOption[] = React.useMemo(() => {
    return roles.map((r) => (typeof r === 'string' ? { id: r, name: r } : r))
  }, [roles])

  const selectedRoleDetails = normalizedRoles.find(
    (r) => r.id === role || r.name === role
  )

  const resetState = React.useCallback(() => {
    setEmail('')
    setBulkEmails('')
    setEmailError(null)
    setBulkErrors([])
    const firstRole = roles[0]
    setRole(
      defaultRole ??
        (typeof firstRole === 'string' ? firstRole : (firstRole?.id ?? ''))
    )
    setSendWelcome(true)
    setMode('single')
  }, [defaultRole, roles])

  const validateSingleEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError(null)
      return false
    }
    if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError(null)
    return true
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setEmail(value)
    if (emailError) {
      validateSingleEmail(value)
    }
  }

  const handleEmailBlur = () => {
    if (email.trim()) {
      validateSingleEmail(email)
    }
  }

  const validateBulkEmails = (): { valid: string[]; invalid: string[] } => {
    const emails = parseEmails(bulkEmails)
    const valid: string[] = []
    const invalid: string[] = []

    emails.forEach((e) => {
      if (validateEmail(e)) {
        valid.push(e)
      } else {
        invalid.push(e)
      }
    })

    return { valid, invalid }
  }

  const handleInvite = () => {
    if (mode === 'single') {
      if (!validateSingleEmail(email)) return
      onInvite?.([{ email: email.trim(), role, sendWelcome }])
    } else {
      const { valid, invalid } = validateBulkEmails()
      if (invalid.length > 0) {
        setBulkErrors(invalid)
        return
      }
      if (valid.length === 0) return
      onInvite?.(valid.map((e) => ({ email: e, role, sendWelcome })))
    }
    resetState()
    setOpen(false)
  }

  const emailCount =
    mode === 'bulk' ? parseEmails(bulkEmails).length : email.trim() ? 1 : 0
  const exceedsSeats =
    remainingSeats !== undefined && emailCount > remainingSeats
  const canSubmit =
    emailCount > 0 &&
    !exceedsSeats &&
    !emailError &&
    bulkErrors.length === 0 &&
    !isLoading

  return (
    <Dialog
      open={open}
      onOpenChange={(next: boolean) => {
        setOpen(next)
        if (!next) resetState()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="surface" className={className}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Invite teammate{allowBulkInvite && mode === 'bulk' ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            {remainingSeats !== undefined ? (
              <>
                You have{' '}
                <span
                  className={cn(
                    'font-medium',
                    remainingSeats <= 2 ? 'text-warning' : 'text-foreground'
                  )}
                >
                  {remainingSeats} seat{remainingSeats === 1 ? '' : 's'}
                </span>{' '}
                remaining. Seats are billed per active member.
              </>
            ) : (
              'Seats are billed per active member. Select a role and optionally send a welcome email.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Mode toggle for bulk invites */}
          {allowBulkInvite && (
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                onClick={() => setMode('single')}
                className={cn(
                  'rounded-md px-3 py-1.5 transition-colors',
                  mode === 'single'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                Single invite
              </button>
              <button
                type="button"
                onClick={() => setMode('bulk')}
                className={cn(
                  'rounded-md px-3 py-1.5 transition-colors',
                  mode === 'bulk'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                Bulk invite
              </button>
            </div>
          )}

          {/* Email input */}
          {mode === 'single' ? (
            <div className="space-y-1">
              <label
                htmlFor="invite-email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <Input
                id="invite-email"
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                autoFocus
                required
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
                className={cn(emailError && 'border-destructive')}
              />
              {emailError && (
                <p id="email-error" className="text-xs text-destructive">
                  {emailError}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <label
                htmlFor="invite-bulk-emails"
                className="text-sm font-medium text-foreground"
              >
                Email addresses
              </label>
              <Textarea
                id="invite-bulk-emails"
                placeholder="Enter email addresses separated by commas or new lines..."
                value={bulkEmails}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setBulkEmails(e.target.value)
                  setBulkErrors([])
                }}
                className={cn(
                  'min-h-[100px] resize-y',
                  bulkErrors.length > 0 && 'border-destructive'
                )}
                aria-describedby={
                  bulkErrors.length > 0 ? 'bulk-error' : undefined
                }
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Separate multiple emails with commas or new lines</span>
                {emailCount > 0 && (
                  <span className={cn(exceedsSeats && 'text-destructive')}>
                    {emailCount} email{emailCount === 1 ? '' : 's'}
                  </span>
                )}
              </div>
              {bulkErrors.length > 0 && (
                <p id="bulk-error" className="text-xs text-destructive">
                  Invalid emails: {bulkErrors.join(', ')}
                </p>
              )}
            </div>
          )}

          {exceedsSeats && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              You can only invite {remainingSeats} more member
              {remainingSeats === 1 ? '' : 's'}. Please upgrade your plan or
              remove existing members.
            </div>
          )}

          {/* Role select */}
          <div className="space-y-1">
            <label
              htmlFor="invite-role"
              className="text-sm font-medium text-foreground"
            >
              Role
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {normalizedRoles.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            {selectedRoleDetails?.description && (
              <p className="text-xs text-muted-foreground">
                {selectedRoleDetails.description}
              </p>
            )}
          </div>

          {/* Send welcome checkbox */}
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={sendWelcome}
              onChange={(event) => setSendWelcome(event.target.checked)}
              className="h-4 w-4 rounded border border-border/60 accent-primary"
            />
            Send welcome email with quick start instructions
          </label>

          {/* Pending invites */}
          {pendingInvites.length > 0 && (
            <div className="space-y-2 rounded-lg border border-border/50 bg-muted p-3">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Pending invites ({pendingInvites.length})
              </h4>
              <ul className="space-y-2" role="list">
                {pendingInvites.map((invite) => (
                  <li
                    key={invite.id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate text-foreground">
                        {invite.email}
                      </span>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {invite.role}
                      </Badge>
                    </div>
                    {onCancelInvite && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-destructive hover:text-destructive shrink-0"
                        onClick={() => onCancelInvite(invite)}
                      >
                        Cancel
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-wrap justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="surface"
            onClick={handleInvite}
            disabled={!canSubmit}
          >
            {isLoading ? (
              <>
                <svg
                  className="mr-1.5 h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              <>
                Send invite{mode === 'bulk' && emailCount > 1 ? 's' : ''}
                {emailCount > 1 && ` (${emailCount})`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

SeatInviteDialog.displayName = 'SeatInviteDialog'

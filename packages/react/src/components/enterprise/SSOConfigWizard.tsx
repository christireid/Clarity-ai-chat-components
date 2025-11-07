import * as React from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Textarea,
  cn,
} from '@clarity-chat/primitives'

export interface SSOConfigStep {
  id: string
  title: string
  description: string
  status?: 'pending' | 'in-progress' | 'complete'
}

export interface SSOConfigWizardProps {
  providerName?: string
  steps: SSOConfigStep[]
  metadata?: {
    acsUrl: string
    entityId: string
  }
  notes?: string
  onNotesChange?: (value: string) => void
  onDownloadMetadata?: () => void
  onSubmit?: () => void
  className?: string
}

const statusBadge: Record<NonNullable<SSOConfigStep['status']>, { label: string; variant: 'info' | 'warning' | 'success' }> = {
  pending: { label: 'Pending', variant: 'info' },
  'in-progress': { label: 'In progress', variant: 'warning' },
  complete: { label: 'Complete', variant: 'success' },
}

export const SSOConfigWizard: React.FC<SSOConfigWizardProps> = ({
  providerName = 'SAML 2.0',
  steps,
  metadata,
  notes,
  onNotesChange,
  onDownloadMetadata,
  onSubmit,
  className,
}) => {
  return (
    <Card className={cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-[0_24px_54px_rgba(15,23,42,0.18)]', className)}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-semibold text-foreground">Configure {providerName} SSO</CardTitle>
        <CardDescription className="text-sm text-muted-foreground/80">
          Follow the guided steps to connect your identity provider. Save changes once all steps are complete.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step.id} className="rounded-2xl border border-border/40 bg-[hsl(var(--surface-muted))] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
                    Step {index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                </div>
                {step.status && (
                  <Badge variant={statusBadge[step.status].variant} className="uppercase">
                    {statusBadge[step.status].label}
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground/80">{step.description}</p>
            </li>
          ))}
        </ol>

        {metadata && (
          <div className="space-y-3 rounded-2xl border border-border/40 bg-[hsl(var(--surface-muted))] p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Service provider metadata</h4>
              <Button variant="ghost" size="sm" onClick={onDownloadMetadata}>
                Download XML
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                ACS URL
                <Input value={metadata.acsUrl} readOnly className="mt-1 bg-background/70" />
              </label>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                Entity ID
                <Input value={metadata.entityId} readOnly className="mt-1 bg-background/70" />
              </label>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70" htmlFor="sso-notes">
            Internal notes
          </label>
          <Textarea
            id="sso-notes"
            value={notes}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onNotesChange?.(event.target.value)}
            placeholder="Record admin notes or escalation instructions..."
            className="min-h-[120px] resize-y bg-background/60"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="surface" onClick={onSubmit}>
            Save configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

SSOConfigWizard.displayName = 'SSOConfigWizard'


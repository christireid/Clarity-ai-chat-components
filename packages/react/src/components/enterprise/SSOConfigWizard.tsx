import { logger } from '@clarity-chat/utils/logger'
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
import { Skeleton } from '../skeleton'

export interface SSOConfigStep {
  id: string
  title: string
  description: string
  status?: 'pending' | 'in-progress' | 'complete'
  /** Optional help link for this step */
  helpUrl?: string
}

export interface SSOConfigWizardProps {
  /** Identity provider name (e.g., "Okta", "Azure AD", "SAML 2.0") */
  providerName?: string
  /** Configuration steps */
  steps: SSOConfigStep[]
  /** Service provider metadata */
  metadata?: {
    acsUrl: string
    entityId: string
  }
  /** Internal notes content */
  notes?: string
  /** Callback when notes change */
  onNotesChange?: (value: string) => void
  /** Callback to download metadata XML */
  onDownloadMetadata?: () => void
  /** Callback to test connection */
  onTestConnection?: () => void
  /** Callback when configuration is submitted */
  onSubmit?: () => void
  /** Callback when a step help link is clicked */
  onStepHelp?: (step: SSOConfigStep) => void
  /** Whether data is loading */
  isLoading?: boolean
  /** Whether an action is in progress */
  isProcessing?: boolean
  /** Whether connection test is in progress */
  isTesting?: boolean
  /** Result of connection test */
  testResult?: {
    success: boolean
    message: string
  }
  className?: string
}

const statusBadge: Record<
  NonNullable<SSOConfigStep['status']>,
  { label: string; variant: 'info' | 'warning' | 'success' }
> = {
  pending: { label: 'Pending', variant: 'info' },
  'in-progress': { label: 'In progress', variant: 'warning' },
  complete: { label: 'Complete', variant: 'success' },
}

const CopyIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
)

const CheckIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

const StepsSkeleton = () => (
  <ol className="space-y-4">
    {[1, 2, 3].map((i) => (
      <li key={i} className="rounded-lg border border-border/50 bg-muted p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton width={50} height={14} />
            <Skeleton width={150} height={16} />
          </div>
          <Skeleton width={70} height={20} />
        </div>
        <div className="mt-2">
          <Skeleton width="90%" height={14} />
        </div>
      </li>
    ))}
  </ol>
)

const CopyableInput: React.FC<{
  label: string
  value: string
  id: string
}> = ({ label, value, id }) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      logger.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70"
      >
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          value={value}
          readOnly
          className="bg-background/70 pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          onClick={handleCopy}
          aria-label={copied ? 'Copied!' : `Copy ${label}`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
    </div>
  )
}

export const SSOConfigWizard: React.FC<SSOConfigWizardProps> = ({
  providerName = 'SAML 2.0',
  steps,
  metadata,
  notes,
  onNotesChange,
  onDownloadMetadata,
  onTestConnection,
  onSubmit,
  onStepHelp,
  isLoading = false,
  isProcessing = false,
  isTesting = false,
  testResult,
  className,
}) => {
  // Calculate progress
  const completedSteps = steps.filter((s) => s.status === 'complete').length
  const totalSteps = steps.length
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
  const allComplete = completedSteps === totalSteps && totalSteps > 0

  return (
    <Card
      className={cn(
        'border-border/60 bg-[hsl(var(--surface-elevated))] shadow-md',
        className
      )}
      aria-busy={isLoading || isProcessing}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            {isLoading ? (
              <>
                <Skeleton width={200} height={24} />
                <Skeleton width={280} height={14} />
              </>
            ) : (
              <>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Configure {providerName} SSO
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground/80">
                  Follow the guided steps to connect your identity provider.
                  Save changes once all steps are complete.
                </CardDescription>
              </>
            )}
          </div>
          {!isLoading && totalSteps > 0 && (
            <Badge
              variant={allComplete ? 'success' : 'info'}
              className="whitespace-nowrap"
            >
              {completedSteps}/{totalSteps} complete
            </Badge>
          )}
        </div>

        {/* Progress bar */}
        {!isLoading && totalSteps > 0 && (
          <div className="pt-2">
            <div
              role="progressbar"
              aria-label="Configuration progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  allComplete ? 'bg-success' : 'bg-primary'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <StepsSkeleton />
        ) : (
          <ol
            className="space-y-4"
            role="list"
            aria-label="Configuration steps"
          >
            {steps.map((step, index) => {
              const status = step.status ?? 'pending'
              const isComplete = status === 'complete'
              const isInProgress = status === 'in-progress'

              return (
                <li
                  key={step.id}
                  className={cn(
                    'rounded-lg border p-4 transition-colors',
                    isComplete
                      ? 'border-success/50 bg-success/5'
                      : isInProgress
                        ? 'border-warning/50 bg-warning/5'
                        : 'border-border/50 bg-muted'
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                          isComplete
                            ? 'bg-success text-success-foreground'
                            : isInProgress
                              ? 'bg-warning text-warning-foreground'
                              : 'bg-muted-foreground/20 text-muted-foreground'
                        )}
                      >
                        {isComplete ? (
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </span>
                      <h3 className="text-sm font-semibold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {step.helpUrl && onStepHelp && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => onStepHelp(step)}
                        >
                          Help
                        </Button>
                      )}
                      <Badge
                        variant={statusBadge[status].variant}
                        className="uppercase"
                      >
                        {statusBadge[status].label}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground/80">
                    {step.description}
                  </p>
                </li>
              )
            })}
          </ol>
        )}

        {metadata && (
          <div className="space-y-3 rounded-lg border border-border/50 bg-muted p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                Service provider metadata
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDownloadMetadata}
                disabled={isProcessing}
              >
                <svg
                  className="mr-1.5 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download XML
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <CopyableInput
                label="ACS URL"
                value={metadata.acsUrl}
                id="sso-acs-url"
              />
              <CopyableInput
                label="Entity ID"
                value={metadata.entityId}
                id="sso-entity-id"
              />
            </div>
          </div>
        )}

        {/* Test Connection Section */}
        {onTestConnection && (
          <div className="space-y-3 rounded-lg border border-border/50 bg-muted p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  Test connection
                </h4>
                <p className="text-xs text-muted-foreground/70">
                  Verify your SSO configuration before saving
                </p>
              </div>
              <Button
                variant="surface"
                size="sm"
                onClick={onTestConnection}
                disabled={isProcessing || isTesting}
              >
                {isTesting ? (
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
                    Testing...
                  </>
                ) : (
                  'Test connection'
                )}
              </Button>
            </div>
            {testResult && (
              <div
                className={cn(
                  'rounded-md p-3 text-sm',
                  testResult.success
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive'
                )}
                role="alert"
              >
                <div className="flex items-center gap-2">
                  {testResult.success ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  <span>{testResult.message}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70"
            htmlFor="sso-notes"
          >
            Internal notes
          </label>
          <Textarea
            id="sso-notes"
            value={notes}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              onNotesChange?.(event.target.value)
            }
            placeholder="Record admin notes or escalation instructions..."
            className="min-h-[120px] resize-y bg-background/60"
            disabled={isProcessing}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="surface" onClick={onSubmit} disabled={isProcessing}>
            {isProcessing ? 'Saving...' : 'Save configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

SSOConfigWizard.displayName = 'SSOConfigWizard'

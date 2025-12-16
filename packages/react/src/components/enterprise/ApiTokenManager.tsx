import { logger } from '@clarity-chat/utils/logger';
import * as React from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  cn,
} from '@clarity-chat/primitives'
import { Skeleton } from '../skeleton'

export type TokenStatus = 'active' | 'expired' | 'revoked'

export interface ApiTokenRecord {
  id: string
  label: string
  /** The actual token value (only shown once after creation) */
  token?: string
  /** Masked version for display (e.g., "sk-...abc123") */
  maskedToken?: string
  createdAt: string
  expiresAt?: string
  lastUsed?: string
  scopes: string[]
  status: TokenStatus
}

export interface ApiTokenManagerProps {
  /** List of tokens to display */
  tokens: ApiTokenRecord[]
  /** Callback when create new token is clicked */
  onCreate?: () => void
  /** Callback when a token should be regenerated */
  onRegenerate?: (token: ApiTokenRecord) => void
  /** Callback when a token should be revoked */
  onRevoke?: (token: ApiTokenRecord) => void
  /** Callback when a token is copied */
  onCopy?: (token: ApiTokenRecord) => void
  /** Whether data is loading */
  isLoading?: boolean
  /** Whether an action is in progress */
  isProcessing?: boolean
  /** Custom title */
  title?: string
  /** Custom description */
  description?: string
  className?: string
}

const statusBadge: Record<
  TokenStatus,
  { label: string; variant: 'success' | 'warning' | 'destructive' }
> = {
  active: { label: 'Active', variant: 'success' },
  expired: { label: 'Expired', variant: 'warning' },
  revoked: { label: 'Revoked', variant: 'destructive' },
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

const TableSkeleton = () => (
  <tbody>
    {[1, 2, 3].map((i) => (
      <tr key={i} className="border-t border-border/40">
        <td className="px-2 py-3">
          <Skeleton width={120} height={16} />
        </td>
        <td className="px-2 py-3">
          <div className="flex gap-1">
            <Skeleton width={60} height={20} />
            <Skeleton width={60} height={20} />
          </div>
        </td>
        <td className="px-2 py-3">
          <Skeleton width={80} height={16} />
        </td>
        <td className="px-2 py-3">
          <Skeleton width={80} height={16} />
        </td>
        <td className="px-2 py-3">
          <Skeleton width={60} height={20} />
        </td>
        <td className="px-2 py-3">
          <div className="flex gap-2">
            <Skeleton width={80} height={32} />
            <Skeleton width={60} height={32} />
          </div>
        </td>
      </tr>
    ))}
  </tbody>
)

export const ApiTokenManager: React.FC<ApiTokenManagerProps> = ({
  tokens,
  onCreate,
  onRegenerate,
  onRevoke,
  onCopy,
  isLoading = false,
  isProcessing = false,
  title = 'API access tokens',
  description = 'Rotate tokens regularly to maintain compliance and revoke unused credentials.',
  className,
}) => {
  const [copiedTokenId, setCopiedTokenId] = React.useState<string | null>(null)
  const [revokeToken, setRevokeToken] = React.useState<ApiTokenRecord | null>(
    null
  )
  const [regenerateToken, setRegenerateToken] =
    React.useState<ApiTokenRecord | null>(null)

  const handleCopy = React.useCallback(
    async (token: ApiTokenRecord) => {
      const textToCopy = token.token || token.maskedToken
      if (!textToCopy) return

      try {
        await navigator.clipboard.writeText(textToCopy)
        setCopiedTokenId(token.id)
        onCopy?.(token)
        setTimeout(() => setCopiedTokenId(null), 2000)
      } catch (err) {
        logger.logger.error('Failed to copy token:', err)
      }
    },
    [onCopy]
  )

  const handleRevoke = (token: ApiTokenRecord) => {
    setRevokeToken(token)
  }

  const handleRegenerate = (token: ApiTokenRecord) => {
    setRegenerateToken(token)
  }

  const confirmRevoke = () => {
    if (revokeToken) {
      onRevoke?.(revokeToken)
      setRevokeToken(null)
    }
  }

  const confirmRegenerate = () => {
    if (regenerateToken) {
      onRegenerate?.(regenerateToken)
      setRegenerateToken(null)
    }
  }

  // Calculate stats
  const activeCount = tokens.filter((t) => t.status === 'active').length
  const expiredCount = tokens.filter((t) => t.status === 'expired').length

  return (
    <>
      <Card
        className={cn(
          'border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm',
          className
        )}
        aria-busy={isLoading || isProcessing}
      >
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-lg font-semibold text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground/80">
              {description}
            </CardDescription>
            {!isLoading && tokens.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="outline" className="text-xs">
                  {activeCount} active
                </Badge>
                {expiredCount > 0 && (
                  <Badge variant="warning" className="text-xs">
                    {expiredCount} expired
                  </Badge>
                )}
              </div>
            )}
          </div>
          <Button variant="surface" onClick={onCreate} disabled={isProcessing}>
            Generate new token
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table
            className="min-w-[720px] w-full text-sm"
            role="table"
            aria-label="API access tokens"
          >
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground/70">
              <tr>
                <th scope="col" className="py-2 px-2">
                  Label
                </th>
                <th scope="col" className="py-2 px-2">
                  Scopes
                </th>
                <th scope="col" className="py-2 px-2">
                  Created
                </th>
                <th scope="col" className="py-2 px-2">
                  Last used
                </th>
                <th scope="col" className="py-2 px-2">
                  Status
                </th>
                <th scope="col" className="py-2 px-2">
                  Actions
                </th>
              </tr>
            </thead>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <tbody>
                {tokens.map((token) => {
                  const status = statusBadge[token.status]
                  const isCopied = copiedTokenId === token.id
                  const isExpiringSoon =
                    token.expiresAt &&
                    new Date(token.expiresAt) <=
                      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

                  return (
                    <tr
                      key={token.id}
                      className={cn(
                        'border-t border-border/40 align-top transition-colors',
                        token.status === 'expired' && 'bg-warning/5',
                        token.status === 'revoked' && 'opacity-60'
                      )}
                      data-status={token.status}
                    >
                      <td className="px-2 py-3">
                        <div className="space-y-1">
                          <span className="font-medium text-foreground">
                            {token.label}
                          </span>
                          {(token.token || token.maskedToken) && (
                            <div className="flex items-center gap-1.5">
                              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                                {token.maskedToken ||
                                  `${token.token?.slice(0, 8)}...`}
                              </code>
                              {token.token && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleCopy(token)}
                                  aria-label={
                                    isCopied ? 'Copied!' : 'Copy token'
                                  }
                                >
                                  {isCopied ? <CheckIcon /> : <CopyIcon />}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-xs text-muted-foreground/70">
                        <div className="flex flex-wrap gap-1">
                          {token.scopes.map((scope) => (
                            <Badge
                              key={scope}
                              variant="outline"
                              className="text-[11px]"
                            >
                              {scope}
                            </Badge>
                          ))}
                          {token.scopes.length === 0 && (
                            <span className="text-muted-foreground/50">
                              No scopes
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-xs text-muted-foreground/70 tabular-nums">
                        {token.createdAt}
                        {token.expiresAt && (
                          <div
                            className={cn(
                              'mt-0.5 text-[11px]',
                              isExpiringSoon
                                ? 'text-warning'
                                : 'text-muted-foreground/50'
                            )}
                          >
                            Expires: {token.expiresAt}
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-3 text-xs text-muted-foreground/70 tabular-nums">
                        {token.lastUsed ?? (
                          <span className="text-muted-foreground/50">
                            Never
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex flex-wrap gap-2">
                          {token.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerate(token)}
                              disabled={isProcessing}
                            >
                              Regenerate
                            </Button>
                          )}
                          {token.status !== 'revoked' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRevoke(token)}
                              disabled={isProcessing}
                            >
                              Revoke
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {tokens.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-2 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3 rounded-full bg-muted p-3">
                          <svg
                            className="h-6 w-6 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          No API tokens
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground/70">
                          Generate your first API token to integrate with the
                          platform.
                        </p>
                        <Button
                          variant="surface"
                          size="sm"
                          className="mt-4"
                          onClick={onCreate}
                        >
                          Generate token
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </CardContent>
      </Card>

      {/* Revoke Confirmation Dialog */}
      <Dialog open={!!revokeToken} onOpenChange={() => setRevokeToken(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke API token?</DialogTitle>
            <DialogDescription>
              This will immediately revoke the token "{revokeToken?.label}". Any
              applications using this token will no longer be able to
              authenticate. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRevokeToken(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRevoke}>
              Revoke token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate Confirmation Dialog */}
      <Dialog
        open={!!regenerateToken}
        onOpenChange={() => setRegenerateToken(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate API token?</DialogTitle>
            <DialogDescription>
              This will generate a new token for "{regenerateToken?.label}" and
              invalidate the existing one. You'll need to update any
              applications using the current token. The new token will only be
              shown once.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRegenerateToken(null)}>
              Cancel
            </Button>
            <Button onClick={confirmRegenerate}>Regenerate token</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

ApiTokenManager.displayName = 'ApiTokenManager'

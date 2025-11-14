import * as React from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  cn,
} from '@clarity-chat/primitives'

export type TokenStatus = 'active' | 'expired' | 'revoked'

export interface ApiTokenRecord {
  id: string
  label: string
  createdAt: string
  lastUsed?: string
  scopes: string[]
  status: TokenStatus
}

export interface ApiTokenManagerProps {
  tokens: ApiTokenRecord[]
  onCreate?: () => void
  onRegenerate?: (token: ApiTokenRecord) => void
  onRevoke?: (token: ApiTokenRecord) => void
  className?: string
}

const statusBadge: Record<TokenStatus, { label: string; variant: 'success' | 'warning' | 'destructive' }> = {
  active: { label: 'Active', variant: 'success' },
  expired: { label: 'Expired', variant: 'warning' },
  revoked: { label: 'Revoked', variant: 'destructive' },
}

export const ApiTokenManager: React.FC<ApiTokenManagerProps> = ({
  tokens,
  onCreate,
  onRegenerate,
  onRevoke,
  className,
}) => {
  return (
    <Card className={cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm', className)}>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-lg font-semibold text-foreground">API access tokens</CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">
            Rotate tokens regularly to maintain compliance and revoke unused credentials.
          </CardDescription>
        </div>
        <Button variant="surface" onClick={onCreate}>Generate new token</Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-[720px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground/70">
            <tr>
              <th className="py-2">Label</th>
              <th className="py-2">Scopes</th>
              <th className="py-2">Created</th>
              <th className="py-2">Last used</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => {
              const status = statusBadge[token.status]
              return (
                <tr key={token.id} className="border-t border-border/40 align-top" data-status={token.status}>
                  <td className="px-2 py-3 font-medium text-foreground">{token.label}</td>
                  <td className="px-2 py-3 text-xs text-muted-foreground/70">
                    <div className="flex flex-wrap gap-1">
                      {token.scopes.map((scope) => (
                        <Badge key={scope} variant="outline" className="text-[11px]">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-xs text-muted-foreground/70">{token.createdAt}</td>
                  <td className="px-2 py-3 text-xs text-muted-foreground/70">{token.lastUsed ?? '—'}</td>
                  <td className="px-2 py-3">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-wrap gap-2">
                      {token.status === 'active' && (
                        <Button variant="ghost" size="sm" onClick={() => onRegenerate?.(token)}>
                          Regenerate
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onRevoke?.(token)}
                      >
                        Revoke
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {tokens.length === 0 && (
              <tr>
                <td colSpan={6} className="px-2 py-6 text-center text-sm text-muted-foreground/80">
                  No tokens yet. Generate your first API token to integrate with the platform.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

ApiTokenManager.displayName = 'ApiTokenManager'


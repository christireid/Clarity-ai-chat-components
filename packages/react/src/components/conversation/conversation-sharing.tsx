'use client'

import { logger } from '@clarity-chat/utils/logger'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import type { Message } from '@clarity-chat/types'

/**
 * Share visibility level
 */
export type ShareVisibility =
  | 'public'
  | 'private'
  | 'password-protected'
  | 'team-only'

/**
 * Share expiration
 */
export type ShareExpiration =
  | 'never'
  | '1hour'
  | '24hours'
  | '7days'
  | '30days'
  | 'custom'

/**
 * Share link configuration
 */
export interface ShareLinkConfig {
  id: string
  conversationId: string
  visibility: ShareVisibility
  expiration: ShareExpiration
  expiresAt?: number
  password?: string
  maxViews?: number
  allowComments: boolean
  allowDownload: boolean
  showMetadata: boolean
  trackAnalytics: boolean
  customDomain?: string
  teamIds?: string[]
}

/**
 * Share analytics data
 */
export interface ShareAnalytics {
  shareId: string
  views: number
  uniqueVisitors: number
  avgTimeOnPage: number
  referrers: Map<string, number>
  devices: Map<string, number>
  locations: Map<string, number>
  timeline: Array<{
    timestamp: number
    event: 'view' | 'download' | 'comment' | 'share'
    metadata?: any
  }>
}

/**
 * Shared conversation metadata
 */
export interface SharedConversation {
  id: string
  shareLink: ShareLinkConfig
  messages: Message[]
  metadata: {
    title?: string
    description?: string
    tags?: string[]
    author?: string
    createdAt: number
    updatedAt: number
  }
  analytics: ShareAnalytics
}

/**
 * Props for ConversationSharing
 */
export interface ConversationSharingProps {
  /** Messages to share */
  messages: Message[]
  /** Conversation ID */
  conversationId: string
  /** Existing share links */
  existingShares?: ShareLinkConfig[]
  /** Default visibility */
  defaultVisibility?: ShareVisibility
  /** Enable QR code generation */
  enableQRCode?: boolean
  /** Enable social sharing */
  enableSocialSharing?: boolean
  /** Callback when share link created */
  onShareCreated?: (config: ShareLinkConfig) => void
  /** Callback when share link copied */
  onLinkCopied?: (link: string) => void
  /** Callback when share revoked */
  onShareRevoked?: (shareId: string) => void
  /** Custom className */
  className?: string
}

/**
 * Generate share link
 */
function generateShareLink(config: ShareLinkConfig): string {
  const baseUrl = config.customDomain || window.location.origin
  return `${baseUrl}/share/${config.id}`
}

/**
 * Generate QR code data URL
 */
function generateQRCode(text: string): string {
  // Simple QR code generation (in production, use a library like qrcode)
  // For now, return a placeholder SVG
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">
        QR Code for: ${text.substring(0, 20)}...
      </text>
    </svg>
  `
  try {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  } catch {
    // Fallback for environment where btoa might fail or svg has weird chars
    return ''
  }
}

/**
 * Calculate expiration timestamp
 */
function calculateExpiration(
  expiration: ShareExpiration,
  customDate?: number
): number | undefined {
  const now = Date.now()
  switch (expiration) {
    case 'never':
      return undefined
    case '1hour':
      return now + 60 * 60 * 1000
    case '24hours':
      return now + 24 * 60 * 60 * 1000
    case '7days':
      return now + 7 * 24 * 60 * 60 * 1000
    case '30days':
      return now + 30 * 24 * 60 * 60 * 1000
    case 'custom':
      return customDate
    default:
      return undefined
  }
}

/**
 * ConversationSharing Component
 *
 * Share conversations with configurable permissions:
 * - Public/private/password-protected links
 * - Expiring shares
 * - View limits
 * - Analytics tracking
 * - QR code generation
 * - Social sharing
 */
export function ConversationSharing({
  messages,
  conversationId,
  existingShares = [],
  defaultVisibility = 'private',
  enableQRCode = true,
  enableSocialSharing = true,
  onShareCreated,
  onLinkCopied,
  onShareRevoked,
  className,
}: ConversationSharingProps) {
  const [shares, setShares] = React.useState<ShareLinkConfig[]>(existingShares)
  const [isCreating, setIsCreating] = React.useState(false)
  const [selectedShare, setSelectedShare] =
    React.useState<ShareLinkConfig | null>(null)

  // New share configuration
  const [visibility, setVisibility] =
    React.useState<ShareVisibility>(defaultVisibility)
  const [expiration, setExpiration] = React.useState<ShareExpiration>('7days')
  const [password, setPassword] = React.useState('')
  const [maxViews, setMaxViews] = React.useState<number | undefined>()
  const [allowComments, setAllowComments] = React.useState(true)
  const [allowDownload, setAllowDownload] = React.useState(true)
  const [showMetadata, setShowMetadata] = React.useState(true)

  const createShareLink = () => {
    const config: ShareLinkConfig = {
      id: `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      visibility,
      expiration,
      expiresAt: calculateExpiration(expiration),
      password: visibility === 'password-protected' ? password : undefined,
      maxViews,
      allowComments,
      allowDownload,
      showMetadata,
      trackAnalytics: true,
    }

    setShares((prev) => [...prev, config])
    onShareCreated?.(config)
    setIsCreating(false)

    // Reset form
    setPassword('')
    setMaxViews(undefined)
  }

  const copyToClipboard = async (config: ShareLinkConfig) => {
    const link = generateShareLink(config)
    try {
      await navigator.clipboard.writeText(link)
      onLinkCopied?.(link)
    } catch (error) {
      logger.error('Failed to copy link:', error)
    }
  }

  const revokeShare = (shareId: string) => {
    setShares((prev) => prev.filter((s) => s.id !== shareId))
    onShareRevoked?.(shareId)
    if (selectedShare?.id === shareId) {
      setSelectedShare(null)
    }
  }

  const shareToSocial = (platform: string, link: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Check out this conversation')}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      email: `mailto:?subject=${encodeURIComponent('Shared Conversation')}&body=${encodeURIComponent(`Check out this conversation: ${link}`)}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400')
    }
  }

  const getVisibilityIcon = (vis: ShareVisibility) => {
    switch (vis) {
      case 'public':
        return '🌐'
      case 'private':
        return '🔒'
      case 'password-protected':
        return '🔐'
      case 'team-only':
        return '👥'
      default:
        return '🔗'
    }
  }

  const getExpirationLabel = (exp: ShareExpiration, expiresAt?: number) => {
    if (exp === 'never') return 'Never expires'
    if (expiresAt) {
      const remaining = expiresAt - Date.now()
      if (remaining < 0) return 'Expired'

      const hours = Math.floor(remaining / (60 * 60 * 1000))
      const days = Math.floor(hours / 24)

      if (days > 0) return `Expires in ${days}d`
      if (hours > 0) return `Expires in ${hours}h`
      return 'Expires soon'
    }
    return 'Custom expiration'
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Share Conversation</CardTitle>
            <Button onClick={() => setIsCreating(!isCreating)} size="sm">
              {isCreating ? 'Cancel' : '+ Create Share Link'}
            </Button>
          </div>
        </CardHeader>

        {/* Create share form */}
        {isCreating && (
          <CardContent className="space-y-4 border-t pt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Visibility
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    'public',
                    'private',
                    'password-protected',
                    'team-only',
                  ] as ShareVisibility[]
                ).map((vis) => (
                  <Button
                    key={vis}
                    variant={visibility === vis ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVisibility(vis)}
                    className="justify-start"
                  >
                    <span className="mr-2">{getVisibilityIcon(vis)}</span>
                    {vis.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {visibility === 'password-protected' && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">
                Expiration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    'never',
                    '1hour',
                    '24hours',
                    '7days',
                    '30days',
                  ] as ShareExpiration[]
                ).map((exp) => (
                  <Button
                    key={exp}
                    variant={expiration === exp ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setExpiration(exp)}
                  >
                    {exp === 'never'
                      ? 'Never'
                      : exp.replace('hour', 'h').replace('days', 'd')}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Max Views (optional)
              </label>
              <input
                type="number"
                value={maxViews || ''}
                onChange={(e) =>
                  setMaxViews(
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                placeholder="Unlimited"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                />
                Allow comments
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={allowDownload}
                  onChange={(e) => setAllowDownload(e.target.checked)}
                />
                Allow download
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showMetadata}
                  onChange={(e) => setShowMetadata(e.target.checked)}
                />
                Show metadata
              </label>
            </div>

            <Button onClick={createShareLink} className="w-full">
              Create Share Link
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Existing shares */}
      {shares.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Share Links ({shares.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {shares.map((share) => {
              const link = generateShareLink(share)
              const isExpired = share.expiresAt && share.expiresAt < Date.now()

              return (
                <div
                  key={share.id}
                  className={cn(
                    'p-3 border rounded-lg space-y-2',
                    isExpired && 'opacity-50'
                  )}
                >
                  {/* Share header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {getVisibilityIcon(share.visibility)}
                      </span>
                      <div>
                        <div className="text-sm font-medium">
                          {share.visibility.replace('-', ' ')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getExpirationLabel(
                            share.expiration,
                            share.expiresAt
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpired && <Badge variant="secondary">Expired</Badge>}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSelectedShare(
                            selectedShare?.id === share.id ? null : share
                          )
                        }
                      >
                        {selectedShare?.id === share.id ? 'Hide' : 'Details'}
                      </Button>
                    </div>
                  </div>

                  {/* Share link */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={link}
                      readOnly
                      className="flex-1 px-3 py-1.5 text-sm border rounded bg-muted"
                    />
                    <Button size="sm" onClick={() => copyToClipboard(share)}>
                      📋 Copy
                    </Button>
                  </div>

                  {/* Share details */}
                  {selectedShare?.id === share.id && (
                    <div className="pt-2 border-t space-y-3">
                      {/* Permissions */}
                      <div>
                        <div className="text-xs font-medium mb-1">
                          Permissions
                        </div>
                        <div className="flex gap-2">
                          {share.allowComments && (
                            <Badge variant="outline">Comments</Badge>
                          )}
                          {share.allowDownload && (
                            <Badge variant="outline">Download</Badge>
                          )}
                          {share.showMetadata && (
                            <Badge variant="outline">Metadata</Badge>
                          )}
                          {share.maxViews && (
                            <Badge variant="outline">
                              {share.maxViews} max views
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* QR Code */}
                      {enableQRCode && (
                        <div>
                          <div className="text-xs font-medium mb-2">
                            QR Code
                          </div>
                          <img
                            src={generateQRCode(link)}
                            alt="QR Code"
                            className="w-32 h-32 border rounded"
                          />
                        </div>
                      )}

                      {/* Social sharing */}
                      {enableSocialSharing && (
                        <div>
                          <div className="text-xs font-medium mb-2">
                            Share to
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => shareToSocial('twitter', link)}
                            >
                              Twitter
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => shareToSocial('linkedin', link)}
                            >
                              LinkedIn
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => shareToSocial('facebook', link)}
                            >
                              Facebook
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => shareToSocial('email', link)}
                            >
                              Email
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => revokeShare(share.id)}
                        >
                          Revoke Share
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Info card */}
      {shares.length === 0 && !isCreating && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-2">🔗</div>
            <div className="text-sm text-muted-foreground mb-4">
              No active share links. Create one to share this conversation.
            </div>
            <Button onClick={() => setIsCreating(true)}>
              Create Share Link
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/**
 * Hook for managing conversation sharing
 */
export function useConversationSharing(conversationId: string) {
  const [shares, setShares] = React.useState<Map<string, ShareLinkConfig>>(
    new Map()
  )
  const [analytics, setAnalytics] = React.useState<Map<string, ShareAnalytics>>(
    new Map()
  )

  const createShare = React.useCallback(
    (config: Omit<ShareLinkConfig, 'id' | 'conversationId'>) => {
      const shareConfig: ShareLinkConfig = {
        ...config,
        id: `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
      }

      setShares((prev) => new Map(prev).set(shareConfig.id, shareConfig))

      // Initialize analytics
      setAnalytics((prev) =>
        new Map(prev).set(shareConfig.id, {
          shareId: shareConfig.id,
          views: 0,
          uniqueVisitors: 0,
          avgTimeOnPage: 0,
          referrers: new Map(),
          devices: new Map(),
          locations: new Map(),
          timeline: [],
        })
      )

      return shareConfig
    },
    [conversationId]
  )

  const revokeShare = React.useCallback((shareId: string) => {
    setShares((prev) => {
      const newShares = new Map(prev)
      newShares.delete(shareId)
      return newShares
    })
  }, [])

  const trackView = React.useCallback((shareId: string, metadata?: any) => {
    setAnalytics((prev) => {
      const newAnalytics = new Map(prev)
      const current = newAnalytics.get(shareId)

      if (current) {
        newAnalytics.set(shareId, {
          ...current,
          views: current.views + 1,
          timeline: [
            ...current.timeline,
            {
              timestamp: Date.now(),
              event: 'view',
              metadata,
            },
          ],
        })
      }

      return newAnalytics
    })
  }, [])

  const getShareAnalytics = React.useCallback(
    (shareId: string): ShareAnalytics | undefined => {
      return analytics.get(shareId)
    },
    [analytics]
  )

  const isShareValid = React.useCallback(
    (shareId: string): boolean => {
      const share = shares.get(shareId)
      if (!share) return false

      // Check expiration
      if (share.expiresAt && share.expiresAt < Date.now()) {
        return false
      }

      // Check max views
      if (share.maxViews) {
        const stats = analytics.get(shareId)
        if (stats && stats.views >= share.maxViews) {
          return false
        }
      }

      return true
    },
    [shares, analytics]
  )

  return {
    shares: Array.from(shares.values()),
    createShare,
    revokeShare,
    trackView,
    getShareAnalytics,
    isShareValid,
  }
}

/**
 * Props for ShareAnalyticsDashboard
 */
export interface ShareAnalyticsDashboardProps {
  /** Share ID */
  shareId: string
  /** Analytics data */
  analytics: ShareAnalytics
  /** Share configuration */
  shareConfig: ShareLinkConfig
  /** Custom className */
  className?: string
}

/**
 * ShareAnalyticsDashboard Component
 *
 * Display analytics for shared conversations
 */
export function ShareAnalyticsDashboard({
  shareId,
  analytics,
  shareConfig,
  className,
}: ShareAnalyticsDashboardProps) {
  const topReferrers = React.useMemo(() => {
    return Array.from(analytics.referrers.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [analytics.referrers])

  const topDevices = React.useMemo(() => {
    return Array.from(analytics.devices.entries()).sort((a, b) => b[1] - a[1])
  }, [analytics.devices])

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardHeader>
          <CardTitle>Share Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overview stats */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">{analytics.views}</div>
              <div className="text-xs text-muted-foreground">Total Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {analytics.uniqueVisitors}
              </div>
              <div className="text-xs text-muted-foreground">
                Unique Visitors
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.round(analytics.avgTimeOnPage / 1000)}s
              </div>
              <div className="text-xs text-muted-foreground">Avg. Time</div>
            </div>
          </div>

          {/* Limits */}
          {shareConfig.maxViews && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>View Limit</span>
                <span>
                  {analytics.views} / {shareConfig.maxViews}
                </span>
              </div>
              <div className="h-2 bg-accent rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${(analytics.views / shareConfig.maxViews) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Top referrers */}
          {topReferrers.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Top Referrers</div>
              <div className="space-y-1">
                {topReferrers.map(([referrer, count]) => (
                  <div key={referrer} className="flex justify-between text-xs">
                    <span className="truncate">{referrer}</span>
                    <span className="text-muted-foreground">{count} views</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Devices */}
          {topDevices.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Devices</div>
              <div className="flex gap-2">
                {topDevices.map(([device, count]) => (
                  <Badge key={device} variant="outline">
                    {device}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {analytics.timeline.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Recent Activity</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {analytics.timeline
                  .slice(-10)
                  .reverse()
                  .map((event, idx) => (
                    <div key={idx} className="text-xs flex justify-between">
                      <span>{event.event}</span>
                      <span className="text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

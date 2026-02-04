'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Share2,
  Link,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
  Globe,
  Lock,
  Users,
  QrCode,
  ExternalLink,
  Settings,
  Trash2,
} from 'lucide-react'

// =============================================================================
// SHARE BUTTON - Quick share with dropdown
// =============================================================================

interface ShareButtonProps {
  url?: string
  title?: string
  description?: string
  onShare?: (platform: string) => void
  className?: string
}

export function ShareButton({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Check this out!',
  description,
  onShare,
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onShare?.('copy')
  }

  const shareOptions = [
    {
      label: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          '_blank'
        )
        onShare?.('twitter')
      },
    },
    {
      label: 'LinkedIn',
      icon: <Linkedin className="h-4 w-4" />,
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank'
        )
        onShare?.('linkedin')
      },
    },
    {
      label: 'Email',
      icon: <Mail className="h-4 w-4" />,
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description || url)}`
        onShare?.('email')
      },
    },
  ]

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url })
        onShare?.('native')
      } catch {
        // User cancelled
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy link'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {shareOptions.map((option) => (
          <DropdownMenuItem key={option.label} onClick={option.action}>
            {option.icon}
            <span className="ml-2">{option.label}</span>
          </DropdownMenuItem>
        ))}
        {typeof navigator !== 'undefined' && navigator.share && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleNativeShare}>
              <ExternalLink className="h-4 w-4 mr-2" />
              More options...
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// =============================================================================
// SHARE DIALOG - Advanced share with settings
// =============================================================================

type ShareVisibility = 'public' | 'private' | 'team'

interface ShareLink {
  id: string
  url: string
  visibility: ShareVisibility
  expiresAt?: Date
  accessCount?: number
  createdAt: Date
}

interface ShareDialogProps {
  conversationId: string
  conversationTitle?: string
  existingLinks?: ShareLink[]
  onCreateLink?: (
    visibility: ShareVisibility,
    expiresIn?: number
  ) => Promise<ShareLink>
  onDeleteLink?: (linkId: string) => Promise<void>
  onUpdateLink?: (linkId: string, visibility: ShareVisibility) => Promise<void>
  trigger?: React.ReactNode
  className?: string
}

export function ShareDialog({
  conversationTitle = 'This conversation',
  existingLinks = [],
  onCreateLink,
  onDeleteLink,
  onUpdateLink,
  trigger,
  className,
}: ShareDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)
  const [visibility, setVisibility] = React.useState<ShareVisibility>('public')
  const [enableExpiry, setEnableExpiry] = React.useState(false)
  const [expiryDays, setExpiryDays] = React.useState(7)
  const [links, setLinks] = React.useState<ShareLink[]>(existingLinks)
  const [copied, setCopied] = React.useState<string | null>(null)

  const handleCreateLink = async () => {
    if (!onCreateLink) return
    setIsCreating(true)
    try {
      const newLink = await onCreateLink(
        visibility,
        enableExpiry ? expiryDays : undefined
      )
      setLinks((prev) => [newLink, ...prev])
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopyLink = async (link: ShareLink) => {
    await navigator.clipboard.writeText(link.url)
    setCopied(link.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!onDeleteLink) return
    await onDeleteLink(linkId)
    setLinks((prev) => prev.filter((l) => l.id !== linkId))
  }

  const visibilityOptions = [
    {
      value: 'public' as const,
      label: 'Anyone with link',
      icon: <Globe className="h-4 w-4" />,
    },
    {
      value: 'team' as const,
      label: 'Team members',
      icon: <Users className="h-4 w-4" />,
    },
    {
      value: 'private' as const,
      label: 'Only me',
      icon: <Lock className="h-4 w-4" />,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className={className}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share conversation</DialogTitle>
          <DialogDescription>
            Create a shareable link for "{conversationTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Create New Link */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Who can access</Label>
              <div className="grid grid-cols-3 gap-2">
                {visibilityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setVisibility(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors',
                      visibility === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted'
                    )}
                  >
                    {option.icon}
                    <span className="text-xs text-center">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Expire link</Label>
                <p className="text-xs text-muted-foreground">
                  Link will stop working after set time
                </p>
              </div>
              <Switch
                checked={enableExpiry}
                onCheckedChange={setEnableExpiry}
              />
            </div>

            {enableExpiry && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            )}

            <Button
              onClick={handleCreateLink}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? 'Creating...' : 'Create link'}
            </Button>
          </div>

          {/* Existing Links */}
          {links.length > 0 && (
            <div className="space-y-3">
              <Label>Existing links</Label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/50"
                  >
                    <div className="flex-shrink-0">
                      {link.visibility === 'public' ? (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      ) : link.visibility === 'team' ? (
                        <Users className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono truncate">{link.url}</p>
                      <p className="text-xs text-muted-foreground">
                        {link.accessCount ?? 0} views
                        {link.expiresAt &&
                          ` · Expires ${new Date(link.expiresAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopyLink(link)}
                      >
                        {copied === link.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// SHARE CARD - Compact share card for embedding
// =============================================================================

interface ShareCardProps {
  title: string
  description?: string
  imageUrl?: string
  url: string
  author?: {
    name: string
    avatar?: string
  }
  date?: Date
  className?: string
}

export function ShareCard({
  title,
  description,
  imageUrl,
  url,
  author,
  date,
  className,
}: ShareCardProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'border border-border rounded-xl overflow-hidden bg-card',
        className
      )}
    >
      {imageUrl && (
        <div className="aspect-[2/1] bg-muted">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          )}
        </div>

        {author && (
          <div className="flex items-center gap-2">
            {author.avatar ? (
              <img
                src={author.avatar || '/placeholder.svg'}
                alt={author.name}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium">{author.name[0]}</span>
              </div>
            )}
            <span className="text-sm">{author.name}</span>
            {date && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">
                  {date.toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm font-mono truncate">
            <Link className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="truncate">{url}</span>
          </div>
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// QR CODE SHARE - Share via QR code
// =============================================================================

interface QRCodeShareProps {
  url: string
  title?: string
  size?: number
  className?: string
}

export function QRCodeShare({
  url,
  title,
  size = 200,
  className,
}: QRCodeShareProps) {
  const [copied, setCopied] = React.useState(false)

  // Generate QR code URL using a public API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `qr-code-${title || 'share'}.png`
    link.click()
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 p-6 border border-border rounded-xl bg-card',
        className
      )}
    >
      <div className="bg-white p-4 rounded-lg">
        <img
          src={qrCodeUrl || '/placeholder.svg'}
          alt="QR Code"
          width={size}
          height={size}
          className="block"
        />
      </div>
      {title && <p className="text-sm font-medium text-center">{title}</p>}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? 'Copied' : 'Copy URL'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <QrCode className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// EMBED CODE - Generate embed code
// =============================================================================

interface EmbedCodeProps {
  url: string
  width?: number | string
  height?: number | string
  className?: string
}

export function EmbedCode({
  url,
  width = '100%',
  height = 600,
  className,
}: EmbedCodeProps) {
  const [copied, setCopied] = React.useState(false)

  const embedCode = `<iframe src="${url}" width="${width}" height="${height}" frameborder="0" allow="clipboard-write" style="border: 1px solid #e5e7eb; border-radius: 12px;"></iframe>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <Label>Embed code</Label>
      <div className="relative">
        <pre className="p-4 rounded-lg bg-muted text-xs font-mono overflow-x-auto">
          {embedCode}
        </pre>
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 mr-1.5" />
          ) : (
            <Copy className="h-3.5 w-3.5 mr-1.5" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  )
}

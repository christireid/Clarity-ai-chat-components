'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from '@clarity-chat/primitives'
import {
  Link as LinkIcon,
  Code,
  Download,
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
} from 'lucide-react'

export interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messageId: string
  messageContent: string
  shareUrl?: string
  onGenerateLink?: (messageId: string) => Promise<string>
  onGenerateEmbed?: (messageId: string) => Promise<string>
  onExport?: (messageId: string, format: 'txt' | 'md' | 'json') => void
}

/**
 * ShareDialog - Share message via link, embed, or export
 *
 * Features:
 * - Copy shareable link
 * - Generate embed code
 * - Export in multiple formats (txt, md, json)
 * - Social media sharing
 * - Email sharing
 * - Copy functionality with feedback
 *
 * @example
 * ```tsx
 * <ShareDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   messageId="msg-123"
 *   messageContent="Message to share"
 *   onGenerateLink={async (id) => {
 *     const link = await createShareLink(id)
 *     return link
 *   }}
 *   onExport={(id, format) => exportMessage(id, format)}
 * />
 * ```
 */
export function ShareDialog({
  open,
  onOpenChange,
  messageId,
  messageContent,
  shareUrl,
  onGenerateLink,
  onGenerateEmbed,
  onExport,
}: ShareDialogProps) {
  const [link, setLink] = React.useState(shareUrl || '')
  const [embedCode, setEmbedCode] = React.useState('')
  const [linkCopied, setLinkCopied] = React.useState(false)
  const [embedCopied, setEmbedCopied] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)

  // Generate link when dialog opens
  React.useEffect(() => {
    if (open && !link && onGenerateLink) {
      setIsGenerating(true)
      onGenerateLink(messageId)
        .then(setLink)
        .finally(() => setIsGenerating(false))
    }
  }, [open, messageId, link, onGenerateLink])

  // Generate embed code when tab is selected
  const handleGenerateEmbed = async () => {
    if (embedCode || !onGenerateEmbed) return
    setIsGenerating(true)
    try {
      const code = await onGenerateEmbed(messageId)
      setEmbedCode(code)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'link' | 'embed') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'link') {
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
      } else {
        setEmbedCopied(true)
        setTimeout(() => setEmbedCopied(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'linkedin' | 'email') => {
    const text = encodeURIComponent(messageContent.slice(0, 100) + '...')
    const url = encodeURIComponent(link)

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=Shared Message&body=${text}%0A%0A${url}`,
    }

    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Message</DialogTitle>
          <DialogDescription>
            Share this message via link, embed code, or export
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link" className="gap-2">
              <LinkIcon className="h-4 w-4" />
              Link
            </TabsTrigger>
            <TabsTrigger
              value="embed"
              className="gap-2"
              onClick={handleGenerateEmbed}
            >
              <Code className="h-4 w-4" />
              Embed
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Link Tab */}
          <TabsContent value="link" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Share Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={link}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
                  placeholder={isGenerating ? 'Generating link...' : 'No link available'}
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(link, 'link')}
                  disabled={!link || isGenerating}
                  className="gap-2"
                >
                  {linkCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Social Sharing */}
            {link && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Share on Social Media
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialShare('twitter')}
                    className="gap-2"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialShare('facebook')}
                    className="gap-2"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialShare('linkedin')}
                    className="gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialShare('email')}
                    className="gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Embed Tab */}
          <TabsContent value="embed" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Embed Code
              </label>
              <div className="relative">
                <pre className="p-3 bg-muted rounded-md text-xs font-mono overflow-x-auto max-h-[200px] overflow-y-auto">
                  {embedCode || (isGenerating ? 'Generating embed code...' : 'Click to generate embed code')}
                </pre>
                {embedCode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(embedCode, 'embed')}
                    className="absolute top-2 right-2 gap-2"
                  >
                    {embedCopied ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {embedCode && (
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="text-xs text-muted-foreground">
                  Paste this code into your HTML to embed the message
                </p>
              </div>
            )}
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Export Format
              </label>
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  onClick={() => onExport?.(messageId, 'txt')}
                  className="justify-start gap-2"
                >
                  <Download className="h-4 w-4" />
                  Plain Text (.txt)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onExport?.(messageId, 'md')}
                  className="justify-start gap-2"
                >
                  <Download className="h-4 w-4" />
                  Markdown (.md)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onExport?.(messageId, 'json')}
                  className="justify-start gap-2"
                >
                  <Download className="h-4 w-4" />
                  JSON (.json)
                </Button>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg border">
              <p className="text-xs text-muted-foreground">
                Message will be downloaded in the selected format
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

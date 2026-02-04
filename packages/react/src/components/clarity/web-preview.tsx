'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Globe,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  X,
  ArrowLeft,
  ArrowRight,
  Lock,
  Loader2,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'

type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'full'

interface WebPreviewProps {
  url?: string
  html?: string
  title?: string
  className?: string
  defaultViewport?: ViewportSize
  showToolbar?: boolean
  allowNavigation?: boolean
  onNavigate?: (url: string) => void
}

const viewportSizes: Record<ViewportSize, { width: string; label: string }> = {
  mobile: { width: '375px', label: 'Mobile' },
  tablet: { width: '768px', label: 'Tablet' },
  desktop: { width: '1024px', label: 'Desktop' },
  full: { width: '100%', label: 'Full Width' },
}

export function WebPreview({
  url,
  html,
  title = 'Preview',
  className,
  defaultViewport = 'full',
  showToolbar = true,
  allowNavigation = true,
  onNavigate,
}: WebPreviewProps) {
  const [viewport, setViewport] = React.useState<ViewportSize>(defaultViewport)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [currentUrl, setCurrentUrl] = React.useState(url || '')
  const [urlInput, setUrlInput] = React.useState(url || '')
  const [copied, setCopied] = React.useState(false)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true)
      if (html) {
        iframeRef.current.srcdoc = html
      } else {
        iframeRef.current.src = currentUrl
      }
    }
  }

  const handleNavigate = (newUrl: string) => {
    setIsLoading(true)
    setCurrentUrl(newUrl)
    setUrlInput(newUrl)
    onNavigate?.(newUrl)
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let processedUrl = urlInput
    if (!processedUrl.startsWith('http')) {
      processedUrl = `https://${processedUrl}`
    }
    handleNavigate(processedUrl)
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openExternal = () => {
    if (currentUrl) {
      window.open(currentUrl, '_blank')
    }
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden flex flex-col',
        isFullscreen && 'fixed inset-4 z-50',
        className
      )}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border">
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>

          {/* Navigation */}
          {allowNavigation && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => iframeRef.current?.contentWindow?.history.back()}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  iframeRef.current?.contentWindow?.history.forward()
                }
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleRefresh}
              >
                <RefreshCw
                  className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')}
                />
              </Button>
            </div>
          )}

          {/* URL Bar */}
          <form onSubmit={handleUrlSubmit} className="flex-1 mx-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-border">
              {currentUrl?.startsWith('https') ? (
                <Lock className="w-3 h-3 text-green-500 shrink-0" />
              ) : (
                <Globe className="w-3 h-3 text-muted-foreground shrink-0" />
              )}
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter URL..."
                className="flex-1 bg-transparent text-xs outline-none"
                disabled={!allowNavigation}
              />
              {isLoading && (
                <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
              )}
            </div>
          </form>

          {/* Viewport Controls */}
          <div className="flex items-center gap-1 border-l border-border pl-2">
            <Button
              variant={viewport === 'mobile' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewport('mobile')}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={viewport === 'tablet' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewport('tablet')}
            >
              <Tablet className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={viewport === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewport('desktop')}
            >
              <Monitor className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 border-l border-border pl-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyUrl}>
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openExternal}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Preview Frame */}
      <div className="flex-1 bg-[#e5e5e5] dark:bg-[#1a1a1a] flex items-start justify-center p-4 overflow-auto min-h-[400px]">
        <div
          className="bg-white dark:bg-background rounded-lg shadow-lg overflow-hidden transition-all duration-300"
          style={{
            width: viewportSizes[viewport].width,
            maxWidth: '100%',
            height: viewport === 'full' ? '100%' : 'auto',
          }}
        >
          <iframe
            ref={iframeRef}
            src={!html ? currentUrl : undefined}
            srcDoc={html}
            title={title}
            className="w-full h-full min-h-[500px] border-0"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  )
}

// Link Preview Component
interface LinkPreviewProps {
  url: string
  title?: string
  description?: string
  image?: string
  favicon?: string
  siteName?: string
  className?: string
}

export function LinkPreview({
  url,
  title,
  description,
  image,
  favicon,
  siteName,
  className,
}: LinkPreviewProps) {
  const domain = React.useMemo(() => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }, [url])

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'block rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors overflow-hidden',
        className
      )}
    >
      {image && (
        <div className="aspect-video bg-muted overflow-hidden">
          <img
            src={image || '/placeholder.svg'}
            alt={title || 'Link preview'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          {favicon ? (
            <img
              src={favicon || '/placeholder.svg'}
              alt=""
              className="w-4 h-4 rounded"
            />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          <span>{siteName || domain}</span>
        </div>
        {title && (
          <h4 className="font-medium text-sm line-clamp-2 mb-1">{title}</h4>
        )}
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </a>
  )
}

// Browser Chrome Component
interface BrowserChromeProps {
  url?: string
  title?: string
  children: React.ReactNode
  className?: string
}

export function BrowserChrome({
  url = 'https://example.com',
  title,
  children,
  className,
}: BrowserChromeProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border overflow-hidden bg-card',
        className
      )}
    >
      {/* Chrome Header */}
      <div className="bg-muted/50 border-b border-border">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-2 pt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-t-md bg-card border border-b-0 border-border max-w-[200px]">
            <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs truncate">{title || url}</span>
            <X className="w-3 h-3 text-muted-foreground shrink-0 cursor-pointer hover:text-foreground" />
          </div>
        </div>

        {/* URL Bar */}
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border">
            <Lock className="w-3 h-3 text-green-500" />
            <span className="text-xs text-muted-foreground truncate">
              {url}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-background">{children}</div>
    </div>
  )
}

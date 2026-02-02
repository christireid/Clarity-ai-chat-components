'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  X,
  Maximize2,
  Minimize2,
  Download,
  Copy,
  Check,
  Code,
  Eye,
  FileText,
  ImageIcon,
  MoreHorizontal,
  Share2,
  Pencil,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import type { Artifact as ArtifactType } from './types/ai-types'
import { CodeBlock } from './code-block'

interface ArtifactPanelProps {
  artifact: ArtifactType
  onClose?: () => void
  onUpdate?: (content: string) => void
  onRegenerate?: () => void
  className?: string
}

const artifactIcons = {
  code: Code,
  document: FileText,
  image: ImageIcon,
  diagram: Sparkles,
  canvas: Pencil,
}

export function ArtifactPanel({
  artifact,
  onClose,
  onUpdate,
  onRegenerate,
  className,
}: ArtifactPanelProps) {
  // Defensive check for undefined artifact
  const safeArtifact = artifact || {
    id: '',
    type: 'code' as const,
    title: 'Untitled',
    content: '',
    language: 'text',
  }

  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<string>('preview')
  const [isEditing, setIsEditing] = React.useState(false)
  const [editContent, setEditContent] = React.useState(safeArtifact.content)

  const Icon = artifactIcons[safeArtifact.type] || Code

  const handleCopy = async () => {
    await navigator.clipboard.writeText(safeArtifact.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    onUpdate?.(editContent)
    setIsEditing(false)
  }

  const handleDownload = () => {
    const blob = new Blob([safeArtifact.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download =
      safeArtifact.title +
      (safeArtifact.language ? `.${safeArtifact.language}` : '.txt')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const panel = (
    <div
      className={cn(
        'flex flex-col bg-card border border-border rounded-lg overflow-hidden',
        isFullscreen ? 'fixed inset-4 z-50' : 'h-full',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-secondary">
            <Icon className="h-4 w-4 text-ai-user" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{safeArtifact.title}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="capitalize">{safeArtifact.type}</span>
              {safeArtifact.language && (
                <>
                  <span>·</span>
                  <span>{safeArtifact.language}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-ai-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              {onRegenerate && (
                <DropdownMenuItem onClick={onRegenerate}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {safeArtifact.type === 'code' ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-10 px-4 shrink-0">
              <TabsTrigger value="preview" className="gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-1.5">
                <Code className="h-3.5 w-3.5" />
                Code
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="flex-1 m-0 overflow-auto">
              <div className="h-full bg-white">
                <iframe
                  srcDoc={generatePreviewHtml(
                    safeArtifact.content,
                    safeArtifact.language
                  )}
                  className="w-full h-full border-0"
                  title="Preview"
                  sandbox="allow-scripts"
                />
              </div>
            </TabsContent>
            <TabsContent value="code" className="flex-1 m-0 overflow-auto">
              {isEditing ? (
                <div className="h-full flex flex-col">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 w-full p-4 font-mono text-sm bg-code-bg resize-none focus:outline-none"
                  />
                  <div className="flex items-center gap-2 p-2 border-t border-border bg-secondary/30">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <CodeBlock
                  code={safeArtifact.content}
                  language={safeArtifact.language || 'text'}
                  showLineNumbers
                  className="h-full border-0 rounded-none"
                />
              )}
            </TabsContent>
          </Tabs>
        ) : safeArtifact.type === 'document' ? (
          <div className="h-full overflow-auto p-6 prose-ai">
            {isEditing ? (
              <div className="h-full flex flex-col">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 w-full p-4 bg-secondary/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: safeArtifact.content }} />
            )}
          </div>
        ) : safeArtifact.type === 'image' ? (
          <div className="h-full flex items-center justify-center p-6 bg-checkered">
            <img
              src={safeArtifact.content || '/placeholder.svg'}
              alt={safeArtifact.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <div className="h-full overflow-auto p-6">
            <pre className="whitespace-pre-wrap">{safeArtifact.content}</pre>
          </div>
        )}
      </div>
    </div>
  )

  if (isFullscreen) {
    return (
      <>
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsFullscreen(false)}
        />
        {panel}
      </>
    )
  }

  return panel
}

function generatePreviewHtml(code: string, language?: string): string {
  if (language === 'html' || code.trim().startsWith('<')) {
    return code
  }

  if (language === 'jsx' || language === 'tsx' || language === 'react') {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body { font-family: system-ui, sans-serif; padding: 20px; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${code}
            ReactDOM.createRoot(document.getElementById('root')).render(<App />);
          </script>
        </body>
      </html>
    `
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>body { font-family: monospace; padding: 20px; white-space: pre-wrap; }</style>
      </head>
      <body>${code}</body>
    </html>
  `
}

// Artifact card for displaying in lists
export function ArtifactCard({
  artifact,
  onClick,
  className,
}: {
  artifact: ArtifactType
  onClick?: () => void
  className?: string
}) {
  const Icon = artifactIcons[artifact.type] || Code

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left group',
        className
      )}
    >
      <div className="p-2 rounded-lg bg-secondary group-hover:bg-ai-user/10 transition-colors">
        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-ai-user transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{artifact.title}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="capitalize">{artifact.type}</span>
          {artifact.language && (
            <>
              <span>·</span>
              <span>{artifact.language}</span>
            </>
          )}
          <span>·</span>
          <span>{new Date(artifact.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}

// Artifact list
export function ArtifactList({
  artifacts,
  onSelect,
  selectedId,
  className,
}: {
  artifacts: ArtifactType[]
  onSelect?: (artifact: ArtifactType) => void
  selectedId?: string
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {artifacts.map((artifact) => (
        <ArtifactCard
          key={artifact.id}
          artifact={artifact}
          onClick={() => onSelect?.(artifact)}
          className={cn(
            selectedId === artifact.id && 'border-ai-user bg-ai-user/5'
          )}
        />
      ))}
    </div>
  )
}

// v0-style artifact creation indicator
export function ArtifactCreating({
  title,
  type = 'code',
  progress = 0,
  className,
}: {
  title: string
  type?: ArtifactType['type']
  progress?: number
  className?: string
}) {
  const Icon = artifactIcons[type] || Code

  return (
    <div
      className={cn('rounded-lg border border-border bg-card p-4', className)}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-ai-user/10">
          <Icon className="h-5 w-5 text-ai-user animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">Generating...</p>
        </div>
        <Badge variant="outline" className="text-xs">
          v1
        </Badge>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full bg-ai-user transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// Alias for backward compatibility
export const Artifact = ArtifactPanel

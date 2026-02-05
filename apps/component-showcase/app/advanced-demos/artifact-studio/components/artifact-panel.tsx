'use client'

import { useState } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  X,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Check,
  Clock,
  ChevronDown,
  Blocks,
  Loader2,
  FileCode,
  FileText,
  Globe,
  Image,
  GitBranch,
  Table2,
  Braces,
} from 'lucide-react'
import type { Artifact, ArtifactType } from '../../_shared'
import { formatTimestamp } from '../../_shared'
import { ArtifactRenderer } from './artifact-renderer'

interface ArtifactPanelProps {
  artifacts: Artifact[]
  activeArtifactId: string | null
  onActiveArtifactChange: (id: string) => void
  onClose: () => void
  isGenerating?: boolean
  className?: string
}

const typeIcons: Record<ArtifactType, React.ReactNode> = {
  code: <FileCode className="h-3.5 w-3.5" />,
  document: <FileText className="h-3.5 w-3.5" />,
  html: <Globe className="h-3.5 w-3.5" />,
  svg: <Image className="h-3.5 w-3.5" />,
  mermaid: <GitBranch className="h-3.5 w-3.5" />,
  table: <Table2 className="h-3.5 w-3.5" />,
  json: <Braces className="h-3.5 w-3.5" />,
}

const typeLabels: Record<ArtifactType, string> = {
  code: 'Code',
  document: 'Document',
  html: 'HTML',
  svg: 'SVG',
  mermaid: 'Diagram',
  table: 'Table',
  json: 'JSON',
}

const typeColors: Record<ArtifactType, string> = {
  code: 'text-blue-400',
  document: 'text-amber-400',
  html: 'text-red-400',
  svg: 'text-emerald-400',
  mermaid: 'text-violet-400',
  table: 'text-cyan-400',
  json: 'text-yellow-300',
}

export function ArtifactPanel({
  artifacts,
  activeArtifactId,
  onActiveArtifactChange,
  onClose,
  isGenerating,
  className,
}: ArtifactPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showVersionDropdown, setShowVersionDropdown] = useState(false)
  const [selectedVersionIdx, setSelectedVersionIdx] = useState<
    Record<string, number>
  >({})

  const activeArtifact = artifacts.find((a) => a.id === activeArtifactId)
  const currentVersionIdx = activeArtifact
    ? selectedVersionIdx[activeArtifact.id] ?? activeArtifact.versions.length - 1
    : 0
  const currentVersion = activeArtifact?.versions[currentVersionIdx]
  const displayContent =
    currentVersion?.content ?? activeArtifact?.content ?? ''

  const handleCopy = () => {
    navigator.clipboard?.writeText(displayContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!activeArtifact) return
    const ext =
      activeArtifact.type === 'code'
        ? activeArtifact.language || 'txt'
        : activeArtifact.type === 'document'
          ? 'md'
          : activeArtifact.type === 'mermaid'
            ? 'mmd'
            : activeArtifact.type
    const blob = new Blob([displayContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeArtifact.title.replace(/\s+/g, '-').toLowerCase()}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Empty state
  if (artifacts.length === 0 && !isGenerating) {
    return (
      <div
        className={cn(
          'flex flex-col h-full border-l bg-card/30 backdrop-blur-sm',
          isFullscreen && 'fixed inset-0 z-50 border-l-0',
          className
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Blocks className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Artifacts</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Blocks className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="font-medium text-muted-foreground mb-1">
              No Artifacts Yet
            </h3>
            <p className="text-xs text-muted-foreground/60 max-w-[200px]">
              Ask me to create code, documents, diagrams, or other content to
              see artifacts here.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full border-l bg-card/30 backdrop-blur-sm',
        isFullscreen && 'fixed inset-0 z-50 border-l-0 bg-background',
        className
      )}
    >
      {/* Header with tabs */}
      <div className="border-b shrink-0">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Blocks className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Artifacts</span>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {artifacts.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Artifact tabs */}
        {artifacts.length > 0 && (
          <div className="flex gap-0 px-2 overflow-x-auto scrollbar-none">
            {artifacts.map((artifact) => (
              <button
                key={artifact.id}
                onClick={() => {
                  onActiveArtifactChange(artifact.id)
                  setShowVersionDropdown(false)
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all shrink-0',
                  activeArtifactId === artifact.id
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                )}
              >
                <span className={typeColors[artifact.type]}>
                  {typeIcons[artifact.type]}
                </span>
                <span className="max-w-[120px] truncate">
                  {artifact.title}
                </span>
                {artifact.versions.length > 1 && (
                  <span className="text-[9px] bg-muted px-1 rounded">
                    v{artifact.versions.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Generating animation */}
      {isGenerating && !activeArtifact && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 animate-pulse" />
              <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 animate-pulse delay-100" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
              </div>
            </div>
            <h3 className="font-medium text-sm mb-1">Generating Artifact...</h3>
            <p className="text-xs text-muted-foreground animate-pulse">
              Creating your content
            </p>
          </div>
        </div>
      )}

      {/* Active artifact content */}
      {activeArtifact && (
        <>
          {/* Artifact info bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/20 shrink-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex items-center gap-1 text-xs',
                  typeColors[activeArtifact.type]
                )}
              >
                {typeIcons[activeArtifact.type]}
                {typeLabels[activeArtifact.type]}
              </span>
              {activeArtifact.language && (
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                  {activeArtifact.language}
                </span>
              )}
            </div>

            {/* Version selector */}
            {activeArtifact.versions.length > 1 && (
              <div className="relative">
                <button
                  onClick={() =>
                    setShowVersionDropdown(!showVersionDropdown)
                  }
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted transition-colors text-xs text-muted-foreground"
                >
                  <Clock className="h-3 w-3" />
                  Version {currentVersionIdx + 1} of{' '}
                  {activeArtifact.versions.length}
                  <ChevronDown
                    className={cn(
                      'h-3 w-3 transition-transform',
                      showVersionDropdown && 'rotate-180'
                    )}
                  />
                </button>
                {showVersionDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border bg-card shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      Version History
                    </div>
                    {activeArtifact.versions.map((version, idx) => (
                      <button
                        key={version.id}
                        onClick={() => {
                          setSelectedVersionIdx((prev) => ({
                            ...prev,
                            [activeArtifact.id]: idx,
                          }))
                          setShowVersionDropdown(false)
                        }}
                        className={cn(
                          'flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-muted transition-colors',
                          idx === currentVersionIdx && 'bg-muted'
                        )}
                      >
                        <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">
                            Version {idx + 1}
                            {version.label && (
                              <span className="text-muted-foreground font-normal">
                                {' '}
                                - {version.label}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {formatTimestamp(version.timestamp)}
                          </div>
                        </div>
                        {idx === currentVersionIdx && (
                          <Check className="h-3 w-3 text-primary shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-4">
            {isGenerating ? (
              <div className="space-y-3">
                {/* Shimmer effect while generating */}
                <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-2/3" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-4/5" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-full" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-5/6" />
              </div>
            ) : (
              <ArtifactRenderer
                content={displayContent}
                type={activeArtifact.type}
                language={activeArtifact.language}
              />
            )}
          </div>

          {/* Actions bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t bg-muted/10 shrink-0">
            <div className="text-[10px] text-muted-foreground">
              {displayContent.split('\n').length} lines &middot;{' '}
              {displayContent.length.toLocaleString()} chars
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs hover:bg-muted transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy All
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs hover:bg-muted transition-colors"
              >
                <Download className="h-3 w-3" />
                Download
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

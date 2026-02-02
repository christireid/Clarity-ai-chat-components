'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  GitCommit,
  GitBranch,
  GitMerge,
  GitPullRequest,
  Plus,
  Minus,
  FileText,
  ChevronDown,
  ChevronRight,
  Clock,
  User,
  Copy,
  Check,
  ExternalLink,
  MoreHorizontal,
  RefreshCw,
  Tag,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'

// Types
export interface GitAuthor {
  name: string
  email?: string
  avatar?: string
}

export interface GitFileChange {
  path: string
  status: 'added' | 'modified' | 'deleted' | 'renamed'
  additions?: number
  deletions?: number
  oldPath?: string
}

export interface GitCommitData {
  sha: string
  message: string
  author: GitAuthor
  date: Date
  files?: GitFileChange[]
  branch?: string
  tags?: string[]
}

// Helper functions
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

function shortenSha(sha: string): string {
  return sha.slice(0, 7)
}

// Commit card component
interface CommitCardProps {
  commit: GitCommitData
  showFiles?: boolean
  onViewFiles?: () => void
  onCopySha?: () => void
  onOpenExternal?: () => void
  className?: string
}

export function CommitCard({
  commit,
  showFiles = false,
  onViewFiles,
  onCopySha,
  onOpenExternal,
  className,
}: CommitCardProps) {
  const [copied, setCopied] = React.useState(false)
  const [filesOpen, setFilesOpen] = React.useState(showFiles)

  const handleCopy = () => {
    navigator.clipboard.writeText(commit.sha)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopySha?.()
  }

  const messageLines = commit.message.split('\n')
  const title = messageLines[0]
  const description = messageLines.slice(1).join('\n').trim()

  return (
    <div className={cn('border rounded-lg bg-card overflow-hidden', className)}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="mt-0.5">
              <GitCommit className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm leading-tight">{title}</p>
              {description && (
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                  {description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 font-mono text-xs bg-transparent"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3 w-3 mr-1" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  {shortenSha(commit.sha)}
                </Button>
                {commit.branch && (
                  <Badge variant="secondary" className="h-6">
                    <GitBranch className="h-3 w-3 mr-1" />
                    {commit.branch}
                  </Badge>
                )}
                {commit.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="h-6">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy SHA
              </DropdownMenuItem>
              {onOpenExternal && (
                <DropdownMenuItem onClick={onOpenExternal}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on GitHub
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={commit.author.avatar || '/placeholder.svg'} />
              <AvatarFallback className="text-xs">
                {commit.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{commit.author.name}</span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatRelativeTime(commit.date)}
          </span>
        </div>
      </div>

      {commit.files && commit.files.length > 0 && (
        <Collapsible open={filesOpen} onOpenChange={setFilesOpen}>
          <CollapsibleTrigger asChild>
            <div className="border-t px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
              <span className="text-sm text-muted-foreground">
                {commit.files.length} file{commit.files.length > 1 ? 's' : ''}{' '}
                changed
              </span>
              {filesOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t divide-y">
              {commit.files.map((file, index) => (
                <FileChangeItem key={index} file={file} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

// File change item
function FileChangeItem({ file }: { file: GitFileChange }) {
  const statusColors = {
    added: 'text-emerald-500',
    modified: 'text-amber-500',
    deleted: 'text-red-500',
    renamed: 'text-blue-500',
  }

  const statusIcons = {
    added: <Plus className="h-3.5 w-3.5" />,
    modified: <FileText className="h-3.5 w-3.5" />,
    deleted: <Minus className="h-3.5 w-3.5" />,
    renamed: <RefreshCw className="h-3.5 w-3.5" />,
  }

  return (
    <div className="px-4 py-2 flex items-center justify-between gap-2 text-sm">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className={cn('shrink-0', statusColors[file.status])}>
          {statusIcons[file.status]}
        </span>
        <span className="font-mono text-xs truncate">
          {file.oldPath ? (
            <>
              <span className="text-muted-foreground">{file.oldPath}</span>
              <span className="mx-1">→</span>
              {file.path}
            </>
          ) : (
            file.path
          )}
        </span>
      </div>
      {(file.additions !== undefined || file.deletions !== undefined) && (
        <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
          {file.additions !== undefined && file.additions > 0 && (
            <span className="text-emerald-500">+{file.additions}</span>
          )}
          {file.deletions !== undefined && file.deletions > 0 && (
            <span className="text-red-500">-{file.deletions}</span>
          )}
        </div>
      )}
    </div>
  )
}

// Branch selector
interface BranchSelectorProps {
  branches: string[]
  currentBranch: string
  onBranchChange: (branch: string) => void
  className?: string
}

export function BranchSelector({
  branches,
  currentBranch,
  onBranchChange,
  className,
}: BranchSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn('justify-start', className)}>
          <GitBranch className="h-4 w-4 mr-2" />
          {currentBranch}
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {branches.map((branch) => (
          <DropdownMenuItem
            key={branch}
            onClick={() => onBranchChange(branch)}
            className={cn(branch === currentBranch && 'bg-muted')}
          >
            <GitBranch className="h-4 w-4 mr-2" />
            {branch}
            {branch === currentBranch && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Pull request card
export interface PullRequestData {
  number: number
  title: string
  description?: string
  author: GitAuthor
  sourceBranch: string
  targetBranch: string
  status: 'open' | 'merged' | 'closed' | 'draft'
  createdAt: Date
  updatedAt?: Date
  commits?: number
  additions?: number
  deletions?: number
  reviews?: number
}

interface PullRequestCardProps {
  pr: PullRequestData
  onOpenExternal?: () => void
  className?: string
}

export function PullRequestCard({
  pr,
  onOpenExternal,
  className,
}: PullRequestCardProps) {
  const statusStyles = {
    open: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    merged: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    closed: 'bg-red-500/10 text-red-500 border-red-500/20',
    draft: 'bg-muted text-muted-foreground border-border',
  }

  const statusIcons = {
    open: <GitPullRequest className="h-4 w-4" />,
    merged: <GitMerge className="h-4 w-4" />,
    closed: <GitPullRequest className="h-4 w-4" />,
    draft: <GitPullRequest className="h-4 w-4" />,
  }

  return (
    <div className={cn('border rounded-lg bg-card p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <Badge
            variant="outline"
            className={cn('shrink-0 capitalize', statusStyles[pr.status])}
          >
            {statusIcons[pr.status]}
            <span className="ml-1">{pr.status}</span>
          </Badge>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm">
              {pr.title}
              <span className="text-muted-foreground ml-2">#{pr.number}</span>
            </p>
            {pr.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {pr.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                {pr.sourceBranch} → {pr.targetBranch}
              </span>
              {pr.commits && (
                <span className="flex items-center gap-1">
                  <GitCommit className="h-3 w-3" />
                  {pr.commits} commit{pr.commits > 1 ? 's' : ''}
                </span>
              )}
              {(pr.additions !== undefined || pr.deletions !== undefined) && (
                <span className="font-mono">
                  <span className="text-emerald-500">+{pr.additions || 0}</span>
                  {' / '}
                  <span className="text-red-500">-{pr.deletions || 0}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        {onOpenExternal && (
          <Button variant="ghost" size="sm" onClick={onOpenExternal}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={pr.author.avatar || '/placeholder.svg'} />
            <AvatarFallback className="text-xs">
              {pr.author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{pr.author.name}</span>
        </div>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatRelativeTime(pr.createdAt)}
        </span>
      </div>
    </div>
  )
}

// Commit history timeline
interface CommitHistoryProps {
  commits: GitCommitData[]
  className?: string
}

export function CommitHistory({ commits, className }: CommitHistoryProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />

      <div className="space-y-4">
        {commits.map((commit, index) => (
          <div key={commit.sha} className="relative flex gap-4">
            {/* Timeline dot */}
            <div className="relative z-10 mt-1.5">
              <div className="h-6 w-6 rounded-full bg-background border-2 border-border flex items-center justify-center">
                <GitCommit className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>

            {/* Commit content */}
            <div className="flex-1 pb-4">
              <CommitCard commit={commit} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
